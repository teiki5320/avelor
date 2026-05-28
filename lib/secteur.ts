import type { CompanyData } from './types';

export type Secteur =
  | 'agriculture'
  | 'peche'
  | 'industrie'
  | 'btp'
  | 'commerce'
  | 'transport'
  | 'hotellerie'
  | 'information'
  | 'finance'
  | 'immobilier'
  | 'liberal'
  | 'education'
  | 'sante'
  | 'artisanat'
  | 'autre';

interface OrganismeSecteur {
  nom: string;
  role: string;
  telephone?: string;
  site?: string;
}

export interface SectorInfo {
  secteur: Secteur;
  label: string;
  cotisationOrg: string;
  cotisationTel: string;
  cotisationSite: string;
  syndicats: OrganismeSecteur[];
  aidesSpecifiques: { nom: string; description: string; site?: string; badge?: string }[];
  soutien?: { nom: string; description: string; telephone?: string; site?: string };
  conseilsSpecifiques: string[];
  chambre: 'CCI' | 'CMA' | 'CA';
  /** Caisses de retraite professionnelles spécifiques (libéral / santé). */
  caissesRetraite?: CaisseRetraite[];
  /** Ordres professionnels et cellules d'aide aux confrères en difficulté. */
  ordresProfessionnels?: OrdreProfessionnel[];
  /** Niveau de tension du secteur (utilisé pour modérer les attentes du dirigeant). */
  santeSecteur?: SanteSecteur;
  /** Obligations spécifiques en cas de licenciement économique (CSP, PSE, congé de reclassement…). */
  obligationsLicenciement?: ObligationLicenciement[];
}

export interface ObligationLicenciement {
  /** Sigle court (ex: "CSP", "PSE"). */
  sigle: string;
  /** Nom complet de l'obligation. */
  nom: string;
  /** Description courte. */
  description: string;
  /** Seuil maximal d'effectif (en nombre de salariés). null = applicable à tous. */
  seuilMax?: number;
  /** Téléphone de contact (ex: France Travail). */
  telephone?: string;
  /** Site officiel. */
  site?: string;
  /** Badge informatif court (ex: "Obligatoire"). */
  badge?: string;
}

export interface CaisseRetraite {
  /** Profession concernée (libellé court, ex: "Médecin", "Avocat"). */
  profession: string;
  /** Sigle de la caisse (ex: "CARMF"). */
  caisse: string;
  /** Téléphone de contact action sociale. */
  telephone: string;
  /** URL du site officiel. */
  site: string;
}

export interface OrdreProfessionnel {
  /** Profession (libellé court). */
  profession: string;
  /** Nom complet de l'ordre. */
  nom: string;
  telephone: string;
  site: string;
  /** Précision utile (ex: « cellule d'aide aux confrères »). */
  note?: string;
}

export interface SanteSecteur {
  niveau: 'crise' | 'tendu' | 'normal';
  titre: string;
  message: string;
  ressource?: { label: string; url: string };
}

function sectionFromNaf(naf: string): string {
  if (!naf) return '';
  const code = naf.replace(/\./g, '');
  const num = parseInt(code.slice(0, 2), 10);
  if (num <= 3) return 'A';
  if (num <= 9) return 'B';
  if (num <= 33) return 'C';
  if (num === 35) return 'D';
  if (num <= 39) return 'E';
  if (num <= 43) return 'F';
  if (num <= 47) return 'G';
  if (num <= 53) return 'H';
  if (num <= 56) return 'I';
  if (num <= 63) return 'J';
  if (num <= 66) return 'K';
  if (num === 68) return 'L';
  if (num <= 75) return 'M';
  if (num <= 82) return 'N';
  if (num === 84) return 'O';
  if (num === 85) return 'P';
  if (num <= 88) return 'Q';
  if (num <= 93) return 'R';
  if (num <= 96) return 'S';
  return '';
}

function secteurFromSection(section: string): Secteur {
  const map: Record<string, Secteur> = {
    A: 'agriculture',
    B: 'industrie',
    C: 'industrie',
    D: 'industrie',
    E: 'industrie',
    F: 'btp',
    G: 'commerce',
    H: 'transport',
    I: 'hotellerie',
    J: 'information',
    K: 'finance',
    L: 'immobilier',
    M: 'liberal',
    N: 'liberal',
    O: 'autre',
    P: 'education',
    Q: 'sante',
    R: 'autre',
    S: 'artisanat',
  };
  return map[section] ?? 'autre';
}

function isArtisan(naf: string, forme: string): boolean {
  const artisanNaf = ['43', '10', '14', '15', '16', '23', '25', '31', '32', '33', '95', '96'];
  const prefix = naf.replace(/\./g, '').slice(0, 2);
  if (artisanNaf.includes(prefix)) return true;
  if (/artisan|métier/i.test(forme)) return true;
  return false;
}

/**
 * Obligation CSP (Contrat de Sécurisation Professionnelle).
 * À proposer obligatoirement à tout salarié licencié pour motif économique
 * dans une entreprise de moins de 1 000 salariés (et hors procédure collective où c'est le CRP).
 * Source : Code du travail L1233-65 et suivants.
 */
export const CSP_OBLIGATION: ObligationLicenciement = {
  sigle: 'CSP',
  nom: 'Contrat de Sécurisation Professionnelle',
  description:
    "Obligatoire pour tout licenciement économique en entreprise de moins de 1 000 salariés. À proposer au salarié avant la notification du licenciement (délai de réflexion : 21 jours). En cas d'acceptation : indemnités à 75 % du salaire brut antérieur pendant 12 mois (sous conditions d'ancienneté), accompagnement personnalisé France Travail. Le non-respect expose l'employeur à payer une contribution équivalente à 2 mois de salaire.",
  seuilMax: 1000,
  telephone: '39 49',
  site: 'https://www.france-travail.fr/candidat/en-cas-de/le-contrat-de-securisation-pro.html',
  badge: 'Obligatoire si licenciement éco',
};

