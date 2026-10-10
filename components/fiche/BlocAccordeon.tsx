'use client';
import { useId, useState } from 'react';
import { m } from 'framer-motion';

interface Props {
  icone: string;
  titre: string;
  soustitre?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/**
 * Accordéon de la fiche.
 * - Le titre est un <h3> contenant le <button> (motif « accordion » WAI-ARIA).
 * - La région pilotée par aria-controls existe toujours : elle est seulement
 *   `hidden` quand le bloc est fermé. Son contenu est donc présent dans la
 *   page et la feuille d'impression (app/globals.css, @media print) le
 *   réaffiche : « Imprimer / enregistrer en PDF » imprime toute la fiche.
 */
export default function BlocAccordeon({
  icone,
  titre,
  soustitre,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const panelId = `panel-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const buttonId = `${panelId}-titre`;

  return (
    <section className="accordeon glass card-top-line overflow-hidden">
      <h3 className="m-0 font-sans text-base font-normal tracking-normal">
        <button
          type="button"
          id={buttonId}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-8"
        >
          <span className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>
              {icone}
            </span>
            <span>
              <span className="block font-display text-lg text-navy sm:text-xl">
                {titre}
              </span>
              {soustitre && (
                <span className="mt-0.5 block text-sm text-navy/55">
                  {soustitre}
                </span>
              )}
            </span>
          </span>
          <m.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="accordeon-chevron text-navy/50"
            aria-hidden
          >
            ↓
          </m.span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="accordeon-panel"
      >
        <m.div
          initial={false}
          animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="accordeon-contenu overflow-hidden"
        >
          <div className="border-t border-navy/5 px-6 py-6 sm:px-8">{children}</div>
        </m.div>
      </div>
    </section>
  );
}
