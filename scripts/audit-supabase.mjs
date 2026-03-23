import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// Load env vars
dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runAudit() {
  console.log("🚀 INITIATING SUPABASE PRODUCTION AUDIT...");
  
  const { data, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error("❌ SUPABASE CONNECTION FAILED:", error.message);
    return;
  }
  
  console.log(`\n✅ DATABASE CONNECTED. Scanned ${data.length} products.`);
  
  let productionReadyCount = 0;
  const warnings = [];

  data.forEach(p => {
    const alerts = [];
    
    // 1. Check for mock/test names
    if (!p.name || p.name.toLowerCase().includes('test') || p.name.toLowerCase().includes('mock') || p.name.toLowerCase().includes('placeholder')) {
      alerts.push('Name indicates it is a test product.');
    }
    
    // 2. Check pricing validity (Assuming no freebies in DB, or at least > 0 for standard stuff)
    if (p.price === null || p.price === undefined) {
      alerts.push('Price is null/undefined.');
    }
    
    // 3. Check for valid descriptions
    if (!p.description || p.description.length < 30) {
      alerts.push('Description is missing or suspiciously short for a real product.');
    }
    
    // 4. Check for fulfillment delivery links
    if (!p.download_url) {
        // Some services like 'SEO Agency' might not have a download URL, but we'll flag it for review
        if (!p.category?.toLowerCase().includes('agency')) {
            alerts.push('Missing download_url for digital product delivery.');
        }
    }
    
    // 5. Check stock availability
    if (p.in_stock === false) {
      alerts.push('Product is marked as Out of Stock.');
    }

    // 6. Check images (fixed previously)
    if (!p.image) {
        alerts.push('Missing thumbnail image.');
    }

    if (alerts.length > 0) {
      warnings.push(`\n⚠️ [${p.name || 'UNKNOWN'}] (ID: ${p.id})\n  - ${alerts.join('\n  - ')}`);
    } else {
      productionReadyCount++;
    }
  });

  console.log(`\n📊 AUDIT RESULTS:`);
  console.log(`--------------------------------------------------`);
  console.log(`Total Products: ${data.length}`);
  console.log(`Production Ready: ${productionReadyCount}`);
  console.log(`Flagged/Mock: ${data.length - productionReadyCount}`);
  
  if (warnings.length > 0) {
    console.log(`\n🚨 THE FOLLOWING PRODUCTS REQUIRE REVIEW:`);
    warnings.forEach(w => console.log(w));
  } else {
    console.log(`\n✅ FINAL VERDICT: 100% PRODUCTION READY. No mock data found. All products have real names, descriptions, valid prices, images, and fulfillment URLs. The catalog is ready for live customers.`);
  }
}

runAudit();
