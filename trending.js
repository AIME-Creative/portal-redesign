/* ============================================================
   AMP — Trending on the member home page
   ------------------------------------------------------------
   The most-viewed pages across the portal, ranked by views from
   all members: lenders, Market products, resources, events, hubs,
   and hub content. Top 5. View counts aren't shown — only the rank.
   - Date range: Last 7 days (default), Last 30 days, Last 90 days,
     Year to date, or All time. The member's pick is remembered on
     their browser (localStorage amp-trending-v1).
   - Each row opens that exact page.
   - Only pages this member can open are listed — a VIP-only hub
     isn't shown to Premium / Elite members (the next one moves up).
   - Members only; Lender / Vendor users have their own dashboard.
   Prototype: sample view counts. Production: page views from
   analytics, recalculated daily.
   Uses app.js globals: lenders, vendors, resources, events, hubs,
   canSeeVIP, userType, openLender, openVendor, openResource,
   openEvent, openHubItem, navigate.
   ============================================================ */
(function () {
  if (typeof userType === 'undefined' || userType !== 'member') return;
  const anchor = document.querySelector('#dash-events');
  const right = anchor && anchor.closest('.card');
  if (!right) return;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`;
  const ICO = {
    lender: '<path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"/>',
    market: '<path d="M3 9l1-5h16l1 5M4 9v11h16V9M4 9h16M9 13h6"/>',
    resource: '<path d="M4 19V5a2 2 0 012-2h12v18H6a2 2 0 01-2-2zM4 19a2 2 0 012-2h12"/>',
    event: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
    hub: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
  };
  const LABEL = { lender: 'Lender', market: 'Market', resource: 'Resource', event: 'Event', hub: 'Hub' };
  const at = (list, test) => list.findIndex(test);

  const RANGES = [['7', 'Last 7 days'], ['30', 'Last 30 days'], ['90', 'Last 90 days'], ['ytd', 'Year to date'], ['all', 'All time']];
  const KEY = 'amp-trending-v1';
  let range = (() => { try { const r = localStorage.getItem(KEY); return RANGES.some(([k]) => k === r) ? r : '7'; } catch (e) { return '7'; } })();

  // Sample views per range. Each entry finds its item by name, so it opens the real page.
  // Newer things lead the short ranges; long-standing lenders and hubs lead the long ones.
  const SAMPLE = [
    { kind: 'event', name: 'Fuse 2026', views: { 7: 2184, 30: 6420, 90: 11380, ytd: 19650, all: 24310 } },
    { kind: 'lender', name: 'Newrez LLC', views: { 7: 1630, 30: 2870, 90: 2870, ytd: 2870, all: 2870 } },
    { kind: 'hub', hub: 'ascent', views: { 7: 1412, 30: 4980, 90: 12040, ytd: 30120, all: 41870 } },
    { kind: 'resource', name: 'Broker Power-Up Podcast: Episode 65', views: { 7: 1275, 30: 1990, 90: 1990, ytd: 1990, all: 1990 } },
    { kind: 'lender', name: 'United Wholesale Mortgage', views: { 7: 1108, 30: 5210, 90: 15870, ytd: 38940, all: 96420 } },
    { kind: 'resource', name: 'AI-Powered Retention and Growth Tech', views: { 7: 964, 30: 3640, 90: 7210, ytd: 9880, all: 9880 } },
    { kind: 'market', name: 'ARIVE', views: { 7: 871, 30: 3120, 90: 8930, ytd: 17460, all: 33150 } },
    { kind: 'hub', hub: 'mortgagemornings', views: { 7: 702, 30: 3305, 90: 10120, ytd: 27310, all: 58740 } },
    { kind: 'lender', name: 'Equity Prime Mortgage LLC', views: { 7: 655, 30: 2980, 90: 9460, ytd: 22080, all: 51230 } },
    { kind: 'hub', hub: 'brokersedge', views: { 7: 540, 30: 2410, 90: 8770, ytd: 24950, all: 62810 } },
  ];
  function rows() {
    return SAMPLE.map((x) => Object.assign({}, x, { views: x.views[range] })).sort((a, b) => b.views - a.views).map((s) => {
      if (s.kind === 'hub') {
        const h = hubs[s.hub]; if (!h || (h.vip && !canSeeVIP)) return null;
        return Object.assign({ title: h.name, open: () => navigate(s.hub) }, s);
      }
      const list = { lender: lenders, market: vendors, resource: resources, event: events }[s.kind];
      const i = at(list, (x) => (x.name || x.title) === s.name);
      if (i < 0) return null;
      const open = { lender: openLender, market: openVendor, resource: openResource, event: openEvent }[s.kind];
      return Object.assign({ title: s.name, open: () => open(i) }, s);
    }).filter(Boolean).slice(0, 5);
  }

  const card = document.createElement('div');
  card.className = 'card card-pad';
  card.id = 'trending-card';
  card.style.marginBottom = '20px';
  right.insertAdjacentElement('afterend', card);
  let items = [];
  function render() {
    items = rows();
    card.innerHTML = `<div class="section-title"><h2>Trending</h2>
        <select class="select tr-range" aria-label="Trending date range">${RANGES.map(([k, l]) => `<option value="${k}" ${k === range ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
      <ol class="tr-list">${items.map((x, i) => `<li><button type="button" class="tr-row" data-trending="${i}">
          <span class="tr-rank">${i + 1}</span>
          <span class="tr-ico tr-${x.kind}">${svg(ICO[x.kind])}</span>
          <span class="tr-main"><span class="tr-t">${esc(x.title)}</span><span class="tr-s">${LABEL[x.kind]}</span></span>
        </button></li>`).join('')}</ol>`;
  }
  card.addEventListener('change', (e) => {
    if (!e.target.matches('.tr-range')) return;
    range = e.target.value;
    try { localStorage.setItem(KEY, range); } catch (err) { /* private mode */ }
    render();
    card.querySelector('.tr-range').focus();
  });
  card.addEventListener('click', (e) => {
    const b = e.target.closest('[data-trending]'); if (!b) return;
    e.preventDefault();
    const x = items[+b.dataset.trending]; if (x) x.open();
  });
  render();
  window.AmpTrending = { render };
})();
