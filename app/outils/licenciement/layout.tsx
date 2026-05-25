import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculateur indemnite de licenciement — AVELOR',
  description:
    'Calculez l\'indemnité légale de licenciement économique selon l\'ancienneté et le salaire brut. Plafond AGS 2025 inclus.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
