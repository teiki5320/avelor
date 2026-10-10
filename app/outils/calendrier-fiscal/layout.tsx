import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/outils/calendrier-fiscal' },
  title: 'Calendrier fiscal personnalisé — Solelis',
  description:
    'Générez votre calendrier fiscal selon votre régime TVA, IS/IR et date de clôture. Toutes les échéances de l\'année.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
