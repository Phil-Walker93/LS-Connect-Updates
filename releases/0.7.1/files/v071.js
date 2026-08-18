/* LS Connect v0.7.1 – profile overlay close fix + admin trash */
const LS_CONNECT_V071_VERSION = '0.7.1';

function v071Esc(value) { return escapeHtml(String(value ?? '')); }
function v071FormatDate(value) {
  if (!value) return '—';
  try { return new Intl.DateTimeFormat('de-DE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value)); }
  catch { return String(value); }
}

// --- Mobile/compact profile info: always offer a deterministic way out --------------------------
function v071CloseProfilePanel() {
  els.profilePanel?.classList.remove('mobile-profile-open');
}

$('closeProfilePanelButton')?.addEventListener('click', v071CloseProfilePanel);
els.mobileBackButton?.addEventListener('click', v071CloseProfilePanel, true);

// Clicking the info button a second time still toggles the original panel. Keep the dedicated close
// button in sync for touch devices and compact desktop windows.
els.profileToggleButton?.addEventListener('click', () => {
  requestAnimationFrame(() => {
    const open = els.profilePanel?.classList.contains('mobile-profile-open');
    $('closeProfilePanelButton')?.setAttribute('aria-hidden', open ? 'false' : 'true');
  });
});

// Escape is convenient on desktop and avoids a trapped overlay when viewport changes.
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && els.profilePanel?.classList.contains('mobile-profile-open')) v071CloseProfilePanel();
});

// --- Admin panel v0.7.1 --------------------------------------------------------------------------
async function v071AdminLoadActive(query='') {
  const { data, error } = await db.rpc('admin_search_characters', { p_query: query });
  if (error) throw error;
  return data || [];
}

async function v071AdminLoadTrash(query='') {
  const { data, error } = await db.rpc('admin_search_deleted_characters', { p_query: query });
  if (error) throw error;
  return data || [];
}

function v071RenderAdminActive(chars) {
  const box = $('adminActiveResults');
  if (!box) return;
  box.innerHTML = chars.length ? chars.map(c => `<div class="staff-card admin-character-row">
    <div class="request-main"><strong>${v071Esc(c.name)}</strong><span>${v071Esc(c.handle)} · ${v071Esc(c.account_type)}${c.is_suspended ? ' · GESPERRT' : ''}</span>${c.suspension_reason ? `<small>${v071Esc(c.suspension_reason)}</small>` : ''}</div>
    <button class="small-button ${c.is_suspended ? 'primary' : 'danger'}" data-admin-suspend="${c.id}" data-suspended="${c.is_suspended}">${c.is_suspended ? 'Entsperren' : 'Sperren'}</button>
  </div>`).join('') : '<p class="notification-note">Keine aktiven Charaktere gefunden.</p>';
  box.querySelectorAll('[data-admin-suspend]').forEach(b => b.addEventListener('click', async () => {
    const suspend = b.dataset.suspended !== 'true';
    const reason = suspend ? (prompt('Grund der Sperre (optional):') || '') : '';
    const { error } = await db.rpc('admin_set_character_suspended', { p_character_id: b.dataset.adminSuspend, p_suspended: suspend, p_reason: reason });
    if (error) return throwWithToast(error);
    showToast(suspend ? 'Charakter gesperrt.' : 'Charakter entsperrt.', 'success');
    await loadCharacters(); renderAll();
    v071RefreshAdminTab('active');
  }));
}

