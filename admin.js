/* ============================================================
   AMP Admin — data, rendering, and interactions (prototype)
   Sample data only; actions are simulated (toasts).
   ============================================================ */

/* ---------- Taxonomies (managed in Categories & tags) ---------- */
const taxonomies = {
  lenderProducts:    ["Conventional","FHA","VA","Jumbo","Non-QM","USDA","DSCR","Bank Stmt","Renovation","Reverse","Fix & Flip","Bridge"],
  vendorCategories:  ["Core Partner","Origination","Coaching","Marketing"],
  resourceTypes:     ["Podcast","Webinar","Training","Recording","Certification"],
  resourceTopics:    ["AI Strategy","Marketing","Sales"],
  eventTypes:        ["Virtual","In person","Training"],
};
const taxMeta = {
  lenderProducts:   { label:"Lender product types", sub:"Shown on lender cards and the product filter." },
  vendorCategories: { label:"Market categories",     sub:"Group vendors in the Market." },
  resourceTypes:    { label:"Resource types",        sub:"Used to label and filter resources." },
  resourceTopics:   { label:"Resource topics",        sub:"Topic tags members filter by on Resources (AI Strategy, Marketing, Sales…)." },
  eventTypes:       { label:"Event types",           sub:"Used to label and filter events." },
};

/* ---------- Content data ---------- */
const tierBadge = { Gold:"badge-gold", Silver:"badge-silver", Bronze:"badge-bronze" };
const lenders = [
  { name:"United Wholesale Mortgage", short:"UWM", tier:"Gold", color:"#0b1f5b", products:["Conventional","FHA","VA","Jumbo","Non-QM"], status:"Active" },
  { name:"EPM", short:"EPM", tier:"Gold", color:"#1b7a4a", products:["Conventional","FHA","VA","USDA"], status:"Active" },
  { name:"Windsor Mortgage", short:"WM", tier:"Gold", color:"#3a3a3a", products:["Non-QM","Jumbo","DSCR"], status:"Active" },
  { name:"Newrez Wholesale", short:"NRZ", tier:"Gold", color:"#e0463c", products:["Conventional","FHA","VA","Renovation"], status:"Active" },
  { name:"Newfi Wholesale", short:"NF", tier:"Silver", color:"#163a85", products:["Non-QM","Bank Stmt","DSCR"], status:"Active" },
  { name:"Cake Mortgage", short:"CK", tier:"Silver", color:"#2bb673", products:["Conventional","Non-QM","Jumbo"], status:"Active" },
  { name:"eLEND", short:"eL", tier:"Silver", color:"#1893b1", products:["FHA","VA","USDA","Conventional"], status:"Active" },
  { name:"RCN Capital", short:"RCN", tier:"Bronze", color:"#0b2a5b", products:["Fix & Flip","Bridge","DSCR"], status:"Active" },
  { name:"Kind Lending", short:"KIND", tier:"Gold", color:"#e0982a", products:["Conventional","FHA","VA","Non-QM"], status:"Active" },
  { name:"Rocket Pro TPO", short:"RKT", tier:"Gold", color:"#d6322e", products:["Conventional","FHA","VA","Jumbo"], status:"Active" },
  { name:"Plaza Home Mortgage", short:"PLZ", tier:"Silver", color:"#15467e", products:["Renovation","Jumbo","Reverse","FHA"], status:"Active" },
  { name:"Home Point", short:"HP", tier:"Silver", color:"#1b9d6b", products:["Conventional","FHA","USDA"], status:"Draft" },
  { name:"Angel Oak", short:"AO", tier:"Bronze", color:"#3a6b35", products:["Non-QM","Bank Stmt","DSCR"], status:"Active" },
  { name:"Quontic Wholesale", short:"QW", tier:"Bronze", color:"#0b2a5b", products:["Non-QM","Bank Stmt"], status:"Active" },
];
const vendors = [
  { name:"Advantage Partners Solutions", short:"APS", cat:"Core Partner", offer:"Up to 20% off credit reports", status:"Active" },
  { name:"Ask Mindy", short:"AM", cat:"Origination", offer:"Free for AIME members", status:"Active" },
  { name:"Waive Inspection Fee", short:"WIF", cat:"Origination", offer:"$0 inspection fee on qualifying loans", status:"Active" },
  { name:"Arive", short:"AR", cat:"Origination", offer:"Member pricing on Pro plans", status:"Active" },
  { name:"BrokerVA", short:"BVA", cat:"Coaching", offer:"Waived placement fee", status:"Active" },
  { name:"Cotality", short:"CO", cat:"Origination", offer:"Member-only data bundles", status:"Active" },
  { name:"Direct Authority AI", short:"DAi", cat:"Marketing", offer:"First month free", status:"Active" },
  { name:"Lead Hackers", short:"LH", cat:"Marketing", offer:"Discounted setup", status:"Active" },
  { name:"Xactus", short:"XAC", cat:"Core Partner", offer:"Member pricing on verifications", status:"Active" },
  { name:"The CORE Training", short:"CORE", cat:"Coaching", offer:"Discounted enrollment", status:"Active" },
  { name:"Mortgage Coach", short:"MC", cat:"Coaching", offer:"Free trial + member rate", status:"Draft" },
  { name:"Surefire CRM", short:"SF", cat:"Marketing", offer:"Setup fee waived", status:"Active" },
];
// `collection` assigns a resource to a hub (— = none); `topic` is an optional topic tag.
const resources = [
  { title:"The 'Daily Six' Challenge (Part 3)", type:"Podcast", dur:"28 min", pub:"Jun 20, 2026", collection:"—", topic:"Sales", status:"Active" },
  { title:"Broker to Broker — Episode 251", type:"Podcast", dur:"41 min", pub:"Jun 18, 2026", collection:"—", topic:"—", status:"Active" },
  { title:"Broker Power-Up: Episode 65", type:"Webinar", dur:"52 min", pub:"Jun 15, 2026", collection:"—", topic:"Marketing", status:"Active" },
  { title:"Mortgage Mornings — June 17, 2026", type:"Recording", dur:"35 min", pub:"Jun 17, 2026", collection:"Mortgage Mornings", topic:"—", status:"Active" },
  { title:"Women's Mortgage Network Podcast", type:"Podcast", dur:"33 min", pub:"Jun 12, 2026", collection:"WMN", topic:"—", status:"Active" },
  { title:"Brokers Edge — Core Certification", type:"Certification", dur:"6 modules", pub:"Jun 10, 2026", collection:"Brokers Edge", topic:"—", status:"Active" },
  { title:"Ascent — Leading at Scale", type:"Training", dur:"52 min", pub:"Jun 8, 2026", collection:"Ascent", topic:"—", status:"Active" },
  { title:"Scaling Past $1M in Volume", type:"Training", dur:"47 min", pub:"Jun 2, 2026", collection:"—", topic:"Sales", status:"Active" },
  { title:"Using AI to Pre-Qualify Borrowers", type:"Webinar", dur:"39 min", pub:"Jun 5, 2026", collection:"—", topic:"AI Strategy", status:"Active" },
  { title:"Compliance Corner — Q3 Update", type:"Webinar", dur:"38 min", pub:"Jun 24, 2026", collection:"—", topic:"—", status:"Draft" },
  { title:"Building Your Referral Engine", type:"Training", dur:"45 min", pub:"—", collection:"—", topic:"Marketing", status:"Draft" },
];
// `hub` assigns an event to a hub (— = appears only on the main Events page/calendar).
const events = [
  { title:"AIME Accelerate — Identity Reset", date:"Jun 6, 2026", type:"Virtual", hub:"—", regs:842, status:"Active" },
  { title:"AIME Accelerate — Win the Day", date:"Jun 15, 2026", type:"Virtual", hub:"—", regs:770, status:"Active" },
  { title:"AIME Accelerate — Run Toward It", date:"Jun 22, 2026", type:"Virtual", hub:"—", regs:615, status:"Active" },
  { title:"Mortgage Mornings — Live", date:"Jul 1, 2026", type:"Virtual", hub:"Mortgage Mornings", regs:412, status:"Active" },
  { title:"AIME Accelerate — Compound", date:"Jun 29, 2026", type:"Training", hub:"—", regs:308, status:"Active" },
  { title:"FUSE 2026 — National Conference", date:"Sep 14, 2026", type:"In person", hub:"—", regs:1204, status:"Active" },
  { title:"VIP Quarterly Mastermind", date:"Jul 18, 2026", type:"Virtual", hub:"VIP", regs:64, status:"Active" },
  { title:"WMN Monthly Meetup", date:"Jul 9, 2026", type:"Virtual", hub:"WMN", regs:138, status:"Active" },
  { title:"Regional Mixer — Dallas", date:"Aug 12, 2026", type:"In person", hub:"—", regs:86, status:"Active" },
];

/* ---------- Resource hubs + documents (member-side Hubs & Documents) ---------- */
// Membership tiers, ordered. "All Members" is a special access value meaning everyone.
const tierOptions = ["Premium","Elite","VIP"];
const accessOptions = ["All Members", ...tierOptions];
// `access` is an array: ["All Members"] (everyone) or specific tiers, e.g. ["Elite","VIP"].
const hubs = [
  { name:"Brokers Edge",      kind:"Standard", access:["All Members"], items:4, docs:3, status:"Active" },
  { name:"Mortgage Mornings", kind:"Standard", access:["All Members"], items:4, docs:2, status:"Active" },
  { name:"Accelerate Live",   kind:"Standard", access:["All Members"], items:4, docs:2, status:"Active" },
  { name:"Ascent",            kind:"Standard", access:["VIP"],         items:3, docs:2, status:"Active" },
  { name:"VIP",               kind:"Mixed",    access:["VIP"],         items:2, docs:2, status:"Active" },
  { name:"WMN",               kind:"Mixed",    access:["All Members"], items:2, docs:2, status:"Active" },
];
const exchangeUrl = "https://www.aimegroup.com/";
// source = "General" or a hub name; access controls tier-gating on the member Documents page.
const documents = [
  { title:"AIME Member Handbook",            source:"General",           access:"All members", added:"Jun 1, 2026",  status:"Active" },
  { title:"Loan Escalation Guide",           source:"General",           access:"All members", added:"May 12, 2026", status:"Active" },
  { title:"AIME Brand & Logo Kit",           source:"General",           access:"All members", added:"Apr 2, 2026",  status:"Active" },
  { title:"2026 Membership Agreement",       source:"General",           access:"All members", added:"Jan 1, 2026",  status:"Active" },
  { title:"Brokers Edge Curriculum Guide",   source:"Brokers Edge",      access:"All members", added:"Jun 10, 2026", status:"Active" },
  { title:"Certification Completion Checklist", source:"Brokers Edge",   access:"All members", added:"Jun 10, 2026", status:"Active" },
  { title:"Continuing Education Credit Form",source:"Brokers Edge",      access:"All members", added:"Jun 10, 2026", status:"Active" },
  { title:"Rate Sheet Roundup — This Week",  source:"Mortgage Mornings", access:"All members", added:"Jun 24, 2026", status:"Active" },
  { title:"Show Notes Archive (2026)",       source:"Mortgage Mornings", access:"All members", added:"Jun 1, 2026",  status:"Active" },
  { title:"Accelerate Live — Session Workbook", source:"Accelerate Live", access:"All members", added:"Jun 20, 2026", status:"Active" },
  { title:"Weekly Action Plan Template",     source:"Accelerate Live",   access:"All members", added:"Jun 20, 2026", status:"Active" },
  { title:"WMN Mentorship Program Overview", source:"WMN",               access:"All members", added:"Jun 9, 2026",  status:"Active" },
  { title:"WMN Community Guidelines",        source:"WMN",               access:"All members", added:"May 1, 2026",  status:"Active" },
  { title:"Ascent Workbook — Q3 Cohort",     source:"Ascent",            access:"VIP only",    added:"Jun 8, 2026",  status:"Active" },
  { title:"90-Day Growth Plan Template",     source:"Ascent",            access:"VIP only",    added:"Jun 8, 2026",  status:"Active" },
  { title:"VIP Benefits Guide",              source:"VIP",               access:"VIP only",    added:"Jun 1, 2026",  status:"Active" },
  { title:"Speaking & Feature Opportunities",source:"VIP",               access:"VIP only",    added:"Jun 1, 2026",  status:"Active" },
];
const hubNames = () => hubs.map(h=>h.name);

