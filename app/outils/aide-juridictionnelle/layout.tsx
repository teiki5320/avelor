import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/outils/aide-juridictionnelle' },
  title: 'Simulateur aide juridictionnelle — Solelis',
  description:
    'Vérifiez votre éligibilité à l\'aide juridictionnelle selon vos revenus et personnes à charge. Barèmes 2026 officiels.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
