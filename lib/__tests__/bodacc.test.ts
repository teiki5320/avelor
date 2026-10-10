import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  detectIncoherenceBodacc,
  computeAlertes,
  construireUrlBodacc,
  sirenDepuisSiret,
  mapRecord,
  fetchBodacc,
  fetchBodaccResultat,
  fetchProceduresResultat,
  fetchInfogreffeSignals,
  bodaccIndisponible,
} from '../bodacc';
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

/* ─── Appels API BODACC (réponses réalistes, fetch simulé) ─── */

// Extrait réel de l'API Explore v2.1 (jeu annonces-commerciales), SIREN 883847758.
const REPONSE_PROCEDURES = {
  total_count: 2,
  results: [
    {
      id: 'A202601942597',
      dateparution: '2026-10-09',
      typeavis: 'annonce',
      typeavis_lib: 'Avis initial',
      familleavis: 'collective',
      familleavis_lib: 'Procédures collectives',
      tribunal: 'Greffe du Tribunal de Commerce de Manosque',
      commercant: 'EL RUPTOR PUB',
      registre: ['883847758', '883 847 758'],
      listepersonnes:
        '{"personne": {"typePersonne": "pm", "denomination": "EL RUPTOR PUB", "formeJuridique": "Société par actions simplifiée à associé unique"}}',
      jugement:
        '{"type": "initial", "famille": "Extrait de jugement", "nature": "Jugement de faillite personnelle", "date": "2026-10-06"}',
    },
    {
      id: 'A202500172390',
      dateparution: '2025-01-24',
      typeavis_lib: 'Avis initial',
      familleavis: 'collective',
      familleavis_lib: 'Procédures collectives',
      tribunal: 'Greffe du Tribunal de Commerce de Manosque',
      commercant: 'EL RUPTOR PUB',
      registre: ['883847758', '883 847 758'],
      listepersonnes: '{"personne": [{"typePersonne": "pp", "nom": "DUPONT", "prenom": "Marie"}]}',
      jugement:
        '{"type": "initial", "famille": "Jugement d\'ouverture", "nature": "Jugement d\'ouverture de liquidation judiciaire", "date": "2025-01-21"}',
    },
  ],
};

