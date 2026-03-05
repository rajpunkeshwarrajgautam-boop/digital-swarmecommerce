import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";
import { products } from "@/lib/data";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user || (!user.primaryEmailAddress && !user.emailAddresses[0])) {
      return NextResponse.json({ error: "Unauthorized or missing email" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;

    // Fetch from Supabase exactly matching the real user's email
    const { data: dbLicenses, error } = await supabase
      .from('customer_licenses')
      .select('*')
      .eq('user_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("[SUPABASE ERROR] Failed to fetch licenses:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Map the database raw licenses back to rich frontend objects
    const finalLicenses = (dbLicenses || []).map((lic) => {
      // Product Name Lookup if possible
      const baseProductId = lic.product_id?.replace("-whitelabel", "") || "unknown";
      const matchedProduct = products.find(p => p.id === baseProductId);
      
      let productName = "Digital Swarm Asset";
      if (matchedProduct) {
        productName = matchedProduct.name;
        if (lic.license_tier === "whitelabel") productName += " [Whitelabel License]";
      }

      return {
        id: lic.id,
        productName: productName,
        date: new Date(lic.created_at).toLocaleDateString(),
        licenseType: lic.license_tier === "whitelabel" ? "Agency Whitelabel" : "Standard",
        licenseKey: lic.license_key,
        downloadUrl: matchedProduct?.downloadUrl || "#",
      };
    });

    return NextResponse.json(finalLicenses);

  } catch (error) {
    console.error("Failed to fetch licenses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
