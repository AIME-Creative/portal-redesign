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
   Spotlight / card / keys / seen-memory come from tour-engine.js
   (shared with the admin tour). Seen/skipped is remembered per
   browser (localStorage amp-tour-v1); in production store it on
   the member's profile instead.
   Uses app.js globals: navigate, openModal, closeModals, closeNotif,
   showToast; my-requests.js: AmpMyRequests; requests-store.js: AmpRequests.
   ============================================================ */
(function () {
  if (!window.AmpTourEngine) return;
  if (window.AMP_USER_TYPE && window.AMP_USER_TYPE !== 'member') return;   // partners: partner-walkthrough.js

  const ESC = '#modal-escalate';
  const escRow = (n) => () => document.querySelectorAll(`${ESC} .modal-body > .field-row`)[n];

  // Main sections (the dots). Chapters add sub-steps under one section.
  const SECTIONS = 11;

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
      body: memberTier === 'VIP' ? 'VIP includes unlimited escalations, so there\'s nothing to count down or buy.' : 'Each escalation uses one from your plan. Running low? Buy more right from the form.' },
    { sec: 2, chapter: 'Escalating a loan', page: 'dashboard', modal: 'escalate', fill: 3, target: `${ESC} .modal-foot .btn-primary`, title: 'Submit it',
      body: "Click <strong>Continue &amp; submit</strong> when you're ready. It's emailed to the lender's escalation team, and their reply shows up in My Requests. <em>(This example won't be sent.)</em>" },

    { sec: 3, page: 'dashboard', target: '.esc-pill', title: 'Your escalations',
      body: memberTier === 'VIP' ? 'Your escalations — unlimited with VIP.' : 'How many loan escalations you have left this cycle. Tap + to buy more at $199 each.' },
    { sec: 4, page: 'dashboard', target: '.topbar .search', title: 'Search everything',
      body: 'Find any lender, vendor, resource, or event by name from any page.' },
    { sec: 5, page: 'dashboard', target: '.nav-item[data-nav="lenders"]', mTarget: '.bottom-nav-item[data-nav="lenders"]', title: 'Lenders',
      body: "Browse partner lenders by tier and product type. From a lender's page you can escalate a loan, connect, or change your AE." },
    { sec: 6, page: 'dashboard', target: '.nav-item[data-nav="brokersedge"]', mTarget: '.menu-btn', title: 'Learning & hubs',
      body: 'Brokers Edge, Mortgage Mornings, Accelerate Live, and WMN gather trainings, replays, events, and documents for each program.',
      mBody: 'Open the ☰ menu for Brokers Edge, Mortgage Mornings, Accelerate Live, and WMN — trainings, replays, events, and documents for each program.' },

    // ---- Events & registration ----
    { sec: 7, page: 'dashboard', target: '.nav-item[data-nav="events"]', mTarget: '.bottom-nav-item[data-nav="events"]', title: 'Events',
      body: 'Webinars, trainings, and in-person events. Events you can sign up for show <strong>RSVP</strong> or <strong>Registration open</strong>; some are for specific membership tiers.' },
    { sec: 7, chapter: 'Events', page: 'fuse', target: '#event-detail-body .er-panel', title: 'Claim your FUSE ticket in one click',
      body: "Your FUSE 2026 ticket is included with your membership — the card shows which ticket you get. One click on <strong>Claim</strong> registers you. Free extras (like a VIP guest ticket or Hall of AIME seat) still have to be <strong>selected to claim</strong>, and guests need their own name, email, and phone." },

    // ---- chapter: My Requests ----
    { sec: 8, page: 'dashboard', target: '.nav-item[data-nav="requests"]', mTarget: '.menu-btn', title: 'Track your requests',
      body: "Every escalation, connection, AE change, and support ticket you submit is tracked in My Requests. Let's take a look.",
      mBody: "Every escalation, connection, AE change, and support ticket you submit is tracked in My Requests (in the menu). Let's take a look." },
    { sec: 8, chapter: 'My Requests', page: 'requests', target: '#rq-stats', title: 'Everything in one place',
      body: "These tiles count your open escalations, open support tickets, and new updates waiting for you. Tap one to filter the list." },
    { sec: 8, chapter: 'My Requests', page: 'requests',
      target: () => { const f = document.querySelector('#rq-list .rq-row .rq-flag:not(.amber)'); return f ? f.closest('.rq-row') : document.querySelector('#rq-list .rq-row'); },
      title: 'New replies stand out', body: 'A <strong>New reply</strong> or <strong>New update</strong> badge means the AIME team or a lender has answered. Click any request to open it.' },
    { sec: 8, chapter: 'My Requests', page: 'esc', target: '#rq-detail-body .rq-track', title: 'Status at a glance',
      body: 'Escalations move from <strong>Received</strong> to <strong>Responded</strong> to <strong>Resolved</strong>. The date under each step shows when it happened.' },
    { sec: 8, chapter: 'My Requests', page: 'esc', target: () => [...document.querySelectorAll('#rq-detail-body .rq-ev.lender')].pop(), title: "Where the lender's reply shows",
      body: "The lender's response lands in the activity log — whether they replied to the email, clicked a status button, or called our team." },
    { sec: 8, chapter: 'My Requests', page: 'esc', target: '#rq-detail-body .rq-fu', title: 'Follow up or close it out',
      body: 'No answer yet? <strong>Request a follow-up</strong> and the AIME membership team chases the lender for you. If the reply fixed it, mark it resolved.' },
    { sec: 8, chapter: 'My Requests', page: 'tkt', target: '#rq-detail-body .rq-thread', title: 'Support is a conversation',
      body: "Support tickets work like messages: our team's replies appear here, newest at the bottom." },
    { sec: 8, chapter: 'My Requests', page: 'tkt', target: () => document.querySelector('#rq-detail-body .rq-composer, #rq-detail-body .rq-waiting'), title: 'Reply right here',
      body: 'Write back and send — the support team is notified. Replying to a resolved ticket reopens it.' },

    { sec: 9, target: '.notif-wrap .icon-btn', title: 'Notifications',
      body: 'Replies to your requests, new partners, FUSE reminders, and new content show up here. Want them on your phone? Install the AMP app and turn on push notifications in Settings → Notifications &amp; app.' },
    { sec: 10, target: '#help-btn', mTarget: '.menu-btn', title: 'Help is always here',
      body: 'Open the Help Center, contact support, or replay this walkthrough any time from the ? menu.',
      mBody: 'Open Help Center from the menu any time — step-by-step guides, contact support, or replay this walkthrough.' },
  ];
  // Example requests for the My Requests chapter (the member's own; prefer ones with replies).
  const examples = { esc: null, tkt: null };
  function pickExamples() {
    const S = window.AmpRequests, mine = S ? S.mine() : [];
    const has = (r, k, by) => r.activity.some((a) => a.kind === k && (!by || a.by === by));
    const esc = mine.filter((r) => r.type === 'escalation'), tkt = mine.filter((r) => r.type === 'support');
    examples.esc = (esc.find((r) => has(r, 'lender-response') && r.status !== 'Resolved') || esc.find((r) => has(r, 'lender-response')) || esc[0] || {}).id || null;
    examples.tkt = (tkt.find((r) => has(r, 'message', 'team') && r.status !== 'Resolved') || tkt.find((r) => has(r, 'message', 'team')) || tkt[0] || {}).id || null;
    // Drop steps whose page can't be shown (no such request, or My Requests not loaded).
    return ALL_STEPS.filter((s) => (s.page !== 'esc' || examples.esc) && (s.page !== 'tkt' || examples.tkt) &&
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
    if (s.page === 'fuse') {   // FUSE event page (registration panel) — opened, never claimed, by the tour
      const i = events.findIndex((e) => e.title.startsWith('FUSE'));
      const title = document.querySelector('#event-detail-body h1');
      if (i > -1 && (!active('event-detail') || !title || !title.textContent.startsWith('FUSE'))) openEvent(i);
      return;
    }
    if (s.page === 'dashboard' && !active('dashboard')) navigate('dashboard');
    else if (s.page === 'requests' && !active('requests')) window.AmpMyRequests.showList('all');
    else if ((s.page === 'esc' || s.page === 'tkt')) {
      const id = examples[s.page], body = document.getElementById('rq-detail-body');
      if (!active('request-detail') || !body || !body.textContent.includes(id)) window.AmpMyRequests.preview(id);
    }
  }

  /* ---------- the member tour ---------- */
  const tour = AmpTourEngine({
    key: 'amp-tour-v1',
    sections: SECTIONS,
    steps: pickExamples,
    setup,
    cleanup: () => { closeTourModal(); lastFill = 0; },
    prepare() {
      if (typeof closeModals === 'function') closeModals();
      if (typeof closeNotif === 'function') closeNotif();
      document.getElementById('sidebar')?.classList.remove('open');
      document.getElementById('help-menu')?.classList.remove('open');
      if (typeof navigate === 'function') navigate('dashboard');
    },
    intro: (mobile) => `
      <div class="wt-hero">👋</div>
      <h2 id="wt-title">Welcome to AMP, Kyle</h2>
      <p>Take a two-minute tour of your member portal — we'll walk through escalating a loan, show you where replies to your requests appear, and where to get help.</p>
      <div class="wt-actions wt-stack">
        <button class="btn btn-primary btn-block" data-wt="next">Show me around</button>
        <button class="btn btn-outline btn-block" data-wt="skip">Skip for now</button>
      </div>
      <p class="wt-fine">You can replay it any time from the Help Center${mobile ? '' : ' or the <strong>?</strong> menu'}.</p>`,
    finish: () => `
      <div class="wt-hero">🎉</div>
      <h2 id="wt-title">You're all set</h2>
      <p>That's the tour. If you ever get stuck, the Help Center has step-by-step guides — or open a support ticket and our team will reply right in the portal.</p>
      <div class="wt-actions wt-stack">
        <button class="btn btn-primary btn-block" data-wt="done">Start exploring</button>
        <button class="btn btn-outline btn-block" data-wt="alt">Browse the Help Center</button>
      </div>`,
    onDone: (which) => { if (typeof navigate === 'function') navigate(which === 'alt' ? 'help' : 'dashboard'); },
    onSkip(mobile) {
      if (typeof showToast === 'function') showToast(`No problem — replay the tour any time from ${mobile ? 'Help Center' : 'the ? menu'}.`);
      const help = document.getElementById('help-btn');
      if (help) { help.classList.add('wt-pulse'); setTimeout(() => help.classList.remove('wt-pulse'), 2600); }
    },
  });
  const start = (fromIntro) => (fromIntro ? tour.welcome() : tour.start());

  window.AmpTour = tour;

  // Replay buttons anywhere ([data-tour-start]) — capture phase so app.js's delegation doesn't also act.
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tour-start]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    start(false);
  }, true);

  // First-time: after sign-in / sign-up completes, or on load if the member hasn't seen it yet.
  const authOpen = () => document.getElementById('auth-screen')?.classList.contains('open');
  const unseen = tour.unseen;
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-action="login"],[data-action="stripe-pay"]');
    if (b && unseen()) setTimeout(() => { if (!authOpen()) start(true); }, 700);
  });
  const h = (location.hash || '').replace('#', '');
  if (h === 'tour') setTimeout(() => start(true), 300);
  else if (!h && unseen()) setTimeout(() => { if (!authOpen() && !tour.isOpen()) start(true); }, 900);
})();
