/* ============================================================
   Lender-facing escalation pages (prototype)
   ------------------------------------------------------------
   Lenders never log in to AMP. They get the escalation by email
   by every escalation contact on the lender listing and can respond either way:
     • reply to the email (reply address is unique per escalation)
     • click "We're on it" / "Resolved" → lender-respond.html
   lender-email.html  — preview of that email (+ simulate a reply)
   lender-respond.html — the one-click status page
   Data: requests-store.js (shared with the member + admin apps).
   ============================================================ */
(function () {
  const S = window.AmpRequests;
  if (!S) return;
  const { fmt, statusBadge } = S;
  const esc = fmt.esc;
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const id = params.get('esc') || 'ESC-1042';

  let toastTimer;
  function showToast(msg) {
    const t = $('toast'); if (!t) return;
    $('toast-msg').textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  function loanRows(r) {
    const rows = [['Broker', `${r.member} · ${r.email}`], ['AIME membership', r.tier], ['Escalation', r.id],
      ...Object.entries(r.fields)];
    return rows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
  }

  /* ---------- email preview ---------- */
  function renderEmail() {
    const r = S.get(id);
    if (!r || r.type !== 'escalation') { $('le-email').innerHTML = '<div class="card card-pad">No escalation found for this link.</div>'; return; }
    const reminder = params.get('type') === 'reminder';
    const c = S.lenderContact(r.partner);
    const base = `lender-email.html?esc=${encodeURIComponent(r.id)}`;
    $('le-variant').innerHTML =
      `<a class="${reminder ? '' : 'active'}" href="${base}">First email</a><a class="${reminder ? 'active' : ''}" href="${base}&type=reminder">Reminder</a>`;

    const subject = `${reminder ? 'Reminder: ' : ''}AIME loan escalation ${r.id} — ${r.title} · ${r.member}`;
    $('le-email').innerHTML = `
      <div class="le-client">
        <div class="le-headers">
          <div><span>From</span>AIME Escalations &lt;escalations@aimegroup.com&gt;</div>
          <div><span>To</span>${esc(c.inbox)}</div>
          <div><span>Reply-To</span><code>${esc(S.replyAddress(r.id))}</code></div>
          <div class="le-subject"><span>Subject</span>${esc(subject)}</div>
        </div>
        <div class="le-msg">
          <div class="le-brand"><img src="assets/AMP-Logo.png" alt="AMP — AIME Member Portal"></div>
          <div class="le-inner">
            ${reminder
              ? `<p class="le-kicker" style="color:#b07c08">Still open</p><h2>This escalation hasn't had a response yet</h2>
                 <p>${esc(r.member)} escalated this loan on ${fmt.date(r.createdAt)}. A quick reply or one click below lets them know where it stands.</p>`
              : `<p class="le-kicker">New loan escalation</p><h2>${esc(r.title)}</h2>
                 <p>An AIME member broker has escalated a loan with ${esc(r.partner)}. Details are below.</p>`}
            <table class="le-table">${loanRows(r)}</table>
            <p style="margin-top:22px"><strong>Let the broker know where it stands — whichever is easiest:</strong></p>
            <div class="le-btns">
              <a class="le-btn" href="${S.lenderLink(r.id, 'working')}" target="_blank" rel="noopener">We're on it</a>
              <a class="le-btn green" href="${S.lenderLink(r.id, 'resolved')}" target="_blank" rel="noopener">Resolved</a>
            </div>
            <p>…or simply <strong>reply to this email</strong>. Your reply goes straight onto the broker's escalation record.</p>
            <p class="le-muted">Already tracking this in your own system? Keep working it there — reply from it or forward this email as usual. Nothing else changes, and there's no login.</p>
          </div>
          <div class="le-footer">You're receiving this because ${esc(r.partner)} is an AIME lender partner and this is your escalation contact on file.
            Wrong contact? Reply and let us know, or email partners@aimegroup.com.</div>
        </div>
      </div>`;

    $('le-sim').innerHTML = `
      <h3 style="font-size:15px;margin-bottom:4px">Prototype: simulate the lender hitting Reply</h3>
      <p class="t-sub" style="color:var(--muted);font-size:13px;margin:0 0 12px">In production the reply to <code>${esc(S.replyAddress(r.id))}</code> is captured automatically and added to the escalation. Current status: ${statusBadge(r.status)}</p>
      <textarea class="input" id="le-reply" placeholder="e.g. Appraiser is confirmed for Wednesday at 10am; report due Friday."></textarea>
      <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;align-items:center">
        <button class="btn btn-primary btn-sm" id="le-send">Send reply as ${esc(r.partner)}</button>
        <a class="link-pink" href="index.html#request=${encodeURIComponent(r.id)}">See it as the member →</a>
        <a class="link-pink" href="admin.html#request=${encodeURIComponent(r.id)}">See it in admin →</a>
      </div>`;
    $('le-send').addEventListener('click', () => {
      const text = $('le-reply').value;
      if (!text.trim()) { $('le-reply').focus(); return; }
      S.lenderResponse(r.id, text, 'email reply');
      showToast(`Reply captured — ${r.member} can see it on ${r.id}.`);
    });
  }

  /* ---------- one-click response page ---------- */
  let choice = params.get('action') === 'resolved' ? 'resolved' : 'working';
  let sent = null;

  function renderRespond() {
    const r = S.get(id), box = $('lr-body');
    if (!r || r.type !== 'escalation') {
      box.innerHTML = `<h1>This link isn't valid</h1><p class="lp-sub">It may have expired. Reply to the escalation email instead, or contact partners@aimegroup.com.</p>`;
      return;
    }
    const summary = `<table class="le-table" style="margin:18px 0 0">
      <tr><th>Escalation</th><td>${r.id} · ${statusBadge(r.status)}</td></tr>
      <tr><th>Broker</th><td>${esc(r.member)}</td></tr>
      <tr><th>Loan</th><td>#${esc(r.fields['Loan number'] || '—')}${r.fields['Loan type'] ? ' · ' + esc(r.fields['Loan type']) : ''}</td></tr>
      ${r.fields.Issue ? `<tr><th>Issue</th><td>${esc(r.fields.Issue)}</td></tr>` : ''}</table>`;

    if (sent) {
      box.innerHTML = `<div class="lp-done">${S.svg('check')}</div>
        <h1>Thanks — ${esc(r.member)} has been updated</h1>
        <p class="lp-sub">${sent === 'resolved' ? 'The escalation is marked <strong>Resolved</strong>.' : 'The broker can see that you\'re working on it.'} The AIME membership team sees it too, so nobody will chase you on this one.</p>
        ${summary}
        <p style="margin-top:20px"><button class="link-pink" id="lr-again">Need to change something? Update again</button></p>`;
      $('lr-again').addEventListener('click', () => { sent = null; renderRespond(); });
      return;
    }

    const opt = (k, title, sub) => `<button class="lr-opt ${choice === k ? 'active' : ''} ${k}" data-choice="${k}">
      <span class="lr-radio"></span><span><strong>${title}</strong><span>${sub}</span></span></button>`;
    box.innerHTML = `
      <p class="le-kicker">${esc(r.partner)} · loan escalation</p>
      <h1>Update ${esc(r.title)}</h1>
      ${r.status === 'Resolved' ? '<div class="callout" style="margin-top:14px"><p>This escalation is already marked resolved. You can still add a note for the broker.</p></div>' : ''}
      ${summary}
      <div class="lr-opts">
        ${opt('working', "We're on it", 'Let the broker know it\'s being worked.')}
        ${opt('resolved', 'Resolved', 'The issue is taken care of.')}
      </div>
      <div class="field" style="margin-top:16px"><label>Note for the broker <span style="color:var(--muted);font-weight:500">(optional)</span></label>
        <textarea class="input" id="lr-note" placeholder="${choice === 'resolved' ? 'e.g. Clear to close issued this morning.' : 'e.g. Appraiser confirmed for Wednesday; expect the report Friday.'}"></textarea></div>
      <button class="btn btn-primary btn-block" id="lr-submit">${choice === 'resolved' ? 'Mark resolved' : "Send “We're on it”"}</button>`;
    box.querySelectorAll('[data-choice]').forEach((b) => b.addEventListener('click', () => {
      const note = $('lr-note').value; choice = b.dataset.choice; renderRespond(); $('lr-note').value = note;
    }));
    $('lr-submit').addEventListener('click', () => {
      S.lenderAction(r.id, choice, $('lr-note').value);
      sent = choice; renderRespond();
    });
  }

  if (document.body.dataset.page === 'email') { renderEmail(); S.onChange(renderEmail); }
  else renderRespond();
})();