/* ---------- Members ---------- */
const members = [
  { name:"Kyle Lord", email:"kyle@aimegroup.com", plan:"Elite", billing:"Annual", role:"Broker Owner", state:"FL", licensed:["FL","GA","NC"], used:1, status:"Active", joined:"Jan 14, 2026" },
  { name:"Maria Chen", email:"maria.chen@brightpathmtg.com", plan:"VIP", billing:"Annual", role:"Broker Owner", state:"CA", licensed:["CA","NV","AZ"], used:4, status:"Active", joined:"Jun 22, 2026" },
  { name:"Darnell Ross", email:"dross@summitlending.com", plan:"Premium", billing:"Monthly", role:"Loan Officer", state:"TX", licensed:["TX"], used:0, status:"Active", joined:"Jun 21, 2026" },
  { name:"Priya Nair", email:"priya@nairhomeloans.com", plan:"Elite", billing:"Monthly", role:"Loan Officer", state:"NY", licensed:["NY","NJ"], used:5, status:"Active", joined:"Jun 19, 2026" },
  { name:"Tom Becker", email:"tom@beckerfinancial.com", plan:"Premium", billing:"Monthly", role:"Loan Officer Assistant", state:"GA", licensed:["GA"], used:1, status:"Paused", joined:"Jun 17, 2026" },
  { name:"Alicia Gomez", email:"alicia.gomez@lendwell.com", plan:"VIP", billing:"Annual", role:"Broker Owner", state:"AZ", licensed:["AZ","CA","NV","TX"], used:9, status:"Active", joined:"Jun 14, 2026" },
  { name:"Sam Whitfield", email:"sam@whitfieldmortgage.com", plan:"Elite", billing:"Annual", role:"Loan Officer", state:"NC", licensed:["NC","SC"], used:2, status:"Active", joined:"Jun 11, 2026" },
  { name:"Janet Park", email:"jpark@parklending.com", plan:"Premium", billing:"Monthly", role:"Processor", state:"IL", licensed:["IL"], used:1, status:"Active", joined:"Jun 9, 2026" },
  { name:"Carlos Diaz", email:"carlos@diazcapital.com", plan:"Elite", billing:"Monthly", role:"Broker Owner", state:"WA", licensed:["WA","OR"], used:6, status:"Active", joined:"Jun 5, 2026" },
  { name:"Beth Coleman", email:"beth@colemanloans.com", plan:"Premium", billing:"Monthly", role:"Loan Officer", state:"CO", licensed:["CO"], used:0, status:"Paused", joined:"Jun 2, 2026" },
  { name:"Ahmed Sayed", email:"ahmed@sayedhomeloans.com", plan:"VIP", billing:"Annual", role:"Broker Owner", state:"OH", licensed:["OH","MI","IN"], used:12, status:"Active", joined:"May 28, 2026" },
  { name:"Rachel Stone", email:"rachel@stonemortgage.com", plan:"Elite", billing:"Annual", role:"Loan Officer", state:"NV", licensed:["NV","CA"], used:3, status:"Active", joined:"May 24, 2026" },
];
const planTotal = { Premium:1, Elite:6, VIP:"∞" };
const membershipBreakdown = [
  { plan:"Premium", count:1910, seg:"mseg-premium", dot:"var(--cyan)" },
  { plan:"Elite",   count:712,  seg:"mseg-elite",   dot:"var(--pink)" },
  { plan:"VIP",     count:225,  seg:"mseg-vip",     dot:"var(--navy)" },
];
const totalMembers = 2847;

/* ---------- Requests & submissions ---------- */
const reqTypeMeta = {
  "Escalation":        { ico:'<path d="M12 9v4M12 17h0M10.3 3.9l-8 14A2 2 0 004 21h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0z"/>', cls:"i-pink" },
  "Lender connection": { ico:'<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>', cls:"i-cyan" },
  "Change AE":         { ico:'<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6"/>', cls:"i-navy" },
  "Support":           { ico:'<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>', cls:"i-cyan" },
  "Bug":               { ico:'<rect x="8" y="6" width="8" height="13" rx="4"/><path d="M12 6V3M8 11H3M16 11h5"/>', cls:"i-pink" },
};
const requests = [
  { type:"Escalation", member:"Maria Chen", detail:"UWM · Loan #100482910 — appraisal delay", date:"2h ago", status:"New" },
  { type:"Lender connection", member:"Darnell Ross", detail:"Requested intro to EPM", date:"4h ago", status:"New" },
  { type:"Bug", member:"Priya Nair", detail:"Market filter not updating on Safari", date:"5h ago", status:"New" },
  { type:"Change AE", member:"Tom Becker", detail:"UWM — AE unresponsive", date:"Yesterday", status:"In progress" },
  { type:"Support", member:"Sam Whitfield", detail:"Can't update billing card", date:"Yesterday", status:"New" },
  { type:"Escalation", member:"Carlos Diaz", detail:"Newrez · Loan #100471552 — CD error", date:"2d ago", status:"In progress" },
  { type:"Lender connection", member:"Janet Park", detail:"Requested intro to Newfi", date:"2d ago", status:"Resolved" },
  { type:"Support", member:"Alicia Gomez", detail:"Question about VIP escalations", date:"3d ago", status:"Resolved" },
  { type:"Escalation", member:"Ahmed Sayed", detail:"EPM · Loan #100460318 — UW conditions", date:"3d ago", status:"New" },
  { type:"Bug", member:"Rachel Stone", detail:"Logo overlaps banner on mobile", date:"4d ago", status:"In progress" },
];

/* ---------- Analytics records ---------- */
const escalationRecords = [
  { member:"Maria Chen", lender:"United Wholesale Mortgage", loan:"100482910", date:"Jun 24, 2026", status:"In review" },
  { member:"Carlos Diaz", lender:"Newrez Wholesale", loan:"100471552", date:"Jun 22, 2026", status:"Lender responded" },
  { member:"Ahmed Sayed", lender:"EPM", loan:"100460318", date:"Jun 21, 2026", status:"New" },
  { member:"Priya Nair", lender:"United Wholesale Mortgage", loan:"100455201", date:"Jun 19, 2026", status:"Resolved" },
  { member:"Sam Whitfield", lender:"Windsor Mortgage", loan:"100451090", date:"Jun 18, 2026", status:"In review" },
  { member:"Kyle Lord", lender:"United Wholesale Mortgage", loan:"100448817", date:"Jun 16, 2026", status:"Resolved" },
  { member:"Rachel Stone", lender:"EPM", loan:"100442204", date:"Jun 14, 2026", status:"Resolved" },
  { member:"Alicia Gomez", lender:"Newrez Wholesale", loan:"100439912", date:"Jun 12, 2026", status:"In review" },
  { member:"Janet Park", lender:"Newfi Wholesale", loan:"100431774", date:"Jun 10, 2026", status:"Resolved" },
  { member:"Darnell Ross", lender:"United Wholesale Mortgage", loan:"100428650", date:"Jun 8, 2026", status:"Resolved" },
  { member:"Maria Chen", lender:"Cake Mortgage", loan:"100421039", date:"Jun 5, 2026", status:"Resolved" },
  { member:"Tom Becker", lender:"EPM", loan:"100417788", date:"Jun 3, 2026", status:"Resolved" },
];
const connectionRecords = [
  { member:"Darnell Ross", partner:"EPM", kind:"Lender", date:"Jun 24, 2026", status:"Sent" },
  { member:"Janet Park", partner:"Newfi Wholesale", kind:"Lender", date:"Jun 23, 2026", status:"Connected" },
  { member:"Priya Nair", partner:"Advantage Partners Solutions", kind:"Vendor", date:"Jun 22, 2026", status:"Connected" },
  { member:"Sam Whitfield", partner:"United Wholesale Mortgage", kind:"Lender", date:"Jun 20, 2026", status:"Sent" },
  { member:"Kyle Lord", partner:"Arive", kind:"Vendor", date:"Jun 19, 2026", status:"Connected" },
  { member:"Alicia Gomez", partner:"Surefire CRM", kind:"Vendor", date:"Jun 17, 2026", status:"Connected" },
  { member:"Carlos Diaz", partner:"Newrez Wholesale", kind:"Lender", date:"Jun 15, 2026", status:"Connected" },
  { member:"Rachel Stone", partner:"BrokerVA", kind:"Vendor", date:"Jun 13, 2026", status:"Sent" },
  { member:"Ahmed Sayed", partner:"United Wholesale Mortgage", kind:"Lender", date:"Jun 11, 2026", status:"Connected" },
  { member:"Maria Chen", partner:"The CORE Training", kind:"Vendor", date:"Jun 9, 2026", status:"Connected" },
  { member:"Beth Coleman", partner:"EPM", kind:"Lender", date:"Jun 6, 2026", status:"Sent" },
];

