/* ============================================================
   AMP — install as an app + push notifications (member app)
   ------------------------------------------------------------
   1. Registers sw.js (needs https or localhost — opening the
      prototype straight from a file skips it quietly).
   2. Install banner: a small card offering "Get the AMP app".
      - Chrome / Edge / Android: Install opens the browser's own
        install prompt.
      - iPhone / iPad (Safari) and others: "How to install" shows
        the steps (Share → Add to Home Screen, etc.).
      - ✕ or "Not now" closes it for good on this device
        (localStorage amp-install-v1). It never shows inside the
        installed app or while a walkthrough is open, and the app
        can still be installed from Settings → Notifications & app.
   3. Inside the installed app, a one-time "Turn on notifications?"
      card (same dismiss rules).
   4. Settings → Notifications & app: install status, push on / off
      for this device, what to be notified about, and a test
      notification. iPhone only allows push for apps added to the
      Home Screen (iOS 16.4+), so Safari tabs get that explained.
   Prototype: no push server — turning push on stores the choice
   and shows notifications locally through the service worker.
   Uses app.js globals: setTab, openModal, closeModals, showToast.
   ============================================================ */
(function () {
  const $ = (id) => document.getElementById(id);
  const KEY_INSTALL = 'amp-install-v1', KEY_PUSH = 'amp-push-v1';
  const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } };
  const write = (k, o) => { try { localStorage.setItem(k, JSON.stringify(Object.assign(read(k), o))); } catch (e) { /* private mode */ } };
  const partner = window.AMP_USER_TYPE && window.AMP_USER_TYPE !== 'member';

  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const pushSupported = () => 'Notification' in window && 'serviceWorker' in navigator;

  /* ---------- service worker ---------- */
  let swReg = null;
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('sw.js').then((r) => { swReg = r; }).catch(() => { /* prototype: fine without it */ });
  }
  async function notify(title, body, url) {
    try {
      const reg = swReg || (navigator.serviceWorker && await navigator.serviceWorker.getRegistration());
      if (reg) { await reg.showNotification(title, { body, icon: 'assets/icons/icon-192.png', badge: 'assets/icons/icon-192.png', data: { url: url || './index.html' } }); return true; }
      if ('Notification' in window && Notification.permission === 'granted') { new Notification(title, { body, icon: 'assets/icons/icon-192.png' }); return true; }
    } catch (e) { /* not available here */ }
    return false;
  }

  /* ---------- install ---------- */
  let deferred = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; renderSettings(); });
  window.addEventListener('appinstalled', () => { write(KEY_INSTALL, { installed: true }); hideBanner(); renderSettings(); showToast('AMP is installed — find it on your home screen.'); });

  function howToSteps() {
    if (isIOS) return { title: 'Add AMP to your Home Screen', steps: [
      'In Safari, tap the <strong>Share</strong> button <span class="pwa-ico">⬆︎</span> at the bottom of the screen.',
      'Scroll down and tap <strong>Add to Home Screen</strong>.',
      'Tap <strong>Add</strong>. AMP opens from your Home Screen like any other app.',
    ], note: 'On iPhone, notifications only work once AMP is on your Home Screen.' };
    if (isAndroid) return { title: 'Install the AMP app', steps: [
      'In Chrome, tap the menu <strong>⋮</strong> at the top right.',
      'Tap <strong>Install app</strong> (or <strong>Add to Home screen</strong>).',
      'Tap <strong>Install</strong>.',
    ] };
    return { title: 'Install AMP on this computer', steps: [
      '<strong>Chrome or Edge:</strong> click the install icon <span class="pwa-ico">⊕</span> at the right of the address bar, then <strong>Install</strong>.',
      '<strong>Safari (Mac):</strong> choose <strong>File → Add to Dock</strong>.',
      'AMP then opens in its own window, and can send you notifications.',
    ] };
  }
  async function install() {
    if (deferred) {
      deferred.prompt();
      const choice = await deferred.userChoice.catch(() => ({}));
      deferred = null;
      if (choice.outcome === 'accepted') { write(KEY_INSTALL, { installed: true }); hideBanner(); }
      renderSettings();
      return;
    }
    const h = howToSteps();
    $('pwa-how-title').textContent = h.title;
    $('pwa-how-body').innerHTML = `<ol class="pwa-steps">${h.steps.map((s) => `<li>${s}</li>`).join('')}</ol>${h.note ? `<p class="pwa-note">${h.note}</p>` : ''}`;
    hideBanner(); write(KEY_INSTALL, { dismissed: true });   // they've seen how — don't offer the banner again
    openModal('pwa-how');
  }

  /* ---------- banner (install, then push inside the app) ---------- */
  let banner = null;
  function hideBanner() { if (banner) { banner.remove(); banner = null; } }
  function showBanner(kind) {
    if (banner || document.body.classList.contains('wt-open')) return;
    banner = document.createElement('div');
    banner.className = 'pwa-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', kind === 'install' ? 'Get the AMP app' : 'Turn on notifications');
    banner.innerHTML = kind === 'install'
      ? `<img src="assets/icons/icon-192.png" alt="" class="pwa-app-ico">
         <div class="pwa-b-text"><strong>Get the AMP app</strong><span>${partner ? 'One tap to your dashboard, with notifications when members send requests.' : 'One tap to AMP from your home screen, with notifications when lenders and our team reply.'}</span></div>
         <div class="pwa-b-actions"><button class="btn btn-primary btn-sm" data-pwa="install">${deferred ? 'Install' : 'How to install'}</button><button class="btn btn-outline btn-sm" data-pwa="later" data-kind="install">Not now</button></div>
         <button class="pwa-x" data-pwa="later" data-kind="install" aria-label="Close">✕</button>`
      : `<div class="pwa-app-ico pwa-bell">🔔</div>
         <div class="pwa-b-text"><strong>Turn on notifications?</strong><span>${partner ? 'Get a notification when members send your company a request.' : 'Get a notification when a lender replies or your request is updated.'}</span></div>
         <div class="pwa-b-actions"><button class="btn btn-primary btn-sm" data-pwa="push-on">Turn on</button><button class="btn btn-outline btn-sm" data-pwa="later" data-kind="push">Not now</button></div>
         <button class="pwa-x" data-pwa="later" data-kind="push" aria-label="Close">✕</button>`;
    document.body.appendChild(banner);
  }
  function maybeBanner() {
    if (document.body.classList.contains('wt-open')) { setTimeout(maybeBanner, 1500); return; }   // never on top of a walkthrough
    if (standalone()) {
      const p = read(KEY_PUSH);
      if (pushSupported() && !p.on && !p.dismissed && Notification.permission !== 'denied') showBanner('push');
      return;
    }
    const s = read(KEY_INSTALL);
    if (!s.dismissed && !s.installed) showBanner('install');
  }
  setTimeout(maybeBanner, 2500);

  /* ---------- push ---------- */
  const TOPICS = partner
    ? [['requests', 'New requests for my company'], ['followups', 'Member follow-ups'], ['announcements', 'Announcements from AIME']]
    : [['requests', 'Replies and status changes on my requests'], ['lender', 'Lender replies to my escalations'], ['events', 'Event reminders'], ['announcements', 'Announcements from AIME']];
  function pushState() {
    if (!pushSupported()) return isIOS && !standalone() ? 'ios-browser' : 'unsupported';
    if (isIOS && !standalone()) return 'ios-browser';
    if (Notification.permission === 'denied') return 'blocked';
    return read(KEY_PUSH).on && Notification.permission === 'granted' ? 'on' : 'off';
  }
  async function pushOn() {
    hideBanner();
    if (pushState() === 'ios-browser') { install(); return; }
    if (!pushSupported()) { showToast("This browser can't show notifications."); return; }
    let perm = Notification.permission;
    if (perm === 'default') perm = await Notification.requestPermission();
    if (perm !== 'granted') { write(KEY_PUSH, { on: false, dismissed: true }); renderSettings(); showToast('Notifications are blocked. You can allow them in your browser settings.'); return; }
    // Production: pushManager.subscribe({ userVisibleOnly: true, applicationServerKey }) and save the subscription for this member.
    const p = read(KEY_PUSH);
    write(KEY_PUSH, { on: true, dismissed: true, topics: p.topics || TOPICS.map((t) => t[0]) });
    renderSettings();
    await notify('Notifications are on', partner ? "We'll let you know when members send your company a request." : "We'll let you know when a lender or our team replies.");
    showToast('Push notifications are on for this device.');
  }
  function pushOff() { write(KEY_PUSH, { on: false }); renderSettings(); showToast('Push notifications are off for this device.'); }

  /* ---------- Settings → Notifications & app ---------- */
  function addSettingsTab() {
    const tabs = $('settings-tabs'); if (!tabs || $('tab-notifications')) return;
    tabs.insertAdjacentHTML('beforeend', '<button class="tab" data-tab="notifications">Notifications &amp; app</button>');
    const last = [...document.querySelectorAll('#view-settings .tab-panel')].pop();
    (last || tabs).insertAdjacentHTML('afterend', '<div class="tab-panel" id="tab-notifications" style="display:none"></div>');
    const orig = window.setTab;
    window.setTab = function (tab) { orig(tab); $('tab-notifications').style.display = tab === 'notifications' ? 'block' : 'none'; if (tab === 'notifications') renderSettings(); };
  }
  function renderSettings() {
    const box = $('tab-notifications'); if (!box) return;
    const installed = standalone() || read(KEY_INSTALL).installed;
    const st = pushState(), topics = read(KEY_PUSH).topics || TOPICS.map((t) => t[0]);
    const pushLine = {
      on: '<span class="pwa-pill on">On</span> Notifications are on for this device.',
      off: '<span class="pwa-pill">Off</span> Get a notification on this device even when AMP is closed.',
      blocked: '<span class="pwa-pill bad">Blocked</span> Notifications are blocked for AMP. Allow them in your browser or phone settings, then come back here.',
      'ios-browser': '<span class="pwa-pill">Needs the app</span> On iPhone and iPad, notifications only work once AMP is added to your Home Screen.',
      unsupported: "<span class=\"pwa-pill\">Not available</span> This browser can't show notifications.",
    }[st];
    box.innerHTML = `
      <div class="card card-pad" style="max-width:560px">
        <div class="form-section-label" style="margin-top:0">The AMP app</div>
        <div class="pwa-row"><img src="assets/icons/icon-192.png" alt="" class="pwa-app-ico">
          <div class="pwa-row-text"><strong>${installed ? 'AMP is installed on this device' : 'Install AMP on this device'}</strong>
            <p class="pwa-sub">${installed ? 'Open it from your home screen or dock.' : 'Open AMP in one tap, in its own window, with notifications.'}</p></div>
          ${installed ? '' : `<button class="btn btn-outline btn-sm" data-pwa="install">${deferred ? 'Install' : 'How to install'}</button>`}</div>
        <div class="form-section-label">Push notifications</div>
        <p class="pwa-sub" style="margin-bottom:12px">${pushLine}</p>
        ${st === 'on' ? `<div class="pwa-topics">${TOPICS.map(([k, l]) => `<label class="pwa-check"><input type="checkbox" data-pwa-topic="${k}" ${topics.includes(k) ? 'checked' : ''}> ${l}</label>`).join('')}</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><button class="btn btn-outline btn-sm" data-pwa="test">Send a test notification</button><button class="btn btn-outline btn-sm" data-pwa="push-off">Turn off</button></div>`
        : st === 'off' ? '<button class="btn btn-primary btn-sm" data-pwa="push-on">Turn on notifications</button>'
        : st === 'ios-browser' ? '<button class="btn btn-primary btn-sm" data-pwa="install">How to add AMP to your Home Screen</button>' : ''}
        <p class="pwa-sub" style="margin-top:16px">The bell in the top bar still shows everything, whether push is on or off.</p>
      </div>`;
  }

  /* ---------- how-to modal ---------- */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="modal-pwa-how"><div class="modal" style="max-width:460px">
      <div class="modal-head"><div><h2 id="pwa-how-title">Install AMP</h2></div>
        <button class="modal-close" data-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>
      <div class="modal-body" id="pwa-how-body"></div>
      <div class="modal-foot"><button class="btn btn-primary" data-close>Got it</button></div>
    </div></div>`);

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pwa]'); if (!b) return;
    e.preventDefault();
    const a = b.dataset.pwa;
    if (a === 'install') install();
    else if (a === 'later') { write(b.dataset.kind === 'push' ? KEY_PUSH : KEY_INSTALL, { dismissed: true, at: new Date().toISOString() }); hideBanner(); showToast(b.dataset.kind === 'push' ? 'You can turn on notifications any time in Settings.' : 'You can install the app any time from Settings → Notifications & app.'); }
    else if (a === 'push-on') pushOn();
    else if (a === 'push-off') pushOff();
    else if (a === 'test') notify('Test notification', partner ? 'A member sent United Wholesale Mortgage a connection request.' : 'United Wholesale Mortgage replied to your escalation ESC-1042.', './index.html#requests').then((ok) => showToast(ok ? 'Test notification sent.' : "Couldn't show a notification here."));
  });
  document.addEventListener('change', (e) => {
    const k = e.target.dataset && e.target.dataset.pwaTopic; if (!k) return;
    const topics = new Set(read(KEY_PUSH).topics || TOPICS.map((t) => t[0]));
    e.target.checked ? topics.add(k) : topics.delete(k);
    write(KEY_PUSH, { topics: [...topics] });
  });

  addSettingsTab();
  window.AmpPWA = { install, pushOn, pushOff, state: pushState, showBanner, reset() { localStorage.removeItem(KEY_INSTALL); localStorage.removeItem(KEY_PUSH); } };
})();
