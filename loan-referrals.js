/* ============================================================
   AMP — Loan referrals opt-in (member app, Elite + VIP)
   ------------------------------------------------------------
   AIME emails loan referrals (sent from the admin Loan referrals
   page) to opted-in members — VIP first, Elite after a short delay.
   Premium doesn't get them. A simple opt in / opt out:
   - Referral type comes from the profile's Role type: Processor →
     processor referrals; every other role → broker referrals.
   - States are the profile's State licenses.
   1. One-time prompt on the dashboard: Join referrals or No thanks.
      Waits until no walkthrough, other window, or install card is
      showing. Closing it without choosing asks again next visit.
   2. Settings → Notifications & app → Subscriptions → Loan referrals:
      opt in or out any time.
   Saved in localStorage amp-referrals-v1 { status: joined|declined, at }.
   The same Subscriptions card holds the free Scotsman Guide
   subscription (every member tier; on unless the member opts out —
   it's ticked by default at sign-up). localStorage amp-scotsman-v1
   { status: in|out, at }. Production: the profile's Scotsman Guide
   field, synced to GoHighLevel as Opt-in / Opt-out with the date.
   Uses app.js globals: memberTier, userType, openModal, closeModals,
   showToast, navigate, setTab. Loaded after pwa.js (its settings tab).
   ============================================================ */
