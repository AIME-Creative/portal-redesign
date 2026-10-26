/* ============================================================
   AMP Member Portal — Event registration
   ------------------------------------------------------------
   Only events with registration turned on (admin → Events →
   Registration) get a Register / RSVP option; the rest keep
   "Add to calendar".
     • Tier gating: members outside the event's tiers see a locked
       panel (the prototype can still preview the form)
     • RSVP events: details + custom fields, free
     • Ticketed events: ticket type (some included free for certain
       tiers), add-ons & sessions, guests, early-bird pricing,
       custom fields, order summary
     • Registered: summary + Edit / Cancel
   Data: event-registration-store.js (shared with admin).
   Wraps app.js's openEvent() and uses its globals: events,
   memberTier, SHOW_VIP_IN_PROTOTYPE, navigate, openModal,
   closeModals, showToast, backArrow.
   Deep link: index.html#register=<event-slug>
   ============================================================ */
(function () {
  const R = window.AmpEventReg;
  if (!R || typeof events === 'undefined' || !document.getElementById('modal-event-reg')) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ME = { first: 'Kyle', last: 'Lord', email: 'kyle@aimegroup.com', phone: '(555) 014-2278', tier: memberTier };
  const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const money = R.money;
  const lockIco = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>';
  const checkIco = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>';

  let current = null;   // { i, ev, setup, draft, preview, editing }

  /* ---------- state of an event for this member ---------- */
  function status(ev) {
    const setup = R.active(ev.title);
    if (!setup) return { setup: null };
    const reg = R.find(ev.title, ME.email);
    const eligible = R.canRegister(setup, ME.tier);
    const left = setup.capacity ? Math.max(0, setup.capacity - R.attendees(ev.title)) : null;
    const closed = setup.closes && R.TODAY > new Date(setup.closes + ' 23:59:59');
    return { setup, reg, eligible, left, closed, eb: R.isEarlyBird(setup) };
  }

  /* ---------- event cards: badges ---------- */
  function decorateCards() {
    document.querySelectorAll('.event-card').forEach((card) => {
      const btn = card.querySelector('[data-open-event]'); if (!btn) return;
      const ev = events[+btn.dataset.openEvent]; if (!ev) return;
      card.querySelector('.er-card-badge')?.remove();
      const st = status(ev); if (!st.setup) return;
      const label = st.reg ? `${checkIco} Registered` : !st.eligible ? `${lockIco} ${st.setup.tiers.join(' & ')} only` : st.setup.mode === 'rsvp' ? 'RSVP' : 'Registration open';
      const b = document.createElement('span');
      b.className = 'er-card-badge' + (st.reg ? ' done' : !st.eligible ? ' locked' : '');
      b.innerHTML = label;
      card.querySelector('.event-banner')?.appendChild(b);
    });
  }

  /* ---------- event detail: registration panel ---------- */
  function panelHTML(ev) {
    const st = status(ev), s = st.setup;
    if (!s) return `<p class="er-note">No registration needed — add it to your calendar and we'll send the details beforehand.</p>`;
    const tiersLine = `<div class="er-meta">${s.mode === 'rsvp' ? 'Free · RSVP' : 'Ticketed'} · ${R.tierText(s.tiers)}${st.left != null ? ` · ${st.left} spot${st.left === 1 ? '' : 's'} left` : ''}</div>`;
    if (st.reg) {
      const r = st.reg, t = s.tickets.find((x) => x.id === r.ticket);
      const addons = (r.addons || []).map((id) => (s.addons.find((a) => a.id === id) || {}).name).filter(Boolean);
      return `<div class="er-registered">${checkIco}<div><strong>You're registered</strong>
          <div class="er-meta">${t ? esc(t.name) : s.mode === 'rsvp' ? 'RSVP confirmed' : ''}${addons.length ? ' · ' + addons.map(esc).join(', ') : ''}${r.guests && r.guests.length ? ` · ${r.guests.length} guest${r.guests.length > 1 ? 's' : ''}` : ''}</div></div></div>
        <button class="btn btn-navy btn-block" style="margin-top:14px" data-er-open>${s.mode === 'rsvp' ? 'View / edit RSVP' : 'View / edit registration'}</button>
        ${ev.title.startsWith('FUSE') ? '<button class="btn btn-outline btn-block btn-sm" style="margin-top:10px" data-nav="fuse">FUSE details &amp; referrals</button>' : ''}
        <button class="link-muted" style="display:block;margin:12px auto 0" data-er-cancel>${s.mode === 'rsvp' ? 'Cancel my RSVP' : 'Cancel registration'}</button>`;
    }
    if (!st.eligible) {
      return `<div class="er-locked">${lockIco}<div><strong>For ${s.tiers.join(' & ')} members</strong><div class="er-meta">Registration for this event is limited to ${esc(s.tiers.join(' & '))} members.</div></div></div>
        <button class="btn btn-outline btn-block" style="margin-top:14px" data-nav="settings" data-tab="billing">See membership options</button>
        ${typeof SHOW_VIP_IN_PROTOTYPE !== 'undefined' && SHOW_VIP_IN_PROTOTYPE ? '<button class="link-muted" style="display:block;margin:12px auto 0" data-er-open data-preview>Preview the form (prototype only)</button>' : ''}`;
    }
    if (st.closed) return tiersLine + `<p class="er-note">Registration closed on ${esc(R.fmtDate(s.closes))}.</p>`;
    if (st.left === 0) return tiersLine + `<p class="er-note">This event is full.</p><button class="btn btn-outline btn-block" data-toast="You're on the waitlist — we'll email you if a spot opens.">Join the waitlist</button>`;
    let price = '';
    if (s.mode === 'ticketed') {
      const avail = s.tickets.filter((t) => R.itemAllowed(t, ME.tier));
      const incl = avail.find((t) => (t.included || []).includes(ME.tier));
      price = incl ? `<div class="er-price free">${esc(incl.name)} included with ${ME.tier}</div>`
        : avail.length ? `<div class="er-price">From ${money(Math.min(...avail.map((t) => R.unit(t, st.eb))))}</div>` : '';
    }
    return tiersLine + price + (st.eb ? `<div class="er-eb">Early-bird pricing until ${esc(R.fmtDate(s.earlyBird.until))}</div>` : '') +
      `<button class="btn btn-primary btn-block" style="margin-top:14px" data-er-open>${s.mode === 'rsvp' ? 'RSVP' : 'Register'}</button>`;
  }

  function enhanceDetail(i) {
    const ev = events[i], card = document.querySelector('#event-detail-body .summary-card');
    if (!ev || !card) return;
    card.querySelector('[data-toast^="Registered for"]')?.remove();      // app.js's placeholder button
    card.querySelector('.er-panel')?.remove();
    const panel = document.createElement('div');
    panel.className = 'er-panel'; panel.dataset.event = i;
    panel.innerHTML = panelHTML(ev);
    const cal = card.querySelector('[data-toast="Added to your calendar."]');
    card.insertBefore(panel, cal);
    current = { i, ev };
  }

  const origOpenEvent = window.openEvent;
  window.openEvent = function (i) { origOpenEvent(i); enhanceDetail(i); };

  /* ---------- the form ---------- */
  function openForm(i, preview) {
    const ev = events[i], st = status(ev), s = st.setup; if (!s) return;
    const r = st.reg;
    const defaultTicket = () => { const a = s.tickets.filter((t) => R.itemAllowed(t, ME.tier)); return ((a.find((t) => (t.included || []).includes(ME.tier)) || a[0]) || {}).id || null; };
    current = { i, ev, setup: s, eb: st.eb, preview: !!preview, editing: !!r,
      draft: r ? JSON.parse(JSON.stringify({ ticket: r.ticket, addons: r.addons || [], guests: r.guests || [], answers: r.answers || {}, phone: r.phone || ME.phone }))
        : { ticket: s.mode === 'ticketed' ? defaultTicket() : null, addons: [], guests: [], answers: {}, phone: ME.phone } };
    renderForm();
    openModal('event-reg');
  }

  function priceTag(item, opts) {
    if (opts && opts.included) return '<span class="ar-price free">Included</span>';
    if (opts && opts.locked) return `<span class="er-lock-pill">${esc(item.tiers.join(' & '))} only</span>`;
    const full = +item.price || 0, now = R.unit(item, current.eb);
    if (!full) return '<span class="ar-price free">Free</span>';
    return now < full ? `<span class="ar-price"><s>${money(full)}</s> ${money(now)}</span>` : `<span class="ar-price">${money(full)}</span>`;
  }

  function fieldHTML(f) {
    const v = current.draft.answers[f.id], req = f.required ? ' <span class="req">*</span>' : '', id = 'erf-' + f.id;
    const help = f.help ? `<div class="er-help">${esc(f.help)}</div>` : '';
    if (f.type === 'checkbox') return `<label class="er-check"><input type="checkbox" data-erf="${f.id}" ${v ? 'checked' : ''}> <span>${esc(f.label)}${req}</span></label>`;
    let input;
    if (f.type === 'textarea') input = `<textarea class="input" id="${id}" data-erf="${f.id}" placeholder="${esc(f.help || '')}">${esc(v || '')}</textarea>`;
    else if (f.type === 'select' || f.type === 'yesno') {
      const opts = f.type === 'yesno' ? ['Yes', 'No'] : f.options;
      input = `<select class="select" id="${id}" data-erf="${f.id}"><option value="">— select —</option>${opts.map((o) => `<option ${o === v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
    } else input = `<input class="input" id="${id}" data-erf="${f.id}" value="${esc(v || '')}">`;
    return `<div class="field" data-field="${f.id}"><label for="${id}">${esc(f.label)}${req}</label>${input}${f.type !== 'textarea' ? help : ''}</div>`;
  }

  function renderForm() {
    const { ev, setup: s, draft, eb } = current;
    $('er-title').textContent = (s.mode === 'rsvp' ? 'RSVP — ' : 'Register — ') + ev.title;
    $('er-sub').innerHTML = `${esc(ev.when)}${ev.loc ? ' · ' + esc(ev.loc) : ''}`;
    const restricted = !(s.tiers || []).includes('All');
    let html = '';
    if (current.preview) html += `<div class="callout" style="margin-bottom:16px"><p><strong>Preview only.</strong> This event is for ${esc(s.tiers.join(' & '))} members — you can look through the form, but registering is disabled for your tier.</p></div>`;
    if (eb && s.mode === 'ticketed') html += `<div class="er-eb-banner">Early-bird pricing ends ${esc(R.fmtDate(s.earlyBird.until))}</div>`;

    html += `<div class="form-section-label">Your details</div>
      <div class="field-row"><div class="field"><label>First name <span class="req">*</span></label><input class="input" value="${ME.first}" readonly></div>
        <div class="field"><label>Last name <span class="req">*</span></label><input class="input" value="${ME.last}" readonly></div></div>
      <div class="field-row"><div class="field"><label>Phone <span class="req">*</span></label><input class="input" data-er-phone value="${esc(draft.phone)}"></div>
        <div class="field"><label>Email <span class="req">*</span></label><input class="input" value="${ME.email}" readonly>
          ${restricted ? `<div class="er-help warn">This event is for ${esc(s.tiers.join(' & '))} members only — we use the email on your AMP login.</div>` : '<div class="er-help">From your AMP profile.</div>'}</div></div>`;

    if (s.mode === 'ticketed' && s.tickets.length) {
      html += `<div class="form-section-label">Ticket</div>` + s.tickets.map((t) => {
        const locked = !R.itemAllowed(t, ME.tier), included = (t.included || []).includes(ME.tier);
        return `<label class="addon-row ${locked ? 'locked' : ''}"><input type="radio" name="er-ticket" value="${t.id}" ${draft.ticket === t.id ? 'checked' : ''} ${locked ? 'disabled' : ''}>
          <span class="ar-main"><span class="ar-t" style="display:block">${esc(t.name)}</span><span class="ar-s" style="display:block">${esc(t.desc || '')}</span></span>
          ${priceTag(t, { included, locked })}</label>`;
      }).join('');
    }
    if (s.addons.length) {
      html += `<div class="form-section-label">Add-ons &amp; sessions</div>` + s.addons.map((a) => {
        const locked = !R.itemAllowed(a, ME.tier);
        return `<label class="addon-row ${locked ? 'locked' : ''}"><input type="checkbox" data-er-addon="${a.id}" ${draft.addons.includes(a.id) ? 'checked' : ''} ${locked ? 'disabled' : ''}>
          <span class="ar-main"><span class="ar-t" style="display:block">${esc(a.name)}</span><span class="ar-s" style="display:block">${esc(a.desc || '')}</span></span>
          ${priceTag(a, { locked })}</label>`;
      }).join('');
    }
    if (s.guests && s.guests.on) {
      const g = s.guests;
      html += `<div class="form-section-label">Guests</div>
        <div class="er-guests"><div><strong>Bringing a guest?</strong><div class="er-help">Up to ${g.max} · ${+g.price ? `${money(R.unit(g, eb))} per guest${R.unit(g, eb) < +g.price ? ` <s>${money(+g.price)}</s>` : ''}` : 'free'}</div></div>
          <div class="qty-stepper"><button type="button" class="qty-btn" data-er-guest="-1" aria-label="Fewer guests">−</button><span class="qty-val">${draft.guests.length}</span><button type="button" class="qty-btn" data-er-guest="1" aria-label="More guests">+</button></div></div>
        ${draft.guests.map((x, k) => `<div class="field"><label>Guest ${k + 1} name <span class="req">*</span></label><input class="input" data-er-guestname="${k}" value="${esc(x.name || '')}"></div>`).join('')}`;
    }
    if (s.fields.length) {
      const checks = s.fields.filter((f) => f.type === 'checkbox'), rest = s.fields.filter((f) => f.type !== 'checkbox');
      html += `<div class="form-section-label">A few more details</div>` + rest.map(fieldHTML).join('') + checks.map(fieldHTML).join('');
    }
    html += `<div class="er-summary" id="er-summary"></div><div class="er-error" id="er-error" hidden></div>`;
    $('er-body').innerHTML = html;
    renderSummary();
  }

  function renderSummary() {
    const { setup: s, draft, eb } = current;
    const p = R.priceOf(s, Object.assign({ tier: ME.tier }, draft), eb);
    const box = $('er-summary');
    if (s.mode === 'ticketed' || p.total) {
      box.hidden = false;
      box.innerHTML = `<div class="form-section-label" style="margin-top:0">Order summary</div>` +
        p.lines.map((l) => `<div class="er-line"><span>${esc(l.label)}${l.note ? ` <em>${esc(l.note)}</em>` : ''}</span><span>${l.amount ? money(l.amount) : 'Free'}</span></div>`).join('') +
        `<div class="er-line total"><span>Total</span><span>${money(p.total) === 'Free' ? '$0' : money(p.total)}</span></div>` +
        (p.total ? '<div class="er-help">Secure checkout by Stripe in production — the prototype simulates payment.</div>' : '');
    } else box.hidden = true;
    const btn = $('er-submit');
    btn.disabled = current.preview;
    btn.textContent = current.preview ? 'Registration disabled (preview)' : p.total ? `Pay ${money(p.total)} & ${current.editing ? 'update' : 'register'}`
      : current.editing ? 'Save changes' : s.mode === 'rsvp' ? 'RSVP' : 'Register';
  }

  function submit() {
    const { ev, setup: s, draft, eb } = current;
    const missing = [];
    if (!draft.phone.trim()) missing.push('Phone');
    if (s.mode === 'ticketed' && s.tickets.length && !draft.ticket) missing.push('Ticket');
    draft.guests.forEach((g, k) => { if (!(g.name || '').trim()) missing.push(`Guest ${k + 1} name`); });
    s.fields.forEach((f) => { if (f.required && !draft.answers[f.id]) missing.push(f.label); });
    document.querySelectorAll('#er-body .field.er-bad').forEach((x) => x.classList.remove('er-bad'));
    if (missing.length) {
      s.fields.forEach((f) => { if (f.required && !draft.answers[f.id]) document.querySelector(`#er-body [data-field="${f.id}"]`)?.classList.add('er-bad'); });
      const e = $('er-error'); e.hidden = false; e.textContent = 'Please complete: ' + missing.join(', ');
      e.scrollIntoView({ block: 'nearest' });
      return;
    }
    const p = R.priceOf(s, Object.assign({ tier: ME.tier }, draft), eb);
    R.register({ event: ev.title, name: `${ME.first} ${ME.last}`, email: ME.email, phone: draft.phone, tier: ME.tier,
      ticket: draft.ticket, addons: draft.addons, guests: draft.guests, answers: draft.answers, total: p.total, earlyBird: eb });
    closeModals();
    showToast(p.total ? `Payment received — you're registered for ${ev.title}.` : s.mode === 'rsvp' ? `You're on the list for ${ev.title}!` : `You're registered for ${ev.title}!`);
  }

  /* ---------- events ---------- */
  const modal = $('modal-event-reg');
  modal.addEventListener('change', (e) => {
    const t = e.target, d = current && current.draft; if (!d) return;
    if (t.name === 'er-ticket') d.ticket = t.value;
    else if (t.dataset.erAddon) d.addons = t.checked ? [...new Set([...d.addons, t.dataset.erAddon])] : d.addons.filter((x) => x !== t.dataset.erAddon);
    else if (t.dataset.erf) d.answers[t.dataset.erf] = t.type === 'checkbox' ? t.checked : t.value;
    renderSummary();
  });
  modal.addEventListener('input', (e) => {
    const t = e.target, d = current && current.draft; if (!d) return;
    if (t.dataset.erf && t.type !== 'checkbox') d.answers[t.dataset.erf] = t.value;
    else if (t.dataset.erGuestname != null) d.guests[+t.dataset.erGuestname].name = t.value;
    else if (t.hasAttribute('data-er-phone')) d.phone = t.value;
  });
  modal.addEventListener('click', (e) => {
    const g = e.target.closest('[data-er-guest]');
    if (g) {
      e.preventDefault();
      const d = current.draft, max = current.setup.guests.max;
      if (+g.dataset.erGuest > 0 && d.guests.length < max) d.guests.push({ name: '' });
      if (+g.dataset.erGuest < 0) d.guests.pop();
      const keep = $('er-body').scrollTop; renderForm(); $('er-body').scrollTop = keep;
    }
    if (e.target.closest('#er-submit')) { e.preventDefault(); submit(); }
  });
  document.addEventListener('click', (e) => {
    let m;
    if ((m = e.target.closest('[data-er-open]'))) { e.preventDefault(); openForm(+m.closest('.er-panel').dataset.event, m.hasAttribute('data-preview')); return; }
    if (e.target.closest('[data-er-cancel]')) {
      e.preventDefault();
      const ev = events[+e.target.closest('.er-panel').dataset.event];
      R.cancel(ev.title, ME.email);
      showToast(`Your registration for ${ev.title} was cancelled.`);
    }
  });

  // FUSE: registering is claiming the included ticket. The "claim your ticket" banner shows only
  // while the member has no FUSE registration, and opens the FUSE registration form.
  const FUSE = 'FUSE 2026 — National Conference';
  function syncClaimBanner() {
    if (typeof updateClaimBanner !== 'function') return;
    ticketClaimed = !!R.find(FUSE, ME.email);   // app.js global
    updateClaimBanner();
  }
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="dismiss-banner"]') || !e.target.closest('[data-action="claim-ticket"]')) return;
    e.preventDefault(); e.stopPropagation();
    const i = events.findIndex((ev) => ev.title === FUSE);
    if (i > -1) { openEvent(i); openForm(i); }
  }, true);

  R.onChange(() => { decorateCards(); syncClaimBanner(); if (current && document.getElementById('view-event-detail').classList.contains('active')) enhanceDetail(current.i); });
  decorateCards();
  syncClaimBanner();

  // Deep link: index.html#register=<event-slug>
  const h = (location.hash || '').replace('#', '');
  if (h.startsWith('register=')) {
    const i = events.findIndex((ev) => slug(ev.title) === h.slice(9));
    if (i > -1) { openEvent(i); const st = status(events[i]); if (st.setup && (st.eligible || st.reg)) openForm(i); else if (st.setup) openForm(i, true); }
  }
  window.AmpEventRegMember = { open: openForm, slug };
})();
