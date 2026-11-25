// ABPS service worker – नेहमी आधी इंटरनेटवरून नवीन आवृत्ती; इंटरनेट नसेल तरच जुनी (ऑफलाइन) चालते.
const CACHE = 'abps-2026-11-25-e';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if(r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;   // Apps Script (सर्व्हर) कधीही cache होत नाही
  e.respondWith(fetch(r, {cache:'no-store'}).then(res => {
    if(res && res.ok){ const c = res.clone(); caches.open(CACHE).then(ch => ch.put(r, c)); }
    return res;
  }).catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
});
