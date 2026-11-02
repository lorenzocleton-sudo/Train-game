/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

// GitHub Pages serves the site at https://<owner>.github.io/<repo>/,
// so every asset URL must be prefixed with the repo name.
export const BASE_PATH = '/Train-game/';

export default defineConfig({
  base: BASE_PATH,
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
  },
  server: { host: true },
  preview: { host: true, port: 4173, strictPort: true },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
