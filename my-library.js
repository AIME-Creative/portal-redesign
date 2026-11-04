/* ============================================================
   AMP — My Library (favorites)
   ------------------------------------------------------------
   Members save any content to My Library with the heart:
   lenders, Market products, resources, events, hub content
   (videos, trainings, hub events), and documents.
   - A heart on every card and document row, and a Save button on
     every detail page (the resource / hub "Save for later" button
     is the same toggle). Click again to remove.
   - Sidebar → My Library: everything saved, grouped by type, newest
     first, with filter chips. Click to open; heart to remove.
   - Saved items a member can no longer open (e.g. a VIP hub video
     after moving off VIP) stay listed, locked with the membership
     they need — they can still remove them.
   - Lender / Vendor users can save what they can see: lenders,
     Market, resources, events. No hubs or documents.
   Saved in localStorage amp-library-v1 (production: per account).
   Uses app.js globals: lenders, vendors, resources, events, hubs,
   canSeeVIP, userType, navigate, showToast, openLender, openVendor,
   openResource, openEvent, openHubItem, filterDocuments,
   generalDocuments.
   ============================================================ */
(function () {
  if (typeof userType === 'undefined') return;
  const partner = userType !== 'member';
  const KEY = 'amp-library-v1';
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (d, extra) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${extra || ''}>${d}</svg>`;
  const HEART = '<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 000-7.8z"/>';
  const ICO = {
    lender: '<path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"/>',
    market: '<path d="M3 9l1-5h16l1 5M4 9v11h16V9M4 9h16M9 13h6"/>',
    resource: '<path d="M4 19V5a2 2 0 012-2h12v18H6a2 2 0 01-2-2zM4 19a2 2 0 012-2h12"/>',
    event: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
    hub: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
    doc: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
  };
  const GROUPS = [['lender', 'Lenders'], ['market', 'Market'], ['resource', 'Resources'], ['event', 'Events'], ['hub', 'Hub content'], ['doc', 'Documents']]
    .filter(([k]) => !partner || !['hub', 'doc'].includes(k));

  /* ---------- store ---------- */
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const write = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* private mode */ } };
  // An item: { k: kind, t: title, h: hub key (hub content / hub docs), hk: 'content' | 'event' (hub), at }
  const idOf = (x) => [x.k, x.h || '', x.hk || '', x.t].join('|');
  const has = (x) => read().some((y) => idOf(y) === idOf(x));
  function toggle(x) {
    const list = read(), id = idOf(x), i = list.findIndex((y) => idOf(y) === id);
    if (i > -1) list.splice(i, 1); else list.unshift(Object.assign({}, x, { at: new Date().toISOString() }));
    write(list);
    showToast(i > -1 ? 'Removed from My Library.' : 'Saved to My Library.');
    refresh();
  }

  /* ---------- resolve a saved item to something we can open ---------- */
  function resolve(x) {
    const find = (list, key) => list.findIndex((y) => y[key] === x.t);
    if (x.k === 'lender') { const i = find(lenders, 'name'); return i < 0 ? null : { sub: `${lenders[i].tier} lender`, open: () => openLender(i) }; }
    if (x.k === 'market') { const i = find(vendors, 'name'); return i < 0 ? null : { sub: vendors[i].cat, open: () => openVendor(i) }; }
    if (x.k === 'resource') { const i = find(resources, 'title'); return i < 0 ? null : { sub: `${resources[i].type} · ${resources[i].dur}`, open: () => openResource(i) }; }
    if (x.k === 'event') { const i = find(events, 'title'); return i < 0 ? null : { sub: /[A-Z][a-z]{2} \d/.test(events[i].when) ? events[i].when : `${events[i].date} · ${events[i].when}`, open: () => openEvent(i) }; }
    const hub = hubs[x.h];
    if (x.k === 'hub') {
      if (!hub) return null;
      const list = x.hk === 'event' ? hub.events : hub.content;
      const i = (list || []).findIndex((y) => y.title === x.t); if (i < 0) return null;
      return { sub: `${list[i].type} · ${hub.name}`, locked: hub.vip && !canSeeVIP, open: () => openHubItem(x.h, x.hk, i) };
    }
    if (x.k === 'doc') {
      const src = x.h || 'general';
      const list = src === 'general' ? generalDocuments : (hub && hub.documents) || [];
      if (!list.some((d) => d.title === x.t)) return null;
      return { sub: `Document · ${src === 'general' ? 'General' : hub.name}`, locked: !!(hub && hub.vip && !canSeeVIP), open: () => { navigate('documents'); filterDocuments(src); } };
    }
    return null;
  }

  /* ---------- hearts on cards and document rows ---------- */
  const heartBtn = (x, cls) => `<button type="button" class="fav-heart ${cls || ''} ${has(x) ? 'on' : ''}" data-fav='${esc(JSON.stringify(x))}' aria-pressed="${has(x)}" aria-label="${has(x) ? 'Remove from' : 'Save to'} My Library" title="${has(x) ? 'Saved to My Library' : 'Save to My Library'}">${svg(HEART)}</button>`;
  function itemFromOpener(el) {
    const d = el.dataset;
    if (d.openLender != null) return lenders[+d.openLender] && { k: 'lender', t: lenders[+d.openLender].name };
    if (d.openMarket != null) return vendors[+d.openMarket] && { k: 'market', t: vendors[+d.openMarket].name };
    if (d.openResource != null) return resources[+d.openResource] && { k: 'resource', t: resources[+d.openResource].title };
    if (d.openEvent != null) return events[+d.openEvent] && { k: 'event', t: events[+d.openEvent].title };
    if (d.openHub != null) {
      const [h, hk, i] = d.openHub.split(':'); const list = hk === 'event' ? hubs[h].events : hubs[h].content;
      return list && list[+i] && { k: 'hub', h, hk, t: list[+i].title };
    }
    return null;
  }
  function decorate(root) {
    (root || document).querySelectorAll('.res-card > .card-open, .event-card > .card-open, .partner-card > .card-open').forEach((open) => {
      const card = open.parentElement; if (card.querySelector(':scope > .fav-heart, .partner-foot .fav-heart')) return;
      const x = itemFromOpener(open); if (!x) return;
      if (card.classList.contains('partner-card')) {
        const foot = card.querySelector('.partner-foot');
        if (foot) foot.insertAdjacentHTML('beforeend', heartBtn(x, 'in-foot'));
      } else card.insertAdjacentHTML('beforeend', heartBtn(x, 'on-card'));
    });
    if (partner) return;
    (root || document).querySelectorAll('.doc-row').forEach((row) => {
      if (row.querySelector('.fav-heart')) return;
      const title = row.querySelector('.lt'); if (!title) return;
      const view = row.closest('.view');
      const src = row.dataset.source || (view && view.id.replace(/^view-/, '')) || 'general';
      const x = { k: 'doc', h: src === 'general' ? '' : src, t: title.textContent.trim() };
      const dl = row.querySelector('.btn');
      if (dl) dl.insertAdjacentHTML('beforebegin', heartBtn(x, 'in-row'));
    });
  }
  function syncHearts() {
    document.querySelectorAll('[data-fav]').forEach((b) => {
      const on = has(JSON.parse(b.dataset.fav));
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', `${on ? 'Remove from' : 'Save to'} My Library`);
      if (b.classList.contains('fav-save')) b.innerHTML = `${svg(HEART)} ${on ? 'Saved to My Library' : 'Save to My Library'}`;
      else b.title = on ? 'Saved to My Library' : 'Save to My Library';
    });
  }

  /* ---------- Save button on detail pages ---------- */
  function decorateDetail(bodyId, x) {
    const body = $(bodyId); if (!body || !x) return;
    const card = body.querySelector(':scope > .card');
    if (card && !card.querySelector('.fav-corner')) {
      card.style.position = 'relative';
      card.insertAdjacentHTML('beforeend', heartBtn(x, 'fav-corner' + (card.querySelector('.detail-banner') ? ' on-banner' : '')));
    }
    // Resources and hub videos already had "Save for later" — it's the same toggle now.
    body.querySelectorAll('[data-toast="Saved to your library."]').forEach((b) => {
      b.removeAttribute('data-toast'); b.classList.add('fav-save');
      b.dataset.fav = JSON.stringify(x);
    });
    syncHearts();
  }
  const wrap = (name, after) => { const orig = window[name]; if (typeof orig !== 'function') return; window[name] = function () { const r = orig.apply(this, arguments); after.apply(this, arguments); return r; }; };
  wrap('openLender', (i) => decorateDetail('lender-detail-body', lenders[i] && { k: 'lender', t: lenders[i].name }));
  wrap('openVendor', (i) => decorateDetail('market-detail-body', vendors[i] && { k: 'market', t: vendors[i].name }));
  wrap('openResource', (i) => { decorateDetail('resource-detail-body', resources[i] && { k: 'resource', t: resources[i].title }); decorate($('resource-detail-body')); });
  wrap('openEvent', (i) => decorateDetail('event-detail-body', events[i] && { k: 'event', t: events[i].title }));
  wrap('openHubItem', (h, hk, i) => {
    const list = hubs[h] && (hk === 'event' ? hubs[h].events : hubs[h].content);
    decorateDetail('hub-detail-body', list && list[i] && { k: 'hub', h, hk, t: list[i].title });
  });

  /* ---------- sidebar + page ---------- */
  const nav = document.querySelector('#sidebar .nav');
  const after = nav && (nav.querySelector('.nav-item[data-nav="documents"]') || nav.querySelector('.nav-item[data-nav="events"]'));
  if (after) after.insertAdjacentHTML('afterend', `<button class="nav-item" data-nav="library">${svg(HEART)} My Library</button>`);
  const docsView = $('view-documents') || document.querySelector('.view');
  docsView.insertAdjacentHTML('afterend', '<section class="view" id="view-library"></section>');
  let filter = 'all';
  function render() {
    const page = $('view-library'); if (!page) return;
    const kinds = GROUPS.map(([k]) => k);
    const items = read().filter((x) => kinds.includes(x.k)).map((x) => Object.assign({ r: resolve(x) }, x)).filter((x) => x.r);
    const count = (k) => items.filter((x) => x.k === k).length;
    if (filter !== 'all' && !count(filter)) filter = 'all';
    const chips = `<button class="chip ${filter === 'all' ? 'active' : ''}" data-lib-filter="all">All <span class="lib-n">${items.length}</span></button>` +
      GROUPS.filter(([k]) => count(k)).map(([k, l]) => `<button class="chip ${filter === k ? 'active' : ''}" data-lib-filter="${k}">${l} <span class="lib-n">${count(k)}</span></button>`).join('');
    const groups = GROUPS.filter(([k]) => count(k) && (filter === 'all' || filter === k)).map(([k, l]) => `
      <div class="card card-pad lib-group"><div class="section-title" style="margin-bottom:6px"><h2 style="font-size:16px">${l}</h2><span class="count-note">${count(k)}</span></div>
        ${items.filter((x) => x.k === k).map((x) => `<div class="list-row lib-row${x.r.locked ? ' locked' : ''}">
          <button type="button" class="lib-open" ${x.r.locked ? 'disabled' : `data-lib-open='${esc(JSON.stringify({ k: x.k, h: x.h, hk: x.hk, t: x.t }))}'`}>
            <span class="lib-ico lib-${x.k}">${svg(x.r.locked ? ICO.lock : ICO[x.k])}</span>
            <span class="lib-main"><span class="lib-t">${esc(x.t)}</span><span class="lib-s">${x.r.locked ? '<span class="lib-lock">Requires VIP membership</span>' : esc(x.r.sub)}</span></span>
          </button>
          ${heartBtn({ k: x.k, h: x.h, hk: x.hk, t: x.t }, 'in-row')}
        </div>`).join('')}
      </div>`).join('');
    page.innerHTML = `<div class="page-head"><h1>My Library</h1><p>Everything you've saved — tap the heart on any ${partner ? 'lender, Market product, resource, or event' : 'lender, Market product, resource, event, hub video, or document'} to keep it here.</p></div>
      ${items.length ? `<div class="filters" id="library-filters">${chips}</div><div class="lib-groups">${groups}</div>`
        : `<div class="card empty"><div class="e-ico">${svg(HEART)}</div><h3 style="color:var(--ink);margin-bottom:6px">Nothing saved yet</h3>
            <p style="margin:0 auto 16px;max-width:420px">Tap the heart on anything you want to come back to — it'll show up here.</p>
            <button class="btn btn-primary btn-sm" data-nav="resources">Browse resources</button></div>`}`;
  }
  function refresh() { syncHearts(); if ($('view-library') && $('view-library').classList.contains('active')) render(); }
  wrap('navigate', (view) => { if (view === 'library') { render(); } });

  /* ---------- clicks ---------- */
  // Capture phase so a heart on a card never opens the card, and the old "Save for later" toast never fires.
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-fav]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    toggle(JSON.parse(b.dataset.fav));
  }, true);
  document.addEventListener('click', (e) => {
    const f = e.target.closest('[data-lib-filter]');
    if (f) { e.preventDefault(); filter = f.dataset.libFilter; render(); return; }
    const o = e.target.closest('[data-lib-open]');
    if (o) { e.preventDefault(); const r = resolve(JSON.parse(o.dataset.libOpen)); if (r && !r.locked) r.open(); }
  });

  // Cards are rendered by app.js and other add-ons at different times — add hearts as they appear.
  decorate();
  const main = document.querySelector('.main') || document.body;
  let queued = false;
  new MutationObserver(() => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; decorate(); }); })
    .observe(main, { childList: true, subtree: true });

  window.AmpLibrary = { all: read, toggle, render, reset() { write([]); refresh(); } };
})();
