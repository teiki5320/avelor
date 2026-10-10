'use client';
import { useEffect } from 'react';

/**
 * Enregistre le service worker `/sw.js` en production. En développement
 * (NODE_ENV=development), on désinscrit tout SW existant pour éviter
 * les ennuis de cache pendant les itérations.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV !== 'production') {
      // En dev, désinscrire tout SW pour éviter le cache.
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      }).catch(() => {});
      return;
    }

    const onLoad = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((e) => {
          // Erreur d'enregistrement non bloquante.
          console.error('[SW] registration failed', e);
        });
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  return null;
}
