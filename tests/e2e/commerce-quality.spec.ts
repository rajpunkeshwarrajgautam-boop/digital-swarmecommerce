import { test, expect } from "@playwright/test";

test.describe("Commerce quality guardrails", () => {
  test("core pages expose canonical URLs", async ({ request }) => {
    const home = await request.get("/");
    const homeHtml = await home.text();
    expect(homeHtml).toMatch(/<link rel="canonical" href="https:\/\/digitalswarm\.in\/?"/i);

    const products = await request.get("/products");
    const productsHtml = await products.text();
    expect(productsHtml).toMatch(/<link rel="canonical" href="https:\/\/digitalswarm\.in\/products"/i);

    const contact = await request.get("/contact");
    const contactHtml = await contact.text();
    expect(contactHtml).toMatch(/<link rel="canonical" href="https:\/\/digitalswarm\.in\/contact"/i);
  });

  test("structured data scripts are present", async ({ request }) => {
    const home = await request.get("/");
    expect(await home.text()).toContain('application/ld+json');

    const products = await request.get("/products");
    expect(await products.text()).toContain('application/ld+json');

    const faq = await request.get("/faq");
    expect(await faq.text()).toContain('application/ld+json');
  });

  test("standard cart flows into a digital-only INR checkout", async ({ page }) => {
    await page.goto("/product/ai-executive-playbook");
    await page.getByRole("button", { name: /add standard to cart/i }).click();

    const reviewCart = page.getByRole("link", { name: /review full cart/i });
    await expect(reviewCart).toBeVisible();
    await reviewCart.click();

    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByText(/Checkout uses Cashfree\./i)).toBeVisible();
    await expect(page.getByText(/Razorpay/i)).toHaveCount(0);
    await expect(page.getByText(/Guaranteed Instant Digital Delivery/i)).toHaveCount(0);

    const checkoutLinks = page.getByRole("link", { name: /continue to checkout/i });
    await expect(checkoutLinks).toHaveCount(2);
    await expect(checkoutLinks.first()).toHaveAttribute("href", "/checkout");
    await expect(checkoutLinks.nth(1)).toHaveAttribute("href", "/checkout");
    await checkoutLinks.nth(1).click();

    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByText(/no shipping address is required/i)).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="address"]')).toHaveCount(0);
    await expect(page.getByRole("button", { name: /pay ₹/i })).toBeVisible();
  });

  test("agency-whitelabel cart keeps routable base product links", async ({ page }) => {
    await page.goto("/product/ai-executive-playbook");
    await page.getByRole("button", { name: /agency whitelabel/i }).click();
    await page.getByRole("button", { name: /add agency whitelabel to cart/i }).click();

    const reviewCart = page.getByRole("link", { name: /review full cart/i });
    await expect(reviewCart).toBeVisible();
    await reviewCart.click();

    const productLinks = page.getByRole("link", { name: /AI Executive Playbook \[Agency Whitelabel License\]/i });
    await expect(productLinks).toHaveCount(2);
    await expect(productLinks.first()).toHaveAttribute("href", "/product/ai-executive-playbook");
    await expect(productLinks.nth(1)).toHaveAttribute("href", "/product/ai-executive-playbook");
  });
});
