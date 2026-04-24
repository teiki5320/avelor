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

const URGENCE_STYLES: Record<string, string> = {
  critique: 'bg-rouge/10 border-rouge/30 text-rouge',
  elevee: 'bg-jaune/15 border-jaune/40 text-jaune',
  normale: 'bg-bleu/10 border-bleu/30 text-bleu-fonce',
};

function niveauSituation(situation: string): { label: string; urgence: 'critique' | 'elevee' | 'normale'; message: string } {
  switch (situation) {
    case 'assignation':
      return { label: 'Urgence critique', urgence: 'critique', message: 'Audience à venir' };
    case 'redressement':
      return { label: 'Urgence élevée', urgence: 'elevee', message: '45 j pour déclarer' };
    case 'tresorie':
      return { label: 'Tension identifiée', urgence: 'normale', message: 'Agir maintenant' };
    default:
      return { label: 'Prévention', urgence: 'normale', message: 'Le bon moment' };
  }
}

function capSituation(reponses: { vente?: string; situation?: string; moral?: string }): string {
  if (reponses.vente === 'oui') return 'Céder l\'entreprise';
  if (reponses.situation === 'redressement') return 'Liquider ou céder proprement';
  if (reponses.situation === 'assignation') return 'Défendre en urgence';
  if (reponses.situation === 'tresorie') return 'Sauvegarder';
  return 'Restructurer en interne';
}

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
  const niveau = niveauSituation(reponses.situation);
  const cap = capSituation(reponses);
  const santeSecteur = sector.santeSecteur;

  return (
    <div className="space-y-5 sm:space-y-6">
      <IdentiteCard company={company} />

      {/* KPI BAND */}
      <section className="grid gap-3 sm:grid-cols-4">
        <div className={`rounded-2xl border p-4 ${URGENCE_STYLES[niveau.urgence]}`}>
          <p className="text-[10px] uppercase tracking-wide opacity-70">Priorité</p>
          <p className="mt-1 font-display text-lg">{niveau.label}</p>
          <p className="mt-0.5 text-xs opacity-80">{niveau.message}</p>
        </div>
        <div className="rounded-2xl border border-bleu/20 bg-bleu/5 p-4">
          <p className="text-[10px] uppercase tracking-wide text-navy/55">Cap recommandé</p>
          <p className="mt-1 font-display text-lg text-bleu-fonce">{cap}</p>
          <p className="mt-0.5 text-xs text-navy/60">Détail dans « Stratégie »</p>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white/70 p-4">
          <p className="text-[10px] uppercase tracking-wide text-navy/55">Effectif</p>
          <p className="mt-1 font-display text-lg text-navy">
            {reponses.effectif === 'independant' ? 'Seul·e' : `~ ${seuils.approx} sal.`}
          </p>
          <p className="mt-0.5 text-xs text-navy/60">
            {seuils.cse ? 'Seuil CSE atteint' : 'Pas d\'obligation CSE'}
          </p>
        </div>
        <div
          className={`rounded-2xl border p-4 ${
            santeSecteur?.niveau === 'crise'
              ? 'border-rouge/30 bg-rouge/5 text-rouge'
              : santeSecteur?.niveau === 'tendu'
              ? 'border-jaune/30 bg-jaune/5 text-jaune'
              : 'border-vert/30 bg-vert/5 text-vert'
          }`}
        >
          <p className="text-[10px] uppercase tracking-wide opacity-70">Santé secteur</p>
          <p className="mt-1 font-display text-lg">
            {santeSecteur?.niveau === 'crise' ? 'Secteur en crise' : santeSecteur?.niveau === 'tendu' ? 'Secteur tendu' : 'Secteur stable'}
          </p>
          <p className="mt-0.5 text-xs opacity-80">{sector.label}</p>
        </div>
      </section>

      <BlocSanteSecteur sector={sector} />
      <AlertesBand alertes={alertes} />

      {/* HERO : Stratégie */}
      <BlocStrategie reponses={reponses} company={company} sector={sector} />

      {/* SOUTIEN (toujours visible en second plan émotionnel) */}
      <BlocSoutien reponses={reponses} sector={sector} />

      {/* GROUPE 1 : Urgences et échéances */}
      <h2 className="pt-4 font-display text-sm uppercase tracking-wider text-navy/50">
        Échéances &amp; urgences
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <BlocCessationDecompte reponses={reponses} />
        <BlocRappels reponses={reponses} />
        <BlocTimeline reponses={reponses} company={company} />
        <BlocTresorerie reponses={reponses} />
      </div>

      {/* GROUPE 2 : Action */}
      <h2 className="pt-4 font-display text-sm uppercase tracking-wider text-navy/50">
        À faire
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <BlocPlanAction reponses={reponses} company={company} sector={sector} />
        <BlocChecklist reponses={reponses} company={company} sector={sector} />
        <BlocCalendrier reponses={reponses} company={company} sector={sector} />
        <BlocProcedureRecommandee reponses={reponses} company={company} sector={sector} />
      </div>

      {/* GROUPE 3 : Patrimoine */}
      <h2 className="pt-4 font-display text-sm uppercase tracking-wider text-navy/50">
        Patrimoine &amp; famille
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <BlocProtectionFamille reponses={reponses} company={company} sector={sector} />
        <BlocPatrimoine reponses={reponses} company={company} />
        <BlocAuditCaution reponses={reponses} />
        <BlocConsequencesPerso reponses={reponses} />
      </div>

      {/* GROUPE 4 : Aides & leviers */}
      <h2 className="pt-4 font-display text-sm uppercase tracking-wider text-navy/50">
        Aides &amp; leviers
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <BlocAides reponses={reponses} company={company} sector={sector} />
        <BlocCCSF reponses={reponses} company={company} />
        <BlocBailCommercial reponses={reponses} company={company} sector={sector} />
        <BlocObligations reponses={reponses} company={company} seuils={seuils} />
      </div>

      {/* GROUPE 5 : Ressources */}
      <h2 className="pt-4 font-display text-sm uppercase tracking-wider text-navy/50">
        Ressources
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <BlocOrganismes groupes={groupes} />
        <BlocPrescription reponses={reponses} company={company} companyAge={companyAge} seuils={seuils} />
        <BlocAlertes bodacc={bodacc} infogreffe={infogreffe} />
      </div>
    </div>
  );
}
