
"use client";

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Ensure any existing service workers are unregistered.
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length > 0) {
          console.log('[ServiceWorkerRegister] Unregistering existing service workers...');
          for (let registration of registrations) {
            registration.unregister().then(unregistered => {
              if (unregistered) {
                console.log('[ServiceWorkerRegister] Successfully unregistered service worker for scope:', registration.scope);
              } else {
                console.warn('[ServiceWorkerRegister] Call to unregister service worker for scope returned false:', registration.scope);
              }
            }).catch(err => {
              console.error('[ServiceWorkerRegister] Error during service worker unregistration for scope:', registration.scope, err);
            });
          }
          // Advise a reload after unregistration attempts
          // console.log("[ServiceWorkerRegister] Service workers unregistration attempted. A page reload might be needed to fully clear control.");
        } else {
          // console.log("[ServiceWorkerRegister] No service workers found to unregister.");
        }
      }).catch(err => {
        console.error('[ServiceWorkerRegister] Error getting service worker registrations:', err);
      });
    }
    // Do not register any new service worker.
  }, []);

  return null; // This component now does nothing visible and primarily ensures cleanup.
}
