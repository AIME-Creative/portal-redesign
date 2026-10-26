/* ============================================================
   AMP — Event registration store (shared by member + admin apps)
   ------------------------------------------------------------
   Per-event registration setup + the registrations themselves.
   Registration is OFF unless an event has a setup here.

   Setup (keyed by event title, the same title both apps use)
     enabled      registration on/off
     mode         'rsvp' (free) | 'ticketed' (ticket types + add-ons)
     tiers        who can register: ['All'] or any of Premium/Elite/VIP
     capacity     max attendees incl. guests (null = no limit)
     closes       registration close date (optional)
     earlyBird    { on, until } — items with an ebPrice use it until then
     quickClaim   one-click claim for members whose tier has an included ticket
                  (registers instantly, then offers add-ons / guests) — FUSE
     tickets[]    { id, name, desc, price, ebPrice, included:[tiers], tiers:[...] }
                  "included" = free for those tiers (e.g. FUSE GA for Premium/Elite)
     addons[]     { id, name, desc, price, ebPrice, included:[tiers], perGuest, tiers:[...] }
                  included = free for those tiers AND their included (free) guests;
                  perGuest = guests can be signed up for it too
     guests       { on, max, price, ebPrice, included:{tier: n} }
                  included = free guests per tier (FUSE: VIP gets 1); the rest pay
                  Each guest: { name, email, phone, addons[] } — email/phone must
                  differ from the member's
     fields[]     custom fields { id, label, type, options[], required, help }
                  type: text | textarea | select | yesno | checkbox
   Registration
     { id, event, name, email, phone, tier, ticket, addons[], guests[],
       answers{fieldId: value}, total, earlyBird, at }

   PROTOTYPE: saved to localStorage so admin setup changes show up on
   the member side and member registrations show up in admin.
   Production: Supabase tables (event_registration_settings,
   event_registrations) + Stripe Checkout for anything with a cost.
   ============================================================ */
