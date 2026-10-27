/* ============================================================
   AMP Admin — Activity log (audit trail)
   ------------------------------------------------------------
   Sidebar → Access → Activity log. Every change made in the admin
   console: who did it, when, which area, which record, and what
   changed (before → after). Read-only — entries can't be edited or
   deleted. Search, filter by admin / area / date range, open an
   entry for its full detail, and export to CSV.
   Prototype: sample history plus live entries — any admin action
   that confirms with a toast is logged against the signed-in admin
   and the section it happened in (in memory, resets on reload).
   Uses admin.js globals: admins, currentAdmin, showToast, openModal,
   initials.
   ============================================================ */
(function () {
  if (!document.getElementById('view-activity')) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const H = 36e5, now = Date.now();
  const AREAS = ['Members', 'Billing', 'Group memberships', 'Enterprise', 'Partner users', 'Requests', 'Communications', 'Content',
    'Events', 'Help Center', 'Team access', 'Reports', 'Settings'];
  // Admin sidebar section → activity area
  const AREA_OF = { members: 'Members', groups: 'Group memberships', enterprise: 'Enterprise', partners: 'Partner users', requests: 'Requests',
    abandoned: 'Billing', coupons: 'Billing', notifications: 'Communications', emails: 'Communications', referrals: 'Communications',
    featured: 'Content', lenders: 'Content', market: 'Content', resources: 'Content', hubs: 'Content', documents: 'Content', taxonomy: 'Content',
    events: 'Events', help: 'Help Center', team: 'Team access', reports: 'Reports', analytics: 'Reports', dashboard: 'Settings' };

  /* ---------- sample history ---------- */
  let seq = 0;
  const e = (hoursAgo, who, area, action, record, changes, note) =>
    ({ id: 'act_' + (++seq), at: now - hoursAgo * H, who, area, action, record, changes: changes || [], note: note || '', ip: '72.14.' + (seq * 7 % 250) + '.' + (seq * 13 % 250) });
  let log = [
    e(0.4, 'Jordan Blake', 'Members', 'Changed membership tier', 'Priya Nair', [['Tier', 'Elite', 'VIP']], 'Upgraded at the member\'s request — prorated in Stripe.'),
    e(1.1, 'Sofia Marin', 'Requests', 'Replied to support ticket', 'TKT-2207 · Kyle Lord'),
    e(2.5, 'AIME Team', 'Communications', 'Sent loan referral', 'Angela Ruiz · Broker · TX', [['Sent to', '', '18 VIP, then 39 Elite']]),
    e(3.2, 'Wes Carter', 'Billing', 'Issued refund', 'Tom Becker', [['Amount', '', '$19.99'], ['Reason', '', 'Duplicate charge']]),
    e(5, 'Jordan Blake', 'Partner users', 'Added partner user', 'Dana Whitaker · United Wholesale Mortgage', [['Access', '', 'Lender — company dashboard and requests']]),
    e(7.5, 'Sofia Marin', 'Content', 'Edited lender listing', 'EPM', [['Escalation email', 'escalations@epm.net', 'brokerescalations@epm.net']]),
    e(9, 'AIME Team', 'Group memberships', 'Transferred membership', 'NEXA Lending — seat 214', [['Assigned to', 'Carlos Diaz', 'Hannah Wu']]),
    e(20, 'Wes Carter', 'Team access', 'Changed admin role', 'Lena Brooks', [['Role', 'Super Admin', 'Admin']]),
    e(22, 'Jordan Blake', 'Members', 'Added escalations', 'Greg Mason', [['Escalations this month', '0 left', '2 left']], 'Courtesy credit after lender delay.'),
    e(26, 'AIME Team', 'Events', 'Changed registration settings', 'AIME Ascent 2027', [['Who can register', 'Elite & VIP', 'VIP'], ['Capacity', '120', '80']]),
    e(30, 'Sofia Marin', 'Help Center', 'Published guide', 'Getting loan referrals from AIME'),
    e(45, 'Jordan Blake', 'Billing', 'Applied coupon', 'Darnell Ross', [['Coupon', '', 'BROKER25 — 25% off first year']]),
    e(50, 'Wes Carter', 'Members', 'Cancelled membership', 'Beth Coleman', [['Status', 'Active', 'Cancelling — ends Jul 30, 2026']], 'Reason: switching companies.'),
    e(72, 'AIME Team', 'Communications', 'Sent notification', 'All VIP members', [['Message', '', 'VIP Luncheon seats are open']]),
    e(75, 'Sofia Marin', 'Content', 'Added Market product', 'Ask Mindy — Scenario Desk', [['Company', '', 'Ask Mindy']]),
    e(96, 'Jordan Blake', 'Requests', 'Reassigned escalation', 'ESC-1042 · Kyle Lord', [['Owner', 'Sofia Marin', 'Jordan Blake']]),
    e(120, 'Wes Carter', 'Enterprise', 'Edited enterprise partner', 'NEXA Lending', [['VIP seats', '40', '50']]),
    e(144, 'AIME Team', 'Partner users', 'Removed partner user', 'Marcus Lee · EPM', [], 'Left the company.'),
    e(170, 'Jordan Blake', 'Members', 'Edited member profile', 'Maria Chen', [['Licensed states', 'CA, NV', 'CA, NV, AZ']]),
    e(200, 'Sofia Marin', 'Communications', 'Resent email', 'Password reset · Kyle Lord', [['Link', 'expired', 'new link sent']]),
    e(260, 'Wes Carter', 'Settings', 'Changed AIME Exchange link', 'Sidebar link', [['URL', 'theaimeexchange.com/shop', 'theaimeexchange.com']]),
    e(330, 'AIME Team', 'Team access', 'Invited admin', 'Lena Brooks', [['Role', '', 'Super Admin']]),
    e(420, 'Jordan Blake', 'Billing', 'Sent payment link', 'Priya Nair', [['Amount due', '', '$69.99']]),
    e(600, 'Sofia Marin', 'Content', 'Deleted resource', 'Broker to Broker — Episode 198', [], 'Duplicate upload.'),
    e(900, 'Wes Carter', 'Members', 'Changed membership tier', 'Rachel Stone', [['Tier', 'Premium', 'Elite']]),
  ];

  /* ---------- live entries: any confirmed admin action ---------- */
  const NOT_ACTIONS = /^(fill in|enter a|pick|choose|can't|couldn't|no |nothing|exported|copied|preview|loading|searching)/i;
  const origToast = window.showToast;
  window.showToast = function (msg) {
    origToast.apply(this, arguments);
    if (!msg || NOT_ACTIONS.test(msg)) return;
    const nav = document.querySelector('#sidebar .nav-item.active');
    const area = (nav && AREA_OF[nav.dataset.nav]) || 'Settings';
    log.unshift({ id: 'act_' + (++seq), at: Date.now(), who: currentAdmin.name, area, action: String(msg).replace(/\.$/, ''), record: '', changes: [], note: '', ip: '72.14.8.21', live: true });
    if (document.getElementById('view-activity').classList.contains('active')) render();
  };

  /* ---------- table ---------- */
  const fmt = (t) => new Date(t).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const changeText = (c) => c.map(([f, a, b]) => a ? `${f}: ${a} → ${b}` : `${f}: ${b}`).join(' · ');
  function fillFilters() {
    $('act-who').innerHTML = '<option value="all">All admins</option>' + admins.map((a) => `<option>${esc(a.name)}</option>`).join('');
    $('act-area').innerHTML = '<option value="all">All areas</option>' + AREAS.map((a) => `<option>${a}</option>`).join('');
  }
  function rows() {
    const q = ($('act-q').value || '').toLowerCase(), who = $('act-who').value, area = $('act-area').value, days = +$('act-range').value;
    return log.filter((x) => (who === 'all' || x.who === who) && (area === 'all' || x.area === area) && (!days || now - x.at <= days * 24 * H) &&
      (!q || `${x.who} ${x.area} ${x.action} ${x.record} ${changeText(x.changes)} ${x.note}`.toLowerCase().includes(q)));
  }
  function render() {
    const list = rows();
    $('act-tbody').innerHTML = list.map((x) => `<tr data-act="${x.id}">
        <td style="white-space:nowrap">${fmt(x.at)}</td>
        <td><div class="t-id"><div class="t-avatar">${initials(x.who)}</div><div class="t-strong">${esc(x.who)}</div></div></td>
        <td><div class="t-strong">${esc(x.action)}</div>${x.record ? `<div class="t-sub">${esc(x.record)}</div>` : ''}</td>
        <td><span class="act-area">${esc(x.area)}</span></td>
        <td class="act-changes">${x.changes.length ? esc(changeText(x.changes)) : '<span class="t-sub">—</span>'}</td>
      </tr>`).join('') || '<tr><td colspan="5" class="t-sub" style="padding:24px;text-align:center">No activity matches.</td></tr>';
    $('act-count').textContent = `${list.length} of ${log.length} entries`;
  }
  function open(id) {
    const x = log.find((y) => y.id === id); if (!x) return;
    const kv = (k, v) => `<div class="rq-kv"><span class="k">${k}</span><span class="v">${v}</span></div>`;
    $('act-m-title').textContent = x.action;
    $('act-m-sub').textContent = `${fmt(x.at)} · ${x.who}`;
    $('act-m-body').innerHTML = `
      ${kv('Admin', esc(x.who) + ' &lt;' + esc((admins.find((a) => a.name === x.who) || {}).email || '') + '&gt;')}
      ${kv('Area', esc(x.area))}${x.record ? kv('Record', esc(x.record)) : ''}
      ${kv('When', new Date(x.at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }))}
      ${kv('From IP address', x.ip)}
      ${x.changes.length ? `<div class="form-section-label">What changed</div><table class="adm act-diff"><thead><tr><th>Field</th><th>Before</th><th>After</th></tr></thead><tbody>
        ${x.changes.map(([f, a, b]) => `<tr><td class="t-strong">${esc(f)}</td><td>${a ? esc(a) : '<span class="t-sub">—</span>'}</td><td>${esc(b)}</td></tr>`).join('')}</tbody></table>` : ''}
      ${x.note ? `<div class="form-section-label">Note</div><p style="margin:0;font-size:14px">${esc(x.note)}</p>` : ''}
      <p class="hint" style="margin-top:16px">Activity log entries can't be edited or deleted.</p>`;
    openModal('activity');
  }

  document.addEventListener('click', (ev) => {
    const r = ev.target.closest('[data-act]');
    if (r) { open(r.dataset.act); return; }
    if (ev.target.closest('#act-export')) origToast(`Exported ${rows().length} activity log entries to CSV.`);
  });
  $('act-q').addEventListener('input', render);
  ['act-who', 'act-area', 'act-range'].forEach((id) => $(id).addEventListener('change', render));

  fillFilters(); render();
  window.AmpAdminActivity = { render, open, log: () => log };
})();
