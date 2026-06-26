/* ============================================================
   AMP Member Portal — Redesign Prototype
   Navigation, data rendering, detail pages, modals & interactions
   ============================================================ */

/* ---------- Sample data (illustrative only) ---------- */
const lenders = [
  { name: "United Wholesale Mortgage", short: "UWM", tier: "Gold",   color: "#0b1f5b", desc: "The #1 wholesale lender in the nation, delivering state-of-the-art technology and unrivaled client service to independent mortgage brokers.", tags:["Conventional","FHA","VA","Jumbo","Non-QM"] },
  { name: "EPM",                       short: "EPM", tier: "Gold",   color: "#1b7a4a", desc: "Equity Prime Mortgage — fast, broker-first wholesale lending with a full product menu and dedicated support.", tags:["Conventional","FHA","VA","USDA"] },
  { name: "Windsor Mortgage",          short: "WM",  tier: "Gold",   color: "#3a3a3a", desc: "Boutique wholesale lender specializing in non-QM and jumbo products for independent brokers.", tags:["Non-QM","Jumbo","DSCR"] },
  { name: "Newrez Wholesale",          short: "NRZ", tier: "Gold",   color: "#e0463c", desc: "A leading national lender offering a broad product suite and dedicated broker support.", tags:["Conventional","FHA","VA","Renovation"] },
  { name: "Newfi Wholesale",           short: "NF",  tier: "Silver", color: "#163a85", desc: "Tech-forward lender focused on non-QM, bank-statement, and investor loans.", tags:["Non-QM","Bank Stmt","DSCR"] },
  { name: "Cake Mortgage",             short: "CK",  tier: "Silver", color: "#2bb673", desc: "Modern wholesale platform with a slice of every product and a fast, digital process.", tags:["Conventional","Non-QM","Jumbo"] },
  { name: "eLEND",                      short: "eL",  tier: "Silver", color: "#1893b1", desc: "Diverse loan options with a focus on first-time and government-backed buyers.", tags:["FHA","VA","USDA","Conventional"] },
  { name: "RCN Capital",               short: "RCN", tier: "Bronze", color: "#0b2a5b", desc: "Nationwide private lender for real estate investors — fix & flip, bridge, and rental loans.", tags:["Fix & Flip","Bridge","DSCR"] },
  { name: "Kind Lending",              short: "KIND",tier: "Gold",   color: "#e0982a", desc: "Broker-focused lender with a kind, tech-enabled experience across agency and non-QM products.", tags:["Conventional","FHA","VA","Non-QM"] },
  { name: "Rocket Pro TPO",            short: "RKT", tier: "Gold",   color: "#d6322e", desc: "High-volume national lender with deep technology and marketing support for brokers.", tags:["Conventional","FHA","VA","Jumbo"] },
  { name: "Plaza Home Mortgage",       short: "PLZ", tier: "Silver", color: "#15467e", desc: "Full-service wholesale lender known for its renovation and reverse mortgage programs.", tags:["Renovation","Jumbo","Reverse","FHA"] },
  { name: "Home Point",                short: "HP",  tier: "Silver", color: "#1b9d6b", desc: "Relationship-driven lender with competitive agency and government pricing.", tags:["Conventional","FHA","USDA"] },
  { name: "Angel Oak",                 short: "AO",  tier: "Bronze", color: "#3a6b35", desc: "The leader in non-QM lending — bank statement, DSCR, and asset-qualifier loans.", tags:["Non-QM","Bank Stmt","DSCR"] },
  { name: "Quontic Wholesale",         short: "QW",  tier: "Bronze", color: "#0b2a5b", desc: "Digital bank offering common-sense non-QM and bank-statement loans.", tags:["Non-QM","Bank Stmt"] },
];
const tierBadge = { Gold:"badge-gold", Silver:"badge-silver", Bronze:"badge-bronze" };

const vendors = [
  { name:"Advantage Partners Solutions", short:"APS", cat:"Core Partner", g:["#1b7a4a","#2bb673"], desc:"National mortgage Consumer Reporting Agency built to support lenders at every stage of the loan process.", tags:["Credit","Verifications"], offer:"Up to 20% off credit reports + waived setup" },
  { name:"Ask Mindy",                    short:"AM",  cat:"Origination", g:["#86145a","#dd1969"], desc:"On-demand scenario desk and guideline help for tough loan files.", tags:["Scenarios","Guidelines"], offer:"Free for AIME members" },
  { name:"Waive Inspection Fee",         short:"WIF", cat:"Origination", g:["#0b6b82","#20adce"], desc:"Member benefit that waives appraisal inspection fees on qualifying loans.", tags:["Appraisal","Savings"], offer:"$0 inspection fee on qualifying loans" },
  { name:"Arive",                        short:"AR",  cat:"Origination", g:["#0b1f5b","#163a85"], desc:"All-in-one mortgage POS and LOS platform with member pricing.", tags:["POS","LOS"], offer:"Exclusive member pricing on Pro plans" },
  { name:"BrokerVA",                     short:"BVA", cat:"Coaching",    g:["#4a217a","#7a3fb0"], desc:"Trained virtual assistants who specialize in mortgage operations.", tags:["Staffing","Ops"], offer:"Waived placement fee for members" },
  { name:"Cotality",                     short:"CO",  cat:"Origination", g:["#0b2a5b","#1893b1"], desc:"Property data, analytics, and verification tools for brokers.", tags:["Data","Analytics"], offer:"Member-only data bundles" },
  { name:"Direct Authority AI",          short:"DAi", cat:"Marketing",   g:["#7a1f1a","#e0463c"], desc:"AI-powered lead generation and nurture built for loan officers.", tags:["AI","Leads"], offer:"First month free for members" },
  { name:"Lead Hackers",                 short:"LH",  cat:"Marketing",   g:["#0f5e3f","#1b9d6b"], desc:"Done-for-you paid media and funnels for mortgage pros.", tags:["Ads","Funnels"], offer:"Discounted setup for members" },
  { name:"Xactus",                       short:"XAC", cat:"Core Partner",g:["#1b4f7a","#20adce"], desc:"Verification and credit solutions trusted across the mortgage industry.", tags:["Credit","Verifications"], offer:"Member pricing on verification bundles" },
  { name:"The CORE Training",            short:"CORE",cat:"Coaching",    g:["#5b2a86","#a23fb0"], desc:"Performance coaching program for top-producing originators and teams.", tags:["Coaching","Scaling"], offer:"Discounted enrollment for members" },
  { name:"Mortgage Coach",               short:"MC",  cat:"Coaching",    g:["#0b1f5b","#1893b1"], desc:"Interactive presentations that help borrowers understand their options.", tags:["Presentations","Coaching"], offer:"Free trial + member rate" },
  { name:"Surefire CRM",                 short:"SF",  cat:"Marketing",   g:["#7a1f55","#dd1969"], desc:"Mortgage CRM and marketing automation built for loan officers.", tags:["CRM","Automation"], offer:"Setup fee waived for members" },
];

