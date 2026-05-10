const CACHE = 'la-cala-v7';
const ASSETS = [
  './',
  './index.html',
  './hero.jpg',
  './favicon.svg',
  './manifest.json',
];

// Installera — cacha alla filer
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktivera — rensa gamla cacher
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Hämtningar — cache-first för filer, nätverket för väder-API
self.addEventListener('fetch', event => {
  if (event.request.url.includes('open-meteo.com') ||
      event.request.url.includes('cdnfonts.com')) {
    // Försök nätverket, misslyckas tyst vid offline
    event.respondWith(fetch(event.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
