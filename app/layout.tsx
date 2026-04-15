import type { Metadata } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import './globals.css';
import Background from '@/components/Background';
import Nav from '@/components/Nav';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AVELOR · Aide aux chefs d\'entreprise',
  description:
    'AVELOR accompagne les chefs d\'entreprise français en difficulté — avec tact, avec clarté, avec les bons interlocuteurs.',
  openGraph: {
    title: 'AVELOR',
    description:
      'Vous n\'êtes pas seul. AVELOR vous aide à y voir clair — en quelques minutes, gratuitement.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${outfit.variable}`}>
      <body>
        <Background />
        <Nav />
        <main className="relative min-h-screen pt-20 sm:pt-24">{children}</main>
        <footer className="relative mt-24 pb-10 text-center text-xs text-navy/50">
          <p className="font-display text-sm tracking-wide">AVELOR</p>
          <p className="mt-1">Accompagnement gratuit · confidentiel · sans jugement</p>
        </footer>
      </body>
    </html>
  );
}
