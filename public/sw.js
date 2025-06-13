
// Update cache name with each deployment to force service worker refresh
const CACHE_NAME = 'norruva-dpp-cache-v2';
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
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating new service worker...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Force the activated service worker to take control of the page immediately.
  return self.clients.claim();
});

// Fetch event: serve from cache if available, otherwise fetch from network
// This strategy is cache-first for app shell URLs.
self.addEventListener('fetch', (event) => {
  // Let the browser handle requests for Firebase assets and other external resources.
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.includes('firestore.googleapis.com') ||
      event.request.url.includes('firebasestorage.googleapis.com') ||
      event.request.url.includes('googleai') // for Genkit
     ) {
    return; 
  }

  if (APP_SHELL_URLS.includes(new URL(event.request.url).pathname) || event.request.destination === 'style' || event.request.destination === 'script' || event.request.destination === 'font') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            // console.log('[ServiceWorker] Serving from cache:', event.request.url);
            return response;
          }
          // console.log('[ServiceWorker] Fetching from network:', event.request.url);
          return fetch(event.request).then(
            (networkResponse) => {
              // Optionally, cache new assets dynamically if needed, but be careful with Next.js hashed assets.
              // For APP_SHELL_URLS, they should already be in cache from 'install'.
              return networkResponse;
            }
          );
        })
        .catch(() => {
          // If both cache and network fail, serve the offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        })
    );
  } else if (event.request.mode === 'navigate') {
    // For other navigation requests, try network first, then cache, then offline page.
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then((response) => response || caches.match(OFFLINE_URL));
        })
    );
  } else {
    // For non-app-shell, non-navigation requests (e.g., API calls), just fetch from network.
    // Or implement a specific caching strategy if desired.
    return;
  }
});

// Message event: for communication between the page and the service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
