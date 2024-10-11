const CACHE_NAME = "cache-v1"; // Cache name
const CACHE_TIMEOUT = 60 * 60 * 1000; // Cache duration: 1 hour

// Resources to cache initially (static files)
const urlsToCache = [
  "/", // Home page
  "/favicon.ico", // Favicon
  "/css/styles.css", // CSS file
  "/js/app.js", // JavaScript file
  "/offline", // Offline page
];

// Install event: Initialize cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Intercept all network requests
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Handle requests for http/https protocols only
  if (requestUrl.protocol === "http:" || requestUrl.protocol === "https:") {
    event.respondWith(
      // Check the cache for the request
      caches.match(event.request).then((cachedResponse) => {
        // If there's a cached response, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, try fetching from the network
        return fetch(event.request)
          .then((networkResponse) => {
            // Only cache successful responses for static files
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              networkResponse.type === "basic"
            ) {
              const responseClone = networkResponse.clone();
              const requestURL = new URL(event.request.url);

              // Cache HTML, JS, CSS, ICO, SVG, and font files for 1 hour
              if (
                requestURL.origin === location.origin &&
                (requestURL.pathname === "/" ||
                  requestURL.pathname.endsWith(".html") ||
                  requestURL.pathname.endsWith(".js") ||
                  requestURL.pathname.endsWith(".css") ||
                  requestURL.pathname.endsWith(".png") ||
                  requestURL.pathname.endsWith(".jpg") ||
                  requestURL.pathname.endsWith(".jpeg") ||
                  requestURL.pathname.endsWith(".ico") ||
                  requestURL.pathname.endsWith(".svg") ||
                  requestURL.pathname.endsWith(".woff") ||
                  requestURL.pathname.endsWith(".woff2") ||
                  requestURL.pathname.endsWith(".ttf"))
              ) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone);
                });
              }

              return networkResponse;
            }

            // Return the network response
            return networkResponse;
          })
          .catch(() => {
            // If network request fails, return offline page
            return caches.match("/offline");
          });
      })
    );
  }
});