// `topic` is an optional content tag (AI Strategy / Marketing / Sales) used by the
// Resources filter chips. A card matches a chip on either its type OR its topic.
const resources = [
  { title:"The 'Daily Six' Challenge (Part 3)", type:"Podcast",  cta:"Listen now", dur:"28 min", topic:"Sales",       g:["#5b2a86","#dd1969"] },
  { title:"Broker to Broker — Episode 251",     type:"Podcast",  cta:"Listen now", dur:"41 min",                     g:["#0b1f5b","#20adce"] },
  { title:"Broker Power-Up: Episode 65",        type:"Webinar",  cta:"Watch now",  dur:"52 min", topic:"Marketing",   g:["#1b1b3a","#7a3fb0"] },
  { title:"Using AI to Pre-Qualify Borrowers",  type:"Webinar",  cta:"Watch now",  dur:"39 min", topic:"AI Strategy", g:["#0b1f5b","#1893b1"] },
  { title:"AI Tools for the Daily Workflow",    type:"Training", cta:"Watch now",  dur:"31 min", topic:"AI Strategy", g:["#021649","#7a3fb0"] },
  { title:"Mortgage Mornings — June 17, 2026",  type:"Webinar",  cta:"Watch now",  dur:"35 min",                     g:["#0b2a5b","#e0463c"] },
  { title:"Women's Mortgage Network Podcast",   type:"Podcast",  cta:"Listen now", dur:"33 min",                     g:["#86145a","#dd1969"] },
  { title:"The Social Media Playbook",          type:"Training", cta:"Watch now",  dur:"42 min", topic:"Marketing",   g:["#86145a","#20adce"] },
  { title:"Closing: Objection Handling 101",    type:"Training", cta:"Watch now",  dur:"29 min", topic:"Sales",       g:["#0b2a5b","#dd1969"] },
  { title:"Broker to Broker — Episode 250",     type:"Podcast",  cta:"Listen now", dur:"39 min",                     g:["#0b1f5b","#163a85"] },
  { title:"AIME Accelerate — Identity Reset",   type:"Training", cta:"Watch now",  dur:"24 min",                     g:["#1b1b3a","#20adce"] },
  { title:"Scaling Past $1M in Volume",         type:"Training", cta:"Watch now",  dur:"47 min", topic:"Sales",       g:["#021649","#1893b1"] },
  { title:"Compliance Corner — Q3 Update",      type:"Webinar",  cta:"Watch now",  dur:"38 min",                     g:["#0b2a5b","#1893b1"] },
  { title:"Building Your Referral Engine",      type:"Training", cta:"Watch now",  dur:"45 min", topic:"Marketing",   g:["#5b2a86","#20adce"] },
  { title:"Broker to Broker — Episode 249",     type:"Podcast",  cta:"Listen now", dur:"44 min",                     g:["#0b1f5b","#7a3fb0"] },
];

const events = [
  { title:"AIME Accelerate — Identity Reset", date:"JUN 6",  when:"Mon · 1:00 PM ET", type:"Virtual",   g:["#1b1b3a","#dd1969"] },
  { title:"AIME Accelerate — Win the Day",    date:"JUN 15", when:"Mon · 1:00 PM ET", type:"Virtual",   g:["#0b1f5b","#20adce"] },
  { title:"AIME Accelerate — Run Toward It",  date:"JUN 22", when:"Mon · 1:00 PM ET", type:"Virtual",   g:["#5b2a86","#dd1969"] },
  { title:"Mortgage Mornings — Live",         date:"JUL 1",  when:"Wed · 10:00 AM ET",type:"Virtual",   g:["#0b2a5b","#e0463c"] },
  { title:"AIME Accelerate — Compound",       date:"JUN 29", when:"Mon · 1:00 PM ET", type:"Training",  g:["#1b1b3a","#1893b1"] },
  { title:"FUSE 2026 — National Conference",  date:"SEP 14", when:"Austin, TX",       type:"In person", loc:"JW Marriott Downtown Austin, TX", g:["#021649","#dd1969"] },
  { title:"AIME Accelerate — Mindset",        date:"JUL 6",  when:"Mon · 1:00 PM ET", type:"Training",  g:["#1b1b3a","#7a3fb0"] },
  { title:"Regional Mixer — Dallas",          date:"AUG 12", when:"Tue · 6:00 PM CT", type:"In person", loc:"Downtown Dallas, TX", g:["#0b2a5b","#20adce"] },
];

const backArrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
const firstWord = (t) => t.split('—')[0].trim().split(' ')[0].toUpperCase();

/* ---------- Card templates (clickable region + separate action footer) ---------- */
// Lenders are logo-only on the list page (logo already carries the name; name shows on the detail page)
function lenderCard(l, i){
  return `<div class="partner-card lender-card" data-tier="${l.tier}" data-products="${l.tags.join('|')}">
    <button class="card-open" data-open-lender="${i}" title="${l.name}">
      <div class="lender-logo-box">
        <span class="badge ${tierBadge[l.tier]}" style="position:absolute;top:12px;right:12px">${l.tier}</span>
        <div class="lender-logo-ph" style="color:${l.color}">${l.short}</div>
      </div>
    </button>
    <div class="partner-foot">
      <button class="btn btn-primary btn-sm" data-modal="escalate">Escalate</button>
      <button class="btn btn-outline btn-sm" data-open-lender="${i}">View</button>
    </div>
  </div>`;
}

// Market items use the same thumbnail size as Events & Resources
function vendorCard(v, i){
  return `<div class="res-card" data-filter="${v.cat}">
    <button class="card-open" data-open-market="${i}">
      <div class="res-thumb" style="background:linear-gradient(135deg,${v.g[0]},${v.g[1]})">
        <span class="res-type"><span class="badge" style="background:rgba(255,255,255,.9);color:#0b1f5b">${v.cat}</span></span>
        ${firstWord(v.name)}
      </div>
      <div class="res-body">
        <h3>${v.name}</h3>
        <div class="res-meta">${v.offer}</div>
      </div>
    </button>
    <div style="padding:0 17px 17px">
      <button class="btn btn-cyan btn-sm btn-block" data-open-market="${i}">More info</button>
    </div>
  </div>`;
}

function resCard(r, i){
  return `<div class="res-card" data-filter="${r.type}${r.topic?'|'+r.topic:''}">
    <button class="card-open" data-open-resource="${i}">
      <div class="res-thumb" style="background:linear-gradient(135deg,${r.g[0]},${r.g[1]})">
        <span class="res-type"><span class="badge" style="background:rgba(255,255,255,.9);color:#0b1f5b">${r.type}</span></span>
        ${firstWord(r.title)}
        <span class="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg></span>
      </div>
      <div class="res-body">
        <h3>${r.title}</h3>
        <div class="res-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> ${r.dur}</div>
      </div>
    </button>
    <div style="padding:0 17px 17px">
      <button class="btn btn-outline btn-sm btn-block" data-open-resource="${i}">${r.cta}</button>
    </div>
  </div>`;
}

function eventCard(e, i){
  return `<div class="event-card" data-filter="${e.type}">
    <button class="card-open" data-open-event="${i}">
      <div class="event-banner" style="background:linear-gradient(135deg,${e.g[0]},${e.g[1]})">
        <span style="position:absolute;left:12px;top:12px"><span class="badge" style="background:rgba(255,255,255,.9);color:#0b1f5b">${e.type}</span></span>
        ${firstWord(e.title)}
      </div>
      <div class="event-body">
        <h3>${e.title}</h3>
        <div class="when"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg> ${e.when}</div>
      </div>
    </button>
    <div class="event-foot">
      <button class="btn btn-cyan btn-sm btn-block" data-open-event="${i}">More info</button>
    </div>
  </div>`;
}

/* ---------- Populate grids ---------- */
document.getElementById('lender-grid').innerHTML  = lenders.map(lenderCard).join('');

