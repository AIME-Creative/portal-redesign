/* ============================================================
   AMP Admin — data, rendering, and interactions (prototype)
   Sample data only; actions are simulated (toasts).
   ============================================================ */

/* ---------- Taxonomies (managed in Categories & tags) ---------- */
const taxonomies = {
  lenderProducts:    ["Conventional","FHA","VA","Jumbo","Non-QM","USDA","DSCR","Bank Stmt","Renovation","Reverse","Fix & Flip","Bridge"],
  vendorCategories:  ["Core Partner","Origination","Coaching","Marketing"],
  resourceTypes:     ["Podcast","Webinar","Training"],
  eventTypes:        ["Virtual","In person","Training"],
};
const taxMeta = {
  lenderProducts:   { label:"Lender product types", sub:"Shown on lender cards and the product filter." },
  vendorCategories: { label:"Market categories",     sub:"Group vendors in the Market." },
  resourceTypes:    { label:"Resource types",        sub:"Used to label and filter resources." },
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
const resources = [
  { title:"The 'Daily Six' Challenge (Part 3)", type:"Podcast", dur:"28 min", pub:"Jun 20, 2026", status:"Active" },
  { title:"Broker to Broker — Episode 251", type:"Podcast", dur:"41 min", pub:"Jun 18, 2026", status:"Active" },
  { title:"Broker Power-Up: Episode 65", type:"Webinar", dur:"52 min", pub:"Jun 15, 2026", status:"Active" },
  { title:"Mortgage Mornings — June 17, 2026", type:"Webinar", dur:"35 min", pub:"Jun 17, 2026", status:"Active" },
  { title:"Women's Mortgage Network Podcast", type:"Podcast", dur:"33 min", pub:"Jun 12, 2026", status:"Active" },
  { title:"AIME Accelerate — Identity Reset", type:"Training", dur:"24 min", pub:"Jun 6, 2026", status:"Active" },
  { title:"Scaling Past $1M in Volume", type:"Training", dur:"47 min", pub:"Jun 2, 2026", status:"Active" },
  { title:"Compliance Corner — Q3 Update", type:"Webinar", dur:"38 min", pub:"Jun 24, 2026", status:"Draft" },
  { title:"Building Your Referral Engine", type:"Training", dur:"45 min", pub:"—", status:"Draft" },
];
const events = [
  { title:"AIME Accelerate — Identity Reset", date:"Jun 6, 2026", type:"Virtual", regs:842, status:"Active" },
  { title:"AIME Accelerate — Win the Day", date:"Jun 15, 2026", type:"Virtual", regs:770, status:"Active" },
  { title:"AIME Accelerate — Run Toward It", date:"Jun 22, 2026", type:"Virtual", regs:615, status:"Active" },
  { title:"Mortgage Mornings — Live", date:"Jul 1, 2026", type:"Virtual", regs:412, status:"Active" },
  { title:"AIME Accelerate — Compound", date:"Jun 29, 2026", type:"Training", regs:308, status:"Active" },
  { title:"FUSE 2026 — National Conference", date:"Sep 14, 2026", type:"In person", regs:1204, status:"Active" },
  { title:"AIME Accelerate — Mindset", date:"Jul 6, 2026", type:"Training", regs:0, status:"Draft" },
  { title:"Regional Mixer — Dallas", date:"Aug 12, 2026", type:"In person", regs:86, status:"Active" },
];

/* ---------- Members ---------- */
const members = [
  { name:"Kyle Lord", email:"kyle@aimegroup.com", plan:"Elite", used:1, status:"Active", joined:"Jan 14, 2026" },
  { name:"Maria Chen", email:"maria.chen@brightpathmtg.com", plan:"VIP", used:4, status:"Active", joined:"Jun 22, 2026" },
  { name:"Darnell Ross", email:"dross@summitlending.com", plan:"Premium", used:0, status:"Active", joined:"Jun 21, 2026" },
  { name:"Priya Nair", email:"priya@nairhomeloans.com", plan:"Elite", used:5, status:"Active", joined:"Jun 19, 2026" },
  { name:"Tom Becker", email:"tom@beckerfinancial.com", plan:"Premium", used:1, status:"Paused", joined:"Jun 17, 2026" },
  { name:"Alicia Gomez", email:"alicia.gomez@lendwell.com", plan:"VIP", used:9, status:"Active", joined:"Jun 14, 2026" },
  { name:"Sam Whitfield", email:"sam@whitfieldmortgage.com", plan:"Elite", used:2, status:"Active", joined:"Jun 11, 2026" },
  { name:"Janet Park", email:"jpark@parklending.com", plan:"Premium", used:1, status:"Active", joined:"Jun 9, 2026" },
  { name:"Carlos Diaz", email:"carlos@diazcapital.com", plan:"Elite", used:6, status:"Active", joined:"Jun 5, 2026" },
  { name:"Beth Coleman", email:"beth@colemanloans.com", plan:"Premium", used:0, status:"Paused", joined:"Jun 2, 2026" },
  { name:"Ahmed Sayed", email:"ahmed@sayedhomeloans.com", plan:"VIP", used:12, status:"Active", joined:"May 28, 2026" },
  { name:"Rachel Stone", email:"rachel@stonemortgage.com", plan:"Elite", used:3, status:"Active", joined:"May 24, 2026" },
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
const fuseRegs = [
  { member:"Kyle Lord", claimed:true, addons:["WMN at FUSE","Vetted VA"], guest:"—", status:"Confirmed" },
  { member:"Maria Chen", claimed:true, addons:["Hall of AIME","VIP Luncheon"], guest:"1 guest", status:"Confirmed" },
  { member:"Alicia Gomez", claimed:true, addons:["Hall of AIME"], guest:"1 guest", status:"Confirmed" },
  { member:"Ahmed Sayed", claimed:true, addons:["Hall of AIME","WMN at FUSE","VIP Luncheon"], guest:"2 guests", status:"Confirmed" },
  { member:"Priya Nair", claimed:true, addons:["WMN at FUSE"], guest:"—", status:"Confirmed" },
  { member:"Carlos Diaz", claimed:true, addons:["Vetted VA"], guest:"—", status:"Confirmed" },
  { member:"Sam Whitfield", claimed:false, addons:[], guest:"—", status:"Not claimed" },
  { member:"Janet Park", claimed:true, addons:["Hall of AIME"], guest:"1 guest", status:"Confirmed" },
  { member:"Rachel Stone", claimed:false, addons:[], guest:"—", status:"Not claimed" },
  { member:"Darnell Ross", claimed:true, addons:["WMN at FUSE","Vetted VA"], guest:"—", status:"Confirmed" },
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

/* ============================================================
   Helpers
   ============================================================ */
const $ = (id) => document.getElementById(id);
const initials = (name) => name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
const statusPill = (s) => {
  const map = { Active:"badge-green", Draft:"badge-amber", Paused:"badge-navy",
    New:"badge-pink", "In progress":"badge-amber", Resolved:"badge-green",
    Confirmed:"badge-green", "Not claimed":"badge-amber",
    "In review":"badge-amber", "Lender responded":"badge-cyan", Sent:"badge-cyan", Connected:"badge-green" };
  return `<span class="badge ${map[s]||'badge-navy'}">${s}</span>`;
};
const editBtn = (ref) => `<button class="icon-act" data-edit="${ref}" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg></button>`;
const delBtn = (msg) => `<button class="icon-act danger" data-toast="${msg}" title="Remove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg></button>`;

/* ============================================================
   Render: tables
   ============================================================ */
function renderMembers(){
  const q = ($('member-search').value || '').toLowerCase();
  const plan = $('member-plan').value, status = $('member-status').value;
  const rows = members.filter(m =>
    (m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)) &&
    (plan==='all' || m.plan===plan) && (status==='all' || m.status===status));
  $('members-tbody').innerHTML = rows.map((m,i) => {
    const idx = members.indexOf(m);
    const tot = planTotal[m.plan];
    return `<tr>
      <td><div class="t-id"><div class="t-avatar">${initials(m.name)}</div><div><div class="t-strong">${m.name}</div><div class="t-sub">${m.email}</div></div></div></td>
      <td><span class="badge ${m.plan==='VIP'?'badge-navy':m.plan==='Elite'?'badge-pink':'badge-cyan'}">${m.plan}</span></td>
      <td>${m.used} <span class="t-sub" style="display:inline">/ ${tot} used</span></td>
      <td><span class="dot-status dot-${m.status.toLowerCase()}">${m.status}</span></td>
      <td>${m.joined}</td>
      <td class="t-right"><div class="row-actions"><button class="link-act" data-edit="member:${idx}">Manage</button></div></td>
    </tr>`;
  }).join('');
  $('member-count').textContent = `${rows.length} of ${members.length} members`;
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
function renderResources(){
  $('resources-tbody').innerHTML = resources.map((r,i)=>`<tr>
    <td class="t-strong">${r.title}</td>
    <td><span class="badge badge-cyan">${r.type}</span></td>
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
    <td>${e.regs.toLocaleString()}</td>
    <td><span class="dot-status dot-${e.status.toLowerCase()}">${e.status}</span></td>
    <td class="t-right"><div class="row-actions">${editBtn('event:'+i)}${delBtn('Removed event.')}</div></td>
  </tr>`).join('');
  $('event-count').textContent = `${events.length} events`;
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
  $('fuse-tbody').innerHTML = fuseRegs.map(f=>`<tr>
    <td><div class="t-id"><div class="t-avatar">${initials(f.member)}</div><div class="t-strong">${f.member}</div></div></td>
    <td>${f.claimed?'<span class="dot-status dot-active">Claimed</span>':'<span class="dot-status dot-draft">Not claimed</span>'}</td>
    <td>${f.addons.length? f.addons.join(', ') : '<span class="t-sub" style="display:inline">None</span>'}</td>
    <td>${f.guest}</td>
    <td>${statusPill(f.status)}</td>
    <td class="t-right"><div class="row-actions"><button class="link-act" data-toast="Opening ${f.member}'s registration…">View</button></div></td>
  </tr>`).join('');
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
  $('eng-resources').innerHTML = rankList(engResources, 'var(--pink)');
  $('eng-lenders').innerHTML = rankList(engLenders, 'var(--navy)');
  $('eng-vendors').innerHTML = rankList(engVendors, 'var(--cyan)');
  $('eng-escalations').innerHTML = rankList(engEscalations, 'var(--amber)');
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
   Render: analytics
   ============================================================ */
let analyticsReport = 'escalations';
function partnerOptions(){
  if(analyticsReport==='escalations') return lenders.map(l=>l.name);
  return [...lenders.map(l=>l.name), ...vendors.map(v=>v.name)];
}
function renderAnalyticsPartners(){
  const sel = $('analytics-partner');
  const label = analyticsReport==='escalations' ? 'All lenders' : 'All partners';
  sel.innerHTML = `<option value="all">${label}</option>` + partnerOptions().map(p=>`<option>${p}</option>`).join('');
}
function renderAnalytics(){
  const partner = $('analytics-partner').value;
  const t = $('analytics-table');
  if(analyticsReport==='escalations'){
    const rows = escalationRecords.filter(r=>partner==='all'||r.lender===partner);
    t.innerHTML = '<thead><tr><th>Member</th><th>Lender</th><th>Loan #</th><th>Submitted</th><th>Status</th></tr></thead><tbody>'+
      (rows.length? rows.map(r=>`<tr><td class="t-strong">${r.member}</td><td>${r.lender}</td><td>#${r.loan}</td><td>${r.date}</td><td>${statusPill(r.status)}</td></tr>`).join('')
        : '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:28px">No escalations for this lender.</td></tr>')+'</tbody>';
    $('analytics-count').textContent = `${rows.length} escalation${rows.length===1?'':'s'}`;
  } else {
    const rows = connectionRecords.filter(r=>partner==='all'||r.partner===partner);
    t.innerHTML = '<thead><tr><th>Member</th><th>Partner</th><th>Type</th><th>Requested</th><th>Status</th></tr></thead><tbody>'+
      (rows.length? rows.map(r=>`<tr><td class="t-strong">${r.member}</td><td>${r.partner}</td><td><span class="badge ${r.kind==='Lender'?'badge-navy':'badge-cyan'}">${r.kind}</span></td><td>${r.date}</td><td>${statusPill(r.status)}</td></tr>`).join('')
        : '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:28px">No connections for this partner.</td></tr>')+'</tbody>';
    $('analytics-count').textContent = `${rows.length} connection${rows.length===1?'':'s'}`;
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
    const m = isNew ? {name:'',email:'',plan:'Premium',used:0,status:'Active'} : members[idx];
    title = isNew ? 'Add member' : 'Manage member';
    sub = isNew ? 'Create a new member account.' : m.email;
    body = `
      <div class="form-section-label" style="margin-top:0">Account</div>
      <div class="field-row">${field('Full name', m.name)}${field('Email', m.email)}</div>
      <div class="form-section-label">Subscription</div>
      <div class="field-row">${selectField('Plan', ['Premium','Elite','VIP'], m.plan)}${selectField('Billing status', ['Active','Paused','Cancelled'], m.status)}</div>
      <div class="field-row">${field('Escalations used this cycle', m.used, 'type="number"')}${field('Next billing date', 'Jan 14, 2027')}</div>
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
    const r = isNew ? {title:'',type:taxonomies.resourceTypes[0],dur:'',status:'Draft'} : resources[idx];
    title = isNew ? 'Add resource' : 'Edit resource'; sub = isNew?'Add a webinar, podcast, or training.':r.title;
    body = `
      ${field('Title', r.title)}
      <div class="field-row">${selectField('Type', taxonomies.resourceTypes, r.type)}${field('Duration', r.dur)}</div>
      ${selectField('Status', ['Active','Draft'], r.status)}`;
  } else if(type==='event'){
    const e = isNew ? {title:'',date:'',type:taxonomies.eventTypes[0],status:'Draft'} : events[idx];
    title = isNew ? 'Add event' : 'Edit event'; sub = isNew?'Create a new event.':e.title;
    body = `
      ${field('Event title', e.title)}
      <div class="field-row">${field('Date', e.date)}${selectField('Type', taxonomies.eventTypes, e.type)}</div>
      ${selectField('Status', ['Active','Draft'], e.status)}`;
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
renderDashboard(); renderMembers(); renderLenders(); renderVendors();
renderResources(); renderEvents(); renderRequests(); renderFuse();
renderAnalyticsPartners(); renderAnalytics(); renderTaxonomy();
renderFeatured(); renderTeam(); renderEngagement();

/* ---------- Events ---------- */
$('member-search').addEventListener('input', renderMembers);
$('member-plan').addEventListener('change', renderMembers);
$('member-status').addEventListener('change', renderMembers);

$('request-filters').addEventListener('click', e=>{
  const chip = e.target.closest('.chip'); if(!chip) return;
  document.querySelectorAll('#request-filters .chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active'); renderRequests();
});

$('analytics-tabs').addEventListener('click', e=>{
  const chip = e.target.closest('.chip'); if(!chip) return;
  document.querySelectorAll('#analytics-tabs .chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active'); analyticsReport = chip.dataset.areport;
  renderAnalyticsPartners(); renderAnalytics();
});
$('analytics-partner').addEventListener('change', renderAnalytics);
$('analytics-export').addEventListener('click', ()=>{
  const partner = $('analytics-partner').value;
  const scope = partner==='all' ? 'all partners' : partner;
  showToast(`Exported ${analyticsReport} for ${scope} to CSV.`);
});

/* ---------- Global click delegation ---------- */
document.addEventListener('click', e=>{
  const t = e.target;
  let m;
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
