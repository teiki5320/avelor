import type { Reponses, CompanyData } from './types';
import { getCompanyAge } from './secteur';

export type Axe = 'restructurer' | 'ceder' | 'sauvegarder' | 'liquider' | 'rebondir';

export interface Strategie {
  axe: Axe;
  titre: string;
  verdict: string;
  pourquoi: string[];
  etapes: string[];
  alternatives: string[];
  score: number;
}

function isEI(forme: string): boolean {
  return /individuel|ei|eirl|micro|auto/i.test(forme);
}

export function computeScores(r: Reponses, c: CompanyData): Record<Axe, number> {
  const age = getCompanyAge(c.dateCreation) ?? 0;
  const ei = isEI(c.formeJuridique);

  const scores: Record<Axe, number> = {
    restructurer: 0,
    sauvegarder: 0,
    ceder: 0,
    liquider: 0,
    rebondir: 0,
  };

  if (r.situation === 'prevention') scores.restructurer += 3;
  if (r.situation === 'tresorie') scores.restructurer += 2;
  if (r.moral === 'combatif') scores.restructurer += 2;
  if (age >= 5) scores.restructurer += 1;
  if (r.vente === 'non') scores.restructurer += 2;

  if (r.situation === 'tresorie') scores.sauvegarder += 2;
  if (r.situation === 'prevention') scores.sauvegarder += 1;
  if (r.effectif === 'salaries') scores.sauvegarder += 1;
  if (r.vente === 'non') scores.sauvegarder += 1;

  if (r.vente === 'oui') scores.ceder += 4;
  if (r.vente === 'peut-etre') scores.ceder += 2;
  if (r.moral === 'epuise') scores.ceder += 1;
  if (age >= 10) scores.ceder += 1;
  if (r.effectif === 'salaries') scores.ceder += 1;
  if (r.situation === 'redressement') scores.ceder += 1;

  if (r.situation === 'redressement' && r.moral === 'perdu') scores.liquider += 2;
  if (r.situation === 'assignation') scores.liquider += 1;
  if (r.vente === 'non' && r.moral === 'perdu') scores.liquider += 1;
  if (r.caution === 'non') scores.liquider += 1;
  if (r.effectif === 'independant' && r.moral !== 'combatif') scores.liquider += 1;

  if (ei && r.effectif === 'independant') scores.rebondir += 2;
  if (ei && r.situation === 'redressement') scores.rebondir += 2;
  if (r.moral === 'perdu') scores.rebondir += 1;

  return scores;
}

