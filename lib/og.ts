import type { Metadata } from 'next';

export type OgCat = 'outil' | 'courrier' | 'procedure' | 'situation' | 'aide' | 'faq' | 'defaut';

/**
 * Construit les métadonnées OpenGraph + Twitter pour une page, en
 * pointant vers l'image OG dynamique (/api/og) avec un titre, un
 * sous-titre et une couleur d'accent par catégorie.
 *
 * Usage dans une page : `export const metadata = ogMeta({ titre: '…', sous: '…', cat: 'outil' })`
 * — fusionne titre/description de la page avec l'image dynamique.
 */
export function ogMeta(opts: {
  titre: string;
  description: string;
  sous?: string;
  cat?: OgCat;
  pageTitle?: string;
}): Metadata {
  const params = new URLSearchParams({ titre: opts.titre });
  if (opts.sous) params.set('sous', opts.sous);
  if (opts.cat) params.set('cat', opts.cat);
  const ogUrl = `/api/og?${params.toString()}`;

  return {
    title: opts.pageTitle ?? `${opts.titre} — AVELOR`,
    description: opts.description,
    openGraph: {
      title: opts.titre,
      description: opts.description,
      type: 'article',
      images: [{ url: ogUrl, width: 1200, height: 630, alt: opts.titre }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.titre,
      description: opts.description,
      images: [ogUrl],
    },
  };
}
