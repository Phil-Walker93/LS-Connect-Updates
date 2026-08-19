const VERSION = '0.7.10.4';
const CACHE = `ls-connect-v${VERSION}`;
const SHELL = [
  './','./index.html','./styles.css','./app.js','./v04.js','./v05.js','./v06.js',
  './v07.js','./v071.js','./v072.js','./v074.js','./v075.js','./v076a.js','./v076b.js','./v076call.js',
  './v076ticket-user.js','./v076ticket-admin.js','./v076order.js','./v076d.js','./v0765.js',
  './v077-calls.js','./v077-media.js','./v077-core.js','./v0773.js','./v0773-core.js',
  './v0775.js','./v0775-core.js','./v078.js','./v0781.js','./v079.js','./v0791.js','./v0795.js','./v0710.js','./v07101.js','./v07102.js','./v07103.js','./v07104.js',
  './config.js','./manifest.webmanifest','./version.json','./icon.svg','./icon-192.png','./icon-512.png'
];
self.addEventListener('install',event=>{event.waitUntil((async()=>{await caches.open(CACHE).then(cache=>cache.addAll(SHELL));await self.skipWaiting();})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('ls-connect-v')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim();})());});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;if(url.pathname.startsWith('/__lsconnect/'))return;event.respondWith((async()=>{try{const response=await fetch(event.request,{cache:'no-store'});if(response&&response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response;}catch{const cached=await caches.match(event.request);if(cached)return cached;if(event.request.mode==='navigate')return caches.match('./index.html');throw new Error('Offline und Ressource nicht im Cache.');}})());});
self.addEventListener('message',event=>{const data=event.data||{};if(data.type==='SKIP_WAITING'){self.skipWaiting();return;}if(data.type==='GET_VERSION'){event.source?.postMessage?.({type:'LS_CONNECT_VERSION',version:VERSION});return;}if(data.type==='SHOW_NOTIFICATION'){event.waitUntil(self.registration.showNotification(data.title||'LS Connect',{body:data.body||'Neue Aktivität',icon:'./icon-192.png',badge:'./icon-192.png',tag:data.tag||'ls-connect',data:data.data||{}}));}});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(windows=>{const existing=windows[0];if(existing)return existing.focus();return clients.openWindow('./');}));});
