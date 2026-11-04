/* ============================================================
   AMP — Learning paths on the member home page
   ------------------------------------------------------------
   Section under Featured: one card per Published path, in the
   order admin set. Each card shows the number of steps, whether it
   includes VIP-only content, a progress bar (one segment per step),
   and the next step ("Start with" / "Continue with" / "Completed").
   Clicking a card opens a side panel listing the steps in order;
   clicking a step opens that exact resource, hub video or event,
   document, or event — and marks it done.
   - VIP-only steps show to everyone but are locked ("Requires VIP
     membership") for other tiers, and are skipped for "next step".
   - Members only (Lender / Vendor users have their own dashboard).
   Data: learning-paths-store.js (AmpPaths). Uses app.js globals:
   resources, events, hubs, generalDocuments, canSeeVIP, userType,
   openResource, openEvent, openHubItem, navigate, filterDocuments.
   ============================================================ */
(function () {
  const P = window.AmpPaths;
  if (!P || typeof userType === 'undefined' || userType !== 'member') return;
  const featured = document.getElementById('featured-grid');
  const anchor = featured && featured.parentElement;
  if (!anchor) return;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`;
  const ICO = {
    resource: '<path d="M4 19V5a2 2 0 012-2h12v18H6a2 2 0 01-2-2zM4 19a2 2 0 012-2h12"/>',
    event: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
    hub: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
    doc: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
  };

  /* ---------- open a step ---------- */
  function opener(s) {
    const at = (list, t) => list.findIndex((x) => (x.title || x.name) === t);
    if (s.k === 'resource') { const i = at(resources, s.t); return i < 0 ? null : () => openResource(i); }
    if (s.k === 'event') { const i = at(events, s.t); return i < 0 ? null : () => openEvent(i); }
    if (s.k === 'hub') {
      const h = hubs[s.h]; const list = h && (s.hk === 'event' ? h.events : h.content); const i = list ? at(list, s.t) : -1;
      return i < 0 ? null : () => openHubItem(s.h, s.hk, i);
    }
    if (s.k === 'doc') { const src = s.h || 'general'; return () => { navigate('documents'); filterDocuments(src); }; }
    return null;
  }
  const locked = (s) => !!(P.info(s) || {}).v && !canSeeVIP;
  function state(p) {
    const done = P.done(p.id);
    const steps = p.steps.map((s) => ({ s, info: P.info(s) || { s: '' }, done: done.includes(P.stepId(s)), locked: locked(s) }));
    const open = steps.filter((x) => !x.locked);
    const next = open.find((x) => !x.done);
    return { steps, next, doneCount: steps.filter((x) => x.done).length, complete: steps.every((x) => x.done) };
  }

  /* ---------- home page section ---------- */
  anchor.insertAdjacentHTML('afterend', `<div class="lp-section" id="learning-paths">
      <div class="section-title" style="margin-bottom:4px"><h2>Learning paths</h2></div>
      <p class="lp-intro">Sessions put in order so you know what to watch first and what comes next.</p>
      <div class="lp-grid" id="lp-grid"></div></div>`);
  function render() {
    const list = P.all().filter((p) => p.status === 'Published' && p.steps.length);
    const sec = document.getElementById('learning-paths');
    sec.hidden = !list.length;
    document.getElementById('lp-grid').innerHTML = list.map((p) => {
      const st = state(p), vip = P.includesVIP(p);
      const nextLine = st.complete ? `<span class="lp-next done">${svg(ICO.check)} Completed — open to watch again</span>`
        : st.next ? `<span class="lp-next">${st.doneCount ? 'Continue with' : 'Start with'}: ${esc(st.next.s.t)}</span>`
        : `<span class="lp-next locked">${svg(ICO.lock)} ${st.doneCount ? 'The rest requires' : 'Requires'} VIP membership</span>`;
      return `<button type="button" class="lp-card" data-lp="${p.id}">
          <span class="lp-meta">${p.steps.length} step${p.steps.length === 1 ? '' : 's'}${vip ? ' · Includes VIP' : ''}</span>
          <span class="lp-title">${esc(p.title)}</span>
          <span class="lp-desc">${esc(p.desc)}</span>
          <span class="lp-bar" aria-label="${st.doneCount} of ${p.steps.length} done">${st.steps.map((x) => `<i class="${x.done ? 'on' : ''}"></i>`).join('')}</span>
          ${nextLine}
        </button>`;
    }).join('');
  }

  /* ---------- side panel ---------- */
  document.body.insertAdjacentHTML('beforeend', `<div class="lp-drawer-wrap" id="lp-drawer" hidden>
      <div class="lp-scrim" data-lp-close></div>
      <aside class="lp-drawer" role="dialog" aria-modal="true" aria-labelledby="lp-d-title">
        <button type="button" class="lp-close" data-lp-close aria-label="Close">${svg(ICO.x)}</button>
        <div id="lp-d-body"></div>
      </aside></div>`);
  let openId = null;
  function renderDrawer() {
    const p = P.get(openId); if (!p) { closeDrawer(); return; }
    const st = state(p);
    document.getElementById('lp-d-body').innerHTML = `
      <div class="lp-d-kicker">Learning path${p.for ? ` · ${esc(p.for)}` : ''}</div>
      <h2 id="lp-d-title">${esc(p.title)}</h2>
      <p class="lp-d-desc">${esc(p.desc)}</p>
      <div class="lp-d-progress"><span class="lp-bar">${st.steps.map((x) => `<i class="${x.done ? 'on' : ''}"></i>`).join('')}</span>
        <span class="lp-d-count">${st.doneCount} of ${p.steps.length} done</span></div>
      <ol class="lp-steps">${st.steps.map((x, n) => `<li>
        <button type="button" class="lp-step${x.done ? ' done' : ''}${x.locked ? ' locked' : ''}${st.next === x ? ' next' : ''}" ${x.locked ? 'disabled' : `data-lp-step="${n}"`}>
          <span class="lp-num">${x.done ? svg(ICO.check) : x.locked ? svg(ICO.lock) : n + 1}</span>
          <span class="lp-step-main"><span class="lp-step-t">${esc(x.s.t)}</span>
            <span class="lp-step-s">${x.locked ? '<span class="lp-lock">Requires VIP membership</span>' : esc(x.info.s)}${st.next === x ? ' <span class="lp-up">Up next</span>' : ''}</span></span>
        </button></li>`).join('')}</ol>
      ${st.doneCount ? '<button type="button" class="link-muted lp-reset" data-lp-reset>Start over</button>' : ''}`;
  }
  function openDrawer(id) {
    openId = id; renderDrawer();
    const d = document.getElementById('lp-drawer'); d.hidden = false;
    requestAnimationFrame(() => d.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    const d = document.getElementById('lp-drawer'); d.classList.remove('open');
    setTimeout(() => { d.hidden = true; }, 200);
    document.body.style.overflow = ''; openId = null;
  }

  document.addEventListener('click', (e) => {
    let m;
    if ((m = e.target.closest('[data-lp]'))) { e.preventDefault(); openDrawer(m.dataset.lp); return; }
    if (e.target.closest('[data-lp-close]')) { e.preventDefault(); closeDrawer(); return; }
    if (e.target.closest('[data-lp-reset]')) { e.preventDefault(); P.resetProgress(openId); renderDrawer(); return; }
    if ((m = e.target.closest('[data-lp-step]'))) {
      e.preventDefault();
      const p = P.get(openId), s = p && p.steps[+m.dataset.lpStep]; const go = s && opener(s);
      if (!go) return;
      P.markDone(p.id, s); closeDrawer(); go();
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openId) closeDrawer(); });

  P.onChange(() => { render(); if (openId) renderDrawer(); });
  render();
  window.AmpLearningPaths = { render, open: openDrawer, close: closeDrawer };
})();
