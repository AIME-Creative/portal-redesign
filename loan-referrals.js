/* ============================================================
   AMP — Loan referrals opt-in (member app, Elite + VIP)
   ------------------------------------------------------------
   AIME emails loan referrals (sent from the admin Loan referrals
   page) to members who opted in for that referral type and state —
   VIP first, Elite after a short delay. Premium doesn't get them.
   1. One-time prompt on the dashboard: Join (pick referral types
      and states) or No thanks. Waits until no walkthrough, other
      window, or install card is showing. Closing it without
      choosing asks again next visit.
   2. Settings → Notifications & app → Loan referrals: change it any
      time (join, edit types / states, or leave).
   Saved in localStorage amp-referrals-v1 { status: joined|declined,
   types, states, at }. States start from the profile's licenses.
   Uses app.js globals: memberTier, userType, openModal, closeModals,
   showToast, navigate. Loaded after pwa.js (its settings tab).
   ============================================================ */
(function () {
  if (typeof userType === 'undefined' || userType !== 'member') return;
  const KEY = 'amp-referrals-v1';
  const $ = (id) => document.getElementById(id);
  const eligible = memberTier === 'VIP' || memberTier === 'Elite';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const write = (o) => { try { localStorage.setItem(KEY, JSON.stringify(Object.assign({}, o, { at: new Date().toISOString() }))); } catch (e) { /* private mode */ } };

  const STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
    'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
  const TYPES = [['Broker', 'Broker referrals', 'Borrowers and loans that need a broker'], ['Processor', 'Processor referrals', 'Brokers looking for a loan processor']];
  // The states on the member's profile (Settings → Profile → State licenses).
  function licensed() {
    const inp = [...document.querySelectorAll('#tab-profile .field')].find((f) => /State licenses/.test(f.textContent));
    const v = inp && inp.querySelector('input') ? inp.querySelector('input').value : '';
    return v.split(/[,\s]+/).map((s) => s.trim().toUpperCase()).filter((s) => STATES.includes(s));
  }
  const timing = () => memberTier === 'VIP' ? 'As a VIP member, you get each referral first.' : 'VIP members get each referral first; Elite members get it shortly after.';

  /* ---------- the join / edit window ---------- */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="modal-referrals"><div class="modal" style="max-width:540px">
      <div class="modal-head"><div><h2 id="lr-title">Get loan referrals from AIME?</h2><p id="lr-sub"></p></div>
        <button class="modal-close" data-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>
      <div class="modal-body" id="lr-body"></div>
      <div class="modal-foot" id="lr-foot"></div>
    </div></div>`);

  let draft = null, mode = 'prompt';
  function open(m) {
    mode = m;
    const s = read();
    draft = { types: s.types && s.types.length ? s.types.slice() : ['Broker'], states: s.states && s.states.length ? s.states.slice() : licensed() };
    $('lr-title').textContent = mode === 'prompt' ? 'Get loan referrals from AIME?' : 'Loan referrals';
    $('lr-sub').textContent = mode === 'prompt'
      ? 'AIME sends loan referrals by email to members who opt in. Pick what you want — you can change it any time in Settings.'
      : 'Choose the referrals you get by email.';
    render();
    openModal('referrals');
  }
  function render() {
    const chip = (st) => `<button type="button" class="lr-state on" data-lr-state="${st}" aria-label="Remove ${st}">${st} <span aria-hidden="true">✕</span></button>`;
    $('lr-body').innerHTML = `
      <div class="lr-note">${timing()} Each referral includes the person's contact details so you can reach out directly.</div>
      <div class="form-section-label">Referral types</div>
      <div class="lr-types">${TYPES.map(([k, l, d]) => `<label class="lr-type"><input type="checkbox" data-lr-type="${k}" ${draft.types.includes(k) ? 'checked' : ''}><span><strong>${l}</strong><span>${d}</span></span></label>`).join('')}</div>
      <div class="form-section-label">States</div>
      <p class="lr-help">Starts with the states on your profile.</p>
      <div class="lr-states">${draft.states.map(chip).join('') || '<span class="lr-help">No states yet — add at least one.</span>'}</div>
      <select class="select" id="lr-add" style="margin-top:10px;max-width:220px"><option value="">+ Add a state</option>${STATES.filter((s) => !draft.states.includes(s)).map((s) => `<option>${s}</option>`).join('')}</select>`;
    const joined = read().status === 'joined';
    $('lr-foot').innerHTML = mode === 'prompt'
      ? '<button class="btn btn-outline" data-lr="decline">No thanks</button><button class="btn btn-primary" data-lr="join">Join referrals</button>'
      : `${joined ? '<button class="link-muted" data-lr="leave" style="margin-right:auto">Stop getting referrals</button>' : ''}<button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-primary" data-lr="join">${joined ? 'Save' : 'Join referrals'}</button>`;
  }
  function join() {
    if (!draft.types.length) { showToast('Pick at least one referral type.'); return; }
    if (!draft.states.length) { showToast('Add at least one state.'); return; }
    const was = read().status === 'joined';
    write({ status: 'joined', types: draft.types, states: draft.states });
    closeModals(); renderSettings();
    showToast(was ? 'Referral preferences saved.' : `You're in! Referrals for ${draft.states.join(', ')} will come to your email.`);
  }
  function decline() {
    write({ status: 'declined', types: draft.types, states: draft.states });
    closeModals(); renderSettings();
    showToast('No problem — you can join any time in Settings → Notifications & app.');
  }
  function leave() {
    write(Object.assign(read(), { status: 'declined' }));
    closeModals(); renderSettings();
    showToast("You won't get loan referrals. Join again any time.");
  }

  /* ---------- Settings → Notifications & app → Loan referrals ---------- */
  function addSettings() {
    const notif = $('tab-notifications'); if (!notif || $('lr-settings')) return;
    notif.insertAdjacentHTML('afterend', '<div class="tab-panel" id="lr-settings" style="display:none;margin-top:16px"></div>');
    const orig = window.setTab;
    window.setTab = function (tab) { orig(tab); $('lr-settings').style.display = tab === 'notifications' ? 'block' : 'none'; if (tab === 'notifications') renderSettings(); };
  }
  function renderSettings() {
    const box = $('lr-settings'); if (!box) return;
    const s = read(), joined = s.status === 'joined';
    let inner;
    if (!eligible) {
      inner = `<p class="pwa-sub" style="margin-bottom:12px"><span class="pwa-pill">Elite &amp; VIP</span> AIME emails loan referrals to Elite and VIP members who opt in — VIP members get them first.</p>
        <button class="btn btn-outline btn-sm" data-nav="settings" data-tab="billing">See membership options</button>`;
    } else if (joined) {
      inner = `<p class="pwa-sub" style="margin-bottom:10px"><span class="pwa-pill on">Joined</span> ${timing()}</p>
        <div class="lr-summary"><div><span class="k">Types</span>${s.types.join(', ')}</div><div><span class="k">States</span>${s.states.join(', ')}</div></div>
        <button class="btn btn-outline btn-sm" data-lr="edit" style="margin-top:12px">Change preferences</button>`;
    } else {
      inner = `<p class="pwa-sub" style="margin-bottom:12px"><span class="pwa-pill">${s.status === 'declined' ? 'Not joined' : 'Off'}</span> Get loan referrals by email for the states and referral types you choose. ${timing()}</p>
        <button class="btn btn-primary btn-sm" data-lr="edit">Join loan referrals</button>`;
    }
    box.innerHTML = `<div class="card card-pad" style="max-width:560px"><div class="form-section-label" style="margin-top:0">Loan referrals</div>${inner}</div>`;
  }

  /* ---------- one-time prompt ---------- */
  function busy() {
    return document.body.classList.contains('wt-open') || document.querySelector('.modal-overlay.open, .pwa-banner, .auth-overlay.open') ||
      !document.getElementById('view-dashboard')?.classList.contains('active');
  }
  function maybePrompt(tries) {
    if (!eligible || read().status) return;
    if (busy()) { if (tries < 60) setTimeout(() => maybePrompt(tries + 1), 2000); return; }
    open('prompt');
  }
  setTimeout(() => maybePrompt(0), 3500);

  /* ---------- wiring ---------- */
  document.addEventListener('click', (e) => {
    const st = e.target.closest('[data-lr-state]');
    if (st) { e.preventDefault(); draft.states = draft.states.filter((x) => x !== st.dataset.lrState); render(); return; }
    const b = e.target.closest('[data-lr]'); if (!b) return;
    e.preventDefault();
    ({ join, decline, leave, edit: () => open('edit') })[b.dataset.lr]();
  });
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset && t.dataset.lrType) { draft.types = TYPES.map((x) => x[0]).filter((k) => k === t.dataset.lrType ? t.checked : draft.types.includes(k)); return; }
    if (t.id === 'lr-add' && t.value) { draft.states = [...draft.states, t.value].sort(); render(); }
  });

  addSettings(); renderSettings();
  window.AmpReferrals = { open, read, reset() { localStorage.removeItem(KEY); renderSettings(); } };
})();
