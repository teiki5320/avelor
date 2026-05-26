import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { FicheRecord } from '../types';

/* ─── mock @supabase/supabase-js ─── */

const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockMaybeSingle = vi.fn();

const mockFrom = vi.fn().mockReturnValue({
  insert: mockInsert,
  select: mockSelect.mockReturnValue({
    eq: mockEq.mockReturnValue({
      maybeSingle: mockMaybeSingle,
    }),
  }),
  update: mockUpdate.mockReturnValue({
    eq: mockEq,
  }),
});

const mockClient = { from: mockFrom };

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockClient),
}));

describe('supabase', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  /* ─── getSupabase ─── */

  describe('getSupabase', () => {
    it('retourne null si SUPABASE_URL est absente', async () => {
      vi.resetModules();
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_ANON_KEY;

      const mod = await import('../supabase');
      const result = mod.getSupabase();
      expect(result).toBeNull();
    });

    it('retourne null si SUPABASE_ANON_KEY est absente', async () => {
      vi.resetModules();
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      delete process.env.SUPABASE_ANON_KEY;

      const mod = await import('../supabase');
      const result = mod.getSupabase();
      expect(result).toBeNull();
    });

    it('retourne un client si les deux env vars sont présentes', async () => {
      vi.resetModules();
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_ANON_KEY = 'anon-key-123';

      const mod = await import('../supabase');
      const result = mod.getSupabase();
      expect(result).not.toBeNull();
    });
  });

  /* ─── exports ─── */

  describe('exports', () => {
    it('toutes les fonctions CRUD sont exportées', async () => {
      vi.resetModules();
      const mod = await import('../supabase');
      expect(typeof mod.getSupabase).toBe('function');
      expect(typeof mod.saveFiche).toBe('function');
      expect(typeof mod.getFicheByToken).toBe('function');
      expect(typeof mod.updateFicheEmail).toBe('function');
    });
  });

  /* ─── saveFiche ─── */

  describe('saveFiche', () => {
    const ficheTest: FicheRecord = {
      token: 'tok-1',
      siret: '12345678901234',
      reponses: {
        situation: 'prevention',
        probleme: 'urssaf',
        effectif: 'independant',
        moral: 'combatif',
      },
      company_data: {
        siret: '12345678901234',
        nom: 'Test SARL',
        formeJuridique: 'SARL',
        naf: '6201Z',
        dateCreation: '2020-01-01',
        effectif: '5',
        adresse: '1 rue Test',
        codePostal: '75001',
        ville: 'Paris',
        departement: '75',
        fetched: true,
      },
    };

    it('retourne false si getSupabase retourne null', async () => {
      vi.resetModules();
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_ANON_KEY;

      const mod = await import('../supabase');
      const result = await mod.saveFiche(ficheTest);
      expect(result).toBe(false);
    });

    it('appelle insert avec les bonnes données quand le client existe', async () => {
      vi.resetModules();
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_ANON_KEY = 'anon-key-123';
      mockInsert.mockResolvedValueOnce({ error: null });

      const mod = await import('../supabase');
      const ficheAvecEmail = { ...ficheTest, token: 'tok-2', email: 'test@example.com' };
      const result = await mod.saveFiche(ficheAvecEmail);

      expect(result).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('fiches');
      expect(mockInsert).toHaveBeenCalledWith({
        token: 'tok-2',
        siret: ficheTest.siret,
        reponses: ficheTest.reponses,
        company_data: ficheTest.company_data,
        email: 'test@example.com',
      });
    });
  });

  /* ─── getFicheByToken ─── */

  describe('getFicheByToken', () => {
    it('retourne null si getSupabase retourne null', async () => {
      vi.resetModules();
      delete process.env.SUPABASE_URL;

      const mod = await import('../supabase');
      const result = await mod.getFicheByToken('some-token');
      expect(result).toBeNull();
    });
  });

  /* ─── updateFicheEmail ─── */

  describe('updateFicheEmail', () => {
    it('retourne false si getSupabase retourne null', async () => {
      vi.resetModules();
      delete process.env.SUPABASE_URL;

      const mod = await import('../supabase');
      const result = await mod.updateFicheEmail('some-token', 'email@test.com');
      expect(result).toBe(false);
    });
  });
});
