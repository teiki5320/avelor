import type { ReactNode } from 'react';
import type { Reponses, CompanyData } from './types';
import type { SectorInfo, EffectifSeuils } from './secteur';
import { resolveStrategie, AXE_META } from './strategie';

export type Tone = 'rouge' | 'jaune' | 'bleu' | 'vert' | 'navy';

export interface PriorityCardData {
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

export const TONES: Record<Tone, { bg: string; border: string; accent: string; text: string; hover: string }> = {
  rouge: { bg: 'bg-rouge/5', border: 'border-rouge/30', accent: 'bg-rouge', text: 'text-rouge', hover: 'hover:bg-rouge/10' },
  jaune: { bg: 'bg-jaune/10', border: 'border-jaune/40', accent: 'bg-jaune', text: 'text-jaune', hover: 'hover:bg-jaune/15' },
  bleu: { bg: 'bg-bleu/5', border: 'border-bleu/30', accent: 'bg-bleu-fonce', text: 'text-bleu-fonce', hover: 'hover:bg-bleu/10' },
  vert: { bg: 'bg-vert/5', border: 'border-vert/30', accent: 'bg-vert', text: 'text-vert', hover: 'hover:bg-vert/10' },
  navy: { bg: 'bg-white/70', border: 'border-navy/15', accent: 'bg-navy', text: 'text-navy', hover: 'hover:bg-white' },
};

export interface BuildCardsProps {
  reponses: Reponses;
  company: CompanyData;
  sector: SectorInfo;
  seuils: EffectifSeuils;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 140;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Construit les PriorityCards brutes (sans JSX expandedContent).
 * Le JSX est injecté par le composant appelant via buildExpandedContent.
 * Ici on ne retourne que les data de scoring + metadata par carte.
 */
export interface PriorityCardMeta {
  id: string;
  icone: string;
  label: string;
  valeur: string;
  detail: string;
  tone: Tone;
  scrollTo?: string;
  score: number;
  /** Donnees supplementaires pour construire le contenu etendu */
  extra?: Record<string, unknown>;
}

export function scorePriorityCards({ reponses, company, sector, seuils }: BuildCardsProps): PriorityCardMeta[] {
  const cards: PriorityCardMeta[] = [];
  const ville = company.ville || 'votre ville';
  const dep = company.departement;

  // 1. Delai 45 jours cessation
  if (reponses.situation === 'redressement' || reponses.situation === 'assignation') {
    const score = reponses.situation === 'assignation' ? 11 : 10;
    cards.push({
      id: 'cessation',
      icone: '⏰',
      label: 'Delai legal',
      valeur: '45 jours',
      detail: 'Pour declarer la cessation des paiements',
      tone: 'rouge',
      scrollTo: 'echeances',
      score,
      extra: { ville },
    });
  }

  // 2. Audience a preparer (si assignation)
  if (reponses.situation === 'assignation') {
    cards.push({
      id: 'audience',
      icone: '⚖️',
      label: 'Audience',
      valeur: 'A preparer',
      detail: `Tribunal de commerce · ${ville}`,
      tone: 'rouge',
      scrollTo: 'echeances',
      score: 10,
    });
  }

  // 3. Strategie recommandee
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
      extra: { verdict: strat.main.verdict, etapes: strat.main.etapes },
    });
  }

  // 4. Cautions personnelles a auditer
  if (reponses.caution === 'oui') {
    cards.push({
      id: 'cautions',
      icone: '🛡️',
      label: 'Cautions',
      valeur: 'A auditer',
      detail: 'Risque patrimonial personnel',
      tone: 'jaune',
      scrollTo: 'patrimoine',
      score: 9,
    });
  }

  // 5. Tresorerie
  if (reponses.situation === 'tresorie' || reponses.situation === 'redressement' || reponses.probleme === 'banque') {
    cards.push({
      id: 'tresorerie',
      icone: '📊',
      label: 'Tresorerie',
      valeur: 'A projeter',
      detail: 'Horizon 6 mois',
      tone: 'jaune',
      scrollTo: 'echeances',
      score: 7,
    });
  }

  // 6. Patrimoine
  if (reponses.patrimoine === 'proprietaire') {
    const score = reponses.caution === 'oui' ? 7 : 5;
    cards.push({
      id: 'patrimoine',
      icone: '🏠',
      label: 'Patrimoine',
      valeur: 'Proprietaire',
      detail: reponses.regime === 'separation' ? 'Conjoint protege' : reponses.regime === 'communaute' ? 'Conjoint expose' : 'A analyser',
      tone: 'jaune',
      scrollTo: 'patrimoine',
      score,
    });
  }

  // 7. Soutien humain
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
    extra: { sectorSoutien: sector.soutien },
  });

  // 8. Aides disponibles
  const scoreAides = reponses.probleme === 'urssaf' || reponses.probleme === 'impots' ? 6 : 4;
  cards.push({
    id: 'aides',
    icone: '💶',
    label: 'Aides',
    valeur: 'Disponibles',
    detail: reponses.probleme === 'urssaf' ? 'URSSAF + CCSF + BPI' : reponses.probleme === 'impots' ? 'SIE + CCSF + CODEFI' : reponses.probleme === 'banque' ? 'Mediation credit' : 'Plusieurs leviers',
    tone: 'bleu',
    scrollTo: 'aides',
    score: scoreAides,
    extra: { dep, probleme: reponses.probleme },
  });

  // 9. Bail commercial
  const secteursBail = ['hotellerie', 'commerce', 'artisanat', 'liberal', 'sante'];
  if (secteursBail.includes(sector.secteur)) {
    cards.push({
      id: 'bail',
      icone: '🔑',
      label: 'Bail commercial',
      valeur: 'Leviers dispo',
      detail: '7 dispositifs legaux',
      tone: 'bleu',
      scrollTo: 'aides',
      score: 5,
    });
  }

  // 10. Obligations effectif
  if (reponses.effectif === 'salaries' && seuils.approx >= 11) {
    cards.push({
      id: 'obligations',
      icone: '📐',
      label: 'Obligations',
      valeur: `${seuils.approx}+ salaries`,
      detail: seuils.obligations50 ? 'CSE + PSE + participation' : 'CSE requis',
      tone: 'navy',
      scrollTo: 'aides',
      score: 4,
      extra: { obligations50: seuils.obligations50 },
    });
  }

  return cards.sort((a, b) => b.score - a.score).slice(0, 4);
}
