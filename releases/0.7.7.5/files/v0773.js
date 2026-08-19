/* LS Connect v0.7.7.3 – company channel deletion for owners and app admins */
const LS_CONNECT_V0773_VERSION = '0.7.7.3';

(function v0773InstallStyles(){
  if (document.getElementById('v0773-channel-delete-style')) return;
  const style=document.createElement('style');
  style.id='v0773-channel-delete-style';
  style.textContent=`
    .v0773-danger{border-color:color-mix(in srgb,#ef4444 55%,var(--border))!important;color:#ef4444!important}
    .v0773-danger:hover{background:color-mix(in srgb,#ef4444 12%,transparent)!important}
    .admin-channel-list{display:grid;gap:10px;margin-top:12px}
    .admin-channel-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px;border:1px solid var(--border);border-radius:12px;background:var(--panel-2)}
    .admin-channel-row>div{min-width:0;display:grid;gap:3px}.admin-channel-row strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .admin-channel-row small{color:var(--muted)}
    @media(max-width:700px){.admin-channel-row{align-items:flex-start;flex-direction:column}.admin-channel-row button{width:100%}}
  `;
  document.head.appendChild(style);
})();

async function v0773ChannelDeleteMediaPaths(channelId){
  const {data,error}=await db.rpc('company_channel_delete_media_paths',{p_channel_id:channelId});
  if(error) throw error;
  return (data||[]).map(x=>x.media_path).filter(Boolean);
}

async function v0773RemoveChannelMedia(paths){
  for(let i=0;i<paths.length;i+=100){
    const batch=paths.slice(i,i+100);
    const {error}=await db.storage.from('ls-channel-media').remove(batch);
    if(error) throw error;
  }
}

async function v0773DeleteCompanyChannel(channelId,title,button=null,{fromAdmin=false}={}){
  const label=title||'diesen Kanal';
  if(!confirm(`Unternehmenskanal „${label}“ endgültig löschen?\n\nFollower, Beiträge und Kanalzuordnung werden entfernt. Diese Aktion kann nicht rückgängig gemacht werden.`)) return false;
  if(button) setBusy(button,true,'Lösche…');
  try{
    const paths=await v0773ChannelDeleteMediaPaths(channelId);
    if(paths.length) await v0773RemoveChannelMedia(paths);
    const {error}=await db.rpc('delete_company_channel',{p_channel_id:channelId});
    if(error) throw error;
    if(state.activeChannelId===channelId) state.activeChannelId=null;
    state.companyChannels=(state.companyChannels||[]).filter(ch=>ch.id!==channelId);
    state.channelPosts=[];
    if(state.channelRealtime&&db){try{await db.removeChannel(state.channelRealtime);}catch{}state.channelRealtime=null;}
    await v07LoadChannels();
    v07RenderChannelList();
    showToast('Unternehmenskanal gelöscht.','success');
    if(fromAdmin) await v0773RefreshAdminChannels(); else closeModal();
    return true;
  }catch(error){throwWithToast(error);return false;}
  finally{if(button) setBusy(button,false);}
}

const v0773OpenChannelViewBase=openChannelView;
openChannelView=async function openChannelViewV0773(channelId){
  await v0773OpenChannelViewBase(channelId);
  if(state.mode!=='online') return;
  const actions=els.modalContent?.querySelector('.channel-view-actions');
  if(!actions||$('deleteChannelButtonV0773')) return;
  try{
    const {data:canDelete,error}=await db.rpc('can_delete_company_channel',{p_channel_id:channelId});
    if(error||!canDelete) return;
    const ch=(state.companyChannels||[]).find(x=>x.id===channelId);
    const button=document.createElement('button');
    button.id='deleteChannelButtonV0773';button.type='button';button.className='small-button v0773-danger';button.textContent='Kanal löschen';
    button.addEventListener('click',()=>v0773DeleteCompanyChannel(channelId,ch?.title||'Kanal',button));
    actions.appendChild(button);
  }catch(error){console.warn('[LS Connect] Kanal-Löschrecht konnte nicht geprüft werden.',error);}
};

