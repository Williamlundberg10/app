const CACHE_NAME = "pwa-cache-v2";
const FILES_TO_CACHE = [
  "/app/css/styles.css",
  "/app/data/class_codes.json",
  "/app/data/data.json",
  "/app/data/test.json",
  "/app/html/home.html",
  "/app/html/s.html",
  "/app/html/settings.html",
  "/app/icons/home.svg",
  "/app/icons/s1.svg",
  "/app/icons/s2.svg",
  "/app/icons/s3.svg",
  "/app/icons/settings.svg",
  "/app/js/a.js",
  "/app/js/j.js",
  "/app/js/script.js",
  "/app/app.html"
];


// Install Service Worker & Cache Files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const file of FILES_TO_CACHE) {
        try {
          await cache.add(file);
        } catch (err) {
          console.warn("Misslyckades med att cacha:", file, err);
        }
      }
    })
  );
  self.skipWaiting();
});


// Activate & Clean Old Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    )
  );
  self.clients.claim();
});

// Serve Cached Files
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

