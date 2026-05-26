import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Modèle de courrier — AVELOR',
  description: 'Courrier personnalisé prêt à imprimer pour votre situation d\'entreprise en difficulté.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
