/* ============================================================
   AMP Admin — First-time walkthrough (admin console only)
   ------------------------------------------------------------
   Separate from the member tour (walkthrough.js): its own steps,
   its own "seen" memory (localStorage amp-admin-tour-v1), and it
   never leaves the admin console. Hands-on chapter:
     • Working the request queue — switches to Requests, then opens
       an example escalation (status, follow-up, lender contact,
       composer) and support ticket (conversation, assignee)
   Starts automatically the first time an admin opens the console;
   replay from the ? menu in the top bar ([data-admin-tour-start])
   or admin.html#tour. Skip at any step (Skip tour, ✕, Esc).
   Engine: tour-engine.js. Uses admin.js globals: navigate,
   closeModals, showToast; admin-requests.js: AmpAdminRequests;
   requests-store.js: AmpRequests.
   ============================================================ */
(function () {
  if (!window.AmpTourEngine) return;
  const $ = (id) => document.getElementById(id);
  const navItems = (...keys) => () => keys.map((k) => document.querySelector(`#sidebar .nav-item[data-nav="${k}"]`));
  const detailCard = (title) => () => [...document.querySelectorAll('#arq-detail-body .card')].find((c) => (c.querySelector('h3') || {}).textContent === title);

  const SECTIONS = 12;
  // page: an admin view id ('dashboard', 'requests', 'members'…) or 'esc' / 'tkt' (example request detail).
  const ALL_STEPS = [
    { sec: 0, page: 'dashboard', target: '#sidebar .nav', mTarget: '.menu-btn', title: 'Your admin console',
      body: 'Everything is grouped in the sidebar — Overview, Members, Billing, Communications, Content, Access, and Events.',
      mBody: 'Tap the menu for every admin section — Overview, Members, Billing, Communications, Content, Access, and Events.' },
    { sec: 1, page: 'dashboard', target: '#view-dashboard .stat-row.admin5', title: 'The dashboard',
      body: 'A snapshot of the whole portal: members, pending requests, partners, and revenue. Click any tile to jump to that section.' },

    // ---- chapter: working the request queue ----
    { sec: 2, page: 'dashboard', target: '#sidebar .nav-item[data-nav="requests"]', mTarget: '.menu-btn', title: 'Requests — your work queue',
      body: "Every member escalation, connection, AE change, support ticket, and bug report lands here. The pink number counts what needs attention. Let's open it." },
    { sec: 2, chapter: 'Request queue', page: 'requests', target: '#arq-stats', title: 'What needs you',
      body: 'Open escalations, follow-ups members have requested, tickets waiting on a reply, and anything unassigned. Click a tile to filter the queue.' },
    { sec: 2, chapter: 'Request queue', page: 'requests', target: () => [$('request-filters'), document.querySelector('#view-requests .toolbar')], title: 'Filter and search',
      body: 'Filter by type, status, or assignee, or search by member, lender, or ref. <strong>⚑ Needs attention</strong> shows only what is waiting on the team.' },
    { sec: 2, chapter: 'Request queue', page: 'esc', target: '#arq-detail-body .rq-seg', title: 'Set the status',
      body: 'Escalations move Received → Responded → Resolved. The member sees every change on their side.' },
    { sec: 2, chapter: 'Request queue', page: 'esc', target: () => document.querySelector('#arq-detail-body .rq-fu.pending') || detailCard('Follow-ups')(), title: 'Member follow-ups',
      body: "When a member clicks <strong>Request a follow-up</strong>, it's flagged here. Contact the lender's escalation desk, then post what you hear back." },
    { sec: 2, chapter: 'Request queue', page: 'esc', target: detailCard('Lender contact'), title: 'Lender contact',
      body: "Where this escalation was emailed. Lenders reply to the email or click a status button — no login. Preview the email or send a reminder from here." },
    { sec: 2, chapter: 'Request queue', page: 'esc', target: '#arq-detail-body .rq-composer', title: 'Update the member',
      body: 'Post a follow-up update, log a lender response that came by phone, or add an <strong>internal note</strong> — notes are never shown to the member.' },
    { sec: 2, chapter: 'Request queue', page: 'tkt', target: '#arq-detail-body .rq-thread', title: 'Support tickets are conversations',
      body: "The member's messages and your team's replies, in order. Status changes show inline." },
    { sec: 2, chapter: 'Request queue', page: 'tkt', target: () => [$('arq-text'), document.querySelector('#arq-detail-body .rq-composer-foot')], title: 'Reply in the portal',
      body: '<strong>Send reply</strong> sets the ticket to Responded and notifies the member; <strong>Send &amp; resolve</strong> closes it. If they reply, it moves back to In progress.' },
    { sec: 2, chapter: 'Request queue', page: 'tkt', target: detailCard('Assigned to'), title: 'Assign an owner',
      body: 'Assign each request so the team knows who has it. Your reply assigns it to you automatically if nobody has it yet.' },

    { sec: 3, page: 'members', target: '#view-members .toolbar', title: 'Members',
      body: 'Every member with their tier, NMLS #, licensed states, and billing from Stripe — status (active, past due, trialing, canceled), amount, and next payment. Filter by any of them; <strong>Send payment link</strong> appears on past-due members. <strong>Manage</strong> opens their role, plan, billing, and escalation allowance.' },
    { sec: 3, page: 'partners', target: '#view-partners .adm-section-head', title: 'Partner users',
      body: 'Free lender and vendor accounts — never a paid membership. Only admins create them: pick Lender or Vendor and the company, and they get an email to set a password. Add one per person; everyone at a company has the same access to its dashboard and requests. Edit or remove a user from their row. Who each request is sent to is set on the lender or vendor listing.' },
    { sec: 4, page: 'members', target: navItems('abandoned', 'coupons'), mTarget: '.menu-btn', title: 'Billing',
      body: 'Abandoned sign-ups to win back, and coupons — synced with Stripe. Each member\'s subscription is on the Members list.' },
    { sec: 5, page: 'notifications', target: '#view-notifications .composer-grid', mTarget: () => [$('notif-title').closest('.field'), $('notif-message').closest('.field')], title: 'Notify members',
      body: "Compose a message for members' notification bell, target it by tier and role, and send now or schedule it." },
    { sec: 5, page: 'emails', target: () => [$('em-tiles'), document.querySelector('#view-emails .toolbar')], title: 'Email history',
      body: 'Every email the portal sends — password resets, magic links, renewal reminders, failed payments — with its delivery status. Click one to preview it, or <strong>Resend</strong>. Sign-in emails resend with a fresh link.' },
    { sec: 6, page: 'notifications', target: navItems('featured', 'lenders', 'market', 'resources', 'events', 'hubs', 'documents', 'taxonomy'), mTarget: '.menu-btn', title: 'Content',
      body: 'Everything members browse — Featured on their home screen, lenders, Market products, resources, events, hubs, documents, and the categories behind them.' },
    { sec: 7, page: 'help', target: () => [$('kb-stats'), document.querySelector('#view-help .toolbar')], title: 'Help Center',
      body: "Write and edit the guides members see in their Help Center, see searches that found nothing, and how the member walkthrough is doing." },
    { sec: 8, page: 'reports', target: () => [$('report-tabs'), document.querySelector('#view-reports .toolbar')], title: 'Reports',
      body: 'Escalation, connection, and Change AE reports for partners, plus subscription upgrades, downgrades, and cancellations with reasons. Export any of them to CSV.' },
    { sec: 9, page: 'analytics', target: () => document.querySelector('#view-analytics .an-tabs'), title: 'Analytics',
      body: 'One place for the numbers, in four tabs: <strong>Overview</strong> (revenue and growth), <strong>Engagement</strong> (what members use), <strong>Member journeys</strong> (sign-up to active), and <strong>Vendor clickthroughs</strong> per Market product.' },
    { sec: 10, page: 'events', target: () => document.querySelector('#events-tbody [data-ereg]'), mTarget: () => document.querySelector('#events-tbody [data-ereg]')?.closest('tr'), title: 'Event registration',
      body: 'Registration is set per event — click <strong>Registration</strong> on any event to turn it on: RSVP or ticketed, which tiers, early-bird pricing, ticket types, add-ons, guests, custom questions, and one-click claim (FUSE).',
      mBody: 'Registration is set per event — swipe an event\'s row to the end and tap <strong>Registration</strong> to turn it on: RSVP or ticketed, tiers, early-bird pricing, tickets, add-ons, guests, questions, and one-click claim (FUSE).' },
    { sec: 10, chapter: 'Events', page: 'registrations', target: () => [$('ereg-stats'), $('ereg-breakdowns')], mTarget: () => $('ereg-stats'), title: 'Event registrations',
      body: 'Pick an event to see totals, breakdowns by tier, ticket, add-on, and question, and every registration — with each guest\'s contact details and add-ons. Export to CSV.' },
    { sec: 11, page: 'team', target: '#view-team .table-wrap', title: 'Team access',
      body: 'Super Admins add admins, change roles, and remove access. Replay this walkthrough any time from the <strong>?</strong> menu in the top bar.' },
  ];

  // Example requests for the queue chapter (prefer ones that show the most).
  const examples = { esc: null, tkt: null };
  function steps() {
    const S = window.AmpRequests, all = S ? S.all() : [];
    const esc = all.filter((r) => r.type === 'escalation'), tkt = all.filter((r) => r.type === 'support');
    examples.esc = (esc.find((r) => r.followUp && r.followUp.status === 'open') || esc.find((r) => r.status !== 'Resolved') || esc[0] || {}).id || null;
    examples.tkt = (tkt.find((r) => S.adminNeedsAttention(r)) || tkt.find((r) => r.status !== 'Resolved') || tkt[0] || {}).id || null;
    return ALL_STEPS.filter((s) => (s.page !== 'esc' || examples.esc) && (s.page !== 'tkt' || examples.tkt) &&
      ((s.page !== 'esc' && s.page !== 'tkt') || window.AmpAdminRequests));
  }

  function setup(s) {
    if (typeof closeModals === 'function') closeModals();
    const active = (id) => $('view-' + id)?.classList.contains('active');
    if (s.page === 'esc' || s.page === 'tkt') {
      const id = examples[s.page], body = $('arq-detail-body');
      if (!active('request-detail') || !body || !body.textContent.includes(id)) AmpAdminRequests.open(id);
    } else if (s.page && !active(s.page)) navigate(s.page);
  }

  const tour = AmpTourEngine({
    key: 'amp-admin-tour-v1',
    sections: SECTIONS,
    steps,
    setup,
    prepare() {
      if (typeof closeModals === 'function') closeModals();
      $('sidebar')?.classList.remove('open');
      $('help-menu')?.classList.remove('open');
      navigate('dashboard');
    },
    intro: () => `
      <div class="wt-hero">🛠️</div>
      <h2 id="wt-title">Welcome to the AMP admin console</h2>
      <p>A two-minute tour of where things live — we'll walk through working the request queue, then members, billing, content, the Help Center, reports, and event registrations.</p>
      <div class="wt-actions wt-stack">
        <button class="btn btn-primary btn-block" data-wt="next">Show me around</button>
        <button class="btn btn-outline btn-block" data-wt="skip">Skip for now</button>
      </div>
      <p class="wt-fine">This is the admin tour — members have their own. Replay it any time from the <strong>?</strong> menu.</p>`,
    finish: () => `
      <div class="wt-hero">✅</div>
      <h2 id="wt-title">You're ready</h2>
      <p>Start with anything flagged <strong>⚑ Needs attention</strong> in Requests — that's where members are waiting on the team.</p>
      <div class="wt-actions wt-stack">
        <button class="btn btn-primary btn-block" data-wt="done">Go to the dashboard</button>
        <button class="btn btn-outline btn-block" data-wt="alt">Open the request queue</button>
      </div>`,
    onDone: (which) => navigate(which === 'alt' ? 'requests' : 'dashboard'),
    onSkip() {
      if (typeof showToast === 'function') showToast('No problem — replay the admin tour any time from the ? menu.');
      const help = $('help-btn');
      if (help) { help.classList.add('wt-pulse'); setTimeout(() => help.classList.remove('wt-pulse'), 2600); }
    },
  });
  window.AmpAdminTour = tour;

  /* ---------- ? menu in the admin top bar ---------- */
  function toggleMenu(open) {
    const m = $('help-menu'); if (!m) return;
    const show = open === undefined ? !m.classList.contains('open') : open;
    m.classList.toggle('open', show);
    $('help-btn').setAttribute('aria-expanded', show);
  }
  // Capture phase so admin.js's delegation doesn't also act on these clicks.
  document.addEventListener('click', (e) => {
    if (e.target.closest('#help-btn')) { e.preventDefault(); e.stopPropagation(); toggleMenu(); return; }
    if (e.target.closest('[data-admin-tour-start]')) { e.preventDefault(); e.stopPropagation(); toggleMenu(false); tour.start(); return; }
    if (!e.target.closest('.help-wrap')) toggleMenu(false);
    else if (e.target.closest('#help-menu [data-nav], #help-menu a')) toggleMenu(false);
  }, true);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });

  // First time an admin opens the console, or admin.html#tour
  const h = (location.hash || '').replace('#', '');
  if (h === 'tour') setTimeout(() => tour.welcome(), 300);
  else if (!h && tour.unseen()) setTimeout(() => { if (!tour.isOpen()) tour.welcome(); }, 900);
})();
