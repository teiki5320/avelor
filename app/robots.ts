import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/fiche/'] },
    sitemap: 'https://solelis.com/sitemap.xml',
  };
}
