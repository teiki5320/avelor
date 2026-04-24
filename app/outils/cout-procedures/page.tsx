'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

type Taille = 'tpe' | 'petite-pme' | 'moyenne-pme' | 'grande';

interface Fourchette {
  procedure: string;
  icone: string;
  couleur: string;
  type: 'amiable' | 'collective';
  confidentiel: boolean;
  dureeMois: string;
  greffe: string;
  mandataire: string;
  avocat: string;
  totalBas: number;
  totalHaut: number;
  sources: string[];
}

const PROCEDURES: Record<Taille, Fourchette[]> = {
  tpe: [
    {
      procedure: 'Mandat ad hoc',
      icone: '🤝',
      couleur: 'border-bleu/40 bg-bleu/5',
      type: 'amiable',
      confidentiel: true,
      dureeMois: '3 à 6 mois',
      greffe: 'Requête : environ 45 €',
      mandataire: '3 000 à 8 000 €',
      avocat: '0 à 3 000 € (optionnel)',
      totalBas: 3000,
      totalHaut: 11000,
      sources: [
        'C. com. art. L611-3',
        "Décret 85-1389 relatif aux émoluments des mandataires",
      ],
    },
    {
      procedure: 'Conciliation',
      icone: '🫱🏻‍🫲🏿',
      couleur: 'border-vert/40 bg-vert/5',
      type: 'amiable',
      confidentiel: true,
      dureeMois: '4 à 5 mois',
      greffe: 'Environ 45 €',
      mandataire: '5 000 à 15 000 €',
      avocat: '1 500 à 5 000 €',
      totalBas: 6500,
      totalHaut: 20000,
      sources: [
        'C. com. art. L611-4 à L611-16',
        'Décret 85-1389',
      ],
    },
    {
      procedure: 'Sauvegarde',
      icone: '🛡️',
      couleur: 'border-jaune/40 bg-jaune/5',
      type: 'collective',
      confidentiel: false,
      dureeMois: '6 à 12 mois + plan (10 ans max)',
      greffe: 'Environ 40 € (dépôt)',
      mandataire: '8 000 à 20 000 €',
      avocat: '3 000 à 10 000 €',
      totalBas: 11000,
      totalHaut: 30000,
      sources: [
        'C. com. art. L620-1 et s.',
        'Décret 2006-1709 (émoluments mandataires)',
      ],
    },
    {
      procedure: 'Redressement judiciaire (RJ)',
      icone: '⚖️',
      couleur: 'border-rouge/30 bg-rouge/5',
      type: 'collective',
      confidentiel: false,
      dureeMois: '6 à 18 mois + plan (10 ans max)',
      greffe: 'Environ 40 €',
      mandataire: '10 000 à 30 000 € (forfait + % passif)',
      avocat: '3 000 à 12 000 €',
      totalBas: 13000,
      totalHaut: 42000,
      sources: [
        'C. com. art. L631-1 et s.',
        'Décret 2006-1709 (émoluments proportionnels)',
      ],
    },
    {
      procedure: 'Liquidation judiciaire simplifiée',
      icone: '🔚',
      couleur: 'border-navy/30 bg-navy/5',
      type: 'collective',
      confidentiel: false,
      dureeMois: '1 an max (simplifiée)',
      greffe: 'Environ 40 €',
      mandataire: '4 000 à 10 000 € (majorité imputée sur l\'actif)',
      avocat: '0 à 3 000 €',
      totalBas: 4000,
      totalHaut: 13000,
      sources: [
        'C. com. art. L641-1, L644-1 à L644-6 (simplifiée)',
        'Décret 2006-1709',
      ],
    },
    {
      procedure: 'Rétablissement professionnel (PRP)',
      icone: '♻️',
      couleur: 'border-vert/30 bg-vert/5',
      type: 'collective',
      confidentiel: false,
      dureeMois: '4 mois',
      greffe: 'Environ 40 €',
      mandataire: '1 500 à 3 000 € (indemnisés sur fonds publics)',
      avocat: '0 à 1 500 €',
      totalBas: 1500,
      totalHaut: 4500,
      sources: [
        'C. com. art. L645-1 à L645-12',
      ],
    },
  ],
  'petite-pme': [], // sera rempli comme un multiple
  'moyenne-pme': [],
  'grande': [],
};

