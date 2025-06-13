export function registerServiceWorker(config?: { onUpdate?: (registration: ServiceWorkerRegistration) => void; onSuccess?: (registration: ServiceWorkerRegistration) => void; unregister?: boolean }) {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    if (config?.unregister) {
      unregisterServiceWorker();
      return;
    }
    
    // The URL constructor is helpful for developers on non-localhost.
    const publicUrl = new URL(process.env.PUBLIC_URL || '', window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served from. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL || ''}/sw.js`;

      navigator.serviceWorker.register(swUrl).then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // At this point, the updated work has been installed and
                // available, but the previous service worker will still
                // serve the old content until all client tabs are closed.
                console.log('New content is available and will be used when all tabs for this page are closed. See https://cra.link/PWA.');

                // Execute callback
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a "Content is cached for offline use." message.
                console.log('Content is cached for offline use.');

                // Execute callback
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          };
        };
      }).catch(error => {
        console.error('Error during service worker registration:', error);
      });
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
      console.log('Service worker unregistered.');
    });
  }
}
