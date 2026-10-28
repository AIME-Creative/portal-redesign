/* ============================================================
   AMP Admin — collapsible sidebar groups
   ------------------------------------------------------------
   Each sidebar section (Overview, Members, Billing, Communications,
   Content, Access) collapses and expands from its heading — the
   arrow shows which way. All groups start open.
   - Remembered per browser (localStorage amp-admin-nav-v1).
   - Going to a page opens its group, so the current page shows
     (you can still collapse it yourself).
   - A collapsed group shows its items' counts (e.g. open requests)
     on the heading.
   - During the admin walkthrough every group opens, so each step
     can highlight its nav items; your choice comes back after.
   Wraps the existing .nav-label + .nav-item markup — no change to
   admin.html.
   ============================================================ */
(function () {
  const nav = document.querySelector('#sidebar .nav');
  if (!nav) return;
  const KEY = 'amp-admin-nav-v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const write = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode */ } };
  const CHEVRON = '<svg class="ng-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';

  /* ---------- build: label + its items → one group ---------- */
  const groups = [];
  [...nav.querySelectorAll(':scope > .nav-label')].forEach((label, i) => {
    const name = label.textContent.trim();
    const id = 'ng-' + i;
    const items = [];
    for (let n = label.nextElementSibling; n && !n.classList.contains('nav-label'); n = n.nextElementSibling) items.push(n);
    const group = document.createElement('div');
    group.className = 'nav-group';
    group.dataset.group = name;
    group.innerHTML = `<button type="button" class="nav-label nav-group-head" aria-expanded="true" aria-controls="${id}">
        <span>${label.innerHTML}</span><span class="ng-count" hidden></span>${CHEVRON}</button>
      <div class="nav-group-body" id="${id}"><div class="nav-group-inner"></div></div>`;
    label.replaceWith(group);
    items.forEach((x) => group.querySelector('.nav-group-inner').appendChild(x));
    groups.push(group);
  });

  /* ---------- open / closed ---------- */
  let touring = false;
  function set(group, open) {
    group.classList.toggle('collapsed', !open);
    group.querySelector('.nav-group-head').setAttribute('aria-expanded', String(open));
    // Collapsed items leave the tab order.
    group.querySelectorAll('.nav-group-inner > *').forEach((x) => (open ? x.removeAttribute('tabindex') : x.setAttribute('tabindex', '-1')));
    counts(group);
  }
  function counts(group) {
    // Sum the counts of the items inside (only shown while collapsed).
    const n = [...group.querySelectorAll('.nav-count, .nav-badge')].reduce((s, x) => s + (parseInt(x.textContent, 10) || 0), 0);
    const c = group.querySelector('.ng-count');
    if (c.textContent !== String(n)) c.textContent = n;   // only on change — the observer below watches the text
    c.hidden = !n || !group.classList.contains('collapsed');
  }
  function apply() {
    const s = read();
    groups.forEach((g) => set(g, touring || !s[g.dataset.group] || !!g.querySelector('.nav-item.active')));
  }

  nav.addEventListener('click', (e) => {
    const head = e.target.closest('.nav-group-head'); if (!head) return;
    const g = head.closest('.nav-group');
    const open = g.classList.contains('collapsed');
    const s = read(); if (open) delete s[g.dataset.group]; else s[g.dataset.group] = 1; write(s);
    set(g, open);
  });

  // The page you're on stays visible: when you move to another page, its group opens. (You can still
  // collapse the current page's group yourself.)
  let lastActive = nav.querySelector('.nav-item.active');
  new MutationObserver(() => {
    const active = nav.querySelector('.nav-item.active');
    if (active !== lastActive) {
      lastActive = active;
      const g = active && active.closest('.nav-group');
      if (g && g.classList.contains('collapsed')) set(g, true);
    }
    groups.forEach(counts);
  }).observe(nav, { subtree: true, attributes: true, attributeFilter: ['class'], childList: true, characterData: true });

  // Walkthrough: open everything while it runs, restore after.
  new MutationObserver(() => {
    const t = document.body.classList.contains('wt-open');
    if (t !== touring) { touring = t; apply(); }
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  apply();
  window.AmpAdminNavGroups = { reset() { write({}); apply(); } };
})();
