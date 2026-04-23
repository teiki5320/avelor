'use client';
import { useState } from 'react';
import type { Reponses, CompanyData } from '@/lib/types';
import type { SectorInfo } from '@/lib/secteur';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  reponses: Reponses;
  company: CompanyData;
  sector: SectorInfo;
}

function buildItems(r: Reponses, c: CompanyData, s: SectorInfo): { id: string; texte: string; lien?: string }[] {
  const items: { id: string; texte: string; lien?: string }[] = [];
  const dep = c.departement || '';
  const ville = c.ville || '';

  items.push({
    id: 'soin',
    texte: 'Prendre soin de vous',
    lien: 'https://apesa.fr',
  });
  if (r.situation === 'assignation') {
    items.push({ id: 'avocat', texte: `Contacter un avocat en urgence${ville ? ` à ${ville}` : ''}` });
  }
  if (r.probleme === 'urssaf') {
    items.push({
      id: 'urssaf',
      texte: `Appeler ${s.cotisationOrg}${dep ? ` (${dep})` : ''} avant toute relance · ${s.cotisationTel}`,
    });
  }
  if (r.probleme === 'banque') {
    items.push({
      id: 'banque',
      texte: `Contacter la Banque de France${dep ? ` (${dep})` : ''} — médiation du crédit`,
    });
  }
  if (r.probleme === 'impots') {
    items.push({
      id: 'impots',
      texte: `Contacter le SIE${ville ? ` de ${ville}` : ''} pour un délai de paiement`,
    });
  }
  if (r.effectif === 'salaries') {
    items.push({
      id: 'ags',
      texte: 'Vérifier vos obligations AGS (garantie des salaires)',
    });
  }
  items.push({
    id: 'chambre',
    texte: `Prendre RDV avec la ${s.chambre}${dep ? ` (${dep})` : ''}`,
  });
  if (s.syndicats.length > 0) {
    items.push({
      id: 'syndicat',
      texte: `Contacter ${s.syndicats[0].nom} (${s.syndicats[0].role})`,
      lien: s.syndicats[0].site,
    });
  }
  items.push({
    id: 'tribunal',
    texte: `Identifier votre tribunal de commerce${ville ? ` (${ville})` : ''}`,
  });
  items.push({
    id: 'courrier',
    texte: 'Préparer un courrier adapté à votre situation',
    lien: `/courriers?prefill=${encodeURIComponent(JSON.stringify({ NOM_ENTREPRISE: c.nom, SIRET: c.siret, ADRESSE: [c.adresse, c.codePostal, c.ville].filter(Boolean).join(', '), VILLE: c.ville }))}`,
  });
  return items;
}

export default function BlocChecklist({ reponses, company, sector }: Props) {
  const items = buildItems(reponses, company, sector);
  const [done, setDone] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setDone((d) => ({ ...d, [id]: !d[id] }));
  }

  const completed = Object.values(done).filter(Boolean).length;

  return (
    <BlocAccordeon
      icone="✓"
      titre="Votre checklist"
      soustitre={`${completed} / ${items.length} · à votre rythme`}
    >
      <ul className="space-y-2.5">
        {items.map((it) => {
          const checked = !!done[it.id];
          return (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => toggle(it.id)}
                className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                  checked
                    ? 'border-vert/30 bg-vert/5'
                    : 'border-navy/10 bg-white/60 hover:bg-white'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    checked
                      ? 'border-vert bg-vert text-white'
                      : 'border-navy/25'
                  }`}
                  aria-hidden
                >
                  {checked ? '✓' : ''}
                </span>
                <span
                  className={`text-sm sm:text-base ${
                    checked ? 'text-navy/50 line-through' : 'text-navy'
                  }`}
                >
                  {it.texte}
                  {it.lien && (
                    <>
                      {' · '}
                      <a
                        href={it.lien}
                        target={it.lien.startsWith('/') ? undefined : '_blank'}
                        rel={it.lien.startsWith('/') ? undefined : 'noreferrer'}
                        onClick={(e) => e.stopPropagation()}
                        className="text-bleu-fonce underline underline-offset-2"
                      >
                        {it.lien.startsWith('/') ? 'Voir les modèles' : new URL(it.lien).hostname.replace('www.', '')}
                      </a>
                    </>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </BlocAccordeon>
  );
}
