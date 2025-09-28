const CACHE_NAME = "pwa-cache-v1.27";

const FILES_TO_CACHE = [
  "../",               // root
  "../index.html",
  "../app.html",
  "../html/home.html",
  "../html/s.html",
  "../html/settings.html",

  // CSS
  "../css/styles.css",

  // JS
  "../js/a.js",
  "../js/j.js",
  "../js/script.js",

  "../data/data.json",
  "../data/test.json",

  // Icons
  "../icons/home.svg",
  "../icons/settings.svg",
  "../icons/s1.png",
  "../icons/s2.png",
  "../icons/s3.png",

  // Fallback page
  "../html/offline.html"
];

// Install & Cache Files
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

// Fetch Handler with Offline Fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;

      return fetch(event.request).catch(() => {
        // If offline & navigating to a page, show fallback
        if (event.request.mode === "navigate") {
          return caches.match("../html/offline.html");
        }
      });
    })
  );
});
