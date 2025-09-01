const CACHE_NAME = "pwa-cache-v2";
const FILES_TO_CACHE = [
  "/app/",
  "/app/index.html",
  "/app/styles.css",
  "/app/manifest.json",
  "/app/icons/s3.png"
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


// Lyssna på push-notiser
self.addEventListener('push', e => {
    let data = {};
    try {
        data = e.data.json();
    } catch (err) {
        data = { title: "Påminnelse", body: e.data.text() };
    }

    const options = {
        body: data.body,
        icon: "icons/s3.png",
        badge: "icons/s3.png"
    };

    e.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});