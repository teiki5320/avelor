import { ogMeta } from '@/lib/og';

export const metadata = ogMeta({
  titre: 'Le glossaire, expliqué simplement',
  sous: 'Procédures, dispositifs, sigles — sans jargon',
  description:
    'Les procédures collectives et dispositifs expliqués simplement : mandat ad hoc, conciliation, sauvegarde, RJ, LJ, PRP, PGE, CCSF, AGS, CSP, ATI…',
  cat: 'procedure',
  pageTitle: 'Glossaire des procédures · AVELOR',
});

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
  {
    name: 'PGE (Prêt Garanti par l’État)',
    enClair:
      "Prêt distribué par votre banque pendant la crise Covid (2020-2021), garanti à 70 à 90 % par l’État. Le protocole de place du 19 janvier 2022 permet de l’étaler jusqu’à 10 ans sans perdre la garantie d’État.",
    pourQui:
      "Toute entreprise ayant souscrit un PGE et qui peine aujourd’hui à le rembourser.",
    duree: 'Restructuration possible avant toute procédure collective — sinon la garantie d’État tombe.',
  },
  {
    name: 'APLD-R (Activité Partielle Longue Durée Rebond)',
    enClair:
      "Nouveau dispositif (loi de finances 2025, décret du 11 avril 2025) qui succède à l’APLD Covid. Permet de réduire l’horaire de travail jusqu’à 40 % en contrepartie d’engagements de maintien de l’emploi et de formation. Allocation État de 60 % du salaire horaire brut.",
    pourQui:
      "Employeurs confrontés à une baisse durable d’activité (non simplement conjoncturelle).",
    duree: '24 mois maximum sur 36 mois consécutifs.',
  },
  {
    name: 'CCSF (Commission des Chefs de Services Financiers)',
    enClair:
      "Guichet unique qui regroupe vos dettes fiscales (SIE) et sociales (URSSAF) pour un échéancier global. Saisine confidentielle via la DDFiP, formulaire Cerfa 15772.",
    pourQui:
      "Dirigeants avec dettes fiscales ET sociales — sauf en RJ/LJ.",
    duree: 'Plan d’apurement jusqu’à 36 mois.',
  },
  {
    name: 'CRP (Commissaire aux Restructurations et à la Prévention)',
    enClair:
      "Représentant de l’État en région (DREETS / Préfecture) chargé d’accompagner confidentiellement les entreprises en difficulté. Aide à coordonner les créanciers publics et privés.",
    pourQui:
      "Entreprises en difficulté de toute taille — particulièrement utile pour les ETI et PME stratégiques.",
    duree: 'Accompagnement confidentiel, pas de durée fixe.',
  },
  {
    name: 'CIRI (Comité Interministériel de Restructuration Industrielle)',
    enClair:
      "Cellule interministérielle dédiée aux entreprises de plus de 400 salariés (ou plus de 250 stratégiques). Coordonne État, banques et créanciers publics pour structurer un plan de retournement.",
    pourQui:
      "Entreprises >250 salariés stratégiques ou >400 salariés.",
    duree: 'Accompagnement confidentiel.',
  },
  {
    name: 'AGS (Association pour la Gestion du régime de garantie des créances des Salariés)',
    enClair:
      "L’AGS garantit le paiement des salaires et indemnités quand l’entreprise est en procédure collective et ne peut plus payer. Plafonds 2025 : 61 824 à 92 736 € selon l’ancienneté du contrat.",
    pourQui:
      "Tous les salariés d’une entreprise en RJ ou LJ.",
    duree: 'Versement sous 15 jours après transmission par le mandataire.',
  },
  {
    name: 'CSP (Contrat de Sécurisation Professionnelle)',
    enClair:
      "Document obligatoire à remettre à chaque salarié licencié pour motif économique dans une entreprise < 1 000 salariés (ou en RJ/LJ). Le salarié touche 75 % du salaire brut antérieur pendant 12 mois (ASP).",
    pourQui:
      "Employeurs en licenciement économique, sous peine de devoir 2 mois de salaire à France Travail par salarié non informé.",
    duree: 'Le salarié a 21 jours pour accepter ou refuser.',
  },
  {
    name: 'PSE (Plan de Sauvegarde de l’Emploi)',
    enClair:
      "Plan obligatoire si l’entreprise a au moins 50 salariés ET licencie au moins 10 salariés sur 30 jours. Doit prévoir reclassement, formation, indemnités supra-légales. Validé/homologué par la DREETS.",
    pourQui:
      "Entreprises ≥ 50 salariés en licenciement collectif important.",
    duree: 'Validation accord 15 j / homologation document unilatéral 21 j.',
  },
  {
    name: 'ATI (Allocation des Travailleurs Indépendants)',
    enClair:
      "Allocation chômage spécifique aux indépendants : 26,30 €/jour (≈ 800 €/mois) pendant 6 mois après cessation involontaire d’activité. Sans condition de cotisation préalable.",
    pourQui:
      "Indépendants (EI, micro, gérant majoritaire) en cessation involontaire — RJ/LJ.",
    duree: '6 mois maximum.',
  },
  {
    name: 'ACRE / ARCE',
    enClair:
      "ACRE = exonération partielle de cotisations sociales pendant 1 an si reprise d’activité après cessation. ARCE = versement en capital de l’allocation chômage (45 % du reste à percevoir) si vous étiez salarié auparavant et que vous créez/reprenez.",
    pourQui:
      "Toute personne créant ou reprenant une activité — particulièrement utile pour rebondir.",
    duree: 'ACRE : 12 mois. ARCE : versement en 2 fois.',
  },
  {
    name: 'FSE+ (Fonds Social Européen Plus 2021-2027)',
    enClair:
      "Cofinancement européen jusqu’à 60 % des actions de reclassement, formation et accompagnement des salariés lors de restructurations. Géré par les Régions et la DGEFP.",
    pourQui:
      "Employeurs en PSE ou plan de reclassement.",
    duree: 'Programme 2021-2027.',
  },
  {
    name: 'FNE-Formation',
    enClair:
      "Financement public de la formation des salariés pendant une baisse d’activité ou une restructuration. Cumulable avec l’activité partielle classique ou l’APLD-R.",
    pourQui:
      "Employeurs en difficulté économique, demande déposée à l’OPCO.",
    duree: 'Selon plan de formation.',
  },
  {
    name: 'Médiation du crédit (Banque de France)',
    enClair:
      "Service gratuit et confidentiel de la Banque de France pour aider les entreprises confrontées à un refus bancaire (prêt, découvert, restructuration PGE). Taux de succès > 60 %.",
    pourQui:
      "Tout dirigeant face à une difficulté bancaire.",
    duree: 'Réponse sous 5 jours.',
  },
  {
    name: 'Médiation des entreprises',
    enClair:
      "Service gratuit et confidentiel pour résoudre les litiges entre entreprises (fournisseurs, clients, donneurs d’ordres). Taux de succès dans 75 % des cas.",
    pourQui:
      "Tout dirigeant en litige commercial.",
    duree: 'Variable selon dossier.',
  },
  {
    name: 'Conseillers-Entreprises',
    enClair:
      "Plateforme unique de l’État (Bercy) pour identifier l’aide ou l’interlocuteur public adapté à votre situation. Un conseiller vous rappelle gratuitement.",
    pourQui:
      "Tout dirigeant qui ne sait pas par quoi commencer.",
    duree: 'Rappel sous 5 jours ouvrés.',
  },
  {
    name: 'Période suspecte',
    enClair:
      "Les 18 mois précédant la date de cessation des paiements fixée par le tribunal. Certains actes (paiements anticipés, donations, ventes à prix anormal) peuvent être annulés rétroactivement par le mandataire.",
    pourQui:
      "Toute entreprise entrant en procédure collective — important pour anticiper les actes à risque.",
    duree: 'Étendue jusqu’à 18 mois en arrière depuis la cessation.',
  },
  {
    name: 'Action paulienne (art. 1341-2 C. civ.)',
    enClair:
      "Procédure permettant à un créancier d’attaquer un acte fait par le débiteur en fraude de ses droits (donation à un proche, changement de régime matrimonial précipité). Va au-delà de la période suspecte.",
    pourQui:
      "Créanciers individuels — à connaître pour ne pas faire d’erreur défensive.",
    duree: 'Prescription : 5 ans à compter de la connaissance de l’acte.',
  },
  {
    name: 'APESA (Aide Psychologique aux Entrepreneurs en Souffrance Aiguë)',
    enClair:
      "Dispositif d’écoute psychologique gratuit pour dirigeants en grande souffrance. Activable via le tribunal de commerce, l’expert-comptable, ou directement par le dirigeant.",
    pourQui:
      "Tout dirigeant traversant une crise psychique.",
    duree: 'Jusqu’à 5 séances gratuites avec un psychologue.',
  },
  {
    name: '60 000 Rebonds',
    enClair:
      "Association nationale qui accompagne gratuitement les dirigeants après une liquidation : mentor, groupe de pairs, bilan de compétences, projet de rebond.",
    pourQui:
      "Dirigeants post-liquidation souhaitant rebondir.",
    duree: '12 à 24 mois d’accompagnement.',
  },
  {
    name: 'Surendettement (commission BdF)',
    enClair:
      "Procédure spécifique aux personnes physiques pour traiter les dettes non professionnelles (crédit conso, loyer, énergie). Plan conventionnel, mesures imposées ou rétablissement personnel selon les cas.",
    pourQui:
      "Personnes physiques (EI, indépendants, particuliers) en impossibilité manifeste de payer leurs dettes personnelles.",
    duree: 'Plan jusqu’à 7 ans ou effacement total.',
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
