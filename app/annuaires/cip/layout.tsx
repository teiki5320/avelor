import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CIP — Centres d\'Information sur la Prévention — AVELOR',
  description:
    'Trouvez votre CIP territorial pour un rendez-vous gratuit et confidentiel avec d\'anciens chefs d\'entreprise et professionnels bénévoles.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
