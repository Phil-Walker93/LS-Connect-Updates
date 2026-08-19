/* LS Connect v0.7.10.5 – avatar restore hotfix */
const LS_CONNECT_V07105_VERSION='0.7.10.5';

Object.assign(state,{
  v07105AvatarRepairBusy:false,
  v07105AvatarRepairTimer:null
});

async function v07105HydrateEntityAvatar(entity){
  if(!entity||state.mode!=='online'||!entity.avatar_path||typeof db==='undefined'||!db)return entity;
  try{
    const cached=state.avatarUrlCache?.get?.(entity.avatar_path);
    if(cached&&cached.expires>Date.now()&&cached.url){entity.resolved_avatar_url=cached.url;return entity;}
    const {data,error}=await db.storage.from('ls-avatars').createSignedUrl(entity.avatar_path,3600);
    if(error)throw error;
    if(!data?.signedUrl)throw new Error('Keine Signed URL für Profilbild erhalten.');
    entity.resolved_avatar_url=data.signedUrl;
    state.avatarUrlCache?.set?.(entity.avatar_path,{url:data.signedUrl,expires:Date.now()+55*60*1000});
  }catch(error){
    delete entity.resolved_avatar_url;
    state.avatarUrlCache?.delete?.(entity.avatar_path);
    console.warn('[LS Connect v0.7.10.5] Profilbild konnte nicht geladen werden.',entity.avatar_path,error);
  }
  return entity;
}

async function v07105RepairAvatars(){
  if(state.v07105AvatarRepairBusy||state.mode!=='online'||typeof db==='undefined'||!db)return;
  state.v07105AvatarRepairBusy=true;
  try{
    state.avatarUrlCache?.clear?.();
    const entities=[];
    for(const c of state.characters||[])entities.push(c);
    for(const c of state.contacts||[])entities.push(c);
    for(const chat of state.chats||[]){
      if(chat?.contact)entities.push(chat.contact);
      for(const member of chat?.members||[])if(member?.character)entities.push(member.character);
    }
    for(const ch of state.companyChannels||[]){
      if(ch?.publisher_avatar_path)entities.push({name:ch.publisher_name,avatar_path:ch.publisher_avatar_path,_channel:ch});
    }
    const unique=new Map();
    for(const entity of entities){if(entity?.avatar_path&&!unique.has(entity.avatar_path))unique.set(entity.avatar_path,entity);}
    await Promise.all([...unique.values()].map(v07105HydrateEntityAvatar));
    for(const entity of unique.values()){
      if(entity._channel&&entity.resolved_avatar_url)entity._channel.resolved_avatar_url=entity.resolved_avatar_url;
    }
    if(typeof renderAll==='function')renderAll();
    if(typeof renderHeaderAndProfile==='function')renderHeaderAndProfile();
    if(typeof renderChats==='function')renderChats();
    if(typeof v07RenderChannelList==='function')v07RenderChannelList();
  }finally{state.v07105AvatarRepairBusy=false;}
}

/* Replace the legacy hydration helper with a retry-friendly implementation. */
if(typeof hydrateAvatar==='function'){
  hydrateAvatar=async function hydrateAvatarV07105(entity){return v07105HydrateEntityAvatar(entity);};
}
if(typeof hydrateAvatars==='function'){
  hydrateAvatars=async function hydrateAvatarsV07105(items=[]){await Promise.all((items||[]).map(v07105HydrateEntityAvatar));return items;};
}

/* Re-run avatar hydration after the normal data loaders so transient signed-URL
   failures cannot leave the UI on fallback initials until the next reload. */
if(typeof loadCharacters==='function'){
  const v07105LoadCharactersBase=loadCharacters;
  loadCharacters=async function loadCharactersV07105(){const result=await v07105LoadCharactersBase.apply(this,arguments);queueMicrotask(v07105RepairAvatars);return result;};
}
if(typeof loadContactsAndRequests==='function'){
  const v07105LoadContactsBase=loadContactsAndRequests;
  loadContactsAndRequests=async function loadContactsAndRequestsV07105(){const result=await v07105LoadContactsBase.apply(this,arguments);queueMicrotask(v07105RepairAvatars);return result;};
}
if(typeof loadChats==='function'){
  const v07105LoadChatsBase=loadChats;
  loadChats=async function loadChatsV07105(){const result=await v07105LoadChatsBase.apply(this,arguments);queueMicrotask(v07105RepairAvatars);return result;};
}

[0,350,1200,3000].forEach(delay=>setTimeout(v07105RepairAvatars,delay));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)v07105RepairAvatars();});

const v07105ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v07105ChangelogTarget&&!v07105ChangelogTarget.some(x=>x.version===LS_CONNECT_V07105_VERSION)){
  v07105ChangelogTarget.unshift({version:LS_CONNECT_V07105_VERSION,title:'Profilbilder wiederhergestellt',items:[
    'Private Profilbilder werden nach dem Update wieder zuverlässig geladen',
    'Avatar-Signed-URLs werden nach transienten Fehlern neu erzeugt statt dauerhaft auf Initialen zurückzufallen',
    'Der Avatar-Cache wird beim Hotfix gezielt erneuert',
    'Alle vorhandenen Profilbilddateien und Avatarpfade bleiben unverändert erhalten'
  ]});
}
console.info('[LS Connect] v0.7.10.5 avatar restore hotfix active');
