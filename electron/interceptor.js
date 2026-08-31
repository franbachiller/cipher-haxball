const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// Bridge code is loaded once at startup.
// In production builds, this will be the obfuscated/encrypted version.
const BRIDGE_PATH = path.join(__dirname, 'bridge.enc.js');
const BRIDGE_FALLBACK = path.join(__dirname, '..', 'src', 'inject', 'bridge.js');

let bridgeCode = null;

function loadBridge() {
  if (bridgeCode) return bridgeCode;
  // Dev (unpackaged): always use the raw source so edits take effect on
  // restart. Prod (packaged): use the obfuscated bridge. A stale bridge.enc.js
  // in the working tree must never shadow the source during development.
  if (!app.isPackaged) {
    bridgeCode = fs.readFileSync(BRIDGE_FALLBACK, 'utf8');
    console.log('[Cipher] Loaded dev bridge (unobfuscated source)');
    return bridgeCode;
  }
  bridgeCode = fs.readFileSync(BRIDGE_PATH, 'utf8');
  console.log('[Cipher] Loaded encrypted bridge');
  return bridgeCode;
}

// The IIFE in game-min.js ends with this anchor. We inject the bridge just
// before it so all the game's minified classes (T, Da, B, ...) are in scope.
const INJECT_ANCHOR = 'B.$p()})';

/**
 * Set up request interception via the Chrome DevTools Protocol (CDP).
 *
 * Unlike protocol.handle('https', ...), which forces *every* HTTPS request to
 * be re-fetched through Node (breaking ad/tracker domains with non-standard
 * SSL and redirect chains), CDP's Fetch domain lets us pause only the requests
 * that match game-min.js. Everything else is handled natively by Chromium —
 * faster, and no SSL/redirect breakage.
 */
function setupInterceptor(webContents) {
  const bridge = loadBridge();
  const dbg = webContents.debugger;

  try {
    dbg.attach('1.3');
  } catch (err) {
    console.error('[Cipher] Failed to attach debugger:', err.message);
    return;
  }

  dbg.on('message', async (_event, method, params) => {
    if (method !== 'Fetch.requestPaused') return;

    const { requestId, request } = params;

    // Only touch the game script; let everything else continue untouched.
    if (!request.url.includes('/g/game-min.js')) {
      dbg.sendCommand('Fetch.continueRequest', { requestId }).catch(() => {});
      return;
    }

    try {
      // Grab the original response body from the paused request.
      const res = await dbg.sendCommand('Fetch.getResponseBody', { requestId });
      let body = res.base64Encoded
        ? Buffer.from(res.body, 'base64').toString('utf8')
        : res.body;

      const idx = body.lastIndexOf(INJECT_ANCHOR);
      if (idx !== -1) {
        body = body.slice(0, idx) + bridge + '\n' + body.slice(idx);
        console.log('[Cipher] Bridge injected into game-min.js (%d bytes)', bridge.length);
      } else {
        console.error('[Cipher] Injection anchor not found — serving original game-min.js');
      }

      const headers = [
        { name: 'Content-Type', value: 'application/javascript' },
      ];

      await dbg.sendCommand('Fetch.fulfillRequest', {
        requestId,
        responseCode: 200,
        responseHeaders: headers,
        body: Buffer.from(body, 'utf8').toString('base64'),
      });
    } catch (err) {
      console.error('[Cipher] game-min.js intercept failed:', err.message);
      // Don't break the game — let the original request proceed.
      dbg.sendCommand('Fetch.continueRequest', { requestId }).catch(() => {});
    }
  });

  // Pause only game-min.js, and only at the Response stage so the body exists.
  dbg.sendCommand('Fetch.enable', {
    patterns: [
      { urlPattern: '*game-min.js*', requestStage: 'Response' },
    ],
  }).then(() => {
    console.log('[Cipher] CDP Fetch interception enabled (game-min.js only)');
  }).catch(err => {
    console.error('[Cipher] Fetch.enable failed:', err.message);
  });
}

module.exports = { setupInterceptor };
