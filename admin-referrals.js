/* ============================================================
   AMP Admin — Loan referrals
   ------------------------------------------------------------
   Sidebar → Communications → Loan referrals. Two tabs:
   - Send referral: the referral form. It's emailed to opted-in
     members whose referral settings match its type (Broker /
     Processor) and state — VIP members first, Elite members after
     a short delay. A live line under the form says how many of each.
   - Sent referrals: every referral sent, with how many VIP and
     Elite members it went to, and a preview of the email.
   Prototype: who's opted in is simulated per state and type; the
   list is in memory (resets on reload).
   Uses admin.js globals: navigate, openModal, closeModals, showToast.
   ============================================================ */
(function () {
  if (!document.getElementById('view-referrals')) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const DAY = 864e5;

  const STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
    'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
  const LANGUAGES = ['English', 'Spanish', 'Mandarin', 'Cantonese', 'Vietnamese', 'Korean', 'Tagalog', 'Russian', 'Portuguese', 'Arabic', 'Hindi', 'Other'];
  const BIG = { CA: 3, TX: 3, FL: 3, NY: 2, GA: 2, IL: 2, AZ: 2, NC: 2, NJ: 2, WA: 2 };

  // Opted-in members matching a state + type. Simulated, but stable for the same inputs.
  function audience(state, type) {
    let h = 7; for (const c of state + type) h = (h * 31 + c.charCodeAt(0)) % 997;
    const m = BIG[state] || 1, proc = type === 'Processor' ? 0.5 : 1;
    return { vip: Math.max(1, Math.round(((h % 5) + 2) * m * proc)), elite: Math.max(1, Math.round(((h % 11) + 5) * m * proc)) };
  }

  /* ---------- sample history ---------- */
  let seq = 0;
  const now = Date.now();
  const ref = (daysAgo, hour, r) => Object.assign({ id: 'rf_' + (++seq), at: now - daysAgo * DAY - hour * 36e5, by: 'Kyle Lord' }, r, audience(r.state, r.type));
  let referrals = [
    ref(0, 2, { type: 'Broker', first: 'Angela', last: 'Ruiz', email: 'angela.ruiz@gmail.com', state: 'TX', lang: 'Spanish', program: 'FHA', amount: 315000, fb: 'https://facebook.com/groups/aime/posts/10231', details: 'First-time buyer, 640 score, needs a broker who can close in 30 days. Prefers to communicate in Spanish.' }),
    ref(1, 4, { type: 'Processor', first: 'Devon', last: 'Hale', email: 'devon.hale@halemortgage.com', state: 'FL', lang: 'English', program: 'Conventional', amount: 0, fb: '', details: 'Broker shop looking for a contract processor for 6–8 files a month. Encompass experience preferred.' }),
    ref(2, 1, { type: 'Broker', first: 'Wei', last: 'Zhang', email: 'wzhang88@outlook.com', state: 'CA', lang: 'Mandarin', program: 'Non-QM', amount: 1250000, fb: 'https://facebook.com/groups/aime/posts/10198', details: 'Self-employed borrower, bank-statement loan, purchase in San Jose. Wants someone who speaks Mandarin.' }),
    ref(4, 3, { type: 'Broker', first: 'Marcus', last: 'Bell', email: 'marcus.bell@yahoo.com', state: 'GA', lang: 'English', program: 'VA', amount: 289000, fb: '', details: 'Veteran relocating to Savannah, VA purchase, pre-approval needed this week.' }),
    ref(7, 2, { type: 'Broker', first: 'Lauren', last: 'Pike', email: 'lpike@pikerealty.com', state: 'AZ', lang: 'English', program: 'DSCR', amount: 540000, fb: 'https://facebook.com/groups/aime/posts/10102', details: 'Realtor with an investor client buying a short-term rental in Scottsdale.' }),
    ref(11, 5, { type: 'Processor', first: 'Nina', last: 'Okafor', email: 'nina@okaforlending.com', state: 'NY', lang: 'English', program: '', amount: 0, fb: '', details: 'Needs a processor familiar with co-op purchases in Brooklyn, 3 files in the pipeline.' }),
    ref(16, 1, { type: 'Broker', first: 'Hector', last: 'Molina', email: 'hmolina@icloud.com', state: 'NV', lang: 'Spanish', program: 'FHA', amount: 365000, fb: '', details: 'Refinance out of an ARM, Las Vegas. Prefers Spanish.' }),
  ];

  const fmt = (t) => new Date(t).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const money = (n) => n ? '$' + Number(n).toLocaleString('en-US') : '—';

  /* ---------- form ---------- */
  function fillForm() {
    $('rf-state').innerHTML = '<option value="">Choose one</option>' + STATES.map((s) => `<option>${s}</option>`).join('');
    $('rf-lang').innerHTML = '<option value="">Choose one</option>' + LANGUAGES.map((s) => `<option>${s}</option>`).join('');
  }
  const typeVal = () => (document.querySelector('input[name="rf-type"]:checked') || {}).value || '';
  function updateReach() {
    const t = typeVal(), s = $('rf-state').value, el = $('rf-reach');
    if (!t || !s) { el.innerHTML = 'Choose a referral type and state to see who it goes to.'; return; }
    const a = audience(s, t);
    el.innerHTML = `Goes to <strong>${a.vip} VIP member${a.vip === 1 ? '' : 's'}</strong> first, then <strong>${a.elite} Elite member${a.elite === 1 ? '' : 's'}</strong> after a short delay — opted-in ${t.toLowerCase()}s in ${s}.`;
  }
  function submit() {
    const v = (id) => $(id).value.trim();
    const r = { type: typeVal(), first: v('rf-first'), last: v('rf-last'), email: v('rf-email'), state: $('rf-state').value, lang: $('rf-lang').value,
      program: v('rf-program'), amount: Number(v('rf-amount').replace(/[^0-9.]/g, '')) || 0, fb: v('rf-fb'), details: v('rf-details') };
    const missing = [['type', 'Referral type'], ['first', 'First name'], ['last', 'Last name'], ['email', 'Email'], ['state', 'State of referral'], ['details', 'Loan details']]
      .filter(([k]) => !r[k]).map(([, l]) => l);
    if (missing.length) { showToast('Fill in: ' + missing.join(', ')); return; }
    if (!/^\S+@\S+\.\S+$/.test(r.email)) { showToast('Enter a valid email address.'); return; }
    if (r.fb && !/^https?:\/\//.test(r.fb)) { showToast('The Facebook post URL should start with https://'); return; }
    const sent = Object.assign({ id: 'rf_' + (++seq), at: Date.now(), by: 'Kyle Lord' }, r, audience(r.state, r.type));
    referrals.unshift(sent);
    $('rf-form').reset(); updateReach(); fillFilters(); render();
    showToast(`Referral sent to ${sent.vip} VIP members — ${sent.elite} Elite members get it next.`);
    navigate('referral-history');
  }

  /* ---------- history table ---------- */
  function render() {
    const q = ($('rf-q').value || '').toLowerCase(), ty = $('rf-ftype').value, st = $('rf-fstate').value;
    const rows = referrals.filter((r) => (ty === 'all' || r.type === ty) && (st === 'all' || r.state === st) &&
      (!q || `${r.first} ${r.last} ${r.email}`.toLowerCase().includes(q)));
    $('rf-tbody').innerHTML = rows.map((r) => `<tr data-rf-open="${r.id}">
        <td class="t-strong">${esc(r.first)}</td>
        <td class="t-strong">${esc(r.last)}</td>
        <td>${esc(r.email)}</td>
        <td><span class="rf-type">${r.type}</span></td>
        <td>${r.state}</td>
        <td class="t-num">${r.vip}</td>
        <td class="t-num">${r.elite}</td>
        <td style="white-space:nowrap">${fmt(r.at)}</td>
        <td class="t-right"><button class="link-act" data-rf-open="${r.id}">Preview</button></td>
      </tr>`).join('') || '<tr><td colspan="9" class="t-sub" style="padding:24px;text-align:center">No referrals match.</td></tr>';
    $('rf-count').textContent = `${rows.length} of ${referrals.length} referrals`;
    const recent = referrals.filter((r) => Date.now() - r.at <= 30 * DAY);
    const sum = (k) => recent.reduce((n, r) => n + r[k], 0);
    const tile = (cls, ico, val, lbl) => `<div class="stat"><div class="s-ico ${cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${ico}</svg></div><div class="s-val">${val}</div><div class="s-lbl">${lbl}</div></div>`;
    $('rf-tiles').innerHTML =
      tile('i-navy', '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>', recent.length, 'Referrals sent, last 30 days') +
      tile('i-pink', '<path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/>', sum('vip'), 'Sent to VIP members') +
      tile('i-cyan', '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>', sum('elite'), 'Sent to Elite members') +
      tile('i-green', '<path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/>', recent.length ? Math.round((sum('vip') + sum('elite')) / recent.length) : '—', 'Average members reached per referral');
  }
  function fillFilters() {
    const used = [...new Set(referrals.map((r) => r.state))].sort();
    $('rf-fstate').innerHTML = '<option value="all">All states</option>' + used.map((s) => `<option>${s}</option>`).join('');
  }

  /* ---------- email preview ---------- */
  const subject = (r) => `New ${r.type.toLowerCase()} referral in ${r.state}${r.program ? ' — ' + r.program : ''}`;
  function emailHTML(r) {
    const row = (k, v) => v ? `<tr><td class="k">${k}</td><td>${v}</td></tr>` : '';
    return `<!doctype html><html><head><meta charset="utf-8"><style>
      body{margin:0;background:#f5f7fb;font-family:'Hanken Grotesk',Arial,sans-serif;color:#1d2433}
      .wrap{max-width:520px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e3e8f2}
      .top{background:#021649;padding:18px 26px;color:#fff;font-weight:800;letter-spacing:.06em}
      .top span{color:#20adce}
      .in{padding:26px} p{font-size:15px;line-height:1.55;margin:0 0 14px}
      table{width:100%;border-collapse:collapse;font-size:14px;margin:4px 0 16px} td{padding:8px 0;border-bottom:1px solid #eef1f7;vertical-align:top}
      td.k{color:#6b7590;width:130px;font-weight:600}
      .det{background:#f5f7fb;border-radius:10px;padding:12px 14px;font-size:14px;line-height:1.5;margin:0 0 16px}
      .btn{display:inline-block;background:#dd1969;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px;margin:6px 0 16px}
      .foot{font-size:12.5px;color:#6b7590;border-top:1px solid #eef1f7;padding:16px 26px}
    </style></head><body><div class="wrap"><div class="top">AMP <span>·</span> AIME Member Portal</div><div class="in">
      <p>Hi {first name},</p>
      <p>A new <strong>${r.type.toLowerCase()} referral</strong> in <strong>${r.state}</strong> matches your referral settings. Reach out to ${esc(r.first)} directly.</p>
      <table>${row('Name', esc(r.first + ' ' + r.last))}${row('Email', esc(r.email))}${row('State', r.state)}${row('Language', esc(r.lang))}
        ${row('Loan program', esc(r.program))}${row('Loan amount', r.amount ? money(r.amount) : '')}${row('Facebook post', r.fb ? `<a href="#">${esc(r.fb)}</a>` : '')}</table>
      <div class="det"><strong>Loan details</strong><br>${esc(r.details)}</div>
      <a class="btn" href="#">Email ${esc(r.first)}</a>
      <p style="font-size:13px;color:#6b7590">— The AIME Membership Team</p></div>
      <div class="foot">You're receiving this because you opted in to loan referrals for ${r.type.toLowerCase()}s in ${r.state}. Change your referral settings in AMP → Settings.<br>AIME · aimegroup.com</div></div></body></html>`;
  }
  function open(id) {
    const r = referrals.find((x) => x.id === id); if (!r) return;
    $('rf-m-title').textContent = subject(r);
    $('rf-m-sub').textContent = `Sent ${fmt(r.at)} by ${r.by}`;
    const kv = (k, v) => `<div class="rq-kv"><span class="k">${k}</span><span class="v">${v}</span></div>`;
    $('rf-m-body').innerHTML = `<div class="em-meta">
        ${kv('From', 'AIME Group &lt;noreply@notifications.aimegroup.com&gt;')}
        ${kv('Sent to', `<strong>${r.vip} VIP</strong> members first, then <strong>${r.elite} Elite</strong> members — each gets their own copy`)}
        ${kv('Matched on', `${r.type} · ${r.state}`)}</div>
      <iframe class="em-frame" title="Referral email preview" sandbox="" srcdoc="${esc(emailHTML(r))}"></iframe>`;
    openModal('referral');
  }

  /* ---------- wiring ---------- */
  document.addEventListener('click', (ev) => {
    const o = ev.target.closest('[data-rf-open]');
    if (o) { ev.preventDefault(); open(o.dataset.rfOpen); return; }
    if (ev.target.closest('#rf-submit')) { ev.preventDefault(); submit(); }
  });
  $('rf-form').addEventListener('change', updateReach);
  $('rf-form').addEventListener('reset', () => setTimeout(updateReach));
  $('rf-q').addEventListener('input', render);
  ['rf-ftype', 'rf-fstate'].forEach((id) => $(id).addEventListener('change', render));

  fillForm(); fillFilters(); updateReach(); render();
  window.AmpAdminReferrals = { render, open, audience };
})();
