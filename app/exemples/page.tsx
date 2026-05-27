import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Exemples concrets par secteur — AVELOR',
  description:
    'Cas concrets anonymisés de dirigeants en difficulté : restauration, BTP, commerce, transport, boulangerie, informatique, agriculture, immobilier. Étapes, interlocuteurs et résultats.',
};

/* ---------- types ---------- */

type Interlocuteur = {
  nom: string;
  href: string;
  externe?: boolean;
};

type Exemple = {
  secteur: string;
  secteurColor: string;
  situation: string;
  situationColor: string;
  titre: string;
  paragraphes: string[];
  interlocuteurs: Interlocuteur[];
  resultat: string;
};

/* ---------- data ---------- */

const SECTEUR_COLORS: Record<string, string> = {
  Restauration: 'bg-jaune/15 text-jaune',
  BTP: 'bg-navy/15 text-navy',
  Commerce: 'bg-bleu/15 text-bleu-fonce',
  Transport: 'bg-rouge/15 text-rouge',
  Boulangerie: 'bg-jaune/15 text-jaune',
  Informatique: 'bg-bleu-fonce/15 text-bleu-fonce',
  Agriculture: 'bg-vert/15 text-vert',
  Immobilier: 'bg-navy/15 text-navy',
};

const SITUATION_COLORS: Record<string, string> = {
  'Dettes sociales': 'bg-rouge/10 text-rouge',
  'Cessation de paiements': 'bg-rouge/15 text-rouge',
  'Prévention': 'bg-vert/10 text-vert',
  'Liquidation': 'bg-navy/10 text-navy',
  'Dettes fiscales': 'bg-jaune/10 text-jaune',
  'Litige client': 'bg-bleu/10 text-bleu-fonce',
  'Crise sectorielle': 'bg-jaune/10 text-jaune',
  'Surendettement personnel': 'bg-rouge/10 text-rouge',
};

