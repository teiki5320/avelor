import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simulateur ATI (Allocation des Travailleurs Indépendants) — AVELOR',
  description:
    'Vérifiez votre éligibilité à l\'ATI et calculez le montant de votre allocation. 26,30 euros/jour pendant 6 mois (2025).',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
