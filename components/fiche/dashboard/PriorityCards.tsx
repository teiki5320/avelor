'use client';
import { useState, useMemo, type ReactNode } from 'react';
import type { Reponses, CompanyData } from '@/lib/types';
import type { SectorInfo, EffectifSeuils } from '@/lib/secteur';
import { resolveStrategie, AXE_META } from '@/lib/strategie';

interface Props {
  reponses: Reponses;
  company: CompanyData;
  sector: SectorInfo;
  seuils: EffectifSeuils;
}

type Tone = 'rouge' | 'jaune' | 'bleu' | 'vert' | 'navy';

interface PriorityCard {
  id: string;
  icone: string;
  label: string;
  valeur: string;
  detail: string;
  tone: Tone;
  scrollTo?: string;
  expandedContent: ReactNode;
  score: number;
}

const TONES: Record<Tone, { bg: string; border: string; accent: string; text: string; hover: string }> = {
  rouge: { bg: 'bg-rouge/5', border: 'border-rouge/30', accent: 'bg-rouge', text: 'text-rouge', hover: 'hover:bg-rouge/10' },
  jaune: { bg: 'bg-jaune/10', border: 'border-jaune/40', accent: 'bg-jaune', text: 'text-jaune', hover: 'hover:bg-jaune/15' },
  bleu: { bg: 'bg-bleu/5', border: 'border-bleu/30', accent: 'bg-bleu-fonce', text: 'text-bleu-fonce', hover: 'hover:bg-bleu/10' },
  vert: { bg: 'bg-vert/5', border: 'border-vert/30', accent: 'bg-vert', text: 'text-vert', hover: 'hover:bg-vert/10' },
  navy: { bg: 'bg-white/70', border: 'border-navy/15', accent: 'bg-navy', text: 'text-navy', hover: 'hover:bg-white' },
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 140;
  window.scrollTo({ top, behavior: 'smooth' });
}