const SECTOR_DATA: Record<Secteur, Omit<SectorInfo, 'secteur'>> = {
  agriculture: {
    label: 'Agriculture',
    cotisationOrg: 'MSA (Mutualité Sociale Agricole)',
    cotisationTel: '36 98',
    cotisationSite: 'https://www.msa.fr',
    syndicats: [
      { nom: 'FNSEA', role: 'Syndicat agricole majoritaire', site: 'https://www.fnsea.fr' },
      { nom: 'Jeunes Agriculteurs', role: 'Accompagnement jeunes exploitants', site: 'https://www.jeunes-agriculteurs.fr' },
      { nom: 'Confédération paysanne', role: 'Syndicat de l\'agriculture paysanne', site: 'https://www.confederationpaysanne.fr' },
      { nom: 'Coordination Rurale', role: 'Syndicat agricole', site: 'https://www.coordinationrurale.fr' },
      { nom: 'Chambre d\'agriculture', role: 'Conseil technique et économique', site: 'https://chambres-agriculture.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'Aide d\'urgence MSA', description: 'Action sociale pour exploitants en difficulté. Aide financière directe possible.', site: 'https://www.msa.fr', badge: 'Gratuit' },
      { nom: 'Aide à la relance agricole', description: 'Prêts bonifiés et subventions régionales pour exploitations en difficulté.', site: 'https://www.agriculture.gouv.fr' },
      { nom: 'Fonds d\'allègement des charges', description: 'Prise en charge partielle des cotisations MSA et des prêts bancaires.', site: 'https://www.agriculture.gouv.fr', badge: 'Sous conditions' },
      { nom: 'AREA (Aide à la Relance des Exploitations Agricoles)', description: 'Dispositif national pour exploitations viables mais en difficulté. Audit + plan de redressement financés.', site: 'https://www.agriculture.gouv.fr', badge: 'Sur dossier' },
    ],
    soutien: { nom: 'Agri\'Écoute', description: 'Écoute psychologique pour agriculteurs en détresse · 24h/24', telephone: '09 69 39 29 19', site: 'https://www.msa.fr' },
    conseilsSpecifiques: [
      'Contactez la MSA (pas l\'URSSAF) pour vos cotisations sociales',
      'La Chambre d\'agriculture propose un diagnostic gratuit de votre exploitation',
      'Agri\'Écoute est disponible 24h/24 si vous avez besoin de parler',
      'Solidarité Paysans est l\'équivalent du CIP pour le monde rural — accompagnement gratuit et confidentiel par bénévoles, souvent d\'anciens agriculteurs (INDISPENSABLE)',
      'Cerfrance (centre de gestion agréé spécialisé agricole) est souvent le mieux placé pour reconstruire vos prévisionnels',
      'L\'ADEAR accompagne installations, transmissions et reconversions paysannes',
    ],
    chambre: 'CA',
    caissesRetraite: [
      { profession: 'Exploitant agricole', caisse: 'MSA', telephone: '36 98', site: 'https://www.msa.fr' },
    ],
    ordresProfessionnels: [
      { profession: 'Exploitant en difficulté', nom: 'Solidarité Paysans', telephone: 'Variable selon département (voir site)', site: 'https://solidaritepaysans.org', note: 'Équivalent CIP pour le monde rural · accompagnement gratuit et confidentiel par bénévoles' },
      { profession: 'Gestion / comptabilité agricole', nom: 'Cerfrance (CER France)', telephone: 'Variable selon territoire', site: 'https://www.cerfrance.fr', note: 'Expert-comptable spécialisé agriculture · présent sur tout le territoire' },
      { profession: 'Installation / transmission paysanne', nom: 'ADEAR', telephone: 'Variable selon département', site: 'https://www.jeminstallepaysan.org', note: 'Association pour le Développement de l\'Emploi Agricole et Rural' },
    ],
    santeSecteur: {
      niveau: 'crise',
      titre: 'Secteur agricole sous tension durable',
      message:
        'Vous n\'êtes pas seul·e : le secteur agricole cumule hausse des charges, aléas climatiques et pression sur les prix. Des dispositifs nationaux et MSA existent spécifiquement pour cette crise.',
      ressource: { label: 'Aide d\'urgence MSA', url: 'https://www.msa.fr' },
    },
  },
  peche: {
    label: 'Pêche / Aquaculture',
    cotisationOrg: 'ENIM (Établissement National des Invalides de la Marine)',
    cotisationTel: '02 40 41 39 39',
    cotisationSite: 'https://www.enim.eu',
    syndicats: [
      { nom: 'CNPMEM', role: 'Comité National des Pêches Maritimes et des Élevages Marins', telephone: '01 72 71 18 00', site: 'https://www.comite-peches.fr' },
      { nom: 'CRPMEM', role: 'Comité Régional des Pêches Maritimes (par façade littorale)', site: 'https://www.comite-peches.fr' },
      { nom: 'France Filière Pêche', role: 'Interprofession pêche fraîche française', site: 'https://www.francefilierepeche.fr' },
      { nom: 'CNC', role: 'Comité National de la Conchyliculture (ostréiculture, mytiliculture)', site: 'https://www.cnc-france.com' },
      { nom: 'Solidarité Marins', role: 'Association d\'entraide pour marins en difficulté (toutes activités maritimes)', telephone: '02 98 89 80 80', site: 'https://www.solidaritedesgensdemer.fr' },
      { nom: 'SNSM', role: 'Société Nationale de Sauvetage en Mer (intervention urgence, soutien familles)', telephone: '01 56 02 64 64', site: 'https://www.snsm.org' },
      { nom: 'AGISM', role: 'Association de Gestion des Institutions Sociales Maritimes (action sociale marins)', telephone: '02 40 12 33 33', site: 'https://www.agism.com' },
    ],
    aidesSpecifiques: [
      { nom: 'ENIM · Action sociale', description: 'Aide d\'urgence et accompagnement pour marins-pêcheurs en difficulté. Fonds de secours.', site: 'https://www.enim.eu', badge: 'Marins uniquement' },
      { nom: 'FEAMPA', description: 'Fonds européen pour les affaires maritimes, la pêche et l\'aquaculture (2021-2027) : modernisation, arrêts temporaires indemnisés, transition écologique.', site: 'https://www.europe-en-france.gouv.fr', badge: 'Européen' },
      { nom: 'Aide carburant pêche', description: 'Dispositif d\'aide au gazole de pêche déclenché en cas de hausse durable des cours.', site: 'https://agriculture.gouv.fr', badge: 'Selon conjoncture' },
      { nom: 'Plan de sortie de flotte', description: 'Indemnisation publique en cas de retrait définitif d\'un navire de pêche du registre.', site: 'https://agriculture.gouv.fr', badge: 'Sur dossier' },
    ],
    soutien: { nom: 'Solidarité Marins', description: 'Association d\'entraide pour marins en difficulté : aide financière, soutien psychologique, accompagnement familial. Réseau de bénévoles littoraux.', telephone: '02 98 89 80 80', site: 'https://www.solidaritedesgensdemer.fr' },
    conseilsSpecifiques: [
      'Pour vos cotisations sociales, contactez l\'ENIM — caisse spécifique des marins-pêcheurs (pas l\'URSSAF ni la MSA)',
      'La DDTM (Direction Départementale des Territoires et de la Mer) est votre autorité de tutelle pour licences, quotas et contrôles',
      'Le CRPMEM de votre façade peut vous orienter vers les aides régionales et les arrêts temporaires indemnisés',
      'Les aides européennes FEAMPA peuvent financer modernisation et transition écologique de votre navire',
      'France Filière Pêche défend la pêche fraîche française — utile pour la valorisation commerciale',
      'Solidarité Marins / SNSM : entraide gens de mer, aide financière d\'urgence et soutien psychologique confidentiel',
      'Agri\'Écoute (09 69 39 29 19) est étendue aux marins-pêcheurs en complément',
    ],
    chambre: 'CCI',
    caissesRetraite: [
      { profession: 'Marin-pêcheur', caisse: 'ENIM', telephone: '02 40 41 39 39', site: 'https://www.enim.eu' },
    ],
    ordresProfessionnels: [
      { profession: 'Pêche maritime', nom: 'CNPMEM (Comité National des Pêches)', telephone: '01 72 71 18 00', site: 'https://www.comite-peches.fr', note: 'Organisation professionnelle obligatoire pour les pêcheurs' },
      { profession: 'Autorité maritime', nom: 'DDTM (Direction Départementale des Territoires et de la Mer)', telephone: 'Variable selon département littoral', site: 'https://www.mer.gouv.fr', note: 'Autorité de tutelle · licences, quotas, contrôles, autorisations de pêche' },
    ],
    santeSecteur: {
      niveau: 'crise',
      titre: 'Pêche : flotte vieillissante et pression européenne',
      message:
        "Hausse du gazole, quotas européens en baisse sur plusieurs espèces, sortie progressive du chalutage de fond dans certaines aires marines protégées : la pêche française vit une transition difficile. Sollicitez tôt l'ENIM, le CRPMEM et la DDTM — des dispositifs FEAMPA et plans de sortie de flotte indemnisés existent.",
      ressource: { label: 'ENIM · Action sociale', url: 'https://www.enim.eu' },
    },
  },
  btp: {
    label: 'BTP / Construction',
    cotisationOrg: 'URSSAF + Caisses BTP (CIBTP, PRO BTP)',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'FFB', role: 'Fédération Française du Bâtiment', telephone: '01 40 69 51 00', site: 'https://www.ffbatiment.fr' },
      { nom: 'CAPEB', role: 'Confédération de l\'artisanat et des PME du bâtiment', site: 'https://www.capeb.fr' },
      { nom: 'FNTP', role: 'Fédération Nationale des Travaux Publics', site: 'https://www.fntp.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'PRO BTP · Action sociale', description: 'Aide financière d\'urgence pour entreprises du BTP. Prêts et secours.', site: 'https://www.probtp.com', badge: 'BTP uniquement' },
      { nom: 'CIBTP · Congés et intempéries', description: 'Indemnisation en cas d\'intempéries. Vérifiez vos droits.', site: 'https://www.cibtp.fr' },
    ],
    soutien: { nom: 'APESA + FFB', description: 'Dispositif APESA activable via le tribunal de commerce', site: 'https://apesa.fr' },
    conseilsSpecifiques: [
      'Vérifiez vos droits aux indemnités intempéries (CIBTP)',
      'PRO BTP propose une action sociale spécifique au secteur',
      'La CAPEB ou la FFB peuvent vous accompagner dans vos démarches',
    ],
    chambre: 'CMA',
    santeSecteur: {
      niveau: 'crise',
      titre: 'BTP : secteur en chute marquée',
      message:
        'Le BTP connaît une contraction historique depuis 2023 (construction neuve en repli). Les défaillances ont fortement augmenté. Agissez tôt : les dispositifs amiables (mandat ad hoc, conciliation) sont votre meilleure arme.',
      ressource: { label: 'CAPEB — accompagnement', url: 'https://www.capeb.fr' },
    },
  },
  hotellerie: {
    label: 'Hôtellerie-restauration',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'UMIH', role: 'Union des Métiers et des Industries de l\'Hôtellerie', telephone: '01 44 94 19 94', site: 'https://www.umih.fr' },
      { nom: 'GNI', role: 'Groupement National des Indépendants Hôtellerie-Restauration', telephone: '01 53 04 99 03', site: 'https://www.gni-hcr.fr' },
      { nom: 'SNRTC', role: 'Syndicat National de la Restauration Thématique et Commerciale', telephone: '01 42 96 60 75', site: 'https://www.snrtc.fr' },
      { nom: 'GHR', role: 'Groupement des Hôtelleries et Restaurations de France', telephone: '01 47 04 04 06', site: 'https://www.ghr.fr' },
      { nom: 'SYNHORCAT', role: 'Syndicat National des Hôteliers, Restaurateurs, Cafetiers et Traiteurs', telephone: '01 42 96 60 75', site: 'https://www.synhorcat.com' },
    ],
    aidesSpecifiques: [
      { nom: 'Aides saisonnières', description: 'Activité partielle pendant les périodes creuses. Exonérations spécifiques HCR.', site: 'https://www.travail-emploi.gouv.fr' },
      { nom: 'Fonds de modernisation CHR', description: 'Aides à la mise aux normes et à la modernisation des établissements.', badge: 'Régional' },
      { nom: 'HCR Prévoyance / Klesia', description: 'Prévoyance santé/retraite branche HCR — action sociale dédiée en cas de difficulté de l\'employeur.', site: 'https://www.klesia.fr', badge: 'Convention HCR' },
      { nom: 'Atout France', description: 'Agence de développement touristique : appels à projets, accompagnement transition durable.', site: 'https://www.atout-france.fr' },
    ],
    soutien: { nom: 'UMIH Entraide + APESA HCR', description: 'Réseau d\'entraide entre restaurateurs et hôteliers. APESA est accessible aux dirigeants HCR via le tribunal de commerce.', telephone: '01 44 94 19 94', site: 'https://www.umih.fr' },
    conseilsSpecifiques: [
      'L\'UMIH peut négocier des accords collectifs de branche en votre faveur',
      'Vérifiez vos droits à l\'activité partielle en période creuse, voire APLD-R si baisse durable',
      'Les baux commerciaux HCR ont des protections spécifiques',
      'HCR Prévoyance (Klesia) propose une action sociale pour salariés et employeur en difficulté',
      'APESA est particulièrement actif en HCR — saisine via le tribunal de commerce ou directement',
    ],
    chambre: 'CCI',
    santeSecteur: {
      niveau: 'crise',
      titre: 'HCR : secteur durablement tendu',
      message:
        'Hausse de l\'énergie, pénurie de main-d\'œuvre, remboursement des PGE : le secteur concentre un grand nombre de défaillances. Sollicitez l\'UMIH et la CCI avant toute procédure — des négociations de branche existent.',
      ressource: { label: 'UMIH', url: 'https://www.umih.fr' },
    },
  },
  commerce: {
    label: 'Commerce',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'CCI', role: 'Chambre de commerce et d\'industrie', site: 'https://www.cci.fr' },
      { nom: 'CdCF', role: 'Conseil du Commerce de France (fédération nationale)', telephone: '01 44 71 36 90', site: 'https://www.cdcf.com' },
      { nom: 'FCD', role: 'Fédération du Commerce et de la Distribution (grande distribution, supermarchés)', telephone: '01 44 43 99 00', site: 'https://www.fcd.fr' },
      { nom: 'CGI', role: 'Confédération Française du Commerce Interentreprises (BtoB)', telephone: '01 53 23 04 04', site: 'https://www.cgi-cf.com' },
      { nom: 'CGAD', role: 'Confédération Générale de l\'Alimentation en Détail (boulangers, bouchers…)', telephone: '01 44 95 02 02', site: 'https://www.cgad.fr' },
      { nom: 'Procos', role: 'Fédération du commerce spécialisé (textile, sport, équipement)', telephone: '01 44 88 95 65', site: 'https://www.procos.org' },
      { nom: 'Fevad', role: 'Fédération du e-commerce et de la vente à distance', telephone: '01 42 56 38 86', site: 'https://www.fevad.com' },
      { nom: 'USPF', role: 'Union des Syndicats de la Pharmacie d\'Officine', telephone: '01 46 47 20 80', site: 'https://www.uspo.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'FISAC', description: 'Fonds d\'intervention pour les services, l\'artisanat et le commerce. Aide à la modernisation.', badge: 'Territorial' },
      { nom: 'Aide au commerce de proximité', description: 'Aides communales et départementales pour maintenir le commerce local (centres-villes).', badge: 'Local' },
      { nom: 'Action Cœur de Ville', description: 'Plan national de revitalisation des centres-villes — aides foncières et travaux.', site: 'https://agence-cohesion-territoires.gouv.fr/action-coeur-de-ville-42' },
      { nom: 'Petites Villes de Demain', description: 'Pour communes < 20 000 hab. — accompagnement commerces.', site: 'https://agence-cohesion-territoires.gouv.fr/petites-villes-de-demain-45' },
    ],
    conseilsSpecifiques: [
      'Négociez avec votre bailleur commercial — le Code de commerce vous protège',
      'Les impayés de loyer commercial ont des procédures spécifiques',
      'CdCF, FCD, CGI ou CGAD selon votre sous-secteur — chacune a des juristes pour ses adhérents',
      'Si vous êtes pharmacien d\'officine : URSPO et caisse CAVP spécifique',
      'Vérifiez l\'éligibilité Action Cœur de Ville / Petites Villes de Demain de votre commune',
    ],
    chambre: 'CCI',
    santeSecteur: {
      niveau: 'tendu',
      titre: 'Commerce de détail sous pression',
      message:
        'Inflation, e-commerce et baisse de pouvoir d\'achat pèsent sur le commerce physique. Vérifiez les aides territoriales (FISAC, Action Cœur de Ville) avant tout.',
    },
  },
  transport: {
    label: 'Transport',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'FNTR', role: 'Fédération Nationale des Transports Routiers (marchandises)', telephone: '01 44 29 04 29', site: 'https://www.fntr.fr' },
      { nom: 'OTRE', role: 'Organisation des Transporteurs Routiers Européens', telephone: '01 53 62 83 40', site: 'https://www.otre.org' },
      { nom: 'Unostra', role: 'Union Nationale des Organisations Syndicales de Transporteurs Routiers Automobiles', telephone: '01 53 23 92 92', site: 'https://www.unostra.com' },
      { nom: 'FNTV', role: 'Fédération Nationale des Transports de Voyageurs (autocaristes)', telephone: '01 40 82 62 72', site: 'https://www.fntv.fr' },
      { nom: 'CNPA / Mobilians', role: 'Conseil National des Professions de l\'Automobile (garages, dépanneurs, VTC)', telephone: '01 40 99 55 00', site: 'https://www.mobilians.fr' },
      { nom: 'FNDA', role: 'Fédération Nationale des Déménageurs', telephone: '01 49 88 61 40', site: 'https://www.csdemenagement.fr' },
      { nom: 'TLF', role: 'Union des Transports et Logistique de France', telephone: '01 53 68 40 10', site: 'https://www.e-tlf.com' },
    ],
    aidesSpecifiques: [
      { nom: 'Aide au gazole professionnel (TICPE)', description: 'Remboursement partiel de la TICPE pour les transporteurs routiers (gazole pro). Demande trimestrielle.', site: 'https://www.douane.gouv.fr' },
      { nom: 'Aide à la décarbonation transport', description: 'Subvention à l\'achat de véhicules électriques/hydrogène, retrofit, formation.', site: 'https://www.ademe.fr' },
      { nom: 'Bonus écologique flotte', description: 'Subvention véhicules utilitaires propres.', site: 'https://www.service-public.fr' },
    ],
    conseilsSpecifiques: [
      'La DREAL est votre interlocuteur pour les licences de transport (capacité, attestation transport)',
      'Vérifiez le remboursement de la TICPE si vous êtes transporteur routier — trimestriel, à demander',
      'VTC/taxis : voir le bloc dédié sur votre fiche (registre VTC, ARPE, charte sociale)',
      'Autocaristes : FNTV a un fonds d\'aide ; vérifiez aussi l\'AOM (autorité organisatrice mobilité) locale',
      'Déménageurs : la CSD (Chambre Syndicale du Déménagement) accompagne en difficulté',
    ],
    chambre: 'CCI',
    santeSecteur: {
      niveau: 'tendu',
      titre: 'Transport routier : marges serrées',
      message:
        'Hausse du carburant, remontée des taux, concurrence internationale : le transport routier est fragilisé. Le remboursement TICPE et les dispositifs OTRE/FNTR peuvent donner un peu d\'air.',
    },
  },
  liberal: {
    label: 'Professions libérales',
    cotisationOrg: 'URSSAF (+ CIPAV / CNBF / CRPCEN / CAVEC selon profession)',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'UNAPL', role: 'Union Nationale des Professions Libérales', telephone: '01 44 11 31 50', site: 'https://www.unapl.fr' },
      { nom: 'CNB', role: 'Conseil National des Barreaux (avocats)', telephone: '01 53 30 85 60', site: 'https://www.cnb.avocat.fr' },
      { nom: 'CSN', role: 'Conseil Supérieur du Notariat', telephone: '01 44 90 30 00', site: 'https://www.notaires.fr' },
      { nom: 'OEC', role: 'Ordre des Experts-Comptables', telephone: '01 44 15 60 00', site: 'https://www.experts-comptables.fr' },
      { nom: 'CNOA', role: 'Conseil National de l\'Ordre des Architectes', telephone: '01 56 81 82 83', site: 'https://www.architectes.org' },
      { nom: 'OGE', role: 'Ordre des Géomètres-Experts', telephone: '01 53 83 88 00', site: 'https://www.geometre-expert.fr' },
      { nom: 'CNCJ', role: 'Chambre Nationale des Commissaires de Justice (ex-huissiers + commissaires-priseurs)', telephone: '01 49 70 12 90', site: 'https://www.commissaire-justice.fr' },
      { nom: 'AGEA', role: 'Fédération nationale des syndicats d\'agents généraux d\'assurances', telephone: '01 70 98 48 90', site: 'https://www.agea.fr' },
      { nom: 'CSCA', role: 'Chambre Syndicale des Courtiers d\'Assurances', site: 'https://www.csca.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'CIPAV · Action sociale', description: 'Aide financière d\'urgence pour professions libérales affiliées à la CIPAV.', site: 'https://www.lacipav.fr', badge: 'Si affilié CIPAV' },
      { nom: 'Fonds de solidarité libéral', description: 'Aides spécifiques via les ordres professionnels (avocats, médecins, architectes…).', badge: 'Selon profession' },
    ],
    conseilsSpecifiques: [
      'Contactez votre Ordre professionnel — beaucoup proposent une aide confidentielle',
      'Votre caisse de retraite (CIPAV, CNBF, CRPCEN, CAVEC, CAVP…) dispose d\'un fonds d\'action sociale',
      'Les professions libérales ont accès au mandat ad hoc comme toute entreprise',
    ],
    chambre: 'CCI',
    caissesRetraite: [
      { profession: 'Avocat', caisse: 'CNBF', telephone: '01 42 21 32 30', site: 'https://www.cnbf.fr' },
      { profession: 'Notaire', caisse: 'CRPCEN', telephone: '01 40 26 14 25', site: 'https://www.crpcen.fr' },
      { profession: 'Expert-comptable', caisse: 'CAVEC', telephone: '01 80 49 25 25', site: 'https://www.cavec.fr' },
      { profession: 'Architecte', caisse: 'CIPAV', telephone: '0 820 04 12 04', site: 'https://www.lacipav.fr' },
      { profession: 'Géomètre-expert', caisse: 'CAVOM', telephone: '01 53 30 65 65', site: 'https://www.cavom.fr' },
      { profession: 'Huissier / Commissaire de justice', caisse: 'CAVOM', telephone: '01 53 30 65 65', site: 'https://www.cavom.fr' },
      { profession: 'Commissaire-priseur judiciaire', caisse: 'CAVOM', telephone: '01 53 30 65 65', site: 'https://www.cavom.fr' },
      { profession: 'Agent général d\'assurance', caisse: 'CAVAMAC', telephone: '01 44 70 71 71', site: 'https://www.cavamac.fr' },
      { profession: 'Profession libérale autre', caisse: 'CIPAV', telephone: '0 820 04 12 04', site: 'https://www.lacipav.fr' },
    ],
    ordresProfessionnels: [
      { profession: 'Avocat', nom: 'Conseil National des Barreaux', telephone: '01 53 30 85 60', site: 'https://www.cnb.avocat.fr', note: 'Cellules d\'aide confidentielles au barreau' },
      { profession: 'Notaire', nom: 'Conseil Supérieur du Notariat', telephone: '01 44 90 30 00', site: 'https://www.notaires.fr' },
      { profession: 'Expert-comptable', nom: 'Ordre des Experts-Comptables', telephone: '01 44 15 60 00', site: 'https://www.experts-comptables.fr', note: 'Cellule d\'accompagnement confraternel gratuite' },
    ],
  },
  sante: {
    label: 'Santé',
    cotisationOrg: 'URSSAF (+ CARMF / CARPIMKO / CAVP / CARCDSF / CARPV selon profession)',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'Ordre professionnel', role: 'Conseil de l\'Ordre (médecins, pharmaciens, infirmiers…)', site: 'https://www.conseil-national.medecin.fr' },
      { nom: 'FHP', role: 'Fédération de l\'Hospitalisation Privée (cliniques)', telephone: '01 53 83 56 56', site: 'https://www.fhp.fr' },
      { nom: 'FEHAP', role: 'Fédération des Établissements Hospitaliers et d\'Aide à la Personne (privé non lucratif)', telephone: '01 53 98 95 00', site: 'https://www.fehap.fr' },
      { nom: 'SYNERPA', role: 'Syndicat National des Établissements et Résidences Privés pour Personnes Âgées', telephone: '01 40 47 75 20', site: 'https://www.synerpa.fr' },
      { nom: 'Vetos-Entraide', role: 'Réseau d\'entraide pour vétérinaires en difficulté (équivalent APESA)', telephone: '04 87 25 04 80', site: 'https://www.vetos-entraide.com' },
    ],
    aidesSpecifiques: [
      { nom: 'Entraide ordinale', description: 'Chaque Ordre professionnel dispose d\'un fonds d\'entraide confidentiel pour les confrères en difficulté.', badge: 'Confidentiel' },
      { nom: 'CARMF / CARPIMKO · Action sociale', description: 'Aide d\'urgence via votre caisse de retraite professionnelle.', badge: 'Selon caisse' },
    ],
    soutien: { nom: 'MOTS (Médecin Organisation Travail Santé)', description: 'Soutien psychologique pour professionnels de santé · 24h/24', telephone: '0 608 282 589', site: 'https://www.association-mots.org' },
    conseilsSpecifiques: [
      'Contactez votre Ordre en priorité — ils ont un devoir d\'entraide confidentielle',
      'La continuité des soins aux patients doit être organisée même en difficulté',
      'Votre caisse de retraite (CARMF, CARPIMKO, CAVP, CARCDSF, CARPV…) propose une action sociale',
      'Vétérinaires : Vetos-Entraide (équivalent APESA) — soutien psychologique gratuit et confidentiel 24h/24',
      'Cliniques privées : FHP (Fédération de l\'Hospitalisation Privée) accompagne les établissements en difficulté',
      'Établissements médico-sociaux : FEHAP (Fédération des Établissements Hospitaliers et d\'Aide à la Personne)',
    ],
    chambre: 'CCI',
    caissesRetraite: [
      { profession: 'Médecin', caisse: 'CARMF', telephone: '01 40 68 32 00', site: 'https://www.carmf.fr' },
      { profession: 'Pharmacien', caisse: 'CAVP', telephone: '01 42 66 90 37', site: 'https://www.cavp.fr' },
      { profession: 'Dentiste', caisse: 'CARCDSF', telephone: '01 40 55 42 02', site: 'https://www.carcdsf.fr' },
      { profession: 'Sage-femme', caisse: 'CARCDSF', telephone: '01 40 55 42 02', site: 'https://www.carcdsf.fr' },
      { profession: 'Vétérinaire', caisse: 'CARPV', telephone: '01 44 51 71 50', site: 'https://www.carpv.fr' },
      { profession: 'Auxiliaire médical (kiné, infirmier)', caisse: 'CARPIMKO', telephone: '01 40 55 42 50', site: 'https://www.carpimko.com' },
    ],
    ordresProfessionnels: [
      { profession: 'Médecin', nom: 'Conseil National de l\'Ordre des Médecins', telephone: '01 53 89 32 00', site: 'https://www.conseil-national.medecin.fr', note: 'Cellule d\'aide aux confrères en difficulté' },
      { profession: 'Pharmacien', nom: 'Ordre National des Pharmaciens', telephone: '01 56 21 34 34', site: 'https://www.ordre.pharmacien.fr' },
      { profession: 'Vétérinaire', nom: 'Ordre National des Vétérinaires', telephone: '01 53 36 16 00', site: 'https://www.veterinaire.fr', note: 'Cellule d\'entraide confraternelle' },
      { profession: 'Chirurgien-dentiste', nom: 'Ordre National des Chirurgiens-Dentistes', telephone: '01 44 34 78 80', site: 'https://www.ordre-chirurgiens-dentistes.fr' },
      { profession: 'Infirmier', nom: 'Ordre National des Infirmiers', telephone: '01 71 93 84 67', site: 'https://www.ordre-infirmiers.fr' },
      { profession: 'Masseur-kinésithérapeute', nom: 'Conseil National de l\'Ordre des Masseurs-Kinésithérapeutes', telephone: '01 46 22 32 97', site: 'https://www.ordremk.fr' },
      { profession: 'Sage-femme', nom: 'Conseil National de l\'Ordre des Sages-Femmes', telephone: '01 42 86 80 06', site: 'https://www.ordre-sages-femmes.fr' },
    ],
  },
  industrie: {
    label: 'Industrie',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'MEDEF territorial', role: 'Mouvement des entreprises de France', site: 'https://www.medef.com' },
      { nom: 'France Industrie', role: 'Organisation des industriels', site: 'https://www.franceindustrie.org' },
    ],
    aidesSpecifiques: [
      { nom: 'BPI France Industrie', description: 'Prêts et garanties spécifiques pour PMI. Diagnostic flash gratuit.', site: 'https://bpifrance.fr', badge: 'Gratuit' },
      { nom: 'Plan de relance industriel', description: 'Subventions à la modernisation et à la transition écologique.', site: 'https://www.economie.gouv.fr', badge: 'Sous conditions' },
    ],
    conseilsSpecifiques: [
      'BPI France propose un diagnostic industriel gratuit',
      'Le MEDEF territorial peut vous mettre en relation avec des repreneurs potentiels',
    ],
    chambre: 'CCI',
  },
  information: {
    label: 'Numérique / IT',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'Numeum', role: 'Syndicat patronal du numérique (ex-Syntec Numérique)', telephone: '01 44 30 49 00', site: 'https://numeum.fr' },
      { nom: 'CINOV-IT', role: 'Fédération des TPE/PME du numérique', telephone: '01 44 30 49 24', site: 'https://www.cinov.fr/syndicats/cinov-it/' },
      { nom: 'France Digitale', role: 'Association des startups et investisseurs numériques', site: 'https://francedigitale.org' },
      { nom: 'Fevad', role: 'Fédération du e-commerce et de la vente à distance', site: 'https://www.fevad.com' },
    ],
    aidesSpecifiques: [
      { nom: 'French Tech', description: 'Accompagnement et financement pour startups tech en difficulté (Tremplin, Tickets).', site: 'https://lafrenchtech.com' },
      { nom: 'BPI Aide Innovation', description: 'Prêt innovation, prêt amorçage, garantie innovation pour TPE/PME numériques.', site: 'https://www.bpifrance.fr' },
      { nom: 'CIR / JEI', description: 'Crédit d\'impôt recherche + statut Jeune Entreprise Innovante : avantages fiscaux et sociaux à préserver.', site: 'https://www.entreprises.gouv.fr/jei' },
    ],
    conseilsSpecifiques: [
      'Numeum et CINOV-IT accompagnent les TPE/PME numériques en difficulté (médiation, conseils)',
      'French Tech Tremplin pour les fondateurs en post-liquidation (rebond)',
      'Préservez votre statut JEI et le CIR — leur perte aggrave significativement la trésorerie',
    ],
    chambre: 'CCI',
  },
  finance: {
    label: 'Finance / Assurance',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'FBF', role: 'Fédération bancaire française', telephone: '01 48 00 52 52', site: 'https://www.fbf.fr' },
      { nom: 'ASF', role: 'Association française des Sociétés Financières (crédit-bail, leasing)', telephone: '01 53 81 51 51', site: 'https://www.asf-france.com' },
      { nom: 'AFG', role: 'Association française de la Gestion financière', telephone: '01 44 94 94 00', site: 'https://www.afg.asso.fr' },
      { nom: 'FFA', role: 'France Assureurs (fédération des sociétés d\'assurance)', telephone: '01 42 47 90 00', site: 'https://www.franceassureurs.fr' },
      { nom: 'AGEA', role: 'Fédération nationale des syndicats d\'agents généraux d\'assurances', telephone: '01 70 98 48 90', site: 'https://www.agea.fr' },
      { nom: 'CSCA', role: 'Chambre syndicale des courtiers d\'assurances', site: 'https://www.csca.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'ACPR', description: 'Autorité de contrôle prudentiel et de résolution — saisine si difficulté grave + dispositif de résolution bancaire.', site: 'https://acpr.banque-france.fr' },
      { nom: 'ORIAS', description: 'Registre unique des intermédiaires (assurance/banque/finance) — radiation possible si non-conformité.', site: 'https://www.orias.fr' },
    ],
    conseilsSpecifiques: [
      'Toute difficulté grave doit être notifiée à l\'ACPR (votre régulateur) — éventuellement résolution organisée',
      'Vérifiez votre inscription ORIAS à jour : la radiation = arrêt d\'activité immédiat',
      'Agents généraux d\'assurance : votre compagnie mandante a souvent un dispositif d\'aide AGEA',
    ],
    chambre: 'CCI',
  },
  immobilier: {
    label: 'Immobilier',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'FNAIM', role: 'Fédération Nationale de l\'Immobilier (agences)', telephone: '01 44 20 77 00', site: 'https://www.fnaim.fr' },
      { nom: 'UNIS', role: 'Union des syndicats de l\'immobilier (administrateurs de biens, syndics)', telephone: '01 55 32 01 00', site: 'https://www.unis-immo.fr' },
      { nom: 'FPI France', role: 'Fédération des Promoteurs Immobiliers', telephone: '01 47 05 44 36', site: 'https://www.fpifrance.fr' },
      { nom: 'LCA-FFB', role: 'Pôle Habitat des constructeurs et aménageurs (FFB)', telephone: '01 40 69 51 90', site: 'https://www.lca-ffb.fr' },
      { nom: 'SNPI', role: 'Syndicat National des Professionnels Immobiliers', telephone: '01 47 04 27 33', site: 'https://www.snpi.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'Garantie financière FNAIM/UNIS', description: 'Si vous gérez des fonds de tiers (location, copropriété), votre garantie financière est obligatoire — vérifier renouvellement.', badge: 'Obligatoire' },
      { nom: 'Carte T / Carte G', description: 'La perte de carte professionnelle (transaction T, gestion G) = arrêt d\'activité. Préserver à tout prix.', badge: 'Critique' },
    ],
    conseilsSpecifiques: [
      'Si vous gérez des fonds clients (location, copropriété), votre garantie financière est CRITIQUE — sa perte = liquidation immédiate',
      'FPI, UNIS et FNAIM accompagnent leurs adhérents en difficulté (conseil juridique, médiation)',
      'Promoteur : prévoyez la GFA (garantie financière d\'achèvement) avant tout problème',
    ],
    chambre: 'CCI',
  },
  education: {
    label: 'Éducation / Formation',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'FFP', role: 'Les Acteurs de la Compétence (ex-Fédération de la Formation Professionnelle)', telephone: '01 44 30 49 49', site: 'https://www.lesacteursdelacompetence.fr' },
      { nom: 'SYNOFDES', role: 'Syndicat National des Organismes de Formation de l\'Économie Sociale', telephone: '01 53 27 30 27', site: 'https://synofdes.org' },
      { nom: 'CINOV Formation', role: 'Fédération des indépendants et TPE de la formation', site: 'https://www.cinov.fr/syndicats/cinov-formation/' },
      { nom: 'Fnogec', role: 'Fédération Nationale des Organismes de Gestion (enseignement catholique)', site: 'https://www.fnogec.org' },
    ],
    aidesSpecifiques: [
      { nom: 'Qualiopi — recours', description: 'Si la certification Qualiopi vous est retirée, recours possible auprès de l\'organisme certificateur dans les 30 jours, puis appel.', badge: 'Recours 30 j' },
      { nom: 'DGEFP — médiation OF', description: 'Délégation générale à l\'emploi et à la formation professionnelle : médiation possible en cas de litige avec un OPCO.', site: 'https://travail-emploi.gouv.fr/le-ministere-en-action/dgefp' },
      { nom: 'France compétences', description: 'Régulateur de la formation et de l\'apprentissage. Peut intervenir sur les certifications RNCP et RS.', site: 'https://www.francecompetences.fr' },
    ],
    conseilsSpecifiques: [
      'Qualiopi retirée = perte d\'accès aux financements CPF/OPCO. Recours sous 30 jours à activer immédiatement',
      'Les Acteurs de la Compétence (ex-FFP) accompagnent leurs adhérents en difficulté (juriste dédié, médiation)',
      'Vérifiez vos certifications RNCP : leur retrait fragilise la valeur de votre catalogue',
    ],
    chambre: 'CCI',
  },
  artisanat: {
    label: 'Artisanat',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'CMA France', role: 'Chambre de Métiers et de l\'Artisanat (réseau national)', telephone: '01 44 43 10 00', site: 'https://www.artisanat.fr' },
      { nom: 'U2P', role: 'Union des entreprises de proximité (artisans, libéraux, TPE)', telephone: '01 47 63 31 31', site: 'https://u2p-france.fr' },
      { nom: 'CAPEB', role: 'Confédération de l\'artisanat et des PME du bâtiment', telephone: '01 53 60 50 00', site: 'https://www.capeb.fr' },
      { nom: 'CGAD', role: 'Confédération Générale de l\'Alimentation en Détail (boulangers, bouchers, primeurs…)', telephone: '01 44 95 02 02', site: 'https://www.cgad.fr' },
      { nom: 'UNEC', role: 'Union Nationale des Entreprises de Coiffure', telephone: '01 42 61 53 24', site: 'https://www.unec.fr' },
      { nom: 'CNEC', role: 'Confédération Nationale Artisanale des Entreprises du Cadre de Vie (esthétique)', telephone: '01 43 56 35 35', site: 'https://www.cnec-esthetique.org' },
    ],
    aidesSpecifiques: [
      { nom: 'FISAC', description: 'Fonds d\'intervention pour les services, l\'artisanat et le commerce.', badge: 'Territorial' },
      { nom: 'CMA · Accompagnement', description: 'Diagnostic et accompagnement gratuit pour artisans en difficulté.', site: 'https://www.artisanat.fr', badge: 'Gratuit' },
      { nom: 'CMA · Cellule de prévention des difficultés', description: 'Permanence dédiée aux artisans en difficulté dans chaque CMA départementale.', site: 'https://www.artisanat.fr', badge: 'Confidentiel' },
      { nom: 'AGEFICE', description: 'Fonds d\'assurance formation dirigeant non-salarié — financements formations métier et gestion.', site: 'https://www.agefice.fr', badge: 'Cotisant TPE' },
    ],
    soutien: { nom: 'APESA + CMA Entraide', description: 'APESA activable via le tribunal de commerce. Les CMA disposent aussi de cellules d\'écoute internes.', site: 'https://apesa.fr' },
    conseilsSpecifiques: [
      'La CMA (pas la CCI) est votre interlocuteur principal en tant qu\'artisan — chaque CMA a une cellule de prévention',
      'L\'U2P défend les intérêts des artisans et TPE au niveau national',
      'CAPEB (artisans BTP), CGAD (alimentaire), UNEC (coiffure), CNEC (esthétique) ont des juristes dédiés aux adhérents',
      'AGEFICE finance les formations gestion/rebond du dirigeant non-salarié',
      'Caisse retraite : CNAVPL/CIPAV pour les libéraux artisans, SSI pour les autres',
    ],
    chambre: 'CMA',
    caissesRetraite: [
      { profession: 'Artisan (régime général SSI)', caisse: 'SSI (CNAV TI)', telephone: '3698', site: 'https://www.secu-independants.fr' },
    ],
  },
  autre: {
    label: 'Autre',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [],
    aidesSpecifiques: [],
    conseilsSpecifiques: [],
    chambre: 'CCI',
  },
};

