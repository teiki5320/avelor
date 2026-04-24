import Link from 'next/link';

interface QuickLink {
  href: string;
  icone: string;
  titre: string;
  sousTitre: string;
  couleur: 'bleu' | 'vert' | 'jaune' | 'navy';
}

const LINKS: QuickLink[] = [
  {
    href: '/courriers',
    icone: '✉️',
    titre: 'Courriers',
    sousTitre: '13 modèles personnalisés',
    couleur: 'bleu',
  },
  {
    href: '/outils',
    icone: '🧮',
    titre: 'Calculateurs',
    sousTitre: '9 outils officiels',
    couleur: 'vert',
  },
  {
    href: '/annuaires',
    icone: '📇',
    titre: 'Annuaires',
    sousTitre: 'AGS, TAE, mandataires, CIP',
    couleur: 'jaune',
  },
  {
    href: '/glossaire',
    icone: '📖',
    titre: 'Glossaire',
    sousTitre: '19 termes juridiques',
    couleur: 'navy',
  },
];

const COULEURS: Record<QuickLink['couleur'], { ring: string; bg: string; text: string }> = {
  bleu: { ring: 'hover:ring-bleu/40', bg: 'bg-bleu/5', text: 'text-bleu-fonce' },
  vert: { ring: 'hover:ring-vert/40', bg: 'bg-vert/5', text: 'text-vert' },
  jaune: { ring: 'hover:ring-jaune/40', bg: 'bg-jaune/10', text: 'text-jaune' },
  navy: { ring: 'hover:ring-navy/30', bg: 'bg-navy/5', text: 'text-navy' },
};

export default function QuickLinks() {
  return (
    <section>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-navy/50">
        Outils & ressources
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {LINKS.map((l) => {
          const c = COULEURS[l.couleur];
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`group flex items-center gap-3 rounded-2xl border border-navy/10 bg-white/70 p-3 ring-1 ring-transparent transition hover:bg-white ${c.ring}`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${c.bg}`}
                aria-hidden
              >
                {l.icone}
              </span>
              <div className="min-w-0">
                <p className={`font-display text-sm ${c.text} group-hover:underline`}>{l.titre}</p>
                <p className="truncate text-[11px] text-navy/55">{l.sousTitre}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
