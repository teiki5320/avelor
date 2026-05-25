'use client';
import { useEffect, useState, useCallback } from 'react';

const SECTIONS = [
  'strategie',
  'alertes',
  'soutien',
  'plan-action',
  'checklist',
  'procedure',
  'cessation',
  'tresorerie',
  'calendrier',
  'timeline',
  'rappels',
  'protection',
  'caution',
  'patrimoine',
  'consequences',
  'aides',
  'prescription',
  'organismes',
  'ccsf',
  'bail',
  'obligations',
] as const;

const TOTAL = SECTIONS.length;
const STORAGE_PREFIX = 'avelor_progress_';

export default function ProgressTracker({ token }: { token: string }) {
  const [consultes, setConsultes] = useState<Set<string>>(new Set());

  /* Charger la progression depuis localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${token}`);
      if (stored) {
        const parsed: string[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setConsultes(new Set(parsed));
        }
      }
    } catch {
      /* localStorage indisponible ou donnée corrompue */
    }
  }, [token]);

  /* Sauvegarder dans localStorage */
  const persister = useCallback(
    (next: Set<string>) => {
      try {
        localStorage.setItem(
          `${STORAGE_PREFIX}${token}`,
          JSON.stringify([...next]),
        );
      } catch {
        /* quota ou mode privé */
      }
    },
    [token],
  );

  /* Observer les clics sur les éléments avec data-section */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const section = target.closest('[data-section]');
      if (!section) return;
      const id = section.getAttribute('data-section');
      if (!id) return;

      setConsultes((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        persister(next);
        return next;
      });
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [persister]);

  const fait = consultes.size;
  const pct = Math.round((fait / TOTAL) * 100);

  if (fait === 0) return null;

  return (
    <div className="glass-soft rounded-2xl p-4 no-print">
      <div className="flex items-center justify-between text-sm text-navy/70">
        <span>
          {fait} section{fait > 1 ? 's' : ''} consultée{fait > 1 ? 's' : ''} sur{' '}
          {TOTAL}
        </span>
        <span className="font-display text-navy">{pct} %</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-navy/10">
        <div
          className="h-2 rounded-full bg-bleu transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct === 100 && (
        <p className="mt-2 text-xs text-vert font-medium">
          Vous avez parcouru toutes les sections de votre fiche.
        </p>
      )}
    </div>
  );
}
