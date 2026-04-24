'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

type Categorie =
  | 'urssaf'
  | 'fiscal-revenu'
  | 'fiscal-tva'
  | 'civil'
  | 'commercial'
  | 'baux'
  | 'salaire'
  | 'penal-amende';

interface Regle {
  cle: Categorie;
  label: string;
  duree: number; // années
  base: string;
  reference: string;
  point: string; // point de départ du délai
  interruption: string;
}

const REGLES: Regle[] = [
  {
    cle: 'urssaf',
    label: 'Cotisations sociales (URSSAF, MSA, SSI)',
    duree: 3,
    base: 'Code de la Sécurité sociale',
    reference: 'CSS art. L244-3',
    point: "Date d'exigibilité de la cotisation (échéance déclarative).",
    interruption:
      "Mise en demeure, contrainte signifiée, reconnaissance écrite de la dette par le débiteur.",
  },
  {
    cle: 'fiscal-revenu',
    label: 'Impôt sur le revenu / Impôt sur les sociétés',
    duree: 3,
    base: 'Livre des procédures fiscales',
    reference: 'LPF art. L169 (délai de reprise)',
    point:
      "31 décembre de la 3e année qui suit celle au titre de laquelle l'impôt est dû.",
    interruption:
      "Proposition de rectification, jugement, demande d'assistance internationale.",
  },
  {
    cle: 'fiscal-tva',
    label: 'TVA',
    duree: 4,
    base: 'Livre des procédures fiscales',
    reference: 'LPF art. L176',
    point:
      "31 décembre de la 3e année qui suit celle au cours de laquelle la TVA est devenue exigible (soit ~4 ans).",
    interruption: "Proposition de rectification, action en recouvrement.",
  },
  {
    cle: 'civil',
    label: 'Action civile (entre particuliers, dette personnelle)',
    duree: 5,
    base: 'Code civil',
    reference: 'C. civ. art. 2224',
    point:
      "Jour où le titulaire du droit a connu ou aurait dû connaître les faits lui permettant de l'exercer.",
    interruption:
      "Demande en justice, acte d'exécution forcée, reconnaissance du droit par le débiteur (art. 2240 et s.).",
  },
  {
    cle: 'commercial',
    label: 'Action commerciale (entre commerçants)',
    duree: 5,
    base: 'Code de commerce',
    reference: 'C. com. art. L110-4',
    point: "Date d'exigibilité de la créance commerciale.",
    interruption:
      "Reconnaissance, demande en justice, mesure conservatoire.",
  },
  {
    cle: 'baux',
    label: 'Loyer commercial (action en paiement)',
    duree: 5,
    base: 'Code civil',
    reference: 'C. civ. art. 2224 (jurisprudence Cass. 3e civ.)',
    point: "Date d'échéance de chaque terme de loyer.",
    interruption:
      "Commandement de payer visant la clause résolutoire, action en justice.",
  },
  {
    cle: 'salaire',
    label: 'Action en paiement du salaire',
    duree: 3,
    base: 'Code du travail',
    reference: 'C. trav. art. L3245-1',
    point: "Jour où celui qui exerce l'action a connu ou aurait dû connaître les faits.",
    interruption:
      "Saisine du conseil de prud'hommes, reconnaissance écrite par l'employeur.",
  },
  {
    cle: 'penal-amende',
    label: "Amendes pénales / contraventions",
    duree: 3,
    base: 'Code de procédure pénale',
    reference: 'CPP art. 133-3',
    point: "Date à laquelle la décision est devenue définitive.",
    interruption: "Tout acte d'exécution.",
  },
];

function addYears(d: Date, n: number): Date {
  const out = new Date(d);
  out.setFullYear(out.getFullYear() + n);
  return out;
}

