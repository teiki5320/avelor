import { FicheProvider } from '@/lib/FicheContext';
import ProgressTracker from '@/components/fiche/ProgressTracker';
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
import BlocAidesEtat from '@/components/fiche/BlocAidesEtat';
import BlocBailCommercial from '@/components/fiche/BlocBailCommercial';
import BlocConsequencesPerso from '@/components/fiche/BlocConsequencesPerso';
import BlocRappels from '@/components/fiche/BlocRappels';
import IdentiteHero from '@/components/fiche/dashboard/IdentiteHero';
import PriorityCards from '@/components/fiche/dashboard/PriorityCards';
import QuickLinks from '@/components/fiche/dashboard/QuickLinks';
import StrategieHero from '@/components/fiche/dashboard/StrategieHero';
import SectionNav from '@/components/fiche/dashboard/SectionNav';
import SectionHeader from '@/components/fiche/dashboard/SectionHeader';
import type { LayoutData } from './types';

/**
 * Wrapper qui rend deux colonnes indépendantes : chaque colonne grandit
 * librement, sans alignement forcé entre les deux (évite les vides
 * quand un accordéon s'ouvre d'un seul côté).
 */
function TwoCols({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="min-w-0 space-y-4">{left}</div>
      <div className="min-w-0 space-y-4">{right}</div>
    </div>
  );
}

export default function LayoutDashboard({
  token,
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
    <FicheProvider value={{ reponses, company, sector, alertes, bodacc, infogreffe, groupes, companyAge, seuils }}>
    <div className="space-y-6">
      {/* ───── Top : identité + cartes prioritaires dynamiques ───── */}
      <IdentiteHero />
      <PriorityCards />

      {/* Progression de lecture */}
      <ProgressTracker token={token} />

      {/* Alertes contextuelles */}
      <BlocSanteSecteur />
      <AlertesBand />

      {/* Liens rapides outils / courriers */}
      <QuickLinks />

      {/* Navigation sticky */}
      <SectionNav />

      {/* ───── Section AGIR (en premier, 2 accordéons ouverts) ───── */}
      <SectionHeader
        id="action"
        icone="✅"
        titre="Agir"
        sousTitre="Votre plan et votre checklist, déjà dépliés pour commencer"
        couleur="vert"
      />
      <TwoCols
        left={
          <>
            <div data-section="plan-action">
              <BlocPlanAction defaultOpen />
            </div>
            <div data-section="procedure">
              <BlocProcedureRecommandee />
            </div>
          </>
        }
        right={
          <>
            <div data-section="checklist">
              <BlocChecklist defaultOpen />
            </div>
          </>
        }
      />

      {/* ───── Section VUE D'ENSEMBLE ───── */}
      <SectionHeader
        id="vue-ensemble"
        icone="📊"
        titre="Vue d'ensemble"
        sousTitre="Votre cap recommandé et votre soutien"
        couleur="bleu"
      />
      <div data-section="strategie">
        <StrategieHero />
      </div>
      <div data-section="soutien">
        <BlocSoutien />
      </div>

      {/* ───── Section ÉCHÉANCES ───── */}
      <SectionHeader
        id="echeances"
        icone="⏱️"
        titre="Échéances & urgences"
        sousTitre="Ce qui presse, avec dates et délais légaux"
        couleur="rouge"
      />
      <TwoCols
        left={
          <>
            <div data-section="cessation">
              <BlocCessationDecompte />
            </div>
            <div data-section="tresorerie">
              <BlocTresorerie />
            </div>
            <div data-section="calendrier">
              <BlocCalendrier />
            </div>
          </>
        }
        right={
          <>
            <div data-section="timeline">
              <BlocTimeline />
            </div>
            <div data-section="rappels">
              <BlocRappels />
            </div>
          </>
        }
      />

      {/* ───── Section PATRIMOINE ───── */}
      <SectionHeader
        id="patrimoine"
        icone="🏠"
        titre="Patrimoine & famille"
        sousTitre="Protection, cautions, conséquences personnelles"
        couleur="jaune"
      />
      <TwoCols
        left={
          <>
            <div data-section="protection">
              <BlocProtectionFamille />
            </div>
            <div data-section="caution">
              <BlocAuditCaution />
            </div>
          </>
        }
        right={
          <>
            <div data-section="patrimoine">
              <BlocPatrimoine />
            </div>
            <div data-section="consequences">
              <BlocConsequencesPerso />
            </div>
          </>
        }
      />

      {/* ───── Section AIDES ───── */}
      <SectionHeader
        id="aides"
        icone="💶"
        titre="Aides & leviers"
        sousTitre="Dispositifs financiers, CCSF, bail commercial"
        couleur="bleu"
      />
      <TwoCols
        left={
          <>
            <div data-section="aides">
              <BlocAides />
            </div>
            <div data-section="aides-etat">
              <BlocAidesEtat />
            </div>
            <div data-section="bail">
              <BlocBailCommercial />
            </div>
          </>
        }
        right={
          <>
            <div data-section="ccsf">
              <BlocCCSF />
            </div>
            <div data-section="obligations">
              <BlocObligations />
            </div>
          </>
        }
      />

      {/* ───── Section RESSOURCES ───── */}
      <SectionHeader
        id="ressources"
        icone="📚"
        titre="Ressources"
        sousTitre="Organismes, prescriptions, alertes publiques"
        couleur="navy"
      />
      <TwoCols
        left={
          <>
            <div data-section="organismes">
              <BlocOrganismes />
            </div>
            <div data-section="alertes">
              <BlocAlertes />
            </div>
          </>
        }
        right={
          <>
            <div data-section="prescription">
              <BlocPrescription />
            </div>
          </>
        }
      />
    </div>
    </FicheProvider>
  );
}