/* ---------- FUSE registrations ---------- */
const fuseTicketTypes = ["General Admission","GA Plus","VIP"];
const fuseAddons = ["Hall of AIME","WMN at FUSE","Vetted VA","VIP Luncheon"];
const fuseRegs = [
  { member:"Kyle Lord", email:"kyle@aimegroup.com", tier:"Elite", claimed:true, ticket:"General Admission", addons:["WMN at FUSE","Vetted VA"], guest:"—", status:"Confirmed" },
  { member:"Maria Chen", email:"maria.chen@brightpathmtg.com", tier:"VIP", claimed:true, ticket:"VIP", addons:["Hall of AIME","VIP Luncheon"], guest:"1 guest", status:"Confirmed" },
  { member:"Alicia Gomez", email:"alicia.gomez@lendwell.com", tier:"VIP", claimed:true, ticket:"VIP", addons:["Hall of AIME"], guest:"1 guest", status:"Confirmed" },
  { member:"Ahmed Sayed", email:"ahmed@sayedhomeloans.com", tier:"VIP", claimed:true, ticket:"VIP", addons:["Hall of AIME","WMN at FUSE","VIP Luncheon"], guest:"2 guests", status:"Confirmed" },
  { member:"Priya Nair", email:"priya@nairhomeloans.com", tier:"Elite", claimed:true, ticket:"GA Plus", addons:["WMN at FUSE"], guest:"—", status:"Confirmed" },
  { member:"Carlos Diaz", email:"carlos@diazcapital.com", tier:"Elite", claimed:true, ticket:"General Admission", addons:["Vetted VA"], guest:"—", status:"Confirmed" },
  { member:"Sam Whitfield", email:"sam@whitfieldmortgage.com", tier:"Elite", claimed:false, ticket:"—", addons:[], guest:"—", status:"Not claimed" },
  { member:"Janet Park", email:"jpark@parklending.com", tier:"Premium", claimed:true, ticket:"General Admission", addons:["Hall of AIME"], guest:"1 guest", status:"Confirmed" },
  { member:"Rachel Stone", email:"rachel@stonemortgage.com", tier:"Elite", claimed:false, ticket:"—", addons:[], guest:"—", status:"Not claimed" },
  { member:"Darnell Ross", email:"dross@summitlending.com", tier:"Premium", claimed:true, ticket:"GA Plus", addons:["WMN at FUSE","Vetted VA"], guest:"—", status:"Confirmed" },
];

/* ---------- Featured (curated for the member home screen) ---------- */
let featuredItems = [
  { kind:"Lender",   item:"Newrez Wholesale",                note:"Just joined as a Gold partner" },
  { kind:"Resource", item:"AIME Accelerate — Identity Reset", note:"New training added" },
  { kind:"Market",   item:"Waive Inspection Fee",            note:"New member deal" },
  { kind:"Event",    item:"FUSE 2026",                       note:"Tickets on sale now" },
];
const kindBadge = { Lender:"badge-navy", Resource:"badge-pink", Market:"badge-cyan", Event:"badge-amber" };

/* ---------- Team access (Super Admins / Admins) ---------- */
const currentAdmin = { name:"AIME Team", role:"Super Admin" };
const admins = [
  { name:"AIME Team",   email:"admin@aimegroup.com",  role:"Super Admin", active:"Just now",  status:"Active" },
  { name:"Jordan Blake",email:"jordan@aimegroup.com", role:"Admin",       active:"2h ago",    status:"Active" },
  { name:"Sofia Marin", email:"sofia@aimegroup.com",  role:"Admin",       active:"Yesterday", status:"Active" },
  { name:"Wes Carter",  email:"wes@aimegroup.com",    role:"Super Admin", active:"3d ago",    status:"Active" },
  { name:"Lena Brooks", email:"lena@aimegroup.com",   role:"Admin",       active:"—",         status:"Invited" },
];

/* ---------- Engagement (last 30 days) ---------- */
const engResources = [
  { name:"Broker to Broker — Episode 251", sub:"Podcast", val:1840 },
  { name:"AIME Accelerate — Identity Reset", sub:"Training", val:1520 },
  { name:"Broker Power-Up: Episode 65", sub:"Webinar", val:1190 },
  { name:"Mortgage Mornings — June 17", sub:"Webinar", val:980 },
  { name:"The 'Daily Six' Challenge (Part 3)", sub:"Podcast", val:760 },
];
const engLenders = [
  { name:"United Wholesale Mortgage", sub:"42 escalations", val:1240 },
  { name:"EPM", sub:"21 escalations", val:720 },
  { name:"Newrez Wholesale", sub:"18 escalations", val:540 },
  { name:"Windsor Mortgage", sub:"7 escalations", val:360 },
  { name:"Newfi Wholesale", sub:"9 escalations", val:290 },
];
const engVendors = [
  { name:"Advantage Partners Solutions", sub:"Core Partner", val:418 },
  { name:"Arive", sub:"Origination", val:362 },
  { name:"Surefire CRM", sub:"Marketing", val:291 },
  { name:"BrokerVA", sub:"Coaching", val:205 },
  { name:"Direct Authority AI", sub:"Marketing", val:188 },
];
const engEscalations = [
  { name:"United Wholesale Mortgage", val:42 },
  { name:"EPM", val:21 },
  { name:"Newrez Wholesale", val:18 },
  { name:"Newfi Wholesale", val:9 },
  { name:"Windsor Mortgage", val:7 },
];

/* ---------- Revenue & subscriptions (synced with Stripe in production) ---------- */
const revenueKpis = { mrr:"$84.2K", arr:"$1.01M", activeSubs:"2,710", arpu:"$31.07", pastDueAmt:"$1,840" };
const revenueTrend = [ // MRR by month
  { label:"Nov", val:61000 }, { label:"Dec", val:64000 }, { label:"Jan", val:68000 },
  { label:"Feb", val:71200 }, { label:"Mar", val:74100 }, { label:"Apr", val:78300 },
  { label:"May", val:81200 }, { label:"Jun", val:84200 },
];
const subscriptions = [
  { member:"Kyle Lord", email:"kyle@aimegroup.com", plan:"Elite", billing:"Annual", amount:"$699/yr", status:"Active", next:"Jan 14, 2027" },
  { member:"Maria Chen", email:"maria.chen@brightpathmtg.com", plan:"VIP", billing:"Annual", amount:"$1,699/yr", status:"Active", next:"Jun 22, 2027" },
  { member:"Darnell Ross", email:"dross@summitlending.com", plan:"Premium", billing:"Monthly", amount:"$19.99/mo", status:"Active", next:"Jul 21, 2026" },
  { member:"Priya Nair", email:"priya@nairhomeloans.com", plan:"Elite", billing:"Monthly", amount:"$69.99/mo", status:"Past due", next:"Jun 19, 2026" },
  { member:"Tom Becker", email:"tom@beckerfinancial.com", plan:"Premium", billing:"Monthly", amount:"$19.99/mo", status:"Past due", next:"Jun 17, 2026" },
  { member:"Alicia Gomez", email:"alicia.gomez@lendwell.com", plan:"VIP", billing:"Annual", amount:"$1,699/yr", status:"Active", next:"Jun 14, 2027" },
  { member:"Sam Whitfield", email:"sam@whitfieldmortgage.com", plan:"Elite", billing:"Annual", amount:"$699/yr", status:"Active", next:"Jun 11, 2027" },
  { member:"Janet Park", email:"jpark@parklending.com", plan:"Premium", billing:"Monthly", amount:"$19.99/mo", status:"Active", next:"Jul 9, 2026" },
  { member:"Carlos Diaz", email:"carlos@diazcapital.com", plan:"Elite", billing:"Monthly", amount:"$69.99/mo", status:"Active", next:"Jul 5, 2026" },
  { member:"Beth Coleman", email:"beth@colemanloans.com", plan:"Premium", billing:"Monthly", amount:"$19.99/mo", status:"Canceled", next:"—" },
  { member:"Ahmed Sayed", email:"ahmed@sayedhomeloans.com", plan:"VIP", billing:"Annual", amount:"$1,699/yr", status:"Active", next:"May 28, 2027" },
  { member:"Rachel Stone", email:"rachel@stonemortgage.com", plan:"Elite", billing:"Annual", amount:"$699/yr", status:"Past due", next:"May 24, 2026" },
  { member:"Greg Mason", email:"greg@masonlending.com", plan:"Elite", billing:"Monthly", amount:"$69.99/mo", status:"Trialing", next:"Trial ends Jul 2" },
  { member:"Tina Alvarez", email:"tina@alvarezhomeloans.com", plan:"Premium", billing:"Monthly", amount:"$19.99/mo", status:"Trialing", next:"Trial ends Jul 5" },
];

/* ---------- Abandoned carts (contact captured before checkout completed) ---------- */
const abandonedCarts = [
  { name:"Brandon Mills", email:"brandon@millsmortgage.com", plan:"Elite", billing:"Monthly", amount:"$69.99/mo", step:"Checkout started", captured:"2h ago" },
  { name:"Nina Patel", email:"nina@patellending.com", plan:"VIP", billing:"Annual", amount:"$1,699/yr", step:"Contact captured", captured:"5h ago" },
  { name:"Derek Stone", email:"derek@stonecapital.com", plan:"Premium", billing:"Monthly", amount:"$19.99/mo", step:"Payment failed", captured:"Yesterday" },
  { name:"Olivia Reed", email:"olivia@reedhomeloans.com", plan:"Elite", billing:"Annual", amount:"$699/yr", step:"Checkout started", captured:"Yesterday" },
  { name:"Marcus Lee", email:"marcus@leefinancial.com", plan:"Premium", billing:"Monthly", amount:"$19.99/mo", step:"Contact captured", captured:"2d ago" },
  { name:"Sara Kim", email:"sara@kimmortgage.com", plan:"VIP", billing:"Monthly", amount:"$199.99/mo", step:"Checkout started", captured:"2d ago" },
  { name:"Hector Ramirez", email:"hector@ramirezloans.com", plan:"Elite", billing:"Monthly", amount:"$69.99/mo", step:"Payment failed", captured:"3d ago" },
  { name:"Lauren Wells", email:"lauren@wellslending.com", plan:"Premium", billing:"Annual", amount:"$199/yr", step:"Contact captured", captured:"4d ago" },
];

/* ---------- Coupons (sync to Stripe) ---------- */
let coupons = [
  { code:"FUSE2026", desc:"FUSE early-bird — 20% off annual", dtype:"Percent", value:"20", uses:142, maxUses:"500", start:"Jun 1, 2026", end:"Sep 1, 2026", status:"Active" },
  { code:"WELCOME10", desc:"New member welcome — 10% off", dtype:"Percent", value:"10", uses:880, maxUses:"∞", start:"Jan 1, 2026", end:"—", status:"Active" },
  { code:"VIP50", desc:"VIP upgrade — $50 off", dtype:"Amount", value:"50", uses:36, maxUses:"200", start:"May 1, 2026", end:"Aug 1, 2026", status:"Active" },
  { code:"WMN2026", desc:"Women's Mortgage Network — 15% off", dtype:"Percent", value:"15", uses:64, maxUses:"300", start:"Mar 1, 2026", end:"Dec 31, 2026", status:"Active" },
  { code:"BROKER25", desc:"Broker referral — 25% off first year", dtype:"Percent", value:"25", uses:210, maxUses:"1000", start:"Feb 1, 2026", end:"—", status:"Active" },
  { code:"SUMMER199", desc:"Summer promo — $199 off VIP annual", dtype:"Amount", value:"199", uses:18, maxUses:"100", start:"Jun 15, 2026", end:"Jul 15, 2026", status:"Paused" },
  { code:"RENEW5", desc:"Loyalty renewal — 5% off", dtype:"Percent", value:"5", uses:412, maxUses:"∞", start:"Jan 1, 2026", end:"—", status:"Active" },
];