export function buildStrategie(axe: Axe, r: Reponses, c: CompanyData, score: number): Strategie {
  const ville = c.ville || 'votre ville';

  switch (axe) {
    case 'restructurer':
      return {
        axe,
        score,
        titre: 'Restructurer en interne',
        verdict:
          "Votre situation est encore récupérable sans procédure publique. La stratégie : négocier des délais, couper les coûts non vitaux, et sécuriser la trésorerie à 6 mois.",
        pourquoi: [
          r.situation === 'prevention' || r.situation === 'tresorie'
            ? "Vous n'êtes pas (ou pas depuis plus de 45 j) en cessation des paiements — les outils amiables restent accessibles."
            : "Votre moral et votre volonté de continuer sont des atouts forts.",
          r.moral === 'combatif'
            ? "Vous avez l'énergie nécessaire pour piloter la restructuration."
            : 'Une restructuration ciblée préserve votre outil de travail.',
          r.vente === 'non' ? "Vous souhaitez garder l'entreprise — c'est cohérent avec cette voie." : 'Cette option laisse toutes les autres ouvertes.',
        ],
        etapes: [
          'Prévisionnel de trésorerie à 6 mois avec votre expert-comptable',
          'Demandes de délais : URSSAF, SIE, bailleur, fournisseurs (courriers Avelor)',
          'Saisine médiation du crédit si tension bancaire',
          'Audit des coûts fixes — éliminer le non-essentiel',
          'RDV CCI / CIP pour un diagnostic externe gratuit',
        ],
        alternatives: [
          'Si les négociations échouent : bascule en mandat ad hoc ou conciliation',
          'Si la situation se dégrade rapidement : sauvegarde judiciaire',
        ],
      };

    case 'sauvegarder':
      return {
        axe,
        score,
        titre: 'Ouvrir une procédure de sauvegarde',
        verdict:
          "L'entreprise est viable à moyen terme mais a besoin d'une bulle de protection pour respirer. La sauvegarde fige les dettes, suspend les poursuites, et laisse le dirigeant aux commandes.",
        pourquoi: [
          "Vous n'êtes pas encore en cessation des paiements — la sauvegarde est la procédure la plus protectrice ouverte à votre cas.",
          r.effectif === 'salaries'
            ? "Elle préserve l'emploi pendant la période d'observation."
            : "Elle gèle les poursuites individuelles (banque, fournisseurs).",
          "Le plan de sauvegarde peut s'étaler sur 10 ans.",
        ],
        etapes: [
          "Rendez-vous confidentiel avec un avocat en droit des entreprises en difficulté",
          `Préparation du dossier (bilan, trésorerie, passif exigible) — tribunal de commerce de ${ville}`,
          "Dépôt de la requête en sauvegarde",
          "Audience d'ouverture et désignation du juge-commissaire / mandataire",
          "Élaboration du plan de sauvegarde avec l'administrateur",
        ],
        alternatives: [
          'Si vous préférez la confidentialité totale : mandat ad hoc puis conciliation',
          'Si la situation se dégrade : bascule en redressement',
        ],
      };

    case 'ceder':
      return {
        axe,
        score,
        titre: "Organiser la cession de l'entreprise",
        verdict:
          "Céder n'est pas échouer — c'est souvent la décision qui préserve le plus : les emplois, votre patrimoine, votre santé. La cession peut s'organiser hors procédure (amiable) ou en procédure (plan de cession).",
        pourquoi: [
          r.vente === 'oui'
            ? "Vous êtes prêt·e à céder — c'est l'axe qui maximise les options."
            : "Vous y êtes ouvert·e — c'est le bon moment pour évaluer sérieusement cette piste.",
          r.moral === 'epuise'
            ? 'Céder vous libère de la charge psychique quotidienne.'
            : "La cession préserve la valeur accumulée pendant des années.",
          r.effectif === 'salaries'
            ? 'Un repreneur reprend souvent les contrats de travail — les emplois sont préservés.'
            : 'Même en indépendant, la clientèle et la marque ont une valeur.',
        ],
        etapes: [
          "Valorisation par un expert-comptable (multiple d'EBE, valeur patrimoniale)",
          'Identification de repreneurs : salariés, concurrents, réseaux CCI/CMA, plateformes (Cedants-Repreneurs.fr)',
          'Data room (bilan, contrats, litiges) + mandat à un intermédiaire de cession',
          'Négociation accompagnée (avocat + expert-comptable)',
          r.situation === 'redressement'
            ? 'Si en procédure : proposition de plan de cession au tribunal'
            : 'Signature compromis puis acte définitif',
        ],
        alternatives: [
          "Location-gérance avec option d'achat (transition en douceur)",
          'Cession partielle (actifs clés seulement)',
        ],
      };

    case 'liquider':
      return {
        axe,
        score,
        titre: 'Organiser une liquidation propre',
        verdict:
          "Quand l'entreprise ne peut plus être sauvée ni cédée, la liquidation judiciaire est la sortie la plus propre — pour vos créanciers et pour vous. Elle est encadrée et peut protéger le dirigeant de bonne foi.",
        pourquoi: [
          r.situation === 'redressement' || r.situation === 'assignation'
            ? "Vous êtes en cessation des paiements — la procédure devient inévitable si la reprise n'est pas possible."
            : "La situation rend la poursuite d'activité peu réaliste.",
          r.caution === 'non'
            ? "Vous n'avez pas de caution personnelle — vous évitez la ruine patrimoniale personnelle."
            : 'Même avec cautions, une liquidation rapide peut limiter les dégâts.',
          r.moral !== 'combatif'
            ? 'Arrêter dignement préserve votre santé pour la suite.'
            : "Arrêter n'est pas renoncer — c'est choisir son moment.",
        ],
        etapes: [
          'Déclaration de cessation des paiements au tribunal (délai 45 j)',
          "Le juge nomme un mandataire liquidateur — vous l'assistez dans l'inventaire",
          'Licenciement des éventuels salariés avec garantie AGS',
          "Réalisation de l'actif et répartition entre créanciers",
          'Clôture de la procédure — puis rebond personnel',
        ],
        alternatives: [
          'Si vous êtes entrepreneur individuel : rétablissement professionnel (PRP, 4 mois)',
          "Si un repreneur apparaît en dernière minute : plan de cession",
        ],
      };

    case 'rebondir':
      return {
        axe,
        score,
        titre: 'Rétablissement professionnel (PRP) puis rebond',
        verdict:
          "Vous êtes entrepreneur individuel sans (ou peu de) salariés ni gros actifs. Le rétablissement professionnel efface les dettes professionnelles en 4 mois, sans liquidation longue, pour vous permettre de repartir.",
        pourquoi: [
          'La procédure est rapide (4 mois) et allégée.',
          "Pas d'inventaire complexe, pas de mandataire liquidateur désigné.",
          'Vous pouvez recréer une activité dès la clôture.',
        ],
        etapes: [
          "Vérifier l'éligibilité : EI, aucun salarié, actifs < 15 000 €",
          'Dépôt de la requête au tribunal de commerce',
          "Désignation d'un mandataire qui examine votre situation",
          'Clôture : effacement des dettes professionnelles',
          'Reprise : 60 000 Rebonds + BPI Prêt rebond pour relancer',
        ],
        alternatives: [
          'Si actifs > 15 000 € : liquidation judiciaire simplifiée',
          'Si salariés : redressement classique',
        ],
      };
  }
}

export interface StrategieResult {
  main: Strategie;
  secondary: Strategie | null;
  scores: Record<Axe, number>;
}

export function resolveStrategie(r: Reponses, c: CompanyData): StrategieResult | null {
  const scores = computeScores(r, c);
  const ranked = (Object.entries(scores) as [Axe, number][])
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1]);
  if (ranked.length === 0) return null;
  return {
    main: buildStrategie(ranked[0][0], r, c, ranked[0][1]),
    secondary: ranked.length > 1 ? buildStrategie(ranked[1][0], r, c, ranked[1][1]) : null,
    scores,
  };
}

export const AXE_META: Record<Axe, { label: string; couleur: string; gradient: string; icone: string }> = {
  restructurer: { label: 'Restructurer', couleur: 'bleu', gradient: 'from-bleu/15 to-bleu-fonce/10', icone: '🔧' },
  sauvegarder: { label: 'Sauvegarder', couleur: 'vert', gradient: 'from-vert/15 to-vert/5', icone: '🛡️' },
  ceder: { label: 'Céder', couleur: 'jaune', gradient: 'from-jaune/20 to-jaune/5', icone: '🔑' },
  liquider: { label: 'Liquider proprement', couleur: 'navy', gradient: 'from-navy/15 to-navy/5', icone: '🔚' },
  rebondir: { label: 'Rebondir (PRP)', couleur: 'rouge', gradient: 'from-rouge/15 to-rouge/5', icone: '♻️' },
};
