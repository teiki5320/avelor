import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Vendre ou transmettre votre entreprise · AVELOR',
  description:
    'Cession de fonds de commerce, cession de parts, location-gérance, plan de cession, vente à la barre  -  toutes vos options expliquées simplement.',
};

/* ---------- data ---------- */

type Option = {
  titre: string;
  borderColor: string;
  dotColor: string;
  champs: { label: string; value: string }[];
  conseil: string;
};

const options: Option[] = [
  {
    titre: 'Cession de fonds de commerce',
    borderColor: 'border-vert',
    dotColor: 'bg-vert',
    champs: [
      {
        label: 'Quoi',
        value:
          'Vente de l’activité (clientèle, marque, bail, équipement) à un repreneur.',
      },
      {
        label: 'Quand',
        value:
          'À tout moment, même en difficulté. En procédure collective, nécessite autorisation du juge-commissaire.',
      },
      {
        label: 'Avantages',
        value:
          'Préserve l’activité et les emplois. Le repreneur ne reprend PAS les dettes.',
      },
      {
        label: 'Formalités',
        value:
          'Publication JAL + BODACC. Créanciers ont 10 jours pour s’opposer.',
      },
      {
        label: 'Coût',
        value:
          'Droits d’enregistrement à la charge de l’acheteur (3 % à 5 %).',
      },
    ],
    conseil:
      'Faites évaluer votre fonds par un expert-comptable avant toute négociation.',
  },
  {
    titre: 'Cession de parts sociales',
    borderColor: 'border-bleu',
    dotColor: 'bg-bleu',
    champs: [
      {
        label: 'Quoi',
        value:
          'Vente de vos parts/actions dans la société (SARL, SAS, SA).',
      },
      {
        label: 'Quand',
        value:
          'À tout moment. Respecter les clauses d’agrément des statuts.',
      },
      {
        label: 'Attention',
        value:
          'Ne vous libère PAS de vos cautions personnelles sauf si le repreneur les assume expressément.',
      },
      {
        label: 'Si en difficulté',
        value:
          'La valeur peut être faible voire nulle  -  mais c’est parfois mieux que la liquidation.',
      },
    ],
    conseil:
      'Un avocat doit vérifier que la cession vous libère bien de vos engagements personnels.',
  },
  {
    titre: 'Location-gérance',
    borderColor: 'border-jaune',
    dotColor: 'bg-jaune',
    champs: [
      {
        label: 'Quoi',
        value:
          'Vous restez propriétaire mais un tiers exploite l’entreprise et vous verse un loyer.',
      },
      {
        label: 'Quand',
        value:
          'Alternative à la vente. En procédure, le tribunal peut l’autoriser même contre les clauses du bail.',
      },
      {
        label: 'Avantages',
        value:
          'Revenus sans exploiter. Le locataire-gérant peut devenir acheteur ensuite.',
      },
      {
        label: 'Durée',
        value:
          'Libre. En procédure, la vente doit intervenir dans 2 ans.',
      },
    ],
    conseil:
      'La location-gérance peut être un tremplin vers une vente dans de meilleures conditions.',
  },
  {
    titre: 'Plan de cession (en redressement judiciaire)',
    borderColor: 'border-rouge',
    dotColor: 'bg-rouge',
    champs: [
      {
        label: 'Quoi',
        value:
          'Le tribunal ordonne le transfert de tout ou partie de l’entreprise à un repreneur.',
      },
      {
        label: 'Quand',
        value:
          'Pendant un redressement judiciaire, quand le plan de continuation n’est pas viable.',
      },
      {
        label: 'Le repreneur',
        value:
          'Reprend l’activité et les salariés mais PAS les dettes.',
      },
      {
        label: 'Interdiction',
        value:
          'Le dirigeant NE PEUT PAS racheter sa propre entreprise (art. L642-3 Code de commerce). Ni le conjoint, ni les ascendants/descendants.',
      },
    ],
    conseil:
      'Si un repreneur vous contacte, orientez-le vers le mandataire judiciaire.',
  },
  {
    titre: 'Vente à la barre du tribunal',
    borderColor: 'border-rouge',
    dotColor: 'bg-rouge',
    champs: [
      {
        label: 'Quoi',
        value:
          'Enchères publiques des actifs de l’entreprise ordonnées par le juge-commissaire pendant la liquidation.',
      },
      {
        label: 'Quand',
        value: 'Pendant une liquidation judiciaire.',
      },
      {
        label: 'Prix',
        value:
          'Souvent en dessous de la valeur  -  mais rapide.',
      },
      {
        label: 'Interdiction',
        value:
          'Même interdiction que le plan de cession (dirigeant, conjoint, famille).',
      },
    ],
    conseil:
      'La vente à la barre est la dernière étape  -  explorez toutes les autres options avant.',
  },
];

/* ---------- component ---------- */

export default function VendrePage() {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-6 pb-20 sm:pt-14">
      {/* Header */}
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Vos options
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Vendre, céder ou transmettre
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Vendre n’est pas un échec — c’est parfois la
          meilleure décision pour vous, vos salariés et votre
          famille.
        </p>
      </div>

      {/* Option cards */}
      <div className="mt-12 space-y-8">
        {options.map((o) => (
          <article
            key={o.titre}
            className={`glass card-top-line border-l-4 ${o.borderColor} p-6 sm:p-8`}
          >
            {/* Title with dot */}
            <div className="mb-5 flex items-center gap-3">
              <span
                className={`inline-block h-3 w-3 rounded-full ${o.dotColor}`}
                aria-hidden="true"
              />
              <h2 className="font-display text-xl text-navy sm:text-2xl">
                {o.titre}
              </h2>
            </div>

            {/* Detail fields */}
            <dl className="space-y-3 text-sm">
              {o.champs.map((c) => (
                <div key={c.label}>
                  <dt className="font-semibold text-navy/80">{c.label}</dt>
                  <dd className="mt-0.5 leading-relaxed text-navy/65">
                    {c.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Conseil */}
            <div className="mt-5 flex items-start gap-2 rounded-xl bg-navy/[0.04] px-4 py-3 text-sm leading-relaxed text-navy/75">
              <span className="mt-0.5 shrink-0 font-semibold text-navy/80">
                Conseil :
              </span>
              <span>« {o.conseil} »</span>
            </div>
          </article>
        ))}
      </div>

      {/* Dashed band disclaimer */}
      <div className="dashed-band mt-12 p-6 text-center text-sm leading-relaxed text-navy/70">
        Chaque option a ses conséquences fiscales et sociales. Consultez
        votre expert-comptable et un avocat avant de vous engager.
      </div>

      {/* Bottom links */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href="/courriers" className="btn-ghost">
          Modèles de courriers
        </Link>
        <Link href="/procedures" className="btn-ghost">
          Comprendre les procédures
        </Link>
        <Link href="/parler" className="btn-ghost">
          Parler à quelqu’un
        </Link>
      </div>
    </section>
  );
}
