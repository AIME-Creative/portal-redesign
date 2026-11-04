/* ============================================================
   AMP — Learning paths (shared by member + admin apps)
   ------------------------------------------------------------
   A learning path is a named, ordered list of content — resources,
   hub videos and events, documents, events — so members know what
   to watch first and what comes next.
   - Admin: Content → Learning paths (admin-learning-paths.js) adds,
     edits, reorders, publishes / drafts, and deletes paths.
   - Member home: Learning paths section under Featured
     (learning-paths.js). Only Published paths show, in admin order.
   - Progress: a step is done once the member opens it. Per member
     (production: per account).
   Prototype: paths in localStorage amp-paths-v1 (seeded below);
   progress in amp-path-progress-v1. CATALOG lists the member app's
   content (from app.js) so admin picks steps from exactly what
   members see. Production: real content records.
   ============================================================ */
window.AmpPaths = (function () {
  const KEY = 'amp-paths-v1', PKEY = 'amp-path-progress-v1';

  // Everything a step can point to. k: resource | event | hub | doc · h: hub key · hk: content | event · v: VIP-only hub
  const CATALOG = [
    {"k": "resource", "t": "The 'Daily Six' Challenge (Part 3)", "s": "Podcast · 28 min"},
    {"k": "resource", "t": "Broker to Broker — Episode 251", "s": "Podcast · 41 min"},
    {"k": "resource", "t": "Broker Power-Up: Episode 65", "s": "Webinar · 52 min"},
    {"k": "resource", "t": "Using AI to Pre-Qualify Borrowers", "s": "Webinar · 39 min"},
    {"k": "resource", "t": "AI Tools for the Daily Workflow", "s": "Training · 31 min"},
    {"k": "resource", "t": "Mortgage Mornings — June 17, 2026", "s": "Webinar · 35 min"},
    {"k": "resource", "t": "Women's Mortgage Network Podcast", "s": "Podcast · 33 min"},
    {"k": "resource", "t": "The Social Media Playbook", "s": "Training · 42 min"},
    {"k": "resource", "t": "Closing: Objection Handling 101", "s": "Training · 29 min"},
    {"k": "resource", "t": "Broker to Broker — Episode 250", "s": "Podcast · 39 min"},
    {"k": "resource", "t": "AIME Accelerate — Identity Reset", "s": "Training · 24 min"},
    {"k": "resource", "t": "Scaling Past $1M in Volume", "s": "Training · 47 min"},
    {"k": "resource", "t": "Compliance Corner — Q3 Update", "s": "Webinar · 38 min"},
    {"k": "resource", "t": "Building Your Referral Engine", "s": "Training · 45 min"},
    {"k": "resource", "t": "Broker to Broker — Episode 249", "s": "Podcast · 44 min"},
    {"k": "event", "t": "AIME Accelerate — Identity Reset", "s": "Event · JUN 6"},
    {"k": "event", "t": "AIME Accelerate — Win the Day", "s": "Event · JUN 15"},
    {"k": "event", "t": "AIME Accelerate — Run Toward It", "s": "Event · JUN 22"},
    {"k": "event", "t": "Mortgage Mornings — Live", "s": "Event · JUL 1"},
    {"k": "event", "t": "AIME Accelerate — Compound", "s": "Event · JUN 29"},
    {"k": "event", "t": "FUSE 2026 — National Conference", "s": "Event · SEP 24"},
    {"k": "event", "t": "AIME Accelerate — Mindset", "s": "Event · JUL 6"},
    {"k": "event", "t": "Regional Mixer — Dallas", "s": "Event · AUG 12"},
    {"k": "event", "t": "AIME Ascent 2027", "s": "Event · FEB 8"},
    {"k": "hub", "h": "brokersedge", "hk": "content", "t": "Brokers Edge — Core Certification", "s": "Certification · Brokers Edge", "v": false},
    {"k": "hub", "h": "brokersedge", "hk": "content", "t": "Non-QM Specialist", "s": "Certification · Brokers Edge", "v": false},
    {"k": "hub", "h": "brokersedge", "hk": "content", "t": "VA Loan Pro", "s": "Certification · Brokers Edge", "v": false},
    {"k": "hub", "h": "brokersedge", "hk": "content", "t": "Self-Employed Borrowers", "s": "Certification · Brokers Edge", "v": false},
    {"k": "doc", "h": "brokersedge", "t": "Brokers Edge Curriculum Guide", "s": "Document · Brokers Edge", "v": false},
    {"k": "doc", "h": "brokersedge", "t": "Certification Completion Checklist", "s": "Document · Brokers Edge", "v": false},
    {"k": "doc", "h": "brokersedge", "t": "Continuing Education Credit Form", "s": "Document · Brokers Edge", "v": false},
    {"k": "hub", "h": "mortgagemornings", "hk": "content", "t": "Mortgage Mornings — June 24, 2026", "s": "Recording · Mortgage Mornings", "v": false},
    {"k": "hub", "h": "mortgagemornings", "hk": "content", "t": "Mortgage Mornings — June 17, 2026", "s": "Recording · Mortgage Mornings", "v": false},
    {"k": "hub", "h": "mortgagemornings", "hk": "content", "t": "Mortgage Mornings — June 10, 2026", "s": "Recording · Mortgage Mornings", "v": false},
    {"k": "hub", "h": "mortgagemornings", "hk": "content", "t": "Mortgage Mornings — June 3, 2026", "s": "Recording · Mortgage Mornings", "v": false},
    {"k": "doc", "h": "mortgagemornings", "t": "Rate Sheet Roundup — This Week", "s": "Document · Mortgage Mornings", "v": false},
    {"k": "doc", "h": "mortgagemornings", "t": "Show Notes Archive (2026)", "s": "Document · Mortgage Mornings", "v": false},
    {"k": "hub", "h": "acceleratelive", "hk": "content", "t": "Accelerate Live — Identity Reset", "s": "Recording · Accelerate Live", "v": false},
    {"k": "hub", "h": "acceleratelive", "hk": "content", "t": "Accelerate Live — Win the Day", "s": "Recording · Accelerate Live", "v": false},
    {"k": "hub", "h": "acceleratelive", "hk": "content", "t": "Accelerate Live — Run Toward It", "s": "Recording · Accelerate Live", "v": false},
    {"k": "hub", "h": "acceleratelive", "hk": "content", "t": "Accelerate Live — Compound", "s": "Recording · Accelerate Live", "v": false},
    {"k": "doc", "h": "acceleratelive", "t": "Accelerate Live — Session Workbook", "s": "Document · Accelerate Live", "v": false},
    {"k": "doc", "h": "acceleratelive", "t": "Weekly Action Plan Template", "s": "Document · Accelerate Live", "v": false},
    {"k": "hub", "h": "ascent", "hk": "content", "t": "Ascent — Leading at Scale", "s": "Training · Ascent", "v": true},
    {"k": "hub", "h": "ascent", "hk": "content", "t": "Ascent — Building a $100M Team", "s": "Training · Ascent", "v": true},
    {"k": "hub", "h": "ascent", "hk": "content", "t": "Ascent — The Founder Mindset", "s": "Training · Ascent", "v": true},
    {"k": "doc", "h": "ascent", "t": "Ascent Workbook — Q3 Cohort", "s": "Document · Ascent", "v": true},
    {"k": "doc", "h": "ascent", "t": "90-Day Growth Plan Template", "s": "Document · Ascent", "v": true},
    {"k": "hub", "h": "vip", "hk": "content", "t": "VIP Roundtable — Scaling to IMB", "s": "Video · VIP", "v": true},
    {"k": "hub", "h": "vip", "hk": "content", "t": "1:1 Strategy Session Replay", "s": "Video · VIP", "v": true},
    {"k": "hub", "h": "vip", "hk": "event", "t": "VIP Luncheon @ FUSE 2026", "s": "Event · VIP", "v": true},
    {"k": "hub", "h": "vip", "hk": "event", "t": "VIP Quarterly Mastermind", "s": "Event · VIP", "v": true},
    {"k": "doc", "h": "vip", "t": "VIP Benefits Guide", "s": "Document · VIP", "v": true},
    {"k": "doc", "h": "vip", "t": "Speaking & Feature Opportunities", "s": "Document · VIP", "v": true},
    {"k": "hub", "h": "wmn", "hk": "content", "t": "WMN Podcast — Owning Your Worth", "s": "Podcast · WMN — Women's Mortgage Network", "v": false},
    {"k": "hub", "h": "wmn", "hk": "content", "t": "WMN Panel — Building Referral Networks", "s": "Webinar · WMN — Women's Mortgage Network", "v": false},
    {"k": "hub", "h": "wmn", "hk": "event", "t": "WMN at FUSE 2026", "s": "Event · WMN — Women's Mortgage Network", "v": false},
    {"k": "hub", "h": "wmn", "hk": "event", "t": "WMN Monthly Meetup", "s": "Event · WMN — Women's Mortgage Network", "v": false},
    {"k": "doc", "h": "wmn", "t": "WMN Mentorship Program Overview", "s": "Document · WMN — Women's Mortgage Network", "v": false},
    {"k": "doc", "h": "wmn", "t": "WMN Community Guidelines", "s": "Document · WMN — Women's Mortgage Network", "v": false},
    {"k": "doc", "h": "", "t": "AIME Member Handbook", "s": "Document · General"},
    {"k": "doc", "h": "", "t": "Loan Escalation Guide", "s": "Document · General"},
    {"k": "doc", "h": "", "t": "AIME Brand & Logo Kit", "s": "Document · General"},
    {"k": "doc", "h": "", "t": "2026 Membership Agreement", "s": "Document · General"}
  ];
  const stepId = (s) => [s.k, s.h || '', s.hk || '', s.t].join('|');
  const find = (k, t, h, hk) => CATALOG.find((c) => c.k === k && c.t === t && (h == null || (c.h || '') === h) && (hk == null || (c.hk || '') === hk));
  const S = (k, t, h, hk) => { const c = find(k, t, h, hk); return c ? { k: c.k, t: c.t, h: c.h || '', hk: c.hk || '' } : null; };

  const seed = () => [
    { id: 'lp-start', title: 'Start Here: Get to Know AIME', for: 'New or returning members', status: 'Published',
      desc: 'What AIME is, how to use the portal, and the standards members commit to.',
      steps: [S('doc', 'AIME Member Handbook'), S('resource', 'Broker Power-Up: Episode 65'), S('doc', 'Loan Escalation Guide'), S('doc', '2026 Membership Agreement')] },
    { id: 'lp-ai', title: 'Use AI in Your Business', for: 'Every member', status: 'Published',
      desc: 'Pre-qualifying with AI, tools for the daily workflow, then how top VIPs scale with it.',
      steps: [S('resource', 'Using AI to Pre-Qualify Borrowers'), S('resource', 'AI Tools for the Daily Workflow'), S('hub', 'VIP Roundtable — Scaling to IMB', 'vip', 'content')] },
    { id: 'lp-be', title: 'Brokers Edge Certifications', for: 'Members building expertise', status: 'Published',
      desc: 'The curriculum guide, all four certifications in order, then the completion checklist.',
      steps: [S('doc', 'Brokers Edge Curriculum Guide'), S('hub', 'Brokers Edge — Core Certification'), S('hub', 'Non-QM Specialist'), S('hub', 'VA Loan Pro'), S('hub', 'Self-Employed Borrowers'), S('doc', 'Certification Completion Checklist')] },
    { id: 'lp-ref', title: 'Build Your Referral Engine', for: 'Every member', status: 'Published',
      desc: 'Referral systems, social media, the WMN referral panel, and handling objections.',
      steps: [S('resource', 'Building Your Referral Engine'), S('resource', 'The Social Media Playbook'), S('hub', 'WMN Panel — Building Referral Networks'), S('resource', 'Closing: Objection Handling 101')] },
    { id: 'lp-acc', title: 'Accelerate: Identity Reset to Compound', for: 'Accelerate Live members', status: 'Published',
      desc: 'The four Accelerate Live sessions in order, with the workbook to follow along.',
      steps: [S('doc', 'Accelerate Live — Session Workbook'), S('hub', 'Accelerate Live — Identity Reset'), S('hub', 'Accelerate Live — Win the Day'), S('hub', 'Accelerate Live — Run Toward It'), S('hub', 'Accelerate Live — Compound')] },
    { id: 'lp-scale', title: 'Scale & Lead a Team', for: 'Growing brokerages', status: 'Published',
      desc: 'Getting past $1M, then the Ascent sessions on building and leading a team.',
      steps: [S('resource', 'Scaling Past $1M in Volume'), S('hub', 'Ascent — Building a $100M Team'), S('hub', 'Ascent — Leading at Scale'), S('doc', '90-Day Growth Plan Template')] },
    { id: 'lp-mm', title: 'Catch Up on Mortgage Mornings', for: 'Every member', status: 'Published',
      desc: 'This month\'s Mornings, oldest first, plus the show notes.',
      steps: [S('hub', 'Mortgage Mornings — June 3, 2026'), S('hub', 'Mortgage Mornings — June 10, 2026'), S('hub', 'Mortgage Mornings — June 17, 2026', 'mortgagemornings'), S('hub', 'Mortgage Mornings — June 24, 2026'), S('doc', 'Show Notes Archive (2026)')] },
    { id: 'lp-comp', title: 'Compliance Basics', for: 'Every member', status: 'Draft',
      desc: 'The latest compliance update and the membership agreement.',
      steps: [S('resource', 'Compliance Corner — Q3 Update'), S('doc', '2026 Membership Agreement')] },
  ].map((p) => Object.assign(p, { steps: p.steps.filter(Boolean) }));

  let paths;
  try { paths = JSON.parse(localStorage.getItem(KEY)); } catch (e) { paths = null; }
  if (!Array.isArray(paths)) { paths = seed(); save(); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(paths)); } catch (e) { /* in-memory */ } }
  const listeners = [];
  const changed = () => { save(); listeners.forEach((f) => f()); };
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) { try { paths = JSON.parse(e.newValue) || paths; } catch (err) { /* keep */ } listeners.forEach((f) => f()); }
    if (e.key === PKEY) listeners.forEach((f) => f());
  });

  const readP = () => { try { return JSON.parse(localStorage.getItem(PKEY)) || {}; } catch (e) { return {}; } };
  const writeP = (p) => { try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) { /* private mode */ } };
  const info = (s) => find(s.k, s.t, s.h || '', s.hk || '') || null;

  return {
    CATALOG, stepId, info,
    all: () => paths.map((p) => Object.assign({}, p, { steps: p.steps.slice() })),
    get: (id) => paths.find((p) => p.id === id) || null,
    includesVIP: (p) => p.steps.some((s) => (info(s) || {}).v),
    save(p) {
      const i = paths.findIndex((x) => x.id === p.id);
      if (i > -1) paths[i] = p; else paths.push(Object.assign({ id: 'lp-' + Date.now().toString(36) }, p));
      changed(); return p.id;
    },
    remove(id) { paths = paths.filter((p) => p.id !== id); const pr = readP(); delete pr[id]; writeP(pr); changed(); },
    move(id, dir) { const i = paths.findIndex((p) => p.id === id), j = i + dir; if (i < 0 || j < 0 || j >= paths.length) return; [paths[i], paths[j]] = [paths[j], paths[i]]; changed(); },
    // progress
    done: (pathId) => readP()[pathId] || [],
    markDone(pathId, s) { const p = readP(), id = stepId(s); p[pathId] = p[pathId] || []; if (!p[pathId].includes(id)) { p[pathId].push(id); writeP(p); listeners.forEach((f) => f()); } },
    resetProgress(pathId) { const p = readP(); if (pathId) delete p[pathId]; else Object.keys(p).forEach((k) => delete p[k]); writeP(p); listeners.forEach((f) => f()); },
    onChange: (f) => listeners.push(f),
    reset() { paths = seed(); writeP({}); changed(); },
  };
})();