function formatDateFR(d: Date): string {
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export default function PrescriptionPage() {
  const [categorie, setCategorie] = useState<Categorie>('urssaf');
  const [dateExig, setDateExig] = useState<string>('');
  const [interrompue, setInterrompue] = useState(false);
  const [dateInterruption, setDateInterruption] = useState<string>('');

  const regle = REGLES.find((r) => r.cle === categorie)!;

  const result = useMemo(() => {
    if (!dateExig) return null;
    const base = interrompue && dateInterruption ? new Date(dateInterruption) : new Date(dateExig);
    if (isNaN(base.getTime())) return null;
    const echeance = addYears(base, regle.duree);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const restants = daysBetween(today, echeance);
    return { echeance, restants };
  }, [dateExig, dateInterruption, interrompue, regle]);

  const statut = !result
    ? null
    : result.restants < 0
    ? { ton: 'safe' as const, label: 'Dette potentiellement prescrite' }
    : result.restants < 90
    ? { ton: 'urgent' as const, label: 'Prescription proche' }
    : { ton: 'normal' as const, label: 'Prescription à venir' };

  const STATUT_STYLES = {
    safe: 'bg-vert/10 border-vert/30 text-vert',
    urgent: 'bg-jaune/15 border-jaune/40 text-jaune',
    normal: 'bg-bleu/10 border-bleu/30 text-bleu-fonce',
  } as const;

  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <Link
        href="/outils"
        className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy"
      >
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Vérificateur de prescription
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Une dette qui dépasse son délai de prescription ne peut plus être
        recouvrée judiciairement. Cet outil applique les durées et points
        de départ officiels.
      </p>

      <div className="glass mt-8 space-y-4 p-6 sm:p-8">
        <label className="block text-sm text-navy">
          Type de dette
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value as Categorie)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
          >
            {REGLES.map((r) => (
              <option key={r.cle} value={r.cle}>
                {r.label} — {r.duree} ans
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-2xl border border-navy/10 bg-white/60 p-4 text-sm text-navy/80">
          <p>
            <strong>Base légale :</strong> {regle.base} ({regle.reference})
          </p>
          <p className="mt-1">
            <strong>Point de départ :</strong> {regle.point}
          </p>
          <p className="mt-1">
            <strong>Causes d&apos;interruption :</strong> {regle.interruption}
          </p>
        </div>

        <label className="block text-sm text-navy">
          Date du point de départ (exigibilité, échéance, fait générateur)
          <input
            type="date"
            value={dateExig}
            onChange={(e) => setDateExig(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-navy">
          <input
            type="checkbox"
            checked={interrompue}
            onChange={(e) => setInterrompue(e.target.checked)}
            className="h-4 w-4"
          />
          La prescription a été interrompue (mise en demeure, jugement, reconnaissance écrite…)
        </label>

        {interrompue && (
          <label className="block text-sm text-navy">
            Date du dernier acte d&apos;interruption
            <input
              type="date"
              value={dateInterruption}
              onChange={(e) => setDateInterruption(e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            />
            <span className="mt-1 block text-[11px] text-navy/55">
              L&apos;interruption fait courir un nouveau délai entier (art. 2231 C. civ.).
            </span>
          </label>
        )}

        {result && statut && (
          <div className={`rounded-2xl border p-5 ${STATUT_STYLES[statut.ton]}`}>
            <p className="font-display text-lg">{statut.label}</p>
            <p className="mt-2 text-sm text-navy/80">
              Date de prescription estimée : <strong>{formatDateFR(result.echeance)}</strong>
            </p>
            <p className="mt-1 text-sm text-navy/70">
              {result.restants < 0
                ? `Le délai est dépassé de ${Math.abs(result.restants)} jours. Vérifiez avec un avocat avant tout paiement.`
                : `Encore ${result.restants} jours avant prescription.`}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">⚠️ Limites</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Cet outil ne tient pas compte des suspensions (mineurs, force majeure, etc. — art. 2233 et s. C. civ.).
          </li>
          <li>
            Une prescription <strong>n&apos;efface pas la dette</strong> mais empêche
            son recouvrement forcé. Un paiement volontaire reste valable.
          </li>
          <li>
            Faites toujours vérifier par un avocat avant d&apos;invoquer la prescription,
            notamment si une procédure est en cours.
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Sources officielles : Code civil (art. 2219 à 2254), Code de la
        Sécurité sociale (L244-3), Livre des procédures fiscales (L169,
        L176), Code du travail (L3245-1), Code de commerce (L110-4).
      </p>
    </section>
  );
}
