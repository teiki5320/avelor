import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface QR {
  q: string;
  r: string;
}

interface FaqCiblee {
  titre: string;
  metaTitle: string;
  metaDesc: string;
  intro: string;
  questions: QR[];
  liensConseilles: { href: string; label: string }[];
}

const FAQ_PAR_SITUATION: Record<string, FaqCiblee> = {
  'urssaf-impayee': {
    titre: 'FAQ — URSSAF impayée : vos questions, nos réponses',
    metaTitle: 'URSSAF impayée : que faire ? Toutes vos questions — AVELOR',
    metaDesc: 'Cotisations URSSAF impayées, mise en demeure, prescription, CCSF : 12 questions et réponses claires pour les dirigeants en difficulté.',
    intro: "Cotisations en retard, lettre recommandée, ATD imminent ? Vous êtes loin d'être seul·e. Voici les 12 questions qui reviennent le plus souvent — sources officielles à l'appui.",
    questions: [
      { q: 'L\'URSSAF peut-elle saisir mon compte bancaire ?', r: 'Oui, via un Avis à Tiers Détenteur (ATD) — devenu Saisie Administrative à Tiers Détenteur (SATD) depuis 2019. C\'est rapide (5 j) et automatique une fois la mise en demeure restée sans effet. Pour bloquer la SATD, négociez un échéancier AVANT, ou contestez via la CRA (Commission de Recours Amiable) dans les 2 mois.' },
      { q: 'Mes cotisations de 2018, sont-elles encore dues ?', r: 'Probablement non. L\'art. L244-3 CSS prescrit les cotisations en 3 ans (5 ans en cas de travail dissimulé). Si vous n\'avez reçu aucune mise en demeure dans ce délai, elles sont prescrites et plus exigibles. À vérifier avec votre expert-comptable ou un avocat.' },
      { q: 'Qu\'est-ce que la CCSF et comment la saisir ?', r: 'La Commission des Chefs de Services Financiers (CCSF) coordonne fisc + Urssaf en un guichet unique. Permet un échelonnement jusqu\'à 36 mois pour les dettes fiscales ET sociales. Saisine via la DDFiP de votre département (formulaire Cerfa 15772). Confidentiel, gratuit.' },
      { q: 'Je suis micro-entrepreneur : puis-je négocier ?', r: 'Oui. Le 3957 prend en charge tous les statuts. Particularités : pas de CCSF (réservée aux entreprises), mais accès direct au Fonds d\'Action Sociale URSSAF (aide d\'urgence, prise en charge partielle). Demande à formuler par écrit, avec justificatifs de baisse d\'activité.' },
      { q: 'L\'URSSAF peut-elle me poursuivre personnellement ?', r: 'Uniquement en cas de manœuvres frauduleuses OU inobservation grave et répétée (art. L243-6-2 CSS) — pas pour une simple difficulté ponctuelle. Le dirigeant peut alors être condamné solidairement avec la société pour les cotisations dues.' },
      { q: 'Je suis en redressement judiciaire : que devient ma dette URSSAF ?', r: 'Elle entre dans le passif et fait l\'objet d\'une déclaration de créance par l\'URSSAF dans les 2 mois suivant la publication. Elle sera traitée comme les autres créances dans le plan de continuation. Les cotisations postérieures au jugement deviennent des créances privilégiées à payer normalement.' },
      { q: 'Le moratoire est-il automatique ?', r: 'Non. Vous devez le demander explicitement, par écrit, en justifiant votre situation (baisse de CA, événement personnel, baisse d\'activité saisonnière). L\'URSSAF répond généralement sous 15 jours. Le moratoire suspend les poursuites pendant sa durée.' },
      { q: 'Et si je ne réponds pas à la mise en demeure ?', r: 'La mise en demeure ouvre 1 mois pour payer ou saisir la CRA. À défaut, une SATD est lancée, puis si toujours impayé, l\'URSSAF peut saisir le tribunal en contrainte (titre exécutoire). Ne jamais laisser pourrir : un simple appel au 3957 permet d\'éviter l\'engrenage.' },
      { q: 'Mes salariés sont-ils impactés par mes dettes URSSAF ?', r: 'Les cotisations salariales prélevées sur leur salaire et non reversées sont une infraction pénale (abus de confiance). Les salariés conservent leurs droits Sécu (CPAM, retraite) sur la base des déclarations faites. Mais en cas de fraude grave, le dirigeant peut être poursuivi pénalement.' },
      { q: 'L\'URSSAF accepte-t-elle des remises gracieuses ?', r: 'Oui, sur les majorations et pénalités (rarement sur le principal). Demande écrite, justifier la bonne foi et la situation. La CRA peut accorder une remise partielle. À combiner avec un échéancier.' },
      { q: 'Je suis en cessation : URSSAF ou tribunal d\'abord ?', r: 'En théorie, la déclaration de cessation au tribunal est prioritaire (45 j max — art. L631-4 C. com.). En pratique, prévenir le 3957 en parallèle évite une SATD qui aggraverait votre trésorerie pendant les 45 j.' },
      { q: 'Une procédure collective efface-t-elle ma dette URSSAF ?', r: 'En liquidation judiciaire avec clôture pour insuffisance d\'actif : oui pour la société, mais pas pour le dirigeant (sauf s\'il a personnellement été poursuivi en L243-6-2). En RJ avec plan : la dette est échelonnée selon le plan. Le rétablissement professionnel (PRP) efface les dettes pro pour un EI sans salariés.' },
    ],
    liensConseilles: [
      { href: '/situation/dettes-urssaf', label: 'Guide complet — Dettes URSSAF' },
      { href: '/courriers/echelonnement-urssaf', label: 'Courrier d\'échelonnement' },
      { href: '/outils/prescription', label: 'Vérificateur de prescription' },
    ],
  },

  'pge-en-difficulte': {
    titre: 'FAQ — PGE en difficulté : restructuration, médiation, alternatives',
    metaTitle: 'PGE en difficulté : restructurer ou pas ? — AVELOR',
    metaDesc: 'Prêt Garanti par l\'État (Covid) en remboursement : restructuration jusqu\'à 10 ans, médiation, conséquences d\'une procédure collective. 10 questions clés.',
    intro: 'Le remboursement de votre PGE pèse sur la trésorerie ? Vous avez plusieurs leviers, mais l\'ordre dans lequel vous les actionnez change tout. Voici les 10 questions essentielles.',
    questions: [
      { q: 'Mon PGE peut-il être étalé au-delà de 6 ans ?', r: 'Oui — depuis le protocole de place du 19 janvier 2022, jusqu\'à 10 ans au total (6 + 4 supplémentaires), sans perte de la garantie d\'État. La banque ne peut pas refuser sans motif sérieux. Demande à formuler par écrit (LRAR).' },
      { q: 'Si je passe en sauvegarde / RJ, je perds la garantie d\'État ?', r: 'Oui — l\'ouverture d\'une procédure collective fait perdre la garantie d\'État pour la banque sur le PGE. La banque devient créancier ordinaire. Conséquence : elle n\'a plus d\'intérêt à négocier amiablement APRÈS le jugement. Donc : restructurez AVANT.' },
      { q: 'Comment saisir la Médiation du crédit ?', r: 'Gratuit, confidentiel : appelez le 3414 ou remplissez le formulaire sur mediateur-credit.banque-france.fr. Le médiateur prend contact avec votre banque sous 48 h, taux de succès > 60 %. À utiliser si la banque refuse ou tarde.' },
      { q: 'Mon banquier peut-il appeler la garantie sans m\'en parler ?', r: 'Non. La banque doit d\'abord vous mettre en demeure formelle, attendre 90 j de défaut, puis poursuivre les co-emprunteurs et cautions avant d\'appeler la garantie. Si elle ne le fait pas, Bpifrance peut refuser la garantie.' },
      { q: 'Le PGE peut-il être renégocié plusieurs fois ?', r: 'Oui en théorie, mais chaque renégociation aboutit à un nouvel échelonnement qui doit rester dans les 10 ans totaux. Au-delà, la garantie d\'État tombe.' },
      { q: 'Je peux différer 12 mois supplémentaires de plus ?', r: 'Oui, le protocole de place autorise un différé total cumulé pouvant aller jusqu\'à 6-12 mois sur les périodes les plus tendues. À négocier avec votre banque, puis en cas de refus avec la Médiation.' },
      { q: 'Le PGE peut-il être effacé en procédure collective ?', r: 'En liquidation : oui pour la part non-garantie de la banque (la banque récupère 70-90 % via la garantie d\'État). En RJ avec plan : il est échelonné selon le plan, l\'État perd alors une partie de sa garantie.' },
      { q: 'Y a-t-il une aide pour les PME post-PGE ?', r: 'Oui — le Prêt Croissance Relance, le Prêt Rebond (10 à 300 k€ sans garantie) et les dispositifs FSE+. La Direction Régionale Bpifrance peut faire un diagnostic gratuit (3247).' },
      { q: 'Suis-je personnellement caution du PGE ?', r: 'En principe non — le PGE est garanti à 70-90 % par l\'État, le reste par la banque. Mais certaines banques ont demandé une caution personnelle pour le différentiel. Vérifier votre contrat. Si caution = vérifier sa proportionnalité (L341-4 C. conso).' },
      { q: 'Mandat ad hoc + PGE : compatible ?', r: 'Excellent combo. Le mandat ad hoc est confidentiel (pas de publication), permet de tout renégocier dans un cadre sécurisé, et préserve la garantie d\'État sur le PGE. Coût : 1 500 à 5 000 €, demandé au tribunal de commerce.' },
    ],
    liensConseilles: [
      { href: '/situation/credit-bancaire', label: 'Guide crédit bancaire' },
      { href: '/aides-personnelles', label: 'Aides financières' },
    ],
  },

  'caution-personnelle': {
    titre: 'FAQ — Caution personnelle : contester, négocier, se protéger',
    metaTitle: 'Caution personnelle : peut-elle être annulée ? — AVELOR',
    metaDesc: 'Caution bancaire signée pour votre entreprise : disproportion, défaut d\'information, durée — 10 questions et réponses pour la contester.',
    intro: 'La caution personnelle est la première source de ruine patrimoniale des dirigeants. Mais une part importante est contestable. Voici les 10 questions clés.',
    questions: [
      { q: 'Ma caution peut-elle être annulée si elle est disproportionnée ?', r: 'Oui — art. L341-4 C. conso (ancien) / art. 2300 C. civ. : si la caution est manifestement disproportionnée à vos biens et revenus au jour de la signature, elle est inopposable. La banque doit prouver qu\'au moment du paiement, votre patrimoine permet de faire face. Charge de preuve sur le créancier (Cass. com. 9 nov. 2022, n° 21-19.012).' },
      { q: 'Qu\'est-ce que le défaut d\'information annuelle ?', r: 'L\'article L313-22 C. mon. fin. impose à la banque de vous informer chaque année (avant le 31 mars) du montant restant dû, du terme de l\'engagement, et de la faculté de révocation. À défaut : déchéance des intérêts et pénalités courus depuis la précédente information. Vérifiez vos courriers annuels.' },
      { q: 'Ma caution a-t-elle une durée maximale ?', r: 'Oui — la caution doit avoir une durée déterminée. Sans mention expresse, la jurisprudence limite à 10 ans pour les cautions consenties à compter du 1er janvier 2022 (réforme art. 2297 C. civ.). Au-delà, vous êtes libéré.' },
      { q: 'Je n\'ai pas relu le contrat, est-ce contestable ?', r: 'La caution doit comporter une mention manuscrite spécifique (art. 2297 C. civ. anciennement L341-2 C. conso). En son absence, elle peut être déclarée nulle. Demandez copie de l\'acte original (signé physiquement) et vérifiez la mention.' },
      { q: 'Mon conjoint a-t-il signé en mon nom ?', r: 'Si vous êtes marié en communauté, la caution donnée par un seul époux n\'engage que ses biens propres et ses revenus — pas les biens communs (art. 1415 C. civ., sauf consentement exprès du conjoint). Vérifier la signature de votre conjoint sur l\'acte.' },
      { q: 'La caution survit-elle à la liquidation de la société ?', r: 'Oui — la caution est un engagement personnel autonome. La liquidation de la société ne l\'éteint pas. La banque peut vous poursuivre individuellement, même après la clôture pour insuffisance d\'actif.' },
      { q: 'Peut-on négocier après l\'appel en garantie ?', r: 'Oui — la banque préfère souvent négocier qu\'engager une procédure longue. Proposez un règlement partiel forfaitaire (souvent 30 à 50 %), ou un échéancier. Faites-vous accompagner d\'un avocat en droit bancaire (premier RDV souvent gratuit).' },
      { q: 'L\'aide juridictionnelle peut-elle couvrir un avocat ?', r: 'Oui — si vos revenus sont devenus modestes après la liquidation (RFR < 19 411 €/an en 2025), vous avez droit à l\'aide juridictionnelle totale. Cela couvre l\'avocat pour une action de contestation de caution.' },
      { q: 'Y a-t-il un délai pour contester ?', r: 'Action en disproportion : prescription 5 ans à compter du paiement (art. 2224 C. civ.). Action en défaut d\'information annuelle : pas de délai pour soulever la déchéance. Action en nullité de l\'acte : 5 ans à compter de la signature ou de la connaissance du vice.' },
      { q: 'Que devient ma caution si la banque a perdu son privilège ?', r: 'Si la banque a négligé sa garantie principale (hypothèque non renouvelée, gage non publié, etc.), la caution est libérée à proportion de ce qu\'elle aurait pu recevoir par subrogation (art. 2314 C. civ., bénéfice de subrogation). Levier souvent méconnu.' },
    ],
    liensConseilles: [
      { href: '/proteger-famille', label: 'Guide protection famille' },
      { href: '/outils/aide-juridictionnelle', label: 'Calculateur AJ' },
    ],
  },

  'cessation-paiements': {
    titre: 'FAQ — Cessation des paiements : déclarer, anticiper, comprendre',
    metaTitle: 'Cessation des paiements : que faire dans les 45 jours ? — AVELOR',
    metaDesc: 'Vous êtes en cessation des paiements : déclaration au tribunal, conséquences, alternatives. 12 questions clés pour les dirigeants.',
    intro: 'La cessation des paiements n\'est pas une sanction — c\'est un état juridique à déclarer. Ce que vous faites dans les 45 jours détermine la suite.',
    questions: [
      { q: 'Qu\'est-ce que la cessation des paiements exactement ?', r: 'Définie par l\'art. L631-1 C. com. : impossibilité de faire face au passif exigible avec l\'actif disponible. Ce n\'est pas un découvert, ni des dettes globales — c\'est l\'impossibilité de payer les dettes ÉCHUES (URSSAF échu, factures payables, salaires) avec la trésorerie + créances clients immédiatement encaissables.' },
      { q: 'Quel est le délai exact pour déclarer ?', r: '45 jours à compter de la cessation (art. L631-4 C. com.). Le délai court à partir du moment où l\'état existe — pas de votre prise de conscience. Au-delà : risque d\'interdiction de gérer (art. L653-8) jusqu\'à 15 ans.' },
      { q: 'Le tribunal va-t-il me mettre en liquidation immédiate ?', r: 'Non — il examine d\'abord si un redressement est possible. Le RJ est privilégié pour les entreprises viables. La LJ n\'intervient que si la poursuite d\'activité est manifestement impossible. Présenter un projet de plan = atout.' },
      { q: 'Comment se déclare la cessation ?', r: 'Formulaire Cerfa 10530 disponible sur service-public.fr. Pièces : K-bis < 3 mois, état actif/passif exigible, comptes annuels, trésorerie < 1 mois, liste créanciers (nom, adresse, montant). Dépôt au greffe du tribunal compétent (TC ou TJ selon votre forme).' },
      { q: 'Puis-je continuer à diriger pendant la procédure ?', r: 'En sauvegarde et RJ : oui, sous le contrôle de l\'administrateur (s\'il y en a un). En LJ : non, le liquidateur prend la main. La continuation d\'activité est possible pendant 3 mois renouvelables si elle améliore le sort des créanciers.' },
      { q: 'Mes salaires et ceux de mes salariés sont-ils garantis ?', r: 'Les salaires des salariés sont garantis par l\'AGS jusqu\'à 92 736 € en 2025 (entreprise > 2 ans). Vos propres rémunérations de dirigeant non-salarié ne sont pas couvertes par l\'AGS (mais peuvent ouvrir droit à l\'ATI).' },
      { q: 'Mes biens personnels sont-ils saisissables ?', r: 'Si vous êtes en société sans caution : non, la responsabilité est limitée aux apports. Si vous êtes EI : depuis la loi du 14 fév. 2022, séparation de droit entre patrimoine pro et perso. Si vous avez signé des cautions personnelles : la banque peut vous poursuivre individuellement.' },
      { q: 'Que devient mon contrat de bail commercial ?', r: 'Le bailleur ne peut pas résilier pour les loyers antérieurs au jugement. L\'administrateur a 3 mois pour décider de continuer ou résilier. Les loyers postérieurs deviennent créances privilégiées à payer.' },
      { q: 'Mes contrats avec mes fournisseurs continuent-ils ?', r: 'Oui — les contrats en cours se poursuivent. L\'administrateur peut exiger leur continuation (art. L622-13 C. com.) et le fournisseur ne peut pas les résilier pour impayés antérieurs. Les prestations postérieures sont créances privilégiées.' },
      { q: 'Mon entreprise figure-t-elle au BODACC ?', r: 'Oui — l\'ouverture de toute procédure collective est publiée au BODACC. La publication est publique : vos partenaires, banque, clients, fournisseurs peuvent le savoir. Sauf en mandat ad hoc et conciliation (qui sont confidentiels).' },
      { q: 'Combien coûte la procédure ?', r: 'RJ/LJ : frais de greffe environ 80 € pour ouvrir. Honoraires du mandataire fixés au passif déclaré + actif réalisé (barème décret 85-1389). Pour une TPE : compter 5 000 à 15 000 € sur la procédure complète, payés sur l\'actif.' },
      { q: 'Puis-je éviter la procédure si je trouve un repreneur ?', r: 'Oui — la cession en pré-pack (préparée en conciliation puis homologuée en RJ) permet d\'éviter une procédure longue. Idéale si vous avez un repreneur identifié. Demander conseil à un avocat spécialisé immédiatement.' },
    ],
    liensConseilles: [
      { href: '/procedures', label: 'Toutes les procédures expliquées' },
      { href: '/glossaire', label: 'Glossaire des termes' },
      { href: '/outils/cout-procedures', label: 'Comparateur du coût des procédures' },
    ],
  },

  'rebondir-apres-liquidation': {
    titre: 'FAQ — Rebondir après une liquidation : aides, statuts, mental',
    metaTitle: 'Rebondir après une liquidation : guide complet — AVELOR',
    metaDesc: 'Après une liquidation : ATI, ACRE, ARCE, recréer une activité, 60 000 Rebonds, redémarrage psychologique. 12 questions essentielles.',
    intro: 'Une liquidation n\'est pas la fin. 60 % des dirigeants qui rebondissent créent une activité plus pérenne que la précédente. Voici comment.',
    questions: [
      { q: 'Puis-je recréer une activité immédiatement après une liquidation ?', r: 'Oui — sauf interdiction de gérer prononcée par le tribunal (rare en cas de bonne foi). La liquidation de votre société/EI n\'éteint pas votre capacité juridique à entreprendre. Vous pouvez recréer dès le lendemain de la clôture.' },
      { q: 'Combien de temps après ma liquidation puis-je toucher l\'ATI ?', r: 'Dès la fin de l\'activité — l\'ATI (Allocation Travailleurs Indépendants) est versée pendant 6 mois à 26,30 €/jour (≈ 800 €/mois). Conditions : cessation involontaire (RJ/LJ ou liquidation amiable post-baisse de revenus de 30 %+), revenus antérieurs > 10 000 €/an pendant 2 ans, activité min. 2 ans.' },
      { q: 'Qu\'est-ce que l\'ACRE et puis-je en bénéficier ?', r: 'L\'ACRE = exonération partielle de cotisations sociales pendant 1 an pour les créateurs/repreneurs. Tous statuts (micro, EI, gérant). À demander dans les 45 jours de l\'immatriculation. Cumulable avec ATI.' },
      { q: 'L\'ARCE m\'est-elle accessible ?', r: 'L\'ARCE (Aide à la Reprise et la Création d\'Entreprise) = versement en capital de 60 % de votre ARE restant à percevoir. Conditions : avoir été salarié AVANT votre activité indépendante (et avoir des droits ARE ouverts). À demander à France Travail dans les 6 mois de la création.' },
      { q: 'Suis-je obligé de payer mes anciennes dettes professionnelles ?', r: 'En LJ avec clôture pour insuffisance d\'actif : les dettes de la société sont éteintes. Pour un EI avec PRP : les dettes pro sont éteintes par effacement. Si vous avez signé des cautions personnelles : elles survivent à la liquidation et peuvent être réclamées par les créanciers.' },
      { q: 'Suis-je interdit bancaire après une liquidation ?', r: 'Non — pas automatiquement. L\'inscription FICP (5 ans) suit les incidents personnels de paiement. L\'inscription FCC suit les chèques sans provision. Vérifiez votre fichier sur particuliers.banque-france.fr. Droit au compte garanti par la BdF (art. L312-1 CMF).' },
      { q: 'Le micro-entreprise est-il un bon statut pour rebondir ?', r: 'Souvent oui — simplicité, charges proportionnelles au CA (12,3 % à 21,2 % selon activité), franchise TVA jusqu\'à 36 800 € ou 91 900 € de CA. Cumulable avec ATI. Limite : plafond de CA, et statut peu adapté si vous prévoyez une vraie croissance.' },
      { q: 'Comment retrouver la confiance des banques ?', r: 'Délai de 3 à 5 ans habituellement. Stratégies : compte pro dans une banque différente, micro-crédit Adie (jusqu\'à 17 000 €, accepte les profils fragiles), Prêt d\'honneur Initiative France (sans intérêts, sans garantie), BPI Prêt rebond (10 à 300 k€).' },
      { q: 'Qu\'est-ce que 60 000 Rebonds et comment y accéder ?', r: '60 000 Rebonds est une association nationale qui accompagne gratuitement les dirigeants post-liquidation : mentorat individuel, groupe de pairs, bilan, plan de rebond. Présent dans 30+ villes. Inscription sur 60000rebonds.com — entretien dans le mois.' },
      { q: 'Comment gérer le choc psychologique ?', r: 'C\'est un deuil — anticipable et surmontable. APESA (apesa.fr) propose 5 séances gratuites avec psychologue. 3114 disponible 24h/24 si crise. CMP secteur public gratuit. 60 000 Rebonds a aussi un volet écoute. 1 dirigeant sur 3 traverse un burn-out — vous n\'êtes pas seul·e.' },
      { q: 'Combien de temps avant de retravailler salarié ?', r: 'Si vous avez été salarié auparavant, vos droits ARE peuvent être réactivés sous certaines conditions. Si vous n\'avez pas de droits ARE et que vous avez touché l\'ATI : à l\'issue des 6 mois, vous pouvez basculer vers une nouvelle activité indépendante ou un emploi salarié.' },
      { q: 'Quels réseaux pour me reconstruire professionnellement ?', r: 'BGE Boutiques de Gestion (accompagnement créateurs), Initiative France (90 plateformes locales, prêts d\'honneur), Réseau Entreprendre (mentorat), France Active (garanties), Pépinières d\'entreprises. Tous gratuits ou peu coûteux.' },
    ],
    liensConseilles: [
      { href: '/rebond', label: 'Guide rebond complet' },
      { href: '/outils/ati', label: 'Estimateur ATI' },
      { href: '/outils/acre-arce', label: 'Vérificateur ACRE/ARCE' },
    ],
  },

  'assignation-tribunal': {
    titre: 'FAQ — Assignation au tribunal : urgence et défense',
    metaTitle: 'Assignation au tribunal : que faire ? — AVELOR',
    metaDesc: 'Vous avez reçu une assignation : audience, défense, aide juridictionnelle, plan de cession. Réponses claires aux 10 questions essentielles.',
    intro: 'Une assignation au tribunal est urgente mais pas désespérée. Voici les 10 questions à se poser ce soir.',
    questions: [
      { q: 'Je n\'ai pas le temps de me défendre. Que se passe-t-il si je ne viens pas ?', r: 'Le tribunal peut juger PAR DÉFAUT — presque toujours en votre défaveur. Représentez-vous (ou faites-vous représenter par un avocat). L\'audience ne dure souvent que 15 minutes.' },
      { q: 'Combien de temps ai-je pour réagir ?', r: 'Variable selon l\'assignation : généralement 15 j minimum entre la signification et l\'audience. Lisez la date d\'audience sur l\'acte. Contactez un avocat AUJOURD\'HUI.' },
      { q: 'Puis-je obtenir un délai supplémentaire ?', r: 'Oui, en demandant un renvoi à l\'audience (argument : préparation du dossier, recherche d\'avocat). Le juge accorde généralement 1 mois.' },
      { q: 'Mon RFR est faible : puis-je avoir un avocat gratuit ?', r: 'Oui via l\'aide juridictionnelle si votre RFR < 19 411 €/an (totale) ou < 25 081 € (partielle). Demande sur service-public.fr — réponse rapide. Voir notre calculateur dédié.' },
      { q: 'L\'assignation peut-elle me faire mettre en liquidation immédiate ?', r: 'Le tribunal examine d\'abord s\'il y a cessation des paiements (L631-1). Si oui, il ouvre une procédure (RJ ou LJ). Si non, il rejette l\'assignation. Préparer : trésorerie, liste créanciers, derniers bilans, justificatifs.' },
      { q: 'Puis-je proposer un plan de cession à l\'audience ?', r: 'Oui — proposer une cession partielle ou totale peut éviter la liquidation pure. Le tribunal préfère sauver l\'activité quand c\'est possible. Préparer un repreneur identifié = atout majeur.' },
      { q: 'Le créancier qui m\'assigne peut-il être condamné aux dépens ?', r: 'Oui, si l\'assignation est manifestement abusive ou non fondée. Le juge peut imposer le paiement des frais à l\'assignant. Argument à soulever par l\'avocat.' },
      { q: 'Que faire des autres créanciers pendant l\'audience ?', r: 'Suspendre les paiements non-essentiels. Ne PAS payer un créancier en priorité (risque de période suspecte = annulation). Continuer à payer les fournisseurs essentiels à l\'activité.' },
      { q: 'Quel est le coût d\'un avocat pour cette audience ?', r: 'Forfait audience : 800-2 000 € HT. Aide juridictionnelle si éligible. Premier RDV souvent gratuit — appelez 2-3 cabinets pour comparer.' },
      { q: 'Si je perds, ai-je un recours ?', r: 'Appel possible sous 10 jours (art. R661-3 C. com.). L\'appel est suspensif sauf exécution provisoire de plein droit. À discuter immédiatement avec l\'avocat.' },
    ],
    liensConseilles: [
      { href: '/outils/aide-juridictionnelle', label: 'Calculateur AJ' },
      { href: '/situation/credit-bancaire', label: 'Guide complet' },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(FAQ_PAR_SITUATION).map((situation) => ({ situation }));
}

export async function generateMetadata({ params }: { params: Promise<{ situation: string }> }): Promise<Metadata> {
  const { situation } = await params;
  const data = FAQ_PAR_SITUATION[situation];
  if (!data) return {};
  const ogUrl = `/api/og?${new URLSearchParams({ titre: data.titre.replace(/^FAQ — /, ''), sous: 'Questions fréquentes', cat: 'faq' }).toString()}`;
  return {
    title: data.metaTitle,
    description: data.metaDesc,
    openGraph: {
      title: data.titre,
      description: data.metaDesc,
      type: 'article',
      images: [{ url: ogUrl, width: 1200, height: 630, alt: data.titre }],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.titre,
      description: data.metaDesc,
      images: [ogUrl],
    },
  };
}

export default async function FaqCibleePage({ params }: { params: Promise<{ situation: string }> }) {
  const { situation } = await params;
  const data = FAQ_PAR_SITUATION[situation];
  if (!data) return notFound();

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map((qr) => ({
      '@type': 'Question',
      name: qr.q,
      acceptedAnswer: { '@type': 'Answer', text: qr.r },
    })),
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://avelor.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://avelor.vercel.app/faq' },
      { '@type': 'ListItem', position: 3, name: data.titre },
    ],
  };

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <Link href="/faq" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Toutes les FAQ
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">{data.titre}</h1>
      <p className="mt-4 max-w-2xl text-base text-navy/70">{data.intro}</p>

      <div className="mt-10 space-y-5">
        {data.questions.map((qr, i) => (
          <details key={i} className="glass-soft rounded-2xl p-5">
            <summary className="cursor-pointer list-none font-display text-base text-navy hover:text-bleu-fonce">
              <span className="mr-2 text-navy/40">{i + 1}.</span>
              {qr.q}
            </summary>
            <p className="mt-3 text-sm text-navy/80">{qr.r}</p>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-navy/15 bg-white/60 p-5">
        <p className="font-display text-base text-navy">Pour aller plus loin</p>
        <ul className="mt-3 space-y-1.5 text-sm text-navy/80">
          {data.liensConseilles.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-bleu-fonce hover:underline">
                → {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
