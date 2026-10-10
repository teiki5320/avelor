import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // /api/og : images d'aperçu (partage sur les réseaux, messageries) —
      // à autoriser explicitement, sinon les robots d'aperçu sont bloqués
      // par la règle /api/. La règle la plus précise l'emporte.
      allow: ['/', '/api/og'],
      disallow: ['/api/', '/fiche/'],
    },
    sitemap: 'https://solelis.com/sitemap.xml',
  };
}
