/* ============================================================
   AMP Admin — Partner Reports + who viewed partner pages
   ------------------------------------------------------------
   Matches the "Lender & Vendor Reports" changes given to the
   developer for the live portal.
   1. Sidebar → Partner Reports (its own collapsible section):
      - Lender reports — escalations, Change AE, lender connections
      - Vendor reports — vendor connections
      Totals across the top follow the filters and date range
      (All time by default; 7 / 30 / 90 days, year to date, custom).
      Same filters as before, split by lender or vendor. Each row
      shows whether the email to the partner was delivered; failed
      lender emails notify brokermembership@aimegroup.com, failed
      vendor connection emails notify bennett@aimegroup.com.
      The Reports page keeps Subscriptions.
   2. Analytics → Lender page views (new tab) and Vendor
      clickthroughs: click a views number to see which members
      viewed that page — totals (total / unique views, escalations,
      Change AE, connections, sign-ups), one row per member, Export CSV.
      Vendors: upload the sign-up list a vendor sends (CSV) — matched
      to members by email (NMLS # as a fallback when present) and
      shown as "Signed up?". Sign-ups who never viewed the page are
      still listed; ones that don't match a member are listed apart.
   Prototype: sample records relative to TODAY (Jun 25, 2026); sign-up
   uploads in localStorage amp-vendor-signups-v1.
   Uses admin.js globals: TODAY, ranges, setupRange, inWindow, fmtDate,
   lenders, vendors, members, escalationRecords, changeAERecords,
   connectionRecords, vendorClicks, navigate, openModal, closeModals,
   showToast, initials.
   ============================================================ */
