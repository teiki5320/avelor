import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Valorisation des stocks (liquidation) — AVELOR',
  description:
    "Estimez la valeur de réalisation de vos stocks en cas de cession ou liquidation : taux de réfaction selon la nature du stock et l'urgence.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
