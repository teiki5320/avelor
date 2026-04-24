import BlocSanteSecteur from '@/components/fiche/BlocSanteSecteur';
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
import BlocObligations from '@/components/fiche/BlocObligations';
import BlocAuditCaution from '@/components/fiche/BlocAuditCaution';
import BlocTimeline from '@/components/fiche/BlocTimeline';
import BlocPatrimoine from '@/components/fiche/BlocPatrimoine';
import BlocTresorerie from '@/components/fiche/BlocTresorerie';
import BlocCessationDecompte from '@/components/fiche/BlocCessationDecompte';
import BlocCCSF from '@/components/fiche/BlocCCSF';
import BlocBailCommercial from '@/components/fiche/BlocBailCommercial';
import BlocConsequencesPerso from '@/components/fiche/BlocConsequencesPerso';
import BlocRappels from '@/components/fiche/BlocRappels';
import IdentiteHero from '@/components/fiche/dashboard/IdentiteHero';
import KpiBand from '@/components/fiche/dashboard/KpiBand';
import StrategieHero from '@/components/fiche/dashboard/StrategieHero';
import SectionNav from '@/components/fiche/dashboard/SectionNav';
import SectionHeader from '@/components/fiche/dashboard/SectionHeader';
import type { LayoutData } from './types';

export default function LayoutDashboard({
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
    <div className="space-y-6">
      {/* Hero identité */}
      <IdentiteHero company={company} />

      {/* KPI band */}
      <KpiBand reponses={reponses} company={company} sector={sector} seuils={seuils} />

      {/* Alertes contextuelles (santé secteur + BODACC) — affichées si pertinentes */}
      <BlocSanteSecteur sector={sector} />
      <AlertesBand alertes={alertes} />

      {/* SECTION : Vue d'ensemble */}
      <SectionHeader
        id="vue-ensemble"
        icone="📊"
        titre="Vue d'ensemble"
        sousTitre="Votre cap, en un coup d'œil"
        couleur="bleu"
      />

      {/* Navigation sticky vers les sections */}
      <SectionNav />

      {/* Stratégie en hero permanent */}
      <StrategieHero reponses={reponses} company={company} />

      {/* Soutien humain toujours visible */}
      <BlocSoutien reponses={reponses} sector={sector} />

      {/* SECTION : Échéances */}
      <SectionHeader
        id="echeances"
        icone="⏱️"
        titre="Échéances & urgences"
        sousTitre="Ce qui presse, avec dates et délais"
        couleur="rouge"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <BlocCessationDecompte reponses={reponses} />
        <BlocTimeline reponses={reponses} company={company} />
        <BlocTresorerie reponses={reponses} />
        <BlocRappels reponses={reponses} />
        <BlocCalendrier reponses={reponses} company={company} sector={sector} />
      </div>

      {/* SECTION : Agir */}
      <SectionHeader
        id="action"
        icone="✅"
        titre="Agir"
        sousTitre="Votre plan, votre checklist, vos procédures"
        couleur="vert"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <BlocPlanAction reponses={reponses} company={company} sector={sector} />
        <BlocChecklist reponses={reponses} company={company} sector={sector} />
        <BlocProcedureRecommandee reponses={reponses} company={company} sector={sector} />
      </div>

      {/* SECTION : Patrimoine */}
      <SectionHeader
        id="patrimoine"
        icone="🏠"
        titre="Patrimoine & famille"
        sousTitre="Protection, cautions, conséquences personnelles"
        couleur="jaune"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <BlocProtectionFamille reponses={reponses} company={company} sector={sector} />
        <BlocPatrimoine reponses={reponses} company={company} />
        <BlocAuditCaution reponses={reponses} />
        <BlocConsequencesPerso reponses={reponses} />
      </div>

      {/* SECTION : Aides & leviers */}
      <SectionHeader
        id="aides"
        icone="💶"
        titre="Aides & leviers"
        sousTitre="Dispositifs financiers, CCSF, bail commercial"
        couleur="bleu"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <BlocAides reponses={reponses} company={company} sector={sector} />
        <BlocCCSF reponses={reponses} company={company} />
        <BlocBailCommercial reponses={reponses} company={company} sector={sector} />
        <BlocObligations reponses={reponses} company={company} seuils={seuils} />
      </div>

      {/* SECTION : Ressources */}
      <SectionHeader
        id="ressources"
        icone="📚"
        titre="Ressources"
        sousTitre="Organismes, prescriptions, alertes publiques"
        couleur="navy"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <BlocOrganismes groupes={groupes} />
        <BlocPrescription
          reponses={reponses}
          company={company}
          companyAge={companyAge}
          seuils={seuils}
        />
        <BlocAlertes bodacc={bodacc} infogreffe={infogreffe} />
      </div>
    </div>
  );
}
