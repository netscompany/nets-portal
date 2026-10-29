const CACHE_NAME = 'nets-portal-v3';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/sitemap.xml',
  '/robots.txt',
  '/offline.html',
  '/manifest.webmanifest',
  '/logo.svg',
  '/logo-blanco.svg',
  '/favicon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Navegación HTML: Network-first con fallback a offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Assets estáticos (js, css, png, svg, woff2): Cache-first
  const isStaticAsset = /\.(?:js|css|png|svg|woff2)$/i.test(new URL(request.url).pathname);
  if (isStaticAsset) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          });
        })
    );
    return;
  }

  // Resto: Network
  event.respondWith(fetch(request));
});