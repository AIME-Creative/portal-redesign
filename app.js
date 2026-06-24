/* ============================================================
   AMP Member Portal — Redesign Prototype
   Navigation, data rendering, modals & interactions
   ============================================================ */

/* ---------- Sample data (illustrative only) ---------- */
const lenders = [
  { name: "United Wholesale Mortgage", short: "UWM", tier: "Gold",   color: "#0b1f5b", desc: "The #1 wholesale lender in the nation, delivering state-of-the-art technology and unrivaled client service.", tags:["Conventional","FHA","VA","Jumbo","Non-QM"] },
  { name: "EPM",                       short: "EPM", tier: "Gold",   color: "#1b7a4a", desc: "Equity Prime Mortgage — fast, broker-first wholesale lending with a full product menu.", tags:["Conventional","FHA","VA","USDA"] },
  { name: "Windsor Mortgage",          short: "WM",  tier: "Gold",   color: "#3a3a3a", desc: "Boutique wholesale lender specializing in non-QM and jumbo products for independent brokers.", tags:["Non-QM","Jumbo","DSCR"] },
  { name: "Newrez Wholesale",          short: "NRZ", tier: "Gold",   color: "#e0463c", desc: "A leading national lender offering a broad product suite and dedicated broker support.", tags:["Conventional","FHA","VA","Renovation"] },
  { name: "Newfi Wholesale",           short: "NF",  tier: "Silver", color: "#163a85", desc: "Tech-forward lender focused on non-QM, bank-statement, and investor loans.", tags:["Non-QM","Bank Stmt","DSCR"] },
  { name: "Cake Mortgage",             short: "CK",  tier: "Silver", color: "#2bb673", desc: "Modern wholesale platform with a slice of every product and a fast, digital process.", tags:["Conventional","Non-QM","Jumbo"] },
  { name: "eLEND",                      short: "eL",  tier: "Silver", color: "#1893b1", desc: "Diverse loan options with a focus on first-time and government-backed buyers.", tags:["FHA","VA","USDA","Conventional"] },
  { name: "RCN Capital",               short: "RCN", tier: "Bronze", color: "#0b2a5b", desc: "Nationwide private lender for real estate investors — fix & flip, bridge, and rental loans.", tags:["Fix & Flip","Bridge","DSCR"] },
];
const tierBadge = { Gold:"badge-gold", Silver:"badge-silver", Bronze:"badge-bronze" };

const vendors = [
  { name:"Advantage Partners Solutions", short:"APS", cat:"Core Partner", color:"#1b7a4a", desc:"National mortgage Consumer Reporting Agency built to support lenders at every stage of the loan process.", tags:["Credit","Verifications"] },
  { name:"Ask Mindy",                    short:"AM",  cat:"Origination", color:"#dd1969", desc:"On-demand scenario desk and guideline help for tough loan files.", tags:["Scenarios","Guidelines"] },
  { name:"Waive Inspection Fee",         short:"WIF", cat:"Origination", color:"#20adce", desc:"Member benefit that waives appraisal inspection fees on qualifying loans.", tags:["Appraisal","Savings"] },
  { name:"Arive",                        short:"AR",  cat:"Origination", color:"#163a85", desc:"All-in-one mortgage POS and LOS platform with member pricing.", tags:["POS","LOS"] },
  { name:"BrokerVA",                     short:"BVA", cat:"Coaching",    color:"#7a3fb0", desc:"Trained virtual assistants who specialize in mortgage operations.", tags:["Staffing","Ops"] },
  { name:"Cotality",                     short:"CO",  cat:"Origination", color:"#0b2a5b", desc:"Property data, analytics, and verification tools for brokers.", tags:["Data","Analytics"] },
  { name:"Direct Authority AI",          short:"DAi", cat:"Marketing",   color:"#e0463c", desc:"AI-powered lead generation and nurture built for loan officers.", tags:["AI","Leads"] },
  { name:"Lead Hackers",                 short:"LH",  cat:"Marketing",   color:"#1b9d6b", desc:"Done-for-you paid media and funnels for mortgage pros.", tags:["Ads","Funnels"] },
];

