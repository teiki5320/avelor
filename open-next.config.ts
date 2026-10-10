import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// Les pages pré-générées au build sont servies telles quelles depuis les fichiers
// statiques du Worker, sans relancer Next à chaque visite (économise le temps CPU,
// limité à 10 ms par requête sur la formule gratuite). Aucune page n'utilise la
// revalidation (ISR), ce cache en lecture seule convient donc.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
