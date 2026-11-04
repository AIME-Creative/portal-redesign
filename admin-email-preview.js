/* ============================================================
   AMP Admin — shared email preview lightbox
   ------------------------------------------------------------
   One look for every email preview in admin, modeled on
   Communications → Email history:
     • a modal with the subject as title, recipients + date below
     • From / other details as label–value rows
     • the email itself in a sandboxed iframe, built from one
       branded template (navy AMP header, pink buttons)
     • an optional note + primary action (e.g. Resend) in the foot
   Used by Email history (admin-emails.js), Loan referrals
   (admin-referrals.js), and Requests (admin-requests.js).
   Uses admin.js globals: openModal, closeModals.
   ============================================================ */
(function () {
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const FROM = 'AIME Group &lt;noreply@notifications.aimegroup.com&gt;';

  // The email body. paragraphs / block / foot are trusted HTML; rows are [label, html] pairs.
  function doc({ paragraphs = [], rows = [], block = '', ctas = [], signoff = true, foot = '' }) {
    const table = rows.filter(([, v]) => v).length
      ? `<table>${rows.filter(([, v]) => v).map(([k, v]) => `<tr><td class="k">${k}</td><td>${v}</td></tr>`).join('')}</table>` : '';
    return `<!doctype html><html><head><meta charset="utf-8"><style>
      body{margin:0;background:#f5f7fb;font-family:'Hanken Grotesk',Arial,sans-serif;color:#1d2433}
      .wrap{max-width:520px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e3e8f2}
      .top{background:#021649;padding:18px 26px;color:#fff;font-weight:800;letter-spacing:.06em}
      .top span{color:#20adce}
      .in{padding:26px} p{font-size:15px;line-height:1.55;margin:0 0 14px}
      table{width:100%;border-collapse:collapse;font-size:14px;margin:4px 0 16px} td{padding:8px 0;border-bottom:1px solid #eef1f7;vertical-align:top}
      td.k{color:#6b7590;width:140px;font-weight:600;padding-right:12px}
      .det{background:#f5f7fb;border-radius:10px;padding:12px 14px;font-size:14px;line-height:1.5;margin:0 0 16px}
      .btn{display:inline-block;background:#dd1969;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px;margin:6px 8px 16px 0}
      .btn.alt{background:#021649}
      .foot{font-size:12.5px;color:#6b7590;border-top:1px solid #eef1f7;padding:16px 26px}
    </style></head><body><div class="wrap"><div class="top">AMP <span>·</span> AIME Member Portal</div><div class="in">
      ${paragraphs.map((p) => `<p>${p}</p>`).join('')}${table}${block}
      ${ctas.map((c, i) => `<a class="btn ${i ? 'alt' : ''}" href="#">${c}</a>`).join('')}
      ${signoff ? '<p style="font-size:13px;color:#6b7590">— The AIME Membership Team</p>' : ''}</div>
      <div class="foot">${foot ? foot + '<br>' : ''}AIME · aimegroup.com</div></div></body></html>`;
  }

  // The lightbox. meta: [label, html] rows. html: the email document (omit + set gone for an expired one).
  let onPrimary = null;
  function open({ title, sub = '', meta = [], html = '', gone = '', note = '', primary = null }) {
    const $ = (id) => document.getElementById(id);
    $('em-m-title').textContent = title;
    $('em-m-sub').innerHTML = sub;
    const kv = (k, v) => `<div class="rq-kv"><span class="k">${k}</span><span class="v">${v}</span></div>`;
    $('em-m-body').innerHTML = `<div class="em-meta">${[['From', FROM], ...meta].map(([k, v]) => kv(k, v)).join('')}</div>
      ${gone ? `<div class="em-gone">${gone}</div>` : `<iframe class="em-frame" title="Email preview" sandbox="" srcdoc="${esc(html)}"></iframe>`}`;
    $('em-m-note').textContent = note;
    const btn = $('em-m-primary');
    btn.hidden = !primary;
    if (primary) { btn.textContent = primary.label || 'Resend'; btn.disabled = !!primary.disabled; }
    onPrimary = primary && primary.onClick;
    openModal('email');
  }

  document.addEventListener('click', (ev) => {
    if (ev.target.closest('#em-m-primary')) { ev.preventDefault(); if (onPrimary) onPrimary(); }
  });

  window.AmpEmailPreview = { doc, open, esc, FROM };
})();
