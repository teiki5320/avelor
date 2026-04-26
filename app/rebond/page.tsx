import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rebondir après la difficulté · AVELOR',
  description:
    'Vos droits après une liquidation, rétablissement professionnel, financer votre rebond, fichage bancaire, associations d\'accompagnement.',
};

/* ---------- data ---------- */

type Financement = {
  nom: string;
  description: string;
  tel?: string;
  url?: string;
  urlLabel?: string;
  badge?: string;
};

const financements: Financement[] = [
  {
    nom: 'ADIE (micro-crédit)',
    description:
      'Jusqu’à 17 000 € sur 5 ans. Accessible même si interdit bancaire ou fiché FICP.',
    tel: '0 969 328 110',
    url: 'https://adie.org',
    urlLabel: 'adie.org',
    badge: 'Même interdit bancaire',
  },
  {
    nom: 'France Active',
    description:
      'Garanties de prêts (jusqu’à 65 % du prêt bancaire). Accompagnement.',
    url: 'https://franceactive.org',
    urlLabel: 'franceactive.org',
  },
  {
    nom: 'Prêts d’honneur (Initiative France)',
    description:
      '2 000 à 50 000 € à taux zéro, sans garantie. Avec mentorat.',
    url: 'https://initiative-france.fr',
    urlLabel: 'initiative-france.fr',
    badge: 'Taux zéro',
  },
  {
    nom: 'Prêts d’honneur (Réseau Entreprendre)',
    description:
      'Prêts + accompagnement par des chefs d’entreprise.',
    url: 'https://reseau-entreprendre.org',
    urlLabel: 'reseau-entreprendre.org',
  },
  {
    nom: 'Droit au compte (Banque de France)',
    description:
      'Si toutes les banques refusent de vous ouvrir un compte, la BdF en désigne une qui DOIT le faire. Services de base gratuits.',
    url: 'https://banque-france.fr',
    urlLabel: 'banque-france.fr',
    badge: 'Droit légal',
  },
];

type Association = {
  nom: string;
  description: string;
  url: string;
  urlLabel: string;
  badge?: string;
};

const associations: Association[] = [
  {
    nom: '60 000 Rebonds',
    description:
      'Accompagnement post-dépôt de bilan. Gratuit. 18 mois.',
    url: 'https://60000rebonds.com',
    urlLabel: '60000rebonds.com',
    badge: 'Gratuit · 18 mois',
  },
  {
    nom: 'Second Souffle',
    description:
      'Accompagnement pour entrepreneurs après échec.',
    url: 'https://secondsouffle.org',
    urlLabel: 'secondsouffle.org',
  },
  {
    nom: 'BGE (réseau d’appui)',
    description: 'Conseil en création/reprise.',
    url: 'https://bge.asso.fr',
    urlLabel: 'bge.asso.fr',
  },
];

/* ---------- component ---------- */