const resources = [
  { title:"The 'Daily Six' Challenge (Part 3)", type:"Podcast",  cta:"Listen now", g:["#5b2a86","#dd1969"] },
  { title:"Broker to Broker — Episode 251",     type:"Podcast",  cta:"Listen now", g:["#0b1f5b","#20adce"] },
  { title:"Broker Power-Up: Episode 65",        type:"Webinar",  cta:"Watch now",  g:["#1b1b3a","#7a3fb0"] },
  { title:"Mortgage Mornings — June 17, 2026",  type:"Webinar",  cta:"Watch now",  g:["#0b2a5b","#e0463c"] },
  { title:"Women's Mortgage Network Podcast",   type:"Podcast",  cta:"Listen now", g:["#86145a","#dd1969"] },
  { title:"Broker to Broker — Episode 250",     type:"Podcast",  cta:"Listen now", g:["#0b1f5b","#163a85"] },
  { title:"AIME Accelerate — Identity Reset",   type:"Training", cta:"Watch now",  g:["#1b1b3a","#20adce"] },
  { title:"Scaling Past $1M in Volume",         type:"Training", cta:"Watch now",  g:["#021649","#1893b1"] },
];

const events = [
  { title:"AIME Accelerate — Identity Reset", date:"JUN 6",  when:"Mon · 1:00 PM ET", type:"Virtual",   g:["#1b1b3a","#dd1969"] },
  { title:"AIME Accelerate — Win the Day",    date:"JUN 15", when:"Mon · 1:00 PM ET", type:"Virtual",   g:["#0b1f5b","#20adce"] },
  { title:"AIME Accelerate — Run Toward It",  date:"JUN 22", when:"Mon · 1:00 PM ET", type:"Virtual",   g:["#5b2a86","#dd1969"] },
  { title:"Mortgage Mornings — Live",         date:"JUL 1",  when:"Wed · 10:00 AM ET",type:"Virtual",   g:["#0b2a5b","#e0463c"] },
  { title:"AIME Accelerate — Compound",       date:"JUN 29", when:"Mon · 1:00 PM ET", type:"Training",  g:["#1b1b3a","#1893b1"] },
  { title:"FUSE 2026 — National Conference",  date:"SEP 14", when:"Las Vegas, NV",    type:"In person", g:["#021649","#dd1969"] },
];

/* ---------- Render helpers ---------- */
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };

function lenderCard(l){
  return `<div class="partner-card" data-lender="${l.short}">
    <div class="partner-top">
      <div class="partner-logo" style="color:${l.color}">${l.short}</div>
      <span class="badge ${tierBadge[l.tier]}">${l.tier}</span>
    </div>
    <div class="partner-body">
      <h3>${l.name}</h3>
      <p class="pdesc">${l.desc}</p>
      <div class="tag-row">${l.tags.slice(0,3).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    </div>
    <div class="partner-foot">
      <button class="btn btn-primary btn-sm" data-modal="escalate">Escalate</button>
      <button class="btn btn-outline btn-sm" data-lender-open="${l.short}">View</button>
    </div>
  </div>`;
}

function vendorCard(v){
  return `<div class="partner-card">
    <div class="partner-top">
      <div class="partner-logo" style="color:${v.color}">${v.short}</div>
      <span class="badge badge-navy">${v.cat}</span>
    </div>
    <div class="partner-body">
      <h3>${v.name}</h3>
      <p class="pdesc">${v.desc}</p>
      <div class="tag-row">${v.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    </div>
    <div class="partner-foot">
      <button class="btn btn-cyan btn-sm btn-block" data-toast="Connection request sent to ${v.name}.">Connect</button>
    </div>
  </div>`;
}

