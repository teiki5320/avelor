import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FicheRecord, Rappel } from '../types';

/* ─── fausse base D1 en mémoire (table fiches) ─── */

type Ligne = Record<string, string | null>;
let lignes: Ligne[] = [];
let avecBase = true;

function requete(sql: string, valeurs: unknown[]) {
  const v = valeurs as (string | null)[];
  return {
    async run() {
      if (sql.startsWith('INSERT')) {
        if (lignes.some((l) => l.token === v[0])) throw new Error('UNIQUE');
        lignes.push({ token: v[0], siret: v[1], reponses: v[2], company_data: v[3], email: v[4], rappels: null, created_at: '2026-10-10T00:00:00.000Z' });
        return { meta: { changes: 1 } };
      }
      const champ = sql.includes('SET email') ? 'email' : 'rappels';
      const cible = lignes.find((l) => l.token === v[1]);
      if (cible) cible[champ] = v[0];
      return { meta: { changes: cible ? 1 : 0 } };
    },
    async first<T>() {
      if (sql.includes('COUNT(*)')) return { n: lignes.length } as T;
      return (lignes.find((l) => l.token === v[0]) ?? null) as T | null;
    },
    async all<T>() {
      const res = sql.includes('rappels IS NOT NULL') ? lignes.filter((l) => l.rappels !== null) : lignes;
      return { results: res as T[] };
    },
  };
}

vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: () => {
    if (!avecBase) throw new Error('hors Cloudflare');
    return { env: { DB: { prepare: (sql: string) => ({ ...requete(sql, []), bind: (...valeurs: unknown[]) => requete(sql, valeurs) }) } } };
  },
}));

import { compterFiches, fichesAvecRappels, getDb, getFicheByToken, getRappels, saveFiche, setRappels, updateFicheEmail } from '../db';

const fiche: FicheRecord = {
  token: 'abc123',
  siret: '35600000000048',
  reponses: { situation: 'prevention', probleme: 'urssaf' } as FicheRecord['reponses'],
  company_data: { nom: 'LA POSTE' } as FicheRecord['company_data'],
};

const rappel: Rappel = {
  email: 'test@example.com',
  echeance: '2026-11-01',
  dateRappel: '2026-10-25',
  libelle: 'Échéance URSSAF',
  cree_le: '2026-10-10T00:00:00.000Z',
  envoye: false,
};

describe('db (Cloudflare D1)', () => {
  beforeEach(() => {
    lignes = [];
    avecBase = true;
  });

  it('getDb retourne null hors Cloudflare', () => {
    avecBase = false;
    expect(getDb()).toBeNull();
  });

  it('les fonctions renvoient des valeurs neutres hors Cloudflare', async () => {
    avecBase = false;
    expect(await saveFiche(fiche)).toBe(false);
    expect(await getFicheByToken('abc123')).toBeNull();
    expect(await fichesAvecRappels()).toEqual([]);
    expect(await compterFiches()).toBe(0);
  });

  it('enregistre puis relit une fiche (JSON reconstitué)', async () => {
    expect(await saveFiche(fiche)).toBe(true);
    const relue = await getFicheByToken('abc123');
    expect(relue?.siret).toBe('35600000000048');
    expect(relue?.reponses.situation).toBe('prevention');
    expect(relue?.company_data.nom).toBe('LA POSTE');
    expect(relue?.email).toBeUndefined();
  });

  it('refuse un token déjà utilisé', async () => {
    expect(await saveFiche(fiche)).toBe(true);
    expect(await saveFiche(fiche)).toBe(false);
  });

  it('met à jour l’email', async () => {
    await saveFiche(fiche);
    expect(await updateFicheEmail('abc123', 'dirigeant@example.com')).toBe(true);
    expect((await getFicheByToken('abc123'))?.email).toBe('dirigeant@example.com');
    expect(await updateFicheEmail('inconnu', 'x@example.com')).toBe(false);
  });

  it('gère les rappels : fiche inconnue, liste vide, ajout, lecture par le cron', async () => {
    expect(await getRappels('inconnu')).toBeNull();
    await saveFiche(fiche);
    expect(await getRappels('abc123')).toEqual([]);
    expect(await fichesAvecRappels()).toEqual([]);

    expect(await setRappels('abc123', [rappel])).toBe(true);
    expect(await getRappels('abc123')).toEqual([rappel]);
    const aTraiter = await fichesAvecRappels();
    expect(aTraiter).toHaveLength(1);
    expect(aTraiter[0].rappels[0].libelle).toBe('Échéance URSSAF');
    expect(aTraiter[0].company_data.nom).toBe('LA POSTE');
  });

  it('compte les fiches', async () => {
    expect(await compterFiches()).toBe(0);
    await saveFiche(fiche);
    expect(await compterFiches()).toBe(1);
  });
});
