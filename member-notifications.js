/* ============================================================
   AMP — member notification bell
   ------------------------------------------------------------
   Every notification opens the exact thing it's about:
   - Request updates (from My Requests data): a lender reply, a team
     reply or follow-up update, a status change, delivery, or an
     automatic lender reminder → opens that request, where the reply
     is. One notification per request (its latest update); unread
     until the member opens it.
   - Portal news: a new lender → that lender's page; a new resource
     → that resource; an event reminder → that event; FUSE pricing →
     the FUSE registration page.
   Lender / Vendor users have their own bell (partner-portal.js).
   Uses app.js globals: lenders, resources, events, userType,
   navigate, openLender, openResource, openEvent, closeNotif.
   ============================================================ */
(function () {
  const list = document.querySelector('#notif-panel .notif-list');
  if (!list || typeof userType === 'undefined' || userType !== 'member') return;
  const S = window.AmpRequests;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`;
  const ICO = {
    lender: '<path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"/>',
    escalation: '<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>',
    reply: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
    connection: '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
    changeae: '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6"/>',
    resource: '<path d="M4 19V5a2 2 0 012-2h12v18H6a2 2 0 01-2-2zM4 19a2 2 0 012-2h12"/>',
    event: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  };
  const H = 36e5, now = Date.now();
  const ago = (at) => { const m = Math.max(1, Math.round((Date.now() - new Date(at)) / 6e4)); return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`; };
  const idx = (arr, test) => arr.findIndex(test);
  // Portal news someone has opened stays read (requests use their own seen state).
  const READ_KEY = 'amp-notif-read-v1';
  const readSet = () => { try { return new Set(JSON.parse(localStorage.getItem(READ_KEY)) || []); } catch (e) { return new Set(); } };
  const markRead = (key) => { const s = readSet(); s.add(key); try { localStorage.setItem(READ_KEY, JSON.stringify([...s])); } catch (e) { /* private mode */ } };

  // Portal news — each opens its exact item.
  function news() {
    const out = [];
    const l = idx(lenders, (x) => x.name === 'Newrez Wholesale');
    if (l >= 0) out.push({ at: now - 2 * H, t: 'New Gold partner — Newrez Wholesale', s: 'A new lender just joined the portal', ico: 'lender', cls: 'i-navy', unread: true, open: () => openLender(l) });
    out.push({ at: now - 24 * H, t: 'FUSE 2026 — early-bird pricing ends Friday', s: 'Manage your registration', ico: 'escalation', cls: 'i-amber', open: () => navigate('fuse') });
    const r = idx(resources, (x) => /Broker Power-Up: Episode 65/.test(x.title));
    if (r >= 0) out.push({ at: now - 48 * H, t: `New resource: ${resources[r].title}`, s: 'Just published', ico: 'resource', cls: 'i-cyan', open: () => openResource(r) });
    const e = idx(events, (x) => /^AIME Accelerate/.test(x.title));
    if (e >= 0) out.push({ at: now - 72 * H, t: `Reminder: ${events[e].title}`, s: `${events[e].when}`, ico: 'event', cls: 'i-navy', open: () => openEvent(e) });
    return out;
  }

  // Request updates — the latest thing that happened on each of the member's requests, from someone else.
  function requestUpdates() {
    if (!S) return [];
    return S.mine().map((r) => {
      // A reply and the status change it triggers land together — the reply is the news.
      const RANK = { 'lender-response': 3, message: 3, 'followup-update': 3, status: 1 };
      const a = r.activity.filter((x) => x.by !== 'member' && x.kind !== 'note')
        .sort((x, y) => (Math.abs(new Date(x.at) - new Date(y.at)) < 2 * 6e4 ? (RANK[y.kind] || 2) - (RANK[x.kind] || 2) : x.at < y.at ? 1 : -1))[0];
      if (!a) return null;
      const label = S.TYPES[r.type].label.toLowerCase();
      const who = a.by === 'lender' ? (a.author || r.partner) : a.by === 'team' ? (a.author || 'The AIME team') : '';
      let t, ico = r.type === 'escalation' ? 'escalation' : r.type === 'connection' ? 'connection' : r.type === 'changeae' ? 'changeae' : 'reply';
      if (a.kind === 'lender-response') { t = `${who} replied to your escalation`; ico = 'reply'; }
      else if (a.kind === 'message') { t = `${a.by === 'team' ? 'The AIME team' : who} replied to your ${label}`; ico = 'reply'; }
      else if (a.kind === 'followup-update') { t = `Update on your follow-up from ${who}`; ico = 'reply'; }
      else if (a.kind === 'status') t = `Your ${label} is now ${a.text}`;
      else if (a.kind === 'lender-reminder') { t = `We reminded ${r.partner} about your escalation`; ico = 'clock'; }
      else if (a.kind === 'delivered') t = `Your ${label} was delivered${r.partner ? ' to ' + r.partner : ''}`;
      else t = `Update on your ${label}`;
      return { at: a.at, t, s: `${r.id} · ${r.title}`, ico, cls: 'i-pink', unread: S.memberUnread(r), request: r.id };
    }).filter(Boolean);
  }

  let items = [];
  function render() {
    const read = readSet();
    items = requestUpdates().concat(news().map((n) => Object.assign(n, { unread: n.unread && !read.has(n.t) }))).sort((a, b) => (new Date(a.at) < new Date(b.at) ? 1 : -1)).slice(0, 8);
    list.innerHTML = items.map((n, i) => `<button class="notif-item${n.unread ? ' unread' : ''}" ${n.request ? `data-open-request="${n.request}"` : `data-notif-open="${i}"`}>
        <span class="ni-ico ${n.cls}">${svg(ICO[n.ico])}</span>
        <div class="ni-main"><div class="ni-t">${esc(n.t)}</div><div class="ni-s">${esc(n.s)} · ${ago(n.at)}</div></div></button>`).join('');
    const dot = document.querySelector('.notif-wrap .icon-btn .dot');
    if (dot && items.some((n) => n.unread)) dot.classList.remove('hidden');
  }

  // Request notifications use my-requests.js's own [data-open-request] (opens the request and marks it read).
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-notif-open]'); if (!b) return;
    e.preventDefault(); closeNotif();
    const n = items[+b.dataset.notifOpen]; if (!n) return;
    markRead(n.t); n.open(); render();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#notif-panel [data-open-request]')) return;
    closeNotif(); setTimeout(render);   // after my-requests.js opens it and marks it seen
  }, true);
  // "Mark all read" (its toast comes from app.js's data-toast)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#notif-panel .notif-readall')) return;
    items.forEach((n) => (n.request ? S.markSeen(n.request, 'member') : markRead(n.t)));
    setTimeout(render);
  });
  if (S && S.onChange) S.onChange(render);
  render();
  window.AmpMemberNotifs = { render };
})();
