'use client';
import { useState, useEffect } from 'react';
import type { Reponses, CompanyData } from '@/lib/types';
import type { SectorInfo } from '@/lib/secteur';
import { getTonePreset } from '@/lib/tone';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  reponses: Reponses;
  company: CompanyData;
  sector: SectorInfo;
}

interface Action {
  id: string;
  texte: string;
  done: boolean;
  custom?: boolean;
}

function buildDefaultActions(r: Reponses, c: CompanyData, s: SectorInfo): Action[] {
  const actions: Action[] = [];
  const dep = c.departement || '';
  const ville = c.ville || '';

  actions.push({ id: 'soin', texte: `Prendre soin de moi${s.soutien ? ` (${s.soutien.nom}, APESA)` : ' (APESA, médecin, sommeil)'}`, done: false });

  if (r.situation === 'assignation') {
    actions.push({ id: 'avocat-urgence', texte: `Contacter un avocat en urgence${ville ? ` à ${ville}` : ''} (assignation reçue)`, done: false });
  }
  if (r.probleme === 'urssaf') {
    actions.push({ id: 'urssaf-appel', texte: `Appeler ${s.cotisationOrg}${dep ? ` (${dep})` : ''} au ${s.cotisationTel} pour demander un échelonnement`, done: false });
  }
  if (r.probleme === 'impots') {
    actions.push({ id: 'impots-sie', texte: `Contacter le SIE${ville ? ` de ${ville}` : ''} pour demander un délai de paiement`, done: false });
  }
  if (r.probleme === 'banque') {
    actions.push({ id: 'mediation-credit', texte: `Saisir la médiation du crédit (Banque de France${dep ? `, dép. ${dep}` : ''})`, done: false });
  }
  if (r.probleme === 'fournisseurs') {
    actions.push({ id: 'fournisseur-lettre', texte: 'Écrire une lettre de demande de délai au fournisseur principal', done: false });
  }

  actions.push({ id: 'chambre', texte: `Prendre RDV avec la ${s.chambre}${dep ? ` (${dep})` : ''} — accompagnement gratuit`, done: false });
  if (s.syndicats.length > 0) {
    actions.push({ id: 'syndicat', texte: `Contacter ${s.syndicats[0].nom} (${s.syndicats[0].role})`, done: false });
  }
  actions.push({ id: 'comptable', texte: 'Faire le point avec mon expert-comptable', done: false });

  if (r.effectif === 'salaries') {
    actions.push({ id: 'salaires', texte: 'Vérifier mes obligations vis-à-vis de l\'AGS et des salariés', done: false });
  }

  actions.push({ id: 'tribunal', texte: `Identifier mon tribunal de commerce${ville ? ` (${ville})` : ''}`, done: false });
  actions.push({ id: 'bilan', texte: `Rassembler les derniers bilans et relevés bancaires de ${c.nom !== 'Votre entreprise' ? c.nom : 'mon entreprise'}`, done: false });

  if (r.situation === 'redressement' || r.situation === 'assignation') {
    actions.push({ id: 'cessation', texte: 'Déclarer la cessation des paiements (délai : 45 jours max)', done: false });
  }

  return actions;
}

const STORAGE_KEY = 'avelor_plan_action';

export default function BlocPlanAction({ reponses, company, sector }: Props) {
  const [actions, setActions] = useState<Action[]>([]);
  const [newText, setNewText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const tone = getTonePreset(reponses.moral);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setActions(JSON.parse(saved));
        setLoaded(true);
        return;
      }
    } catch {}
    setActions(buildDefaultActions(reponses, company, sector));
    setLoaded(true);
  }, [reponses, company, sector]);

  useEffect(() => {
    if (loaded) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(actions)); } catch {}
    }
  }, [actions, loaded]);

  function toggle(id: string) {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
  }

  function addCustom(e: React.FormEvent) {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;
    setActions((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, texte: text, done: false, custom: true },
    ]);
    setNewText('');
  }

  function remove(id: string) {
    setActions((prev) => prev.filter((a) => a.id !== id));
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    setActions((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }

  const doneCount = actions.filter((a) => a.done).length;

  return (
    <BlocAccordeon
      icone="📋"
      titre="Mon plan d'action"
      soustitre={`${doneCount} / ${actions.length} · ${tone.pace}`}
    >
      <p className="mb-3 text-sm text-navy/75">{tone.intro}</p>
      <ul className="space-y-2">
        {actions.map((a, idx) => (
          <li
            key={a.id}
            className={`flex items-start gap-2 rounded-2xl border p-3 transition ${
              a.done
                ? 'border-vert/30 bg-vert/5'
                : 'border-navy/10 bg-white/60'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(a.id)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ${
                a.done
                  ? 'border-vert bg-vert text-white'
                  : 'border-navy/25'
              }`}
              aria-label={a.done ? 'Marquer comme non fait' : 'Marquer comme fait'}
            >
              {a.done ? '✓' : ''}
            </button>
            <span
              className={`flex-1 text-sm ${
                a.done ? 'text-navy/50 line-through' : 'text-navy'
              }`}
            >
              {a.texte}
            </span>
            <div className="flex shrink-0 gap-1">
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => moveUp(idx)}
                  className="rounded px-1 text-xs text-navy/30 hover:text-navy"
                  aria-label="Monter"
                >
                  ↑
                </button>
              )}
              {a.custom && (
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  className="rounded px-1 text-xs text-navy/30 hover:text-rouge"
                  aria-label="Supprimer"
                >
                  ✕
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={addCustom} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Ajouter une action personnelle…"
          className="flex-1 rounded-full border border-navy/10 bg-white/80 px-4 py-2 text-sm focus:border-bleu focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newText.trim()}
          className="rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          +
        </button>
      </form>

      <p className="mt-4 text-xs text-navy/45">
        Ce plan est sauvegardé dans votre navigateur. Réorganisez-le selon
        vos priorités — commencez toujours par prendre soin de vous.
      </p>
      <p className="mt-2 text-xs italic text-navy/55">{tone.rappel}</p>
    </BlocAccordeon>
  );
}
