/* ============================================================
   AMP Admin — Bulk edit + scheduled publish on content lists
   ------------------------------------------------------------
   Lenders, Market, The Vault, Events, Hubs, and Documents get a
   checkbox on every row (drafts first, then scheduled, then live).
   Select several (or "Select all drafts") and a bar appears:
     • Publish — makes selected drafts / scheduled items live now.
     • Schedule — picks a date and time (Eastern) for selected
       drafts / scheduled items to go live on their own.
     • Move to draft — takes selected live / scheduled items down
       (cancels a schedule). Nothing is deleted.
     • Delete — removes the selected items for good. Events that
       have registrations can't be deleted (move them to draft).
       Deleted documents drop off every item they were linked to.
   Every action confirms first and lists exactly what will change;
   items already in that state are skipped and named in the note.
   Each one is logged in the Activity log (via showToast).
   The item editor's Status gets "Scheduled" with a Publish on
   date + time, and saving keeps the status (wraps openEdit).
   A Vault item gets its publish date as its Published date.
   Prototype: in memory (resets on reload); nothing publishes on
   its own. Prototype "now" = Jun 25, 2026, 12:00 PM ET.
   Uses admin.js globals: lenders, vendors, resources, events,
   hubs, documents, render* functions, openEdit, editing,
   openModal, closeModals, showToast.
   ============================================================ */
