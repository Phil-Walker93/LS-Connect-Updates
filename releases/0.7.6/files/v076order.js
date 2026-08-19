// ---------- Character order verification ---------------------------------------------------------
v07PersistCharacterOrder = async function v07PersistCharacterOrderV076(orderIds) {
  if(!orderIds.length)return;
  if(state.mode==='demo'){orderIds.forEach((id,i)=>{const c=state.demo.characters.find(x=>x.id===id);if(c)c.sort_order=i;});await loadCharacters();return;}
  const{error}=await db.rpc('set_character_order',{p_character_ids:orderIds});if(error)throw error;
  const{data,error:verifyError}=await db.rpc('my_character_management_v07');if(verifyError)throw verifyError;
  const actual=(data||[]).map(x=>x.id);const expected=orderIds.filter(id=>actual.includes(id));
  if(expected.join('|')!==actual.join('|'))throw new Error('Die Charakterreihenfolge konnte nicht verifiziert werden.');
  state.characterManagement=data||[];await loadCharacters();
};

// ---------- Changelog ---------------------------------------------------------------------------
const V076_LOCAL_CHANGELOG=[
  {version:'0.7.6',title:'Gro\u00dfer Stabilit\u00e4ts- & Komfortpatch',items:['Antwortvorschau bleibt innerhalb der Nachrichtenbox','Eingehende Anrufe erhalten einen Polling-Fallback','Unternehmenskanal-Posts lassen sich wieder l\u00f6schen','Deutlich gr\u00f6\u00dfere Emoji-Auswahl und Emojis bei Kontaktnamen','Chats k\u00f6nnen archiviert und gel\u00f6schte Direktchats lokal entfernt werden','Gelesen-Doppelhaken werden blau dargestellt','Charakterreihenfolge wird nach dem Speichern verifiziert','Neue Nachrichten erhalten zuverl\u00e4ssige Unread-Badges','Online-Punkt steht direkt neben dem Kontaktnamen','Neues Bug- und \u00c4nderungsticket-System inklusive Admin-Statusverwaltung','Was ist neu? l\u00e4dt wieder den aktuellen zentralen Changelog']},
  {version:'0.7.5',title:'Einheitliche Versionsquelle',items:['Alle Versionsanzeigen und die Update-Pr\u00fcfung verwenden version.json']},
  {version:'0.7.4',title:'Client-Ladefix',items:['Server- und Client-Versionen wurden wieder synchronisiert']},
  {version:'0.7.3',title:'Mobiles Schnellmen\u00fc',items:['Schnellzugriffe sind auch in kleinen Ansichten wieder sichtbar']},
  {version:'0.7.2',title:'Schnellmen\u00fc & charaktergebundene Kan\u00e4le',items:['Schnellzugriffe lassen sich ausblenden','Kanal-Follows gelten strikt pro Charakter']},
  {version:'0.7.1',title:'Admin-Papierkorb & Info-Fix',items:['Gel\u00f6schte Charaktere sind getrennt verwaltbar','Wiederherstellen und endg\u00fcltiges L\u00f6schen']},
  {version:'0.7.0',title:'Kan\u00e4le, Personalisierung & Updater',items:['Unternehmenskan\u00e4le','Chat-Personalisierung','Charaktersortierung','Selbst-Updater']}
];
openChangelogModal=async function openChangelogModalV076(){let releases=V076_LOCAL_CHANGELOG;try{const r=await fetch(`${LS_CONNECT_CHANGELOG_SOURCE}?t=${Date.now()}`,{cache:'no-store'});if(r.ok){const j=await r.json();if(Array.isArray(j.releases)&&j.releases.length)releases=j.releases;}}catch{}openModal('Was ist neu?',`<div class="changelog-list">${releases.map((r,i)=>`<section class="changelog-release ${i===0?'latest':''}"><div class="changelog-version"><strong>v${escapeHtml(r.version)}</strong>${i===0?'<span>AKTUELL</span>':''}</div><h3>${escapeHtml(r.title||'Update')}</h3><ul>${(r.items||r.notes||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></section>`).join('')}</div>`);};
