'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import type {
  Reponses, Situation, Probleme, Effectif, Moral,
  Caution, RegimeMatrimonial, Patrimoine, VenteEnvisagee,
  MontantDettes, AgeDirigeant, Franchise, AntecedentsBodacc,
  PgeEnCours, Rqth, ConjointStatut, CoGerants, Saisonnalite, Nationalite,
} from '@/lib/types';

interface Choice<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

interface SlideConfig {
  title: string;
  subtitle: string;
  key: keyof Reponses;
  choices: Choice<string>[];
  skippable?: boolean;
}

const SITUATIONS: Choice<Situation>[] = [
  { value: 'prevention', label: 'Je sens que ça se dégrade', hint: 'Trésorerie qui s’érode, doute' },
  { value: 'tresorie', label: 'Je ne peux plus faire face à certaines dépenses', hint: 'Retards, relances' },
  { value: 'redressement', label: 'Je suis en cessation de paiements', hint: 'Plus de trésorerie disponible' },
  { value: 'assignation', label: 'J’ai reçu une assignation', hint: 'Courrier du tribunal ou huissier' },
];

const PROBLEMES: Choice<Probleme>[] = [
  { value: 'urssaf', label: 'Dettes URSSAF', hint: 'Cotisations sociales' },
  { value: 'fournisseurs', label: 'Dettes fournisseurs', hint: 'Factures impayées' },
  { value: 'banque', label: 'Crédit bancaire', hint: 'Remboursement ou découvert' },
  { value: 'impots', label: 'Impôts impayés', hint: 'TVA, IS ou autres' },
];

const EFFECTIFS: Choice<Effectif>[] = [
  { value: 'independant', label: 'Non, je suis seul·e' },
  { value: 'salaries', label: 'Oui, moins de 5' },
  { value: 'salaries', label: 'Oui, 5 ou plus' },
];

const MORAUX: Choice<Moral>[] = [
  { value: 'combatif', label: 'Stressé mais combatif', hint: 'Vous gardez le cap' },
  { value: 'epuise', label: 'Épuisé, j’ai besoin d’aide', hint: 'Le poids est lourd à porter' },
  { value: 'perdu', label: 'Je ne sais plus quoi faire', hint: 'Tout se mélange' },
];

const CAUTIONS: Choice<Caution>[] = [
  { value: 'oui', label: 'Oui, j’ai signé des cautions', hint: 'Garantie personnelle sur un prêt, un bail, etc.' },
  { value: 'non', label: 'Non, aucune caution personnelle' },
  { value: 'ne-sais-pas', label: 'Je ne suis pas sûr·e', hint: 'On vérifiera ensemble' },
];

const REGIMES: Choice<RegimeMatrimonial>[] = [
  { value: 'communaute', label: 'Communauté de biens (régime par défaut)', hint: 'Les biens du couple sont communs' },
  { value: 'separation', label: 'Séparation de biens', hint: 'Chacun ses biens' },
  { value: 'non-marie', label: 'Je ne suis pas marié·e', hint: 'Célibataire, pacsé·e ou concubin·e' },
  { value: 'ne-sais-pas', label: 'Je ne sais pas', hint: 'Un notaire peut vérifier' },
];

const PATRIMOINES: Choice<Patrimoine>[] = [
  { value: 'proprietaire', label: 'Je suis propriétaire de ma résidence', hint: 'Maison ou appartement à votre nom' },
  { value: 'locataire', label: 'Je suis locataire', hint: 'Pas de bien immobilier personnel' },
];

const VENTES: Choice<VenteEnvisagee>[] = [
  { value: 'oui', label: 'Oui, je suis prêt·e à vendre', hint: 'Cession totale ou partielle' },
  { value: 'peut-etre', label: 'Peut-être, si c’est la meilleure option', hint: 'Je veux d’abord comprendre' },
  { value: 'non', label: 'Non, je veux garder mon entreprise', hint: 'Chercher d’autres solutions' },
];

const MONTANTS_DETTES: Choice<MontantDettes>[] = [
  { value: 'moins-10k', label: 'Moins de 10 000 €' },
  { value: '10k-50k', label: 'Entre 10 et 50 000 €' },
  { value: '50k-200k', label: 'Entre 50 et 200 000 €' },
  { value: '200k-1m', label: 'Entre 200 000 € et 1 million' },
  { value: 'plus-1m', label: 'Plus d’1 million' },
];

const AGES_DIRIGEANT: Choice<AgeDirigeant>[] = [
  { value: 'moins-25', label: 'Moins de 25 ans' },
  { value: '25-50', label: 'Entre 25 et 50 ans' },
  { value: '50-60', label: 'Entre 50 et 60 ans' },
  { value: 'plus-60', label: 'Plus de 60 ans' },
];