/* ---------- Lender filtering (by tier + product type) ---------- */
const lenderProducts = [...new Set(lenders.flatMap(l=>l.tags))].sort();
const productSelect = document.getElementById('lender-product');
if(productSelect){
  productSelect.innerHTML = '<option value="all">All products</option>' +
    lenderProducts.map(p=>`<option value="${p}">${p}</option>`).join('');
}
function filterLenders(){
  const group = document.getElementById('lender-filters');
  const activeChip = group.querySelector('.chip.active');
  const tier = activeChip ? activeChip.dataset.tier : 'all';
  const product = productSelect ? productSelect.value : 'all';
  let shown = 0;
  document.querySelectorAll('#lender-grid .partner-card').forEach(card=>{
    const okTier = tier==='all' || card.dataset.tier===tier;
    const okProd = product==='all' || card.dataset.products.split('|').includes(product);
    const show = okTier && okProd;
    card.style.display = show ? '' : 'none';
    if(show) shown++;
  });
  const note = document.getElementById('lender-count');
  if(note){
    const filtered = (tier!=='all' || product!=='all');
    note.textContent = filtered ? `Showing ${shown} of ${lenders.length} lenders` : `Showing all ${lenders.length} lenders`;
  }
}
document.getElementById('lender-filters')?.addEventListener('click', e=>{
  const chip = e.target.closest('.chip'); if(!chip) return;
  document.querySelectorAll('#lender-filters .chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  filterLenders();
});
productSelect?.addEventListener('change', filterLenders);
filterLenders();
document.getElementById('market-grid').innerHTML  = vendors.map(vendorCard).join('');
document.getElementById('resource-grid').innerHTML= resources.map(resCard).join('');
document.getElementById('event-grid').innerHTML   = events.map(eventCard).join('');

// Featured on dashboard — can highlight anything new/notable
const featured = [
  { kind:"Lender",   title:"Newrez Wholesale",                sub:"Just joined as a Gold partner", cta:"View lender", g:["#0b1f5b","#e0463c"], nav:"lenders" },
  { kind:"Resource", title:"AIME Accelerate — Identity Reset", sub:"New training added",            cta:"Watch now",   g:["#1b1b3a","#20adce"], nav:"resources" },
  { kind:"Market",   title:"Waive Inspection Fee",            sub:"New member deal",               cta:"View deal",   g:["#1b7a4a","#20adce"], nav:"market" },
  { kind:"Event",    title:"FUSE 2026",                       sub:"Tickets on sale now",           cta:"Get tickets", g:["#021649","#dd1969"], nav:"events" },
];
const kindBadge = { Lender:"badge-navy", Resource:"badge-pink", Market:"badge-cyan", Event:"badge-amber" };
document.getElementById('featured-grid').innerHTML = featured.map(f=>`
  <div class="res-card">
    <button class="card-open" data-nav="${f.nav}">
      <div class="res-thumb" style="background:linear-gradient(135deg,${f.g[0]},${f.g[1]});height:120px;font-size:17px">
        <span class="res-type"><span class="badge ${kindBadge[f.kind]}" style="background:rgba(255,255,255,.92)">${f.kind}</span></span>
        ${firstWord(f.title)}
      </div>
      <div class="res-body">
        <h3 style="min-height:0">${f.title}</h3>
        <div class="res-meta" style="margin-top:5px">${f.sub}</div>
      </div>
    </button>
    <div style="padding:0 17px 17px"><button class="btn btn-outline btn-sm btn-block" data-nav="${f.nav}">${f.cta}</button></div>
  </div>`).join('');

// This-week events on dashboard (clickable to event detail)
document.getElementById('dash-events').innerHTML = events.slice(0,3).map((e,i)=>{
  const [m,d] = e.date.split(' ');
  return `<button class="ev-mini" data-open-event="${i}">
    <div class="ev-date"><span class="d">${d}</span><span class="m">${m}</span></div>
    <div style="flex:1;align-self:center;text-align:left"><div class="em-t">${e.title}</div><div class="em-s">${e.when}</div></div>
  </button>`;
}).join('');

/* ========================================================================
   RESOURCE HUBS — Brokers Edge, Mortgage Mornings, WMN, Ascent, VIP
   ------------------------------------------------------------------------
   Standard hubs (Brokers Edge / Mortgage Mornings / Ascent): a Resources-style
   content grid + a Documents tab. Mixed hubs (VIP / WMN) bundle videos, events
   and documents into one exclusive hub.

   VIP gating: in production, `vip:true` hubs are shown ONLY to VIP members.
   The test profile is Elite, so we'd normally hide Ascent + VIP — but for this
   prototype we keep them visible (with a "VIP" badge + preview note) so the
   content can be reviewed. Flip SHOW_VIP_IN_PROTOTYPE to false to see the real
   member-tier behavior.
   ===================================================================== */
const memberTier = 'Elite';
const SHOW_VIP_IN_PROTOTYPE = true;
const canSeeVIP = (memberTier === 'VIP') || SHOW_VIP_IN_PROTOTYPE;

const hubs = {
  brokersedge: {
    name:"Brokers Edge", layout:"standard", vip:false, contentLabel:"Certifications",
    intro:"AIME's certification platform — complete a track to earn and showcase your Brokers Edge credentials.",
    content:[
      { title:"Brokers Edge — Core Certification", type:"Certification", dur:"6 modules · ~3 hrs",  cta:"Start course", g:["#021649","#20adce"] },
      { title:"Non-QM Specialist",                 type:"Certification", dur:"4 modules · ~2 hrs",  cta:"Start course", g:["#0b1f5b","#dd1969"] },
      { title:"VA Loan Pro",                       type:"Certification", dur:"3 modules · ~90 min", cta:"Start course", g:["#1b1b3a","#1893b1"] },
      { title:"Self-Employed Borrowers",           type:"Certification", dur:"4 modules · ~2 hrs",  cta:"Start course", g:["#5b2a86","#20adce"] },
    ],
    documents:[
      { title:"Brokers Edge Curriculum Guide",        desc:"Full breakdown of every certification track and what each module covers.", link:"#" },
      { title:"Certification Completion Checklist",   desc:"Print-friendly checklist to track your progress toward each credential.", link:"#" },
      { title:"Continuing Education Credit Form",     desc:"Submit completed certifications for CE credit where applicable.", link:"#" },
    ],
  },
  mortgagemornings: {
    name:"Mortgage Mornings", layout:"standard", vip:false, contentLabel:"Recordings",
    intro:"Every Mortgage Mornings episode, on demand — catch up on the ones you missed.",
    content:[
      { title:"Mortgage Mornings — June 24, 2026", type:"Recording", dur:"36 min", cta:"Watch now", g:["#0b2a5b","#e0463c"] },
      { title:"Mortgage Mornings — June 17, 2026", type:"Recording", dur:"35 min", cta:"Watch now", g:["#0b2a5b","#1893b1"] },
      { title:"Mortgage Mornings — June 10, 2026", type:"Recording", dur:"41 min", cta:"Watch now", g:["#0b1f5b","#20adce"] },
      { title:"Mortgage Mornings — June 3, 2026",  type:"Recording", dur:"33 min", cta:"Watch now", g:["#1b1b3a","#dd1969"] },
    ],
    documents:[
      { title:"Rate Sheet Roundup — This Week", desc:"The weekly rate and market snapshot referenced on the show.", link:"#" },
      { title:"Show Notes Archive (2026)",      desc:"Links and resources mentioned across every 2026 episode.", link:"#" },
    ],
  },
  acceleratelive: {
    name:"Accelerate Live", layout:"standard", vip:false, contentLabel:"Replays",
    intro:"Live coaching sessions and replays from the AIME Accelerate program — momentum for your business every week.",
    content:[
      { title:"Accelerate Live — Identity Reset", type:"Recording", dur:"58 min", cta:"Watch now", g:["#1b1b3a","#dd1969"] },
      { title:"Accelerate Live — Win the Day",    type:"Recording", dur:"52 min", cta:"Watch now", g:["#0b1f5b","#20adce"] },
      { title:"Accelerate Live — Run Toward It",  type:"Recording", dur:"47 min", cta:"Watch now", g:["#5b2a86","#1893b1"] },
      { title:"Accelerate Live — Compound",       type:"Recording", dur:"55 min", cta:"Watch now", g:["#021649","#7a3fb0"] },
    ],
    documents:[
      { title:"Accelerate Live — Session Workbook", desc:"The companion workbook used across the current Accelerate Live series.", link:"#" },
      { title:"Weekly Action Plan Template",        desc:"Turn each session into a concrete weekly plan for your team.", link:"#" },
    ],
  },
  ascent: {
    name:"Ascent", layout:"standard", vip:true, contentLabel:"Trainings",
    intro:"AIME's invite-only leadership program — strategy sessions for scaling brokerages.",
    content:[
      { title:"Ascent — Leading at Scale",     type:"Training", dur:"52 min", cta:"Watch now", g:["#021649","#dd1969"] },
      { title:"Ascent — Building a $100M Team", type:"Training", dur:"47 min", cta:"Watch now", g:["#1b1b3a","#20adce"] },
      { title:"Ascent — The Founder Mindset",   type:"Training", dur:"38 min", cta:"Watch now", g:["#5b2a86","#1893b1"] },
    ],
    documents:[
      { title:"Ascent Workbook — Q3 Cohort",    desc:"Companion workbook for the current Ascent leadership cohort.", link:"#" },
      { title:"90-Day Growth Plan Template",    desc:"The planning template used in the Leading at Scale session.", link:"#" },
    ],
  },
  vip: {
    name:"VIP", layout:"hub", vip:true,
    intro:"Your VIP hub — exclusive content, events, and resources reserved for VIP members.",
    content:[
      { title:"VIP Roundtable — Scaling to IMB", type:"Video", dur:"58 min", cta:"Watch now", g:["#021649","#e0982a"] },
      { title:"1:1 Strategy Session Replay",     type:"Video", dur:"44 min", cta:"Watch now", g:["#1b1b3a","#dd1969"] },
    ],
    events:[
      { title:"VIP Luncheon @ FUSE 2026", date:"SEP 14", when:"Austin, TX",        type:"In person", g:["#021649","#e0982a"] },
      { title:"VIP Quarterly Mastermind", date:"JUL 18", when:"Thu · 2:00 PM ET",  type:"Virtual",   g:["#1b1b3a","#20adce"] },
    ],
    documents:[
      { title:"VIP Benefits Guide",                desc:"Everything included with your VIP membership, in one place.", link:"#" },
      { title:"Speaking & Feature Opportunities",  desc:"How to apply for AIME stage time and media features.", link:"#" },
    ],
  },
  wmn: {
    name:"WMN — Women's Mortgage Network", layout:"hub", vip:false,
    intro:"Community, events, and resources from the Women's Mortgage Network.",
    content:[
      { title:"WMN Podcast — Owning Your Worth",          type:"Podcast", dur:"33 min", cta:"Listen now", g:["#86145a","#dd1969"] },
      { title:"WMN Panel — Building Referral Networks",   type:"Webinar", dur:"49 min", cta:"Watch now",  g:["#5b2a86","#20adce"] },
    ],
    events:[
      { title:"WMN at FUSE 2026",  date:"SEP 14", when:"Austin, TX",       type:"In person", g:["#86145a","#dd1969"] },
      { title:"WMN Monthly Meetup", date:"JUL 9", when:"Wed · 12:00 PM ET", type:"Virtual",   g:["#5b2a86","#1893b1"] },
    ],
    documents:[
      { title:"WMN Mentorship Program Overview", desc:"How to join as a mentor or mentee for this cohort.", link:"#" },
      { title:"WMN Community Guidelines",        desc:"Our values and how we show up for each other.", link:"#" },
    ],
  },
};

const clockIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const calIcon   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>';

function hubContentCard(item, key, kind, i){
  return `<div class="res-card">
    <button class="card-open" data-open-hub="${key}:${kind}:${i}">
      <div class="res-thumb" style="background:linear-gradient(135deg,${item.g[0]},${item.g[1]})">
        <span class="res-type"><span class="badge" style="background:rgba(255,255,255,.9);color:#0b1f5b">${item.type}</span></span>
        ${firstWord(item.title)}
        <span class="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg></span>
      </div>
      <div class="res-body">
        <h3>${item.title}</h3>
        <div class="res-meta">${clockIcon} ${item.dur}</div>
      </div>
    </button>
    <div style="padding:0 17px 17px">
      <button class="btn btn-outline btn-sm btn-block" data-open-hub="${key}:${kind}:${i}">${item.cta}</button>
    </div>
  </div>`;
}

function hubEventCard(ev, key, i){
  return `<div class="event-card">
    <button class="card-open" data-open-hub="${key}:event:${i}">
      <div class="event-banner" style="background:linear-gradient(135deg,${ev.g[0]},${ev.g[1]})">
        <span style="position:absolute;left:12px;top:12px"><span class="badge" style="background:rgba(255,255,255,.9);color:#0b1f5b">${ev.type}</span></span>
        ${firstWord(ev.title)}
      </div>
      <div class="event-body">
        <h3>${ev.title}</h3>
        <div class="when">${calIcon} ${ev.date}, 2026 · ${ev.when}</div>
      </div>
    </button>
    <div class="event-foot">
      <button class="btn btn-cyan btn-sm btn-block" data-open-hub="${key}:event:${i}">More info</button>
    </div>
  </div>`;
}

function docList(docs){
  return `<div class="card card-pad doc-card">
    ${docs.map(d=>`<div class="list-row doc-row">
      <div class="list-logo">📄</div>
      <div class="list-main"><div class="lt">${d.title}</div><div class="ls">${d.desc}</div></div>
      <a class="btn btn-outline btn-sm" href="${d.link}" data-toast="Downloading: ${d.title}">Download</a>
    </div>`).join('')}
  </div>`;
}

function renderHub(key){
  const hub = hubs[key];
  const root = document.getElementById('view-'+key);
  if(!hub || !root) return;

  const vipNote = hub.vip ? `<div class="vip-note">⭐ <strong>VIP-only hub.</strong> You're seeing a preview — in the live portal this is visible only to VIP members.</div>` : '';
  const grid = (items, kind) => `<div class="card-grid">${items.map((it,i)=>hubContentCard(it,key,kind,i)).join('')}</div>`;
  const eventGrid = (items) => `<div class="card-grid">${items.map((e,i)=>hubEventCard(e,key,i)).join('')}</div>`;

  if(hub.layout === 'standard'){
    root.innerHTML = `
      <div class="page-head"><h1>${hub.name}</h1><p>${hub.intro}</p></div>
      ${vipNote}
      <div class="tabs hub-tabs">
        <button class="tab active" data-hubview="${key}" data-hubtab="content">${hub.contentLabel||'Content'}</button>
        <button class="tab" data-hubview="${key}" data-hubtab="documents">Documents</button>
      </div>
      <div class="hub-panel" data-panel="content">${grid(hub.content,'content')}</div>
      <div class="hub-panel" data-panel="documents" style="display:none">${docList(hub.documents)}</div>`;
  } else {
    // Mixed hub — All / Videos / Documents / Events
    root.innerHTML = `
      <div class="page-head"><h1>${hub.name}</h1><p>${hub.intro}</p></div>
      ${vipNote}
      <div class="tabs hub-tabs">
        <button class="tab active" data-hubview="${key}" data-hubtab="all">All</button>
        <button class="tab" data-hubview="${key}" data-hubtab="content">Videos</button>
        <button class="tab" data-hubview="${key}" data-hubtab="events">Events</button>
        <button class="tab" data-hubview="${key}" data-hubtab="documents">Documents</button>
      </div>
      <div class="hub-panel" data-panel="all">
        <div class="hub-section-title">Videos &amp; recordings</div>${grid(hub.content,'content')}
        <div class="hub-section-title">Upcoming events</div>${eventGrid(hub.events)}
        <div class="hub-section-title">Documents</div>${docList(hub.documents)}
      </div>
      <div class="hub-panel" data-panel="content" style="display:none">${grid(hub.content,'content')}</div>
      <div class="hub-panel" data-panel="events" style="display:none">${eventGrid(hub.events)}</div>
      <div class="hub-panel" data-panel="documents" style="display:none">${docList(hub.documents)}</div>`;
  }
}
Object.keys(hubs).forEach(renderHub);

function setHubTab(view, tab){
  const root = document.getElementById('view-'+view);
  if(!root) return;
  root.querySelectorAll('.hub-tabs .tab').forEach(t=>t.classList.toggle('active', t.dataset.hubtab===tab));
  root.querySelectorAll('.hub-panel').forEach(p=>p.style.display = (p.dataset.panel===tab)?'':'none');
}

let currentHub = null;
function openHubItem(key, kind, i){
  const hub = hubs[key]; if(!hub) return;
  currentHub = key;
  const list = kind==='event' ? hub.events : hub.content;
  const it = list && list[i]; if(!it) return;
  const back = `<a class="back-link" data-nav="${key}">${backArrow} Back to ${hub.name}</a>`;

  if(kind==='event'){
    document.getElementById('hub-detail-body').innerHTML = `${back}
      <div class="card" style="overflow:hidden;margin-bottom:20px">
        <div class="detail-banner" style="background:linear-gradient(135deg,${it.g[0]},${it.g[1]})">
          <span style="position:absolute;left:18px;top:18px"><span class="badge" style="background:rgba(255,255,255,.92);color:#0b1f5b">${it.type}</span></span>
          <div style="font-size:30px;font-weight:800">${firstWord(it.title)}</div>
        </div>
      </div>
      <div class="grid" style="grid-template-columns:1.6fr 1fr;align-items:start">
        <div class="card card-pad">
          <h1 style="font-size:24px">${it.title}</h1>
          <p style="color:var(--ink-soft);margin:14px 0;line-height:1.7">A ${hub.name} event — connect with the community, learn from leaders, and take away tactics you can use right away.</p>
        </div>
        <div class="card card-pad summary-card">
          <h3 style="font-size:16px;margin-bottom:14px">Event details</h3>
          <div class="detail-meta-row"><span>📅</span> ${it.date}, 2026</div>
          <div class="detail-meta-row"><span>⏰</span> ${it.when}</div>
          <div class="detail-meta-row"><span>📍</span> ${it.type==='In person'?'In person — venue details to follow':'Online — link sent after registering'}</div>
          <button class="btn btn-primary btn-block" style="margin-top:16px" data-toast="You're registered — confirmation on its way.">Register</button>
        </div>
      </div>`;
  } else {
    document.getElementById('hub-detail-body').innerHTML = `${back}
      <div class="card" style="overflow:hidden">
        <div class="detail-banner" style="background:linear-gradient(135deg,${it.g[0]},${it.g[1]})">
          <span style="position:absolute;left:18px;top:18px"><span class="badge" style="background:rgba(255,255,255,.92);color:#0b1f5b">${it.type}</span></span>
          <div style="font-size:30px;font-weight:800;letter-spacing:.04em">${firstWord(it.title)}</div>
        </div>
        <div class="card-pad">
          <h1 style="font-size:24px">${it.title}</h1>
          <div class="res-meta" style="margin-top:10px;font-size:13.5px">⏱ ${it.dur} · ${hub.name} · AIME</div>
          <p style="color:var(--ink-soft);margin:16px 0;line-height:1.7;max-width:720px">Part of the ${hub.name} library — actionable strategy you can apply this week, from top originators and AIME experts.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-primary" data-toast="Now playing: ${it.title}">▶ ${it.cta}</button>
            <button class="btn btn-outline" data-toast="Saved to your library.">Save for later</button>
          </div>
        </div>
      </div>`;
  }
  navigate('hub-detail');
}

/* ========================================================================
   DOCUMENTS — one page listing every document available to the member.
   Aggregates the per-hub `documents` plus general member docs, and GATES by
   membership tier: documents from VIP-only hubs are hidden unless the member's
   tier clears the requirement. Filter chips across the top scope by source
   (Brokers Edge, Mortgage Mornings, WMN, …). Production uses the same gate;
   here the test profile is Elite, so VIP/Ascent docs are filtered out.
   ===================================================================== */
// General member documents — not tied to any hub; available to every tier.
const generalDocuments = [
  { title:"AIME Member Handbook",     desc:"Your complete guide to membership benefits and getting the most from the portal.", link:"#" },
  { title:"Loan Escalation Guide",    desc:"How to submit an escalation and exactly what lenders need from you.", link:"#" },
  { title:"AIME Brand & Logo Kit",    desc:"Logos, colors, and co-branding guidelines for your own marketing.", link:"#" },
  { title:"2026 Membership Agreement",desc:"The current terms of your AIME membership.", link:"#" },
];

const TIER_RANK = { Premium:1, Elite:2, VIP:3 };
// A doc is accessible if the member's tier clears its source hub's requirement.
// VIP-only hubs require the VIP tier. (NB: this uses the REAL member tier, not the
// SHOW_VIP_IN_PROTOTYPE preview flag — so the page demonstrates true tier-gating.)
function memberCanAccess(isVip){ return !isVip || TIER_RANK[memberTier] >= TIER_RANK.VIP; }

const DOC_SOURCE_LABEL = { general:"General", brokersedge:"Brokers Edge",
  mortgagemornings:"Mortgage Mornings", acceleratelive:"Accelerate Live",
  wmn:"WMN", ascent:"Ascent", vip:"VIP" };
const DOC_SOURCE_ORDER = ['general','brokersedge','mortgagemornings','acceleratelive','wmn','ascent','vip'];

function collectDocuments(){
  const out = generalDocuments.map(d=>({ ...d, sourceKey:'general', vip:false }));
  Object.keys(hubs).forEach(key=>{
    (hubs[key].documents||[]).forEach(d=>out.push({ ...d, sourceKey:key, vip:!!hubs[key].vip }));
  });
  return out;
}

function renderDocuments(){
  const root = document.getElementById('view-documents');
  if(!root) return;
  const accessible = collectDocuments().filter(d=>memberCanAccess(d.vip));
  const sources = DOC_SOURCE_ORDER.filter(k=>accessible.some(d=>d.sourceKey===k));
  const chips = `<button class="chip active" data-docfilter="all">All</button>`
    + sources.map(k=>`<button class="chip" data-docfilter="${k}">${DOC_SOURCE_LABEL[k]}</button>`).join('');
  const rows = accessible.map(d=>`
    <div class="list-row doc-row" data-source="${d.sourceKey}">
      <div class="list-logo">📄</div>
      <div class="list-main"><div class="lt">${d.title}</div><div class="ls">${d.desc}</div></div>
      <span class="doc-src">${DOC_SOURCE_LABEL[d.sourceKey]}</span>
      <a class="btn btn-outline btn-sm" href="${d.link}" data-toast="Downloading: ${d.title}">Download</a>
    </div>`).join('');
  root.innerHTML = `
    <div class="page-head"><h1>Documents</h1><p>Every document available on your ${memberTier} membership, in one place.</p></div>
    <div class="filters" id="document-filters">${chips}<span class="count-note" style="margin-left:auto;align-self:center">Showing all ${accessible.length} documents</span></div>
    <div class="card card-pad doc-card" id="document-list">${rows}</div>`;
}
renderDocuments();

function filterDocuments(val){
  const group = document.getElementById('document-filters'); if(!group) return;
  group.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active', c.dataset.docfilter===val));
  let shown = 0;
  document.querySelectorAll('#document-list .doc-row').forEach(row=>{
    const show = val==='all' || row.dataset.source===val;
    row.style.display = show ? '' : 'none';
    if(show) shown++;
  });
  const note = group.querySelector('.count-note');
  if(note) note.textContent = (val==='all') ? `Showing all ${shown} documents` : `Showing ${shown} document${shown===1?'':'s'}`;
}

/* ---------- Navigation ---------- */
function navigate(view){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+view)?.classList.add('active');
  const navMatch = (n)=> n.dataset.nav===view ||
    (view==='lender-detail'&&n.dataset.nav==='lenders') ||
    (view==='market-detail'&&n.dataset.nav==='market') ||
    (view==='resource-detail'&&n.dataset.nav==='resources') ||
    (view==='event-detail'&&n.dataset.nav==='events') ||
    (view==='hub-detail'&&n.dataset.nav===currentHub);
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active', navMatch(n)));
  document.querySelectorAll('.bottom-nav-item').forEach(n=>n.classList.toggle('active', navMatch(n)));
  closeNotif();
  document.getElementById('sidebar')?.classList.remove('open');
  if(view==='fuse'){ ticketClaimed = true; updateClaimBanner(); }  // visiting registration confirms the claim
  window.scrollTo(0,0);
}

