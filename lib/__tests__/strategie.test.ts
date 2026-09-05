import { describe, it, expect } from 'vitest';
import { isEI, computeScores, buildStrategie, resolveStrategie, getFormeDetail } from '../strategie';
import type { Reponses, CompanyData } from '../types';

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

function makeCompany(overrides: Partial<CompanyData> = {}): CompanyData {
  return {
    siret: '12345678901234',
    nom: 'Test SARL',
    formeJuridique: 'SARL',
    naf: '62.01Z',
    dateCreation: '2015-01-01',
    effectif: '0 salarié',
    adresse: '1 rue de la Paix',
    codePostal: '75001',
    ville: 'Paris',
    departement: '75',
    fetched: true,
    ...overrides,
  };
}

/* ─── isEI ─── */

describe('isEI', () => {
  it('reconnaît les formes individuelles', () => {
    expect(isEI('Entrepreneur individuel')).toBe(true);
    expect(isEI('EIRL')).toBe(true);
    expect(isEI('Micro-entreprise')).toBe(true);
    expect(isEI('Auto-entrepreneur')).toBe(true);
    expect(isEI('EI')).toBe(true);
  });

  it('rejette les formes sociétaires', () => {
    expect(isEI('SARL')).toBe(false);
    expect(isEI('SAS')).toBe(false);
    expect(isEI('SA')).toBe(false);
    expect(isEI('SCI')).toBe(false);
    expect(isEI('SASU')).toBe(false);
  });
});

/* ─── getFormeDetail ─── */

describe('getFormeDetail', () => {
  it('classe les micro-entreprises', () => {
    expect(getFormeDetail('Micro-entreprise')).toBe('micro');
    expect(getFormeDetail('Auto-entrepreneur')).toBe('micro');
    expect(getFormeDetail('Auto entrepreneur')).toBe('micro');
  });

  it('classe les EIRL', () => {
    expect(getFormeDetail('EIRL')).toBe('eirl');
  });

  it('classe les EI classiques', () => {
    expect(getFormeDetail('Entrepreneur individuel')).toBe('ei');
    expect(getFormeDetail('EI')).toBe('ei');
  });

  it('classe les sociétés', () => {
    expect(getFormeDetail('SARL')).toBe('societe');
    expect(getFormeDetail('SAS')).toBe('societe');
    expect(getFormeDetail('SA')).toBe('societe');
    expect(getFormeDetail('SCI')).toBe('societe');
  });
});

/* ─── computeScores ─── */

describe('computeScores', () => {
  it('retourne les 5 axes', () => {
    const scores = computeScores(makeReponses(), makeCompany());
    expect(Object.keys(scores)).toEqual(
      expect.arrayContaining(['restructurer', 'sauvegarder', 'ceder', 'liquider', 'rebondir']),
    );
  });

  it('favorise restructurer en situation prevention + combatif', () => {
    const scores = computeScores(
      makeReponses({ situation: 'prevention', moral: 'combatif', vente: 'non' }),
      makeCompany({ dateCreation: '2015-01-01' }),
    );
    expect(scores.restructurer).toBeGreaterThanOrEqual(7);
    expect(scores.restructurer).toBeGreaterThan(scores.liquider);
  });

  it('favorise ceder quand vente = oui', () => {
    const scores = computeScores(
      makeReponses({ vente: 'oui', effectif: 'salaries', moral: 'epuise' }),
      makeCompany({ dateCreation: '2010-01-01' }),
    );
    expect(scores.ceder).toBeGreaterThan(scores.restructurer);
  });

  it('favorise liquider en redressement + perdu + pas de caution', () => {
    const scores = computeScores(
      makeReponses({ situation: 'redressement', moral: 'perdu', caution: 'non', effectif: 'independant' }),
      makeCompany(),
    );
    expect(scores.liquider).toBeGreaterThanOrEqual(4);
  });

  it('favorise rebondir pour un EI indépendant en redressement', () => {
    const scores = computeScores(
      makeReponses({ situation: 'redressement', effectif: 'independant', moral: 'perdu' }),
      makeCompany({ formeJuridique: 'Entrepreneur individuel' }),
    );
    expect(scores.rebondir).toBeGreaterThanOrEqual(4);
  });

  it('gère une date de création vide sans erreur', () => {
    const scores = computeScores(makeReponses(), makeCompany({ dateCreation: '' }));
    expect(scores.restructurer).toBeGreaterThanOrEqual(0);
  });

  it('PGE en cours augmente le score restructurer hors assignation', () => {
    const sansPge = computeScores(
      makeReponses({ situation: 'tresorie', moral: 'combatif' }),
      makeCompany(),
    );
    const avecPge = computeScores(
      makeReponses({ situation: 'tresorie', moral: 'combatif', pgeEnCours: 'oui' }),
      makeCompany(),
    );
    expect(avecPge.restructurer).toBeGreaterThan(sansPge.restructurer);
  });

  it('PGE en cours ne pénalise pas sauvegarder (la procédure déclenche la garantie, elle ne la fait pas perdre)', () => {
    const sansPge = computeScores(
      makeReponses({ situation: 'tresorie', moral: 'combatif' }),
      makeCompany(),
    );
    const avecPge = computeScores(
      makeReponses({ situation: 'tresorie', moral: 'combatif', pgeEnCours: 'oui' }),
      makeCompany(),
    );
    expect(avecPge.sauvegarder).toBe(sansPge.sauvegarder);
  });

  it('antécédents = oui augmente liquider', () => {
    const base = computeScores(
      makeReponses({ situation: 'redressement', moral: 'epuise' }),
      makeCompany(),
    );
    const recidive = computeScores(
      makeReponses({ situation: 'redressement', moral: 'epuise', antecedents: 'oui' }),
      makeCompany(),
    );
    expect(recidive.liquider).toBeGreaterThan(base.liquider);
  });

  it('rebondir privilégié pour micro-entreprise indépendante', () => {
    const scores = computeScores(
      makeReponses({ situation: 'redressement', effectif: 'independant', moral: 'perdu' }),
      makeCompany({ formeJuridique: 'Micro-entreprise' }),
    );
    expect(scores.rebondir).toBeGreaterThanOrEqual(5);
  });

  it('rebondir non favorisé pour société classique', () => {
    const ei = computeScores(
      makeReponses({ situation: 'redressement', effectif: 'independant', moral: 'perdu' }),
      makeCompany({ formeJuridique: 'Entrepreneur individuel' }),
    );
    const sarl = computeScores(
      makeReponses({ situation: 'redressement', effectif: 'independant', moral: 'perdu' }),
      makeCompany({ formeJuridique: 'SARL' }),
    );
    expect(ei.rebondir).toBeGreaterThan(sarl.rebondir);
  });
});

