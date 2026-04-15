import type { CompanyData } from '@/lib/types';
import { yearFromDate } from '@/lib/sirene';

interface Props {
  company: CompanyData;
}

export default function IdentiteCard({ company }: Props) {
  const year = yearFromDate(company.dateCreation);
  return (
    <section className="glass card-top-line p-6 sm:p-10">
      <h2 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
        {company.nom}
      </h2>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy/60">
        <span>SIRET · {company.siret}</span>
        <span>
          Département · {company.departement}
          {company.ville ? ` · ${company.ville}` : ''}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {company.formeJuridique && (
          <span className="pastille">⚖️ {company.formeJuridique}</span>
        )}
        {company.naf && (
          <span className="pastille">🏷 NAF {company.naf}</span>
        )}
        {year !== '—' && <span className="pastille">📅 Depuis {year}</span>}
        {company.effectif && (
          <span className="pastille">👥 {company.effectif}</span>
        )}
      </div>
      <div className="mt-8 rounded-2xl bg-gradient-to-br from-bleu/5 to-bleu-fonce/5 p-5 text-sm text-navy/80 sm:text-base">
        <p className="font-display text-lg text-bleu-fonce sm:text-xl">
          Votre fiche est prête.
        </p>
        <p className="mt-2">
          Prenez le temps de la lire. Vous n&apos;avez pas à tout résoudre
          aujourd&apos;hui — commencez par une seule chose.
        </p>
      </div>
    </section>
  );
}
