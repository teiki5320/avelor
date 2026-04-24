'use client';
import { useState } from 'react';
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

type TabId = 'cap' | 'agir' | 'juridique' | 'patrimoine' | 'aides' | 'ressources';

const TABS: { id: TabId; label: string; icone: string }[] = [
  { id: 'cap', label: 'Cap', icone: '🎯' },
  { id: 'agir', label: 'Agir', icone: '✅' },
  { id: 'juridique', label: 'Juridique', icone: '⚖️' },
  { id: 'patrimoine', label: 'Patrimoine', icone: '🏠' },
  { id: 'aides', label: 'Aides', icone: '💶' },
  { id: 'ressources', label: 'Ressources', icone: '📚' },
];

export default function LayoutOnglets({
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
  const [active, setActive] = useState<TabId>('cap');

  return (
    <div className="space-y-5 sm:space-y-6">
      <IdentiteCard company={company} />
      <BlocSanteSecteur sector={sector} />
      <AlertesBand alertes={alertes} />

      {/* Barre d'onglets sticky */}
      <nav className="sticky top-20 z-10 -mx-5 border-y border-navy/10 bg-white/80 px-5 py-2 backdrop-blur sm:top-24">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                active === t.id
                  ? 'bg-navy text-white'
                  : 'text-navy/70 hover:bg-navy/5'
              }`}
            >
              <span aria-hidden className="mr-1.5">{t.icone}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="space-y-5 sm:space-y-6">
        {active === 'cap' && (
          <>
            <BlocSoutien reponses={reponses} sector={sector} />
            <BlocStrategie reponses={reponses} company={company} sector={sector} />
            <BlocProcedureRecommandee reponses={reponses} company={company} sector={sector} />
            <BlocTimeline reponses={reponses} company={company} />
          </>
        )}

        {active === 'agir' && (
          <>
            <BlocPlanAction reponses={reponses} company={company} sector={sector} />
            <BlocChecklist reponses={reponses} company={company} sector={sector} />
            <BlocCalendrier reponses={reponses} company={company} sector={sector} />
            <BlocRappels reponses={reponses} />
          </>
        )}

        {active === 'juridique' && (
          <>
            <BlocCessationDecompte reponses={reponses} />
            <BlocTresorerie reponses={reponses} />
            <BlocObligations reponses={reponses} company={company} seuils={seuils} />
            <BlocPrescription reponses={reponses} company={company} companyAge={companyAge} seuils={seuils} />
            <BlocAlertes bodacc={bodacc} infogreffe={infogreffe} />
            <BlocConsequencesPerso reponses={reponses} />
          </>
        )}

        {active === 'patrimoine' && (
          <>
            <BlocProtectionFamille reponses={reponses} company={company} sector={sector} />
            <BlocPatrimoine reponses={reponses} company={company} />
            <BlocAuditCaution reponses={reponses} />
          </>
        )}

        {active === 'aides' && (
          <>
            <BlocAides reponses={reponses} company={company} sector={sector} />
            <BlocCCSF reponses={reponses} company={company} />
            <BlocBailCommercial reponses={reponses} company={company} sector={sector} />
          </>
        )}

        {active === 'ressources' && (
          <>
            <BlocOrganismes groupes={groupes} />
            <BlocSoutien reponses={reponses} sector={sector} />
          </>
        )}
      </div>
    </div>
  );
}
