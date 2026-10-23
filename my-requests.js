/* ============================================================
   AMP Member Portal — My Requests
   ------------------------------------------------------------
   History + tracking for everything the member submits:
     • Escalations  — Received → Responded → Resolved, plus
                      "Request a follow-up" (pings the AIME
                      membership team to chase the lender)
     • Support      — Received → In progress → Responded → Resolved,
                      as a two-way conversation
     • Connections / Change AE — Delivered
   Data lives in requests-store.js (shared with the admin console).
   Uses app.js globals: navigate, openModal, closeModals, showToast.
   ============================================================ */
(function () {
  const S = window.AmpRequests;
  if (!S) return;
  const { fmt, statusBadge, TYPES } = S;
  const esc = fmt.esc;
  const $ = (id) => document.getElementById(id);

  let filter = 'all';
  let currentId = null;

  /* ---------- small pieces ---------- */
  function flagFor(r) {
    if (S.memberUnread(r)) return `<span class="rq-flag">${r.type === 'support' ? 'New reply' : 'New update'}</span>`;
    if (r.followUp && r.followUp.status === 'open') return '<span class="rq-flag amber">Follow-up requested</span>';
    return '';
  }
  function row(r, compact) {
    const meta = compact
      ? `${r.id} · ${fmt.ago(S.lastActivity(r))}`
      : `${TYPES[r.type].label} · ${esc(r.partner)} · ${r.id} · Submitted ${fmt.date(r.createdAt)}`;
    return `<button class="rq-row" data-open-request="${r.id}" ${compact ? 'style="padding:12px 0"' : ''}>
      ${S.icon(r.type, compact)}
      <span class="rq-main"><span class="rq-title">${esc(r.title)}</span><span class="rq-meta">${meta}</span></span>
      ${flagFor(r)}
      ${compact ? '' : `<span class="rq-when">Updated ${fmt.ago(S.lastActivity(r))}</span>`}
      ${statusBadge(r.status)}
      ${compact ? '' : `<span class="rq-chev">${S.svg('chev')}</span>`}
    </button>`;
  }
  const stat = (f, ico, cls, val, lbl) =>
    `<button class="stat" data-rqf="${f}"><div class="s-ico ${cls}">${ico}</div><div class="s-val">${val}</div><div class="s-lbl">${lbl}</div></button>`;

  /* ---------- list ---------- */
  function renderList() {
    const mine = S.mine();
    const open = (t) => mine.filter((r) => r.type === t && r.status !== 'Resolved').length;
    const unread = mine.filter(S.memberUnread).length;
    $('rq-stats').innerHTML =
      stat('escalation', S.svg('escalation'), 'i-pink', open('escalation'), 'Open escalations') +
      stat('support', S.svg('support'), 'i-cyan', open('support'), 'Open support tickets') +
      stat('all', S.svg('reply'), 'i-navy', unread, 'New updates for you') +
      stat('connection', S.svg('connection'), 'i-green', mine.filter((r) => r.status === 'Delivered').length, 'Connections &amp; AE changes delivered');

    document.querySelectorAll('#rq-filters .chip').forEach((c) => c.classList.toggle('active', c.dataset.rqf === filter));
    const rows = mine.filter((r) => filter === 'all' || r.type === filter);
    $('rq-count').textContent = `${rows.length} request${rows.length === 1 ? '' : 's'}`;
    $('rq-list').innerHTML = rows.length ? rows.map((r) => row(r)).join('') : `
      <div class="empty rq-empty"><div class="e-ico">${S.svg('send')}</div>
        <h4>Nothing here yet</h4><p>When you submit ${filter === 'all' ? 'a request' : 'one'}, it'll show up here so you can track it.</p></div>`;
  }

  function renderRecentTickets() {
    const box = $('rq-recent-tickets');
    if (!box) return;
    const tickets = S.mine().filter((r) => r.type === 'support').slice(0, 3);
    box.innerHTML = tickets.length ? tickets.map((r) => row(r, true)).join('') : `
      <div class="empty"><div class="e-ico">${S.svg('support')}</div>
        <h4>No tickets yet</h4><p>When you submit a ticket it'll show up here so you can track its status.</p></div>`;
  }

  function renderNavCount() {
    const n = S.mine().filter(S.memberUnread).length;
    $('rq-nav-count').textContent = n ? n : '';
  }

  /* ---------- detail ---------- */
  function header(r) {
    const partnerLbl = r.type === 'support' ? 'Category' : r.fields.Vendor ? 'Vendor' : 'Lender';
    return `
      <a class="back-link" data-nav="requests">${backArrow} Back to my requests</a>
      <div class="card card-pad">
        <div class="rq-head">${S.icon(r.type)}
          <div style="flex:1;min-width:0">
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="badge badge-navy">${TYPES[r.type].label}</span>${statusBadge(r.status)}</div>
            <h1 style="margin-top:10px">${esc(r.title)}</h1>
            <div class="rq-head-meta">
              <span>Ref <strong>${r.id}</strong></span>
              <span>${partnerLbl} <strong>${esc(r.partner)}</strong></span>
              <span>Submitted <strong>${fmt.dateTime(r.createdAt)}</strong></span>
              ${r.assignee ? `<span>AIME contact <strong>${esc(r.assignee)}</strong></span>` : ''}
            </div>
          </div>
        </div>
        ${S.trackerHTML(r)}
      </div>`;
  }

  function fieldsCard(r, title) {
    const kv = Object.entries(r.fields).map(([k, v]) =>
      `<div class="rq-kv ${String(v).length > 40 ? 'block' : ''}"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join('');
    return `<div class="card card-pad"><h3 style="font-size:16px;margin-bottom:6px">${title}</h3>${kv}</div>`;
  }

  function followUpCard(r) {
    const lastDone = r.followUp && r.followUp.status === 'done' && r.followUp.doneAt
      ? ` Our last follow-up was on ${fmt.date(r.followUp.doneAt)}.` : '';
    if (r.status === 'Resolved') {
      const at = (r.activity.filter((a) => a.kind === 'status' && a.text === 'Resolved').pop() || {}).at || S.lastActivity(r);
      return `<div class="rq-fu done"><h3>Escalation resolved</h3><p>Closed on ${fmt.date(at)}. Need to escalate again? Start a new escalation from the lender's page.</p></div>`;
    }
    if (r.followUp && r.followUp.status === 'open') {
      return `<div class="rq-fu pending"><h3>Follow-up requested</h3>
        <p>You asked ${fmt.ago(r.followUp.requestedAt).toLowerCase()}. The AIME membership team is contacting ${esc(r.partner)}'s escalation desk for you and will post what they hear back here.</p></div>`;
    }
    if (r.status === 'Responded') {
      return `<div class="rq-fu"><h3>Did this solve it?</h3>
        <p>If ${esc(r.partner)}'s response took care of it, mark this escalation resolved. Still stuck? Ask our team to follow up.${lastDone}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-navy btn-sm" data-rq-resolve="${r.id}">Mark as resolved</button>
          <button class="btn btn-outline btn-sm" data-rq-followup="${r.id}">Request a follow-up</button>
        </div></div>`;
    }
    const reminded = r.activity.some((a) => a.kind === 'lender-reminder');
    return `<div class="rq-fu"><h3>No update from the lender?</h3>
      <p>We emailed ${esc(r.partner)}'s escalation team${reminded ? ' and sent them a reminder' : ''}. Still no word? Ask the AIME membership team to follow up — we'll remind the lender and chase their escalation desk for you.${lastDone}</p>
      <button class="btn btn-primary btn-sm" data-rq-followup="${r.id}">Request a follow-up</button></div>`;
  }

  function supportPanel(r) {
    const teamReplied = r.activity.some((a) => a.kind === 'message' && a.by === 'team');
    let foot;
    if (!teamReplied) {
      foot = `<div class="rq-waiting">${S.svg('support')}<div><strong style="color:var(--ink)">We've got your ticket.</strong> Our support team will reply right here, usually within one business day — you'll be able to respond once they do.</div></div>`;
    } else {
      const resolved = r.status === 'Resolved';
      foot = `<div class="rq-composer">
        ${resolved ? '<p style="color:var(--ink-soft);font-size:13.5px;margin:0 0 10px">This ticket is resolved. Need more help? Reply below and it will reopen.</p>' : ''}
        <textarea class="input" id="rq-reply" placeholder="${resolved ? 'Reply to reopen this ticket…' : 'Write a reply…'}"></textarea>
        <div class="rq-composer-foot"><span class="hint">Our support team is notified when you reply.</span>
          <button class="btn btn-primary btn-sm" data-rq-reply="${r.id}">${S.svg('send')} ${resolved ? 'Reply &amp; reopen' : 'Send reply'}</button></div>
      </div>`;
    }
    return `<div class="card card-pad"><h3 style="font-size:16px;margin-bottom:18px">Conversation</h3>${S.threadHTML(r, 'member')}${foot}</div>`;
  }

  const STATUS_HELP = {
    support: [['Received', 'Your ticket is in the queue.'], ['In progress', "Our team is working on it."],
      ['Responded', "We've replied — read it and respond if you need to."], ['Resolved', 'Closed. Reply any time to reopen.']],
    escalation: [['Received', "Delivered to the lender's escalation team."], ['Responded', 'The lender has replied.'],
      ['Resolved', 'The issue is closed.']],
  };
  const helpCard = (type) => `<div class="card card-pad" style="margin-top:20px"><h3 style="font-size:15px;margin-bottom:6px">What the statuses mean</h3>
    ${STATUS_HELP[type].map(([s, d]) => `<div class="rq-kv"><span class="k">${statusBadge(s)}</span><span class="v" style="color:var(--ink-soft)">${d}</span></div>`).join('')}</div>`;

  function renderDetail() {
    const r = S.get(currentId);
    const body = $('rq-detail-body');
    if (!r || !body) return;
    let main;
    if (r.type === 'escalation') {
      main = `<div class="grid rq-detail-grid" style="grid-template-columns:1.5fr 1fr;align-items:start;margin-top:20px">
        <div class="card card-pad"><h3 style="font-size:16px;margin-bottom:18px">Activity</h3>${S.timelineHTML(r, 'member')}</div>
        <div>${followUpCard(r)}<div style="margin-top:20px">${fieldsCard(r, 'Loan details')}</div>${helpCard('escalation')}</div>
      </div>`;
    } else if (r.type === 'support') {
      main = `<div class="grid rq-detail-grid" style="grid-template-columns:1.6fr 1fr;align-items:start;margin-top:20px">
        ${supportPanel(r)}
        <div><div class="card card-pad"><h3 style="font-size:16px;margin-bottom:6px">Ticket details</h3>
          <div class="rq-kv"><span class="k">Ticket</span><span class="v">${r.id}</span></div>
          <div class="rq-kv"><span class="k">Category</span><span class="v">${esc(r.partner)}</span></div>
          <div class="rq-kv"><span class="k">Opened</span><span class="v">${fmt.dateTime(r.createdAt)}</span></div>
          <div class="rq-kv"><span class="k">Last update</span><span class="v">${fmt.ago(S.lastActivity(r))}</span></div>
          <div class="rq-kv"><span class="k">Status</span><span class="v">${statusBadge(r.status)}</span></div>
        </div>${helpCard('support')}</div>
      </div>`;
    } else {
      const delivered = r.activity.find((a) => a.kind === 'delivered') || { at: r.createdAt, text: 'Delivered.' };
      const next = r.type === 'connection'
        ? `${esc(r.partner)}'s partner team will reach out to you directly. Connections aren't tracked after delivery — if you haven't heard back in a week, open a support ticket and we'll nudge them.`
        : `${esc(r.partner)} and the AIME membership team have your request and will contact you about your new account executive.`;
      main = `<div class="grid rq-detail-grid" style="grid-template-columns:1.5fr 1fr;align-items:start;margin-top:20px">
        <div>${fieldsCard(r, r.type === 'connection' ? 'What we shared' : 'Request details')}
          <div class="card card-pad" style="margin-top:20px"><h3 style="font-size:16px;margin-bottom:18px">Activity</h3>${S.timelineHTML(r, 'member')}</div></div>
        <div class="rq-fu done"><h3>Delivered</h3><p>${esc(delivered.text)}<br><span style="opacity:.8">${fmt.dateTime(delivered.at)}</span></p>
          <p style="margin-top:12px;color:var(--ink-soft)">${next}</p>
          <button class="btn btn-outline btn-sm" style="margin-top:14px" data-nav="support">Open a support ticket</button></div>
      </div>`;
    }
    body.innerHTML = header(r) + main;
  }

  function openDetail(id) {
    currentId = id;
    S.markSeen(id, 'member');
    renderDetail();
    navigate('request-detail');
    renderAll();
  }

  function renderAll() {
    renderList(); renderRecentTickets(); renderNavCount();
    if (currentId && $('view-request-detail').classList.contains('active')) {
      const draft = $('rq-reply') ? $('rq-reply').value : '';
      renderDetail();
      if (draft && $('rq-reply')) $('rq-reply').value = draft;
    }
  }

  /* ---------- submissions from the existing modals / support form ---------- */
  // Reads the first real choice in a select (falls back past "Choose a lender…" placeholders).
  const pick = (sel) => (sel && sel.selectedIndex > 0 ? sel.value : sel && sel.options[1] ? sel.options[1].text : '');
  function submit(kind, el) {
    if (kind === 'escalation') {
      const m = $('modal-escalate'), sels = m.querySelectorAll('.modal-body select'), ins = m.querySelectorAll('.modal-body input');
      const lender = pick(sels[0]);
      const loan = ins[0].value.trim() || String(100400000 + Math.floor(Math.random() * 99999));
      const fields = { 'Loan number': loan, 'Loan type': sels[1].value };
      if (ins[1].value.trim()) fields['Loan amount'] = ins[1].value.trim();
      if (ins[2].value) fields['Closing date'] = fmt.date(ins[2].value + 'T12:00:00');
      S.create('escalation', { partner: lender, title: `Escalation — loan #${loan}`, fields });
    } else if (kind === 'connection') {
      const m = $('modal-connect'), lender = pick(m.querySelector('.modal-body select'));
      const ins = m.querySelectorAll('.modal-body input');
      S.create('connection', { partner: lender, title: `Connection request — ${lender}`,
        fields: { Lender: lender, 'Shared with lender': `${ins[0].value}, ${ins[1].value}, ${ins[2].value}, NMLS #${ins[3].value}, licenses ${ins[4].value}` } });
    } else if (kind === 'vendor') {
      const v = el.dataset.vendor;
      S.create('connection', { partner: v, title: `Connection request — ${v}`,
        fields: { Vendor: v, 'Shared with vendor': `${S.ME.name}, ${S.ME.email}` } });
    } else if (kind === 'changeae') {
      const m = $('modal-changeae'), sels = m.querySelectorAll('.modal-body select');
      const lender = pick(sels[0]), ae = m.querySelector('.modal-body input.input').value.trim();
      const fields = { Lender: lender, 'Current AE': ae || '—', Reason: pick(sels[1]) };
      const more = m.querySelector('textarea').value.trim(); if (more) fields.Details = more;
      fields['Tried to resolve with AE'] = m.querySelector('input[type=checkbox]').checked ? 'Yes' : 'No';
      S.create('changeae', { partner: lender, title: `Change AE — ${lender}`, fields });
    } else if (kind === 'support') {
      const subj = $('tk-subject'), cat = $('tk-category'), msg = $('tk-message');
      const category = cat.selectedIndex > 0 ? cat.value : 'General';
      const r = S.create('support', { partner: category, title: subj.value.trim() || 'Support request',
        fields: { Category: category }, message: msg.value.trim() || '(No message)' });
      subj.value = ''; msg.value = ''; cat.selectedIndex = 0;
      return r;
    }
  }

  /* ---------- events ---------- */
  document.addEventListener('click', (e) => {
    let m;
    if ((m = e.target.closest('[data-submit]'))) { submit(m.dataset.submit, m); return; }   // app.js shows the toast / closes the modal
    if ((m = e.target.closest('[data-open-request]'))) { e.preventDefault(); openDetail(m.dataset.openRequest); return; }
    if ((m = e.target.closest('[data-rqf]'))) { e.preventDefault(); filter = m.dataset.rqf; renderList(); return; }
    if ((m = e.target.closest('[data-rq-filter]'))) { e.preventDefault(); filter = m.dataset.rqFilter; renderList(); navigate('requests'); return; }
    if ((m = e.target.closest('[data-rq-followup]'))) {
      e.preventDefault();
      const r = S.get(m.dataset.rqFollowup);
      $('fu-sub').textContent = `The AIME membership team will contact ${r.partner} about ${r.id} on your behalf.`;
      $('fu-note').value = '';
      openModal('followup');
      return;
    }
    if ((m = e.target.closest('#fu-submit'))) {
      e.preventDefault();
      S.requestFollowUp(currentId, $('fu-note').value.trim());
      closeModals();
      showToast('Follow-up requested — the membership team has been notified.');
      return;
    }
    if ((m = e.target.closest('[data-rq-resolve]'))) {
      e.preventDefault();
      S.setStatus(m.dataset.rqResolve, 'Resolved', 'member', S.ME.name);
      showToast('Escalation marked as resolved.');
      return;
    }
    if ((m = e.target.closest('[data-rq-reply]'))) {
      e.preventDefault();
      const text = $('rq-reply').value;
      if (!text.trim()) { $('rq-reply').focus(); return; }
      $('rq-reply').value = '';
      S.reply(m.dataset.rqReply, 'member', S.ME.name, text);
      showToast('Reply sent to the support team.');
      return;
    }
  });

  S.onChange(renderAll);
  renderAll();

  // Deep link: index.html#request=ESC-1042
  const h = (location.hash || '').replace('#', '');
  if (h.startsWith('request=') && S.get(h.slice(8))) openDetail(h.slice(8));
})();
