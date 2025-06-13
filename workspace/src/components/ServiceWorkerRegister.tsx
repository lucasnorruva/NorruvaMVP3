
"use client";

import { useEffect } from 'react';
import { registerServiceWorker } from '@/utils/registerServiceWorker';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Only register the service worker in production
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    } else {
      // In development, try to unregister any existing service worker
      // to prevent caching issues.
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (let registration of registrations) {
            registration.unregister();
            console.log('[Dev Env] Service worker unregistered:', registration);
          }
        });
      }
    }
  }, []);

  return null;
}