(function () {
  const KEY = 'amp-referrals-v1';
  // Prototype helper (any view): forget the choice so the one-time prompt shows again.
  window.AmpReferrals = { reset() { try { localStorage.removeItem(KEY); } catch (e) { /* private mode */ } } };
  if (typeof userType === 'undefined' || userType !== 'member') return;
  const $ = (id) => document.getElementById(id);
  const eligible = memberTier === 'VIP' || memberTier === 'Elite';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const write = (status) => { try { localStorage.setItem(KEY, JSON.stringify({ status, at: new Date().toISOString() })); } catch (e) { /* private mode */ } };
  const SG_KEY = 'amp-scotsman-v1';
  const sgIn = () => { try { return (JSON.parse(localStorage.getItem(SG_KEY)) || {}).status !== 'out'; } catch (e) { return true; } };
  const sgSet = (on) => { try { localStorage.setItem(SG_KEY, JSON.stringify({ status: on ? 'in' : 'out', at: new Date().toISOString() })); } catch (e) { /* private mode */ } };

  /* ---------- from the member's profile ---------- */
  const STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
    'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
  const profile = (label) => {
    const f = [...document.querySelectorAll('#tab-profile .field')].find((x) => x.querySelector('label') && x.querySelector('label').textContent.trim() === label);
    return f && f.querySelector('input') ? f.querySelector('input').value.trim() : '';
  };
  const refType = () => /processor/i.test(profile('Role type')) ? 'Processor' : 'Broker';
  const states = () => profile('State licenses').split(/[,\s]+/).map((s) => s.toUpperCase()).filter((s) => STATES.includes(s));
  const timing = () => memberTier === 'VIP' ? 'As a VIP member, you get each referral first.' : 'VIP members get each referral first; Elite members get it shortly after.';
  function summary() {
    const st = states();
    return `<div class="lr-summary">
        <div><span class="k">Type</span>${refType()} referrals</div>
        <div><span class="k">States</span>${st.length ? st.join(', ') : '<em>No licensed states on your profile yet</em>'}</div></div>
      <p class="lr-help">From your profile's role type and state licenses — <button class="link-pink" data-lr-profile>update them in Profile</button>.</p>`;
  }

  /* ---------- one-time prompt ---------- */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="modal-referrals"><div class="modal" style="max-width:500px">
      <div class="modal-head"><div><h2>Get loan referrals from AIME?</h2><p>AIME emails loan referrals to members who opt in.</p></div>
        <button class="modal-close" data-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>
      <div class="modal-body" id="lr-body"></div>
      <div class="modal-foot"><button class="btn btn-outline" data-lr="decline">No thanks</button><button class="btn btn-primary" data-lr="join">Join referrals</button></div>
    </div></div>`);
  function openPrompt() {
    $('lr-body').innerHTML = `<div class="lr-note">${timing()} Each referral includes the person's contact details so you can reach out directly.</div>
      <div class="form-section-label">You'd get</div>${summary()}
      <p class="lr-help" style="margin-top:12px">You can opt out any time in Settings → Notifications &amp; app.</p>`;
    openModal('referrals');
  }
  function set(status) {
    const fromPrompt = $('modal-referrals').classList.contains('open');
    write(status); closeModals(); renderSettings();
    showToast(status === 'joined' ? `You're in! ${refType()} referrals for ${states().join(', ') || 'your licensed states'} will come to your email.`
      : fromPrompt ? 'No problem — you can opt in any time in Settings → Notifications & app.' : "You're opted out of loan referrals.");
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
    const joined = read().status === 'joined';
    const inner = !eligible
      ? `<p class="pwa-sub" style="margin-bottom:12px"><span class="pwa-pill">Elite &amp; VIP</span> AIME emails loan referrals to Elite and VIP members who opt in — VIP members get them first.</p>
        <button class="btn btn-outline btn-sm" data-nav="settings" data-tab="billing">See membership options</button>`
      : `<p class="pwa-sub" style="margin-bottom:12px"><span class="pwa-pill ${joined ? 'on' : ''}">${joined ? 'Opted in' : 'Opted out'}</span> ${joined ? 'Referrals come to your email.' : 'Get loan referrals by email.'} ${timing()}</p>
        ${summary()}
        <button class="btn ${joined ? 'btn-outline' : 'btn-primary'} btn-sm" data-lr="${joined ? 'decline' : 'join'}" style="margin-top:14px">${joined ? 'Opt out' : 'Opt in'}</button>`;
    const sg = sgIn();
    box.innerHTML = `<div class="card card-pad" style="max-width:560px">
      <h3 style="font-size:16px;margin-bottom:4px">Subscriptions</h3>
      <div class="form-section-label" style="margin-top:12px">Scotsman Guide</div>
      <p class="pwa-sub" style="margin-bottom:12px"><span class="pwa-pill ${sg ? 'on' : ''}">${sg ? 'Subscribed' : 'Not subscribed'}</span> Your FREE subscription to Scotsman Guide, included with your membership.</p>
      <button class="btn ${sg ? 'btn-outline' : 'btn-primary'} btn-sm" data-sg="${sg ? 'out' : 'in'}">${sg ? 'Unsubscribe' : 'Subscribe'}</button>
      <div class="form-section-label" style="margin-top:22px">Loan referrals</div>${inner}</div>`;
  }

  function busy() {
    return document.body.classList.contains('wt-open') || document.querySelector('.modal-overlay.open, .pwa-banner, .auth-overlay.open') ||
      !document.getElementById('view-dashboard')?.classList.contains('active');
  }
  function maybePrompt(tries) {
    if (!eligible || read().status) return;
    if (busy()) { if (tries < 60) setTimeout(() => maybePrompt(tries + 1), 2000); return; }
    openPrompt();
  }
  setTimeout(() => maybePrompt(0), 3500);

  /* ---------- wiring ---------- */
  document.addEventListener('click', (e) => {
    const sg = e.target.closest('[data-sg]');
    if (sg) {
      e.preventDefault(); sgSet(sg.dataset.sg === 'in'); renderSettings();
      showToast(sg.dataset.sg === 'in' ? "You're subscribed to Scotsman Guide." : "You're unsubscribed from Scotsman Guide.");
      return;
    }
    if (e.target.closest('[data-lr-profile]')) { e.preventDefault(); closeModals(); navigate('settings'); setTab('profile'); return; }
    const b = e.target.closest('[data-lr]'); if (!b) return;
    e.preventDefault();
    set(b.dataset.lr === 'join' ? 'joined' : 'declined');
  });

  addSettings(); renderSettings();
  window.AmpReferrals = { open: openPrompt, read, scotsman: sgIn, reset() { try { localStorage.removeItem(KEY); localStorage.removeItem(SG_KEY); } catch (e) { /* private mode */ } renderSettings(); setTimeout(() => maybePrompt(0), 500); } };
})();
