// Replaced with the complete, versioned app shell by the production build.
const CACHE_PREFIX = 'diet-tracker-shell-';
const CACHE = CACHE_PREFIX + 'd8fd0428c2cb6e8c';
const SHELL = ["/apple-touch-icon.png","/assets/commonFoods-C0ZXZf_D.js","/assets/index-BexJapOW.js","/assets/index-Qjv70vwI.css","/build-info.json","/icon-192.png","/icon-512.png","/index.html","/manifest.webmanifest","/robots.txt"];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => (await cache.match('/index.html')) || fetch(event.request))
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      // These are this build's static files. Hosts may vary on Origin even
      // though module requests and installation fetches need identical bytes.
      const cached = await cache.match(event.request, { ignoreVary: true });
      if (cached) return cached;
      return fetch(event.request);
    })
  );
});
