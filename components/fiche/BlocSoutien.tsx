import type { Reponses } from '@/lib/types';
import type { SectorInfo } from '@/lib/secteur';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  reponses: Reponses;
  sector: SectorInfo;
}

export default function BlocSoutien({ reponses, sector }: Props) {
  const epuise = reponses.moral === 'epuise' || reponses.moral === 'perdu';

  const message = epuise
    ? 'Ce que vous ressentez est légitime. Beaucoup de dirigeants traversent cette épreuve, et la plupart s\'en sortent mieux qu\'ils ne le croient — souvent parce qu\'ils ont osé demander de l\'aide. Vous venez de le faire.'
    : 'Diriger une entreprise en difficulté, c\'est porter beaucoup, souvent seul. Les personnes ci-dessous sont là pour vous — gratuitement et en confidentialité.';

  const hasSectorSoutien = !!sector.soutien;

  return (
    <BlocAccordeon
      icone="🤝"
      titre="Vous n'êtes pas seul·e"
      soustitre="Soutien humain, avant tout"
    >
      <p className="text-navy/80">{message}</p>
      <div className={`mt-5 grid gap-3 ${hasSectorSoutien ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
        {hasSectorSoutien && (
          <a
            href={sector.soutien!.site ?? sector.soutien!.telephone ? `tel:${sector.soutien!.telephone!.replace(/\s/g, '')}` : '#'}
            target={sector.soutien!.site ? '_blank' : undefined}
            rel={sector.soutien!.site ? 'noreferrer' : undefined}
            className="glass-soft block border-l-4 border-l-vert p-4 transition hover:bg-white"
          >
            <p className="font-display text-lg text-navy">{sector.soutien!.nom}</p>
            <p className="mt-1 text-xs text-navy/60">{sector.soutien!.description}</p>
            {sector.soutien!.telephone && (
              <p className="mt-2 text-sm text-vert font-medium">{sector.soutien!.telephone}</p>
            )}
            <span className="pastille mt-2 text-[10px]">Spécifique {sector.label}</span>
          </a>
        )}
        <a
          href="https://apesa.fr"
          target="_blank"
          rel="noreferrer"
          className="glass-soft block p-4 transition hover:bg-white"
        >
          <p className="font-display text-lg text-navy">APESA</p>
          <p className="mt-1 text-xs text-navy/60">
            Soutien psychologique pour dirigeants en détresse
          </p>
          <p className="mt-3 text-sm text-bleu-fonce">apesa.fr →</p>
        </a>
        <a
          href="https://www.60000rebonds.com"
          target="_blank"
          rel="noreferrer"
          className="glass-soft block p-4 transition hover:bg-white"
        >
          <p className="font-display text-lg text-navy">60&nbsp;000 Rebonds</p>
          <p className="mt-1 text-xs text-navy/60">
            Accompagnement après un dépôt de bilan
          </p>
          <p className="mt-3 text-sm text-bleu-fonce">60000rebonds.com →</p>
        </a>
        <a
          href="tel:3114"
          className="glass-soft block p-4 transition hover:bg-white"
        >
          <p className="font-display text-lg text-navy">3114</p>
          <p className="mt-1 text-xs text-navy/60">
            Numéro national de prévention du suicide · 24/7 · gratuit
          </p>
          <p className="mt-3 text-sm text-bleu-fonce">Appeler 3114 →</p>
        </a>
      </div>
      <p className="mt-5 text-xs text-navy/50">
        Ces services sont gratuits et confidentiels. Ils sont tenus au secret
        professionnel.
      </p>
    </BlocAccordeon>
  );
}
