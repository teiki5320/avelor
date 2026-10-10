import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FicheRecord, Rappel } from '@/lib/types';

const getFicheByToken = vi.fn<(token: string) => Promise<FicheRecord | null>>();
const getRappels = vi.fn<(token: string) => Promise<Rappel[] | null>>();
const setRappels = vi.fn<(token: string, r: Rappel[]) => Promise<boolean>>(async () => true);

vi.mock('@/lib/db', () => ({
  getDb: () => ({}),
  getFicheByToken: (t: string) => getFicheByToken(t),
  getRappels: (t: string) => getRappels(t),
  setRappels: (t: string, r: Rappel[]) => setRappels(t, r),
}));

import { POST } from '@/app/api/fiche/rappels/route';

const TOKEN = 'abcdef0123456789abcdef01';

function dansNJours(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function fiche(email?: string): FicheRecord {
  return {
    token: TOKEN,
    siret: '12345678901234',
    reponses: { situation: 'prevention', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' },
    company_data: {} as FicheRecord['company_data'],
    email,
  };
}

function rappel(partiel: Partial<Rappel> = {}): Rappel {
  return {
    email: 'moi@exemple.fr',
    echeance: dansNJours(10),
    dateRappel: dansNJours(5),
    libelle: 'x',
    cree_le: new Date().toISOString(),
    envoye: false,
    ...partiel,
  };
}

const payload = {
  token: TOKEN,
  echeance: dansNJours(30),
  dateRappel: dansNJours(20),
  libelle: 'Payer la TVA',
};

function requete(body: unknown): Request {
  return new Request('http://localhost/api/fiche/rappels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/fiche/rappels', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getRappels.mockResolvedValue([]);
  });

  it('renvoie 400 si le corps n’est pas du JSON', async () => {
    expect((await POST(requete('{'))).status).toBe(400);
  });

  it('renvoie 400 pour une date impossible', async () => {
    const res = await POST(requete({ ...payload, dateRappel: '2026-99-99' }));
    expect(res.status).toBe(400);
  });

  it('renvoie 409 si la fiche n’a pas encore d’e-mail enregistré', async () => {
    getFicheByToken.mockResolvedValueOnce(fiche());
    const res = await POST(requete(payload));
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe('Enregistrez d\'abord votre e-mail');
    expect(setRappels).not.toHaveBeenCalled();
  });

  it('refuse (403) un rappel vers une autre adresse que celle de la fiche', async () => {
    getFicheByToken.mockResolvedValueOnce(fiche('moi@exemple.fr'));
    const res = await POST(requete({ ...payload, email: 'victime@exemple.fr' }));
    expect(res.status).toBe(403);
    expect(setRappels).not.toHaveBeenCalled();
  });

  it('enregistre le rappel vers l’adresse de la fiche avec un libellé nettoyé', async () => {
    getFicheByToken.mockResolvedValueOnce(fiche('moi@exemple.fr'));
    const res = await POST(requete({
      ...payload,
      libelle: 'Urgent : appelez le 06 12 34 56 78 ou https://evil.example/x',
    }));
    expect(res.status).toBe(200);
    const [, rappels] = setRappels.mock.calls[0];
    expect(rappels).toHaveLength(1);
    expect(rappels[0].email).toBe('moi@exemple.fr');
    expect(rappels[0].libelle).not.toMatch(/06 12|https|evil/);
  });

  it('ne compte que les rappels non envoyés dans la limite de 20', async () => {
    getFicheByToken.mockResolvedValue(fiche('moi@exemple.fr'));
    getRappels.mockResolvedValueOnce(Array.from({ length: 25 }, () => rappel({ envoye: true })));
    expect((await POST(requete(payload))).status).toBe(200);

    getRappels.mockResolvedValueOnce(Array.from({ length: 20 }, () => rappel()));
    expect((await POST(requete(payload))).status).toBe(429);
  });

  it('renvoie 404 pour une fiche inconnue', async () => {
    getFicheByToken.mockResolvedValueOnce(null);
    expect((await POST(requete(payload))).status).toBe(404);
  });
});
