'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const LINKS = [
  { href: '/procedures', label: 'Procédures', desc: 'Comprendre vos options' },
  { href: '/courriers', label: 'Courriers', desc: '12 modèles prêts' },
  { href: '/aides', label: 'Aides entreprise', desc: 'Financements et dispositifs' },
  { href: '/aides-personnelles', label: 'Droits personnels', desc: 'ATI, CSS, RSA...' },
  { href: '/proteger-famille', label: 'Famille', desc: 'Patrimoine et cautions' },
  { href: '/vendre', label: 'Vendre / Céder', desc: 'Cession, location-gérance' },
  { href: '/rebond', label: 'Rebondir', desc: 'Après une liquidation' },
  { href: '/glossaire', label: 'Glossaire', desc: '18 termes expliqués' },
  { href: '/accompagnant', label: "J'accompagne", desc: 'Pour les proches' },
  { href: '/parler', label: 'Parler', desc: 'Numéros gratuits 24/7' },
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
          <Link href="/procedures" className="transition hover:text-navy">Proc&eacute;dures</Link>
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
        <div className="glass mt-2 max-h-[70vh] w-[280px] overflow-y-auto rounded-2xl p-2 sm:w-[320px]"
          style={{ position: 'absolute', right: 0, top: '100%' }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex flex-col rounded-xl px-4 py-2.5 transition hover:bg-navy/5"
            >
              <span className="text-sm font-medium text-navy">{l.label}</span>
              <span className="text-xs text-navy/45">{l.desc}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
