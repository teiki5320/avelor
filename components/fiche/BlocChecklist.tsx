'use client';
import { useState } from 'react';
import type { Reponses } from '@/lib/types';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  reponses: Reponses;
}

function buildItems(r: Reponses): { id: string; texte: string; lien?: string }[] {
  const items: { id: string; texte: string; lien?: string }[] = [];
  items.push({
    id: 'soin',
    texte: 'Prendre soin de vous',
    lien: 'https://apesa.fr',
  });
  if (r.situation === 'assignation') {
    items.push({ id: 'avocat', texte: 'Contacter un avocat en urgence' });
  }
  if (r.probleme === 'urssaf') {
    items.push({
      id: 'urssaf',
      texte: 'Appeler l\'URSSAF avant toute relance · 36 46',
    });
  }
  if (r.probleme === 'banque') {
    items.push({
      id: 'banque',
      texte: 'Contacter la Banque de France (médiation du crédit)',
    });
  }
  if (r.effectif === 'salaries') {
    items.push({
      id: 'ags',
      texte: 'Vérifier vos obligations AGS (garantie des salaires)',
    });
  }
  items.push({ id: 'cci', texte: 'Prendre RDV avec la CCI' });
  items.push({ id: 'tribunal', texte: 'Identifier votre tribunal de commerce' });
  return items;
}

export default function BlocChecklist({ reponses }: Props) {
  const items = buildItems(reponses);
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
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-bleu-fonce underline underline-offset-2"
                      >
                        {new URL(it.lien).hostname.replace('www.', '')}
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
