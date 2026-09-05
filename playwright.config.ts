import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests E2E.
 *
 * Lancement en local :
 *   npm run dev   # dans un terminal
 *   npx playwright test
 *
 * Première fois : npx playwright install (télécharge les navigateurs).
 *
 * En CI : `webServer` lance automatiquement `next start` en build.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    locale: 'fr-FR',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-iphone', use: { ...devices['iPhone 14'] } },
  ],

  webServer: process.env.CI
    ? {
        command: 'npm run build && npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: false,
        timeout: 180_000,
      }
    : undefined,
});
