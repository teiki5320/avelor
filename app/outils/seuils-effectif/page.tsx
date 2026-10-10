'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

/**
 * Vérificateur de seuils d'effectif.
 * Indique les obligations sociales et fiscales déclenchées selon le
 * nombre de salariés. Loi PACTE 2019 + Code du travail.
 */

interface Seuil {
  seuil: number;
  nom: string;
  description: string;
  reference: string;
  delai?: string;
  badge?: 'social' | 'fiscal' | 'sante' | 'finance';
}

const SEUILS: Seuil[] = [
  { seuil: 1, nom: 'Premier salarié', description: 'Affiliation URSSAF, médecine du travail, DSN mensuelle, registre du personnel, affichages obligatoires.', reference: 'C. trav. L1221-13', badge: 'social' },
  { seuil: 11, nom: 'Élection du CSE (Comité Social et Économique)', description: 'CSE obligatoire dans toute entreprise atteignant 11 salariés pendant 12 mois consécutifs. Informations-consultations obligatoires.', reference: 'C. trav. L2311-2', delai: 'Élection dans les 90 j suivant le dépassement', badge: 'social' },
  { seuil: 20, nom: 'Contribution AGEFIPH', description: 'Obligation d\'emploi de 6 % de travailleurs handicapés (RQTH). À défaut : contribution AGEFIPH proportionnelle.', reference: 'C. trav. L5212-1', badge: 'social' },
  { seuil: 20, nom: 'Règlement intérieur obligatoire', description: 'À partir de 50 salariés (auparavant 20 puis 11). Définit discipline, santé, sécurité.', reference: 'C. trav. L1311-2', badge: 'social' },
  { seuil: 50, nom: 'CSE renforcé', description: 'Le CSE acquiert des prérogatives élargies : commissions obligatoires (santé/sécurité, formation, économique), expert-comptable, accès aux comptes.', reference: 'C. trav. L2312-8', badge: 'social' },
  { seuil: 50, nom: 'Participation obligatoire', description: 'Réserve spéciale de participation aux résultats de l\'entreprise. Versement en avril de l\'année N+1.', reference: 'C. trav. L3322-1', badge: 'finance' },
  { seuil: 50, nom: 'Plan de Sauvegarde de l\'Emploi (PSE)', description: 'Obligatoire si licenciement éco ≥ 10 salariés sur 30 jours. Validation/homologation DREETS.', reference: 'C. trav. L1233-61', delai: 'Procédure 2 à 3 mois', badge: 'social' },
  { seuil: 50, nom: 'Document unique RPS', description: 'Évaluation et plan d\'action sur les risques psychosociaux. Obligation depuis 2002, renforcée à 50 sal.', reference: 'C. trav. L4121-3', badge: 'sante' },
  { seuil: 50, nom: 'Référent harcèlement', description: 'Désignation d\'un référent harcèlement sexuel par le CSE et par l\'employeur.', reference: 'C. trav. L1153-5-1', badge: 'sante' },
  { seuil: 250, nom: 'BDESE complète', description: 'Base de données économiques, sociales et environnementales : information CSE structurée et permanente.', reference: 'C. trav. L2312-21', badge: 'social' },
  { seuil: 250, nom: 'Index égalité professionnelle', description: 'Publication obligatoire de l\'index égalité femmes-hommes, transmission à la DREETS chaque 1er mars.', reference: 'C. trav. L1142-8', badge: 'social' },
  { seuil: 250, nom: 'PME ≤ 250 : seuil européen', description: 'En dessous : éligibilité maintenue aux aides PME (BPI, dispositif JEI/CIR renforcés, FEDER).', reference: 'Recommandation CE 2003/361', badge: 'finance' },
  { seuil: 400, nom: 'CODEFI → CIRI', description: 'CODEFI (Comité Départemental) compétent pour < 400 salariés. Au-delà : CIRI (Comité Interministériel).', reference: 'Décret 82-307', badge: 'finance' },
  { seuil: 500, nom: 'CSRD / Bilan carbone', description: 'Obligation de publier un bilan carbone (BEGES) + reporting durabilité (CSRD pour les grandes entreprises).', reference: 'C. env. L229-25', badge: 'sante' },
  { seuil: 1000, nom: 'Congé de reclassement obligatoire', description: 'Remplace le CSP en cas de licenciement économique. Durée 4 à 12 mois, rémunéré par l\'employeur.', reference: 'C. trav. L1233-71', delai: 'Pendant la durée du congé', badge: 'social' },
];

const BADGE_COLORS: Record<NonNullable<Seuil['badge']>, string> = {
  social: 'bg-bleu/10 text-bleu-fonce',
  fiscal: 'bg-jaune/10 text-jaune',
  sante: 'bg-vert/10 text-vert',
  finance: 'bg-rouge/10 text-rouge',
};

