/* ============================================================
   AMP Admin — Reports → Retention
   ------------------------------------------------------------
   What the membership team does to keep members who cancel.
   Hybrid: the team works each cancellation in GoHighLevel; the
   portal reports on it with the outcome taken from Stripe.
   - When a member cancels, the portal creates a "Retention"
     opportunity in GHL (reason, feedback, plan, end date).
   - Outreach (calls, texts, emails) happens and is logged in GHL;
     the portal reads it back.
   - Outcomes come from Stripe, never from the card:
       Still cancelling — end date hasn't passed, no plan chosen
       Saved — chose a plan before the cancellation took effect
               (a different plan, or kept their own)
       Lost — the cancellation went through
       Returning member — came back after it went through. Counted
               separately: a win-back, not a save.
   - Credit goes to the last team member who contacted the member
     before the outcome. None if nobody did ("On their own").
   - Offers are manual coupon codes; the coupon used is shown.
   - Failed payments aren't here — they're a separate flow.
   Prototype: sample cases relative to TODAY (Jun 25, 2026), plus
   cancellations made in the member prototype (AmpSubEvents) as
   new, not-yet-contacted cases.
   Uses admin.js globals: TODAY, inWindow, ranges, fmtDate,
   openModal, showToast, CANCEL_REASONS, initials.
   ============================================================ */