const exemples: Exemple[] = [
  {
    secteur: 'Restauration',
    secteurColor: SECTEUR_COLORS.Restauration,
    situation: 'Dettes sociales',
    situationColor: SITUATION_COLORS['Dettes sociales'],
    titre: 'Marie, restauratrice à Lyon — dettes URSSAF de 45 000 euros',
    paragraphes: [
      'Marie dirige un restaurant de 3 salariés à Lyon. Après deux années difficiles, elle accumule un retard URSSAF de 45 000 euros. Elle ne sait pas par où commencer.',
      'Elle contacte d’abord la CCSF (Commission des chefs de services financiers) via sa Direction départementale des finances publiques. En une seule demande, elle obtient un échelonnement de l’ensemble de ses dettes sociales et fiscales sur 24 mois.',
      'En parallèle, son avocat lui conseille de demander un mandat ad hoc au tribunal de commerce. La procédure est confidentielle : ni les salariés, ni les clients, ni les fournisseurs ne sont informés. Le mandataire l’aide à renégocier le bail commercial avec le propriétaire.',
    ],
    interlocuteurs: [
      { nom: 'CCSF (dettes fiscales et sociales)', href: '/aides' },
      { nom: 'Mandat ad hoc', href: '/procedures' },
      { nom: 'APESA (soutien psychologique)', href: '/parler' },
    ],
    resultat:
      'Échelonnement sur 24 mois obtenu. Bail renégocié. Le restaurant est toujours ouvert.',
  },
  {
    secteur: 'BTP',
    secteurColor: SECTEUR_COLORS.BTP,
    situation: 'Cessation de paiements',
    situationColor: SITUATION_COLORS['Cessation de paiements'],
    titre: 'Thomas, artisan BTP en Vendée — client principal en faillite',
    paragraphes: [
      'Thomas emploie 8 salariés dans le BTP en Vendée. Son client principal, un promoteur, est placé en liquidation judiciaire. Thomas perd 120 000 euros de créances et sa trésorerie tombe à zéro.',
      'Il déclare la cessation de paiements au greffe du tribunal de commerce dans les 45 jours (obligation légale). Le tribunal ouvre un redressement judiciaire. Pendant la période d’observation, Thomas continue l’activité avec l’aide d’un administrateur judiciaire.',
      'L’AGS (Association pour la gestion du régime de Garantie des créances des Salariés) prend en charge les salaires pendant 45 jours. Thomas présente un plan de continuation sur 10 ans, accepté par le tribunal.',
    ],
    interlocuteurs: [
      { nom: 'Greffe du tribunal de commerce', href: '/procedures' },
      { nom: 'AGS (garantie des salaires)', href: '/annuaires' },
      { nom: 'Administrateur judiciaire', href: '/annuaires' },
      { nom: 'CCI (conseil gratuit)', href: '/parler' },
    ],
    resultat:
      'Plan de continuation sur 10 ans validé. Les 8 emplois sont sauvés. L’AGS a couvert les salaires pendant la procédure.',
  },
  {
    secteur: 'Commerce',
    secteurColor: SECTEUR_COLORS.Commerce,
    situation: 'Prévention',
    situationColor: SITUATION_COLORS['Prévention'],
    titre: 'Sophie, gérante d’un magasin de vêtements à Bordeaux — prévention réussie',
    paragraphes: [
      'Sophie tient un magasin de vêtements à Bordeaux. Son chiffre d’affaires a chuté de 40 % en deux ans. Elle n’est pas encore en cessation de paiements mais les dettes fournisseurs s’accumulent.',
      'Elle prend rendez-vous avec un CIP (Centre d’Information sur la Prévention des difficultés des entreprises) pour un diagnostic gratuit et confidentiel. Le CIP l’oriente vers une procédure de conciliation auprès du tribunal de commerce.',
      'La conciliation est confidentielle : un conciliateur nommé par le tribunal négocie avec les fournisseurs. En 4 mois, Sophie obtient un abandon de 30 % de sa dette fournisseurs et un étalement du reste sur 18 mois.',
    ],
    interlocuteurs: [
      { nom: 'CIP (diagnostic gratuit)', href: '/annuaires' },
      { nom: 'Conciliation', href: '/procedures' },
      { nom: 'Aides régionales Nouvelle-Aquitaine', href: '/aides' },
    ],
    resultat:
      'Abandon de 30 % de la dette fournisseurs. Étalement du reste sur 18 mois. Le magasin continue son activité.',
  },
  {
    secteur: 'Transport',
    secteurColor: SECTEUR_COLORS.Transport,
    situation: 'Liquidation',
    situationColor: SITUATION_COLORS['Liquidation'],
    titre: 'Karim, transporteur routier à Lille — liquidation et rebond',
    paragraphes: [
      'Karim est transporteur routier à Lille avec 2 camions et 1 salarié. Il perd son contrat principal et ne peut plus payer ses charges. La liquidation judiciaire est inévitable.',
      'Le tribunal prononce la liquidation. L’AGS prend en charge les salaires dus au salarié. Karim, en tant que dirigeant, n’a pas droit au chômage classique mais il demande l’ATI (Allocation des Travailleurs Indépendants) auprès de France Travail : 26,30 euros par jour pendant 6 mois.',
      'Après la liquidation, Karim décide de recréer une entreprise. Il bénéficie de l’ACRE (exonération de charges la première année) et d’un prêt d’honneur via Initiative France.',
    ],
    interlocuteurs: [
      { nom: 'AGS (garantie des salaires)', href: '/annuaires' },
      { nom: 'ATI (allocation dirigeant)', href: '/aides-personnelles' },
      { nom: 'Rebondir après liquidation', href: '/rebond' },
      { nom: 'ACRE et aides au rebond', href: '/rebond' },
    ],
    resultat:
      'Liquidation prononcée. ATI perçue pendant 6 mois. Nouvelle entreprise créée avec l’ACRE. Karim est de nouveau en activité.',
  },
  {
    secteur: 'Boulangerie',
    secteurColor: SECTEUR_COLORS.Boulangerie,
    situation: 'Dettes fiscales',
    situationColor: SITUATION_COLORS['Dettes fiscales'],
    titre: 'Nadia, boulangère à Montpellier — retard TVA et impôt sur les sociétés',
    paragraphes: [
      'Nadia est boulangère à Montpellier. Elle a accumulé un retard de TVA et d’impôt sur les sociétés. Les relances s’enchaînent et elle craint une saisie sur son compte professionnel.',
      'Elle saisit la CCSF (Commission des chefs de services financiers) de son département. En une seule demande, elle obtient un plan d’échelonnement sur 18 mois pour l’ensemble de ses dettes fiscales et sociales.',
      'En parallèle, la CMA (Chambre de Métiers et de l’Artisanat) de l’Hérault l’oriente vers une aide régionale Occitanie spécifique aux artisans en difficulté.',
    ],
    interlocuteurs: [
      { nom: 'CCSF (échelonnement)', href: '/aides' },
      { nom: 'CMA (Chambre de Métiers)', href: '/parler' },
      { nom: 'Aides régionales', href: '/aides' },
    ],
    resultat:
      'Échelonnement sur 18 mois accordé par la CCSF. Aide régionale Occitanie obtenue. La boulangerie continue.',
  },
  {
    secteur: 'Informatique',
    secteurColor: SECTEUR_COLORS.Informatique,
    situation: 'Litige client',
    situationColor: SITUATION_COLORS['Litige client'],
    titre: 'Lucas, développeur freelance à Paris — client qui doit 35 000 euros',
    paragraphes: [
      'Lucas est développeur freelance à Paris. Un client important lui doit 35 000 euros pour un projet livré et validé. Malgré les relances, le client ne paie pas. Lucas n’a pas les moyens de lancer une procédure judiciaire.',
      'Il saisit le Médiateur des entreprises (service gratuit de l’État). Le médiateur convoque les deux parties. La médiation dure 3 mois.',
      'Le client accepte de payer 80 % de la facture sous 30 jours. Lucas évite un contentieux long et coûteux.',
    ],
    interlocuteurs: [
      { nom: 'Médiateur des entreprises', href: '/aides' },
      { nom: 'Courrier de mise en demeure', href: '/courriers' },
    ],
    resultat:
      'Médiation réussie : 80 % de la créance recouvrée en 3 mois, sans frais de justice.',
  },
  {
    secteur: 'Agriculture',
    secteurColor: SECTEUR_COLORS.Agriculture,
    situation: 'Crise sectorielle',
    situationColor: SITUATION_COLORS['Crise sectorielle'],
    titre: 'Jean, éleveur laitier en Bretagne — prix du lait en chute',
    paragraphes: [
      'Jean est éleveur laitier en Bretagne. La chute du prix du lait met son exploitation en péril. Il ne peut plus payer ses cotisations MSA et commence à s’isoler.',
      'Il appelle Agri’Écoute (09 69 39 29 19), le service d’écoute pour les agriculteurs en difficulté. L’écoutant l’oriente vers la MSA pour un plan social agricole : report de cotisations et aide financière d’urgence.',
      'La Chambre d’Agriculture de Bretagne l’accompagne pour déposer un dossier d’aide régionale. Il obtient un soutien de trésorerie de la Région Bretagne.',
    ],
    interlocuteurs: [
      { nom: 'Agri’Écoute (09 69 39 29 19)', href: '/parler' },
      { nom: 'MSA (régime social agricole)', href: '/aides' },
      { nom: 'Chambre d’Agriculture', href: '/aides' },
      { nom: 'Aides régionales', href: '/aides' },
    ],
    resultat:
      'Report de cotisations MSA obtenu. Aide régionale Bretagne versée. L’exploitation est maintenue.',
  },
  {
    secteur: 'Immobilier',
    secteurColor: SECTEUR_COLORS.Immobilier,
    situation: 'Surendettement personnel',
    situationColor: SITUATION_COLORS['Surendettement personnel'],
    titre: 'Claire, agent immobilier à Nice — cautions personnelles sur le prêt de l’agence',
    paragraphes: [
      'Claire dirige une agence immobilière à Nice. Le marché s’est retourné et l’agence ne peut plus rembourser son prêt professionnel. Claire a signé une caution personnelle : la banque menace de saisir sa résidence principale.',
      'Elle consulte un notaire qui lui fait effectuer une déclaration d’insaisissabilité sur sa résidence principale (article L526-1 du Code de commerce). Cette déclaration protège le bien contre les créanciers professionnels futurs.',
      'Son avocat examine le cautionnement et constate qu’il est disproportionné par rapport à ses revenus au moment de la signature. Il engage une action en nullité de la caution (article L332-1 du Code de la consommation).',
    ],
    interlocuteurs: [
      { nom: 'Protection du patrimoine', href: '/proteger-famille' },
      { nom: 'Aide juridictionnelle', href: '/aides-personnelles' },
      { nom: 'Annuaire des avocats', href: '/annuaires' },
    ],
    resultat:
      'Résidence principale protégée par déclaration d’insaisissabilité. Caution annulée pour disproportion. Claire conserve son logement.',
  },
];