function resCard(r){
  const playIcon = r.type==="Podcast"
    ? `<path d="M5 3l14 9-14 9V3z"/>`
    : `<path d="M5 3l14 9-14 9V3z"/>`;
  return `<div class="res-card">
    <div class="res-thumb" style="background:linear-gradient(135deg,${r.g[0]},${r.g[1]})">
      <span class="res-type"><span class="badge" style="background:rgba(255,255,255,.9);color:#0b1f5b">${r.type}</span></span>
      ${r.title.split('—')[0].trim().split(' ')[0].toUpperCase()}
      <span class="play"><svg viewBox="0 0 24 24" fill="currentColor">${playIcon}</svg></span>
    </div>
    <div class="res-body">
      <h3>${r.title}</h3>
      <div class="res-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> 32 min</div>
      <button class="btn btn-outline btn-sm btn-block" style="margin-top:12px" data-toast="Opening: ${r.title}">${r.cta}</button>
    </div>
  </div>`;
}

function eventCard(e){
  return `<div class="event-card">
    <div class="event-banner" style="background:linear-gradient(135deg,${e.g[0]},${e.g[1]})">
      <span style="position:absolute;left:12px;top:12px"><span class="badge" style="background:rgba(255,255,255,.9);color:#0b1f5b">${e.type}</span></span>
      ${e.title.split('—')[0].trim().split(' ')[0].toUpperCase()}
    </div>
    <div class="event-body">
      <h3>${e.title}</h3>
      <div class="when"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg> ${e.when}</div>
      <div class="event-foot">
        <button class="btn btn-navy btn-sm" data-toast="Registered for ${e.title}.">Register</button>
        <button class="btn btn-outline btn-sm" data-toast="Added to calendar.">Add to calendar</button>
      </div>
    </div>
  </div>`;
}

/* ---------- Populate grids ---------- */
document.getElementById('lender-grid').innerHTML  = lenders.map(lenderCard).join('');
document.getElementById('market-grid').innerHTML  = vendors.map(vendorCard).join('');
document.getElementById('resource-grid').innerHTML= resources.map(resCard).join('');
document.getElementById('event-grid').innerHTML   = events.map(eventCard).join('');

// Featured on dashboard — can highlight anything new/notable (lenders, resources, market, events)
const featured = [
  { kind:"Lender",   title:"Newrez Wholesale",                sub:"Just joined as a Gold partner", cta:"View lender", g:["#0b1f5b","#e0463c"], nav:"lenders" },
  { kind:"Resource", title:"AIME Accelerate — Identity Reset", sub:"New training added",            cta:"Watch now",   g:["#1b1b3a","#20adce"], nav:"resources" },
  { kind:"Market",   title:"Waive Inspection Fee",            sub:"New member deal",               cta:"View deal",   g:["#1b7a4a","#20adce"], nav:"market" },
  { kind:"Event",    title:"FUSE 2026",                       sub:"Tickets on sale now",           cta:"Get tickets", g:["#021649","#dd1969"], nav:"events" },
];
const kindBadge = { Lender:"badge-navy", Resource:"badge-pink", Market:"badge-cyan", Event:"badge-amber" };
document.getElementById('featured-grid').innerHTML = featured.map(f=>`
  <div class="res-card">
    <div class="res-thumb" style="background:linear-gradient(135deg,${f.g[0]},${f.g[1]});height:120px;font-size:17px">
      <span class="res-type"><span class="badge ${kindBadge[f.kind]}" style="background:rgba(255,255,255,.92)">${f.kind}</span></span>
      ${f.title.split('—')[0].trim().split(' ')[0].toUpperCase()}
    </div>
    <div class="res-body">
      <h3 style="min-height:0">${f.title}</h3>
      <div class="res-meta" style="margin-top:5px">${f.sub}</div>
      <button class="btn btn-outline btn-sm btn-block" style="margin-top:12px" data-nav="${f.nav}">${f.cta}</button>
    </div>
  </div>`).join('');

// This-week events on dashboard
document.getElementById('dash-events').innerHTML = events.slice(0,3).map(e=>{
  const [m,d] = e.date.split(' ');
  return `<div class="ev-mini">
    <div class="ev-date"><span class="d">${d}</span><span class="m">${m}</span></div>
    <div style="flex:1;align-self:center"><div class="em-t">${e.title}</div><div class="em-s">${e.when}</div></div>
  </div>`;
}).join('');

