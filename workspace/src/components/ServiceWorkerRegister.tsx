
"use client";

import { useEffect } from 'react';
// registerServiceWorker import is not strictly needed if we are only unregistering for this debug step.
// import { registerServiceWorker } from '@/utils/registerServiceWorker'; 

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // FORCED UNREGISTER FOR DEBUGGING - Revert to original logic after testing this.
    console.log('[DEBUG] Forcing service worker unregistration attempt on component mount...');
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length === 0) {
          console.log('[DEBUG] No service workers found to unregister.');
          return;
        }
        for (let registration of registrations) {
          registration.unregister().then(unregistered => {
            if (unregistered) {
              console.log('[DEBUG] Successfully unregistered service worker for scope:', registration.scope);
            } else {
              // This often happens if the page controlling the SW is already gone or being refreshed.
              console.warn('[DEBUG] Call to unregister service worker for scope returned false (might be okay if page is reloading):', registration.scope);
            }
          }).catch(err => {
            console.error('[DEBUG] Error during service worker unregistration for scope:', registration.scope, err);
          });
        }
        // After attempting unregistration, it's good to reload to ensure the page is no longer controlled.
        // However, automatically reloading can be disruptive. We'll rely on manual hard refresh for now.
        // console.log('[DEBUG] Attempted unregistration. A hard refresh might be needed.');

      }).catch(err => {
        console.error('[DEBUG] Error getting service worker registrations:', err);
      });
    } else {
      console.log('[DEBUG] Service Worker API not available or not in browser environment.');
    }
    // --- END OF FORCED UNREGISTER ---

    // Original logic (commented out for this debug step):
    // if (process.env.NODE_ENV === 'production') {
    //   registerServiceWorker();
    // } else {
    //   if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    //     navigator.serviceWorker.getRegistrations().then(registrations => {
    //       for (let registration of registrations) {
    //         registration.unregister();
    //         console.log('[Dev Env] Service worker unregistered:', registration);
    //       }
    //     });
    //   }
    // }
  }, []);

  return null;
}
