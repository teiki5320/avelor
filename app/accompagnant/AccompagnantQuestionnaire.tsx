'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Lien = 'conjoint' | 'associe' | 'ami' | 'comptable' | 'autre';
type EtatPercu = 'stress' | 'epuise' | 'en-colere' | 'ferme';
type Besoin = 'comprendre' | 'parler' | 'agir' | 'proteger';

interface Choice<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

const LIENS: Choice<Lien>[] = [
  { value: 'conjoint', label: 'Conjoint·e / partenaire' },
  { value: 'associe', label: 'Associé·e' },
  { value: 'ami', label: 'Ami·e proche' },
  { value: 'comptable', label: 'Expert-comptable / avocat' },
  { value: 'autre', label: 'Autre (salarié, famille…)' },
];

const ETATS: Choice<EtatPercu>[] = [
  { value: 'stress', label: 'Stressé·e mais encore actif·ve', hint: 'Il/elle agit, mais vous sentez la pression' },
  { value: 'epuise', label: 'Épuisé·e, replié·e sur soi', hint: 'Il/elle ne parle plus, dort mal, s\'isole' },
  { value: 'en-colere', label: 'En colère, dans le déni', hint: 'Il/elle refuse d\'en parler ou minimise' },
  { value: 'ferme', label: 'Fermé·e, vous n\'arrivez plus à communiquer', hint: 'Le sujet est devenu tabou' },
];

const BESOINS: Choice<Besoin>[] = [
  { value: 'comprendre', label: 'Comprendre ce qu\'il/elle traverse', hint: 'Vous voulez y voir clair' },
  { value: 'parler', label: 'Savoir comment lui en parler', hint: 'Trouver les bons mots' },
  { value: 'agir', label: 'Savoir quoi faire concrètement', hint: 'Appeler quelqu\'un, l\'orienter' },
  { value: 'proteger', label: 'Protéger votre famille / patrimoine', hint: 'Anticiper l\'impact sur votre foyer' },
];

interface Answers {
  lien?: Lien;
  etat?: EtatPercu;
  besoin?: Besoin;
}

function buildConseils(a: Answers) {
  const conseils: { titre: string; texte: string; lien?: string; lienLabel?: string }[] = [];

  // Always first: take care of yourself
  conseils.push({
    titre: 'Prenez soin de vous aussi',
    texte: 'Accompagner un dirigeant en difficulté, c\'est porter du poids. Vous avez le droit de demander de l\'aide pour vous. APESA accompagne aussi les proches.',
    lien: 'https://apesa.fr',
    lienLabel: 'apesa.fr',
  });

  if (a.etat === 'epuise' || a.etat === 'ferme') {
    conseils.push({
      titre: 'Ne restez pas seul·e face à son silence',
      texte: 'Quand un dirigeant s\'isole, c\'est souvent par honte — pas par rejet de vous. Ne forcez pas la conversation, mais restez présent·e. Un simple « je suis là » suffit parfois.',
    });
    conseils.push({
      titre: 'Alertez un professionnel',
      texte: 'Si vous êtes inquiet·e pour sa santé mentale, vous pouvez appeler APESA ou le 3114 vous-même — ils vous conseilleront sur la marche à suivre, même si ce n\'est pas vous le dirigeant.',
      lien: 'tel:3114',
      lienLabel: 'Appeler le 3114',
    });
  }

  if (a.etat === 'en-colere') {
    conseils.push({
      titre: 'La colère est souvent de la peur déguisée',
      texte: 'Un dirigeant en colère qui « refuse d\'en parler » a souvent très peur de perdre le contrôle. Ne le/la confrontez pas frontalement — proposez plutôt un rendez-vous avec un tiers (CCI, expert-comptable).',
    });
  }

  if (a.besoin === 'comprendre') {
    conseils.push({
      titre: 'Les procédures expliquées simplement',
      texte: 'Redressement, liquidation, conciliation… ces mots font peur, mais la plupart des procédures visent à sauver l\'entreprise, pas à la condamner.',
      lien: '/glossaire',
      lienLabel: 'Voir le glossaire',
    });
    conseils.push({
      titre: 'Comparez les options',
      texte: 'Un tableau clair des procédures possibles selon la situation.',
      lien: '/procedures',
      lienLabel: 'Voir le tableau comparatif',
    });
  }

  if (a.besoin === 'parler') {
    conseils.push({
      titre: 'Comment aborder le sujet',
      texte: 'Des phrases concrètes pour ouvrir la conversation sans dramatiser ni minimiser.',
      lien: '/proches',
      lienLabel: 'Lire le guide',
    });
  }

  if (a.besoin === 'agir') {
    conseils.push({
      titre: 'Orientez-le/la vers la CCI',
      texte: 'La CCI propose un accompagnement gratuit et confidentiel pour les dirigeants en difficulté. Vous pouvez même appeler à sa place pour prendre un premier rendez-vous.',
    });
    conseils.push({
      titre: 'Proposez-lui de faire le diagnostic AVELOR ensemble',
      texte: 'Asseyez-vous avec lui/elle, entrez son SIRET sur AVELOR et parcourez la fiche ensemble. C\'est souvent plus facile à deux.',
      lien: '/',
      lienLabel: 'Commencer le diagnostic',
    });
  }

  if (a.besoin === 'proteger') {
    conseils.push({
      titre: 'Consultez un notaire',
      texte: 'Si vous êtes conjoint·e, un notaire peut vous aider à protéger votre patrimoine personnel (résidence principale, épargne). Demandez un rendez-vous rapidement.',
      lien: 'https://www.notaires.fr',
      lienLabel: 'notaires.fr',
    });
    if (a.lien === 'conjoint') {
      conseils.push({
        titre: 'Vérifiez votre régime matrimonial',
        texte: 'En communauté de biens, les dettes de l\'entreprise peuvent affecter le patrimoine commun. Un avocat peut vous éclairer sur vos droits et protections possibles.',
      });
    }
  }

  if (a.lien === 'comptable') {
    conseils.push({
      titre: 'Votre rôle est clé',
      texte: 'En tant que professionnel du chiffre, vous pouvez orienter votre client vers un mandat ad hoc ou une conciliation avant qu\'il ne soit trop tard. Un CIP (Centre d\'Information sur la Prévention) peut vous accompagner.',
      lien: 'https://www.ciprofessionnels.com',
      lienLabel: 'CIP',
    });
  }

  // Always: aides financières
  conseils.push({
    titre: 'Des aides existent — beaucoup sont méconnues',
    texte: 'BPI France, médiation du crédit, action sociale CPAM… Parcourez la liste ensemble.',
    lien: '/aides',
    lienLabel: 'Voir les aides',
  });

  return conseils;
}

