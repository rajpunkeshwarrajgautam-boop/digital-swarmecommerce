import { defineConfig, devices } from '@playwright/test';

const productionUrl = process.env.PLAYWRIGHT_PRODUCTION_URL?.replace(/\/$/, '');
const baseURL = productionUrl || 'http://localhost:3000';
const useWebServer = !productionUrl && !process.env.PLAYWRIGHT_NO_WEBSERVER;

/**
 * Playwright E2E Configuration
 * 
 * Target: Critical User Flows (Add to Cart → Checkout → Success)
 * Desktop focused by default.
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
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
      }
    : undefined,
});