export function getSectorInfo(company: CompanyData): SectorInfo {
  const naf = company.naf || '';
  const section = sectionFromNaf(naf);
  let secteur = secteurFromSection(section);

  // Pêche et aquaculture (NAF 03.xx) : secteur dédié avec organismes spécifiques (ENIM, CNPMEM…)
  const nafPrefix = naf.replace(/\./g, '').slice(0, 2);
  if (nafPrefix === '03') {
    secteur = 'peche';
  }

  if (secteur === 'commerce' && isArtisan(naf, company.formeJuridique)) {
    secteur = 'artisanat';
  }
  if (secteur === 'industrie' && isArtisan(naf, company.formeJuridique)) {
    secteur = 'artisanat';
  }

  const data = SECTOR_DATA[secteur];
  // Le CSP s'applique à tous les secteurs dès lors qu'il y a un licenciement économique.
  // Pré-injection systématique : les composants l'affichent uniquement
  // si reponses.effectif === 'salaries' (filtrage métier en aval).
  const obligationsLicenciement: ObligationLicenciement[] = [
    CSP_OBLIGATION,
    ...(data.obligationsLicenciement ?? []),
  ];

  return {
    secteur,
    ...data,
    obligationsLicenciement,
  };
}

/**
 * Retourne les obligations spécifiques à un licenciement économique selon l'effectif.
 * Utile pour les composants de la fiche qui affichent les démarches employeur.
 * - < 1 000 salariés : CSP obligatoire
 * - ≥ 1 000 salariés : congé de reclassement obligatoire
 * - ≥ 50 salariés ET ≥ 10 licenciements / 30 j : PSE
 */