/* ---------- FUSE ticket claim banner ---------- */
let ticketClaimed = false, bannerDismissed = false;
function updateClaimBanner(){
  const b = document.getElementById('claim-banner');
  if(b) b.style.display = (!ticketClaimed && !bannerDismissed) ? '' : 'none';
}
function flashAddons(){
  const r = document.getElementById('addon-reminder');
  if(!r) return;
  r.classList.remove('flash'); void r.offsetWidth; r.classList.add('flash');
}

/* ---------- Detail pages ---------- */
function openLender(i){
  const l = lenders[i]; if(!l) return;
  document.getElementById('lender-detail-body').innerHTML = `
    <a class="back-link" data-nav="lenders">${backArrow} Back to lenders</a>
    <div class="card card-pad">
      <div class="detail-head">
        <div class="detail-logo" style="color:${l.color}">${l.short}</div>
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><h1 style="font-size:24px">${l.name}</h1><span class="badge ${tierBadge[l.tier]}">${l.tier} partner</span></div>
          <p style="color:var(--ink-soft);margin:10px 0 0;max-width:700px;line-height:1.6">${l.desc}</p>
          <div class="tag-row" style="margin-top:16px">${l.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
          <div style="display:flex;gap:10px;margin-top:22px;flex-wrap:wrap">
            <button class="btn btn-primary" data-modal="escalate">Escalate a loan</button>
            <button class="btn btn-cyan" data-modal="connect">Connect</button>
            <button class="btn btn-outline" data-modal="changeae">Change AE</button>
          </div>
        </div>
      </div>
    </div>
    <div class="grid" style="grid-template-columns:1fr 1fr;align-items:start;margin-top:20px">
      <div class="card card-pad"><h3 style="font-size:16px;margin-bottom:12px">Product offerings</h3><div class="tag-row">${l.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div></div>
      <div class="card card-pad"><h3 style="font-size:16px;margin-bottom:10px">Need help with a file?</h3><p style="color:var(--ink-soft);font-size:13.5px;margin:0 0 14px">Escalate a loan in your pipeline to send a report straight to ${l.name}'s escalation team.</p><button class="btn btn-primary btn-sm" data-modal="escalate">Escalate a loan</button></div>
    </div>`;
  navigate('lender-detail');
}

