// Offline support: precache the app shell, then serve everything (including the
// Chart.js and font CDNs) cache-first while refreshing in the background.
// Bump CACHE_VERSION when you change any of the files below.
const CACHE_VERSION = 'brew-guide-v3';

const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_VERSION).then(async (cache) => {
      const cached = await cache.match(event.request, { ignoreSearch: event.request.mode === 'navigate' });
      const network = fetch(event.request)
        .then((response) => {
          // Opaque (status 0) responses come from cross-origin CDN scripts and fonts
          if (response.ok || response.type === 'opaque') cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => cached);
      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      return network;
    })
  );
});
