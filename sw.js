// Offline support: precache the app shell (Chart.js and the Inter font included, from vendor/), then serve
// everything cache-first while refreshing in the background.
// Bump CACHE_VERSION when you change any of the files below. The app offers a reload once the new version takes over.
const CACHE_VERSION = 'brew-guide-v14';

const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './vendor/chart.umd.min.js',
  './vendor/inter-latin-wght-normal.woff2',
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
      // cache: 'reload' skips the browser's HTTP cache, so a new release never precaches stale files
      .then((cache) => cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: 'reload' }))))
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
          // Opaque (status 0) responses are cross-origin requests made without CORS
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
