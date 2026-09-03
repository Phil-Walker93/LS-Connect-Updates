/* LS Connect v0.9.1.4 – LMH organization action context */
(function(){
  if(window.__LS_CONNECT_V0914_ORG_CONTEXT__)return;
  window.__LS_CONNECT_V0914_ORG_CONTEXT__=true;

  var VERSION='0.9.1.4';
  var busy=false,lastSignature='',timer=0;

  function esc(value){
    if(typeof escapeHtml==='function')return escapeHtml(String(value==null?'':value));
    return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }
  function notify(message,type){
    if(typeof showToast==='function')showToast(message,type||'info');
    else console.info('[LS Connect]',message);
  }
  function identity(){return state&&state.lmhActionContextV0914?state.lmhActionContextV0914.identity:null;}
  function actor(){var i=identity();return i&&i.character?i.character:null;}
  function org(){var i=identity();return i&&i.context_type==='organization'&&i.organization_profile?i.organization_profile:null;}
  function role(){var i=identity();return i?i.organization_access_role||null:null;}
  function signature(i){
    return [
      i&&i.character?i.character.id:'',
      i&&i.context_type?i.context_type:'private',
      i&&i.organization_profile?i.organization_profile.id:'',
      i&&i.organization_access_role?i.organization_access_role:'',
      i&&i.context_updated_at?i.context_updated_at:''
    ].join(':');
  }

  function styles(){
    if(document.getElementById('v0914-org-style'))return;
    var s=document.createElement('style');
    s.id='v0914-org-style';
    s.textContent=
      '#v0914OrgContext{margin:7px 9px 9px;padding:9px 10px;border:1px solid rgba(56,189,248,.16);border-radius:13px;background:rgba(14,165,233,.06);display:grid;gap:3px}'+
      '#v0914OrgContext[data-mode="private"]{border-color:rgba(148,163,184,.12);background:rgba(15,23,42,.42)}'+
      '#v0914OrgContext strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}'+
      '#v0914OrgContext small{font-size:9px;line-height:1.35;color:var(--muted,#94a3b8)}'+
      '.v0914-pill{width:max-content;padding:2px 6px;border-radius:999px;background:rgba(56,189,248,.10);font-size:8px;font-weight:850;text-transform:uppercase;color:#7dd3fc}'+
      '.v0914-create-box{margin:0 0 10px;padding:11px;border:1px solid rgba(56,189,248,.16);border-radius:14px;background:rgba(14,165,233,.06);display:grid;gap:8px}'+
      '.v0914-create-box p{margin:0;color:var(--muted,#94a3b8);font-size:10px;line-height:1.45}'+
      '.v0914-form{display:grid;gap:10px}.v0914-form label{display:grid;gap:5px;font-size:11px;font-weight:750}.v0914-form input,.v0914-form textarea{width:100%;box-sizing:border-box}';
    document.head.appendChild(s);
  }

  function renderContext(){
    styles();
    var sidebar=document.querySelector('.sidebar');
    if(!sidebar)return;
    var card=document.getElementById('v0914OrgContext');
    if(!card){
      card=document.createElement('section');
      card.id='v0914OrgContext';
      var channels=document.getElementById('channelList');
      if(channels)channels.before(card);else sidebar.prepend(card);
    }
    var me=actor(),company=org();
    card.dataset.mode=company?'organization':'private';
    if(company){
      card.innerHTML='<span class="v0914-pill">Unternehmenskontext</span><strong>'+esc(company.name||'Unternehmen')+'</strong><small>'+
        esc(me?me.name:'Charakter')+' handelt für '+esc(company.name||'Unternehmen')+(role()?' · '+esc(role()):'')+'</small>';
    }else{
      card.innerHTML='<span class="v0914-pill">Privat</span><strong>'+esc(me?me.name:'Privater Charakter')+
        '</strong><small>Private Chats bleiben diesem Charakter zugeordnet.</small>';
    }
  }

  async function syncActor(i){
    var id=i&&i.character?i.character.id:null;
    if(!id||!state||state.activeCharacterId===id)return;
    var available=!Array.isArray(state.characters)||state.characters.some(function(c){return c&&c.id===id;});
    if(!available)return;
    if(typeof selectCharacter==='function')await selectCharacter(id);
    else{state.activeCharacterId=id;if(typeof renderAll==='function')renderAll();}
  }

  async function refreshChannels(){
    if(typeof v07LoadChannels==='function'){try{await v07LoadChannels();}catch(e){console.warn('[LS Connect] Channel refresh failed',e);}}
    if(typeof v07RenderChannelList==='function'){try{v07RenderChannelList();}catch(e){}}
  }

  function resetCompanyView(){
    if(!state)return;
    state.activeChannelId=null;
    if(state.channelRealtime&&typeof db!=='undefined'&&db&&db.removeChannel){
      try{db.removeChannel(state.channelRealtime);}catch(e){}
      state.channelRealtime=null;
    }
  }

  async function loadContext(silent){
    if(busy||typeof db==='undefined'||!db||!db.rpc||!state||state.mode!=='online')return null;
    busy=true;
    try{
      var result=await db.rpc('hub_current_identity');
      if(result.error)throw result.error;
      var data=result.data;
      if(!data||!data.character||!data.character.id)throw new Error('LMH-Akteur fehlt.');
      var next=signature(data),changed=!!lastSignature&&next!==lastSignature;
      lastSignature=next;
      state.lmhActionContextV0914={identity:data,loadedAt:new Date().toISOString()};
      await syncActor(data);
      renderContext();
      if(changed){
        resetCompanyView();
        await refreshChannels();
        window.dispatchEvent(new CustomEvent('ls-connect-organization-context-changed',{detail:{
          actorId:data.character.id,
          contextType:data.context_type||'private',
          organizationId:data.organization_profile?data.organization_profile.id:null,
          organizationRole:data.organization_access_role||null
        }}));
        if(!silent)notify(data.organization_profile?'Unternehmenskontext: '+data.organization_profile.name:'Privatmodus aktiv.','info');
      }
      return data;
    }catch(e){
      if(!silent)console.warn('[LS Connect] LMH context load failed',e);
      return null;
    }finally{busy=false;}
  }

  function installRpcCompatibility(){
    if(typeof db==='undefined'||!db||!db.rpc||db.__v0914OrgRpcWrapped)return;
    try{
      var base=db.rpc.bind(db);
      db.rpc=function(name,args,options){
        if(name==='create_company_channel'){
          var company=org();
          if(company)args=Object.assign({},args||{},{p_publisher_character_id:company.id});
        }
        return base(name,args,options);
      };
      db.__v0914OrgRpcWrapped=true;
    }catch(e){console.warn('[LS Connect] RPC context wrapper failed',e);}
  }

  function openCreate(){
    var company=org(),me=actor();
    if(!company)return notify('Wähle zuerst im LS Mobile Hub ein Unternehmen aus.','error');
    if(typeof openModal!=='function')return notify('Kanalerstellung ist hier nicht verfügbar.','error');

    openModal('Unternehmenskanal erstellen',
      '<section class="settings-block"><h3>'+esc(company.name)+'</h3>'+
      '<p class="notification-note">Der Kanal gehört '+esc(company.name)+'. Ausgeführt durch '+esc(me?me.name:'aktiven Charakter')+'.</p>'+
      '<form id="v0914ChannelForm" class="v0914-form">'+
      '<label>Kanalname / Slug<input id="v0914ChannelSlug" maxlength="40" required placeholder="walker.news"></label>'+
      '<label>Titel<input id="v0914ChannelTitle" maxlength="80" required placeholder="Walker-Industries News"></label>'+
      '<label>Beschreibung<textarea id="v0914ChannelDescription" maxlength="500" rows="4"></textarea></label>'+
      '<label>Akzentfarbe<input id="v0914ChannelColor" type="color" value="#2563EB"></label>'+
      '<button id="v0914ChannelSubmit" type="submit" class="primary-button">Kanal erstellen</button></form></section>');

    var form=document.getElementById('v0914ChannelForm');
    if(!form)return;
    form.addEventListener('submit',async function(event){
      event.preventDefault();
      var button=document.getElementById('v0914ChannelSubmit');
      if(button)button.disabled=true;
      try{
        var current=await loadContext(true);
        if(!current||!current.organization_profile||current.organization_profile.id!==company.id)throw new Error('Unternehmenskontext wurde geändert.');
        var response=await db.rpc('hub_create_company_channel',{
          p_slug:String(document.getElementById('v0914ChannelSlug').value||'').trim().toLowerCase(),
          p_title:String(document.getElementById('v0914ChannelTitle').value||'').trim(),
          p_description:String(document.getElementById('v0914ChannelDescription').value||'').trim(),
          p_accent_color:String(document.getElementById('v0914ChannelColor').value||'#2563EB').toUpperCase()
        });
        if(response.error)throw response.error;
        if(typeof closeModal==='function')closeModal();
        await refreshChannels();
        notify('Unternehmenskanal für '+company.name+' erstellt.','success');
        if(typeof openChannelsBrowserModal==='function')await openChannelsBrowserModal();
      }catch(e){
        if(typeof throwWithToast==='function')throwWithToast(e);else notify(e.message||'Kanal konnte nicht erstellt werden.','error');
      }finally{if(button)button.disabled=false;}
    });
  }

  function injectCreate(){
    var content=(typeof els!=='undefined'&&els&&els.modalContent)||document.getElementById('modalContent');
    if(!content)return;
    var title=String(document.getElementById('modalTitle')?document.getElementById('modalTitle').textContent:'').toLowerCase();
    if(!/kanal|channel/.test(title))return;
    var old=content.querySelector('.v0914-create-box');if(old)old.remove();
    var company=org();if(!company)return;
    var box=document.createElement('section');
    box.className='v0914-create-box';
    box.innerHTML='<strong>Handeln als '+esc(company.name)+'</strong><p>Unternehmensaktionen verwenden den LMH-Kontext. Private Chats bleiben bei '+esc(actor()?actor().name:'deinem Charakter')+'.</p><button type="button" class="small-button" id="v0914CreateChannel">Kanal für '+esc(company.name)+' erstellen</button>';
    content.prepend(box);
    var button=document.getElementById('v0914CreateChannel');if(button)button.addEventListener('click',openCreate);
  }

  function hooks(){
    installRpcCompatibility();
    if(typeof openChannelsBrowserModal==='function'&&!openChannelsBrowserModal.__v0914Wrapped){
      var baseBrowser=openChannelsBrowserModal;
      var wrappedBrowser=async function(){await loadContext(true);var result=await baseBrowser.apply(this,arguments);injectCreate();return result;};
      wrappedBrowser.__v0914Wrapped=true;openChannelsBrowserModal=wrappedBrowser;
    }
    if(typeof v07RenderChannelList==='function'&&!v07RenderChannelList.__v0914Wrapped){
      var baseRender=v07RenderChannelList;
      var wrappedRender=function(){var result=baseRender.apply(this,arguments);queueMicrotask(renderContext);return result;};
      wrappedRender.__v0914Wrapped=true;v07RenderChannelList=wrappedRender;
    }
  }

  async function sync(){
    hooks();
    await loadContext(true);
    renderContext();
    injectCreate();
  }

  new MutationObserver(function(){
    clearTimeout(timer);
    timer=setTimeout(function(){hooks();renderContext();injectCreate();},80);
  }).observe(document.documentElement,{childList:true,subtree:true});

  window.addEventListener('focus',function(){loadContext(true);});
  window.addEventListener('pageshow',function(){loadContext(true);});
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')loadContext(true);});

  sync();
  [150,500,1200,3000].forEach(function(ms){setTimeout(sync,ms);});
  setInterval(function(){loadContext(true);},30000);

  document.documentElement.dataset.lsOrganizationContext='lmh';
  window.__LS_CONNECT_RUNTIME_VERSION__=VERSION;
  console.info('[LS Connect] v0.9.1.4 organization context ready');
})();