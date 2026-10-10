import { fetchWithTimeout } from './fetchTimeout';
import type { CompanyData } from './types';

/* ---------- Interfaces API ---------- */

interface SireneEtablissement {
  siret?: string;
  code_postal?: string;
  libelle_commune?: string;
  adresse?: string;
}

interface SireneResult {
  nom_complet?: string;
  nom_raison_sociale?: string;
  prenom_usuel?: string;
  nom?: string;
  nature_juridique?: string;
  activite_principale?: string;
  libelle_activite_principale?: string;
  section_activite_principale?: string;
  date_creation?: string;
  tranche_effectif_salarie?: string;
  siege?: SireneEtablissement;
  matching_etablissements?: SireneEtablissement[];
}

interface SireneApiResponse {
  results?: SireneResult[];
  total_results?: number;
  page?: number;
  per_page?: number;
}

interface InseeAdresse {
  codePostalEtablissement?: string;
  libelleCommuneEtablissement?: string;
  numeroVoieEtablissement?: string;
  typeVoieEtablissement?: string;
  libelleVoieEtablissement?: string;
}

interface InseeUniteLegale {
  denominationUniteLegale?: string;
  prenomUsuelUniteLegale?: string;
  nomUniteLegale?: string;
  categorieJuridiqueUniteLegale?: string;
  activitePrincipaleUniteLegale?: string;
  trancheEffectifsUniteLegale?: string;
  dateCreationUniteLegale?: string;
}

interface InseeEtablissement {
  uniteLegale?: InseeUniteLegale;
  adresseEtablissement?: InseeAdresse;
  activitePrincipaleEtablissement?: string;
  dateCreationEtablissement?: string;
}

interface InseeSireneApiResponse {
  etablissement?: InseeEtablissement;
}

// Free, no-key government API. Backed by Sirene data.
const RECHERCHE_BASE = 'https://recherche-entreprises.api.gouv.fr/search';
// Fallback (requires key, kept for completeness).
const SIRENE_BASE = 'https://api.insee.fr/entreprises/sirene/V3';

/**
 * Catégories juridiques INSEE (niveau III) les plus fréquentes.
 * Source : nomenclature INSEE des catégories juridiques (version 2022),
 * libellés vérifiés via l'API Métadonnées de l'INSEE
 * (https://api.insee.fr/metadonnees/codes/cj/n3/{code}).
 *
 * Les libellés sont aussi lus par getJuridiction() et getFormeDetail()
 * (lib/strategie.ts) : ils doivent contenir les mots-clés de la forme
 * (« SARL », « anonyme », « nom collectif », « société civile »…).
 * NB : l'INSEE ne distingue ni l'EURL (5499) ni la SASU (5710).
 */
const FORMES: Record<string, string> = {
  '1000': 'Entrepreneur individuel',
  '5202': 'Société en nom collectif (SNC)',
  '5203': 'Société en nom collectif coopérative',
  '5306': 'Société en commandite simple',
  '5307': 'Société en commandite simple coopérative',
  '5308': 'Société en commandite par actions',
  '5309': 'Société en commandite par actions coopérative',
  '5385': "Société d'exercice libéral en commandite par actions (SELCA)",
  '5458': 'SARL coopérative de production (SCOP)',
  '5470': 'SPFPL à responsabilité limitée (SPFPL SARL)',
  '5485': "Société d'exercice libéral à responsabilité limitée (SELARL)",
  '5499': 'SARL',
  '5558': 'Société anonyme coopérative de production (SCOP SA)',
  '5585': "Société d'exercice libéral à forme anonyme (SELAFA)",
  '5658': 'Société anonyme coopérative de production (SCOP SA)',
  '5685': "Société d'exercice libéral à forme anonyme (SELAFA)",
  '5710': 'SAS / SASU',
  '5770': 'SPFPL par actions simplifiée (SPFPL SAS)',
  '5785': "Société d'exercice libéral par actions simplifiée (SELAS)",
  '5800': 'Société européenne (SE)',
  '6210': "Groupement européen d'intérêt économique (GEIE)",
  '6220': "Groupement d'intérêt économique (GIE)",
  '6316': 'Coopérative d\'utilisation de matériel agricole (CUMA)',
  '6317': 'Société coopérative agricole',
  '6521': 'Société civile de placement immobilier (SCPI)',
  '6533': "Groupement agricole d'exploitation en commun (GAEC)",
  '6534': 'Groupement foncier agricole (société civile)',
  '6536': 'Groupement forestier (société civile)',
  '6540': 'Société civile immobilière (SCI)',
  '6541': 'Société civile immobilière de construction-vente',
  '6585': 'Société civile professionnelle (SCP)',
  '6589': 'Société civile de moyens (SCM)',
  '6597': "Société civile d'exploitation agricole (SCEA)",
  '6598': 'Exploitation agricole à responsabilité limitée (EARL)',
  '6599': 'Société civile',
  '9220': 'Association déclarée',
  '9230': "Association reconnue d'utilité publique",
  '9300': 'Fondation',
};

