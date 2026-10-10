import { fetchWithTimeout } from './fetchTimeout';
import type { PlaceResult } from './types';

/* ---------- Places API (New) — Text Search ---------- */
// https://developers.google.com/maps/documentation/places/web-service/text-search
// L'ancienne API (maps/api/place/textsearch) n'est plus ouverte aux nouveaux projets Google.

interface PlaceNew {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  nationalPhoneNumber?: string;
  googleMapsUri?: string;
}

interface TextSearchResponse {
  places?: PlaceNew[];
  error?: { code?: number; status?: string; message?: string };
}

const URL_TEXT_SEARCH = 'https://places.googleapis.com/v1/places:searchText';

// Champs demandés (la facturation Google dépend de cette liste : la garder courte).
const CHAMPS = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.userRatingCount',
  'places.nationalPhoneNumber',
  'places.googleMapsUri',
].join(',');

interface SearchOptions {
  query: string;
  limit?: number;
}

export async function searchPlaces({ query, limit = 3 }: SearchOptions): Promise<PlaceResult[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return [];

  try {
    const res = await fetchWithTimeout(URL_TEXT_SEARCH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': CHAMPS,
      },
      body: JSON.stringify({ textQuery: query, languageCode: 'fr', regionCode: 'FR', pageSize: limit }),
    });
    const json: TextSearchResponse = await res.json().catch(() => ({}));
    if (!res.ok) {
      // Raison donnée par Google (API non activée, clé restreinte…) — jamais la clé elle-même.
      console.warn('[googlePlaces]', res.status, json.error?.status ?? '', json.error?.message ?? '');
      return [];
    }
    return (json.places ?? []).slice(0, limit).map((p) => ({
      name: p.displayName?.text ?? '',
      address: p.formattedAddress,
      rating: p.rating,
      reviews: p.userRatingCount,
      phone: p.nationalPhoneNumber,
      mapsUrl: p.googleMapsUri,
    }));
  } catch (e) {
    console.warn('[googlePlaces] échec de la requête', e instanceof Error ? e.name : '');
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
