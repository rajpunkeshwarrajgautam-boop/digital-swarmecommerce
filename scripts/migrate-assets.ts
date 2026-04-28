import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'digital_assets';

async function migrateAssets() {
  console.log(`[VAULT_SECURE] Initiating Asset Migration to Supabase Bucket: ${BUCKET_NAME}`);

  // 1. Ensure bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error("Failed to list buckets:", listError);
    return;
  }

  const bucketExists = buckets.find((b) => b.name === BUCKET_NAME);
  if (!bucketExists) {
    console.log(`Bucket ${BUCKET_NAME} not found. Creating private bucket...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: false, // CRITICAL: Must be false for professional grade security
      fileSizeLimit: 524288000, // 500MB
    });

    if (createError) {
      console.error("Failed to create bucket:", createError);
      return;
    }
    console.log("Bucket created securely.");
  } else {
    console.log(`Bucket ${BUCKET_NAME} verified.`);
  }

  // 2. Scan public/downloads
  const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
  if (!fs.existsSync(downloadsDir)) {
    console.error(`Directory not found: ${downloadsDir}`);
    return;
  }

  const files = fs.readdirSync(downloadsDir);
  console.log(`Found ${files.length} assets to migrate.`);

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const filePath = path.join(downloadsDir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile()) {
      console.log(`Uploading: ${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB)...`);
      
      const fileBuffer = fs.readFileSync(filePath);
      
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(file, fileBuffer, {
          upsert: true,
          contentType: getContentType(file)
        });

      if (uploadError) {
        console.error(`❌ Failed to upload ${file}:`, uploadError.message);
        failCount++;
      } else {
        console.log(`✅ Uploaded ${file} securely.`);
        successCount++;
      }
    }
  }

  console.log(`\n[VAULT_SECURE] Migration Complete.`);
  console.log(`Total Uploaded: ${successCount}`);
  console.log(`Total Failed: ${failCount}`);
  console.log(`Next step: Delete the public/downloads directory to ensure security.`);
}

function getContentType(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.zip': return 'application/zip';
    case '.pdf': return 'application/pdf';
    case '.html': return 'text/html';
    case '.css': return 'text/css';
    case '.txt': return 'text/plain';
    case '.md': return 'text/markdown';
    case '.tsx': return 'text/typescript-jsx';
    default: return 'application/octet-stream';
  }
}

migrateAssets().catch(console.error);