async function v0773AdminLoadChannels(query=''){
  const {data,error}=await db.rpc('admin_company_channels',{p_query:query||''});
  if(error) throw error;
  return data||[];
}

function v0773RenderAdminChannels(channels){
  const box=$('adminChannelResultsV0773');if(!box)return;
  box.innerHTML=channels.length?`<div class="admin-channel-list">${channels.map(ch=>`<article class="admin-channel-row"><div><strong>${escapeHtml(ch.title)}</strong><small>@${escapeHtml(ch.slug)} · ${escapeHtml(ch.publisher_name)} ${escapeHtml(ch.publisher_handle||'')}</small><small>${Number(ch.follower_count||0).toLocaleString('de-DE')} Follower · ${Number(ch.post_count||0).toLocaleString('de-DE')} Beiträge · erstellt ${new Date(ch.created_at).toLocaleString('de-DE')}</small></div><button type="button" class="small-button v0773-danger" data-admin-delete-channel="${ch.id}" data-channel-title="${escapeHtml(ch.title)}">Löschen</button></article>`).join('')}</div>`:'<p class="notification-note">Keine Unternehmenskanäle gefunden.</p>';
  box.querySelectorAll('[data-admin-delete-channel]').forEach(button=>button.addEventListener('click',()=>v0773DeleteCompanyChannel(button.dataset.adminDeleteChannel,button.dataset.channelTitle||'Kanal',button,{fromAdmin:true})));
}

async function v0773RefreshAdminChannels(){
  try{v0773RenderAdminChannels(await v0773AdminLoadChannels($('adminChannelSearchV0773')?.value.trim()||''));}
  catch(error){throwWithToast(error);}
}

const v0773AdminBase=openAdminModal;
openAdminModal=async function openAdminModalV0773(){
  await v0773AdminBase();
  if(!els.modalContent||$('adminChannelsTabV0773')) return;
  const tabs=els.modalContent.querySelector('.admin-tabs');if(!tabs)return;
  const tab=document.createElement('button');tab.id='adminChannelsTabV0773';tab.className='admin-tab';tab.type='button';tab.textContent='Kanäle';tabs.appendChild(tab);
  const pane=document.createElement('section');pane.id='adminChannelsPaneV0773';pane.className='settings-block admin-tab-pane hidden';
  pane.innerHTML='<h3>Unternehmenskanäle</h3><p class="notification-note">Admins können jeden Unternehmenskanal endgültig löschen.</p><div class="contact-search"><input id="adminChannelSearchV0773" placeholder="Titel, @Kanal oder Unternehmen"></div><div id="adminChannelResultsV0773"></div>';
  els.modalContent.appendChild(pane);
  const hideChannels=()=>{pane.classList.add('hidden');tab.classList.remove('active');};
  ['adminActiveTab','adminTrashTab','adminTicketsTabV076'].forEach(id=>$(id)?.addEventListener('click',hideChannels,true));
  tab.addEventListener('click',()=>{
    els.modalContent.querySelectorAll('.admin-tab-pane').forEach(p=>p.classList.add('hidden'));
    els.modalContent.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
    pane.classList.remove('hidden');tab.classList.add('active');v0773RefreshAdminChannels();
  });
  let timer;$('adminChannelSearchV0773')?.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(v0773RefreshAdminChannels,220);});
};

if(typeof V07_LOCAL_CHANGELOG!=='undefined'&&!V07_LOCAL_CHANGELOG.some(x=>x.version===LS_CONNECT_V0773_VERSION)){
  V07_LOCAL_CHANGELOG.unshift({version:LS_CONNECT_V0773_VERSION,title:'Unternehmenskanäle löschen',items:['Eigentümer/Gründer können eigene Unternehmenskanäle endgültig löschen','Admins erhalten im Admin-Panel einen eigenen Kanäle-Tab mit Löschfunktion','Kanalbilder werden vor dem Löschen aus dem privaten Storage entfernt']});
}

console.info('[LS Connect] v0.7.7.3 company channel deletion active');