function v071RenderAdminTrash(chars) {
  const box = $('adminTrashResults');
  if (!box) return;
  box.innerHTML = chars.length ? chars.map(c => `<div class="staff-card admin-character-row admin-trash-row">
    <div class="request-main"><strong>${v071Esc(c.display_name || c.name || 'Gelöschter Charakter')}</strong><span>${v071Esc(c.display_handle || c.handle || '—')} · gelöscht ${v071Esc(v071FormatDate(c.deleted_at))}</span><small>${c.original_account_type ? v071Esc(c.original_account_type) : 'Gelöschter Charakter'}${c.can_restore === false ? ' · nur endgültiges Löschen möglich' : ''}</small></div>
    <div class="action-row admin-trash-actions">
      <button class="small-button primary" data-admin-restore="${c.id}" ${c.can_restore === false ? 'disabled' : ''}>Wiederherstellen</button>
      <button class="small-button danger" data-admin-purge="${c.id}">Endgültig löschen</button>
    </div>
  </div>`).join('') : '<p class="notification-note">Der Papierkorb ist leer.</p>';

  box.querySelectorAll('[data-admin-restore]').forEach(b => b.addEventListener('click', async () => {
    if (!confirm('Diesen Charakter wirklich wiederherstellen?')) return;
    b.disabled = true;
    const { error } = await db.rpc('admin_restore_deleted_character', { p_character_id: b.dataset.adminRestore });
    if (error) { b.disabled=false; return throwWithToast(error); }
    showToast('Charakter wiederhergestellt.', 'success');
    await loadCharacters(); renderAll();
    v071RefreshAdminStats();
    v071RefreshAdminTab('trash');
  }));

  box.querySelectorAll('[data-admin-purge]').forEach(b => b.addEventListener('click', async () => {
    const first = confirm('Dieser Vorgang ist endgültig. Der Charakter kann danach nicht wiederhergestellt werden. Fortfahren?');
    if (!first) return;
    const typed = prompt('Zur Bestätigung ENDGÜLTIG eingeben:');
    if (String(typed || '').trim().toUpperCase() !== 'ENDGÜLTIG') return showToast('Endgültiges Löschen abgebrochen.', 'info');
    b.disabled = true;
    const { error } = await db.rpc('admin_purge_deleted_character', { p_character_id: b.dataset.adminPurge });
    if (error) { b.disabled=false; return throwWithToast(error); }
    showToast('Charakter endgültig anonymisiert und aus dem Papierkorb entfernt.', 'success');
    v071RefreshAdminStats();
    v071RefreshAdminTab('trash');
  }));
}

async function v071RefreshAdminStats() {
  const { data, error } = await db.rpc('admin_overview');
  if (error) return;
  const o = data || {};
  const values = {
    adminStatAccounts:o.accounts||0, adminStatCharacters:o.characters||0, adminStatDeleted:o.deleted_characters||0,
    adminStatChats:o.conversations||0, adminStatMessages:o.messages||0, adminStatStories:o.active_stories||0,
    adminStatSuspended:o.suspended_characters||0
  };
  Object.entries(values).forEach(([id,v]) => { const el=$(id); if(el)el.textContent=String(v); });
}

async function v071RefreshAdminTab(tab) {
  try {
    if (tab === 'trash') {
      const chars = await v071AdminLoadTrash($('adminTrashSearch')?.value.trim() || '');
      v071RenderAdminTrash(chars);
    } else {
      const chars = await v071AdminLoadActive($('adminActiveSearch')?.value.trim() || '');
      v071RenderAdminActive(chars);
    }
  } catch (error) { throwWithToast(error); }
}