export function getObligationsLicenciement(effectifApprox: number): ObligationLicenciement[] {
  const obligations: ObligationLicenciement[] = [];
  if (effectifApprox < 1000) {
    obligations.push(CSP_OBLIGATION);
  } else {
    obligations.push({
      sigle: 'Congé de reclassement',
      nom: 'Congé de reclassement',
      description:
        "Obligatoire pour tout licenciement économique en entreprise de 1 000 salariés et plus. Durée de 4 à 12 mois. Pendant ce congé, le salarié perçoit sa rémunération habituelle (puis 65 % du salaire brut au-delà du préavis). Accompagnement par une cellule de reclassement.",
      telephone: '39 49',
      site: 'https://www.service-public.fr/particuliers/vosdroits/F2906',
      badge: 'Obligatoire ≥ 1 000 salariés',
    });
  }
  if (effectifApprox >= 50) {
    obligations.push({
      sigle: 'PSE',
      nom: "Plan de Sauvegarde de l'Emploi",
      description:
        "Obligatoire pour tout licenciement collectif d'au moins 10 salariés sur 30 jours en entreprise d'au moins 50 salariés. Doit inclure mesures de reclassement, formation, accompagnement. Soumis à validation (accord majoritaire) ou homologation (document unilatéral) par la DREETS.",
      site: 'https://www.travail-emploi.gouv.fr',
      badge: '≥ 50 sal. · ≥ 10 licenciements / 30 j',
    });
  }
  return obligations;
}

