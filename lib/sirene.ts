import type { CompanyData } from './types';

// Free, no-key government API. Backed by Sirene data.
const RECHERCHE_BASE = 'https://recherche-entreprises.api.gouv.fr/search';
// Fallback (requires key, kept for completeness).
const SIRENE_BASE = 'https://api.insee.fr/entreprises/sirene/V3';

const FORMES: Record<string, string> = {
  '5499': 'SAS',
  '5710': 'SAS',
  '5499SA': 'SA',
  '5485': 'SARL',
  '5498': 'SARL',
  '5710SAS': 'SAS',
  '5720': 'SASU',
  '5422': 'SARL',
  '1000': 'Entrepreneur individuel',
  '1': 'Entrepreneur individuel',
  '5307': 'Société en nom collectif',
  '5585': 'SCP',
  '6540': 'SCI',
};

function formatForme(code: string | undefined): string {
  if (!code) return 'Non renseignée';
  if (FORMES[code]) return FORMES[code];
  if (code.startsWith('10')) return 'Entrepreneur individuel';
  if (code.startsWith('54')) return 'SARL';
  if (code.startsWith('57')) return 'SAS / SASU';
  if (code.startsWith('55')) return 'SA';
  if (code.startsWith('65')) return 'SCI';
  return `Forme ${code}`;
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
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json: any = await res.json();
    const result = json?.results?.[0];
    if (!result) return null;

    const matching =
      result.matching_etablissements?.find((e: any) => e.siret === siret) ??
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
    const res = await fetch(`${SIRENE_BASE}/siret/${siret}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json: any = await res.json();
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