openAdminModal = async function openAdminModalV071() {
  const overviewRes = await db.rpc('admin_overview');
  if (overviewRes.error) return throwWithToast(overviewRes.error);
  const o = overviewRes.data || {};
  openModal('LS Connect Administration', `<div class="admin-stats">
    <div><strong id="adminStatAccounts">${o.accounts||0}</strong><span>Accounts</span></div>
    <div><strong id="adminStatCharacters">${o.characters||0}</strong><span>Aktive Charaktere</span></div>
    <div><strong id="adminStatDeleted">${o.deleted_characters||0}</strong><span>Gelöscht</span></div>
    <div><strong id="adminStatChats">${o.conversations||0}</strong><span>Chats</span></div>
    <div><strong id="adminStatMessages">${o.messages||0}</strong><span>Nachrichten</span></div>
    <div><strong id="adminStatStories">${o.active_stories||0}</strong><span>Stories</span></div>
    <div><strong id="adminStatSuspended">${o.suspended_characters||0}</strong><span>Gesperrt</span></div>
  </div>
  <div class="admin-tabs" role="tablist">
    <button id="adminActiveTab" class="admin-tab active" type="button">Administration</button>
    <button id="adminTrashTab" class="admin-tab" type="button">Papierkorb <span class="admin-trash-count">${o.deleted_characters||0}</span></button>
  </div>
  <section id="adminActivePane" class="settings-block admin-tab-pane">
    <h3>Charaktermoderation</h3>
    <p class="notification-note">Gelöschte Charaktere erscheinen nicht mehr in dieser Liste.</p>
    <div class="contact-search"><input id="adminActiveSearch" placeholder="Name oder @Username"></div>
    <div id="adminActiveResults"></div>
  </section>
  <section id="adminTrashPane" class="settings-block admin-tab-pane hidden">
    <h3>Gelöschte Charaktere</h3>
    <p class="notification-note">Wiederherstellen stellt das RP-Profil erneut bereit. „Endgültig löschen“ entfernt die Wiederherstellungsmöglichkeit, anonymisiert die Zuordnung zum Master-Account und lässt alte Nachrichten als historischen Verlauf bestehen.</p>
    <div class="contact-search"><input id="adminTrashSearch" placeholder="Papierkorb durchsuchen"></div>
    <div id="adminTrashResults"></div>
  </section>`);

  let timer;
  const activate = tab => {
    const trash = tab === 'trash';
    $('adminActiveTab')?.classList.toggle('active', !trash); $('adminTrashTab')?.classList.toggle('active', trash);
    $('adminActivePane')?.classList.toggle('hidden', trash); $('adminTrashPane')?.classList.toggle('hidden', !trash);
    v071RefreshAdminTab(tab);
  };
  $('adminActiveTab')?.addEventListener('click', () => activate('active'));
  $('adminTrashTab')?.addEventListener('click', () => activate('trash'));
  $('adminActiveSearch')?.addEventListener('input', () => { clearTimeout(timer); timer=setTimeout(()=>v071RefreshAdminTab('active'),220); });
  $('adminTrashSearch')?.addEventListener('input', () => { clearTimeout(timer); timer=setTimeout(()=>v071RefreshAdminTab('trash'),220); });
  activate('active');
};

// Extend the locally cached changelog while the central file is fetched in the background.
if (typeof V07_LOCAL_CHANGELOG !== 'undefined' && !V07_LOCAL_CHANGELOG.some(x => x.version === '0.7.1')) {
  V07_LOCAL_CHANGELOG.unshift({version:'0.7.1',title:'Admin-Papierkorb & Info-Fix',items:[
    'Info-/Profilansicht kann auf Handy und kompakten Fenstern zuverlässig geschlossen werden',
    'Gelöschte Charaktere sind im Admin-Paneel in einem eigenen Papierkorb getrennt',
    'Admins können gelöschte Charaktere wiederherstellen',
    'Admins können gelöschte Charaktere irreversibel anonymisieren und endgültig aus dem Papierkorb entfernen'
  ]});
}

// --- v0.7.1 version-aware updater bridge ---------------------------------------------------------
v07CheckForUpdates = async function v071CheckForUpdates(silent=false) {
  try {
    const latest = await v07FetchLatest();
    state.remoteUpdate = latest;
    const available = v07CompareVersions(latest.version, LS_CONNECT_V071_VERSION) > 0;
    if (available) {
      $('updateVersionText').textContent = `LS Connect v${latest.version} verfügbar`;
      $('updateBanner')?.classList.remove('hidden');
      if (!silent) showToast(`Neue Version v${latest.version} verfügbar.`, 'success');
      return latest;
    }
    $('updateBanner')?.classList.add('hidden');
    if (!silent) showToast(`LS Connect v${LS_CONNECT_V071_VERSION} ist aktuell.`, 'success');
    return null;
  } catch (error) {
    if (!silent) showToast('Update-Prüfung fehlgeschlagen: ' + (error.message || 'Unbekannter Fehler'), 'error');
    return null;
  }
};

