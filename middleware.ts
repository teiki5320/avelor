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
  { path: '/api/fiche', method: 'POST', limit: 10 },
  { path: '/api/stats', limit: 30 },
];

/* ── Middleware ─────────────────────────────────────────────────── */

export function middleware(request: NextRequest) {
  /* Ne rate-limiter que les routes API */
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const pathname = request.nextUrl.pathname;
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
    return NextResponse.json(
      { error: 'Trop de requêtes, veuillez réessayer dans quelques instants.' },
      { status: 429 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