function buildCards({ reponses, company, sector, seuils }: Props): PriorityCard[] {
  const cards: PriorityCard[] = [];
  const ville = company.ville || 'votre ville';
  const dep = company.departement;

  // 1. Délai 45 jours cessation — TOP PRIORITY si redressement/assignation
  if (reponses.situation === 'redressement' || reponses.situation === 'assignation') {
    const score = reponses.situation === 'assignation' ? 11 : 10;
    cards.push({
      id: 'cessation',
      icone: '⏰',
      label: 'Délai légal',
      valeur: '45 jours',
      detail: 'Pour déclarer la cessation des paiements',
      tone: 'rouge',
      scrollTo: 'echeances',
      score,
      expandedContent: (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            L&apos;article <strong>L631-4 du Code de commerce</strong> vous
            impose de déclarer la cessation dans les 45 jours suivant son
            constat. Au-delà : responsabilité personnelle, faillite
            personnelle, voire banqueroute (L651-2, L653-1, L654-1).
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>Consulter un avocat / mandataire judiciaire</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Préparer le formulaire CERFA 10530</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Rassembler K-bis, passif, actif, trésorerie</li>
          </ul>
          <button
            type="button"
            onClick={() => scrollToId('echeances')}
            className="inline-flex text-sm font-medium text-rouge hover:underline"
          >
            Voir le décompte complet ↓
          </button>
        </div>
      ),
    });
  }

  // 2. Audience à préparer (si assignation)
  if (reponses.situation === 'assignation') {
    cards.push({
      id: 'audience',
      icone: '⚖️',
      label: 'Audience',
      valeur: 'À préparer',
      detail: `Tribunal de commerce · ${ville}`,
      tone: 'rouge',
      scrollTo: 'echeances',
      score: 10,
      expandedContent: (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Une assignation impose des délais stricts. Le tribunal rend sa
            décision généralement sous 15 à 45 jours.
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>Avocat en droit des entreprises en difficulté (urgent)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Préparer bilan, trésorerie, liste créanciers</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Décider : RJ, plan de cession, liquidation ?</li>
          </ul>
          <button
            type="button"
            onClick={() => scrollToId('echeances')}
            className="inline-flex text-sm font-medium text-rouge hover:underline"
          >
            Voir la timeline juridique ↓
          </button>
        </div>
      ),
    });
  }

  // 3. Stratégie recommandée
  const strat = resolveStrategie(reponses, company);
  if (strat) {
    const meta = AXE_META[strat.main.axe];
    cards.push({
      id: 'strategie',
      icone: meta.icone,
      label: 'Votre cap',
      valeur: meta.label,
      detail: strat.main.titre,
      tone: 'bleu',
      scrollTo: 'vue-ensemble',
      score: 8,
      expandedContent: (
        <div className="space-y-3 text-sm text-navy/80">
          <p>{strat.main.verdict}</p>
          <div>
            <p className="font-display text-xs uppercase tracking-wide text-navy/55">Prochaines étapes</p>
            <ol className="mt-1 space-y-1.5">
              {strat.main.etapes.slice(0, 3).map((e, i) => (
                <li key={i} className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bleu-fonce text-[10px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span>{e}</span>
                </li>
              ))}
            </ol>
          </div>
          <button
            type="button"
            onClick={() => scrollToId('vue-ensemble')}
            className="inline-flex text-sm font-medium text-bleu-fonce hover:underline"
          >
            Voir la stratégie complète ↓
          </button>
        </div>
      ),
    });
  }

  // 4. Cautions personnelles à auditer
  if (reponses.caution === 'oui') {
    cards.push({
      id: 'cautions',
      icone: '🛡️',
      label: 'Cautions',
      valeur: 'À auditer',
      detail: 'Risque patrimonial personnel',
      tone: 'jaune',
      scrollTo: 'patrimoine',
      score: 9,
      expandedContent: (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Les cautions personnelles sont <strong>la porte d&apos;entrée
            principale vers le patrimoine du dirigeant</strong>. Mais
            beaucoup peuvent être contestées (disproportion, vice de
            forme).
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>Demander copie de chaque acte de cautionnement</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Tester la disproportion au moment de la signature (art. L341-4 C. conso)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Consulter un avocat en droit bancaire</li>
          </ul>
          <button
            type="button"
            onClick={() => scrollToId('patrimoine')}
            className="inline-flex text-sm font-medium text-jaune hover:underline"
          >
            Lancer l&apos;audit caution ↓
          </button>
        </div>
      ),
    });
  }

  // 5. Trésorerie — pertinent si tresorie, banque, ou redressement
  if (reponses.situation === 'tresorie' || reponses.situation === 'redressement' || reponses.probleme === 'banque') {
    cards.push({
      id: 'tresorerie',
      icone: '📊',
      label: 'Trésorerie',
      valeur: 'À projeter',
      detail: 'Horizon 6 mois',
      tone: 'jaune',
      scrollTo: 'echeances',
      score: 7,
      expandedContent: (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Votre capacité à tenir à 6 mois détermine la stratégie
            possible. Renseignez 4 chiffres dans le bloc Trésorerie :
            solde, entrées/sorties, dette exigible.
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>Prévisionnel avec votre expert-comptable</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Médiation du crédit (Banque de France, gratuit)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Moratoire URSSAF / SIE / bailleur</li>
          </ul>
          <button
            type="button"
            onClick={() => scrollToId('echeances')}
            className="inline-flex text-sm font-medium text-jaune hover:underline"
          >
            Projeter ma trésorerie ↓
          </button>
        </div>
      ),
    });
  }

  // 6. Patrimoine — si propriétaire + régime à risque
  if (reponses.patrimoine === 'proprietaire') {
    const score = reponses.caution === 'oui' ? 7 : 5;
    cards.push({
      id: 'patrimoine',
      icone: '🏠',
      label: 'Patrimoine',
      valeur: 'Propriétaire',
      detail: reponses.regime === 'separation' ? 'Conjoint protégé' : reponses.regime === 'communaute' ? 'Conjoint exposé' : 'À analyser',
      tone: 'jaune',
      scrollTo: 'patrimoine',
      score,
      expandedContent: (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Votre résidence principale et votre patrimoine méritent un
            audit rapide. Les protections dépendent de votre statut (EI
            vs société), de votre régime matrimonial et de vos cautions.
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>Insaisissabilité de droit (EI, loi Macron 2015)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Déclaration chez notaire si société</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Ne pas transférer d&apos;actifs (action paulienne)</li>
          </ul>
          <button
            type="button"
            onClick={() => scrollToId('patrimoine')}
            className="inline-flex text-sm font-medium text-jaune hover:underline"
          >
            Voir la cartographie ↓
          </button>
        </div>
      ),
    });
  }

  // 7. Soutien humain (toujours pertinent, score plus haut si moral fragile)
  const moralFragile = reponses.moral === 'epuise' || reponses.moral === 'perdu';
  cards.push({
    id: 'soutien',
    icone: '🤝',
    label: 'Soutien',
    valeur: 'Gratuit · 24h/24',
    detail: sector.soutien ? sector.soutien.nom : 'APESA · 3114',
    tone: 'vert',
    scrollTo: 'vue-ensemble',
    score: moralFragile ? 9 : 4,
    expandedContent: (
      <div className="space-y-3 text-sm text-navy/80">
        <p>
          Vous n&apos;êtes pas seul·e. Parler, même 10 minutes, change la
          trajectoire. Les lignes ci-dessous sont tenues au secret
          professionnel.
        </p>
        <ul className="space-y-1.5">
          {sector.soutien && (
            <li className="flex gap-2">
              <span className="text-navy/40">→</span>
              <span>
                <strong>{sector.soutien.nom}</strong> — {sector.soutien.description}
                {sector.soutien.telephone && ` · ${sector.soutien.telephone}`}
              </span>
            </li>
          )}
          <li className="flex gap-2"><span className="text-navy/40">→</span><strong>APESA</strong> — soutien psychologique dirigeants · apesa.fr</li>
          <li className="flex gap-2"><span className="text-navy/40">→</span><strong>3114</strong> — prévention suicide, 24h/24, gratuit</li>
        </ul>
      </div>
    ),
  });

  // 8. Aides disponibles (score plus haut selon problème)
  const scoreAides = reponses.probleme === 'urssaf' || reponses.probleme === 'impots' ? 6 : 4;
  cards.push({
    id: 'aides',
    icone: '💶',
    label: 'Aides',
    valeur: 'Disponibles',
    detail: reponses.probleme === 'urssaf' ? 'URSSAF + CCSF + BPI' : reponses.probleme === 'impots' ? 'SIE + CCSF + CODEFI' : reponses.probleme === 'banque' ? 'Médiation crédit' : 'Plusieurs leviers',
    tone: 'bleu',
    scrollTo: 'aides',
    score: scoreAides,
    expandedContent: (
      <div className="space-y-3 text-sm text-navy/80">
        <p>
          Plusieurs dispositifs nationaux et locaux s&apos;offrent à vous
          selon votre problème. La CCSF (guichet unique fiscal+social) est
          souvent sous-utilisée.
        </p>
        <ul className="space-y-1.5">
          {(reponses.probleme === 'urssaf' || reponses.probleme === 'impots') && (
            <li className="flex gap-2"><span className="text-navy/40">→</span><strong>CCSF</strong> — échelonnement unique fiscal + social</li>
          )}
          <li className="flex gap-2"><span className="text-navy/40">→</span><strong>BPI Prêt rebond</strong> — 10 à 300 k€, sans garantie</li>
          <li className="flex gap-2"><span className="text-navy/40">→</span><strong>CIP</strong> — RDV gratuit confidentiel dans {dep ? `dép. ${dep}` : 'votre département'}</li>
        </ul>
        <button
          type="button"
          onClick={() => scrollToId('aides')}
          className="inline-flex text-sm font-medium text-bleu-fonce hover:underline"
        >
          Voir toutes les aides ↓
        </button>
      </div>
    ),
  });

  // 9. Bail commercial (si secteur avec local)
  const secteursBail = ['hotellerie', 'commerce', 'artisanat', 'liberal', 'sante'];
  if (secteursBail.includes(sector.secteur)) {
    cards.push({
      id: 'bail',
      icone: '🔑',
      label: 'Bail commercial',
      valeur: 'Leviers dispo',
      detail: '7 dispositifs légaux',
      tone: 'bleu',
      scrollTo: 'aides',
      score: 5,
      expandedContent: (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Le loyer pèse souvent 15 à 25 % des charges fixes. Le statut
            des baux commerciaux offre des leviers méconnus.
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>Suspension clause résolutoire (jusqu&apos;à 24 mois)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Résiliation triennale (préavis 6 mois)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Révision triennale à la baisse</li>
          </ul>
          <button
            type="button"
            onClick={() => scrollToId('aides')}
            className="inline-flex text-sm font-medium text-bleu-fonce hover:underline"
          >
            Voir les leviers bail ↓
          </button>
        </div>
      ),
    });
  }

  // 10. Obligations effectif (si salariés)
  if (reponses.effectif === 'salaries' && seuils.approx >= 11) {
    cards.push({
      id: 'obligations',
      icone: '📐',
      label: 'Obligations',
      valeur: `${seuils.approx}+ salariés`,
      detail: seuils.obligations50 ? 'CSE + PSE + participation' : 'CSE requis',
      tone: 'navy',
      scrollTo: 'aides',
      score: 4,
      expandedContent: (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Votre effectif déclenche des obligations sociales collectives
            à respecter pendant la période difficile.
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>CSE à informer-consulter (sous peine de délit d&apos;entrave)</li>
            {seuils.obligations50 && (
              <li className="flex gap-2"><span className="text-navy/40">→</span>PSE obligatoire si licenciement éco 10+ sur 30 j</li>
            )}
            <li className="flex gap-2"><span className="text-navy/40">→</span>AGS garantit les salaires en procédure collective</li>
          </ul>
          <button
            type="button"
            onClick={() => scrollToId('aides')}
            className="inline-flex text-sm font-medium text-navy hover:underline"
          >
            Voir les obligations détaillées ↓
          </button>
        </div>
      ),
    });
  }

  return cards.sort((a, b) => b.score - a.score).slice(0, 4);
}

export default function PriorityCards(props: Props) {
  const cards = useMemo(() => buildCards(props), [props]);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const t = TONES[c.tone];
          const isOpen = expanded === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setExpanded(isOpen ? null : c.id)}
              className={`relative overflow-hidden rounded-2xl border p-4 text-left transition ${t.bg} ${t.border} ${t.hover} ${
                isOpen ? 'ring-2 ring-navy/15' : ''
              }`}
              aria-expanded={isOpen}
              aria-controls={`panel-${c.id}`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${t.accent}`} aria-hidden />
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl leading-none" aria-hidden>{c.icone}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-navy/50">
                  {c.label}
                </span>
              </div>
              <p className={`mt-3 font-display text-xl leading-tight ${t.text} sm:text-2xl`}>
                {c.valeur}
              </p>
              <p className="mt-1 text-xs text-navy/65">{c.detail}</p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-navy/50">
                <span>{isOpen ? 'Replier' : 'Voir plus'}</span>
                <span aria-hidden className={`transition ${isOpen ? 'rotate-180' : ''}`}>↓</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Panneau détaillé qui s'affiche sous la grille */}
      {expanded && (() => {
        const card = cards.find((c) => c.id === expanded);
        if (!card) return null;
        const t = TONES[card.tone];
        return (
          <div
            id={`panel-${card.id}`}
            role="region"
            className={`rounded-2xl border p-5 ${t.bg} ${t.border}`}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl" aria-hidden>{card.icone}</span>
              <p className={`font-display text-base ${t.text}`}>
                {card.label} · {card.valeur}
              </p>
            </div>
            {card.expandedContent}
          </div>
        );
      })()}
    </section>
  );
}
