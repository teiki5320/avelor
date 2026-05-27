import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Exemples concrets par secteur — AVELOR',
  description:
    'Cas concrets anonymisés de dirigeants en difficulté : restauration, BTP, commerce, transport, boulangerie, informatique, agriculture, immobilier. Découvrez ce que la fiche AVELOR leur aurait conseillé.',
};

/* ---------- types ---------- */

type BlocFiche = {
  bloc: string;
  detail: string;
  lien?: string;
};

type Exemple = {
  secteur: string;
  secteurColor: string;
  situation: string;
  situationColor: string;
  titre: string;
  profil: string;
  contexte: string;
  ficheAffiche: BlocFiche[];
  etapes: string[];
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

const BLOC_ICONS: Record<string, string> = {
  'Carte prioritaire': '◆',
  'Stratégie': '⚒',
  'CCSF': '✉',
  'Courrier': '✉',
  'Calculateur': '⚙',
  'Organismes': '⚑',
  'Soutien': '♥',
  'Protection famille': '⌂',
  'Caution': '⚠',
  'Décompte 45 jours': '⏱',
  'Obligations employeur': '⚖',
  'Aides': '☆',
  'Plan d’action': '☑',
  'Procédure': '⚖',
  'Patrimoine': '⌂',
  'Timeline juridique': '⏰',
  'Trésorerie': '↓',
  'Calendrier fiscal': '☷',
  'Prescription': '⌛',
  'Bail commercial': '☖',
};

const exemples: Exemple[] = [
  {
    secteur: 'Restauration',
    secteurColor: SECTEUR_COLORS.Restauration,
    situation: 'Dettes sociales',
    situationColor: SITUATION_COLORS['Dettes sociales'],
    titre: 'Marie, restauratrice à Lyon — dettes URSSAF de 45 000 euros',
    profil: 'SARL, 3 salariés, NAF 56.10A, département 69',
    contexte:
      'Marie dirige un restaurant de 3 salariés à Lyon. Après deux années difficiles, elle accumule un retard URSSAF de 45 000 euros. Elle ne sait pas par où commencer.',
    ficheAffiche: [
      {
        bloc: 'Carte prioritaire',
        detail:
          'Restructurer — Votre cap : renégocier la dette et restructurer en interne',
      },
      {
        bloc: 'CCSF',
        detail:
          'Formulaire de saisine de la CCSF du Rhône — échelonnement dettes sociales et fiscales en une seule demande',
      },
      {
        bloc: 'Courrier',
        detail:
          'Modèle « Échelonnement URSSAF » personnalisé avec vos données, prêt à imprimer',
        lien: '/courriers/echelonnement-urssaf',
      },
      {
        bloc: 'Calculateur',
        detail:
          'Vérifier si certaines dettes sont prescrites (3 ans pour l’URSSAF)',
        lien: '/outils/prescription',
      },
      {
        bloc: 'Procédure',
        detail:
          'Mandat ad hoc recommandé — procédure confidentielle pour renégocier le bail',
        lien: '/procedures',
      },
      {
        bloc: 'Organismes',
        detail:
          'CCI Lyon, CIP Rhône, 3 avocats droit des affaires à Lyon',
        lien: '/annuaires/cip',
      },
      {
        bloc: 'Soutien',
        detail:
          'APESA — psychologue gratuit pour dirigeants en souffrance',
        lien: '/parler',
      },
    ],
    etapes: [
      'Consulter la fiche AVELOR et imprimer le courrier CCSF',
      'Appeler la DDFiP du Rhône (numéro dans la fiche) pour demander la CCSF',
      'Prendre RDV avec un avocat (3 suggestions locales dans le bloc Organismes)',
      'Demander un mandat ad hoc au tribunal de commerce de Lyon',
      'Renégocier le bail commercial avec le mandataire',
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
    profil: 'SARL, 8 salariés, NAF 43.39Z, département 85',
    contexte:
      'Thomas emploie 8 salariés dans le BTP en Vendée. Son client principal, un promoteur, est placé en liquidation judiciaire. Thomas perd 120 000 euros de créances et sa trésorerie tombe à zéro.',
    ficheAffiche: [
      {
        bloc: 'Décompte 45 jours',
        detail:
          'Vous êtes en cessation de paiements — il vous reste X jours pour déclarer au greffe (obligation légale)',
      },
      {
        bloc: 'Carte prioritaire',
        detail:
          'Audience tribunal — préparer votre dossier de redressement judiciaire',
      },
      {
        bloc: 'Obligations employeur',
        detail:
          '8 salariés : obligation d’informer le CSE, procédure de licenciement collectif si nécessaire',
        lien: '/outils/licenciement',
      },
      {
        bloc: 'Courrier',
        detail:
          'Modèle « Déclaration de cessation de paiements » pré-rempli avec les données de votre entreprise',
        lien: '/courriers/cessation-paiements',
      },
      {
        bloc: 'Aides',
        detail:
          'AGS — garantie des salaires pendant la procédure (jusqu’à 45 jours)',
        lien: '/annuaires/ags',
      },
      {
        bloc: 'Trésorerie',
        detail:
          'Projection de trésorerie sur 6 mois — visualiser la période d’observation',
      },
      {
        bloc: 'Plan d’action',
        detail:
          'Checklist : déclarer au greffe, réunir les pièces, préparer le plan de continuation',
      },
      {
        bloc: 'Organismes',
        detail:
          'Greffe du TC de La Roche-sur-Yon, administrateurs judiciaires Vendée, CCI Vendée',
      },
    ],
    etapes: [
      'Consulter le décompte 45 jours et imprimer la déclaration de cessation',
      'Déposer la déclaration au greffe du tribunal de commerce',
      'Informer le CSE (obligation avec 8 salariés)',
      'Préparer le plan de continuation avec l’administrateur judiciaire',
      'L’AGS prend en charge les salaires pendant la procédure',
      'Présenter le plan de continuation au tribunal',
    ],
    resultat:
      'Plan de continuation sur 10 ans validé. Les 8 emplois sont sauvés. L’AGS a couvert les salaires pendant la procédure.',
  },
  {
    secteur: 'Commerce',
    secteurColor: SECTEUR_COLORS.Commerce,
    situation: 'Prévention',
    situationColor: SITUATION_COLORS['Prévention'],
    titre:
      'Sophie, gérante d’un magasin de vêtements à Bordeaux — prévention réussie',
    profil: 'EURL, 1 salariée, NAF 47.71Z, département 33',
    contexte:
      'Sophie tient un magasin de vêtements à Bordeaux. Son chiffre d’affaires a chuté de 40 % en deux ans. Elle n’est pas encore en cessation de paiements mais les dettes fournisseurs s’accumulent.',
    ficheAffiche: [
      {
        bloc: 'Carte prioritaire',
        detail:
          'Sauvegarder — prévention possible, agir avant la cessation de paiements',
      },
      {
        bloc: 'Stratégie',
        detail:
          'Conciliation recommandée — négocier un abandon partiel de dette avec les fournisseurs',
        lien: '/procedures',
      },
      {
        bloc: 'Courrier',
        detail:
          'Modèle « Délai de paiement fournisseur » prêt à personnaliser et envoyer',
        lien: '/courriers/delai-fournisseur',
      },
      {
        bloc: 'Courrier',
        detail:
          'Modèle « Demande de conciliation » pour saisir le tribunal de commerce',
        lien: '/courriers/conciliation',
      },
      {
        bloc: 'Aides',
        detail:
          'Aides régionales Nouvelle-Aquitaine — fonds de soutien aux commerces en difficulté',
        lien: '/aides',
      },
      {
        bloc: 'Bail commercial',
        detail:
          'Vérifier les clauses de révision du bail — possibilité de renégociation',
      },
      {
        bloc: 'Organismes',
        detail:
          'CIP Gironde (diagnostic gratuit et confidentiel), CCI Bordeaux, 3 avocats à Bordeaux',
        lien: '/annuaires/cip',
      },
      {
        bloc: 'Calculateur',
        detail:
          'Valorisation du fonds de commerce — connaître votre valeur en cas de cession',
        lien: '/outils/valorisation',
      },
    ],
    etapes: [
      'Consulter la fiche AVELOR et identifier la stratégie « Sauvegarder »',
      'Prendre RDV au CIP Gironde pour un diagnostic gratuit (numéro dans la fiche)',
      'Envoyer le courrier « Délai de paiement » aux fournisseurs principaux',
      'Demander une conciliation au tribunal de commerce de Bordeaux',
      'Le conciliateur négocie un abandon partiel de dette',
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
    profil: 'EURL, 1 salarié, NAF 49.41A, département 59',
    contexte:
      'Karim est transporteur routier à Lille avec 2 camions et 1 salarié. Il perd son contrat principal et ne peut plus payer ses charges. La liquidation judiciaire est inévitable.',
    ficheAffiche: [
      {
        bloc: 'Carte prioritaire',
        detail:
          'Rebondir — la liquidation n’est pas une fin, préparez votre rebond',
      },
      {
        bloc: 'Décompte 45 jours',
        detail:
          'Cessation de paiements constatée — déclarer au greffe dans les 45 jours',
      },
      {
        bloc: 'Calculateur',
        detail:
          'ATI (Allocation des Travailleurs Indépendants) — 26,30 euros/jour pendant 6 mois',
        lien: '/outils/ati',
      },
      {
        bloc: 'Calculateur',
        detail:
          'ACRE/ARCE — simuler vos droits pour recréer une activité après liquidation',
        lien: '/outils/acre-arce',
      },
      {
        bloc: 'Aides',
        detail:
          'AGS — garantie des salaires de votre salarié pendant la procédure',
        lien: '/annuaires/ags',
      },
      {
        bloc: 'Protection famille',
        detail:
          'Vérifier si votre résidence principale est protégée (statut EURL)',
      },
      {
        bloc: 'Patrimoine',
        detail:
          'Cartographie de votre patrimoine — identifier les biens saisissables et protégés',
      },
      {
        bloc: 'Organismes',
        detail:
          'Greffe du TC de Lille, France Travail Lille, Initiative France Hauts-de-France',
      },
    ],
    etapes: [
      'Consulter la fiche AVELOR et le décompte 45 jours',
      'Déposer la déclaration de cessation au greffe du TC de Lille',
      'Vérifier l’éligibilité ATI avec le calculateur (conditions dans la fiche)',
      'Demander l’ATI auprès de France Travail dès le jugement prononcé',
      'Préparer le rebond : simuler l’ACRE/ARCE avec le calculateur',
      'Obtenir un prêt d’honneur via Initiative France',
    ],
    resultat:
      'Liquidation prononcée. ATI perçue pendant 6 mois. Nouvelle entreprise créée avec l’ACRE. Karim est de nouveau en activité.',
  },
  {
    secteur: 'Boulangerie',
    secteurColor: SECTEUR_COLORS.Boulangerie,
    situation: 'Dettes fiscales',
    situationColor: SITUATION_COLORS['Dettes fiscales'],
    titre:
      'Nadia, boulangère à Montpellier — retard TVA et impôt sur les sociétés',
    profil: 'SARL, 2 salariés, NAF 10.71A, département 34',
    contexte:
      'Nadia est boulangère à Montpellier. Elle a accumulé un retard de TVA et d’impôt sur les sociétés. Les relances s’enchaînent et elle craint une saisie sur son compte professionnel.',
    ficheAffiche: [
      {
        bloc: 'Carte prioritaire',
        detail:
          'Restructurer — renégocier la dette fiscale avant toute saisie',
      },
      {
        bloc: 'CCSF',
        detail:
          'Saisine de la CCSF de l’Hérault — plan d’échelonnement fiscal et social en une seule demande',
      },
      {
        bloc: 'Courrier',
        detail:
          'Modèle « Échelonnement impôts » — demande de délai de paiement auprès de la DDFiP',
        lien: '/courriers/echelonnement-impots',
      },
      {
        bloc: 'Calculateur',
        detail:
          'Calendrier fiscal — visualiser vos prochaines échéances TVA et IS',
        lien: '/outils/calendrier-fiscal',
      },
      {
        bloc: 'Calculateur',
        detail:
          'Prescription des dettes — vérifier si certaines dettes fiscales sont prescrites',
        lien: '/outils/prescription',
      },
      {
        bloc: 'Aides',
        detail:
          'Aides régionales Occitanie — dispositif spécifique artisans en difficulté',
        lien: '/aides',
      },
      {
        bloc: 'Organismes',
        detail:
          'CMA Hérault (accompagnement artisans), DDFiP Montpellier, CIP Hérault',
      },
    ],
    etapes: [
      'Consulter la fiche AVELOR et le calendrier fiscal personnalisé',
      'Vérifier les prescriptions avec le calculateur (certaines dettes de plus de 3 ans ?)',
      'Imprimer et envoyer le courrier « Échelonnement impôts » à la DDFiP',
      'Saisir la CCSF de l’Hérault pour un plan global',
      'Contacter la CMA Hérault pour l’aide régionale Occitanie',
    ],
    resultat:
      'Échelonnement sur 18 mois accordé par la CCSF. Aide régionale Occitanie obtenue. La boulangerie continue.',
  },
  {
    secteur: 'Informatique',
    secteurColor: SECTEUR_COLORS.Informatique,
    situation: 'Litige client',
    situationColor: SITUATION_COLORS['Litige client'],
    titre:
      'Lucas, développeur freelance à Paris — client qui doit 35 000 euros',
    profil: 'Micro-entreprise, 0 salarié, NAF 62.01Z, département 75',
    contexte:
      'Lucas est développeur freelance à Paris. Un client important lui doit 35 000 euros pour un projet livré et validé. Malgré les relances, le client ne paie pas. Lucas n’a pas les moyens de lancer une procédure judiciaire.',
    ficheAffiche: [
      {
        bloc: 'Carte prioritaire',
        detail:
          'Restructurer — recouvrer la créance avant que la trésorerie ne s’effondre',
      },
      {
        bloc: 'Courrier',
        detail:
          'Modèle « Arrangement créancier » — mise en demeure formelle avant médiation',
        lien: '/courriers/creancier-arrangement',
      },
      {
        bloc: 'Courrier',
        detail:
          'Modèle « Saisine Médiateur des entreprises » — gratuit et rapide',
        lien: '/courriers/mediation-entreprises',
      },
      {
        bloc: 'Calculateur',
        detail:
          'Aide juridictionnelle — vérifier si vous y avez droit pour une procédure judiciaire',
        lien: '/outils/aide-juridictionnelle',
      },
      {
        bloc: 'Calculateur',
        detail:
          'Prescription de la créance — vérifier le délai avant extinction du droit d’agir',
        lien: '/outils/prescription',
      },
      {
        bloc: 'Trésorerie',
        detail:
          'Projection de trésorerie — combien de temps tenez-vous sans ce paiement ?',
      },
      {
        bloc: 'Organismes',
        detail:
          'Médiateur des entreprises (gratuit), CCI Paris, 3 avocats droit commercial à Paris',
      },
    ],
    etapes: [
      'Consulter la fiche AVELOR et identifier le courrier de mise en demeure',
      'Envoyer le courrier « Arrangement créancier » en recommandé au client',
      'Si pas de réponse sous 15 jours, saisir le Médiateur des entreprises',
      'Pendant la médiation, vérifier l’éligibilité à l’aide juridictionnelle',
      'Si médiation échoue, engager une procédure avec un avocat (suggestion dans la fiche)',
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
    profil: 'EARL, 1 salarié, NAF 01.41Z, département 35',
    contexte:
      'Jean est éleveur laitier en Bretagne. La chute du prix du lait met son exploitation en péril. Il ne peut plus payer ses cotisations MSA et commence à s’isoler.',
    ficheAffiche: [
      {
        bloc: 'Carte prioritaire',
        detail:
          'Soutien moral — vous n’êtes pas seul·e, des dispositifs existent',
      },
      {
        bloc: 'Soutien',
        detail:
          'Agri’Écoute (09 69 39 29 19) — écoute psychologique gratuite pour agriculteurs',
        lien: '/parler',
      },
      {
        bloc: 'Carte prioritaire',
        detail:
          'Santé du secteur — filière laitière en crise, aides spécifiques disponibles',
      },
      {
        bloc: 'Aides',
        detail:
          'MSA — report de cotisations et aide financière d’urgence (régime social agricole, appeler le 36 98)',
        lien: '/aides',
      },
      {
        bloc: 'Aides',
        detail:
          'Aides régionales Bretagne — fonds d’urgence agricole, soutien de trésorerie',
        lien: '/aides',
      },
      {
        bloc: 'Courrier',
        detail:
          'Modèle « Aide d’urgence sociale » — demande de secours exceptionnel à la MSA',
        lien: '/courriers/aide-urgence-social',
      },
      {
        bloc: 'Organismes',
        detail:
          'Chambre d’Agriculture de Bretagne, MSA Armorique, CIP Ille-et-Vilaine',
      },
    ],
    etapes: [
      'Appeler Agri’Écoute (numéro direct dans la fiche) — ne pas rester isolé',
      'Contacter la MSA Armorique pour demander un report de cotisations',
      'Imprimer et envoyer le courrier « Aide d’urgence sociale » à la MSA',
      'Prendre RDV à la Chambre d’Agriculture pour monter le dossier d’aide régionale',
      'Déposer une demande d’aide de trésorerie auprès de la Région Bretagne',
    ],
    resultat:
      'Report de cotisations MSA obtenu. Aide régionale Bretagne versée. L’exploitation est maintenue.',
  },
  {
    secteur: 'Immobilier',
    secteurColor: SECTEUR_COLORS.Immobilier,
    situation: 'Surendettement personnel',
    situationColor: SITUATION_COLORS['Surendettement personnel'],
    titre:
      'Claire, agent immobilier à Nice — cautions personnelles sur le prêt de l’agence',
    profil: 'SAS, 2 salariées, NAF 68.31Z, département 06',
    contexte:
      'Claire dirige une agence immobilière à Nice. Le marché s’est retourné et l’agence ne peut plus rembourser son prêt professionnel. Claire a signé une caution personnelle : la banque menace de saisir sa résidence principale.',
    ficheAffiche: [
      {
        bloc: 'Carte prioritaire',
        detail:
          'Caution à auditer — votre cautionnement pourrait être disproportionné et annulable',
      },
      {
        bloc: 'Caution',
        detail:
          'Audit de la caution personnelle — le montant est-il proportionné à vos revenus au moment de la signature ? (article L332-1 du Code de la consommation)',
      },
      {
        bloc: 'Protection famille',
        detail:
          'Résidence principale — vérifier la protection selon votre régime matrimonial et votre statut',
      },
      {
        bloc: 'Patrimoine',
        detail:
          'Cartographie du patrimoine — identifier les biens saisissables et ceux protégés',
      },
      {
        bloc: 'Courrier',
        detail:
          'Modèle « Médiation du crédit » — saisir le médiateur pour renégocier avec la banque',
        lien: '/courriers/mediation-credit',
      },
      {
        bloc: 'Calculateur',
        detail:
          'Aide juridictionnelle — vérifier votre éligibilité pour contester la caution en justice',
        lien: '/outils/aide-juridictionnelle',
      },
      {
        bloc: 'Calculateur',
        detail:
          'Coût des procédures — estimer le coût d’une action en nullité de caution',
        lien: '/outils/cout-procedures',
      },
      {
        bloc: 'Organismes',
        detail:
          'Notaires des Alpes-Maritimes, 3 avocats droit des affaires à Nice, CIP PACA',
        lien: '/annuaires',
      },
    ],
    etapes: [
      'Consulter la fiche AVELOR et l’audit de caution personnelle',
      'Vérifier la protection de la résidence principale dans le bloc « Protection famille »',
      'Saisir le Médiateur du crédit avec le courrier type',
      'Consulter un avocat (3 suggestions locales) pour examiner la disproportion de la caution',
      'Si la caution est disproportionnée, engager une action en nullité (article L332-1)',
      'En parallèle, faire une déclaration d’insaisissabilité chez le notaire',
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
          Ce que la fiche AVELOR vous aurait conseillé
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-navy/70 sm:text-lg">
          8 cas réels anonymisés. Pour chaque dirigeant, découvrez les blocs,
          courriers et calculateurs que la fiche AVELOR aurait affichés — et
          comment ils auraient aidé concrètement.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="dashed-band mt-10 p-5 text-center text-sm leading-relaxed text-navy/70">
        Ces exemples sont reconstitués à partir de situations types. Chaque
        cas est unique. La fiche AVELOR s&apos;adapte à vos réponses :
        essayez le{' '}
        <Link href="/" className="text-bleu-fonce underline underline-offset-2">
          diagnostic gratuit
        </Link>{' '}
        pour voir votre propre fiche.
      </div>

      {/* Exemples */}
      <div className="mt-10 space-y-10">
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

            {/* Profil */}
            <p className="mt-1 text-xs text-navy/50">{ex.profil}</p>

            {/* Contexte */}
            <p className="mt-4 text-sm leading-relaxed text-navy/75">
              {ex.contexte}
            </p>

            {/* Ce que la fiche affiche */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-bleu-fonce/80">
                Sur votre fiche AVELOR, vous auriez vu :
              </h3>
              <div className="mt-3 space-y-2">
                {ex.ficheAffiche.map((bloc, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg bg-white/60 px-4 py-3 text-sm"
                  >
                    <span
                      className="mt-0.5 shrink-0 text-base text-bleu-fonce/60"
                      aria-hidden="true"
                    >
                      {BLOC_ICONS[bloc.bloc] ?? '○'}
                    </span>
                    <div className="min-w-0">
                      <span className="font-semibold text-navy">
                        {bloc.bloc}
                      </span>
                      <span className="mx-1.5 text-navy/30">—</span>
                      <span className="text-navy/70">{bloc.detail}</span>
                      {bloc.lien && (
                        <Link
                          href={bloc.lien}
                          className="ml-2 inline-flex items-center text-xs text-bleu-fonce underline underline-offset-2 hover:text-bleu"
                        >
                          Voir&nbsp;&#8594;
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Étapes concrètes */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-bleu-fonce/80">
                Les étapes concrètes
              </h3>
              <ol className="mt-3 space-y-2">
                {ex.etapes.map((etape, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bleu-fonce/10 text-xs font-bold text-bleu-fonce">
                      {i + 1}
                    </span>
                    <span className="text-navy/75">{etape}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Résultat */}
            <div className="mt-6 rounded-xl border border-vert/20 bg-vert/5 px-4 py-3">
              <p className="text-sm font-semibold text-navy">
                <span className="mr-1" aria-hidden="true">
                  &#10003;
                </span>
                Résultat : {ex.resultat}
              </p>
            </div>

            {/* Liens vers les blocs de la fiche */}
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy/40">
                Ce que contient votre fiche
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ex.ficheAffiche
                  .filter((b) => b.lien)
                  .map((b, i) => (
                    <Link
                      key={i}
                      href={b.lien!}
                      className="pastille text-bleu-fonce underline-offset-2 transition hover:underline"
                    >
                      {b.bloc === 'Courrier'
                        ? `Courrier : ${b.detail.split('»')[0].split('«')[1]?.trim() ?? b.detail}`
                        : b.bloc === 'Calculateur'
                          ? `Calculateur : ${b.detail.split('—')[0].trim()}`
                          : b.bloc}
                    </Link>
                  ))}
              </div>
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
