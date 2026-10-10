import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simulateur ACRE / ARCE — Solelis',
  description:
    'Calculez vos droits ACRE (exonération de cotisations) et ARCE (capital ARE) pour votre création ou reprise d\'entreprise.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
