/* ============================================================
   AMP Admin — Membership scorecard (Overview → Scorecard)
   ------------------------------------------------------------
   One page for AIME membership health: how many paying members,
   what they pay, who's leaving, what's renewing next, FUSE, and
   how members use what we offer. Brought in from the "AIME
   Membership Scorecard" artifact so it lives in admin.
   Sections: headline + 4 key numbers · Growth and retention (paying
   members, joined vs left, monthly retention) · Sign-ups (conversion, where new members came from) · Tier mix · Risk ahead
   (past due, set to cancel, enterprise seats, renewals by month) ·
   FUSE · Engagement.
   Production: membership numbers live from Stripe each time the page
   opens (Stripe's reporting refreshes a few times a day); FUSE and
   engagement from the portal; FUSE 2025 a saved GHL count.
   Prototype: made-up sample numbers (the real scorecard's figures stay
   private — this prototype is published publicly).
   Uses admin.js globals: navigate.
   ============================================================ */
(function () {
  const dash = document.querySelector('#sidebar .nav-item[data-nav="dashboard"]');
  const dashView = document.getElementById('view-dashboard');
  if (!dash || !dashView) return;
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`;
  const money = (n) => '$' + Math.round(n).toLocaleString();
  const C = { navy: '#021649', pink: '#dd1969', cyan: '#20adce', blue: '#2563eb', orange: '#ea6a1f', teal: '#14b8a6', grid: '#e7eaf2', muted: '#8a93a8' };

  /* ---------- made-up sample data (shaped like the real scorecard) ---------- */
  const MONTHS = ['Nov 24', 'Dec 24', 'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25',
    'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26'];
  const paying = [905, 900, 895, 902, 898, 870, 830, 662, 640, 672, 705, 748, 805, 880, 925, 942, 935, 938, 946, 962, 980, 1022, 1086, 1210];
  const joined = [10, 12, 20, 26, 24, 22, 18, 14, 28, 40, 52, 64, 82, 58, 86, 66, 54, 48, 60, 44, 66, 104, 94, 74];
  const left = [6, 4, 18, 205, 14, 16, 24, 268, 28, 20, 18, 24, 28, 40, 16, 32, 30, 18, 34, 28, 42, 48, 56, 28];
  const retention = [96.6, 97.2, 96.1, 76, 96.4, 96.2, 94.1, 69, 92.8, 95.9, 96.4, 96.1, 96.5, 95.6, 97.3, 96.4, 96.1, 96.9, 96.4, 95.7, 96.3, 96.9, 96.6, 96.8];
  const TIERS = [
    { tier: 'Premium', members: 920, yoy: 19.8, dues: 190440, duesYoy: 22.1, per: 207, monthly: 12.4 },
    { tier: 'Elite', members: 160, yoy: -6.2, dues: 112160, duesYoy: -5.0, per: 701, monthly: 7.2 },
    { tier: 'VIP', members: 131, yoy: 41.9, dues: 222569, duesYoy: 38.6, per: 1699, monthly: 9.8 },
    { tier: 'All', members: 1210, yoy: 18.4, dues: 525169, duesYoy: 21.2, per: 434, monthly: 11.6 },
  ];
  // Sign-ups (moved here from Analytics → Overview). Made-up sample numbers; Paid = last month's joined (74).
  const SIGNUP_FUNNEL = [
    { label: 'Started sign-up', val: 210 }, { label: 'Contact captured', val: 152 }, { label: 'Checkout started', val: 112 },
    { label: 'Paid', val: 74 }, { label: 'Onboarded', val: 69 },
  ];
  const ACQUISITION = [
    { name: 'Referral', sub: '38%', val: 28 }, { name: 'FUSE & events', sub: '22%', val: 16 }, { name: 'Paid social', sub: '18%', val: 13 },
    { name: 'Email', sub: '12%', val: 9 }, { name: 'Partner co-marketing', sub: '10%', val: 8 },
  ];
  const RENEW = [
    { m: 'Nov 2026', n: 18, dues: 11920, p: 14, e: 2, v: 2 }, { m: 'Dec 2026', n: 121, dues: 78410, p: 58, e: 38, v: 25 },
    { m: 'Jan 2027', n: 268, dues: 101330, p: 206, e: 44, v: 18 }, { m: 'Feb 2027', n: 24, dues: 8610, p: 21, e: 2, v: 1 },
    { m: 'Mar 2027', n: 33, dues: 11870, p: 29, e: 2, v: 2 }, { m: 'Apr 2027', n: 31, dues: 15960, p: 24, e: 3, v: 4 },
  ];
  const ACTIVE = [['Dec 25', 74], ['Jan 26', 101], ['Feb 26', 77], ['Mar 26', 90], ['Apr 26', 84], ['May 26', 118], ['Jun 26', 126], ['Jul 26', 155], ['Aug 26', 462], ['Sep 26', 401], ['Oct 26', 158], ['Nov 26', 19]];
  const REQUESTS = [['Nov 2026', 1, 1, 2, 6], ['Oct 2026', 5, 13, 33, 68], ['Sep 2026', 6, 22, 55, 139], ['Aug 2026', 9, 26, 58, 137], ['Jul 2026', 7, 11, 23, 126], ['Jun 2026', 7, 10, 15, 114],
    ['May 2026', 6, 11, 10, 0], ['Apr 2026', 8, 9, 10, 0], ['Mar 2026', 13, 10, 14, 0], ['Feb 2026', 3, 4, 20, 0], ['Jan 2026', 5, 10, 29, 0], ['Dec 2025', 2, 9, 27, 0]];

  /* ---------- tiny SVG charts ---------- */
  const W = 520, H = 220, P = { l: 40, r: 10, t: 12, b: 28 };
  const xAt = (i, n) => P.l + (i * (W - P.l - P.r)) / Math.max(1, n - 1);
  const yAt = (v, lo, hi) => P.t + (H - P.t - P.b) * (1 - (v - lo) / (hi - lo));
  function axes(lo, hi, ticks, labels, fmt, every) {
    const ys = ticks.map((t) => `<line x1="${P.l}" x2="${W - P.r}" y1="${yAt(t, lo, hi)}" y2="${yAt(t, lo, hi)}" stroke="${C.grid}"/><text x="${P.l - 6}" y="${yAt(t, lo, hi) + 4}" text-anchor="end" font-size="10" fill="${C.muted}">${fmt(t)}</text>`).join('');
    const xs = labels.map((l, i) => (i % every === 0 ? `<text x="${xAt(i, labels.length)}" y="${H - 8}" text-anchor="middle" font-size="10" fill="${C.muted}">${l}</text>` : '')).join('');
    return ys + xs;
  }
  function line(vals, lo, hi, color, extra) {
    const pts = vals.map((v, i) => `${xAt(i, vals.length)},${yAt(v, lo, hi)}`).join(' ');
    return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round"/>${extra ? vals.map((v, i) => `<circle cx="${xAt(i, vals.length)}" cy="${yAt(v, lo, hi)}" r="2.6" fill="${v < 90 ? C.pink : color}"/>`).join('') : ''}`;
  }
  const svgWrap = (inner, label) => `<svg class="sc-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${inner}</svg>`;
  const chartPaying = () => svgWrap(axes(0, 1500, [0, 500, 1000, 1500], MONTHS, (t) => t.toLocaleString(), 3) + line(paying, 0, 1500, C.blue), 'Paying members, start of each month');
  function chartJoinedLeft() {
    const hi = 350, n = MONTHS.length, bw = (W - P.l - P.r) / n / 2.6;
    const bars = MONTHS.map((m, i) => {
      const x = P.l + (i + 0.5) * (W - P.l - P.r) / n;
      return `<rect x="${x - bw - 1}" y="${yAt(joined[i], 0, hi)}" width="${bw}" height="${yAt(0, 0, hi) - yAt(joined[i], 0, hi)}" fill="${C.blue}" rx="1.5"><title>${m}: ${joined[i]} joined</title></rect>
        <rect x="${x + 1}" y="${yAt(left[i], 0, hi)}" width="${bw}" height="${yAt(0, 0, hi) - yAt(left[i], 0, hi)}" fill="${C.orange}" rx="1.5"><title>${m}: ${left[i]} left</title></rect>`;
    }).join('');
    const xs = MONTHS.map((m, i) => (i % 4 === 0 ? `<text x="${P.l + (i + 0.5) * (W - P.l - P.r) / n}" y="${H - 8}" text-anchor="middle" font-size="10" fill="${C.muted}">${m}</text>` : '')).join('');
    const ys = [0, 100, 200, 300].map((t) => `<line x1="${P.l}" x2="${W - P.r}" y1="${yAt(t, 0, hi)}" y2="${yAt(t, 0, hi)}" stroke="${C.grid}"/><text x="${P.l - 6}" y="${yAt(t, 0, hi) + 4}" text-anchor="end" font-size="10" fill="${C.muted}">${t}</text>`).join('');
    return svgWrap(ys + bars + xs, 'Joined vs. left each month');
  }
  function chartRetention() {
    const lo = 60, hi = 100, target = yAt(96.5, lo, hi);
    return svgWrap(axes(lo, hi, [60, 70, 80, 90, 100], MONTHS, (t) => t + '%', 3) +
      `<line x1="${P.l}" x2="${W - P.r}" y1="${target}" y2="${target}" stroke="${C.pink}" stroke-dasharray="5 4" stroke-width="1.4"/><text x="${W - P.r}" y="${target - 5}" text-anchor="end" font-size="10" fill="${C.pink}">96.5% target</text>` +
      line(retention, lo, hi, C.blue, true), 'Monthly retention');
  }
  function chartRenewals() {
    const hi = 350, n = RENEW.length, bw = (W - P.l - P.r) / n * 0.42;
    const bars = RENEW.map((r, i) => {
      const x = P.l + (i + 0.5) * (W - P.l - P.r) / n - bw / 2;
      // Stack Premium, Elite, VIP from the baseline up.
      let base = 0;
      const seg = (v, c, t) => { const top = yAt(base + v, 0, hi), bottom = yAt(base, 0, hi); base += v; return `<rect x="${x}" y="${top}" width="${bw}" height="${bottom - top}" fill="${c}"><title>${r.m}: ${v} ${t}</title></rect>`; };
      return seg(r.p, C.blue, 'Premium') + seg(r.e, C.orange, 'Elite') + seg(r.v, C.teal, 'VIP') +
        `<text x="${x + bw / 2}" y="${H - 8}" text-anchor="middle" font-size="10" fill="${C.muted}">${r.m.replace(' 20', ' ')}</text>`;
    }).join('');
    const ys = [0, 100, 200, 300].map((t) => `<line x1="${P.l}" x2="${W - P.r}" y1="${yAt(t, 0, hi)}" y2="${yAt(t, 0, hi)}" stroke="${C.grid}"/><text x="${P.l - 6}" y="${yAt(t, 0, hi) + 4}" text-anchor="end" font-size="10" fill="${C.muted}">${t}</text>`).join('');
    return svgWrap(ys + bars, 'Annual renewals due, next 6 months');
  }
  function chartActive() {
    const hi = 550, n = ACTIVE.length, bw = (W - P.l - P.r) / n * 0.55;
    const bars = ACTIVE.map(([m, v], i) => {
      const x = P.l + (i + 0.5) * (W - P.l - P.r) / n - bw / 2;
      return `<rect x="${x}" y="${yAt(v, 0, hi)}" width="${bw}" height="${yAt(0, 0, hi) - yAt(v, 0, hi)}" fill="${i === n - 1 ? '#a9c3f5' : C.blue}" rx="2"><title>${m}: ${v} members${i === n - 1 ? ' (month so far)' : ''}</title></rect>
        <text x="${x + bw / 2}" y="${H - 8}" text-anchor="middle" font-size="10" fill="${C.muted}">${m.split(' ')[0]}</text>`;
    }).join('');
    const ys = [0, 100, 200, 300, 400, 500].map((t) => `<line x1="${P.l}" x2="${W - P.r}" y1="${yAt(t, 0, hi)}" y2="${yAt(t, 0, hi)}" stroke="${C.grid}"/><text x="${P.l - 6}" y="${yAt(t, 0, hi) + 4}" text-anchor="end" font-size="10" fill="${C.muted}">${t}</text>`).join('');
    return svgWrap(ys + bars, 'Members active in the portal each month');
  }
  const hbars = (rows, color) => { const max = Math.max(...rows.map((r) => r[1])); return rows.map(([l, v]) => `<div class="sc-hbar"><span class="sc-hbar-l">${l}</span><span class="sc-hbar-track"><i style="width:${(v / max * 100).toFixed(1)}%;background:${color}"></i></span><span class="sc-hbar-v">${v.toLocaleString()}</span></div>`).join(''); };

  /* ---------- page ---------- */
  const pct = (v) => `<span class="${v < 0 ? 'sc-down' : 'sc-up'}">${v > 0 ? '+' : ''}${v.toFixed(1)}%</span>`;
  const num = (def, big, label, sub) => `<div class="sc-num"><span class="sc-num-l">${label}</span><span class="sc-num-v">${big}</span><span class="sc-num-s">${sub}</span></div>`;
  const card = (title, sub, body, cls) => `<div class="card card-pad sc-card ${cls || ''}"><div class="sc-card-t">${title}</div>${sub ? `<div class="sc-card-s">${sub}</div>` : ''}${body}</div>`;
  dash.insertAdjacentHTML('afterend', `<button class="nav-item" data-nav="scorecard">${svg('<path d="M12 20V10M18 20V4M6 20v-4"/>')} Scorecard</button>`);
  dashView.insertAdjacentHTML('afterend', `<section class="view" id="view-scorecard">
    <div class="adm-section-head"><div class="page-head" style="margin:0"><h1>Membership scorecard</h1>
      <p><strong>1,210</strong> paying members today, <span class="sc-up">+18.4%</span> from a year ago. We're growing by about <strong>+16.5</strong> members a month. Reaching <strong>2,000</strong> in 12 months takes about <strong>+66</strong> a month.</p></div>
      <span class="sc-updated">${svg('<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0114.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0020.5 15"/>')} Updated when opened</span></div>
    <div class="sc-nums">
      ${num('paying', '1,210', 'Paying members', '<span class="sc-up">+18.4%</span> vs a year ago')}
      ${num('dues', '$525.2K', 'Annual dues (members\' current plans, annualized)', '<span class="sc-up">+21.2%</span> vs a year ago')}
      ${num('per', '$434', 'Dues per member', 'A year ago: $418')}
      ${num('goal', '790', 'Members still needed for the goal', 'Need +66/mo · pace +16.5/mo')}
    </div>
    <h2 class="sc-h">Growth and retention</h2>
    <div class="sc-three">
      ${card('Paying members, start of each month', 'Last 24 full months. Company-paid enterprise seats are not counted.', chartPaying())}
      ${card('Joined vs. left each month', 'Joined: first-time paying members. Left: no paid membership a month later. Plan switches don\'t count as leaving.', `<div class="sc-legend"><span><i style="background:${C.blue}"></i>Joined</span><span><i style="background:${C.orange}"></i>Left</span></div>` + chartJoinedLeft())}
      ${card('Monthly retention', 'Share of members at the start of a month who still pay at the start of the next. Dashed line: 96.5% target. Moves to enterprise seats count as leaving here, so this can read a little lower than the bonus numbers.', chartRetention())}
    </div>
    <h2 class="sc-h">Sign-ups</h2>
    <div class="sc-two">
      ${card('Sign-up conversion, last 30 days', 'People who started signing up, and how many reached each step. Paid matches last month\'s joined count above.', funnelChart(SIGNUP_FUNNEL))}
      ${card('Where new members came from, last 30 days', 'New paying members by how they found AIME.', rankList(ACQUISITION, C.blue))}
    </div>
    <h2 class="sc-h">Tier mix</h2>
    ${card('Members and dues by tier, today', 'Change is vs. a year ago. A member with two plans can appear in two tiers, so tiers can add up to one more than the total.', `<div class="table-scroll"><table class="adm sc-table"><thead><tr><th>Tier</th><th>Members</th><th>vs. a year ago</th><th>Annual dues</th><th>Dues vs. a year ago</th><th>Dues per member</th><th>On monthly billing</th></tr></thead><tbody>
      ${TIERS.map((t) => `<tr class="${t.tier === 'All' ? 'sc-total' : ''}"><td class="t-strong">${t.tier}</td><td>${t.members.toLocaleString()}</td><td>${pct(t.yoy)}</td><td>${money(t.dues)}</td><td>${pct(t.duesYoy)}</td><td>${money(t.per)}</td><td>${t.monthly}%</td></tr>`).join('')}
      </tbody></table></div>`)}
    <h2 class="sc-h">Risk ahead</h2>
    <div class="sc-nums sc-nums-3">
      ${num('pastdue', '37', 'Past due now', '$17,940 in annual dues')}
      ${num('cancel', '31', 'Set to cancel at renewal', '$15,220 in annual dues')}
      ${num('enterprise', '3,500', 'Company-paid enterprise seats', 'Upgrade pool, not counted as paying members')}
    </div>
    <div class="sc-two">
      ${card('Annual renewals due, next 6 months', 'Annual members whose renewal falls in each month, by tier.', `<div class="sc-legend"><span><i style="background:${C.blue}"></i>Premium</span><span><i style="background:${C.orange}"></i>Elite</span><span><i style="background:${C.teal}"></i>VIP</span></div>` + chartRenewals())}
      ${card('Renewals by month', 'All tiers. Dues are what those members pay at renewal.', `<table class="adm sc-table"><thead><tr><th>Month</th><th>Members renewing</th><th>Dues at stake</th></tr></thead><tbody>
        ${RENEW.map((r) => `<tr><td>${r.m}</td><td>${r.n}</td><td>${money(r.dues)}</td></tr>`).join('')}</tbody></table>`)}
    </div>
    <h2 class="sc-h">FUSE</h2>
    <div class="sc-nums">
      ${num('fusepeople', '1,040', 'FUSE 2026 people (registrations + guests)', '<span class="sc-up">+7.2%</span> vs. 2025 attendance')}
      ${num('fuseback', '34.5%', '2025 attendees who came back', '335 of 970 people')}
      ${num('fuseskip', '164', 'Active members who skipped 2026', 'Came in 2025, still members, didn\'t register for Austin')}
      ${num('fusebought', '47', 'FUSE 2026 tickets bought outright', 'The rest were claimed through membership or comped')}
    </div>
    <div class="sc-three">
      ${card('How people got their FUSE 2026 ticket', 'Claimed: through their membership. Complimentary: exhibitors, partners, and staff adds.', hbars([['Claimed', 640], ['Complimentary', 248], ['Purchased', 47], ['Pending', 5]], C.blue))}
      ${card('FUSE 2026 registrants by membership tier', 'Tier recorded at registration. Not a member includes exhibitors and guests of partners.', hbars([['Premium', 495], ['Not a member', 285], ['VIP', 120], ['Elite', 40]], C.blue))}
      ${card('FUSE 2025 vs. 2026', '2025 counts people tagged as attendees in GHL. 2026 counts portal registrations, since there\'s no check-in data. Hall of AIME 2025 looks under-tagged.', `<table class="adm sc-table"><thead><tr><th>Measure</th><th>2025</th><th>2026</th><th>Change</th></tr></thead><tbody>
        <tr><td>People</td><td>970</td><td>1,040</td><td>${pct(7.2)}</td></tr><tr><td>WMN at FUSE</td><td>160</td><td>196</td><td>${pct(22.5)}</td></tr><tr><td>Hall of AIME</td><td>90</td><td>240</td><td>${pct(166.7)}</td></tr></tbody></table>`)}
    </div>
    <h2 class="sc-h">Engagement</h2>
    <div class="sc-nums sc-nums-3">
      ${num('active', '158', 'Members active in the portal, last full month', '13.1% of paying members')}
      ${num('escalations', '72', 'Loan escalations, last 12 months', 'Advocacy cases members sent to AIME')}
      ${num('connections', '430', 'Lender + vendor connections, last 12 months', 'Members asking AIME to connect them with a partner')}
    </div>
    <div class="sc-one">
      ${card('Members active in the portal each month', 'Distinct people who used the member portal. The current month is partial.', chartActive())}
      ${card('Member requests each month', 'Escalations, lender and vendor connections, and event registrations made in the portal. Event registrations were tracked starting June 2026.', `<div class="table-scroll"><table class="adm sc-table"><thead><tr><th>Month</th><th>Escalations</th><th>Lender connections</th><th>Vendor connections</th><th>Event registrations</th></tr></thead><tbody>
        ${REQUESTS.map((r) => `<tr><td style="white-space:nowrap">${r[0]}</td>${r.slice(1).map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`)}
    </div>
  </section>`);

})();
