/* ============================================================
   AMP — Member requests store (shared by member + admin apps)
   ------------------------------------------------------------
   One list of member-submitted requests — Escalations, Lender
   connections, Change AE, and Support tickets — with status,
   an activity log, follow-ups, and internal notes.

   PROTOTYPE PERSISTENCE: saved to localStorage so a request filed
   in the member portal shows up in the admin console (and admin
   replies show up for the member), including across open tabs.
   In production this is a Supabase table + RLS; nothing here is
   meant to ship.

   Statuses
     Escalation : Received → Responded → Resolved
     Support    : Received → In progress → Responded → Resolved
     Connection / Change AE : Delivered
   ============================================================ */
(function () {
  const KEY = 'amp-requests-v3';   // bump when the seed shape changes
  // Example member; tier follows the prototype's tier switch (review toggle) if set
  const ME = { name: 'Kyle Lord', email: 'kyle@aimegroup.com', tier: (() => { try { const t = localStorage.getItem('amp-proto-tier'); return ['Premium', 'Elite', 'VIP'].includes(t) ? t : 'Elite'; } catch (e) { return 'Elite'; } })() };

  const TYPES = {
    escalation: { label: 'Escalation',        prefix: 'ESC', flow: ['Received', 'Responded', 'Resolved'] },
    support:    { label: 'Support ticket',    prefix: 'TKT', flow: ['Received', 'In progress', 'Responded', 'Resolved'] },
    connection: { label: 'Connection',        prefix: 'CON', flow: ['Delivered'] },
    changeae:   { label: 'Change AE',         prefix: 'CAE', flow: ['Delivered'] },
  };
  const TEAM = ['AIME Team', 'Jordan Blake', 'Sofia Marin', 'Wes Carter'];

  // Fallback escalation inboxes when partner-store.js isn't loaded. Lenders never log in: they reply to
  // the email or click a one-click status link in it. The real lists are on the lender listing (partner-store.js).
  const LENDER_CONTACTS = {
    'United Wholesale Mortgage': 'escalations@uwm.com', 'EPM': 'wholesale.escalations@epm.net',
    'Newrez Wholesale': 'tpo.escalations@newrez.com', 'Newrez': 'tpo.escalations@newrez.com', 'Windsor Mortgage': 'escalate@windsormortgage.com',
  };
  const REMINDER_DAYS = 2;   // business days without a lender response before an automatic reminder

  /* ---------- seed data (timestamps relative to now so it always reads fresh) ---------- */
  const H = 3600e3, D = 24 * H;
  function seed() {
    const now = Date.now();
    const t = (ago) => new Date(now - ago).toISOString();
    const r = [];

    // ---- Kyle Lord (the example member) ----
    r.push({ id: 'ESC-1042', type: 'escalation', member: ME.name, email: ME.email, tier: ME.tier,
      partner: 'United Wholesale Mortgage', title: 'Appraisal delay — loan #100482910',
      status: 'Received', assignee: 'Jordan Blake', createdAt: t(4 * D),
      fields: { 'Loan number': '100482910', 'Loan type': 'Conventional', 'Loan amount': '$412,500', 'Closing date': 'Jul 10, 2026',
        'Issue': 'Appraisal ordered 12 days ago and still not scheduled. Borrower is at risk of losing their rate lock.' },
      followUp: null,
      activity: [
        { at: t(4 * D), kind: 'submitted', by: 'member', author: ME.name, text: 'Escalation submitted.' },
        { at: t(4 * D - 2 * 60e3), kind: 'delivered', by: 'system', text: "Report delivered to United Wholesale Mortgage's escalation team." },
        { at: t(2 * D), kind: 'lender-reminder', by: 'system', text: "Automatic reminder sent to United Wholesale Mortgage's escalation team (no response in 2 business days)." },
      ] });
    r.push({ id: 'ESC-1037', type: 'escalation', member: ME.name, email: ME.email, tier: ME.tier,
      partner: 'Newrez Wholesale', title: 'CD error — loan #100471552',
      status: 'Responded', assignee: 'Sofia Marin', createdAt: t(9 * D),
      fields: { 'Loan number': '100471552', 'Loan type': 'FHA', 'Loan amount': '$298,000', 'Closing date': 'Jun 30, 2026',
        'Issue': 'Closing Disclosure shows the wrong lender credit; re-disclosure needed before closing.' },
      followUp: null,
      activity: [
        { at: t(9 * D), kind: 'submitted', by: 'member', author: ME.name, text: 'Escalation submitted.' },
        { at: t(9 * D - 3 * 60e3), kind: 'delivered', by: 'system', text: "Report delivered to Newrez Wholesale's escalation team." },
        { at: t(7 * D), kind: 'followup-request', by: 'member', author: ME.name, text: 'No word yet and closing is close — can someone check in?' },
        { at: t(6 * D), kind: 'followup-update', by: 'team', author: 'Sofia Marin', text: "We reached Newrez's escalation desk — they've assigned a closer and expect to re-disclose within 48 hours." },
        { at: t(5 * D), kind: 'lender-response', by: 'lender', author: 'Newrez Wholesale', via: 'email reply', text: 'Corrected CD issued this morning. Please have the borrower e-sign; we can close as scheduled.' },
        { at: t(5 * D), kind: 'status', by: 'lender', author: 'Newrez Wholesale', text: 'Responded' },
      ] });
    r.push({ id: 'ESC-1021', type: 'escalation', member: ME.name, email: ME.email, tier: ME.tier,
      partner: 'EPM', title: 'UW conditions stalled — loan #100460318',
      status: 'Resolved', assignee: 'Jordan Blake', createdAt: t(26 * D),
      fields: { 'Loan number': '100460318', 'Loan type': 'VA', 'Loan amount': '$365,000', 'Closing date': 'Jun 12, 2026',
        'Issue': 'Conditions submitted 6 days ago with no underwriter review.' },
      followUp: null,
      activity: [
        { at: t(26 * D), kind: 'submitted', by: 'member', author: ME.name, text: 'Escalation submitted.' },
        { at: t(26 * D - 60e3), kind: 'delivered', by: 'system', text: "Report delivered to EPM's escalation team." },
        { at: t(25 * D), kind: 'lender-response', by: 'lender', author: 'EPM', via: 'one-click link', text: 'Conditions reviewed and cleared. Clear to close issued.' },
        { at: t(25 * D), kind: 'status', by: 'lender', author: 'EPM', text: 'Responded' },
        { at: t(24 * D), kind: 'status', by: 'member', author: ME.name, text: 'Resolved' },
      ] });
    r.push({ id: 'TKT-2201', type: 'support', member: ME.name, email: ME.email, tier: ME.tier,
      partner: 'Billing & membership', title: "Can't download my FUSE 2026 invoice",
      status: 'Responded', assignee: 'Sofia Marin', createdAt: t(2 * D),
      fields: { Category: 'Billing & membership' }, followUp: null,
      activity: [
        { at: t(2 * D), kind: 'message', by: 'member', author: ME.name, text: "I need the invoice for my FUSE 2026 ticket for my expense report, but the download link on the registration page just spins. Can you send it over?" },
        { at: t(2 * D - 3 * H), kind: 'status', by: 'team', author: 'Sofia Marin', text: 'In progress' },
        { at: t(1 * D + 4 * H), kind: 'message', by: 'team', author: 'Sofia Marin', text: "Hi Kyle — thanks for flagging this. I've attached a fresh copy to your account email, and our dev team is fixing the download link. Did the email come through?" },
        { at: t(1 * D + 4 * H), kind: 'status', by: 'team', author: 'Sofia Marin', text: 'Responded' },
      ] });
    r.push({ id: 'TKT-2207', type: 'support', member: ME.name, email: ME.email, tier: ME.tier,
      partner: 'Lender connection', title: 'Which lenders offer non-QM bank statement loans?',
      status: 'Received', assignee: '', createdAt: t(5 * H),
      fields: { Category: 'Lender connection' }, followUp: null,
      activity: [
        { at: t(5 * H), kind: 'message', by: 'member', author: ME.name, text: "I have a self-employed borrower. Which of the AIME partner lenders have the best bank-statement programs right now?" },
      ] });
    r.push({ id: 'TKT-2188', type: 'support', member: ME.name, email: ME.email, tier: ME.tier,
      partner: 'Billing & membership', title: 'Billing date moved after upgrading to Elite',
      status: 'Resolved', assignee: 'Wes Carter', createdAt: t(19 * D),
      fields: { Category: 'Billing & membership' }, followUp: null,
      activity: [
        { at: t(19 * D), kind: 'message', by: 'member', author: ME.name, text: 'My renewal date changed when I upgraded from Premium to Elite. Was I charged twice?' },
        { at: t(18 * D + 20 * H), kind: 'message', by: 'team', author: 'Wes Carter', text: 'No double charge — the upgrade was prorated and your cycle now starts on the upgrade date. Your next renewal is the 4th.' },
        { at: t(18 * D + 20 * H), kind: 'status', by: 'team', author: 'Wes Carter', text: 'Responded' },
        { at: t(18 * D + 18 * H), kind: 'message', by: 'member', author: ME.name, text: 'Got it, thanks!' },
        { at: t(18 * D + 17 * H), kind: 'status', by: 'team', author: 'Wes Carter', text: 'Resolved' },
      ] });
    r.push({ id: 'CON-3310', type: 'connection', member: ME.name, email: ME.email, tier: ME.tier,
      partner: 'EPM', title: 'Connection request — EPM', status: 'Delivered', assignee: '', createdAt: t(3 * D),
      fields: { Lender: 'EPM', 'Shared with lender': 'Name, email, phone, NMLS #9158, licenses MD · VA · DE' }, followUp: null,
      activity: [
        { at: t(3 * D), kind: 'submitted', by: 'member', author: ME.name, text: 'Connection request submitted.' },
        { at: t(3 * D - 60e3), kind: 'delivered', by: 'system', text: "Delivered to EPM's partner team." },
      ] });
    r.push({ id: 'CON-3264', type: 'connection', member: ME.name, email: ME.email, tier: ME.tier,
      partner: 'Newfi', title: 'Connection request — Newfi', status: 'Delivered', assignee: '', createdAt: t(21 * D),
      fields: { Lender: 'Newfi', 'Shared with lender': 'Name, email, phone, NMLS #9158, licenses MD · VA · DE' }, followUp: null,
      activity: [
        { at: t(21 * D), kind: 'submitted', by: 'member', author: ME.name, text: 'Connection request submitted.' },
        { at: t(21 * D - 60e3), kind: 'delivered', by: 'system', text: "Delivered to Newfi's partner team." },
      ] });
    r.push({ id: 'CAE-0418', type: 'changeae', member: ME.name, email: ME.email, tier: ME.tier,
      partner: 'United Wholesale Mortgage', title: 'Change AE — United Wholesale Mortgage', status: 'Delivered', assignee: '', createdAt: t(12 * D),
      fields: { Lender: 'United Wholesale Mortgage', 'Current AE': 'Brett Hollis', Reason: 'Unresponsive',
        Details: "Haven't heard back on three scenarios over two weeks.", 'Tried to resolve with AE': 'Yes' }, followUp: null,
      activity: [
        { at: t(12 * D), kind: 'submitted', by: 'member', author: ME.name, text: 'Change AE request submitted.' },
        { at: t(12 * D - 60e3), kind: 'delivered', by: 'system', text: 'Delivered to United Wholesale Mortgage and the AIME membership team.' },
      ] });

    // ---- other members (admin view) ----
    const other = (o) => r.push(Object.assign({ followUp: null, assignee: '', fields: {} }, o));
    other({ id: 'ESC-1044', type: 'escalation', member: 'Maria Chen', email: 'maria@chenlending.com', tier: 'VIP',
      partner: 'United Wholesale Mortgage', title: 'Title issue blocking CTC — loan #100489207', status: 'Received', createdAt: t(2 * H),
      fields: { 'Loan number': '100489207', 'Loan type': 'Jumbo', 'Loan amount': '$1,240,000', 'Closing date': 'Jul 2, 2026', Issue: 'Title cleared Friday but UWM still shows the condition open.' },
      activity: [{ at: t(2 * H), kind: 'submitted', by: 'member', author: 'Maria Chen', text: 'Escalation submitted.' },
        { at: t(2 * H - 60e3), kind: 'delivered', by: 'system', text: "Report delivered to United Wholesale Mortgage's escalation team." }] });
    other({ id: 'ESC-1039', type: 'escalation', member: 'Carlos Diaz', email: 'carlos@diazhomeloans.com', tier: 'Elite',
      partner: 'Windsor Mortgage', title: 'Rate lock extension denied — loan #100474410', status: 'Received', assignee: 'Wes Carter', createdAt: t(6 * D),
      fields: { 'Loan number': '100474410', 'Loan type': 'Conventional', 'Loan amount': '$505,000', 'Closing date': 'Jun 28, 2026', Issue: 'Lock expires in 3 days; extension request denied without explanation.' },
      followUp: { requestedAt: t(20 * H), note: "Still nothing from Windsor and the lock expires Friday. Please help!", status: 'open' },
      activity: [{ at: t(6 * D), kind: 'submitted', by: 'member', author: 'Carlos Diaz', text: 'Escalation submitted.' },
        { at: t(6 * D - 60e3), kind: 'delivered', by: 'system', text: "Report delivered to Windsor Mortgage's escalation team." },
        { at: t(4 * D), kind: 'lender-reminder', by: 'system', text: "Automatic reminder sent to Windsor Mortgage's escalation team (no response in 2 business days)." },
        { at: t(20 * H), kind: 'followup-request', by: 'member', author: 'Carlos Diaz', text: 'Still nothing from Windsor and the lock expires Friday. Please help!' },
        { at: t(20 * H), kind: 'lender-reminder', by: 'system', text: "Reminder sent to Windsor Mortgage's escalation team (follow-up requested)." }] });
    other({ id: 'ESC-1035', type: 'escalation', member: 'Ahmed Sayed', email: 'ahmed@sayedmortgage.com', tier: 'Premium',
      partner: 'EPM', title: 'Appraisal review — loan #100460912', status: 'Received', createdAt: t(3 * D),
      fields: { 'Loan number': '100460912', 'Loan type': 'FHA', 'Loan amount': '$276,000', 'Closing date': 'Jul 8, 2026', Issue: 'Appraisal came in low; reconsideration of value submitted 5 days ago.' },
      followUp: { requestedAt: t(3 * H), note: '', status: 'open' },
      activity: [{ at: t(3 * D), kind: 'submitted', by: 'member', author: 'Ahmed Sayed', text: 'Escalation submitted.' },
        { at: t(3 * D - 60e3), kind: 'delivered', by: 'system', text: "Report delivered to EPM's escalation team." },
        { at: t(3 * H), kind: 'followup-request', by: 'member', author: 'Ahmed Sayed', text: '' }] });
    other({ id: 'TKT-2206', type: 'support', member: 'Sam Whitfield', email: 'sam@whitfieldfunding.com', tier: 'Elite',
      partner: 'Billing & membership', title: "Can't update billing card", status: 'In progress', assignee: 'Sofia Marin', createdAt: t(1 * D),
      fields: { Category: 'Billing & membership' },
      activity: [{ at: t(1 * D), kind: 'message', by: 'member', author: 'Sam Whitfield', text: 'The card form says "declined" but my bank says no attempt was made.' },
        { at: t(20 * H), kind: 'message', by: 'team', author: 'Sofia Marin', text: "Sorry about that, Sam. Can you tell me which browser you're using? We're seeing this on older Safari versions." },
        { at: t(20 * H), kind: 'status', by: 'team', author: 'Sofia Marin', text: 'Responded' },
        { at: t(6 * H), kind: 'message', by: 'member', author: 'Sam Whitfield', text: 'Safari 15 on my work Mac. Tried Chrome and it worked — but you may want to fix Safari.' },
        { at: t(6 * H), kind: 'status', by: 'member', author: 'Sam Whitfield', text: 'In progress' }] });
    other({ id: 'TKT-2203', type: 'support', member: 'Alicia Gomez', email: 'alicia@gomezlending.com', tier: 'VIP',
      partner: 'Loan escalation', title: 'Question about VIP escalations', status: 'Resolved', assignee: 'Jordan Blake', createdAt: t(3 * D),
      fields: { Category: 'Loan escalation' },
      activity: [{ at: t(3 * D), kind: 'message', by: 'member', author: 'Alicia Gomez', text: 'Is there really no cap on escalations for VIP?' },
        { at: t(3 * D - 2 * H), kind: 'message', by: 'team', author: 'Jordan Blake', text: 'Correct — VIP members have unlimited escalations each cycle.' },
        { at: t(3 * D - 2 * H), kind: 'status', by: 'team', author: 'Jordan Blake', text: 'Resolved' }] });
    other({ id: 'CON-3318', type: 'connection', member: 'Darnell Ross', email: 'darnell@rossmortgage.com', tier: 'Premium',
      partner: 'EPM', title: 'Connection request — EPM', status: 'Delivered', createdAt: t(4 * H),
      fields: { Lender: 'EPM' },
      activity: [{ at: t(4 * H), kind: 'submitted', by: 'member', author: 'Darnell Ross', text: 'Connection request submitted.' },
        { at: t(4 * H - 60e3), kind: 'delivered', by: 'system', text: "Delivered to EPM's partner team." }] });
    // Connections to UWM and to Advantage Partners Solutions' products (shown to those partner users)
    const conn = (id, who, email, tier, partner, vendor, ago) => other({ id, type: 'connection', member: who, email, tier, partner,
      title: `Connection request — ${partner}`, status: 'Delivered', createdAt: t(ago),
      fields: vendor ? { Vendor: partner, 'Shared with vendor': 'Name, email, phone, NMLS #, licensed states' } : { Lender: partner, 'Shared with lender': 'Name, email, phone, NMLS #, licensed states' },
      activity: [{ at: t(ago), kind: 'submitted', by: 'member', author: who, text: 'Connection request submitted.' },
        { at: t(ago - 60e3), kind: 'delivered', by: 'system', text: `Delivered to ${partner}'s ${vendor ? '' : 'partner '}team.`.replace('  ', ' ') }] });
    conn('CON-3321', 'Maria Chen', 'maria@chenlending.com', 'VIP', 'United Wholesale Mortgage', false, 1 * D);
    conn('CON-3322', 'Sam Whitfield', 'sam@whitfieldfunding.com', 'Elite', 'United Wholesale Mortgage', false, 5 * D);
    conn('CON-3323', ME.name, ME.email, ME.tier, 'Advantage Partners Solutions', true, 6 * D);
    conn('CON-3324', 'Priya Nair', 'priya@nairhomeloans.com', 'Elite', 'APS Verification Services', true, 2 * D);
    conn('CON-3325', 'Tom Becker', 'tom@beckerhomes.com', 'Elite', 'Advantage Partners Solutions', true, 10 * D);
    other({ id: 'CAE-0421', type: 'changeae', member: 'Tom Becker', email: 'tom@beckerhomes.com', tier: 'Elite',
      partner: 'United Wholesale Mortgage', title: 'Change AE — United Wholesale Mortgage', status: 'Delivered', createdAt: t(1 * D),
      fields: { Lender: 'United Wholesale Mortgage', 'Current AE': 'Dana Price', Reason: 'Poor communication' },
      activity: [{ at: t(1 * D), kind: 'submitted', by: 'member', author: 'Tom Becker', text: 'Change AE request submitted.' },
        { at: t(1 * D - 60e3), kind: 'delivered', by: 'system', text: 'Delivered to United Wholesale Mortgage and the AIME membership team.' }] });

    return r.map((x) => Object.assign({ memberSeenAt: x.createdAt, adminSeenAt: x.createdAt }, x));
  }

  /* ---------- persistence ---------- */
  let items = null;
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) items = JSON.parse(raw); } catch (e) { /* storage blocked */ }
    if (!Array.isArray(items)) { items = seed(); markAllSeen(); save(); }
  }
  // Seeded history counts as already read, except the Kyle ticket the team just answered
  // and anything waiting on the team — so the unread badges have something to show.
  function markAllSeen() {
    const now = new Date().toISOString();
    items.forEach((r) => {
      r.memberSeenAt = r.id === 'TKT-2201' ? r.createdAt : now;
      r.adminSeenAt = (r.followUp && r.followUp.status === 'open') || r.status === 'Received' || r.id === 'TKT-2206' ? r.createdAt : now;
    });
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* in-memory only */ } }

  const listeners = [];
  function changed() { save(); listeners.forEach((fn) => fn()); }
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    try { items = JSON.parse(e.newValue) || seed(); } catch (err) { return; }
    listeners.forEach((fn) => fn());
  });

  /* ---------- helpers ---------- */
  const nowISO = () => new Date().toISOString();
  // Oldest first; ties keep insertion order (a reply stays above the status change it caused).
  const byAt = (a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0);
  const find = (id) => items.find((r) => r.id === id);
  function nextId(type) {
    const p = TYPES[type].prefix;
    const max = items.filter((r) => r.id.startsWith(p)).reduce((m, r) => Math.max(m, +r.id.split('-')[1]), 0);
    return p + '-' + String(max + 1).padStart(4, '0');
  }
  function log(r, entry) { r.activity.push(Object.assign({ at: nowISO() }, entry)); r.updatedAt = nowISO(); }
  function lastActivity(r) { return r.activity.reduce((m, a) => (a.at > m ? a.at : m), r.createdAt); }

  /* ---------- public API ---------- */
  load();
  window.AmpRequests = {
    TYPES, TEAM, ME, byAt,
    all: () => items.slice().sort((a, b) => (lastActivity(b) > lastActivity(a) ? 1 : -1)),
    // The signed-in user's own requests (a partner user only has their own support tickets)
    mine: () => window.AmpRequests.all().filter((r) => (window.AMP_PARTNER_USER ? r.email === window.AMP_PARTNER_USER.email : r.member === ME.name)),
    get: find,
    lastActivity,
    onChange: (fn) => listeners.push(fn),

    // Visible-to-member activity (internal notes stripped)
    publicActivity: (r) => r.activity.filter((a) => a.kind !== 'note').sort(byAt),

    // Unread flags
    memberUnread: (r) => r.activity.some((a) => a.at > r.memberSeenAt && a.by !== 'member' && a.kind !== 'note' && a.kind !== 'delivered'),
    adminNeedsAttention: (r) =>
      (r.followUp && r.followUp.status === 'open') ||
      (r.type === 'support' && (r.status === 'Received' || r.status === 'In progress') && lastMsgBy(r) === 'member') ||
      (r.type === 'escalation' && r.status === 'Received' && !r.assignee),
    markSeen(id, side) { const r = find(id); if (!r) return; r[side === 'admin' ? 'adminSeenAt' : 'memberSeenAt'] = nowISO(); save(); },

    create(type, data) {
      const at = nowISO();
      const r = Object.assign({ id: nextId(type), type, member: ME.name, email: ME.email, tier: ME.tier,
        status: TYPES[type].flow[0], assignee: '', createdAt: at, updatedAt: at, followUp: null,
        memberSeenAt: at, adminSeenAt: '1970-01-01T00:00:00.000Z', fields: {}, activity: [] }, data);
      if (type === 'support') {
        r.activity.push({ at, kind: 'message', by: 'member', author: r.member, text: data.message || '' });
      } else {
        r.activity.push({ at, kind: 'submitted', by: 'member', author: r.member, text: TYPES[type].label + ' submitted.' });
        const dest = type === 'escalation' ? `Report delivered to ${r.partner}'s escalation team.`
          : type === 'connection' ? `Delivered to ${r.partner}'s partner team.`
          : `Delivered to ${r.partner} and the AIME membership team.`;
        r.activity.push({ at, kind: 'delivered', by: 'system', text: dest });
      }
      items.push(r); changed(); return r;
    },

    setStatus(id, status, by, author) {
      const r = find(id); if (!r || r.status === status) return;
      r.status = status; log(r, { kind: 'status', by, author, text: status });
      if (status === 'Resolved' && r.followUp && r.followUp.status === 'open') r.followUp.status = 'done';
      changed();
    },
    // Support thread. Team reply → Responded; member reply → back to In progress.
    reply(id, by, author, text, resolve) {
      const r = find(id); if (!r || !text.trim()) return;
      log(r, { kind: 'message', by, author, text: text.trim() });
      const next = by === 'team' ? (resolve ? 'Resolved' : 'Responded') : 'In progress';
      if (r.status !== next) { r.status = next; log(r, { kind: 'status', by, author, text: next }); }
      if (by === 'team') { r.adminSeenAt = nowISO(); if (!r.assignee) r.assignee = author; } else r.memberSeenAt = nowISO();
      changed();
    },
    // Escalation: a lender response → Responded. `via` says how it arrived:
    //   'email reply'    — lender replied to the escalation email (captured from the reply address)
    //   'one-click link' — lender used a status button in the email (no login)
    //   'logged by X'    — the membership team entered it (phone call, email to AIME, etc.)
    lenderResponse(id, text, via) {
      const r = find(id); if (!r || !text.trim()) return;
      log(r, { kind: 'lender-response', by: 'lender', author: r.partner, via, text: text.trim() });
      if (r.status === 'Received') { r.status = 'Responded'; log(r, { kind: 'status', by: 'lender', author: r.partner, text: 'Responded' }); }
      closeFollowUp(r);
      changed();
    },
    // One-click link from the lender email: 'working' (We're on it) or 'resolved', optional note.
    lenderAction(id, action, note, via) {
      const r = find(id); if (!r) return;
      const text = (note || '').trim() || (action === 'resolved'
        ? 'Marked this escalation resolved.' : "We're on it — this escalation is being worked.");
      log(r, { kind: 'lender-response', by: 'lender', author: r.partner, via: via || 'one-click link', text });
      const next = action === 'resolved' ? 'Resolved' : (r.status === 'Received' ? 'Responded' : null);
      if (next && r.status !== next) { r.status = next; log(r, { kind: 'status', by: 'lender', author: r.partner, text: next }); }
      closeFollowUp(r);
      changed();
    },
    // Re-send the escalation email to the lender (automatic, on member follow-up, or by the team).
    remindLender(id, why) {
      const r = find(id); if (!r) return;
      log(r, { kind: 'lender-reminder', by: 'system', text: `Reminder sent to ${r.partner}'s escalation team${why ? ` (${why})` : ''}.` });
      changed();
    },
    // Member follow-up: flags the membership team AND re-sends the email to the lender.
    requestFollowUp(id, note) {
      const r = find(id); if (!r || (r.followUp && r.followUp.status === 'open')) return;
      r.followUp = { requestedAt: nowISO(), note: note || '', status: 'open' };
      log(r, { kind: 'followup-request', by: 'member', author: r.member, text: note || '' });
      log(r, { kind: 'lender-reminder', by: 'system', text: `Reminder sent to ${r.partner}'s escalation team (follow-up requested).` });
      r.memberSeenAt = nowISO();
      changed();
    },
    // Escalation contacts come from the lender listing (partner-store.js) — every one gets the email.
    lenderContact(name) {
      const list = window.AmpPartners ? AmpPartners.contacts(name, 'lender').escalation
        : [{ name: '', email: LENDER_CONTACTS[name] || 'escalations@' + name.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '') + '.com' }];
      return { reminderDays: REMINDER_DAYS, contacts: list, inbox: list.map((x) => x.email).join(', ') };
    },
    replyAddress: (id) => id.toLowerCase() + '@replies.aimegroup.com',
    // Prototype link. Production: a signed, expiring token scoped to this one escalation.
    lenderLink: (id, action) => `lender-respond.html?esc=${encodeURIComponent(id)}&action=${action}`,
    completeFollowUp(id, text, author) {
      const r = find(id); if (!r || !r.followUp) return;
      r.followUp.status = 'done'; r.followUp.doneAt = nowISO();
      log(r, { kind: 'followup-update', by: 'team', author, text: text.trim() || `We followed up with ${r.partner} on your behalf.` });
      r.adminSeenAt = nowISO();
      changed();
    },
    addNote(id, text, author) { const r = find(id); if (!r || !text.trim()) return; log(r, { kind: 'note', by: 'team', author, text: text.trim() }); changed(); },
    assign(id, who) { const r = find(id); if (!r) return; r.assignee = who; changed(); },
    reset() { items = seed(); markAllSeen(); changed(); },
  };
  // The lender answering is what a member follow-up was waiting for, so it closes the request.
  function closeFollowUp(r) {
    if (r.followUp && r.followUp.status === 'open') { r.followUp.status = 'done'; r.followUp.doneAt = nowISO(); }
  }
  function lastMsgBy(r) {
    const msgs = r.activity.filter((a) => a.kind === 'message');
    return msgs.length ? msgs.sort(byAt)[msgs.length - 1].by : null;
  }

  /* ---------- shared formatting ---------- */
  window.AmpRequests.fmt = {
    date: (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    dateTime: (iso) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    ago(iso) {
      const s = (Date.now() - new Date(iso)) / 1000;
      if (s < 60) return 'Just now';
      if (s < 3600) return Math.floor(s / 60) + 'm ago';
      if (s < 86400) return Math.floor(s / 3600) + 'h ago';
      if (s < 172800) return 'Yesterday';
      if (s < 7 * 86400) return Math.floor(s / 86400) + 'd ago';
      return window.AmpRequests.fmt.date(iso);
    },
    esc: (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  };
  window.AmpRequests.statusBadge = (s) => {
    const map = { Received: 'badge-pink', 'In progress': 'badge-amber', Responded: 'badge-cyan', Resolved: 'badge-green', Delivered: 'badge-navy' };
    return `<span class="badge ${map[s] || 'badge-navy'}">${s}</span>`;
  };

  /* ---------- shared rendering (same tracker / timeline / thread in both apps) ---------- */
  const F = window.AmpRequests.fmt, esc = F.esc;
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`;
  const ICON = {
    escalation: '<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>',
    support:    '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
    connection: '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
    changeae:   '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6"/>',
    check: '<path d="M20 6L9 17l-5-5"/>', send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
    reply: '<path d="M9 17l-5-5 5-5M4 12h11a5 5 0 015 5v2"/>', note: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    dot: '<circle cx="12" cy="12" r="3"/>', chev: '<path d="M9 18l6-6-6-6"/>',
  };
  window.AmpRequests.svg = (k) => svg(ICON[k]);
  window.AmpRequests.icon = (type, sm) => `<span class="rq-ico t-${type}${sm ? ' sm' : ''}">${svg(ICON[type])}</span>`;

  window.AmpRequests.trackerHTML = (r) => {
    const flow = TYPES[r.type].flow;
    const steps = flow.length === 1 ? ['Submitted', 'Delivered'] : flow;
    const idx = flow.length === 1 ? 1 : flow.indexOf(r.status);
    const whenOf = (s, i) => {
      if (i === 0) return r.createdAt;
      if (s === 'Delivered') { const d = r.activity.find((a) => a.kind === 'delivered'); return d && d.at; }
      const hits = r.activity.filter((a) => a.kind === 'status' && a.text === s);
      return hits.length ? hits[hits.length - 1].at : null;
    };
    return '<div class="rq-track">' + steps.map((s, i) => {
      const last = i === steps.length - 1;
      const state = i < idx || (i === idx && last) ? 'done' : i === idx ? 'current' : '';
      const when = state ? whenOf(s, i) : null;
      const line = last ? '' : `<div class="rq-line ${i < idx ? 'done' : ''}"></div>`;
      return `<div class="rq-step ${state}"><span class="dot">${state === 'done' ? svg(ICON.check) : i + 1}</span>
        <span class="lbl">${s}</span>${when ? `<span class="when">${F.date(when)}</span>` : ''}</div>${line}`;
    }).join('') + '</div>';
  };

  // viewer: 'member' (first person, no internal notes) or 'admin'
  window.AmpRequests.timelineHTML = (r, viewer) => {
    const acts = (viewer === 'admin' ? r.activity.slice().sort(byAt) : window.AmpRequests.publicActivity(r));
    const you = (a) => viewer === 'member' && a.by === 'member';
    const label = TYPES[r.type].label.toLowerCase();
    return '<div class="rq-timeline">' + acts.map((a) => {
      let cls = '', ico = ICON.dot, title = '', text = a.text;
      switch (a.kind) {
        case 'submitted': ico = ICON.send; title = you(a) ? `You submitted this ${label}` : `${esc(a.author)} submitted this ${label}`; text = ''; break;
        case 'delivered': ico = ICON.check; title = esc(a.text); text = ''; break;
        case 'status': cls = 'minor'; title = `Status changed to <strong>${esc(a.text)}</strong>` + (a.author ? ` by ${you(a) ? 'you' : esc(a.author)}` : ''); text = ''; break;
        case 'lender-response': cls = 'lender'; ico = ICON.reply; title = `Response from ${esc(a.author)}` + (a.via ? ` <span style="font-weight:500;color:var(--muted)">· via ${esc(a.via)}</span>` : ''); break;
        case 'lender-reminder': cls = 'minor'; ico = ICON.send; title = esc(a.text); text = ''; break;
        case 'followup-request': cls = 'followup'; ico = ICON.flag; title = you(a) ? 'You requested a follow-up' : `${esc(a.author)} requested a follow-up`; break;
        case 'followup-update': cls = 'team'; ico = ICON.reply; title = `AIME membership team followed up — ${esc(a.author)}`; break;
        case 'message': cls = a.by === 'team' ? 'team' : ''; ico = ICON.support; title = a.by === 'team' ? `${esc(a.author)} (AIME team) replied` : you(a) ? 'You replied' : `${esc(a.author)} replied`; break;
        case 'note': cls = 'internal'; ico = ICON.note; title = `Internal note — ${esc(a.author)}`; break;
      }
      return `<div class="rq-ev ${cls}"><span class="ev-dot">${svg(ico)}</span><div class="ev-body">
        <div class="ev-title">${title}</div><div class="ev-time">${F.dateTime(a.at)}</div>
        ${text ? `<div class="ev-text">${esc(text)}</div>` : ''}</div></div>`;
    }).join('') + '</div>';
  };

  // Support conversation. "mine" = the viewer's side (member for member, team for admin).
  window.AmpRequests.threadHTML = (r, viewer) => {
    const acts = r.activity.slice().sort(byAt)
      .filter((a) => a.kind === 'message' || a.kind === 'status' || (viewer === 'admin' && a.kind === 'note'));
    const initials = (n) => n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return '<div class="rq-thread">' + acts.map((a) => {
      if (a.kind === 'status') return `<div class="rq-sys">Status changed to <strong>${esc(a.text)}</strong> · ${F.ago(a.at)}</div>`;
      if (a.kind === 'note') return `<div class="rq-sys internal"><strong>Internal note · ${esc(a.author)}</strong> — ${esc(a.text)}</div>`;
      const team = a.by === 'team';
      const mine = viewer === 'admin' ? team : !team;
      const who = team ? `<strong>${esc(a.author)}</strong> · AIME support` : (viewer === 'member' ? '<strong>You</strong>' : `<strong>${esc(a.author)}</strong>`);
      return `<div class="rq-msg ${team ? 'team' : ''} ${mine ? 'mine' : ''}"><span class="av">${initials(a.author)}</span>
        <div><div class="who">${who} · ${F.dateTime(a.at)}</div><div class="bubble">${esc(a.text)}</div></div></div>`;
    }).join('') + '</div>';
  };
})();
