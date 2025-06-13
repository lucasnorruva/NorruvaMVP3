// Service Worker

const CACHE_NAME = 'norruva-dpp-cache-v1.0.1'; // Incremented version
const OFFLINE_URL = '/offline.html'; // A dedicated offline fallback page

// List of URLs to cache for the app shell.
// It's important to include the manifest.json and key icons for PWA functionality.
const APP_SHELL_URLS = [
  '/', // Root page
  '/dashboard', // Default redirect target, might be good to cache
  '/offline.html', // The offline fallback page
  '/manifest.json', // Web App Manifest
  '/favicon.ico', // Favicon
  // Key icons often referenced in manifest or for apple-touch-icon
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Potentially key CSS or JS bundles if they are consistently named and critical for app shell
  // Example: '/styles/globals.css', '/_next/static/css/main.css' (actual name varies)
  // Be cautious with Next.js hashed assets here, as their names change.
  // The dynamic caching in the 'fetch' event is better for those.
];

self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell', APP_SHELL_URLS);
        // Use { cache: 'reload' } to bypass HTTP cache for these critical files during install
        const cachePromises = APP_SHELL_URLS.map(url => {
          return fetch(url, { cache: 'reload' })
            .then(response => {
              if (!response.ok) {
                // If a specific app shell URL fails, log it but don't fail the entire SW install
                console.warn(`[SW] Failed to fetch and cache: ${url}. Status: ${response.status}`);
                // Optionally, you could decide to not cache it or try a fallback
                return Promise.resolve(); // Resolve so Promise.all doesn't reject
              }
              return cache.put(url, response);
            })
            .catch(err => {
              console.warn(`[SW] Error fetching/caching ${url}:`, err);
              return Promise.resolve();
            });
        });
        return Promise.all(cachePromises);
      })
      .catch(err => {
        console.error("[SW] Error opening cache or caching app shell:", err);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests for caching
  if (event.request.method !== 'GET') {
    return;
  }

  // For navigation requests (HTML pages), try network first, then cache, then offline page.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If successful, cache the fetched page for future offline use.
          // This helps keep content fresh when online.
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try to serve from cache.
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // For non-navigation requests (assets like CSS, JS, images), use a cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Cache hit - return response from cache.
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache - fetch from network.
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Cache the new resource.
                // Be careful with caching opaque responses (from third-party domains without CORS)
                // as their size cannot be determined, which can lead to exceeding cache quotas.
                if (event.request.url.startsWith(self.location.origin)) { // Only cache same-origin resources
                  cache.put(event.request, responseToCache);
                }
              });

            return networkResponse;
          }
        ).catch(() => {
          // If both cache and network fail (e.g., offline and not cached),
          // and it's an image request, you could return a placeholder image.
          if (event.request.destination === 'image') {
            // return caches.match('/images/placeholder.png'); // Example placeholder
          }
          // For other types, or if no placeholder, just let the browser handle the error.
          return new Response("Network error occurred", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          });
        });
      })
  );
});