function openVendor(i){
  const v = vendors[i]; if(!v) return;
  document.getElementById('market-detail-body').innerHTML = `
    <a class="back-link" data-nav="market">${backArrow} Back to market</a>
    <div class="card" style="overflow:hidden">
      <div class="detail-banner" style="background:linear-gradient(135deg,${v.g[0]},${v.g[1]})">
        <span style="position:absolute;left:18px;top:18px"><span class="badge" style="background:rgba(255,255,255,.92);color:#0b1f5b">${v.cat}</span></span>
        <div style="font-size:30px;font-weight:800">${firstWord(v.name)}</div>
      </div>
      <div class="card-pad">
        <h1 style="font-size:24px">${v.name}</h1>
        <p style="color:var(--ink-soft);margin:14px 0;max-width:720px;line-height:1.7">${v.desc} As an AIME member, you unlock exclusive pricing and priority onboarding with ${v.name}.</p>
        <div class="tag-row">${v.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap">
          <button class="btn btn-cyan" data-toast="Connection request sent to ${v.name}.">Connect with ${v.name}</button>
          <button class="btn btn-outline" data-toast="Opening website…">Visit website</button>
        </div>
      </div>
    </div>
    <div class="grid" style="grid-template-columns:1fr 1fr;align-items:start;margin-top:20px">
      <div class="card card-pad"><h3 style="font-size:16px;margin-bottom:12px">Your member benefit</h3><div class="callout" style="margin:0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12V8H6a2 2 0 010-4h12v4M4 6v12a2 2 0 002 2h14v-4M18 12a2 2 0 000 4h4v-4z"/></svg><p>${v.offer}</p></div></div>
      <div class="card card-pad"><h3 style="font-size:16px;margin-bottom:12px">How it works</h3><ol class="how-list how-num"><li>Click Connect to request an intro.</li><li>${v.name} reaches out within 1 business day.</li><li>Mention AIME to claim your member pricing.</li></ol></div>
    </div>`;
  navigate('market-detail');
}

