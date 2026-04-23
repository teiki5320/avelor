import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Protéger votre famille et votre patrimoine · AVELOR',
  description:
    'Résidence principale, régime matrimonial, cautions personnelles, protection des enfants : tout ce qu’il faut savoir pour protéger votre famille.',
};

/* ---------- checklist data ---------- */

const checklist = [
  {
    label: 'Vérifier mon régime matrimonial',
    url: 'https://notaires.fr',
    urlLabel: 'notaires.fr',
  },
  {
    label: 'Faire vérifier mes cautions par un avocat',
    url: null,
    urlLabel: null,
  },
  {
    label: 'Consulter un notaire pour protéger mon patrimoine',
    url: null,
    urlLabel: null,
  },
  {
    label: 'Demander la CSS si mes revenus ont baissé',
    url: 'https://complementaire-sante-solidaire.gouv.fr',
    urlLabel: 'complementaire-sante-solidaire.gouv.fr',
  },
];

/* ---------- component ---------- */

export default function ProtegerFamillePage() {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-6 pb-20 sm:pt-14">
      {/* Header */}
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Patrimoine &amp; famille
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Prot&eacute;ger votre famille
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Quand l&rsquo;entreprise vacille, la premi&egrave;re question est
          souvent&nbsp;: qu&rsquo;est-ce que ma famille risque&nbsp;? Voici les
          r&eacute;ponses.
        </p>
      </div>

      {/* ---- Section 1 : Résidence principale ---- */}
      <div className="mt-12 glass card-top-line p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full bg-vert"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            Votre r&eacute;sidence principale
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="glass-soft border-l-4 border-vert flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Entrepreneur individuel (EI)
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Depuis la loi Macron 2015, la r&eacute;sidence principale est
              <strong className="text-navy/80"> AUTOMATIQUEMENT </strong>
              prot&eacute;g&eacute;e contre les cr&eacute;anciers professionnels.
              Aucune d&eacute;marche n&eacute;cessaire.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-vert flex flex-col p-5">
            <h3 className="font-display text-base text-navy">EIRL</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Supprim&eacute; en 2022. Tous les EI b&eacute;n&eacute;ficient
              d&eacute;sormais de la s&eacute;paration automatique des patrimoines
              &mdash; plus besoin de ce statut.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-vert flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Soci&eacute;t&eacute; (SARL, SAS, SA)
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              La r&eacute;sidence n&rsquo;est
              <strong className="text-navy/80"> PAS </strong>
              automatiquement prot&eacute;g&eacute;e. La protection d&eacute;pend
              de votre r&eacute;gime matrimonial et des cautions que vous avez
              sign&eacute;es.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-vert flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              D&eacute;claration d&rsquo;insaisissabilit&eacute;
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Existe encore pour les <strong className="text-navy/80">AUTRES</strong> biens
              immobiliers (pas la r&eacute;sidence). Doit &ecirc;tre faite chez le
              notaire. Ne prot&egrave;ge que contre les dettes
              POST&Eacute;RIEURES &agrave; la d&eacute;claration.
            </p>
          </article>
        </div>
      </div>

      {/* ---- Section 2 : Régime matrimonial ---- */}
      <div className="mt-10 glass card-top-line p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full bg-jaune"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            Votre r&eacute;gime matrimonial
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="glass-soft border-l-4 border-jaune flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Communaut&eacute; l&eacute;gale (d&eacute;faut)
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Les biens communs
              <strong className="text-navy/80"> PEUVENT </strong>
              &ecirc;tre saisis pour payer les dettes de l&rsquo;entreprise.
              Risque r&eacute;el pour le conjoint.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-jaune flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              S&eacute;paration de biens
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Seuls VOS biens personnels sont &agrave; risque. Ceux du conjoint sont
              prot&eacute;g&eacute;s &mdash; sauf s&rsquo;il a co-sign&eacute; une
              caution.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-jaune flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Changement de r&eacute;gime
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Possible par acte notari&eacute; (1&nbsp;500 &agrave;
              3&nbsp;000&nbsp;&euro;).
              <strong className="text-navy/80"> ATTENTION&nbsp;:</strong> doit
              &ecirc;tre fait AVANT les difficult&eacute;s &mdash; un changement
              effectu&eacute; pour frauder les cr&eacute;anciers peut &ecirc;tre
              annul&eacute; par le juge.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-jaune flex flex-col p-5">
            <h3 className="font-display text-base text-navy">D&eacute;lai</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Depuis 2019, il n&rsquo;y a plus de d&eacute;lai d&rsquo;attente de
              2&nbsp;ans pour changer de r&eacute;gime matrimonial. La
              proc&eacute;dure est donc plus rapide qu&rsquo;avant.
            </p>
          </article>
        </div>
      </div>

      {/* ---- Section 3 : Cautions personnelles ---- */}
      <div className="mt-10 glass card-top-line p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full bg-rouge"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            Cautions personnelles
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="glass-soft border-l-4 border-rouge flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Ce que c&rsquo;est
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Un engagement personnel &agrave; payer les dettes de
              l&rsquo;entreprise avec VOS biens. Cet engagement
              <strong className="text-navy/80"> survit &agrave; la liquidation </strong>
              de l&rsquo;entreprise.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-rouge flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Peut-on les contester&nbsp;?
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              <strong className="text-vert">OUI</strong> si disproportionn&eacute;e
              par rapport &agrave; vos revenus et patrimoine au moment de la
              signature (art.&nbsp;2297 Code civil).
              <strong className="text-vert"> OUI</strong> si le formalisme n&rsquo;a
              pas &eacute;t&eacute; respect&eacute; (mentions manuscrites).
            </p>
          </article>

          <article className="glass-soft border-l-4 border-rouge flex flex-col p-5">
            <h3 className="font-display text-base text-navy">Le conjoint</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Si le conjoint n&rsquo;a PAS co-sign&eacute;, ses biens personnels
              sont prot&eacute;g&eacute;s &mdash; m&ecirc;me en communaut&eacute;,
              seuls les biens propres du signataire sont &agrave; risque selon la
              jurisprudence.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-rouge flex flex-col p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base text-navy">Conseil</h3>
              <span className="pastille text-rouge">Important</span>
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Faites v&eacute;rifier
              <strong className="text-navy/80"> TOUTES </strong>
              vos cautions par un avocat &mdash; beaucoup sont contestables.
            </p>
          </article>
        </div>
      </div>

      {/* ---- Section 4 : Protection des enfants ---- */}
      <div className="mt-10 glass card-top-line p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full bg-bleu"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            Protection des enfants
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="glass-soft border-l-4 border-bleu flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Donation-partage
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Possible pour transf&eacute;rer des actifs aux enfants,
              <strong className="text-navy/80"> MAIS </strong>
              attention &agrave; l&rsquo;action paulienne &mdash; tout transfert
              dans les 18&nbsp;mois pr&eacute;c&eacute;dant la cessation des
              paiements peut &ecirc;tre annul&eacute; par le tribunal.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-bleu flex flex-col p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base text-navy">Conseil</h3>
              <span className="pastille text-bleu">Anticipez</span>
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Ne PAS transf&eacute;rer d&rsquo;actifs une fois les
              difficult&eacute;s commenc&eacute;es. Consultez un notaire
              <strong className="text-navy/80"> EN AMONT</strong>.
            </p>
          </article>
        </div>
      </div>

      {/* ---- Section 5 : Que faire concrètement ---- */}
      <div className="mt-10 glass card-top-line p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full bg-bleu-fonce"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            Que faire concr&egrave;tement
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {checklist.map((item) => (
            <article
              key={item.label}
              className="glass-soft border-l-4 border-bleu-fonce flex flex-col p-5"
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-bleu-fonce/40"
                  aria-hidden="true"
                />
                <h3 className="font-display text-base text-navy">
                  {item.label}
                </h3>
              </div>
              {item.url && (
                <div className="mt-3 pl-8 text-sm">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-bleu-fonce underline underline-offset-4"
                  >
                    {item.urlLabel}
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="dashed-band mt-12 p-6 text-center text-sm leading-relaxed text-navy/70">
        La protection du patrimoine familial est un sujet technique. Un notaire et
        un avocat peuvent vous conseiller &mdash; la premi&egrave;re consultation
        est souvent gratuite.
      </div>
    </section>
  );
}
