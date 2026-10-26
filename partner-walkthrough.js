/* ============================================================
   AMP — First-time walkthrough for lender & vendor partners
   ------------------------------------------------------------
   Separate from the member tour (walkthrough.js skips partners):
   own steps, own "seen" memory (localStorage amp-partner-tour-v1).
   Lender and vendor variants: dashboard (page views by tier,
   recent requests, listing-change banner), the request inbox and
   an example request (member details, Sent to, reply / email),
   view-only Lenders & Market, and help.
   Starts on a partner's first visit; replay from the ? menu,
   Help Center, or Settings ([data-tour-start]) or index.html#tour.
   Engine: tour-engine.js. Uses partner-portal.js (AmpPartnerPortal).
   ============================================================ */
(function () {
  const TYPE = window.AMP_USER_TYPE;
  if (!window.AmpTourEngine || (TYPE !== 'lender' && TYPE !== 'vendor') || !window.AmpPartnerPortal) return;
  const PP = window.AmpPartnerPortal, isLender = TYPE === 'lender', U = window.AMP_PARTNER_USER;
  const $ = (id) => document.getElementById(id);
  const cards = (box) => [...document.querySelectorAll(`#${box} .card`)];
  const cardTitled = (box, title) => () => cards(box).find((c) => (c.querySelector('h2, h3') || {}).textContent === title);
  let sampleId = null;

  const STEPS = [
    { sec: 0, page: 'partner', target: '.nav-item[data-nav="partner"]', mTarget: '.menu-btn', title: 'Your dashboard',
      body: `Your home in AMP for ${PP.COMPANY}. Everyone at your company sees the same dashboard and requests.` },
    { sec: 1, page: 'partner', target: '#partner-body .pp-banner', title: 'Changes to your listing',
      body: 'Your company listing is managed by AIME. To request a change, email the address in this banner.' },
    { sec: 2, page: 'partner', target: () => (isLender ? cardTitled('partner-body', 'Lender page views by member tier')() : cards('partner-body')[0]),
      title: isLender ? 'Lender page views by tier' : PP.MULTI ? 'Page views by product' : 'Market page views',
      body: isLender ? 'How many members viewed your lender page — broken out by Premium, Elite, and VIP, with the total and unique members. Change the period at the top right.'
        : PP.MULTI ? 'Views of each of your Market products, broken out by the viewing member\'s tier, with a total across all your products.'
        : 'How many members viewed your Market listing, broken out by the viewing member\'s tier. Change the period at the top right.' },
    { sec: 2, page: 'partner', target: () => (isLender ? cardTitled('partner-body', 'Recent requests')() : cardTitled('partner-body', 'Recent connection requests')()),
      title: isLender ? 'Recent requests' : 'Recent connection requests',
      body: 'The latest requests from AIME members, with who at your company each one was sent to. Click any row for the full details.' },
    { sec: 3, page: 'requests', target: () => cards('partner-requests-body').pop(), title: 'Requests',
      body: isLender ? 'Every escalation, connection, and Change AE request sent to your company — plus your own support tickets. A "Member requested follow-up" flag means the member asked AIME to check in.'
        : PP.MULTI ? 'Every connection request sent to your company — the Product column and filter show which product each one is for — plus your own support tickets.'
        : 'Every connection request sent to your company, plus your own support tickets.' },
    { sec: 4, chapter: 'A request', page: 'detail', target: cardTitled('partner-request-body', 'Member'), title: 'Full member details',
      body: 'Name, email, phone, NMLS #, company, licensed states, and tier — the same details as the email — plus what they submitted and who it was sent to.' },
    { sec: 4, chapter: 'A request', page: 'detail', target: () => document.querySelector('#partner-request-body .rq-detail-grid > div > .card'),
      title: isLender ? 'Reply to escalations' : 'Email the member',
      body: isLender ? 'Reply here to update the member, or reply and mark it resolved. You can also just reply to the escalation email — no login needed — and it lands here. For connections and Change AE, use "Email &lt;member&gt;".'
        : 'Use "Email &lt;member&gt;" to start an email to them directly from your own email app.' },
    { sec: 5, page: 'partner', target: () => [document.querySelector('.nav-item[data-nav="lenders"]'), document.querySelector('.nav-item[data-nav="market"]')], mTarget: '.menu-btn',
      title: 'Lenders & Market — view only',
      body: 'Browse the lender directory and Market like a member. Partner accounts can\'t submit escalations, connections, or AE requests, or use member discounts. Resources and Events are the same as for members.' },
    { sec: 6, page: 'partner', target: '#help-btn', mTarget: '.menu-btn', title: 'Help & support',
      body: 'Partner guides are in the Help Center, and you can open a support ticket any time. Replay this walkthrough from the ? menu.' },
  ];

  function steps() {
    const reqs = PP.companyRequests();
    sampleId = ((isLender && reqs.find((r) => r.type === 'escalation')) || reqs[0] || {}).id || null;
    return STEPS.filter((s) => s.page !== 'detail' || sampleId);
  }
  function setup(s) {
    const active = (id) => $('view-' + id)?.classList.contains('active');
    if (s.page === 'partner' && !active('partner')) navigate('partner');
    else if (s.page === 'requests' && !active('partner-requests')) navigate('partner-requests');
    else if (s.page === 'detail') { const b = $('partner-request-body'); if (!active('partner-request') || !b || !b.textContent.includes(sampleId)) PP.openRequest(sampleId); }
  }

  const tour = AmpTourEngine({
    key: 'amp-partner-tour-v1',
    sections: 7,
    steps, setup,
    prepare() { if (typeof closeModals === 'function') closeModals(); $('sidebar')?.classList.remove('open'); $('help-menu')?.classList.remove('open'); navigate('partner'); },
    intro: () => `
      <div class="wt-hero">🤝</div>
      <h2 id="wt-title">Welcome to AMP, ${U.first}</h2>
      <p>A one-minute tour of your ${isLender ? 'lender' : 'vendor'} partner account — your dashboard, requests from AIME members, and what you can do in the portal.</p>
      <div class="wt-actions wt-stack">
        <button class="btn btn-primary btn-block" data-wt="next">Show me around</button>
        <button class="btn btn-outline btn-block" data-wt="skip">Skip for now</button>
      </div>
      <p class="wt-fine">Replay it any time from the Help Center or the <strong>?</strong> menu.</p>`,
    finish: () => `
      <div class="wt-hero">✅</div>
      <h2 id="wt-title">You're all set</h2>
      <p>Check your dashboard for new requests — and reply to escalations from here or straight from your email.</p>
      <div class="wt-actions wt-stack">
        <button class="btn btn-primary btn-block" data-wt="done">Go to my dashboard</button>
        <button class="btn btn-outline btn-block" data-wt="alt">Open requests</button>
      </div>`,
    onDone: (w) => navigate(w === 'alt' ? 'partner-requests' : 'partner'),
    onSkip: () => { if (typeof showToast === 'function') showToast('No problem — replay the tour any time from the ? menu.'); },
  });
  window.AmpTour = tour;

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-tour-start]')) return;
    e.preventDefault(); e.stopPropagation(); $('help-menu')?.classList.remove('open'); tour.start();
  }, true);
  const h = (location.hash || '').replace('#', '');
  if (h === 'tour') setTimeout(() => tour.welcome(), 300);
  else if (!h && tour.unseen()) setTimeout(() => { if (!tour.isOpen()) tour.welcome(); }, 900);
})();
