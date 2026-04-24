'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

type RegimeTVA = 'franchise' | 'reel-mensuel' | 'reel-trimestriel' | 'mini-reel';
type RegimeIS = 'is' | 'ir-bic' | 'ir-bnc' | 'micro';
type ExerciceFin = 'dec' | 'juin' | 'sept';

interface Echeance {
  date: Date;
  titre: string;
  description: string;
  categorie: 'TVA' | 'IS' | 'IR' | 'CFE' | 'CVAE' | 'URSSAF' | 'DSN' | 'Comptes' | 'Taxes';
  source: string;
}

function joursAvant(base: Date, nb: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() - nb);
  return d;
}

function dateAt(year: number, month: number, day: number): Date {
  return new Date(year, month, day);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function buildEcheances(
  tva: RegimeTVA,
  is: RegimeIS,
  fin: ExerciceFin,
  salaries: boolean,
  proprietaire: boolean
): Echeance[] {
  const now = new Date();
  const y = now.getFullYear();
  const items: Echeance[] = [];

  // TVA mensuelle : le 19 de chaque mois (ou 24 selon dép.) — source BOFiP
  if (tva === 'reel-mensuel') {
    for (let m = 0; m < 12; m++) {
      items.push({
        date: dateAt(y, m, 19),
        titre: `Déclaration et paiement TVA mensuelle`,
        description: `TVA collectée sur les opérations du mois précédent. Télédéclaration obligatoire (impots.gouv.fr).`,
        categorie: 'TVA',
        source: 'BOI-TVA-DECLA-20-10-10',
      });
    }
  } else if (tva === 'reel-trimestriel') {
    [3, 6, 9, 11].forEach((m) => {
      items.push({
        date: dateAt(y, m, 19),
        titre: `Déclaration TVA trimestrielle`,
        description: 'Quand la TVA exigible annuelle est < 4 000 €.',
        categorie: 'TVA',
        source: 'BOI-TVA-DECLA-20-10-10',
      });
    });
  } else if (tva === 'mini-reel') {
    // Mini-réel : acomptes en avril et juillet, régularisation mai N+1
    items.push({
      date: dateAt(y, 3, 30),
      titre: "Acompte TVA (régime réel simplifié)",
      description: '55 % de la TVA due au titre de l\'exercice précédent.',
      categorie: 'TVA',
      source: 'BOI-TVA-DECLA-20-20',
    });
    items.push({
      date: dateAt(y, 6, 31),
      titre: 'Acompte TVA (régime réel simplifié)',
      description: '40 % de la TVA due au titre de l\'exercice précédent.',
      categorie: 'TVA',
      source: 'BOI-TVA-DECLA-20-20',
    });
  }

  // IS : 4 acomptes + solde
  // Source : BOI-IS-DECLA-20
  if (is === 'is') {
    const mois = [2, 5, 8, 11]; // 15 mars, 15 juin, 15 sept, 15 déc.
    const labels = ['15 mars', '15 juin', '15 septembre', '15 décembre'];
    mois.forEach((m, i) => {
      items.push({
        date: dateAt(y, m, 15),
        titre: `Acompte IS n°${i + 1}`,
        description: `Paiement de 25 % de l'IS de l'année précédente (ou calcul sur bénéfice prévisionnel si baisse). Échéance : ${labels[i]}.`,
        categorie: 'IS',
        source: 'CGI art. 1668 · BOI-IS-DECLA-20',
      });
    });
    // Solde IS : 15 mai (si clôture 31 déc.) / 15 du 4e mois après clôture
    if (fin === 'dec') {
      items.push({
        date: dateAt(y, 4, 15),
        titre: 'Solde IS',
        description: "Paiement du solde de l'IS de l'exercice précédent après déduction des acomptes.",
        categorie: 'IS',
        source: 'CGI art. 1668',
      });
      items.push({
        date: dateAt(y, 4, 18),
        titre: 'Télétransmission liasse fiscale (formulaire 2065)',
        description: "Dépôt de la liasse fiscale 2065 et annexes.",
        categorie: 'IS',
        source: 'CGI art. 223',
      });
    }
  }

  // IR micro ou BIC/BNC : déclaration de revenus en mai/juin
  if (is === 'ir-bic' || is === 'ir-bnc' || is === 'micro') {
    items.push({
      date: dateAt(y, 4, 20),
      titre: 'Déclaration de revenus n°2042 + annexes pro',
      description: 'Déclaration IR (n°2042 + n°2042-C-PRO pour BIC/BNC/micro). Dates variables selon zone (mai-juin).',
      categorie: 'IR',
      source: 'impots.gouv.fr',
    });
  }

  // CFE : 15 décembre
  items.push({
    date: dateAt(y, 11, 15),
    titre: 'Cotisation Foncière des Entreprises (CFE)',
    description: 'Solde CFE annuel. Avis disponible sur l\'espace professionnel impots.gouv.fr.',
    categorie: 'CFE',
    source: 'CGI art. 1447 et s.',
  });
  items.push({
    date: dateAt(y, 5, 15),
    titre: 'Acompte CFE (si CFE > 3 000 €)',
    description: '50 % de la CFE de l\'année précédente.',
    categorie: 'CFE',
    source: 'CGI art. 1679 quinquies',
  });

  // CVAE : supprimée progressivement, dernière échéance en 2026.
  items.push({
    date: dateAt(y, 4, 4),
    titre: 'Déclaration CVAE n°1330-CVAE',
    description: 'Cotisation sur la Valeur Ajoutée des Entreprises. Supprimée progressivement (fin prévue en 2026/27).',
    categorie: 'CVAE',
    source: 'CGI art. 1586 ter',
  });

  // URSSAF pour indépendants : prélèvement mensuel ou trimestriel
  // DSN pour employeurs : le 5 ou 15 du mois suivant
  if (salaries) {
    for (let m = 0; m < 12; m++) {
      items.push({
        date: dateAt(y, m, 15),
        titre: 'DSN mensuelle',
        description: 'Déclaration Sociale Nominative : cotisations sociales et déclarations diverses du mois précédent.',
        categorie: 'DSN',
        source: 'Code de la Sécu art. L133-5-3 · net-entreprises.fr',
      });
    }
  } else {
    // URSSAF indépendants
    items.push({
      date: dateAt(y, 4, 5),
      titre: "Déclaration URSSAF indépendant (DSI dématérialisée)",
      description: "Déclaration annuelle des revenus professionnels. Calcul des cotisations sociales définitives.",
      categorie: 'URSSAF',
      source: 'CSS art. L131-6',
    });
  }

  // Dépôt comptes annuels : au greffe dans les 7 mois après clôture (+1 mois si assemblée à distance)
  if (fin === 'dec') {
    items.push({
      date: dateAt(y, 6, 31),
      titre: 'Dépôt des comptes annuels au greffe',
      description: "Obligatoire dans les 7 mois (8 mois si dépôt dématérialisé) suivant la clôture. Sanctions pénales et civiles en cas de défaut.",
      categorie: 'Comptes',
      source: 'C. com. art. L232-21 à L232-23',
    });
  }

  // Taxe foncière : 15 octobre (si propriétaire des locaux)
  if (proprietaire) {
    items.push({
      date: dateAt(y, 9, 15),
      titre: 'Taxe foncière (locaux professionnels)',
      description: 'Payable à l\'échéance unique du 15 octobre (ou 20 si paiement en ligne).',
      categorie: 'Taxes',
      source: 'CGI art. 1380 et s.',
    });
  }

  // Filtrer uniquement les échéances futures + tri chronologique
  const futures = items.filter((e) => e.date.getTime() >= joursAvant(new Date(), 3).getTime());
  futures.sort((a, b) => a.date.getTime() - b.date.getTime());
  return futures;
}

const CATEGORIE_STYLES: Record<Echeance['categorie'], string> = {
  TVA: 'bg-bleu/10 text-bleu-fonce',
  IS: 'bg-jaune/15 text-jaune',
  IR: 'bg-jaune/15 text-jaune',
  CFE: 'bg-vert/10 text-vert',
  CVAE: 'bg-vert/10 text-vert',
  URSSAF: 'bg-rouge/10 text-rouge',
  DSN: 'bg-rouge/10 text-rouge',
  Comptes: 'bg-navy/10 text-navy',
  Taxes: 'bg-jaune/15 text-jaune',
};

export default function CalendrierFiscalPage() {
  const [tva, setTva] = useState<RegimeTVA>('reel-mensuel');
  const [is, setIs] = useState<RegimeIS>('is');
  const [fin, setFin] = useState<ExerciceFin>('dec');
  const [salaries, setSalaries] = useState(false);
  const [proprietaire, setProprietaire] = useState(false);

  const echeances = useMemo(() => buildEcheances(tva, is, fin, salaries, proprietaire), [tva, is, fin, salaries, proprietaire]);

  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/outils" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Calendrier fiscal et social
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Les prochaines échéances déclaratives et de paiement selon votre
        régime. Dates issues du Bulletin Officiel des Finances Publiques
        (BOFiP) et du Code général des impôts.
      </p>

      <div className="glass mt-8 space-y-4 p-6 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-navy">
            Régime TVA
            <select
              value={tva}
              onChange={(e) => setTva(e.target.value as RegimeTVA)}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            >
              <option value="franchise">Franchise en base (pas de TVA)</option>
              <option value="reel-mensuel">Réel normal mensuel</option>
              <option value="reel-trimestriel">Réel normal trimestriel</option>
              <option value="mini-reel">Réel simplifié (acomptes semestriels)</option>
            </select>
          </label>
          <label className="block text-sm text-navy">
            Régime fiscal
            <select
              value={is}
              onChange={(e) => setIs(e.target.value as RegimeIS)}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            >
              <option value="is">Impôt sur les Sociétés (IS)</option>
              <option value="ir-bic">IR · BIC (commerçants, artisans)</option>
              <option value="ir-bnc">IR · BNC (professions libérales)</option>
              <option value="micro">Micro-entreprise / micro-BIC / micro-BNC</option>
            </select>
          </label>
          <label className="block text-sm text-navy">
            Clôture d&apos;exercice
            <select
              value={fin}
              onChange={(e) => setFin(e.target.value as ExerciceFin)}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            >
              <option value="dec">31 décembre</option>
              <option value="juin">30 juin</option>
              <option value="sept">30 septembre</option>
            </select>
          </label>
          <div className="flex flex-col gap-2 pt-5 text-sm text-navy">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={salaries} onChange={(e) => setSalaries(e.target.checked)} className="h-4 w-4" />
              J&apos;ai des salariés (DSN)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={proprietaire} onChange={(e) => setProprietaire(e.target.checked)} className="h-4 w-4" />
              Je suis propriétaire des locaux (taxe foncière)
            </label>
          </div>
        </div>

        <div className="border-t border-navy/10 pt-4">
          <p className="mb-3 font-display text-base text-navy">
            Prochaines échéances ({echeances.length})
          </p>
          <ol className="space-y-2">
            {echeances.map((e, i) => {
              const today = new Date();
              const diff = Math.ceil((e.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              const urgent = diff <= 15 && diff >= 0;
              return (
                <li
                  key={i}
                  className={`flex items-start gap-3 rounded-xl border p-3 ${
                    urgent ? 'border-rouge/40 bg-rouge/5' : 'border-navy/10 bg-white/60'
                  }`}
                >
                  <div className="shrink-0 text-center">
                    <p className="font-display text-lg text-navy">{e.date.getDate()}</p>
                    <p className="text-[10px] uppercase text-navy/50">
                      {e.date.toLocaleDateString('fr-FR', { month: 'short' })}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-navy">{e.titre}</p>
                      <span className={`pastille text-[10px] ${CATEGORIE_STYLES[e.categorie]}`}>{e.categorie}</span>
                      {urgent && (
                        <span className="pastille bg-rouge/20 text-[10px] text-rouge">
                          J-{diff}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-navy/70">{e.description}</p>
                    <p className="mt-1 text-[11px] text-navy/50">Source : {e.source}</p>
                  </div>
                </li>
              );
            })}
            {echeances.length === 0 && (
              <li className="rounded-xl bg-white/60 p-4 text-sm text-navy/60">
                Aucune échéance détectée avec ces paramètres.
              </li>
            )}
          </ol>
        </div>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Calendrier indicatif basé sur les dates-type. Les échéances peuvent
        varier selon votre département (décalage de quelques jours pour la
        TVA), votre IDCC et des circulaires annuelles DGFiP. Vérifiez sur{' '}
        <a href="https://www.impots.gouv.fr/professionnel/calendrier-fiscal" target="_blank" rel="noreferrer" className="text-bleu-fonce underline">
          impots.gouv.fr
        </a>.
      </p>
    </section>
  );
}