/**
 * Repli par catégorie de niveau II (2 premiers chiffres), libellés INSEE
 * (https://api.insee.fr/metadonnees/codes/cj/n2/{code}).
 */
const FORMES_NIVEAU_II: Record<string, string> = {
  '10': 'Entrepreneur individuel',
  '21': 'Indivision',
  '22': 'Société créée de fait',
  '23': 'Société en participation',
  '24': 'Fiducie',
  '27': 'Groupement de droit privé sans personnalité morale',
  '29': 'Groupement de droit privé sans personnalité morale',
  '31': 'Personne morale de droit étranger',
  '32': 'Personne morale de droit étranger',
  '41': 'Établissement public à caractère industriel ou commercial',
  '51': 'Société coopérative commerciale particulière',
  '52': 'Société en nom collectif (SNC)',
  '53': 'Société en commandite',
  '54': 'SARL',
  '55': 'Société anonyme (SA)',
  '56': 'Société anonyme (SA)',
  '57': 'SAS / SASU',
  '58': 'Société européenne (SE)',
  '61': "Caisse d'épargne et de prévoyance",
  '62': "Groupement d'intérêt économique (GIE)",
  '63': 'Société coopérative agricole',
  '64': "Société d'assurance mutuelle",
  '65': 'Société civile',
  '69': 'Autre personne morale inscrite au RCS',
  '71': 'Personne morale de droit public',
  '72': 'Personne morale de droit public',
  '73': 'Personne morale de droit public',
  '74': 'Personne morale de droit public',
  '81': 'Organisme de protection sociale',
  '82': 'Organisme mutualiste',
  '83': "Comité d'entreprise",
  '84': 'Organisme professionnel',
  '85': 'Organisme de retraite à adhésion non obligatoire',
  '91': 'Syndicat de copropriétaires',
  '92': 'Association',
  '93': 'Fondation',
  '99': 'Autre personne morale de droit privé',
};

export function formatForme(code: string | undefined): string {
  const c = (code ?? '').trim();
  if (!c) return 'Non renseignée';
  if (FORMES[c]) return FORMES[c];
  // Sociétés civiles professionnelles : 6561 à 6578 (SCP d'avocats, de médecins…)
  if (/^65[67]\d$/.test(c)) return 'Société civile professionnelle (SCP)';
  return FORMES_NIVEAU_II[c.slice(0, 2)] ?? `Catégorie juridique ${c}`;
}

function formatEffectif(code: string | undefined): string {
  const map: Record<string, string> = {
    NN: 'Non renseigné',
    '00': '0 salarié',
    '01': '1 ou 2 salariés',
    '02': '3 à 5 salariés',
    '03': '6 à 9 salariés',
    '11': '10 à 19 salariés',
    '12': '20 à 49 salariés',
    '21': '50 à 99 salariés',
    '22': '100 à 199 salariés',
    '31': '200 à 249 salariés',
    '32': '250 à 499 salariés',
    '41': '500 à 999 salariés',
    '42': '1000 à 1999 salariés',
    '51': '2000 à 4999 salariés',
  };
  return map[code ?? ''] ?? 'Non renseigné';
}

