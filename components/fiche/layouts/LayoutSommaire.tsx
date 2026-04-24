'use client';
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

interface Section {
  id: string;
  label: string;
  groupe: string;
}

const SECTIONS: Section[] = [
  { id: 'soutien', label: 'Soutien humain', groupe: 'Priorité' },
  { id: 'strategie', label: 'Stratégie', groupe: 'Priorité' },
  { id: 'procedures', label: 'Procédures', groupe: 'Priorité' },
  { id: 'timeline', label: 'Timeline juridique', groupe: 'Échéances' },
  { id: 'cessation', label: 'Décompte 45 j', groupe: 'Échéances' },
  { id: 'rappels', label: 'Rappels (ICS)', groupe: 'Échéances' },
  { id: 'tresorerie', label: 'Trésorerie 6 mois', groupe: 'Échéances' },
  { id: 'calendrier', label: 'Calendrier d\'urgence', groupe: 'Échéances' },
  { id: 'plan', label: 'Plan d\'action', groupe: 'Agir' },
  { id: 'checklist', label: 'Checklist', groupe: 'Agir' },
  { id: 'famille', label: 'Protection famille', groupe: 'Patrimoine' },
  { id: 'patrimoine', label: 'Cartographie patrimoine', groupe: 'Patrimoine' },
  { id: 'cautions', label: 'Audit cautions', groupe: 'Patrimoine' },
  { id: 'consequences', label: 'Conséquences perso', groupe: 'Patrimoine' },
  { id: 'aides', label: 'Aides & financements', groupe: 'Leviers' },
  { id: 'ccsf', label: 'CCSF', groupe: 'Leviers' },
  { id: 'bail', label: 'Bail commercial', groupe: 'Leviers' },
  { id: 'obligations', label: 'Obligations effectif', groupe: 'Leviers' },
  { id: 'organismes', label: 'Organismes', groupe: 'Ressources' },
  { id: 'prescription', label: 'Prescriptions', groupe: 'Ressources' },
  { id: 'alertes', label: 'Alertes BODACC', groupe: 'Ressources' },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function LayoutSommaire(data: LayoutData) {
  const { company, reponses, sector, alertes, bodacc, infogreffe, groupes, companyAge, seuils } = data;

  // Grouper les sections par groupe
  const groupes_tocs = Array.from(new Set(SECTIONS.map((s) => s.groupe)));

  return (
    <div className="space-y-5 sm:space-y-6">
      <IdentiteCard company={company} />
      <BlocSanteSecteur sector={sector} />
      <AlertesBand alertes={alertes} />

      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-6">
        {/* SOMMAIRE : sticky desktop, top mobile */}
        <aside className="no-print mb-5 lg:mb-0">
          <nav className="lg:sticky lg:top-24 rounded-2xl border border-navy/10 bg-white/80 p-4 backdrop-blur">
            <p className="mb-3 font-display text-xs uppercase tracking-wider text-navy/50">
              Sommaire
            </p>
            <div className="space-y-3 text-sm">
              {groupes_tocs.map((g) => (
                <div key={g}>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-navy/40">
                    {g}
                  </p>
                  <ul className="space-y-0.5">
                    {SECTIONS.filter((s) => s.groupe === g).map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => scrollTo(s.id)}
                          className="w-full rounded px-2 py-1 text-left text-navy/70 hover:bg-navy/5 hover:text-navy"
                        >
                          {s.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </aside>

        {/* CONTENU : tous les blocs fermés, avec ancres */}
        <div className="space-y-5 sm:space-y-6 min-w-0">
          <div id="soutien" className="scroll-mt-28">
            <BlocSoutien reponses={reponses} sector={sector} />
          </div>
          <div id="strategie" className="scroll-mt-28">
            <BlocStrategie reponses={reponses} company={company} sector={sector} />
          </div>
          <div id="procedures" className="scroll-mt-28">
            <BlocProcedureRecommandee reponses={reponses} company={company} sector={sector} />
          </div>
          <div id="timeline" className="scroll-mt-28">
            <BlocTimeline reponses={reponses} company={company} />
          </div>
          <div id="cessation" className="scroll-mt-28">
            <BlocCessationDecompte reponses={reponses} />
          </div>
          <div id="rappels" className="scroll-mt-28">
            <BlocRappels reponses={reponses} />
          </div>
          <div id="tresorerie" className="scroll-mt-28">
            <BlocTresorerie reponses={reponses} />
          </div>
          <div id="calendrier" className="scroll-mt-28">
            <BlocCalendrier reponses={reponses} company={company} sector={sector} />
          </div>
          <div id="plan" className="scroll-mt-28">
            <BlocPlanAction reponses={reponses} company={company} sector={sector} />
          </div>
          <div id="checklist" className="scroll-mt-28">
            <BlocChecklist reponses={reponses} company={company} sector={sector} />
          </div>
          <div id="famille" className="scroll-mt-28">
            <BlocProtectionFamille reponses={reponses} company={company} sector={sector} />
          </div>
          <div id="patrimoine" className="scroll-mt-28">
            <BlocPatrimoine reponses={reponses} company={company} />
          </div>
          <div id="cautions" className="scroll-mt-28">
            <BlocAuditCaution reponses={reponses} />
          </div>
          <div id="consequences" className="scroll-mt-28">
            <BlocConsequencesPerso reponses={reponses} />
          </div>
          <div id="aides" className="scroll-mt-28">
            <BlocAides reponses={reponses} company={company} sector={sector} />
          </div>
          <div id="ccsf" className="scroll-mt-28">
            <BlocCCSF reponses={reponses} company={company} />
          </div>
          <div id="bail" className="scroll-mt-28">
            <BlocBailCommercial reponses={reponses} company={company} sector={sector} />
          </div>
          <div id="obligations" className="scroll-mt-28">
            <BlocObligations reponses={reponses} company={company} seuils={seuils} />
          </div>
          <div id="organismes" className="scroll-mt-28">
            <BlocOrganismes groupes={groupes} />
          </div>
          <div id="prescription" className="scroll-mt-28">
            <BlocPrescription reponses={reponses} company={company} companyAge={companyAge} seuils={seuils} />
          </div>
          <div id="alertes" className="scroll-mt-28">
            <BlocAlertes bodacc={bodacc} infogreffe={infogreffe} />
          </div>
        </div>
      </div>
    </div>
  );
}
