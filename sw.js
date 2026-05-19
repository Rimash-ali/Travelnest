// sw.js - service worker for TravelNest PWA
// caches key files so the app can load even offline

var CACHE_NAME = 'travelnest-cache-v1';

// list of files to cache when the SW first installs
var filesToCache = [
  './index.html',
  './css/style.css',
  './css/responsive.css',
  './js/data.js',
  './js/main.js',
  './js/home.js',
  './pages/explorer.html',
  './js/explorer.js',
  './pages/budget.html',
  './js/budget.js',
  './pages/generator.html',
  './js/generator.js',
  './pages/mood.html',
  './js/mood.js',
  './pages/feedback.html',
  './js/feedback.js',
  './assets/icons/logo.png',
  './manifest.json'
];

// install - open cache and add all files
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

// activate - clear old caches if version changed
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      var deleteOld = [];
      for (var i = 0; i < cacheNames.length; i++) {
        if (cacheNames[i] !== CACHE_NAME) {
          deleteOld.push(caches.delete(cacheNames[i]));
        }
      }
      return Promise.all(deleteOld);
    })
  );
  self.clients.claim();
});

// fetch - serve from cache first, fallback to network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) {
        return cached;
      }
      return fetch(event.request).catch(function() {
        // if both cache and network fail, nothing we can do
        return new Response('Offline - content not available');
      });
    })
  );
});
