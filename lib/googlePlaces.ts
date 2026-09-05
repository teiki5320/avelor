import { fetchWithTimeout } from './fetchTimeout';
import type { PlaceResult } from './types';

/* ---------- Interfaces API ---------- */

interface PlacesResult {
  name?: string;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  place_id?: string;
}

interface PlacesApiResponse {
  status?: string;
  results?: PlacesResult[];
  error_message?: string;
}

const BASE = 'https://maps.googleapis.com/maps/api/place';

interface SearchOptions {
  query: string;
  limit?: number;
}

export async function searchPlaces({ query, limit = 3 }: SearchOptions): Promise<PlaceResult[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return [];

  try {
    const url = `${BASE}/textsearch/json?query=${encodeURIComponent(query)}&language=fr&region=fr&key=${key}`;
    const res = await fetchWithTimeout(url, { next: { revalidate: 21600 } });
    if (!res.ok) return [];
    const json: PlacesApiResponse = await res.json();
    const results: PlacesResult[] = json?.results ?? [];
    return results.slice(0, limit).map((r) => ({
      name: r.name ?? '',
      address: r.formatted_address,
      rating: r.rating,
      reviews: r.user_ratings_total,
      phone: undefined,
      mapsUrl: r.place_id
        ? `https://www.google.com/maps/place/?q=place_id:${r.place_id}`
        : undefined,
    }));
  } catch {
    return [];
  }
}

export async function searchAvocats(ville: string): Promise<PlaceResult[]> {
  if (!ville) return [];
  return searchPlaces({
    query: `avocat droit des entreprises en difficulté ${ville}`,
    limit: 3,
  });
}