function openResource(i){
  const r = resources[i]; if(!r) return;
  document.getElementById('resource-detail-body').innerHTML = `
    <a class="back-link" data-nav="resources">${backArrow} Back to resources</a>
    <div class="card" style="overflow:hidden">
      <div class="detail-banner" style="background:linear-gradient(135deg,${r.g[0]},${r.g[1]})">
        <span style="position:absolute;left:18px;top:18px"><span class="badge" style="background:rgba(255,255,255,.92);color:#0b1f5b">${r.type}</span></span>
        <div style="font-size:30px;font-weight:800;letter-spacing:.04em">${firstWord(r.title)}</div>
      </div>
      <div class="card-pad">
        <h1 style="font-size:24px">${r.title}</h1>
        <div class="res-meta" style="margin-top:10px;font-size:13.5px">⏱ ${r.dur} · Hosted by AIME · Published Jun 2026</div>
        <p style="color:var(--ink-soft);margin:16px 0;line-height:1.7;max-width:720px">In this ${r.type.toLowerCase()}, we break down actionable strategies you can apply to your business this week — learn from top originators and AIME experts on growing volume, sharpening your process, and winning more borrowers.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary" data-toast="Now playing: ${r.title}">▶ ${r.cta}</button>
          <button class="btn btn-outline" data-toast="Saved to your library.">Save for later</button>
        </div>
      </div>
    </div>
    <div style="margin-top:24px"><div class="section-title"><h2>Up next</h2></div><div class="card-grid" id="res-related"></div></div>`;
  document.getElementById('res-related').innerHTML = resources
    .map((rr,j)=>({rr,j})).filter(o=>o.j!==i).slice(0,4)
    .map(o=>resCard(o.rr,o.j)).join('');
  navigate('resource-detail');
}

