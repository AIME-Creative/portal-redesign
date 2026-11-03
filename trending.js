/* ============================================================
   AMP — Trending on the member home page
   ------------------------------------------------------------
   The most-viewed pages across the portal in the last 7 days,
   ranked by views from all members: lenders, Market products,
   resources, events, hubs, and hub content. Top 5.
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

  // Sample last-7-day views, highest first. Each entry finds its item by name, so it opens the real page.
  const SAMPLE = [
    { kind: 'event', name: 'FUSE 2026 — National Conference', views: 2184 },
    { kind: 'lender', name: 'Newrez Wholesale', views: 1630 },
    { kind: 'hub', hub: 'ascent', views: 1412 },
    { kind: 'resource', name: 'Broker Power-Up: Episode 65', views: 1275 },
    { kind: 'lender', name: 'United Wholesale Mortgage', views: 1108 },
    { kind: 'resource', name: 'Using AI to Pre-Qualify Borrowers', views: 964 },
    { kind: 'market', name: 'Arive', views: 871 },
    { kind: 'hub', hub: 'mortgagemornings', views: 702 },
  ];
  function rows() {
    return SAMPLE.map((s) => {
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
    card.innerHTML = `<div class="section-title"><h2>Trending</h2><span class="tr-when">Last 7 days</span></div>
      <ol class="tr-list">${items.map((x, i) => `<li><button type="button" class="tr-row" data-trending="${i}">
          <span class="tr-rank">${i + 1}</span>
          <span class="tr-ico tr-${x.kind}">${svg(ICO[x.kind])}</span>
          <span class="tr-main"><span class="tr-t">${esc(x.title)}</span><span class="tr-s">${LABEL[x.kind]} · ${x.views.toLocaleString()} views</span></span>
        </button></li>`).join('')}</ol>`;
  }
  card.addEventListener('click', (e) => {
    const b = e.target.closest('[data-trending]'); if (!b) return;
    e.preventDefault();
    const x = items[+b.dataset.trending]; if (x) x.open();
  });
  render();
  window.AmpTrending = { render };
})();