(function () {
  const tabs = document.getElementById('report-tabs');
  if (!tabs) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const D = 864e5;
  const day = (n) => new Date(TODAY.getTime() + n * D);
  const PRICE = { Premium: 199, Elite: 699, VIP: 1699 };   // annual
  const TEAM = ['Jordan Blake', 'Sofia Marin', 'Wes Carter'];
  const money = (n) => '$' + n.toLocaleString();

  /* ---------- sample cases ---------- */
  // a: [daysFromRequest, who, how, note]
  const C = (name, email, plan, req, reason, detail, attempts, outcome, extra) => Object.assign({
    name, email, plan, requested: day(req), ends: day(req + 30), reason, detail: detail || '',
    attempts: attempts.map(([d, who, how, note]) => ({ at: day(req + d), who, how, note })), outcome,
  }, extra || {});
  const R = CANCEL_REASONS;
  const SAMPLE = [
    C('Priya Nair', 'priya@nairhomeloans.com', 'Elite', -3, R[3], 'Money is tight this quarter.', [[0.2, 'Jordan Blake', 'Call', 'Left voicemail'], [1, 'Jordan Blake', 'Text', 'Sent Elite → Premium option']], 'open'),
    C('Greg Mason', 'greg@masonlending.com', 'Premium', -1, R[0], '', [], 'open'),
    C('Hannah Wu', 'hannah@wuhomeloans.com', 'VIP', -6, R[1], 'Not closing enough loans to justify VIP.', [[0.1, 'Sofia Marin', 'Call', 'Talked through escalation usage']], 'open'),
    C('Tom Becker', 'tom@beckerhomes.com', 'Elite', -12, R[3], '', [[0.3, 'Wes Carter', 'Call', 'No answer'], [1, 'Sofia Marin', 'Call', 'Offered SAVE20 on renewal']], 'saved', { savedAt: day(-10), newPlan: 'Elite', coupon: 'SAVE20 — 20% off one year' }),
    C('Rachel Stone', 'rachel@stonemortgage.com', 'VIP', -20, R[3], 'Love it, just too expensive.', [[0.5, 'Jordan Blake', 'Call', 'Walked through Elite vs VIP']], 'saved', { savedAt: day(-18), newPlan: 'Elite' }),
    C('Darnell Ross', 'darnell@rossmortgage.com', 'Elite', -25, R[0], '', [[1, 'Wes Carter', 'Email', 'Sent the getting-started guide'], [3, 'Wes Carter', 'Call', 'Booked onboarding call']], 'saved', { savedAt: day(-21), newPlan: 'Elite', coupon: 'FREEMONTH — 1 month free' }),
    C('Ahmed Sayed', 'ahmed@sayedmortgage.com', 'Premium', -16, R[6], '', [], 'saved', { savedAt: day(-15), newPlan: 'Premium' }),
    C('Maria Chen', 'maria@chenlending.com', 'Elite', -40, R[2], 'Expected more lender access.', [[0.4, 'Sofia Marin', 'Text', 'Asked what was missing'], [2, 'Jordan Blake', 'Call', 'Showed Lenders directory + escalations']], 'saved', { savedAt: day(-37), newPlan: 'Premium' }),
    C('Beth Coleman', 'beth@colemanhomes.com', 'Elite', -55, R[4], 'Switching companies.', [[1, 'Sofia Marin', 'Call', 'Leaving the industry — no offer']], 'lost'),
    C('Janet Park', 'janet@parkfunding.com', 'Premium', -48, R[7], 'Joined for FUSE only.', [[2, 'Wes Carter', 'Email', 'Shared upcoming events']], 'lost'),
    C('Kevin Ortiz', 'kevin@ortizlending.com', 'Elite', -62, R[3], '', [], 'lost'),
    C('Lisa Grant', 'lisa@grantmortgage.com', 'VIP', -70, R[5], 'Bad experience at the VIP luncheon.', [[0.2, 'Jordan Blake', 'Call', 'Apologized; escalated to events team'], [4, 'Jordan Blake', 'Call', 'Offered SAVE20']], 'lost'),
    C('Carlos Diaz', 'carlos@diazhomeloans.com', 'Elite', -110, R[1], '', [[1, 'Sofia Marin', 'Call', 'Not interested right now'], [60, 'Sofia Marin', 'Email', 'New lender partners update']], 'returning', { returnedAt: day(-14), newPlan: 'Elite', coupon: 'WELCOMEBACK — 25% off first year' }),
    C('Sam Whitfield', 'sam@whitfieldfunding.com', 'Premium', -95, R[0], '', [], 'returning', { returnedAt: day(-30), newPlan: 'Premium' }),
    C('Nina Patel', 'nina@patelhomeloans.com', 'Elite', -150, R[3], 'Budget freeze.', [[0.5, 'Wes Carter', 'Call', 'Offered Premium — declined'], [100, 'Jordan Blake', 'Text', 'FUSE early-bird reminder']], 'returning', { returnedAt: day(-45), newPlan: 'VIP' }),
  ];
  function cases() {
    // Cancellations made in the member prototype: new cases, not contacted yet.
    const live = (window.AmpSubEvents ? AmpSubEvents.all() : []).filter((e) => e.type === 'cancellation').map((e) => ({
      name: e.name, email: e.email, plan: e.from, requested: TODAY, ends: day(30), reason: e.reason, detail: e.detail || '', attempts: [], outcome: 'open', live: true,
    }));
    return live.concat(SAMPLE).map((c) => {
      const outAt = c.savedAt || c.returnedAt || (c.outcome === 'lost' ? c.ends : null);
      const before = c.attempts.filter((a) => !outAt || a.at <= outAt);
      const last = before[before.length - 1] || null;
      return Object.assign({}, c, {
        last: c.attempts[c.attempts.length - 1] || null,
        credit: c.outcome === 'saved' || c.outcome === 'returning' ? (last ? last.who : '') : '',
        firstHours: c.attempts.length ? (c.attempts[0].at - c.requested) / 36e5 : null,
        // Date the report range filters on: the rejoin date for returning members, else the cancel request.
        when: c.outcome === 'returning' ? c.returnedAt : c.requested,
      });
    });
  }

  /* ---------- tab + layout ---------- */
  tabs.insertAdjacentHTML('beforeend', '<button class="chip" data-rtype="retention">Retention</button>');
  $('sub-report').insertAdjacentHTML('afterend', `
    <div id="ret-report" hidden>
      <div class="ret-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r="1.1" fill="currentColor" stroke="none"/></svg>
        <p>Every cancellation becomes a <strong>Retention</strong> opportunity in GoHighLevel for the team to work. Outreach is logged there; outcomes come from Stripe.
        <strong>Saved</strong> = chose a plan before the cancellation took effect. <strong>Returning member</strong> = came back after it went through. Credit goes to the last team member who reached out. Failed payments aren't included.</p></div>
      <div class="ret-tiles" id="ret-tiles"></div>
      <div class="ret-cards">
        <div class="card card-pad"><div class="section-title" style="margin-bottom:12px"><h2 style="font-size:16px">By team member</h2><span class="count-note">credit = last contact</span></div><div class="table-scroll"><table class="adm ret-mini" id="ret-team"></table></div></div>
        <div class="card card-pad"><div class="section-title" style="margin-bottom:12px"><h2 style="font-size:16px">Save rate by reason</h2></div><div id="ret-reasons"></div></div>
      </div>
      <div class="section-title" style="margin-bottom:12px"><h2 style="font-size:16px">Cancellations</h2></div>
    </div>`);
  const partnerSel = $('report-partner');
  partnerSel.insertAdjacentHTML('afterend', `
    <select class="select filter-select ret-only" id="ret-outcome" hidden>
      <option value="all">All outcomes</option><option value="open">Still cancelling</option><option value="saved">Saved</option><option value="lost">Lost</option><option value="returning">Returning members</option>
    </select>
    <select class="select filter-select ret-only" id="ret-who" hidden><option value="all">All team members</option>${TEAM.map((t) => `<option>${t}</option>`).join('')}<option value="none">No contact</option></select>`);
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="modal-retention"><div class="modal" style="max-width:620px">
      <div class="modal-head"><div><h2 id="ret-m-title">Retention</h2><p id="ret-m-sub"></p></div>
        <button class="modal-close" data-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>
      <div class="modal-body" id="ret-m-body"></div>
      <div class="modal-foot"><button class="btn btn-outline" data-toast="Opened the Retention opportunity in GoHighLevel.">Open in GoHighLevel</button><button class="btn btn-primary" data-close>Done</button></div>
    </div></div>`);

  /* ---------- render ---------- */
  const fmt = (d) => fmtDate(d);
  const ago = (d) => { const n = Math.round((TODAY - d) / D); return n <= 0 ? 'today' : n === 1 ? 'yesterday' : `${n} days ago`; };
  function outcomePill(c) {
    if (c.outcome === 'open') { const left = Math.max(0, Math.round((c.ends - TODAY) / D)); return `<span class="ret-pill open">Still cancelling</span><div class="t-sub">${left} day${left === 1 ? '' : 's'} left</div>`; }
    if (c.outcome === 'saved') return `<span class="ret-pill saved">Saved</span><div class="t-sub">${c.newPlan === c.plan ? `Kept ${c.plan}` : `${c.plan} → ${c.newPlan}`}</div>`;
    if (c.outcome === 'returning') return `<span class="ret-pill returning">Returning member</span><div class="t-sub">Rejoined ${fmt(c.returnedAt)} · ${c.newPlan}</div>`;
    return `<span class="ret-pill lost">Lost</span><div class="t-sub">Ended ${fmt(c.ends)}</div>`;
  }
  let shown = [];
  function render() {
    const inRange = cases().filter((c) => inWindow('reports', c.when));
    const outcome = $('ret-outcome').value, who = $('ret-who').value;
    const req = inRange.filter((c) => c.outcome !== 'returning');
    const decided = req.filter((c) => c.outcome !== 'open');
    const saved = req.filter((c) => c.outcome === 'saved');
    const ret = inRange.filter((c) => c.outcome === 'returning');
    const contacted = req.filter((c) => c.attempts.length);
    const firsts = contacted.map((c) => c.firstHours);
    const avgFirst = firsts.length ? firsts.reduce((a, b) => a + b, 0) / firsts.length : null;
    const pct = (a, b) => (b ? Math.round(a / b * 100) + '%' : '—');
    const tile = (k, lbl, val, sub, cls) => `<button class="ret-tile ${cls || ''} ${outcome === k ? 'active' : ''}" ${k ? `data-ret-outcome="${k}"` : ''}>
        <div class="rt-lbl">${lbl}</div><div class="rt-val">${val}</div><div class="rt-sub">${sub}</div></button>`;
    $('ret-tiles').innerHTML =
      tile('', 'Cancellations', req.length, `${req.filter((c) => c.outcome === 'open').length} still cancelling`) +
      tile('', 'Contacted', pct(contacted.length, req.length), avgFirst == null ? 'No outreach yet' : `First contact in ${avgFirst < 24 ? Math.max(1, Math.round(avgFirst)) + ' hrs' : (avgFirst / 24).toFixed(1) + ' days'} on average`) +
      tile('saved', 'Saved', saved.length, `${pct(saved.length, decided.length)} of decided cancellations`, 'saved') +
      tile('', 'Revenue kept', money(saved.reduce((s, c) => s + PRICE[c.newPlan], 0)), 'Yearly value of saved plans', 'saved') +
      tile('returning', 'Returning members', ret.length, `${money(ret.reduce((s, c) => s + PRICE[c.newPlan], 0))} a year · counted separately`, 'returning');

    // By team member — credited saves / returning, members they reached
    $('ret-team').innerHTML = '<thead><tr><th>Team member</th><th>Reached out to</th><th>Saves</th><th>Returning</th><th>Save rate</th></tr></thead><tbody>' +
      TEAM.map((t) => {
        const reached = inRange.filter((c) => c.attempts.some((a) => a.who === t) && c.outcome !== 'returning');
        const decidedT = reached.filter((c) => c.outcome !== 'open');
        const s = req.filter((c) => c.outcome === 'saved' && c.credit === t).length;
        const r = ret.filter((c) => c.credit === t).length;
        return `<tr><td class="t-strong">${t}</td><td>${reached.length}</td><td>${s}</td><td>${r}</td><td>${pct(s, decidedT.length)}</td></tr>`;
      }).join('') +
      `<tr><td class="t-sub">On their own</td><td class="t-sub">—</td><td class="t-sub">${saved.filter((c) => !c.credit).length}</td><td class="t-sub">${ret.filter((c) => !c.credit).length}</td><td class="t-sub">—</td></tr></tbody>`;

    // Save rate by reason (decided cancellations only)
    const byReason = CANCEL_REASONS.map((r) => { const d = decided.filter((c) => c.reason === r); return { r, n: d.length, s: d.filter((c) => c.outcome === 'saved').length }; }).filter((x) => x.n).sort((a, b) => b.n - a.n);
    $('ret-reasons').innerHTML = byReason.length ? byReason.map((x) => `<div class="ret-reason">
        <span class="rr-lbl">${esc(x.r)}</span><span class="rr-bar"><i style="width:${Math.round(x.s / x.n * 100)}%"></i></span><span class="rr-n">${x.s} of ${x.n}</span></div>`).join('')
      : '<p class="t-sub" style="margin:0">No decided cancellations in this range.</p>';

    // Table
    const rows = inRange.filter((c) => (outcome === 'all' || c.outcome === outcome) &&
      (who === 'all' || (who === 'none' ? !c.attempts.length : c.attempts.some((a) => a.who === who))));
    shown = rows.sort((a, b) => b.when - a.when);
    $('report-table').innerHTML = '<thead><tr><th>Member</th><th>Plan</th><th>Cancel requested</th><th>Reason</th><th>Last contact</th><th>Outcome</th><th>Credited to</th></tr></thead><tbody>' +
      (shown.length ? shown.map((c, i) => `<tr class="ret-row" data-ret="${i}">
        <td><div class="t-strong">${esc(c.name)}${c.live ? ' <span class="badge badge-cyan" style="margin-left:4px">New</span>' : ''}</div><div class="t-sub">${esc(c.email)}</div></td>
        <td>${c.plan}</td>
        <td style="white-space:nowrap">${fmt(c.requested)}</td>
        <td style="min-width:180px;max-width:240px">${esc(c.reason)}</td>
        <td>${c.last ? `${esc(c.last.who)}<div class="t-sub">${c.last.how} · ${fmt(c.last.at)}</div>` : '<span class="t-sub">Not contacted</span>'}</td>
        <td>${outcomePill(c)}</td>
        <td>${c.outcome === 'saved' || c.outcome === 'returning' ? (c.credit ? esc(c.credit) : '<span class="t-sub">On their own</span>') : '<span class="t-sub">—</span>'}</td></tr>`).join('')
        : '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:28px">No cancellations match these filters.</td></tr>') + '</tbody>';
    $('report-count').textContent = `${shown.length} member${shown.length === 1 ? '' : 's'} · ${ranges.reports.label}`;
  }

  function open(i) {
    const c = shown[i]; if (!c) return;
    const kv = (k, v) => `<div class="rq-kv"><span class="k">${k}</span><span class="v">${v}</span></div>`;
    const steps = [{ at: c.requested, t: `Cancel requested on ${c.plan}`, s: `${c.reason}${c.detail ? ` — “${c.detail}”` : ''}`, cls: 'req' }]
      .concat(c.attempts.map((a) => ({ at: a.at, t: `${a.how} — ${a.who}`, s: a.note, cls: 'contact' })));
    if (c.outcome === 'saved') steps.push({ at: c.savedAt, t: c.newPlan === c.plan ? `Saved — kept ${c.plan}` : `Saved — switched to ${c.newPlan}`, s: c.coupon ? `Coupon: ${c.coupon}` : 'No coupon', cls: 'saved' });
    if (c.outcome === 'lost' || c.outcome === 'returning') steps.push({ at: c.ends, t: 'Cancellation took effect', s: '', cls: 'lost' });
    if (c.outcome === 'returning') steps.push({ at: c.returnedAt, t: `Returning member — rejoined on ${c.newPlan}`, s: c.coupon ? `Coupon: ${c.coupon}` : 'No coupon', cls: 'returning' });
    $('ret-m-title').textContent = c.name;
    $('ret-m-sub').textContent = `${c.email} · ${c.plan} member`;
    $('ret-m-body').innerHTML = `
      ${kv('Outcome', outcomePill(c))}
      ${kv('Credited to', c.outcome === 'saved' || c.outcome === 'returning' ? (c.credit ? `${esc(c.credit)} <span class="t-sub">(last contact)</span>` : 'On their own — no contact') : '—')}
      ${kv('Cancellation date', fmt(c.ends))}
      <div class="form-section-label">Timeline</div>
      <ol class="ret-timeline">${steps.map((s) => `<li class="${s.cls}"><div class="rt-t">${esc(s.t)}</div>${s.s ? `<div class="rt-s">${esc(s.s)}</div>` : ''}<div class="rt-at">${fmt(s.at)}</div></li>`).join('')}</ol>
      <p class="hint" style="margin-top:14px">Outreach is logged in GoHighLevel. Outcomes come from Stripe.</p>`;
    openModal('retention');
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-ret-outcome]');
    if (t) { const k = t.dataset.retOutcome; $('ret-outcome').value = $('ret-outcome').value === k ? 'all' : k; render(); return; }
    const r = e.target.closest('[data-ret]');
    if (r) open(+r.dataset.ret);
  });
  ['ret-outcome', 'ret-who'].forEach((id) => $(id).addEventListener('change', render));

  window.AmpRetention = { render, cases };
})();
