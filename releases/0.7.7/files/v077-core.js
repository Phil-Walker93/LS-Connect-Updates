/* LS Connect v0.7.7 \u2013 persistent character state + last seen */
const LS_CONNECT_V077_VERSION = '0.7.7';
Object.assign(state, {
  uiPreferenceLoadedV077: false,
  uiPreferenceUserIdV077: null,
  lastSeenV077: new Map(),
  presenceHeartbeatTimerV077: null,
  lastSeenRefreshTimerV077: null
});

function v077ActiveCharacterStorageKey() {
  return `ls-connect:active-character:${state.user?.id || 'anonymous'}`;
}

function v077RememberActiveCharacterLocal(id) {
  try {
    if (id) localStorage.setItem(v077ActiveCharacterStorageKey(), id);
    else localStorage.removeItem(v077ActiveCharacterStorageKey());
  } catch {}
}

function v077ReadActiveCharacterLocal() {
  try { return localStorage.getItem(v077ActiveCharacterStorageKey()) || null; }
  catch { return null; }
}

async function v077LoadUiPreferenceOnce() {
  if (state.mode !== 'online' || !db) return;
  if (state.uiPreferenceLoadedV077 && state.uiPreferenceUserIdV077 === state.user?.id) return;
  state.uiPreferenceLoadedV077 = true;
  state.uiPreferenceUserIdV077 = state.user?.id || null;
  let preferred = null;
  try {
    const { data, error } = await db.rpc('my_ui_preferences_v077');
    if (!error) preferred = data?.[0]?.active_character_id || null;
  } catch {}
  preferred ||= v077ReadActiveCharacterLocal();
  if (preferred) state.activeCharacterId = preferred;
}

async function v077PersistActiveCharacter(id = state.activeCharacterId) {
  if (state.mode !== 'online' || !db) return;
  v077RememberActiveCharacterLocal(id);
  try {
    const { error } = await db.rpc('set_active_character_v077', { p_character_id: id || null });
    if (error) console.warn('[LS Connect] Aktiver Charakter konnte nicht serverseitig gespeichert werden.', error);
  } catch (error) {
    console.warn('[LS Connect] Aktiver Charakter konnte nicht serverseitig gespeichert werden.', error);
  }
}

async function v077LoadLastSeen() {
  state.lastSeenV077 = state.lastSeenV077 instanceof Map ? state.lastSeenV077 : new Map();
  if (state.mode !== 'online' || !db || !state.activeCharacterId) return state.lastSeenV077;
  try {
    const { data, error } = await db.rpc('my_contact_last_seen_v077', { p_character_id: state.activeCharacterId });
    if (error) throw error;
    state.lastSeenV077 = new Map((data || []).map(row => [row.character_id, row.last_seen_at || null]));
  } catch (error) {
    console.warn('[LS Connect] Last-Seen konnte nicht geladen werden.', error);
  }
  return state.lastSeenV077;
}

async function v077TouchPresence(characterId = state.activeCharacterId) {
  if (state.mode !== 'online' || !db || !characterId) return;
  try {
    const { error } = await db.rpc('touch_character_presence_v077', { p_character_id: characterId });
    if (error) throw error;
  } catch (error) {
    console.warn('[LS Connect] Presence-Heartbeat fehlgeschlagen.', error);
  }
}

