const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const { setupInterceptor } = require('./interceptor');
const { validateLicense, saveLicense, loadLicense, clearLicense } = require('./license');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 540,
    title: 'Cipher',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const saved = loadLicense();
  if (saved && saved.token) {
    startGame(saved.token);
  } else {
    mainWindow.loadFile(path.join(__dirname, 'ui', 'login.html'));
  }
}

async function startGame(token) {
  // Set up the game-min.js interceptor before navigating
  setupInterceptor(mainWindow.webContents.session);

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
      saveLicense({ key, token: result.token, activatedAt: Date.now() });
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
