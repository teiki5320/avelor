import { describe, it, expect } from 'vitest';
import { getDepartement, buildOrganismes, type DepartementData } from '../organismes';
import type { Reponses } from '../types';

/* ─── Helpers ─── */

function makeReponses(overrides: Partial<Reponses> = {}): Reponses {
  return {
    situation: 'prevention',
    probleme: 'urssaf',
    effectif: 'independant',
    moral: 'combatif',
    ...overrides,
  };
}

/* ─── getDepartement ─── */

describe('getDepartement', () => {
  it('retourne les données pour un département existant', () => {
    const result = getDepartement('75');
    expect(result).not.toBeNull();
    expect(result!.code).toBe('75');
    expect(result!.nom.length).toBeGreaterThan(0);
  });

  it('retourne les champs structurels attendus', () => {
    const result = getDepartement('75');
    expect(result).not.toBeNull();
    expect(result!.chefLieu).toBeDefined();
    expect(result!.tribunal).toBeDefined();
    expect(result!.tribunal.nom).toBeDefined();
    expect(result!.cci).toBeDefined();
    expect(result!.cci.nom).toBeDefined();
    expect(result!.urssaf).toBeDefined();
    expect(result!.sie).toBeDefined();
  });

  it('retourne null pour un département inexistant', () => {
    expect(getDepartement('00')).toBeNull();
    expect(getDepartement('')).toBeNull();
    expect(getDepartement('ZZZ')).toBeNull();
  });

  it('gère la Corse (2A et 2B)', () => {
    const corseA = getDepartement('2A');
    expect(corseA).not.toBeNull();
    expect(corseA!.code).toBe('2A');

    const corseB = getDepartement('2B');
    expect(corseB).not.toBeNull();
    expect(corseB!.code).toBe('2B');
  });

  it('gère les départements d\'outre-mer', () => {
    const guadeloupe = getDepartement('971');
    expect(guadeloupe).not.toBeNull();
    expect(guadeloupe!.code).toBe('971');
  });

  it('chaque organisme a un nom et un type', () => {
    const dep = getDepartement('13');
    expect(dep).not.toBeNull();
    for (const champ of ['tribunal', 'cci', 'urssaf', 'sie'] as const) {
      expect(dep![champ].nom.length).toBeGreaterThan(0);
      expect(dep![champ].type.length).toBeGreaterThan(0);
    }
  });
});

/* ─── buildOrganismes ─── */

describe('buildOrganismes', () => {
  it('retourne des groupes même sans données département', () => {
    const groupes = buildOrganismes(null, makeReponses(), []);
    expect(groupes.length).toBeGreaterThan(0);
  });

  it('retourne toujours 4 groupes (juridique, institutionnel, financier, social)', () => {
    const dep = getDepartement('75');
    const groupes = buildOrganismes(dep, makeReponses(), []);
    expect(groupes).toHaveLength(4);
    expect(groupes.map((g) => g.cle)).toEqual([
      'juridique',
      'institutionnel',
      'financier',
      'social',
    ]);
  });

  it('chaque groupe a les champs requis', () => {
    const dep = getDepartement('75');
    const groupes = buildOrganismes(dep, makeReponses(), []);
    for (const g of groupes) {
      expect(g.cle.length).toBeGreaterThan(0);
      expect(g.titre.length).toBeGreaterThan(0);
      expect(g.couleur.length).toBeGreaterThan(0);
      expect(g.icone.length).toBeGreaterThan(0);
      expect(Array.isArray(g.cartes)).toBe(true);
    }
  });

  it('inclut les avocats passés en paramètre dans le groupe juridique', () => {
    const avocats = [
      { nom: 'Me Dupont', type: 'Avocat', badge: 'Google Places' },
    ];
    const groupes = buildOrganismes(null, makeReponses(), avocats);
    const juridique = groupes.find((g) => g.cle === 'juridique')!;
    expect(juridique.cartes.some((c) => c.nom === 'Me Dupont')).toBe(true);
  });

  it('inclut le CIP dans le groupe juridique', () => {
    const groupes = buildOrganismes(null, makeReponses(), []);
    const juridique = groupes.find((g) => g.cle === 'juridique')!;
    expect(juridique.cartes.some((c) => c.nom.includes('CIP'))).toBe(true);
  });

  it('inclut un notaire si le problème est banque', () => {
    const groupes = buildOrganismes(null, makeReponses({ probleme: 'banque' }), []);
    const juridique = groupes.find((g) => g.cle === 'juridique')!;
    expect(juridique.cartes.some((c) => c.nom === 'Notaire')).toBe(true);
  });

  it('n\'inclut pas de notaire si le problème est urssaf', () => {
    const groupes = buildOrganismes(null, makeReponses({ probleme: 'urssaf' }), []);
    const juridique = groupes.find((g) => g.cle === 'juridique')!;
    expect(juridique.cartes.some((c) => c.nom === 'Notaire')).toBe(false);
  });

  it('inclut le CNAJMJ en situation de redressement', () => {
    const dep = getDepartement('75');
    const groupes = buildOrganismes(dep, makeReponses({ situation: 'redressement' }), []);
    const institutionnel = groupes.find((g) => g.cle === 'institutionnel')!;
    expect(institutionnel.cartes.some((c) => c.nom.includes('CNAJMJ'))).toBe(true);
  });

  it('inclut URSSAF dans le financier si problème urssaf', () => {
    const dep = getDepartement('75');
    const groupes = buildOrganismes(dep, makeReponses({ probleme: 'urssaf' }), []);
    const financier = groupes.find((g) => g.cle === 'financier')!;
    expect(financier.cartes.some((c) => c.type === 'URSSAF')).toBe(true);
  });

  it('inclut BPI France dans le financier systématiquement', () => {
    const groupes = buildOrganismes(null, makeReponses(), []);
    const financier = groupes.find((g) => g.cle === 'financier')!;
    expect(financier.cartes.some((c) => c.nom.includes('BPI'))).toBe(true);
  });

  it('inclut SSI pour les indépendants dans le groupe social', () => {
    const groupes = buildOrganismes(null, makeReponses({ effectif: 'independant' }), []);
    const social = groupes.find((g) => g.cle === 'social')!;
    expect(social.cartes.some((c) => c.nom.includes('SSI'))).toBe(true);
  });

  it('inclut AGS pour les salariés dans le groupe social', () => {
    const groupes = buildOrganismes(null, makeReponses({ effectif: 'salaries' }), []);
    const social = groupes.find((g) => g.cle === 'social')!;
    expect(social.cartes.some((c) => c.nom === 'AGS')).toBe(true);
  });

  it('inclut le médiateur des entreprises si problème fournisseurs', () => {
    const groupes = buildOrganismes(null, makeReponses({ probleme: 'fournisseurs' }), []);
    const financier = groupes.find((g) => g.cle === 'financier')!;
    expect(financier.cartes.some((c) => c.nom.includes('Médiateur'))).toBe(true);
  });
});
