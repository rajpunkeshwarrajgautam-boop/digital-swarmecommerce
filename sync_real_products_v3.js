const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    name: "1000 Manually Tested Web Applications",
    description: "A comprehensive collection of 1000 manually tested web applications, including 20 free premium bonuses. Start your development journey with tested codebases.",
    price: 200,
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&auto=format&fit=crop&q=80",
    in_stock: true,
    rating: 4.8,
    features: ['1000+ Tested Applications', '20 Premium Bonuses', 'Diverse Use Cases', 'Clean Codebase', 'Instant Download'],
    specs: { Size: '1.2 GB', Format: 'PDF / Source Code', License: 'Personal & Commercial Use', Updates: 'Lifetime Access' },
    download_url: "/downloads/854187065-1000-Manually-Tested-Web-Applications-With-20-Free-Premium-Bonuses-Ro6wlx.pdf",
    install_guide: "#"
  },
  {
    name: "Ultimate Web Development Bundle",
    description: "The ultimate bundle for web developers, curated by Glexmedia. Includes premium templates, scripts, UI kits to accelerate your next sprint.",
    price: 300,
    category: "Bundles",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80",
    in_stock: true,
    rating: 4.9,
    features: ['Premium Templates', 'UI Kits', 'Scripts & Plugins', 'Developer Tools', 'Regular Updates'],
    specs: { Format: 'ZIP / PDF', License: 'Royalty Free', Support: 'Priority Email Support', Components: '500+' },
    download_url: "/downloads/863374232-Ultimate-Web-Devlopment-Bundle-by-Glexmedia-in-Vppalw-2.pdf",
    install_guide: "#"
  },
  {
    name: "Ultimate Mega Bundle",
    description: "A massive collection of digital assets. Your one-stop shop for premium creative content spanning multiple design and code requirements.",
    price: 400,
    category: "Bundles",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80",
    in_stock: true,
    rating: 5.0,
    features: ['Huge Asset Library', 'Diverse Categories', 'High-Res Graphics', 'Ready-to-use Code', 'Exclusive Content'],
    specs: { Download: 'Instant', Categories: 'Design, Code', 'File Types': 'PSD, AI, HTML', 'Total Files': '5000+' },
    download_url: "/downloads/Ultimate%20Mega%20Bundle.pdf",
    install_guide: "#"
  },
  {
    name: "Web Applications Collection",
    description: "A curated selection of high-quality functional web apps for your projects. Fully responsive and ready to be customized.",
    price: 250,
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
    in_stock: true,
    rating: 4.7,
    features: ['Modern Tech Stack', 'Responsive Designs', 'Well-Documented', 'Easy Customization', 'Performance Optimized'],
    specs: { DB: 'SQL/NoSQL', Backend: 'Node.js', Frameworks: 'React, Vue', 'Apps Included': '50+' },
    download_url: "/downloads/Web-Applications-dxz4w4_260202_014423.pdf",
    install_guide: "#"
  }
];

async function execute() {
  console.log('1. Deleting all old products from Supabase database...');
  
  // Safe way to delete all rows - we filter where name is not an impossible string
  const { error: delErr } = await supabase.from('products').delete().neq('name', 'impossible_name_that_should_never_exist_!@#');
  
  if (delErr) {
    console.error('Failed to clear old products:', delErr);
    return;
  }
  
  console.log('Old products cleared! \n2. Inserting the new real products over API...');
  
  for (const p of products) {
    const { error } = await supabase.from('products').upsert(p, { onConflict: 'name' });
    if (error) {
      console.error(`❌ Failed to insert: ${p.name}`, error);
    } else {
      console.log(`✅ Uploaded: ${p.name}`);
    }
  }
  
  console.log('Done! Database perfectly reflects the real products from D Drive.');
}

execute();
