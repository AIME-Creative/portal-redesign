/* ============================================================
   AMP — The Vault (formerly Resources)
   ------------------------------------------------------------
   The Resources page, reorganized around what members are trying
   to get done. Same page (view-resources, data-nav="resources"),
   renamed "The Vault" everywhere members see it.
   Top to bottom:
   1. Header + "What do you want to work on?" goal tiles, and a
      search box for the full library.
   2. Coming up — the next 3 events.
   3. Learning paths (learning-paths.js renders into #lc-paths-slot).
   4. New this month — the latest additions.
   5. Your saved — Vault items in My Library.
   6. Shows — recurring series; pick one to filter the library.
   7. Replays — recordings of past live sessions (webinars, Accelerate
      trainings, hub recordings).
   8. Tools you can use today — downloadable documents.
   9. Full library — every resource, hub video, and document;
      filter by goal, topic, format (Watch / Listen / Download), or
      show; sort newest / oldest / A to Z; search; show more.
   Tier rules: VIP-only hub content and documents show to everyone,
   locked with "Requires VIP membership", and can't be opened. Resources
   limited to some tiers (e.g. Elite & VIP webinars) show locked the
   same way, naming the membership they need.
   Lender / Vendor users see resources and events only (no hubs,
   documents, or learning paths).
   Resources are the real library items (content-data.js) and carry
   their own goal / topic / show; hub items and documents use META
   below (production: fields on each content item, set in admin).
   Brokers Edge, Mortgage Mornings, and Accelerate Live no longer have
   their own pages — links to them open The Vault filtered to
   that program (RETIRED below).
   Uses app.js globals: resources, events, hubs, generalDocuments,
   canSeeVIP, userType, openResource, openEvent, openHubItem,
   navigate, firstWord, resCard.
   ============================================================ */
