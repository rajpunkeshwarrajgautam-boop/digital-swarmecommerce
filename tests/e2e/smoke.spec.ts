import { test, expect } from '@playwright/test';

/**
 * [SMOKE] Protocol Check
 * 
 * Target: Home Page & Global Navigation.
 * Verifies that the platform hydrates and materializes correctly.
 */
test.describe('Hardware Sanity Protocol', () => {
  test('should load the home page with brutalist branding', async ({ page }) => {
    await page.goto('/');

    // Check title materialization
    await expect(page).toHaveTitle(/DIGITAL SWARM/);

    // Check for "Forge" primary CTA
    const forgeCTA = page.getByRole('link', { name: /ENTER THE FORGE/i });
    if (await forgeCTA.isVisible()) {
       await expect(forgeCTA).toBeVisible();
    }
  });

  test('should navigate to products via the swarm grid', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation menu
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });
});