function v077FormatLastSeen(value) {
  if (!value) return 'Offline';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Offline';
  const diff = Math.max(0, Date.now() - d.getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Zuletzt online gerade eben';
  if (min < 60) return `Zuletzt online vor ${min} Min.`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `Zuletzt online vor ${hours} Std.`;
  const now = new Date();
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Zuletzt online gestern um ${d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}`;
  if (diff < 7 * 86400000) return `Zuletzt online ${d.toLocaleDateString('de-DE',{weekday:'short'})} um ${d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}`;
  return `Zuletzt online am ${d.toLocaleDateString('de-DE')} um ${d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}`;
}

formatRelativeStatus = function formatRelativeStatusV077(character) {
  if (!character) return 'Nicht verbunden';
  if (state.mode === 'online' && state.onlineCharacterIds?.has(character.id)) return 'Online';
  if (state.mode === 'online') return v077FormatLastSeen(state.lastSeenV077?.get(character.id));
  return character.status || 'Demo';
};

const v077LoadCharactersBase = loadCharacters;
loadCharacters = async function loadCharactersV077() {
  if (state.mode === 'online') await v077LoadUiPreferenceOnce();
  await v077LoadCharactersBase();
  if (state.mode === 'online') {
    if (state.activeCharacterId) {
      const remembered = v077ReadActiveCharacterLocal();
      v077RememberActiveCharacterLocal(state.activeCharacterId);
      if (remembered !== state.activeCharacterId) await v077PersistActiveCharacter(state.activeCharacterId);
      await v077LoadLastSeen();
    } else if (v077ReadActiveCharacterLocal()) {
      await v077PersistActiveCharacter(null);
    }
  }
};

const v077StartPresenceBase = startPresence;
startPresence = async function startPresenceV077() {
  await v077StartPresenceBase();
  clearInterval(state.presenceHeartbeatTimerV077);
  clearInterval(state.lastSeenRefreshTimerV077);
  if (state.mode !== 'online' || !state.activeCharacterId) return;
  const characterId = state.activeCharacterId;
  await v077TouchPresence(characterId);
  state.presenceHeartbeatTimerV077 = setInterval(() => {
    if (state.activeCharacterId === characterId) v077TouchPresence(characterId);
  }, 30000);
  state.lastSeenRefreshTimerV077 = setInterval(async () => {
    if (state.activeCharacterId !== characterId) return;
    await v077LoadLastSeen();
    renderHeaderAndProfile();
  }, 30000);
};

const v077CleanupRealtimeBase = cleanupRealtime;
cleanupRealtime = async function cleanupRealtimeV077() {
  clearInterval(state.presenceHeartbeatTimerV077);
  clearInterval(state.lastSeenRefreshTimerV077);
  state.presenceHeartbeatTimerV077 = null;
  state.lastSeenRefreshTimerV077 = null;
  const oldId = state.activeCharacterId;
  if (oldId && state.mode === 'online') await v077TouchPresence(oldId);
  await v077CleanupRealtimeBase();
};

const v077SelectCharacterBase = selectCharacter;
selectCharacter = async function selectCharacterV077(id) {
  const oldId = state.activeCharacterId;
  if (oldId && oldId !== id && state.mode === 'online') await v077TouchPresence(oldId);
  await v077SelectCharacterBase(id);
  if (state.activeCharacterId === id && state.mode === 'online') {
    await v077PersistActiveCharacter(id);
    await v077LoadLastSeen();
    renderHeaderAndProfile();
  }
};

// Verify both the management list and the actual switcher order after saving.
v07PersistCharacterOrder = async function v07PersistCharacterOrderV077(orderIds) {
  if (!orderIds?.length) return;
  if (state.mode === 'demo') {
    orderIds.forEach((id,i) => { const c=state.demo.characters.find(x=>x.id===id); if(c)c.sort_order=i; });
    await loadCharacters();
    return;
  }
  const { error } = await db.rpc('set_character_order', { p_character_ids: orderIds });
  if (error) throw error;
  const [managementRes,activeRes] = await Promise.all([
    db.rpc('my_character_management_v07'),
    db.rpc('my_characters_v07')
  ]);
  if (managementRes.error) throw managementRes.error;
  if (activeRes.error) throw activeRes.error;
  const management = managementRes.data || [];
  const activeRows = activeRes.data || [];
  const actualAll = management.map(x=>x.id);
  const expectedAll = orderIds.filter(id=>actualAll.includes(id));
  if (expectedAll.join('|') !== actualAll.join('|')) throw new Error('Die Charakterreihenfolge wurde vom Server nicht vollst\u00e4ndig \u00fcbernommen.');
  const actualActive = activeRows.map(x=>x.id);
  const expectedActive = orderIds.filter(id=>actualActive.includes(id));
  if (expectedActive.join('|') !== actualActive.join('|')) throw new Error('Die aktive Charakterliste wurde nicht in der gew\u00fcnschten Reihenfolge geladen.');
  state.characterManagement = management;
  await loadCharacters();
};

// Persist the initially selected first character for accounts that did not have a preference yet.
setTimeout(() => {
  if (state.mode === 'online' && state.activeCharacterId) v077PersistActiveCharacter(state.activeCharacterId);
}, 1600);


if (typeof V076_LOCAL_CHANGELOG !== 'undefined' && !V076_LOCAL_CHANGELOG.some(x => x.version === '0.7.7')) {
  V076_LOCAL_CHANGELOG.unshift({version:'0.7.7',title:'Medien, Presence & Anrufverlauf',items:[
    'Zuletzt-online-Anzeige fuer Kontakte',
    'Charakterreihenfolge und zuletzt aktiver Charakter bleiben nach F5 erhalten',
    'Robuster Bild-Upload fuer Profile, Chats, Unternehmenskan\u00e4le und Status',
    'Verpasste Anrufe erscheinen als Systemereignis im Chat'
  ]});
}

console.info('[LS Connect] v0.7.7 character state + last-seen active');

// Show live/last-seen information directly in the contact list as well.
if (typeof openContactsModalV05 === 'function') {
  const v077ContactsModalBase = openContactsModalV05;
  openContactsModalV05 = async function openContactsModalV077() {
    if (state.mode === 'online') await v077LoadLastSeen();
    await v077ContactsModalBase();
    document.querySelectorAll('[data-contact-chat]').forEach(button => {
      const id = button.dataset.contactChat;
      const contact = (state.contacts || []).find(c => c.id === id);
      const main = button.closest('.request-card')?.querySelector('.request-main');
      if (!contact || !main || main.querySelector('.v077-last-seen')) return;
      const status = document.createElement('small');
      status.className = 'v077-last-seen';
      status.textContent = formatRelativeStatus(contact);
      main.appendChild(status);
    });
  };
}
