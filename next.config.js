/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  generateBuildId: () => process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? `dev-${Date.now()}`,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
    ],
  },
};

module.exports = nextConfig;
