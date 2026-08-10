import { defineConfig, devices } from '@playwright/test';

const externalUrl = process.env.PLAYWRIGHT_PRODUCTION_URL?.replace(/\/$/, '');
const baseURL = externalUrl || 'http://127.0.0.1:3000';
const useWebServer = !externalUrl && !process.env.PLAYWRIGHT_NO_WEBSERVER;

/**
 * E2E must exercise the code being reviewed. In CI we build first and then
 * serve that exact production bundle with `next start`; local development can
 * still use `next dev`.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: useWebServer
    ? {
        command: process.env.CI ? 'npm run start -- --hostname 127.0.0.1 --port 3000' : 'npm run dev -- --hostname 127.0.0.1 --port 3000',
        url: 'http://127.0.0.1:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