(function () {
  const reportsNav = document.querySelector('#sidebar .nav-item[data-nav="reports"]');
  if (!reportsNav) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`;
  const ICO = {
    lender: '<path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"/>',
    market: '<path d="M3 9l1-5h16l1 5M4 9v11h16V9M4 9h16M9 13h6"/>',
    esc: '<path d="M12 9v4M10.3 3.9l-8 14A2 2 0 004 21h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0z"/><circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none"/>',
    ae: '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6"/>',
    conn: '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
    people: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    check: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r="1.1" fill="currentColor" stroke="none"/>',
    upload: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    dl: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  };
  const D = 864e5;
  const ago = (n) => fmtDate(new Date(TODAY.getTime() - n * D));
  // Deterministic sample generator.
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const people = members.map((m) => ({ name: m.name, email: m.email, plan: m.plan }));
  const first = (n) => n.split(' ')[0];

  /* ---------- report records: the existing samples plus a year of history ---------- */
  const lenderNames = lenders.map((l) => l.name);
  const vendorNames = vendors.map((v) => v.name);
  const AE = ['Dana Price', 'Brett Hollis', 'Grant Ellis', 'Mia Torres', 'Ray Quinn', 'Owen Pike', 'Lena Moss'];
  const REASONS = ['Unresponsive', 'Poor communication', 'Relocated / no longer my market', 'Other'];
  const email = (fail) => (fail ? 'Failed' : 'Delivered');
  const lenderRows = []
    .concat(escalationRecords.map((r) => ({ type: 'Escalation', member: r.member, partner: r.lender, detail: `Loan #${r.loan}`, date: r.date, status: r.status, email: 'Delivered' })))
    .concat(changeAERecords.map((r) => ({ type: 'Change AE', member: r.member, partner: r.lender, detail: `${r.ae} · ${r.reason}`, date: r.date, status: r.status, email: 'Delivered' })))
    .concat(connectionRecords.filter((r) => r.kind === 'Lender').map((r) => ({ type: 'Connection', member: r.member, partner: r.partner, detail: '—', date: r.date, status: r.status, email: 'Delivered' })));
  const vendorRows = connectionRecords.filter((r) => r.kind === 'Vendor').map((r) => ({ type: 'Connection', member: r.member, partner: r.partner, date: r.date, status: r.status, email: 'Delivered' }));
  for (let i = 0; i < 70; i++) {
    const p = pick(people), d = 25 + Math.floor(rnd() * 380), t = rnd();
    if (t < 0.45) lenderRows.push({ type: 'Escalation', member: p.name, partner: pick(lenderNames), detail: `Loan #10${Math.floor(rnd() * 9e6)}`, date: ago(d), status: d > 40 ? 'Resolved' : pick(['Received', 'Responded']), email: email(rnd() < 0.04) });
    else if (t < 0.7) lenderRows.push({ type: 'Change AE', member: p.name, partner: pick(lenderNames), detail: `${pick(AE)} · ${pick(REASONS)}`, date: ago(d), status: 'Delivered', email: email(rnd() < 0.04) });
    else lenderRows.push({ type: 'Connection', member: p.name, partner: pick(lenderNames), detail: '—', date: ago(d), status: 'Delivered', email: email(rnd() < 0.04) });
  }
  for (let i = 0; i < 64; i++) vendorRows.push({ type: 'Connection', member: pick(people).name, partner: pick(vendorNames), date: ago(3 + Math.floor(rnd() * 390)), status: 'Delivered', email: email(rnd() < 0.05) });
  // A couple of recent failures so the notification note has something to point at.
  lenderRows.push({ type: 'Escalation', member: 'Janet Park', partner: 'Kind Lending', detail: 'Loan #100409881', date: ago(2), status: 'Received', email: 'Failed' });
  vendorRows.push({ type: 'Connection', member: 'Tom Becker', partner: 'Lead Hackers', date: ago(1), status: 'Delivered', email: 'Failed' });
  const byDate = (a, b) => new Date(b.date) - new Date(a.date);
  lenderRows.sort(byDate); vendorRows.sort(byDate);
  const memberEmail = (n) => (people.find((p) => p.name === n) || {}).email || `${n.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`;

  /* ---------- sidebar: Partner Reports (before admin-nav-groups.js builds the groups) ---------- */
  const membersLabel = [...document.querySelectorAll('#sidebar .nav > .nav-label')].find((l) => /Members/i.test(l.textContent));
  membersLabel.insertAdjacentHTML('beforebegin', `<div class="nav-label">Partner Reports</div>
    <button class="nav-item" data-nav="lender-reports">${svg(ICO.lender)} Lender reports</button>
    <button class="nav-item" data-nav="vendor-reports">${svg(ICO.market)} Vendor reports</button>`);

  /* ---------- pages ---------- */
  const rangeMarkup = (id) => `<div class="date-range" id="${id}-range">
      <select class="select filter-select daterange-preset"><option value="all" selected>All time</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="90d">Last 90 days</option><option value="ytd">Year to date</option><option value="custom">Custom range…</option></select>
      <div class="daterange-custom" hidden><input type="date" class="input daterange-from"><span class="dr-sep">to</span><input type="date" class="input daterange-to"><button class="btn btn-outline btn-sm daterange-apply">Apply</button></div></div>`;
  const reportsView = $('view-reports');
  reportsView.insertAdjacentHTML('afterend', `
    <section class="view" id="view-lender-reports">
      <div class="adm-section-head"><div class="page-head" style="margin:0"><h1>Lender reports</h1><p>Escalations, Change AE requests, and lender connections — to share with a lender or review. Defaults to all time.</p></div>${rangeMarkup('lenderrep')}</div>
      <div class="pr-tiles" id="lr-tiles"></div>
      <div class="pr-note">${svg(ICO.info)}<p>Emails to lenders include the member's first name. If an escalation, Change AE, or connection email to a lender fails, <strong>brokermembership@aimegroup.com</strong> is notified.</p></div>
      <div class="toolbar">
        <select class="select filter-select" id="lr-partner" style="min-width:220px"><option value="all">All lenders</option>${lenderNames.map((n) => `<option>${esc(n)}</option>`).join('')}</select>
        <select class="select filter-select" id="lr-type"><option value="all">All request types</option><option>Escalation</option><option>Change AE</option><option>Connection</option></select>
        <select class="select filter-select" id="lr-email"><option value="all">Any email status</option><option>Delivered</option><option>Failed</option></select>
        <span class="spacer"></span><span class="count-note" id="lr-count"></span>
        <button class="btn btn-primary" data-pr-export="lender">${svg(ICO.dl).replace('<svg', '<svg style="width:16px;height:16px"')} Export CSV</button>
      </div>
      <div class="table-wrap"><div class="table-scroll"><table class="adm"><thead><tr><th>Type</th><th>Member</th><th>Lender</th><th>Details</th><th>Date</th><th>Status</th><th>Email</th></tr></thead><tbody id="lr-tbody"></tbody></table></div></div>
    </section>
    <section class="view" id="view-vendor-reports">
      <div class="adm-section-head"><div class="page-head" style="margin:0"><h1>Vendor reports</h1><p>Connection requests members sent to Market vendors. Defaults to all time.</p></div>${rangeMarkup('vendorrep')}</div>
      <div class="pr-tiles" id="vr-tiles"></div>
      <div class="pr-note">${svg(ICO.info)}<p>Connection emails to vendors include the member's first name, and "Have questions?" points to <strong>vendors@aimegroup.com</strong>. If a vendor connection email fails, <strong>bennett@aimegroup.com</strong> is notified.</p></div>
      <div class="toolbar">
        <select class="select filter-select" id="vr-partner" style="min-width:220px"><option value="all">All vendors</option>${vendorNames.map((n) => `<option>${esc(n)}</option>`).join('')}</select>
        <select class="select filter-select" id="vr-email"><option value="all">Any email status</option><option>Delivered</option><option>Failed</option></select>
        <span class="spacer"></span><span class="count-note" id="vr-count"></span>
        <button class="btn btn-primary" data-pr-export="vendor">${svg(ICO.dl).replace('<svg', '<svg style="width:16px;height:16px"')} Export CSV</button>
      </div>
      <div class="table-wrap"><div class="table-scroll"><table class="adm"><thead><tr><th>Member</th><th>Vendor</th><th>Date</th><th>Status</th><th>Email</th></tr></thead><tbody id="vr-tbody"></tbody></table></div></div>
    </section>`);
  ranges.lenderrep = { days: 36500, label: 'All time', from: null, to: null };
  ranges.vendorrep = { days: 36500, label: 'All time', from: null, to: null };

  const tile = (ico, cls, label, val, key, active) => `<button type="button" class="pr-tile ${active ? 'active' : ''}" ${key ? `data-pr-tile="${key}"` : 'disabled'}>
      <span class="pr-tile-ico ${cls}">${svg(ico)}</span><span><span class="pr-tile-val">${val.toLocaleString()}</span><span class="pr-tile-lbl">${label}</span></span></button>`;
  const emailPill = (e) => `<span class="badge ${e === 'Failed' ? 'badge-pink' : 'badge-green'}">${e}</span>`;
  const memberCell = (n) => `<div class="t-strong">${esc(n)}</div><div class="t-sub">${esc(memberEmail(n))}</div>`;
  function lenderFiltered(ignoreType) {
    const partner = $('lr-partner').value, type = $('lr-type').value, mail = $('lr-email').value;
    return lenderRows.filter((r) => inWindow('lenderrep', r.date) && (partner === 'all' || r.partner === partner) && (mail === 'all' || r.email === mail) && (ignoreType || type === 'all' || r.type === type));
  }
  function renderLender() {
    const base = lenderFiltered(true), type = $('lr-type').value;
    const n = (t) => base.filter((r) => r.type === t).length;
    $('lr-tiles').innerHTML = tile(ICO.esc, 'i-pink', 'Escalations', n('Escalation'), 'Escalation', type === 'Escalation') +
      tile(ICO.ae, 'i-navy', 'Change AE requests', n('Change AE'), 'Change AE', type === 'Change AE') +
      tile(ICO.conn, 'i-cyan', 'Lender connections', n('Connection'), 'Connection', type === 'Connection');
    const rows = lenderFiltered(false);
    $('lr-tbody').innerHTML = rows.map((r) => `<tr><td><span class="pr-type t-${r.type === 'Escalation' ? 'esc' : r.type === 'Change AE' ? 'ae' : 'conn'}">${r.type}</span></td>
        <td>${memberCell(r.member)}</td><td>${esc(r.partner)}</td><td class="t-sub">${esc(r.detail)}</td><td style="white-space:nowrap">${r.date}</td><td>${statusPill(r.status)}</td><td>${emailPill(r.email)}</td></tr>`).join('')
      || '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:28px">Nothing matches these filters.</td></tr>';
    $('lr-count').textContent = `${rows.length} request${rows.length === 1 ? '' : 's'} · ${ranges.lenderrep.label}`;
  }
  function vendorFiltered() {
    const partner = $('vr-partner').value, mail = $('vr-email').value;
    return vendorRows.filter((r) => inWindow('vendorrep', r.date) && (partner === 'all' || r.partner === partner) && (mail === 'all' || r.email === mail));
  }
  function renderVendor() {
    const rows = vendorFiltered();
    $('vr-tiles').innerHTML = tile(ICO.conn, 'i-cyan', 'Vendor connections', rows.length) +
      tile(ICO.people, 'i-navy', 'Members who connected', new Set(rows.map((r) => r.member)).size) +
      tile(ICO.market, 'i-pink', 'Vendors connected with', new Set(rows.map((r) => r.partner)).size);
    $('vr-tbody').innerHTML = rows.map((r) => `<tr><td>${memberCell(r.member)}</td><td>${esc(r.partner)}</td><td style="white-space:nowrap">${r.date}</td><td>${statusPill(r.status)}</td><td>${emailPill(r.email)}</td></tr>`).join('')
      || '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:28px">Nothing matches these filters.</td></tr>';
    $('vr-count').textContent = `${rows.length} connection${rows.length === 1 ? '' : 's'} · ${ranges.vendorrep.label}`;
  }
  setupRange('lenderrep', renderLender, { allDays: 36500 });
  setupRange('vendorrep', renderVendor, { allDays: 36500 });
  ['lr-partner', 'lr-type', 'lr-email'].forEach((id) => $(id).addEventListener('change', renderLender));
  ['vr-partner', 'vr-email'].forEach((id) => $(id).addEventListener('change', renderVendor));

  /* ---------- Reports keeps Subscriptions ---------- */
  ['escalations', 'connections', 'changeae'].forEach((t) => { const c = document.querySelector(`#report-tabs [data-rtype="${t}"]`); if (c) c.remove(); });
  const sub = document.querySelector('#report-tabs [data-rtype="subscriptions"]');
  if (sub) sub.click();
  $('report-tabs').hidden = true;
  const rp = reportsView.querySelector('.page-head p');
  if (rp) rp.textContent = 'Subscription upgrades, downgrades, and cancellations, with why members cancelled. Lender and vendor reports are under Partner Reports. Defaults to all time.';

  /* ============================================================
     Analytics — who viewed a lender or vendor page
     ============================================================ */
  const TABS = (active) => `<div class="filters an-tabs" role="tablist">${[['analytics', 'Overview'], ['engagement', 'Engagement'], ['journeys', 'Member journeys'], ['lenderviews', 'Lender page views'], ['vendorclicks', 'Vendor clickthroughs']]
    .map(([v, l]) => `<button class="chip ${v === active ? 'active' : ''}" data-nav="${v}" role="tab">${l}</button>`).join('')}</div>`;
  // Add the new tab to the existing Analytics tab rows.
  document.querySelectorAll('.an-tabs').forEach((row) => {
    const vc = row.querySelector('[data-nav="vendorclicks"]');
    if (vc && !row.querySelector('[data-nav="lenderviews"]')) vc.insertAdjacentHTML('beforebegin', '<button class="chip" data-nav="lenderviews" role="tab">Lender page views</button>');
  });
  $('view-vendorclicks').insertAdjacentHTML('afterend', `
    <section class="view" id="view-lenderviews">${TABS('lenderviews')}
      <div class="adm-section-head"><div class="page-head" style="margin:0"><h1>Analytics</h1><p>Lender page views — how many members view each lender's page, and what they sent that lender. Click a views number to see who viewed it.</p></div>${rangeMarkup('lenderviews').replace('value="all" selected', 'value="all"').replace('value="30d"', 'value="30d" selected')}</div>
      <div class="table-wrap"><div class="table-scroll"><table class="adm"><thead><tr><th>Lender</th><th>Tier</th><th>Views</th><th>Unique views</th><th>Escalations</th><th>Change AE</th><th>Connections</th></tr></thead><tbody id="lv-tbody"></tbody></table></div></div>
      <div class="count-note" id="lv-count" style="margin-top:10px"></div>
    </section>
    <section class="view" id="view-page-viewers">
      <div id="pv-tabs"></div>
      <a href="#" class="back-link" id="pv-back">${svg(ICO.back).replace('<svg', '<svg style="width:16px;height:16px"')} <span>Back</span></a>
      <div class="adm-section-head"><div class="page-head" style="margin:0"><h1 id="pv-title">Who viewed</h1><p id="pv-sub"></p></div>
        <div class="pv-head-actions" id="pv-actions"></div></div>
      <div class="pr-tiles" id="pv-tiles"></div>
      <div id="pv-upload-note"></div>
      <div class="toolbar"><div class="search" style="max-width:320px"><input class="input" id="pv-q" placeholder="Search members"></div>
        <select class="select filter-select" id="pv-filter"></select><span class="spacer"></span><span class="count-note" id="pv-count"></span>
        <button class="btn btn-primary" id="pv-export">${svg(ICO.dl).replace('<svg', '<svg style="width:16px;height:16px"')} Export CSV</button></div>
      <div class="table-wrap"><div class="table-scroll"><table class="adm"><thead id="pv-thead"></thead><tbody id="pv-tbody"></tbody></table></div></div>
      <div style="text-align:center;margin-top:16px"><button type="button" class="btn btn-outline btn-sm" id="pv-more" hidden>Show more</button></div>
      <div id="pv-unmatched"></div>
    </section>`);
  ranges.lenderviews = { days: 30, label: 'Last 30 days', from: null, to: null };

  // Per-lender views: deterministic sample, scaled to the range.
  const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 9973, 17);
  function lenderStats(name) {
    const f = ranges.lenderviews.days / 30, h = hash(name);
    const views = Math.round((120 + (h % 900)) * f), unique = Math.round(views * (0.55 + (h % 20) / 100));
    const inRange = lenderRows.filter((r) => r.partner === name && inWindow('lenderviews', r.date));
    const c = (t) => inRange.filter((r) => r.type === t).length;
    return { views, unique, esc: c('Escalation'), ae: c('Change AE'), conn: c('Connection') };
  }
  function renderLenderViews() {
    const rows = lenders.map((l) => Object.assign({ name: l.name, tier: l.tier }, lenderStats(l.name))).sort((a, b) => b.views - a.views);
    $('lv-tbody').innerHTML = rows.map((r) => `<tr><td class="t-strong">${esc(r.name)}</td><td><span class="badge badge-navy">${esc(r.tier || '')}</span></td>
        <td><button class="pv-link" data-pv="lender::${esc(r.name)}" title="See who viewed this page">${r.views.toLocaleString()}</button></td>
        <td>${r.unique.toLocaleString()}</td><td>${r.esc}</td><td>${r.ae}</td><td>${r.conn}</td></tr>`).join('');
    $('lv-count').textContent = `${rows.length} lenders · ${ranges.lenderviews.label}`;
  }
  setupRange('lenderviews', renderLenderViews);

  // Vendor clickthroughs: the Clicks number (members who opened the listing) opens who viewed it.
  const vcBody = $('vendorclicks-tbody');
  const decorateVC = () => vcBody.querySelectorAll('tr').forEach((tr) => {
    const cell = tr.children[3], name = tr.querySelector('.t-strong'); if (!cell || !name || cell.querySelector('.pv-link')) return;
    cell.innerHTML = `<button class="pv-link" data-pv="vendor::${esc(name.textContent)}" title="See who viewed this listing">${cell.textContent}</button>`;
  });
  new MutationObserver(decorateVC).observe(vcBody, { childList: true });
  decorateVC();

  /* ---------- the viewers page ---------- */
  const SIGN_KEY = 'amp-vendor-signups-v1';
  const signups = () => { try { return JSON.parse(localStorage.getItem(SIGN_KEY)) || {}; } catch (e) { return {}; } };
  const saveSignups = (all) => { try { localStorage.setItem(SIGN_KEY, JSON.stringify(all)); } catch (e) { /* in-memory */ } };
  let pv = null;   // { kind, name, from }
  // The totals shown in the table the admin clicked (so this page adds up to the same numbers).
  function statsFor(kind, name) {
    if (kind === 'lender') return lenderStats(name);
    const f = ranges.vendorclicks.days / 30, v = vendorClicks.find((x) => x.name === name);
    if (!v) return { views: 0, unique: 0, conn: 0 };
    const views = Math.round(v.tiers.premium * f) + Math.round(v.tiers.elite * f) + Math.round(v.tiers.vip * f);
    return { views, unique: Math.max(1, Math.round(views * 0.62)), conn: Math.round(v.connections * f) };
  }
  // Sample viewers: real sample members first, then generated ones, until the unique count is reached.
  const FIRST = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Drew', 'Reese', 'Cameron', 'Logan', 'Skyler', 'Parker', 'Rowan', 'Elena', 'Marcus', 'Nadia', 'Omar', 'Grace', 'Victor', 'Leah', 'Andre'];
  const LAST = ['Bennett', 'Ortiz', 'Nguyen', 'Patel', 'Hughes', 'Brooks', 'Rivera', 'Kim', 'Foster', 'Coleman', 'Hayes', 'Reyes', 'Murphy', 'Price', 'Sanders', 'Bishop', 'Lane', 'Wallace', 'Park', 'Russo'];
  const PLANS = ['Premium', 'Premium', 'Premium', 'Elite', 'Elite', 'VIP'];
  function viewers(kind, name) {
    seed = hash(name) + 11;
    const st = statsFor(kind, name), scope = kind === 'lender' ? 'lenderviews' : 'vendorclicks';
    const pool = people.slice().sort(() => rnd() - 0.5);
    for (let i = 0; pool.length < st.unique; i++) {
      const f = FIRST[i % FIRST.length], l = LAST[(i * 7 + Math.floor(i / FIRST.length)) % LAST.length];
      pool.push({ name: `${f} ${l}`, email: `${f}.${l}${i > 400 ? i : ''}@${pick(['gmail.com', 'outlook.com', 'brokerhq.com', 'homeloanspro.com'])}`.toLowerCase(), plan: pick(PLANS) });
    }
    const rows = pool.slice(0, st.unique).map((p) => ({ name: p.name, email: p.email, plan: p.plan, views: 1, esc: 0, ae: 0, conn: false, signed: false }));
    // Spread the remaining views, then hand out the requests the table counted.
    for (let left = st.views - rows.length; left > 0 && rows.length; left--) rows[Math.floor(Math.pow(rnd(), 2) * rows.length)].views++;
    // Counts land on the heavier viewers; yes/no flags go to different members each time.
    const give = (n, key, bool) => {
      for (let i = 0; i < n && rows.length; i++) {
        if (bool) { const free = rows.filter((r) => !r[key]); if (!free.length) return; free[Math.floor(Math.pow(rnd(), 2) * free.length)][key] = true; }
        else rows[Math.floor(rnd() * Math.min(rows.length, 40))][key]++;
      }
    };
    if (kind === 'lender') { give(st.esc, 'esc'); give(st.ae, 'ae'); give(st.conn, 'conn', true); }
    else {
      // Connections recorded for these members in the range count first.
      rows.forEach((r) => { if (vendorRows.some((v) => v.partner === name && v.member === r.name && inWindow(scope, v.date))) r.conn = true; });
      give(Math.max(0, st.conn - rows.filter((r) => r.conn).length), 'conn', true);
      const up = signups()[name], set = new Set((up && up.matched) || []);
      rows.forEach((r) => { r.signed = set.has(r.email.toLowerCase()); });
      // Sign-ups that matched a member who never viewed the listing still count.
      [...set].forEach((em) => {
        if (rows.some((r) => r.email.toLowerCase() === em)) return;
        const p = people.find((x) => x.email.toLowerCase() === em);
        if (p) rows.push({ name: p.name, email: p.email, plan: p.plan, views: 0, esc: 0, ae: 0, conn: false, signed: true });
      });
    }
    return rows.sort((a, b) => b.views - a.views);
  }
  let shown = 25;
  function openViewers(kind, name) {
    pv = { kind, name, from: kind === 'lender' ? 'lenderviews' : 'vendorclicks' };
    $('pv-tabs').innerHTML = TABS(pv.from);
    $('pv-back').dataset.nav = pv.from;
    $('pv-back').querySelector('span').textContent = kind === 'lender' ? 'Back to Lender page views' : 'Back to Vendor clickthroughs';
    $('pv-title').textContent = `Who viewed ${name}`;
    $('pv-q').value = ''; shown = 25;
    $('pv-filter').innerHTML = kind === 'lender'
      ? '<option value="all">All viewers</option><option value="esc">Sent an escalation</option><option value="ae">Requested a new AE</option><option value="conn">Sent a connection</option>'
      : '<option value="all">All viewers</option><option value="conn">Sent a connection</option><option value="signed">Signed up</option><option value="notsigned">Not signed up</option>';
    $('pv-actions').innerHTML = kind === 'vendor' ? `<button class="btn btn-outline" id="pv-upload">${svg(ICO.upload).replace('<svg', '<svg style="width:16px;height:16px"')} Upload sign-ups (CSV)</button>` : '';
    navigate('page-viewers');
    renderViewers();
  }
  function viewerRows() {
    const q = $('pv-q').value.trim().toLowerCase(), f = $('pv-filter').value;
    return viewers(pv.kind, pv.name).filter((r) => (!q || `${r.name} ${r.email}`.toLowerCase().includes(q)) &&
      (f === 'all' || (f === 'esc' && r.esc) || (f === 'ae' && r.ae) || (f === 'conn' && r.conn) || (f === 'signed' && r.signed) || (f === 'notsigned' && !r.signed)));
  }
  function renderViewers() {
    const all = viewers(pv.kind, pv.name), rows = viewerRows(), lender = pv.kind === 'lender';
    const scope = lender ? 'lenderviews' : 'vendorclicks';
    $('pv-sub').textContent = `${lender ? 'Members who viewed this lender\'s page' : 'Members who opened this Market listing'} · ${ranges[scope].label}`;
    const total = all.reduce((s, r) => s + r.views, 0), unique = all.filter((r) => r.views).length;
    $('pv-tiles').innerHTML = tile(ICO.eye, 'i-navy', 'Total views', total) + tile(ICO.people, 'i-cyan', 'Unique views', unique) +
      (lender ? tile(ICO.esc, 'i-pink', 'Escalations', all.reduce((s, r) => s + r.esc, 0)) + tile(ICO.ae, 'i-navy', 'Change AE', all.reduce((s, r) => s + r.ae, 0)) : '') +
      tile(ICO.conn, 'i-cyan', 'Connections', all.filter((r) => r.conn).length) +
      (lender ? '' : tile(ICO.check, 'i-green', 'Signed up', all.filter((r) => r.signed).length));
    const up = !lender && signups()[pv.name];
    $('pv-upload-note').innerHTML = lender ? '' : `<div class="pr-note">${svg(ICO.info)}<p>${up
      ? `Sign-up list <strong>${esc(up.file)}</strong> uploaded ${esc(up.at)} — ${up.matched.length} matched to members${up.unmatched.length ? `, ${up.unmatched.length} not matched (listed below)` : ''}. Upload a new list any time; it replaces this one.`
      : `${esc(pv.name)} sends a list of who signed up with them. <strong>Upload sign-ups (CSV)</strong> to mark them here — matched to members by email, or NMLS # when the email doesn't match.`}</p></div>`;
    $('pv-thead').innerHTML = `<tr><th>Member</th><th>Tier</th><th>Views</th>${lender ? '<th>Escalations sent</th><th>Change AE requests</th>' : ''}<th>Connection sent?</th>${lender ? '' : '<th>Signed up?</th>'}</tr>`;
    const yn = (v) => `<span class="badge ${v ? 'badge-green' : 'badge-gray'}">${v ? 'Yes' : 'No'}</span>`;
    $('pv-tbody').innerHTML = rows.slice(0, shown).map((r) => `<tr><td><div class="t-strong">${esc(r.name)}</div><div class="t-sub">${esc(r.email)}</div></td>
        <td><span class="badge badge-navy">${esc(r.plan)}</span></td><td>${r.views ? r.views : '<span class="t-sub">0 — signed up without viewing</span>'}</td>
        ${lender ? `<td>${r.esc}</td><td>${r.ae}</td>` : ''}<td>${yn(r.conn)}</td>${lender ? '' : `<td>${yn(r.signed)}</td>`}</tr>`).join('')
      || `<tr><td colspan="${lender ? 6 : 5}" style="text-align:center;color:var(--muted);padding:28px">No members match.</td></tr>`;
    $('pv-count').textContent = `${rows.length.toLocaleString()} member${rows.length === 1 ? '' : 's'}`;
    $('pv-more').hidden = rows.length <= shown;
    $('pv-more').textContent = `Show more (${Math.min(25, rows.length - shown)} of ${(rows.length - shown).toLocaleString()} left)`;
    $('pv-unmatched').innerHTML = up && up.unmatched.length ? `<div class="card card-pad" style="margin-top:18px"><div class="section-title" style="margin-bottom:6px"><h2 style="font-size:16px">Signed up, not matched to a member</h2><span class="count-note">${up.unmatched.length}</span></div>
        <p class="t-sub" style="margin:0 0 10px">On ${esc(pv.name)}'s list but no member has this email or NMLS #. They may use a different email in AMP.</p>
        ${up.unmatched.map((u) => `<div class="list-row" style="padding:8px 0"><div class="list-main"><div class="lt">${esc(u.name || u.email)}</div><div class="ls">${esc(u.email)}${u.nmls ? ' · NMLS ' + esc(u.nmls) : ''}</div></div></div>`).join('')}</div>` : '';
  }
  $('pv-q').addEventListener('input', () => { shown = 25; renderViewers(); });
  $('pv-filter').addEventListener('change', () => { shown = 25; renderViewers(); });
  $('pv-more').addEventListener('click', () => { shown += 25; renderViewers(); });

  /* ---------- sign-up upload ---------- */
  document.body.insertAdjacentHTML('beforeend', `<div class="modal-overlay" id="modal-signups"><div class="modal" style="max-width:520px">
      <div class="modal-head"><div><h2>Upload sign-ups</h2><p id="su-sub"></p></div><button class="modal-close" data-close aria-label="Close">${svg('<path d="M18 6L6 18M6 6l12 12"/>').replace('<svg', '<svg style="width:18px;height:18px"')}</button></div>
      <div class="modal-body">
        <p style="margin:0 0 12px;font-size:14px;color:var(--ink-soft)">The CSV the vendor sends — one row per person who signed up. It needs an <strong>Email</strong> column; <strong>Name</strong> and <strong>NMLS</strong> columns help. Rows are matched to members by email, then NMLS #.</p>
        <label class="su-drop"><input type="file" accept=".csv,text/csv" id="su-file" hidden>${svg(ICO.upload)}<span><strong>Choose a CSV file</strong><br><span class="t-sub" id="su-file-name">No file chosen</span></span></label>
        <button type="button" class="link-pink" id="su-sample" style="margin-top:10px">Use a sample file instead</button>
        <div class="er-error" id="su-err" hidden></div>
      </div>
      <div class="modal-foot"><button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-primary" id="su-go">Upload &amp; match</button></div></div></div>`);
  let pending = null;   // { file, text }
  function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const split = (l) => l.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
    const head = split(lines[0] || '').map((h) => h.toLowerCase());
    const col = (re) => head.findIndex((h) => re.test(h));
    const e = col(/e-?mail/), n = col(/name/), m = col(/nmls/);
    if (e < 0) return { error: 'No Email column found in the first row.' };
    return { rows: lines.slice(1).map(split).map((c) => ({ email: (c[e] || '').toLowerCase(), name: n > -1 ? c[n] : '', nmls: m > -1 ? c[m] : '' })).filter((r) => r.email) };
  }
  function sampleCSV() {
    const v = viewers('vendor', pv.name);
    const picks = v.slice(0, 3).map((r) => `${r.name},${r.email},`);
    const outside = people.find((p) => !v.some((r) => r.email === p.email));
    if (outside) picks.push(`${outside.name},${outside.email},`);
    picks.push('Jordan Ellis,jordan@ellishomeloans.com,2219034', 'Casey Moreno,casey.m@gmail.com,');
    return 'Name,Email,NMLS\n' + picks.join('\n');
  }
  document.addEventListener('click', (e) => {
    let m;
    if ((m = e.target.closest('[data-pv]'))) { e.preventDefault(); const [kind, ...rest] = m.dataset.pv.split('::'); openViewers(kind, rest.join('::')); return; }
    if ((m = e.target.closest('[data-pr-tile]'))) { e.preventDefault(); const sel = $('lr-type'); sel.value = sel.value === m.dataset.prTile ? 'all' : m.dataset.prTile; renderLender(); return; }
    if ((m = e.target.closest('[data-pr-export]'))) {
      e.preventDefault(); const lender = m.dataset.prExport === 'lender'; const n = lender ? lenderFiltered(false).length : vendorFiltered().length;
      showToast(`Exported ${n} ${lender ? 'lender request' : 'vendor connection'}${n === 1 ? '' : 's'} (${ranges[lender ? 'lenderrep' : 'vendorrep'].label}) to CSV.`); return;
    }
    if (e.target.closest('#pv-export')) { e.preventDefault(); showToast(`Exported ${viewerRows().length} members who viewed ${pv.name} to CSV.`); return; }
    if (e.target.closest('#pv-upload')) {
      e.preventDefault(); pending = null; $('su-file').value = ''; $('su-file-name').textContent = 'No file chosen'; $('su-err').hidden = true;
      $('su-sub').textContent = `${pv.name} — replaces any list uploaded before.`; openModal('signups'); return;
    }
    if (e.target.closest('#su-sample')) { e.preventDefault(); pending = { file: `${pv.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-signups.csv`, text: sampleCSV() }; $('su-file-name').textContent = pending.file + ' (sample)'; $('su-err').hidden = true; return; }
    if (e.target.closest('#su-go')) {
      e.preventDefault();
      if (!pending) { $('su-err').hidden = false; $('su-err').textContent = 'Choose a CSV file first.'; return; }
      const parsed = parseCSV(pending.text);
      if (parsed.error) { $('su-err').hidden = false; $('su-err').textContent = parsed.error; return; }
      const matched = [], unmatched = [];
      parsed.rows.forEach((r) => {
        const byEmail = people.find((p) => p.email.toLowerCase() === r.email);
        const byNmls = !byEmail && r.nmls ? members.find((p) => p.nmls && String(p.nmls) === r.nmls) : null;
        const hit = byEmail || byNmls;
        if (hit) matched.push(hit.email.toLowerCase()); else unmatched.push(r);
      });
      const all = signups(); all[pv.name] = { file: pending.file, at: fmtDate(TODAY), matched: [...new Set(matched)], unmatched }; saveSignups(all);
      closeModals(); renderViewers();
      showToast(`Uploaded ${pending.file}: ${matched.length} matched to members, ${unmatched.length} not matched.`);
    }
  });
  $('su-file').addEventListener('change', (e) => {
    const f = e.target.files[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { pending = { file: f.name, text: String(reader.result) }; $('su-file-name').textContent = f.name; $('su-err').hidden = true; };
    reader.readAsText(f);
  });

  renderLender(); renderVendor(); renderLenderViews();
  window.AmpPartnerReports = { renderLender, renderVendor, renderLenderViews, openViewers };
})();