export default function RebondPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-6 pb-20 sm:pt-14">
      {/* Header */}
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Nouveau d&eacute;part
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Rebondir
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          La fin d&rsquo;une entreprise n&rsquo;est pas la fin de tout. Des
          milliers de dirigeants recr&eacute;ent chaque ann&eacute;e &mdash; et
          beaucoup r&eacute;ussissent mieux la deuxi&egrave;me fois.
        </p>
      </div>

      {/* Section 1  -  Droits après liquidation */}
      <div className="mt-12 glass card-top-line p-6 sm:p-8">
        <h2 className="font-display text-xl text-navy sm:text-2xl mb-6">
          Apr&egrave;s une liquidation &mdash; vos droits
        </h2>

        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-navy/80">
              Pas d&rsquo;interdiction automatique
            </dt>
            <dd className="mt-0.5 leading-relaxed text-navy/65">
              Sauf sanctions personnelles (interdiction de g&eacute;rer,
              faillite personnelle, banqueroute), vous &ecirc;tes LIBRE de
              recr&eacute;er imm&eacute;diatement apr&egrave;s la cl&ocirc;ture.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-navy/80">
              Interdiction de g&eacute;rer
            </dt>
            <dd className="mt-0.5 leading-relaxed text-navy/65">
              Jusqu&rsquo;&agrave; 15 ans si faute de gestion prouv&eacute;e.
              Tr&egrave;s rare.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-navy/80">
              Faillite personnelle
            </dt>
            <dd className="mt-0.5 leading-relaxed text-navy/65">
              D&eacute;ch&eacute;ance commerciale. Encore plus rare.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-navy/80">
              Cl&ocirc;ture pour insuffisance d&rsquo;actif
            </dt>
            <dd className="mt-0.5 leading-relaxed text-navy/65">
              Comment 97 % des liquidations se terminent. N&rsquo;efface PAS les
              cautions personnelles. Le liquidateur peut engager votre
              responsabilit&eacute; dans les 3 ans si fautes de gestion.
            </dd>
          </div>
        </dl>
      </div>

      {/* Section 2  -  Rétablissement professionnel */}
      <div className="mt-8 glass card-top-line border-l-4 border-vert p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full bg-vert"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            R&eacute;tablissement professionnel (PRP)
          </h2>
        </div>

        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-navy/80">Quoi</dt>
            <dd className="mt-0.5 leading-relaxed text-navy/65">
              Proc&eacute;dure simplifi&eacute;e qui EFFACE vos dettes
              professionnelles SANS passer par une liquidation compl&egrave;te.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-navy/80">Qui</dt>
            <dd className="mt-0.5 leading-relaxed text-navy/65">
              Entrepreneurs individuels uniquement (pas les soci&eacute;t&eacute;s).
              Conditions&nbsp;: cessation des paiements, aucun salari&eacute;,
              actifs &lt;&nbsp;15&nbsp;000&nbsp;&euro; (hors r&eacute;sidence si
              prot&eacute;g&eacute;e), pas de proc&eacute;dure dans les
              5&nbsp;derni&egrave;res ann&eacute;es.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-navy/80">Dur&eacute;e</dt>
            <dd className="mt-0.5 leading-relaxed text-navy/65">
              4 mois maximum.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-navy/80">R&eacute;sultat</dt>
            <dd className="mt-0.5 leading-relaxed text-navy/65">
              Effacement des dettes. Fresh start.
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <a
            href="https://www.service-public.fr"
            target="_blank"
            rel="noreferrer"
            className="text-bleu-fonce underline underline-offset-4"
          >
            service-public.fr
          </a>
          <span className="pastille text-vert">
            Entrepreneur individuel uniquement
          </span>
        </div>
      </div>

      {/* Section 3  -  Financer votre rebond */}
      <div className="mt-8 glass card-top-line p-6 sm:p-8">
        <h2 className="font-display text-xl text-navy sm:text-2xl mb-6">
          Financer votre rebond
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {financements.map((f) => (
            <article
              key={f.nom}
              className="glass-soft flex flex-col p-5"
            >
              {/* Name + badge */}
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-base text-navy">{f.nom}</h3>
                {f.badge && (
                  <span className="pastille text-vert">{f.badge}</span>
                )}
              </div>

              {/* Description */}
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
                {f.description}
              </p>

              {/* Links & phone */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                {f.url && (
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-bleu-fonce underline underline-offset-4"
                  >
                    {f.urlLabel}
                  </a>
                )}
                {f.tel && (
                  <a
                    href={`tel:${f.tel.replace(/\s/g, '')}`}
                    className="pastille"
                  >
                    T&eacute;l&nbsp;: {f.tel}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Section 4  -  Sortir du fichage bancaire */}
      <div className="mt-8 glass card-top-line p-6 sm:p-8">
        <h2 className="font-display text-xl text-navy sm:text-2xl mb-6">
          Sortir du fichage bancaire
        </h2>

        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-navy/80">
              FCC (ch&egrave;ques)
            </dt>
            <dd className="mt-0.5 leading-relaxed text-navy/65">
              Inscription 5 ans max. R&eacute;gularisez l&rsquo;incident
              &rarr;&nbsp;la banque demande la radiation.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-navy/80">
              FICP (cr&eacute;dits)
            </dt>
            <dd className="mt-0.5 leading-relaxed text-navy/65">
              Inscription 5 ans (incidents) ou 7 ans (surendettement). Radiation
              anticip&eacute;e si plan termin&eacute;.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-navy/80">
              Cons&eacute;quence
            </dt>
            <dd className="mt-0.5 leading-relaxed text-navy/65">
              &Ecirc;tre fich&eacute; n&rsquo;interdit PAS l&eacute;galement de
              cr&eacute;er une entreprise, mais rend l&rsquo;acc&egrave;s au
              cr&eacute;dit tr&egrave;s difficile &mdash; d&rsquo;o&ugrave;
              l&rsquo;ADIE et les pr&ecirc;ts d&rsquo;honneur.
            </dd>
          </div>
        </dl>

        <div className="mt-5">
          <a
            href="https://banque-france.fr"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-bleu-fonce underline underline-offset-4"
          >
            banque-france.fr
          </a>
        </div>
      </div>

      {/* Section 5  -  Associations d’accompagnement */}
      <div className="mt-8 glass card-top-line p-6 sm:p-8">
        <h2 className="font-display text-xl text-navy sm:text-2xl mb-6">
          Associations d&rsquo;accompagnement au rebond
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {associations.map((a) => (
            <article key={a.nom} className="glass-soft flex flex-col p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-base text-navy">{a.nom}</h3>
                {a.badge && (
                  <span className="pastille text-vert">{a.badge}</span>
                )}
              </div>

              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
                {a.description}
              </p>

              <div className="mt-4">
                <a
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-bleu-fonce underline underline-offset-4"
                >
                  {a.urlLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Footer quote */}
      <div className="dashed-band mt-12 p-6 text-center text-sm leading-relaxed text-navy/70">
        Le rebond n&rsquo;est pas un mythe. 50 % des dirigeants qui ont
        v&eacute;cu une liquidation recr&eacute;ent dans les 3 ans &mdash; et
        leur deuxi&egrave;me entreprise est souvent plus solide.
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link href="/" className="btn-primary">
          Commencer un nouveau diagnostic &rarr;
        </Link>
      </div>
    </section>
  );
}
