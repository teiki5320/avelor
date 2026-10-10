'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

export default function BlocAlertes() {
  const { bodacc, infogreffe, bodaccIndisponible } = useFiche();
  const tout = [...infogreffe, ...bodacc];
  const aucun = tout.length === 0;
  // BODACC injoignable : l'absence d'annonce ne prouve rien.
  const nonVerifie = aucun && !!bodaccIndisponible;

  return (
    <BlocAccordeon
      icone="⚠️"
      titre="Signaux détectés"
      soustitre={
        nonVerifie
          ? 'Vérification impossible pour le moment'
          : aucun
            ? 'Aucun signal récent — plutôt bon signe'
            : `${tout.length} signaux publics`
      }
    >
      {nonVerifie ? (
        <div className="glass-soft p-4 text-sm text-navy/70">
          Les registres publics n&apos;ont pas pu être consultés pour le moment :
          nous ne pouvons pas dire si une annonce concerne votre entreprise.
          Vérifiez directement sur bodacc.fr (recherche par numéro SIREN) ou
          rechargez la fiche plus tard.
          <p className="mt-2 text-xs text-navy/45">
            Source non joignable · BODACC (bodacc.fr)
          </p>
        </div>
      ) : aucun ? (
        <div className="glass-soft p-4 text-sm text-navy/70">
          Aucune annonce récente n&apos;a été trouvée dans les registres publics
          concernant votre SIRET. Ce n&apos;est jamais une garantie absolue,
          mais c&apos;est un signal positif.
          <p className="mt-2 text-xs text-navy/45">
            Sources consultées · BODACC (bodacc.fr) · Infogreffe
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tout.map((s, i) => (
            <li
              key={i}
              className="rounded-2xl border border-navy/10 bg-white/60 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-navy">{s.type}</p>
                  {s.description && (
                    <p className="mt-1 text-sm text-navy/70">{s.description}</p>
                  )}
                  {s.tribunal && (
                    <p className="mt-1 text-xs text-navy/55">
                      Tribunal · {s.tribunal}
                    </p>
                  )}
                </div>
                <span className="pastille text-xs">{s.date}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-navy/45">
        Source · BODACC / Infogreffe — registres publics officiels.
      </p>
    </BlocAccordeon>
  );
}
