/* ============================================================
   AMP — tables keep pills, tags, and dates on one line when
   there's room (requests.css). If a table would be wider than
   its box with everything on one line, it gets .tf-tight and
   those labels may wrap again instead of scrolling sideways.
   Re-checked whenever a table is drawn, a page or tab is opened,
   and on resize.
   Loaded by the member app, admin, and the lender pages.
   ============================================================ */
(function () {
  let queued = false;
  function fit() {
    queued = false;
    document.querySelectorAll('table').forEach((t) => {
      const box = t.closest('.table-scroll') || t.parentElement;
      if (!box || !t.offsetParent) return;
      box.classList.remove('tf-tight');
      if (box.scrollWidth > box.clientWidth + 1) box.classList.add('tf-tight');
    });
  }
  const queue = () => { if (!queued) { queued = true; setTimeout(fit, 30); } };
  new MutationObserver((list) => { if (list.some((m) => m.type === 'childList')) queue(); })
    .observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('resize', queue);
  document.addEventListener('click', queue);          // switching pages / tabs shows tables that were hidden
  window.addEventListener('hashchange', queue);
  document.addEventListener('DOMContentLoaded', queue);
  queue();
})();
