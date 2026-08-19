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
