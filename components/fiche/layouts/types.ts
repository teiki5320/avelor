import type {
  CompanyData,
  Reponses,
  AlerteSignal,
  BodaccItem,
} from '@/lib/types';
import type { SectorInfo, EffectifSeuils } from '@/lib/secteur';
import type { GroupeOrganismes } from '@/lib/organismes';

export interface LayoutData {
  token: string;
  company: CompanyData;
  reponses: Reponses;
  sector: SectorInfo;
  alertes: AlerteSignal[];
  bodacc: BodaccItem[];
  infogreffe: BodaccItem[];
  groupes: GroupeOrganismes[];
  companyAge: number | null;
  seuils: EffectifSeuils;
}
