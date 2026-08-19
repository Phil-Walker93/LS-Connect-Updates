/* LS Connect v0.7.8 – unread center, contact favorites & moderation notices */
const LS_CONNECT_V078_VERSION = '0.7.8';

Object.assign(state, {
  unreadConversationsV078: new Map(),
  unreadChannelsV078: new Map(),
  unreadCharactersV078: new Map(),
  unreadRefreshBusyV078: false,
  unreadRefreshTimerV078: null,
  noticePollTimerV078: null,
  activeNoticesV078: [],
  noticeOverlayOpenV078: false
});

(function v078InstallStyles(){
  if (document.getElementById('v078-styles')) return;
  const s=document.createElement('style');s.id='v078-styles';s.textContent=`
    .v078-unread-badge{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:#ef4444;color:#fff;font-size:.72rem;font-weight:900;line-height:1;box-shadow:0 0 0 2px var(--panel)}
    .v078-unread-badge.v078-unread-small{min-width:17px;height:17px;padding:0 5px;font-size:.66rem}
    .v078-row-badge{margin-left:auto;flex:0 0 auto}.v078-character-badge{margin-left:auto}.v078-switcher-badge{margin-left:auto}
    .v078-favorite-button{min-width:38px;font-size:1.1rem}.v078-favorite-button.active{color:#fbbf24}
    .v078-own-contact-list,.v078-notice-list{display:grid;gap:9px;margin-top:10px}
    .v078-own-contact-row,.v078-notice-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px;border:1px solid var(--border);border-radius:12px;background:var(--panel-2)}
    .v078-own-contact-row>div,.v078-notice-row>div{min-width:0;display:grid;gap:3px}.v078-own-contact-row small,.v078-notice-row small{color:var(--muted)}
    .v078-admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.v078-admin-grid .wide{grid-column:1/-1}
    .v078-admin-grid label{display:grid;gap:5px}.v078-admin-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .v078-notice-overlay{position:fixed;inset:0;z-index:600;display:grid;place-items:center;padding:20px;background:rgba(2,6,23,.72);backdrop-filter:blur(6px)}
    .v078-notice-card{width:min(560px,100%);border:1px solid var(--border);border-radius:18px;background:var(--panel);box-shadow:0 28px 90px rgba(0,0,0,.5);overflow:hidden}
    .v078-notice-head{padding:18px 20px 12px;border-bottom:1px solid var(--border)}.v078-notice-head.info{border-top:4px solid #38bdf8}.v078-notice-head.warning{border-top:4px solid #f59e0b}.v078-notice-head.critical{border-top:4px solid #ef4444}
    .v078-notice-head h2{margin:0 0 5px}.v078-notice-head small{color:var(--muted)}.v078-notice-body{padding:18px 20px;white-space:pre-wrap;overflow-wrap:anywhere}.v078-notice-actions{padding:0 20px 20px;display:flex;justify-content:flex-end}
    .v078-notice-severity{font-weight:800;text-transform:uppercase;letter-spacing:.06em}.v078-notice-severity.info{color:#38bdf8}.v078-notice-severity.warning{color:#f59e0b}.v078-notice-severity.critical{color:#ef4444}
    @media(max-width:700px){.v078-admin-grid{grid-template-columns:1fr}.v078-admin-grid .wide{grid-column:auto}.v078-own-contact-row,.v078-notice-row{align-items:flex-start;flex-direction:column}.v078-own-contact-row button,.v078-notice-row button{width:100%}}
  `;document.head.appendChild(s);
})();

