import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    id: "1000-web-apps",
    name: "1000 Manually Tested Web Applications",
    description: "A comprehensive collection of 1000 manually tested web applications, including 20 free premium bonuses.",
    price: 200,
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&auto=format&fit=crop&q=80",
    inStock: true,
    rating: 4.8,
    features: ['1000+ Tested Applications', '20 Premium Bonuses', 'Diverse Use Cases', 'Clean Codebase', 'Instant Download'],
    specs: { Size: '1.2 GB', Format: 'PDF / Source Code', License: 'Personal & Commercial Use', Updates: 'Lifetime Access' },
    downloadUrl: "/downloads/854187065-1000-Manually-Tested-Web-Applications-With-20-Free-Premium-Bonuses-Ro6wlx.pdf",
    installGuide: "#"
  },
  {
    id: "ultimate-web-dev-bundle",
    name: "Ultimate Web Development Bundle",
    description: "The ultimate bundle for web developers, curated by Glexmedia. Includes premium templates, scripts, UI kits.",
    price: 300,
    category: "Bundles",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80",
    inStock: true,
    rating: 4.9,
    features: ['Premium Templates', 'UI Kits', 'Scripts & Plugins', 'Developer Tools', 'Regular Updates'],
    specs: { Format: 'ZIP / PDF', License: 'Royalty Free', Support: 'Priority Email Support', Components: '500+' },
    downloadUrl: "/downloads/863374232-Ultimate-Web-Devlopment-Bundle-by-Glexmedia-in-Vppalw-2.pdf",
    installGuide: "#"
  },
  {
    id: "ultimate-mega-bundle",
    name: "Ultimate Mega Bundle",
    description: "A massive collection of digital assets. Your one-stop shop for premium creative content.",
    price: 400,
    category: "Bundles",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80",
    inStock: true,
    rating: 5.0,
    features: ['Huge Asset Library', 'Diverse Categories', 'High-Res Graphics', 'Ready-to-use Code', 'Exclusive Content'],
    specs: { Download: 'Instant', Categories: 'Design, Code', 'File Types': 'PSD, AI, HTML', 'Total Files': '5000+' },
    downloadUrl: "/downloads/Ultimate%20Mega%20Bundle.pdf",
    installGuide: "#"
  },
  {
    id: "web-apps-collection",
    name: "Web Applications Collection",
    description: "A curated selection of high-quality functional web apps for your projects.",
    price: 250,
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
    inStock: true,
    rating: 4.7,
    features: ['Modern Tech Stack', 'Responsive Designs', 'Well-Documented', 'Easy Customization', 'Performance Optimized'],
    specs: { DB: 'SQL/NoSQL', Backend: 'Node.js', Frameworks: 'React, Vue', 'Apps Included': '50+' },
    downloadUrl: "/downloads/Web-Applications-dxz4w4_260202_014423.pdf",
    installGuide: "#"
  }
];

async function syncProducts() {
  console.log('Clearing old mock products...');
  
  // Actually we can just delete from products where id is not null to clear everything
  const { error: delErr } = await supabase.from('products').delete().neq('id', 'temp_impossible_id_123');
  if (delErr) {
    console.error('Failed to clear old products:', delErr);
  }
  
  console.log('Inserting real products...');
  
  const payload = products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    image: p.image,
    in_stock: p.inStock,
    rating: p.rating,
    features: p.features,  // maps to jsonb
    specs: p.specs,        // maps to jsonb
    download_url: p.downloadUrl,
    install_guide_url: p.installGuide
  }));

  const { data, error } = await supabase.from('products').upsert(payload);
  
  if (error) {
    console.error('Error inserting real products:', error);
  } else {
    console.log('Success! Dropped mocks and synced all real products to Supabase via Upsert / Delete rule.');
  }
}

syncProducts();