(function () {
  if (typeof renderResources !== 'function') return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TODAY = 'Jun 25, 2026', NOW = '2026-06-25T12:00';

  // kind = the data-edit prefix each row already carries (e.g. data-edit="resource:4")
  const LISTS = [
    { kind: 'lender',   tbody: 'lenders-tbody',   render: 'renderLenders',   arr: () => lenders,   name: (x) => x.name,  one: 'lender',   many: 'lenders' },
    { kind: 'vendor',   tbody: 'vendors-tbody',   render: 'renderVendors',   arr: () => vendors,   name: (x) => x.name,  one: 'product',  many: 'products' },
    { kind: 'resource', tbody: 'resources-tbody', render: 'renderResources', arr: () => resources, name: (x) => x.title, one: 'resource', many: 'resources' },
    { kind: 'event',    tbody: 'events-tbody',    render: 'renderEvents',    arr: () => events,    name: (x) => x.title, one: 'event',    many: 'events' },
    { kind: 'hub',      tbody: 'hubs-tbody',      render: 'renderHubs',      arr: () => hubs,      name: (x) => x.name,  one: 'hub',      many: 'hubs' },
    { kind: 'document', tbody: 'documents-tbody', render: 'renderDocuments', arr: () => documents, name: (x) => x.title, one: 'document', many: 'documents' },
  ];
  const sel = {};                       // kind -> Set of indexes
  LISTS.forEach((L) => { sel[L.kind] = new Set(); });
  const byKind = (k) => LISTS.find((L) => L.kind === k);
  const plural = (L, n) => `${n} ${n === 1 ? L.one : L.many}`;

  /* ---------- dates ---------- */
  const fmtDate = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const fmtTime = (t) => { const [h, m] = t.split(':').map(Number); return `${(h % 12) || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
  const when = (p) => `${fmtDate(p.date)} at ${fmtTime(p.time)} ET`;
  const scheduleProblem = (date, time) => !date || !time ? 'Pick a date and a time.'
    : `${date}T${time}` <= NOW ? 'Pick a date and time in the future.' : '';
  const dateTimeFields = (p, id) => `<div class="field-row bk-when">
      <div class="field"><label for="${id}-date">Publish on</label><input class="input" type="date" id="${id}-date" value="${p ? p.date : '2026-06-26'}" min="2026-06-25"></div>
      <div class="field"><label for="${id}-time">Time (Eastern)</label><input class="input" type="time" id="${id}-time" value="${p ? p.time : '09:00'}" step="900"></div>
    </div><div class="hint">Goes live on its own at this time for every member who can see it.</div>
    <div class="hint bk-err" id="${id}-err" hidden></div>`;

  // What each action applies to, by status
  const ACTIONS = {
    publish:  { from: ['Draft', 'Scheduled'] },
    schedule: { from: ['Draft', 'Scheduled'] },
    draft:    { from: ['Active', 'Scheduled'] },
    delete:   { from: ['Draft', 'Scheduled', 'Active'] },
  };
  const hasRegs = (L, x) => L.kind === 'event' && ((window.AmpEventReg && AmpEventReg.regsFor(x.title).length) || x.regs > 0);
  const canDo = (action, L, x) => ACTIONS[action].from.includes(x.status) && !(action === 'delete' && hasRegs(L, x));

  /* ---------- checkboxes on each table ---------- */
  function rowIndex(tr, L) {
    const b = tr.querySelector(`[data-edit^="${L.kind}:"]`);
    return b ? +b.dataset.edit.split(':')[1] : -1;
  }
  function decorate(L) {
    const tbody = $(L.tbody); if (!tbody) return;
    const table = tbody.closest('table');
    const headRow = table.querySelector('thead tr');
    if (!headRow.querySelector('.bk-col')) headRow.insertAdjacentHTML('afterbegin', `<th class="bk-col"><input type="checkbox" class="bk-check" data-bk-all="${L.kind}" aria-label="Select all"></th>`);
    sel[L.kind].forEach((i) => { if (!L.arr()[i]) sel[L.kind].delete(i); });
    const order = { Draft: 0, Scheduled: 1 };
    const rows = [...tbody.querySelectorAll('tr')];
    rows.forEach((tr) => {
      if (tr.querySelector('.bk-col')) return;
      const i = rowIndex(tr, L), x = L.arr()[i];
      tr.insertAdjacentHTML('afterbegin', i < 0 ? '<td class="bk-col"></td>'
        : `<td class="bk-col"><input type="checkbox" class="bk-check" data-bk="${L.kind}:${i}" aria-label="Select ${esc(L.name(x))}"${sel[L.kind].has(i) ? ' checked' : ''}></td>`);
      tr.classList.toggle('bk-selected', sel[L.kind].has(i));
      // Scheduled: show when it goes live under the status
      const dot = x && x.status === 'Scheduled' && tr.querySelector('.dot-status');
      if (dot && x.publishAt && !dot.parentElement.querySelector('.bk-when-note')) dot.insertAdjacentHTML('afterend', `<div class="t-sub bk-when-note">Goes live ${esc(when(x.publishAt))}</div>`);
    });
    // Drafts first, then scheduled, then live — stable within each group
    rows.map((tr, n) => { const x = L.arr()[rowIndex(tr, L)]; return { tr, n, o: x && x.status in order ? order[x.status] : 2 }; })
      .sort((a, b) => a.o - b.o || a.n - b.n).forEach(({ tr }) => tbody.appendChild(tr));
    bar(L);
  }
  const visibleIdx = (L) => [...$(L.tbody).querySelectorAll('[data-bk]')].map((c) => +c.dataset.bk.split(':')[1]);

  /* ---------- the bar above each table ---------- */
  function bar(L) {
    const wrap = $(L.tbody).closest('.table-wrap');
    let el = wrap.previousElementSibling && wrap.previousElementSibling.classList.contains('bk-bar') ? wrap.previousElementSibling : null;
    if (!el) { wrap.insertAdjacentHTML('beforebegin', `<div class="bk-bar" data-bk-bar="${L.kind}"></div>`); el = wrap.previousElementSibling; }
    const arr = L.arr(), s = [...sel[L.kind]], vis = visibleIdx(L);
    const count = (list, st) => list.filter((i) => arr[i] && arr[i].status === st).length;
    const all = $(L.tbody).closest('table').querySelector('[data-bk-all]');
    if (all) { all.checked = vis.length > 0 && vis.every((i) => sel[L.kind].has(i)); all.indeterminate = !all.checked && vis.some((i) => sel[L.kind].has(i)); }
    if (!s.length) {
      const d = count(vis, 'Draft'), sc = count(vis, 'Scheduled');
      el.className = 'bk-bar idle';
      el.innerHTML = [d && `<span class="dot-status dot-draft">${d} draft${d === 1 ? '' : 's'}</span>`, sc && `<span class="dot-status dot-scheduled">${sc} scheduled</span>`].filter(Boolean).join('')
        + (d ? `<span class="bk-note">not live yet.</span><button class="link-act" data-bk-drafts="${L.kind}">Select all drafts</button>` : sc ? '<span class="bk-note">not live yet.</span>' : '');
      el.hidden = !(d || sc);
      return;
    }
    const n = (a) => s.filter((i) => canDo(a, L, arr[i])).length;
    const btn = (a, label, cls, why) => { const k = n(a); return `<button class="btn ${cls} btn-sm" data-bk-act="${a}:${L.kind}"${k ? '' : ` disabled title="${why}"`}>${label}${k && a !== 'draft' ? ` ${k}` : ''}</button>`; };
    el.hidden = false; el.className = 'bk-bar on';
    el.innerHTML = `<strong>${s.length} selected</strong><span class="bk-sub">${[['Draft', 'draft'], ['Scheduled', 'scheduled'], ['Active', 'live']].map(([st, w]) => { const k = count(s, st); return k && `${k} ${w}${st === 'Draft' && k > 1 ? 's' : ''}`; }).filter(Boolean).join(' · ')}</span>
      <span class="bk-spacer"></span>
      ${btn('publish', 'Publish', 'btn-primary', 'None of the selected items are drafts or scheduled')}
      ${btn('schedule', 'Schedule', 'btn-outline', 'None of the selected items are drafts or scheduled')}
      ${btn('draft', 'Move to draft', 'btn-outline', 'None of the selected items are live or scheduled')}
      ${btn('delete', 'Delete', 'btn-outline bk-danger', 'Events with registrations can’t be deleted')}
      <button class="link-act" data-bk-clear="${L.kind}">Clear</button>`;
  }

  /* ---------- confirm + apply ---------- */
  let pending = null;
  document.body.insertAdjacentHTML('beforeend', `<div class="modal-overlay" id="modal-bulk">
    <div class="modal" style="max-width:520px">
      <div class="modal-head"><div><h2 id="bk-m-title">Publish</h2><p id="bk-m-sub"></p></div>
        <button class="modal-close" data-close><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>
      <div class="modal-body" id="bk-m-body"></div>
      <div class="modal-foot"><button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-primary" id="bk-m-go">Publish</button></div>
    </div></div>`);

  const COPY = {
    publish:  { title: (n) => `Publish ${n} now?`, sub: 'They go live right away for every member who can see them. Any schedule is replaced.', go: (n) => `Publish ${n}`,
                skip: 'already live' },
    schedule: { title: (n) => `Schedule ${n}?`, sub: 'They stay hidden until the time you pick, then go live on their own.', go: (n) => `Schedule ${n}`,
                skip: 'already live' },
    draft:    { title: (n) => `Move ${n} to draft?`, sub: 'Members won’t see them until they’re published again. Any schedule is cancelled. Nothing is deleted.', go: () => 'Move to draft',
                skip: 'already a draft' },
    delete:   { title: (n) => `Delete ${n}?`, sub: 'This can’t be undone. To hide something without losing it, move it to draft instead.', go: (n) => `Delete ${n}`,
                skip: '' },
  };
  function ask(action, L) {
    const arr = L.arr();
    const idx = [...sel[L.kind]].filter((i) => canDo(action, L, arr[i]));
    const skipped = [...sel[L.kind]].filter((i) => !canDo(action, L, arr[i]));
    if (!idx.length) return;
    pending = { action, L, idx };
    const n = plural(L, idx.length), C = COPY[action];
    $('bk-m-title').textContent = C.title(n);
    $('bk-m-sub').textContent = C.sub + (action === 'delete' && L.kind === 'document' ? ' Deleted documents are removed from every item they’re attached to.' : '');
    const skipNote = !skipped.length ? '' : `<p class="hint" style="margin-top:10px">${action === 'delete'
      ? `Not deleted — events with registrations can’t be deleted (move them to draft instead): ${skipped.map((i) => esc(L.name(arr[i]))).join(', ')}.`
      : `${skipped.length} selected ${skipped.length === 1 ? 'item is' : 'items are'} ${C.skip} and won’t change.`}</p>`;
    $('bk-m-body').innerHTML = `<ul class="bk-list">${idx.map((i) => `<li>${esc(L.name(arr[i]))}${arr[i].status === 'Scheduled' && arr[i].publishAt ? ` <span class="t-sub" style="display:inline">· scheduled ${esc(when(arr[i].publishAt))}</span>` : ''}</li>`).join('')}</ul>
      ${skipNote}${action === 'schedule' ? `<div style="margin-top:14px">${dateTimeFields(null, 'bk-s')}</div>` : ''}`;
    const go = $('bk-m-go');
    go.textContent = C.go(n);
    go.classList.toggle('bk-danger-solid', action === 'delete');
    openModal('bulk');
  }
  function apply() {
    if (!pending) return;
    const { action, L, idx } = pending;
    const arr = L.arr();
    let at = null;
    if (action === 'schedule') {
      const date = $('bk-s-date').value, time = $('bk-s-time').value, err = scheduleProblem(date, time);
      if (err) { $('bk-s-err').textContent = err; $('bk-s-err').hidden = false; return; }
      at = { date, time };
    }
    pending = null;
    const names = idx.map((i) => L.name(arr[i]));
    if (action === 'delete') {
      idx.slice().sort((a, b) => b - a).forEach((i) => arr.splice(i, 1));
      if (L.kind === 'document' && window.AmpDocLinks) names.forEach((t) => AmpDocLinks.dropDocument(t));
    } else {
      idx.forEach((i) => {
        const x = arr[i];
        if (action === 'publish') { x.status = 'Active'; delete x.publishAt; if (L.kind === 'resource' && (!x.pub || x.pub === '—')) x.pub = TODAY; }
        if (action === 'draft') { x.status = 'Draft'; delete x.publishAt; }
        if (action === 'schedule') { x.status = 'Scheduled'; x.publishAt = { ...at }; if (L.kind === 'resource') x.pub = fmtDate(at.date); }
      });
    }
    sel[L.kind].clear();
    closeModals();
    window[L.render]();
    const n = plural(L, idx.length);
    showToast({ publish: `Published ${n}.`, draft: `Moved ${n} to draft.`, delete: `Deleted ${n}.`, schedule: `Scheduled ${n} to publish ${at && when(at)}.` }[action]);
  }

  /* ---------- the item editor: Scheduled + Publish on ---------- */
  function statusSelect() {
    const f = [...document.querySelectorAll('#modal-edit .field')].find((x) => (x.querySelector('label') || {}).textContent === 'Status');
    return f && f.querySelector('select');
  }
  const origOpen = window.openEdit;
  if (typeof origOpen === 'function') {
    window.openEdit = function (ref) {
      const r = origOpen.apply(this, arguments);
      const [type, id] = String(ref).split(':'), L = byKind(type), s = L && statusSelect();
      if (!s) return r;
      const x = id === 'new' ? null : L.arr()[+id];
      if (![...s.options].some((o) => o.value === 'Scheduled')) s.insertAdjacentHTML('beforeend', '<option>Scheduled</option>');
      if (x) s.value = x.status;
      s.id = 'bk-ed-status';
      (s.closest('.field-row') || s.closest('.field')).insertAdjacentHTML('afterend', `<div id="bk-ed-when"${s.value === 'Scheduled' ? '' : ' hidden'}>${dateTimeFields(x && x.publishAt, 'bk-ed')}</div>`);
      return r;
    };
  }
  document.addEventListener('change', (e) => {
    if (e.target.id === 'bk-ed-status') $('bk-ed-when').hidden = e.target.value !== 'Scheduled';
  });
  // Save: check the schedule, then keep the status (runs before admin.js's own save toast).
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#edit-save') || !$('bk-ed-status') || typeof editing === 'undefined' || !editing) return;
    const L = byKind(editing.type); if (!L) return;
    const status = $('bk-ed-status').value;
    let at = null;
    if (status === 'Scheduled') {
      const date = $('bk-ed-date').value, time = $('bk-ed-time').value, err = scheduleProblem(date, time);
      if (err) { e.preventDefault(); e.stopImmediatePropagation(); $('bk-ed-err').textContent = err; $('bk-ed-err').hidden = false; return; }
      at = { date, time };
    }
    if (editing.idx < 0) return;   // new items: the prototype doesn't add them to the list
    const x = L.arr()[editing.idx];
    x.status = status;
    if (at) { x.publishAt = at; if (L.kind === 'resource') x.pub = fmtDate(at.date); } else delete x.publishAt;
    if (status === 'Active' && L.kind === 'resource' && (!x.pub || x.pub === '—')) x.pub = TODAY;
    setTimeout(() => window[L.render]());
  }, true);

  /* ---------- events ---------- */
  document.addEventListener('change', (e) => {
    const c = e.target;
    if (c.matches('[data-bk]')) {
      const [k, i] = c.dataset.bk.split(':');
      c.checked ? sel[k].add(+i) : sel[k].delete(+i);
      c.closest('tr').classList.toggle('bk-selected', c.checked);
      bar(byKind(k));
    } else if (c.matches('[data-bk-all]')) {
      const L = byKind(c.dataset.bkAll);
      visibleIdx(L).forEach((i) => (c.checked ? sel[L.kind].add(i) : sel[L.kind].delete(i)));
      window[L.render]();
    }
  });
  document.addEventListener('click', (e) => {
    let t;
    if ((t = e.target.closest('[data-bk-drafts]'))) {
      const L = byKind(t.dataset.bkDrafts);
      visibleIdx(L).forEach((i) => { if (L.arr()[i].status === 'Draft') sel[L.kind].add(i); });
      window[L.render]();
    } else if ((t = e.target.closest('[data-bk-clear]'))) {
      const L = byKind(t.dataset.bkClear); sel[L.kind].clear(); window[L.render]();
    } else if ((t = e.target.closest('[data-bk-act]'))) {
      const [action, k] = t.dataset.bkAct.split(':'); ask(action, byKind(k));
    } else if (e.target.closest('#bk-m-go')) {
      e.preventDefault(); apply();
    }
  });

  /* ---------- hook into each list's render ---------- */
  LISTS.forEach((L) => {
    const orig = window[L.render]; if (typeof orig !== 'function') return;
    window[L.render] = function () { const r = orig.apply(this, arguments); decorate(L); return r; };
    decorate(L);
  });
  window.AmpBulk = { selected: (k) => [...sel[k]] };
})();
