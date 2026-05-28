import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vérificateur de seuils d\'effectif — AVELOR',
  description:
    'Saisissez votre effectif et découvrez quelles obligations s\'appliquent : CSE, PSE, participation, contribution AGEFIPH, RPS, etc.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
