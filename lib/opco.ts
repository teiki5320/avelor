/**
 * Mapping NAF → OPCO (Opérateur de Compétences).
 *
 * Les OPCO collectent la contribution unique formation + alternance,
 * et financent les actions de formation, l'apprentissage, le CSP, le
 * FNE-Formation. Identifier le bon OPCO permet à un employeur en
 * difficulté de mobiliser FNE, POE, ProA, OPCO Mobilités…
 *
 * Source : décret n° 2019-1326 du 9 décembre 2019 (création OPCO) +
 * arrêté du 17 mars 2020 (couverture des branches par OPCO).
 *
 * 11 OPCO depuis 2019 — pour rappel : AFDAS, AKTO, ATLAS, OPCO 2i,
 * OPCO Construction, OPCO EP, OPCO Mobilités, OPCO Santé,
 * Uniformation (OPCO de la Cohésion sociale), OCAPIAT, L'Opcommerce.
 */

export type Opco =
  | 'akto'
  | 'opco-ep'
  | 'opco-2i'
  | 'opco-construction'
  | 'opco-mobilites'
  | 'opco-sante'
  | 'opcommerce'
  | 'uniformation'
  | 'afdas'
  | 'atlas'
  | 'ocapiat'
  | 'autre';

export interface OpcoInfo {
  cle: Opco;
  nom: string;
  description: string;
  telephone?: string;
  site: string;
  secteursClefs: string;
}

export const OPCO_DATA: Record<Opco, OpcoInfo> = {
  'akto': {
    cle: 'akto',
    nom: 'AKTO',
    description: 'Services à forte intensité de main-d\'œuvre : HCR, propreté, sécurité, intérim, conseil. Très actif sur le FNE-Formation et le CSP.',
    telephone: '01 53 35 70 00',
    site: 'https://www.akto.fr',
    secteursClefs: 'HCR, propreté, sécurité, intérim, conseil, restauration',
  },
  'opco-ep': {
    cle: 'opco-ep',
    nom: 'OPCO EP — Entreprises de Proximité',
    description: 'Artisanat, professions libérales, TPE : coiffure, esthétique, fleurs, photo, optique, immobilier… Réseau accompagnant de proximité.',
    telephone: '01 71 11 25 00',
    site: 'https://www.opcoep.fr',
    secteursClefs: 'artisanat, libéral, services proximité',
  },
  'opco-2i': {
    cle: 'opco-2i',
    nom: 'OPCO 2i — Interindustriel',
    description: 'Industrie : métallurgie, chimie, plasturgie, papier-carton, textile, ameublement, verre, céramique.',
    telephone: '01 41 64 75 75',
    site: 'https://www.opco2i.fr',
    secteursClefs: 'industrie, métallurgie, chimie',
  },
  'opco-construction': {
    cle: 'opco-construction',
    nom: 'Constructys — OPCO Construction',
    description: 'Bâtiment, travaux publics, négoce de matériaux. Pilote la formation des compagnons et des apprentis BTP.',
    telephone: '01 82 83 95 50',
    site: 'https://www.constructys.fr',
    secteursClefs: 'BTP, gros œuvre, second œuvre, TP',
  },
  'opco-mobilites': {
    cle: 'opco-mobilites',
    nom: 'OPCO Mobilités',
    description: 'Transport routier, urbain, ferroviaire, fluvial ; services automobiles ; tourisme. Mobilise FNE-Formation et CSP en cas de difficulté.',
    telephone: '01 75 60 67 00',
    site: 'https://www.opcomobilites.fr',
    secteursClefs: 'transport, taxi/VTC, automobile, tourisme',
  },
  'opco-sante': {
    cle: 'opco-sante',
    nom: 'OPCO Santé',
    description: 'Établissements de santé, médico-sociaux, aide à domicile, hospitalisation privée.',
    telephone: '01 53 91 53 91',
    site: 'https://www.opco-sante.fr',
    secteursClefs: 'santé, médico-social, aide à domicile',
  },
  'opcommerce': {
    cle: 'opcommerce',
    nom: "L'Opcommerce",
    description: 'Commerce de détail et de gros : distribution, habillement, bricolage, optique, jardineries, commerces alimentaires… Finance FNE-Formation et reconversion des salariés du commerce.',
    site: 'https://www.lopcommerce.com',
    secteursClefs: 'commerce de détail, commerce de gros, distribution',
  },
  'uniformation': {
    cle: 'uniformation',
    nom: 'Uniformation — OPCO de la Cohésion sociale',
    description: "Économie sociale et solidaire, habitat social, mutualité, branche associative, animation, sport, accueil enfants, insertion par l'économique.",
    telephone: '0 805 50 22 24',
    site: 'https://www.uniformation.fr',
    secteursClefs: 'ESS, mutualité, habitat social, animation, sport, insertion, associations',
  },
  'afdas': {
    cle: 'afdas',
    nom: 'AFDAS',
    description: 'Culture, médias, communication, sport, loisirs, jeux de hasard. Spécialiste des intermittents.',
    telephone: '01 44 78 38 00',
    site: 'https://www.afdas.com',
    secteursClefs: 'culture, audiovisuel, spectacle, presse, sport',
  },
  'atlas': {
    cle: 'atlas',
    nom: 'ATLAS',
    description: 'Services financiers, assurance, conseil. Spécialiste des cadres et professions intellectuelles.',
    telephone: '01 86 90 33 33',
    site: 'https://www.opco-atlas.fr',
    secteursClefs: 'banque, assurance, conseil, expertise comptable',
  },
  'ocapiat': {
    cle: 'ocapiat',
    nom: 'OCAPIAT',
    description: 'Agriculture, agroalimentaire, pêche, aquaculture, coopératives agricoles.',
    telephone: '02 51 17 38 99',
    site: 'https://www.ocapiat.fr',
    secteursClefs: 'agriculture, agroalimentaire, pêche',
  },
  'autre': {
    cle: 'autre',
    nom: 'OPCO non identifié',
    description: 'Votre branche n\'a pas été identifiée. Consultez votre convention collective (article OPCO) ou demandez-le à votre expert-comptable.',
    site: 'https://travail-emploi.gouv.fr/formation-professionnelle/acteurs-cadre-et-qualite-de-la-formation-professionnelle/article/operateurs-de-competences-opco',
    secteursClefs: 'divers',
  },
};

