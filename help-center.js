/* ============================================================
   AMP Member Portal — Help Center (knowledge base)
   ------------------------------------------------------------
   • Help home: search, topics, popular articles, replay the
     walkthrough, contact support
   • Topic lists and article pages with "Try it now" buttons,
     "Was this helpful?", and related articles
   • The ? menu in the top bar (Help Center / walkthrough /
     support / report a bug)
   Content: help-articles.js (shared with admin). Searches with no
   results are remembered (localStorage) so admin can see gaps.
   Deep links: index.html#help, index.html#article=<slug>
   Uses app.js globals: navigate, showToast, backArrow.
   ============================================================ */
(function () {
  const CATS = window.HELP_CATEGORIES, ALL = window.HELP_ARTICLES;
  if (!CATS || !ALL) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`;
  // Members and lender/vendor partners see different guides (article.audience: member | partner | all)
  const AUDIENCE = window.AMP_USER_TYPE && window.AMP_USER_TYPE !== 'member' ? 'partner' : 'member';
  const live = () => ALL.filter((a) => a.status === 'Published' && [AUDIENCE, 'all'].includes(a.audience || 'member'));
  const firstName = () => (window.AMP_PARTNER_USER && window.AMP_PARTNER_USER.first) || 'Kyle';
  const bySlug = (s) => live().find((a) => a.slug === s);

  let cat = null, query = '', current = null;   // current = slug of the open article

  /* ---------- per-viewer storage (votes, unanswered searches) ---------- */
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
  };

  /* ---------- search ---------- */
  function search(q) {
    const STOP = ['the', 'a', 'an', 'to', 'how', 'do', 'does', 'i', 'my', 'me', 'can', 'is', 'of', 'for', 'and', 'or', 'in', 'on', 'with', 'not', 'what', 'where', 'it'];
    const words = q.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1 && !STOP.includes(w));
    if (!words.length) return [];
    const scored = live().map((a) => {
      const title = a.title.toLowerCase(), tags = a.tags.join(' ').toLowerCase(), sum = a.summary.toLowerCase(),
        body = a.body.replace(/<[^>]+>/g, ' ').toLowerCase();
      let score = 0;
      words.forEach((w) => { score += (title.includes(w) ? 4 : 0) + (tags.includes(w) ? 3 : 0) + (sum.includes(w) ? 2 : 0) + (body.includes(w) ? 1 : 0); });
      return { a, score };
    }).filter((x) => x.score > 0).sort((x, y) => y.score - x.score);
    // Drop weak matches (e.g. a common word buried in a body) relative to the best hit.
    const top = scored.length ? scored[0].score : 0;
    return scored.filter((x) => x.score >= top * 0.4).map((x) => x.a);
  }
  let logTimer;
  function logMiss(q) {
    clearTimeout(logTimer);
    logTimer = setTimeout(() => {
      const list = store.get('amp-kb-misses', []);
      list.unshift({ q, at: new Date().toISOString() });
      store.set('amp-kb-misses', list.slice(0, 50));
    }, 1200);
  }

  /* ---------- pieces ---------- */
  const row = (a) => `<button class="kb-row" data-help-article="${a.slug}">
      <span class="kb-row-ico">${svg(CATS[a.category].ico)}</span>
      <span class="kb-row-main"><span class="kb-row-t">${esc(a.title)}</span><span class="kb-row-s">${esc(a.summary)}</span></span>
      <span class="kb-row-meta">${CATS[a.category].name}</span>
      <svg class="kb-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>`;

  const sideCards = () => `
    <div class="card card-pad kb-side-tour">
      <div class="kb-side-ico">${svg('<path d="M12 2a10 10 0 100 20 10 10 0 000-20zM16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z"/>')}</div>
      <h3>New here?</h3><p>Take the two-minute walkthrough of the portal.</p>
      <button class="btn btn-navy btn-sm btn-block" data-tour-start>Start the walkthrough</button>
    </div>
    <div class="card card-pad" style="margin-top:20px">
      <h3 style="font-size:15px;margin-bottom:6px">Still need help?</h3>
      <p style="color:var(--ink-soft);font-size:13.5px;margin:0 0 14px">Open a ticket — our team replies right here in the portal, usually within one business day.</p>
      <button class="btn btn-primary btn-sm btn-block" data-nav="support">Contact support</button>
      <button class="btn btn-outline btn-sm btn-block" style="margin-top:8px" data-nav="requests">View my requests</button>
    </div>`;

  /* ---------- help home ---------- */
  function renderHome() {
    const box = $('help-body'); if (!box) return;
    const hero = `
      <div class="kb-hero">
        <h1>How can we help, ${esc(firstName())}?</h1>
        <p>Search guides for escalations, lenders, billing, FUSE, and more.</p>
        <div class="kb-search">${svg('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>')}
          <input type="search" id="kb-q" placeholder="e.g. escalate a loan, FUSE ticket, change my AE" value="${esc(query)}" autocomplete="off" aria-label="Search the Help Center"></div>
        <div class="kb-suggest">Popular: ${['escalate', 'follow up', 'FUSE ticket', 'change AE', 'upgrade plan'].map((s) => `<button data-kb-q="${s}">${s}</button>`).join('')}</div>
      </div>`;

    let main;
    if (query.trim()) {
      const res = search(query);
      if (!res.length) logMiss(query.trim());
      main = `<div class="section-title"><h2>${res.length} result${res.length === 1 ? '' : 's'} for “${esc(query)}”</h2><a href="#" data-kb-clear>Clear search</a></div>
        ${res.length ? `<div class="card kb-list">${res.map(row).join('')}</div>` : `
        <div class="card"><div class="empty"><div class="e-ico">${svg('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>')}</div>
          <h4>No guides match that yet</h4><p>Try different words, or ask our team — we'll answer and use your question to add a guide.</p>
          <button class="btn btn-primary btn-sm" style="margin-top:14px" data-kb-ask>Ask support about “${esc(query)}”</button></div></div>`}`;
    } else if (cat) {
      const list = live().filter((a) => a.category === cat);
      main = `<a class="back-link" href="#" data-kb-cat="">${backArrow} All topics</a>
        <div class="section-title"><h2>${CATS[cat].name}</h2><span class="count-note">${list.length} guide${list.length === 1 ? '' : 's'}</span></div>
        <div class="card kb-list">${list.map(row).join('')}</div>`;
    } else {
      main = `<div class="section-title"><h2>Browse by topic</h2></div>
        <div class="kb-cats">${Object.entries(CATS).map(([k, c]) => {
          const n = live().filter((a) => a.category === k).length;
          if (!n) return '';
          return `<button class="kb-cat" data-kb-cat="${k}"><span class="kb-cat-ico">${svg(c.ico)}</span>
            <span class="kb-cat-t">${c.name}</span><span class="kb-cat-s">${c.desc}</span><span class="kb-cat-n">${n} guide${n === 1 ? '' : 's'}</span></button>`;
        }).join('')}</div>
        <div class="section-title" style="margin-top:28px"><h2>Popular guides</h2></div>
        <div class="card kb-list">${live().filter((a) => a.popular || (AUDIENCE === 'partner' && a.audience === 'partner')).map(row).join('')}</div>`;
    }

    box.innerHTML = hero + `<div class="grid rq-detail-grid kb-grid" style="grid-template-columns:1fr 300px;align-items:start;margin-top:24px">
      <div>${main}</div><div>${sideCards()}</div></div>`;
  }

  /* ---------- article ---------- */
  function renderArticle(a) {
    current = a.slug;
    const votes = store.get('amp-kb-votes', {}), voted = votes[a.slug];
    const related = live().filter((x) => x.category === a.category && x.slug !== a.slug).slice(0, 3);
    $('help-article-body').innerHTML = `
      <a class="back-link" href="#" data-nav="help">${backArrow} Help Center</a>
      <div class="grid rq-detail-grid kb-grid" style="grid-template-columns:1fr 300px;align-items:start">
        <div class="card card-pad kb-article">
          <div class="kb-crumb"><a href="#" data-kb-cat="${a.category}">${CATS[a.category].name}</a></div>
          <h1>${esc(a.title)}</h1>
          <div class="kb-meta">${a.minutes} min read · Updated ${a.updated}</div>
          <div class="kb-body">${a.body}</div>
          ${a.actions.length ? `<div class="kb-try"><span>Try it now</span>${a.actions.map((x) => `<button class="btn btn-primary btn-sm" ${x.attr}>${esc(x.label)}</button>`).join('')}</div>` : ''}
          <div class="kb-vote" id="kb-vote">
            ${voted ? (voted === 'yes'
              ? '<span>Thanks for the feedback! 🙌</span>'
              : `<span>Sorry this didn't help.</span> <button class="link-pink" data-kb-ask-article="${a.slug}">Tell our team what was missing →</button>`)
            : `<span>Was this helpful?</span><button class="btn btn-outline btn-sm" data-kb-vote="yes">👍 Yes</button><button class="btn btn-outline btn-sm" data-kb-vote="no">👎 No</button>`}
          </div>
        </div>
        <div>
          ${related.length ? `<div class="card card-pad"><h3 style="font-size:15px;margin-bottom:6px">Related guides</h3>
            ${related.map((r) => `<button class="kb-rel" data-help-article="${r.slug}">${esc(r.title)}</button>`).join('')}</div>` : ''}
          <div style="margin-top:${related.length ? 20 : 0}px">${sideCards()}</div>
        </div>
      </div>`;
  }

  function openArticle(slug) {
    const a = bySlug(slug); if (!a) return;
    renderArticle(a);
    navigate('help-article');
  }

  // Pre-fill a support ticket from the Help Center
  function askSupport(subject) {
    navigate('support');
    const s = $('tk-subject'), m = $('tk-message');
    if (s) s.value = subject;
    if (m) { m.focus(); }
  }

  /* ---------- ? menu in the top bar ---------- */
  function toggleHelpMenu(open) {
    const p = $('help-menu'); if (!p) return;
    const show = open === undefined ? !p.classList.contains('open') : open;
    p.classList.toggle('open', show);
    $('help-btn').setAttribute('aria-expanded', show);
  }

  /* ---------- events ---------- */
  document.addEventListener('click', (e) => {
    let m;
    if (e.target.closest('#help-btn')) { e.preventDefault(); toggleHelpMenu(); return; }
    if (!e.target.closest('.help-wrap')) toggleHelpMenu(false);
    else if (e.target.closest('#help-menu [data-nav],#help-menu [data-modal],#help-menu [data-tour-start]')) toggleHelpMenu(false);
    if ((m = e.target.closest('[data-help-article]'))) { e.preventDefault(); openArticle(m.dataset.helpArticle); return; }
    if ((m = e.target.closest('[data-kb-cat]'))) { e.preventDefault(); cat = m.dataset.kbCat || null; query = ''; renderHome(); navigate('help'); return; }
    if ((m = e.target.closest('[data-kb-q]'))) { e.preventDefault(); query = m.dataset.kbQ; renderHome(); $('kb-q').focus(); return; }
    if (e.target.closest('[data-kb-clear]')) { e.preventDefault(); query = ''; renderHome(); return; }
    if (e.target.closest('[data-kb-ask]')) { e.preventDefault(); askSupport(query.trim()); return; }
    if ((m = e.target.closest('[data-kb-ask-article]'))) { e.preventDefault(); askSupport(`Help guide didn't answer: ${bySlug(m.dataset.kbAskArticle).title}`); return; }
    if ((m = e.target.closest('[data-kb-vote]'))) {
      e.preventDefault();
      const votes = store.get('amp-kb-votes', {}); votes[current] = m.dataset.kbVote; store.set('amp-kb-votes', votes);
      renderArticle(bySlug(current));
      if (m.dataset.kbVote === 'yes') showToast('Thanks — glad it helped!');
      return;
    }
    // Opening Help from the sidebar / menu always lands on the home view
    if ((m = e.target.closest('[data-nav="help"]')) && !e.target.closest('#view-help')) { cat = null; query = ''; renderHome(); }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id !== 'kb-q') return;
    query = e.target.value;
    const pos = e.target.selectionStart;
    renderHome();
    const q = $('kb-q'); q.focus(); q.setSelectionRange(pos, pos);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleHelpMenu(false); });

  renderHome();
  const h = (location.hash || '').replace('#', '');
  if (h.startsWith('article=') && bySlug(h.slice(8))) openArticle(h.slice(8));
})();
