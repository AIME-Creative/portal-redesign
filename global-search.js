/* ============================================================
   AMP — search everything (member app top bar)
   ------------------------------------------------------------
   One search box for the whole portal: lenders, Market products,
   resources, events, hubs and their content, documents, help
   guides, the user's own requests, and pages / settings.
   - Results are grouped by type, best matches first.
   - Tier-gated items (VIP-only hubs and everything in them) still
     show up, labelled with the membership they need, and can't be
     opened. Events whose registration is tier-limited open as
     normal and note who can register.
   - Lender / Vendor users search what their account can see (no
     hubs or documents, their company's requests).
   - Keyboard: "/" focuses the box from anywhere, ↑ ↓ to move,
     Enter to open, Esc to close.
   Uses app.js globals: lenders, vendors, resources, events, hubs,
   generalDocuments, memberTier, userType, navigate, setTab,
   openLender, openVendor, openResource, openEvent, openHubItem,
   filterDocuments, showToast.
   ============================================================ */
(function () {
  const box = document.querySelector('.topbar .search'), input = box && box.querySelector('input');
  if (!input || typeof lenders === 'undefined') return;
  const partner = userType !== 'member';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TIER_RANK = { Premium: 1, Elite: 2, VIP: 3 };
  const needs = (tier) => (partner || TIER_RANK[memberTier] >= TIER_RANK[tier] ? null : tier);   // tier required, or null if they have access

  input.placeholder = 'Search everything — lenders, events, guides, requests…';
  input.setAttribute('aria-label', 'Search the portal');
  input.setAttribute('autocomplete', 'off');

  /* ---------- the index ---------- */
  const ICO = {
    lender: '<path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"/>',
    market: '<path d="M3 9l1-5h16l1 5M4 9v11h16V9M4 9h16M9 13h6"/>',
    resource: '<path d="M4 19V5a2 2 0 012-2h12v18H6a2 2 0 01-2-2zM4 19a2 2 0 012-2h12"/>',
    event: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
    hub: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
    doc: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3" stroke-linecap="round"/><circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none"/>',
    request: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.5-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.7 1.1z"/>',
    page: '<path d="M9 18l6-6-6-6"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
  };
  const GROUPS = [['page', 'Pages & settings'], ['lender', 'Lenders'], ['market', 'Market (vendors)'], ['resource', 'Resources'], ['event', 'Events'],
    ['hub', 'Hubs'], ['doc', 'Documents'], ['request', partner ? 'Requests' : 'My requests'], ['help', 'Help guides']];   // results always show in these type groups, in this order;

  function build() {
    const out = [];
    const add = (kind, title, meta, text, open, gate) => out.push({ kind, title, meta, text: (title + ' ' + text).toLowerCase(), open, gate: gate || null });
    // Pages & settings
    const pages = partner
      ? [['Dashboard', 'partner'], ['Requests', 'partner-requests'], ['Lenders', 'lenders'], ['Market', 'market'], ['Resources', 'resources'],
         ['Events', 'events'], ['Help Center', 'help'], ['Get Support', 'support'], ['Settings', 'settings']]
      : [['Home', 'dashboard'], ['Lenders', 'lenders'], ['Market', 'market'], ['Resources', 'resources'], ['Events', 'events'], ['Documents', 'documents'],
         ['My Requests', 'requests'], ['FUSE 2026 registration', 'fuse'], ['Help Center', 'help'], ['Get Support', 'support'], ['Settings', 'settings']];
    pages.forEach(([t, v]) => add('page', t, 'Page', v, () => navigate(v)));
    const tabs = [['Profile', 'profile', 'name phone address licenses nmls company role'], ['Email & Password', 'security', 'login password email'],
      ['Notifications & app', 'notifications', 'push install app alerts loan referrals opt in out']];
    if (!partner) tabs.splice(2, 0, ['Membership & Billing', 'billing', 'plan upgrade payment card invoice cancel escalations']);
    tabs.forEach(([t, k, words]) => add('page', t, 'Settings', words, () => { navigate('settings'); setTab(k); }));

    lenders.forEach((l, i) => add('lender', l.name, `${l.tier} lender · ${l.tags.join(', ')}`, `${l.short} ${l.desc} ${l.tags.join(' ')}`, () => openLender(i)));
    vendors.forEach((v, i) => add('market', v.name, `${v.cat}${v.offer ? ' · ' + v.offer : ''}`, `${v.short} ${v.cat} ${v.desc} ${v.tags.join(' ')} ${v.offer || ''}`, () => openVendor(i)));
    resources.forEach((r, i) => add('resource', r.title, [r.type, r.dur, r.topic].filter(Boolean).join(' · '), `${r.type} ${r.topic || ''}`, () => openResource(i)));
    const reg = window.AmpEventReg;
    events.forEach((e, i) => {
      const s = reg && reg.active(e.title), limited = s && s.tiers && !s.tiers.includes('All') && !partner ? s.tiers : null;
      const note = limited && !limited.includes(memberTier) ? ` · Registration: ${limited.join(' & ')} members` : '';
      add('event', e.title, `${e.when || e.date} · ${e.type}${note}`, `${e.type} ${e.when || ''} ${e.date}`, () => openEvent(i));
    });

    if (!partner) {
      Object.keys(hubs).forEach((k) => {
        const h = hubs[k], gate = h.vip ? needs('VIP') : null;
        add('hub', h.name, h.vip ? 'Hub · VIP members' : 'Hub', h.intro || '', () => navigate(k), gate);
        (h.content || []).forEach((c, i) => add('hub', c.title, `${c.type} in ${h.name}`, `${c.type} ${h.name}`, () => openHubItem(k, 'content', i), gate));
        (h.events || []).forEach((ev, i) => add('event', ev.title, `${ev.when} · ${h.name}`, `${ev.type} ${h.name}`, () => openHubItem(k, 'event', i), gate));
        (h.documents || []).forEach((d) => add('doc', d.title, `Document · ${h.name}`, d.desc, () => { navigate('documents'); filterDocuments(k); }, gate));
      });
      generalDocuments.forEach((d) => add('doc', d.title, 'Document', d.desc, () => { navigate('documents'); filterDocuments('general'); }));
    }

    const R = window.AmpRequests;
    if (R) {
      const mine = partner && window.AmpPartnerPortal ? AmpPartnerPortal.companyRequests().concat(R.mine()) : R.mine();
      mine.forEach((r) => add('request', `${r.id} · ${r.title}`, `${R.TYPES[r.type].label} · ${r.status}${r.partner ? ' · ' + r.partner : ''}`,
        `${r.type} ${R.TYPES[r.type].label} ${r.partner || ''} ${r.member || ''} ${r.status}`,
        () => (partner && r.type !== 'support' ? AmpPartnerPortal.openRequest(r.id) : (window.AmpMyRequests ? AmpMyRequests.preview(r.id) : navigate('requests')))));
    }

    const aud = partner ? 'partner' : 'member';
    (window.HELP_ARTICLES || []).filter((a) => a.status === 'Published' && [aud, 'all'].includes(a.audience || 'member'))
      .forEach((a) => add('help', a.title, 'Help guide', `${a.summary} ${(a.tags || []).join(' ')}`, a.slug));
    return out;
  }

  /* ---------- matching ---------- */
  function score(it, terms, q) {
    if (!terms.every((t) => it.text.includes(t))) return 0;
    const title = it.title.toLowerCase();
    let s = 1;
    if (title.startsWith(q)) s += 6; else if (title.includes(q)) s += 4;
    terms.forEach((t) => { if (new RegExp('(^|[^a-z0-9])' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(title)) s += 2; });
    if (it.gate) s -= 0.5;   // same match: the ones they can open first
    return s;
  }
  function highlight(text, terms) {
    let html = esc(text);
    terms.forEach((t) => { if (t.length > 1) html = html.replace(new RegExp('(' + esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); });
    return html;
  }

  /* ---------- panel ---------- */
  const panel = document.createElement('div');
  panel.className = 'gs-panel'; panel.id = 'gs-panel'; panel.setAttribute('role', 'listbox'); panel.hidden = true;
  box.appendChild(panel);
  let results = [], active = -1, index = null, expanded = {};   // expanded: groups showing every match

  function render() {
    const q = input.value.trim().toLowerCase();
    if (!q) { close(); return; }
    index = index || build();
    const terms = q.split(/\s+/).filter(Boolean);
    const hits = index.map((it) => ({ it, s: score(it, terms, q) })).filter((x) => x.s > 0);
    results = [];
    let html = '';
    GROUPS.forEach(([k, label]) => {
      const g = hits.filter((x) => x.it.kind === k).sort((a, b) => b.s - a.s);
      if (!g.length) return;
      html += `<div class="gs-group"><div class="gs-label">${label}<span>${g.length}</span></div>`;
      (expanded[k] ? g : g.slice(0, 5)).forEach(({ it }) => {
        const n = results.push(it) - 1;
        html += `<div class="gs-row${it.gate ? ' gated' : ''}" role="option" data-gs="${n}" ${it.gate ? `aria-disabled="true" title="Requires a ${it.gate} membership"` : 'tabindex="-1"'}>
            <span class="gs-ico ${it.kind}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${ICO[it.kind]}</svg></span>
            <span class="gs-main"><span class="gs-t">${highlight(it.title, terms)}</span><span class="gs-m">${esc(it.meta)}</span>
              ${it.gate ? `<span class="gs-gate"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${ICO.lock}</svg>Requires ${it.gate} membership</span>` : ''}</span>
          </div>`;
      });
      if (g.length > 5 && !expanded[k]) html += `<button class="gs-more link-pink" data-gs-more="${k}">Show all ${g.length} ${label.toLowerCase()}</button>`;
      html += '</div>';
    });
    const gated = results.filter((r) => r.gate);
    panel.innerHTML = html
      ? html + (gated.length ? `<div class="gs-foot">Items marked with a lock need a ${[...new Set(gated.map((r) => r.gate))].join(' or ')} membership. <button class="link-pink" data-gs-plans>Compare plans</button></div>` : '')
      : `<div class="gs-empty">No results for “${esc(input.value.trim())}”.<br><button class="link-pink" data-nav="help">Browse the Help Center</button></div>`;
    panel.hidden = false;
    box.classList.add('open');
    if (matchMedia('(max-width:860px)').matches) {   // phones: fit between the search box and the bottom tab bar
      const top = box.getBoundingClientRect().bottom + 8;
      panel.style.top = top + 'px'; panel.style.maxHeight = (innerHeight - top - 84) + 'px';
    } else { panel.style.top = ''; panel.style.maxHeight = ''; }
    move(results.findIndex((r) => !r.gate), true);
  }
  function move(i, quiet) {
    panel.querySelectorAll('.gs-row.on').forEach((r) => r.classList.remove('on'));
    active = i;
    const row = panel.querySelector(`[data-gs="${i}"]`);
    if (row) { row.classList.add('on'); if (!quiet) row.scrollIntoView({ block: 'nearest' }); }
  }
  function step(dir) {
    if (!results.length) return;
    let i = active;
    for (let n = 0; n < results.length; n++) { i = (i + dir + results.length) % results.length; if (!results[i].gate) { move(i); return; } }
  }
  function open(i) {
    const it = results[i]; if (!it || it.gate) return;
    close(); input.value = ''; input.blur();
    if (it.kind === 'help') { const a = document.createElement('button'); a.dataset.helpArticle = it.open; a.hidden = true; document.body.appendChild(a); a.click(); a.remove(); }
    else it.open();
  }
  function close() { panel.hidden = true; box.classList.remove('open'); active = -1; }

  /* ---------- wiring ---------- */
  input.addEventListener('input', () => { expanded = {}; render(); });
  input.addEventListener('focus', () => { index = null; if (input.value.trim()) render(); });   // fresh index: requests and opt-ins change
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); step(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); open(active); }
    else if (e.key === 'Escape') { close(); input.blur(); }
  });
  panel.addEventListener('mousedown', (e) => e.preventDefault());   // keep focus in the box while clicking a result
  panel.addEventListener('click', (e) => {
    const more = e.target.closest('[data-gs-more]');
    if (more) { expanded[more.dataset.gsMore] = true; render(); return; }
    if (e.target.closest('[data-gs-plans]')) { close(); input.value = ''; navigate('settings'); setTab('billing'); return; }
    const row = e.target.closest('[data-gs]'); if (!row) { if (e.target.closest('[data-nav]')) close(); return; }
    const it = results[+row.dataset.gs];
    if (it && it.gate) { showToast(`${it.title} needs a ${it.gate} membership.`); return; }
    open(+row.dataset.gs);
  });
  panel.addEventListener('mousemove', (e) => { const row = e.target.closest('.gs-row:not(.gated)'); if (row && +row.dataset.gs !== active) move(+row.dataset.gs, true); });
  document.addEventListener('click', (e) => { if (!box.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.metaKey || e.ctrlKey) return;
    const t = e.target; if (t.closest('input, textarea, select, [contenteditable]')) return;
    e.preventDefault(); input.focus();
  });

  window.AmpSearch = { build, focus: () => input.focus() };
})();