/**
 * Retourne l'OPCO compétent pour un code NAF donné (2 premiers
 * chiffres en priorité, 4 premiers caractères pour affiner).
 *
 * Couverture indicative : les branches ne sont pas strictement
 * mappées sur le NAF (une convention collective peut couvrir des
 * NAF variés). Pour un cas limite, vérifier l'IDCC (Identifiant
 * convention collective) sur le bulletin de paie.
 */
export function getOpcoFromNaf(naf: string): OpcoInfo {
  const code = (naf || '').replace(/\./g, '').toUpperCase();
  const prefix2 = code.slice(0, 2);
  const prefix4 = code.slice(0, 4);

  // ── Raffinements par classe (testés AVANT les règles par division) ──
  // Boulangerie-pâtisserie artisanale (10.71) : branche boulangerie → OPCO EP
  // (OCAPIAT ne vaut que pour l'industrie agroalimentaire).
  if (prefix4 === '1071') return OPCO_DATA['opco-ep'];
  // Pharmacie d'officine (47.73) : branche pharmacie → OPCO EP.
  if (prefix4 === '4773') return OPCO_DATA['opco-ep'];
  // Auto-écoles (85.53) : branche des services de l'automobile → OPCO Mobilités.
  if (prefix4 === '8553') return OPCO_DATA['opco-mobilites'];

  // Agriculture, pêche (section A)
  if (/^(01|02|03|10|11)/.test(prefix2)) return OPCO_DATA['ocapiat'];

  // BTP (section F) + génie civil
  if (/^(41|42|43)/.test(prefix2)) return OPCO_DATA['opco-construction'];

  // Industrie (sections B-E) : extraction (05-09), tabac (12),
  // manufacture (13-33), énergie (35), eau/déchets/dépollution (36-39)
  if (/^(05|06|07|08|09|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|35|36|37|38|39)/.test(prefix2)) {
    return OPCO_DATA['opco-2i'];
  }

  // Transport + automobile (section H + 45/96 services auto)
  if (/^(45|49|50|51|52|53|55)/.test(prefix2) && prefix2 !== '55') {
    return OPCO_DATA['opco-mobilites'];
  }

  // Commerce détail et gros (section G hors auto) → L'Opcommerce
  // (les artisans-commerçants de bouche 1071C etc. sont captés plus haut par OPCO 2i/EP)
  if (/^(46|47)/.test(prefix2)) {
    return OPCO_DATA['opcommerce'];
  }

  // Hôtellerie-restauration (section I)
  if (/^(55|56)/.test(prefix2)) return OPCO_DATA['akto'];

  // Information/communication, médias, IT (section J)
  if (/^(58|59|60|61|62|63)/.test(prefix2)) {
    // Médias/édition/audiovisuel → AFDAS ; IT/services info → AKTO ou ATLAS
    if (/^(58|59|60)/.test(prefix2)) return OPCO_DATA['afdas'];
    if (/^(62|63)/.test(prefix2)) return OPCO_DATA['akto'];
    return OPCO_DATA['atlas'];
  }

  // Finance, assurance, conseil (sections K, M)
  if (/^(64|65|66)/.test(prefix2)) return OPCO_DATA['atlas'];
  // Vétérinaires (75) : branche vétérinaire → OPCO EP
  if (prefix2 === '75') return OPCO_DATA['opco-ep'];
  if (/^(69|70|71|72|73|74)/.test(prefix2)) {
    // Avocats, experts-comptables → ATLAS ; conseil divers → AKTO
    if (/^(69|692)/.test(prefix4) || /^(692|6920)/.test(prefix4)) return OPCO_DATA['atlas'];
    if (/^(7022)/.test(prefix4)) return OPCO_DATA['akto'];
    return OPCO_DATA['atlas'];
  }

  // Immobilier (section L)
  if (/^(68)/.test(prefix2)) return OPCO_DATA['opco-ep'];

  // Services administratifs et soutien (section N)
  if (/^(77|78|80|81|82)/.test(prefix2)) return OPCO_DATA['akto'];
  // Agences de voyage et tourisme (79) → OPCO Mobilités (branche tourisme)
  if (prefix2 === '79') return OPCO_DATA['opco-mobilites'];

  // Enseignement (section P)
  if (/^(85)/.test(prefix2)) return OPCO_DATA['uniformation'];

  // Santé humaine et action sociale (section Q)
  if (/^(86|87|88)/.test(prefix2)) return OPCO_DATA['opco-sante'];

  // Arts, spectacles, sport (section R)
  if (/^(90|91|92|93)/.test(prefix2)) {
    if (/^(92|93)/.test(prefix2)) return OPCO_DATA['afdas']; // sport, jeux
    return OPCO_DATA['afdas'];
  }

  // Associations, organisations (94) → Uniformation (Cohésion sociale)
  if (prefix2 === '94') return OPCO_DATA['uniformation'];

  // Services aux ménages, artisans (section S)
  if (/^(95|96)/.test(prefix2)) return OPCO_DATA['opco-ep'];

  return OPCO_DATA['autre'];
}
