/* ============================================================
   AMP — Walkthrough engine (shared by member + admin tours)
   ------------------------------------------------------------
   Spotlight + card, Next / Back / Skip, keyboard (← → Esc, Tab
   trapped in the card), phone-aware targets, and "seen" memory.
   Each app supplies its own tour:
     walkthrough.js        — member portal  (localStorage amp-tour-v1)
     admin-walkthrough.js  — admin console  (localStorage amp-admin-tour-v1)

   AmpTourEngine(config) → { start, welcome, reset, unseen, isOpen }
     key        localStorage key for seen / skipped
     sections   number of main sections (the dots)
     steps()    the step list, read when a tour starts
     setup(s)   put the screen in the state step s needs (page, form…)
     cleanup()  undo anything setup opened (forms, example values)
     prepare()  before a tour starts (close menus, go to the home page)
     intro()    HTML for the welcome card (buttons data-wt="next" / "skip")
     finish()   HTML for the last card (data-wt="done" / optional "alt")
     onDone(w)  after the last card closes — w is 'done' or 'alt'
     onSkip()   after Skip / Esc

   Step fields: sec (section index), chapter (optional label for a
   group of sub-steps), target / mTarget (selector, element-returning
   function, or list of elements; mTarget is used on phones), title,
   body / mBody, plus anything setup() reads (page, modal…).
   A target that's missing or hidden centers the card instead.
   ============================================================ */
