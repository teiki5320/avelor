'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

// Plafond AGS 2025 : 6 fois le plafond mensuel de la Sécu (PMSS).
// PMSS 2025 = 3 925 €/mois → plafond AGS = 92 736 € (6 × 13 fois car AGS = 13 × PMSS sur 12 mois selon ancienneté).
// Ici on prend le plafond AGS courant officiel : 92 736 € (plafond le plus élevé).
const PLAFOND_AGS_HAUT = 92736;
const PLAFOND_AGS_INTER = 77280;
const PLAFOND_AGS_BAS = 61824;

interface Salarie {
  id: string;
  ancienneteMois: number;
  salaireBrut: number;
}

function formatEuros(n: number): string {
  return Math.round(n).toLocaleString('fr-FR') + ' €';
}

function calculIndemnite(ancienneteMois: number, salaireBrutMensuel: number): {
  montant: number;
  detail: string;
  jusqua10ans: number;
  apres10ans: number;
} {
  const ans = ancienneteMois / 12;
  const jusqua10 = Math.min(ans, 10);
  const apres10 = Math.max(0, ans - 10);
  const partA = (1 / 4) * salaireBrutMensuel * jusqua10;
  const partB = (1 / 3) * salaireBrutMensuel * apres10;
  const montant = partA + partB;
  return {
    montant,
    detail: `${(jusqua10).toFixed(2)} années × ¼ + ${(apres10).toFixed(2)} années × ⅓ × ${formatEuros(salaireBrutMensuel)}`,
    jusqua10ans: partA,
    apres10ans: partB,
  };
}

function plafondAgs(ancienneteMois: number): number {
  // Source : ags-garantie-salaires.org
  // Plafond bas (4 PMSS) : entreprise immatriculée < 6 mois ou contrat < 6 mois
  // Plafond intermédiaire (5 PMSS) : 6 mois à 2 ans
  // Plafond haut (6 PMSS) : > 2 ans
  if (ancienneteMois < 6) return PLAFOND_AGS_BAS;
  if (ancienneteMois < 24) return PLAFOND_AGS_INTER;
  return PLAFOND_AGS_HAUT;
}

