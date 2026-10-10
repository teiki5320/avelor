/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Un package-lock.json traîne dans le dossier personnel : on fixe la racine du projet.
  outputFileTracingRoot: __dirname,
  generateBuildId: () => process.env.WORKERS_CI_COMMIT_SHA?.slice(0, 8) ?? `dev-${Date.now()}`,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
    ],
  },
};

module.exports = nextConfig;

// En local (`npm run dev`), donne accès à la base D1 simulée par Wrangler.
import('@opennextjs/cloudflare').then((m) => m.initOpenNextCloudflareForDev());
