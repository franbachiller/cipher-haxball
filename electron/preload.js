const { contextBridge, ipcRenderer } = require('electron');

// Expose a minimal, safe API to the renderer process.
// This is available as window.cipher in haxball.com/play and the login page.
contextBridge.exposeInMainWorld('cipher', {
  // License activation (used by login UI)
  activate: (key) => ipcRenderer.invoke('license:activate', key),
  getLicenseStatus: () => ipcRenderer.invoke('license:status'),

  // App info
  getStatus: () => ipcRenderer.invoke('cipher:status'),
});
