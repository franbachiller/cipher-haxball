const { net } = require('electron');
const fs = require('fs');
const path = require('path');

// Bridge code is loaded once at startup.
// In production builds, this will be the obfuscated/encrypted version.
const BRIDGE_PATH = path.join(__dirname, 'bridge.enc.js');
const BRIDGE_FALLBACK = path.join(__dirname, '..', 'src', 'inject', 'bridge.js');

let bridgeCode = null;

function loadBridge() {
  if (bridgeCode) return bridgeCode;
  try {
    bridgeCode = fs.readFileSync(BRIDGE_PATH, 'utf8');
    console.log('[Cipher] Loaded encrypted bridge');
  } catch {
    // Fallback to raw source during development
    bridgeCode = fs.readFileSync(BRIDGE_FALLBACK, 'utf8');
    console.log('[Cipher] Loaded dev bridge (unobfuscated)');
  }
  return bridgeCode;
}

/**
 * Set up request interception on the given Electron session.
 * Uses the modern session.protocol.handle('https', ...) API to intercept
 * game-min.js and inject the bridge code. All other requests pass through
 * via net.fetch which preserves cookies and session state.
 */
function setupInterceptor(ses) {
  const bridge = loadBridge();

  ses.protocol.handle('https', async (request) => {
    // Fetch the original response using Electron's net module
    // (preserves session cookies, proxy settings, etc.)
    const response = await net.fetch(request, { bypassCustomProtocolHandlers: true });

    // Only modify game-min.js responses
    if (!request.url.includes('/g/game-min.js')) {
      return response;
    }

    let body = await response.text();

    // Inject bridge before the IIFE closing anchor (same logic as browser.mjs)
    const anchor = 'B.$p()})';
    const idx = body.lastIndexOf(anchor);
    if (idx !== -1) {
      body = body.slice(0, idx) + bridge + '\n' + body.slice(idx);
      console.log('[Cipher] Bridge injected into game-min.js');
    } else {
      console.warn('[Cipher] Could not find injection anchor in game-min.js');
    }

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: { 'content-type': 'application/javascript' },
    });
  });
}

module.exports = { setupInterceptor };
