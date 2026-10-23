/* ============================================================
   AMP Member Portal — First-time walkthrough
   ------------------------------------------------------------
   A guided tour that spotlights the main parts of the portal.
     • Starts automatically for a member who hasn't seen it
       (after sign-in / sign-up, or on first load)
     • "Skip tour" / ✕ / Esc ends it at any step
     • Replay any time: the ? menu in the top bar, the Help
       Center, or Settings (anything with [data-tour-start])
     • Deep link: index.html#tour
   Seen/skipped is remembered per browser (localStorage); in
   production store it on the member's profile instead.
   Uses app.js globals: navigate, closeModals, closeNotif, showToast.
   ============================================================ */
(function () {
  const KEY = 'amp-tour-v1';
  const mobile = () => window.matchMedia('(max-width: 860px)').matches;

  // target: CSS selector (desktop); mTarget: on phones (sidebar is a hidden drawer there).
  // No target / not visible → the card is centered with no spotlight.
  const STEPS = [
    { target: '.sidebar .nav', mTarget: '.menu-btn', title: 'Your menu',
      body: 'Everything lives here — Lenders, Market, Resources, Events, Documents, and your learning hubs.',
      mBody: 'Tap the menu for everything else — hubs, Documents, My Requests, Help Center, and Settings.' },
    { target: '.hero', title: "What's new this week",
      body: 'Home shows what was added this week across lenders, Market deals, resources, and events. Click any tile to jump straight there.' },
    { target: '.qa-grid', title: 'Quick actions',
      body: 'The things members do most — change your AE, connect with a lender, or escalate a loan — one click from Home.' },
    { target: '.esc-pill', title: 'Your escalations',
      body: "How many loan escalations you have left this cycle. Tap + to buy more at $199 each." },
    { target: '.topbar .search', title: 'Search everything',
      body: 'Find any lender, vendor, resource, or event by name from any page.' },
    { target: '.nav-item[data-nav="lenders"]', mTarget: '.bottom-nav-item[data-nav="lenders"]', title: 'Lenders',
      body: "Browse partner lenders by tier and product type. From a lender's page you can escalate a loan, connect, or change your AE." },
    { target: '.nav-item[data-nav="brokersedge"]', title: 'Learning & hubs',
      body: 'Brokers Edge, Mortgage Mornings, Accelerate Live, and WMN gather trainings, replays, events, and documents for each program.' },
    { target: '.nav-item[data-nav="requests"]', title: 'Track your requests',
      body: 'Every escalation, connection, AE change, and support ticket you submit shows up here with its status — including lender responses.' },
    { target: '.notif-wrap .icon-btn', title: 'Notifications',
      body: 'New partners, replies to your requests, FUSE reminders, and new content show up here.' },
    { target: '#help-btn', mTarget: '.menu-btn', title: 'Help is always here',
      body: 'Open the Help Center, contact support, or replay this walkthrough any time from the ? menu.',
      mBody: 'Open Help Center from the menu any time — step-by-step guides, contact support, or replay this walkthrough.' },
  ];

  let i = -1, root = null, lastFocus = null;

  /* ---------- persistence ---------- */
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const write = (o) => { try { localStorage.setItem(KEY, JSON.stringify(Object.assign(read(), o, { at: new Date().toISOString() }))); } catch (e) { /* private mode */ } };

  /* ---------- DOM ---------- */
  function build() {
    root = document.createElement('div');
    root.className = 'wt-root';
    root.innerHTML = `<div class="wt-shade"></div><div class="wt-spot"></div>
      <div class="wt-card" role="dialog" aria-modal="true" aria-labelledby="wt-title" tabindex="-1"></div>`;
    document.body.appendChild(root);
    root.addEventListener('click', onClick);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    document.addEventListener('keydown', onKey, true);
  }
  function teardown() {
    if (!root) return;
    window.removeEventListener('resize', place);
    window.removeEventListener('scroll', place, true);
    document.removeEventListener('keydown', onKey, true);
    root.remove(); root = null; i = -1;
    document.body.classList.remove('wt-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  const card = () => root.querySelector('.wt-card');

  function targetOf(step) {
    const sel = mobile() && step.mTarget ? step.mTarget : step.target;
    const el = sel && document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.right <= 0 || r.left >= window.innerWidth) return null;   // hidden / in a closed drawer
    return el;
  }

  /* ---------- render ---------- */
  function renderIntro() {
    root.classList.add('centered');
    card().innerHTML = `
      <div class="wt-hero">👋</div>
      <h2 id="wt-title">Welcome to AMP, Kyle</h2>
      <p>Take a one-minute tour of your member portal — where to find lenders, how to escalate a loan, and where to get help.</p>
      <div class="wt-actions wt-stack">
        <button class="btn btn-primary btn-block" data-wt="next">Show me around</button>
        <button class="btn btn-outline btn-block" data-wt="skip">Skip for now</button>
      </div>
      <p class="wt-fine">You can replay it any time from the Help Center${mobile() ? '' : ' or the <strong>?</strong> menu'}.</p>`;
    place(); focusPrimary();
  }

  function renderFinish() {
    root.classList.add('centered');
    card().innerHTML = `
      <div class="wt-hero">🎉</div>
      <h2 id="wt-title">You're all set</h2>
      <p>That's the tour. If you ever get stuck, the Help Center has step-by-step guides — or open a support ticket and our team will reply right in the portal.</p>
      <div class="wt-actions wt-stack">
        <button class="btn btn-primary btn-block" data-wt="done">Start exploring</button>
        <button class="btn btn-outline btn-block" data-wt="help">Browse the Help Center</button>
      </div>`;
    place(); focusPrimary();
  }

  function renderStep() {
    const s = STEPS[i], el = targetOf(s);
    root.classList.toggle('centered', !el);
    if (el) el.scrollIntoView({ block: el.closest('.sidebar') ? 'nearest' : 'center', inline: 'nearest' });
    const n = STEPS.length;
    card().innerHTML = `
      <div class="wt-top"><span class="wt-count">${i + 1} of ${n}</span>
        <button class="wt-skip" data-wt="skip">Skip tour</button></div>
      <h3 id="wt-title">${s.title}</h3>
      <p>${mobile() && s.mBody ? s.mBody : s.body}</p>
      <div class="wt-foot">
        <div class="wt-dots">${STEPS.map((_, k) => `<span class="${k === i ? 'on' : k < i ? 'done' : ''}"></span>`).join('')}</div>
        <div class="wt-actions">
          ${i > 0 ? '<button class="btn btn-outline btn-sm" data-wt="back">Back</button>' : ''}
          <button class="btn btn-primary btn-sm" data-wt="next">${i === n - 1 ? 'Finish' : 'Next'}</button>
        </div>
      </div>`;
    place(); focusPrimary();
  }

  function render() {
    root.classList.remove('centered');
    if (i < 0) renderIntro();
    else if (i >= STEPS.length) renderFinish();
    else renderStep();
  }

  function focusPrimary() { const b = card().querySelector('[data-wt="next"],[data-wt="done"]'); if (b) b.focus({ preventScroll: true }); }

  // Spotlight the target and put the card beside it, clamped to the viewport.
  function place() {
    if (!root) return;
    const spot = root.querySelector('.wt-spot'), c = card();
    const s = STEPS[i], el = s && targetOf(s);
    if (!el) { spot.style.display = 'none'; c.style.left = c.style.top = ''; return; }
    const pad = 6, r = el.getBoundingClientRect();
    Object.assign(spot.style, { display: 'block', left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px' });
    const cw = c.offsetWidth, ch = c.offsetHeight, vw = window.innerWidth, vh = window.innerHeight, gap = 16;
    let left, top;
    if (r.right + gap + cw <= vw - 12) { left = r.right + gap; top = r.top; }                       // right
    else if (r.bottom + gap + ch <= vh - 12) { left = r.left; top = r.bottom + gap; }                // below
    else if (r.top - gap - ch >= 12) { left = r.left; top = r.top - gap - ch; }                      // above
    else { left = r.left - gap - cw; top = r.top; }                                                  // left
    c.style.left = Math.max(12, Math.min(left, vw - cw - 12)) + 'px';
    c.style.top = Math.max(12, Math.min(top, vh - ch - 12)) + 'px';
  }

  /* ---------- actions ---------- */
  function start(fromIntro) {
    if (typeof closeModals === 'function') closeModals();
    if (typeof closeNotif === 'function') closeNotif();
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('help-menu')?.classList.remove('open');
    if (typeof navigate === 'function') navigate('dashboard');
    if (root) teardown();
    lastFocus = document.activeElement;
    build();
    document.body.classList.add('wt-open');
    i = fromIntro ? -1 : 0;
    render();
  }
  function skip() {
    const at = i;
    write({ status: 'skipped', step: at });
    teardown();
    if (typeof showToast === 'function') showToast(`No problem — replay the tour any time from ${mobile() ? 'Help Center' : 'the ? menu'}.`);
    const help = document.getElementById('help-btn');
    if (help) { help.classList.add('wt-pulse'); setTimeout(() => help.classList.remove('wt-pulse'), 2600); }
  }
  function finish(toHelp) {
    write({ status: 'done' });
    teardown();
    if (toHelp && typeof navigate === 'function') navigate('help');
  }
  function onClick(e) {
    const b = e.target.closest('[data-wt]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const a = b.dataset.wt;
    if (a === 'skip') skip();
    else if (a === 'next') { i++; render(); }
    else if (a === 'back') { i = Math.max(0, i - 1); render(); }
    else if (a === 'done') finish(false);
    else if (a === 'help') finish(true);
  }
  function onKey(e) {
    if (!root) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); i >= STEPS.length ? finish(false) : skip(); }
    else if (e.key === 'ArrowRight' && i >= 0 && i < STEPS.length) { i++; render(); }
    else if (e.key === 'ArrowLeft' && i > 0 && i < STEPS.length) { i--; render(); }
    else if (e.key === 'Tab') {   // keep focus inside the card
      const f = [...card().querySelectorAll('button')]; if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  window.AmpTour = { start: () => start(false), welcome: () => start(true), reset: () => { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } } };

  // Replay buttons anywhere ([data-tour-start]) — capture phase so app.js's delegation doesn't also act.
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tour-start]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    start(false);
  }, true);

  // First-time: after sign-in / sign-up completes, or on load if the member hasn't seen it yet.
  const authOpen = () => document.getElementById('auth-screen')?.classList.contains('open');
  const unseen = () => !read().status;
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-action="login"],[data-action="stripe-pay"]');
    if (b && unseen()) setTimeout(() => { if (!authOpen()) start(true); }, 700);
  });
  const h = (location.hash || '').replace('#', '');
  if (h === 'tour') setTimeout(() => start(true), 300);
  else if (!h && unseen()) setTimeout(() => { if (!authOpen() && !root) start(true); }, 900);
})();
