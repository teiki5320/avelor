import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/fiche/'] },
    sitemap: 'https://avelor.vercel.app/sitemap.xml',
  };
}
