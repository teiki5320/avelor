import { notFound } from 'next/navigation';
import IdentiteCard from '@/components/fiche/IdentiteCard';
import AlertesBand from '@/components/fiche/AlertesBand';
import BlocSoutien from '@/components/fiche/BlocSoutien';
import BlocCalendrier from '@/components/fiche/BlocCalendrier';
import BlocChecklist from '@/components/fiche/BlocChecklist';
import BlocOrganismes from '@/components/fiche/BlocOrganismes';
import BlocAlertes from '@/components/fiche/BlocAlertes';
import BlocPrescription from '@/components/fiche/BlocPrescription';
import BlocPlanAction from '@/components/fiche/BlocPlanAction';
import BlocAidesPersonnalisees from '@/components/fiche/BlocAides';
import BlocProtectionFamille from '@/components/fiche/BlocProtectionFamille';
import BlocProcedureRecommandee from '@/components/fiche/BlocProcedureRecommandee';
import SaveBanner from '@/components/fiche/SaveBanner';
import ExportPDF from '@/components/fiche/ExportPDF';
import StoreCompanyData from '@/components/fiche/StoreCompanyData';
import { getFicheByToken } from '@/lib/supabase';
import { fetchSirene } from '@/lib/sirene';
import { fetchBodacc, fetchInfogreffeSignals, computeAlertes } from '@/lib/bodacc';
import { searchAvocats } from '@/lib/googlePlaces';
import { buildOrganismes, getDepartement, OrganismeCard } from '@/lib/organismes';
import { getSectorInfo, getCompanyAge, getEffectifSeuils } from '@/lib/secteur';
import type { CompanyData, Reponses } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { token: string };
  searchParams: { d?: string };
}

interface FicheData {
  token: string;
  siret: string;
  reponses: Reponses;
  company_data: CompanyData;
}

async function loadFiche(
  token: string,
  d?: string
): Promise<FicheData | null> {
  if (token === 'local' && d) {
    try {
      const decoded = Buffer.from(d, 'base64').toString('utf8');
      const json = JSON.parse(decoded);
      const siret: string = (json.siret ?? '').replace(/\D/g, '');
      if (!/^\d{14}$/.test(siret)) return null;
      const company_data = await fetchSirene(siret);
      return {
        token: 'local',
        siret,
        reponses: json.reponses as Reponses,
        company_data,
      };
    } catch {
      return null;
    }
  }

  const rec = await getFicheByToken(token);
  if (!rec) return null;
  let company_data = rec.company_data as CompanyData;
  if (!company_data?.siret) {
    company_data = await fetchSirene(rec.siret);
  }
  return {
    token,
    siret: rec.siret,
    reponses: rec.reponses as Reponses,
    company_data,
  };
}

export default async function FichePage({ params, searchParams }: PageProps) {
  const data = await loadFiche(params.token, searchParams.d);
  if (!data) return notFound();

  const { token, siret, reponses, company_data } = data;

  const [bodacc, infogreffe, avocatsRaw] = await Promise.all([
    fetchBodacc(siret),
    fetchInfogreffeSignals(siret),
    searchAvocats(company_data.ville || company_data.departement),
  ]);

  const alertes = computeAlertes(bodacc, infogreffe, reponses.situation);
  const dep = getDepartement(company_data.departement);

  const avocats: OrganismeCard[] = avocatsRaw.map((p) => ({
    nom: p.name,
    type: 'Avocat · droit des entreprises en difficulté',
    adresse: p.address,
    note: p.rating,
    avis: p.reviews,
    telephone: p.phone,
    mapsUrl: p.mapsUrl,
  }));

  const sector = getSectorInfo(company_data);
  const companyAge = getCompanyAge(company_data.dateCreation);
  const seuils = getEffectifSeuils(company_data.effectif);
  const groupes = buildOrganismes(dep, reponses, avocats);

  const moralFragile = reponses.moral === 'epuise' || reponses.moral === 'perdu';

  return (
    <section className="mx-auto max-w-3xl space-y-5 px-5 pb-24 sm:space-y-6">
      {/* Print-only header */}
      <div className="print-header hidden">
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '22pt', letterSpacing: '0.05em' }}>AVELOR</p>
        <p style={{ fontSize: '10pt', color: '#666', marginTop: '4px' }}>
          Fiche confidentielle · {company_data.nom} · SIRET {company_data.siret}
        </p>
      </div>

      <div className="no-print flex items-center justify-between">
        <ExportPDF companyName={company_data.nom} />
      </div>

      {moralFragile && (
        <div
          role="note"
          className="rounded-2xl border border-vert/30 bg-vert/10 p-5 text-sm text-navy"
        >
          <p className="font-display text-base text-vert sm:text-lg">
            Nous avons vu votre réponse. Merci de votre honnêteté.
          </p>
          <p className="mt-2">
            APESA est disponible dès aujourd&apos;hui — gratuitement, en
            confidentialité.{' '}
            <a
              href="https://apesa.fr"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-vert underline underline-offset-4"
            >
              apesa.fr
            </a>
          </p>
        </div>
      )}

      <StoreCompanyData company={company_data} token={token} reponses={reponses} />

      {token !== 'local' && <SaveBanner token={token} />}

      <IdentiteCard company={company_data} />
      <AlertesBand alertes={alertes} />

      <BlocSoutien reponses={reponses} sector={sector} />
      <BlocProcedureRecommandee reponses={reponses} company={company_data} sector={sector} />
      <BlocCalendrier reponses={reponses} company={company_data} sector={sector} />
      <BlocChecklist reponses={reponses} company={company_data} sector={sector} />
      <BlocPlanAction reponses={reponses} company={company_data} sector={sector} />
      <BlocProtectionFamille reponses={reponses} company={company_data} sector={sector} />
      <BlocAidesPersonnalisees reponses={reponses} company={company_data} sector={sector} />
      <BlocOrganismes groupes={groupes} />
      <BlocPrescription reponses={reponses} company={company_data} companyAge={companyAge} seuils={seuils} />
      <BlocAlertes bodacc={bodacc} infogreffe={infogreffe} />

      <p className="pt-6 text-center text-xs text-navy/45">
        Cette fiche ne remplace pas un conseil personnalisé. Elle vous aide à
        y voir clair et à mobiliser les bons interlocuteurs.
      </p>

      {/* Print-only footer */}
      <div className="print-footer hidden">
        <p>AVELOR · Accompagnement gratuit, confidentiel, sans jugement</p>
        <p>Cette fiche ne remplace pas un conseil personnalisé.</p>
      </div>
    </section>
  );
}
