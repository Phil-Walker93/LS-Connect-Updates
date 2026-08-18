/* LS Connect v0.7.2 – collapsible quick actions + character-scoped channel follows */
const LS_CONNECT_V072_VERSION = '0.7.3';
const V072_QUICK_ACTIONS_KEY = 'ls-connect:quick-actions-hidden:v1';

function v072QuickActionsHidden() {
  try { return localStorage.getItem(V072_QUICK_ACTIONS_KEY) === '1'; }
  catch { return false; }
}

function v072SetQuickActionsHidden(hidden) {
  const actions = document.querySelector('.sidebar-actions');
  const gear = $('sidebarQuickActionsGear');
  if (!actions) return;
  actions.classList.toggle('v072-hidden', !!hidden);
  gear?.classList.toggle('hidden', !hidden);
  gear?.setAttribute('aria-hidden', hidden ? 'false' : 'true');
  try { localStorage.setItem(V072_QUICK_ACTIONS_KEY, hidden ? '1' : '0'); } catch {}
}

function v072InstallQuickActionsControls() {
  const actions = document.querySelector('.sidebar-actions');
  const sidebar = document.querySelector('.sidebar');
  if (!actions || !sidebar) return;

  if (!$('sidebarQuickActionsClose')) {
    const close = document.createElement('button');
    close.id = 'sidebarQuickActionsClose';
    close.className = 'v072-quick-actions-close';
    close.type = 'button';
    close.title = 'Schnellzugriffe ausblenden';
    close.setAttribute('aria-label', 'Schnellzugriffe ausblenden');
    close.textContent = '×';
    actions.prepend(close);
    close.addEventListener('click', () => v072SetQuickActionsHidden(true));
  }

  if (!$('sidebarQuickActionsGear')) {
    const gear = document.createElement('button');
    gear.id = 'sidebarQuickActionsGear';
    gear.className = 'v072-quick-actions-gear hidden';
    gear.type = 'button';
    gear.title = 'Schnellzugriffe öffnen';
    gear.setAttribute('aria-label', 'Schnellzugriffe öffnen');
    gear.innerHTML = '<span aria-hidden="true">⚙</span>';
    document.body.appendChild(gear);
    gear.addEventListener('click', () => v072SetQuickActionsHidden(false));
  }

  v072SetQuickActionsHidden(v072QuickActionsHidden());
}

function v072FollowingChannels() {
  return (state.companyChannels || []).filter(ch => ch.is_following === true);
}

v07RenderChannelList = function v072RenderChannelList() {
  const box = $('channelList');
  if (!box) return;
  const me = activeCharacter();
  if (!me) { box.innerHTML = ''; return; }

  const mine = v072FollowingChannels();
  if (!mine.length) {
    box.innerHTML = '<button class="channel-empty" id="channelEmptyBrowse">Kanäle entdecken</button>';
    $('channelEmptyBrowse')?.addEventListener('click', openChannelsBrowserModal);
    return;
  }

  box.innerHTML = mine.slice(0, 8).map(ch => `
    <button class="channel-item" data-channel="${ch.id}" style="--channel-accent:${v07SafeHex(ch.accent_color,'#2563EB')}">
      <img src="${v07ChannelAvatar(ch)}" alt="">
      <div><strong>${escapeHtml(ch.title)}</strong><span>@${escapeHtml(ch.slug)} · ${Number(ch.follower_count||0).toLocaleString('de-DE')} Follower</span></div>
      <b>▣</b>
    </button>`).join('');
  box.querySelectorAll('[data-channel]').forEach(button => button.addEventListener('click', () => openChannelView(button.dataset.channel)));
};

function v072ChannelActionCharacter(expectedCharacterId) {
  const current = state.activeCharacterId;
  if (!current || current !== expectedCharacterId) {
    showToast('Der aktive Charakter hat sich geändert. Kanalansicht wird aktualisiert.', 'info');
    v07LoadChannels();
    return null;
  }
  return current;
}

v07BindChannelDiscoveryActions = function v072BindChannelDiscoveryActions(root) {
  const renderedForCharacterId = state.activeCharacterId;
  root?.querySelectorAll('[data-open-channel]').forEach(b => b.addEventListener('click', () => openChannelView(b.dataset.openChannel)));
  root?.querySelectorAll('[data-join-channel]').forEach(b => b.addEventListener('click', async () => {
    const characterId = v072ChannelActionCharacter(renderedForCharacterId);
    if (!characterId) return;
    const { error } = await db.rpc('join_company_channel', { p_channel_id:b.dataset.joinChannel, p_character_id:characterId });
    if (error) return throwWithToast(error);
    showToast(`Kanal nur für ${activeCharacter()?.name || 'diesen Charakter'} abonniert.`, 'success');
    await v07LoadChannels();
    openChannelsBrowserModal();
  }));
  root?.querySelectorAll('[data-leave-channel]').forEach(b => b.addEventListener('click', async () => {
    const characterId = v072ChannelActionCharacter(renderedForCharacterId);
    if (!characterId) return;
    const { error } = await db.rpc('leave_company_channel', { p_channel_id:b.dataset.leaveChannel, p_character_id:characterId });
    if (error) return throwWithToast(error);
    showToast(`Kanal nur für ${activeCharacter()?.name || 'diesen Charakter'} verlassen.`, 'success');
    await v07LoadChannels();
    openChannelsBrowserModal();
  }));
};

const v072ChannelCardBase = v07ChannelCard;
v07ChannelCard = function v072ChannelCard(ch) {
  const html = v072ChannelCardBase(ch);
  const me = activeCharacter();
  if (!me) return html;
  return html.replace(
    '<div class="channel-card-actions">',
    `<div class="channel-follow-context">Für ${escapeHtml(me.name)}</div><div class="channel-card-actions">`
  );
};

