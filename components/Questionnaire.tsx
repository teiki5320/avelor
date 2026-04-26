'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  Reponses, Situation, Probleme, Effectif, Moral,
  Caution, RegimeMatrimonial, Patrimoine, VenteEnvisagee,
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

const TOTAL_SLIDES = 8;

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
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Partial<Reponses>>({});
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const saved = loadSaved(siret);
    if (saved && saved.step > 0) {
      setStep(saved.step);
      setAnswers(saved.answers);
      setRestored(true);
    }
  }, [siret]);

  useEffect(() => {
    if (step > 0) saveDraft(siret, step, answers);
  }, [step, answers, siret]);

  const progress = useMemo(() => ((step + 1) / TOTAL_SLIDES) * 100, [step]);

  function select(key: keyof Reponses, value: string, detail?: string) {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
      ...(detail && key === 'effectif' ? { effectifDetail: detail } : {}),
    }));
    setTimeout(() => {
      if (step < TOTAL_SLIDES - 1) setStep((s) => s + 1);
      else submit({ ...answers, [key]: value, ...(detail ? { effectifDetail: detail } : {}) });
    }, 280);
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
        router.push(`/fiche/${json.token}`);
        return;
      }
    } catch {}

    const encoded = btoa(
      unescape(encodeURIComponent(JSON.stringify({ siret, reponses })))
    );
    router.push(`/fiche/local?d=${encoded}`);
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
  ];

  const current = slides[step];

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
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-navy/50">
          <span>Étape {step + 1} sur {TOTAL_SLIDES}</span>
          <span>{Math.round(progress)} %</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy/10">
          <motion.div
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="h-full rounded-full bg-gradient-to-r from-bleu to-bleu-fonce"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="glass card-top-line p-6 sm:p-10"
        >
          <h2 className="font-display text-2xl text-navy sm:text-3xl">
            {current.title}
          </h2>
          <p className="mt-2 text-sm text-navy/60">{current.subtitle}</p>
          <div className="mt-6 space-y-3">
            {current.choices.map((c, idx) => (
              <button
                key={`${current.key}-${idx}`}
                type="button"
                disabled={submitting}
                onClick={() => {
                  if (current.key === 'effectif') {
                    select(current.key, c.value, c.label);
                  } else {
                    select(current.key, c.value);
                  }
                }}
                className="group flex w-full items-start gap-4 rounded-2xl border border-navy/10 bg-white/70 px-5 py-4 text-left transition hover:border-bleu hover:bg-white"
              >
                <span className="mt-1 h-5 w-5 shrink-0 rounded-full border border-navy/20 group-hover:border-bleu" />
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
            {submitting && (
              <span className="text-navy/50">Préparation de votre fiche…</span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