/* ---------- Notifications (admin broadcasts) ---------- */
const sentNotifications = [
  { title:"New Gold partner: Newrez Wholesale", audience:"All members", type:"Announcement", sent:"2h ago", recipients:"2,847" },
  { title:"FUSE early-bird ends Sept 1", audience:"Elite + VIP", type:"Promotion", sent:"Yesterday", recipients:"937" },
  { title:"New training: Scaling Past $1M in Volume", audience:"All members", type:"Update", sent:"3d ago", recipients:"2,847" },
  { title:"VIP Luncheon seats filling up", audience:"VIP only", type:"Info", sent:"5d ago", recipients:"225" },
  { title:"Mortgage Mornings is live now", audience:"All members", type:"Info", sent:"1w ago", recipients:"2,847" },
];

/* ---------- Analytics trends (live between dashboard snapshot & engagement) ---------- */
const growthTrend = [
  { month:"Jan", joined:201, churned:34 }, { month:"Feb", joined:188, churned:41 },
  { month:"Mar", joined:223, churned:38 }, { month:"Apr", joined:245, churned:52 },
  { month:"May", joined:268, churned:44 }, { month:"Jun", joined:291, churned:49 },
];
const acquisition = [ // val = new members per ~30 days (scaled by the selected range)
  { name:"Referral", sub:"38%", val:96 },
  { name:"FUSE & events", sub:"22%", val:54 },
  { name:"Paid social", sub:"18%", val:44 },
  { name:"Email", sub:"12%", val:30 },
  { name:"Partner co-marketing", sub:"10%", val:24 },
];
const engBase = { plays:9418, connections:1832, lenderViews:3047, escalations:426 }; // per 30 days
const funnel = [
  { label:"Signups started", val:1000 },
  { label:"Contact captured", val:720 },
  { label:"Checkout started", val:540 },
  { label:"Paid", val:432 },
  { label:"Onboarded", val:410 },
];

/* ============================================================
   Helpers
   ============================================================ */
const $ = (id) => document.getElementById(id);
const initials = (name) => name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
const statusPill = (s) => {
  const map = { Active:"badge-green", Draft:"badge-amber", Paused:"badge-navy",
    New:"badge-pink", "In progress":"badge-amber", Resolved:"badge-green",
    Confirmed:"badge-green", "Not claimed":"badge-amber",
    "In review":"badge-amber", "Lender responded":"badge-cyan", Sent:"badge-cyan", Connected:"badge-green",
    "Past due":"badge-red", Trialing:"badge-cyan", Canceled:"badge-navy",
    "Contact captured":"badge-cyan", "Checkout started":"badge-amber", "Payment failed":"badge-red" };
  return `<span class="badge ${map[s]||'badge-navy'}">${s}</span>`;
};
const subDot = (s) => `<span class="dot-status dot-${s.toLowerCase().replace(/\s+/g,'')}">${s}</span>`;
const editBtn = (ref) => `<button class="icon-act" data-edit="${ref}" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg></button>`;
const delBtn = (msg) => `<button class="icon-act danger" data-toast="${msg}" title="Remove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg></button>`;

/* ============================================================
   Render: tables
   ============================================================ */
function renderMembers(){
  const q = ($('member-search').value || '').toLowerCase();
  const plan = $('member-plan').value, status = $('member-status').value;
  const role = $('member-role').value, state = $('member-state').value;
  const lic = $('member-licensed').value, billing = $('member-billing').value;
  const rows = members.filter(m =>
    (m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)) &&
    (plan==='all' || m.plan===plan) && (status==='all' || m.status===status) &&
    (role==='all' || m.role===role) && (state==='all' || m.state===state) &&
    (lic==='all' || m.licensed.includes(lic)) && (billing==='all' || m.billing===billing));
  $('members-tbody').innerHTML = rows.map((m,i) => {
    const idx = members.indexOf(m);
    const tot = planTotal[m.plan];
    return `<tr>
      <td><div class="t-id"><div class="t-avatar">${initials(m.name)}</div><div><div class="t-strong">${m.name}</div><div class="t-sub">${m.email} · ${m.state}</div></div></div></td>
      <td>${m.role}</td>
      <td><span class="badge ${m.plan==='VIP'?'badge-navy':m.plan==='Elite'?'badge-pink':'badge-cyan'}">${m.plan}</span><div class="t-sub" style="margin-top:3px">${m.billing}</div></td>
      <td>${m.used} <span class="t-sub" style="display:inline">/ ${tot} used</span></td>
      <td><span class="dot-status dot-${m.status.toLowerCase()}">${m.status}</span></td>
      <td>${m.joined}</td>
      <td class="t-right"><div class="row-actions"><button class="link-act" data-edit="member:${idx}">Manage</button></div></td>
    </tr>`;
  }).join('');
  $('member-count').textContent = `${rows.length} of ${members.length} members`;
}
function fillMemberFilters(){
  const uniq = (arr) => [...new Set(arr)].sort();
  const opt = (v) => `<option value="${v}">${v}</option>`;
  $('member-role').innerHTML = '<option value="all">All roles</option>' + uniq(members.map(m=>m.role)).map(opt).join('');
  $('member-state').innerHTML = '<option value="all">All mailing states</option>' + uniq(members.map(m=>m.state)).map(opt).join('');
  $('member-licensed').innerHTML = '<option value="all">All licensed states</option>' + uniq(members.flatMap(m=>m.licensed)).map(opt).join('');
}
function renderLenders(){
  $('lenders-tbody').innerHTML = lenders.map((l,i)=>`<tr>
    <td><div class="t-id"><div class="t-logo" style="color:${l.color}">${l.short}</div><div class="t-strong">${l.name}</div></div></td>
    <td><span class="badge ${tierBadge[l.tier]}">${l.tier}</span></td>
    <td><span class="t-sub" style="display:inline;color:var(--ink-soft)">${l.products.join(', ')}</span></td>
    <td><span class="dot-status dot-${l.status.toLowerCase()}">${l.status}</span></td>
    <td class="t-right"><div class="row-actions">${editBtn('lender:'+i)}${delBtn('Removed '+l.name+'.')}</div></td>
  </tr>`).join('');
  $('lender-count').textContent = `${lenders.length} lenders`;
}
function renderVendors(){
  $('vendors-tbody').innerHTML = vendors.map((v,i)=>`<tr>
    <td><div class="t-id"><div class="t-logo">${v.short}</div><div class="t-strong">${v.name}</div></div></td>
    <td><span class="badge badge-navy">${v.cat}</span></td>
    <td>${v.offer}</td>
    <td><span class="dot-status dot-${v.status.toLowerCase()}">${v.status}</span></td>
    <td class="t-right"><div class="row-actions">${editBtn('vendor:'+i)}${delBtn('Removed '+v.name+'.')}</div></td>
  </tr>`).join('');
  $('vendor-count').textContent = `${vendors.length} vendors`;
}
const collTag = (v) => (!v || v==='—') ? '<span class="t-sub" style="display:inline;color:var(--muted)">—</span>' : `<span class="badge badge-navy">${v}</span>`;
function renderResources(){
  $('resources-tbody').innerHTML = resources.map((r,i)=>`<tr>
    <td class="t-strong">${r.title}${(r.topic&&r.topic!=='—')?` <span class="badge badge-cyan" style="font-weight:600">${r.topic}</span>`:''}</td>
    <td><span class="badge badge-cyan">${r.type}</span></td>
    <td>${collTag(r.collection)}</td>
    <td>${r.dur}</td>
    <td>${r.pub}</td>
    <td><span class="dot-status dot-${r.status.toLowerCase()}">${r.status}</span></td>
    <td class="t-right"><div class="row-actions">${editBtn('resource:'+i)}${delBtn('Removed resource.')}</div></td>
  </tr>`).join('');
  $('resource-count').textContent = `${resources.length} resources`;
}
function renderEvents(){
  $('events-tbody').innerHTML = events.map((e,i)=>`<tr>
    <td class="t-strong">${e.title}</td>
    <td>${e.date}</td>
    <td><span class="badge badge-amber">${e.type}</span></td>
    <td>${collTag(e.hub)}</td>
    <td>${e.regs.toLocaleString()}</td>
    <td><span class="dot-status dot-${e.status.toLowerCase()}">${e.status}</span></td>
    <td class="t-right"><div class="row-actions">${editBtn('event:'+i)}${delBtn('Removed event.')}</div></td>
  </tr>`).join('');
  $('event-count').textContent = `${events.length} events`;
}
const accessBadge = (a) => a==='VIP only'
  ? `<span class="badge" style="background:#fbf0d8;color:#9a6a05">VIP only</span>`
  : `<span class="badge badge-navy">All members</span>`;
// Hubs use an array of tiers (or ["All Members"]). Render one badge per audience.
function accessTags(access){
  const arr = Array.isArray(access) ? access : [access];
  if(arr.includes('All Members')) return `<span class="badge badge-navy">All members</span>`;
  return arr.map(t => t==='VIP'
    ? `<span class="badge" style="background:#fbf0d8;color:#9a6a05">VIP</span>`
    : `<span class="badge badge-navy">${t}</span>`).join(' ') || `<span class="t-sub" style="display:inline;color:var(--muted)">No access set</span>`;
}
function renderHubs(){
  $('hubs-tbody').innerHTML = hubs.map((h,i)=>`<tr>
    <td class="t-strong">${h.name}</td>
    <td><span class="badge ${h.kind==='Mixed'?'badge-amber':'badge-cyan'}">${h.kind}</span></td>
    <td>${accessTags(h.access)}</td>
    <td>${h.items} item${h.items===1?'':'s'}</td>
    <td>${h.docs} doc${h.docs===1?'':'s'}</td>
    <td><span class="dot-status dot-${h.status.toLowerCase()}">${h.status}</span></td>
    <td class="t-right"><div class="row-actions">${editBtn('hub:'+i)}${delBtn('Removed '+h.name+' hub.')}</div></td>
  </tr>`).join('');
  $('hub-count').textContent = `${hubs.length} hubs`;
  const ex = $('exchange-url'); if(ex) ex.value = exchangeUrl;
}
function renderDocuments(){
  const active = document.querySelector('#document-filters .chip.active');
  const f = active ? active.dataset.filter : 'all';
  const rows = documents.map((d,i)=>({d,i})).filter(o => f==='all' || o.d.source===f);
  $('documents-tbody').innerHTML = rows.map(({d,i})=>`<tr>
    <td class="t-strong">${d.title}</td>
    <td>${d.source==='General' ? '<span class="t-sub" style="display:inline;color:var(--ink-soft)">General</span>' : `<span class="badge badge-navy">${d.source}</span>`}</td>
    <td>${accessBadge(d.access)}</td>
    <td>${d.added}</td>
    <td><span class="dot-status dot-${d.status.toLowerCase()}">${d.status}</span></td>
    <td class="t-right"><div class="row-actions">${editBtn('document:'+i)}${delBtn('Removed document.')}</div></td>
  </tr>`).join('');
  $('document-count').textContent = `${rows.length} of ${documents.length} documents`;
}
function renderRequests(){
  const active = document.querySelector('#request-filters .chip.active');
  const f = active ? active.dataset.filter : 'all';
  const rows = requests.map((r,i)=>({r,i})).filter(o => f==='all' || o.r.type===f);
  $('requests-tbody').innerHTML = rows.map(({r,i})=>{
    const m = reqTypeMeta[r.type];
    return `<tr>
      <td><span class="req-type"><span class="rt-ico ${m.cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${m.ico}</svg></span>${r.type}</span></td>
      <td class="t-strong">${r.member}</td>
      <td>${r.detail}</td>
      <td>${r.date}</td>
      <td>${statusPill(r.status)}</td>
      <td class="t-right"><div class="row-actions"><button class="link-act" data-request="${i}">Review</button></div></td>
    </tr>`;
  }).join('');
  const pending = requests.filter(r=>r.status!=='Resolved').length;
  $('request-count').textContent = `${rows.length} shown · ${pending} pending`;
}
function renderFuse(){
  const q = ($('fuse-search')?.value || '').toLowerCase();
  const tk = $('fuse-ticket') ? $('fuse-ticket').value : 'all';
  const ad = $('fuse-addon') ? $('fuse-addon').value : 'all';
  const tr = $('fuse-tier') ? $('fuse-tier').value : 'all';
  const tierBadge = (t) => t==='VIP'?'badge-navy':t==='Elite'?'badge-pink':'badge-cyan';
  const rows = fuseRegs.filter(f =>
    (f.member.toLowerCase().includes(q) || (f.email||'').toLowerCase().includes(q)) &&
    (tk==='all' || f.ticket===tk) &&
    (ad==='all' || f.addons.includes(ad)) &&
    (tr==='all' || f.tier===tr));
  $('fuse-tbody').innerHTML = rows.map(f=>`<tr>
    <td><div class="t-id"><div class="t-avatar">${initials(f.member)}</div><div><div class="t-strong">${f.member}</div><div class="t-sub">${f.email||''}</div></div></div></td>
    <td><span class="badge ${tierBadge(f.tier)}">${f.tier}</span></td>
    <td>${f.ticket==='—' ? '<span class="t-sub" style="display:inline">—</span>' : f.ticket}</td>
    <td>${f.addons.length? f.addons.join(', ') : '<span class="t-sub" style="display:inline">None</span>'}</td>
    <td>${f.guest}</td>
    <td>${statusPill(f.status)}</td>
    <td class="t-right"><div class="row-actions"><button class="link-act" data-toast="Opening ${f.member}'s registration…">View</button></div></td>
  </tr>`).join('');
  if($('fuse-count')) $('fuse-count').textContent = `${rows.length} of ${fuseRegs.length} attendees`;
}