/* LS Connect v0.7.7.5 – quick UI & comfort patch */
const LS_CONNECT_V0775_VERSION='0.7.7.5';
(function v0775Styles(){if(document.getElementById('v0775-styles'))return;const s=document.createElement('style');s.id='v0775-styles';s.textContent=`.ticket-status.status-triaged{color:#c084fc}.character-menu-section{padding:7px 12px 5px;color:var(--muted);font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.call-history .call-history-success{color:#34d399;font-weight:800}.call-history .call-history-missed{color:#f87171;font-weight:800}.emoji-compose-button{font-size:1.12rem}.emoji-compose-picker{position:fixed;z-index:160;display:grid;grid-template-columns:repeat(8,34px);gap:4px;padding:9px;border:1px solid var(--border);border-radius:14px;background:var(--panel);box-shadow:0 18px 45px rgba(0,0,0,.38);max-width:320px}.emoji-compose-picker.hidden{display:none}.emoji-compose-picker button{width:34px;height:34px;border:0;border-radius:8px;background:transparent;font-size:1.2rem;cursor:pointer}.emoji-compose-picker button:hover{background:var(--panel-2)}@media(max-width:700px){.emoji-compose-picker{grid-template-columns:repeat(7,34px);max-width:292px}}`;document.head.appendChild(s);})();
const v0775StatusLabelBase=v076StatusLabel;v076StatusLabel=function(value){return value==='triaged'?'Eingestuft':v0775StatusLabelBase(value);};
const v0775RenderTicketsBase=v076RenderAdminTickets;v076RenderAdminTickets=function(tickets){v0775RenderTicketsBase(tickets);const box=$('adminTicketResultsV076');if(!box)return;(tickets||[]).forEach(t=>{const sel=box.querySelector(`[data-ticket-status="${t.id}"]`);if(!sel)return;if(![...sel.options].some(o=>o.value==='triaged')){const o=document.createElement('option');o.value='triaged';o.textContent='Eingestuft';const before=[...sel.options].find(x=>x.value==='in_progress');sel.insertBefore(o,before||null);}sel.value=t.status;});};
const v0775AdminModalBase=openAdminModal;openAdminModal=async function(){await v0775AdminModalBase();const filter=$('adminTicketStatusV076');if(filter&&![...filter.options].some(o=>o.value==='triaged')){const o=document.createElement('option');o.value='triaged';o.textContent='Eingestuft';const before=[...filter.options].find(x=>x.value==='in_progress');filter.insertBefore(o,before||null);}};
const v0775AccountBase=openAccountModal;openAccountModal=async function(){await v0775AccountBase();if(!els.modalContent)return;$('manageCharactersFromAccount')?.remove();els.modalContent.querySelectorAll('button').forEach(btn=>{const t=btn.textContent.trim().toLowerCase();if(t==='unternehmenskanäle'||t.includes('charakter erstellen')||t==='charaktere verwalten')btn.remove();});};
const v0775ChannelPostsBase=v07RenderChannelPosts;v07RenderChannelPosts=function(ch,posts){return v0775ChannelPostsBase(ch,(posts||[]).filter(p=>!p.deleted_at));};
callHistoryHtml=function(calls){if(!calls?.length)return '<p class="notification-note">Noch keine RP-Anrufe.</p>';const labels={ringing:'Klingelt',answered:'Angenommen',declined:'Abgelehnt',missed:'Verpasst',cancelled:'Abgebrochen',ended:'Beendet'};return `<div class="call-history">${calls.map(c=>{const arrow=c.initiator_character_id===state.activeCharacterId?'↗':'↙';const cls=['missed','declined','cancelled'].includes(c.status)?'call-history-missed':['answered','ended'].includes(c.status)?'call-history-success':'';return `<div><span class="${cls}">${arrow} ${escapeHtml(labels[c.status]||c.status)}</span><small>${new Date(c.started_at).toLocaleString('de-DE')}</small></div>`;}).join('')}</div>`;};
const v0775MobileSectionBase=v05OpenMobileSection;v05OpenMobileSection=function(action){if(action==='profile'){document.querySelectorAll('.mobile-nav button').forEach(b=>b.classList.toggle('active',b.dataset.mobileAction==='profile'));openAccountModal();return;}return v0775MobileSectionBase(action);};
const v0775MobileProfileBtn=document.querySelector('[data-mobile-action="profile"]');if(v0775MobileProfileBtn){const icon=v0775MobileProfileBtn.querySelector('span'),label=v0775MobileProfileBtn.querySelector('small');if(icon)icon.textContent='⚙';if(label)label.textContent='Einstellungen';}
const v0775RenderCharacterBase=renderCharacter;renderCharacter=function(){v0775RenderCharacterBase();const menu=els.characterMenu;if(!menu)return;const add=menu.querySelector('[data-add-character]'),buttons=[...menu.querySelectorAll('[data-character]')],isOrg=ch=>/unternehmen|medien|behörde|organisation|fraktion/i.test(String(ch?.account_type||'')),people=buttons.filter(b=>!isOrg(state.characters.find(c=>c.id===b.dataset.character))),orgs=buttons.filter(b=>isOrg(state.characters.find(c=>c.id===b.dataset.character)));menu.innerHTML='';const section=(title,items)=>{if(!items.length)return;const h=document.createElement('div');h.className='character-menu-section';h.textContent=title;menu.appendChild(h);items.forEach(b=>menu.appendChild(b));};section('Personen',people);section('Organisationen & Fraktionen',orgs);if(add)menu.appendChild(add);};renderCharacter();
(function(){if($('emojiComposeButton'))return;const input=els.messageInput;if(!input)return;const btn=document.createElement('button');btn.id='emojiComposeButton';btn.type='button';btn.className='icon-button emoji-compose-button';btn.title='Emoji einfügen';btn.textContent='☺';input.parentElement.insertBefore(btn,input);const picker=document.createElement('div');picker.id='emojiComposePicker';picker.className='emoji-compose-picker hidden';const emojis=['😀','😃','😄','😁','😂','🤣','😊','😍','🥰','😘','😎','🤔','🙄','😅','😢','😭','😡','🤬','😱','🤯','🥳','😴','🤝','👍','👎','👏','🙏','💪','❤️','💔','🔥','✨','⭐','✅','❌','⚠️','💯','🎉','👀','🫡','😉','😏','🤨','😇','🤍','🖤','💙','💚','💛','💜','🧡','📞','📸','🚓','🏢'];picker.innerHTML=emojis.map(e=>`<button type="button" data-compose-emoji="${e}">${e}</button>`).join('');document.body.appendChild(picker);const hide=()=>picker.classList.add('hidden');btn.addEventListener('click',e=>{e.stopPropagation();if(!picker.classList.contains('hidden'))return hide();const r=btn.getBoundingClientRect();picker.style.left=`${Math.max(8,Math.min(innerWidth-320,r.left-80))}px`;picker.style.bottom=`${Math.max(76,innerHeight-r.top+8)}px`;picker.classList.remove('hidden');});picker.addEventListener('click',e=>{const b=e.target.closest('[data-compose-emoji]');if(!b)return;const emoji=b.dataset.composeEmoji,start=input.selectionStart??input.value.length,end=input.selectionEnd??start;input.value=input.value.slice(0,start)+emoji+input.value.slice(end);const pos=start+emoji.length;input.focus();input.setSelectionRange(pos,pos);});document.addEventListener('click',e=>{if(e.target!==btn&&!picker.contains(e.target))hide();});})();
if(typeof V07_LOCAL_CHANGELOG!=='undefined'&&!V07_LOCAL_CHANGELOG.some(x=>x.version===LS_CONNECT_V0775_VERSION)){V07_LOCAL_CHANGELOG.unshift({version:LS_CONNECT_V0775_VERSION,title:'UI & Komfort',items:['Ticketstatus Eingestuft','Aufgeräumte Einstellungen und reparierte mobile Einstellungen','Gelöschte Kanalbeiträge verschwinden vollständig','Verpasster Anruf beim Abbruch durch den Anrufer','Farbige Pfeile im Anrufverlauf','Personen und Organisationen in der Charakterauswahl getrennt','Emoji-Picker beim Schreiben']});}
console.info('[LS Connect] v0.7.7.5 quick patch active');
