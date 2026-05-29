import { ogMeta } from '@/lib/og';

export const metadata = ogMeta({
  titre: 'Vérificateur de seuils d\'effectif',
  sous: 'CSE, PSE, participation, AGEFIPH…',
  description:
    'Saisissez votre effectif et découvrez quelles obligations s\'appliquent : CSE, PSE, participation, contribution AGEFIPH, RPS, etc.',
  cat: 'outil',
  pageTitle: 'Vérificateur de seuils d\'effectif — AVELOR',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