function openEvent(i){
  const ev = events[i]; if(!ev) return;
  document.getElementById('event-detail-body').innerHTML = `
    <a class="back-link" data-nav="events">${backArrow} Back to events</a>
    <div class="card" style="overflow:hidden;margin-bottom:20px">
      <div class="detail-banner" style="background:linear-gradient(135deg,${ev.g[0]},${ev.g[1]})">
        <span style="position:absolute;left:18px;top:18px"><span class="badge" style="background:rgba(255,255,255,.92);color:#0b1f5b">${ev.type}</span></span>
        <div style="font-size:30px;font-weight:800">${firstWord(ev.title)}</div>
      </div>
    </div>
    <div class="grid" style="grid-template-columns:1.6fr 1fr;align-items:start">
      <div class="card card-pad">
        <h1 style="font-size:24px">${ev.title}</h1>
        <p style="color:var(--ink-soft);margin:14px 0;line-height:1.7">Join us for ${ev.title}. Connect with fellow independent mortgage brokers, learn from industry leaders, and pick up tactics you can put to work immediately.</p>
        <h3 style="font-size:15px;margin:18px 0 8px">What you'll get</h3>
        <ul class="how-list"><li>Live training &amp; Q&amp;A with AIME experts</li><li>Networking with brokers in your market</li><li>On-demand replay access afterward</li></ul>
      </div>
      <div class="card card-pad summary-card">
        <h3 style="font-size:16px;margin-bottom:14px">Event details</h3>
        <div class="detail-meta-row"><span>📅</span> ${ev.date}, 2026</div>
        <div class="detail-meta-row"><span>⏰</span> ${ev.when}</div>
        <div class="detail-meta-row"><span>📍</span> ${ev.loc || (ev.type==='In person'?'In person — venue TBA':'Online — link sent after registering')}</div>
        <button class="btn btn-primary btn-block" style="margin-top:16px" data-toast="Registered for ${ev.title}!">Register now</button>
        <button class="btn btn-outline btn-block btn-sm" style="margin-top:10px" data-toast="Added to your calendar.">Add to calendar</button>
      </div>
    </div>`;
  navigate('event-detail');
}

/* ---------- Modals ---------- */
function openModal(id){ document.getElementById('modal-'+id)?.classList.add('open'); document.body.style.overflow='hidden'; }
function closeModals(){
  document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('open'));
  document.body.style.overflow = isAuthOpen() ? 'hidden' : '';
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2800);
}

/* ---------- Notifications ---------- */
function toggleNotif(){
  const p = document.getElementById('notif-panel');
  p.classList.toggle('open');
  if(p.classList.contains('open')) document.querySelector('.icon-btn .dot')?.classList.add('hidden');
}
function closeNotif(){ document.getElementById('notif-panel')?.classList.remove('open'); }

