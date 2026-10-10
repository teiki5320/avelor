// Point d'entrée du Worker : le site Next.js (généré par OpenNext)
// + l'envoi quotidien des rappels email (Cron Trigger).
// @ts-expect-error `.open-next/worker.js` est généré au build.
import { default as handler } from './.open-next/worker.js';

interface Env {
  CRON_SECRET?: string;
  NEXT_PUBLIC_BASE_URL?: string;
}

export default {
  fetch: handler.fetch,

  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    const base = env.NEXT_PUBLIC_BASE_URL || 'https://solelis.com';
    const requete = new Request(`${base}/api/cron/rappels`, {
      headers: { authorization: `Bearer ${env.CRON_SECRET ?? ''}` },
    });
    ctx.waitUntil(handler.fetch(requete, env, ctx));
  },
} satisfies ExportedHandler<Env>;
