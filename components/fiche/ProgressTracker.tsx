'use client';
import { useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/lib/hooks';

const SECTION_GROUPES: { label: string; icone: string; sections: string[] }[] = [
  {
    label: 'Agir',
    icone: '✅',
    sections: ['plan-action', 'checklist', 'procedure', 'reclassement', 'csp', 'apldr'],
  },
  {
    label: 'Vue d\'ensemble',
    icone: '📊',
    sections: ['strategie', 'soutien'],
  },
  {
    label: 'Échéances',
    icone: '⏱️',
    sections: ['cessation', 'tresorerie', 'pge', 'garantie-bpi', 'calendrier', 'timeline', 'periode-suspecte', 'arret-longue-duree', 'rappels'],
  },
  {
    label: 'Patrimoine',
    icone: '🏠',
    sections: ['protection', 'caution', 'conjoint', 'patrimoine', 'consequences', 'nationalite'],
  },
  {
    label: 'Aides',
    icone: '💶',
    sections: ['aides', 'aides-etat', 'surendettement', 'bail', 'franchise', 'credit-bail', 'ccsf', 'obligations', 'scop', 'plateformes'],
  },
  {
    label: 'Ressources',
    icone: '📚',
    sections: ['organismes', 'alertes', 'prescription'],
  },
];

const TOTAL = SECTION_GROUPES.reduce((acc, g) => acc + g.sections.length, 0);
const STORAGE_PREFIX = 'avelor_progress_';

export default function ProgressTracker({ token }: { token: string }) {
  const [consultes, setConsultes] = useLocalStorage<string[]>(`${STORAGE_PREFIX}${token}`, []);

  const ajouterSection = useCallback(
    (id: string) => {
      setConsultes((prev) => {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      });
    },
    [setConsultes],
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const section = target.closest('[data-section]');
      if (!section) return;
      const id = section.getAttribute('data-section');
      if (!id) return;

      ajouterSection(id);
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [ajouterSection]);

  const fait = consultes.length;
  const pct = Math.round((fait / TOTAL) * 100);

  if (fait === 0) return null;

  return (
    <div className="glass-soft rounded-2xl p-4 no-print">
      <div className="flex items-center justify-between text-sm text-navy/70">
        <span>
          Exploration : <strong className="text-navy">{fait}</strong> blocs sur {TOTAL}
        </span>
        <span className="font-display text-navy">{pct} %</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-navy/10 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-bleu to-bleu-fonce transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Détail par groupe */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {SECTION_GROUPES.map((g) => {
          const consultesGroupe = g.sections.filter((s) => consultes.includes(s)).length;
          const pctGroupe = Math.round((consultesGroupe / g.sections.length) * 100);
          const complet = pctGroupe === 100;
          return (
            <div key={g.label} className="text-xs">
              <div className="flex items-center gap-1.5">
                <span aria-hidden>{g.icone}</span>
                <span className={complet ? 'font-medium text-vert' : 'text-navy/60'}>
                  {g.label}
                </span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-navy/10">
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${complet ? 'bg-vert' : 'bg-bleu/70'}`}
                  style={{ width: `${pctGroupe}%` }}
                />
              </div>
              <div className="mt-0.5 text-[10px] text-navy/45">
                {consultesGroupe} / {g.sections.length}
              </div>
            </div>
          );
        })}
      </div>

      {pct === 100 && (
        <p className="mt-3 text-xs text-vert font-medium">
          ✓ Vous avez parcouru toutes les sections de votre fiche.
        </p>
      )}
      {pct > 0 && pct < 100 && (
        <p className="mt-2 text-[11px] text-navy/55">
          Vous pouvez revenir plus tard — votre progression est sauvegardée dans ce navigateur.
        </p>
      )}
    </div>
  );
}
