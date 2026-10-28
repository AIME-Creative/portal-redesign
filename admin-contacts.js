/* ============================================================
   AMP Admin — request contacts on a lender / vendor listing
   ------------------------------------------------------------
   Content → Lenders / Market → Edit. Who each request type is
   emailed to:
   - Lenders: Escalations, Connections, Change AE.
   - Vendors (per company): Connections — the only request members
     send a vendor.
   Each type is a list: add as many people as needed, every one of
   them gets the email. At least one contact per type is required.
   Often the same people handle everything, so lenders start with
   "Same contacts for all three" — one list; untick it to give each
   type its own list.
   Name is optional (a shared inbox needs none); email is required.
   Saved through partner-store.js (AmpPartners.setContacts). Read by
   the escalation email, the admin request detail, and partner users'
   "Sent to".
   Uses admin.js globals: showToast. Loaded after partner-store.js.
   ============================================================ */
(function () {
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  const SECTIONS = {
    same: { title: 'Escalations, connections & Change AE', lender: 'Gets every escalation, connection request, and Change AE request for this lender.' },
    escalation: { title: 'Escalations', lender: 'Gets each escalation email and its reminders. Any of them can reply or click a status button — no login.' },
    connection: { title: 'Connections', lender: 'Gets each request from a member to be connected with this lender.', vendor: 'Gets each connection request members send for this company\'s products.' },
    changeae: { title: 'Change AE', lender: 'Gets each request from a member for a new account executive.' },
  };
  let ed = null;   // { company, kind, same, lists: { type: [{name,email}] }, errors: { type: { rows:Set, msg } } }

  const blank = () => ({ name: '', email: '' });
  const key = (l) => JSON.stringify(l.map((x) => [x.name.trim(), x.email.trim().toLowerCase()]));
  const types = () => (ed.kind === 'vendor' ? ['connection'] : ed.same ? ['same'] : ['escalation', 'connection', 'changeae']);

  function html(company, kind, isNew) {
    const P = window.AmpPartners;
    const c = P && !isNew && company ? P.contacts(company, kind) : null;
    const lists = kind === 'vendor'
      ? { connection: c ? c.connection : [blank()] }
      : { escalation: c ? c.escalation : [blank()], connection: c ? c.connection : [blank()], changeae: c ? c.changeae : [blank()] };
    const same = kind === 'lender' && key(lists.escalation) === key(lists.connection) && key(lists.escalation) === key(lists.changeae);
    if (same) lists.same = lists.escalation.slice();
    ed = { company, kind, same, lists, errors: {} };
    return `<div id="ce-root">${markup()}</div>`;
  }

  function markup() {
    const sameBox = ed.kind === 'lender' ? `<label class="ce-same"><input type="checkbox" data-ce-same ${ed.same ? 'checked' : ''}>
      <span>Same contacts for escalations, connections, and Change AE</span></label>` : '';
    return sameBox + types().map((t) => {
      const list = ed.lists[t], err = ed.errors[t] || {};
      return `<div class="ce-sec${err.msg ? ' has-err' : ''}" data-ce-sec="${t}">
        <div class="ce-head"><strong>${SECTIONS[t].title}</strong><span class="ce-req">At least 1 required</span></div>
        <p class="ce-desc">${SECTIONS[t][ed.kind]}</p>
        ${list.map((x, i) => `<div class="ce-row${err.rows && err.rows.has(i) ? ' bad' : ''}">
          <input class="input ce-name" placeholder="Name (optional)" value="${esc(x.name)}" data-ce="${t}" data-i="${i}" data-f="name" aria-label="Contact name">
          <input class="input ce-email" type="email" placeholder="${ed.kind === 'vendor' ? 'name@company.com' : 'name@lender.com'}" value="${esc(x.email)}" data-ce="${t}" data-i="${i}" data-f="email" aria-label="Contact email">
          <button type="button" class="ce-remove" data-ce-remove="${t}:${i}" aria-label="Remove contact" ${list.length < 2 ? 'disabled title="At least one contact is required"' : ''}>${X}</button>
        </div>`).join('')}
        ${err.msg ? `<div class="ce-err">${err.msg}</div>` : ''}
        <button type="button" class="link-pink ce-add" data-ce-add="${t}">+ Add contact</button>
      </div>`;
    }).join('') + `<p class="hint" style="margin:0 0 14px">Every contact gets the email. ${ed.kind === 'lender' ? 'Lender' : 'Vendor'} partner users see them as "Sent to" on each request.</p>`;
  }
  const render = () => { const root = document.getElementById('ce-root'); if (root) root.innerHTML = markup(); };

  /* ---------- validation + save ---------- */
  function validate() {
    ed.errors = {}; let ok = true;
    types().forEach((t) => {
      const rows = new Set(); let good = 0;
      ed.lists[t].forEach((x, i) => {
        const n = x.name.trim(), e = x.email.trim();
        if (!n && !e) return;
        if (EMAIL.test(e)) good++; else rows.add(i);
      });
      const msg = rows.size ? 'Enter a valid email for each contact.' : !good ? 'Add at least one contact with an email.' : '';
      if (msg) { ed.errors[t] = { rows, msg }; ok = false; }
    });
    return ok;
  }
  const clean = (list) => {
    const seen = new Set();
    return list.map((x) => ({ name: x.name.trim(), email: x.email.trim() })).filter((x) => x.email && !seen.has(x.email.toLowerCase()) && seen.add(x.email.toLowerCase()));
  };
  function companyName() {
    // Lender: the Lender name field. Vendor: the Company field (falls back to the product name).
    const val = (label) => { const f = [...document.querySelectorAll('#edit-body .field')].find((x) => x.querySelector('label') && x.querySelector('label').textContent.trim() === label);
      return f && f.querySelector('input') ? f.querySelector('input').value.trim() : ''; };
    return ed.kind === 'lender' ? val('Lender name') || ed.company : val('Company') || val('Product name') || ed.company;
  }

  // Save runs before admin.js's own data-toast / data-close handling, and stops it when something's missing.
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#edit-save') || !ed || !document.getElementById('ce-root')) return;
    if (!validate()) {
      e.preventDefault(); e.stopImmediatePropagation();
      render();
      const bad = document.querySelector('#ce-root .ce-sec.has-err');
      if (bad) bad.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    const company = companyName();
    if (window.AmpPartners && company) {
      const L = (t) => clean(ed.lists[t]);
      AmpPartners.setContacts(company, ed.kind === 'vendor' ? { connection: L('connection') }
        : ed.same ? { escalation: L('same'), connection: L('same'), changeae: L('same') }
        : { escalation: L('escalation'), connection: L('connection'), changeae: L('changeae') });
    }
    ed = null;
  }, true);

  /* ---------- editing ---------- */
  document.addEventListener('input', (e) => {
    const f = e.target.closest('[data-ce]'); if (!f || !ed) return;
    ed.lists[f.dataset.ce][+f.dataset.i][f.dataset.f] = f.value;
    const row = f.closest('.ce-row'); if (row) row.classList.remove('bad');
  });
  document.addEventListener('change', (e) => {
    if (!e.target.matches('[data-ce-same]') || !ed) return;
    ed.same = e.target.checked;
    if (ed.same) ed.lists.same = ed.lists.escalation.map((x) => Object.assign({}, x));
    else ['escalation', 'connection', 'changeae'].forEach((t) => { ed.lists[t] = ed.lists.same.map((x) => Object.assign({}, x)); });
    ed.errors = {}; render();
  });
  document.addEventListener('click', (e) => {
    if (!ed) return;
    const add = e.target.closest('[data-ce-add]');
    if (add) {
      e.preventDefault(); ed.lists[add.dataset.ceAdd].push(blank()); render();
      const inputs = document.querySelectorAll(`#ce-root [data-ce="${add.dataset.ceAdd}"][data-f="name"]`);
      if (inputs.length) inputs[inputs.length - 1].focus();
      return;
    }
    const rm = e.target.closest('[data-ce-remove]');
    if (rm) {
      e.preventDefault();
      const [t, i] = rm.dataset.ceRemove.split(':');
      if (ed.lists[t].length > 1) { ed.lists[t].splice(+i, 1); delete ed.errors[t]; render(); }
    }
  });

  window.AmpContactsEditor = { html };
})();
