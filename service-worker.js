const CACHE_NAME = "pro-calculator-v1";

const FILES_TO_CACHE = [
  "index.html",
  "normal-calculator.html",
  "grocery-calculator.html",

  "style.css",

  "app.js",
  "normal-calculator.js",
  "grocery-calculator.js",

  "manifest.json",

  "assets/splash.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
