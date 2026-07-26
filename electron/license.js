const { app } = require('electron');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { generateHWID } = require('./hwid');

// Supabase config — loaded from config.js (gitignored).
// Copy config.example.js to config.js and fill in your credentials.
const config = require('./config');
const SUPABASE_URL = process.env.CIPHER_SUPABASE_URL || config.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.CIPHER_SUPABASE_ANON_KEY || config.SUPABASE_ANON_KEY;

// Local storage for license data (encrypted with a machine-derived key)
const LICENSE_FILE = path.join(app.getPath('userData'), 'license.dat');
const ENCRYPTION_KEY = crypto.createHash('sha256')
  .update('cipher-local-' + (process.env.USERNAME || process.env.USER || 'default'))
  .digest();

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(data) {
  const [ivHex, encrypted] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/** Call a Supabase RPC function. */
async function rpc(fnName, params) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(params),
  });

  return response.json();
}

/**
 * Activate a license key via Supabase RPC.
 * Sends key + HWID; Supabase binds the key to this machine on first use.
 */
async function validateLicense(key) {
  const hwid = generateHWID();
  const data = await rpc('activate_license', { p_key: key, p_hwid: hwid });

  if (data.success) {
    return { success: true, token: data.token };
  }
  return { success: false, error: data.error || 'Activation failed' };
}

/**
 * Verify an existing token via Supabase RPC.
 * Called on startup to re-validate the license.
 */
async function verifyToken(token) {
  const hwid = generateHWID();

  try {
    const data = await rpc('verify_token', { p_token: token, p_hwid: hwid });
    return data.valid === true;
  } catch {
    // Supabase unreachable — allow grace period
    return null;
  }
}

/** Save license data to encrypted local file. */
function saveLicense(data) {
  try {
    const json = JSON.stringify(data);
    fs.writeFileSync(LICENSE_FILE, encrypt(json), 'utf8');
  } catch (err) {
    console.error('[Cipher] Failed to save license:', err.message);
  }
}

/** Load license data from encrypted local file. */
function loadLicense() {
  try {
    if (!fs.existsSync(LICENSE_FILE)) return null;
    const raw = fs.readFileSync(LICENSE_FILE, 'utf8');
    return JSON.parse(decrypt(raw));
  } catch {
    return null;
  }
}

/** Clear stored license data. */
function clearLicense() {
  try {
    if (fs.existsSync(LICENSE_FILE)) fs.unlinkSync(LICENSE_FILE);
  } catch {
    // Ignore cleanup errors
  }
}

module.exports = { validateLicense, verifyToken, saveLicense, loadLicense, clearLicense };
