import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vérificateur de prescription — AVELOR',
  description:
    'Vérifiez si vos dettes sont prescrites : URSSAF (3 ans), fiscal (4 ans), civil (5 ans), baux (1 an). Sources légales officielles.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
