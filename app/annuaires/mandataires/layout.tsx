import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mandataires judiciaires par département — AVELOR',
  description:
    'Liste indicative des mandataires et administrateurs judiciaires inscrits CNAJMJ, classés par région et département.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
