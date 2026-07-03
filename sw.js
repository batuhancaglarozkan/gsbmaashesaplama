const CACHE_NAME = 'gsb-maas-v2';
const ASSETS = [
  './',
  './index.html'
];

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // index.html her zaman internetten alınsın
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Diğer dosyalar cache'den gelsin
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
