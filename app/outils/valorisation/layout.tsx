import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/outils/valorisation' },
  title: 'Estimateur de valorisation — Solelis',
  description:
    'Estimez la valeur de votre entreprise par secteur d\'activité selon les multiples EBE et pourcentage CA. Sources Bpifrance, CRA.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