const FRANCHISES: Choice<Franchise>[] = [
  { value: 'oui', label: 'Oui, contrat de franchise', hint: 'Vous exploitez une enseigne sous contrat' },
  { value: 'non', label: 'Non, indépendant', hint: 'Activité sans contrat de franchise' },
];

const ANTECEDENTS: Choice<AntecedentsBodacc>[] = [
  { value: 'non', label: 'Non, jamais' },
  { value: 'oui', label: 'Oui, déjà eu', hint: 'Procédure collective antérieure (sauvegarde, redressement, liquidation)' },
  { value: 'ne-sais-pas', label: 'Je ne suis pas sûr·e' },
];

const PGE_EN_COURS: Choice<PgeEnCours>[] = [
  { value: 'oui', label: 'Oui, j’ai un PGE en cours', hint: 'Prêt Garanti par l’État (Covid 2020-2021)' },
  { value: 'non', label: 'Non, pas de PGE' },
  { value: 'ne-sais-pas', label: 'Je ne sais pas' },
];

const RQTH: Choice<Rqth>[] = [
  { value: 'oui', label: 'Oui, RQTH ou handicap reconnu', hint: 'Permet de mobiliser AGEFIPH, Cap Emploi, MDPH (consentement RGPD)' },
  { value: 'non', label: 'Non / je préfère ne pas répondre' },
];

const CONJOINT: Choice<ConjointStatut>[] = [
  { value: 'salarie', label: 'Mon conjoint·e est salarié·e de la société', hint: 'Statut conjoint salarié — protections licenciement éco' },
  { value: 'collaborateur', label: 'Mon conjoint·e est conjoint collaborateur', hint: 'Inscrit au RCS/RM, cotise sans rémunération' },
  { value: 'associe', label: 'Mon conjoint·e est associé·e', hint: 'Détient des parts sociales' },
  { value: 'aucun', label: 'Mon conjoint·e n’a pas de rôle dans la société' },
  { value: 'sans-conjoint', label: 'Je n’ai pas de conjoint·e' },
];

const CO_GERANTS: Choice<CoGerants>[] = [
  { value: 'oui', label: 'Oui, il y a plusieurs gérants/dirigeants', hint: 'Solidarité fiscale et sociale possible (art. L267 LPF, L243-6-2 CSS)' },
  { value: 'non', label: 'Non, je suis seul·e' },
  { value: 'sans-objet', label: 'Sans objet (entrepreneur individuel)' },
];

const SAISONNALITE: Choice<Saisonnalite>[] = [
  { value: 'oui', label: 'Oui, activité saisonnière', hint: 'HCR, agri, tourisme — impacte activité partielle et trésorerie' },
  { value: 'non', label: 'Non, activité régulière toute l’année' },
];

const NATIONALITE: Choice<Nationalite>[] = [
  { value: 'fr-ue-eee-suisse', label: 'France / UE / EEE / Suisse', hint: 'Pas d’impact titre de séjour' },
  { value: 'hors-ue', label: 'Hors UE', hint: 'Conséquences sur Passeport Talent, carte de séjour entrepreneur, OFII' },
  { value: 'sans-reponse', label: 'Je préfère ne pas répondre', hint: 'Donnée non partagée sans votre accord (RGPD)' },
];

const TOTAL_SLIDES = 18;

interface Props {
  siret: string;
}

const STORAGE_KEY = 'avelor_questionnaire';

function loadSaved(siret: string): { step: number; answers: Partial<Reponses> } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.siret !== siret) return null;
    return { step: saved.step ?? 0, answers: saved.answers ?? {} };
  } catch {
    return null;
  }
}

