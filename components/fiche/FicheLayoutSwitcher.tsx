'use client';
import { useEffect, useState } from 'react';
import LayoutClassique from './layouts/LayoutClassique';
import LayoutDashboard from './layouts/LayoutDashboard';
import LayoutOnglets from './layouts/LayoutOnglets';
import LayoutSommaire from './layouts/LayoutSommaire';
import type { LayoutData } from './layouts/types';

type LayoutId = 'actuel' | 'dashboard' | 'onglets' | 'sommaire';

const LAYOUTS: { id: LayoutId; label: string; icone: string; description: string }[] = [
  { id: 'actuel', label: 'Classique', icone: '📄', description: 'Liste linéaire, tous accordéons fermés' },
  { id: 'dashboard', label: 'Dashboard', icone: '📊', description: 'KPI en haut, stratégie en hero, grille par thème' },
  { id: 'onglets', label: 'Onglets', icone: '🗂️', description: '6 sections thématiques navigables' },
  { id: 'sommaire', label: 'Sommaire', icone: '📑', description: 'Table des matières à gauche, contenu à droite' },
];

const STORAGE_KEY = 'avelor_fiche_layout';

export default function FicheLayoutSwitcher(data: LayoutData) {
  const [active, setActive] = useState<LayoutId>('actuel');

  useEffect(() => {
    try {
      const fromHash = window.location.hash.replace(/^#v=/, '') as LayoutId;
      if (LAYOUTS.some((l) => l.id === fromHash)) {
        setActive(fromHash);
        return;
      }
      const stored = localStorage.getItem(STORAGE_KEY) as LayoutId | null;
      if (stored && LAYOUTS.some((l) => l.id === stored)) {
        setActive(stored);
      }
    } catch {}
  }, []);

  function changeLayout(id: LayoutId) {
    setActive(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
      window.history.replaceState(null, '', `#v=${id}`);
    } catch {}
  }

  const activeDef = LAYOUTS.find((l) => l.id === active) ?? LAYOUTS[0];

  return (
    <>
      {/* SWITCHER */}
      <div className="no-print rounded-2xl border border-navy/10 bg-white/70 p-3 backdrop-blur sm:p-4">
        <p className="mb-2 text-[11px] uppercase tracking-wider text-navy/50">
          🧪 Mode expérimental · comparer les mises en page
        </p>
        <div className="flex flex-wrap gap-2">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => changeLayout(l.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                active === l.id
                  ? 'border-bleu-fonce bg-bleu-fonce text-white'
                  : 'border-navy/15 bg-white text-navy/75 hover:border-bleu hover:bg-bleu/5'
              }`}
            >
              <span aria-hidden>{l.icone}</span>
              <span className="font-medium">{l.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-navy/55">{activeDef.description}</p>
      </div>

      {/* LAYOUT ACTIF */}
      <div className="mt-5 sm:mt-6">
        {active === 'actuel' && <LayoutClassique {...data} />}
        {active === 'dashboard' && <LayoutDashboard {...data} />}
        {active === 'onglets' && <LayoutOnglets {...data} />}
        {active === 'sommaire' && <LayoutSommaire {...data} />}
      </div>
    </>
  );
}
