import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Estimateur de valorisation — AVELOR',
  description:
    'Estimez la valeur de votre entreprise par secteur d\'activité selon les multiples EBE et pourcentage CA. Sources BPI France, CRA.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
