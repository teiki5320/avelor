import { ogMeta } from '@/lib/og';

export const metadata = ogMeta({
  titre: 'Valorisation des stocks',
  sous: 'Calculateur cession / liquidation',
  description:
    "Estimez la valeur de réalisation de vos stocks en cas de cession ou liquidation : taux de réfaction selon la nature du stock et l'urgence.",
  cat: 'outil',
  pageTitle: 'Valorisation des stocks (liquidation) — AVELOR',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
