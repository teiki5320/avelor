import { describe, it, expect } from 'vitest';
import { getTonePreset, isMoralFragile } from '../tone';
import type { TonePreset } from '../tone';

/* ─── getTonePreset ─── */

describe('getTonePreset', () => {
  const champsAttendus: (keyof TonePreset)[] = [
    'intro',
    'pace',
    'urgenceLabel',
    'prioritizeSelfCare',
    'rappel',
  ];

  it('retourne un preset pour combatif avec tous les champs', () => {
    const preset = getTonePreset('combatif');
    for (const champ of champsAttendus) {
      expect(preset).toHaveProperty(champ);
    }
    expect(preset.prioritizeSelfCare).toBe(false);
  });

  it('retourne un preset pour epuise avec prioritizeSelfCare = true', () => {
    const preset = getTonePreset('epuise');
    for (const champ of champsAttendus) {
      expect(preset).toHaveProperty(champ);
    }
    expect(preset.prioritizeSelfCare).toBe(true);
  });

  it('retourne un preset pour perdu avec prioritizeSelfCare = true', () => {
    const preset = getTonePreset('perdu');
    for (const champ of champsAttendus) {
      expect(preset).toHaveProperty(champ);
    }
    expect(preset.prioritizeSelfCare).toBe(true);
  });

  it('retourne le fallback (combatif) quand moral est undefined', () => {
    const preset = getTonePreset(undefined);
    const combatif = getTonePreset('combatif');
    expect(preset).toEqual(combatif);
  });

  it('chaque preset a un intro et un rappel non-vides', () => {
    for (const moral of ['combatif', 'epuise', 'perdu'] as const) {
      const preset = getTonePreset(moral);
      expect(preset.intro.length).toBeGreaterThan(10);
      expect(preset.rappel.length).toBeGreaterThan(10);
    }
  });
});

/* ─── isMoralFragile ─── */

describe('isMoralFragile', () => {
  it('retourne true pour epuise', () => {
    expect(isMoralFragile('epuise')).toBe(true);
  });

  it('retourne true pour perdu', () => {
    expect(isMoralFragile('perdu')).toBe(true);
  });

  it('retourne false pour combatif', () => {
    expect(isMoralFragile('combatif')).toBe(false);
  });

  it('retourne false pour undefined', () => {
    expect(isMoralFragile(undefined)).toBe(false);
  });
});
