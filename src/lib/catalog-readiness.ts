import { products } from "@/lib/data";
import { getPrivateDeliveryAssetName, isSellableProductId } from "@/lib/catalog-integrity";

type ReadinessIssue = {
  productId: string;
  productName: string;
  code: string;
  message: string;
};

/**
 * Catalog readiness is deliberately mechanical: it checks whether a SKU has
 * the minimum data and private fulfillment mapping required to be offered.
 * It does not invent market-price caps, popularity scores, or quality grades.
 */
export function evaluateCatalogReadiness() {
  const issues: ReadinessIssue[] = [];
  let passed = 0;
  let totalChecks = 0;

  const sellableProducts = products.filter(
    (product) => product.inStock && isSellableProductId(product.id),
  );

  for (const product of sellableProducts) {
    const privateAsset = getPrivateDeliveryAssetName(product);
    const checks: Array<[boolean, string, string]> = [
      [Boolean(product.name?.trim()), "missing_name", "Product name is empty."],
      [Boolean(product.description?.trim()), "missing_description", "Product description is empty."],
      [Boolean(product.installGuide?.trim()), "missing_install_guide", "Install guide is missing."],
      [Number.isFinite(product.price) && product.price > 0, "invalid_price", "Price must be a positive finite amount."],
      [Boolean(product.image?.trim()), "missing_image", "Catalog artwork is missing."],
      [Boolean(product.category?.trim()), "missing_category", "Product category is missing."],
      [Array.isArray(product.features) && product.features.length > 0, "missing_features", "Product features are missing."],
      [Boolean(privateAsset), "missing_private_asset", "Private fulfillment mapping is missing."],
      [privateAsset.toLowerCase().endsWith(".zip"), "non_zip_delivery", "Paid delivery must resolve to a private ZIP bundle."],
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
    productsEvaluated: sellableProducts.length,
  };
}
