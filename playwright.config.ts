import { defineConfig, devices } from '@playwright/test';

const externalUrl = process.env.PLAYWRIGHT_PRODUCTION_URL?.replace(/\/$/, '');
const baseURL = externalUrl || 'http://localhost:3000';
const useWebServer = !externalUrl && !process.env.PLAYWRIGHT_NO_WEBSERVER;

/**
 * E2E must exercise the code being reviewed. CI builds the application first
 * and Playwright then starts that exact production bundle with `next start`.
 * Keep the webServer command intentionally simple and use Next.js defaults
 * (0.0.0.0:3000); Playwright probes it through localhost.
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
        command: process.env.CI ? 'npm run start' : 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        stdout: 'pipe',
        stderr: 'pipe',
      }
    : undefined,
});