/* ---------- component ---------- */

export default function ExemplesPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 pt-6 pb-20 sm:pt-14">
      {/* Header */}
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Cas concrets
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Exemples concrets par secteur
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-navy/70 sm:text-lg">
          Des cas réels anonymisés pour comprendre les étapes et les
          interlocuteurs
        </p>
      </div>

      {/* Disclaimer */}
      <div className="dashed-band mt-10 p-5 text-center text-sm leading-relaxed text-navy/70">
        Ces exemples sont reconstitués à partir de situations types. Chaque
        cas est unique. Consultez un professionnel pour votre situation
        personnelle.
      </div>

      {/* Exemples */}
      <div className="mt-10 space-y-8">
        {exemples.map((ex) => (
          <article
            key={ex.titre}
            className="glass-soft card-top-line p-6 sm:p-8"
          >
            {/* Pastilles */}
            <div className="mb-4 flex flex-wrap gap-2">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${ex.secteurColor}`}
              >
                {ex.secteur}
              </span>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${ex.situationColor}`}
              >
                {ex.situation}
              </span>
            </div>

            {/* Titre */}
            <h2 className="font-display text-lg text-navy sm:text-xl">
              {ex.titre}
            </h2>

            {/* Récit */}
            <div className="mt-4 space-y-3">
              {ex.paragraphes.map((p, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed text-navy/75"
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Interlocuteurs */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">
                Interlocuteurs contactés
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ex.interlocuteurs.map((inter) => (
                  <Link
                    key={inter.nom}
                    href={inter.href}
                    className="pastille text-bleu-fonce underline-offset-2 transition hover:underline"
                  >
                    {inter.nom}
                  </Link>
                ))}
              </div>
            </div>

            {/* Résultat */}
            <div className="mt-5 rounded-xl bg-vert/5 border border-vert/20 px-4 py-3">
              <p className="text-sm font-semibold text-navy">
                <span className="mr-1" aria-hidden="true">
                  &#10003;
                </span>
                Résultat : {ex.resultat}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 text-center">
        <p className="text-base text-navy/70">
          Vous vous reconnaissez dans l&apos;un de ces exemples ?
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Faire mon diagnostic gratuit
          </Link>
          <Link
            href="/parler"
            className="inline-flex items-center gap-2 rounded-xl border border-navy/20 px-5 py-2.5 text-sm font-medium text-navy transition hover:bg-navy/5"
          >
            Parler à quelqu&apos;un
          </Link>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-10 text-center text-xs text-navy/50">
        Sources : Code de commerce (L611-1 et suivants, L631-1 et suivants,
        L640-1 et suivants), Code de la consommation (L332-1),
        service-public.fr, economie.gouv.fr
      </p>
    </section>
  );
}
