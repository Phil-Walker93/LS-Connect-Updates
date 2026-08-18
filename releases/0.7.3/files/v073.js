/* LS Connect v0.7.3 – mobile quick actions visibility hotfix */
const LS_CONNECT_V073_VERSION = '0.7.3';

(() => {
  if (document.getElementById('lsConnectV073Styles')) return;
  const style = document.createElement('style');
  style.id = 'lsConnectV073Styles';
  style.textContent = `
    @media (max-width:700px) {
      .sidebar-actions:not(.v072-hidden) {
        display: grid !important;
        gap: 8px;
        padding-top: 40px;
        padding-bottom: 8px;
        flex: 0 0 auto;
      }
      .sidebar-actions.v072-hidden {
        display: none !important;
      }
      .sidebar {
        overflow-y: auto;
        overscroll-behavior: contain;
        scrollbar-width: thin;
      }
      .channel-list {
        flex: 0 0 auto;
      }
      .v072-quick-actions-gear {
        bottom: calc(74px + env(safe-area-inset-bottom));
      }
    }
  `;
  document.head.appendChild(style);
})();

// Re-apply the persisted state after the mobile override is installed.
if (typeof v072SetQuickActionsHidden === 'function' && typeof v072QuickActionsHidden === 'function') {
  v072SetQuickActionsHidden(v072QuickActionsHidden());
}

if (typeof V07_LOCAL_CHANGELOG !== 'undefined' && !V07_LOCAL_CHANGELOG.some(x => x.version === '0.7.3')) {
  V07_LOCAL_CHANGELOG.unshift({
    version:'0.7.3',
    title:'Mobiles Schnellmenü',
    items:[
      'Das eingeblendete Schnellmenü wird jetzt auch in der mobilen/kleinen Ansicht sichtbar',
      'Die Seitenleiste kann bei eingeblendeten Schnellzugriffen vertikal scrollen',
      'Das Zahnrad bleibt oberhalb der mobilen Navigation erreichbar'
    ]
  });
}

v07CheckForUpdates = async function v073CheckForUpdates(silent=false) {
  try {
    const latest = await v07FetchLatest();
    state.remoteUpdate = latest;
    const available = v07CompareVersions(latest.version, LS_CONNECT_V073_VERSION) > 0;
    if (available) {
      $('updateVersionText').textContent = `LS Connect v${latest.version} verfügbar`;
      $('updateBanner')?.classList.remove('hidden');
      if (!silent) showToast(`Neue Version v${latest.version} verfügbar.`, 'success');
      return latest;
    }
    $('updateBanner')?.classList.add('hidden');
    if (!silent) showToast(`LS Connect v${LS_CONNECT_V073_VERSION} ist aktuell.`, 'success');
    return null;
  } catch (error) {
    if (!silent) showToast('Update-Prüfung fehlgeschlagen: ' + (error.message || 'Unbekannter Fehler'), 'error');
    return null;
  }
};

v07ApplyRemoteUpdate = async function v073ApplyRemoteUpdate() {
  if (state.updateInProgress) return;
  const latest = state.remoteUpdate || await v07CheckForUpdates(false);
  if (!latest || v07CompareVersions(latest.version, LS_CONNECT_V073_VERSION) <= 0) return;
  state.updateInProgress = true;
  const btn = $('applyUpdateButton');
  if (btn) { btn.disabled = true; btn.textContent = 'Installiere…'; }
  try {
    const response = await fetch('/__lsconnect/update/apply', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({expected_version:latest.version})
    });
    if (!response.ok) {
      let msg='Update konnte nicht installiert werden.';
      try { const j=await response.json(); msg=j.error||msg; } catch {}
      throw new Error(msg);
    }
    const result = await response.json();
    $('updateVersionText').textContent = `v${result.version||latest.version} installiert – Neustart…`;
    showToast('Update installiert. LS Connect startet neu.', 'success');
    try { await fetch('/__lsconnect/update/restart',{method:'POST'}); } catch {}
    const started=Date.now(), target=result.version||latest.version;
    const poll=setInterval(async()=>{
      if(Date.now()-started>20000){clearInterval(poll);location.reload();return;}
      try {
        const r=await fetch(`/version.json?t=${Date.now()}`,{cache:'no-store'});
        if(r.ok){const j=await r.json();if(v07CompareVersions(j.version,target)>=0){clearInterval(poll);location.reload();}}
      } catch {}
    },700);
  } catch(error) {
    showToast(error.message||'Update fehlgeschlagen.','error');
    if(btn){btn.disabled=false;btn.textContent='Jetzt aktualisieren';}
    state.updateInProgress=false;
  }
};

const v073AccountBase = openAccountModal;
openAccountModal = async function openAccountModalV073() {
  await v073AccountBase();
  const installed = els.modalContent?.querySelector('.account-info-grid strong');
  if (installed) installed.textContent = `v${LS_CONNECT_V073_VERSION}`;
};

if (els.connectionLabel) els.connectionLabel.textContent = `Roleplay Messenger · v${LS_CONNECT_V073_VERSION}`;
console.info(`[LS Connect] v${LS_CONNECT_V073_VERSION} mobile quick-actions hotfix active`);