function coeffTaille(t: Taille): number {
  return { tpe: 1, 'petite-pme': 1.5, 'moyenne-pme': 2.5, 'grande': 4 }[t];
}

function formatEuros(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(0)} k€`;
  return Math.round(n).toLocaleString('fr-FR') + ' €';
}

export default function CoutProceduresPage() {
  const [taille, setTaille] = useState<Taille>('tpe');

  const items = useMemo(() => {
    const c = coeffTaille(taille);
    return PROCEDURES.tpe.map((p) => ({
      ...p,
      totalBas: p.totalBas * c,
      totalHaut: p.totalHaut * c,
    }));
  }, [taille]);

  return (
    <section className="mx-auto max-w-5xl px-5 py-10">
      <Link
        href="/outils"
        className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy"
      >
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Coût estimé des procédures
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Fourchettes indicatives des coûts réels (greffe, émoluments du
        mandataire, honoraires d&apos;avocat). Les rémunérations des
        mandataires sont encadrées par décret.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {([
          { k: 'tpe', l: 'TPE (< 10 salariés / CA < 2 M€)' },
          { k: 'petite-pme', l: 'Petite PME (< 50 salariés)' },
          { k: 'moyenne-pme', l: 'PME (< 250 salariés)' },
          { k: 'grande', l: 'ETI / grande' },
        ] as const).map((t) => (
          <button
            key={t.k}
            type="button"
            onClick={() => setTaille(t.k)}
            className={`rounded-full px-4 py-1.5 ${
              taille === t.k ? 'bg-navy text-white' : 'bg-white/80 text-navy/80 hover:bg-white'
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4">
        {items.map((p) => (
          <div key={p.procedure} className={`rounded-2xl border p-5 ${p.couleur}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl text-navy">
                  <span className="mr-2" aria-hidden>{p.icone}</span>
                  {p.procedure}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="pastille">{p.type === 'amiable' ? 'Procédure amiable' : 'Procédure collective'}</span>
                  <span className="pastille">{p.confidentiel ? 'Confidentielle' : 'Publique'}</span>
                  <span className="pastille">Durée : {p.dureeMois}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase text-navy/55">Coût total estimé</p>
                <p className="font-display text-xl text-navy">
                  {formatEuros(p.totalBas)} — {formatEuros(p.totalHaut)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-navy/80 sm:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase text-navy/55">Frais de greffe</p>
                <p>{p.greffe}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-navy/55">Mandataire / administrateur</p>
                <p>{p.mandataire}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-navy/55">Honoraires avocat</p>
                <p>{p.avocat}</p>
              </div>
            </div>

            <div className="mt-3 border-t border-navy/10 pt-3 text-[11px] text-navy/55">
              <strong>Sources :</strong> {p.sources.join(' · ')}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">Comment financer ces frais</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            <strong>Aide juridictionnelle</strong> (AJ) : si vos revenus sont faibles, l&apos;avocat est pris en charge totalement ou partiellement.
            <Link href="/outils/aide-juridictionnelle" className="ml-1 text-bleu-fonce underline">Vérifier mon éligibilité</Link>
          </li>
          <li>
            <strong>Consultation gratuite</strong> : la plupart des avocats et mandataires proposent un premier RDV gratuit. Le CIP organise des RDV 100 % confidentiels et gratuits.
          </li>
          <li>
            <strong>Honoraires des mandataires</strong> : partiellement prélevés sur l&apos;actif de la procédure — vous n&apos;avancez pas la totalité dans les procédures collectives.
          </li>
          <li>
            <strong>PRP (Rétablissement Professionnel)</strong> : le mandataire est indemnisé sur fonds publics — procédure quasiment gratuite pour le débiteur.
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Fourchettes indicatives issues des barèmes officiels (décrets
        85-1389 et 2006-1709) et des observations CNAJMJ, IFPPC et CRA.
        Les coûts réels dépendent de la taille du bilan, du nombre de
        créanciers et de la complexité du dossier.
      </p>
    </section>
  );
}
