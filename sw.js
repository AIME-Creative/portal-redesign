/* ============================================================
   AMP — service worker (installable app + push notifications)
   ------------------------------------------------------------
   - Network first, cache as fallback: always the latest portal
     when online, and the last-seen pages when offline.
   - push: shows the notification the server sends
     ({ title, body, url, tag }).
   - notificationclick: opens / focuses AMP at the item's page.
   - message { type: 'show-notification', ... }: lets the page
     show a notification itself (prototype test notifications).
   Registered by pwa.js. Bump CACHE when the shell changes.
   ============================================================ */
const CACHE = 'amp-shell-v1';
const SHELL = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest',
  './assets/AMP-Logo.png', './assets/icons/icon-192.png', './assets/icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))));
});

const ICON = './assets/icons/icon-192.png';
function show(d) {
  return self.registration.showNotification(d.title || 'AMP', {
    body: d.body || '', icon: ICON, badge: ICON, tag: d.tag, renotify: !!d.tag,
    data: { url: d.url || './index.html' },
  });
}
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(show(d));
});
self.addEventListener('message', (e) => { if (e.data && e.data.type === 'show-notification') e.waitUntil(show(e.data)); });

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL(e.notification.data && e.notification.data.url || './index.html', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
    const w = wins.find((c) => c.url.startsWith(self.registration.scope));
    if (w) { w.navigate(url); return w.focus(); }
    return self.clients.openWindow(url);
  }));
});
