/* ============================================================
   Review-only Member/Admin toggle  —  REMOVE BEFORE LAUNCH
   Self-contained: injects its own button + styles, no deps.
   On the member side it also switches the tier you're viewing as
   (Premium / Elite / VIP → localStorage amp-proto-tier, read by app.js).
   Included by both index.html and admin.html.
   ============================================================ */
(function () {
  var isAdmin = /admin\.html/i.test(location.pathname);

  // Desktop: just right of the 248px sidebar, bottom-left of the content area
  // (clears the member "Report a bug" button on the right and the sidebar footer).
  // <=860px the sidebar collapses + a bottom nav appears, so drop to the corner above it.
  var css = '' +
    '.rev-toggle{position:fixed;left:264px;bottom:18px;z-index:9999;display:flex;align-items:center;gap:3px;' +
      'background:rgba(2,22,73,.92);border:1px solid rgba(255,255,255,.14);border-radius:999px;' +
      'padding:4px 5px 4px 9px;box-shadow:0 6px 22px rgba(2,22,73,.30);opacity:.72;transition:opacity .15s;' +
      'font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;}' +
    '.rev-toggle:hover{opacity:1;}' +
    '.rev-toggle .rev-tag{color:rgba(255,255,255,.5);font-size:9px;font-weight:700;letter-spacing:.14em;margin-right:5px;}' +
    '.rev-toggle .rev-opt{color:rgba(255,255,255,.72);text-decoration:none;font-size:12px;font-weight:600;' +
      'padding:5px 12px;border-radius:999px;transition:.15s;white-space:nowrap;cursor:pointer;}' +
    '.rev-toggle .rev-opt:hover{color:#fff;background:rgba(255,255,255,.10);}' +
    '.rev-toggle .rev-opt.on{background:#dd1969;color:#fff;}' +
    '.rev-toggle .rev-opt.on:hover{background:#dd1969;}' +
    '.rev-toggle .rev-sep{width:1px;height:18px;background:rgba(255,255,255,.18);margin:0 4px;}' +
    '.rev-toggle .rev-tier{color:rgba(255,255,255,.72);font-size:11.5px;font-weight:600;padding:4px 9px;border-radius:999px;cursor:pointer;' +
      'background:none;border:0;font-family:inherit;}' +
    '.rev-toggle .rev-tier:hover{color:#fff;background:rgba(255,255,255,.10);}' +
    '.rev-toggle .rev-tier.on{background:#fff;color:#021649;}' +
    '@media (max-width:860px){.rev-toggle{left:14px;bottom:78px;}}';

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var el = document.createElement('div');
    el.className = 'rev-toggle';
    el.setAttribute('title', 'Review mode — switch between the member and admin apps. Not included in production.');
    el.innerHTML =
      '<span class="rev-tag">REVIEW</span>' +
      '<a class="rev-opt' + (!isAdmin ? ' on' : '') + '" href="index.html">Member</a>' +
      '<a class="rev-opt' + (isAdmin ? ' on' : '') + '" href="admin.html">Admin</a>';

    // Member side: switch which membership tier you're viewing as (things change by tier —
    // event tickets, VIP hubs, escalation allowance). Saved in localStorage; the page reloads.
    if (!isAdmin) {
      var cur = 'Elite';
      try { cur = localStorage.getItem('amp-proto-tier') || 'Elite'; } catch (e) { /* default */ }
      el.insertAdjacentHTML('beforeend', '<span class="rev-sep"></span><span class="rev-tag" style="margin-right:2px">AS</span>' +
        ['Premium', 'Elite', 'VIP'].map(function (t) {
          return '<button type="button" class="rev-tier' + (t === cur ? ' on' : '') + '" data-rev-tier="' + t + '" title="View the portal as a ' + t + ' member">' + t + '</button>';
        }).join(''));
      el.addEventListener('click', function (e) {
        var b = e.target.closest('[data-rev-tier]');
        if (!b || b.classList.contains('on')) return;
        try { localStorage.setItem('amp-proto-tier', b.getAttribute('data-rev-tier')); } catch (err) { return; }
        location.reload();
      });
    }
    document.body.appendChild(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