const v072SelectCharacterBase = selectCharacter;
selectCharacter = async function selectCharacterV072(id) {
  if (id !== state.activeCharacterId) {
    state.activeChannelId = null;
    if (state.channelRealtime && db) {
      try { await db.removeChannel(state.channelRealtime); } catch {}
      state.channelRealtime = null;
    }
  }
  await v072SelectCharacterBase(id);
  v07RenderChannelList();
};

if (typeof V07_LOCAL_CHANGELOG !== 'undefined' && !V07_LOCAL_CHANGELOG.some(x => x.version === '0.7.3')) {
  V07_LOCAL_CHANGELOG.unshift({version:'0.7.3',title:'Mobiles Schnellmenü',items:[
    'Das eingeblendete Schnellmenü ist jetzt auch in mobilen und kleinen Ansichten sichtbar',
    'Die Seitenleiste bleibt bei eingeblendeten Schnellzugriffen vertikal scrollbar',
    'Das Zahnrad bleibt oberhalb der mobilen Navigation erreichbar'
  ]});
}

if (typeof V07_LOCAL_CHANGELOG !== 'undefined' && !V07_LOCAL_CHANGELOG.some(x => x.version === '0.7.2')) {
  V07_LOCAL_CHANGELOG.unshift({
    version:'0.7.2',
    title:'Schnellmenü & charaktergebundene Kanäle',
    items:[
      'Schnellzugriffe in der Seitenleiste lassen sich über × ausblenden',
      'Ein kleines Zahnrad unten links blendet die Schnellzugriffe wieder ein',
      'Der ausgeblendete Zustand bleibt nach einem Neustart erhalten',
      'Unternehmenskanäle erscheinen links nur noch bei dem Charakter, der ihnen tatsächlich folgt',
      'Beitreten und Verlassen wirken strikt auf den aktuell aktiven Charakter'
    ]
  });
}

v07CheckForUpdates = async function v072CheckForUpdates(silent=false) {
  try {
    const latest = await v07FetchLatest();
    state.remoteUpdate = latest;
    const available = v07CompareVersions(latest.version, LS_CONNECT_V072_VERSION) > 0;
    if (available) {
      $('updateVersionText').textContent = `LS Connect v${latest.version} verfügbar`;
      $('updateBanner')?.classList.remove('hidden');
      if (!silent) showToast(`Neue Version v${latest.version} verfügbar.`, 'success');
      return latest;
    }
    $('updateBanner')?.classList.add('hidden');
    if (!silent) showToast(`LS Connect v${LS_CONNECT_V072_VERSION} ist aktuell.`, 'success');
    return null;
  } catch (error) {
    if (!silent) showToast('Update-Prüfung fehlgeschlagen: ' + (error.message || 'Unbekannter Fehler'), 'error');
    return null;
  }
};

v07ApplyRemoteUpdate = async function v072ApplyRemoteUpdate() {
  if (state.updateInProgress) return;
  const latest = state.remoteUpdate || await v07CheckForUpdates(false);
  if (!latest || v07CompareVersions(latest.version, LS_CONNECT_V072_VERSION) <= 0) return;
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

const v072AccountBase = openAccountModal;
openAccountModal = async function openAccountModalV072() {
  await v072AccountBase();
  const installed = els.modalContent?.querySelector('.account-info-grid strong');
  if (installed) installed.textContent = `v${LS_CONNECT_V072_VERSION}`;
};

(() => {
  if (document.getElementById('lsConnectV072Styles')) return;
  const style = document.createElement('style');
  style.id = 'lsConnectV072Styles';
  style.textContent = `
    .sidebar-actions{position:relative;padding-top:42px}
    .sidebar-actions.v072-hidden{display:none!important}
    .v072-quick-actions-close{position:absolute;top:4px;right:2px;width:32px;height:32px;border:1px solid var(--border);border-radius:10px;background:var(--panel-2);color:var(--muted);font-size:1.35rem;line-height:1;display:grid;place-items:center;cursor:pointer;transition:.15s ease}
    .v072-quick-actions-close:hover{color:var(--text);border-color:var(--accent)}
    .v072-quick-actions-gear{position:fixed;z-index:90;left:max(10px,env(safe-area-inset-left));bottom:max(10px,env(safe-area-inset-bottom));width:42px;height:42px;border:1px solid var(--border);border-radius:13px;background:color-mix(in srgb,var(--panel) 92%,transparent);color:var(--text);box-shadow:0 10px 32px rgba(0,0,0,.35);font-size:1.15rem;display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(12px)}
    .v072-quick-actions-gear.hidden{display:none!important}
    .channel-follow-context{font-size:.72rem;color:var(--muted);text-align:right;margin-bottom:4px}
    @media(max-width:900px){.v072-quick-actions-gear{bottom:calc(74px + env(safe-area-inset-bottom))}.sidebar-actions{padding-top:40px}}
    @media(max-width:700px){.sidebar-actions:not(.v072-hidden){display:grid!important;gap:8px;padding-top:40px;padding-bottom:8px;flex:0 0 auto}.sidebar-actions.v072-hidden{display:none!important}.sidebar{overflow-y:auto!important;overscroll-behavior:contain;scrollbar-width:thin}.channel-list{flex:0 0 auto}.v072-quick-actions-gear{bottom:calc(74px + env(safe-area-inset-bottom))}}
  `;
  document.head.appendChild(style);
})();

v072InstallQuickActionsControls();
v07RenderChannelList();
if (els.connectionLabel) els.connectionLabel.textContent = `Roleplay Messenger · v${LS_CONNECT_V072_VERSION}`;
console.info(`[LS Connect] v${LS_CONNECT_V072_VERSION} patch active`);
