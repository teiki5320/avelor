'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

/**
 * APLD-R — Activité Partielle Longue Durée Rebond.
 * Nouveau dispositif issu de la loi de finances 2025 (article 193) et du
 * décret n° 2025-338 du 11 avril 2025 — successeur de l'APLD « Covid »
 * éteinte fin 2022. Permet une baisse durable de l'horaire de travail
 * en contrepartie d'engagements de maintien de l'emploi et de formation.
 *
 * S'affiche pour les employeurs (effectif === 'salaries') confrontés à
 * une baisse durable d'activité (situation tresorie / redressement).
 */
export default function BlocAPLDR() {
  const { reponses, sector } = useFiche();
  if (reponses.effectif !== 'salaries') return null;
  // Pertinent si baisse d'activité durable
  const pertinent =
    reponses.situation === 'tresorie' ||
    reponses.situation === 'redressement' ||
    reponses.saisonnalite === 'oui';
  if (!pertinent) return null;

  return (
    <BlocAccordeon
      icone="📉"
      titre="APLD-R — Activité Partielle Longue Durée Rebond (2025)"
      soustitre="Baisse d'horaire jusqu'à 40 % sur 24 mois, en échange d'engagements emploi/formation"
    >
      <p className="text-sm text-navy/80">
        L&apos;<strong>APLD-R</strong>, créée par la loi de finances 2025
        et le décret du 11 avril 2025, succède à l&apos;APLD « Covid » et
        permet à une entreprise confrontée à une <strong>baisse durable
        d&apos;activité</strong> (non conjoncturelle) de réduire
        l&apos;horaire de travail tout en conservant les salariés. Le
        dispositif est plus avantageux que l&apos;activité partielle
        classique et particulièrement adapté aux secteurs en transition
        (industrie, BTP, HCR, automobile).
      </p>

      {/* Conditions d'éligibilité */}
      <div className="mt-5 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Conditions d&apos;éligibilité
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Accord collectif</strong> d&apos;établissement,
            d&apos;entreprise ou de branche ; ou{' '}
            <strong>document unilatéral</strong> de l&apos;employeur sur
            le fondement d&apos;un accord de branche étendu.
          </li>
          <li>
            <strong>Diagnostic préalable</strong> de la situation économique
            (baisse durable, non simplement conjoncturelle).
          </li>
          <li>
            <strong>Engagements de maintien de l&apos;emploi</strong> sur
            le périmètre concerné — en principe le périmètre total de
            l&apos;entreprise.
          </li>
          <li>
            <strong>Engagements de formation</strong> (CPF, FNE-Formation,
            POE, VAE) pour les salariés placés en APLD-R.
          </li>
        </ul>
      </div>

      {/* Bénéfices */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-vert/30 bg-vert/5 p-4">
          <p className="font-display text-base text-vert">Pour l&apos;entreprise</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-navy/80">
            <li>Allocation versée par l&apos;État : <strong>60 % du salaire horaire brut</strong> de référence (vs 36 % en activité partielle classique).</li>
            <li>Plafond : 4,5 SMIC.</li>
            <li>Durée : <strong>24 mois maximum</strong> sur une période de 36 mois consécutifs.</li>
            <li>Plancher allocation : 9,40 €/h en 2025.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-vert/30 bg-vert/5 p-4">
          <p className="font-display text-base text-vert">Pour les salariés</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-navy/80">
            <li>Indemnité : <strong>70 % du salaire brut</strong> (≈ 84 % du net) versée par l&apos;employeur, qui se fait rembourser.</li>
            <li>Baisse d&apos;horaire <strong>plafonnée à 40 %</strong> de la durée légale (jusqu&apos;à 50 % sur autorisation préfectorale).</li>
            <li>Maintien des cotisations retraite et chômage sur la base de l&apos;activité antérieure.</li>
            <li>Accès renforcé à la formation pendant les heures chômées.</li>
          </ul>
        </div>
      </div>

      {/* Saisonnalité */}
      {reponses.saisonnalite === 'oui' && (
        <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-4 text-sm text-navy/80">
          <p className="font-display text-base text-jaune">
            Vous êtes en activité saisonnière
          </p>
          <p className="mt-2">
            L&apos;APLD-R peut couvrir une période creuse longue si elle
            est <strong>récurrente et durable</strong> (pas seulement la
            morte-saison habituelle, déjà couverte par l&apos;activité
            partielle classique). Idéal pour les{' '}
            {sector.secteur === 'hotellerie' ? 'HCR' : sector.secteur === 'agriculture' ? 'exploitations agricoles' : 'établissements touristiques'} confrontés à
            une baisse durable hors-saison liée à un changement structurel
            (fréquentation, climat, énergie).
          </p>
        </div>
      )}

      {/* Procédure */}
      <div className="mt-4 rounded-2xl border border-navy/15 bg-white/60 p-4 text-sm text-navy/80">
        <p className="font-display text-base text-navy">Procédure</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5">
          <li>
            Négociation d&apos;un <strong>accord collectif</strong> avec les
            organisations syndicales représentatives (ou consultation CSE
            si moins de 50 salariés sans délégué syndical).
          </li>
          <li>
            <strong>Dépôt de l&apos;accord</strong> ou du document
            unilatéral à la <strong>DREETS</strong> (téléprocédure dédiée).
          </li>
          <li>
            <strong>Validation</strong> de l&apos;accord (15 jours) ou{' '}
            <strong>homologation</strong> du document unilatéral (21 jours).
            Silence vaut acceptation.
          </li>
          <li>
            Mise en place pour <strong>6 mois renouvelables</strong>, avec
            bilan tous les semestres et possibilité d&apos;ajuster.
          </li>
        </ol>
      </div>

      {/* Contacts */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">DREETS — Direction du Travail</p>
          <p className="mt-1 text-xs text-navy/60">Validation / homologation de l&apos;accord, suivi des engagements</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="https://www.travail-emploi.gouv.fr/le-ministere-en-action/dreets"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              🌐 Trouver ma DREETS
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">Téléprocédure activité partielle</p>
          <p className="mt-1 text-xs text-navy/60">Portail unique de dépôt et de suivi</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="https://activitepartielle.emploi.gouv.fr"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              🌐 activitepartielle.emploi.gouv.fr
            </a>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : loi n° 2025-127 du 14 février 2025 de finances pour 2025
        (art. 193) ; décret n° 2025-338 du 11 avril 2025 relatif à
        l&apos;APLD-R ; Code du travail art. L5122-1 et s. ; Questions-Réponses
        DGEFP de mai 2025.
      </p>
    </BlocAccordeon>
  );
}