/* ---------- Featured ---------- */
function renderFeatured(){
  $('featured-tbody').innerHTML = featuredItems.map((f,i)=>`<tr>
    <td><strong>${i+1}</strong></td>
    <td><span class="badge ${kindBadge[f.kind]}">${f.kind}</span></td>
    <td class="t-strong">${f.item}</td>
    <td><span class="t-sub" style="display:inline">${f.note||''}</span></td>
    <td class="t-right"><div class="row-actions">
      <button class="icon-act" data-feat-move="${i}:-1" title="Move up"${i===0?' disabled':''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg></button>
      <button class="icon-act" data-feat-move="${i}:1" title="Move down"${i===featuredItems.length-1?' disabled':''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>
      <button class="icon-act danger" data-feat-remove="${i}" title="Remove from Featured"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
    </div></td>
  </tr>`).join('');
}
function moveFeatured(i, dir){
  const j = i + dir; if(j<0 || j>=featuredItems.length) return;
  [featuredItems[i], featuredItems[j]] = [featuredItems[j], featuredItems[i]];
  renderFeatured(); showToast('Featured order updated.');
}
function removeFeatured(i){ const f = featuredItems[i]; featuredItems.splice(i,1); renderFeatured(); showToast(`Removed "${f.item}" from Featured.`); }

