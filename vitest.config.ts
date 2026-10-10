import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules', 'e2e', '.next', 'dist'],
    // Composants React → utilisent une directive `// @vitest-environment jsdom` en tête de fichier.
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
});
