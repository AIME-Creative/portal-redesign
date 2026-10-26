/* ============================================================
   AMP Admin — Help Center management
   ------------------------------------------------------------
   • Knowledge base articles: list, filter, add / edit (title,
     topic, summary, search tags, status, "Try it now" button,
     body), preview on the member side
   • Searches with no results (gaps to write guides for) —
     sample data plus anything searched in the member Help
     Center in this browser
   • Walkthrough completion (sample numbers)
   Content: help-articles.js (shared with the member app). Edits
   are in-memory in the prototype; production = Supabase table +
   the rich-text editor (TipTap) the live admin already uses.
   Uses admin.js globals: openModal, closeModals, showToast.
   ============================================================ */
(function () {
  const CATS = window.HELP_CATEGORIES, ARTS = window.HELP_ARTICLES;
  if (!CATS || !ARTS || !document.getElementById('view-help')) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pct = (y, n) => (y + n ? Math.round((y / (y + n)) * 100) + '%' : '—');
  let editing = null;   // slug being edited, or '' for new

  // Where a "Try it now" button can send the member (data-* attributes the member app understands)
  const TARGETS = [
    ['', 'No button'], ['data-modal="escalate"', 'Escalate a loan form'], ['data-modal="connect"', 'Connect a lender form'],
    ['data-modal="changeae"', 'Change AE form'], ['data-modal="escalations"', 'Buy escalations'], ['data-nav="requests"', 'My Requests'],
    ['data-nav="lenders"', 'Lenders'], ['data-nav="market"', 'Market'], ['data-nav="documents"', 'Documents'], ['data-nav="events"', 'Events'],
    ['data-nav="fuse"', 'FUSE registration'], ['data-nav="support"', 'Get support'], ['data-nav="settings"', 'Settings → Profile'],
    ['data-nav="settings" data-tab="billing"', 'Settings → Billing'], ['data-nav="settings" data-tab="security"', 'Settings → Email & password'],
    ['data-tour-start', 'Start the walkthrough'], ['data-modal="bug"', 'Report a bug'],
  ];

  const SAMPLE_MISSES = [
    { q: 'non qm bank statement lenders', n: 14 }, { q: 'w9 for vendor', n: 9 }, { q: 'cancel membership', n: 7 },
    { q: 'add team member to account', n: 6 }, { q: 'ce credits', n: 4 },
  ];
  function misses() {
    let live = [];
    try { live = JSON.parse(localStorage.getItem('amp-kb-misses')) || []; } catch (e) { /* ignore */ }
    const counts = {};
    live.forEach((m) => { const k = m.q.toLowerCase(); counts[k] = (counts[k] || 0) + 1; });
    const fromLive = Object.entries(counts).map(([q, n]) => ({ q, n, live: true }));
    return [...fromLive, ...SAMPLE_MISSES].sort((a, b) => b.n - a.n).slice(0, 8);
  }

  /* ---------- page ---------- */
  function render() {
    const pub = ARTS.filter((a) => a.status === 'Published');
    const views = ARTS.reduce((s, a) => s + a.views, 0);
    const y = ARTS.reduce((s, a) => s + a.helpful[0], 0), n = ARTS.reduce((s, a) => s + a.helpful[1], 0);
    const tile = (cls, ico, val, lbl) => `<div class="stat"><div class="s-ico ${cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${ico}</svg></div><div class="s-val">${val}</div><div class="s-lbl">${lbl}</div></div>`;
    $('kb-stats').innerHTML =
      tile('i-cyan', '<path d="M4 19V5a2 2 0 012-2h12v18H6a2 2 0 01-2-2zM4 19a2 2 0 012-2h12"/>', `${pub.length}<span style="font-size:14px;color:var(--muted);font-weight:600"> / ${ARTS.length}</span>`, 'Published guides') +
      tile('i-navy', '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>', views.toLocaleString(), 'Article views') +
      tile('i-green', '<path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.3a2 2 0 002-1.7l1.4-9A2 2 0 0019.7 9z"/>', pct(y, n), 'Found it helpful') +
      tile('i-pink', '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>', misses().reduce((s, m) => s + m.n, 0), 'Searches with no results');

    const q = ($('kb-admin-q').value || '').toLowerCase(), c = $('kb-admin-cat').value, st = $('kb-admin-status').value;
    const rows = ARTS.filter((a) => (c === 'all' || a.category === c) && (st === 'all' || a.status === st) &&
      (!q || (a.title + ' ' + a.summary + ' ' + a.tags.join(' ')).toLowerCase().includes(q)));
    $('kb-tbody').innerHTML = rows.length ? rows.map((a) => `<tr>
        <td><div class="t-strong">${esc(a.title)}</div><div class="t-sub">${esc(a.summary)}</div></td>
        <td>${CATS[a.category].name}</td>
        <td><span class="badge ${a.status === 'Published' ? 'badge-green' : 'badge-amber'}">${a.status}</span></td>
        <td>${a.views.toLocaleString()}</td>
        <td>${pct(a.helpful[0], a.helpful[1])}</td>
        <td>${a.updated}</td>
        <td class="t-right"><div class="row-actions">
          ${a.status === 'Published' ? `<a class="link-act" href="index.html#article=${a.slug}" target="_blank" rel="noopener">Preview</a>` : ''}
          <button class="icon-act" data-kb-edit="${a.slug}" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg></button>
        </div></td></tr>`).join('')
      : '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:28px">No articles match these filters.</td></tr>';
    $('kb-count').textContent = `${rows.length} article${rows.length === 1 ? '' : 's'}`;

    $('kb-misses').innerHTML = misses().map((m) => `<div class="kb-miss"><q>${esc(m.q)}</q>
      <span>${m.n}× ${m.live ? '· this browser' : ''} <button class="link-act" style="margin-left:8px" data-kb-new="${esc(m.q)}">Write guide</button></span></div>`).join('');
  }

  /* ---------- editor ---------- */
  function openEditor(slug, seedTitle) {
    editing = slug;
    const a = slug ? ARTS.find((x) => x.slug === slug)
      : { title: seedTitle ? seedTitle.charAt(0).toUpperCase() + seedTitle.slice(1) : '', category: 'start', summary: '', tags: seedTitle ? [seedTitle] : [], status: 'Draft', actions: [], body: '<p></p>' };
    const act = a.actions[0] || { label: '', attr: '' };
    $('kb-edit-title').textContent = slug ? 'Edit article' : 'New article';
    $('kb-edit-sub').textContent = slug ? a.title : 'Add a guide to the member Help Center.';
    $('kb-edit-body').innerHTML = `
      <div class="field"><label>Title</label><input class="input" id="kbe-title" value="${esc(a.title)}" placeholder="e.g. How to escalate a loan"></div>
      <div class="field-row">
        <div class="field"><label>Topic</label><select class="select" id="kbe-cat">${Object.entries(CATS).map(([k, c]) => `<option value="${k}" ${k === a.category ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
        <div class="field"><label>Status</label><select class="select" id="kbe-status">${['Published', 'Draft'].map((s) => `<option ${s === a.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
      </div>
      <div class="field"><label>Summary</label><input class="input" id="kbe-summary" value="${esc(a.summary)}" placeholder="One line shown in lists and search results"></div>
      <div class="field"><label>Search tags <span style="color:var(--muted);font-weight:500">(comma-separated — words members might search for)</span></label><input class="input" id="kbe-tags" value="${esc(a.tags.join(', '))}"></div>
      <div class="field-row">
        <div class="field"><label>"Try it now" button</label><select class="select" id="kbe-act">${TARGETS.map(([v, l]) => `<option value='${v}' ${v === act.attr ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div class="field"><label>Button label</label><input class="input" id="kbe-act-label" value="${esc(act.label)}" placeholder="e.g. Escalate a loan"></div>
      </div>
      <div class="field"><label>Article body</label><textarea class="input kb-editor" id="kbe-body">${esc(a.body.trim())}</textarea>
        <p class="t-sub" style="margin-top:6px">Prototype uses HTML. Production uses the rich-text editor (TipTap) the live admin already has — numbered steps, tips, links, images.</p></div>`;
    openModal('kb-edit');
  }

  function save() {
    const title = $('kbe-title').value.trim();
    if (!title) { $('kbe-title').focus(); return; }
    const attr = $('kbe-act').value, label = $('kbe-act-label').value.trim();
    const data = {
      title, category: $('kbe-cat').value, status: $('kbe-status').value, summary: $('kbe-summary').value.trim(),
      tags: $('kbe-tags').value.split(',').map((t) => t.trim()).filter(Boolean),
      actions: attr ? [{ attr, label: label || $('kbe-act').selectedOptions[0].text }] : [],
      body: $('kbe-body').value, updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    data.minutes = Math.max(1, Math.round(data.body.replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200));
    if (editing) Object.assign(ARTS.find((x) => x.slug === editing), data);
    else ARTS.push(Object.assign({ slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), popular: false, views: 0, helpful: [0, 0] }, data));
    closeModals(); render();
    showToast(editing ? 'Article saved.' : (data.status === 'Published' ? 'Article published to the Help Center.' : 'Draft saved.'));
  }

  /* ---------- events ---------- */
  $('kb-admin-cat').innerHTML = '<option value="all">All topics</option>' + Object.entries(CATS).map(([k, c]) => `<option value="${k}">${c.name}</option>`).join('');
  ['kb-admin-q', 'kb-admin-cat', 'kb-admin-status'].forEach((id) => $(id).addEventListener(id === 'kb-admin-q' ? 'input' : 'change', render));
  $('kbe-save').addEventListener('click', save);
  document.addEventListener('click', (e) => {
    let m;
    if ((m = e.target.closest('[data-kb-edit]'))) { e.preventDefault(); openEditor(m.dataset.kbEdit); return; }
    if ((m = e.target.closest('[data-kb-new]'))) { e.preventDefault(); openEditor('', m.dataset.kbNew); return; }
  });
  window.addEventListener('storage', (e) => { if (e.key === 'amp-kb-misses') render(); });
  render();
})();
