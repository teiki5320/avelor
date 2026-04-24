import IdentiteCard from '@/components/fiche/IdentiteCard';
import AlertesBand from '@/components/fiche/AlertesBand';
import BlocSoutien from '@/components/fiche/BlocSoutien';
import BlocCalendrier from '@/components/fiche/BlocCalendrier';
import BlocChecklist from '@/components/fiche/BlocChecklist';
import BlocOrganismes from '@/components/fiche/BlocOrganismes';
import BlocAlertes from '@/components/fiche/BlocAlertes';
import BlocPrescription from '@/components/fiche/BlocPrescription';
import BlocPlanAction from '@/components/fiche/BlocPlanAction';
import BlocAides from '@/components/fiche/BlocAides';
import BlocProtectionFamille from '@/components/fiche/BlocProtectionFamille';
import BlocProcedureRecommandee from '@/components/fiche/BlocProcedureRecommandee';
import BlocSanteSecteur from '@/components/fiche/BlocSanteSecteur';
import BlocObligations from '@/components/fiche/BlocObligations';
import BlocAuditCaution from '@/components/fiche/BlocAuditCaution';
import BlocTimeline from '@/components/fiche/BlocTimeline';
import BlocStrategie from '@/components/fiche/BlocStrategie';
import BlocPatrimoine from '@/components/fiche/BlocPatrimoine';
import BlocTresorerie from '@/components/fiche/BlocTresorerie';
import BlocCessationDecompte from '@/components/fiche/BlocCessationDecompte';
import BlocCCSF from '@/components/fiche/BlocCCSF';
import BlocBailCommercial from '@/components/fiche/BlocBailCommercial';
import BlocConsequencesPerso from '@/components/fiche/BlocConsequencesPerso';
import BlocRappels from '@/components/fiche/BlocRappels';
import type { LayoutData } from './types';

export default function LayoutClassique({
  company,
  reponses,
  sector,
  alertes,
  bodacc,
  infogreffe,
  groupes,
  companyAge,
  seuils,
}: LayoutData) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <IdentiteCard company={company} />
      <BlocSanteSecteur sector={sector} />
      <AlertesBand alertes={alertes} />

      <BlocSoutien reponses={reponses} sector={sector} />
      <BlocStrategie reponses={reponses} company={company} sector={sector} />
      <BlocProcedureRecommandee reponses={reponses} company={company} sector={sector} />
      <BlocTimeline reponses={reponses} company={company} />
      <BlocCessationDecompte reponses={reponses} />
      <BlocRappels reponses={reponses} />
      <BlocTresorerie reponses={reponses} />
      <BlocCalendrier reponses={reponses} company={company} sector={sector} />
      <BlocChecklist reponses={reponses} company={company} sector={sector} />
      <BlocPlanAction reponses={reponses} company={company} sector={sector} />
      <BlocProtectionFamille reponses={reponses} company={company} sector={sector} />
      <BlocPatrimoine reponses={reponses} company={company} />
      <BlocConsequencesPerso reponses={reponses} />
      <BlocAuditCaution reponses={reponses} />
      <BlocAides reponses={reponses} company={company} sector={sector} />
      <BlocCCSF reponses={reponses} company={company} />
      <BlocBailCommercial reponses={reponses} company={company} sector={sector} />
      <BlocObligations reponses={reponses} company={company} seuils={seuils} />
      <BlocOrganismes groupes={groupes} />
      <BlocPrescription reponses={reponses} company={company} companyAge={companyAge} seuils={seuils} />
      <BlocAlertes bodacc={bodacc} infogreffe={infogreffe} />
    </div>
  );
}
