import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simulateur aide juridictionnelle — AVELOR',
  description:
    'Vérifiez votre éligibilité à l\'aide juridictionnelle selon vos revenus et personnes à charge. Barèmes 2025 officiels.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
