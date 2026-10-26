/* ============================================================
   AMP Admin — Event registration
   ------------------------------------------------------------
   1. Registration setup (Events → "Registration" on a row):
      on/off, RSVP vs ticketed, which tiers can register, capacity,
      close date, early-bird deadline, ticket types (price, early-
      bird price, included free for tiers, available to tiers),
      add-ons & sessions, guests, and custom fields.
   2. Event registrations dashboard (Content → Events → Registrations tab): pick an
      event; totals across the top, breakdowns (tier, tickets,
      add-ons, answers to dropdown questions), and every
      registration with its tier, ticket, add-ons, guests, and
      answers.
   Data: event-registration-store.js (shared with the member app).
   Uses admin.js globals: events, navigate, openModal, closeModals,
   showToast, renderEvents, initials.
   ============================================================ */
(function () {
  const R = window.AmpEventReg;
  if (!R || !document.getElementById('view-registrations')) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => '$' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
  const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const tierBadge = (t) => `<span class="badge ${t === 'VIP' ? 'badge-navy' : t === 'Elite' ? 'badge-pink' : 'badge-cyan'}">${t}</span>`;
  const FIELD_TYPES = [['text', 'Short answer'], ['textarea', 'Paragraph'], ['select', 'Dropdown'], ['yesno', 'Yes / No'], ['checkbox', 'Checkbox (consent, opt-in)']];

  /* ============================================================
     1. Registration setup
     ============================================================ */
  let editTitle = null, draft = null;

  function openSetup(title) {
    editTitle = title; draft = R.editable(title);
    renderSetup(); navigate('event-reg');
  }

  const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), draft);
  function set(path, val) {
    const keys = path.split('.'), last = keys.pop();
    keys.reduce((o, k) => o[k], draft)[last] = val;
  }
  const chips = (path, opts) => {
    const cur = get(path) || [];
    return `<div class="ereg-chips">${opts.map((o) => `<button type="button" class="ereg-chip ${cur.includes(o) ? 'on' : ''}" data-chip="${path}" data-val="${o}">${o === 'All' ? 'All members' : o}</button>`).join('')}</div>`;
  };
  const toggle = (path, label) => `<label class="ereg-switch"><input type="checkbox" data-k="${path}" data-t="bool" ${get(path) ? 'checked' : ''}><span class="sw"></span><span>${label}</span></label>`;
  const inp = (path, ph, type, extra) => `<input class="input" data-k="${path}" ${type === 'number' ? 'type="number" min="0" step="1" data-t="num"' : type === 'date' ? 'type="date"' : ''} value="${esc(get(path) == null ? '' : get(path))}" placeholder="${esc(ph || '')}" ${extra || ''}>`;
  const toISO = (s) => { if (!s) return ''; if (/^\d{4}-\d\d-\d\d$/.test(s)) return s; const d = new Date(s); return isNaN(d) ? '' : d.toISOString().slice(0, 10); };

  function renderSetup() {
    const ev = events.find((e) => e.title === editTitle) || { title: editTitle, date: '', type: '' };
    // normalise dates for <input type=date>
    draft.closes = toISO(draft.closes); draft.earlyBird.until = toISO(draft.earlyBird.until);
    draft.guests.included = draft.guests.included || {};
    draft.addons.forEach((a) => { a.included = a.included || []; a.perGuest = !!a.perGuest; a.guestSolo = !!a.guestSolo; a.womenOnly = !!a.womenOnly; });
    const ticketed = draft.mode === 'ticketed', on = draft.enabled;
    const itemRow = (kind, it, k) => `<div class="ereg-item">
        <div class="ereg-item-grid">
          <div class="field"><label>Name</label>${inp(`${kind}.${k}.name`, kind === 'tickets' ? 'e.g. General Admission' : 'e.g. Hall of AIME')}</div>
          <div class="field"><label>Price <span class="er-dim">(0 = free)</span></label>${inp(`${kind}.${k}.price`, '0', 'number')}</div>
          <div class="field"><label>Early-bird price</label>${inp(`${kind}.${k}.ebPrice`, draft.earlyBird.on ? 'optional' : 'turn on early-bird', 'number', draft.earlyBird.on ? '' : 'disabled')}</div>
        </div>
        <div class="field"><label>Description</label>${inp(`${kind}.${k}.desc`, 'Shown under the name')}</div>
        <div class="field"><label>Included free for</label>${chips(`${kind}.${k}.included`, R.TIERS)}<div class="er-help">${kind === 'tickets'
          ? 'e.g. FUSE General Admission is included with Premium and Elite; the VIP ticket with VIP.'
          : 'Free for these tiers — and for their included guests (e.g. Hall of AIME for VIP + their free guest). Members still select it.'}</div></div>
        ${kind === 'addons' ? `<div class="ereg-addon-rules">
            <label class="ereg-req"><input type="checkbox" data-k="addons.${k}.perGuest" data-t="bool" ${it.perGuest ? 'checked' : ''}> Guests can join — if the member selects it too</label>
            <label class="ereg-req"><input type="checkbox" data-k="addons.${k}.guestSolo" data-t="bool" ${it.guestSolo ? 'checked' : ''}> Guests can join without the member</label>
            <label class="ereg-req"><input type="checkbox" data-k="addons.${k}.womenOnly" data-t="bool" ${it.womenOnly ? 'checked' : ''}> Women only <span class="er-dim">(checked against profile / guest gender)</span></label>
          </div>` : ''}
        <div class="field"><label>Available to</label>${chips(`${kind}.${k}.tiers`, ['All', ...R.TIERS])}</div>
        <button type="button" class="link-muted ereg-del" data-del="${kind}.${k}">Remove</button>
      </div>`;
    const fieldRow = (f, k) => `<div class="ereg-item">
        <div class="ereg-item-grid fields">
          <div class="field"><label>Question / label</label>${inp(`fields.${k}.label`, 'e.g. Shirt size')}</div>
          <div class="field"><label>Type</label><select class="select" data-k="fields.${k}.type" data-rerender>${FIELD_TYPES.map(([v, l]) => `<option value="${v}" ${f.type === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
          <label class="ereg-req"><input type="checkbox" data-k="fields.${k}.required" data-t="bool" ${f.required ? 'checked' : ''}> Required</label>
        </div>
        ${f.type === 'select' ? `<div class="field"><label>Options <span class="er-dim">(comma-separated)</span></label><input class="input" data-k="fields.${k}.options" data-t="list" value="${esc((f.options || []).join(', '))}" placeholder="XS, S, M, L, XL"></div>` : ''}
        <div class="field"><label>Help text <span class="er-dim">(optional)</span></label>${inp(`fields.${k}.help`, 'Shown under the question')}</div>
        <div class="ereg-item-actions">
          <button type="button" class="icon-act" data-move="fields.${k}:-1" title="Move up" ${k === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" class="icon-act" data-move="fields.${k}:1" title="Move down" ${k === draft.fields.length - 1 ? 'disabled' : ''}>↓</button>
          <button type="button" class="link-muted" data-del="fields.${k}">Remove</button>
        </div>
      </div>`;

    $('ereg-body').innerHTML = `
      <a class="back-link" data-nav="events"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back to events</a>
      <div class="adm-section-head">
        <div class="page-head" style="margin:0"><h1>Registration</h1><p>${esc(ev.title)}${ev.date ? ' · ' + esc(ev.date) : ''}${ev.type ? ' · ' + esc(ev.type) : ''}</p></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <a class="btn btn-outline" href="index.html#register=${slug(editTitle)}" target="_blank" rel="noopener">Preview member form</a>
          <button class="btn btn-primary" data-ereg-save>Save registration</button>
        </div>
      </div>

      <div class="ereg-grid">
        <div class="card card-pad">
          ${toggle('enabled', '<strong>Accept registrations for this event</strong>')}
          <p class="er-help" style="margin:6px 0 0 52px">Off = no Register / RSVP button for members (they can still add the event to their calendar).</p>
          <div class="ereg-section ${on ? '' : 'dim'}">
            <div class="field"><label>Registration type</label>
              <div class="ereg-seg">
                <label class="${!ticketed ? 'on' : ''}"><input type="radio" name="ereg-mode" value="rsvp" ${!ticketed ? 'checked' : ''}><strong>RSVP only</strong><span>Free — members confirm they're coming</span></label>
                <label class="${ticketed ? 'on' : ''}"><input type="radio" name="ereg-mode" value="ticketed" ${ticketed ? 'checked' : ''}><strong>Ticketed</strong><span>Ticket types, paid add-ons, early-bird</span></label>
              </div></div>
            ${ticketed ? `<div class="field">${toggle('quickClaim', 'One-click claim for included tickets')}
              <p class="er-help" style="margin:6px 0 0 52px">Members whose tier includes a ticket see "Claim my … ticket" — one click registers them, then add-ons and guests are optional. Used for FUSE.</p></div>` : ''}
            <div class="field"><label>Who can register</label>${chips('tiers', ['All', ...R.TIERS])}</div>
            <div class="field-row">
              <div class="field"><label>Capacity <span class="er-dim">(incl. guests — blank = no limit)</span></label>${inp('capacity', 'No limit', 'number')}</div>
              <div class="field"><label>Registration closes <span class="er-dim">(optional)</span></label>${inp('closes', '', 'date')}</div>
            </div>
          </div>
        </div>

        <div class="card card-pad ${on ? '' : 'dim'}">
          <h3 class="ereg-h">Early-bird pricing</h3>
          ${toggle('earlyBird.on', 'Offer early-bird pricing')}
          ${draft.earlyBird.on ? `<div class="field" style="margin-top:14px"><label>Early-bird ends</label>${inp('earlyBird.until', '', 'date')}</div>
            <p class="er-help">Any ticket, add-on, or guest with an early-bird price uses it through this date.</p>` : '<p class="er-help" style="margin-top:8px">Turn on to set a deadline and early-bird prices.</p>'}
          <h3 class="ereg-h" style="margin-top:24px">Guests</h3>
          ${toggle('guests.on', 'Members can bring guests')}
          ${draft.guests.on ? `<div class="ereg-item-grid" style="margin-top:14px">
              <div class="field"><label>Max per member</label>${inp('guests.max', '1', 'number')}</div>
              <div class="field"><label>Guest price</label>${inp('guests.price', '0', 'number')}</div>
              <div class="field"><label>Early-bird</label>${inp('guests.ebPrice', 'optional', 'number', draft.earlyBird.on ? '' : 'disabled')}</div>
            </div>
            <div class="field"><label>Free guests included <span class="er-dim">(per member, by tier)</span></label>
              <div class="ereg-item-grid">${R.TIERS.map((tr) => `<div class="field" style="margin:0"><label class="er-dim" style="font-size:12px">${tr}</label>${inp('guests.included.' + tr, '0', 'number')}</div>`).join('')}</div>
              <p class="er-help">e.g. FUSE VIP members get 1 free guest; additional guests pay the guest price.</p></div>
            <p class="er-help">Guests give their name, email, and phone — which must be different from the member's.</p>` : ''}
        </div>
      </div>

      ${ticketed ? `<div class="card card-pad ${on ? '' : 'dim'}" style="margin-top:20px">
          <div class="section-title"><h2 style="font-size:16px">Ticket types</h2><button class="btn btn-outline btn-sm" data-add="tickets">+ Add ticket type</button></div>
          ${draft.tickets.length ? draft.tickets.map((t, k) => itemRow('tickets', t, k)).join('') : '<p class="er-help">No ticket types yet — add at least one.</p>'}
        </div>
        <div class="card card-pad ${on ? '' : 'dim'}" style="margin-top:20px">
          <div class="section-title"><h2 style="font-size:16px">Add-ons &amp; sessions</h2><button class="btn btn-outline btn-sm" data-add="addons">+ Add add-on</button></div>
          ${draft.addons.length ? draft.addons.map((a, k) => itemRow('addons', a, k)).join('') : '<p class="er-help">Optional extras members can pick — sessions, dinners, workshops. Price 0 for free sessions.</p>'}
        </div>` : ''}

      <div class="card card-pad ${on ? '' : 'dim'}" style="margin-top:20px">
        <div class="section-title"><h2 style="font-size:16px">Custom fields</h2><button class="btn btn-outline btn-sm" data-add="fields">+ Add field</button></div>
        <p class="er-help" style="margin:-6px 0 12px">Name, email, and phone are always collected from the member's profile.</p>
        ${draft.fields.length ? draft.fields.map(fieldRow).join('') : '<p class="er-help">No extra questions.</p>'}
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
        <button class="btn btn-outline" data-nav="events">Cancel</button>
        <button class="btn btn-primary" data-ereg-save>Save registration</button>
      </div>`;
  }

  function saveSetup() {
    const fix = (list, prefix) => list.forEach((x) => { if (!x.id) x.id = prefix + Math.random().toString(36).slice(2, 7); if (!x.tiers || !x.tiers.length) x.tiers = ['All']; });
    fix(draft.tickets, 't'); fix(draft.addons, 'a');
    draft.fields.forEach((f) => { if (!f.id) f.id = 'f' + Math.random().toString(36).slice(2, 7); });
    if (!draft.tiers.length) draft.tiers = ['All'];
    const problems = [];
    if (draft.enabled && draft.mode === 'ticketed' && !draft.tickets.length) problems.push('add at least one ticket type');
    if ([...draft.tickets, ...draft.addons].some((x) => !String(x.name || '').trim())) problems.push('every ticket and add-on needs a name');
    if (draft.fields.some((f) => !String(f.label || '').trim())) problems.push('every custom field needs a label');
    if (draft.earlyBird.on && !draft.earlyBird.until) problems.push('set the early-bird end date');
    if (draft.mode === 'ticketed' && draft.quickClaim && draft.fields.some((f) => f.required)) problems.push('one-click claim can’t have required questions — make them optional or turn off one-click claim');
    if (problems.length) { showToast('Before saving: ' + problems.join('; ') + '.'); return; }
    R.saveSetup(editTitle, draft);
    renderEvents();
    showToast(draft.enabled ? `Registration saved — members can ${draft.mode === 'rsvp' ? 'RSVP to' : 'register for'} ${editTitle}.` : `Registration turned off for ${editTitle}.`);
    draft = R.editable(editTitle); renderSetup();
  }

  const setupView = $('view-event-reg');
  setupView.addEventListener('input', (e) => {
    const t = e.target, k = t.dataset.k; if (!k || t.type === 'checkbox') return;
    if (t.tagName === 'SELECT') return;
    const v = t.dataset.t === 'num' ? (t.value === '' ? null : +t.value) : t.dataset.t === 'list' ? t.value.split(',').map((s) => s.trim()).filter(Boolean) : t.value;
    set(k, v);
  });
  setupView.addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'ereg-mode') { draft.mode = t.value; renderSetup(); return; }
    const k = t.dataset.k; if (!k) return;
    if (t.type === 'checkbox') { set(k, t.checked); if (['enabled', 'earlyBird.on', 'guests.on'].includes(k)) renderSetup(); return; }
    if (t.tagName === 'SELECT') { set(k, t.value); if (t.hasAttribute('data-rerender')) renderSetup(); }
  });
  setupView.addEventListener('click', (e) => {
    let m;
    if ((m = e.target.closest('[data-chip]'))) {
      e.preventDefault();
      const path = m.dataset.chip, val = m.dataset.val, isTiers = !path.endsWith('included');
      let cur = (get(path) || []).slice();
      if (val === 'All') cur = ['All'];
      else { cur = cur.filter((x) => x !== 'All'); cur = cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val]; if (isTiers && !cur.length) cur = ['All']; }
      set(path, cur); renderSetup(); return;
    }
    if ((m = e.target.closest('[data-add]'))) {
      e.preventDefault();
      const kind = m.dataset.add;
      draft[kind].push(kind === 'fields' ? { id: '', label: '', type: 'text', options: [], required: false, help: '' }
        : { id: '', name: '', desc: '', price: 0, ebPrice: null, tiers: ['All'], ...(kind === 'tickets' ? { included: [] } : {}) });
      renderSetup(); return;
    }
    if ((m = e.target.closest('[data-del]'))) { e.preventDefault(); const [kind, k] = m.dataset.del.split('.'); draft[kind].splice(+k, 1); renderSetup(); return; }
    if ((m = e.target.closest('[data-move]'))) {
      e.preventDefault(); const [p, d] = m.dataset.move.split(':'), k = +p.split('.')[1], j = k + +d;
      if (j < 0 || j >= draft.fields.length) return;
      [draft.fields[k], draft.fields[j]] = [draft.fields[j], draft.fields[k]]; renderSetup(); return;
    }
    if (e.target.closest('[data-ereg-save]')) { e.preventDefault(); saveSetup(); }
  });

  /* ============================================================
     2. Registrations dashboard
     ============================================================ */
  let dashEvent = 'FUSE 2026 — National Conference';
  const dashEvents = () => events.map((e) => e.title).filter((t) => R.setup(t) || R.regsFor(t).length);

  function bars(rows, total) {
    const max = Math.max(1, ...rows.map((r) => r.n));
    return rows.map((r) => `<div class="ereg-bar"><span class="eb-l">${esc(r.label)}</span><span class="eb-b"><i style="width:${(r.n / max * 100).toFixed(0)}%"></i></span><span class="eb-n">${r.n}</span>${r.extra != null ? `<span class="eb-x">${r.extra}</span>` : total ? `<span class="eb-x">${Math.round(r.n / total * 100)}%</span>` : ''}</div>`).join('');
  }

  function renderDash() {
    const sel = $('ereg-event');
    const list = dashEvents();
    if (!list.includes(dashEvent)) dashEvent = list[0];
    sel.innerHTML = list.map((t) => `<option ${t === dashEvent ? 'selected' : ''}>${esc(t)}</option>`).join('');
    const s = R.setup(dashEvent) || R.editable(dashEvent), ev = events.find((e) => e.title === dashEvent) || {};
    const regs = R.regsFor(dashEvent), ticketed = s.mode === 'ticketed';
    const guests = regs.reduce((n, r) => n + (r.guests || []).length, 0), attendees = regs.length + guests;
    const revenue = regs.reduce((n, r) => n + (r.total || 0), 0), ebCount = regs.filter((r) => r.earlyBird).length;
    const week = regs.filter((r) => R.TODAY - new Date(r.at) < 7 * 864e5).length;

    $('ereg-info').innerHTML = `${esc(ev.date || '')}${ev.type ? ' · ' + esc(ev.type) : ''} · ${s.enabled ? (ticketed ? 'Ticketed' : 'RSVP only') : '<span style="color:var(--red)">Registration off</span>'} · ${R.tierText(s.tiers)}${s.earlyBird && s.earlyBird.on ? ` · Early-bird until ${esc(R.fmtDate(s.earlyBird.until))}${R.isEarlyBird(s) ? '' : ' (ended)'}` : ''}${s.closes ? ` · Closes ${esc(R.fmtDate(s.closes))}` : ''}`;

    const tile = (cls, ico, val, lbl, sub) => `<div class="stat"><div class="s-ico ${cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${ico}</svg></div><div class="s-val">${val}</div><div class="s-lbl">${lbl}</div>${sub ? `<div class="t-sub" style="margin-top:4px">${sub}</div>` : ''}</div>`;
    $('ereg-stats').innerHTML =
      tile('i-pink', '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0116 0v1"/>', regs.length.toLocaleString(), ticketed ? 'Registrations' : 'RSVPs', `${week} in the last 7 days`) +
      tile('i-cyan', '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>', guests, 'Guests', s.guests && s.guests.on ? `Up to ${s.guests.max} per member` : 'Guests not allowed') +
      tile('i-navy', '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/>', attendees.toLocaleString(), 'Total attendees', s.capacity ? `${Math.round(attendees / s.capacity * 100)}% of ${s.capacity.toLocaleString()} capacity` : 'No capacity limit') +
      (ticketed ? tile('i-green', '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>', money(revenue), 'Revenue', `${regs.filter((r) => r.total).length} paid · ${regs.filter((r) => !r.total).length} included / free`)
        : tile('i-green', '<path d="M20 6L9 17l-5-5"/>', s.capacity ? Math.max(0, s.capacity - attendees) : '—', 'Spots left', s.closes ? `Closes ${esc(R.fmtDate(s.closes))}` : '')) +
      (ticketed ? tile('i-amber', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', ebCount, 'Early-bird', regs.length ? `${Math.round(ebCount / regs.length * 100)}% of registrations` : '')
        : tile('i-amber', '<path d="M4 6h16M4 12h16M4 18h10"/>', s.fields.length, 'Custom questions', s.fields.filter((f) => f.required).length + ' required'));

    // breakdowns
    const cards = [];
    cards.push(['By membership tier', bars(R.TIERS.map((t) => ({ label: t, n: regs.filter((r) => r.tier === t).length })), regs.length)]);
    if (ticketed) {
      cards.push(['Ticket types', bars(s.tickets.map((t) => { const rs = regs.filter((r) => r.ticket === t.id); return { label: t.name, n: rs.length, extra: (t.included || []).length ? `${rs.filter((r) => t.included.includes(r.tier)).length} included` : money(rs.length * R.unit(t, false)) }; }))]);
      if (s.addons.length) cards.push(['Add-ons & sessions', bars(s.addons.map((a) => {
        const g = regs.reduce((n, r) => n + (r.guests || []).filter((x) => (x.addons || []).includes(a.id)).length, 0);
        return { label: a.name, n: regs.filter((r) => (r.addons || []).includes(a.id)).length + g, extra: g ? `${g} guest${g > 1 ? 's' : ''}` : +a.price ? '' : 'free' };
      }), regs.length)]);
    }
    s.fields.filter((f) => f.type === 'select' || f.type === 'yesno').forEach((f) => {
      const opts = f.type === 'yesno' ? ['Yes', 'No'] : f.options;
      cards.push([f.label, bars(opts.map((o) => ({ label: o, n: regs.filter((r) => (r.answers || {})[f.id] === o).length })), regs.length)]);
    });
    $('ereg-breakdowns').innerHTML = cards.map(([h, b]) => `<div class="card card-pad"><h3 style="font-size:15px;margin-bottom:10px">${esc(h)}</h3>${b || '<p class="er-help">No data yet.</p>'}</div>`).join('');

    // filters
    const tk = $('ereg-ticket'), ad = $('ereg-addon');
    tk.hidden = !ticketed; ad.hidden = !s.addons.length;
    const keep = (el, html) => { const v = el.value; el.innerHTML = html; if ([...el.options].some((o) => o.value === v)) el.value = v; };
    keep(tk, '<option value="all">All ticket types</option>' + s.tickets.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join(''));
    keep(ad, '<option value="all">All add-ons</option>' + s.addons.map((a) => `<option value="${a.id}">${esc(a.name)}</option>`).join(''));
    renderTable();
  }

  function renderTable() {
    const s = R.setup(dashEvent) || R.editable(dashEvent), ticketed = s.mode === 'ticketed';
    const q = ($('ereg-q').value || '').toLowerCase(), tk = $('ereg-ticket').value, ad = $('ereg-addon').value, tr = $('ereg-tier').value;
    const all = R.regsFor(dashEvent);
    const rows = all.filter((r) => (!q || (r.name + ' ' + r.email).toLowerCase().includes(q)) && (tk === 'all' || r.ticket === tk) &&
      (ad === 'all' || (r.addons || []).includes(ad)) && (tr === 'all' || r.tier === tr)).sort((a, b) => (a.at < b.at ? 1 : -1));
    $('ereg-thead').innerHTML = `<tr><th>Member</th><th>Tier</th>${ticketed ? '<th>Ticket</th><th>Add-ons</th>' : ''}<th>Guests</th>${ticketed ? '<th>Paid</th>' : ''}<th>Registered</th><th class="t-right">Actions</th></tr>`;
    $('ereg-tbody').innerHTML = rows.length ? rows.map((r) => {
      const t = s.tickets.find((x) => x.id === r.ticket);
      const adds = (r.addons || []).map((id) => (s.addons.find((a) => a.id === id) || {}).name).filter(Boolean);
      return `<tr>
        <td><div class="t-id"><div class="t-avatar">${initials(r.name)}</div><div><div class="t-strong">${esc(r.name)}</div><div class="t-sub">${esc(r.email)}</div></div></div></td>
        <td>${tierBadge(r.tier)}</td>
        ${ticketed ? `<td>${t ? esc(t.name) + ((t.included || []).includes(r.tier) ? ' <span class="t-sub" style="display:inline">· included</span>' : '') : '—'}</td>
          <td>${adds.length ? adds.map((a) => `<span class="tag">${esc(a)}</span>`).join(' ') : '<span class="t-sub" style="display:inline">None</span>'}</td>` : ''}
        <td>${(r.guests || []).length ? `<span title="${esc(r.guests.map((g) => `${g.name} · ${g.email || ''}`).join('\n'))}">${r.guests.length}${R.freeGuests(s, r.tier) ? ` <span class="t-sub" style="display:inline">(${Math.min(R.freeGuests(s, r.tier), r.guests.length)} incl.)</span>` : ''}</span>` : '—'}</td>
        ${ticketed ? `<td>${r.total ? money(r.total) : '<span class="t-sub" style="display:inline">$0</span>'}${r.earlyBird ? ' <span class="badge badge-amber" style="margin-left:4px">EB</span>' : ''}</td>` : ''}
        <td>${new Date(r.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
        <td class="t-right"><div class="row-actions"><button class="link-act" data-reg-view="${r.id}">View</button></div></td>
      </tr>`;
    }).join('') : `<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:28px">${all.length ? 'No registrations match these filters.' : 'No registrations yet.'}</td></tr>`;
    $('ereg-count').textContent = `${rows.length} of ${all.length} registration${all.length === 1 ? '' : 's'}`;
  }

  function viewReg(id) {
    const r = R.regsFor(dashEvent).find((x) => x.id === id), s = R.setup(dashEvent) || R.editable(dashEvent); if (!r) return;
    const t = s.tickets.find((x) => x.id === r.ticket);
    const kv = (k, v) => `<div class="kv"><div class="k">${esc(k)}</div><div class="v">${v}</div></div>`;
    const p = R.priceOf(s, r, r.earlyBird);
    $('reg-detail-title').textContent = r.name;
    $('reg-detail-sub').textContent = `${dashEvent} · ${r.id}`;
    $('reg-detail-body').innerHTML =
      kv('Email', esc(r.email)) + kv('Phone', esc(r.phone || '—')) + kv('Tier', tierBadge(r.tier)) +
      (s.mode === 'ticketed' ? kv('Ticket', t ? esc(t.name) : '—') + kv('Add-ons', (r.addons || []).map((id) => esc((s.addons.find((a) => a.id === id) || {}).name || id)).join(', ') || 'None') : kv('Type', 'RSVP')) +
      kv('Guests', (r.guests || []).length ? r.guests.map((g, k) => `<div style="margin-bottom:6px"><strong>${esc(g.name)}</strong>${k < R.freeGuests(s, r.tier) ? ' <span class="badge badge-green">Included</span>' : ''}<br><span class="t-sub" style="display:inline">${esc(g.email || '—')} · ${esc(g.phone || '—')} · ${esc(g.gender || '—')}${(g.addons || []).length ? ' · ' + g.addons.map((id) => esc((s.addons.find((a) => a.id === id) || {}).name || id)).join(', ') : ''}</span></div>`).join('') : 'None') +
      s.fields.map((f) => { const v = (r.answers || {})[f.id]; return kv(f.type === 'checkbox' ? (f.label.length > 40 ? 'Marketing consent' : f.label) : f.label, f.type === 'checkbox' ? (v ? 'Yes' : 'No') : v ? esc(v) : '—'); }).join('') +
      (s.mode === 'ticketed' ? kv('Paid', `${money(r.total)}${r.earlyBird ? ' · early-bird' : ''}`) + `<div class="er-help" style="margin-top:8px">${p.lines.map((l) => `${esc(l.label)}: ${l.amount ? money(l.amount) : 'free'}${l.note ? ' (' + esc(l.note) + ')' : ''}`).join(' · ')}</div>` : '') +
      kv('Registered', new Date(r.at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }));
    openModal('reg-detail');
  }

  ['ereg-q', 'ereg-ticket', 'ereg-addon', 'ereg-tier'].forEach((id) => $(id)?.addEventListener(id === 'ereg-q' ? 'input' : 'change', renderTable));
  $('ereg-event')?.addEventListener('change', (e) => { dashEvent = e.target.value; ['ereg-ticket', 'ereg-addon', 'ereg-tier'].forEach((id) => { if ($(id)) $(id).value = 'all'; }); $('ereg-q').value = ''; renderDash(); });
  document.addEventListener('click', (e) => {
    let m;
    if ((m = e.target.closest('[data-ereg]'))) { e.preventDefault(); openSetup(events[+m.dataset.ereg].title); return; }
    if (e.target.closest('[data-ereg-settings]')) { e.preventDefault(); openSetup(dashEvent); return; }
    if ((m = e.target.closest('[data-reg-view]'))) { e.preventDefault(); viewReg(m.dataset.regView); return; }
    if (e.target.closest('[data-ereg-export]')) { e.preventDefault(); showToast(`Exported ${$('ereg-count').textContent} for ${dashEvent} to CSV — includes ticket, add-ons, guests, and every custom field.`); }
  });
  R.onChange(() => { renderDash(); renderEvents(); });
  renderDash();

  window.AmpAdminEventReg = { openSetup, openDashboard: (t) => { if (t) dashEvent = t; renderDash(); navigate('registrations'); } };
})();
