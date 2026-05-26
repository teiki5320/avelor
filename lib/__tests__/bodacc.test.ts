import { describe, it, expect } from 'vitest';
import { detectIncoherenceBodacc, computeAlertes } from '../bodacc';
import type { BodaccItem } from '../types';

/* ─── Helpers ─── */

function makeBodaccItem(overrides: Partial<BodaccItem> = {}): BodaccItem {
  return {
    type: 'Annonce',
    date: '2025-01-15',
    ...overrides,
  };
}

function recentDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function oldDate(daysAgo: number): string {
  return recentDate(daysAgo);
}

/* ─── detectIncoherenceBodacc ─── */

describe('detectIncoherenceBodacc', () => {
  it('retourne null quand il n\'y a aucune donnée et situation « prevention »', () => {
    const result = detectIncoherenceBodacc([], [], 'prevention');
    expect(result).toBeNull();
  });

  it('retourne null quand il n\'y a aucune donnée et situation « tresorie »', () => {
    const result = detectIncoherenceBodacc([], [], 'tresorie');
    expect(result).toBeNull();
  });

  it('alerte rouge : prévention + procédure publiée', () => {
    const infogreffe = [makeBodaccItem({ type: 'procédure collective', date: '2025-06-01' })];
    const result = detectIncoherenceBodacc([], infogreffe, 'prevention');
    expect(result).not.toBeNull();
    expect(result!.niveau).toBe('rouge');
    expect(result!.titre).toContain('procédure');
  });

  it('alerte jaune : assignation sans annonce récente au BODACC', () => {
    const result = detectIncoherenceBodacc([], [], 'assignation');
    expect(result).not.toBeNull();
    expect(result!.niveau).toBe('jaune');
    expect(result!.titre).toContain('pas encore publiée');
  });

  it('pas d\'alerte assignation quand un signal juridique récent existe', () => {
    const bodacc = [makeBodaccItem({ type: 'procédure', date: recentDate(30) })];
    const result = detectIncoherenceBodacc(bodacc, [], 'assignation');
    expect(result).toBeNull();
  });

  it('alerte jaune : redressement déclaré sans procédure publiée', () => {
    const result = detectIncoherenceBodacc([], [], 'redressement');
    expect(result).not.toBeNull();
    expect(result!.niveau).toBe('jaune');
    expect(result!.titre).toContain('Aucune procédure');
  });

  it('alerte verte : BODACC ancien (> 1 an) en situation non critique', () => {
    const bodacc = [makeBodaccItem({ type: 'Annonce', date: oldDate(400) })];
    const result = detectIncoherenceBodacc(bodacc, [], 'tresorie');
    expect(result).not.toBeNull();
    expect(result!.niveau).toBe('vert');
    expect(result!.titre).toContain('ancienne');
  });

  it('pas d\'alerte verte si BODACC ancien et situation assignation', () => {
    // Le cas 2 (assignation) prend priorité
    const bodacc = [makeBodaccItem({ type: 'Annonce', date: oldDate(400) })];
    const result = detectIncoherenceBodacc(bodacc, [], 'assignation');
    // En assignation, le cas 2 retourne une alerte jaune (pas encore publiée)
    expect(result).not.toBeNull();
    expect(result!.niveau).toBe('jaune');
  });
});

/* ─── computeAlertes ─── */

describe('computeAlertes', () => {
  it('retourne toujours exactement 3 alertes maximum', () => {
    const alertes = computeAlertes([], [], 'prevention');
    expect(alertes.length).toBeLessThanOrEqual(3);
    expect(alertes.length).toBeGreaterThanOrEqual(1);
  });

  it('inclut toujours l\'alerte verte « Vous avez fait le premier pas »', () => {
    const alertes = computeAlertes([], [], 'prevention');
    const positive = alertes.find((a) => a.titre.includes('premier pas'));
    expect(positive).toBeDefined();
    expect(positive!.niveau).toBe('vert');
  });

  it('signale une procédure détectée pour redressement', () => {
    const alertes = computeAlertes([], [], 'redressement');
    const proc = alertes.find((a) => a.titre.includes('Procédure') || a.titre.includes('procédure'));
    expect(proc).toBeDefined();
  });

  it('signale une annonce récente au BODACC', () => {
    const bodacc = [makeBodaccItem({ date: recentDate(30) })];
    const alertes = computeAlertes(bodacc, [], 'prevention');
    const recente = alertes.find((a) => a.titre.includes('récente'));
    expect(recente).toBeDefined();
    expect(recente!.niveau).toBe('jaune');
  });

  it('dit « pas d\'annonce récente » quand BODACC est vide en prévention', () => {
    const alertes = computeAlertes([], [], 'prevention');
    const pasRecente = alertes.find((a) => a.titre.includes("Pas d'annonce"));
    expect(pasRecente).toBeDefined();
  });

  it('ne dépasse jamais 3 alertes même avec beaucoup de données', () => {
    const bodacc = Array.from({ length: 10 }, (_, i) =>
      makeBodaccItem({ date: recentDate(i * 30), type: `Type ${i}` })
    );
    const infogreffe = [makeBodaccItem({ type: 'procédure', date: recentDate(5) })];
    const alertes = computeAlertes(bodacc, infogreffe, 'assignation');
    expect(alertes.length).toBeLessThanOrEqual(3);
  });

  it('chaque alerte a les champs requis', () => {
    const alertes = computeAlertes([], [], 'tresorie');
    for (const a of alertes) {
      expect(['rouge', 'jaune', 'vert']).toContain(a.niveau);
      expect(a.titre.length).toBeGreaterThan(0);
      expect(a.message.length).toBeGreaterThan(0);
      expect(a.source.length).toBeGreaterThan(0);
    }
  });
});
