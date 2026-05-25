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

export function useFiche(): FicheContextType {
  const ctx = useContext(FicheContext);
  if (!ctx) throw new Error('useFiche must be used within FicheProvider');
  return ctx;
}