function v078Online(){ return state.mode==='online' && typeof db!=='undefined' && !!db && !!state.activeCharacterId; }
function v078Count(value){ const n=Number(value||0); return Number.isFinite(n)&&n>0?Math.floor(n):0; }
function v078DisplayCount(n){ return n>99?'99+':String(n); }
function v078Escape(value){ return typeof escapeHtml==='function'?escapeHtml(String(value??'')):String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function v078Toast(message,type='info'){ if(typeof showToast==='function')showToast(message,type); else console.info('[LS Connect]',message); }
function v078Error(error){ if(typeof throwWithToast==='function')return throwWithToast(error); console.error('[LS Connect v0.7.8]',error); v078Toast(error?.message||'Unbekannter Fehler','error'); }

function v078SetBadge(host,count,key,small=false){
  if(!host)return;const selector=`[data-v078-badge="${key}"]`;host.querySelector?.(selector)?.remove();
  const n=v078Count(count);if(!n)return;
  const b=document.createElement('span');b.className=`v078-unread-badge v078-row-badge${small?' v078-unread-small':''}`;b.dataset.v078Badge=key;b.textContent=v078DisplayCount(n);b.title=`${n} ungelesen`;
  host.appendChild(b);
}
function v078DatasetId(el,names){ for(const n of names){const v=el?.dataset?.[n];if(v)return v;}return null; }
function v078CandidateRows(root,selector){ return root?[...root.querySelectorAll(selector)]:[]; }

function v078ApplyConversationBadges(){
  const root=(typeof els!=='undefined'&&els.chatList)||document.getElementById('chatList');if(!root)return;
  const selector='[data-chat],[data-chat-id],[data-conversation],[data-conversation-id],[data-open-chat],[data-open-conversation]';
  const seen=new Set();
  v078CandidateRows(root,selector).forEach(node=>{
    const id=v078DatasetId(node,['chat','chatId','conversation','conversationId','openChat','openConversation']);if(!id||seen.has(id))return;seen.add(id);
    const host=node.closest('.chat-item,.chat-row,.conversation-row,button,article')||node;v078SetBadge(host,state.unreadConversationsV078.get(id),`chat-${id}`);
  });
  const chats=(state.allChatsV076||state.chats||state.conversations||[]).filter(Boolean);
  if(chats.length){
    const rows=[...root.children].filter(x=>x.nodeType===1);rows.forEach((row,i)=>{const id=chats[i]?.id;if(id&&!seen.has(id))v078SetBadge(row,state.unreadConversationsV078.get(id),`chat-${id}`);});
  }
}
function v078ApplyChannelBadges(){
  const root=document.getElementById('channelList');if(!root)return;
  const selector='[data-channel],[data-channel-id],[data-open-channel]';const seen=new Set();
  v078CandidateRows(root,selector).forEach(node=>{const id=v078DatasetId(node,['channel','channelId','openChannel']);if(!id||seen.has(id))return;seen.add(id);v078SetBadge(node.closest('.channel-item,.channel-row,button,article')||node,state.unreadChannelsV078.get(id),`channel-${id}`);});
  const channels=state.companyChannels||[];const rows=[...root.children].filter(x=>x.nodeType===1);rows.forEach((row,i)=>{const id=channels[i]?.id;if(id&&!seen.has(id))v078SetBadge(row,state.unreadChannelsV078.get(id),`channel-${id}`);});
}
function v078ApplyCharacterBadges(){
  const menu=(typeof els!=='undefined'&&els.characterMenu)||document.getElementById('characterMenu');
  menu?.querySelectorAll('[data-character]').forEach(btn=>{const id=btn.dataset.character;const total=state.unreadCharactersV078.get(id)||0;v078SetBadge(btn,total,`character-${id}`,true);});
  const total=[...state.unreadCharactersV078.values()].reduce((a,b)=>a+v078Count(b),0);
  const switcher=document.getElementById('characterSwitcher');if(switcher)v078SetBadge(switcher,total,'character-total',true);
}
function v078ApplyUnreadBadges(){v078ApplyConversationBadges();v078ApplyChannelBadges();v078ApplyCharacterBadges();}

async function v078RefreshUnread({silent=false}={}){
  if(!v078Online()||state.unreadRefreshBusyV078)return;
  const characterId=state.activeCharacterId;state.unreadRefreshBusyV078=true;
  try{
    const [conv,chan,chars]=await Promise.all([
      db.rpc('conversation_unread_counts_v078',{p_character_id:characterId}),
      db.rpc('my_channel_unread_counts_v078',{p_character_id:characterId}),
      db.rpc('my_character_unread_counts_v078')
    ]);
    if(state.activeCharacterId!==characterId)return;
    if(conv.error)throw conv.error;if(chan.error)throw chan.error;if(chars.error)throw chars.error;
    state.unreadConversationsV078=new Map((conv.data||[]).map(r=>[r.conversation_id,v078Count(r.unread_count)]));
    state.unreadChannelsV078=new Map((chan.data||[]).map(r=>[r.channel_id,v078Count(r.unread_count)]));
    state.unreadCharactersV078=new Map((chars.data||[]).map(r=>[r.character_id,v078Count(r.total_unread)]));
    v078ApplyUnreadBadges();
  }catch(error){if(!silent)console.warn('[LS Connect] Ungelesen-Zähler konnten nicht geladen werden.',error);}
  finally{state.unreadRefreshBusyV078=false;}
}
async function v078MarkConversationRead(conversationId){
  if(!v078Online()||!conversationId)return;
  try{const {error}=await db.rpc('mark_conversation_read_v078',{p_conversation_id:conversationId,p_character_id:state.activeCharacterId,p_through:null});if(error)throw error;state.unreadConversationsV078.delete(conversationId);await v078RefreshUnread({silent:true});}catch(error){console.warn('[LS Connect] Chat konnte nicht als gelesen markiert werden.',error);}
}
async function v078MarkChannelRead(channelId){
  if(!v078Online()||!channelId)return;
  try{const {error}=await db.rpc('mark_company_channel_read_v078',{p_channel_id:channelId,p_character_id:state.activeCharacterId,p_through:null});if(error)throw error;state.unreadChannelsV078.delete(channelId);await v078RefreshUnread({silent:true});}catch(error){console.warn('[LS Connect] Kanal konnte nicht als gelesen markiert werden.',error);}
}

if(typeof loadMessages==='function'){
  const v078LoadMessagesBase=loadMessages;
  loadMessages=async function loadMessagesV078(conversationId){const result=await v078LoadMessagesBase.apply(this,arguments);await v078MarkConversationRead(conversationId);return result;};
}
if(typeof openChannelView==='function'){
  const v078OpenChannelBase=openChannelView;
  openChannelView=async function openChannelViewV078(channelId){const result=await v078OpenChannelBase.apply(this,arguments);await v078MarkChannelRead(channelId);return result;};
}
if(typeof selectCharacter==='function'){
  const v078SelectCharacterBase=selectCharacter;
  selectCharacter=async function selectCharacterV078(id){const result=await v078SelectCharacterBase.apply(this,arguments);await v078RefreshUnread({silent:true});setTimeout(()=>v078PollNotices({silent:true}),150);return result;};
}
if(typeof renderAll==='function'){
  const v078RenderAllBase=renderAll;
  renderAll=function renderAllV078(){const result=v078RenderAllBase.apply(this,arguments);queueMicrotask(v078ApplyUnreadBadges);return result;};
}
if(typeof renderCharacter==='function'){
  const v078RenderCharacterBase=renderCharacter;
  renderCharacter=function renderCharacterV078(){const result=v078RenderCharacterBase.apply(this,arguments);queueMicrotask(v078ApplyCharacterBadges);return result;};
}
if(typeof v07RenderChannelList==='function'){
  const v078RenderChannelListBase=v07RenderChannelList;
  v07RenderChannelList=function v07RenderChannelListV078(){const result=v078RenderChannelListBase.apply(this,arguments);queueMicrotask(v078ApplyChannelBadges);return result;};
}

async function v078ContactData(){
  if(!v078Online())return {contacts:[],own:[]};
  const [contacts,own]=await Promise.all([
    db.rpc('my_contacts_v078',{p_character_id:state.activeCharacterId}),
    db.rpc('my_available_own_contacts_v078',{p_character_id:state.activeCharacterId})
  ]);
  if(contacts.error)throw contacts.error;if(own.error)throw own.error;
  return {contacts:contacts.data||[],own:own.data||[]};
}
function v078SortContactCards(content,favorites){
  const cards=[...content.querySelectorAll('[data-contact-chat]')].map(b=>b.closest('.request-card')).filter(Boolean);
  const unique=[...new Set(cards)];const parent=unique[0]?.parentElement;if(!parent||!unique.every(c=>c.parentElement===parent))return;
  unique.sort((a,b)=>{const ai=a.querySelector('[data-contact-chat]')?.dataset.contactChat,bi=b.querySelector('[data-contact-chat]')?.dataset.contactChat;return Number(favorites.has(bi))-Number(favorites.has(ai));}).forEach(card=>parent.appendChild(card));
}
async function v078EnhanceContactsModal(){
  if(!v078Online()||typeof els==='undefined'||!els.modalContent)return;
  try{
    const {contacts,own}=await v078ContactData();const fav=new Set(contacts.filter(c=>c.is_favorite).map(c=>c.id));
    if(Array.isArray(state.contacts))state.contacts=state.contacts.map(c=>({...c,is_favorite:fav.has(c.id)}));
    els.modalContent.querySelectorAll('[data-contact-chat]').forEach(chatBtn=>{
      const id=chatBtn.dataset.contactChat,card=chatBtn.closest('.request-card')||chatBtn.parentElement;if(!card||card.querySelector(`[data-v078-favorite="${id}"]`))return;
      const btn=document.createElement('button');btn.type='button';btn.className=`small-button v078-favorite-button${fav.has(id)?' active':''}`;btn.dataset.v078Favorite=id;btn.title=fav.has(id)?'Aus Favoriten entfernen':'Als Favorit markieren';btn.textContent=fav.has(id)?'★':'☆';
      btn.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();btn.disabled=true;try{const {error}=await db.rpc('set_contact_favorite_v078',{p_character_id:state.activeCharacterId,p_contact_character_id:id,p_favorite:!fav.has(id)});if(error)throw error;v078Toast(!fav.has(id)?'Kontakt als Favorit markiert.':'Favorit entfernt.','success');await openContactsModalV05();}catch(error){v078Error(error);}finally{btn.disabled=false;}});
      const actions=card.querySelector('.request-actions,.contact-actions')||card;actions.appendChild(btn);
    });
    v078SortContactCards(els.modalContent,fav);
    document.getElementById('v078OwnContactsSection')?.remove();
    const section=document.createElement('section');section.id='v078OwnContactsSection';section.className='settings-block';
    section.innerHTML=`<h3>Eigene RP-Identitäten</h3><p class="notification-note">Füge einen deiner anderen verfügbaren Charaktere direkt als Kontakt hinzu.</p><div class="v078-own-contact-list">${own.length?own.map(c=>`<div class="v078-own-contact-row"><div><strong>${v078Escape(c.name)}</strong><small>${v078Escape(c.handle||'')} · ${v078Escape(c.account_type||'Charakter')}</small></div><button type="button" class="small-button" data-v078-add-own="${c.id}">Hinzufügen</button></div>`).join(''):'<p class="notification-note">Keine weiteren eigenen Charaktere verfügbar.</p>'}</div>`;
    els.modalContent.appendChild(section);
    section.querySelectorAll('[data-v078-add-own]').forEach(btn=>btn.addEventListener('click',async()=>{btn.disabled=true;try{const {error}=await db.rpc('add_own_character_contact_v078',{p_character_id:state.activeCharacterId,p_other_character_id:btn.dataset.v078AddOwn});if(error)throw error;if(typeof loadContacts==='function')await loadContacts();v078Toast('Eigener Charakter wurde zu den Kontakten hinzugefügt.','success');await openContactsModalV05();}catch(error){v078Error(error);}finally{btn.disabled=false;}}));
  }catch(error){console.warn('[LS Connect] v0.7.8 Kontakt-Erweiterungen konnten nicht geladen werden.',error);}
}
if(typeof openContactsModalV05==='function'){
  const v078ContactsBase=openContactsModalV05;
  openContactsModalV05=async function openContactsModalV078(){const result=await v078ContactsBase.apply(this,arguments);await v078EnhanceContactsModal();return result;};
}

