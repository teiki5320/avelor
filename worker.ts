// Point d'entrée du Worker : le site Next.js (généré par OpenNext)
// + l'envoi quotidien des rappels email (Cron Trigger).
// @ts-expect-error `.open-next/worker.js` est généré au build.
import { default as handler } from './.open-next/worker.js';

interface Env {
  CRON_SECRET?: string;
  NEXT_PUBLIC_BASE_URL?: string;
}

// En-têtes de sécurité ajoutés à toutes les réponses du Worker
// (les fichiers statiques reçoivent les mêmes via public/_headers).
const ENTETES_SECURITE: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "frame-ancestors 'none'",
};

// Réponses coûteuses en calcul mises en cache au bord du réseau Cloudflare (en secondes).
const CACHE_ROUTES: Record<string, number> = {
  '/api/og': 7 * 24 * 3600,
  '/api/stats': 300,
};

function avecEntetes(res: Response): Response {
  const copie = new Response(res.body, res);
  for (const [nom, valeur] of Object.entries(ENTETES_SECURITE)) copie.headers.set(nom, valeur);
  return copie;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // http → https, et www.solelis.com → solelis.com (redirections permanentes).
    const domaineSolelis = url.hostname === 'solelis.com' || url.hostname === 'www.solelis.com';
    if (domaineSolelis && (url.protocol === 'http:' || url.hostname === 'www.solelis.com')) {
      url.protocol = 'https:';
      if (url.hostname === 'www.solelis.com') url.hostname = 'solelis.com';
      return Response.redirect(url.toString(), 301);
    }

    const duree = request.method === 'GET' ? CACHE_ROUTES[url.pathname] : undefined;
    const cache = duree ? (caches as unknown as { default: Cache }).default : undefined;
    if (cache) {
      const enCache = await cache.match(request);
      if (enCache) return enCache;
    }

    const reponse = avecEntetes(await handler.fetch(request, env, ctx));

    if (cache && duree && reponse.status === 200) {
      reponse.headers.set('Cache-Control', `public, max-age=${duree}`);
      ctx.waitUntil(cache.put(request, reponse.clone()));
    }
    return reponse;
  },

  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    const base = env.NEXT_PUBLIC_BASE_URL || 'https://solelis.com';
    const requete = new Request(`${base}/api/cron/rappels`, {
      headers: { authorization: `Bearer ${env.CRON_SECRET ?? ''}` },
    });
    ctx.waitUntil(
      (async () => {
        const res = await handler.fetch(requete, env, ctx);
        const corps = (await res.text()).slice(0, 300);
        // Journalisé pour repérer un secret manquant (401) ou une panne.
        const niveau = res.ok ? 'log' : 'error';
        console[niveau]('[CRON rappels]', res.status, corps);
      })(),
    );
  },
} satisfies ExportedHandler<Env>;
