import { createClient } from '@supabase/supabase-js';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const bucket = supabase.storage.from('digital_assets');

const sharedFiles = [
  'swarm-paid-prompt-core.md',
  'ai-prompt-library.txt',
  'saas-launch-checklist.txt',
  'saas-tech-stack-audit.txt',
  'design-system-tokens.css',
];

const packs = [
  ['The AI Executive Playbook', 'ai-executive-playbook.html', 'ai-executive-playbook.zip'],
  ['Elite Legal Protocol', 'swarm-legal-optimized.html', 'swarm-legal-optimized.zip'],
  ['Elite Real Estate Protocol', 'swarm-property-optimized.html', 'swarm-property-optimized.zip'],
  ['Elite Finance Protocol', 'swarm-capital-optimized.html', 'swarm-capital-optimized.zip'],
  ['Elite Healthcare Protocol', 'swarm-voice.html', 'swarm-voice.zip'],
  ['Elite Digital Marketing Protocol', 'sentinel-seo-optimized.html', 'sentinel-seo-optimized.zip'],
  ['Elite Copywriting Protocol', 'swarm-content-architect.html', 'swarm-content-architect.zip'],
  ['Elite SaaS Protocol', 'swarm-uiux-auditor.html', 'swarm-uiux-auditor.zip'],
  ['Elite E-commerce Protocol', 'ai-services-agency.html', 'ai-services-agency.zip'],
  ['Sentinel Research Infiltrator', 'sentinel-research-optimized.html', 'sentinel-research-optimized.zip'],
  ['Swarm Cinema Infiltrator', 'swarm-cinema.html', 'swarm-cinema.zip'],
  ['Swarm Finance Agent', 'swarm-finance-optimized.html', 'swarm-finance-optimized.zip'],
  ['Swarm Sales Infiltrator', 'swarm-sales-optimized.html', 'swarm-sales-optimized.zip'],
  ['Elite Recruitment Protocol', 'swarm-talent-optimized.html', 'swarm-talent-optimized.zip'],
  ['Elite Home Services Protocol', 'sentinel-voyager.html', 'sentinel-voyager.zip'],
];

async function downloadBuffer(name) {
  const { data, error } = await bucket.download(name);
  if (error || !data) throw new Error(`Unable to download ${name}: ${error?.message || 'missing object'}`);
  return Buffer.from(await data.arrayBuffer());
}

function rewriteDeliveryHtml(buffer) {
  return buffer
    .toString('utf8')
    .replace(/(["'])\/downloads\/([A-Za-z0-9._-]+)\1/g, '$1$2$1')
    .replace(/https:\/\/digitalswarm\.in\/downloads\/([A-Za-z0-9._-]+)/gi, '$1');
}

const shared = new Map();
for (const name of sharedFiles) shared.set(name, await downloadBuffer(name));

const root = mkdtempSync(join(tmpdir(), 'digital-swarm-delivery-'));
try {
  for (const [productName, sourceHtml, outputZip] of packs) {
    const dir = join(root, outputZip.replace(/\.zip$/i, ''));
    mkdirSync(dir, { recursive: true });

    const html = rewriteDeliveryHtml(await downloadBuffer(sourceHtml));
    writeFileSync(join(dir, sourceHtml), html, 'utf8');
    for (const [name, buffer] of shared) writeFileSync(join(dir, name), buffer);

    writeFileSync(
      join(dir, 'READ_ME_FIRST.txt'),
      `Digital Swarm — ${productName}\n\nThis licensed archive is the complete post-payment delivery bundle for this SKU.\n\nStart with: ${sourceHtml}\nThe HTML page now links to helper files stored inside this same archive, so it does not depend on public /downloads URLs.\n\nIncluded shared files:\n${sharedFiles.map((name) => `- ${name}`).join('\n')}\n\nSupport: support@digitalswarm.in\n`,
      'utf8',
    );

    const zipPath = join(root, outputZip);
    execFileSync('zip', ['-rq', zipPath, '.'], { cwd: dir, stdio: 'inherit' });
    const payload = readFileSync(zipPath);
    if (payload.length < 1000) throw new Error(`${outputZip} is unexpectedly small`);

    const { error: uploadError } = await bucket.upload(outputZip, payload, {
      contentType: 'application/zip',
      cacheControl: '3600',
      upsert: true,
    });
    if (uploadError) throw new Error(`Unable to upload ${outputZip}: ${uploadError.message}`);
    console.log(`packed ${productName} -> ${outputZip} (${payload.length} bytes)`);
  }
} finally {
  rmSync(root, { recursive: true, force: true });
}

console.log(`Repacked ${packs.length} private delivery bundles.`);
