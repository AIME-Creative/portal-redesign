/* ============================================================
   AMP Member Portal — First-time walkthrough
   ------------------------------------------------------------
   A guided tour that spotlights the main parts of the portal, with
   two hands-on chapters:
     • Escalating a loan — opens the real Escalate form and fills
       it in with an example, field by field (nothing is sent)
     • My Requests — switches to the page, opens an example
       escalation and support ticket to show where replies appear
   Each step declares the page / form it needs (page, modal, fill),
   so Next and Back always put the screen in the right state.
     • Starts automatically for a member who hasn't seen it
       (after sign-in / sign-up, or on first load)
     • "Skip tour" / ✕ / Esc ends it at any step
     • Replay any time: the ? menu in the top bar, the Help
       Center, or Settings (anything with [data-tour-start])
     • Deep link: index.html#tour
   Seen/skipped is remembered per browser (localStorage); in
   production store it on the member's profile instead.
   Uses app.js globals: navigate, openModal, closeModals, closeNotif,
   showToast; my-requests.js: AmpMyRequests; requests-store.js: AmpRequests.
   ============================================================ */
(function () {
  const KEY = 'amp-tour-v1';
  const mobile = () => window.matchMedia('(max-width: 860px)').matches;

  const ESC = '#modal-escalate';
  const escRow = (n) => () => document.querySelectorAll(`${ESC} .modal-body > .field-row`)[n];

  // Main sections (the dots). Chapters add sub-steps under one section.
  const SECTIONS = 10;

  // target: CSS selector or function (desktop); mTarget: on phones (the sidebar is a hidden drawer there).
  // No target / not visible → the card is centered with no spotlight.
  // page: 'dashboard' | 'requests' | 'esc' | 'tkt' (example request detail) — omitted = stay put.
  // modal: 'escalate' keeps the Escalate form open; fill: how many example rows are filled in (1–3).
  const ALL_STEPS = [
    { sec: 0, page: 'dashboard', target: '.sidebar .nav', mTarget: '.menu-btn', title: 'Your menu',
      body: 'Everything lives here — Lenders, Market, Resources, Events, Documents, and your learning hubs.',
      mBody: 'Tap the menu for everything else — hubs, Documents, My Requests, Help Center, and Settings.' },
    { sec: 1, page: 'dashboard', target: () => [document.querySelector('#view-dashboard .hero'), document.querySelector('#view-dashboard .stat-row')],
      mTarget: '#view-dashboard .stat-row', title: "What's new this week",
      body: 'Home opens with what was added this week. The tiles under the banner count the new lenders, Market deals, resources, and events — click one to jump straight there.',
      mBody: 'These tiles count what was added this week — new lenders, Market deals, resources, and events. Tap one to jump straight there.' },
    { sec: 2, page: 'dashboard', target: '.qa-grid', title: 'Quick actions',
      body: "The things members do most — change your AE, connect with a lender, or escalate a loan. Let's escalate a loan together: click Next to open the form." },

    // ---- chapter: escalating a loan ----
    { sec: 2, chapter: 'Escalating a loan', page: 'dashboard', modal: 'escalate', target: `${ESC} .stepper`, title: 'The escalation form',
      body: 'It opens right over the page and takes three short steps — lender & loan, details, then a review before anything is sent. Your contact info is filled in from your profile.' },
    { sec: 2, chapter: 'Escalating a loan', page: 'dashboard', modal: 'escalate', fill: 1, target: `${ESC} .modal-body > .field`, title: 'Pick the lender',
      body: "Choose the lender the loan is with. The report goes straight to that lender's escalation team." },
    { sec: 2, chapter: 'Escalating a loan', page: 'dashboard', modal: 'escalate', fill: 2, target: escRow(0), title: 'Loan number & type',
      body: 'Add the loan number and type so the lender can pull up the file right away.' },
    { sec: 2, chapter: 'Escalating a loan', page: 'dashboard', modal: 'escalate', fill: 3, target: escRow(1), title: 'Amount & closing date',
      body: 'These help the lender prioritize — a closing that is days away gets attention first.' },
    { sec: 2, chapter: 'Escalating a loan', page: 'dashboard', modal: 'escalate', fill: 3, target: `${ESC} .esc-remaining-note`, title: 'Your allowance',
      body: 'Each escalation uses one from your plan. Running low? Buy more right from the form.' },
    { sec: 2, chapter: 'Escalating a loan', page: 'dashboard', modal: 'escalate', fill: 3, target: `${ESC} .modal-foot .btn-primary`, title: 'Submit it',
      body: "Click <strong>Continue &amp; submit</strong> when you're ready. It's emailed to the lender's escalation team, and their reply shows up in My Requests. <em>(This example won't be sent.)</em>" },

    { sec: 3, page: 'dashboard', target: '.esc-pill', title: 'Your escalations',
      body: 'How many loan escalations you have left this cycle. Tap + to buy more at $199 each.' },
    { sec: 4, page: 'dashboard', target: '.topbar .search', title: 'Search everything',
      body: 'Find any lender, vendor, resource, or event by name from any page.' },
    { sec: 5, page: 'dashboard', target: '.nav-item[data-nav="lenders"]', mTarget: '.bottom-nav-item[data-nav="lenders"]', title: 'Lenders',
      body: "Browse partner lenders by tier and product type. From a lender's page you can escalate a loan, connect, or change your AE." },
    { sec: 6, page: 'dashboard', target: '.nav-item[data-nav="brokersedge"]', title: 'Learning & hubs',
      body: 'Brokers Edge, Mortgage Mornings, Accelerate Live, and WMN gather trainings, replays, events, and documents for each program.' },

    // ---- chapter: My Requests ----
    { sec: 7, page: 'dashboard', target: '.nav-item[data-nav="requests"]', mTarget: '.menu-btn', title: 'Track your requests',
      body: "Every escalation, connection, AE change, and support ticket you submit is tracked in My Requests. Let's take a look.",
      mBody: "Every escalation, connection, AE change, and support ticket you submit is tracked in My Requests (in the menu). Let's take a look." },
    { sec: 7, chapter: 'My Requests', page: 'requests', target: '#rq-stats', title: 'Everything in one place',
      body: "These tiles count your open escalations, open support tickets, and new updates waiting for you. Tap one to filter the list." },
    { sec: 7, chapter: 'My Requests', page: 'requests',
      target: () => { const f = document.querySelector('#rq-list .rq-row .rq-flag:not(.amber)'); return f ? f.closest('.rq-row') : document.querySelector('#rq-list .rq-row'); },
      title: 'New replies stand out', body: 'A <strong>New reply</strong> or <strong>New update</strong> badge means the AIME team or a lender has answered. Click any request to open it.' },
    { sec: 7, chapter: 'My Requests', page: 'esc', target: '#rq-detail-body .rq-track', title: 'Status at a glance',
      body: 'Escalations move from <strong>Received</strong> to <strong>Responded</strong> to <strong>Resolved</strong>. The date under each step shows when it happened.' },
    { sec: 7, chapter: 'My Requests', page: 'esc', target: () => [...document.querySelectorAll('#rq-detail-body .rq-ev.lender')].pop(), title: "Where the lender's reply shows",
      body: "The lender's response lands in the activity log — whether they replied to the email, clicked a status button, or called our team." },
    { sec: 7, chapter: 'My Requests', page: 'esc', target: '#rq-detail-body .rq-fu', title: 'Follow up or close it out',
      body: 'No answer yet? <strong>Request a follow-up</strong> and the AIME membership team chases the lender for you. If the reply fixed it, mark it resolved.' },
    { sec: 7, chapter: 'My Requests', page: 'tkt', target: '#rq-detail-body .rq-thread', title: 'Support is a conversation',
      body: "Support tickets work like messages: our team's replies appear here, newest at the bottom." },
    { sec: 7, chapter: 'My Requests', page: 'tkt', target: () => document.querySelector('#rq-detail-body .rq-composer, #rq-detail-body .rq-waiting'), title: 'Reply right here',
      body: 'Write back and send — the support team is notified. Replying to a resolved ticket reopens it.' },

    { sec: 8, target: '.notif-wrap .icon-btn', title: 'Notifications',
      body: 'Replies to your requests, new partners, FUSE reminders, and new content show up here.' },
    { sec: 9, target: '#help-btn', mTarget: '.menu-btn', title: 'Help is always here',
      body: 'Open the Help Center, contact support, or replay this walkthrough any time from the ? menu.',
      mBody: 'Open Help Center from the menu any time — step-by-step guides, contact support, or replay this walkthrough.' },
  ];
  let STEPS = ALL_STEPS;

  // Example requests for the My Requests chapter (the member's own; prefer ones with replies).
  const examples = { esc: null, tkt: null };
  function pickExamples() {
    const S = window.AmpRequests, mine = S ? S.mine() : [];
    const has = (r, k, by) => r.activity.some((a) => a.kind === k && (!by || a.by === by));
    const esc = mine.filter((r) => r.type === 'escalation'), tkt = mine.filter((r) => r.type === 'support');
    examples.esc = (esc.find((r) => has(r, 'lender-response') && r.status !== 'Resolved') || esc.find((r) => has(r, 'lender-response')) || esc[0] || {}).id || null;
    examples.tkt = (tkt.find((r) => has(r, 'message', 'team') && r.status !== 'Resolved') || tkt.find((r) => has(r, 'message', 'team')) || tkt[0] || {}).id || null;
    // Drop steps whose page can't be shown (no such request, or My Requests not loaded).
    STEPS = ALL_STEPS.filter((s) => (s.page !== 'esc' || examples.esc) && (s.page !== 'tkt' || examples.tkt) &&
      (s.page !== 'requests' || window.AmpMyRequests));
  }

  /* ---------- example fill for the Escalate form ---------- */
  const FILL = [
    [['select', 0, 'United Wholesale Mortgage']],
    [['input', 0, '100482910'], ['select', 1, 'Conventional']],
    [['input', 1, '$412,500'], ['input', 2, '2026-07-10']],
  ];
  let modalByTour = false, typing = [], saved = null;
  const formEls = () => { const m = document.querySelector(ESC); return { sel: m.querySelectorAll('.modal-body select'), inp: m.querySelectorAll('.modal-body input') }; };
  function stopTyping() { typing.forEach(clearInterval); typing = []; }
  function fillForm(level, animateLast) {
    const { sel, inp } = formEls();
    if (!saved) saved = { sel: [...sel].map((s) => s.selectedIndex), inp: [...inp].map((x) => x.value) };
    FILL.forEach((row, r) => row.forEach(([kind, n, val]) => {
      const el = kind === 'select' ? sel[n] : inp[n];
      if (r >= level) { if (kind === 'select') el.selectedIndex = saved.sel[n]; else el.value = saved.inp[n]; return; }
      if (kind === 'select') { el.value = val; if (animateLast && r === level - 1) flash(el); return; }
      if (animateLast && r === level - 1 && el.type !== 'date') {
        el.value = ''; let k = 0;
        const timer = setInterval(() => { el.value = val.slice(0, ++k); if (k >= val.length) clearInterval(timer); }, 45);
        typing.push(timer);
      } else { el.value = val; if (animateLast && r === level - 1) flash(el); }
    }));
  }
  function flash(el) { el.classList.remove('wt-filled'); void el.offsetWidth; el.classList.add('wt-filled'); }
  function resetForm() {
    stopTyping();
    if (!saved) return;
    const { sel, inp } = formEls();
    sel.forEach((s, n) => { s.selectedIndex = saved.sel[n]; s.classList.remove('wt-filled'); });
    inp.forEach((x, n) => { x.value = saved.inp[n]; x.classList.remove('wt-filled'); });
    saved = null;
  }
  function closeTourModal() { if (modalByTour) { closeModals(); resetForm(); modalByTour = false; } }

  // Put the screen in the state a step needs.
  let lastFill = 0;
  function setup(s) {
    stopTyping();
    if (s.modal === 'escalate') {
      if (!document.querySelector(ESC).classList.contains('open')) { openModal('escalate'); modalByTour = true; }
      fillForm(s.fill || 0, (s.fill || 0) === lastFill + 1);   // type it out only when moving forward a step
      lastFill = s.fill || 0;
    } else { closeTourModal(); lastFill = 0; }
    const active = (id) => document.getElementById('view-' + id)?.classList.contains('active');
    if (s.page === 'dashboard' && !active('dashboard')) navigate('dashboard');
    else if (s.page === 'requests' && !active('requests')) window.AmpMyRequests.showList('all');
    else if ((s.page === 'esc' || s.page === 'tkt')) {
      const id = examples[s.page], body = document.getElementById('rq-detail-body');
      if (!active('request-detail') || !body || !body.textContent.includes(id)) window.AmpMyRequests.preview(id);
    }
  }

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
    document.addEventListener('animationend', place, true);   // forms / pages animate in — re-measure after
    document.addEventListener('keydown', onKey, true);
  }
  function teardown() {
    if (!root) return;
    window.removeEventListener('resize', place);
    window.removeEventListener('scroll', place, true);
    document.removeEventListener('animationend', place, true);
    document.removeEventListener('keydown', onKey, true);
    closeTourModal(); lastFill = 0;
    root.remove(); root = null; i = -1;
    document.body.classList.remove('wt-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  const card = () => root.querySelector('.wt-card');

  // A target can be one element or a list (spotlight covers them all). Returns null if nothing is visible.
  const rectOf = (el) => {
    if (!Array.isArray(el)) return el.getBoundingClientRect();
    const rs = el.map((e) => e.getBoundingClientRect());
    const l = Math.min(...rs.map((r) => r.left)), tp = Math.min(...rs.map((r) => r.top));
    const rt = Math.max(...rs.map((r) => r.right)), b = Math.max(...rs.map((r) => r.bottom));
    return { left: l, top: tp, right: rt, bottom: b, width: rt - l, height: b - tp };
  };
  function targetOf(step) {
    const sel = mobile() && step.mTarget ? step.mTarget : step.target;
    let el = typeof sel === 'function' ? sel() : sel && document.querySelector(sel);
    if (Array.isArray(el)) { el = el.filter(Boolean); if (!el.length) return null; if (el.length === 1) el = el[0]; }
    if (!el) return null;
    const r = rectOf(el);
    if (r.width === 0 || r.right <= 0 || r.left >= window.innerWidth) return null;   // hidden / in a closed drawer
    return el;
  }

  /* ---------- render ---------- */
  function renderIntro() {
    closeTourModal();
    root.classList.add('centered');
    card().innerHTML = `
      <div class="wt-hero">👋</div>
      <h2 id="wt-title">Welcome to AMP, Kyle</h2>
      <p>Take a two-minute tour of your member portal — we'll walk through escalating a loan, show you where replies to your requests appear, and where to get help.</p>
      <div class="wt-actions wt-stack">
        <button class="btn btn-primary btn-block" data-wt="next">Show me around</button>
        <button class="btn btn-outline btn-block" data-wt="skip">Skip for now</button>
      </div>
      <p class="wt-fine">You can replay it any time from the Help Center${mobile() ? '' : ' or the <strong>?</strong> menu'}.</p>`;
    place(); focusPrimary();
  }

  function renderFinish() {
    closeTourModal();
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
    const s = STEPS[i];
    setup(s);
    const el = targetOf(s);
    root.classList.toggle('centered', !el);
    if (el) {
      const first = Array.isArray(el) ? el[0] : el;
      first.scrollIntoView({ block: Array.isArray(el) ? 'nearest' : first.closest('.sidebar') ? 'nearest' : 'center', inline: 'nearest' });
    }
    const n = STEPS.length;
    const chap = s.chapter ? STEPS.filter((x) => x.chapter === s.chapter) : null;
    card().innerHTML = `
      <div class="wt-top"><span class="wt-count">${s.sec + 1} of ${SECTIONS}${chap ? ` <span class="wt-chap">· ${s.chapter} ${chap.indexOf(s) + 1}/${chap.length}</span>` : ''}</span>
        <button class="wt-skip" data-wt="skip">Skip tour</button></div>
      <h3 id="wt-title">${s.title}</h3>
      <p>${mobile() && s.mBody ? s.mBody : s.body}</p>
      <div class="wt-foot">
        <div class="wt-dots">${Array.from({ length: SECTIONS }, (_, k) => `<span class="${k === s.sec ? 'on' : k < s.sec ? 'done' : ''}"></span>`).join('')}</div>
        <div class="wt-actions">
          ${i > 0 ? '<button class="btn btn-outline btn-sm" data-wt="back">Back</button>' : ''}
          <button class="btn btn-primary btn-sm" data-wt="next">${i === n - 1 ? 'Finish' : 'Next'}</button>
        </div>
      </div>`;
    place(); focusPrimary();
    setTimeout(place, 260);   // re-measure once the form's open animation / page fade settles
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
    const pad = 6, r = rectOf(el);
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
    pickExamples();
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
    if (typeof navigate === 'function') navigate(toHelp ? 'help' : 'dashboard');
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
