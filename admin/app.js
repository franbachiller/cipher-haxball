// ---- Supabase config ----
// Credentials live in config.js (gitignored). Copy config.example.js to
// config.js and fill in your service_role key. This panel needs full DB access.
const cfg = window.CIPHER_ADMIN_CONFIG;
if (!cfg || !cfg.SUPABASE_URL || !cfg.SUPABASE_SERVICE_KEY) {
  alert('Missing config.js — copy config.example.js to config.js and add your Supabase credentials.');
  throw new Error('Missing CIPHER_ADMIN_CONFIG');
}

const sb = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_SERVICE_KEY);

// ---- Environment switcher ----
// Dev is the default. Production requires an explicit click and remains
// visually loud throughout the page.
const isProd = cfg.env === 'prod';
const envDevBtn = document.getElementById('env-dev-btn');
const envProdBtn = document.getElementById('env-prod-btn');
const createEnvLabel = document.getElementById('create-env-label');
const generateBtn = document.getElementById('generate-btn');

if (isProd) {
  envProdBtn.classList.add('active-prod');
} else {
  envDevBtn.classList.add('active-dev');
}
document.body.classList.toggle('is-prod', isProd);
createEnvLabel.textContent = isProd ? 'creating in production' : 'creating in dev';
generateBtn.textContent = isProd ? 'Generate in production' : 'Generate in dev';

envDevBtn.addEventListener('click', () => switchEnvironment('dev'));
envProdBtn.addEventListener('click', () => switchEnvironment('prod'));

function switchEnvironment(env) {
  const url = new URL(location.href);
  if (env === 'prod') {
    url.searchParams.set('env', 'prod');
  } else {
    url.searchParams.delete('env');
  }
  location.href = url.toString();
}

// ---- DOM refs ----
const createForm = document.getElementById('create-form');
const noteInput = document.getElementById('note');
const daysInput = document.getElementById('days');
const createdKey = document.getElementById('created-key');
const licenseBody = document.getElementById('license-body');
const emptyMsg = document.getElementById('empty-msg');
const refreshBtn = document.getElementById('refresh-btn');

// ---- Generate key ----
function generateKey() {
  const seg = () => {
    const bytes = new Uint8Array(2);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  };
  return `CIPHER-${seg()}-${seg()}-${seg()}`;
}

createForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (isProd && !confirm('Create this license in PRODUCTION? It will work in the installed launcher.')) {
    return;
  }

  const note = noteInput.value.trim() || null;
  const days = parseInt(daysInput.value) || null;
  const expiresAt = days ? new Date(Date.now() + days * 86400000).toISOString() : null;
  const key = generateKey();

  const { error } = await sb.from('licenses').insert({
    key,
    note,
    expires_at: expiresAt,
  });

  if (error) {
    alert('Error: ' + error.message);
    return;
  }

  createdKey.textContent = key;
  createdKey.hidden = false;
  noteInput.value = '';
  daysInput.value = '';
  loadLicenses();
});

// ---- Load licenses ----
async function loadLicenses() {
  const { data, error } = await sb
    .from('licenses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Load error:', error);
    return;
  }

  licenseBody.innerHTML = '';
  emptyMsg.hidden = data.length > 0;

  for (const lic of data) {
    const tr = document.createElement('tr');
    const status = getStatus(lic);

    tr.innerHTML = `
      <td class="key">${lic.key}</td>
      <td>${lic.note || '<span style="color:#333">—</span>'}</td>
      <td class="hwid" title="${lic.hwid || ''}">${lic.hwid ? lic.hwid.slice(0, 12) + '...' : '<span style="color:#444">unbound</span>'}</td>
      <td><span class="status status-${status.cls}">${status.label}</span></td>
      <td>${lic.expires_at ? formatDate(lic.expires_at) : '<span style="color:#333">—</span>'}</td>
      <td class="actions">
        ${lic.status !== 'revoked' ? `<button class="btn-revoke" data-id="${lic.id}">Revoke</button>` : ''}
        <button class="btn-delete" data-id="${lic.id}" data-key="${lic.key}">Delete</button>
      </td>
    `;
    licenseBody.appendChild(tr);
  }

  // Bind action buttons
  document.querySelectorAll('.btn-revoke').forEach(btn => {
    btn.addEventListener('click', () => revokeLicense(btn.dataset.id));
  });
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteLicense(btn.dataset.id, btn.dataset.key));
  });
}

function getStatus(lic) {
  if (lic.status === 'revoked') return { label: 'revoked', cls: 'revoked' };
  if (lic.expires_at && new Date(lic.expires_at) < new Date()) return { label: 'expired', cls: 'expired' };
  if (!lic.hwid) return { label: 'unused', cls: 'unbound' };
  return { label: 'active', cls: 'active' };
}

function formatDate(iso) {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, '0');
  const mon = (d.getMonth() + 1).toString().padStart(2, '0');
  const yr = d.getFullYear();
  return `${day}/${mon}/${yr}`;
}

// ---- Revoke ----
async function revokeLicense(id) {
  const { error } = await sb.from('licenses').update({ status: 'revoked' }).eq('id', id);
  if (error) {
    alert('Error: ' + error.message);
    return;
  }
  loadLicenses();
}

// ---- Delete (permanent) ----
async function deleteLicense(id, key) {
  if (!confirm(`Delete ${key} permanently? This cannot be undone.`)) return;
  const { error } = await sb.from('licenses').delete().eq('id', id);
  if (error) {
    alert('Error: ' + error.message);
    return;
  }
  loadLicenses();
}

// ---- Init ----
refreshBtn.addEventListener('click', loadLicenses);
loadLicenses();