export default function AccompagnantQuestionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const slides = [
    { title: 'Quel est votre lien avec le dirigeant ?', key: 'lien' as const, choices: LIENS },
    { title: 'Comment percevez-vous son état ?', key: 'etat' as const, choices: ETATS },
    { title: 'De quoi avez-vous besoin aujourd\'hui ?', key: 'besoin' as const, choices: BESOINS },
  ];

  function select(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setTimeout(() => {
      if (step < 2) setStep((s) => s + 1);
    }, 280);
  }

  const showResults = step >= 2 && answers.besoin;
  const conseils = showResults ? buildConseils(answers) : [];
  const progress = showResults ? 100 : ((step + 1) / 3) * 100;

  return (
    <div>
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-navy/50">
          <span>{showResults ? 'Vos conseils' : `Étape ${step + 1} sur 3`}</span>
          <span>{Math.round(progress)} %</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy/10">
          <motion.div
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="h-full rounded-full bg-gradient-to-r from-vert to-bleu"
          />
        </div>
      </div>

      {!showResults && (
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="glass card-top-line p-6 sm:p-10"
          >
            <h2 className="font-display text-2xl text-navy sm:text-3xl">
              {slides[step].title}
            </h2>
            <div className="mt-6 space-y-3">
              {slides[step].choices.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(slides[step].key, c.value)}
                  className="group flex w-full items-start gap-4 rounded-2xl border border-navy/10 bg-white/70 px-5 py-4 text-left transition hover:border-vert hover:bg-white"
                >
                  <span className="mt-1 h-5 w-5 shrink-0 rounded-full border border-navy/20 group-hover:border-vert" />
                  <span>
                    <span className="block font-medium text-navy">{c.label}</span>
                    {c.hint && (
                      <span className="mt-0.5 block text-xs text-navy/55">{c.hint}</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="text-sm text-navy/50 hover:text-navy disabled:opacity-40"
              >
                ← Précédent
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass card-top-line p-6 sm:p-8">
            <h2 className="font-display text-2xl text-navy">
              Ce que nous vous conseillons
            </h2>
            <p className="mt-2 text-sm text-navy/60">
              Basé sur vos réponses — {answers.lien}, état perçu : {answers.etat}, besoin : {answers.besoin}.
            </p>
          </div>

          {conseils.map((c, i) => (
            <div key={i} className="glass-soft p-5">
              <h3 className="font-display text-lg text-navy">{c.titre}</h3>
              <p className="mt-2 text-sm text-navy/80">{c.texte}</p>
              {c.lien && (
                <a
                  href={c.lien}
                  target={c.lien.startsWith('/') ? undefined : '_blank'}
                  rel={c.lien.startsWith('/') ? undefined : 'noreferrer'}
                  className="mt-3 inline-flex items-center gap-1 text-sm text-bleu-fonce underline underline-offset-4"
                >
                  {c.lienLabel} →
                </a>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => { setStep(0); setAnswers({}); }}
            className="btn-ghost mx-auto flex"
          >
            ← Recommencer
          </button>
        </motion.div>
      )}
    </div>
  );
}
