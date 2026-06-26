/* ============================================================
   Events Schedule (Calendar) — ADD-ON / PROTOTYPE PREVIEW
   ------------------------------------------------------------
   Adds a "Cards / Calendar" toggle to the Events page and a
   month-grid calendar view of the events.

   FULLY SELF-CONTAINED & EASY TO REMOVE:
     • Delete this file, and
     • delete the <script src="events-schedule.js"> line in index.html.
   It injects its own styles and UI, makes NO changes to app.js /
   styles.css, and only reads the existing global `events` array +
   `openEvent` defined by app.js. The default Events page (cards) is
   untouched — calendar is opt-in via the toggle.
   ============================================================ */
(function () {
  function init() {
    // Bail safely if app.js / the Events page aren't present.
    if (typeof events === 'undefined') return;
    var view = document.getElementById('view-events');
    var filters = document.getElementById('event-filters');
    var grid = document.getElementById('event-grid');
    if (!view || !filters || !grid) return;

    /* ---------- styles (injected so removal = just this file) ---------- */
    var css = ''
      + '.sched-toggle{display:inline-flex;gap:2px;background:#fff;border:1px solid var(--line,#e6e8ee);'
        + 'border-radius:999px;padding:3px;margin:0 0 20px;}'
      + '.sched-toggle .seg{padding:7px 16px;border-radius:999px;font-weight:600;font-size:13px;'
        + 'color:var(--ink-soft,#5b6478);transition:.15s;display:flex;align-items:center;gap:6px;}'
      + '.sched-toggle .seg:hover{color:var(--navy,#021649);}'
      + '.sched-toggle .seg.active{background:var(--navy,#021649);color:#fff;}'
      + '.sched-toggle .seg svg{width:15px;height:15px;}'
      + '#event-calendar{background:#fff;border:1px solid var(--line,#e6e8ee);border-radius:16px;'
        + 'padding:18px 20px 22px;box-shadow:0 1px 2px rgba(16,24,40,.04);}'
      + '.cal-head{display:flex;align-items:center;justify-content:center;gap:18px;margin-bottom:16px;}'
      + '.cal-title{font-size:18px;font-weight:700;color:var(--navy,#021649);min-width:170px;text-align:center;}'
      + '.cal-nav{width:34px;height:34px;border-radius:9px;border:1px solid var(--line,#e6e8ee);'
        + 'font-size:18px;color:var(--navy,#021649);background:#fff;transition:.15s;line-height:1;}'
      + '.cal-nav:hover{background:var(--navy,#021649);color:#fff;border-color:var(--navy,#021649);}'
      + '.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}'
      + '.cal-dow{margin-bottom:6px;}'
      + '.cal-dow-c{text-align:center;font-size:11px;font-weight:700;letter-spacing:.06em;'
        + 'text-transform:uppercase;color:var(--muted,#98a0b0);padding:4px 0;}'
      + '.cal-cell{min-height:92px;border:1px solid var(--line-soft,#eef0f4);border-radius:10px;'
        + 'padding:6px;background:#fcfcfd;display:flex;flex-direction:column;gap:4px;overflow:hidden;}'
      + '.cal-cell.empty{border:none;background:transparent;}'
      + '.cal-cell.today{border-color:var(--pink,#dd1969);box-shadow:inset 0 0 0 1px var(--pink,#dd1969);}'
      + '.cal-d{font-size:12px;font-weight:700;color:var(--ink-soft,#5b6478);}'
      + '.cal-cell.today .cal-d{color:var(--pink,#dd1969);}'
      + '.cal-ev{display:block;width:100%;text-align:left;color:#fff;font-size:11px;font-weight:600;'
        + 'line-height:1.25;padding:4px 6px;border-radius:6px;white-space:nowrap;overflow:hidden;'
        + 'text-overflow:ellipsis;cursor:pointer;transition:.12s;}'
      + '.cal-ev:hover{filter:brightness(1.08);transform:translateY(-1px);}'
      + '@media (max-width:680px){.cal-cell{min-height:62px;}.cal-ev{font-size:10px;padding:3px 5px;}'
        + '.cal-dow-c{font-size:9px;}}';
    var style = document.createElement('style');
    style.id = 'sched-style';
    style.textContent = css;
    document.head.appendChild(style);

    /* ---------- parse the existing events into calendar dates ---------- */
    var MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    var MFULL = ['January','February','March','April','May','June','July',
                 'August','September','October','November','December'];
    var DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var parsed = events.map(function (e, idx) {
      var parts = (e.date || '').split(' ');
      return { idx: idx, m: MON.indexOf((parts[0] || '').toUpperCase()),
               d: parseInt(parts[1], 10), y: 2026, e: e };
    }).filter(function (o) { return o.m >= 0 && o.d; });

    /* ---------- inject the toggle + calendar container ---------- */
    var toggle = document.createElement('div');
    toggle.className = 'sched-toggle';
    toggle.innerHTML =
        '<button class="seg active" data-mode="cards">'
      +   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>Cards</button>'
      + '<button class="seg" data-mode="calendar">'
      +   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>Calendar</button>';
    view.insertBefore(toggle, filters);

    var cal = document.createElement('div');
    cal.id = 'event-calendar';
    cal.style.display = 'none';
    view.appendChild(cal);

    /* ---------- month state: start at the earliest event month ---------- */
    var startKey = parsed.reduce(function (min, o) {
      var k = o.y * 12 + o.m; return k < min ? k : min;
    }, parsed.length ? parsed[0].y * 12 + parsed[0].m : 2026 * 12 + 5);
    var curY = Math.floor(startKey / 12), curM = startKey % 12;

    function esc(s) { return String(s).replace(/"/g, '&quot;'); }

    function render() {
      var first = new Date(curY, curM, 1);
      var startDow = first.getDay();
      var daysIn = new Date(curY, curM + 1, 0).getDate();
      var today = new Date();
      var html = '';
      var i;
      for (i = 0; i < startDow; i++) html += '<div class="cal-cell empty"></div>';
      for (var d = 1; d <= daysIn; d++) {
        var isToday = today.getFullYear() === curY && today.getMonth() === curM && today.getDate() === d;
        var chips = parsed.filter(function (o) { return o.y === curY && o.m === curM && o.d === d; })
          .map(function (o) {
            return '<button class="cal-ev" style="background:' + (o.e.g ? o.e.g[0] : '#021649') + '" '
              + 'data-open-event="' + o.idx + '" title="' + esc(o.e.title) + '">' + o.e.title + '</button>';
          }).join('');
        html += '<div class="cal-cell' + (isToday ? ' today' : '') + '">'
          + '<span class="cal-d">' + d + '</span>' + chips + '</div>';
      }
      cal.innerHTML =
          '<div class="cal-head">'
        +   '<button class="cal-nav" data-cal="prev" aria-label="Previous month">&#8249;</button>'
        +   '<div class="cal-title">' + MFULL[curM] + ' ' + curY + '</div>'
        +   '<button class="cal-nav" data-cal="next" aria-label="Next month">&#8250;</button>'
        + '</div>'
        + '<div class="cal-grid cal-dow">' + DOW.map(function (n) {
              return '<div class="cal-dow-c">' + n + '</div>'; }).join('') + '</div>'
        + '<div class="cal-grid cal-days">' + html + '</div>';
    }

    /* ---------- mode switch (Cards <-> Calendar) ---------- */
    toggle.addEventListener('click', function (e) {
      var b = e.target.closest('.seg'); if (!b) return;
      var calendar = b.dataset.mode === 'calendar';
      toggle.querySelectorAll('.seg').forEach(function (s) {
        s.classList.toggle('active', s === b);
      });
      cal.style.display = calendar ? '' : 'none';
      grid.style.display = calendar ? 'none' : '';
      filters.style.display = calendar ? 'none' : '';
      if (calendar) render();
    });

    /* ---------- month navigation ---------- */
    cal.addEventListener('click', function (e) {
      var nav = e.target.closest('[data-cal]'); if (!nav) return;
      if (nav.dataset.cal === 'prev') { curM--; if (curM < 0) { curM = 11; curY--; } }
      else { curM++; if (curM > 11) { curM = 0; curY++; } }
      render();
    });
    // Event chips use data-open-event — app.js's global click delegation opens the
    // event detail page automatically, so no extra handler is needed here.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
