import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aides financières d’urgence · AVELOR',
  description:
    'Annuaire des aides financières d’urgence pour dirigeants en difficulté : BPI France, médiation du crédit, activité partielle, aides régionales.',
};

/* ---------- data ---------- */

type Aide = {
  nom: string;
  description: string;
  url?: string;
  urlLabel?: string;
  tel?: string;
  gratuit?: boolean;
};

type Section = {
  titre: string;
  colorBorder: string;
  colorDot: string;
  aides: Aide[];
};

const sections: Section[] = [
  {
    titre: 'Aides nationales',
    colorBorder: 'border-bleu-fonce',
    colorDot: 'bg-bleu-fonce',
    aides: [
      {
        nom: 'BPI France — Prêt rebond',
        description:
          'Prêt sans garantie de 10 K à 300 K€ pour TPE/PME en difficulté',
        url: 'https://bpifrance.fr',
        urlLabel: 'bpifrance.fr',
        tel: '3247',
      },
      {
        nom: 'Médiation du crédit',
        description:
          'Si votre banque refuse un prêt ou réduit votre découvert',
        url: 'https://mediateur-credit.banque-france.fr',
        urlLabel: 'mediateur-credit.banque-france.fr',
        gratuit: true,
      },
      {
        nom: 'Médiateur des entreprises',
        description: 'Litiges avec fournisseurs ou clients',
        url: 'https://economie.gouv.fr/mediateur-des-entreprises',
        urlLabel: 'economie.gouv.fr/mediateur-des-entreprises',
        gratuit: true,
      },
      {
        nom: 'CCSF',
        description:
          'Échelonnement de vos dettes fiscales et sociales en une seule demande',
        url: 'https://impots.gouv.fr',
        urlLabel: 'impots.gouv.fr',
      },
    ],
  },
  {
    titre: 'Aides pour indépendants',
    colorBorder: 'border-vert',
    colorDot: 'bg-vert',
    aides: [
      {
        nom: 'CPAM / SSI Action sociale',
        description:
          'Aide financière d’urgence pour indépendants (jusqu’à 3 000 €)',
        url: 'https://secu-independants.fr',
        urlLabel: 'secu-independants.fr',
        tel: '36 46',
      },
      {
        nom: 'Fonds d’action sociale URSSAF',
        description: 'Prise en charge partielle de cotisations',
        url: 'https://urssaf.fr',
        urlLabel: 'urssaf.fr',
      },
      {
        nom: 'RSA / ASS',
        description:
          'Si votre revenu d’activité est nul ou très faible',
        url: 'https://caf.fr',
        urlLabel: 'caf.fr',
      },
    ],
  },
  {
    titre: 'Aides pour employeurs',
    colorBorder: 'border-jaune',
    colorDot: 'bg-jaune',
    aides: [
      {
        nom: 'Activité partielle',
        description:
          'Indemnisation des salariés si baisse d’activité',
        url: 'https://asp-public.fr',
        urlLabel: 'asp-public.fr',
      },
      {
        nom: 'AGS',
        description:
          'Garantie des salaires si redressement/liquidation',
        url: 'https://ags-garantie-salaires.org',
        urlLabel: 'ags-garantie-salaires.org',
      },
      {
        nom: 'FNE-Formation',
        description:
          'Financement de formations pour vos salariés pendant la difficulté',
        url: 'https://travail-emploi.gouv.fr',
        urlLabel: 'travail-emploi.gouv.fr',
      },
    ],
  },
  {
    titre: 'Aides régionales',
    colorBorder: 'border-bleu',
    colorDot: 'bg-bleu',
    aides: [
      {
        nom: 'Votre région',
        description:
          'Chaque région propose des aides spécifiques (fonds d’urgence, prêts d’honneur, accompagnement). Contactez votre CCI locale pour connaître les dispositifs de votre territoire.',
      },
    ],
  },
];

/* ---------- component ---------- */

export default function AidesPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-6 pb-20 sm:pt-14">
      {/* Header */}
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Vos droits
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Aides financi&egrave;res d&rsquo;urgence
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Beaucoup de dirigeants ignorent qu&rsquo;ils ont droit &agrave; ces
          aides. V&eacute;rifiez.
        </p>
      </div>

      {/* Sections */}
      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <div key={s.titre} className="glass card-top-line p-6 sm:p-8">
            {/* Section title */}
            <div className="mb-6 flex items-center gap-3">
              <span
                className={`inline-block h-3 w-3 rounded-full ${s.colorDot}`}
                aria-hidden="true"
              />
              <h2 className="font-display text-xl text-navy sm:text-2xl">
                {s.titre}
              </h2>
            </div>

            {/* Aide cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {s.aides.map((a) => (
                <article
                  key={a.nom}
                  className={`glass-soft border-l-4 ${s.colorBorder} flex flex-col p-5`}
                >
                  {/* Name + gratuit badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base text-navy">
                      {a.nom}
                    </h3>
                    {a.gratuit && (
                      <span className="pastille text-vert">Gratuit</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
                    {a.description}
                  </p>

                  {/* Links & phone */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    {a.url && (
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-bleu-fonce underline underline-offset-4"
                      >
                        {a.urlLabel}
                      </a>
                    )}
                    {a.tel && (
                      <a
                        href={`tel:${a.tel.replace(/\s/g, '')}`}
                        className="pastille"
                      >
                        Tel&nbsp;: {a.tel}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* CCI button for regional section */}
            {s.titre === 'Aides régionales' && (
              <div className="mt-6 text-center">
                <a
                  href="https://cci.fr"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Trouver ma CCI &rarr; cci.fr
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="dashed-band mt-12 p-6 text-center text-sm leading-relaxed text-navy/70">
        Ces aides &eacute;voluent. V&eacute;rifiez les conditions actuelles
        directement aupr&egrave;s de chaque organisme.
      </div>
    </section>
  );
}
