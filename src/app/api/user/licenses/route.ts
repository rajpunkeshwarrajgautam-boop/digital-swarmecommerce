import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { products as catalogProducts } from "@/lib/data";
import { getPrivateDeliveryAssetName, isSellableProductId } from "@/lib/catalog-integrity";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user || (!user.primaryEmailAddress && !user.emailAddresses[0])) {
      return NextResponse.json({ error: "Unauthorized or missing email" }, { status: 401 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database service unavailable" }, { status: 503 });
    }
    const admin = supabaseAdmin;

    const email = (user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]!.emailAddress)
      .trim()
      .toLowerCase();

    const { data: dbLicenses, error } = await admin
      .from('customer_licenses')
      .select('id,created_at,license_key,license_tier,product_id')
      .eq('user_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("[licenses] Failed to fetch licenses:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const productIds = [...new Set((dbLicenses || []).map((license) => license.product_id).filter(Boolean))];
    const { data: dbProducts, error: productError } = productIds.length
      ? await admin.from('products').select('id,name').in('id', productIds)
      : { data: [], error: null };

    if (productError) {
      console.error("[licenses] Failed to resolve products:", productError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const dbById = new Map((dbProducts || []).map((product) => [String(product.id), product]));
    const finalLicenses = await Promise.all(
      (dbLicenses || []).map(async (license) => {
        const dbProduct = dbById.get(String(license.product_id));
        const matchedProduct = dbProduct?.name
          ? catalogProducts.find((product) => product.name === dbProduct.name)
          : undefined;

        let downloadUrl = "";
        if (matchedProduct && matchedProduct.inStock && isSellableProductId(matchedProduct.id)) {
          const filename = getPrivateDeliveryAssetName(matchedProduct);
          if (filename) {
            const { data: signed } = await admin.storage
              .from('digital_assets')
              .createSignedUrl(filename, 60 * 60, { download: filename });
            downloadUrl = signed?.signedUrl || "";
          }
        }

        return {
          id: license.id,
          productName: matchedProduct?.name || dbProduct?.name || "Digital Swarm Asset",
          productId: matchedProduct?.id || null,
          date: new Date(license.created_at).toLocaleDateString(),
          licenseType: license.license_tier === "whitelabel" ? "Agency Whitelabel" : "Standard",
          licenseKey: license.license_key,
          downloadUrl,
        };
      }),
    );

    return NextResponse.json(finalLicenses);
  } catch (error) {
    console.error("[licenses] Unexpected failure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
