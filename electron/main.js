const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const { setupInterceptor } = require('./interceptor');
const { setupAdblock } = require('./adblock');
const { validateLicense, verifyToken, saveLicense, loadLicense, clearLicense } = require('./license');

// How long the launcher runs offline before requiring a fresh online check.
const GRACE_PERIOD_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

// Match electron-builder's appId so Windows uses Cipher's icon and groups
// taskbar windows under the application instead of the generic Electron app.
app.setAppUserModelId('com.cipher.haxball');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 540,
    title: 'Cipher Launcher',
    icon: path.join(__dirname, 'ui', 'cipherC.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Keep the window title fixed; haxball.com would otherwise overwrite it.
  mainWindow.on('page-title-updated', (e) => {
    e.preventDefault();
    mainWindow.setTitle('Cipher Launcher');
  });

  // TEMP DIAG: mirror renderer console (incl. bridge) to a file so we can read
  // OP Mode diagnostics without opening DevTools. Remove after diagnosis.
  const fs = require('fs');
  const logPath = path.join(app.getPath('userData'), 'cipher-console.log');
  mainWindow.webContents.on('console-message', (_e, _level, message) => {
    if (message.includes('[Cipher')) {
      try { fs.appendFileSync(logPath, message + '\n'); } catch {}
    }
  });
  console.log('[Cipher] console log ->', logPath);

  bootstrap();
}

/**
 * Decide whether to show the game or the login screen.
 * Re-validates the saved token online so revocations take effect.
 */
async function bootstrap() {
  const saved = loadLicense();

  if (!saved || !saved.token) {
    return showLogin();
  }

  const valid = await verifyToken(saved.token);

  if (valid === true) {
    // Confirmed active online — refresh the grace-period timestamp
    saveLicense({ ...saved, lastVerified: Date.now() });
    return startGame(saved.token);
  }

  if (valid === false) {
    // Revoked / expired / HWID mismatch — force re-activation
    clearLicense();
    return showLogin('license_invalid');
  }

  // valid === null: Supabase unreachable. Allow offline use within grace period.
  const lastOk = saved.lastVerified || saved.activatedAt || 0;
  if (Date.now() - lastOk < GRACE_PERIOD_MS) {
    return startGame(saved.token);
  }
  return showLogin('offline_grace_expired');
}

function showLogin(reason) {
  if (reason) {
    mainWindow.loadFile(path.join(__dirname, 'ui', 'login.html'), { query: { reason } });
  } else {
    mainWindow.loadFile(path.join(__dirname, 'ui', 'login.html'));
  }
}

async function startGame(token) {
  // Set up the game-min.js interceptor (CDP-based) before navigating
  setupInterceptor(mainWindow.webContents);

  // Block ads/trackers at the network layer and hide the empty ad column
  setupAdblock(mainWindow.webContents.session, mainWindow.webContents);

  // Disable CORS restrictions so haxball.com loads cleanly
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, cb) => {
    const headers = { ...details.responseHeaders };
    delete headers['x-frame-options'];
    delete headers['X-Frame-Options'];
    cb({ responseHeaders: headers });
  });

  await mainWindow.loadURL('https://www.haxball.com/play');
  console.log('[Cipher] haxball.com/play loaded');
}

// ---- IPC Handlers ----

ipcMain.handle('license:activate', async (_event, key) => {
  try {
    const result = await validateLicense(key);
    if (result.success) {
      const now = Date.now();
      saveLicense({ key, token: result.token, activatedAt: now, lastVerified: now });
      await startGame(result.token);
      return { success: true };
    }
    return { success: false, error: result.error };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('license:status', () => {
  const saved = loadLicense();
  return { active: !!(saved && saved.token), key: saved?.key || null };
});

ipcMain.handle('license:deactivate', () => {
  clearLicense();
  showLogin();
  return { success: true };
});

ipcMain.handle('cipher:status', () => {
  return { version: app.getVersion() };
});

// ---- App lifecycle ----

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
