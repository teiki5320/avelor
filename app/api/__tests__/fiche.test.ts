import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dépendances externes
vi.mock('@/lib/sirene', () => ({
  fetchSirene: vi.fn(async (siret: string) => ({
    siret,
    nom: 'Test Company',
    formeJuridique: 'SARL',
    naf: '62.01Z',
    dateCreation: '2015-01-01',
    effectif: '0',
    adresse: '1 rue',
    codePostal: '75001',
    ville: 'Paris',
    departement: '75',
    fetched: true,
  })),
}));

vi.mock('@/lib/supabase', () => ({
  saveFiche: vi.fn(async () => true),
}));

import { POST } from '@/app/api/fiche/route';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/fiche', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/fiche', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('accepte un payload valide et renvoie un token', async () => {
    const res = await POST(makeRequest({
      siret: '12345678901234',
      reponses: {
        situation: 'prevention',
        probleme: 'urssaf',
        effectif: 'independant',
        moral: 'combatif',
      },
    }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.token).toBeDefined();
    expect(json.token).toHaveLength(24);
    expect(json.persisted).toBe(true);
    expect(json.company_data.siret).toBe('12345678901234');
  });

  it('rejette un SIRET invalide (400)', async () => {
    const res = await POST(makeRequest({
      siret: 'invalid',
      reponses: {
        situation: 'prevention',
        probleme: 'urssaf',
        effectif: 'independant',
        moral: 'combatif',
      },
    }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/invalides/i);
  });

  it('rejette une situation inconnue (400)', async () => {
    const res = await POST(makeRequest({
      siret: '12345678901234',
      reponses: {
        situation: 'inconnu',
        probleme: 'urssaf',
        effectif: 'independant',
        moral: 'combatif',
      },
    }));
    expect(res.status).toBe(400);
  });

  it('accepte les nouveaux champs (pgeEnCours, conjoint, nationalite)', async () => {
    const res = await POST(makeRequest({
      siret: '98765432109876',
      reponses: {
        situation: 'tresorie',
        probleme: 'banque',
        effectif: 'salaries',
        moral: 'epuise',
        pgeEnCours: 'oui',
        conjointStatut: 'collaborateur',
        nationalite: 'hors-ue',
      },
    }));
    expect(res.status).toBe(200);
  });

  it('renvoie 500 si une exception inattendue survient', async () => {
    const res = await POST(new Request('http://localhost/api/fiche', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'pas du json',
    }));
    expect(res.status).toBe(500);
  });
});
