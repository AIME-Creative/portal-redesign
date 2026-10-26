/* ============================================================
   AMP Admin — Group memberships + Enterprise partners
   ------------------------------------------------------------
   Both already exist in the live portal; this is the redesign.

   Group memberships (sidebar → Members → Group memberships):
     someone buys several memberships for other people. Admins
     assign each membership to a person, transfer it to someone
     else, or unassign it. Admin only — not self-serve.

   Enterprise (sidebar → Members → Enterprise):
     a company buys an enterprise agreement: a roster of members
     on a base tier (usually Premium, thousands of people), plus
     designee VIP / Elite seats, FUSE tickets, Ascent seats, and
     podcast appearances. Seats are granted and reassigned as
     needed. Partner page tabs: Overview · Roster · Tickets ·
     Members · Assign VIP/Elite · Podcast. Edit holds the
     agreement (negotiated price is managed in billing).

   Group and enterprise members also appear on the main Members
   list with a Group / Enterprise tag.
   Prototype: sample data, in memory (resets on reload).
   Uses admin.js globals: members, navigate, openModal, closeModals,
   showToast, initials, renderMembers, fillMemberFilters.
   ============================================================ */
(function () {
  const $ = (id) => document.getElementById(id);
  if (!$('view-groups')) return;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (n) => Number(n || 0).toLocaleString('en-US');
  const tierBadge = (t) => `<span class="badge ${t === 'VIP' ? 'badge-navy' : t === 'Elite' ? 'badge-pink' : 'badge-cyan'}">${t}</span>`;
  const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const ICO = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>',
    ban: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><circle cx="12" cy="12" r="10"/><path d="M4.9 4.9l14.2 14.2"/></svg>',
  };

  /* ============================================================
     Generic form modal
     ============================================================ */
  let onSave = null;
  function form(title, sub, body, save, saveLabel) {
    $('ms-title').textContent = title; $('ms-sub').textContent = sub || '';
    $('ms-body').innerHTML = body; $('ms-save').textContent = saveLabel || 'Save'; $('ms-save').style.display = '';
    onSave = save; openModal('mship');
    const first = $('ms-body').querySelector('input:not([type=checkbox]),select'); if (first) setTimeout(() => first.focus(), 50);
  }
  const fld = (label, id, value, attrs) => `<div class="field"><label>${label}</label><input class="input" id="${id}" value="${esc(value)}" ${attrs || ''}></div>`;
  const sel = (label, id, opts, value) => `<div class="field"><label>${label}</label><select class="select" id="${id}">${opts.map((o) => `<option${o === value ? ' selected' : ''}>${o}</option>`).join('')}</select></div>`;
  const val = (id) => ($(id).value || '').trim();
  const validEmail = (e) => /^\S+@\S+\.\S+$/.test(e);

  /* ============================================================
     GROUP MEMBERSHIPS
     ============================================================ */
  const P = (name, email, status, since) => ({ name, email, status: status || 'Active', since: since || 'Mar 4, 2026' });
  const groups = [
    { id: 'G-201', buyer: { name: 'Maria Chen', email: 'maria.chen@brightpathmtg.com' }, company: 'Brightpath Mortgage', tier: 'Elite', billing: 'Annual', price: '$3,495/yr', status: 'Active', purchased: 'Mar 3, 2026', renews: 'Mar 3, 2027',
      seats: [P('Priya Shah', 'priya@brightpathmtg.com'), P('Devon Hart', 'devon@brightpathmtg.com'), P('Lena Ortiz', 'lena@brightpathmtg.com', 'Invited', 'Oct 20, 2026'), P('Marcus Webb', 'marcus@brightpathmtg.com'), null],
      log: [{ at: 'Oct 20, 2026', text: 'Transferred from Sam Patel to Lena Ortiz' }, { at: 'Mar 4, 2026', text: '4 of 5 memberships assigned' }] },
    { id: 'G-202', buyer: { name: 'Darnell Ross', email: 'dross@summitlending.com' }, company: 'Summit Lending', tier: 'Premium', billing: 'Monthly', price: '$59.97/mo', status: 'Active', purchased: 'Jun 21, 2026', renews: 'Nov 21, 2026',
      seats: [P('Jordan Ross', 'jordan@summitlending.com', 'Active', 'Jun 21, 2026'), P('Kayla Brooks', 'kayla@summitlending.com', 'Active', 'Jun 22, 2026'), P('Omar Haddad', 'omar@summitlending.com', 'Active', 'Jun 22, 2026')],
      log: [{ at: 'Jun 22, 2026', text: 'All 3 memberships assigned' }] },
    { id: 'G-203', buyer: { name: 'Alicia Gomez', email: 'alicia.gomez@lendwell.com' }, company: 'LendWell', tier: 'VIP', billing: 'Annual', price: '$3,398/yr', status: 'Active', purchased: 'Jun 14, 2026', renews: 'Jun 14, 2027',
      seats: [P('Mateo Gomez', 'mateo@lendwell.com', 'Active', 'Jun 14, 2026'), P('Ben Gomez', 'ben@lendwell.com', 'Active', 'Jun 15, 2026')],
      log: [{ at: 'Jun 15, 2026', text: 'All 2 memberships assigned' }] },
    { id: 'G-204', buyer: { name: 'Janet Park', email: 'jpark@parklending.com' }, company: 'Park Lending', tier: 'Premium', billing: 'Annual', price: '$1,990/yr', status: 'Active', purchased: 'Jun 9, 2026', renews: 'Jun 9, 2027',
      seats: [P('Grace Park', 'grace@parklending.com', 'Active', 'Jun 9, 2026'), P('Chris Yu', 'chris@parklending.com', 'Active', 'Jun 10, 2026'), P('Tasha Reid', 'tasha@parklending.com', 'Active', 'Jun 10, 2026'), P('Victor Lin', 'victor@parklending.com', 'Invited', 'Oct 24, 2026'), P('Hannah Moss', 'hannah@parklending.com', 'Active', 'Jun 12, 2026'), P('Luis Ramos', 'luis@parklending.com', 'Active', 'Jun 12, 2026'), null, null, null, null],
      log: [{ at: 'Oct 24, 2026', text: 'Assigned to Victor Lin' }, { at: 'Jun 12, 2026', text: '5 of 10 memberships assigned' }] },
  ];
  const used = (g) => g.seats.filter(Boolean).length;
  const bar = (a, b) => `<div class="ms-bar"><i style="width:${b ? Math.round((a / b) * 100) : 0}%"></i></div>`;
  const statusPill = (s) => `<span class="dot-status dot-${s.toLowerCase()}">${s}</span>`;

  function renderGroups() {
    const q = ($('grp-q') && $('grp-q').value || '').toLowerCase();
    const rows = groups.filter((g) => !q || `${g.buyer.name} ${g.buyer.email} ${g.company}`.toLowerCase().includes(q));
    const total = groups.reduce((a, g) => a + g.seats.length, 0), assigned = groups.reduce((a, g) => a + used(g), 0);
    const tile = (cls, val, lbl) => `<div class="stat"><div class="s-ico ${cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div class="s-val">${val}</div><div class="s-lbl">${lbl}</div></div>`;
    $('grp-list').innerHTML = `
      <div class="adm-section-head">
        <div class="page-head" style="margin:0"><h1>Group memberships</h1><p>One person buys several memberships for other people. Assign each membership to someone, or transfer it to someone else. Admin only — buyers can't move memberships themselves.</p></div>
        <button class="btn btn-primary" data-grp-edit="">+ Add group</button>
      </div>
      <div class="stat-row admin4" style="margin-bottom:20px">
        ${tile('i-navy', groups.length, 'Groups')}${tile('i-cyan', total, 'Memberships bought')}${tile('i-green', assigned, 'Assigned')}${tile('i-pink', total - assigned, 'Not assigned yet')}
      </div>
      <div class="toolbar">
        <div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg><input type="text" id="grp-q" placeholder="Search by buyer or company…" value="${esc(q)}"></div>
        <span class="spacer"></span><span class="count-note">${rows.length} of ${groups.length} groups</span>
      </div>
      <div class="table-wrap"><div class="table-scroll"><table class="adm ms-click">
        <thead><tr><th>Bought by</th><th>Tier</th><th>Memberships</th><th>Billing</th><th>Status</th><th class="t-right">Actions</th></tr></thead>
        <tbody>${rows.map((g) => `<tr data-grp-open="${g.id}">
          <td><div class="t-id"><div class="t-avatar">${initials(g.buyer.name)}</div><div><div class="t-strong">${esc(g.buyer.name)}</div><div class="t-sub">${esc(g.company)} · ${esc(g.buyer.email)}</div></div></div></td>
          <td>${tierBadge(g.tier)}</td>
          <td style="min-width:130px"><strong>${used(g)}</strong> of ${g.seats.length} assigned${bar(used(g), g.seats.length)}</td>
          <td style="white-space:nowrap">${g.price}<div class="t-sub">Renews ${g.renews}</div></td>
          <td>${statusPill(g.status)}</td>
          <td class="t-right"><div class="row-actions"><button class="link-act" data-grp-open="${g.id}">Manage</button></div></td>
        </tr>`).join('') || '<tr><td colspan="6" class="t-sub" style="padding:24px;text-align:center">No groups match.</td></tr>'}</tbody>
      </table></div></div>`;
  }

  let curGroup = null;
  function renderGroup() {
    const g = groups.find((x) => x.id === curGroup); if (!g) return;
    $('grp-detail').innerHTML = `
      <a href="#" class="back-link" data-nav="groups">${ICO.back} All group memberships</a>
      <div class="adm-section-head" style="margin-top:6px">
        <div class="page-head" style="margin:0"><h1>${esc(g.company)} ${tierBadge(g.tier)}</h1>
          <p>${g.seats.length} ${g.tier} memberships · bought by ${esc(g.buyer.name)} (${esc(g.buyer.email)}) · ${g.price} · renews ${g.renews}</p></div>
        <button class="btn btn-outline" data-grp-edit="${g.id}">${ICO.edit} Edit</button>
      </div>
      <div class="grid ms-grid" style="grid-template-columns:1.8fr 1fr;align-items:start;gap:20px">
        <div class="card"><div class="card-pad" style="padding-bottom:6px"><div class="section-title"><h2 style="font-size:16px">Memberships</h2><span class="count-note">${used(g)} of ${g.seats.length} assigned</span></div></div>
          <div class="table-scroll"><table class="adm">
            <thead><tr><th>#</th><th>Member</th><th>Status</th><th>Since</th><th class="t-right">Actions</th></tr></thead>
            <tbody>${g.seats.map((s, i) => `<tr>
              <td class="t-sub">${i + 1}</td>
              <td>${s ? `<div class="t-strong">${esc(s.name)}</div><div class="t-sub">${esc(s.email)}</div>` : '<span class="t-sub">Not assigned</span>'}</td>
              <td>${s ? statusPill(s.status) : '—'}</td>
              <td style="white-space:nowrap">${s ? s.since : '—'}</td>
              <td class="t-right"><div class="row-actions stack">${s
                ? `<button class="link-act" data-grp-seat="transfer:${i}">Transfer</button><button class="link-act danger" data-grp-seat="unassign:${i}">Unassign</button>`
                : `<button class="link-act" data-grp-seat="assign:${i}">Assign</button>`}</div></td>
            </tr>`).join('')}</tbody>
          </table></div></div>
        <div>
          <div class="card card-pad"><h3 style="font-size:15px;margin-bottom:8px">How transfers work</h3>
            <p class="t-sub" style="display:block;line-height:1.55">Transferring a membership moves it to someone new: the current holder loses access, and the new holder gets an email to set up their account. The tier and billing stay with the group. Only admins can do this.</p></div>
          <div class="card card-pad" style="margin-top:20px"><h3 style="font-size:15px;margin-bottom:10px">Activity</h3>
            ${g.log.map((l) => `<div class="ms-log"><span>${esc(l.text)}</span><span class="t-sub">${l.at}</span></div>`).join('')}</div>
        </div>
      </div>`;
  }
  function openGroup(id) { curGroup = id; renderGroup(); navigate('group-detail'); }

  function editGroup(id) {
    const g = id ? groups.find((x) => x.id === id) : null;
    form(g ? `Edit ${g.company}` : 'Add group membership', g ? `${used(g)} of ${g.seats.length} assigned` : 'Memberships bought by one person for other people.', `
      <div class="field-row">${fld('Bought by — name', 'gf-name', g ? g.buyer.name : '')}${fld('Bought by — email', 'gf-email', g ? g.buyer.email : '', 'type="email"')}</div>
      ${fld('Company or group name', 'gf-company', g ? g.company : '')}
      <div class="field-row">${sel('Tier', 'gf-tier', ['Premium', 'Elite', 'VIP'], g ? g.tier : 'Premium')}${fld('Number of memberships', 'gf-count', g ? g.seats.length : 3, 'type="number" min="2"')}</div>
      <p class="t-sub" style="display:block">Price and billing are handled in Stripe at checkout. ${g ? `You can't go below the ${used(g)} memberships already assigned.` : 'Assign each membership after saving.'}</p>`,
    () => {
      const name = val('gf-name'), email = val('gf-email'), company = val('gf-company') || name, tier = val('gf-tier'), n = parseInt(val('gf-count'), 10);
      if (!name || !validEmail(email) || !(n >= 2)) { showToast('Add the buyer, a valid email, and at least 2 memberships.'); return; }
      if (g) {
        if (n < used(g)) { showToast(`${used(g)} memberships are assigned — unassign some first.`); return; }
        const seats = g.seats.filter(Boolean); while (seats.length < n) seats.push(null);
        Object.assign(g, { buyer: { name, email }, company, tier, seats }); g.log.unshift({ at: today(), text: `Updated: ${n} ${tier} memberships` });
        showToast('Group updated.'); closeModals(); renderGroup(); renderGroups();
      } else {
        const ng = { id: 'G-' + (200 + groups.length + 1), buyer: { name, email }, company, tier, billing: 'Annual', price: 'Billed in Stripe', status: 'Active', purchased: today(), renews: '—', seats: Array(n).fill(null), log: [{ at: today(), text: `Created with ${n} ${tier} memberships` }] };
        groups.unshift(ng); closeModals(); renderGroups(); showToast(`Added ${company}. Assign each membership next.`); openGroup(ng.id);
      }
    }, g ? 'Save changes' : 'Add group');
  }

  function seatAction(action, i) {
    const g = groups.find((x) => x.id === curGroup); if (!g) return;
    const s = g.seats[i];
    if (action === 'unassign') {
      if (!window.confirm(`Unassign ${s.name}? They'll lose this ${g.tier} membership, and it becomes available to assign.`)) return;
      g.seats[i] = null; g.log.unshift({ at: today(), text: `Unassigned ${s.name}` }); syncGroupMembers(); renderGroup(); showToast(`Unassigned ${s.name}.`); return;
    }
    const transfer = action === 'transfer';
    form(transfer ? `Transfer ${s.name}'s membership` : 'Assign this membership', transfer ? `${s.name} will lose access; the new member gets an email to set up their account.` : `${g.tier} membership ${i + 1} of ${g.seats.length} · ${g.company}`, `
      <div class="field-row">${fld('Name', 'gs-name', '')}${fld('Email', 'gs-email', '', 'type="email"')}</div>
      <label class="pwa-check" style="margin-top:4px"><input type="checkbox" id="gs-invite" checked> Email them an invite to set up their account</label>`,
    () => {
      const name = val('gs-name'), email = val('gs-email');
      if (!name || !validEmail(email)) { showToast('Add a name and a valid email.'); return; }
      if (g.seats.some((x) => x && x.email.toLowerCase() === email.toLowerCase())) { showToast(`${email} already has a membership in this group.`); return; }
      g.seats[i] = { name, email, status: 'Invited', since: today() };
      g.log.unshift({ at: today(), text: transfer ? `Transferred from ${s.name} to ${name}` : `Assigned to ${name}` });
      closeModals(); syncGroupMembers(); renderGroup(); renderGroups();
      showToast(transfer ? `Transferred to ${name}. ${s.name} no longer has access.` : `Assigned to ${name}${$('gs-invite') && $('gs-invite').checked ? ' — invite sent' : ''}.`);
    }, transfer ? 'Transfer' : 'Assign');
  }

  /* ============================================================
     ENTERPRISE
     ============================================================ */
  // Deterministic sample roster (NEXA Lending, 4,030 people)
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function buildRoster(size, domain, seed) {
    const F = ['Aaron', 'Abby', 'Adam', 'Adrian', 'Alex', 'Alicia', 'Amanda', 'Amber', 'Andre', 'Angela', 'Anthony', 'Ashley', 'Ben', 'Blake', 'Brandon', 'Brian', 'Brittany', 'Caleb', 'Carla', 'Carlos', 'Chad', 'Chris', 'Cody', 'Corey', 'Dana', 'Daniel', 'Darius', 'David', 'Derek', 'Diana', 'Dylan', 'Elena', 'Eric', 'Erin', 'Ethan', 'Gabe', 'Grace', 'Greg', 'Hannah', 'Heather', 'Isaac', 'Jacob', 'Jamal', 'Jasmine', 'Jason', 'Jenna', 'Jordan', 'Josh', 'Julia', 'Justin', 'Kara', 'Kevin', 'Kim', 'Kyle', 'Laura', 'Logan', 'Lucas', 'Maria', 'Mark', 'Megan', 'Mike', 'Nadia', 'Nathan', 'Nicole', 'Omar', 'Paige', 'Paul', 'Rachel', 'Ryan', 'Sara', 'Sean', 'Tara', 'Tyler', 'Vanessa', 'Zach'];
    const L = ['Adams', 'Allen', 'Alvarez', 'Bailey', 'Baker', 'Bell', 'Blake', 'Brooks', 'Bryant', 'Carter', 'Chavez', 'Clark', 'Clowes', 'Cole', 'Collins', 'Cruz', 'Diaz', 'Dunn', 'Edwards', 'Ellis', 'Evans', 'Fisher', 'Flores', 'Ford', 'Gaines', 'Garcia', 'Gray', 'Griego', 'Hall', 'Harris', 'Hayes', 'Hill', 'Howard', 'Hughes', 'James', 'Jenkins', 'Kelly', 'Kim', 'King', 'Lee', 'Lewis', 'Long', 'Maddox', 'Mayo', 'Mendez', 'Miller', 'Moore', 'Morgan', 'Murphy', 'Myers', 'Nguyen', 'Ortiz', 'Owens', 'Parker', 'Patel', 'Perez', 'Price', 'Reed', 'Reyes', 'Rivera', 'Rochon', 'Ross', 'Russell', 'Sanders', 'Scott', 'Shaw', 'Silva', 'Stone', 'Torres', 'Turner', 'Vilardo', 'Walker', 'Ward', 'Webb', 'West', 'Wood', 'Young'];
    const r = rng(seed), out = [];
    out.push({ name: '(Michael) Mickey Salters', email: 'msalters@' + domain });
    const combos = []; F.forEach((f) => L.forEach((l) => combos.push([f, l])));     // every first × last pairing, shuffled
    for (let i = combos.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [combos[i], combos[j]] = [combos[j], combos[i]]; }
    const taken = {};   // like a real company directory: aaron.blake, then ablake2…
    combos.slice(0, size - 1).forEach(([f, l]) => { const base = `${f[0]}${l}`.toLowerCase(); taken[base] = (taken[base] || 0) + 1;
      out.push({ name: `${f} ${l}`, email: base + (taken[base] > 1 ? taken[base] : '') + '@' + domain }); });
    out.forEach((m, i) => { m.id = 'R' + (i + 1); m.tier = 'Premium'; m.activated = false; m.retained = false; m.hadAccount = false; m.nmls = String(100000 + Math.floor(r() * 2900000)); });
    const pick = (n, filter) => { const pool = out.filter(filter || (() => true)); for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; } return pool.slice(0, n); };
    return { out, pick };
  }
  function makeNexa() {
    const { out, pick } = buildRoster(4030, 'nexalending.com', 7);
    pick(1136).forEach((m) => { m.activated = true; });
    pick(36).forEach((m) => { m.retained = true; m.email = m.email.replace('@nexalending.com', '@' + ['gmail.com', 'outlook.com', 'yahoo.com'][m.name.length % 3]); });
    pick(102, (m) => !m.retained).forEach((m) => { m.hadAccount = true; });
    pick(8, (m) => m.retained).forEach((m) => { m.tier = 'VIP'; });          // kept their own VIP
    pick(2, (m) => m.retained && m.tier === 'Premium').forEach((m) => { m.tier = 'Elite'; });
    const vipSeats = pick(5, (m) => m.activated && !m.retained);             // designee VIP seats
    vipSeats.forEach((m) => { m.tier = 'VIP'; m.seat = 'VIP'; });
    out.sort((a, b) => a.name.localeCompare(b.name));
    const ga = pick(41, (m) => m.activated), hoa = pick(9, (m) => m.activated), asc = pick(3, (m) => m.tier === 'VIP' || m.activated);
    return {
      id: 'ENT-1', name: 'NEXA Lending', status: 'active', price: '$5,000/mo', billingName: 'Jason duPont', billingEmail: 'baller@nexalending.com', baseTier: 'Premium', reset: '2027-08-01',
      vip: 5, elite: 0, fuseGA: 60, hoa: 12, fuseVIP: 0, ascent: 5, podcast: 6, extraGAPrice: 149, extraGACap: 150, upgradeOff: 25, selfInvite: false, selfTickets: false,
      roster: out, vipSeats: vipSeats.map((m) => m.id), eliteSeats: [],
      tickets: { fuseGA: ga.map((m) => m.id), hoa: hoa.map((m) => m.id), fuseVIP: [], ascent: asc.map((m) => m.id) }, extraGA: 0,
      podcastLog: [{ date: 'Sep 12, 2026', ep: 'Brokers Edge #212 — Scaling a wholesale shop', guest: 'Jason duPont' }, { date: 'Jun 3, 2026', ep: 'Mortgage Mornings — Rate-lock strategy', guest: 'Aaron Gaines' }],
      lastImport: { at: 'Aug 1, 2026', rows: 4030 },
    };
  }
  const enterprises = [makeNexa()];
  let curEnt = null, entTab = 'overview', memQ = '', memFilter = 'all', memTier = 'all', memPage = 0;
  const PAGE = 50;
  const byId = (e, id) => e.roster.find((m) => m.id === id);
  const fmtDate = (iso) => { const d = new Date(iso + 'T12:00:00'); return isNaN(d) ? iso : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
  const counts = (e) => {
    const R = e.roster, c = (f) => R.filter(f).length;
    return { total: R.length, premium: c((m) => m.tier === 'Premium'), vip: c((m) => m.tier === 'VIP'), elite: c((m) => m.tier === 'Elite'),
      activated: c((m) => m.activated), never: c((m) => !m.activated), retained: c((m) => m.retained), had: c((m) => m.hadAccount) };
  };

  function renderEnterprises() {
    $('ent-list').innerHTML = `
      <div class="adm-section-head">
        <div class="page-head" style="margin:0"><h1>Enterprise partners</h1><p>Companies that buy memberships for their whole team: a roster on a base tier, plus VIP / Elite seats, FUSE tickets, Ascent seats, and podcast appearances to grant and reassign.</p></div>
        <button class="btn btn-primary" data-ent-edit="">+ Add enterprise partner</button>
      </div>
      <div class="table-wrap"><div class="table-scroll"><table class="adm ms-click">
        <thead><tr><th>Company</th><th>Roster</th><th>VIP / Elite seats</th><th>Price</th><th>Resets</th><th>Status</th><th class="t-right">Actions</th></tr></thead>
        <tbody>${enterprises.map((e) => { const c = counts(e); return `<tr data-ent-open="${e.id}">
          <td><div class="t-strong">${esc(e.name)}</div><div class="t-sub">Billed to ${esc(e.billingEmail)}</div></td>
          <td><strong>${num(c.total)}</strong> ${tierBadge(e.baseTier)}<div class="t-sub">${num(c.activated)} activated</div></td>
          <td>${e.vipSeats.length} of ${e.vip} VIP<div class="t-sub">${e.eliteSeats.length} of ${e.elite} Elite</div></td>
          <td style="white-space:nowrap">${esc(e.price)}</td>
          <td style="white-space:nowrap">${fmtDate(e.reset)}</td>
          <td><span class="ms-status ${e.status}">${e.status}</span></td>
          <td class="t-right"><div class="row-actions"><button class="link-act" data-ent-open="${e.id}">Manage</button></div></td></tr>`; }).join('')}</tbody>
      </table></div></div>`;
  }

  const TABS = [['overview', 'Overview'], ['roster', 'Roster'], ['tickets', 'Tickets'], ['members', 'Members'], ['assign', 'Assign VIP/Elite'], ['podcast', 'Podcast']];
  function renderEnt() {
    const e = enterprises.find((x) => x.id === curEnt); if (!e) return;
    const c = counts(e);
    const head = `
      <a href="#" class="back-link" data-nav="enterprise">${ICO.back} All enterprise partners</a>
      <div class="ent-head"><h1>${esc(e.name)}</h1><span class="ms-status ${e.status}">${e.status}</span>
        <button class="btn btn-outline btn-sm" data-ent-edit="${e.id}">${ICO.edit} Edit</button>
        <button class="btn btn-outline btn-sm ${e.status === 'active' ? 'ms-danger' : ''}" data-ent-act="${e.status === 'active' ? 'deactivate' : 'reactivate'}">${ICO.ban} ${e.status === 'active' ? 'Deactivate' : 'Reactivate'}</button></div>
      <p class="ent-sub">${esc(e.price)} · billed to ${esc(e.billingEmail)}</p>
      <div class="ent-tabs" role="tablist">${TABS.map(([k, l]) => `<button class="ent-tab${k === entTab ? ' active' : ''}" data-ent-tab="${k}" role="tab">${l}</button>`).join('')}</div>`;
    const tile = (v, l, s) => `<div class="ent-tile"><div class="ent-tv">${v}</div><div class="ent-tl">${l}</div>${s ? `<div class="ent-ts">${s}</div>` : ''}</div>`;
    let body = '';
    if (entTab === 'overview') {
      const row = (k, v) => `<div class="rq-kv"><span class="k">${k}</span><span class="v">${v}</span></div>`;
      body = `<div class="ent-label">Overview</div>
        <div class="ent-tiles">${tile(num(c.total), 'Total on roster', `${num(c.premium)} Premium · ${c.vip} VIP · ${c.elite} Elite`)}${tile(num(c.activated), 'Activated', 'set password + logged in')}${tile(num(c.never), 'Never logged in')}${tile(c.retained, 'Retained own membership')}${tile(c.had, 'Had an account before onboarding')}</div>
        <div class="grid ms-grid" style="grid-template-columns:1fr 1fr;align-items:start;gap:20px;margin-top:22px">
          <div class="card card-pad"><h3 style="font-size:15px;margin-bottom:6px">Agreement</h3>
            ${row('Roster base tier', e.baseTier)}${row('VIP memberships (designee seats)', `${e.vipSeats.length} of ${e.vip} assigned`)}${row('Elite memberships (designee seats)', `${e.eliteSeats.length} of ${e.elite} assigned`)}
            ${row('FUSE GA tickets', e.fuseGA)}${row('Hall of AIME tickets', e.hoa)}${row('FUSE VIP tickets', e.fuseVIP)}${row('Ascent seats', e.ascent)}${row('Podcast appearances / yr', e.podcast)}
            ${row('Extra GA tickets', `$${e.extraGAPrice} each, up to ${e.extraGACap}`)}${row('Upgrade discount', e.upgradeOff + '% off')}${row('Annual reset', fmtDate(e.reset))}</div>
          <div class="card card-pad"><h3 style="font-size:15px;margin-bottom:6px">Owner self-service</h3>
            ${row('Owner can invite Premium (roster) members', e.selfInvite ? 'On' : 'Off')}${row('Owner can delegate FUSE tickets from the pool', e.selfTickets ? 'On' : 'Off')}
            <p class="t-sub" style="display:block;margin-top:10px;line-height:1.5">Off by default — AIME manages the roster and tickets. Turn these on in Edit when the owner should manage their own.</p>
            <h3 style="font-size:15px;margin:18px 0 6px">Billing contact</h3>${row('Name', esc(e.billingName))}${row('Email', esc(e.billingEmail))}
            <p class="t-sub" style="display:block;margin-top:10px">The negotiated price is managed at the billing level.</p></div>
        </div>`;
    } else if (entTab === 'roster') {
      body = `<div class="ent-label">Roster</div>
        <div class="card card-pad">
          <p style="margin:0 0 14px;line-height:1.55">Everyone on the roster gets <strong>${e.baseTier}</strong> through ${esc(e.name)}. New people get an email to set their password. Members who already had an AMP account keep it — and anyone who already paid for a membership can keep their own.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-primary" data-ent-act="upload">Upload roster (CSV)</button>
            <button class="btn btn-outline" data-ent-act="add-member">+ Add one person</button>
            <button class="btn btn-outline" data-ent-act="resend" style="white-space:normal;height:auto;min-height:40px">Resend invites to ${num(c.never)} who never logged in</button>
          </div>
          <p class="t-sub" style="display:block;margin-top:14px">Last import: ${e.lastImport.at} · ${num(e.lastImport.rows)} rows · CSV columns: first name, last name, email, NMLS #</p>
        </div>
        <div class="ent-tiles" style="margin-top:20px">${tile(num(c.total), 'On roster')}${tile(num(c.activated), 'Activated')}${tile(num(c.never), 'Never logged in')}</div>`;
    } else if (entTab === 'tickets') {
      const T = [['fuseGA', 'FUSE GA tickets', e.fuseGA], ['hoa', 'Hall of AIME tickets', e.hoa], ['fuseVIP', 'FUSE VIP tickets', e.fuseVIP], ['ascent', 'Ascent seats', e.ascent]];
      body = `<div class="ent-label">Tickets &amp; seats</div>
        <div class="table-wrap"><div class="table-scroll"><table class="adm">
          <thead><tr><th>Item</th><th>Included</th><th>Assigned</th><th>Available</th><th class="t-right">Actions</th></tr></thead>
          <tbody>${T.map(([k, l, n]) => { const a = e.tickets[k].length; return `<tr>
            <td class="t-strong">${l}</td><td>${n}</td><td>${a}</td><td>${Math.max(0, n - a)}</td>
            <td class="t-right"><div class="row-actions">${a ? `<button class="link-act" data-ent-tix="view:${k}">${openTix === k ? 'Hide' : 'View'}</button>` : ''}${n - a > 0 ? `<button class="link-act" data-ent-tix="assign:${k}">Assign</button>` : ''}</div></td></tr>
            ${openTix === k ? `<tr class="ms-sub"><td colspan="5">${e.tickets[k].map((id) => { const m = byId(e, id); return `<span class="ms-chip">${esc(m.name)} <button data-ent-tix="unassign:${k}:${id}" aria-label="Unassign ${esc(m.name)}">✕</button></span>`; }).join('')}</td></tr>` : ''}`; }).join('')}
            <tr><td class="t-strong">Extra GA tickets</td><td colspan="3">${e.extraGA} bought of ${e.extraGACap} allowed · $${e.extraGAPrice} each</td><td class="t-right"><button class="link-act" data-ent-act="extra-ga">Record purchase</button></td></tr>
          </tbody></table></div></div>
        <p class="flow-caption">${e.selfTickets ? 'The owner can also hand out FUSE tickets from this pool.' : 'AIME hands out these tickets. Turn on owner self-service in Edit to let the owner do it.'}</p>`;
    } else if (entTab === 'members') {
      const F = { all: () => true, activated: (m) => m.activated, never: (m) => !m.activated, retained: (m) => m.retained, had: (m) => m.hadAccount };
      const q = memQ.toLowerCase();
      const rows = e.roster.filter((m) => F[memFilter](m) && (memTier === 'all' || m.tier === memTier) && (!q || `${m.name} ${m.email} ${m.nmls}`.toLowerCase().includes(q)));
      const pages = Math.max(1, Math.ceil(rows.length / PAGE)); memPage = Math.min(memPage, pages - 1);
      const slice = rows.slice(memPage * PAGE, memPage * PAGE + PAGE);
      body = `<div class="ent-label">Members</div>
        <div class="toolbar">
          <div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg><input type="text" id="ent-q" placeholder="Search by name, email, or NMLS…" value="${esc(memQ)}"></div>
          <button class="btn btn-outline" data-ent-act="search">Search</button>
          <select class="select filter-select" id="ent-filter">${[['all', 'All members'], ['activated', 'Activated'], ['never', 'Never logged in'], ['retained', 'Retained own membership'], ['had', 'Had an account before onboarding']].map(([k, l]) => `<option value="${k}"${k === memFilter ? ' selected' : ''}>${l}</option>`).join('')}</select>
          <select class="select filter-select" id="ent-tier">${['all', 'Premium', 'Elite', 'VIP'].map((t) => `<option value="${t}"${t === memTier ? ' selected' : ''}>${t === 'all' ? 'All tiers' : t}</option>`).join('')}</select>
          <span class="spacer"></span>
          <button class="btn btn-outline" data-ent-act="csv">Download CSV</button>
        </div>
        <div class="table-wrap"><div class="table-scroll"><table class="adm">
          <thead><tr><th>Name</th><th>Email</th><th>Tier</th><th>Status</th><th>NMLS</th><th class="t-right">Action</th></tr></thead>
          <tbody>${slice.map((m) => `<tr>
            <td class="t-strong">${esc(m.name)}${m.seat ? ' <span class="mship-tag ent">VIP seat</span>' : ''}${m.retained ? ' <span class="mship-tag grp">Own membership</span>' : ''}</td>
            <td>${esc(m.email)}</td><td>${m.tier}</td>
            <td><span class="ms-act ${m.activated ? 'on' : ''}">${m.activated ? 'Activated' : 'Never logged in'}</span></td>
            <td class="rq-ref">${m.nmls}</td>
            <td class="t-right"><div class="row-actions"><button class="link-act" data-ent-mem="edit:${m.id}">Edit</button><button class="link-act danger" data-ent-mem="remove:${m.id}">Remove</button></div></td></tr>`).join('') || '<tr><td colspan="6" class="t-sub" style="padding:24px;text-align:center">No members match.</td></tr>'}</tbody>
        </table></div></div>
        <div class="ent-pager"><span class="t-sub">${rows.length ? `Showing ${num(memPage * PAGE + 1)}–${num(memPage * PAGE + slice.length)} of ${num(rows.length)}` : '0 members'}</span>
          <button class="btn btn-outline btn-sm" data-ent-page="-1" ${memPage === 0 ? 'disabled' : ''}>Previous</button><button class="btn btn-outline btn-sm" data-ent-page="1" ${memPage >= pages - 1 ? 'disabled' : ''}>Next</button></div>`;
    } else if (entTab === 'assign') {
      const seatTable = (kind, ids, total) => total ? `<div class="table-wrap" style="margin-bottom:20px"><div class="table-scroll"><table class="adm">
          <thead><tr><th>${kind} seat</th><th>Member</th><th>Status</th><th class="t-right">Actions</th></tr></thead>
          <tbody>${Array.from({ length: total }, (_, i) => { const m = ids[i] && byId(e, ids[i]); return `<tr><td class="t-sub">${i + 1}</td>
            <td>${m ? `<div class="t-strong">${esc(m.name)}</div><div class="t-sub">${esc(m.email)}</div>` : '<span class="t-sub">Not assigned</span>'}</td>
            <td>${m ? `<span class="ms-act ${m.activated ? 'on' : ''}">${m.activated ? 'Activated' : 'Never logged in'}</span>` : '—'}</td>
            <td class="t-right"><div class="row-actions">${m ? `<button class="link-act" data-ent-seat="reassign:${kind}:${i}">Reassign</button><button class="link-act danger" data-ent-seat="unassign:${kind}:${i}">Unassign</button>` : `<button class="link-act" data-ent-seat="assign:${kind}:${i}">Assign</button>`}</div></td></tr>`; }).join('')}</tbody>
        </table></div></div>` : `<div class="card card-pad" style="margin-bottom:20px"><p class="t-sub" style="display:block;margin:0">No ${kind} seats in this agreement. Change the number in Edit.</p></div>`;
      body = `<div class="ent-label">VIP memberships (${e.vipSeats.length} of ${e.vip} assigned)</div>${seatTable('VIP', e.vipSeats, e.vip)}
        <div class="ent-label">Elite memberships (${e.eliteSeats.length} of ${e.elite} assigned)</div>${seatTable('Elite', e.eliteSeats, e.elite)}
        <p class="flow-caption">A designee seat upgrades someone on the roster to VIP or Elite. Unassigning or reassigning moves them back to ${e.baseTier}. Members who kept their own VIP or Elite membership don't use a seat.</p>`;
    } else if (entTab === 'podcast') {
      const usedP = e.podcastLog.length;
      body = `<div class="ent-label">Podcast appearances</div>
        <div class="ent-tiles">${tile(e.podcast, 'Included per year')}${tile(usedP, 'Used')}${tile(Math.max(0, e.podcast - usedP), 'Left', 'resets ' + fmtDate(e.reset))}</div>
        <div class="table-wrap" style="margin-top:20px"><div class="table-scroll"><table class="adm">
          <thead><tr><th>Date</th><th>Episode</th><th>Guest</th></tr></thead>
          <tbody>${e.podcastLog.map((p) => `<tr><td style="white-space:nowrap">${esc(p.date)}</td><td>${esc(p.ep)}</td><td>${esc(p.guest)}</td></tr>`).join('') || '<tr><td colspan="3" class="t-sub" style="padding:20px;text-align:center">No appearances yet.</td></tr>'}</tbody>
        </table></div></div>
        <button class="btn btn-primary" style="margin-top:16px" data-ent-act="podcast" ${usedP >= e.podcast ? 'disabled' : ''}>+ Log appearance</button>`;
    }
    $('ent-detail').innerHTML = head + `<div class="ent-body">${body}</div>`;
  }
  let openTix = null;
  function openEnt(id, tab) { curEnt = id; entTab = tab || 'overview'; memPage = 0; renderEnt(); navigate('enterprise-detail'); }

  function editEnt(id) {
    const e = id ? enterprises.find((x) => x.id === id) : null;
    const d = e || { name: '', billingName: '', billingEmail: '', baseTier: 'Premium', reset: '', vip: 0, elite: 0, fuseGA: 0, hoa: 0, fuseVIP: 0, ascent: 0, podcast: 0, extraGAPrice: 149, extraGACap: 0, upgradeOff: 0, selfInvite: false, selfTickets: false };
    const N = [['vip', 'VIP memberships (designee seats)'], ['elite', 'Elite memberships (designee seats)'], ['fuseGA', 'FUSE GA tickets'], ['hoa', 'Hall of AIME tickets'], ['fuseVIP', 'FUSE VIP tickets'], ['ascent', 'Ascent seats'], ['podcast', 'Podcast appearances / yr'], ['extraGAPrice', 'Extra GA price ($)'], ['extraGACap', 'Extra GA cap'], ['upgradeOff', 'Upgrade % off']];
    form(e ? 'Edit Enterprise Partner' : 'Add Enterprise Partner', "The negotiated price is managed at the billing level and isn't editable here. Changing VIP/Elite membership counts adds or removes bundled designee seats (never a seat someone already holds).", `
      ${fld('Company Name *', 'ef-name', d.name)}
      <div class="field-row">${fld('Billing Contact Name', 'ef-bname', d.billingName)}${fld('Billing Contact Email', 'ef-bemail', d.billingEmail, 'type="email"')}</div>
      <div class="field-row">${sel('Roster base tier', 'ef-tier', ['Premium', 'Elite', 'VIP'], d.baseTier)}${fld('Annual reset date', 'ef-reset', d.reset, 'type="date"')}</div>
      <div class="ent-numbers">${N.map(([k, l]) => `<label class="ent-num"><span>${l}</span><input class="input" type="number" min="0" id="ef-${k}" value="${d[k]}"></label>`).join('')}</div>
      <div class="ent-self"><strong>Owner self-service</strong><p class="t-sub" style="display:block;margin:4px 0 10px">Off by default — AIME manages the roster and tickets. Turn these on per partner when the owner should manage their own.</p>
        <label class="pwa-check"><input type="checkbox" id="ef-selfInvite" ${d.selfInvite ? 'checked' : ''}> Let the owner invite Premium (roster) members</label>
        <label class="pwa-check" style="margin-top:8px"><input type="checkbox" id="ef-selfTickets" ${d.selfTickets ? 'checked' : ''}> Let the owner delegate FUSE tickets from the pool</label></div>`,
    () => {
      const name = val('ef-name'); if (!name) { showToast('Add the company name.'); return; }
      const n = (k) => Math.max(0, parseInt(val('ef-' + k), 10) || 0);
      const data = { name, billingName: val('ef-bname'), billingEmail: val('ef-bemail'), baseTier: val('ef-tier'), reset: val('ef-reset'), selfInvite: $('ef-selfInvite').checked, selfTickets: $('ef-selfTickets').checked };
      N.forEach(([k]) => { data[k] = n(k); });
      if (e) {
        if (data.vip < e.vipSeats.length || data.elite < e.eliteSeats.length) { showToast("Can't remove a seat someone already holds — unassign it first."); return; }
        Object.assign(e, data); closeModals(); renderEnt(); renderEnterprises(); showToast('Enterprise partner updated.');
      } else {
        const ne = Object.assign({ id: 'ENT-' + (enterprises.length + 1), status: 'active', price: 'Set in billing', roster: [], vipSeats: [], eliteSeats: [], tickets: { fuseGA: [], hoa: [], fuseVIP: [], ascent: [] }, extraGA: 0, podcastLog: [], lastImport: { at: '—', rows: 0 } }, data);
        enterprises.push(ne); closeModals(); renderEnterprises(); showToast(`Added ${name}. Upload their roster next.`); openEnt(ne.id, 'roster');
      }
    }, e ? 'Save changes' : 'Add partner');
  }

  // Choose someone on the roster (for seats and tickets)
  function pickMember(e, title, sub, filter, done) {
    form(title, sub, `${fld('Search the roster', 'pk-q', '', 'placeholder="Name, email, or NMLS…" autocomplete="off"')}<div id="pk-list" class="ms-pick"></div>`, null, 'Close');
    $('ms-save').style.display = 'none';
    const draw = () => {
      const q = val('pk-q').toLowerCase();
      const list = e.roster.filter((m) => filter(m) && (!q || `${m.name} ${m.email} ${m.nmls}`.toLowerCase().includes(q))).slice(0, 8);
      $('pk-list').innerHTML = list.map((m) => `<button class="ms-pick-row" data-pick="${m.id}"><span><strong>${esc(m.name)}</strong><span class="t-sub" style="display:block">${esc(m.email)} · ${m.tier}</span></span><span class="link-act">Choose</span></button>`).join('') || '<p class="t-sub" style="display:block">No one matches.</p>';
    };
    $('pk-q').addEventListener('input', draw); draw();
    pickDone = (id) => { $('ms-save').style.display = ''; closeModals(); done(byId(e, id)); };
  }
  let pickDone = null;

  function seatOp(action, kind, i) {
    const e = enterprises.find((x) => x.id === curEnt); const key = kind === 'VIP' ? 'vipSeats' : 'eliteSeats';
    const cur = e[key][i] && byId(e, e[key][i]);
    const release = (m) => { if (m) { m.tier = m.retained ? m.tier : e.baseTier; delete m.seat; } };
    if (action === 'unassign') {
      if (!window.confirm(`Unassign ${cur.name}? They go back to ${e.baseTier}.`)) return;
      release(cur); e[key][i] = null; e[key] = e[key].filter(Boolean); renderEnt(); renderEnterprises(); showToast(`${cur.name} is back on ${e.baseTier}.`); return;
    }
    pickMember(e, action === 'reassign' ? `Reassign ${cur.name}'s ${kind} seat` : `Assign a ${kind} seat`, `${cur ? cur.name + ' goes back to ' + e.baseTier + '. ' : ''}Choose someone on the ${e.name} roster.`,
      (m) => !m.seat && !m.retained && m.tier === e.baseTier, (m) => {
        release(cur); m.tier = kind; m.seat = kind;
        if (cur) e[key][i] = m.id; else e[key].push(m.id);
        renderEnt(); renderEnterprises(); showToast(`${m.name} now has a ${kind} seat${cur ? ` (moved from ${cur.name})` : ''}.`);
      });
  }

  /* ============================================================
     Main Members list: Group / Enterprise tags
     ============================================================ */
  function syncGroupMembers() {
    for (let k = members.length - 1; k >= 0; k--) if (members[k].membership === 'Group' && members[k].synced) members.splice(k, 1);
    groups.forEach((g) => g.seats.forEach((s) => {
      if (!s) return;
      const existing = members.find((m) => m.email.toLowerCase() === s.email.toLowerCase());
      if (existing) return;   // already a member in their own right — keep their individual record
      members.push({ name: s.name, email: s.email, plan: g.tier, billing: '—', role: 'Loan Officer', state: '—', licensed: [], used: 0, status: 'Active', joined: s.since, membership: 'Group', org: 'Group · ' + g.company, synced: true });
    }));
    if (typeof renderMembers === 'function') renderMembers();
  }
  function tagEnterpriseMembers() {
    const e = enterprises[0];
    e.roster.filter((m) => m.activated).slice(0, 4).concat(e.roster.filter((m) => m.seat === 'VIP').slice(0, 1)).forEach((m) => {
      members.push({ name: m.name, email: m.email, plan: m.tier, billing: '—', role: 'Loan Officer', state: 'TX', licensed: ['TX'], used: 0, status: 'Active', joined: 'Aug 1, 2026', membership: 'Enterprise', org: 'Enterprise · ' + e.name, nmls: m.nmls });
    });
  }

  /* ============================================================
     Events
     ============================================================ */
  document.addEventListener('click', (ev) => {
    const t = ev.target, g = (sel) => t.closest(sel);
    let b;
    if ((b = g('[data-pick]'))) { ev.preventDefault(); if (pickDone) pickDone(b.dataset.pick); return; }
    if (g('#ms-save')) { ev.preventDefault(); if (onSave) onSave(); return; }
    if ((b = g('[data-grp-edit]'))) { ev.preventDefault(); editGroup(b.dataset.grpEdit); return; }
    if ((b = g('[data-grp-seat]'))) { ev.preventDefault(); const [a, i] = b.dataset.grpSeat.split(':'); seatAction(a, +i); return; }
    if ((b = g('[data-grp-open]'))) { ev.preventDefault(); openGroup(b.dataset.grpOpen); return; }
    if ((b = g('[data-ent-edit]'))) { ev.preventDefault(); editEnt(b.dataset.entEdit); return; }
    if ((b = g('[data-ent-tab]'))) { ev.preventDefault(); entTab = b.dataset.entTab; openTix = null; renderEnt(); return; }
    if ((b = g('[data-ent-page]'))) { ev.preventDefault(); memPage += +b.dataset.entPage; renderEnt(); return; }
    if ((b = g('[data-ent-seat]'))) { ev.preventDefault(); const [a, k, i] = b.dataset.entSeat.split(':'); seatOp(a, k, +i); return; }
    if ((b = g('[data-ent-open]'))) { ev.preventDefault(); openEnt(b.dataset.entOpen); return; }
    const e = enterprises.find((x) => x.id === curEnt);
    if ((b = g('[data-ent-tix]')) && e) {
      ev.preventDefault(); const [a, k, id] = b.dataset.entTix.split(':');
      const LABEL = { fuseGA: 'FUSE GA ticket', hoa: 'Hall of AIME ticket', fuseVIP: 'FUSE VIP ticket', ascent: 'Ascent seat' };
      if (a === 'view') { openTix = openTix === k ? null : k; renderEnt(); }
      else if (a === 'unassign') { e.tickets[k] = e.tickets[k].filter((x) => x !== id); renderEnt(); showToast(`Took back ${byId(e, id).name}'s ${LABEL[k]}.`); }
      else if (a === 'assign') pickMember(e, `Assign a ${LABEL[k]}`, `${(k === 'ascent' ? e.ascent : k === 'hoa' ? e.hoa : k === 'fuseVIP' ? e.fuseVIP : e.fuseGA) - e.tickets[k].length} left in the ${e.name} pool.`, (m) => !e.tickets[k].includes(m.id), (m) => { e.tickets[k].push(m.id); openTix = k; renderEnt(); showToast(`${m.name} has a ${LABEL[k]}.`); });
      return;
    }
    if ((b = g('[data-ent-mem]')) && e) {
      ev.preventDefault(); const [a, id] = b.dataset.entMem.split(':'); const m = byId(e, id);
      if (a === 'remove') {
        if (!window.confirm(`Remove ${m.name} from the ${e.name} roster? ${m.retained ? 'They keep their own membership.' : `Their ${m.tier} membership through ${e.name} ends.`}`)) return;
        e.roster = e.roster.filter((x) => x !== m); e.vipSeats = e.vipSeats.filter((x) => x !== id); e.eliteSeats = e.eliteSeats.filter((x) => x !== id);
        Object.keys(e.tickets).forEach((k) => { e.tickets[k] = e.tickets[k].filter((x) => x !== id); });
        renderEnt(); renderEnterprises(); showToast(`Removed ${m.name} from the roster.`);
      } else {
        form(`Edit ${m.name}`, `${e.name} roster · ${m.tier}`, `${fld('Name', 'em-name', m.name)}${fld('Email', 'em-email', m.email, 'type="email"')}${fld('NMLS #', 'em-nmls', m.nmls)}
          <p class="t-sub" style="display:block">Tier comes from the roster (${e.baseTier}) or a VIP / Elite seat — change seats on the Assign VIP/Elite tab.</p>`,
        () => { const em = val('em-email'); if (!val('em-name') || !validEmail(em)) { showToast('Add a name and a valid email.'); return; } Object.assign(m, { name: val('em-name'), email: em, nmls: val('em-nmls') }); closeModals(); renderEnt(); showToast('Member updated.'); }, 'Save changes');
      }
      return;
    }
    if ((b = g('[data-ent-act]')) && e) {
      ev.preventDefault(); const a = b.dataset.entAct, c = counts(e);
      if (a === 'deactivate') { if (!window.confirm(`Deactivate ${e.name}? All ${num(c.total)} roster members lose access through ${e.name} (members with their own membership keep it).`)) return; e.status = 'inactive'; renderEnt(); renderEnterprises(); showToast(`${e.name} deactivated.`); }
      else if (a === 'reactivate') { e.status = 'active'; renderEnt(); renderEnterprises(); showToast(`${e.name} reactivated.`); }
      else if (a === 'search') { memQ = val('ent-q'); memPage = 0; renderEnt(); }
      else if (a === 'csv') showToast(`Downloaded ${num(c.total)} ${e.name} members as CSV.`);
      else if (a === 'upload') { e.lastImport = { at: today(), rows: c.total }; renderEnt(); showToast(`Roster uploaded — ${num(c.total)} rows checked, 0 new, 0 removed.`); }
      else if (a === 'resend') showToast(`Re-sent invites to ${num(c.never)} people who never logged in.`);
      else if (a === 'extra-ga') { if (e.extraGA >= e.extraGACap) { showToast('The extra GA cap has been reached.'); return; } e.extraGA++; renderEnt(); showToast(`Recorded 1 extra GA ticket at $${e.extraGAPrice}.`); }
      else if (a === 'add-member') {
        form(`Add someone to ${e.name}`, `They get ${e.baseTier} and an email to set their password.`, `<div class="field-row">${fld('Name', 'am-name', '')}${fld('Email', 'am-email', '', 'type="email"')}</div>${fld('NMLS #', 'am-nmls', '')}`,
          () => { const nm = val('am-name'), em = val('am-email'); if (!nm || !validEmail(em)) { showToast('Add a name and a valid email.'); return; }
            if (e.roster.some((x) => x.email.toLowerCase() === em.toLowerCase())) { showToast(`${em} is already on the roster.`); return; }
            e.roster.push({ id: 'R' + Date.now(), name: nm, email: em, nmls: val('am-nmls') || '—', tier: e.baseTier, activated: false, retained: false, hadAccount: false });
            e.roster.sort((x, y) => x.name.localeCompare(y.name)); closeModals(); renderEnt(); renderEnterprises(); showToast(`Added ${nm} — invite sent.`); }, 'Add to roster');
      } else if (a === 'podcast') {
        form('Log a podcast appearance', `${e.name} · ${Math.max(0, e.podcast - e.podcastLog.length)} left this year`, `${fld('Date', 'pc-date', new Date().toISOString().slice(0, 10), 'type="date"')}${fld('Episode', 'pc-ep', '', 'placeholder="Show and episode title"')}${fld('Guest', 'pc-guest', '')}`,
          () => { if (!val('pc-ep')) { showToast('Add the episode.'); return; } e.podcastLog.unshift({ date: fmtDate(val('pc-date')), ep: val('pc-ep'), guest: val('pc-guest') || '—' }); closeModals(); renderEnt(); showToast('Appearance logged.'); }, 'Log appearance');
      }
    }
  });
  document.addEventListener('input', (ev) => { if (ev.target.id === 'grp-q') { const p = ev.target.selectionStart; renderGroups(); const i = $('grp-q'); i.focus(); i.setSelectionRange(p, p); } });
  document.addEventListener('keydown', (ev) => { if (ev.target.id === 'ent-q' && ev.key === 'Enter') { memQ = ev.target.value; memPage = 0; renderEnt(); } });
  document.addEventListener('change', (ev) => {
    if (ev.target.id === 'ent-filter') { memFilter = ev.target.value; memPage = 0; renderEnt(); }
    if (ev.target.id === 'ent-tier') { memTier = ev.target.value; memPage = 0; renderEnt(); }
  });

  renderGroups(); renderEnterprises(); tagEnterpriseMembers(); syncGroupMembers();
  if (typeof fillMemberFilters === 'function') { fillMemberFilters(); renderMembers(); }
  window.AmpAdminMemberships = { openGroup, openEnt, groups, enterprises };
})();
