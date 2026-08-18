const VERSION = '0.7.3';
const CACHE = `ls-connect-v${VERSION}`;
const SHELL = ['./', './index.html', './styles.css', './app.js', './v04.js', './v05.js', './v06.js',
  './v07.js', './v071.js', './v072.js', './v073.js', './config.js', './manifest.webmanifest',
  './version.json', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('ls-connect-v') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/__lsconnect/')) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(event.request, { cache: 'no-store' });
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
      }
      return response;
    } catch {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') return caches.match('./index.html');
      throw new Error('Offline und Ressource nicht im Cache.');
    }
  })());
});
self.addEventListener('message', event => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') { self.skipWaiting(); return; }
  if (data.type === 'GET_VERSION') { event.source?.postMessage?.({ type: 'LS_CONNECT_VERSION', version: VERSION }); return; }
  if (data.type === 'SHOW_NOTIFICATION') {
    event.waitUntil(self.registration.showNotification(data.title || 'LS Connect', {
      body: data.body || 'Neue Aktivität', icon: './icon-192.png', badge: './icon-192.png',
      tag: data.tag || 'ls-connect', data: data.data || {}
    }));
  }
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
    const existing = windows[0];
    if (existing) return existing.focus();
    return clients.openWindow('./');
  }));
});