function v078ScopeFields(){
  const scope=document.getElementById('adminNoticeScopeV078')?.value||'all';
  document.getElementById('adminNoticeAccountTypeWrapV078')?.classList.toggle('hidden',scope!=='account_type');
  document.getElementById('adminNoticeCharacterWrapV078')?.classList.toggle('hidden',scope!=='character');
}
async function v078AdminCharacterSearch(query=''){
  const select=document.getElementById('adminNoticeCharacterV078');if(!select)return;
  const {data,error}=await db.rpc('admin_search_characters_v078',{p_query:query||'',p_account_type:''});if(error)throw error;
  select.innerHTML='<option value="">Charakter auswählen…</option>'+((data||[]).slice(0,80).map(c=>`<option value="${c.id}">${v078Escape(c.name)} (${v078Escape(c.handle||'')}) · ${v078Escape(c.account_type||'')}</option>`).join(''));
}
async function v078AdminLoadNotices(){
  const box=document.getElementById('adminNoticeListV078');if(!box)return;
  try{
    const {data,error}=await db.rpc('admin_list_notices_v078');if(error)throw error;const rows=data||[];
    box.innerHTML=rows.length?`<div class="v078-notice-list">${rows.map(n=>`<article class="v078-notice-row"><div><strong>${v078Escape(n.title)}</strong><small><span class="v078-notice-severity ${v078Escape(n.severity)}">${v078Escape(n.severity)}</span> · ${n.target_scope==='all'?'Alle':n.target_scope==='character'?`Charakter: ${v078Escape(n.target_name||'—')}`:`Account-Typ: ${v078Escape(n.target_account_type||'—')}`} · ${new Date(n.created_at).toLocaleString('de-DE')}</small><small>${n.requires_ack?'Bestätigung erforderlich · ':''}${n.expires_at?`bis ${new Date(n.expires_at).toLocaleString('de-DE')}`:'ohne Ablauf'} · ${n.is_active?'aktiv':'deaktiviert'}</small></div><button type="button" class="small-button" data-v078-notice-toggle="${n.id}" data-active="${n.is_active?'1':'0'}">${n.is_active?'Deaktivieren':'Aktivieren'}</button></article>`).join('')}</div>`:'<p class="notification-note">Noch keine Admin-Hinweise vorhanden.</p>';
    box.querySelectorAll('[data-v078-notice-toggle]').forEach(btn=>btn.addEventListener('click',async()=>{btn.disabled=true;try{const {error}=await db.rpc('admin_set_notice_active_v078',{p_notice_id:btn.dataset.v078NoticeToggle,p_active:btn.dataset.active!=='1'});if(error)throw error;await v078AdminLoadNotices();}catch(error){v078Error(error);}finally{btn.disabled=false;}}));
  }catch(error){v078Error(error);}
}
function v078InstallAdminNoticePane(){
  if(typeof els==='undefined'||!els.modalContent||document.getElementById('adminNoticesTabV078'))return;
  const tabs=els.modalContent.querySelector('.admin-tabs');if(!tabs)return;
  const tab=document.createElement('button');tab.id='adminNoticesTabV078';tab.className='admin-tab';tab.type='button';tab.textContent='Hinweise';tabs.appendChild(tab);
  const pane=document.createElement('section');pane.id='adminNoticesPaneV078';pane.className='settings-block admin-tab-pane hidden';pane.innerHTML=`
    <h3>Admin-Hinweise & Warnungen</h3><p class="notification-note">Sende Hinweise an alle, bestimmte Account-Typen oder einzelne Charaktere. Kritische Hinweise können eine Bestätigung erzwingen.</p>
    <form id="adminNoticeFormV078" class="v078-admin-grid">
      <label>Titel<input id="adminNoticeTitleV078" maxlength="100" required placeholder="z. B. Wartungsankündigung"></label>
      <label>Warnstufe<select id="adminNoticeSeverityV078"><option value="info">Info</option><option value="warning" selected>Warnung</option><option value="critical">Kritisch</option></select></label>
      <label class="wide">Nachricht<textarea id="adminNoticeBodyV078" maxlength="4000" required rows="5" placeholder="Mitteilung…"></textarea></label>
      <label>Zielgruppe<select id="adminNoticeScopeV078"><option value="all">Alle Charaktere</option><option value="account_type">Account-Typ</option><option value="character">Einzelner Charakter</option></select></label>
      <label>Ablauf<input id="adminNoticeExpiresV078" type="datetime-local"></label>
      <label id="adminNoticeAccountTypeWrapV078" class="wide hidden">Account-Typ<input id="adminNoticeAccountTypeV078" placeholder="z. B. Unternehmen"></label>
      <label id="adminNoticeCharacterWrapV078" class="wide hidden">Charakter<div class="contact-search"><input id="adminNoticeCharacterSearchV078" placeholder="Charakter suchen…"><select id="adminNoticeCharacterV078"><option value="">Charakter auswählen…</option></select></div></label>
      <label class="wide"><span><input id="adminNoticeAckV078" type="checkbox"> Bestätigung durch Empfänger erforderlich</span></label>
      <div class="wide v078-admin-actions"><button id="adminNoticeSubmitV078" type="submit" class="primary-button">Hinweis senden</button><button id="adminNoticeRefreshV078" type="button" class="small-button">Liste aktualisieren</button></div>
    </form><div id="adminNoticeListV078"></div>`;
  els.modalContent.appendChild(pane);
  [...els.modalContent.querySelectorAll('.admin-tab')].filter(t=>t!==tab).forEach(other=>other.addEventListener('click',()=>{pane.classList.add('hidden');tab.classList.remove('active');},true));
  tab.addEventListener('click',()=>{els.modalContent.querySelectorAll('.admin-tab-pane').forEach(p=>p.classList.add('hidden'));els.modalContent.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));pane.classList.remove('hidden');tab.classList.add('active');v078AdminLoadNotices();v078AdminCharacterSearch().catch(v078Error);});
  document.getElementById('adminNoticeScopeV078').addEventListener('change',v078ScopeFields);v078ScopeFields();
  let searchTimer;document.getElementById('adminNoticeCharacterSearchV078').addEventListener('input',e=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>v078AdminCharacterSearch(e.target.value.trim()).catch(v078Error),220);});
  document.getElementById('adminNoticeRefreshV078').addEventListener('click',v078AdminLoadNotices);
  document.getElementById('adminNoticeFormV078').addEventListener('submit',async e=>{
    e.preventDefault();const btn=document.getElementById('adminNoticeSubmitV078'),scope=document.getElementById('adminNoticeScopeV078').value;
    const expires=document.getElementById('adminNoticeExpiresV078').value;btn.disabled=true;
    try{
      const args={p_title:document.getElementById('adminNoticeTitleV078').value.trim(),p_body:document.getElementById('adminNoticeBodyV078').value.trim(),p_severity:document.getElementById('adminNoticeSeverityV078').value,p_target_scope:scope,p_target_character_id:scope==='character'?(document.getElementById('adminNoticeCharacterV078').value||null):null,p_target_account_type:scope==='account_type'?(document.getElementById('adminNoticeAccountTypeV078').value.trim()||null):null,p_requires_ack:document.getElementById('adminNoticeAckV078').checked,p_expires_at:expires?new Date(expires).toISOString():null};
      if(scope==='character'&&!args.p_target_character_id)throw new Error('Bitte einen Zielcharakter auswählen.');if(scope==='account_type'&&!args.p_target_account_type)throw new Error('Bitte einen Account-Typ angeben.');
      const {error}=await db.rpc('admin_create_notice_v078',args);if(error)throw error;e.target.reset();v078ScopeFields();v078Toast('Admin-Hinweis wurde erstellt.','success');await v078AdminLoadNotices();
    }catch(error){v078Error(error);}finally{btn.disabled=false;}
  });
}
if(typeof openAdminModal==='function'){
  const v078AdminBase=openAdminModal;
  openAdminModal=async function openAdminModalV078(){const result=await v078AdminBase.apply(this,arguments);v078InstallAdminNoticePane();return result;};
}

