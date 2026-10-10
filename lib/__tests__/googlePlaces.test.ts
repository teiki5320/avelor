import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchAvocats, searchPlaces } from '../googlePlaces';

/* ─── mock fetch ─── */

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const PLACES_RESPONSE = {
  places: [
    {
      id: 'ChIJ_test_place_id_1',
      displayName: { text: 'Cabinet Dupont Avocats', languageCode: 'fr' },
      formattedAddress: '12 rue de la Paix, 75002 Paris',
      rating: 4.5,
      userRatingCount: 28,
      nationalPhoneNumber: '01 23 45 67 89',
      googleMapsUri: 'https://maps.google.com/?cid=1',
    },
    {
      id: 'ChIJ_test_place_id_2',
      displayName: { text: 'Maître Martin', languageCode: 'fr' },
      formattedAddress: '5 avenue Foch, 75016 Paris',
      rating: 4.2,
      userRatingCount: 15,
      googleMapsUri: 'https://maps.google.com/?cid=2',
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
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://places.googleapis.com/v1/places:searchText');
    expect(init.method).toBe('POST');
    const headers = init.headers as Record<string, string>;
    expect(headers['X-Goog-Api-Key']).toBe('test-google-key');
    expect(headers['X-Goog-FieldMask']).toContain('places.displayName');
    const body = JSON.parse(init.body as string);
    expect(body.textQuery).toContain('avocat');
    expect(body.textQuery).toContain('Paris');
    expect(body.languageCode).toBe('fr');
    expect(body.regionCode).toBe('FR');
    expect(results).toHaveLength(2);
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
      phone: '01 23 45 67 89',
      mapsUrl: 'https://maps.google.com/?cid=1',
    });
  });

  it('retourne un tableau vide si fetch échoue (res.ok = false)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: { code: 403, status: 'PERMISSION_DENIED', message: 'Places API (New) has not been used in project' } }),
    });
    const results = await searchAvocats('Marseille');
    expect(results).toEqual([]);
    expect(warn).toHaveBeenCalledWith('[googlePlaces]', 403, 'PERMISSION_DENIED', expect.stringContaining('Places API (New)'));
    expect(JSON.stringify(warn.mock.calls)).not.toContain('test-google-key');
    warn.mockRestore();
  });

  it('retourne un tableau vide si fetch lance une exception', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error('network error'));
    const results = await searchAvocats('Bordeaux');
    warn.mockRestore();
    expect(results).toEqual([]);
  });

  /* ─── searchPlaces avec limit ─── */

  it('respecte le paramètre limit', async () => {
    const manyResults = {
      places: Array.from({ length: 10 }, (_, i) => ({
        id: `id_${i}`,
        displayName: { text: `Place ${i}` },
        formattedAddress: `Adresse ${i}`,
        rating: 4.0,
        userRatingCount: 10,
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