export function getCompanyAge(dateCreation: string): number | null {
  if (!dateCreation) return null;
  const d = new Date(dateCreation);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

export interface EffectifSeuils {
  approx: number;
  cse: boolean;
  obligations50: boolean;
}

export function getEffectifSeuils(effectif: string): EffectifSeuils {
  const map: Record<string, number> = {
    '0 salarié': 0,
    '1 ou 2 salariés': 2,
    '3 à 5 salariés': 5,
    '6 à 9 salariés': 9,
    '10 à 19 salariés': 15,
    '20 à 49 salariés': 35,
    '50 à 99 salariés': 75,
    '100 à 199 salariés': 150,
    '200 à 249 salariés': 220,
    '250 à 499 salariés': 350,
    '500 à 999 salariés': 750,
    '1 000 à 1 999 salariés': 1500,
    '2 000 à 4 999 salariés': 3000,
    '5 000 à 9 999 salariés': 7000,
    '10 000 salariés et plus': 12000,
  };
  const approx = map[effectif] ?? 0;
  return {
    approx,
    cse: approx >= 11,
    obligations50: approx >= 50,
  };
}

export interface ObligationSeuil {
  seuilMin: number;
  atteint: boolean;
  titre: string;
  description: string;
}

export function getObligationsEffectif(seuils: EffectifSeuils): ObligationSeuil[] {
  const n = seuils.approx;
  return [
    {
      seuilMin: 11,
      atteint: n >= 11,
      titre: 'CSE (Comité Social et Économique)',
      description:
        "Obligatoire dès 11 salariés pendant 12 mois consécutifs. En cas de difficulté économique, l'employeur doit informer et consulter le CSE — sous peine de délit d'entrave.",
    },
    {
      seuilMin: 20,
      atteint: n >= 20,
      titre: 'Règlement intérieur',
      description:
        "Obligatoire à partir de 20 salariés. Doit notamment prévoir les règles disciplinaires et l'hygiène/sécurité.",
    },
    {
      seuilMin: 50,
      atteint: n >= 50,
      titre: 'CSE élargi, participation, PSE',
      description:
        "À 50 salariés : accord de participation aux résultats, représentant de proximité, budget d'activités sociales du CSE. Un Plan de Sauvegarde de l'Emploi (PSE) est obligatoire pour tout licenciement économique de 10+ salariés sur 30 jours.",
    },
    {
      seuilMin: 50,
      atteint: n >= 50,
      titre: 'Information-consultation renforcée du CSE',
      description:
        "À partir de 50 salariés, le CSE doit être consulté chaque année sur les orientations stratégiques. En difficulté, il peut exercer un droit d'alerte économique et se faire assister d'un expert-comptable aux frais de l'entreprise.",
    },
    {
      seuilMin: 100,
      atteint: n >= 100,
      titre: 'Bilan social annuel',
      description:
        "Obligatoire à partir de 300 salariés mais recommandé dès 100. Agrège indicateurs emploi, rémunération, formation sur 3 ans.",
    },
    {
      seuilMin: 250,
      atteint: n >= 250,
      titre: 'Index égalité professionnelle',
      description:
        'Publication obligatoire de l\'index égalité F/H. Au-delà de 250 salariés, plusieurs autres obligations sociales et fiscales (CICE, taxe sur les salaires, etc.) s\'appliquent.',
    },
    {
      seuilMin: 300,
      atteint: n >= 300,
      titre: 'GEPP et bilan social obligatoire',
      description:
        "À 300 salariés : négociation obligatoire sur la Gestion des Emplois et des Parcours Professionnels (GEPP), bilan social annuel, commission formation et commission égalité au CSE.",
    },
    {
      seuilMin: 1000,
      atteint: n >= 1000,
      titre: 'Obligations de grand groupe',
      description:
        "Comité de groupe, accord d'entreprise sur la prévention de la pénibilité, congé de mobilité en cas de restructuration, obligations de sous-traitance responsable.",
    },
  ];
}

export function getChambreLabel(chambre: 'CCI' | 'CMA' | 'CA'): string {
  const labels = {
    CCI: 'Chambre de commerce et d\'industrie (CCI)',
    CMA: 'Chambre de Métiers et de l\'Artisanat (CMA)',
    CA: 'Chambre d\'agriculture',
  };
  return labels[chambre];
}