/* ---------- Navigation ---------- */
function navigate(view){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  const target = document.getElementById('view-'+view);
  if(target) target.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.nav===view));
  document.getElementById('content').scrollTo?.(0,0);
  window.scrollTo(0,0);
}

/* ---------- Lender detail ---------- */
function openLender(short){
  const l = lenders.find(x=>x.short===short);
  if(!l) return;
  document.getElementById('ld-logo').textContent = l.short;
  document.getElementById('ld-logo').style.color = l.color;
  document.getElementById('ld-name').textContent = l.name;
  const tier = document.getElementById('ld-tier');
  tier.textContent = l.tier + " partner";
  tier.className = "badge " + tierBadge[l.tier];
  document.getElementById('ld-desc').textContent = l.desc;
  document.getElementById('ld-tags').innerHTML = l.tags.map(t=>`<span class="tag">${t}</span>`).join('');
  navigate('lender-detail');
}

/* ---------- Modals ---------- */
function openModal(id){ document.getElementById('modal-'+id)?.classList.add('open'); document.body.style.overflow='hidden'; }
function closeModals(){ document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('open')); document.body.style.overflow=''; }

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2800);
}

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
function switchAuthPanel(name){
  document.querySelectorAll('.auth-panel').forEach(p=>p.classList.toggle('active', p.id==='auth-'+name));
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

/* ---------- Filter chips (cosmetic) ---------- */
document.querySelectorAll('.filters').forEach(group=>{
  group.addEventListener('click', e=>{
    const chip = e.target.closest('.chip');
    if(!chip) return;
    group.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
  });
});

/* ---------- Global click delegation ---------- */
document.addEventListener('click', e=>{
  const nav   = e.target.closest('[data-nav]');
  const modal = e.target.closest('[data-modal]');
  const open  = e.target.closest('[data-lender-open]');
  const close = e.target.closest('[data-close]');
  const toast = e.target.closest('[data-toast]');
  const tab   = e.target.closest('[data-tab]');
  const auth  = e.target.closest('[data-auth]');
  const action= e.target.closest('[data-action]');

  if(nav){ e.preventDefault(); navigate(nav.dataset.nav); }
  if(open){ e.preventDefault(); openLender(open.dataset.lenderOpen); }
  if(modal){ e.preventDefault(); openModal(modal.dataset.modal); }
  if(close){ e.preventDefault(); closeModals(); }
  if(tab){ e.preventDefault(); setTab(tab.dataset.tab); }
  if(auth){ e.preventDefault(); switchAuthPanel(auth.dataset.auth); }
  if(action){
    e.preventDefault();
    const a = action.dataset.action;
    if(a==='logout'){ closeModals(); openAuth('login'); }
    if(a==='login'){ closeAuth(); navigate('dashboard'); }
    if(a==='signup'){ closeAuth(); navigate('dashboard'); showToast('Welcome to AIME — your account is ready.'); }
    if(a==='reset'){ switchAuthPanel('login'); showToast('Password reset link sent — check your email.'); }
  }
  if(toast){
    // if a toast button also closes a modal, let close handler run; then toast
    if(toast.hasAttribute('data-close')) closeModals();
    showToast(toast.dataset.toast);
  }
});

// Optional deep-linking: #lenders, #market, #modal=escalate, etc.
(function initFromHash(){
  const h = (location.hash || '').replace('#','');
  if(!h) return;
  if(h==='login'){ openAuth('login'); return; }
  if(h.startsWith('modal=')) { openModal(h.split('=')[1]); return; }
  if(document.getElementById('view-'+h)) navigate(h);
})();

// Close modal on overlay click / Esc
document.querySelectorAll('.modal-overlay').forEach(o=>{
  o.addEventListener('click', e=>{ if(e.target===o) closeModals(); });
});
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModals(); });