/* ─── buildStrategie ─── */

describe('buildStrategie', () => {
  it('retourne une stratégie avec tous les champs attendus', () => {
    const strat = buildStrategie('restructurer', makeReponses(), makeCompany(), 5);
    expect(strat.axe).toBe('restructurer');
    expect(strat.score).toBe(5);
    expect(strat.titre).toBeTruthy();
    expect(strat.verdict).toBeTruthy();
    expect(strat.pourquoi.length).toBeGreaterThanOrEqual(1);
    expect(strat.etapes.length).toBeGreaterThanOrEqual(1);
    expect(strat.alternatives.length).toBeGreaterThanOrEqual(1);
  });

  it('génère les 5 axes sans erreur', () => {
    const axes = ['restructurer', 'sauvegarder', 'ceder', 'liquider', 'rebondir'] as const;
    for (const axe of axes) {
      const strat = buildStrategie(axe, makeReponses(), makeCompany(), 3);
      expect(strat.axe).toBe(axe);
      expect(strat.titre).toBeTruthy();
    }
  });

  it('intègre la ville dans les étapes de sauvegarde', () => {
    const strat = buildStrategie('sauvegarder', makeReponses(), makeCompany({ ville: 'Lyon' }), 5);
    const etapesJointes = strat.etapes.join(' ');
    expect(etapesJointes).toContain('Lyon');
  });
});

/* ─── resolveStrategie ─── */

describe('resolveStrategie', () => {
  it('retourne un résultat non-null pour des données standard', () => {
    const result = resolveStrategie(makeReponses(), makeCompany());
    expect(result).not.toBeNull();
    expect(result!.main).toBeDefined();
    expect(result!.scores).toBeDefined();
  });

  it('retourne une stratégie secondaire quand plusieurs axes ont un score > 0', () => {
    const result = resolveStrategie(
      makeReponses({ situation: 'tresorie', moral: 'combatif', effectif: 'salaries' }),
      makeCompany(),
    );
    expect(result).not.toBeNull();
    expect(result!.secondary).not.toBeNull();
  });

  it('est déterministe (mêmes inputs → mêmes outputs)', () => {
    const r = makeReponses({ situation: 'redressement', moral: 'epuise', vente: 'peut-etre' });
    const c = makeCompany();
    const result1 = resolveStrategie(r, c);
    const result2 = resolveStrategie(r, c);
    expect(result1!.main.axe).toBe(result2!.main.axe);
    expect(result1!.scores).toEqual(result2!.scores);
  });
});