/* ---------- Settings tabs ---------- */
function setTab(tab){
  document.querySelectorAll('#settings-tabs .tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===tab));
  ['profile','security','billing'].forEach(p=>{
    document.getElementById('tab-'+p).style.display = (p===tab)?'block':'none';
  });
}

/* ---------- FUSE add-on total ---------- */
function recalcFuse(){
  let total = 0;
  document.querySelectorAll('#view-fuse .addon-row').forEach(row=>{
    const cb = row.querySelector('input[type=checkbox]');
    const price = row.querySelector('.ar-price');
    if(cb && cb.checked && price && !price.classList.contains('free')){
      total += parseFloat(price.textContent.replace(/[^0-9.]/g,'')) || 0;
    }
  });
  const t = document.getElementById('fuse-total');
  if(t) t.textContent = '$' + total.toFixed(2);
}
document.querySelectorAll('#view-fuse [data-addon]').forEach(cb=> cb.addEventListener('change', recalcFuse));

/* ---------- Auth / login screen ---------- */
function isAuthOpen(){ return document.getElementById('auth-screen')?.classList.contains('open'); }
function switchAuthPanel(name){
  document.querySelectorAll('.auth-panel').forEach(p=>p.classList.toggle('active', p.id==='auth-'+name));
  document.getElementById('auth-screen').classList.toggle('wide', name==='signup');
  document.querySelector('#auth-screen .auth-wrap')?.scrollTo?.(0,0);
}
function openAuth(panel){
  switchAuthPanel(panel || 'login');
  document.getElementById('auth-screen').classList.add('open');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0,0);
}
function closeAuth(){
  document.getElementById('auth-screen').classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------- Sign up: membership tiers, lead capture, fake Stripe ---------- */
const tiers = [
  { key:'premium', name:'Premium', monthly:19, annual:199, popular:true, blurb:'For growing brokers ready to scale.',
    features:['Direct access to 30+ wholesale lenders','Full Market vendor discounts','All resources, webinars & trainings','1 loan escalation / month','FUSE 2026 ticket included'] },
  { key:'elite', name:'Elite', monthly:69, annual:699, blurb:'For established teams that want more.',
    features:['Everything in Premium','Priority lender connections','6 loan escalations / month','Dedicated success manager','VIP FUSE seating'] },
  { key:'vip', name:'VIP', monthly:169, annual:1699, blurb:'For top-producing brokerages.',
    features:['Everything in Elite','Unlimited loan escalations','1:1 quarterly business strategy','Speaking & feature opportunities','Concierge support'] },
];
let selectedTier = 'premium';
let billingCycle = 'annual';
let leadCaptured = false;

const money = (n) => '$' + Number(n).toFixed(2);
const currentTier = () => tiers.find(t=>t.key===selectedTier);
const tierPrice = (t) => billingCycle==='annual' ? t.annual : t.monthly;

function renderPlans(){
  const grid = document.getElementById('plan-grid');
  if(!grid) return;
  grid.innerHTML = tiers.map(t=>`
    <button class="plan-card ${t.key===selectedTier?'selected':''} ${t.popular?'popular':''}" data-plan="${t.key}">
      ${t.popular?'<span class="plan-pop">Most popular</span>':''}
      <div class="plan-name">${t.name}</div>
      <div class="plan-price">${money(tierPrice(t)).replace('.00','')}<span class="plan-cycle">/${billingCycle==='annual'?'yr':'mo'}</span></div>
      <div class="plan-blurb">${t.blurb}</div>
      <ul class="plan-feats">${t.features.map(f=>`<li>${f}</li>`).join('')}</ul>
      <span class="plan-select-ind">${t.key===selectedTier?'✓ Selected':'Select '+t.name}</span>
    </button>`).join('');
  updateAmount();
}
function selectPlan(key){ selectedTier = key; renderPlans(); }
function setCycle(c){
  billingCycle = c;
  document.querySelectorAll('.bt-opt').forEach(b=>b.classList.toggle('active', b.dataset.cycle===c));
  renderPlans();
}
function updateAmount(){
  const amt = money(tierPrice(currentTier()));
  const el = document.getElementById('su-amount'); if(el) el.textContent = amt;
}

/* Lead / abandoned-cart capture — fires BEFORE payment so contact info is saved
   even if the member never completes checkout. In production this would POST
   {name, email, phone, selectedTier} to the CRM. */
function captureLead(showMsg){
  const name  = document.getElementById('su-name')?.value.trim();
  const email = document.getElementById('su-email')?.value.trim();
  if((email || name) && !leadCaptured){
    leadCaptured = true;
    const hint = document.getElementById('su-capture-hint');
    if(hint) hint.style.display = 'flex';
  }
  if(showMsg && (email||name)) showToast('Got it — we saved your details so you can finish anytime.');
}

function openStripe(){
  const t = currentTier();
  const amt = money(tierPrice(t));
  document.getElementById('stripe-amount').textContent = amt;
  document.getElementById('stripe-btn-amount').textContent = amt;
  document.getElementById('stripe-plan').textContent = `${t.name} membership · billed ${billingCycle==='annual'?'annually':'monthly'}`;
  const email = document.getElementById('su-email')?.value.trim();
  const se = document.getElementById('stripe-email'); if(se) se.value = email || '';
  openModal('stripe');
}

/* ---------- Buy escalations: quantity stepper ($199 each) ---------- */
let escQty = 1;
const ESC_PRICE = 199;
function stepEsc(delta){
  escQty = Math.max(1, Math.min(50, escQty + delta));
  document.getElementById('esc-qty-val').textContent = escQty;
  document.getElementById('esc-total').textContent = '$' + (escQty * ESC_PRICE).toFixed(2);
  document.getElementById('esc-buy-label').textContent = escQty + (escQty === 1 ? ' escalation' : ' escalations');
}

/* ---------- Action handler ---------- */
function handleAction(a){
  switch(a){
    case 'logout':      closeNotif(); closeModals(); openAuth('login'); break;
    case 'login':       closeAuth(); navigate('dashboard'); break;
    case 'reset':       switchAuthPanel('login'); showToast('Password reset link sent — check your email.'); break;
    case 'capture-lead':captureLead(true); break;
    case 'signup-pay':  captureLead(false); openStripe(); break;
    case 'stripe-pay':  closeModals(); closeAuth(); leadCaptured=false; navigate('dashboard'); showToast('Payment successful — welcome to AIME! 🎉'); break;
    case 'notifications': toggleNotif(); break;
    case 'menu':        document.getElementById('sidebar')?.classList.toggle('open'); break;
    case 'claim-ticket':navigate('fuse'); flashAddons(); showToast("🎟️ Ticket claimed! Don't forget to add your sessions & add-ons below."); break;
    case 'dismiss-banner': bannerDismissed = true; updateClaimBanner(); break;
  }
}

/* ---------- Generic chip filter (Market / Resources / Events) ---------- */
function setupChipFilter(filtersId, gridSel, noun){
  const group = document.getElementById(filtersId);
  if(!group) return;
  const cards = () => document.querySelectorAll(gridSel + ' [data-filter]');
  const total = cards().length;
  function apply(){
    const active = group.querySelector('.chip.active');
    const val = active ? active.dataset.filter : 'all';
    let shown = 0;
    cards().forEach(card=>{
      const show = val==='all' || card.dataset.filter.split('|').includes(val);
      card.style.display = show ? '' : 'none';
      if(show) shown++;
    });
    const note = group.querySelector('.count-note');
    if(note) note.textContent = (val==='all') ? `Showing all ${total} ${noun}` : `Showing ${shown} of ${total} ${noun}`;
  }
  group.addEventListener('click', e=>{
    const chip = e.target.closest('.chip'); if(!chip) return;
    group.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    apply();
  });
  apply();
}
setupChipFilter('market-filters',   '#market-grid',   'vendors');
setupChipFilter('resource-filters', '#resource-grid', 'resources');
setupChipFilter('event-filters',    '#event-grid',    'events');

/* ---------- Global click delegation (ordered by priority) ---------- */
document.addEventListener('click', e=>{
  const t = e.target;
  let m;
  if((m = t.closest('[data-action]')))        { e.preventDefault(); handleAction(m.dataset.action); return; }
  if((m = t.closest('[data-toast]')))         { e.preventDefault(); if(m.hasAttribute('data-close')) closeModals(); showToast(m.dataset.toast); return; }
  if((m = t.closest('[data-modal]')))         { e.preventDefault(); openModal(m.dataset.modal); return; }
  if((m = t.closest('[data-auth]')))          { e.preventDefault(); switchAuthPanel(m.dataset.auth); return; }
  if((m = t.closest('[data-plan]')))          { e.preventDefault(); selectPlan(m.dataset.plan); return; }
  if((m = t.closest('[data-esc-step]')))      { e.preventDefault(); stepEsc(+m.dataset.escStep); return; }
  if((m = t.closest('[data-cycle]')))         { e.preventDefault(); setCycle(m.dataset.cycle); return; }
  if((m = t.closest('[data-close]')))         { e.preventDefault(); closeModals(); return; }
  if((m = t.closest('[data-open-lender]')))   { e.preventDefault(); openLender(+m.dataset.openLender); return; }
  if((m = t.closest('[data-open-market]')))   { e.preventDefault(); openVendor(+m.dataset.openMarket); return; }
  if((m = t.closest('[data-open-resource]'))) { e.preventDefault(); openResource(+m.dataset.openResource); return; }
  if((m = t.closest('[data-open-event]')))    { e.preventDefault(); openEvent(+m.dataset.openEvent); return; }
  if((m = t.closest('[data-open-hub]')))      { e.preventDefault(); const [k,kind,idx]=m.dataset.openHub.split(':'); openHubItem(k,kind,+idx); return; }
  if((m = t.closest('[data-hubtab]')))        { e.preventDefault(); setHubTab(m.dataset.hubview, m.dataset.hubtab); return; }
  if((m = t.closest('[data-docfilter]')))     { e.preventDefault(); filterDocuments(m.dataset.docfilter); return; }
  const navBtn = t.closest('[data-nav]');
  const tabBtn = t.closest('[data-tab]');
  if(navBtn || tabBtn){ e.preventDefault(); if(navBtn) navigate(navBtn.dataset.nav); if(tabBtn) setTab(tabBtn.dataset.tab); return; }
});

// Capture lead on email blur (silent abandoned-cart capture)
document.getElementById('su-email')?.addEventListener('blur', ()=>captureLead(false));

// Close notifications when clicking outside
document.addEventListener('click', e=>{
  if(!e.target.closest('.notif-wrap')) closeNotif();
});

// Initial plan render + claim banner
renderPlans();
updateClaimBanner();

// Optional deep-linking: #lenders, #signup, #fuse, #modal=escalate, etc.
(function initFromHash(){
  const h = (location.hash || '').replace('#','');
  if(!h) return;
  if(h==='login'){ openAuth('login'); return; }
  if(h==='signup'){ openAuth('signup'); return; }
  if(h==='notif'){ toggleNotif(); return; }
  if(h.startsWith('modal=')) { openModal(h.split('=')[1]); return; }
  if(h.startsWith('open=')){
    const [type, idx] = h.slice(5).split(':');
    ({lender:openLender, market:openVendor, resource:openResource, event:openEvent}[type] || (()=>{}))(+idx || 0);
    return;
  }
  if(document.getElementById('view-'+h)) navigate(h);
})();

// Close modal on overlay click / Esc
document.querySelectorAll('.modal-overlay').forEach(o=>{
  o.addEventListener('click', e=>{ if(e.target===o) closeModals(); });
});
document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeModals(); closeNotif(); } });
