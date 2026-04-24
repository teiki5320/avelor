'use client';
import { useEffect, useState } from 'react';

interface Section {
  id: string;
  label: string;
  icone: string;
}

const SECTIONS: Section[] = [
  { id: 'vue-ensemble', label: "Vue d'ensemble", icone: '📊' },
  { id: 'echeances', label: 'Échéances', icone: '⏱️' },
  { id: 'action', label: 'Agir', icone: '✅' },
  { id: 'patrimoine', label: 'Patrimoine', icone: '🏠' },
  { id: 'aides', label: 'Aides', icone: '💶' },
  { id: 'ressources', label: 'Ressources', icone: '📚' },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 140;
  window.scrollTo({ top, behavior: 'smooth' });
}

export default function SectionNav() {
  const [active, setActive] = useState<string>('vue-ensemble');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(s.id);
          });
        },
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav className="no-print sticky top-20 z-20 -mx-5 border-y border-navy/10 bg-white/90 px-5 py-2 backdrop-blur-xl sm:top-24">
      <div className="flex gap-1 overflow-x-auto">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToId(s.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              active === s.id
                ? 'bg-navy text-white'
                : 'text-navy/60 hover:bg-navy/5 hover:text-navy'
            }`}
          >
            <span aria-hidden className="mr-1.5">{s.icone}</span>
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