v07ApplyRemoteUpdate = async function v071ApplyRemoteUpdate() {
  if (state.updateInProgress) return;
  const latest = state.remoteUpdate || await v07CheckForUpdates(false);
  if (!latest || v07CompareVersions(latest.version, LS_CONNECT_V071_VERSION) <= 0) return;
  state.updateInProgress = true;
  const btn = $('applyUpdateButton');
  if (btn) { btn.disabled = true; btn.textContent = 'Installiere…'; }
  try {
    const response = await fetch('/__lsconnect/update/apply', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({expected_version:latest.version})});
    if (!response.ok) {
      let msg='Update konnte nicht installiert werden.';
      try { const j=await response.json(); msg=j.error||msg; } catch {}
      throw new Error(msg);
    }
    const result=await response.json();
    $('updateVersionText').textContent=`v${result.version||latest.version} installiert – Neustart…`;
    showToast('Update installiert. LS Connect startet neu.', 'success');
    try { await fetch('/__lsconnect/update/restart',{method:'POST'}); } catch {}
    const started=Date.now(), target=result.version||latest.version;
    const poll=setInterval(async()=>{
      if(Date.now()-started>20000){clearInterval(poll);location.reload();return;}
      try { const r=await fetch(`/version.json?t=${Date.now()}`,{cache:'no-store'}); if(r.ok){const j=await r.json();if(v07CompareVersions(j.version,target)>=0){clearInterval(poll);location.reload();}} } catch {}
    },700);
  } catch(error) {
    showToast(error.message||'Update fehlgeschlagen.','error');
    if(btn){btn.disabled=false;btn.textContent='Jetzt aktualisieren';}
    state.updateInProgress=false;
  }
};

const v071AccountBase = openAccountModal;
openAccountModal = async function openAccountModalV071() {
  await v071AccountBase();
  const installed = els.modalContent?.querySelector('.account-info-grid strong');
  if (installed) installed.textContent = `v${LS_CONNECT_V071_VERSION}`;
  const note = els.modalContent?.querySelector('.whats-new-block .notification-note');
  if (note) note.textContent = 'Neue Versionen werden sicher über die zentrale LS-Connect-Updatequelle installiert.';
};

// Keep v0.7.1-specific styling inside the patch so the self-updater does not need to replace the
// large main stylesheet for this hotfix.
(() => {
  if (document.getElementById('lsConnectV071Styles')) return;
  const style = document.createElement('style');
  style.id = 'lsConnectV071Styles';
  style.textContent = `
    .profile-panel{position:relative}.profile-panel-close{display:none;position:absolute;right:14px;top:14px;z-index:3;width:38px;height:38px;border-radius:12px;border:1px solid var(--border);background:color-mix(in srgb,var(--panel) 90%,transparent);color:var(--text);font-size:1.45rem;line-height:1;cursor:pointer}
    .admin-tabs{display:flex;gap:8px;margin:16px 0 4px;padding:4px;border:1px solid var(--border);border-radius:14px;background:color-mix(in srgb,var(--panel) 80%,transparent)}.admin-tab{flex:1;border:0;border-radius:10px;padding:10px 12px;background:transparent;color:var(--muted);font-weight:700;cursor:pointer}.admin-tab.active{background:var(--accent);color:#06120b}.admin-trash-count{display:inline-grid;min-width:22px;height:22px;place-items:center;margin-left:5px;border-radius:999px;background:rgba(0,0,0,.18);font-size:.75rem}.admin-character-row{align-items:center;gap:12px}.admin-trash-row{border-style:dashed}.admin-trash-actions{flex-wrap:wrap;justify-content:flex-end}
    @media(max-width:1050px){.profile-panel.mobile-profile-open .profile-panel-close{display:grid;place-items:center}.profile-panel.mobile-profile-open{padding-top:max(64px,calc(env(safe-area-inset-top) + 54px))}}
    @media(max-width:900px){.admin-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.admin-character-row{align-items:flex-start}.admin-trash-actions{width:100%;justify-content:stretch}.admin-trash-actions button{flex:1}}
  `;
  document.head.appendChild(style);
})();

if (els.connectionLabel) els.connectionLabel.textContent = `Roleplay Messenger · v${LS_CONNECT_V071_VERSION}`;
console.info(`[LS Connect] v${LS_CONNECT_V071_VERSION} patch active`);
