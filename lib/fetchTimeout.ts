/**
 * fetch avec délai maximal. Les fiches sont rendues côté serveur : sans
 * timeout, une API externe (INSEE, BODACC, Google Places) qui ne répond
 * pas fige le rendu SSR complet. Chaque appelant gère déjà l'échec
 * (fallback ou liste vide) — l'AbortError tombe dans son catch.
 */
export function fetchWithTimeout(
  url: string,
  init: RequestInit & { next?: { revalidate?: number | false } } = {},
  timeoutMs = 3000,
): Promise<Response> {
  return fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
}
