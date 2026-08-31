// Production build orchestrator.
//
// Steps:
//   1. Read prod Supabase creds from environment variables.
//   2. Generate config.prod.js (gitignored) with ONLY the prod creds.
//   3. Obfuscate the bridge into bridge.enc.js.
//   4. Run electron-builder (which packages config.prod.js, never config.dev.js).
//   5. Always clean up the generated config.prod.js afterwards.
//
// The resulting installer contains only prod credentials — zero dev creds.
//
// Usage (PowerShell):
//   $env:CIPHER_PROD_SUPABASE_URL="https://xxxx.supabase.co"
//   $env:CIPHER_PROD_SUPABASE_ANON_KEY="eyJ..."
//   npm run build

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const electronDir = path.join(__dirname, '..');
const prodConfigPath = path.join(electronDir, 'config.prod.js');

const URL = process.env.CIPHER_PROD_SUPABASE_URL;
const ANON = process.env.CIPHER_PROD_SUPABASE_ANON_KEY;

if (!URL || !ANON) {
  console.error(
    'Missing prod credentials. Set both environment variables before building:\n' +
    '  CIPHER_PROD_SUPABASE_URL\n' +
    '  CIPHER_PROD_SUPABASE_ANON_KEY'
  );
  process.exit(1);
}

function writeProdConfig() {
  const contents =
    '// AUTO-GENERATED at build time by scripts/build.js. Do not edit or commit.\n' +
    'module.exports = {\n' +
    `  SUPABASE_URL: ${JSON.stringify(URL)},\n` +
    `  SUPABASE_ANON_KEY: ${JSON.stringify(ANON)},\n` +
    '};\n';
  fs.writeFileSync(prodConfigPath, contents, 'utf8');
  console.log('[build] Generated config.prod.js');
}

function cleanupProdConfig() {
  try {
    if (fs.existsSync(prodConfigPath)) {
      fs.unlinkSync(prodConfigPath);
      console.log('[build] Removed config.prod.js');
    }
  } catch (err) {
    console.error('[build] WARNING: could not remove config.prod.js:', err.message);
  }
}

function run(cmd) {
  console.log(`[build] $ ${cmd}`);
  execSync(cmd, { cwd: electronDir, stdio: 'inherit', env: process.env });
}

try {
  writeProdConfig();

  console.log('[build] Obfuscating bridge...');
  run('node scripts/obfuscate.js');

  console.log('[build] Packaging with electron-builder...');
  run('npx electron-builder --win');

  console.log('[build] Done. Installer is in electron/dist/');
} finally {
  // Never leave prod creds on disk, even if the build failed.
  cleanupProdConfig();
}
