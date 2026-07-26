const form = document.getElementById('activate-form');
const keyInput = document.getElementById('license-key');
const btn = document.getElementById('activate-btn');
const btnText = btn.querySelector('.btn-text');
const btnLoading = btn.querySelector('.btn-loading');
const errorMsg = document.getElementById('error-msg');
const versionEl = document.getElementById('version');

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.hidden = false;
}

// Show version (never let this block the rest of the script)
window.cipher.getStatus()
  .then(s => { versionEl.textContent = `v${s.version}`; })
  .catch(() => {});

// If we were sent back here by a rejected session, explain why.
const reason = new URLSearchParams(location.search).get('reason');
const reasonMessages = {
  license_invalid: 'Tu licencia fue revocada o expiró. Ingresá una clave válida.',
  offline_grace_expired: 'No se pudo verificar tu licencia. Conectate a internet e intentá de nuevo.',
};
if (reason && reasonMessages[reason]) {
  showError(reasonMessages[reason]);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const key = keyInput.value.trim();
  if (!key) return;

  // UI feedback
  btn.disabled = true;
  btnText.hidden = true;
  btnLoading.hidden = false;
  errorMsg.hidden = true;

  try {
    const result = await window.cipher.activate(key);
    if (!result.success) {
      showError(result.error || 'Activation failed');
    }
    // On success, main.js navigates to haxball.com/play automatically
  } catch (err) {
    showError('Error de conexión. Verificá tu internet e intentá de nuevo.');
  } finally {
    btn.disabled = false;
    btnText.hidden = false;
    btnLoading.hidden = true;
  }
});

// Auto-format key input: uppercase only, keep dashes
keyInput.addEventListener('input', () => {
  keyInput.value = keyInput.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
});
