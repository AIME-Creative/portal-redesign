/* ============================================================
   AMP — Lender & vendor partner experience (member app)
   ------------------------------------------------------------
   Runs only when the signed-in user is a partner (app.js sets
   AMP_USER_TYPE = 'lender' | 'vendor'; prototype: review pill →
   AS Lender / Vendor). Members never see any of this.

     • Dashboard (their home): change-listing banner; page views
       by member tier (lenders: their lender page; vendors: each
       Market product + total); recent requests
     • Requests (My Requests): escalations / connections / Change AE
       sent to their company + their own support tickets. Full member
       details and "Sent to". Lenders reply to escalations here (or by
       email); connections / Change AE have "Email <member>"
     • View-only Lenders + Market (no escalate / connect / AE / member
       offers); events without registration; no hubs, Documents,
       escalations, FUSE, or billing
   Data: partner-store.js (users, contacts, page views) +
   requests-store.js (requests). Uses app.js globals: lenders,
   vendors, navigate, showToast, backArrow, openLender, openVendor.
   ============================================================ */
(function () {
  const TYPE = window.AMP_USER_TYPE, P = window.AmpPartners, S = window.AmpRequests, U = window.AMP_PARTNER_USER;
  if ((TYPE !== 'lender' && TYPE !== 'vendor') || !P || !S || !U) return;
  const isLender = TYPE === 'lender', COMPANY = U.company;
  const contact = P.contacts(COMPANY, TYPE);
  const products = isLender ? [] : P.productsOf(COMPANY, vendors.map((v) => v.name));
  const LISTING_EMAIL = isLender ? 'lenders@aimegroup.com' : 'vendors@aimegroup.com';
  const { fmt, statusBadge, TYPES } = S;
  const esc = fmt.esc, $ = (id) => document.getElementById(id);
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`;
  const ICO = {
    dash: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r="1.1" fill="currentColor" stroke="none"/>',
  };
  window.AMP_USER_NAME = U.first;
  document.body.classList.add('partner-mode', 'partner-' + TYPE);

  /* ============================================================
     Identity, navigation, member-only UI
     ============================================================ */
  const initials = `${U.first[0]}${U.last[0]}`;
  const roleLine = `${TYPE === 'lender' ? 'Lender' : 'Vendor'} partner`;
  document.querySelectorAll('.profile-card .avatar, .topbar-user .avatar').forEach((a) => { a.textContent = initials; });
  document.querySelector('.profile-card .pname').textContent = `${U.first} ${U.last}`;
  document.querySelector('.profile-card .prole').textContent = roleLine;
  document.querySelector('.profile-card').title = `${COMPANY} · ${roleLine}`;
  const tu = document.querySelector('.topbar-user');
  if (tu) { tu.querySelector('.u-name').textContent = `${U.first} ${U.last}`; tu.querySelector('.u-sub').textContent = roleLine; }

  const nav = document.querySelector('#sidebar .nav');
  // Dashboard replaces Home
  const home = nav.querySelector('[data-nav="dashboard"]');
  const dash = document.createElement('button');
  dash.className = 'nav-item'; dash.dataset.nav = 'partner';
  dash.innerHTML = `${svg(ICO.dash)} Dashboard`;
  nav.insertBefore(dash, home);
  // Member-only nav: Home, Documents, Learning & Training, My Hubs
  const hideNav = ['dashboard', 'documents', 'brokersedge', 'mortgagemornings', 'acceleratelive', 'wmn', 'ascent', 'vip'];
  hideNav.forEach((k) => nav.querySelectorAll(`.nav-item[data-nav="${k}"]`).forEach((n) => { n.hidden = true; }));
  nav.querySelectorAll('.nav-label').forEach((l) => { if (/Learning|My Hubs/i.test(l.textContent)) l.hidden = true; });
  // My Requests → the partner request inbox
  const req = nav.querySelector('.nav-item[data-nav="requests"]');
  if (req) {
    req.dataset.nav = 'partner-requests';
    req.querySelector('#rq-nav-count')?.remove();
    req.insertAdjacentHTML('beforeend', '<span class="rq-nav-count" id="pr-nav-count" title="Open requests needing your company"></span>');
  }
  // Mobile bottom bar: Home → Dashboard
  const bHome = document.querySelector('.bottom-nav-item[data-nav="dashboard"]');
  if (bHome) { bHome.dataset.nav = 'partner'; bHome.innerHTML = `${svg(ICO.dash)}<span>Dashboard</span>`; }
  // Lenders page intro (no "Connect a Lender" for partners)
  const lp = document.querySelector('#view-lenders .page-head p');
  if (lp) lp.textContent = 'AIME wholesale lender partners — view only for partner accounts.';

  const banner = (own) => `<div class="pp-banner">${svg(ICO.info)}<div>${own ? 'This is your company listing. ' : ''}If you would like to request a change to your company listing, please contact AIME by emailing <a href="mailto:${LISTING_EMAIL}">${LISTING_EMAIL}</a>.</div></div>`;
  const viewOnly = (what) => `<div class="pp-viewonly">${svg(ICO.eye)} View only — partner accounts can't ${what}.</div>`;

  /* ---------- view-only lender & vendor pages ---------- */
  const origOpenLender = window.openLender;
  window.openLender = function (i) {
    origOpenLender(i);
    const body = $('lender-detail-body'), l = lenders[i]; if (!body || !l) return;
    body.querySelectorAll('[data-modal]').forEach((b) => { const card = b.closest('.grid > .card'); if (card) card.remove(); else b.remove(); });
    const head = body.querySelector('.detail-head > div:last-child');
    if (head) head.insertAdjacentHTML('beforeend', viewOnly('submit escalations, connections, or Change AE requests'));
    if (l.name === COMPANY) body.querySelector('.back-link').insertAdjacentHTML('afterend', banner(true));
  };
  const origOpenVendor = window.openVendor;
  window.openVendor = function (i) {
    origOpenVendor(i);
    const body = $('market-detail-body'), v = vendors[i]; if (!body || !v) return;
    body.querySelector('[data-submit="vendor"]')?.remove();
    body.querySelector('.card-pad p').textContent = v.desc;
    const grid = body.querySelector('.grid');
    if (grid) grid.innerHTML = `<div class="card card-pad">${viewOnly('request connections or use member discounts')}</div>`;
    if (P.companyOf(v.name) === COMPANY) body.querySelector('.back-link').insertAdjacentHTML('afterend', banner(true));
  };

  /* ============================================================
     Company requests
     ============================================================ */
  const KINDS = isLender ? ['escalation', 'connection', 'changeae'] : ['connection'];
  function companyRequests() {
    return S.all().filter((r) => KINDS.includes(r.type) &&
      (isLender ? r.partner === COMPANY && !(r.fields || {}).Vendor : !!(r.fields || {}).Vendor && P.companyOf(r.partner) === COMPANY));
  }
  const ownTickets = () => S.all().filter((r) => r.type === 'support' && r.email === U.email);
  const sentTo = (r) => { const c = contact[r.type] || contact.connection; return c ? `${c.name} — ${c.email}` : '—'; };
  const sentToCell = (r) => { const c = contact[r.type] || contact.connection; return c ? `${esc(c.name)}<div class="pp-dim">${esc(c.email)}</div>` : '—'; };
  const needsYou = (r) => r.type === 'escalation' && r.status === 'Received';
  const memberOf = (r) => P.member(r.email);
  const product = (r) => (r.fields || {}).Vendor || r.partner;
  // Product is only called out when the vendor company has more than one Market product.
  const multi = products.length > 1;
  // Multi-product vendors get a Product column, so the row title drops the repeated product name.
  const rowTitle = (r) => (multi && r.type === 'connection' ? 'Connection request' : r.title);

  /* ---------- range ---------- */
  let days = 30;
  const inRange = (iso) => Date.now() - new Date(iso) <= days * 864e5;

  /* ============================================================
     Dashboard
     ============================================================ */
  const tile = (cls, ico, val, lbl, sub) => `<div class="stat"><div class="s-ico ${cls}">${svg(ico)}</div><div class="s-val">${val}</div><div class="s-lbl">${lbl}</div>${sub ? `<div class="pp-sub">${sub}</div>` : ''}</div>`;
  const pct = (n, t) => (t ? Math.round((n / t) * 100) + '%' : '0%');
  function tierRows(v) {
    return P.TIERS.map((t) => `<div class="pp-tier"><span class="pp-tier-l">${t}</span><span class="pp-bar"><i style="width:${pct(v[t], v.total)}"></i></span><span class="pp-tier-n">${v[t].toLocaleString()}</span><span class="pp-tier-p">${pct(v[t], v.total)}</span></div>`).join('') +
      `<div class="pp-tier total"><span class="pp-tier-l">Total</span><span></span><span class="pp-tier-n">${v.total.toLocaleString()}</span><span class="pp-tier-p">${v.unique.toLocaleString()} unique</span></div>`;
  }
  function reqTable(rows, cols) {
    if (!rows.length) return '<div class="empty" style="padding:24px"><p>No requests in this period.</p></div>';
    return `<div class="table-scroll"><table class="pp-table"><thead><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => {
      const m = memberOf(r);
      const cells = {
        Type: `<span class="pp-type t-${r.type}">${TYPES[r.type].label}</span>`,
        Member: `<strong>${esc(r.member)}</strong><div class="pp-dim">${esc(r.email)} · ${esc(m.phone)}</div>`,
        Product: esc(product(r)),
        Submitted: fmt.date(r.createdAt),
        'Sent to': `<span class="pp-dim">${esc(sentTo(r))}</span>`,
        Status: statusBadge(r.status) + (r.followUp && r.followUp.status === 'open' ? ' <span class="rq-flag amber">Follow-up</span>' : ''),
      };
      return `<tr data-partner-open="${r.id}">${cols.map((c) => `<td>${cells[c]}</td>`).join('')}</tr>`;
    }).join('')}</tbody></table></div>`;
  }

  function renderDashboard() {
    const box = $('partner-body'); if (!box) return;
    const reqs = companyRequests(), recent = reqs.filter((r) => inRange(r.createdAt));
    const count = (t) => recent.filter((r) => r.type === t).length;
    const rangeSel = `<select class="select filter-select" id="pp-range">${[[7, 'Last 7 days'], [30, 'Last 30 days'], [90, 'Last 90 days'], [180, 'Last 6 months']].map(([d, l]) => `<option value="${d}" ${d === days ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
    let html = `<div class="page-head page-head-row"><div><h1>Welcome, ${esc(U.first)}</h1><p>${esc(COMPANY)} · ${roleLine} dashboard</p></div>${rangeSel}</div>${banner(false)}`;

    if (isLender) {
      const v = P.views(COMPANY, days);
      html += `<div class="stat-row pp-tiles">
          ${tile('i-navy', ICO.eye, v.total.toLocaleString(), 'Lender page views', `${v.unique.toLocaleString()} unique members`)}
          ${tile('i-pink', '<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>', count('escalation'), 'Escalations', `${reqs.filter(needsYou).length} awaiting a response`)}
          ${tile('i-cyan', '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>', count('connection'), 'Connection requests')}
          ${tile('i-green', '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6"/>', count('changeae'), 'Change AE requests')}
        </div>
        <div class="grid pp-grid" style="grid-template-columns:1fr 1.7fr;align-items:start">
          <div class="card card-pad"><div class="section-title"><h2 style="font-size:16px">Lender page views by member tier</h2></div>${tierRows(v)}
            <p class="pp-dim" style="margin-top:8px">Views of your lender page in AMP's Lenders directory, by the viewing member's tier.</p></div>
          <div class="card card-pad"><div class="section-title"><h2 style="font-size:16px">Recent requests</h2><a href="#" data-nav="partner-requests">View all <span>→</span></a></div>
            ${reqTable(recent.slice(0, 7), ['Type', 'Member', 'Submitted', 'Sent to', 'Status'])}</div>
        </div>`;
    } else {
      const rows = products.map((p) => Object.assign({ name: p }, P.views(p, days)));
      const tot = rows.reduce((a, r) => { P.TIERS.forEach((t) => { a[t] += r[t]; }); a.total += r.total; a.unique += r.unique; return a; }, { Premium: 0, Elite: 0, VIP: 0, total: 0, unique: 0 });
      html += `<div class="stat-row pp-tiles">
          ${tile('i-navy', ICO.eye, tot.total.toLocaleString(), 'Market page views', `${tot.unique.toLocaleString()} unique members`)}
          ${tile('i-cyan', '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>', count('connection'), 'Connection requests', `${products.length} product${products.length === 1 ? '' : 's'}`)}
          ${tile('i-pink', '<path d="M3 9l1-5h16l1 5M4 9v11h16V9M4 9h16M9 13h6"/>', products.length, 'Market listings', 'Listed for Premium, Elite & VIP')}
          ${tile('i-green', '<path d="M20 6L9 17l-5-5"/>', tot.total ? ((count('connection') / tot.unique) * 100).toFixed(1) + '%' : '—', 'Connection rate', 'Requests ÷ unique viewers')}
        </div>
        <div class="card card-pad"><div class="section-title"><h2 style="font-size:16px">${multi ? 'Page views by product' : 'Market page views'}</h2><span class="count-note">by the viewing member's tier</span></div>
          <div class="table-scroll"><table class="pp-table"><thead><tr><th>Product</th><th>Premium</th><th>Elite</th><th>VIP</th><th>Total</th><th>Unique</th></tr></thead><tbody>
            ${rows.map((r) => `<tr><td><strong>${esc(r.name)}</strong></td>${P.TIERS.map((t) => `<td>${r[t].toLocaleString()}</td>`).join('')}<td><strong>${r.total.toLocaleString()}</strong></td><td>${r.unique.toLocaleString()}</td></tr>`).join('')}
            ${!multi ? '' : `<tr class="pp-total"><td>All products</td>${P.TIERS.map((t) => `<td>${tot[t].toLocaleString()}</td>`).join('')}<td>${tot.total.toLocaleString()}</td><td>${tot.unique.toLocaleString()}</td></tr>`}
          </tbody></table></div></div>
        <div class="card card-pad" style="margin-top:20px"><div class="section-title"><h2 style="font-size:16px">Recent connection requests</h2><a href="#" data-nav="partner-requests">View all <span>→</span></a></div>
          ${reqTable(recent.slice(0, 8), ['Member', ...(multi ? ['Product'] : []), 'Submitted', 'Sent to', 'Status'])}</div>`;
    }
    box.innerHTML = html;
  }

  /* ============================================================
     Requests (partner My Requests)
     ============================================================ */
  let filter = 'all', productFilter = 'all';
  function renderRequests() {
    const box = $('partner-requests-body'); if (!box) return;
    const reqs = companyRequests(), mine = ownTickets(), all = [...reqs, ...mine].sort((a, b) => (S.lastActivity(b) > S.lastActivity(a) ? 1 : -1));
    const chips = [['all', 'All'], ...KINDS.map((k) => [k, k === 'changeae' ? 'Change AE' : TYPES[k].label + 's']), ['support', 'My support tickets']];
    const rows = all.filter((r) => (filter === 'all' || r.type === filter) &&
      (productFilter === 'all' || (r.type !== 'support' && product(r) === productFilter)));
    const productSel = multi ? `<select class="select filter-select" id="pp-product" style="width:auto;margin-left:auto">${[['all', 'All products'], ...products.map((p) => [p, p])].map(([v, l]) => `<option value="${esc(v)}" ${v === productFilter ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>` : '';
    box.innerHTML = `<div class="page-head"><h1>Requests</h1><p>${isLender ? 'Escalations, connections, and Change AE requests' : 'Connection requests'} sent to ${esc(COMPANY)} by AIME members — plus your own support tickets.</p></div>
      ${isLender ? `<div class="stat-row pp-tiles">
        ${tile('i-pink', '<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>', reqs.filter((r) => r.type === 'escalation' && r.status !== 'Resolved').length, 'Open escalations')}
        ${tile('i-amber', '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>', reqs.filter((r) => r.followUp && r.followUp.status === 'open').length, 'Follow-ups requested', 'The member asked AIME to chase')}
        ${tile('i-cyan', '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>', reqs.filter((r) => r.type === 'connection').length, 'Connection requests')}
        ${tile('i-green', '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6"/>', reqs.filter((r) => r.type === 'changeae').length, 'Change AE requests')}</div>` : ''}
      <div class="filters">${chips.map(([k, l]) => `<button class="chip ${filter === k ? 'active' : ''}" data-pr-filter="${k}">${l}</button>`).join('')}
        ${productSel}<span class="count-note" style="${multi ? 'margin-left:12px' : 'margin-left:auto'};align-self:center">${rows.length} request${rows.length === 1 ? '' : 's'}</span></div>
      <div class="card">${rows.length ? `<div class="table-scroll"><table class="pp-table pp-click"><thead><tr><th>Ref</th><th>Request</th>${multi ? '<th>Product</th>' : ''}<th>Member</th><th>Sent to</th><th>Submitted</th><th>Status</th></tr></thead><tbody>
        ${rows.map((r) => `<tr data-partner-open="${r.id}"><td class="rq-ref">${r.id}</td>
          <td><div class="t-id">${S.icon(r.type, true)}<div><strong>${esc(rowTitle(r))}</strong><div class="pp-dim">${r.type === 'support' ? 'Your ticket' : rowTitle(r) === r.title ? TYPES[r.type].label : ''}${r.followUp && r.followUp.status === 'open' ? ' · <span class="rq-flag amber">Member requested follow-up</span>' : ''}</div></div></div></td>
          ${multi ? `<td>${r.type === 'support' ? '<span class="pp-dim">—</span>' : `<span class="pp-product">${esc(product(r))}</span>`}</td>` : ''}
          <td>${r.type === 'support' ? '—' : `<strong>${esc(r.member)}</strong><div class="pp-dim">${esc(r.email)}</div>`}</td>
          <td>${r.type === 'support' ? '<span class="pp-dim">AIME support</span>' : sentToCell(r)}</td>
          <td>${fmt.date(r.createdAt)}</td><td>${statusBadge(r.status)}</td></tr>`).join('')}
        </tbody></table></div>` : '<div class="empty"><h4>No requests yet</h4><p>Requests members send to your company will appear here.</p></div>'}</div>`;
    const badge = $('pr-nav-count'); if (badge) badge.textContent = reqs.filter(needsYou).length || '';
  }

  let currentId = null;
  function renderDetail() {
    const box = $('partner-request-body'), r = S.get(currentId); if (!box || !r) return;
    if (r.type === 'support') { box.innerHTML = ''; return; }
    const m = memberOf(r), first = r.member.split(' ')[0];
    const kv = (k, v) => `<div class="rq-kv"><span class="k">${k}</span><span class="v">${v}</span></div>`;
    // Vendor connections store the Market listing as "Vendor"; to the vendor company that's their product.
    const fields = Object.entries(r.fields || {}).filter(([k]) => !/^Shared with/.test(k)).map(([k, v]) => [k === 'Vendor' ? 'Product' : k, v]).map(([k, v]) => `<div class="rq-kv ${String(v).length > 40 ? 'block' : ''}"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join('');
    const subject = encodeURIComponent(`Your AIME ${r.type === 'changeae' ? 'Change AE' : 'connection'} request — ${isLender ? COMPANY : product(r)}`);
    const bodyTxt = encodeURIComponent(`Hi ${first},\n\nThanks for your ${r.type === 'changeae' ? 'request to change your account executive' : 'connection request through AIME'}. `);
    let action;
    if (r.type === 'escalation') {
      action = `<div class="rq-composer" style="border-top:0;padding-top:0;margin-top:0">
        <h3 style="font-size:15px;margin-bottom:8px">Reply to ${esc(first)}</h3>
        <textarea class="input" id="pp-reply" placeholder="Share an update on this loan — it's added to the escalation and ${esc(first)} is notified."></textarea>
        <div class="rq-composer-foot"><span class="hint">You can also reply to the escalation email — replies land here too.</span>
          <button class="btn btn-outline btn-sm" data-pp-reply="resolve">Reply &amp; mark resolved</button><button class="btn btn-primary btn-sm" data-pp-reply="send">Send reply</button></div></div>`;
    } else {
      action = `<h3 style="font-size:15px;margin-bottom:8px">Contact ${esc(first)}</h3>
        <p class="pp-dim" style="margin:0 0 12px">${r.type === 'changeae' ? `${esc(first)} asked for a new account executive. Reach out directly to help.` : `${esc(first)} asked to connect. Reach out directly — connections aren't tracked after delivery.`}</p>
        <a class="btn btn-primary" href="mailto:${esc(r.email)}?subject=${subject}&body=${bodyTxt}">${svg(ICO.mail)} Email ${esc(r.member)}</a>
        <span class="pp-dim" style="margin-left:10px">Opens your email app</span>`;
    }
    box.innerHTML = `<a class="back-link" data-nav="partner-requests">${backArrow} Back to requests</a>
      <div class="card card-pad"><div class="rq-head">${S.icon(r.type)}<div style="flex:1;min-width:0">
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="badge badge-navy">${TYPES[r.type].label}</span>${statusBadge(r.status)}${r.followUp && r.followUp.status === 'open' ? '<span class="rq-flag amber">Member requested follow-up</span>' : ''}</div>
        <h1 style="margin-top:10px">${esc(r.title)}</h1>
        <div class="rq-head-meta"><span>Ref <strong>${r.id}</strong></span><span>Member <strong>${esc(r.member)}</strong></span><span>Submitted <strong>${fmt.dateTime(r.createdAt)}</strong></span>${multi ? `<span>Product <strong>${esc(product(r))}</strong></span>` : ''}</div>
      </div></div>${S.trackerHTML(r)}</div>
      <div class="grid rq-detail-grid" style="grid-template-columns:1.6fr 1fr;align-items:start;margin-top:20px">
        <div><div class="card card-pad">${action}</div>
          <div class="card card-pad" style="margin-top:20px"><h3 style="font-size:16px;margin-bottom:18px">Activity</h3>${S.timelineHTML(r, 'partner')}</div></div>
        <div>
          <div class="card card-pad"><h3 style="font-size:15px;margin-bottom:6px">Member</h3>
            ${kv('Name', esc(r.member))}${kv('Email', `<a href="mailto:${esc(r.email)}">${esc(r.email)}</a>`)}${kv('Phone', esc(m.phone))}${kv('NMLS #', esc(m.nmls))}
            ${kv('Company', esc(m.company))}${kv('Licensed in', esc((m.licensed || []).join(', ') || '—'))}${kv('AIME tier', esc(r.tier))}</div>
          <div class="card card-pad" style="margin-top:20px"><h3 style="font-size:15px;margin-bottom:6px">Submitted details</h3>${fields || '<p class="pp-dim">—</p>'}</div>
          <div class="card card-pad" style="margin-top:20px"><h3 style="font-size:15px;margin-bottom:6px">Sent to</h3><p style="margin:0;font-size:14px">${esc(sentTo(r))}</p>
            <p class="pp-dim" style="margin:6px 0 0">Set on your company listing — email ${LISTING_EMAIL} to change it.</p></div>
        </div>
      </div>`;
  }
  function openRequest(id) {
    const r = S.get(id); if (!r) return;
    if (r.type === 'support') { window.AmpMyRequests && AmpMyRequests.preview(id); return; }   // own tickets: the member ticket view
    currentId = id; $('view-partner-request').dataset.id = id; renderDetail(); navigate('partner-request');
  }

  /* ---------- notifications (company requests) ---------- */
  function renderNotifs() {
    const list = document.querySelector('.notif-list'); if (!list) return;
    const items = [];
    companyRequests().forEach((r) => {
      items.push({ at: r.createdAt, id: r.id, t: `New ${{ escalation: 'escalation', connection: 'connection request', changeae: 'Change AE request' }[r.type]} from ${r.member}`, s: r.title });
      if (r.followUp && r.followUp.status === 'open') items.push({ at: r.followUp.requestedAt, id: r.id, t: `${r.member} requested a follow-up`, s: `${r.id} · the AIME team is following up too`, warn: true });
    });
    list.innerHTML = items.sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 6).map((n) =>
      `<button class="notif-item ${Date.now() - new Date(n.at) < 3 * 864e5 ? 'unread' : ''}" data-partner-open="${n.id}"><span class="ni-ico ${n.warn ? 'i-amber' : 'i-pink'}">${svg(n.warn ? '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>' : '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.5-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.7 1.1z"/>')}</span>
        <div class="ni-main"><div class="ni-t">${esc(n.t)}</div><div class="ni-s">${esc(n.s)} · ${fmt.ago(n.at)}</div></div></button>`).join('') || '<div class="empty" style="padding:20px"><p>No notifications yet.</p></div>';
  }

  /* ---------- events ---------- */
  document.addEventListener('click', (e) => {
    let m;
    if ((m = e.target.closest('[data-partner-open]'))) { e.preventDefault(); if (typeof closeNotif === 'function') closeNotif(); openRequest(m.dataset.partnerOpen); return; }
    if ((m = e.target.closest('[data-pr-filter]'))) { e.preventDefault(); filter = m.dataset.prFilter; renderRequests(); return; }
    if ((m = e.target.closest('[data-pp-reply]'))) {
      e.preventDefault();
      const text = $('pp-reply').value.trim(), r = S.get(currentId);
      if (!text) { $('pp-reply').focus(); return; }
      const via = `portal reply · ${U.first} ${U.last}`;
      if (m.dataset.ppReply === 'resolve') S.lenderAction(r.id, 'resolved', text, via); else S.lenderResponse(r.id, text, via);
      showToast(m.dataset.ppReply === 'resolve' ? `Reply sent and ${r.id} marked resolved — ${r.member} has been notified.` : `Reply sent — ${r.member} has been notified.`);
    }
  });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'pp-range') { days = +e.target.value; renderDashboard(); }
    if (e.target.id === 'pp-product') { productFilter = e.target.value; renderRequests(); }
  });

  function renderAll() {
    renderDashboard(); renderRequests(); renderNotifs();
    if (currentId && $('view-partner-request').classList.contains('active')) renderDetail();
  }
  S.onChange(renderAll);
  renderAll();

  window.AmpPartnerPortal = { openRequest, companyRequests, COMPANY, TYPE, MULTI: multi };

  // Partners land on their Dashboard (unless a deep link says otherwise)
  const h = (location.hash || '').replace('#', '');
  if (!h || h === 'dashboard') navigate('partner');
})();
