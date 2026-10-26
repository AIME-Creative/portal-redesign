/* ============================================================
   AMP Admin — Partner users (lender & vendor accounts)
   ------------------------------------------------------------
   Sidebar → Partner users. Admins create every partner account
   (no self-signup; free — never a paid membership): First, Last, Email, Phone,
   Lender / Vendor, and Company. The company list is Active
   lenders, or Active vendor companies (products grouped by
   their Company field). The new user gets an invite email to
   set a password. Row actions: Edit, Resend invite, Deactivate /
   Reactivate. Many users per company, all with identical access
   (no per-user permissions). Escalation and "Sent to" contacts live on the
   lender / vendor listing, not here.
   Data: partner-store.js (AmpPartners, shared with the member app).
   Uses admin.js globals: lenders, vendors, navigate, openModal,
   closeModals, showToast, initials.
   ============================================================ */
(function () {
  const P = window.AmpPartners;
  if (!P || !document.getElementById('view-partners')) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let editId = null;

  /* Active companies for each partner type. Vendors pick the company, not a product. */
  function companies(type) {
    if (type === 'Lender') return lenders.filter((l) => l.status === 'Active').map((l) => ({ name: l.name, note: '' }));
    const map = {};
    vendors.filter((v) => v.status === 'Active').forEach((v) => { const c = P.companyOf(v.name); (map[c] = map[c] || []).push(v.name); });
    return Object.keys(map).sort().map((c) => ({ name: c, note: map[c].length > 1 ? ` (${map[c].length} products)` : '' }));
  }

  function render() {
    const q = ($('pu-q').value || '').toLowerCase(), type = $('pu-type').value, st = $('pu-status').value;
    const all = P.users();
    const rows = all.filter((u) => (type === 'all' || u.type === type) && (st === 'all' || u.status === st) &&
      (!q || `${u.first} ${u.last} ${u.email} ${u.company}`.toLowerCase().includes(q)));
    $('pu-tbody').innerHTML = rows.map((u) => {
      const name = `${u.first} ${u.last}`;
      return `<tr>
        <td><div class="t-id"><div class="t-avatar">${initials(name)}</div><div><div class="t-strong">${esc(name)}</div><div class="t-sub">${esc(u.email)}</div>${u.phone ? `<div class="t-sub">${esc(u.phone)}</div>` : ''}</div></div></td>
        <td><span class="badge ${u.type === 'Lender' ? 'badge-navy' : 'badge-cyan'}">${u.type}</span></td>
        <td>${esc(u.company)}</td>
        <td><span class="dot-status dot-${u.status.toLowerCase()}">${u.status}</span></td>
        <td>${esc(u.lastLogin || '—')}</td>
        <td class="t-right"><div class="row-actions pu-actions">
          <button class="link-act" data-partner-edit="${u.id}">Edit</button>
          ${u.status === 'Invited' ? `<button class="link-act" data-partner-act="resend:${u.id}">Resend invite</button>` : ''}
          ${u.status === 'Deactivated' ? `<button class="link-act" data-partner-act="reactivate:${u.id}">Reactivate</button>` : `<button class="link-act" data-partner-act="deactivate:${u.id}">Deactivate</button>`}
        </div></td>
      </tr>`;
    }).join('') || `<tr><td colspan="6" class="t-sub" style="padding:24px;text-align:center">No partner users match.</td></tr>`;
    $('pu-count').textContent = `${rows.length} of ${all.length} partner users`;
  }

  function companyOptions(type, selected) {
    return `<option value="">Select a company…</option>` + companies(type).map((c) =>
      `<option value="${esc(c.name)}"${c.name === selected ? ' selected' : ''}>${esc(c.name)}${c.note}</option>`).join('');
  }

  function openEditor(id) {
    editId = id || null;
    const u = (id && P.users().find((x) => x.id === id)) || { first: '', last: '', email: '', phone: '', type: 'Lender', company: '' };
    $('pu-title').textContent = id ? `Edit ${u.first} ${u.last}` : 'Add partner user';
    $('pu-sub').textContent = id ? `${u.type} partner · ${u.status}` : "They'll get an email to set their password.";
    $('pu-save').textContent = id ? 'Save changes' : 'Send invite';
    const inp = (label, key, type) => `<div class="field"><label>${label}</label><input class="input" id="pu-f-${key}" type="${type || 'text'}" value="${esc(u[key])}"></div>`;
    $('pu-body').innerHTML = `
      <div class="field"><label>Partner type</label>
        <select class="select" id="pu-f-type"><option${u.type === 'Lender' ? ' selected' : ''}>Lender</option><option${u.type === 'Vendor' ? ' selected' : ''}>Vendor</option></select>
      </div>
      <div class="field-row">${inp('First name', 'first')}${inp('Last name', 'last')}</div>
      <div class="field-row">${inp('Email', 'email', 'email')}${inp('Phone', 'phone', 'tel')}</div>
      <div class="field"><label>Company</label><select class="select" id="pu-f-company">${companyOptions(u.type, u.company)}</select>
        <div class="hint" id="pu-company-hint"></div></div>
      <p class="t-sub" style="margin:6px 0 0">Partner accounts are free — never a paid membership, no tier or billing. Every user at a company has the same access: the company's dashboard and requests, and view-only Lenders &amp; Market. Who requests are sent to is set on the company's ${u.type === 'Lender' ? 'lender' : 'vendor'} listing.</p>`;
    hint();
    openModal('partner');
  }

  function hint() {
    const type = $('pu-f-type').value;
    $('pu-company-hint').textContent = type === 'Lender'
      ? 'Active lenders only. Everyone at the company sees the same dashboard and requests.'
      : 'Active vendor companies only. Products with the same Company (on the vendor listing) roll up together.';
  }

  function save() {
    const v = (k) => ($('pu-f-' + k).value || '').trim();
    const data = { type: v('type'), first: v('first'), last: v('last'), email: v('email'), phone: v('phone'), company: v('company') };
    if (!data.first || !data.last || !/^\S+@\S+\.\S+$/.test(data.email) || !data.company) {
      showToast('Add a first and last name, a valid email, and a company.'); return;
    }
    if (editId) { P.updateUser(editId, data); showToast(`Saved ${data.first} ${data.last}.`); }
    else { P.addUser(data); showToast(`Invite sent to ${data.email}.`); }
    closeModals(); render();
  }

  function act(action, id) {
    const u = P.users().find((x) => x.id === id); if (!u) return;
    const name = `${u.first} ${u.last}`;
    if (action === 'resend') showToast(`Invite re-sent to ${u.email}.`);
    if (action === 'deactivate') { P.updateUser(id, { status: 'Deactivated' }); showToast(`${name} can no longer sign in.`); }
    if (action === 'reactivate') { P.updateUser(id, { status: u.lastLogin && u.lastLogin !== '—' ? 'Active' : 'Invited' }); showToast(`${name} reactivated.`); }
    render();
  }

  document.addEventListener('click', (e) => {
    const ed = e.target.closest('[data-partner-edit]');
    if (ed) { e.preventDefault(); openEditor(ed.dataset.partnerEdit); return; }
    const a = e.target.closest('[data-partner-act]');
    if (a) { e.preventDefault(); const [action, id] = a.dataset.partnerAct.split(':'); act(action, id); return; }
    if (e.target.closest('#pu-save')) { e.preventDefault(); save(); }
  });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'pu-f-type') { $('pu-f-company').innerHTML = companyOptions(e.target.value, ''); hint(); }
  });
  ['pu-q', 'pu-type', 'pu-status'].forEach((id) => $(id).addEventListener(id === 'pu-q' ? 'input' : 'change', render));

  window.AmpAdminPartners = { render, openEditor };
  render();
})();
