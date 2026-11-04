/* ============================================================
   AMP — Documents linked to a lender, Market product, Vault
   resource, or event
   ------------------------------------------------------------
   Admin picks documents from the Documents library on the
   lender / product / resource / event editor (admin.js). The
   member page for that item shows a "Documents" card with a
   Download button for each one.
   Rules:
     • A linked document keeps its own access: if the member's
       tier can't open it (e.g. a VIP-only hub document), it shows
       locked with the membership it needs — no download.
     • Lender / Vendor users only see General documents.
     • Removing a document from the library drops it from every
       item it was linked to.
   Data: localStorage amp-doclinks-v1 — { "lender|UWM": [titles] }
   Member side wraps app.js openLender / openVendor / openResource
   / openEvent and uses generalDocuments, hubs, memberTier,
   userType.
   ============================================================ */
(function () {
  const KEY = 'amp-doclinks-v1', DKEY = 'amp-doclinks-docs-v1';   // links; documents uploaded from an item's editor
  const SEED = {
    'lender|United Wholesale Mortgage': ['Loan Escalation Guide'],
    'resource|Scaling Past $1M in Volume': ['90-Day Growth Plan Template', 'Weekly Action Plan Template'],
    'event|AIME Accelerate — Identity Reset': ['Accelerate Live — Session Workbook'],
    'market|Advantage Partners Solutions': ['AIME Member Handbook'],
  };
  const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY)); return v && typeof v === 'object' ? v : null; } catch (e) { return null; } };
  let links = read();
  if (!links) { links = JSON.parse(JSON.stringify(SEED)); try { localStorage.setItem(KEY, JSON.stringify(links)); } catch (e) { /* private mode */ } }
  const listeners = [];
  window.addEventListener('storage', (e) => { if (e.key === KEY) { links = read() || links; listeners.forEach((f) => f()); } });

  const k = (kind, name) => `${kind}|${name}`;
  const readDocs = () => { try { return JSON.parse(localStorage.getItem(DKEY)) || []; } catch (e) { return []; } };
  window.AmpDocLinks = {
    KINDS: { lender: 'lender', vendor: 'market', market: 'market', resource: 'resource', event: 'event' },
    get: (kind, name) => (links[k(kind, name)] || []).slice(),
    set(kind, name, titles) {
      const key = k(kind, name);
      if (titles && titles.length) links[key] = [...new Set(titles)]; else delete links[key];
      try { localStorage.setItem(KEY, JSON.stringify(links)); } catch (e) { /* in-memory */ }
      listeners.forEach((f) => f());
    },
    // A document was removed from the library: unlink it everywhere.
    dropDocument(title) { Object.keys(links).forEach((key) => { links[key] = links[key].filter((t) => t !== title); if (!links[key].length) delete links[key]; }); try { localStorage.setItem(KEY, JSON.stringify(links)); } catch (e) { /* in-memory */ } },
    onChange: (f) => listeners.push(f),
    // Uploaded from an item's editor (admin) — added to the library; the member app reads them here.
    addDoc(doc) { const list = readDocs().filter((x) => x.title !== doc.title); list.unshift(doc); try { localStorage.setItem(DKEY, JSON.stringify(list)); } catch (e) { /* in-memory */ } },
    uploaded: readDocs,
    reset() { links = JSON.parse(JSON.stringify(SEED)); try { localStorage.setItem(KEY, JSON.stringify(links)); } catch (e) { /* */ } listeners.forEach((f) => f()); },
  };

  /* ---------- member pages ---------- */
  if (typeof openLender !== 'function' || typeof generalDocuments === 'undefined') return;   // admin / lender pages stop here
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const partner = typeof userType !== 'undefined' && userType !== 'member';
  const RANK = { Premium: 1, Elite: 2, VIP: 3 };
  const LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>';

  function findDoc(title) {
    const g = generalDocuments.find((d) => d.title === title);
    if (g) return { ...g, src: 'General', vip: false };
    const up = readDocs().find((x) => x.title === title);
    if (up) return { title, desc: up.desc, link: '#', src: 'General', tiers: up.access };
    for (const key of Object.keys(hubs)) {
      const d = (hubs[key].documents || []).find((x) => x.title === title);
      if (d) return { ...d, src: hubs[key].name, vip: !!hubs[key].vip };
    }
    return { title, desc: '', link: '#', src: 'General', vip: false };
  }
  function card(kind, name) {
    const docs = AmpDocLinks.get(kind, name).map(findDoc).filter((d) => !partner || (d.src === 'General' && (!d.tiers || d.tiers.includes('All Members'))));
    if (!docs.length) return '';
    const canOpen = (d) => (d.tiers ? (d.tiers.includes('All Members') || (!partner && d.tiers.includes(memberTier)))
      : (!d.vip || (!partner && RANK[memberTier] >= RANK.VIP)));
    const needs = (d) => d.tiers && !d.tiers.includes('All Members') ? d.tiers.join(' or ') : 'VIP';
    return `<div class="card card-pad linked-docs" style="margin-top:20px"><h3 style="font-size:16px;margin-bottom:6px">Documents</h3>
      ${docs.map((d) => `<div class="list-row doc-row${canOpen(d) ? '' : ' locked'}">
        <div class="list-logo">📄</div>
        <div class="list-main"><div class="lt">${esc(d.title)}</div>${d.desc ? `<div class="ls">${esc(d.desc)}</div>` : ''}</div>
        ${canOpen(d) ? `<a class="btn btn-outline btn-sm" href="${esc(d.link || '#')}" data-toast="Downloading: ${esc(d.title)}">Download</a>`
          : `<span class="ld-lock">${LOCK} Requires ${needs(d)} membership</span>`}
      </div>`).join('')}</div>`;
  }
  function add(bodyId, kind, name, before) {
    const body = document.getElementById(bodyId); if (!body || !name) return;
    body.querySelectorAll('.linked-docs').forEach((n) => n.remove());
    const html = card(kind, name); if (!html) return;
    const anchor = before && body.querySelector(before);
    if (anchor) anchor.insertAdjacentHTML('beforebegin', html); else body.insertAdjacentHTML('beforeend', html);
  }
  const wrap = (fn, after) => { const orig = window[fn]; if (typeof orig !== 'function') return; window[fn] = function () { const r = orig.apply(this, arguments); after.apply(this, arguments); return r; }; };
  wrap('openLender', (i) => add('lender-detail-body', 'lender', lenders[i] && lenders[i].name));
  wrap('openVendor', (i) => add('market-detail-body', 'market', vendors[i] && vendors[i].name));
  wrap('openResource', (i) => add('resource-detail-body', 'resource', resources[i] && resources[i].title, ':scope > div:last-child'));   // above "Up next"
  wrap('openEvent', (i) => add('event-detail-body', 'event', events[i] && events[i].title));

  const css = document.createElement('style');
  css.textContent = `.linked-docs .doc-row.locked .lt{color:var(--muted)}
    .ld-lock{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;color:#6a4ce0;background:rgba(124,92,255,.1);padding:4px 10px;border-radius:20px;white-space:nowrap}
    .ld-lock svg{width:12px;height:12px}`;
  document.head.appendChild(css);
})();
