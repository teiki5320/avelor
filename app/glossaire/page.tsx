import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Glossaire des procédures · AVELOR',
  description:
    'Les procédures collectives expliquées simplement : mandat ad hoc, conciliation, sauvegarde, redressement, liquidation.',
};

interface Term {
  name: string;
  enClair: string;
  pourQui: string;
  duree: string;
}

const terms: Term[] = [
  {
    name: 'Mandat ad hoc',
    enClair:
      'Un juge désigne quelqu’un (le mandataire ad hoc) pour vous aider à négocier avec vos créanciers. C’est préventif, confidentiel, et personne n’est au courant.',
    pourQui:
      'Un dirigeant qui sent que la situation se complique mais qui peut encore payer ses dettes.',
    duree: 'Pas de limite fixe — en général 2 à 4 mois.',
  },
  {
    name: 'Conciliation',
    enClair:
      'Similaire au mandat ad hoc, mais un peu plus encadré. Un conciliateur est nommé par le tribunal pour trouver un accord avec vos créanciers. C’est confidentiel.',
    pourQui:
      'Un dirigeant en difficulté, avec ou sans cessation des paiements depuis moins de 45 jours.',
    duree: '4 mois maximum, renouvelable une fois (5 mois au total).',
  },
  {
    name: 'Sauvegarde',
    enClair:
      'L’entreprise n’est pas encore en cessation des paiements, mais le dirigeant demande la protection du tribunal. Un plan de restructuration est mis en place.',
    pourQui:
      'Un dirigeant qui anticipe les difficultés et veut se protéger avant qu’il ne soit trop tard.',
    duree:
      'Une période d’observation de 6 mois (renouvelable), puis un plan sur 10 ans maximum.',
  },
  {
    name: 'Redressement judiciaire',
    enClair:
      'L’entreprise est en cessation des paiements. Le tribunal intervient pour tenter de la sauver : maintenir l’activité, les emplois, et apurer les dettes.',
    pourQui:
      'Un dirigeant dont l’entreprise ne peut plus payer ses dettes avec sa trésorerie disponible.',
    duree:
      'Période d’observation de 6 mois (renouvelable jusqu’à 18 mois), puis plan de continuation possible.',
  },
  {
    name: 'Liquidation judiciaire',
    enClair:
      'Quand plus aucune solution n’est possible, l’entreprise est fermée et ses actifs vendus pour rembourser les créanciers. C’est la fin, mais c’est aussi un nouveau départ possible.',
    pourQui:
      'Quand le redressement n’est manifestement pas possible.',
    duree:
      'Variable — quelques mois à plusieurs années selon la complexité.',
  },
  {
    name: 'Plan de continuation',
    enClair:
      'Après un redressement judiciaire, le tribunal valide un plan qui permet à l’entreprise de continuer son activité tout en remboursant ses dettes progressivement.',
    pourQui:
      'Une entreprise en redressement judiciaire qui a démontré sa viabilité.',
    duree: 'Jusqu’à 10 ans pour rembourser les dettes.',
  },
  {
    name: 'Cessation des paiements',
    enClair:
      'C’est le moment où vous ne pouvez plus payer ce que vous devez avec l’argent disponible. Ce n’est pas une faute — c’est une situation juridique précise.',
    pourQui:
      'Tout dirigeant doit déclarer la cessation des paiements dans les 45 jours.',
    duree: 'Ce n’est pas une procédure en soi, mais un constat.',
  },
  {
    name: 'Tribunal de commerce',
    enClair:
      'C’est le tribunal qui gère les litiges entre entreprises et les procédures collectives. Les juges sont eux-mêmes des chefs d’entreprise bénévoles.',
    pourQui:
      'Toute entreprise commerciale confrontée à un litige ou à des difficultés.',
    duree: 'Il n’y a pas de durée — c’est une institution.',
  },
  {
    name: 'Mandataire judiciaire',
    enClair:
      'Un professionnel nommé par le tribunal pour représenter les créanciers pendant la procédure. Il vérifie les créances et défend leurs intérêts.',
    pourQui:
      'Nommé dans toute procédure de sauvegarde, redressement ou liquidation.',
    duree: 'Présent pendant toute la durée de la procédure.',
  },
  {
    name: 'Administrateur judiciaire',
    enClair:
      'Un professionnel nommé par le tribunal pour aider le dirigeant à gérer l’entreprise pendant la procédure. Il peut aussi avoir pour mission de préparer un plan de redressement.',
    pourQui:
      'Nommé dans les procédures de sauvegarde et de redressement judiciaire.',
    duree: 'Présent pendant la période d’observation.',
  },
];

export default function GlossairePage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-6 pb-20 sm:pt-14">
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Glossaire
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Les procédures expliquées simplement
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Pas de jargon. Pas de panique. Juste ce que ça veut dire,
          concrètement.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {terms.map((term) => (
          <article
            key={term.name}
            className="glass card-top-line p-6 sm:p-8"
          >
            <h2 className="font-display text-xl text-navy sm:text-2xl">
              {term.name}
            </h2>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wide text-bleu-fonce/70">
                  En clair :
                </span>
                <p className="mt-1 leading-relaxed text-navy/80">
                  {term.enClair}
                </p>
              </div>

              <div>
                <span className="text-sm font-semibold uppercase tracking-wide text-bleu-fonce/70">
                  Pour qui :
                </span>
                <p className="mt-1 leading-relaxed text-navy/80">
                  {term.pourQui}
                </p>
              </div>

              <div>
                <span className="text-sm font-semibold uppercase tracking-wide text-bleu-fonce/70">
                  Durée :
                </span>
                <p className="mt-1 leading-relaxed text-navy/80">
                  {term.duree}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
