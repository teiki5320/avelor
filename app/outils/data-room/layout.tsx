import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checklist data room — AVELOR',
  description:
    'Liste complète des documents à préparer pour une cession ou une procédure collective : juridique, financier, social, fiscal, opérationnel.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
