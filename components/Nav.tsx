'use client';
import Link from 'next/link';
import { useState } from 'react';

const PRIMARY = [
  { href: '/courriers', label: 'Courriers' },
  { href: '/aides', label: 'Aides' },
  { href: '/procedures', label: 'Procédures' },
  { href: '/parler', label: 'Parler' },
];

const ALL_LINKS = [
  { href: '/courriers', label: 'Courriers types' },
  { href: '/aides', label: 'Aides entreprise' },
  { href: '/aides-personnelles', label: 'Droits personnels' },
  { href: '/proteger-famille', label: 'Protéger ma famille' },
  { href: '/vendre', label: 'Vendre / Céder' },
  { href: '/procedures', label: 'Procédures' },
  { href: '/rebond', label: 'Rebondir' },
  { href: '/glossaire', label: 'Glossaire' },
  { href: '/accompagnant', label: "J'accompagne quelqu'un" },
  { href: '/temoignages', label: 'Témoignages' },
  { href: '/confidentialite', label: 'Confidentialité' },
  { href: '/parler', label: 'Parler à quelqu\'un' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-3 left-1/2 z-40 w-auto -translate-x-1/2 sm:top-4">
      <nav className="pill-nav flex items-center gap-3 px-4 py-2 sm:gap-5 sm:px-6 sm:py-2.5">
        <Link
          href="/"
          className="font-display text-base tracking-wide text-navy sm:text-lg"
        >
          AVELOR
        </Link>

        <div className="hidden items-center gap-3 text-sm text-navy/55 lg:flex">
          {PRIMARY.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-navy/60 hover:bg-navy/5"
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && (
        <div className="pill-nav mt-2 grid grid-cols-2 gap-1 px-4 py-3 sm:grid-cols-3">
          {ALL_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2 text-sm text-navy/70 transition hover:bg-navy/5 hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