function v078NoticeOverlayRemove(){document.getElementById('v078NoticeOverlay')?.remove();state.noticeOverlayOpenV078=false;}
async function v078AcknowledgeNotice(notice,ack){
  try{const {error}=await db.rpc('mark_admin_notice_v078',{p_notice_id:notice.id,p_character_id:state.activeCharacterId,p_acknowledge:!!ack});if(error)throw error;v078NoticeOverlayRemove();await v078PollNotices({silent:true});}catch(error){v078Error(error);}
}
function v078ShowNextNotice(){
  if(state.noticeOverlayOpenV078||!state.activeNoticesV078?.length)return;const n=state.activeNoticesV078[0];state.noticeOverlayOpenV078=true;
  const overlay=document.createElement('div');overlay.id='v078NoticeOverlay';overlay.className='v078-notice-overlay';overlay.innerHTML=`<section class="v078-notice-card" role="alertdialog" aria-modal="true" aria-labelledby="v078NoticeTitle"><div class="v078-notice-head ${v078Escape(n.severity)}"><h2 id="v078NoticeTitle">${v078Escape(n.title)}</h2><small><span class="v078-notice-severity ${v078Escape(n.severity)}">${v078Escape(n.severity)}</span> · ${new Date(n.created_at).toLocaleString('de-DE')}</small></div><div class="v078-notice-body">${v078Escape(n.body)}</div><div class="v078-notice-actions"><button id="v078NoticeConfirm" type="button" class="primary-button">${n.requires_ack?'Bestätigen':'Gelesen'}</button></div></section>`;
  document.body.appendChild(overlay);document.getElementById('v078NoticeConfirm').addEventListener('click',()=>v078AcknowledgeNotice(n,!!n.requires_ack));
}
async function v078PollNotices({silent=false}={}){
  if(!v078Online())return;
  try{const {data,error}=await db.rpc('active_admin_notices_v078',{p_character_id:state.activeCharacterId});if(error)throw error;state.activeNoticesV078=data||[];if(!state.noticeOverlayOpenV078)v078ShowNextNotice();}catch(error){if(!silent)console.warn('[LS Connect] Admin-Hinweise konnten nicht geladen werden.',error);}
}

function v078StartPolling(){
  clearInterval(state.unreadRefreshTimerV078);clearInterval(state.noticePollTimerV078);
  state.unreadRefreshTimerV078=setInterval(()=>v078RefreshUnread({silent:true}),15000);
  state.noticePollTimerV078=setInterval(()=>v078PollNotices({silent:true}),30000);
  v078RefreshUnread({silent:true});v078PollNotices({silent:true});
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden){v078RefreshUnread({silent:true});v078PollNotices({silent:true});}});
setTimeout(v078StartPolling,1800);

const v078ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v078ChangelogTarget&&!v078ChangelogTarget.some(x=>x.version===LS_CONNECT_V078_VERSION))v078ChangelogTarget.unshift({version:LS_CONNECT_V078_VERSION,title:'Ungelesen, Favoriten & Admin-Hinweise',items:['Zentrale Ungelesen-Zähler für Chats, Unternehmenskanäle und Charaktere','Kontakte können als Favoriten markiert werden','Eigene RP-Charaktere lassen sich direkt als Kontakte hinzufügen','Admin-Hinweise für alle, Account-Typen oder einzelne Charaktere','Kritische Hinweise können eine Bestätigung erzwingen']});
console.info('[LS Connect] v0.7.8 unread/contact/moderation client active');
