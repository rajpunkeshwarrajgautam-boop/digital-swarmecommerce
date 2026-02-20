
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("❌ Missing Supabase keys in .env");
    process.exit(1);
}

const supabase = createClient(url, key);

async function check() {
    console.log("Creating connection to:", url);
    
    // Check Products
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });

    if (error) {
        console.error("❌ Failed to query 'products' table.");
        console.error("   Error:", error.message);
        if (error.code === 'PGRST204') {
            console.error("   Hint: The table probably doesn't exist. Please run src/db/schema.sql in your Supabase SQL Editor.");
        }
    } else {
        console.log("✅ 'products' table exists.");
        
        const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
        console.log(`   Found ${count} products.`);
    }

    // Check Orders
    const { error: orderError } = await supabase.from('orders').select('count', { count: 'exact', head: true });
    if (orderError) {
         console.error("❌ Failed to query 'orders' table. (Maybe schema.sql not run?)");
    } else {
         console.log("✅ 'orders' table exists.");
    }
}

check();
