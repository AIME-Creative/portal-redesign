/* ============================================================
   AMP — Lender & vendor partner accounts (shared by both apps)
   ------------------------------------------------------------
   Partner users are created by AIME admins only (no self-signup,
   no billing). Each belongs to one company:
     • Lender partners → a lender listing
     • Vendor partners → a vendor COMPANY, which can own several
       Market products (e.g. Advantage Partners Solutions)
   Everyone at a company sees the same dashboard and requests.

   Also here:
     • Company contacts — who each request type is sent to
       ("Sent to" column), set on the company listing
     • Page-view analytics by member tier (sample data)
     • Member directory — the details partners see on requests

   PROTOTYPE: users persist in localStorage (amp-partners-v1);
   analytics and contacts are deterministic sample data.
   Production: users table with user_type = lender|vendor +
   company_id; contacts on the listing; page views from Mixpanel.
   ============================================================ */
(function () {
  const KEY = 'amp-partners-v2';   // v2: no Deactivated status (users are removed instead)
  const TIERS = ['Premium', 'Elite', 'VIP'];
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '');

  // Market products that belong to a different company name (everything else: product = company)
  const PRODUCT_COMPANY = { 'APS Verification Services': 'Advantage Partners Solutions' };
  const companyOf = (product) => PRODUCT_COMPANY[product] || product;

  // Who each request type is sent to, per company (set on the lender / vendor listing)
  const CONTACTS = {
    'United Wholesale Mortgage': {
      escalation: { name: 'Dana Whitaker', email: 'escalations@uwm.com' },
      connection: { name: 'Chris Morales', email: 'chris.morales@uwm.com' },
      changeae:   { name: 'Tasha Greene',  email: 'tasha.greene@uwm.com' },
    },
    'EPM': {
      escalation: { name: 'Marcus Lee', email: 'wholesale.escalations@epm.net' },
      connection: { name: 'Marcus Lee', email: 'marcus.lee@epm.net' },
      changeae:   { name: 'Rita Gomez', email: 'rita.gomez@epm.net' },
    },
    'Advantage Partners Solutions': { connection: { name: 'Morgan Reyes', email: 'morgan.reyes@advantagepartners.com' } },
  };
  function contacts(company, kind) {
    const c = CONTACTS[company] || {}, d = slug(company).slice(0, 14) || 'partner';
    if (kind === 'vendor') return { connection: c.connection || { name: `${company} Partnerships`, email: `partnerships@${d}.com` } };
    return {
      escalation: c.escalation || { name: 'Escalation desk', email: `escalations@${d}.com` },
      connection: c.connection || { name: 'Broker partner team', email: `partners@${d}.com` },
      changeae: c.changeae || { name: 'AE support', email: `aesupport@${d}.com` },
    };
  }

  // Member details shown to partners on requests (production: the member profile)
  const MEMBERS = {
    'kyle@aimegroup.com': { phone: '(555) 014-2278', nmls: '9158', company: 'AIME', licensed: ['MD', 'VA', 'DE'] },
    'maria@chenlending.com': { phone: '(555) 233-1180', nmls: '1748211', company: 'Chen Lending', licensed: ['CA', 'NV', 'AZ'] },
    'carlos@diazhomeloans.com': { phone: '(555) 381-4402', nmls: '1650077', company: 'Diaz Home Loans', licensed: ['TX', 'OK'] },
    'ahmed@sayedmortgage.com': { phone: '(555) 902-1146', nmls: '2011834', company: 'Sayed Mortgage', licensed: ['NJ', 'NY', 'PA'] },
    'sam@whitfieldfunding.com': { phone: '(555) 640-7793', nmls: '1893420', company: 'Whitfield Funding', licensed: ['GA', 'FL'] },
    'tom@beckerhomes.com': { phone: '(555) 772-0158', nmls: '1567209', company: 'Becker Home Loans', licensed: ['OH', 'MI', 'IN'] },
    'darnell@rossmortgage.com': { phone: '(555) 118-6634', nmls: '2144906', company: 'Ross Mortgage', licensed: ['TX'] },
    'priya@nairhomeloans.com': { phone: '(555) 455-2390', nmls: '1932755', company: 'Nair Home Loans', licensed: ['WA', 'OR'] },
  };
  const member = (email) => MEMBERS[email] || { phone: '—', nmls: '—', company: '—', licensed: [] };

  /* ---------- partner users ---------- */
  const seedUsers = () => [
    { id: 'PU-101', first: 'Dana', last: 'Whitaker', email: 'dana.whitaker@uwm.com', phone: '(555) 410-2210', type: 'Lender', company: 'United Wholesale Mortgage', status: 'Active', lastLogin: '2h ago' },
    { id: 'PU-102', first: 'Chris', last: 'Morales', email: 'chris.morales@uwm.com', phone: '(555) 410-2288', type: 'Lender', company: 'United Wholesale Mortgage', status: 'Active', lastLogin: 'Yesterday' },
    { id: 'PU-103', first: 'Marcus', last: 'Lee', email: 'marcus.lee@epm.net', phone: '(555) 302-7741', type: 'Lender', company: 'EPM', status: 'Invited', lastLogin: '—' },
    { id: 'PU-104', first: 'Morgan', last: 'Reyes', email: 'morgan.reyes@advantagepartners.com', phone: '(555) 619-4420', type: 'Vendor', company: 'Advantage Partners Solutions', status: 'Active', lastLogin: '5h ago' },
    { id: 'PU-105', first: 'Taylor', last: 'Brooks', email: 'taylor.brooks@arive.com', phone: '(555) 845-3307', type: 'Vendor', company: 'Arive', status: 'Active', lastLogin: '3d ago' },
    { id: 'PU-106', first: 'Jamie', last: 'Lin', email: 'jamie.lin@xactus.com', phone: '(555) 527-6610', type: 'Vendor', company: 'Xactus', status: 'Invited', lastLogin: '—' },
  ];
  let users;
  try { users = JSON.parse(localStorage.getItem(KEY)); } catch (e) { users = null; }
  if (!Array.isArray(users)) { users = seedUsers(); save(); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(users)); } catch (e) { /* in-memory */ } }

  /* ---------- page views (sample analytics) ---------- */
  // Deterministic daily views by member tier for a key (lender name or product).
  function series(key, days) {
    let seed = [...key].reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 2147483647, 7) || 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const base = 14 + (seed % 23);
    const out = [];
    for (let d = 179; d >= 0; d--) {
      const day = new Date(Date.now() - d * 864e5), wk = day.getDay();
      const f = (wk === 0 || wk === 6 ? 0.45 : 1) * (0.75 + rnd() * 0.5) * (1 + (179 - d) / 400);
      const total = Math.round(base * f);
      const p = Math.round(total * (0.42 + rnd() * 0.08)), e = Math.round(total * (0.36 + rnd() * 0.06));
      out.push({ date: day, Premium: p, Elite: e, VIP: Math.max(0, total - p - e) });
    }
    return out.slice(-days);
  }
  function views(key, days) {
    const s = series(key, days);
    const sum = (t) => s.reduce((n, d) => n + d[t], 0);
    const r = { Premium: sum('Premium'), Elite: sum('Elite'), VIP: sum('VIP'), daily: s.map((d) => d.Premium + d.Elite + d.VIP) };
    r.total = r.Premium + r.Elite + r.VIP;
    r.unique = Math.round(r.total * 0.62);
    return r;
  }

  window.AmpPartners = {
    TIERS, companyOf, contacts, member, views,
    users: () => users.slice(),
    addUser(u) { const id = 'PU-' + (Math.max(100, ...users.map((x) => +x.id.slice(3))) + 1); users.unshift(Object.assign({ id, status: 'Invited', lastLogin: '—' }, u)); save(); return id; },
    updateUser(id, patch) { const u = users.find((x) => x.id === id); if (u) { Object.assign(u, patch); save(); } },
    removeUser(id) { users = users.filter((x) => x.id !== id); save(); },
    reset() { users = seedUsers(); save(); },
    // The sample partner the prototype signs in as (review pill → AS Lender / Vendor)
    sampleUser: (type) => users.find((u) => u.type === type && u.status === 'Active' && (type === 'Lender' ? u.company === 'United Wholesale Mortgage' : u.company === 'Advantage Partners Solutions')),
    // Market products owned by a vendor company
    productsOf: (company, allProducts) => allProducts.filter((p) => companyOf(p) === company),
  };
})();
