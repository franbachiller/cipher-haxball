import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const DUMP_DIR = './dump';

function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function urlToPath(url) {
  try {
    const u = new URL(url);
    let p = u.hostname + u.pathname;
    if (p.endsWith('/')) p += 'index.html';
    return join(DUMP_DIR, p);
  } catch {
    return null;
  }
}

(async () => {
  const captured = new Map();

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Interceptar todas las responses
  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();
    if (status < 200 || status >= 400) return;

    const ct = response.headers()['content-type'] || '';
    // Capturar JS, CSS, HTML, JSON, WASM, imágenes
    const dominated = /javascript|css|html|json|wasm|image|font|octet-stream|text\/plain/.test(ct);
    const isHaxball = url.includes('haxball.com');

    if (isHaxball && dominated) {
      try {
        const body = await response.body();
        const filePath = urlToPath(url);
        if (filePath && !captured.has(url)) {
          captured.set(url, filePath);
          ensureDir(filePath);
          writeFileSync(filePath, body);
          console.log(`[${body.length} bytes] ${url}`);
        }
      } catch (e) {
        console.log(`[SKIP] ${url}: ${e.message}`);
      }
    }
  });

  console.log('Navegando a haxball.com/play...');
  await page.goto('https://www.haxball.com/play', { waitUntil: 'networkidle' });

  // Esperar a que cargue el iframe del juego
  console.log('Esperando iframe del juego...');
  await page.waitForTimeout(5000);

  // Extraer HTML del frame principal
  const mainHtml = await page.content();
  ensureDir(join(DUMP_DIR, 'www.haxball.com', 'play.html'));
  writeFileSync(join(DUMP_DIR, 'www.haxball.com', 'play.html'), mainHtml);

  // Buscar iframes y extraer su contenido
  const frames = page.frames();
  console.log(`Frames encontrados: ${frames.length}`);
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    const fUrl = f.url();
    console.log(`  Frame[${i}]: ${fUrl}`);
    try {
      const fHtml = await f.content();
      const fp = urlToPath(fUrl) || join(DUMP_DIR, `frame_${i}.html`);
      ensureDir(fp);
      writeFileSync(fp, fHtml);
    } catch (e) {
      console.log(`  [SKIP frame] ${e.message}`);
    }
  }

  // Extraer todos los scripts inline y externos desde el frame del juego
  const gameFrame = frames.find(f => f.url().includes('game.html')) || page;
  
  // Extraer el estado global del juego
  const gameGlobals = await gameFrame.evaluate(() => {
    const info = {};
    // Buscar scripts
    info.scripts = Array.from(document.querySelectorAll('script')).map(s => ({
      src: s.src || null,
      inline: s.src ? null : s.textContent?.substring(0, 500),
      type: s.type || 'text/javascript'
    }));
    // Links CSS
    info.stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href);
    // Toda la estructura DOM
    info.bodyHtml = document.body?.innerHTML?.substring(0, 5000) || '';
    return info;
  }).catch(() => ({}));

  ensureDir(join(DUMP_DIR, 'analysis', 'game_globals.json'));
  writeFileSync(join(DUMP_DIR, 'analysis', 'game_globals.json'), JSON.stringify(gameGlobals, null, 2));

  console.log('\n=== Archivos capturados ===');
  for (const [url, path] of captured) {
    console.log(`  ${path}`);
  }
  console.log(`\nTotal: ${captured.size} archivos`);
  console.log('Dump completo en ./dump/');

  // Mantener browser abierto 3s más para requests tardíos
  await page.waitForTimeout(3000);

  await browser.close();
})();
