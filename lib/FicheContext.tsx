'use client';
import { createContext, useContext } from 'react';
import type { Reponses, CompanyData, AlerteSignal, BodaccItem } from './types';
import type { SectorInfo, EffectifSeuils } from './secteur';
import type { GroupeOrganismes } from './organismes';

export interface FicheContextType {
  token: string;
  reponses: Reponses;
  company: CompanyData;
  sector: SectorInfo;
  alertes: AlerteSignal[];
  bodacc: BodaccItem[];
  infogreffe: BodaccItem[];
  groupes: GroupeOrganismes[];
  companyAge: number | null;
  seuils: EffectifSeuils;
}

const FicheContext = createContext<FicheContextType | null>(null);

export function FicheProvider({ children, value }: { children: React.ReactNode; value: FicheContextType }) {
  return <FicheContext.Provider value={value}>{children}</FicheContext.Provider>;
}

const DEFAULT_REPONSES: Reponses = {
  situation: 'prevention',
  probleme: 'urssaf',
  effectif: 'independant',
  moral: 'combatif',
};

const DEFAULT_COMPANY: CompanyData = {
  siret: '',
  nom: '',
  formeJuridique: '',
  naf: '',
  dateCreation: '',
  effectif: '',
  adresse: '',
  codePostal: '',
  ville: '',
  departement: '',
  fetched: false,
};

const DEFAULT_CONTEXT: FicheContextType = {
  token: '',
  reponses: DEFAULT_REPONSES,
  company: DEFAULT_COMPANY,
  sector: {} as SectorInfo,
  alertes: [],
  bodacc: [],
  infogreffe: [],
  groupes: [],
  companyAge: null,
  seuils: { cse: false, obligations50: false } as EffectifSeuils,
};

export function useFiche(): FicheContextType {
  const ctx = useContext(FicheContext);
  return ctx ?? DEFAULT_CONTEXT;
}

/**
 * Clé localStorage propre à la fiche courante. Sans suffixe, un second
 * SIRET consulté sur le même navigateur verrait les données saisies pour
 * le premier (plan d'action, trésorerie, cautions…). On suffixe par le
 * SIRET (stable entre régénérations de fiche) ou à défaut par le token.
 */
export function useFicheStorageKey(base: string): string {
  const { token, company } = useFiche();
  return `${base}_${company.siret || token || 'anon'}`;
}
