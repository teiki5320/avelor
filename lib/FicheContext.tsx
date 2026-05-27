'use client';
import { createContext, useContext } from 'react';
import type { Reponses, CompanyData, AlerteSignal, BodaccItem } from './types';
import type { SectorInfo, EffectifSeuils } from './secteur';
import type { GroupeOrganismes } from './organismes';

export interface FicheContextType {
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
};

const DEFAULT_CONTEXT: FicheContextType = {
  reponses: DEFAULT_REPONSES,
  company: DEFAULT_COMPANY,
  sector: { secteur: '', label: '', sante: null, contacts: [] },
  alertes: [],
  bodacc: [],
  infogreffe: [],
  groupes: [],
  companyAge: null,
  seuils: { cse: false, obligations50: false },
};

export function useFiche(): FicheContextType {
  const ctx = useContext(FicheContext);
  return ctx ?? DEFAULT_CONTEXT;
}
