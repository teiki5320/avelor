import type { CompanyData, Reponses } from '@/lib/types';
import { type EffectifSeuils, getObligationsEffectif } from '@/lib/secteur';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  reponses: Reponses;
  company: CompanyData;
  seuils: EffectifSeuils;
}

export default function BlocObligations({ reponses, company, seuils }: Props) {
  if (reponses.effectif === 'independant' || seuils.approx === 0) return null;

  const obligations = getObligationsEffectif(seuils);
  const atteintes = obligations.filter((o) => o.atteint);
  const prochaines = obligations.filter((o) => !o.atteint).slice(0, 2);

  if (atteintes.length === 0 && prochaines.length === 0) return null;

  return (
    <BlocAccordeon
      icone="📐"
      titre="Vos obligations liées à l'effectif"
      soustitre={`Environ ${seuils.approx} salarié${seuils.approx > 1 ? 's' : ''} · ${atteintes.length} obligation${atteintes.length > 1 ? 's' : ''} à connaître`}
    >
      {atteintes.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-navy/75">
            Ces obligations vous concernent dès aujourd&apos;hui. Elles ont
            un impact direct sur la gestion d&apos;une période difficile
            (CSE à consulter, PSE à prévoir en cas de licenciement…).
          </p>
          {atteintes.map((o, i) => (
            <div
              key={`${o.seuilMin}-${i}`}
              className="rounded-2xl border border-navy/10 bg-white/60 p-4"
            >
              <p className="font-display text-base text-navy">
                <span className="pastille mr-2 text-[10px]">
                  {o.seuilMin}+ salariés
                </span>
                {o.titre}
              </p>
              <p className="mt-2 text-sm text-navy/75">{o.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-navy/70">
          Avec {seuils.approx} salarié{seuils.approx > 1 ? 's' : ''}, peu
          d&apos;obligations collectives s&apos;appliquent aujourd&apos;hui.
        </p>
      )}

      {prochaines.length > 0 && (
        <div className="mt-5 rounded-2xl border border-bleu/20 bg-bleu/5 p-4">
          <p className="font-display text-sm text-bleu-fonce">
            Prochains seuils à surveiller
          </p>
          <ul className="mt-2 space-y-2 text-sm text-navy/80">
            {prochaines.map((o) => (
              <li key={o.seuilMin}>
                <span className="font-medium">{o.seuilMin}+ salariés · </span>
                {o.titre}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-5 text-xs text-navy/50">
        Les seuils sont indicatifs (moyenne sur 12 mois). Certaines
        obligations dépendent de la convention collective — vérifiez avec
        votre expert-comptable ou votre DRH.
      </p>
    </BlocAccordeon>
  );
}
