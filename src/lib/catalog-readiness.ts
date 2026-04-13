import { products } from "@/lib/data";

type ReadinessIssue = {
  productId: string;
  productName: string;
  code: string;
  message: string;
};

const categoryPriceCaps: Record<string, number> = {
  "AI Agent": 24999,
  "Source Code": 14999,
  Recruitment: 9999,
  "Home Services": 9999,
  Legal: 9999,
  Finance: 9999,
  Healthcare: 9999,
  "Digital Marketing": 9999,
  Copywriting: 9999,
  SaaS: 9999,
  "E-commerce": 9999,
};

function extension(url: string): string {
  const base = url.split("?")[0];
  const idx = base.lastIndexOf(".");
  return idx === -1 ? "" : base.slice(idx).toLowerCase();
}

function classifyDelivery(url: string): "source_code" | "playbook" | "asset_bundle" | "unknown" {
  const ext = extension(url);
  if (ext === ".zip") return "source_code";
  if (ext === ".html" || ext === ".txt" || ext === ".md") return "playbook";
  if (ext === ".pdf" || ext === ".css" || ext === ".tsx") return "asset_bundle";
  return "unknown";
}

export function evaluateCatalogReadiness() {
  const issues: ReadinessIssue[] = [];
  let passed = 0;
  let totalChecks = 0;

  for (const product of products) {
    const delivery = classifyDelivery(product.downloadUrl ?? "");
    const cap = categoryPriceCaps[product.category];

    const checks: Array<[boolean, string, string]> = [
      [Boolean(product.name?.trim()), "missing_name", "Product name is empty."],
      [Boolean(product.description?.trim()), "missing_description", "Product description is empty."],
      [Boolean(product.installGuide?.trim()), "missing_install_guide", "Install guide is missing."],
      [
        Boolean(product.downloadUrl) &&
          (product.downloadUrl.startsWith("/downloads/") || product.downloadUrl.startsWith("https://")),
        "invalid_download_url",
        "Download URL must be /downloads/* or absolute HTTPS URL.",
      ],
      [delivery !== "unknown", "unknown_delivery_type", "Delivery type is unknown from file extension."],
      [
        !(product.category === "Source Code" && delivery !== "source_code"),
        "source_code_mismatch",
        "Source Code products must deliver a .zip package.",
      ],
      [
        !cap || product.price <= cap,
        "price_above_market_cap",
        `Price is above current market cap for ${product.category} (₹${cap}).`,
      ],
    ];

    for (const [ok, code, message] of checks) {
      totalChecks += 1;
      if (ok) {
        passed += 1;
      } else {
        issues.push({
          productId: product.id,
          productName: product.name,
          code,
          message,
        });
      }
    }
  }

  const score = totalChecks === 0 ? 0 : Number(((passed / totalChecks) * 10).toFixed(2));

  return {
    score,
    passed,
    totalChecks,
    issues,
    productsEvaluated: products.length,
  };
}