function reponseJson(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('construireUrlBodacc', () => {
  it('filtre sur le champ registre (le champ siren n\'existe pas)', () => {
    const url = new URL(construireUrlBodacc('883847758'));
    expect(url.pathname).toContain('/api/explore/v2.1/catalog/datasets/annonces-commerciales/records');
    expect(url.searchParams.get('where')).toBe('registre = "883847758"');
    expect(url.searchParams.get('order_by')).toBe('dateparution desc');
  });

  it('filtre les procédures sur familleavis (collective, rétablissement professionnel)', () => {
    const url = new URL(construireUrlBodacc('883847758', { proceduresSeulement: true, limite: 5 }));
    expect(url.searchParams.get('where')).toBe(
      'registre = "883847758" AND familleavis IN ("collective", "retablissement_professionnel")',
    );
    expect(url.searchParams.get('limit')).toBe('5');
    expect(url.toString()).not.toContain('siren');
    expect(url.toString()).not.toContain('familleavis_lib');
  });
});

describe('sirenDepuisSiret', () => {
  it('extrait les 9 premiers chiffres', () => {
    expect(sirenDepuisSiret('883 847 758 00018')).toBe('883847758');
  });
  it('rejette un SIREN invalide ou nul', () => {
    expect(sirenDepuisSiret('1234')).toBeNull();
    expect(sirenDepuisSiret('00000000000000')).toBeNull();
  });
});

describe('mapRecord', () => {
  it('lit la nature du jugement (chaîne JSON) comme description', () => {
    const item = mapRecord(REPONSE_PROCEDURES.results[0]);
    expect(item).toEqual({
      type: 'Procédures collectives',
      date: '2026-10-09',
      tribunal: 'Greffe du Tribunal de Commerce de Manosque',
      description: 'Jugement de faillite personnelle',
    });
  });

  it('se rabat sur la personne si pas de jugement', () => {
    const item = mapRecord({
      familleavis_lib: 'Immatriculations',
      dateparution: '2025-04-22',
      listepersonnes: '{"personne": [{"nom": "DUPONT", "prenom": "Marie"}]}',
      jugement: null,
    });
    expect(item.description).toBe('Marie DUPONT');
  });
});

describe('fetchBodacc / fetchInfogreffeSignals', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renvoie les procédures publiées pour un SIREN', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reponseJson(REPONSE_PROCEDURES));
    vi.stubGlobal('fetch', fetchMock);
    const res = await fetchInfogreffeSignals('88384775800018');
    expect(res).toHaveLength(2);
    expect(res[1].description).toBe("Jugement d'ouverture de liquidation judiciaire");
    expect(bodaccIndisponible(res)).toBe(false);
    const urlAppelee = new URL(String(fetchMock.mock.calls[0][0]));
    expect(urlAppelee.searchParams.get('where')).toContain('registre = "883847758"');
  });

  it('distingue « aucune annonce » (statut ok) de « indisponible »', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => reponseJson({ total_count: 0, results: [] })));
    const ok = await fetchBodaccResultat('88384775800018');
    expect(ok).toEqual({ statut: 'ok', annonces: [] });
    expect(bodaccIndisponible(await fetchBodacc('88384775800018'))).toBe(false);
  });

  it('marque la liste comme indisponible sur une erreur HTTP (ex. 400 Unknown field)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () =>
        reponseJson({ error_code: 'ODSQLError', message: 'Unknown field: siren' }, 400),
      ),
    );
    const liste = await fetchBodacc('88384775800018');
    expect(liste).toEqual([]);
    expect(bodaccIndisponible(liste)).toBe(true);
    expect((await fetchProceduresResultat('88384775800018')).statut).toBe('indisponible');
  });

  it('marque la liste comme indisponible si le réseau échoue', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')));
    const liste = await fetchInfogreffeSignals('88384775800018');
    expect(bodaccIndisponible(liste)).toBe(true);
  });
});

describe('computeAlertes — BODACC indisponible', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('ne dit jamais « plutôt bon signe » si la vérification a échoué', () => {
    const alertes = computeAlertes([], [], 'prevention', { bodaccDisponible: false });
    expect(alertes.some((a) => a.message.includes('bon signe'))).toBe(false);
    const alerte = alertes.find((a) => a.titre === 'Vérification BODACC impossible');
    expect(alerte).toBeDefined();
    expect(alerte!.message).toContain('pas pu être consulté');
  });

  it('détecte l\'indisponibilité via les listes marquées par fetchBodacc', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('réseau')));
    const [bodacc, infogreffe] = await Promise.all([
      fetchBodacc('88384775800018'),
      fetchInfogreffeSignals('88384775800018'),
    ]);
    const alertes = computeAlertes(bodacc, infogreffe, 'tresorie');
    expect(alertes.some((a) => a.message.includes('bon signe'))).toBe(false);
    expect(alertes.some((a) => a.titre === 'Vérification BODACC impossible')).toBe(true);
  });

  it('ne conclut pas à « aucune procédure publique » en redressement si indisponible', () => {
    const res = detectIncoherenceBodacc([], [], 'redressement', { bodaccDisponible: false });
    expect(res).toBeNull();
    const alertes = computeAlertes([], [], 'redressement', { bodaccDisponible: false });
    expect(alertes.some((a) => a.titre === 'Aucune procédure publique détectée')).toBe(false);
    expect(alertes.some((a) => a.titre === 'Procédure détectée')).toBe(true);
  });

  it('signale toujours une procédure publiée en prévention, même si l\'autre appel a échoué', () => {
    const infogreffe = [makeBodaccItem({ type: 'Procédures collectives', date: '2025-01-24' })];
    const res = detectIncoherenceBodacc([], infogreffe, 'prevention', { bodaccDisponible: false });
    expect(res?.niveau).toBe('rouge');
  });
});