window.AmpTourEngine = function (cfg) {
  const mobile = () => window.matchMedia('(max-width: 860px)').matches;
  let STEPS = [], i = -1, root = null, lastFocus = null;

  /* ---------- persistence ---------- */
  const read = () => { try { return JSON.parse(localStorage.getItem(cfg.key)) || {}; } catch (e) { return {}; } };
  const write = (o) => { try { localStorage.setItem(cfg.key, JSON.stringify(Object.assign(read(), o, { at: new Date().toISOString() }))); } catch (e) { /* private mode */ } };

  /* ---------- DOM ---------- */
  function build() {
    root = document.createElement('div');
    root.className = 'wt-root';
    root.innerHTML = `<div class="wt-shade"></div><div class="wt-spot"></div>
      <div class="wt-card" role="dialog" aria-modal="true" aria-labelledby="wt-title" tabindex="-1"></div>`;
    document.body.appendChild(root);
    root.addEventListener('click', onClick);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    document.addEventListener('animationend', place, true);   // forms / pages animate in — re-measure after
    document.addEventListener('keydown', onKey, true);
  }
  function teardown() {
    if (!root) return;
    window.removeEventListener('resize', place);
    window.removeEventListener('scroll', place, true);
    document.removeEventListener('animationend', place, true);
    document.removeEventListener('keydown', onKey, true);
    cfg.cleanup && cfg.cleanup();
    root.remove(); root = null; i = -1;
    document.body.classList.remove('wt-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  const card = () => root.querySelector('.wt-card');

  // A target can be one element or a list (spotlight covers them all). Returns null if nothing is visible.
  const rectOf = (el) => {
    if (!Array.isArray(el)) return el.getBoundingClientRect();
    const rs = el.map((e) => e.getBoundingClientRect());
    const l = Math.min(...rs.map((r) => r.left)), tp = Math.min(...rs.map((r) => r.top));
    const rt = Math.max(...rs.map((r) => r.right)), b = Math.max(...rs.map((r) => r.bottom));
    return { left: l, top: tp, right: rt, bottom: b, width: rt - l, height: b - tp };
  };
  function targetOf(step) {
    const sel = mobile() && step.mTarget ? step.mTarget : step.target;
    let el = typeof sel === 'function' ? sel() : sel && document.querySelector(sel);
    if (Array.isArray(el)) { el = el.filter(Boolean); if (!el.length) return null; if (el.length === 1) el = el[0]; }
    if (!el) return null;
    const r = rectOf(el);
    if (r.width === 0 || r.right <= 0 || r.left >= window.innerWidth) return null;   // hidden / in a closed drawer
    return el;
  }

  // The sticky top bar and the phone bottom bar sit over the page — keep targets out from under them.
  function insets() {
    const vis = (e) => e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0;
    const tb = document.querySelector('.topbar'), bn = document.querySelector('.bottom-nav');
    const top = vis(tb) && /sticky|fixed/.test(getComputedStyle(tb).position) ? Math.max(0, tb.getBoundingClientRect().bottom) : 0;
    const bottom = vis(bn) ? Math.max(0, window.innerHeight - bn.getBoundingClientRect().top) : 0;
    return { top, bottom };
  }
  function keepClearOfBars(el) {
    if (el.closest && (el.closest('.topbar') || el.closest('.bottom-nav') || el.closest('.sidebar'))) return;   // the bars themselves
    const r = rectOf(el), { top, bottom } = insets(), room = window.innerHeight - bottom;
    if (r.bottom > room - 8 && r.height < room - top - 16) window.scrollBy(0, r.bottom - room + 16);
    else if (r.top < top + 8) window.scrollBy(0, r.top - top - 16);
  }

  /* ---------- render ---------- */
  function renderCentered(html) {
    cfg.cleanup && cfg.cleanup();
    root.classList.add('centered');
    card().innerHTML = html;
    place(); focusPrimary();
  }

  function renderStep() {
    const s = STEPS[i];
    cfg.setup && cfg.setup(s);
    const el = targetOf(s);
    root.classList.toggle('centered', !el);
    if (el) {
      const first = Array.isArray(el) ? el[0] : el;
      const tall = rectOf(el).height > window.innerHeight * 0.55;   // tall targets: show their top, not their middle
      first.scrollIntoView({ block: Array.isArray(el) || first.closest('.sidebar') ? 'nearest' : tall ? 'start' : 'center', inline: 'nearest' });
      keepClearOfBars(el);
    }
    const n = STEPS.length, sections = cfg.sections;
    const chap = s.chapter ? STEPS.filter((x) => x.chapter === s.chapter) : null;
    card().innerHTML = `
      <div class="wt-top"><span class="wt-count">${s.sec + 1} of ${sections}${chap ? ` <span class="wt-chap">· ${s.chapter} ${chap.indexOf(s) + 1}/${chap.length}</span>` : ''}</span>
        <button class="wt-skip" data-wt="skip">Skip tour</button></div>
      <h3 id="wt-title">${s.title}</h3>
      <p>${mobile() && s.mBody ? s.mBody : s.body}</p>
      <div class="wt-foot">
        <div class="wt-dots">${Array.from({ length: sections }, (_, k) => `<span class="${k === s.sec ? 'on' : k < s.sec ? 'done' : ''}"></span>`).join('')}</div>
        <div class="wt-actions">
          ${i > 0 ? '<button class="btn btn-outline btn-sm" data-wt="back">Back</button>' : ''}
          <button class="btn btn-primary btn-sm" data-wt="next">${i === n - 1 ? 'Finish' : 'Next'}</button>
        </div>
      </div>`;
    place(); focusPrimary();
    setTimeout(place, 260);   // re-measure once a form's open animation / page fade settles
  }

  function render() {
    root.classList.remove('centered');
    if (i < 0) renderCentered(cfg.intro(mobile()));
    else if (i >= STEPS.length) renderCentered(cfg.finish(mobile()));
    else renderStep();
  }

  function focusPrimary() { const b = card().querySelector('[data-wt="next"],[data-wt="done"]'); if (b) b.focus({ preventScroll: true }); }

  // Spotlight the target and put the card beside it, clamped to the viewport. When there's no room beside
  // it (tall targets, phones), dock the card to the screen edge away from the target and trim the
  // spotlight so the card never covers it.
  function place() {
    if (!root) return;
    const spot = root.querySelector('.wt-spot'), c = card();
    const s = STEPS[i], el = s && targetOf(s);
    if (!el) { spot.style.display = 'none'; c.style.left = c.style.top = ''; return; }
    const pad = 6, edge = 4, r = rectOf(el);
    const cw = c.offsetWidth, ch = c.offsetHeight, vw = window.innerWidth, vh = window.innerHeight, gap = 16;
    let left, top, minTop = edge, maxBottom = vh - edge;
    if (r.right + gap + cw <= vw - 12) { left = r.right + gap; top = r.top; }                       // right
    else if (r.bottom + gap + ch <= vh - 12) { left = r.left; top = r.bottom + gap; }                // below
    else if (r.top - gap - ch >= 12) { left = r.left; top = r.top - gap - ch; }                      // above
    else if (r.left - gap - cw >= 12) { left = r.left - gap - cw; top = r.top; }                     // left
    else {                                                                                           // dock
      left = (vw - cw) / 2;
      const mid = (Math.max(r.top, 0) + Math.min(r.bottom, vh)) / 2;
      if (mid < vh / 2) { top = vh - ch - 12; maxBottom = top - 8; } else { top = 12; minTop = top + ch + 8; }
    }
    const sTop = Math.max(r.top - pad, minTop), sBottom = Math.min(r.bottom + pad, maxBottom);
    const sLeft = Math.max(r.left - pad, edge), sRight = Math.min(r.right + pad, vw - edge);
    Object.assign(spot.style, { display: 'block', left: sLeft + 'px', top: sTop + 'px', width: Math.max(0, sRight - sLeft) + 'px', height: Math.max(0, sBottom - sTop) + 'px' });
    c.style.left = Math.max(12, Math.min(left, vw - cw - 12)) + 'px';
    c.style.top = Math.max(12, Math.min(top, vh - ch - 12)) + 'px';
  }

  /* ---------- actions ---------- */
  function start(fromIntro) {
    if (root) teardown();
    cfg.prepare && cfg.prepare();
    lastFocus = document.activeElement;
    STEPS = cfg.steps();
    build();
    document.body.classList.add('wt-open');
    i = fromIntro ? -1 : 0;
    render();
  }
  function skip() {
    write({ status: 'skipped', step: i });
    teardown();
    cfg.onSkip && cfg.onSkip(mobile());
  }
  function finish(which) {
    write({ status: 'done' });
    teardown();
    cfg.onDone && cfg.onDone(which);
  }
  function onClick(e) {
    const b = e.target.closest('[data-wt]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const a = b.dataset.wt;
    if (a === 'skip') skip();
    else if (a === 'next') { i++; render(); }
    else if (a === 'back') { i = Math.max(0, i - 1); render(); }
    else if (a === 'done' || a === 'alt') finish(a);
  }
  function onKey(e) {
    if (!root) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); i >= STEPS.length ? finish('done') : skip(); }
    else if (e.key === 'ArrowRight' && i >= 0 && i < STEPS.length) { i++; render(); }
    else if (e.key === 'ArrowLeft' && i > 0 && i < STEPS.length) { i--; render(); }
    else if (e.key === 'Tab') {   // keep focus inside the card
      const f = [...card().querySelectorAll('button')]; if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  return {
    start: () => start(false),
    welcome: () => start(true),
    reset: () => { try { localStorage.removeItem(cfg.key); } catch (e) { /* ignore */ } },
    unseen: () => !read().status,
    isOpen: () => !!root,
  };
};