const BADGE_LABEL: Record<NonNullable<Seuil['badge']>, string> = {
  social: 'Social',
  fiscal: 'Fiscal',
  sante: 'Santé/RPS',
  finance: 'Financier',
};

export default function SeuilsEffectifPage() {
  const [effectif, setEffectif] = useState(15);

  const declenches = useMemo(
    () => SEUILS.filter((s) => effectif >= s.seuil),
    [effectif]
  );

  const prochainSeuil = useMemo(
    () => SEUILS.find((s) => s.seuil > effectif),
    [effectif]
  );

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Identifier les obligations sociales selon votre effectif',
    description: 'Saisissez votre effectif et l\'outil liste les obligations applicables (CSE, PSE, participation, AGEFIPH…).',
    step: [
      { '@type': 'HowToStep', name: 'Saisir l\'effectif', text: 'Indiquez le nombre total de salariés en équivalents temps plein.' },
      { '@type': 'HowToStep', name: 'Consulter les obligations', text: 'L\'outil liste les seuils franchis et les obligations déclenchées avec références légales.' },
    ],
  };

  return (
    <section className="mx-auto max-w-4xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />

      <Link href="/outils" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Vérificateur de seuils d&apos;effectif
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Saisissez votre effectif et découvrez les obligations sociales,
        fiscales et de santé au travail qui s&apos;appliquent.
      </p>

      <div className="glass mt-8 p-6 sm:p-8">
        <label className="block text-sm text-navy/80">
          Effectif (équivalents temps plein, moyenne sur 12 mois)
          <input
            type="number"
            min={0}
            value={effectif}
            onChange={(e) => setEffectif(Math.max(0, Number(e.target.value) || 0))}
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-3 text-2xl font-display"
          />
          <span className="mt-1 block text-[11px] text-navy/55">
            Calcul URSSAF : moyenne arithmétique des effectifs mensuels. Seuils franchis = obligation après 12 mois consécutifs.
          </span>
        </label>

        {prochainSeuil && (
          <div className="mt-5 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-jaune">Prochain seuil</p>
            <p className="mt-1 text-sm text-navy/80">
              À <strong>{prochainSeuil.seuil} salariés</strong> ({prochainSeuil.seuil - effectif} de plus) :{' '}
              <strong>{prochainSeuil.nom}</strong> — {prochainSeuil.description}
            </p>
          </div>
        )}

        <div className="mt-6">
          <p className="font-display text-lg text-navy">
            {declenches.length} obligation{declenches.length > 1 ? 's' : ''} déclenchée{declenches.length > 1 ? 's' : ''}
          </p>
          <div className="mt-3 space-y-3">
            {declenches.length === 0 && (
              <p className="rounded-xl bg-vert/5 p-4 text-sm text-navy/70">
                Aucune obligation collective spécifique à votre effectif. Les obligations de base (sécurité, document unique, médecine du travail) s&apos;appliquent dès le 1er salarié.
              </p>
            )}
            {declenches.map((s, i) => (
              <div key={i} className="glass-soft rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-navy">
                      <span className="mr-2 text-navy/40">≥ {s.seuil}</span>
                      {s.nom}
                    </p>
                    <p className="mt-1 text-sm text-navy/70">{s.description}</p>
                    <p className="mt-1 text-[11px] text-navy/50">
                      {s.reference}{s.delai ? ` · ${s.delai}` : ''}
                    </p>
                  </div>
                  {s.badge && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${BADGE_COLORS[s.badge]}`}>
                      {BADGE_LABEL[s.badge]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">À savoir</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            <strong>Calcul effectif</strong> : moyenne des effectifs mensuels sur 12 mois. CDD, intérimaires, mis à disposition comptés au prorata. Apprentis et contrats aidés exclus.
          </li>
          <li>
            <strong>Franchissement</strong> : un seuil n&apos;est franchi qu&apos;après dépassement pendant 12 mois consécutifs (loi PACTE 2019, art. L130-1 CSS).
          </li>
          <li>
            <strong>Gel des seuils</strong> : en cas de baisse en dessous du seuil pendant 12 mois consécutifs, les obligations sont suspendues.
          </li>
          <li>
            <strong>En procédure collective</strong> : le CSP s&apos;impose quel que soit l&apos;effectif. Le PSE reste obligatoire ≥ 50 sal + 10 licenciements.
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Sources : Code du travail (CSE, PSE, participation, BDESE, index égalité, congé de reclassement) ; loi PACTE n° 2019-486 du 22 mai 2019 (lissage des seuils) ; CSS art. L130-1.
      </p>
    </section>
  );
}
