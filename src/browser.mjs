import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BRIDGE_CODE = readFileSync(join(__dirname, 'inject', 'bridge.js'), 'utf8');

/**
 * Launch Chromium with the bridge injected into game-min.js.
 * The user plays normally — F9 toggles the AI.
 */
export async function launch({ headless = false } = {}) {
  const browser = await chromium.launch({
    headless,
    args: [
      '--disable-features=WebRtcHideLocalIpsWithMdns',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  // Intercept game-min.js and inject bridge code inside the IIFE
  await page.route('**/g/game-min.js', async (route) => {
    const response = await route.fetch();
    let body = await response.text();

    // The IIFE ends with: B.$p()})("undefined"!=typeof window?...);
    // Inject bridge before B.$p() so all classes are in scope
    const anchor = 'B.$p()})';
    const idx = body.lastIndexOf(anchor);
    if (idx !== -1) {
      body = body.slice(0, idx) + BRIDGE_CODE + '\n' + body.slice(idx);
      console.log('[+] Bridge injected into game-min.js');
    } else {
      console.warn('[!] Could not find injection anchor in game-min.js');
    }

    await route.fulfill({
      response,
      body,
      headers: { ...response.headers(), 'content-type': 'application/javascript' },
    });
  });

  await page.goto('https://www.haxball.com/play', { waitUntil: 'domcontentloaded' });
  console.log('[+] haxball.com/play loaded — play normally, press F9 to toggle AI');

  return { browser, page };
}
