import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const BASE = process.env['BASE_URL'] ?? `http://localhost:${PORT}/Train-game/`;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE,
    launchOptions: {
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
    },
  },
  projects: [
    { name: 'phone-portrait', use: { ...devices['Pixel 7'], browserName: 'chromium' } },
    {
      name: 'phone-landscape',
      use: { ...devices['Pixel 7 landscape'], browserName: 'chromium' },
    },
  ],
  ...(process.env['BASE_URL']
    ? {}
    : {
        webServer: {
        command: `npx vite preview --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}/Train-game/`,
        reuseExistingServer: !process.env['CI'],
          timeout: 60_000,
        },
      }),
});
