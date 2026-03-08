const postgres = require('postgres');
const connectionString = 'postgresql://postgres:DigitalSwarm%402026%21@db.xbjdosyqgznveddlyiqh.supabase.co:5432/postgres';
const sql = postgres(connectionString, { ssl: 'require' });

async function fixProducts() {
  console.log('Connecting to Supabase Database via direct Postgres to delete old products...');
  
  try {
    // Delete all products
    await sql`DELETE FROM public.products;`;
    console.log('✅ Deleted all old products.');
    
    // Insert new products
    const productsToInsert = [
      {
        id: "1000-web-apps",
        name: "1000 Manually Tested Web Applications",
        description: "A comprehensive collection of 1000 manually tested web applications, including 20 free premium bonuses.",
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
        id: "ultimate-web-dev-bundle",
        name: "Ultimate Web Development Bundle",
        description: "The ultimate bundle for web developers, curated by Glexmedia. Includes premium templates, scripts, UI kits.",
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
        id: "ultimate-mega-bundle",
        name: "Ultimate Mega Bundle",
        description: "A massive collection of digital assets. Your one-stop shop for premium creative content.",
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
        id: "web-apps-collection",
        name: "Web Applications Collection",
        description: "A curated selection of high-quality functional web apps for your projects.",
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

    for (const p of productsToInsert) {
      await sql`
        INSERT INTO public.products (name, description, price, category, image, in_stock, rating, features, specs, download_url, install_guide)
        VALUES (${p.name}, ${p.description}, ${p.price}, ${p.category}, ${p.image}, ${p.in_stock}, ${p.rating}, ${p.features}, ${sql.json(p.specs)}, ${p.download_url}, ${p.install_guide})
      `;
      console.log(`✅ Inserted ${p.name}`);
    }

  } catch (error) {
    console.error('❌ Error executing SQL:', error);
  } finally {
    await sql.end();
  }
}

fixProducts();
