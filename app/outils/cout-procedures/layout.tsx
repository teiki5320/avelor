import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Estimateur du coût des procédures — AVELOR',
  description:
    'Estimez le coût d\'une procédure collective selon la taille de votre entreprise : mandat ad hoc, conciliation, sauvegarde, redressement, liquidation.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
