import type { Metadata } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import './globals.css';
import Background from '@/components/Background';
import Nav from '@/components/Nav';
import Compteur from '@/components/Compteur';

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
        <footer className="relative mt-24 space-y-2 pb-10 text-center text-xs text-navy/50">
          <p className="font-display text-sm tracking-wide">AVELOR</p>
          <p>Accompagnement gratuit · confidentiel · sans jugement</p>
          <Compteur />
          <div className="flex flex-wrap justify-center gap-3 pt-2 text-navy/40">
            <a href="/confidentialite" className="hover:text-navy/70">Confidentialité</a>
            <a href="/parler" className="hover:text-navy/70">Parler à quelqu&apos;un</a>
            <a href="/temoignages" className="hover:text-navy/70">Témoignages</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
