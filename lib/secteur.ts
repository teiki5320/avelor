import type { CompanyData } from './types';

export type Secteur =
  | 'agriculture'
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

const SECTOR_DATA: Record<Secteur, Omit<SectorInfo, 'secteur'>> = {
  agriculture: {
    label: 'Agriculture',
    cotisationOrg: 'MSA (Mutualité Sociale Agricole)',
    cotisationTel: '36 98',
    cotisationSite: 'https://www.msa.fr',
    syndicats: [
      { nom: 'FNSEA', role: 'Syndicat agricole', site: 'https://www.fnsea.fr' },
      { nom: 'Jeunes Agriculteurs', role: 'Accompagnement jeunes exploitants', site: 'https://www.jeunes-agriculteurs.fr' },
      { nom: 'Chambre d\'agriculture', role: 'Conseil technique et économique', site: 'https://chambres-agriculture.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'Aide d\'urgence MSA', description: 'Action sociale pour exploitants en difficulté. Aide financière directe possible.', site: 'https://www.msa.fr', badge: 'Gratuit' },
      { nom: 'Aide à la relance agricole', description: 'Prêts bonifiés et subventions régionales pour exploitations en difficulté.', site: 'https://agriculture.gouv.fr' },
      { nom: 'Fonds d\'allègement des charges', description: 'Prise en charge partielle des cotisations MSA et des prêts bancaires.', site: 'https://agriculture.gouv.fr', badge: 'Sous conditions' },
    ],
    soutien: { nom: 'Agri\'Écoute', description: 'Écoute psychologique pour agriculteurs en détresse · 24h/24', telephone: '09 69 39 29 19', site: 'https://www.msa.fr' },
    conseilsSpecifiques: [
      'Contactez la MSA (pas l\'URSSAF) pour vos cotisations sociales',
      'La Chambre d\'agriculture propose un diagnostic gratuit de votre exploitation',
      'Agri\'Écoute est disponible 24h/24 si vous avez besoin de parler',
    ],
    chambre: 'CA',
  },
  btp: {
    label: 'BTP / Construction',
    cotisationOrg: 'URSSAF + Caisses BTP (CIBTP, PRO BTP)',
    cotisationTel: '36 98',
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
  },
  hotellerie: {
    label: 'Hôtellerie-restauration',
    cotisationOrg: 'URSSAF',
    cotisationTel: '36 98',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'UMIH', role: 'Union des Métiers et des Industries de l\'Hôtellerie', telephone: '01 44 94 19 94', site: 'https://www.umih.fr' },
      { nom: 'GNI', role: 'Groupement National des Indépendants', site: 'https://www.gni-hcr.fr' },
      { nom: 'SNRTC', role: 'Syndicat National de la Restauration Thématique', site: 'https://www.snrtc.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'Aides saisonnières', description: 'Activité partielle pendant les périodes creuses. Exonérations spécifiques HCR.', site: 'https://travail-emploi.gouv.fr' },
      { nom: 'Fonds de modernisation CHR', description: 'Aides à la mise aux normes et à la modernisation des établissements.', badge: 'Régional' },
    ],
    soutien: { nom: 'UMIH Entraide', description: 'Réseau d\'entraide entre restaurateurs et hôteliers', site: 'https://www.umih.fr' },
    conseilsSpecifiques: [
      'L\'UMIH peut négocier des accords collectifs de branche en votre faveur',
      'Vérifiez vos droits à l\'activité partielle en période creuse',
      'Les baux commerciaux HCR ont des protections spécifiques',
    ],
    chambre: 'CCI',
  },
  commerce: {
    label: 'Commerce',
    cotisationOrg: 'URSSAF',
    cotisationTel: '36 98',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'CCI', role: 'Chambre de commerce et d\'industrie', site: 'https://www.cci.fr' },
      { nom: 'CDCF', role: 'Conseil du Commerce de France', site: 'https://www.cdcf.com' },
    ],
    aidesSpecifiques: [
      { nom: 'FISAC', description: 'Fonds d\'intervention pour les services, l\'artisanat et le commerce. Aide à la modernisation.', badge: 'Territorial' },
      { nom: 'Aide au commerce de proximité', description: 'Aides communales et départementales pour maintenir le commerce local.', badge: 'Local' },
    ],
    conseilsSpecifiques: [
      'Négociez avec votre bailleur commercial — le Code de commerce vous protège',
      'Les impayés de loyer commercial ont des procédures spécifiques',
    ],
    chambre: 'CCI',
  },
  transport: {
    label: 'Transport',
    cotisationOrg: 'URSSAF',
    cotisationTel: '36 98',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'FNTR', role: 'Fédération Nationale des Transports Routiers', site: 'https://www.fntr.fr' },
      { nom: 'OTRE', role: 'Organisation des Transporteurs Routiers Européens', site: 'https://www.otre.org' },
    ],
    aidesSpecifiques: [
      { nom: 'Aide au gazole professionnel', description: 'Remboursement partiel de la TICPE pour les transporteurs routiers.', site: 'https://www.douane.gouv.fr' },
    ],
    conseilsSpecifiques: [
      'La DREAL est votre interlocuteur pour les licences de transport',
      'Vérifiez le remboursement de la TICPE si vous êtes transporteur routier',
    ],
    chambre: 'CCI',
  },
  liberal: {
    label: 'Professions libérales',
    cotisationOrg: 'URSSAF (+ CIPAV pour certaines professions)',
    cotisationTel: '36 98',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'UNAPL', role: 'Union Nationale des Professions Libérales', site: 'https://www.unapl.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'CIPAV · Action sociale', description: 'Aide financière d\'urgence pour professions libérales affiliées à la CIPAV.', site: 'https://www.cipav.fr', badge: 'Si affilié CIPAV' },
      { nom: 'Fonds de solidarité libéral', description: 'Aides spécifiques via les ordres professionnels (avocats, médecins, architectes…).', badge: 'Selon profession' },
    ],
    conseilsSpecifiques: [
      'Contactez votre Ordre professionnel — beaucoup proposent une aide confidentielle',
      'La CIPAV (si vous y êtes affilié) a un fonds d\'action sociale',
      'Les professions libérales ont accès au mandat ad hoc comme toute entreprise',
    ],
    chambre: 'CCI',
  },
  sante: {
    label: 'Santé',
    cotisationOrg: 'URSSAF (+ CARMF/CARPIMKO selon profession)',
    cotisationTel: '36 98',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'Ordre professionnel', role: 'Conseil de l\'Ordre (médecins, pharmaciens, infirmiers…)', site: 'https://www.conseil-national.medecin.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'Entraide ordinale', description: 'Chaque Ordre professionnel dispose d\'un fonds d\'entraide confidentiel pour les confrères en difficulté.', badge: 'Confidentiel' },
      { nom: 'CARMF / CARPIMKO · Action sociale', description: 'Aide d\'urgence via votre caisse de retraite professionnelle.', badge: 'Selon caisse' },
    ],
    soutien: { nom: 'MOTS (Médecin Organisation Travail Santé)', description: 'Soutien psychologique pour professionnels de santé', telephone: '0 608 282 589' },
    conseilsSpecifiques: [
      'Contactez votre Ordre en priorité — ils ont un devoir d\'entraide',
      'La continuité des soins aux patients doit être organisée même en difficulté',
      'Votre caisse de retraite (CARMF, CARPIMKO…) propose une action sociale',
    ],
    chambre: 'CCI',
  },
  industrie: {
    label: 'Industrie',
    cotisationOrg: 'URSSAF',
    cotisationTel: '36 98',
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
    cotisationTel: '36 98',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'Syntec Numérique', role: 'Syndicat du numérique', site: 'https://numeum.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'French Tech', description: 'Accompagnement et financement pour startups tech en difficulté.', site: 'https://lafrenchtech.com' },
    ],
    conseilsSpecifiques: [
      'French Tech et BPI France ont des dispositifs pour les startups en difficulté',
    ],
    chambre: 'CCI',
  },
  finance: {
    label: 'Finance / Assurance',
    cotisationOrg: 'URSSAF',
    cotisationTel: '36 98',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [],
    aidesSpecifiques: [],
    conseilsSpecifiques: [
      'L\'ACPR (Autorité de contrôle prudentiel) est votre régulateur',
    ],
    chambre: 'CCI',
  },
  immobilier: {
    label: 'Immobilier',
    cotisationOrg: 'URSSAF',
    cotisationTel: '36 98',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'FNAIM', role: 'Fédération Nationale de l\'Immobilier', site: 'https://www.fnaim.fr' },
    ],
    aidesSpecifiques: [],
    conseilsSpecifiques: [
      'La FNAIM propose un accompagnement pour les agences en difficulté',
    ],
    chambre: 'CCI',
  },
  education: {
    label: 'Éducation / Formation',
    cotisationOrg: 'URSSAF',
    cotisationTel: '36 98',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [],
    aidesSpecifiques: [
      { nom: 'Qualiopi', description: 'Si vous perdez la certification Qualiopi, des dispositifs de sauvetage existent.', badge: 'Organisme de formation' },
    ],
    conseilsSpecifiques: [
      'En tant qu\'organisme de formation, la perte de Qualiopi peut être contestée',
    ],
    chambre: 'CCI',
  },
  artisanat: {
    label: 'Artisanat',
    cotisationOrg: 'URSSAF',
    cotisationTel: '36 98',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'CMA', role: 'Chambre de Métiers et de l\'Artisanat', site: 'https://www.artisanat.fr' },
      { nom: 'U2P', role: 'Union des entreprises de proximité', site: 'https://u2p-france.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'FISAC', description: 'Fonds d\'intervention pour les services, l\'artisanat et le commerce.', badge: 'Territorial' },
      { nom: 'CMA · Accompagnement', description: 'Diagnostic et accompagnement gratuit pour artisans en difficulté.', site: 'https://www.artisanat.fr', badge: 'Gratuit' },
    ],
    conseilsSpecifiques: [
      'La CMA (pas la CCI) est votre interlocuteur principal en tant qu\'artisan',
      'L\'U2P défend les intérêts des artisans et TPE',
    ],
    chambre: 'CMA',
  },
  autre: {
    label: 'Autre',
    cotisationOrg: 'URSSAF',
    cotisationTel: '36 98',
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

  if (secteur === 'commerce' && isArtisan(naf, company.formeJuridique)) {
    secteur = 'artisanat';
  }
  if (secteur === 'industrie' && isArtisan(naf, company.formeJuridique)) {
    secteur = 'artisanat';
  }

  return {
    secteur,
    ...SECTOR_DATA[secteur],
  };
}

export function getCompanyAge(dateCreation: string): number | null {
  if (!dateCreation) return null;
  const d = new Date(dateCreation);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

export function getEffectifSeuils(effectif: string): { cse: boolean; obligations50: boolean } {
  const map: Record<string, number> = {
    '0 salarié': 0,
    '1 ou 2 salariés': 2,
    '3 à 5 salariés': 5,
    '6 à 9 salariés': 9,
    '10 à 19 salariés': 15,
    '20 à 49 salariés': 35,
    '50 à 99 salariés': 75,
    '100 à 199 salariés': 150,
  };
  const approx = map[effectif] ?? 0;
  return {
    cse: approx >= 11,
    obligations50: approx >= 50,
  };
}

export function getChambreLabel(chambre: 'CCI' | 'CMA' | 'CA'): string {
  const labels = {
    CCI: 'Chambre de commerce et d\'industrie (CCI)',
    CMA: 'Chambre de Métiers et de l\'Artisanat (CMA)',
    CA: 'Chambre d\'agriculture',
  };
  return labels[chambre];
}