function saveDraft(siret: string, step: number, answers: Partial<Reponses>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ siret, step, answers, ts: Date.now() }));
  } catch {}
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export default function Questionnaire({ siret }: Props) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Partial<Reponses>>({});
  const [restored, setRestored] = useState(false);
  // Verrou anti double-clic pendant l'animation de transition (280 ms).
  // Un useRef évite un re-render et permet une vérification synchrone.
  const lockedRef = useRef(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const saved = loadSaved(siret);
    if (saved && saved.step > 0 && saved.step < TOTAL_SLIDES) {
      setStep(saved.step);
      setAnswers(saved.answers);
      setRestored(true);
    }
  }, [siret]);

  useEffect(() => {
    if (step > 0) saveDraft(siret, step, answers);
  }, [step, answers, siret]);

  const progress = useMemo(() => ((step + 1) / TOTAL_SLIDES) * 100, [step]);

  // Accessibilité clavier/lecteur d'écran : au changement d'étape, replacer le
  // focus sur le titre de la question (sinon le focus reste sur le bouton
  // cliqué, désormais démonté, et le lecteur d'écran n'annonce rien).
  const titreRef = useRef<HTMLHeadingElement>(null);
  const premierRendu = useRef(true);
  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    titreRef.current?.focus();
  }, [step]);

  function select(key: keyof Reponses, value: string, detail?: string) {
    // Bloque toute action si une transition est en cours (anti double-clic /
    // tap accidentel) ou si on est déjà en soumission.
    if (lockedRef.current || submitting) return;
    lockedRef.current = true;
    setTransitioning(true);

    const nextAnswers: Partial<Reponses> = {
      ...answers,
      [key]: value,
      ...(detail && key === 'effectif' ? { effectifDetail: detail } : {}),
    };
    setAnswers(nextAnswers);

    setTimeout(() => {
      if (step < TOTAL_SLIDES - 1) {
        setStep((s) => s + 1);
        // Libère le verrou après le changement d'étape.
        lockedRef.current = false;
        setTransitioning(false);
      } else {
        // Dernière étape : on lance la soumission. Le verrou reste actif
        // (submitting prend le relais).
        submit(nextAnswers);
      }
    }, 280);
  }

  function skip() {
    if (lockedRef.current || submitting) return;
    lockedRef.current = true;
    if (step < TOTAL_SLIDES - 1) {
      setStep((s) => s + 1);
      // Petit délai avant de relâcher pour éviter le double-skip.
      setTimeout(() => { lockedRef.current = false; }, 280);
    } else {
      submit(answers);
    }
  }

  async function submit(final: Partial<Reponses>) {
    setSubmitting(true);
    clearDraft();
    const reponses = final as Reponses;

    try {
      const res = await fetch('/api/fiche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siret, reponses }),
      });
      const json = await res.json();
      if (json?.token && json?.persisted) {
        window.location.href = `/fiche/${json.token}`;
        return;
      }
    } catch {}

    const encoded = btoa(
      unescape(encodeURIComponent(JSON.stringify({ siret, reponses })))
    );
    window.location.href = `/fiche/local?d=${encoded}`;
  }

  const slides: SlideConfig[] = [
    {
      title: 'Où en êtes-vous ?',
      subtitle: 'Il n’y a pas de mauvaise réponse.',
      key: 'situation',
      choices: SITUATIONS,
    },
    {
      title: 'Quel est votre problème principal ?',
      subtitle: 'Vous pourrez nuancer plus tard.',
      key: 'probleme',
      choices: PROBLEMES,
    },
    {
      title: 'Avez-vous des salariés ?',
      subtitle: 'Cela change les interlocuteurs à mobiliser.',
      key: 'effectif',
      choices: EFFECTIFS,
    },
    {
      title: 'Avez-vous signé des cautions personnelles ?',
      subtitle: 'C’est important pour protéger votre patrimoine et votre famille.',
      key: 'caution',
      choices: CAUTIONS,
    },
    {
      title: 'Êtes-vous propriétaire de votre résidence ?',
      subtitle: 'Des protections légales existent selon votre statut.',
      key: 'patrimoine',
      choices: PATRIMOINES,
    },
    {
      title: 'Quel est votre régime matrimonial ?',
      subtitle: 'Cela détermine ce que votre conjoint·e risque ou non.',
      key: 'regime',
      choices: REGIMES,
    },
    {
      title: 'Envisagez-vous de vendre votre entreprise ?',
      subtitle: 'Vendre n’est pas un échec — c’est parfois la meilleure décision.',
      key: 'vente',
      choices: VENTES,
    },
    {
      title: 'Comment vous sentez-vous ?',
      subtitle: 'Votre réponse reste entre vous et nous.',
      key: 'moral',
      choices: MORAUX,
    },
    {
      title: 'Quel est le montant total de vos dettes ?',
      subtitle: 'Une estimation suffit — elle nous aide à calibrer les solutions.',
      key: 'montantDettes',
      choices: MONTANTS_DETTES,
      skippable: true,
    },
    {
      title: 'Quel est votre âge ?',
      subtitle: 'L’âge influe sur les aides au rebond accessibles.',
      key: 'ageDirigeant',
      choices: AGES_DIRIGEANT,
      skippable: true,
    },
    {
      title: 'Êtes-vous franchisé ?',
      subtitle: 'Un contrat de franchise change les obligations en cas de difficulté.',
      key: 'franchise',
      choices: FRANCHISES,
      skippable: true,
    },
    {
      title: 'Avez-vous déjà eu une procédure collective ?',
      subtitle: 'Sauvegarde, redressement ou liquidation — sur cette entreprise ou une autre.',
      key: 'antecedents',
      choices: ANTECEDENTS,
      skippable: true,
    },
    {
      title: 'Avez-vous un PGE en cours ?',
      subtitle: 'Le Prêt Garanti par l’État pèse sur 30 % des défaillances 2024-2025.',
      key: 'pgeEnCours',
      choices: PGE_EN_COURS,
      skippable: true,
    },
    {
      title: 'Avez-vous une RQTH ou un handicap reconnu ?',
      subtitle: 'Optionnel — sert à mobiliser AGEFIPH, Cap Emploi, MDPH. Donnée non partagée sans votre accord (RGPD).',
      key: 'rqth',
      choices: RQTH,
      skippable: true,
    },
    {
      title: 'Votre conjoint·e a-t-il un rôle dans la société ?',
      subtitle: 'Statut conjoint salarié, collaborateur ou associé : protections et risques différents.',
      key: 'conjointStatut',
      choices: CONJOINT,
      skippable: true,
    },
    {
      title: 'Êtes-vous co-gérant ou seul à la tête ?',
      subtitle: 'La pluralité de dirigeants déclenche une solidarité fiscale et sociale.',
      key: 'coGerants',
      choices: CO_GERANTS,
      skippable: true,
    },
    {
      title: 'Votre activité est-elle saisonnière ?',
      subtitle: 'HCR, tourisme, agriculture, pêche — change les arbitrages activité partielle et trésorerie.',
      key: 'saisonnalite',
      choices: SAISONNALITE,
      skippable: true,
    },
    {
      title: 'Quelle est votre nationalité ?',
      subtitle: 'Impact spécifique pour les dirigeants hors UE (titre de séjour entrepreneur, Passeport Talent). Optionnel — RGPD.',
      key: 'nationalite',
      choices: NATIONALITE,
      skippable: true,
    },
  ];

  const safeStep = Math.min(step, slides.length - 1);
  const current = slides[safeStep];

  return (
    <div className="mx-auto max-w-2xl px-5 pb-20">
      {restored && (
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-bleu/10 px-4 py-3 text-sm text-bleu-fonce">
          <span>Vos réponses précédentes ont été restaurées.</span>
          <button
            type="button"
            onClick={() => { setStep(0); setAnswers({}); clearDraft(); setRestored(false); }}
            className="ml-3 text-xs text-navy/50 underline hover:text-navy"
          >
            Recommencer
          </button>
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        Étape {step + 1} sur {TOTAL_SLIDES} : {current.title}
      </p>
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-navy/50">
          <span>Étape {step + 1} sur {TOTAL_SLIDES}</span>
          <span>{Math.round(progress)} %</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy/10">
          <m.div
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="h-full rounded-full bg-gradient-to-r from-bleu to-bleu-fonce"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="glass card-top-line p-6 sm:p-10"
        >
          <h2
            id={`question-${current.key}`}
            ref={titreRef}
            tabIndex={-1}
            className="font-display text-2xl text-navy outline-none sm:text-3xl"
          >
            {current.title}
          </h2>
          <p className="mt-2 text-sm text-navy/60">{current.subtitle}</p>
          <div className="mt-6 space-y-3" role="group" aria-labelledby={`question-${current.key}`}>
            {current.choices.map((c, idx) => (
              <button
                key={`${current.key}-${idx}`}
                type="button"
                disabled={submitting || transitioning}
                aria-label={c.hint ? `${c.label} — ${c.hint}` : c.label}
                onClick={() => {
                  if (current.key === 'effectif') {
                    select(current.key, c.value, c.label);
                  } else {
                    select(current.key, c.value);
                  }
                }}
                className="group flex w-full items-start gap-4 rounded-2xl border border-navy/10 bg-white/70 px-5 py-4 text-left transition hover:border-bleu hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="mt-1 h-5 w-5 shrink-0 rounded-full border border-navy/20 group-hover:border-bleu" aria-hidden="true" />
                <span>
                  <span className="block text-base font-medium text-navy">
                    {c.label}
                  </span>
                  {c.hint && (
                    <span className="mt-0.5 block text-xs text-navy/55">
                      {c.hint}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <button
              type="button"
              disabled={step === 0 || submitting}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="text-navy/50 hover:text-navy disabled:opacity-40"
            >
              ← Précédent
            </button>
            {current.skippable && !submitting && (
              <button
                type="button"
                onClick={skip}
                disabled={transitioning}
                className="text-navy/50 underline hover:text-navy disabled:opacity-40"
              >
                Passer cette question
              </button>
            )}
            {submitting && (
              <span className="text-navy/50">Préparation de votre fiche…</span>
            )}
          </div>
        </m.div>
      </AnimatePresence>
    </div>
  );
}
