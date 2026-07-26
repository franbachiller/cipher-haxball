const crypto = require('crypto');
const { execSync } = require('child_process');
const os = require('os');

/**
 * Generate a stable hardware fingerprint (HWID) for this machine.
 * Combines CPU model, motherboard serial, primary disk serial,
 * and primary NIC MAC address into a SHA-256 hash.
 *
 * Windows-only for now — uses WMIC/PowerShell commands.
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

  // Primary NIC MAC address (first non-internal interface)
  const nics = os.networkInterfaces();
  let mac = 'no-mac';
  for (const [name, addrs] of Object.entries(nics)) {
    for (const addr of addrs) {
      if (!addr.internal && addr.mac && addr.mac !== '00:00:00:00:00:00') {
        mac = addr.mac;
        break;
      }
    }
    if (mac !== 'no-mac') break;
  }
  components.push(mac);

  // Hash all components together
  const raw = components.join('|');
  return crypto.createHash('sha256').update(raw).digest('hex');
}

module.exports = { generateHWID };
