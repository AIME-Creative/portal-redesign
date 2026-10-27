/* ============================================================
   AMP Help Center — knowledge base content (shared)
   ------------------------------------------------------------
   Read by the member Help Center (help-center.js) and the admin
   Help Center manager (admin-help.js). In production this is a
   Supabase table edited from admin; here it's static sample data.

   Article fields
     slug, title, category (key of HELP_CATEGORIES), summary,
     tags[], minutes (read time), updated, popular, status,
     views / helpful [yes, no]  (admin stats, sample numbers),
     actions[] — "Try it now" buttons: { label, attr } where attr
                 is a data-* attribute the member app already
                 understands (data-nav / data-modal),
     body — HTML. Use <ol class="kb-steps">, <div class="kb-tip">.
   ============================================================ */
window.HELP_CATEGORIES = {
  start:       { name: 'Getting started',          ico: '<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>', desc: 'Find your way around the portal.' },
  escalations: { name: 'Loan escalations',          ico: '<path d="M12 9v4M10.3 3.9l-8 14A2 2 0 004 21h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0z"/><circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none"/>', desc: 'Escalate a loan, track it, follow up.' },
  lenders:     { name: 'Lenders & connections',     ico: '<path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"/>', desc: 'Connect with lenders, change your AE.' },
  market:      { name: 'Market & vendors',          ico: '<path d="M3 9l1-5h16l1 5M4 9v11h16V9M4 9h16M9 13h6"/>', desc: 'Member discounts and vendor intros.' },
  learning:    { name: 'Resources & hubs',          ico: '<path d="M4 19V5a2 2 0 012-2h12v18H6a2 2 0 01-2-2zM4 19a2 2 0 012-2h12"/>', desc: 'Trainings, hubs, and documents.' },
  events:      { name: 'Events & FUSE',             ico: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>', desc: 'Events, the calendar, and FUSE 2026.' },
  billing:     { name: 'Membership & billing',      ico: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>', desc: 'Plans, payments, and escalation allowance.' },
  partners:    { name: 'For lender & vendor partners', ico: '<path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"/>', desc: 'Your dashboard, requests, and what partner accounts can do.' },
  account:     { name: 'Account & support',         ico: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0116 0v1"/>', desc: 'Profile, password, tickets, and requests.' },
};

window.HELP_ARTICLES = [
  /* ---------------- Lender & vendor partners (audience: partner) ---------------- */
  { slug: 'partner-dashboard', audience: 'partner', title: 'Your partner dashboard', category: 'partners', popular: true,
    summary: 'Page views by member tier and the latest requests sent to your company.',
    tags: ['dashboard', 'page views', 'analytics', 'tier', 'partner', 'lender', 'vendor', 'stats'], minutes: 2, updated: 'Oct 26, 2026', status: 'Published',
    views: 0, helpful: [0, 0], actions: [{ label: 'Open my dashboard', attr: 'data-nav="partner"' }],
    body: `
      <p>Your <strong>Dashboard</strong> is your home page in AMP. Everyone at your company sees the same numbers.</p>
      <ul>
        <li><strong>Lenders</strong> — views of your lender page, broken out by the viewing member's tier (Premium, Elite, VIP) plus the total and unique members, and counts of escalations, connections, and Change AE requests.</li>
        <li><strong>Vendors</strong> — views of your Market listing by member tier, plus your connection requests. If your company has more than one product, each product gets its own row with a total across all of them.</li>
      </ul>
      <p>Use the date range at the top right to change the period. The <strong>Recent requests</strong> list links to the full details.</p>` },
  { slug: 'partner-requests', audience: 'partner', title: 'Requests sent to your company', category: 'partners', popular: true,
    summary: 'See full member details, reply to escalations, and email members who asked to connect.',
    tags: ['requests', 'escalation', 'reply', 'connection', 'change ae', 'email', 'sent to', 'partner', 'product'], minutes: 2, updated: 'Oct 26, 2026', status: 'Published',
    views: 0, helpful: [0, 0], actions: [{ label: 'Open requests', attr: 'data-nav="partner-requests"' }],
    body: `
      <p><strong>Requests</strong> lists every request AIME members send to your company, with the member's name, email, phone, NMLS #, company, and licensed states — the same details as the email — and <strong>Sent to</strong>, the person at your company it was emailed to.</p>
      <ol class="kb-steps">
        <li><strong>Escalations (lenders):</strong> open one and use <strong>Reply</strong> to update the member, or <strong>Reply &amp; mark resolved</strong> when it's fixed. You can also simply reply to the escalation email — no login needed — and it lands here.</li>
        <li><strong>Connections and Change AE:</strong> use <strong>Email &lt;member&gt;</strong> to start an email to them directly. Each vendor connection shows the <strong>Product</strong> the member asked about.</li>
        <li><strong>More than one product (vendors):</strong> Requests adds a <strong>Product</strong> column and a product filter so you can see which product each connection is for.</li>
        <li>A <strong>Member requested follow-up</strong> flag means the member asked AIME to check in — the AIME team may contact you too.</li>
      </ol>
      <div class="kb-tip">Who requests are sent to is set on your company listing. To change it, email AIME (lenders@aimegroup.com or vendors@aimegroup.com).</div>` },
  { slug: 'partner-access', audience: 'partner', title: 'What partner accounts can and can’t do', category: 'partners',
    summary: 'View-only Lenders and Market, full resources and events, support, and listing changes.',
    tags: ['access', 'view only', 'partner account', 'listing', 'change listing', 'market', 'lenders', 'resources', 'team', 'teammate', 'add user', 'permissions'], minutes: 1, updated: 'Oct 26, 2026', status: 'Published',
    views: 0, helpful: [0, 0], actions: [{ label: 'Get support', attr: 'data-nav="support"' }],
    body: `
      <ul>
        <li><strong>Resources and Events</strong> — the same as members (event registration is for members).</li>
        <li><strong>Lenders and Market</strong> — view only: partner accounts can't submit escalations, connections, or Change AE requests, or use member discounts.</li>
        <li><strong>Support</strong> — open tickets and reply to our team, just like members. Your tickets are under <strong>Requests → My support tickets</strong>.</li>
        <li><strong>AIME Exchange</strong> — available from the sidebar.</li>
        <li><strong>Your team</strong> — each person at your company has their own login, and everyone has the same access: the same dashboard, every request, and the ability to reply.</li>
      </ul>
      <p><strong>Need to change your company listing?</strong> Email AIME at lenders@aimegroup.com (lenders) or vendors@aimegroup.com (vendors). Accounts are free and created by AIME — ask us to add a teammate.</p>` },

  /* ---------------- Getting started ---------------- */
  { slug: 'portal-tour', title: 'A quick tour of the member portal', category: 'start', popular: true,
    summary: 'What lives where — the sidebar, search, your escalation count, and quick actions.',
    tags: ['tour', 'walkthrough', 'navigation', 'new member', 'dashboard'], minutes: 2, updated: 'Oct 20, 2026', status: 'Published',
    views: 1840, helpful: [212, 9],
    actions: [{ label: 'Take the walkthrough', attr: 'data-tour-start' }],
    body: `
      <p>The portal is built around a few places you'll use every week:</p>
      <ul>
        <li><strong>Home</strong> — what's new this week across lenders, Market deals, resources, and events, plus quick actions.</li>
        <li><strong>The sidebar</strong> — Lenders, Market, Resources, Events, Documents, your learning hubs, and Support.</li>
        <li><strong>Search</strong> (top of every page) — find any lender, vendor, resource, or event by name.</li>
        <li><strong>Escalations left</strong> (top bar) — how many loan escalations remain this cycle. Tap <strong>+</strong> to buy more (VIP is unlimited, so there's nothing to buy).</li>
        <li><strong>My Requests</strong> — every escalation, connection, AE change, and support ticket you've submitted, with its status.</li>
      </ul>
      <p>The guided walkthrough also shows you, step by step, how to fill in an escalation and where replies to your requests appear.</p>
      <div class="kb-tip"><strong>Tip:</strong> You can replay the guided walkthrough any time from the <strong>?</strong> menu in the top bar or from this Help Center.</div>` },

  { slug: 'mobile', audience: 'all', title: 'Using the portal on your phone', category: 'start',
    summary: 'Where the menu and main sections are on mobile.',
    tags: ['mobile', 'phone', 'app', 'menu'], minutes: 1, updated: 'Oct 26, 2026', status: 'Published',
    views: 402, helpful: [51, 4], actions: [],
    body: `
      <p>The portal works in any mobile browser, and you can also install it as an app.</p>
      <ol class="kb-steps">
        <li>The <strong>bottom bar</strong> takes you to the main sections (Home or your Dashboard, Lenders, Market, Resources, and Events).</li>
        <li>Tap the <strong>☰ menu</strong> (top left) for everything else, including My Requests, Help Center, and Settings.</li>
        <li>Your notifications stay in the top bar.</li>
      </ol>
      <div class="kb-tip"><strong>Tip:</strong> Install AMP as an app for one-tap access and push notifications — see <em>Install the AMP app and turn on notifications</em>.</div>` },

  { slug: 'install-app', audience: 'all', title: 'Install the AMP app and turn on notifications', category: 'start', popular: true,
    summary: 'Add AMP to your phone or computer, and get notified when something needs you.',
    tags: ['app', 'install', 'home screen', 'download', 'push', 'notifications', 'iphone', 'android', 'alerts'], minutes: 2, updated: 'Oct 26, 2026', status: 'Published',
    views: 0, helpful: [0, 0], actions: [{ label: 'Open notification settings', attr: 'data-nav="settings" data-tab="notifications"' }],
    body: `
      <p>AMP can live on your home screen like any other app — no app store needed — and send you push notifications, even when it's closed.</p>
      <h3>Install it</h3>
      <ol class="kb-steps">
        <li><strong>iPhone or iPad:</strong> open AMP in Safari, tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</li>
        <li><strong>Android:</strong> in Chrome, tap the menu <strong>⋮</strong>, then <strong>Install app</strong>.</li>
        <li><strong>Computer:</strong> in Chrome or Edge, click the install icon in the address bar. In Safari on a Mac, choose <strong>File → Add to Dock</strong>.</li>
      </ol>
      <p>On your phone or tablet, you may see a <strong>Get the AMP app</strong> card the first time you visit. Tap <strong>Not now</strong> or ✕ and it won't come back — you can always install from <strong>Settings → Notifications &amp; app</strong>.</p>
      <h3>Turn on notifications</h3>
      <ol class="kb-steps">
        <li>Go to <strong>Settings → Notifications &amp; app</strong> and tap <strong>Turn on notifications</strong>, then <strong>Allow</strong>.</li>
        <li>Choose what you want to hear about — for example, replies to your requests, lender replies, event reminders, or announcements.</li>
        <li>Use <strong>Send a test notification</strong> to check it works.</li>
      </ol>
      <div class="kb-tip"><strong>iPhone:</strong> Apple only allows notifications for apps on your Home Screen, so install AMP first. Notifications are set per device — turn them on on each phone or computer you use. The bell in the top bar always shows everything either way.</div>` },

  /* ---------------- Escalations ---------------- */
  { slug: 'escalate-a-loan', title: 'How to escalate a loan', category: 'escalations', popular: true,
    summary: 'Send a structured report straight to a lender’s escalation team.',
    tags: ['escalate', 'escalation', 'loan', 'lender', 'pipeline', 'stuck'], minutes: 2, updated: 'Oct 21, 2026', status: 'Published',
    views: 3120, helpful: [388, 14],
    actions: [{ label: 'Escalate a loan', attr: 'data-modal="escalate"' }],
    body: `
      <p>Escalate when a loan is stuck and you've already tried your account executive.</p>
      <ol class="kb-steps">
        <li>Click <strong>Escalate a Loan</strong> on Home, or <strong>Escalate a loan</strong> on any lender's page.</li>
        <li>Choose the lender and enter the loan number, loan type, amount, and closing date.</li>
        <li>Describe the issue — what's stuck, since when, and what you need.</li>
        <li>Click <strong>Continue &amp; submit</strong>. The report goes straight to the lender's escalation team by email.</li>
      </ol>
      <p>Each escalation uses one from your plan's allowance (see <a href="#" data-help-article="escalation-allowance">escalation allowance</a>).</p>
      <div class="kb-tip"><strong>Tip:</strong> The more specific the issue description, the faster lenders can act — include dates and conditions.</div>` },

  { slug: 'track-escalation', title: 'Tracking an escalation: what each status means', category: 'escalations', popular: true,
    summary: 'Received, Responded, and Resolved — and where to see lender replies.',
    tags: ['status', 'track', 'received', 'responded', 'resolved', 'my requests'], minutes: 2, updated: 'Oct 23, 2026', status: 'Published',
    views: 1215, helpful: [140, 6],
    actions: [{ label: 'Open My Requests', attr: 'data-nav="requests"' }],
    body: `
      <p>Every escalation appears in <strong>My Requests</strong> with a status tracker and an activity log.</p>
      <ul>
        <li><strong>Received</strong> — delivered to the lender's escalation team.</li>
        <li><strong>Responded</strong> — the lender has replied. Their response shows in the activity log.</li>
        <li><strong>Resolved</strong> — the issue is closed, by the lender, the AIME team, or you.</li>
      </ul>
      <p>Lenders reply by email or with a one-click update, so you'll see responses here even though they never log in to the portal. If a lender's answer fixes things, click <strong>Mark as resolved</strong>.</p>` },

  { slug: 'escalation-follow-up', title: 'The lender hasn’t responded — requesting a follow-up', category: 'escalations',
    summary: 'Have the AIME membership team chase the lender for you.',
    tags: ['follow up', 'no response', 'lender not responding', 'reminder', 'stuck'], minutes: 1, updated: 'Oct 23, 2026', status: 'Published',
    views: 688, helpful: [92, 3],
    actions: [{ label: 'Open My Requests', attr: 'data-nav="requests"' }],
    body: `
      <p>Lenders get an automatic reminder after two business days without a response. If you still haven't heard back:</p>
      <ol class="kb-steps">
        <li>Open the escalation in <strong>My Requests</strong>.</li>
        <li>Click <strong>Request a follow-up</strong> and add any context (e.g. "rate lock expires Thursday").</li>
        <li>We re-send it to the lender right away, and the AIME membership team contacts their escalation desk directly.</li>
        <li>What we hear back is posted on your escalation's activity log.</li>
      </ol>
      <div class="kb-tip">You can have one open follow-up per escalation at a time. It closes automatically when the lender responds.</div>` },

  { slug: 'escalation-allowance', title: 'Your escalation allowance and buying more', category: 'escalations',
    summary: 'How many escalations each plan includes, and add-ons at $199 each.',
    tags: ['allowance', 'how many', 'buy', 'purchase', 'escalations left', 'premium', 'elite', 'vip', 'unlimited'], minutes: 1, updated: 'Oct 26, 2026', status: 'Published',
    views: 954, helpful: [101, 7],
    actions: [{ label: 'Buy escalations', attr: 'data-modal="escalations"' }],
    body: `
      <ul>
        <li><strong>Premium</strong> — 1 escalation per month</li>
        <li><strong>Elite</strong> — 6 escalations per month</li>
        <li><strong>VIP</strong> — unlimited</li>
      </ul>
      <p>Your remaining count is always in the top bar. Need more this cycle? Tap the <strong>+</strong> next to it (or <strong>Buy more</strong> in the escalation form) and choose a quantity — additional escalations are <strong>$199 each</strong>.</p>
      <p>VIP escalations are unlimited, so VIP members don't see the option to buy more.</p>` },

  /* ---------------- Lenders & connections ---------------- */
  { slug: 'connect-lender', title: 'Connecting with a lender partner', category: 'lenders', popular: true,
    summary: 'Request an intro to an approved AIME lender.',
    tags: ['connect', 'connection', 'intro', 'lender', 'partner', 'approved'], minutes: 1, updated: 'Oct 10, 2026', status: 'Published',
    views: 1402, helpful: [160, 8],
    actions: [{ label: 'Connect a lender', attr: 'data-modal="connect"' }],
    body: `
      <ol class="kb-steps">
        <li>Click <strong>Connect a Lender</strong> on Home, or <strong>Connect</strong> on a lender's page.</li>
        <li>Pick the lender. Your name, email, phone, NMLS #, and licensed states are filled in from your profile.</li>
        <li>Click <strong>Submit request</strong>. It's delivered to the lender's partner team, and they reach out to you directly.</li>
      </ol>
      <p>Your request shows in <strong>My Requests</strong> as <strong>Delivered</strong>. Haven't heard back in a week? Open a support ticket and we'll nudge them.</p>` },

  { slug: 'change-ae', title: 'Requesting a new account executive', category: 'lenders',
    summary: 'Having trouble with your AE? Ask for a change.',
    tags: ['ae', 'account executive', 'change ae', 'unresponsive', 'switch'], minutes: 1, updated: 'Sep 18, 2026', status: 'Published',
    views: 611, helpful: [70, 5],
    actions: [{ label: 'Change AE', attr: 'data-modal="changeae"' }],
    body: `
      <ol class="kb-steps">
        <li>Click <strong>Change AE</strong> on Home or on the lender's page.</li>
        <li>Choose the lender, enter your current AE's name, and pick a reason.</li>
        <li>Add details and confirm you've tried to resolve it with your AE first.</li>
        <li>Submit. The lender and the AIME membership team both receive it and will contact you about your new AE.</li>
      </ol>` },

  { slug: 'find-lender', title: 'Finding the right lender for a scenario', category: 'lenders',
    summary: 'Filter lenders by tier and product type (Non-QM, DSCR, Jumbo…).',
    tags: ['find lender', 'non-qm', 'dscr', 'jumbo', 'bank statement', 'filter', 'products'], minutes: 1, updated: 'Aug 28, 2026', status: 'Published',
    views: 870, helpful: [88, 6],
    actions: [{ label: 'Browse lenders', attr: 'data-nav="lenders"' }],
    body: `
      <ol class="kb-steps">
        <li>Open <strong>Lenders</strong> from the sidebar.</li>
        <li>Use the <strong>tier</strong> chips (Gold, Silver, Bronze) and the <strong>product type</strong> menu to narrow the list.</li>
        <li>Open a lender to see their full product list, then connect or escalate from there.</li>
      </ol>
      <div class="kb-tip">Still not sure? Open a support ticket with your scenario — our team can point you to the best fit.</div>` },

  /* ---------------- Market ---------------- */
  { slug: 'market-deals', title: 'Using Market vendor discounts', category: 'market',
    summary: 'How to claim member pricing from Market vendors.',
    tags: ['market', 'vendor', 'discount', 'deal', 'coupon', 'pricing'], minutes: 1, updated: 'Sep 9, 2026', status: 'Published',
    views: 745, helpful: [79, 6],
    actions: [{ label: 'Open the Market', attr: 'data-nav="market"' }],
    body: `
      <ol class="kb-steps">
        <li>Open <strong>Market</strong> and filter by category.</li>
        <li>Click <strong>More info</strong> on a vendor to see the member offer.</li>
        <li>Click <strong>Connect with …</strong> — the vendor reaches out within one business day.</li>
        <li>Mention AIME to claim your member pricing.</li>
      </ol>
      <p>Vendor connections also appear in <strong>My Requests</strong> as Delivered.</p>` },

  /* ---------------- Resources & hubs ---------------- */
  { slug: 'hubs', title: 'What are hubs (Brokers Edge, WMN, Ascent, VIP…)?', category: 'learning',
    summary: 'Collections of trainings, events, and documents for a program or audience.',
    tags: ['hub', 'brokers edge', 'mortgage mornings', 'accelerate', 'wmn', 'ascent', 'vip', 'upgrade'], minutes: 2, updated: 'Oct 26, 2026', status: 'Published',
    views: 520, helpful: [58, 4],
    actions: [{ label: 'Open Brokers Edge', attr: 'data-nav="brokersedge"' }],
    body: `
      <p>Hubs gather everything for one program in one place:</p>
      <ul>
        <li><strong>Learning &amp; Training</strong> — Brokers Edge (certifications), Mortgage Mornings (recordings), Accelerate Live (replays).</li>
        <li><strong>My Hubs</strong> — WMN (Women's Mortgage Network) and, for VIP members, Ascent and VIP.</li>
      </ul>
      <p>Each hub has its own content and a <strong>Documents</strong> tab. Ascent and VIP are for VIP members only — they don't appear in your sidebar on other plans. To get them, upgrade to VIP in <strong>Settings → Membership &amp; Billing</strong>.</p>` },

  { slug: 'documents', title: 'Finding and downloading documents', category: 'learning',
    summary: 'Templates, checklists, and guides from every hub in one list.',
    tags: ['documents', 'download', 'pdf', 'template', 'checklist'], minutes: 1, updated: 'Sep 22, 2026', status: 'Published',
    views: 498, helpful: [55, 2],
    actions: [{ label: 'Open Documents', attr: 'data-nav="documents"' }],
    body: `
      <p><strong>Documents</strong> in the sidebar lists every document you have access to. Use the source chips to filter by hub, then click <strong>Download</strong>. Hub pages also show their own documents under the <strong>Documents</strong> tab.</p>` },

  /* ---------------- Events & FUSE ---------------- */
  { slug: 'fuse-ticket', title: 'Claiming your FUSE 2026 ticket, add-ons, and guests', category: 'events', popular: true,
    summary: 'One click claims your included ticket — then add sessions, the Hall of AIME, and guests.',
    tags: ['fuse', 'ticket', 'claim', 'conference', 'add-ons', 'guest', 'free guest', 'vip guest', 'hall of aime', 'vip', 'austin'], minutes: 2, updated: 'Oct 26, 2026', status: 'Published',
    views: 2210, helpful: [251, 11],
    actions: [{ label: 'Browse events', attr: 'data-nav="events"' }],
    body: `
      <p>FUSE 2026 is at the JW Marriott Downtown Austin, TX, September 24–26. Your ticket is included with your membership:</p>
      <ul>
        <li><strong>Premium and Elite</strong> — General Admission.</li>
        <li><strong>VIP</strong> — a VIP ticket <strong>plus 1 free guest</strong>. The Hall of AIME is also free for you and your included guest.</li>
      </ul>
      <ol class="kb-steps">
        <li>Click the <strong>"Claim your ticket"</strong> banner, or open FUSE 2026 on the Events page. The card shows which ticket you're getting.</li>
        <li>Click <strong>Claim my … ticket</strong>. That's it — you're registered.</li>
        <li>A window opens where you can pick sessions (WMN at FUSE, Vetted VA, the Hall of AIME) and add guests, with an order summary. Choose what you want and click <strong>Update registration</strong> — or just close it if you don't need anything else.</li>
      </ol>
      <div class="kb-tip"><strong>Free doesn't mean automatic.</strong> Free extras — like the Hall of AIME for VIP members and their guest — are marked <strong>"Free — select to claim"</strong>. Your seat is only reserved once you select it and click <strong>Update registration</strong>. Anything you haven't claimed yet is listed at the top of the window.</div>
      <p><strong>VIP free guest ticket:</strong> check <strong>Claim your free VIP guest ticket</strong> and enter your guest's name, email, phone, and gender. The guest ticket is only issued once all four are filled in — the guest card shows "Details needed" until then.</p>
      <p><strong>Other guests:</strong> each guest needs their own name, email, phone, and gender — email and phone can't match yours. Additional guests are $299 early-bird ($349 after July 8).</p>
      <p><strong>Guest sessions:</strong> guests can join any add-on you've selected for yourself. <strong>WMN at FUSE</strong> is for women — a woman guest can attend WMN even if you don't.</p>
      <p>To change add-ons or guests later, open FUSE 2026 on the Events page and click <strong>Manage add-ons &amp; guests</strong>. You'll only pay for anything new.</p>` },

  { slug: 'event-registration', title: 'Registering or RSVPing for an event', category: 'events', popular: false,
    summary: 'Which events need registration, tickets and add-ons, guests, and changing your registration.',
    tags: ['register', 'registration', 'rsvp', 'ticket', 'event', 'guest', 'guest email', 'early-bird', 'ascent', 'cancel registration', 'claim', 'upgrade', 'vip only'], minutes: 2, updated: 'Oct 26, 2026', status: 'Published',
    views: 0, helpful: [0, 0],
    actions: [{ label: 'Browse events', attr: 'data-nav="events"' }],
    body: `
      <p>Events that take registrations show <strong>RSVP</strong> or <strong>Registration open</strong> on their card. Others don't need one — just add them to your calendar.</p>
      <ol class="kb-steps">
        <li>Open the event and click <strong>Register</strong> (or <strong>RSVP</strong> for free events).</li>
        <li>Your name, email, and phone come from your profile. Pick a ticket and any add-ons — prices show early-bird discounts while they last, and some tickets are included with your membership.</li>
        <li>Add guests if the event allows them, answer any questions, and submit. Paid registrations go through secure checkout.</li>
      </ol>
      <div class="kb-tip"><strong>Guests:</strong> each guest needs their own name, email, phone number, and gender — email and phone can't be the same as yours. Guests can join add-ons you've selected (some, like women-only sessions, have their own rules). Some memberships include a free guest; if you're bringing them, their details are required.</div>
      <p>Some events are for specific membership tiers. You can still see their details, but registration is limited — for example, only VIP members can register for AIME Ascent 2027. If your plan doesn't include it, the event page shows an <strong>Upgrade to VIP</strong> button that takes you to your membership options. To change or cancel, open the event and use <strong>View / edit registration</strong> or <strong>Cancel registration</strong>.</p>` },

  { slug: 'events-calendar', audience: 'all', title: 'Viewing events as a calendar', category: 'events',
    summary: 'Switch the Events page between cards and a month calendar.',
    tags: ['events', 'calendar', 'schedule', 'webinar'], minutes: 1, updated: 'Sep 5, 2026', status: 'Published',
    views: 301, helpful: [33, 2],
    actions: [{ label: 'Open Events', attr: 'data-nav="events"' }],
    body: `<p>On <strong>Events</strong>, use the <strong>Cards / Calendar</strong> toggle above the list. The calendar shows a month at a time; click any event to open its details.</p>` },

  /* ---------------- Billing ---------------- */
  { slug: 'change-plan', title: 'Upgrading or changing your membership plan', category: 'billing',
    summary: 'Move between Premium, Elite, and VIP, or switch annual/monthly.',
    tags: ['upgrade', 'plan', 'premium', 'elite', 'vip', 'annual', 'monthly', 'membership'], minutes: 1, updated: 'Sep 30, 2026', status: 'Published',
    views: 690, helpful: [72, 9],
    actions: [{ label: 'Membership & billing', attr: 'data-nav="settings" data-tab="billing"' }],
    body: `
      <ol class="kb-steps">
        <li>Go to <strong>Settings → Membership &amp; Billing</strong> (or click your name, then <strong>Manage membership</strong>).</li>
        <li>Choose a new plan or billing cycle.</li>
        <li>Upgrades are prorated — your billing date moves to the upgrade date.</li>
      </ol>` },

  { slug: 'payment-method', title: 'Updating your payment card', category: 'billing',
    summary: 'Change the card on file for your membership.',
    tags: ['card', 'payment', 'billing', 'declined', 'credit card', 'invoice'], minutes: 1, updated: 'Oct 8, 2026', status: 'Published',
    views: 433, helpful: [39, 6],
    actions: [{ label: 'Membership & billing', attr: 'data-nav="settings" data-tab="billing"' }],
    body: `
      <p>Open <strong>Settings → Membership &amp; Billing</strong> and choose <strong>Add / update payment method</strong>. Cards are processed securely by Stripe — AIME never stores your full card number.</p>
      <div class="kb-tip">Seeing "declined" with no charge on your bank's side? Try another browser — older Safari versions can block the card form.</div>` },

  /* ---------------- Account & support ---------------- */
  { slug: 'support-ticket', audience: 'all', title: 'Opening a support ticket and replying to our team', category: 'account', popular: true,
    summary: 'Tickets are a conversation — we reply in the portal and you can answer back.',
    tags: ['support', 'ticket', 'help', 'contact', 'reply', 'question'], minutes: 1, updated: 'Oct 23, 2026', status: 'Published',
    views: 980, helpful: [117, 5],
    actions: [{ label: 'Get support', attr: 'data-nav="support"' }],
    body: `
      <ol class="kb-steps">
        <li>Open <strong>Get Support</strong>, choose a category, and describe the issue.</li>
        <li>Our team replies right in the portal, usually within one business day. You'll see a <strong>New reply</strong> badge in My Requests.</li>
        <li>Reply back if you need to — the ticket moves to <strong>In progress</strong>. Replying to a resolved ticket reopens it.</li>
      </ol>
      <p>Statuses: <strong>Received</strong> → <strong>In progress</strong> → <strong>Responded</strong> → <strong>Resolved</strong>.</p>` },

  { slug: 'update-profile', audience: 'all', title: 'Updating your profile and company information', category: 'account',
    summary: 'Keep your NMLS #, licenses, and contact details current.',
    tags: ['profile', 'nmls', 'company', 'address', 'phone', 'licenses'], minutes: 1, updated: 'Aug 30, 2026', status: 'Published',
    views: 377, helpful: [41, 3],
    actions: [{ label: 'Open Settings', attr: 'data-nav="settings"' }],
    body: `<p>Go to <strong>Settings → Profile</strong> (or click your name). Update your personal details and <strong>Company Information</strong>, then <strong>Save changes</strong>. Lender connection forms use these details, so keep your NMLS # and licensed states current.</p>` },

  { slug: 'loan-referrals', audience: 'member', title: 'Getting loan referrals from AIME', category: 'account',
    summary: 'Opt in or out of loan referrals by email — matched to your role and licensed states.',
    tags: ['referral', 'referrals', 'loan referral', 'leads', 'broker', 'processor', 'states', 'opt in', 'opt out', 'elite', 'vip'], minutes: 1, updated: 'Oct 26, 2026', status: 'Published',
    views: 0, helpful: [0, 0],
    actions: [{ label: 'Open referral settings', attr: 'data-nav="settings" data-tab="notifications"' }],
    body: `
      <p>AIME emails loan referrals to <strong>Elite and VIP members</strong> who opt in. <strong>VIP members get each referral first</strong>; Elite members get it shortly after. Each referral includes the person's contact details so you can reach out directly.</p>
      <ul>
        <li>The first time you sign in, we'll ask if you want referrals — choose <strong>Join referrals</strong> or <strong>No thanks</strong>.</li>
        <li><strong>Which referrals:</strong> processors get processor referrals; everyone else gets broker referrals. It's based on the <strong>Role type</strong> on your profile.</li>
        <li><strong>Which states:</strong> the <strong>State licenses</strong> on your profile. Keep them current in <strong>Settings → Profile</strong>.</li>
        <li>Opt in or out any time in <strong>Settings → Notifications &amp; app → Loan referrals</strong>.</li>
      </ul>
      <div class="kb-tip"><strong>On Premium?</strong> Loan referrals are included with Elite and VIP. See <strong>Settings → Membership &amp; Billing</strong> to upgrade.</div>` },

  { slug: 'reset-password', audience: 'all', title: 'Changing your email or password', category: 'account',
    summary: 'Update your login email or reset a forgotten password.',
    tags: ['password', 'login', 'email', 'reset', 'forgot', 'sign in'], minutes: 1, updated: 'Aug 30, 2026', status: 'Published',
    views: 812, helpful: [80, 12],
    actions: [{ label: 'Email & password', attr: 'data-nav="settings" data-tab="security"' }],
    body: `
      <p><strong>Signed in?</strong> Go to <strong>Settings → Email &amp; Password</strong>.</p>
      <p><strong>Locked out?</strong> On the sign-in screen click <strong>Forgot password</strong> — we'll email you a reset link.</p>` },

  { slug: 'report-bug', audience: 'all', title: 'Reporting a bug', category: 'account',
    summary: 'Spotted something broken? Send us a screenshot and details.',
    tags: ['bug', 'broken', 'error', 'not working', 'screenshot'], minutes: 1, updated: 'Jul 30, 2026', status: 'Draft',
    views: 0, helpful: [0, 0],
    actions: [{ label: 'Report a bug', attr: 'data-modal="bug"' }],
    body: `<p>Click <strong>Report a bug</strong> (bottom right of every page). We capture a screenshot you can annotate — add what you expected to happen and submit.</p>` },
];
