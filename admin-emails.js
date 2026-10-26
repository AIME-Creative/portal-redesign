/* ============================================================
   AMP Admin — Email history
   ------------------------------------------------------------
   Sidebar → Communications → Email history. Every email the
   portal sends a member (password reset, magic link, renewal
   reminder, failed payment, welcome, Lender / Vendor invite)
   with its delivery status from Resend (delivered, opened,
   clicked, bounced, delayed, failed, suppressed, spam complaint).
   Preview: the sent email (Resend keeps sent emails for 30 days;
   older rows show "preview no longer available").
   Resend: sign-in emails (password reset, magic link, invite)
   send a fresh link, since the original link has expired; other
   emails are sent again as they were. Suppressed addresses can't
   be resent until the address is fixed.
   Prototype: sample data, in memory (resets on reload).
   Uses admin.js globals: openModal, closeModals, showToast, initials.
   ============================================================ */
(function () {
  if (!document.getElementById('view-emails')) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const DAY = 864e5, RETENTION_DAYS = 30;

  /* ---------- email types ---------- */
  // fresh: resending creates a new link instead of re-sending the expired one
  const TYPES = {
    reset:   { label: 'Password reset', fresh: true,
      subject: () => 'Reset your AMP password',
      body: (m) => [`Hi ${m.first},`, 'We got a request to reset the password for your AIME Member Portal account. This link works for 1 hour.'], cta: 'Reset password',
      foot: "Didn't ask for this? You can ignore this email — your password won't change." },
    magic:   { label: 'Magic link', fresh: true,
      subject: () => 'Your AMP sign-in link',
      body: (m) => [`Hi ${m.first},`, 'Here is your one-time link to sign in to the AIME Member Portal. It works once and expires in 1 hour.'], cta: 'Sign in to AMP',
      foot: "Didn't ask for this? You can ignore this email." },
    renewal: { label: 'Renewal reminder',
      subject: (m) => `Your AIME ${m.plan} membership renews on ${m.renews}`,
      body: (m) => [`Hi ${m.first},`, `Your AIME ${m.plan} membership renews on <strong>${m.renews}</strong> for <strong>${m.amount}</strong>. No action is needed — we'll charge the card on file.`, 'Want to change your plan or payment method? You can do it any time in Settings → Membership & Billing.'], cta: 'Manage membership' },
    failed:  { label: 'Failed payment',
      subject: () => "Action needed: your AIME membership payment didn't go through",
      body: (m) => [`Hi ${m.first},`, `We couldn't process your <strong>${m.amount}</strong> payment for AIME ${m.plan}. Please update your payment method to keep your membership and escalations active.`, "We'll try the card again in 3 days."], cta: 'Update payment method' },
    welcome: { label: 'Welcome',
      subject: (m) => `Welcome to AIME ${m.plan}, ${m.first}!`,
      body: (m) => [`Hi ${m.first},`, `You're in! Your AIME ${m.plan} membership is active. Sign in to explore lenders, the Market, resources, and events — a quick tour will show you around.`], cta: 'Go to AMP' },
    invite:  { label: 'Lender / Vendor invite', fresh: true,
      subject: (m) => `You're invited to AMP — set your password`,
      body: (m) => [`Hi ${m.first},`, `AIME has set up an AMP account for you at <strong>${m.company}</strong>. Set your password to see your company's dashboard and requests from AIME members. This link works for 7 days.`], cta: 'Set your password' },
  };
  const STATUS = {
    delivered: { label: 'Delivered', cls: 'em-ok' },
    opened: { label: 'Opened', cls: 'em-ok' },
    clicked: { label: 'Clicked', cls: 'em-ok' },
    delayed: { label: 'Delayed', cls: 'em-warn' },
    bounced: { label: 'Bounced', cls: 'em-bad' },
    failed: { label: 'Failed', cls: 'em-bad' },
    complained: { label: 'Spam complaint', cls: 'em-bad' },
    suppressed: { label: 'Suppressed', cls: 'em-bad' },
  };

  /* ---------- sample history ---------- */
  const P = (name, email, extra) => Object.assign({ name, email, first: name.split(' ')[0] }, extra);
  const now = Date.now();
  let seq = 0;
  const row = (daysAgo, hour, type, who, status) => ({ id: 'em_' + (++seq), type, who, status, at: now - daysAgo * DAY - hour * 36e5 });
  const kyle = P('Kyle Lord', 'kyle@aimegroup.com', { plan: 'Elite', amount: '$699/yr', renews: 'Jan 14, 2027' });
  const priya = P('Priya Nair', 'priya@nairhomeloans.com', { plan: 'Elite', amount: '$69.99/mo', renews: 'Jul 19, 2026' });
  const tom = P('Tom Becker', 'tom@beckerfinancial.com', { plan: 'Premium', amount: '$19.99/mo', renews: 'Jul 17, 2026' });
  const rachel = P('Rachel Stone', 'rachel@stonemortgage.com', { plan: 'Elite', amount: '$699/yr', renews: 'May 24, 2027' });
  const maria = P('Maria Chen', 'maria.chen@brightpathmtg.com', { plan: 'VIP', amount: '$1,699/yr', renews: 'Jun 22, 2027' });
  const darnell = P('Darnell Ross', 'dross@summitlending.com', { plan: 'Premium', amount: '$19.99/mo', renews: 'Jul 21, 2026' });
  const greg = P('Greg Mason', 'greg@masonlending.com', { plan: 'Elite', amount: '$69.99/mo', renews: 'Jul 2, 2026' });
  const tina = P('Tina Alvarez', 'tina@alvarezhomeloans.com', { plan: 'Premium', amount: '$19.99/mo', renews: 'Jul 5, 2026' });
  const carlos = P('Carlos Diaz', 'carlos@diazcapital.com', { plan: 'Elite', amount: '$69.99/mo', renews: 'Jul 5, 2026' });
  const beth = P('Beth Coleman', 'beth@colemanloans.cm', { plan: 'Premium', amount: '$19.99/mo', renews: '—' });
  const janet = P('Janet Park', 'jpark@parklending.com', { plan: 'Premium', amount: '$19.99/mo', renews: 'Jul 9, 2026' });
  const marcus = P('Marcus Lee', 'marcus.lee@epm.net', { plan: '—', company: 'EPM' });
  let emails = [
    row(0, 1, 'reset', kyle, 'clicked'),
    row(0, 3, 'magic', priya, 'delivered'),
    row(0, 5, 'failed', priya, 'opened'),
    row(1, 2, 'failed', tom, 'delayed'),
    row(1, 6, 'welcome', greg, 'opened'),
    row(2, 1, 'reset', beth, 'bounced'),
    row(2, 4, 'welcome', tina, 'delivered'),
    row(3, 2, 'renewal', darnell, 'opened'),
    row(4, 3, 'invite', marcus, 'delivered'),
    row(6, 1, 'magic', carlos, 'clicked'),
    row(8, 5, 'failed', rachel, 'failed'),
    row(9, 2, 'renewal', janet, 'delivered'),
    row(12, 4, 'magic', beth, 'suppressed'),
    row(18, 1, 'reset', maria, 'complained'),
    row(26, 3, 'renewal', carlos, 'opened'),
    row(41, 2, 'renewal', kyle, 'opened'),
    row(55, 6, 'reset', darnell, 'clicked'),
  ];

  const fmt = (t) => new Date(t).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const ageDays = (e) => (Date.now() - e.at) / DAY;
  const subject = (e) => TYPES[e.type].subject(e.who);
  const badge = (s) => `<span class="em-status ${STATUS[s].cls}">${STATUS[s].label}</span>`;

  /* ---------- table ---------- */
  function fillFilters() {
    $('em-type').innerHTML = '<option value="all">All email types</option>' + Object.entries(TYPES).map(([k, t]) => `<option value="${k}">${t.label}</option>`).join('');
    $('em-status').innerHTML = '<option value="all">All statuses</option>' + Object.entries(STATUS).map(([k, s]) => `<option value="${k}">${s.label}</option>`).join('');
  }
  function render() {
    const q = ($('em-q').value || '').toLowerCase(), ty = $('em-type').value, st = $('em-status').value;
    const rows = emails.filter((e) => (ty === 'all' || e.type === ty) && (st === 'all' || e.status === st) &&
      (!q || `${e.who.name} ${e.who.email} ${subject(e)}`.toLowerCase().includes(q)));
    $('em-tbody').innerHTML = rows.map((e) => `<tr data-em-open="${e.id}">
        <td><div class="t-id"><div class="t-avatar">${initials(e.who.name)}</div><div><div class="t-strong">${esc(e.who.name)}</div><div class="t-sub">${esc(e.who.email)}</div></div></div></td>
        <td>${TYPES[e.type].label}</td>
        <td>${esc(subject(e))}</td>
        <td>${badge(e.status)}</td>
        <td style="white-space:nowrap">${fmt(e.at)}</td>
        <td class="t-right"><div class="row-actions stack"><button class="link-act" data-em-open="${e.id}">Preview</button><button class="link-act" data-em-resend="${e.id}">Resend</button></div></td>
      </tr>`).join('') || '<tr><td colspan="6" class="t-sub" style="padding:24px;text-align:center">No emails match.</td></tr>';
    $('em-count').textContent = `${rows.length} of ${emails.length} emails`;
    const recent = emails.filter((e) => ageDays(e) <= 30);
    const ok = recent.filter((e) => STATUS[e.status].cls === 'em-ok').length;
    const tile = (cls, ico, val, lbl) => `<div class="stat"><div class="s-ico ${cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${ico}</svg></div><div class="s-val">${val}</div><div class="s-lbl">${lbl}</div></div>`;
    $('em-tiles').innerHTML =
      tile('i-navy', '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>', recent.length, 'Sent, last 30 days') +
      tile('i-green', '<path d="M20 6L9 17l-5-5"/>', recent.length ? Math.round((ok / recent.length) * 100) + '%' : '—', 'Delivered') +
      tile('i-pink', '<path d="M10.3 3.9l-8 14A2 2 0 004 21h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none"/>', recent.filter((e) => ['bounced', 'suppressed', 'complained'].includes(e.status)).length, 'Bounced or blocked') +
      tile('i-cyan', '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', recent.filter((e) => ['delayed', 'failed'].includes(e.status)).length, 'Delayed or failed');
  }

  /* ---------- preview ---------- */
  function emailHTML(e) {
    const t = TYPES[e.type], m = e.who;
    return `<!doctype html><html><head><meta charset="utf-8"><style>
      body{margin:0;background:#f5f7fb;font-family:'Hanken Grotesk',Arial,sans-serif;color:#1d2433}
      .wrap{max-width:520px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e3e8f2}
      .top{background:#021649;padding:18px 26px;color:#fff;font-weight:800;letter-spacing:.06em}
      .top span{color:#20adce}
      .in{padding:26px} p{font-size:15px;line-height:1.55;margin:0 0 14px}
      .btn{display:inline-block;background:#dd1969;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px;margin:6px 0 16px}
      .foot{font-size:12.5px;color:#6b7590;border-top:1px solid #eef1f7;padding:16px 26px}
    </style></head><body><div class="wrap"><div class="top">AMP <span>·</span> AIME Member Portal</div><div class="in">
      ${t.body(m).map((p) => `<p>${p}</p>`).join('')}<a class="btn" href="#">${t.cta}</a>
      <p style="font-size:13px;color:#6b7590">— The AIME Membership Team</p></div>
      <div class="foot">${t.foot ? t.foot + '<br>' : ''}AIME · aimegroup.com · You're receiving this because you have an AMP account.</div></div></body></html>`;
  }
  let current = null;
  function open(id) {
    const e = emails.find((x) => x.id === id); if (!e) return;
    current = e;
    const t = TYPES[e.type], expired = ageDays(e) > RETENTION_DAYS;
    $('em-m-title').textContent = subject(e);
    $('em-m-sub').innerHTML = `To ${esc(e.who.name)} &lt;${esc(e.who.email)}&gt; · ${fmt(e.at)}`;
    const kv = (k, v) => `<div class="rq-kv"><span class="k">${k}</span><span class="v">${v}</span></div>`;
    $('em-m-body').innerHTML = `
      <div class="em-meta">${kv('From', 'AIME Group &lt;noreply@notifications.aimegroup.com&gt;')}${kv('Type', t.label)}${kv('Status', badge(e.status))}</div>
      ${expired
        ? `<div class="em-gone"><strong>Preview no longer available.</strong> Resend keeps sent emails for ${RETENTION_DAYS} days. You can still resend it.</div>`
        : `<iframe class="em-frame" title="Email preview" sandbox="" srcdoc="${esc(emailHTML(e))}"></iframe>`}`;
    $('em-m-note').textContent = resendNote(e);
    $('em-m-resend').disabled = e.status === 'suppressed';
    openModal('email');
  }
  function resendNote(e) {
    if (e.status === 'suppressed') return "Resend won't deliver to this address after an earlier bounce or spam complaint. Fix the email on the member's profile first.";
    if (e.status === 'bounced') return 'This address bounced. Check the email on the member\'s profile before resending.';
    if (TYPES[e.type].fresh) return 'Resending sends a new link — the original one has expired.';
    return 'Resending sends this email again as it was.';
  }

  /* ---------- resend ---------- */
  function resend(id) {
    const e = emails.find((x) => x.id === id); if (!e) return;
    if (e.status === 'suppressed') { showToast(`Can't resend to ${e.who.email} — the address is suppressed. Fix it on the member's profile first.`); return; }
    if (e.status === 'bounced' && !window.confirm(`${e.who.email} bounced last time. Resend anyway?`)) return;
    emails.unshift({ id: 'em_' + (++seq), type: e.type, who: e.who, status: 'delivered', at: Date.now() });
    closeModals(); render();
    showToast(TYPES[e.type].fresh ? `Sent ${e.who.first} a new ${TYPES[e.type].label.toLowerCase()} link.` : `Resent "${subject(e)}" to ${e.who.email}.`);
  }

  document.addEventListener('click', (ev) => {
    const r = ev.target.closest('[data-em-resend]');
    if (r) { ev.preventDefault(); ev.stopPropagation(); resend(r.dataset.emResend); return; }
    if (ev.target.closest('#em-m-resend')) { ev.preventDefault(); if (current) resend(current.id); return; }
    const o = ev.target.closest('[data-em-open]');
    if (o) { ev.preventDefault(); open(o.dataset.emOpen); }
  });
  $('em-q').addEventListener('input', render);
  ['em-type', 'em-status'].forEach((id) => $(id).addEventListener('change', render));

  fillFilters(); render();
  window.AmpAdminEmails = { render, open };
})();