/* ---------- Team access ---------- */
function renderTeam(){
  const isSuper = currentAdmin.role === 'Super Admin';
  $('add-admin-btn').style.display = isSuper ? '' : 'none';
  $('team-tbody').innerHTML = admins.map((a,i)=>{
    const you = a.name === currentAdmin.name;
    const roleCls = a.role==='Super Admin' ? 'badge-pink' : 'badge-navy';
    return `<tr>
      <td><div class="t-id"><div class="t-avatar">${initials(a.name)}</div><div><div class="t-strong">${a.name}${you?' <span class="badge badge-cyan" style="margin-left:4px">You</span>':''}</div><div class="t-sub">${a.email}</div></div></div></td>
      <td><span class="badge ${roleCls}">${a.role}</span></td>
      <td>${a.active}</td>
      <td><span class="dot-status dot-${a.status==='Active'?'active':'draft'}">${a.status}</span></td>
      <td class="t-right"><div class="row-actions">${(isSuper && !you) ? editBtn('admin:'+i)+delBtn(`Removed ${a.name}'s access.`) : '<span class="t-sub" style="display:inline">—</span>'}</div></td>
    </tr>`;
  }).join('');
}

/* ---------- Engagement ---------- */
function rankList(items, color){
  const max = Math.max(...items.map(i=>i.val), 1);
  return items.map(i=>`
    <div class="eng-row">
      <div class="eng-info"><div class="eng-name">${i.name}</div>${i.sub?`<div class="t-sub">${i.sub}</div>`:''}</div>
      <div class="eng-bar"><span style="width:${(i.val/max*100).toFixed(0)}%;background:${color}"></span></div>
      <div class="eng-val">${i.val.toLocaleString()}</div>
    </div>`).join('');
}
function renderEngagement(){
  const f = ranges.engagement.days/30, lbl = ranges.engagement.label;
  const set = (id,v) => { if($(id)) $(id).textContent = Math.round(v).toLocaleString(); };
  set('eng-s-plays', engBase.plays*f);
  set('eng-s-connections', engBase.connections*f);
  set('eng-s-lenders', engBase.lenderViews*f);
  set('eng-s-escalations', engBase.escalations*f);
  $('eng-resources').innerHTML = rankList(scaleList(engResources, f), 'var(--pink)');
  $('eng-lenders').innerHTML = rankList(scaleList(engLenders, f), 'var(--navy)');
  $('eng-vendors').innerHTML = rankList(scaleList(engVendors, f), 'var(--cyan)');
  $('eng-escalations').innerHTML = rankList(scaleList(engEscalations, f), 'var(--amber)');
  if($('eng-range-note')) $('eng-range-note').textContent = lbl;
}

/* ---------- Chart helpers (CSS-only) ---------- */
function colChart(items, color, fmt){
  const max = Math.max(...items.map(i=>i.val), 1);
  return `<div class="col-chart">${items.map(i=>`
    <div class="col-item">
      <div class="col-v">${fmt?fmt(i.val):i.val.toLocaleString()}</div>
      <div class="col-bar-wrap"><span class="col-bar" style="height:${(i.val/max*100).toFixed(0)}%;background:${color}"></span></div>
      <div class="col-x">${i.label}</div>
    </div>`).join('')}</div>`;
}
function growthChart(items){
  const max = Math.max(...items.flatMap(i=>[i.joined,i.churned]), 1);
  return `<div class="col-chart">${items.map(i=>`
    <div class="col-item">
      <div class="col-bar-wrap dual">
        <span class="col-bar" style="height:${(i.joined/max*100).toFixed(0)}%;background:var(--green)" title="${i.joined} new"></span>
        <span class="col-bar" style="height:${(i.churned/max*100).toFixed(0)}%;background:var(--red)" title="${i.churned} churned"></span>
      </div>
      <div class="col-x">${i.month}</div>
    </div>`).join('')}</div>`;
}
function funnelChart(items){
  const top = items[0].val;
  return `<div class="funnel">${items.map((i,idx)=>`
    <div class="funnel-row">
      <div class="funnel-label">${i.label}</div>
      <div class="funnel-track"><span class="funnel-fill" style="width:${(i.val/top*100).toFixed(0)}%"></span><span class="funnel-num">${i.val.toLocaleString()}</span></div>
      <div class="funnel-pct">${idx===0?'—':(i.val/items[idx-1].val*100).toFixed(0)+'%'}</div>
    </div>`).join('')}</div>`;
}

/* ============================================================
   Date range (Analytics & Engagement) — default last 30 days
   ============================================================ */
const TODAY = new Date('2026-06-25T00:00:00');
const MONTH_LABELS = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun']; // ends current month
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
// scope state — { days, label, from, to }
const ranges = {
  analytics: { days:30, label:'Last 30 days', from:null, to:null },
  engagement:{ days:30, label:'Last 30 days', from:null, to:null },
  reports:   { days:36500, label:'All time', from:null, to:null }, // default all time
};
function presetCfg(v){
  switch(v){
    case '7d':  return { days:7,   label:'Last 7 days' };
    case '90d': return { days:90,  label:'Last 90 days' };
    case 'ytd': return { days:175, label:'Year to date' };
    case 'all': return { days:365, label:'All time' };
    default:    return { days:30,  label:'Last 30 days' };
  }
}
function rangeBuckets(days){
  const factor = days/30;
  if(days<=10)  return { factor, gran:'day',   n:Math.min(7, days) || 7 };
  if(days<=45)  return { factor, gran:'week',  n:Math.max(2, Math.round(days/7)) };
  return { factor, gran:'month', n:Math.min(12, Math.max(2, Math.round(days/30))) };
}
function bucketLabels(b){
  if(b.gran==='day')  return DAY_LABELS.slice(0, b.n);
  if(b.gran==='week') return Array.from({length:b.n}, (_,i)=>'Wk '+(i+1));
  return MONTH_LABELS.slice(-b.n);
}
const scaleList = (list, f) => list.map(i => ({ ...i, val:Math.max(1, Math.round(i.val*f)) }));
function fmtShort(d){ return d.toLocaleDateString('en-US', { month:'short', day:'numeric' }); }
function windowFor(scope){
  const r = ranges[scope];
  const to = r.to || TODAY;
  const from = r.from || new Date(to.getTime() - r.days*86400000);
  return { from, to };
}
function inWindow(scope, dateStr){
  const d = new Date(dateStr); if(isNaN(d)) return true;
  const { from, to } = windowFor(scope);
  return d >= from && d <= to;
}
function genRevenue(b){
  const labels = bucketLabels(b), end = 84200;
  const step = b.gran==='month' ? 3.5 : b.gran==='week' ? 1.0 : 0.35, k = labels.length;
  return labels.map((label,i) => ({ label, val:Math.round(end*(1 - step/100*(k-1-i))) }));
}
function genGrowth(b){
  const labels = bucketLabels(b), k = labels.length, jTot = 255*b.factor, cTot = 43*b.factor;
  const span = Math.max(1, k-1);
  return labels.map((label,i) => ({ month:label,
    joined: Math.max(1, Math.round(jTot/k*(0.85 + 0.30*i/span))),
    churned:Math.max(1, Math.round(cTot/k*(1.10 - 0.20*i/span))) }));
}
/* wire a date-range control: preset dropdown + custom from/to */
function setupRange(scope, rerender, opts){
  opts = opts || {};
  const root = $(scope+'-range'); if(!root) return;
  const preset = root.querySelector('.daterange-preset');
  const custom = root.querySelector('.daterange-custom');
  const apply = (cfg) => { Object.assign(ranges[scope], { from:null, to:null }, cfg); rerender(); };
  preset.addEventListener('change', () => {
    if(preset.value==='custom'){
      custom.hidden = false;
      const f = root.querySelector('.daterange-from'), t = root.querySelector('.daterange-to');
      if(!t.value){ t.value = '2026-06-25'; f.value = '2026-05-26'; }
    } else {
      custom.hidden = true;
      const cfg = (preset.value==='all' && opts.allDays) ? { days:opts.allDays, label:'All time' } : presetCfg(preset.value);
      apply(cfg);
    }
  });
  root.querySelector('.daterange-apply').addEventListener('click', () => {
    const fv = root.querySelector('.daterange-from').value, tv = root.querySelector('.daterange-to').value;
    if(!fv || !tv) return;
    const from = new Date(fv+'T00:00:00'), to = new Date(tv+'T00:00:00');
    if(to < from) return showToast('End date must be after the start date.');
    const days = Math.max(1, Math.round((to-from)/86400000));
    apply({ days, label:`${fmtShort(from)} – ${fmtShort(to)}`, from, to });
  });
}

/* ---------- Analytics trend charts ---------- */
function renderAnalyticsCharts(){
  const b = rangeBuckets(ranges.analytics.days), lbl = ranges.analytics.label;
  $('an-revenue').innerHTML = colChart(genRevenue(b), 'var(--cyan)', v=>'$'+Math.round(v/1000)+'K');
  $('an-growth').innerHTML = growthChart(genGrowth(b));
  $('an-funnel').innerHTML = funnelChart(scaleList(funnel, b.factor));
  $('an-acquisition').innerHTML = rankList(scaleList(acquisition, b.factor), 'var(--pink)');
  ['an-cap-revenue','an-cap-funnel','an-cap-acq'].forEach(id => { if($(id)) $(id).textContent = lbl; });
  if($('an-range-note')) $('an-range-note').textContent = lbl;
}

/* ---------- Subscriptions ---------- */
function renderSubscriptions(){
  const planBadge = (p) => p==='VIP'?'badge-navy':p==='Elite'?'badge-pink':'badge-cyan';
  const status = $('sub-status') ? $('sub-status').value : 'all';
  const billing = $('sub-billing') ? $('sub-billing').value : 'all';
  const rows = subscriptions.filter(s =>
    (status==='all' || s.status===status) && (billing==='all' || s.billing===billing));
  $('subs-tbody').innerHTML = rows.map(s=>{
    const past = s.status==='Past due';
    const action = past
      ? `<button class="link-act" data-toast="Sent payment-update link to ${s.member}.">Send payment link</button>`
      : `<button class="link-act" data-toast="Opening ${s.member}'s subscription…">Manage</button>`;
    return `<tr>
      <td><div class="t-id"><div class="t-avatar">${initials(s.member)}</div><div><div class="t-strong">${s.member}</div><div class="t-sub">${s.email}</div></div></div></td>
      <td><span class="badge ${planBadge(s.plan)}">${s.plan}</span></td>
      <td>${s.billing}</td>
      <td>${s.amount}</td>
      <td>${subDot(s.status)}</td>
      <td>${s.next}</td>
      <td class="t-right"><div class="row-actions">${action}</div></td>
    </tr>`;
  }).join('');
  if($('sub-count')) $('sub-count').textContent = `${rows.length} of ${subscriptions.length} subscriptions`;
  // summary tiles
  const n = (st)=>subscriptions.filter(s=>s.status===st).length;
  if($('sub-active')) $('sub-active').textContent = n('Active').toLocaleString();
  if($('sub-pastdue')) $('sub-pastdue').textContent = n('Past due').toLocaleString();
  if($('sub-trialing')) $('sub-trialing').textContent = n('Trialing').toLocaleString();
}

/* ---------- Abandoned carts ---------- */
function renderAbandoned(){
  const planBadge = (p) => p==='VIP'?'badge-navy':p==='Elite'?'badge-pink':'badge-cyan';
  const step = $('cart-step') ? $('cart-step').value : 'all';
  const rows = abandonedCarts.filter(c => step==='all' || c.step===step);
  $('cart-tbody').innerHTML = rows.map(c=>`<tr>
    <td><div class="t-id"><div class="t-avatar">${initials(c.name)}</div><div><div class="t-strong">${c.name}</div><div class="t-sub">${c.email}</div></div></div></td>
    <td><span class="badge ${planBadge(c.plan)}">${c.plan}</span><div class="t-sub" style="margin-top:3px">${c.billing}</div></td>
    <td>${c.amount}</td>
    <td>${statusPill(c.step)}</td>
    <td>${c.captured}</td>
    <td class="t-right"><div class="row-actions">
      <button class="link-act" data-toast="Resent checkout link to ${c.name}.">Resend link</button>
      <button class="icon-act" data-toast="Marked ${c.name} as contacted." title="Mark contacted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg></button>
    </div></td>
  </tr>`).join('');
  if($('cart-count')) $('cart-count').textContent = `${rows.length} of ${abandonedCarts.length} carts`;
}

/* ---------- Coupons ---------- */
function renderCoupons(){
  $('coupons-tbody').innerHTML = coupons.map((c,i)=>`<tr>
    <td><span class="code-chip">${c.code}</span></td>
    <td>${c.desc}</td>
    <td>${c.dtype==='Percent'? c.value+'% off' : '$'+c.value+' off'}</td>
    <td>${c.uses.toLocaleString()} <span class="t-sub" style="display:inline">/ ${c.maxUses}</span></td>
    <td>${c.start}${(c.end && c.end!=='—')?' – '+c.end:''}</td>
    <td><span class="dot-status dot-${c.status==='Active'?'active':'paused'}">${c.status}</span></td>
    <td class="t-right"><div class="row-actions">
      <button class="icon-act" data-toast="Copied ${c.code} to clipboard." title="Copy code"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>
      ${editBtn('coupon:'+i)}${delBtn('Deleted '+c.code+' (removed from Stripe).')}
    </div></td>
  </tr>`).join('');
  if($('coupon-count')) $('coupon-count').textContent = `${coupons.length} coupons`;
  const active = coupons.filter(c=>c.status==='Active').length;
  const redemptions = coupons.reduce((a,c)=>a+c.uses,0);
  if($('coupon-active')) $('coupon-active').textContent = active;
  if($('coupon-redemptions')) $('coupon-redemptions').textContent = redemptions.toLocaleString();
}

/* ---------- Notifications composer ---------- */
function renderSentNotifications(){
  const typeBadge = { Announcement:'badge-pink', Promotion:'badge-amber', Update:'badge-cyan', Info:'badge-navy', Success:'badge-green', Warning:'badge-amber' };
  $('sent-list').innerHTML = sentNotifications.map(n=>`
    <div class="list-row">
      <div class="list-main"><div class="lt">${n.title}</div><div class="ls">${n.audience} · ${n.recipients} recipients · ${n.sent}</div></div>
      <span class="badge ${typeBadge[n.type]||'badge-navy'}">${n.type}</span>
    </div>`).join('');
}
function updateAudience(){
  if(!$('notif-tier')) return;
  const tier = $('notif-tier').value;
  let n = totalMembers;
  if(tier!=='All tiers'){ const b = membershipBreakdown.find(x=>x.plan===tier); n = b ? b.count : 0; }
  const role = $('notif-role').value;
  const roleNote = role!=='All roles' ? ` · ${role}` : '';
  $('aud-est').textContent = `~${n.toLocaleString()} member${n===1?'':'s'}${roleNote}`;
  $('send-notif').dataset.toast = `Notification sent to ~${n.toLocaleString()} members.`;
}

/* ============================================================
   Render: dashboard
   ============================================================ */
function renderDashboard(){
  const pending = requests.filter(r=>r.status!=='Resolved').length;
  $('dash-pending').textContent = pending;
  $('nav-req-count').textContent = pending;
  $('dash-lenders').textContent = lenders.length;
  $('dash-vendors').textContent = vendors.length;
  if($('dash-pastdue')) $('dash-pastdue').textContent = subscriptions.filter(s=>s.status==='Past due').length;
  // pending requests table (top 5)
  $('dash-requests').innerHTML =
    '<thead><tr><th>Type</th><th>Member</th><th>Submitted</th><th>Status</th></tr></thead><tbody>' +
    requests.filter(r=>r.status!=='Resolved').slice(0,5).map(r=>{
      const i = requests.indexOf(r); const m = reqTypeMeta[r.type];
      return `<tr style="cursor:pointer" data-request="${i}">
        <td><span class="req-type"><span class="rt-ico ${m.cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${m.ico}</svg></span>${r.type}</span></td>
        <td class="t-strong">${r.member}</td><td>${r.date}</td><td>${statusPill(r.status)}</td></tr>`;
    }).join('') + '</tbody>';
  // newest members
  $('dash-members').innerHTML = members.slice(0,5).map(m=>`
    <div class="list-row"><div class="t-avatar">${initials(m.name)}</div>
      <div class="list-main"><div class="lt">${m.name}</div><div class="ls">${m.plan} · joined ${m.joined}</div></div>
      <span class="badge ${m.plan==='VIP'?'badge-navy':m.plan==='Elite'?'badge-pink':'badge-cyan'}">${m.plan}</span>
    </div>`).join('');
  // membership breakdown
  $('mbar').innerHTML = membershipBreakdown.map(b=>`<span class="${b.seg}" style="width:${(b.count/totalMembers*100).toFixed(1)}%"></span>`).join('');
  $('mbreakdown').innerHTML = membershipBreakdown.map(b=>`
    <div class="mrow"><span class="mdot" style="background:${b.dot}"></span><span class="mname">${b.plan}</span>
      <span class="mcount">${b.count.toLocaleString()}</span><span class="mpct">${(b.count/totalMembers*100).toFixed(0)}%</span></div>`).join('');
}

/* ============================================================
   Render: reports (escalation & connection records to send to a
   lender or vendor) — own date range, defaults to All time
   ============================================================ */
let reportType = 'escalations';
function reportPartnerOptions(){
  if(reportType==='escalations') return lenders.map(l=>l.name);
  return [...lenders.map(l=>l.name), ...vendors.map(v=>v.name)];
}
function renderReportPartners(){
  const sel = $('report-partner'); if(!sel) return;
  const label = reportType==='escalations' ? 'All lenders' : 'All partners';
  sel.innerHTML = `<option value="all">${label}</option>` + reportPartnerOptions().map(p=>`<option>${p}</option>`).join('');
}
function renderReports(){
  const sel = $('report-partner'); if(!sel) return;
  const partner = sel.value;
  const t = $('report-table');
  if(reportType==='escalations'){
    const rows = escalationRecords.filter(r=>(partner==='all'||r.lender===partner) && inWindow('reports', r.date));
    t.innerHTML = '<thead><tr><th>Member</th><th>Lender</th><th>Loan #</th><th>Submitted</th><th>Status</th></tr></thead><tbody>'+
      (rows.length? rows.map(r=>`<tr><td class="t-strong">${r.member}</td><td>${r.lender}</td><td>#${r.loan}</td><td>${r.date}</td><td>${statusPill(r.status)}</td></tr>`).join('')
        : '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:28px">No escalations for this lender in the selected range.</td></tr>')+'</tbody>';
    $('report-count').textContent = `${rows.length} escalation${rows.length===1?'':'s'} · ${ranges.reports.label}`;
  } else {
    const rows = connectionRecords.filter(r=>(partner==='all'||r.partner===partner) && inWindow('reports', r.date));
    t.innerHTML = '<thead><tr><th>Member</th><th>Partner</th><th>Type</th><th>Requested</th><th>Status</th></tr></thead><tbody>'+
      (rows.length? rows.map(r=>`<tr><td class="t-strong">${r.member}</td><td>${r.partner}</td><td><span class="badge ${r.kind==='Lender'?'badge-navy':'badge-cyan'}">${r.kind}</span></td><td>${r.date}</td><td>${statusPill(r.status)}</td></tr>`).join('')
        : '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:28px">No connections for this partner in the selected range.</td></tr>')+'</tbody>';
    $('report-count').textContent = `${rows.length} connection${rows.length===1?'':'s'} · ${ranges.reports.label}`;
  }
}