function fallbackFor(siret: string): CompanyData {
  return {
    siret,
    nom: 'Votre entreprise',
    formeJuridique: 'Non renseignée',
    naf: '',
    dateCreation: '',
    effectif: 'Non renseigné',
    adresse: '',
    codePostal: '',
    ville: '',
    departement: siret.slice(0, 2),
    fetched: false,
  };
}

async function fetchFromRechercheEntreprises(
  siret: string
): Promise<CompanyData | null> {
  try {
    const url = `${RECHERCHE_BASE}?q=${siret}&page=1&per_page=1`;
    const res = await fetchWithTimeout(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json: SireneApiResponse = await res.json();
    const result = json?.results?.[0];
    if (!result) return null;

    const matching =
      result.matching_etablissements?.find((e) => e.siret === siret) ??
      result.matching_etablissements?.[0] ??
      result.siege;

    const codePostal: string = matching?.code_postal ?? result.siege?.code_postal ?? '';
    const ville: string = matching?.libelle_commune ?? result.siege?.libelle_commune ?? '';
    const departement = codePostal.slice(0, 2) || siret.slice(0, 2);
    const nom: string =
      result.nom_complet ??
      result.nom_raison_sociale ??
      [result.prenom_usuel, result.nom].filter(Boolean).join(' ') ??
      'Votre entreprise';

    return {
      siret,
      nom: nom.trim(),
      formeJuridique: formatForme(result.nature_juridique),
      naf: result.activite_principale ?? '',
      nafLabel: result.libelle_activite_principale ?? undefined,
      nafSection: result.section_activite_principale ?? undefined,
      dateCreation: result.date_creation ?? '',
      effectif: formatEffectif(result.tranche_effectif_salarie),
      adresse: matching?.adresse ?? result.siege?.adresse ?? '',
      codePostal,
      ville,
      departement,
      fetched: true,
    };
  } catch {
    return null;
  }
}

async function fetchFromInseeSirene(
  siret: string
): Promise<CompanyData | null> {
  const apiKey = process.env.INSEE_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetchWithTimeout(`${SIRENE_BASE}/siret/${siret}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json: InseeSireneApiResponse = await res.json();
    const etab = json?.etablissement;
    if (!etab) return null;

    const unit = etab.uniteLegale ?? {};
    const addr = etab.adresseEtablissement ?? {};
    const codePostal: string = addr.codePostalEtablissement ?? '';
    const departement = codePostal.slice(0, 2) || siret.slice(0, 2);

    const nom =
      unit.denominationUniteLegale ??
      [unit.prenomUsuelUniteLegale, unit.nomUniteLegale].filter(Boolean).join(' ') ??
      'Votre entreprise';

    const addressParts = [
      addr.numeroVoieEtablissement,
      addr.typeVoieEtablissement,
      addr.libelleVoieEtablissement,
    ]
      .filter(Boolean)
      .join(' ');

    return {
      siret,
      nom: nom.trim(),
      formeJuridique: formatForme(unit.categorieJuridiqueUniteLegale),
      naf: unit.activitePrincipaleUniteLegale ?? '',
      nafLabel: etab.activitePrincipaleEtablissement ?? unit.activitePrincipaleUniteLegale,
      dateCreation:
        unit.dateCreationUniteLegale ?? etab.dateCreationEtablissement ?? '',
      effectif: formatEffectif(unit.trancheEffectifsUniteLegale),
      adresse: addressParts,
      codePostal,
      ville: addr.libelleCommuneEtablissement ?? '',
      departement,
      fetched: true,
    };
  } catch {
    return null;
  }
}

export async function fetchSirene(siret: string): Promise<CompanyData> {
  const cleanSiret = siret.replace(/\s/g, '');
  // Primary: free public API — works without any key.
  const primary = await fetchFromRechercheEntreprises(cleanSiret);
  if (primary) return primary;
  // Secondary: INSEE Sirene with user-provided key.
  const secondary = await fetchFromInseeSirene(cleanSiret);
  if (secondary) return secondary;
  return fallbackFor(cleanSiret);
}

export function yearFromDate(d: string): string {
  if (!d) return '—';
  const y = d.slice(0, 4);
  return /^\d{4}$/.test(y) ? y : '—';
}
