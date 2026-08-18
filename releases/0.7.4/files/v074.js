/* LS Connect v0.7.4 – unified installed-version display */
const LS_CONNECT_V074_FALLBACK = '0.7.4';

async function v074InstalledVersion() {
  try {
    const response = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      if (data?.version) return String(data.version);
    }
  } catch {}
  return LS_CONNECT_V074_FALLBACK;
}

async function v074RefreshVersionUi() {
  const version = await v074InstalledVersion();
  if (typeof els !== 'undefined' && els.connectionLabel) {
    els.connectionLabel.textContent = `Roleplay Messenger · v${version}`;
  }
  document.querySelectorAll('.account-info-grid').forEach(grid => {
    const label = [...grid.querySelectorAll('span')].find(el => el.textContent.trim() === 'Installiert');
    const value = label?.parentElement?.querySelector('strong');
    if (value) value.textContent = `v${version}`;
  });
  return version;
}

if (typeof openAccountModal === 'function') {
  const v074AccountBase = openAccountModal;
  openAccountModal = async function openAccountModalV074() {
    await v074AccountBase();
    await v074RefreshVersionUi();
  };
}

v074RefreshVersionUi();
console.info('[LS Connect] v0.7.4 unified version display active');