(function () {
  const KEY = 'amp-event-reg-v2';   // bump when the seed shape changes
  const TIERS = ['Premium', 'Elite', 'VIP'];
  // The prototype's "today" — matches the admin console (June 2026) so early-bird windows read correctly.
  const TODAY = new Date('2026-06-25T12:00:00');

  /* ---------- seed setups ---------- */
  function seedSetups() {
    return {
      'FUSE 2026 — National Conference': {
        enabled: true, mode: 'ticketed', quickClaim: true, tiers: ['All'], capacity: 1500, closes: 'Sep 10, 2026',
        earlyBird: { on: true, until: 'Jul 8, 2026' },
        tickets: [
          { id: 'ga', name: 'General Admission', desc: 'All main-stage sessions, expo hall, and the opening party.', price: 499, ebPrice: 399, included: ['Premium', 'Elite'], tiers: ['Premium', 'Elite'] },
          { id: 'vip', name: 'VIP', desc: 'VIP seating and lounge access, plus the VIP Luncheon.', price: 999, ebPrice: 899, included: ['VIP'], tiers: ['VIP'] },
        ],
        addons: [
          { id: 'hoa', name: 'Hall of AIME', desc: 'Awards dinner celebrating the year’s top brokers.', price: 249, ebPrice: 199, included: ['VIP'], perGuest: true, tiers: ['All'] },
          { id: 'wmn', name: 'WMN at FUSE', desc: "Women's Mortgage Network track", price: 0, ebPrice: null, included: [], perGuest: false, tiers: ['All'] },
          { id: 'vva', name: 'Vetted VA', desc: 'VA loan training to better serve veteran borrowers', price: 0, ebPrice: null, included: [], perGuest: false, tiers: ['All'] },
          { id: 'vipl', name: 'VIP Luncheon', desc: 'Networking lunch with AIME leadership & top originators', price: 0, ebPrice: null, included: [], perGuest: false, tiers: ['VIP'] },
        ],
        guests: { on: true, max: 3, price: 349, ebPrice: 299, included: { VIP: 1 } },
        fields: [
          { id: 'badge', label: 'Name for your badge', type: 'text', options: [], required: false, help: 'Leave blank to use your full name.' },
          { id: 'diet', label: 'Dietary restrictions', type: 'textarea', options: [], required: false, help: '' },
        ],
      },
      'AIME Ascent 2027': {
        enabled: true, mode: 'rsvp', tiers: ['VIP'], capacity: 120, closes: 'Jan 15, 2027',
        earlyBird: { on: false, until: '' }, tickets: [], addons: [],
        guests: { on: false, max: 0, price: 0, ebPrice: null, included: {} },
        fields: [
          { id: 'shirt', label: 'Shirt size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'], required: true, help: '' },
          { id: 'arrive', label: 'Which day are you planning to arrive?', type: 'select', options: ['Sunday, Feb 7', 'Monday, Feb 8', 'Tuesday, Feb 9'], required: true, help: '' },
          { id: 'partner', label: 'Are you bringing a significant other?', type: 'yesno', options: [], required: true, help: '' },
          { id: 'diet', label: 'Dietary restrictions', type: 'textarea', options: [], required: false, help: 'Do you have any allergies or other dietary restrictions we should be aware of?' },
          { id: 'sms', label: 'I consent to receive marketing and promotional messages, including special offers, discounts, and new product updates. Message frequency may vary. Message & data rates may apply. Reply HELP for help or STOP to opt out.', type: 'checkbox', options: [], required: false, help: '' },
        ],
      },
      'Regional Mixer — Dallas': {
        enabled: true, mode: 'rsvp', tiers: ['All'], capacity: 120, closes: 'Aug 10, 2026',
        earlyBird: { on: false, until: '' }, tickets: [], addons: [],
        guests: { on: true, max: 1, price: 0, ebPrice: null, included: {} },
        fields: [
          { id: 'company', label: 'Company name', type: 'text', options: [], required: true, help: '' },
          { id: 'first', label: 'Is this your first AIME event?', type: 'yesno', options: [], required: false, help: '' },
        ],
      },
    };
  }

  /* ---------- seed registrations (deterministic sample) ---------- */
  function seedRegs(setups) {
    let seed = 11;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    const first = ['Maria', 'Carlos', 'Priya', 'Sam', 'Janet', 'Darnell', 'Alicia', 'Ahmed', 'Rachel', 'Tom', 'Monica', 'Derek', 'Hannah', 'Marcus', 'Teresa', 'Brandon', 'Keisha', 'Victor', 'Lauren', 'Omar', 'Grace', 'Wesley', 'Nina', 'Calvin', 'Paula'];
    const last = ['Chen', 'Diaz', 'Nair', 'Whitfield', 'Park', 'Ross', 'Gomez', 'Sayed', 'Stone', 'Becker', 'Ortega', 'Hale', 'Fischer', 'Yoon', 'Bell', 'Navarro', 'Cole', 'Grant', 'Ibarra', 'Ford', 'Haddad', 'Kim', 'Pruitt', 'Lowe', 'Reyes'];
    const regs = [];
    const day = 864e5;
    const person = (k) => { const fn = first[k % first.length], ln = last[(k * 7) % last.length]; return { name: `${fn} ${ln}`, email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example-lending.com` }; };

    // The example member (Kyle Lord) starts unregistered everywhere, so the FUSE one-click claim shows.
    const guest = () => { const fn = pick(first), ln = pick(last); return { name: `${fn} ${ln}`, email: `${fn.toLowerCase()}${Math.floor(rnd() * 90 + 10)}@guestmail.com`, phone: `(555) ${300 + Math.floor(rnd() * 600)}-${1000 + Math.floor(rnd() * 8999)}`, addons: [] }; };

    let n = 1002;
    const add = (event, count, make) => { for (let k = 0; k < count; k++) { const p = person(k + n); regs.push(Object.assign({ id: 'REG-' + n++, event, phone: `(555) ${200 + (n % 700)}-${String(1000 + n * 37).slice(-4)}` }, p, make(k))); } };
    const tierMix = () => { const r = rnd(); return r < 0.45 ? 'Premium' : r < 0.82 ? 'Elite' : 'VIP'; };

    add('FUSE 2026 — National Conference', 64, () => {
      const tier = tierMix(), daysAgo = Math.floor(rnd() * 60), eb = TODAY - daysAgo * day <= new Date('2026-07-08').getTime();
      const vip = tier === 'VIP', ticket = vip ? 'vip' : 'ga';
      const addons = ['hoa', 'wmn', 'vva'].filter(() => rnd() < (vip ? 0.6 : 0.35)).concat(vip && rnd() < 0.7 ? ['vipl'] : []);
      // VIPs usually bring their included guest; some members add paid guests
      const nGuests = vip ? (rnd() < 0.7 ? (rnd() < 0.2 ? 2 : 1) : 0) : (rnd() < 0.15 ? 1 : 0);
      const guests = Array.from({ length: nGuests }, () => { const g = guest(); if (rnd() < 0.5) g.addons = ['hoa']; return g; });
      const reg = { tier, ticket, addons, guests, answers: { badge: '', diet: rnd() < 0.15 ? pick(['Vegetarian', 'Gluten-free', 'No shellfish']) : '' }, earlyBird: eb, at: new Date(TODAY - daysAgo * day).toISOString() };
      reg.total = priceOf(setups['FUSE 2026 — National Conference'], reg, eb).total;
      return reg;
    });
    add('AIME Ascent 2027', 38, () => ({
      tier: 'VIP', ticket: null, addons: [], guests: [], total: 0, earlyBird: false,
      answers: { shirt: pick(['S', 'M', 'M', 'L', 'L', 'XL', '2XL']), arrive: pick(['Sunday, Feb 7', 'Monday, Feb 8', 'Monday, Feb 8', 'Tuesday, Feb 9']), partner: rnd() < 0.4 ? 'Yes' : 'No', diet: rnd() < 0.2 ? pick(['Vegan', 'Nut allergy', 'Gluten-free']) : '', sms: rnd() < 0.6 },
      at: new Date(TODAY - Math.floor(rnd() * 40) * day).toISOString(),
    }));
    add('Regional Mixer — Dallas', 41, () => ({
      tier: tierMix(), ticket: null, addons: [], total: 0, earlyBird: false,
      guests: rnd() < 0.3 ? [guest()] : [],
      answers: { company: pick(last) + ' ' + pick(['Lending', 'Mortgage', 'Home Loans', 'Capital']), first: rnd() < 0.35 ? 'Yes' : 'No' },
      at: new Date(TODAY - Math.floor(rnd() * 25) * day).toISOString(),
    }));
    return regs;
  }

  /* ---------- pricing ---------- */
  const allowed = (list, tier) => !list || !list.length || list.includes('All') || list.includes(tier);
  const date = (s) => (s ? new Date(s.includes(':') ? s : s + ' 23:59:59') : null);   // a date means through the end of that day
  function isEarlyBird(setup, when) {
    const eb = setup && setup.earlyBird;
    if (!eb || !eb.on || !eb.until) return false;
    return (when ? new Date(when) : TODAY) <= date(eb.until);
  }
  const freeGuests = (setup, tier) => (setup.guests && setup.guests.included && +setup.guests.included[tier]) || 0;
  const unit = (item, eb) => (eb && item.ebPrice != null && item.ebPrice !== '' ? +item.ebPrice : +item.price || 0);

  // Price a (draft) registration. Returns line items + total.
  function priceOf(setup, reg, eb) {
    const lines = [];
    if (setup.mode === 'ticketed' && reg.ticket) {
      const t = setup.tickets.find((x) => x.id === reg.ticket);
      if (t) {
        const incl = (t.included || []).includes(reg.tier);
        lines.push({ label: t.name, amount: incl ? 0 : unit(t, eb), note: incl ? `Included with ${reg.tier}` : (eb && t.ebPrice != null ? 'Early-bird' : '') });
      }
    }
    const ebNote = (item) => (eb && item.ebPrice != null && item.ebPrice !== '' && +item.price ? 'Early-bird' : '');
    (reg.addons || []).forEach((id) => {
      const a = setup.addons.find((x) => x.id === id); if (!a) return;
      const incl = (a.included || []).includes(reg.tier);
      lines.push({ label: a.name, amount: incl ? 0 : unit(a, eb), note: incl ? `Included with ${reg.tier}` : ebNote(a) });
    });
    const G = setup.guests || {}, free = freeGuests(setup, reg.tier);
    if (G.on) (reg.guests || []).forEach((g, k) => {
      const incl = k < free, who = `Guest ${k + 1}${g.name ? ' — ' + g.name : ''}`;
      lines.push({ label: who, amount: incl ? 0 : unit(G, eb), note: incl ? `Included with ${reg.tier}` : ebNote(G), guest: true });
      (g.addons || []).forEach((id) => {
        const a = setup.addons.find((x) => x.id === id); if (!a || !a.perGuest) return;
        const ai = incl && (a.included || []).includes(reg.tier);   // included add-ons cover included guests too
        lines.push({ label: `${a.name} · guest ${k + 1}`, amount: ai ? 0 : unit(a, eb), note: ai ? 'Included' : ebNote(a), guest: true });
      });
    });
    return { lines, total: lines.reduce((s, l) => s + l.amount, 0) };
  }

  /* ---------- persistence ---------- */
  let data = null;
  function load() {
    try { data = JSON.parse(localStorage.getItem(KEY)); } catch (e) { data = null; }
    if (!data || !data.setups) { const setups = seedSetups(); data = { setups, regs: seedRegs(setups) }; save(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* in-memory only */ } }
  const listeners = [];
  const changed = () => { save(); listeners.forEach((f) => f()); };
  window.addEventListener('storage', (e) => { if (e.key === KEY) { load(); listeners.forEach((f) => f()); } });
  load();

  const blank = () => ({ enabled: false, mode: 'rsvp', quickClaim: false, tiers: ['All'], capacity: null, closes: '', earlyBird: { on: false, until: '' },
    tickets: [], addons: [], guests: { on: false, max: 1, price: 0, ebPrice: null, included: {} }, fields: [] });

  window.AmpEventReg = {
    TIERS, TODAY,
    onChange: (f) => listeners.push(f),
    setup: (title) => data.setups[title] || null,
    active: (title) => { const s = data.setups[title]; return s && s.enabled ? s : null; },
    editable: (title) => JSON.parse(JSON.stringify(data.setups[title] || blank())),
    saveSetup(title, setup) { data.setups[title] = setup; changed(); },
    canRegister: (setup, tier) => allowed(setup.tiers, tier),
    itemAllowed: (item, tier) => allowed(item.tiers, tier),
    isEarlyBird, priceOf, unit, freeGuests,
    // The ticket a tier gets for free (one-click claim), if any
    includedTicket: (setup, tier) => (setup.tickets || []).find((t) => (t.included || []).includes(tier) && allowed(t.tiers, tier)) || null,
    digits: (s) => String(s || '').replace(/\D/g, ''),
    regsFor: (title) => data.regs.filter((r) => r.event === title),
    find: (title, email) => data.regs.find((r) => r.event === title && r.email === email) || null,
    attendees: (title) => data.regs.filter((r) => r.event === title).reduce((s, r) => s + 1 + (r.guests || []).length, 0),
    register(reg) {
      const i = data.regs.findIndex((r) => r.event === reg.event && r.email === reg.email);
      const at = new Date().toISOString();
      if (i > -1) data.regs[i] = Object.assign({}, data.regs[i], reg, { updatedAt: at });
      else data.regs.unshift(Object.assign({ id: 'REG-' + (2000 + data.regs.length), at }, reg));
      changed();
    },
    cancel(title, email) { data.regs = data.regs.filter((r) => !(r.event === title && r.email === email)); changed(); },
    reset() { const setups = seedSetups(); data = { setups, regs: seedRegs(setups) }; changed(); },
    // Display a stored date ('2026-07-08' from the admin date picker, or 'Jul 8, 2026') as 'Jul 8, 2026'
    fmtDate: (s) => { if (!s) return ''; const d = date(s); return isNaN(d) ? s : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); },
    money: (n) => (n ? '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }) : 'Free'),
    tierText: (list) => (!list || !list.length || list.includes('All') ? 'All members' : list.join(', ') + (list.length === 1 ? ' members only' : ' members')),
  };
})();
