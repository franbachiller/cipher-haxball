const crypto = require('crypto');
const { execSync } = require('child_process');
const os = require('os');

/**
 * Generate a stable hardware fingerprint (HWID) for this machine.
 * Combines CPU model, motherboard serial and primary disk serial into a
 * SHA-256 hash. MAC address is deliberately excluded: it changes across
 * reboots when VPN/virtual adapters reorder, which unbinds the license.
 *
 * Windows-only for now — uses PowerShell/CIM commands.
 */
function generateHWID() {
  const components = [];

  // CPU model identifier
  components.push(os.cpus()[0]?.model || 'unknown-cpu');

  // Motherboard serial (Windows)
  try {
    const mb = execSync(
      'powershell -NoProfile -Command "(Get-CimInstance Win32_BaseBoard).SerialNumber"',
      { encoding: 'utf8', timeout: 5000 }
    ).trim();
    components.push(mb || 'no-mb-serial');
  } catch {
    components.push('no-mb-serial');
  }

  // Primary disk serial (Windows)
  try {
    const disk = execSync(
      'powershell -NoProfile -Command "(Get-CimInstance Win32_DiskDrive | Select-Object -First 1).SerialNumber"',
      { encoding: 'utf8', timeout: 5000 }
    ).trim();
    components.push(disk || 'no-disk-serial');
  } catch {
    components.push('no-disk-serial');
  }

  // Hash all components together
  const raw = components.join('|');
  return crypto.createHash('sha256').update(raw).digest('hex');
}

module.exports = { generateHWID };
