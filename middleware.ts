import { NextResponse, type NextRequest } from 'next/server';

/* ── Rate limiter en mémoire ───────────────────────────────────── */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
let requestCount = 0;

/** Supprime les entrées expirées pour éviter les fuites mémoire. */
function purgeExpired() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Vérifie si l'IP a encore le droit d'effectuer une requête.
 * @returns true si la requête est autorisée, false sinon.
 */
function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  entry.count++;
  return entry.count <= limit;
}

/* ── Limites par route ─────────────────────────────────────────── */

const UNE_MINUTE = 60_000;

interface RouteLimit {
  path: string;
  method?: string;
  limit: number;
}

const routeLimits: RouteLimit[] = [
  { path: '/api/fiche/send-link', method: 'POST', limit: 5 },
  { path: '/api/fiche/rappels', method: 'POST', limit: 5 },
  { path: '/api/fiche', method: 'POST', limit: 10 },
  { path: '/api/stats', limit: 30 },
  // Chaque affichage de fiche interroge des API externes payantes (Google Places…).
  { path: '/fiche/', limit: 30 },
];

/* ── Middleware ─────────────────────────────────────────────────── */

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  /* Ne rate-limiter que les routes API et les fiches */
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/fiche/')) {
    return NextResponse.next();
  }

  /*
   * Sans IP identifiable, on ne compte pas : une clé commune « unknown » ferait
   * bloquer tout le monde ensemble. (Limiteur en mémoire, par instance du Worker :
   * protection d'appoint en attendant un vrai limiteur Cloudflare.)
   */
  const ip =
    request.headers.get('cf-connecting-ip')?.trim() ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '';
  if (!ip) {
    return NextResponse.next();
  }
  const method = request.method;

  /* Trouver la limite applicable (la première qui match) */
  const rule = routeLimits.find(
    (r) =>
      pathname.startsWith(r.path) && (!r.method || r.method === method),
  );

  if (!rule) {
    return NextResponse.next();
  }

  /* Clé unique par IP + route */
  const clé = `${ip}:${rule.path}`;

  const autorisé = rateLimit(clé, rule.limit, UNE_MINUTE);

  /* Nettoyage périodique toutes les 100 requêtes */
  requestCount++;
  if (requestCount % 100 === 0) {
    purgeExpired();
  }

  if (!autorisé) {
    if (pathname.startsWith('/fiche/')) {
      return new NextResponse(
        '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Trop de requêtes · Solelis</title><p style="font-family:sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem">Trop de requêtes en peu de temps. Votre fiche est toujours là : réessayez dans une minute.</p></html>',
        { status: 429, headers: { 'content-type': 'text/html; charset=utf-8', 'retry-after': '60' } },
      );
    }
    return NextResponse.json(
      { error: 'Trop de requêtes, veuillez réessayer dans quelques instants.' },
      { status: 429, headers: { 'retry-after': '60' } },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/fiche/:path*'],
};
