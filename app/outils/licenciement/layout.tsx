import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculateur indemnite de licenciement — AVELOR',
  description:
    'Calculez l\'indemnité légale de licenciement économique selon l\'ancienneté et le salaire brut. Plafonds AGS inclus (valeurs 2024, dernières vérifiées).',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
