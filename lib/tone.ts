import type { Moral } from './types';

export interface TonePreset {
  /** Phrase d'accroche pour les blocs d'action / checklist. */
  intro: string;
  /** Sous-titre court, à mettre dans l'entête d'un bloc. */
  pace: string;
  /** Mot-clé d'urgence à utiliser (ex. "URGENT" vs "Important"). */
  urgenceLabel: string;
  /** True si on doit absolument prioriser l'action "soin" en tête de liste. */
  prioritizeSelfCare: boolean;
  /** Encouragement court à afficher en bas d'un bloc d'action. */
  rappel: string;
}

const PRESETS: Record<Moral, TonePreset> = {
  combatif: {
    intro:
      "Vous avez l'énergie pour avancer. Voici la séquence d'actions à mener — du plus urgent au plus structurant.",
    pace: 'à votre rythme',
    urgenceLabel: 'URGENT',
    prioritizeSelfCare: false,
    rappel:
      'Restez vigilant à votre énergie : un dirigeant épuisé décide moins bien.',
  },
  epuise: {
    intro:
      "On va y aller pas à pas. Pas tout en même temps. Cochez ce que vous arrivez à faire — chaque petit pas compte.",
    pace: 'sans pression — un pas à la fois',
    urgenceLabel: 'Prioritaire',
    prioritizeSelfCare: true,
    rappel:
      "Si vous n'avez l'énergie que pour une chose aujourd'hui, choisissez celle qui vous rapproche d'un être humain (APESA, médecin, proche).",
  },
  perdu: {
    intro:
      "On va clarifier ensemble. Lisez la liste, sans pression. Vous n'avez pas à tout faire seul·e — la première étape est souvent de parler à quelqu'un.",
    pace: 'on commence par le plus simple',
    urgenceLabel: 'À faire en premier',
    prioritizeSelfCare: true,
    rappel:
      "Si tout vous semble flou, commencez par appeler la CCI ou APESA : ils vous aideront à hiérarchiser.",
  },
};

const FALLBACK: TonePreset = PRESETS.combatif;

export function getTonePreset(moral?: Moral): TonePreset {
  if (!moral) return FALLBACK;
  return PRESETS[moral] ?? FALLBACK;
}

export function isMoralFragile(moral?: Moral): boolean {
  return moral === 'epuise' || moral === 'perdu';
}