export default function LicenciementPage() {
  const [salaries, setSalaries] = useState<Salarie[]>([
    { id: 's1', ancienneteMois: 60, salaireBrut: 2500 },
  ]);

  function update(id: string, field: 'ancienneteMois' | 'salaireBrut', value: number) {
    setSalaries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  function add() {
    setSalaries((prev) => [
      ...prev,
      {
        id: `s${prev.length + 1}-${Date.now()}`,
        ancienneteMois: 24,
        salaireBrut: 2000,
      },
    ]);
  }

  function remove(id: string) {
    setSalaries((prev) => prev.filter((s) => s.id !== id));
  }

  const total = useMemo(() => {
    let totalIndem = 0;
    let totalAgs = 0;
    let totalDepasse = 0;
    const lignes = salaries.map((s) => {
      const calc = calculIndemnite(s.ancienneteMois, s.salaireBrut);
      const plaf = plafondAgs(s.ancienneteMois);
      const couvert = Math.min(calc.montant, plaf);
      const depasse = Math.max(0, calc.montant - plaf);
      totalIndem += calc.montant;
      totalAgs += couvert;
      totalDepasse += depasse;
      return { s, calc, plafond: plaf, couvert, depasse };
    });
    return { lignes, totalIndem, totalAgs, totalDepasse };
  }, [salaries]);

  return (
    <section className="mx-auto max-w-4xl px-5 py-10">
      <Link
        href="/outils"
        className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy"
      >
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Indemnité de licenciement économique + AGS
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Estimez le coût d&apos;un licenciement économique selon les
        barèmes légaux. Le calcul applique la formule de l&apos;article
        L1234-9 et L1234-1 du Code du travail. Les plafonds AGS 2025
        permettent de voir ce qui est couvert en cas de procédure.
      </p>

      <div className="glass mt-8 p-6 sm:p-8">
        <div className="space-y-4">
          {salaries.map((s, i) => {
            const ligne = total.lignes[i];
            return (
              <div key={s.id} className="rounded-2xl border border-navy/10 bg-white/60 p-4">
                <div className="flex items-start justify-between">
                  <p className="font-display text-base text-navy">
                    Salarié {i + 1}
                  </p>
                  {salaries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(s.id)}
                      className="text-xs text-navy/40 hover:text-rouge"
                    >
                      ✕ retirer
                    </button>
                  )}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs text-navy/70">
                    Ancienneté (en mois)
                    <input
                      type="number"
                      min={0}
                      value={s.ancienneteMois}
                      onChange={(e) => update(s.id, 'ancienneteMois', Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
                    />
                    <span className="mt-1 block text-[11px] text-navy/55">
                      = {(s.ancienneteMois / 12).toFixed(1)} années. Indemnité due à partir de 8 mois (L1234-9).
                    </span>
                  </label>
                  <label className="block text-xs text-navy/70">
                    Salaire brut mensuel de référence (€)
                    <input
                      type="number"
                      min={0}
                      value={s.salaireBrut}
                      onChange={(e) => update(s.id, 'salaireBrut', Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
                    />
                    <span className="mt-1 block text-[11px] text-navy/55">
                      Moyenne des 12 ou 3 derniers mois (la plus favorable au salarié).
                    </span>
                  </label>
                </div>

                {ligne && s.ancienneteMois >= 8 && (
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                    <div className="rounded-xl bg-bleu/5 p-3">
                      <p className="text-[11px] uppercase text-navy/55">Indemnité due</p>
                      <p className="mt-1 font-display text-lg text-navy">{formatEuros(ligne.calc.montant)}</p>
                    </div>
                    <div className="rounded-xl bg-vert/5 p-3">
                      <p className="text-[11px] uppercase text-navy/55">Couverte par AGS</p>
                      <p className="mt-1 font-display text-lg text-vert">{formatEuros(ligne.couvert)}</p>
                      <p className="mt-1 text-[11px] text-navy/50">
                        Plafond : {formatEuros(ligne.plafond)}
                      </p>
                    </div>
                    {ligne.depasse > 0 && (
                      <div className="rounded-xl bg-rouge/5 p-3">
                        <p className="text-[11px] uppercase text-navy/55">Reste à charge</p>
                        <p className="mt-1 font-display text-lg text-rouge">{formatEuros(ligne.depasse)}</p>
                      </div>
                    )}
                  </div>
                )}
                {s.ancienneteMois < 8 && (
                  <p className="mt-3 rounded-xl bg-jaune/10 p-3 text-xs text-navy/70">
                    Pas d&apos;indemnité légale de licenciement (ancienneté &lt; 8 mois requise par L1234-9).
                    Une convention collective peut prévoir un seuil inférieur.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={add}
          className="mt-4 rounded-full border border-navy/20 px-4 py-2 text-sm text-navy/80 hover:bg-white"
        >
          + Ajouter un salarié
        </button>

        {salaries.length >= 1 && total.totalIndem > 0 && (
          <div className="mt-6 rounded-2xl border border-navy/10 bg-white/70 p-5">
            <p className="font-display text-lg text-navy">Total équipe</p>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase text-navy/55">Indemnité totale due</p>
                <p className="font-display text-2xl text-navy">{formatEuros(total.totalIndem)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-navy/55">Couvert AGS (en RJ/LJ)</p>
                <p className="font-display text-2xl text-vert">{formatEuros(total.totalAgs)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-navy/55">Reste à votre charge</p>
                <p className={`font-display text-2xl ${total.totalDepasse > 0 ? 'text-rouge' : 'text-vert'}`}>
                  {formatEuros(total.totalDepasse)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">À savoir</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            <strong>Préavis</strong> : 1 mois (6 mois à 2 ans d&apos;ancienneté), 2 mois (&gt; 2 ans). Indemnisé en plus si dispense.
          </li>
          <li>
            <strong>Congés payés non pris</strong> : à indemniser en plus.
          </li>
          <li>
            <strong>Plafond AGS 2025</strong> : 4 PMSS si entreprise &lt; 6 mois ou contrat &lt; 6 mois ({formatEuros(PLAFOND_AGS_BAS)}), 5 PMSS si 6 mois à 2 ans ({formatEuros(PLAFOND_AGS_INTER)}), 6 PMSS au-delà ({formatEuros(PLAFOND_AGS_HAUT)}).
          </li>
          <li>
            <strong>PSE</strong> obligatoire si licenciement de 10+ salariés sur 30 jours dans une entreprise de 50+ salariés (L1233-61).
          </li>
          <li>
            <strong>Convention collective</strong> : peut prévoir une indemnité plus favorable. Vérifiez votre IDCC.
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Sources : Code du travail, art. L1234-1 (préavis), L1234-9 et R1234-2 (indemnité), L1233-61 (PSE) ; ags-garantie-salaires.org
        (plafonds AGS 2025).
      </p>
    </section>
  );
}