/* ============================================================
   Render: taxonomy (categories & tags)
   ============================================================ */
function renderTaxonomy(){
  $('taxonomy-grid').innerHTML = Object.keys(taxonomies).map(key=>{
    const meta = taxMeta[key], items = taxonomies[key];
    return `<div class="card card-pad">
      <h3 style="font-size:16px">${meta.label}</h3>
      <div class="sub" style="color:var(--muted);font-size:13px;margin-top:2px">${meta.sub}</div>
      <div class="tax-chips" data-tax="${key}">
        ${items.length? items.map(it=>`<span class="tax-chip">${it}<button data-tax-remove="${key}::${it}" title="Remove">×</button></span>`).join('') : '<span class="tax-empty">No entries yet.</span>'}
      </div>
      <div class="tax-add">
        <input class="input" id="taxinput-${key}" placeholder="Add a new ${meta.label.toLowerCase().replace(/s$/,'')}…">
        <button class="btn btn-outline btn-sm" data-tax-add="${key}">Add</button>
      </div>
    </div>`;
  }).join('');
}
function addTax(key){
  const input = $('taxinput-'+key);
  const val = (input.value||'').trim();
  if(!val) return;
  if(taxonomies[key].some(x=>x.toLowerCase()===val.toLowerCase())){ showToast('That entry already exists.'); return; }
  taxonomies[key].push(val);
  renderTaxonomy();
  showToast(`Added "${val}" to ${taxMeta[key].label}.`);
}
function removeTax(key, val){
  taxonomies[key] = taxonomies[key].filter(x=>x!==val);
  renderTaxonomy();
  showToast(`Removed "${val}".`);
}

/* ============================================================
   Edit modal (members + content) — interface only
   ============================================================ */
function field(label, value, opts){ return `<div class="field"><label>${label}</label><input class="input" value="${value||''}" ${opts||''}></div>`; }
function selectField(label, options, selected){
  return `<div class="field"><label>${label}</label><select class="select">${options.map(o=>`<option ${o===selected?'selected':''}>${o}</option>`).join('')}</select></div>`;
}
function openEdit(ref){
  const [type, idStr] = ref.split(':');
  const isNew = idStr === 'new';
  const idx = isNew ? -1 : +idStr;
  let title='', sub='', body='';
  if(type==='member'){
    const m = isNew ? {name:'',email:'',plan:'Premium',billing:'Monthly',role:'Loan Officer',state:'',licensed:[],used:0,status:'Active'} : members[idx];
    title = isNew ? 'Add member' : 'Manage member';
    sub = isNew ? 'Create a new member account.' : m.email;
    body = `
      <div class="form-section-label" style="margin-top:0">Account</div>
      <div class="field-row">${field('Full name', m.name)}${field('Email', m.email)}</div>
      <div class="field-row">${selectField('Role', ['Broker Owner','Loan Officer','Loan Officer Assistant','Processor'], m.role)}${field('Mailing state', m.state, 'placeholder="e.g. FL"')}</div>
      ${field('Licensed states', (m.licensed||[]).join(', '), 'placeholder="e.g. FL, GA, NC"')}
      <div class="form-section-label">Subscription</div>
      <div class="field-row">${selectField('Plan', ['Premium','Elite','VIP'], m.plan)}${selectField('Billing period', ['Monthly','Annual'], m.billing)}</div>
      <div class="field-row">${selectField('Billing status', ['Active','Paused','Cancelled'], m.status)}${field('Next billing date', 'Jan 14, 2027')}</div>
      <div class="field-row">${field('Escalations used this cycle', m.used, 'type="number"')}${field('Escalation allotment', planTotal[m.plan]+'/yr', 'disabled')}</div>
      <div class="callout"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h0"/></svg><p>Plan escalation allotments: Premium 1/mo · Elite 6/mo · VIP unlimited. Members can purchase additional escalations at $199 each.</p></div>
      ${isNew?'':`<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px"><button class="btn btn-outline btn-sm" data-toast="Granted 1 complimentary escalation." data-close>+ Grant escalation</button><button class="btn btn-outline btn-sm" data-toast="Subscription paused." data-close>Pause subscription</button><button class="btn btn-outline btn-sm" data-toast="Sent password reset email." data-close>Reset password</button></div>`}`;
  } else if(type==='lender'){
    const l = isNew ? {name:'',short:'',tier:'Gold',products:[],status:'Active'} : lenders[idx];
    title = isNew ? 'Add lender' : 'Edit lender'; sub = isNew?'Add a wholesale lender partner.':l.name;
    body = `
      <div class="field-row">${field('Lender name', l.name)}${field('Logo abbreviation', l.short)}</div>
      <div class="field-row">${selectField('Tier', ['Gold','Silver','Bronze'], l.tier)}${selectField('Status', ['Active','Draft'], l.status)}</div>
      ${tagPicker('Product types', taxonomies.lenderProducts, l.products)}`;
  } else if(type==='vendor'){
    const v = isNew ? {name:'',short:'',cat:taxonomies.vendorCategories[0],offer:'',status:'Active'} : vendors[idx];
    title = isNew ? 'Add vendor' : 'Edit vendor'; sub = isNew?'Add a Market vendor partner.':v.name;
    body = `
      <div class="field-row">${field('Vendor name', v.name)}${field('Logo abbreviation', v.short)}</div>
      <div class="field-row">${selectField('Category', taxonomies.vendorCategories, v.cat)}${selectField('Status', ['Active','Draft'], v.status)}</div>
      ${field('Member offer', v.offer)}`;
  } else if(type==='resource'){
    const r = isNew ? {title:'',type:taxonomies.resourceTypes[0],dur:'',collection:'—',topic:'—',status:'Draft'} : resources[idx];
    title = isNew ? 'Add resource' : 'Edit resource'; sub = isNew?'Add a webinar, podcast, training, recording, or certification.':r.title;
    body = `
      ${field('Title', r.title)}
      <div class="field-row">${selectField('Type', taxonomies.resourceTypes, r.type)}${field('Duration', r.dur)}</div>
      <div class="field-row">${selectField('Hub / collection', ['—', ...hubNames()], r.collection)}${selectField('Topic tag', ['—', ...taxonomies.resourceTopics], r.topic)}</div>
      ${field('Content link', '', 'placeholder="Video / audio URL"')}
      ${selectField('Status', ['Active','Draft'], r.status)}
      <div class="hint">Assigning a <strong>hub</strong> makes this appear inside that hub (Brokers Edge, Mortgage Mornings, etc.). <strong>Topic</strong> drives the AI Strategy / Marketing / Sales filters on Resources.</div>`;
  } else if(type==='event'){
    const e = isNew ? {title:'',date:'',type:taxonomies.eventTypes[0],hub:'—',status:'Draft'} : events[idx];
    title = isNew ? 'Add event' : 'Edit event'; sub = isNew?'Create a new event.':e.title;
    body = `
      ${field('Event title', e.title)}
      <div class="field-row">${field('Date', e.date)}${selectField('Type', taxonomies.eventTypes, e.type)}</div>
      ${selectField('Hub / collection', ['—', ...hubNames()], e.hub)}
      ${selectField('Status', ['Active','Draft'], e.status)}
      <div class="hint">Assign a hub to surface this event inside a member hub (e.g. VIP, WMN). Leave as “—” for a general event — it still shows on the Events page &amp; calendar.</div>`;
  } else if(type==='hub'){
    const h = isNew ? {name:'',kind:'Standard',access:['All Members'],status:'Active'} : hubs[idx];
    title = isNew ? 'Add hub' : 'Edit hub'; sub = isNew?'Create a content hub shown in the member sidebar.':h.name;
    body = `
      ${field('Hub name', h.name)}
      ${selectField('Layout', ['Standard','Mixed'], h.kind)}
      ${accessPicker(h.access)}
      <div class="field"><label>Description</label><textarea class="input" placeholder="Short description shown at the top of the hub page…" style="min-height:70px"></textarea></div>
      ${selectField('Status', ['Active','Draft'], h.status)}
      <div class="callout"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h0"/></svg><p><strong>Standard</strong> = a videos/recordings grid + a Documents tab. <strong>Mixed</strong> = videos, events &amp; documents in one hub (VIP, WMN). Use <strong>Access</strong> to gate the hub — pick the tiers that can see it, or All Members for everyone. Add content from Resources, Events &amp; Documents by setting their hub to this one.</p></div>`;
  } else if(type==='document'){
    const d = isNew ? {title:'',source:'General',access:'All members',status:'Active'} : documents[idx];
    title = isNew ? 'Add document' : 'Edit document'; sub = isNew?'Upload a document for the Documents page or a hub.':d.title;
    body = `
      ${field('Title', d.title)}
      ${field('Description', d.desc, 'placeholder="One line shown under the title"')}
      <div class="field-row">${selectField('Source', ['General', ...hubNames()], d.source)}${selectField('Access', ['All members','VIP only'], d.access)}</div>
      <div class="field"><label>File</label><div class="callout" style="margin:0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg><p>Drag a PDF here or <strong>browse</strong> to upload. (Interface only in this prototype.)</p></div></div>
      ${selectField('Status', ['Active','Draft'], d.status)}
      <div class="hint"><strong>Source “General”</strong> lists the doc on the main Documents page only; choosing a hub also adds it to that hub’s Documents tab. <strong>VIP only</strong> documents are hidden from non-VIP members everywhere.</div>`;
  } else if(type==='featured'){
    title='Add featured item'; sub='Feature a lender, resource, market deal, or event on the member home screen.';
    body = `
      ${selectField('Type', ['Lender','Resource','Market','Event'], 'Lender')}
      ${field('Item', '', 'placeholder="Start typing to search content…"')}
      ${field('Note (optional)', '', 'placeholder="e.g. New member deal"')}
      <div class="hint">Reorder or remove featured items from the Featured list after adding.</div>`;
  } else if(type==='admin'){
    const a = isNew ? {name:'',email:'',role:'Admin'} : admins[idx];
    title = isNew ? 'Add admin' : 'Edit team member';
    sub = isNew ? 'Invite a teammate to the admin console.' : a.email;
    body = `
      <div class="field-row">${field('Full name', a.name)}${field('Work email', a.email)}</div>
      ${selectField('Role', ['Admin','Super Admin'], a.role)}
      <div class="callout"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h0"/></svg><p><strong>Super Admin:</strong> full access, including team &amp; roles. <strong>Admin:</strong> manage members and content only.</p></div>`;
  } else if(type==='coupon'){
    const c = isNew ? {code:'',desc:'',dtype:'Percent',value:'',maxUses:'',start:'',end:'',status:'Active'} : coupons[idx];
    title = isNew ? 'Add coupon' : 'Edit coupon';
    sub = isNew ? 'Create a discount code. Syncs to Stripe on save.' : c.code;
    body = `
      <div class="field-row">${field('Code', c.code, 'placeholder="e.g. FUSE2026"')}${selectField('Discount type', ['Percent','Amount'], c.dtype)}</div>
      <div class="field-row">${field('Value', c.value, 'placeholder="20"')}${field('Max redemptions', c.maxUses==='∞'?'':c.maxUses, 'placeholder="Blank = unlimited"')}</div>
      ${field('Description', c.desc)}
      <div class="field-row">${field('Valid from', c.start, 'placeholder="Jun 1, 2026"')}${field('Valid until', c.end==='—'?'':c.end, 'placeholder="Optional"')}</div>
      ${selectField('Status', ['Active','Paused'], c.status)}
      <div class="callout"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h0"/></svg><p>Saving creates or updates this code in <strong>Stripe</strong>. Redemption counts sync automatically.</p></div>`;
  }
  $('edit-title').textContent = title;
  $('edit-sub').textContent = sub;
  $('edit-body').innerHTML = body;
  $('edit-save').dataset.toast = !isNew ? 'Changes saved.'
    : type==='admin' ? 'Invitation sent.'
    : type==='featured' ? 'Added to Featured.'
    : `${title.replace('Add ','')} created.`;
  openModal('edit');
}
function tagPicker(label, all, selected){
  selected = selected || [];
  return `<div class="field"><label>${label}</label>
    <div class="tax-chips" style="margin:6px 0 0">
      ${all.map(t=>`<label class="tax-chip" style="cursor:pointer;${selected.includes(t)?'border-color:var(--pink);background:#fef4f8':''}"><input type="checkbox" ${selected.includes(t)?'checked':''} style="margin-right:6px;accent-color:var(--pink)">${t}</label>`).join('')}
    </div>
    <div class="hint">Manage the full list under Categories &amp; tags.</div></div>`;
}
// Multi-select hub access: "All Members" (everyone) OR one or more tiers.
function accessPicker(selected){
  selected = (selected && selected.length) ? selected : ['All Members'];
  return `<div class="field"><label>Access</label>
    <div class="tax-chips" id="access-picker" style="margin:6px 0 0">
      ${accessOptions.map(o=>{
        const on = selected.includes(o);
        return `<label class="tax-chip access-opt${on?' on':''}" data-access-opt="${o}" style="cursor:pointer"><input type="checkbox" ${on?'checked':''} tabindex="-1" style="margin-right:6px;accent-color:var(--pink)">${o}</label>`;
      }).join('')}
    </div>
    <div class="hint"><strong>All Members</strong> includes everyone. Or select specific tiers (Premium, Elite, VIP) to gate this hub.</div></div>`;
}
function toggleAccess(opt){
  const picker = $('access-picker'); if(!picker) return;
  let sel = [...picker.querySelectorAll('.access-opt.on')].map(c=>c.dataset.accessOpt);
  const isOn = sel.includes(opt);
  if(opt==='All Members'){
    sel = isOn ? [] : ['All Members'];
  } else {
    sel = sel.filter(x=>x!=='All Members');         // a specific tier clears "All Members"
    sel = isOn ? sel.filter(x=>x!==opt) : [...sel, opt];
  }
  if(!sel.length) sel = ['All Members'];             // never leave a hub with no audience
  picker.querySelectorAll('.access-opt').forEach(c=>{
    const on = sel.includes(c.dataset.accessOpt);
    c.classList.toggle('on', on);
    const cb = c.querySelector('input'); if(cb) cb.checked = on;
  });
}

