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

});
