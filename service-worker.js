const VERSION = "v4.2";

const STATIC_CACHE = `static-${VERSION}`;
const DYNAMIC_CACHE = `dynamic-${VERSION}`;
const API_CACHE = `api-${VERSION}`;

const MAX_ITEMS = 50;

const CORE_ASSETS = [
  "/",
  "./index.html",
  "./html/offline.html",
  "./html/home.html",
  "./css/styles.css",
  "./js/script.js"
];


// 🧱 INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});


// 🧹 ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (![STATIC_CACHE, DYNAMIC_CACHE, API_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});


// 🚀 FETCH
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // HTML (pages)
  if (event.request.mode === "navigate") {
    event.respondWith(networkFirstHTML(event.request));
    return;
  }

  // JS & CSS
  if (url.pathname.match(/\.(js|css)$/)) {
    event.respondWith(staleWhileRevalidateSafe(event.request, STATIC_CACHE));
    return;
  }

  // Images
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/)) {
    event.respondWith(cacheFirstSafe(event.request, DYNAMIC_CACHE));
    return;
  }

  // API
  if (url.hostname.includes("api.")) {
    event.respondWith(networkFirstAPI(event.request));
    return;
  }

  // Default
  event.respondWith(staleWhileRevalidateSafe(event.request, DYNAMIC_CACHE));
});


// =========================
// 🔥 SAFE STRATEGIES (FIXED)
// =========================

// ⚡ Stale While Revalidate (SAFE)
async function staleWhileRevalidateSafe(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);

  const networkFetch = fetch(req)
    .then(res => {
      if (res && res.ok) {
        cache.put(req, res.clone());
      }
      return res;
    })
    .catch(() => null); // ✅ prevents crash

  // Return cache immediately if exists
  if (cached) return cached;

  const res = await networkFetch;

  // Offline fallback
  if (!res) {
    if (req.mode === "navigate") {
      return caches.match("/html/offline.html");
    }
    return new Response("Offline", { status: 503 });
  }

  return res;
}


// 🧱 Cache First (SAFE)
async function cacheFirstSafe(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);

  if (cached) return cached;

  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    limitCache(cacheName, MAX_ITEMS);
    return res;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}


// 🌐 Network First (HTML)
async function networkFirstHTML(req) {
  const cache = await caches.open(STATIC_CACHE);

  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch {
    const cached = await cache.match(req);
    return cached || cache.match("/html/offline.html");
  }
}


// 🌐 Network First (API)
async function networkFirstAPI(req) {
  const cache = await caches.open(API_CACHE);

  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    limitCache(API_CACHE, MAX_ITEMS);
    return res;
  } catch {
    const cached = await cache.match(req);
    return cached || new Response("Offline API", { status: 503 });
  }
}


// 🧹 LIMIT CACHE (prevents infinite growth)
async function limitCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    limitCache(cacheName, maxItems);
  }
}