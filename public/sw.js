
const CACHE_NAME = 'norruva-dpp-cache-v1';
const OFFLINE_URL = '/offline.html'; // A simple offline fallback page
const APP_SHELL_URLS = [
  '/',
  '/dashboard',
  '/offline.html', 
  '/styles/globals.css', // Assuming this is the path to your global CSS from public
  // Add other essential assets like logo, key scripts if they are static and predictable
  // For Next.js, dynamic chunks are harder to cache predictively here.
  // Consider '/_next/static/css/...' if the hash is stable or manage dynamically.
  // For now, keep it simple.
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap'
];

// Install event: cache the app shell and offline page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching app shell and offline page');
        // Add offline.html to APP_SHELL_URLS if not already included
        if (!APP_SHELL_URLS.includes(OFFLINE_URL)) {
          APP_SHELL_URLS.push(OFFLINE_URL);
        }
        return cache.addAll(APP_SHELL_URLS.map(url => new Request(url, {cache: 'reload'}))); // Force reload from network
      })
      .catch(error => {
        console.error('[ServiceWorker] Pre-caching failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: serve from cache, fallback to network, then offline page
self.addEventListener('fetch', (event) => {
  // We only want to handle navigation requests for the offline fallback.
  // For other assets, Next.js built-in caching should be preferred or a more sophisticated strategy.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try the network first.
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // Network failed, try the cache.
          console.log('[ServiceWorker] Network request failed, trying cache for:', event.request.url);
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // If both network and cache fail for a navigation request, show offline page.
          const offlinePageResponse = await cache.match(OFFLINE_URL);
          if (offlinePageResponse) {
            return offlinePageResponse;
          }
          // If offline.html is not in cache, this will fail, but it should be.
          return new Response("You are offline. Please check your connection.", {
            headers: { 'Content-Type': 'text/html' }
          });
        }
      })()
    );
  } else if (APP_SHELL_URLS.includes(event.request.url) || APP_SHELL_URLS.some(url => event.request.url.startsWith(url))) {
    // Serve app shell assets from cache first for speed
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((networkResponse) => {
          // Optionally, cache other static assets dynamically if needed
          // const cache = await caches.open(CACHE_NAME);
          // cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
    );
  }
  // For other requests (e.g., API calls, dynamic Next.js chunks), let them go to the network.
});
