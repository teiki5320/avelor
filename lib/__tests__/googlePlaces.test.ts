import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchAvocats, searchPlaces } from '../googlePlaces';

/* ─── mock fetch ─── */

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const PLACES_RESPONSE = {
  results: [
    {
      name: 'Cabinet Dupont Avocats',
      formatted_address: '12 rue de la Paix, 75002 Paris',
      rating: 4.5,
      user_ratings_total: 28,
      place_id: 'ChIJ_test_place_id_1',
    },
    {
      name: 'Maître Martin',
      formatted_address: '5 avenue Foch, 75016 Paris',
      rating: 4.2,
      user_ratings_total: 15,
      place_id: 'ChIJ_test_place_id_2',
    },
  ],
};

describe('googlePlaces', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_PLACES_API_KEY = 'test-google-key';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  /* ─── exports ─── */

  it('searchAvocats est une fonction exportée', () => {
    expect(typeof searchAvocats).toBe('function');
  });

  it('searchPlaces est une fonction exportée', () => {
    expect(typeof searchPlaces).toBe('function');
  });

  /* ─── searchAvocats ─── */

  it('retourne un tableau vide si ville est vide', async () => {
    const result = await searchAvocats('');
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('retourne un tableau vide si GOOGLE_PLACES_API_KEY est absente', async () => {
    delete process.env.GOOGLE_PLACES_API_KEY;
    const result = await searchAvocats('Lyon');
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('appelle fetch avec les bons paramètres pour searchAvocats', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => PLACES_RESPONSE,
    });

    const results = await searchAvocats('Paris');

    expect(mockFetch).toHaveBeenCalledOnce();
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('textsearch/json');
    expect(url).toContain('avocat');
    expect(url).toContain('Paris');
    expect(url).toContain('language=fr');
    expect(url).toContain('key=test-google-key');
  });

  it('transforme correctement les résultats Google Places', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => PLACES_RESPONSE,
    });

    const results = await searchAvocats('Paris');

    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      name: 'Cabinet Dupont Avocats',
      address: '12 rue de la Paix, 75002 Paris',
      rating: 4.5,
      reviews: 28,
      phone: undefined,
      mapsUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJ_test_place_id_1',
    });
  });

  it('retourne un tableau vide si fetch échoue (res.ok = false)', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    const results = await searchAvocats('Marseille');
    expect(results).toEqual([]);
  });

  it('retourne un tableau vide si fetch lance une exception', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network error'));
    const results = await searchAvocats('Bordeaux');
    expect(results).toEqual([]);
  });

  /* ─── searchPlaces avec limit ─── */

  it('respecte le paramètre limit', async () => {
    const manyResults = {
      results: Array.from({ length: 10 }, (_, i) => ({
        name: `Place ${i}`,
        formatted_address: `Adresse ${i}`,
        rating: 4.0,
        user_ratings_total: 10,
        place_id: `id_${i}`,
      })),
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => manyResults,
    });

    const results = await searchPlaces({ query: 'test', limit: 2 });
    expect(results).toHaveLength(2);
  });
});
