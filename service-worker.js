// service-worker.js - Versión 7: Activación inmediata y robusta

const STATIC_CACHE_NAME = 'site-static-v7'; // Incrementamos la versión
const DYNAMIC_CACHE_NAME = 'site-dynamic-v7';

const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/script.js',
  '/style.css',
  '/logo.png',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js',
  'https://unpkg.com/feather-icons'
];

self.addEventListener('install', event => {
  // **NUEVO**: Forzar la activación del nuevo Service Worker
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      console.log('Service Worker: Precaching App Shell');
      return cache.addAll(APP_SHELL_ASSETS);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
        .map(key => caches.delete(key))
      ).then(() => {
        // **NUEVO**: Tomar control inmediato de todas las pestañas abiertas
        return self.clients.claim();
      });
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }
  if (request.method !== 'GET') {
    return;
  }

  if (url.hostname === 'firestore.googleapis.com') {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          console.log('Service Worker: Red falló para Firestore, sirviendo desde caché.');
          return caches.match(request);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cacheRes => {
      return cacheRes || fetch(request).then(fetchRes => {
        return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
          cache.put(request, fetchRes.clone());
          return fetchRes;
        });
      });
    })
  );
});