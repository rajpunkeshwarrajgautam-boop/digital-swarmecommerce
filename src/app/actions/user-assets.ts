"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { products as catalogProducts } from "@/lib/data";
import { getPrivateDeliveryAssetName, isSellableProductId } from "@/lib/catalog-integrity";

export async function getUserAssets() {
  try {
    const user = await currentUser();
    if (!user || user.emailAddresses.length === 0) {
      return { success: false, error: "Unauthorized" };
    }

    const email = (user.primaryEmailAddress?.emailAddress || user.emailAddresses[0].emailAddress)
      .trim()
      .toLowerCase();

    if (!supabaseAdmin) throw new Error("Database not available");

    const { data: licenses, error } = await supabaseAdmin
      .from("customer_licenses")
      .select("id,created_at,license_key,license_tier,product_id")
      .eq("user_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getUserAssets] License query error:", error);
      return { success: false, error: "Database error" };
    }

    const productIds = [...new Set((licenses || []).map((license) => license.product_id).filter(Boolean))];
    const { data: dbProducts, error: productsError } = productIds.length
      ? await supabaseAdmin
          .from("products")
          .select("id,name,image,version,in_stock")
          .in("id", productIds)
      : { data: [], error: null };

    if (productsError) {
      console.error("[getUserAssets] Product query error:", productsError);
      return { success: false, error: "Database error" };
    }

    const dbById = new Map((dbProducts || []).map((product) => [String(product.id), product]));
    const assets = await Promise.all(
      (licenses || []).map(async (license) => {
        const dbProduct = dbById.get(String(license.product_id));
        const catalogProduct = dbProduct?.name
          ? catalogProducts.find((product) => product.name === dbProduct.name)
          : undefined;

        let signedUrl = "";
        if (catalogProduct && catalogProduct.inStock && isSellableProductId(catalogProduct.id)) {
          const filename = getPrivateDeliveryAssetName(catalogProduct);
          if (filename) {
            const { data: signed } = await supabaseAdmin.storage
              .from("digital_assets")
              .createSignedUrl(filename, 60 * 60, { download: filename });
            signedUrl = signed?.signedUrl || "";
          }
        }

        return {
          id: license.id,
          created_at: license.created_at,
          license_key: license.license_key,
          license_tier: license.license_tier,
          product_id: license.product_id,
          products: catalogProduct
            ? {
                name: catalogProduct.name,
                image: catalogProduct.image,
                version: catalogProduct.specs?.Version || dbProduct?.version || "",
                download_url: signedUrl,
              }
            : undefined,
        };
      }),
    );

    return { success: true, assets };
  } catch (err) {
    console.error("[getUserAssets] Server Action Error:", err);
    return { success: false, error: "Internal error" };
  }
}

export async function getUserOrders() {
  try {
    const user = await currentUser();
    if (!user || user.emailAddresses.length === 0) {
      return { success: false, error: "Unauthorized" };
    }

    const email = (user.primaryEmailAddress?.emailAddress || user.emailAddresses[0].emailAddress)
      .trim()
      .toLowerCase();

    if (!supabaseAdmin) throw new Error("Database not available");

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        created_at,
        status,
        total_amount,
        cashfree_order_id,
        order_items (
          price,
          quantity,
          products (name)
        )
      `)
      .eq("customer_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getUserOrders] Supabase Query Error:", error);
      return { success: false, error: "Database error" };
    }

    return { success: true, orders: orders || [] };
  } catch (err) {
    console.error("[getUserOrders] Server Action Error:", err);
    return { success: false, error: "Internal error" };
  }
}
