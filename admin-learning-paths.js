/* ============================================================
   AMP Admin — Content → Learning paths
   ------------------------------------------------------------
   Set up the Learning paths on the member home page.
   - List: every path in home-page order (move up / down), its
     steps, whether it includes VIP-only content, Published / Draft,
     Edit and Delete.
   - Add / edit: Title, Description, Who it's for (optional),
     Status, and the steps — pick from the portal's resources, hub
     videos and events, documents, and events; reorder or remove.
     Title, description and at least one step are required.
   - Delete asks to confirm; members lose their progress on it.
   - Only Published paths show to members. VIP-only steps show to
     other tiers locked.
   Data: learning-paths-store.js (AmpPaths), shared with the member
   app. Uses admin.js globals: openModal, closeModals, showToast,
   navigate.
   ============================================================ */
(function () {
  const P = window.AmpPaths;
  const nav = document.querySelector('#sidebar .nav-item[data-nav="featured"]');
  if (!P || !nav) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`;
  const ICO = {
    path: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15"/><circle cx="18" cy="5" r="3"/>',
    up: '<path d="M18 15l-6-6-6 6"/>', down: '<path d="M6 9l6 6 6-6"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    del: '<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>', search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
  };
  const KIND = { resource: 'Resource', event: 'Event', hub: 'Hub', doc: 'Document' };

  /* ---------- sidebar, page, modals ---------- */
  nav.insertAdjacentHTML('afterend', `<button class="nav-item" data-nav="paths">${svg(ICO.path)} Learning paths</button>`);
  $('view-featured').insertAdjacentHTML('afterend', `
    <section class="view" id="view-paths">
      <div class="adm-section-head">
        <div class="page-head" style="margin:0"><h1>Learning paths</h1><p>Ordered collections of resources, hub videos, documents, and events, shown on the member home page under Featured.</p></div>
        <button class="btn btn-primary" data-lpa-edit="new">+ Add learning path</button>
      </div>
      <div class="callout" style="max-width:900px">${svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r="1.1" fill="currentColor" stroke="none"/>')}<p>Members see <strong>Published</strong> paths in this order. A step from a VIP-only hub shows to other tiers locked, with the membership it needs. A step counts as done once the member opens it.</p></div>
      <div class="table-wrap" style="max-width:900px"><div class="table-scroll"><table class="adm lpa-table">
        <thead><tr><th>Order</th><th>Learning path</th><th>Steps</th><th>Status</th><th class="t-right">Actions</th></tr></thead>
        <tbody id="lpa-tbody"></tbody>
      </table></div></div>
      <div class="count-note" id="lpa-count" style="margin-top:10px"></div>
    </section>`);
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="modal-lpath"><div class="modal" style="max-width:640px">
      <div class="modal-head"><div><h2 id="lpa-m-title">Learning path</h2><p id="lpa-m-sub"></p></div>
        <button class="modal-close" data-close aria-label="Close">${svg(ICO.x).replace('<svg', '<svg style="width:18px;height:18px"')}</button></div>
      <div class="modal-body" id="lpa-m-body"></div>
      <div class="modal-foot"><button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-primary" id="lpa-save">Save</button></div>
    </div></div>
    <div class="modal-overlay" id="modal-lpath-del"><div class="modal" style="max-width:440px">
      <div class="modal-head"><div><h2>Delete learning path?</h2><p id="lpa-del-sub"></p></div>
        <button class="modal-close" data-close aria-label="Close">${svg(ICO.x).replace('<svg', '<svg style="width:18px;height:18px"')}</button></div>
      <div class="modal-body"><p style="margin:0;font-size:14px;color:var(--ink-soft)">It comes off the member home page, and members lose their progress on it. This can't be undone. To hide it for now, set it to <strong>Draft</strong> instead.</p></div>
      <div class="modal-foot"><button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-danger" id="lpa-del-go">Delete</button></div>
    </div></div>`);

  /* ---------- list ---------- */
  function render() {
    const list = P.all();
    $('lpa-tbody').innerHTML = list.map((p, i) => `<tr>
        <td><div class="lpa-order"><button class="icon-act" data-lpa-move="${p.id}:-1" title="Move up" ${i ? '' : 'disabled'}>${svg(ICO.up)}</button><button class="icon-act" data-lpa-move="${p.id}:1" title="Move down" ${i < list.length - 1 ? '' : 'disabled'}>${svg(ICO.down)}</button></div></td>
        <td style="min-width:260px"><div class="t-strong">${esc(p.title)}${P.includesVIP(p) ? ' <span class="lpa-vip">Includes VIP</span>' : ''}</div><div class="t-sub">${esc(p.desc)}</div>${p.for ? `<div class="t-sub">For: ${esc(p.for)}</div>` : ''}</td>
        <td>${p.steps.length}</td>
        <td><span class="badge ${p.status === 'Published' ? 'badge-green' : 'badge-amber'}">${p.status}</span></td>
        <td class="t-right"><div class="row-actions"><button class="icon-act" data-lpa-edit="${p.id}" title="Edit">${svg(ICO.edit)}</button><button class="icon-act danger" data-lpa-del="${p.id}" title="Delete">${svg(ICO.del)}</button></div></td>
      </tr>`).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:28px">No learning paths yet — add one.</td></tr>';
    const pub = list.filter((p) => p.status === 'Published').length;
    $('lpa-count').textContent = `${list.length} learning path${list.length === 1 ? '' : 's'} · ${pub} published · ${list.length - pub} draft`;
  }

  /* ---------- editor ---------- */
  let draft = null;
  function openEditor(id) {
    const p = id === 'new' ? null : P.get(id);
    draft = p ? JSON.parse(JSON.stringify(p)) : { title: '', desc: '', for: '', status: 'Draft', steps: [] };
    draft.isNew = !p;
    $('lpa-m-title').textContent = p ? 'Edit learning path' : 'Add learning path';
    $('lpa-m-sub').textContent = p ? p.title : 'Put sessions in order so members know what to watch first.';
    $('lpa-m-body').innerHTML = `
      <div class="field"><label>Title <span class="req">*</span></label><input class="input" id="lpa-title" value="${esc(draft.title)}" placeholder="e.g. Start Here: Get to Know AIME"></div>
      <div class="field"><label>Description <span class="req">*</span></label><textarea class="input" id="lpa-desc" rows="2" style="min-height:70px" placeholder="One or two sentences on what members get from it">${esc(draft.desc)}</textarea></div>
      <div class="field-row">
        <div class="field"><label>Who it's for</label><input class="input" id="lpa-for" value="${esc(draft.for || '')}" placeholder="e.g. New members (optional)"></div>
        <div class="field"><label>Status</label><select class="select" id="lpa-status"><option ${draft.status === 'Published' ? 'selected' : ''}>Published</option><option ${draft.status === 'Draft' ? 'selected' : ''}>Draft</option></select></div>
      </div>
      <div class="form-section-label">Steps <span class="req">*</span></div>
      <p class="hint" style="margin:-4px 0 10px">In the order members should take them.</p>
      <ol class="lpa-steps" id="lpa-steps"></ol>
      <div class="lpa-add">
        <div class="lpa-search">${svg(ICO.search)}<input class="input" id="lpa-q" placeholder="Add a step — search resources, hub videos, documents, events" autocomplete="off"></div>
        <div class="lpa-results" id="lpa-results" hidden></div>
      </div>
      <div class="er-error" id="lpa-err" hidden></div>`;
    renderSteps();
    openModal('lpath');
  }
  function renderSteps() {
    const n = draft.steps.length;
    $('lpa-steps').innerHTML = n ? draft.steps.map((s, i) => {
      const c = P.info(s) || {};
      return `<li class="lpa-step"><span class="lpa-n">${i + 1}</span>
        <span class="lpa-step-main"><span class="t-strong">${esc(s.t)}</span><span class="t-sub">${esc(c.s || KIND[s.k])}${c.v ? ' <span class="lpa-vip">VIP only</span>' : ''}</span></span>
        <span class="lpa-step-act">
          <button class="icon-act" data-lpa-step="${i}:-1" title="Move up" ${i ? '' : 'disabled'}>${svg(ICO.up)}</button>
          <button class="icon-act" data-lpa-step="${i}:1" title="Move down" ${i < n - 1 ? '' : 'disabled'}>${svg(ICO.down)}</button>
          <button class="icon-act danger" data-lpa-step="${i}:x" title="Remove step">${svg(ICO.x)}</button></span></li>`;
    }).join('') : '<li class="lpa-empty">No steps yet — search below to add the first one.</li>';
  }
  function renderResults() {
    const q = $('lpa-q').value.trim().toLowerCase(), box = $('lpa-results');
    if (!q) { box.hidden = true; return; }
    const taken = new Set(draft.steps.map(P.stepId));
    const hits = P.CATALOG.filter((c) => !taken.has(P.stepId(c)) && `${c.t} ${c.s} ${KIND[c.k]}`.toLowerCase().includes(q)).slice(0, 8);
    box.hidden = false;
    box.innerHTML = hits.length ? hits.map((c) => `<button type="button" class="lpa-hit" data-lpa-add='${esc(JSON.stringify({ k: c.k, t: c.t, h: c.h || '', hk: c.hk || '' }))}'>
        <span class="lpa-kind">${KIND[c.k]}</span><span class="lpa-hit-main"><span class="t-strong">${esc(c.t)}</span><span class="t-sub">${esc(c.s)}${c.v ? ' · VIP only' : ''}</span></span></button>`).join('')
      : '<div class="lpa-none">Nothing matches — or it\'s already a step.</div>';
  }
  function save() {
    draft.title = $('lpa-title').value.trim(); draft.desc = $('lpa-desc').value.trim();
    draft.for = $('lpa-for').value.trim(); draft.status = $('lpa-status').value;
    const missing = [!draft.title && 'a title', !draft.desc && 'a description', !draft.steps.length && 'at least one step'].filter(Boolean);
    const err = $('lpa-err');
    if (missing.length) { err.hidden = false; err.textContent = `Add ${missing.join(', ').replace(/, ([^,]*)$/, ' and $1')}.`; return; }
    const isNew = draft.isNew; delete draft.isNew;
    P.save(draft); closeModals();
    showToast(isNew ? `Learning path created: ${draft.title}.` : `Learning path saved: ${draft.title}.`);
  }

  /* ---------- events ---------- */
  let delId = null;
  document.addEventListener('click', (e) => {
    let m;
    if ((m = e.target.closest('[data-lpa-edit]'))) { e.preventDefault(); openEditor(m.dataset.lpaEdit); return; }
    if ((m = e.target.closest('[data-lpa-move]'))) { e.preventDefault(); const [id, d] = m.dataset.lpaMove.split(':'); P.move(id, +d); return; }
    if ((m = e.target.closest('[data-lpa-del]'))) { e.preventDefault(); delId = m.dataset.lpaDel; $('lpa-del-sub').textContent = (P.get(delId) || {}).title || ''; openModal('lpath-del'); return; }
    if (e.target.closest('#lpa-del-go')) { e.preventDefault(); const t = (P.get(delId) || {}).title; P.remove(delId); closeModals(); showToast(`Deleted learning path: ${t}.`); return; }
    if (e.target.closest('#lpa-save')) { e.preventDefault(); save(); return; }
    if ((m = e.target.closest('[data-lpa-add]'))) {
      e.preventDefault(); draft.steps.push(JSON.parse(m.dataset.lpaAdd));
      $('lpa-q').value = ''; $('lpa-results').hidden = true; $('lpa-err').hidden = true; renderSteps(); $('lpa-q').focus(); return;
    }
    if ((m = e.target.closest('[data-lpa-step]'))) {
      e.preventDefault(); const [i, d] = m.dataset.lpaStep.split(':'); const n = +i;
      if (d === 'x') draft.steps.splice(n, 1);
      else { const j = n + +d; [draft.steps[n], draft.steps[j]] = [draft.steps[j], draft.steps[n]]; }
      renderSteps();
    }
  });
  document.addEventListener('input', (e) => { if (e.target.id === 'lpa-q') renderResults(); });
  document.addEventListener('keydown', (e) => {
    if (e.target.id === 'lpa-q' && e.key === 'Enter') { e.preventDefault(); const first = document.querySelector('#lpa-results [data-lpa-add]'); if (first) first.click(); }
  });

  P.onChange(render);
  render();
  window.AmpAdminPaths = { render, edit: openEditor };
})();
