/* ============================================================
   AMP Admin — Request tracking
   ------------------------------------------------------------
   Admin side of the member request history (requests-store.js):
     • Queue with type chips, status / assignee filters, search,
       and a "Needs attention" view (follow-ups requested,
       unanswered tickets, unassigned escalations)
     • Detail page per request: status control, assignment,
       support replies, logging the lender's response on an
       escalation, closing out a member follow-up, internal notes
   Bug reports still use admin.js's `requests` array + modal.
   Uses admin.js globals: navigate, showToast, openRequest,
   statusPill, reqTypeMeta.
   ============================================================ */
(function () {
  const S = window.AmpRequests;
  if (!S) return;
  const { fmt, statusBadge, TYPES, TEAM } = S;
  const esc = fmt.esc;
  const $ = (id) => document.getElementById(id);
  const ME = 'AIME Team';                       // signed-in admin (sidebar profile)

  let typeFilter = 'all', attnOnly = false;
  let currentId = null, mode = null;

  const isOpen = (r) => r.status !== 'Resolved' && r.status !== 'Delivered';
  const bugs = () => requests.map((r, i) => Object.assign({ i }, r));   // admin.js bug reports

  function lastLabel(r) {
    const acts = r.activity.slice().sort(S.byAt);
    let a = acts.pop();
    // A status change logged with a reply/follow-up describes that action — show the action.
    if (a.kind === 'status' && acts.length && acts[acts.length - 1].at === a.at) a = acts.pop();
    const first = r.activity.find((x) => x.kind === 'message') === a;
    const who = {
      message: a.by === 'team' ? `${a.author} replied` : first ? 'Ticket opened' : 'Member replied',
      'followup-request': 'Follow-up requested', 'followup-update': 'Follow-up posted',
      'lender-response': a.via ? `Lender responded (${a.via})` : 'Lender responded', 'lender-reminder': 'Reminder sent to lender', status: `Status → ${a.text}`,
      submitted: 'Submitted', delivered: 'Delivered', note: 'Internal note',
    }[a.kind] || '';
    return `<div>${esc(who)}</div><div class="t-sub">${fmt.ago(a.at)}</div>`;
  }
  function flags(r) {
    let f = '';
    if (r.followUp && r.followUp.status === 'open') f += ' <span class="rq-flag amber">Follow-up requested</span>';
    else if (r.type === 'support' && S.adminNeedsAttention(r)) f += ` <span class="rq-flag">${r.status === 'Received' ? 'Needs first reply' : 'Member replied'}</span>`;
    else if (r.type === 'escalation' && S.adminNeedsAttention(r)) f += ' <span class="rq-flag">Unassigned</span>';
    return f;
  }

  /* ---------- queue ---------- */
  function renderStats() {
    const all = S.all();
    const n = {
      esc: all.filter((r) => r.type === 'escalation' && isOpen(r)).length,
      fu: all.filter((r) => r.followUp && r.followUp.status === 'open').length,
      tk: all.filter((r) => r.type === 'support' && S.adminNeedsAttention(r)).length,
      un: all.filter((r) => isOpen(r) && !r.assignee).length,
    };
    const tile = (k, cls, ico, val, lbl) => `<button class="stat" data-arq-stat="${k}"><div class="s-ico ${cls}">${S.svg(ico)}</div><div class="s-val">${val}</div><div class="s-lbl">${lbl}</div></button>`;
    $('arq-stats').innerHTML =
      tile('esc', 'i-pink', 'escalation', n.esc, 'Open escalations') +
      tile('fu', 'i-amber', 'flag', n.fu, 'Follow-ups requested') +
      tile('tk', 'i-cyan', 'support', n.tk, 'Tickets awaiting a reply') +
      tile('un', 'i-navy', 'changeae', n.un, 'Open &amp; unassigned');
  }

  function renderQueue() {
    renderStats();
    const q = ($('arq-search').value || '').trim().toLowerCase();
    const st = $('arq-status').value, who = $('arq-assignee').value;
    document.querySelectorAll('#request-filters .chip[data-filter]').forEach((c) => c.classList.toggle('active', c.dataset.filter === typeFilter));
    $('arq-attn').classList.toggle('active', attnOnly);

    let rows = [];
    if (typeFilter !== 'bug') {
      rows = S.all().filter((r) =>
        (typeFilter === 'all' || r.type === typeFilter) &&
        (!attnOnly || S.adminNeedsAttention(r)) &&
        (st === 'all' || (st === 'open' ? isOpen(r) : r.status === st)) &&
        (who === 'all' || r.assignee === who) &&
        (!q || [r.id, r.member, r.partner, r.title, r.email].join(' ').toLowerCase().includes(q)));
      // needs-attention first, then most recent activity
      rows.sort((a, b) => (S.adminNeedsAttention(b) - S.adminNeedsAttention(a)) || (S.lastActivity(b) > S.lastActivity(a) ? 1 : -1));
    }
    let html = rows.map((r) => `
      <tr class="${S.adminNeedsAttention(r) ? 'rq-attn' : ''}" style="cursor:pointer" data-arq-open="${r.id}">
        <td><span class="rq-ref">${r.id}</span></td>
        <td><div class="t-id">${S.icon(r.type, true)}<div><div class="t-strong">${esc(r.title)}</div>
          <div class="t-sub">${TYPES[r.type].label} · ${esc(r.partner)}${flags(r)}</div></div></div></td>
        <td><div class="t-strong">${esc(r.member)}</div><div class="t-sub">${r.tier}</div></td>
        <td>${r.assignee ? esc(r.assignee) : '<span style="color:var(--muted)">—</span>'}</td>
        <td>${lastLabel(r)}</td>
        <td>${statusBadge(r.status)}</td>
        <td class="t-right"><div class="row-actions"><button class="link-act" data-arq-open="${r.id}">Open</button></div></td>
      </tr>`).join('');

    // Bug reports (interface only) — shown under All / Bugs
    const showBugs = (typeFilter === 'all' || typeFilter === 'bug') && !attnOnly && (who === 'all' || who === '');
    const bugRows = showBugs ? bugs().filter((b) =>
      (st === 'all' || (st === 'open' ? b.status !== 'Resolved' : b.status === st)) &&
      (!q || [b.member, b.detail].join(' ').toLowerCase().includes(q))) : [];
    const m = reqTypeMeta.Bug;
    html += bugRows.map((b) => `
      <tr style="cursor:pointer" data-request="${b.i}">
        <td><span class="rq-ref">BUG</span></td>
        <td><div class="t-id"><span class="rq-ico sm" style="background:#fde4ee;color:var(--pink)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${m.ico}</svg></span>
          <div><div class="t-strong">${esc(b.detail)}</div><div class="t-sub">Bug report</div></div></div></td>
        <td class="t-strong">${esc(b.member)}</td><td><span style="color:var(--muted)">—</span></td>
        <td><div class="t-sub">${b.date}</div></td><td>${statusPill(b.status)}</td>
        <td class="t-right"><div class="row-actions"><button class="link-act" data-request="${b.i}">Review</button></div></td>
      </tr>`).join('');

    const total = rows.length + bugRows.length;
    $('requests-tbody').innerHTML = total ? html
      : '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:32px">No requests match these filters.</td></tr>';
    const attn = S.all().filter(S.adminNeedsAttention).length;
    $('request-count').textContent = `${total} shown · ${attn} need${attn === 1 ? 's' : ''} attention`;
  }

  /* ---------- dashboard + nav badge ---------- */
  function renderDashboard() {
    const open = S.all().filter(isOpen);
    const openBugs = bugs().filter((b) => b.status !== 'Resolved');
    if ($('dash-pending')) $('dash-pending').textContent = open.length + openBugs.length;
    $('nav-req-count').textContent = S.all().filter(S.adminNeedsAttention).length + bugs().filter((b) => b.status === 'New').length;
    const top = open.sort((a, b) => (S.adminNeedsAttention(b) - S.adminNeedsAttention(a)) || (S.lastActivity(b) > S.lastActivity(a) ? 1 : -1)).slice(0, 5);
    $('dash-requests').innerHTML = '<thead><tr><th>Request</th><th>Member</th><th>Last activity</th><th>Status</th></tr></thead><tbody>' +
      top.map((r) => `<tr style="cursor:pointer" data-arq-open="${r.id}" class="${S.adminNeedsAttention(r) ? 'rq-attn' : ''}">
        <td><div class="t-id">${S.icon(r.type, true)}<div><div class="t-strong">${TYPES[r.type].label}</div><div class="t-sub">${r.id}${flags(r)}</div></div></div></td>
        <td class="t-strong">${esc(r.member)}</td><td>${lastLabel(r)}</td><td>${statusBadge(r.status)}</td></tr>`).join('') + '</tbody>';
  }

  /* ---------- detail ---------- */
  const MODES = {
    escalation: (r) => [...(r.followUp && r.followUp.status === 'open' ? [['followup', 'Follow-up update']] : []), ['lender', 'Log lender response'], ['note', 'Internal note']],
    support: () => [['reply', 'Reply to member'], ['note', 'Internal note']],
    connection: () => [['note', 'Internal note']],
    changeae: () => [['note', 'Internal note']],
  };
  const MODE_UI = {
    reply:    { ph: 'Write a reply to the member — they can respond in the portal…', btns: [['send', 'Send reply', 'btn-primary'], ['send-resolve', 'Send & resolve', 'btn-outline']],
                hint: 'Sets the ticket to Responded. The member is notified.' },
    lender:   { ph: "Paste or summarize the lender's response (from email, phone, etc.)…", btns: [['lender', 'Log response', 'btn-primary']],
                hint: 'For responses that reach us outside the lender email (phone, direct email). Email replies and one-click updates are captured automatically.' },
    followup: { ph: 'What did the lender say? This update is posted for the member…', btns: [['followup', 'Post update & close follow-up', 'btn-primary']],
                hint: 'Visible to the member. Closes the open follow-up request.' },
    note:     { ph: 'Add a note for the team — not visible to the member…', btns: [['note', 'Add note', 'btn-navy']],
                hint: 'Internal only.' },
  };

  function composer(r) {
    const modes = MODES[r.type](r);
    if (!modes.some(([k]) => k === mode)) mode = modes[0][0];
    const ui = MODE_UI[mode];
    return `<div class="rq-composer">
      <div class="rq-tabs">${modes.map(([k, l]) => `<button class="${k === mode ? 'active' : ''} ${k === 'note' ? 'note' : ''}" data-arq-mode="${k}">${l}</button>`).join('')}</div>
      <textarea class="input" id="arq-text" placeholder="${ui.ph}"></textarea>
      <div class="rq-composer-foot"><span class="hint">${ui.hint}</span>
        ${ui.btns.map(([act, label, cls]) => `<button class="btn ${cls} btn-sm" data-arq-act="${act}">${label}</button>`).join('')}</div>
    </div>`;
  }

  function sideCards(r) {
    const flow = TYPES[r.type].flow;
    const statusCard = flow.length > 1
      ? `<div class="card card-pad"><h3 style="font-size:15px;margin-bottom:12px">Status</h3>
          <div class="rq-seg">${flow.map((s) => `<button class="${s === r.status ? 'active' : ''}" data-arq-status="${s}">${s}</button>`).join('')}</div>
          <p class="t-sub" style="margin-top:10px">${r.type === 'escalation' ? 'Changes are shown to the member on their escalation.' : 'Replying sets Responded automatically; a member reply moves it back to In progress.'}</p></div>`
      : `<div class="card card-pad"><h3 style="font-size:15px;margin-bottom:8px">Status</h3>${statusBadge('Delivered')}
          <p class="t-sub" style="margin-top:10px">${r.type === 'connection' ? 'Sent to the partner automatically — no further tracking.' : 'Sent to the lender and the membership team — no further tracking.'}</p></div>`;

    const assignCard = `<div class="card card-pad" style="margin-top:20px"><h3 style="font-size:15px;margin-bottom:10px">Assigned to</h3>
      <select class="select" id="arq-assign"><option value="">Unassigned</option>${TEAM.map((t) => `<option ${t === r.assignee ? 'selected' : ''}>${t}</option>`).join('')}</select></div>`;

    let fuCard = '';
    if (r.type === 'escalation') {
      const n = r.activity.filter((a) => a.kind === 'followup-request').length;
      fuCard = r.followUp && r.followUp.status === 'open'
        ? `<div class="rq-fu pending" style="margin-top:20px"><h3>⚑ Follow-up requested</h3>
            <p>${esc(r.member)} asked ${fmt.ago(r.followUp.requestedAt).toLowerCase()} for us to chase ${esc(r.partner)}.${r.followUp.note ? `<br><br>“${esc(r.followUp.note)}”` : ''}</p>
            <p style="margin-top:10px">Contact the lender's escalation desk, then post an update for the member.</p>
            <button class="btn btn-primary btn-sm" style="margin-top:12px" data-arq-mode="followup">Write update</button></div>`
        : `<div class="card card-pad" style="margin-top:20px"><h3 style="font-size:15px;margin-bottom:6px">Follow-ups</h3>
            <p class="t-sub">${n ? `${n} requested so far · none open.` : 'The member hasn\'t requested a follow-up.'}</p></div>`;
    }

    let lenderCard = '';
    if (r.type === 'escalation') {
      const c = S.lenderContact(r.partner);
      const sends = r.activity.filter((a) => a.kind === 'delivered' || a.kind === 'lender-reminder');
      const lastSend = sends.length ? sends.sort(S.byAt)[sends.length - 1].at : r.createdAt;
      const heard = r.activity.some((a) => a.kind === 'lender-response');
      lenderCard = `<div class="card card-pad" style="margin-top:20px"><h3 style="font-size:15px;margin-bottom:6px">Lender contacts</h3>
        <div class="rq-kv"><span class="k">Sent to</span><span class="v">${c.contacts.map((x) => `<div style="margin-bottom:4px">${x.name ? `${esc(x.name)}<div class="t-sub">${esc(x.email)}</div>` : esc(x.email)}</div>`).join('')}</span></div>
        <div class="rq-kv"><span class="k">Reply address</span><span class="v rq-ref">${esc(S.replyAddress(r.id))}</span></div>
        <div class="rq-kv"><span class="k">Emails sent</span><span class="v">${sends.length} · last ${fmt.ago(lastSend).toLowerCase()}</span></div>
        <div class="rq-kv"><span class="k">Lender has responded</span><span class="v">${heard ? 'Yes' : 'Not yet'}</span></div>
        <p class="t-sub" style="margin:10px 0 12px">Every escalation contact on the lender listing gets the email. Any of them can reply or click a status button — no login. Auto-reminder after ${c.reminderDays} business days without a response.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <a class="btn btn-outline btn-sm" href="lender-email.html?esc=${encodeURIComponent(r.id)}" target="_blank" rel="noopener">Preview email</a>
          ${r.status !== 'Resolved' ? '<button class="btn btn-outline btn-sm" data-arq-remind>Send reminder now</button>' : ''}
        </div></div>`;
    }

    const memberCard = `<div class="card card-pad" style="margin-top:20px"><h3 style="font-size:15px;margin-bottom:6px">Member</h3>
      <div class="rq-kv"><span class="k">Name</span><span class="v">${esc(r.member)}</span></div>
      <div class="rq-kv"><span class="k">Email</span><span class="v">${esc(r.email)}</span></div>
      <div class="rq-kv"><span class="k">Tier</span><span class="v">${r.tier}</span></div>
      <a href="#" class="link-act" data-nav="members" style="display:inline-block;margin-top:10px">View member →</a></div>`;

    const fields = Object.entries(r.fields).map(([k, v]) =>
      `<div class="rq-kv ${String(v).length > 40 ? 'block' : ''}"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join('');
    const fieldsCard = fields ? `<div class="card card-pad" style="margin-top:20px"><h3 style="font-size:15px;margin-bottom:6px">Submitted details</h3>${fields}</div>` : '';
    return statusCard + assignCard + fuCard + lenderCard + memberCard + fieldsCard;
  }

  function renderDetail() {
    const r = S.get(currentId), body = $('arq-detail-body');
    if (!r || !body) return;
    const main = r.type === 'support'
      ? `<div class="card card-pad"><h3 style="font-size:16px;margin-bottom:18px">Conversation</h3>${S.threadHTML(r, 'admin')}${composer(r)}</div>`
      : `<div class="card card-pad"><h3 style="font-size:16px;margin-bottom:18px">Activity</h3>${S.timelineHTML(r, 'admin')}${composer(r)}</div>`;
    body.innerHTML = `
      <a class="back-link" data-nav="requests"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back to requests</a>
      <div class="card card-pad">
        <div class="rq-head">${S.icon(r.type)}
          <div style="flex:1;min-width:0">
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="badge badge-navy">${TYPES[r.type].label}</span>${statusBadge(r.status)}${flags(r)}</div>
            <h1 style="margin-top:10px">${esc(r.title)}</h1>
            <div class="rq-head-meta">
              <span>Ref <strong>${r.id}</strong></span>
              <span>Member <strong>${esc(r.member)}</strong> (${r.tier})</span>
              <span>${r.type === 'support' ? 'Category' : r.fields.Vendor ? 'Vendor' : 'Lender'} <strong>${esc(r.partner)}</strong></span>
              <span>Submitted <strong>${fmt.dateTime(r.createdAt)}</strong></span>
            </div>
          </div>
        </div>
        ${S.trackerHTML(r)}
      </div>
      <div class="grid rq-detail-grid" style="grid-template-columns:1.6fr 1fr;align-items:start;margin-top:20px">
        <div>${main}</div><div>${sideCards(r)}</div>
      </div>`;
  }

  function openDetail(id) {
    currentId = id; mode = null;
    S.markSeen(id, 'admin');
    renderDetail();
    navigate('request-detail');
  }
  window.AmpAdminRequests = { open: openDetail, showQueue: () => navigate('requests') };   // used by the admin walkthrough

  function renderAll() {
    renderQueue(); renderDashboard();
    if (currentId && $('view-request-detail').classList.contains('active')) {
      const draft = $('arq-text') ? $('arq-text').value : '';
      renderDetail();
      if (draft && $('arq-text')) $('arq-text').value = draft;
    }
  }

  function act(kind) {
    const r = S.get(currentId), box = $('arq-text'), text = box.value;
    if (!text.trim() && kind !== 'followup') { box.focus(); return; }
    switch (kind) {
      case 'send':         S.reply(r.id, 'team', ME, text, false); showToast(`Reply sent to ${r.member}.`); break;
      case 'send-resolve': S.reply(r.id, 'team', ME, text, true);  showToast(`Reply sent and ticket resolved.`); break;
      case 'lender':       S.lenderResponse(r.id, text, `logged by ${ME}`);       showToast(`Lender response logged — ${r.member} can see it.`); break;
      case 'followup':     S.completeFollowUp(r.id, text, ME); mode = null; showToast(`Follow-up update posted for ${r.member}.`); break;
      case 'note':         S.addNote(r.id, text, ME);              showToast('Internal note added.'); break;
    }
    if ($('arq-text')) $('arq-text').value = '';
  }

  /* ---------- events ---------- */
  $('arq-assignee').innerHTML += TEAM.map((t) => `<option>${t}</option>`).join('');
  ['arq-search', 'arq-status', 'arq-assignee'].forEach((id) => $(id).addEventListener(id === 'arq-search' ? 'input' : 'change', renderQueue));
  $('arq-reset').addEventListener('click', () => { S.reset(); showToast('Sample request data restored.'); });

  document.addEventListener('click', (e) => {
    let m;
    if ((m = e.target.closest('#request-filters .chip[data-filter]'))) { typeFilter = m.dataset.filter; renderQueue(); return; }
    if (e.target.closest('#arq-attn')) { attnOnly = !attnOnly; renderQueue(); return; }
    if ((m = e.target.closest('[data-arq-stat]'))) {
      const k = m.dataset.arqStat;
      typeFilter = k === 'esc' || k === 'fu' ? 'escalation' : k === 'tk' ? 'support' : 'all';
      attnOnly = k === 'fu' || k === 'tk';
      $('arq-status').value = 'open';
      $('arq-assignee').value = k === 'un' ? '' : 'all';
      renderQueue();
      return;
    }
    if ((m = e.target.closest('[data-arq-open]'))) { e.preventDefault(); openDetail(m.dataset.arqOpen); return; }
    if ((m = e.target.closest('[data-arq-mode]'))) {
      e.preventDefault(); mode = m.dataset.arqMode;
      const draft = $('arq-text') ? $('arq-text').value : '';
      renderDetail(); $('arq-text').value = draft; $('arq-text').focus();
      return;
    }
    if ((m = e.target.closest('[data-arq-act]'))) { e.preventDefault(); act(m.dataset.arqAct); return; }
    if (e.target.closest('[data-arq-remind]')) {
      e.preventDefault();
      const r = S.get(currentId);
      S.remindLender(r.id, `sent by ${ME}`);
      showToast(`Reminder emailed to ${S.lenderContact(r.partner).inbox}.`);
      return;
    }
    if ((m = e.target.closest('[data-arq-status]'))) {
      e.preventDefault();
      const r = S.get(currentId), s = m.dataset.arqStatus;
      if (r.status === s) return;
      S.setStatus(r.id, s, 'team', ME);
      showToast(`${r.id} set to ${s}.`);
      return;
    }
  });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'arq-assign') {
      S.assign(currentId, e.target.value);
      showToast(e.target.value ? `Assigned to ${e.target.value}.` : 'Unassigned.');
    }
  });

  S.onChange(renderAll);
  renderAll();

  // Deep link: admin.html#request=ESC-1042
  const h = (location.hash || '').replace('#', '');
  if (h.startsWith('request=') && S.get(h.slice(8))) openDetail(h.slice(8));
})();