(function () {
  const view = document.getElementById('view-resources');
  if (!view || typeof resources === 'undefined') return;
  const partner = userType !== 'member';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`;
  const ICO = {
    start: '<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>',
    business: '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
    close: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>',
    grow: '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
    mind: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    doc: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
    play: '<path d="M5 3l14 9-14 9V3z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 000-7.8z"/>',
  };
  const GOALS = [
    ['Start Here', 'New to AIME? The essentials first.', ICO.start],
    ['Get More Business', 'Leads, referral partners, and marketing.', ICO.business],
    ['Close More Loans', 'Products, guidelines, and sales conversations.', ICO.close],
    ['Run & Grow Your Business', 'Planning, operations, teams, and compliance.', ICO.grow],
    ['Mindset & Habits', 'The daily habits behind top producers.', ICO.mind],
  ];
  const TOPICS = ['AI & Technology', 'AIME Community', 'Business Planning & Numbers', 'Compliance & Ethics', 'Leadership & Team',
    'Leads & Referral Partners', 'Loan Products & Guidelines', 'Marketing & Personal Brand', 'Mindset & Habits', 'Operations & Systems', 'Sales & Conversations'];
  const SHOWS = [
    ['Mortgage Mornings', 'Weekly live show on rates, products, and the market.', ['#0b1f5b', '#20adce']],
    ['Broker Power-Up', 'Tactics to grow your pipeline, every week.', ['#1b1b3a', '#7a3fb0']],
    ['Broker to Broker', 'Brokers sharing what\'s working right now.', ['#0b1f5b', '#1893b1']],
    ['Women\'s Mortgage Network', 'Conversations from the WMN community.', ['#7a1f55', '#dd1969']],
    ['AIME Accelerate', 'Mindset sessions to sharpen how you work.', ['#5b2a86', '#dd1969']],
    ['Loan Officer Experience', 'Loan officers on how they win and keep clients.', ['#0b2a5b', '#1893b1']],
    ['AIME To Serve', 'Members giving back to their communities.', ['#1b7a4a', '#20adce']],
  ];
  const FORMAT = { Podcast: 'Listen', Webinar: 'Watch', Training: 'Watch', Recording: 'Watch', Certification: 'Watch', Video: 'Watch', Document: 'Download' };

  // goal · topic · show for hub items and documents, by title (production: fields on each item).
  // Resources from content-data.js carry their own goal / topic / show.
  const G = (goal, topic, show) => ({ goal, topic, show: show || '' });
  const META = {
    'Brokers Edge — Core Certification': G('Start Here', 'Loan Products & Guidelines'),
    'Non-QM Specialist': G('Close More Loans', 'Loan Products & Guidelines'),
    'VA Loan Pro': G('Close More Loans', 'Loan Products & Guidelines'),
    'Self-Employed Borrowers': G('Close More Loans', 'Loan Products & Guidelines'),
    'Ascent — Leading at Scale': G('Run & Grow Your Business', 'Leadership & Team'),
    'Ascent — Building a $100M Team': G('Run & Grow Your Business', 'Leadership & Team'),
    'Ascent — The Founder Mindset': G('Mindset & Habits', 'Mindset & Habits'),
    'VIP Roundtable — Scaling to IMB': G('Run & Grow Your Business', 'Business Planning & Numbers'),
    '1:1 Strategy Session Replay': G('Run & Grow Your Business', 'Business Planning & Numbers'),
    'WMN Podcast — Owning Your Worth': G('Mindset & Habits', 'Mindset & Habits', "Women's Mortgage Network"),
    'WMN Panel — Building Referral Networks': G('Get More Business', 'Leads & Referral Partners', "Women's Mortgage Network"),
    'AIME Member Handbook': G('Start Here', 'AIME Community'),
    'Loan Escalation Guide': G('Start Here', 'Operations & Systems'),
    'AIME Brand & Logo Kit': G('Get More Business', 'Marketing & Personal Brand'),
    '2026 Membership Agreement': G('Start Here', 'Compliance & Ethics'),
    'Brokers Edge Curriculum Guide': G('Start Here', 'Loan Products & Guidelines'),
    'Certification Completion Checklist': G('Close More Loans', 'Loan Products & Guidelines'),
    'Continuing Education Credit Form': G('Run & Grow Your Business', 'Compliance & Ethics'),
    'Rate Sheet Roundup — This Week': G('Close More Loans', 'Loan Products & Guidelines', 'Mortgage Mornings'),
    'Show Notes Archive (2026)': G('Close More Loans', 'Loan Products & Guidelines', 'Mortgage Mornings'),
    'Accelerate Live — Session Workbook': G('Mindset & Habits', 'Mindset & Habits', 'AIME Accelerate'),
    'Weekly Action Plan Template': G('Mindset & Habits', 'Operations & Systems'),
    'Ascent Workbook — Q3 Cohort': G('Run & Grow Your Business', 'Leadership & Team'),
    '90-Day Growth Plan Template': G('Run & Grow Your Business', 'Business Planning & Numbers'),
    'VIP Benefits Guide': G('Start Here', 'AIME Community'),
    'Speaking & Feature Opportunities': G('Get More Business', 'Marketing & Personal Brand'),
    'WMN Mentorship Program Overview': G('Get More Business', 'AIME Community', "Women's Mortgage Network"),
    'WMN Community Guidelines': G('Start Here', 'AIME Community', "Women's Mortgage Network"),
  };

  // Hub-only items (admin: "Only in this hub") stay on their hub's page and out of The Vault.
  const HUB_ONLY = new Set(['Ascent — Leading at Scale']);

  /* ---------- one list of everything in the library ---------- */
  const DAY = 864e5, TODAY = new Date(2026, 5, 25);
  const items = [];
  // Resources limited to some tiers (e.g. Elite & VIP webinars) show locked to everyone else.
  const needs = (r) => { const a = r.access || ['All Members']; return a.includes('All Members') || (!partner && a.includes(memberTier)) ? '' : a.join(' or '); };
  resources.forEach((r, i) => !HUB_ONLY.has(r.title) && items.push({ kind: 'resource', title: r.title, type: r.type, dur: r.dur, g: r.g, img: r.img, src: 'AIME',
    at: r.pub ? new Date(r.pub + 'T12:00:00').getTime() : TODAY - (i * 3 + 1) * DAY, goal: r.goal, topic: r.topic, show: r.show || '', needs: needs(r), locked: !!needs(r),
    open: () => openResource(i), opener: `data-open-resource="${i}"` }));
  if (!partner) {
    Object.keys(hubs).forEach((k, hi) => {
      const h = hubs[k], locked = !!h.vip && !canSeeVIP;
      // The same session can be both a resource and a hub recording — list it once.
      (h.content || []).forEach((c, i) => !resources.some((r) => r.title === c.title) && !HUB_ONLY.has(c.title) && items.push({ kind: 'hub', title: c.title, type: c.type, dur: c.dur, g: c.g, src: h.name, locked, at: TODAY - (hi * 4 + i * 6 + 2) * DAY,
        open: () => openHubItem(k, 'content', i), opener: `data-open-hub="${k}:content:${i}"` }));
      (h.documents || []).forEach((d, i) => items.push({ kind: 'doc', title: d.title, type: 'Document', desc: d.desc, src: h.name, srcKey: k, locked, at: TODAY - (30 + hi * 5 + i * 9) * DAY }));
    });
    generalDocuments.forEach((d, i) => items.push({ kind: 'doc', title: d.title, type: 'Document', desc: d.desc, src: 'General', srcKey: 'general', at: TODAY - (20 + i * 11) * DAY }));
  }
  items.forEach((x) => Object.assign(x, META[x.title] || (x.goal ? {} : G('Other', '')), { format: FORMAT[x.type] || 'Watch' }));

  /* ---------- cards ---------- */
  const tags = (x) => `<div class="lc-tags"><span class="lc-fmt">${x.format}</span>${x.show ? `<span>${esc(x.show)}</span>` : x.kind === 'hub' ? `<span>${esc(x.src)}</span>` : ''}</div>`;
  function card(x) {
    if (x.kind === 'resource' || x.kind === 'hub') {
      if (x.locked) return `<div class="res-card lc-locked"><div class="card-open" aria-disabled="true">
          <div class="res-thumb" style="${cardBg(x)}"><span class="res-type"><span class="badge" style="background:rgba(255,255,255,.9);color:#0b1f5b">${esc(x.type)}</span></span>${x.img ? '' : esc(firstWord(x.title))}
            <span class="lc-lockbadge">${svg(ICO.lock)} ${esc(x.needs ? x.needs.replace(' or ', ' / ') : 'VIP')}</span></div>
          <div class="res-body"><h3>${esc(x.title)}</h3>${tags(x)}<div class="lc-lockline">Requires ${esc(x.needs || 'VIP')} membership</div></div></div></div>`;
      return `<div class="res-card"><button class="card-open" ${x.opener}>
          <div class="res-thumb" style="${cardBg(x)}"><span class="res-type"><span class="badge" style="background:rgba(255,255,255,.9);color:#0b1f5b">${esc(x.type)}</span></span>${x.img ? '' : esc(firstWord(x.title))}
            <span class="play">${svg(ICO.play).replace('fill="none"', 'fill="currentColor"')}</span></div>
          <div class="res-body"><h3>${esc(x.title)}</h3>${tags(x)}<div class="res-meta">${x.dur ? esc(x.dur) : ''}</div></div></button></div>`;
    }
    return `<div class="res-card lc-doc${x.locked ? ' lc-locked' : ''}"><div class="lc-doc-body">
        <span class="lc-doc-ico">${svg(x.locked ? ICO.lock : ICO.doc)}</span>
        <h3>${esc(x.title)}</h3><p>${esc(x.desc || '')}</p>${tags(x)}
        ${x.locked ? '<div class="lc-lockline">Requires VIP membership</div>' : `<a class="btn btn-outline btn-sm" href="#" data-toast="Downloading: ${esc(x.title)}">Download</a>`}</div></div>`;
  }
  function toolRow(x) {
    return `<div class="list-row doc-row${x.locked ? ' lc-locked' : ''}" data-source="${x.srcKey}">
        <div class="list-logo">📄</div>
        <div class="list-main"><div class="lt">${esc(x.title)}</div><div class="ls">${esc(x.desc || '')}</div></div>
        <span class="doc-src">${esc(x.src)}</span>
        ${x.locked ? '<span class="lc-lockline">Requires VIP</span>' : `<a class="btn btn-outline btn-sm" href="#" data-toast="Downloading: ${esc(x.title)}">Download</a>`}</div>`;
  }

  /* ---------- page ---------- */
  const visibleEvents = () => {
    const M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const when = (e) => { const [m, d] = e.date.split(' '); return new Date(/2027/.test(e.when) ? 2027 : 2026, M.indexOf(m), +d); };
    return events.map((e, i) => ({ e, i, at: when(e) })).filter((x) => x.at >= TODAY).sort((a, b) => a.at - b.at).slice(0, 3);
  };
  const sec = (id, title, sub, body, link) => `<section class="lc-sec" id="${id}">
      <div class="section-title" style="margin-bottom:4px"><h2>${title}</h2>${link || ''}</div>${sub ? `<p class="lc-sub">${sub}</p>` : ''}${body}</section>`;
  const goalCount = (g) => items.filter((x) => x.goal === g).length;
  view.innerHTML = `
    <div class="lc-hero">
      <div class="lc-kicker">The Vault</div>
      <h1>What do you want to <em>work on today?</em></h1>
      <p>Every replay, show, training, and download in your membership, organized by what you're trying to get done. ${partner ? 'Pick a goal or search.' : 'Pick a goal, follow a path, or search.'}</p>
      <div class="lc-search">${svg(ICO.search)}<input class="input" id="lc-q" placeholder="Search The Vault — try “referral partners”, “VA”, or “objections”" autocomplete="off"></div>
      <button type="button" class="lc-jump" data-lc-jump>Browse the full library · ${items.length} items<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg></button>
    </div>
    <div class="lc-goals">${GOALS.filter(([g]) => goalCount(g)).map(([g, d, ic]) => `<button type="button" class="lc-goal" data-lc-goal="${esc(g)}">
        <span class="lc-goal-ico">${svg(ic)}</span><span class="lc-goal-t">${esc(g)}</span><span class="lc-goal-d">${esc(d)}</span><span class="lc-goal-n">${goalCount(g)} items</span></button>`).join('')}</div>
    ${sec('lc-coming', 'Coming up', 'Live events on the AIME calendar.', `<div class="lc-coming">${visibleEvents().map(({ e, i }) => {
      const [m, d] = e.date.split(' ');
      return `<button class="ev-mini" data-open-event="${i}"><div class="ev-date"><span class="d">${d}</span><span class="m">${m}</span></div>
        <div style="flex:1;align-self:center;text-align:left"><div class="em-t">${esc(e.title)}</div><div class="em-s">${esc(e.when)}</div></div></button>`;
    }).join('')}</div>`, '<a href="#" data-nav="events">All events <span>→</span></a>')}
    ${partner ? '' : '<div id="lc-paths-slot"></div>'}
    ${sec('lc-new', 'New this month', 'The latest sessions added to The Vault.', `<div class="card-grid lc-row">${items.filter((x) => x.kind !== 'doc' && !x.locked).sort((a, b) => b.at - a.at).slice(0, 4).map(card).join('')}</div>`)}
    <div id="lc-saved-slot"></div>
    ${sec('lc-shows', 'Shows', 'New episodes every week. Pick a show to see every episode.', `<div class="lc-shows">${SHOWS.map(([s, d, g]) => {
      const eps = items.filter((x) => x.show === s && x.kind !== 'doc');
      if (!eps.length) return '';
      const latest = eps.slice().sort((a, b) => b.at - a.at)[0];
      return `<button type="button" class="lc-show" data-lc-show="${esc(s)}" style="background:linear-gradient(135deg,${g[0]},${g[1]})">
          <span class="lc-show-t">${esc(s)}</span><span class="lc-show-d">${esc(d)}</span>
          <span class="lc-show-n">${eps.length} episode${eps.length === 1 ? '' : 's'} · Latest: ${esc(latest.title)}</span></button>`;
    }).join('')}</div>`)}
    ${partner ? '' : sec('lc-replays', 'Replays', 'Recordings of live sessions, so you can catch up any time.', `<div class="card-grid lc-row">${items.filter((x) => ['Recording', 'Webinar', 'Training'].includes(x.type) && x.kind !== 'doc').sort((a, b) => b.at - a.at).slice(0, 4).map(card).join('')}</div>`)}
    ${partner ? '' : sec('lc-tools', 'Tools you can use today', 'Guides, checklists, templates, and workbooks to download and put to work.', `<div class="card card-pad doc-card">${items.filter((x) => x.kind === 'doc').sort((a, b) => (a.locked - b.locked) || (b.at - a.at)).slice(0, 6).map(toolRow).join('')}</div>`, '<a href="#" data-lc-fmt="Download">All downloads <span>→</span></a>')}
    <section class="lc-sec" id="lc-library">
      <div class="section-title" style="margin-bottom:4px"><h2>Full library</h2></div>
      <p class="lc-sub" id="lc-lib-sub"></p>
      <div class="lc-filters">
        <select class="select filter-select" id="lc-f-goal"><option value="">All goals</option>${GOALS.map(([g]) => `<option>${esc(g)}</option>`).join('')}</select>
        <select class="select filter-select" id="lc-f-topic"><option value="">All topics</option>${TOPICS.filter((t) => items.some((x) => x.topic === t)).map((t) => `<option>${esc(t)}</option>`).join('')}</select>
        <select class="select filter-select" id="lc-f-fmt"><option value="">All formats</option>${['Watch', 'Listen', 'Download'].filter((f) => items.some((x) => x.format === f)).map((f) => `<option>${f}</option>`).join('')}</select>
        <select class="select filter-select" id="lc-f-show"><option value="">All shows</option>${SHOWS.map(([s]) => s).filter((s) => items.some((x) => x.show === s)).map((s) => `<option>${esc(s)}</option>`).join('')}</select>
        <select class="select filter-select" id="lc-sort"><option value="new">Newest first</option><option value="old">Oldest first</option><option value="az">A to Z</option></select>
        <button type="button" class="link-pink" id="lc-clear" hidden>Clear filters</button>
      </div>
      <div class="card-grid" id="resource-grid"></div>
      <div style="text-align:center;margin-top:18px"><button type="button" class="btn btn-outline btn-sm" id="lc-more" hidden>Show more</button></div>
    </section>`;

  /* ---------- your saved (My Library) ---------- */
  function renderSaved() {
    const slot = document.getElementById('lc-saved-slot'); if (!slot) return;
    const saved = window.AmpLibrary ? AmpLibrary.all().filter((s) => ['resource', 'hub', 'doc'].includes(s.k)) : [];
    const mine = saved.map((s) => items.find((x) => x.title === s.t && (s.k === x.kind))).filter(Boolean).slice(0, 4);
    slot.innerHTML = sec('lc-saved', 'Your saved', mine.length ? 'Vault items you\'ve saved to My Library.' : '',
      mine.length ? `<div class="card-grid lc-row">${mine.map(card).join('')}</div>`
        : `<div class="lc-empty-saved">${svg(ICO.heart)} Tap the heart on anything here to save it — it shows up in this row and in My Library.</div>`,
      '<a href="#" data-nav="library">My Library <span>→</span></a>');
  }

  /* ---------- full library ---------- */
  const PAGE = 12;
  let shown = PAGE;
  const $ = (id) => document.getElementById(id);
  function filtered() {
    const q = $('lc-q').value.trim().toLowerCase(), goal = $('lc-f-goal').value, topic = $('lc-f-topic').value, fmt = $('lc-f-fmt').value, show = $('lc-f-show').value, sort = $('lc-sort').value;
    // Light plural matching: "objections" finds "Objection Handling".
    const words = q.split(/\s+/).filter(Boolean).map((w) => (w.length > 3 ? w.replace(/(es|s)$/, '') : w));
    return items.filter((x) => (!goal || x.goal === goal) && (!topic || x.topic === topic) && (!fmt || x.format === fmt) && (!show || x.show === show) &&
      words.every((w) => `${x.title} ${x.type} ${x.src} ${x.goal} ${x.topic} ${x.show} ${x.desc || ''}`.toLowerCase().includes(w)))
      .sort((a, b) => (sort === 'az' ? a.title.localeCompare(b.title) : sort === 'old' ? a.at - b.at : b.at - a.at));
  }
  function renderLibrary() {
    const list = filtered(), any = ['lc-f-goal', 'lc-f-topic', 'lc-f-fmt', 'lc-f-show'].some((id) => $(id).value) || $('lc-q').value.trim();
    $('resource-grid').innerHTML = list.slice(0, shown).map(card).join('') || '<div class="card empty" style="grid-column:1/-1"><p style="margin:0">Nothing matches — try another word or clear the filters.</p></div>';
    $('lc-lib-sub').textContent = any ? `${list.length} of ${items.length} items match.` : `All ${items.length} items. Filter by goal, topic, format, or show.`;
    $('lc-more').hidden = list.length <= shown;
    $('lc-clear').hidden = !any;
  }
  function focusLibrary() { shown = PAGE; renderLibrary(); $('lc-library').scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  ['lc-f-goal', 'lc-f-topic', 'lc-f-fmt', 'lc-f-show', 'lc-sort'].forEach((id) => $(id).addEventListener('change', () => { shown = PAGE; renderLibrary(); }));
  let qTimer;
  $('lc-q').addEventListener('input', () => { clearTimeout(qTimer); qTimer = setTimeout(() => { shown = PAGE; renderLibrary(); }, 150); });
  $('lc-q').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); focusLibrary(); } });
  // Header shortcut: the Full library sits below the other sections, so jump straight to it.
  view.querySelector('[data-lc-jump]').addEventListener('click', () => $('lc-library').scrollIntoView({ behavior: 'smooth', block: 'start' }));
  view.addEventListener('click', (e) => {
    let m;
    if ((m = e.target.closest('[data-lc-goal]'))) { e.preventDefault(); $('lc-f-goal').value = m.dataset.lcGoal; focusLibrary(); return; }
    if ((m = e.target.closest('[data-lc-show]'))) { e.preventDefault(); $('lc-f-show').value = m.dataset.lcShow; focusLibrary(); return; }
    if ((m = e.target.closest('[data-lc-fmt]'))) { e.preventDefault(); $('lc-f-fmt').value = m.dataset.lcFmt; focusLibrary(); return; }
    if (e.target.closest('#lc-more')) { e.preventDefault(); shown += PAGE; renderLibrary(); return; }
    if (e.target.closest('#lc-clear')) { e.preventDefault(); ['lc-f-goal', 'lc-f-topic', 'lc-f-fmt', 'lc-f-show'].forEach((id) => { $(id).value = ''; }); $('lc-q').value = ''; shown = PAGE; renderLibrary(); }
  });

  /* ---------- rename "Resources" → "The Vault" where members see it ---------- */
  document.querySelectorAll('.nav-item[data-nav="resources"], .bottom-nav-item[data-nav="resources"]').forEach((b) => {
    const t = [...b.childNodes].reverse().find((n) => n.nodeType === 3 && n.textContent.trim());
    const span = b.querySelector('span');
    if (span && b.classList.contains('bottom-nav-item')) span.textContent = 'Vault';
    else if (t) t.textContent = ' The Vault ';
  });
  const origOpen = window.openResource;
  window.openResource = function () {
    const r = origOpen.apply(this, arguments);
    const back = document.querySelector('#resource-detail-body .back-link');
    if (back) back.lastChild.textContent = ' Back to The Vault';
    const up = document.querySelector('#resource-detail-body .section-title h2');
    if (up && up.textContent === 'Up next') up.textContent = 'Up next in The Vault';
    return r;
  };

  /* ---------- Brokers Edge, Mortgage Mornings, Accelerate Live live here now ----------
     Their hub pages (and the sidebar's Learning & Training section) are gone. Anything that still points at
     one — search, Trending, a hub item's back link — opens The Vault filtered to that program. */
  const RETIRED = { brokersedge: { q: 'Brokers Edge' }, mortgagemornings: { show: 'Mortgage Mornings' }, acceleratelive: { show: 'AIME Accelerate' } };
  function showProgram(key) {
    ['lc-f-goal', 'lc-f-topic', 'lc-f-fmt', 'lc-f-show'].forEach((id) => { $(id).value = ''; });
    $('lc-q').value = RETIRED[key].q || ''; $('lc-f-show').value = RETIRED[key].show || '';
    focusLibrary();
  }
  const navBefore = window.navigate;
  window.navigate = function (v) {
    if (RETIRED[v]) { navBefore.call(this, 'resources'); showProgram(v); return; }
    return navBefore.apply(this, arguments);
  };
  const hubBefore = window.openHubItem;
  window.openHubItem = function (key) {
    const r = hubBefore.apply(this, arguments);
    if (RETIRED[key]) {
      const back = document.querySelector('#hub-detail-body .back-link');
      if (back) { back.dataset.nav = 'resources'; back.lastChild.textContent = ' Back to The Vault'; }
      document.querySelectorAll('.nav-item, .bottom-nav-item').forEach((n) => n.classList.toggle('active', n.dataset.nav === 'resources'));
    }
    return r;
  };

  renderSaved(); renderLibrary();
  // Keep "Your saved" in step with hearts tapped anywhere.
  document.addEventListener('click', (e) => { if (e.target.closest('[data-fav]')) setTimeout(renderSaved, 0); });
  const origNav = window.navigate;
  window.navigate = function (v) { const r = origNav.apply(this, arguments); if (v === 'resources') renderSaved(); return r; };
  window.AmpLearningCenter = { items: () => items.slice(), filter(f) { Object.entries(f || {}).forEach(([k, v]) => { const el = $('lc-f-' + k); if (el) el.value = v; }); focusLibrary(); }, render: renderLibrary };
})();
