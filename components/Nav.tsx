'use client';
import Link from 'next/link';
import { useState } from 'react';

const LINKS = [
  { href: '/courriers', label: 'Courriers' },
  { href: '/aides', label: 'Aides' },
  { href: '/procedures', label: 'Procédures' },
  { href: '/glossaire', label: 'Glossaire' },
  { href: '/accompagnant', label: 'J\'accompagne' },
  { href: '/temoignages', label: 'Témoignages' },
  { href: '/parler', label: 'Parler à quelqu\'un' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2">
      <nav className="pill-nav flex items-center justify-between px-5 py-2.5 sm:px-7 sm:py-3">
        <Link
          href="/"
          className="font-display text-lg tracking-wide text-navy sm:text-xl"
        >
          AVELOR
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 text-sm text-navy/60 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-navy/70 hover:bg-navy/5 md:hidden"
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="pill-nav mt-2 flex flex-col gap-1 px-5 py-4 md:hidden">
          {LINKS.map((l) => (
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
