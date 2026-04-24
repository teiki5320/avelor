export type Situation = 'prevention' | 'tresorie' | 'redressement' | 'assignation';
export type Probleme = 'urssaf' | 'fournisseurs' | 'banque' | 'impots';
export type Effectif = 'independant' | 'salaries';
export type Moral = 'combatif' | 'epuise' | 'perdu';
export type Caution = 'oui' | 'non' | 'ne-sais-pas';
export type RegimeMatrimonial = 'communaute' | 'separation' | 'non-marie' | 'ne-sais-pas';
export type Patrimoine = 'proprietaire' | 'locataire';
export type VenteEnvisagee = 'oui' | 'peut-etre' | 'non';

export interface Reponses {
  situation: Situation;
  probleme: Probleme;
  effectif: Effectif;
  effectifDetail?: string;
  moral: Moral;
  caution?: Caution;
  regime?: RegimeMatrimonial;
  patrimoine?: Patrimoine;
  vente?: VenteEnvisagee;
}

export interface CompanyData {
  siret: string;
  nom: string;
  formeJuridique: string;
  naf: string;
  nafLabel?: string;
  nafSection?: string;
  dateCreation: string;
  effectif: string;
  adresse: string;
  codePostal: string;
  ville: string;
  departement: string;
  fetched: boolean;
}

export interface AlerteSignal {
  niveau: 'rouge' | 'jaune' | 'vert';
  titre: string;
  message: string;
  source: string;
}

export interface BodaccItem {
  type: string;
  date: string;
  tribunal?: string;
  description?: string;
}

export interface PlaceResult {
  name: string;
  address?: string;
  rating?: number;
  reviews?: number;
  phone?: string;
  mapsUrl?: string;
}

export interface FicheRecord {
  id?: string;
  token: string;
  siret: string;
  reponses: Reponses;
  company_data: CompanyData;
  email?: string;
  created_at?: string;
}