/* ---------- Request detail modal ---------- */
function openRequest(idx){
  const r = requests[idx];
  $('req-title').textContent = r.type;
  $('req-sub').textContent = `Submitted by ${r.member} · ${r.date}`;
  $('req-body').innerHTML = `
    <div class="kv"><div class="k">Type</div><div class="v">${r.type}</div></div>
    <div class="kv"><div class="k">Member</div><div class="v">${r.member}</div></div>
    <div class="kv"><div class="k">Details</div><div class="v">${r.detail}</div></div>
    <div class="kv"><div class="k">Submitted</div><div class="v">${r.date}</div></div>
    <div class="kv"><div class="k">Status</div><div class="v">${statusPill(r.status)}</div></div>
    <div class="field" style="margin-top:18px"><label>Internal note</label><textarea class="input" placeholder="Add a note for the team…"></textarea></div>`;
  openModal('request');
}

/* ============================================================
   Navigation, modals, toast
   ============================================================ */
function navigate(view){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  $('view-'+view)?.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.nav===view));
  document.querySelectorAll('.bottom-nav-item').forEach(n=>n.classList.toggle('active', n.dataset.nav===view));
  $('sidebar')?.classList.remove('open');
  window.scrollTo(0,0);
}
function openModal(id){ $('modal-'+id)?.classList.add('open'); document.body.style.overflow='hidden'; }
function closeModals(){ document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('open')); document.body.style.overflow=''; }
let toastTimer;
function showToast(msg){ const t=$('toast'); $('toast-msg').textContent=msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2800); }

/* ============================================================
   Initial render
   ============================================================ */
fillMemberFilters();
renderDashboard(); renderMembers(); renderLenders(); renderVendors();
renderResources(); renderEvents(); renderRequests(); renderFuse();
renderHubs(); renderDocuments();
renderReportPartners(); renderReports(); renderAnalyticsCharts(); renderTaxonomy();
renderFeatured(); renderTeam(); renderEngagement();
renderSubscriptions(); renderAbandoned(); renderCoupons();
renderSentNotifications(); updateAudience();
setupRange('analytics', renderAnalyticsCharts);
setupRange('engagement', renderEngagement);
setupRange('reports', renderReports, { allDays:36500 });

/* ---------- Events ---------- */
['member-search','member-plan','member-status','member-role','member-state','member-licensed','member-billing']
  .forEach(id => $(id) && $(id).addEventListener(id==='member-search'?'input':'change', renderMembers));
['sub-status','sub-billing'].forEach(id => $(id) && $(id).addEventListener('change', renderSubscriptions));
$('cart-step') && $('cart-step').addEventListener('change', renderAbandoned);
['notif-tier','notif-role'].forEach(id => $(id) && $(id).addEventListener('change', updateAudience));
['fuse-search','fuse-ticket','fuse-addon','fuse-tier']
  .forEach(id => $(id) && $(id).addEventListener(id==='fuse-search'?'input':'change', renderFuse));
$('fuse-export') && $('fuse-export').addEventListener('click', ()=>{
  const n = document.querySelectorAll('#fuse-tbody tr').length;
  showToast(`Exported ${n} attendee${n===1?'':'s'} to CSV.`);
});

$('request-filters').addEventListener('click', e=>{
  const chip = e.target.closest('.chip'); if(!chip) return;
  document.querySelectorAll('#request-filters .chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active'); renderRequests();
});

$('document-filters') && $('document-filters').addEventListener('click', e=>{
  const chip = e.target.closest('.chip'); if(!chip) return;
  document.querySelectorAll('#document-filters .chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active'); renderDocuments();
});
$('exchange-save') && $('exchange-save').addEventListener('click', ()=> showToast('AIME Exchange link saved.'));

$('report-tabs').addEventListener('click', e=>{
  const chip = e.target.closest('.chip'); if(!chip) return;
  document.querySelectorAll('#report-tabs .chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active'); reportType = chip.dataset.rtype;
  renderReportPartners(); renderReports();
});
$('report-partner').addEventListener('change', renderReports);
function reportScopeLabel(){
  const partner = $('report-partner').value;
  return partner==='all' ? (reportType==='escalations'?'all lenders':'all partners') : partner;
}
$('report-export').addEventListener('click', ()=>{
  showToast(`Exported ${reportType} report for ${reportScopeLabel()} (${ranges.reports.label}) to CSV.`);
});
$('report-email').addEventListener('click', ()=>{
  showToast(`Emailed ${reportType} report for ${reportScopeLabel()} (${ranges.reports.label}).`);
});

/* ---------- Global click delegation ---------- */
document.addEventListener('click', e=>{
  const t = e.target;
  let m;
  if((m = t.closest('[data-access-opt]')))  { e.preventDefault(); toggleAccess(m.dataset.accessOpt); return; }
  if((m = t.closest('[data-edit]')))        { e.preventDefault(); openEdit(m.dataset.edit); return; }
  if((m = t.closest('[data-request]')))      { e.preventDefault(); openRequest(+m.dataset.request); return; }
  if((m = t.closest('[data-feat-move]')))    { e.preventDefault(); const [i,d]=m.dataset.featMove.split(':').map(Number); moveFeatured(i,d); return; }
  if((m = t.closest('[data-feat-remove]')))  { e.preventDefault(); removeFeatured(+m.dataset.featRemove); return; }
  if((m = t.closest('[data-tax-add]')))      { e.preventDefault(); addTax(m.dataset.taxAdd); return; }
  if((m = t.closest('[data-tax-remove]')))   { e.preventDefault(); const [k,v]=m.dataset.taxRemove.split('::'); removeTax(k,v); return; }
  if((m = t.closest('[data-close]')))        { e.preventDefault(); closeModals(); return; }
  if((m = t.closest('[data-toast]')))        { e.preventDefault(); if(m.hasAttribute('data-close')) closeModals(); showToast(m.dataset.toast); return; }
  if((m = t.closest('[data-action]')))       { e.preventDefault(); if(m.dataset.action==='menu') $('sidebar')?.classList.toggle('open'); return; }
  if((m = t.closest('[data-nav]')))          { e.preventDefault(); navigate(m.dataset.nav); return; }
});

/* Enter key adds a taxonomy entry */
document.addEventListener('keydown', e=>{
  if(e.key==='Enter' && e.target.id && e.target.id.startsWith('taxinput-')){ addTax(e.target.id.replace('taxinput-','')); }
  if(e.key==='Escape') closeModals();
});
document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click', e=>{ if(e.target===o) closeModals(); }));

/* Deep-linking: #members, #analytics, #featured, etc. */
(function(){ const h=(location.hash||'').replace('#',''); if(h && document.getElementById('view-'+h)) navigate(h); })();
