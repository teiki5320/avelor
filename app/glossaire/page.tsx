import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Glossaire des procédures · AVELOR',
  description:
    'Les procédures collectives expliquées simplement : mandat ad hoc, conciliation, sauvegarde, redressement, liquidation, PRP, cession.',
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
      "Un juge désigne quelqu'un (le mandataire ad hoc) pour vous aider à négocier avec vos créanciers. C'est préventif, confidentiel, et personne n'est au courant.",
    pourQui:
      'Un dirigeant qui sent que la situation se complique mais qui peut encore payer ses dettes.',
    duree: 'Pas de limite fixe — en général 2 à 4 mois.',
  },
  {
    name: 'Conciliation',
    enClair:
      "Similaire au mandat ad hoc, mais un peu plus encadré. Un conciliateur est nommé par le tribunal pour trouver un accord avec vos créanciers. C'est confidentiel.",
    pourQui:
      "Un dirigeant en difficulté, avec ou sans cessation des paiements depuis moins de 45 jours.",
    duree: '4 mois, prolongeable 1 mois.',
  },
  {
    name: 'Sauvegarde',
    enClair:
      "Le tribunal vous protège de vos créanciers pendant que vous restructurez. Vous gardez le contrôle de l'entreprise, avec l'aide d'un administrateur.",
    pourQui:
      "Un dirigeant qui n'est PAS encore en cessation des paiements, mais qui ne peut pas surmonter ses difficultés seul.",
    duree: '6 mois, renouvelable 6 mois.',
  },
  {
    name: 'Sauvegarde accélérée',
    enClair:
      "Version express de la sauvegarde, qui intervient après une conciliation. Le tribunal impose un plan aux créanciers récalcitrants en quelques semaines.",
    pourQui:
      "Entreprises de plus de 20 salariés OU 3 M€ de CA. Doit avoir été en conciliation d'abord.",
    duree: '2 mois (prolongeable à 4 mois).',
  },
  {
    name: 'Redressement judiciaire',
    enClair:
      "Vous êtes en cessation des paiements. Le tribunal tente de sauver l'entreprise en mettant en place un plan. Un administrateur est nommé pour vous aider (ou vous remplacer dans les cas graves).",
    pourQui:
      "Un dirigeant en cessation des paiements, dont l'entreprise peut encore être sauvée.",
    duree: '6 mois, renouvelable 6 mois.',
  },
  {
    name: 'Liquidation judiciaire',
    enClair:
      "Quand le redressement n'est pas possible. L'activité s'arrête, les actifs sont vendus pour payer les créanciers. Un liquidateur gère tout.",
    pourQui:
      "Quand l'entreprise ne peut manifestement pas être sauvée.",
    duree: 'Variable — de 6 mois à plusieurs années.',
  },
  {
    name: 'Liquidation judiciaire simplifiée',
    enClair:
      "Version plus rapide et moins coûteuse de la liquidation, pour les petites entreprises. Même effet, procédure allégée.",
    pourQui:
      "Obligatoire si : pas d'immobilier, 1 salarié ou moins, CA inférieur à 300 000 €. Optionnelle si 5 salariés ou moins et CA inférieur à 750 000 €.",
    duree: '6 à 12 mois (contre plusieurs années pour une liquidation classique).',
  },
  {
    name: 'Plan de continuation',
    enClair:
      "Après un redressement judiciaire, le tribunal valide un plan pour rembourser les dettes sur plusieurs années tout en poursuivant l'activité.",
    pourQui:
      "Entreprises en redressement judiciaire dont l'activité est viable.",
    duree: "Jusqu'à 10 ans.",
  },
  {
    name: 'Plan de cession',
    enClair:
      "Le tribunal ordonne le transfert de l'entreprise à un repreneur. L'activité et les emplois sont préservés — les dettes restent dans l'ancienne structure.",
    pourQui:
      "En redressement judiciaire, quand un plan de continuation n'est pas viable mais que l'activité mérite d'être sauvée.",
    duree: 'Variable — dépend des offres de reprise.',
  },
  {
    name: 'Rétablissement professionnel (PRP)',
    enClair:
      "Procédure simplifiée qui efface vos dettes professionnelles SANS passer par une liquidation complète. Un vrai nouveau départ, rapide et discret.",
    pourQui:
      "Entrepreneurs individuels uniquement (pas les sociétés). Conditions : cessation des paiements, aucun salarié, actifs inférieurs à 15 000 €.",
    duree: '4 mois maximum.',
  },
  {
    name: 'Clôture pour insuffisance d’actif',
    enClair:
      "Comment 97 % des liquidations se terminent : quand il n'y a plus assez d'actifs pour payer toutes les dettes. Ce n'est pas une sanction — c'est simplement la fin de la procédure.",
    pourQui:
      "Toute entreprise en liquidation dont les actifs sont épuisés.",
    duree: 'Intervient quand le liquidateur a réalisé tous les actifs.',
  },
  {
    name: 'Cessation des paiements',
    enClair:
      "Définition légale : vous ne pouvez plus payer vos dettes avec l'argent dont vous disposez immédiatement. Vous avez 45 jours pour le déclarer au tribunal.",
    pourQui:
      "Toute entreprise qui ne peut plus faire face à son passif exigible avec son actif disponible.",
    duree: 'Ce n’est pas une procédure — c’est un état.',
  },
  {
    name: 'Tribunal de commerce',
    enClair:
      "Le tribunal spécialisé dans les litiges entre commerçants et les procédures collectives. Les juges sont eux-mêmes des chefs d'entreprise bénévoles.",
    pourQui:
      "Toute entreprise commerciale confrontée à un litige ou à des difficultés.",
    duree: "Il n'y a pas de durée — c'est une institution.",
  },
  {
    name: 'Mandataire judiciaire',
    enClair:
      "Un professionnel nommé par le tribunal pour représenter les créanciers pendant la procédure. Il vérifie les créances et défend leurs intérêts.",
    pourQui:
      "Nommé dans toute procédure de sauvegarde, redressement ou liquidation.",
    duree: 'Présent pendant toute la durée de la procédure.',
  },
  {
    name: 'Administrateur judiciaire',
    enClair:
      "Un professionnel nommé par le tribunal pour aider le dirigeant à gérer l'entreprise pendant la procédure. Il peut aussi préparer un plan de redressement.",
    pourQui:
      'Nommé dans les procédures de sauvegarde et de redressement judiciaire.',
    duree: "Présent pendant la période d'observation.",
  },
  {
    name: 'Caution personnelle',
    enClair:
      "Engagement personnel du dirigeant à payer les dettes de l'entreprise avec ses propres biens. Survit à la liquidation de l'entreprise. Peut être contestée si disproportionnée.",
    pourQui:
      "Tout dirigeant qui a signé une garantie personnelle auprès d'une banque ou d'un bailleur.",
    duree: 'Dure tant que la dette garantie existe.',
  },
  {
    name: 'CODEFI',
    enClair:
      "Comité départemental qui aide les entreprises de moins de 400 salariés en difficulté de financement. Peut négocier avec vos créanciers et débloquer des aides.",
    pourQui:
      "Entreprises de moins de 400 salariés, tous secteurs. Accès via la Préfecture ou la DREETS.",
    duree: "Accompagnement sur mesure, pas de durée fixe.",
  },
  {
    name: 'CIP (Centre d’Information sur la Prévention)',
    enClair:
      "Réseau de 60 centres locaux qui informent gratuitement et confidentiellement les dirigeants sur les options de prévention. Animé par des bénévoles (anciens chefs d'entreprise, avocats, comptables).",
    pourQui:
      "Tout dirigeant inquiet pour son entreprise, à n'importe quel stade.",
    duree: 'Rendez-vous ponctuel, gratuit.',
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
          Les proc&eacute;dures expliqu&eacute;es simplement
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Pas de jargon. Pas de panique. Juste ce que &ccedil;a veut dire,
          concr&egrave;tement.
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
                  Dur&eacute;e :
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
