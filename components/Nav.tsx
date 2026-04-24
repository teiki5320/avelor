'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface MenuGroup {
  titre: string;
  liens: { href: string; label: string }[];
}

const GROUPS: MenuGroup[] = [
  {
    titre: 'Comprendre',
    liens: [
      { href: '/procedures', label: 'Procédures' },
      { href: '/glossaire', label: 'Glossaire' },
      { href: '/situation', label: 'Par situation' },
    ],
  },
  {
    titre: 'Agir',
    liens: [
      { href: '/courriers', label: 'Courriers types' },
      { href: '/aides', label: 'Aides entreprise' },
      { href: '/aides-personnelles', label: 'Droits personnels' },
      { href: '/vendre', label: 'Vendre / Céder' },
    ],
  },
  {
    titre: 'Se protéger',
    liens: [
      { href: '/proteger-famille', label: 'Famille et patrimoine' },
      { href: '/rebond', label: 'Rebondir' },
      { href: '/accompagnant', label: "J'accompagne quelqu'un" },
    ],
  },
  {
    titre: 'En parler',
    liens: [
      { href: '/parler', label: 'Parler maintenant' },
      { href: '/temoignages', label: 'Témoignages' },
      { href: '/confidentialite', label: 'Confidentialité' },
    ],
  },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  return (
    <header ref={ref} className="fixed top-3 left-1/2 z-40 -translate-x-1/2 sm:top-4">
      <nav className="pill-nav flex items-center gap-4 px-5 py-2.5 sm:gap-6 sm:px-6">
        <Link
          href="/"
          className="font-display text-base tracking-wide text-navy sm:text-lg"
        >
          AVELOR
        </Link>

        <div className="hidden items-center gap-4 text-sm text-navy/55 md:flex">
          <Link href="/procedures" className="transition hover:text-navy">Procédures</Link>
          <Link href="/courriers" className="transition hover:text-navy">Courriers</Link>
          <Link href="/aides" className="transition hover:text-navy">Aides</Link>
          <Link href="/parler" className="transition hover:text-navy">Parler</Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-navy/60 hover:bg-navy/5"
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && (
        <div className="pill-nav mt-2 grid grid-cols-2 gap-x-6 gap-y-4 px-5 py-5 sm:grid-cols-4 sm:px-6">
          {GROUPS.map((g) => (
            <div key={g.titre}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-navy/35">
                {g.titre}
              </p>
              <div className="space-y-0.5">
                {g.liens.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-2 py-1.5 text-sm text-navy/70 transition hover:bg-navy/5 hover:text-navy"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
