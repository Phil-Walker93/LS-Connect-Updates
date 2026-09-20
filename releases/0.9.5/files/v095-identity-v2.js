/* LS Connect v0.9.5 – Identity v2 actor bridge */
(function identityV2ActorBridge(){
  if(window.__LS_CONNECT_V095_IDENTITY_V2__) return;
  window.__LS_CONNECT_V095_IDENTITY_V2__=true;

  const ORGANIZATION_RPC_MAP={
    lsc2_current_context:'lsc2_current_context_v2',
    lsc2_my_conversations_v4:'lsc2_my_conversations_v5',
    lsc2_business_channels:'lsc2_business_channels_v2',
    lsc2_create_business_channel:'lsc2_create_business_channel_v2',
    lsc2_update_business_channel:'lsc2_update_business_channel_v2',
    lsc2_archive_business_channel:'lsc2_archive_business_channel_v2',
    lsc2_send_message_v2:'lsc2_send_message_v3',
    lsc2_mark_conversation_read:'lsc2_mark_conversation_read_v2',
    lsc2_conversation_messages_v5:'lsc2_conversation_messages_v6',
    lsc2_feed:'lsc2_feed_v2',
    lsc2_create_post:'lsc2_create_post_v2',
    lsc2_add_comment:'lsc2_add_comment_v2',
    lsc2_post_comments:'lsc2_post_comments_v2',
    lsc2_toggle_post_like:'lsc2_toggle_post_like_v2',
    lsc2_toggle_save_post:'lsc2_toggle_save_post_v2',
    lsc2_toggle_follow:'lsc2_toggle_follow_v2',
    lsc2_create_story:'lsc2_create_story_v2',
    lsc2_stories:'lsc2_stories_v2',
    lsc2_view_story:'lsc2_view_story_v2',
    lsc2_toggle_story_reaction:'lsc2_toggle_story_reaction_v2'
  };

  const CHARACTER_ONLY_RPCS=new Set([
    'lsc2_start_call','lsc2_respond_call','lsc2_end_call','lsc2_call_signal',
    'lsc2_create_direct_conversation','lsc2_create_group_conversation',
    'lsc2_add_group_member','lsc2_remove_group_member',
    'lsc2_send_contact_request','lsc2_accept_contact_request',
    'lsc2_block_character','lsc2_unblock_character'
  ]);

  const ORGANIZATION_NOOP_RPCS=new Set([
    'lsc2_set_typing','lsc2_presence_heartbeat','lsc2_set_presence'
  ]);

  const actorState=window.__LS_CONNECT_IDENTITY_V2_STATE__={
    context:null,
    lastRevision:null,
    lastType:null,
    clientWrapped:false,
    loadedAt:null
  };

  const activeIdentity=()=>actorState.context?.active_identity||null;
  const isOrganization=()=>activeIdentity()?.type==='organization';

  function client(){
    try{
      if(typeof db!=='undefined'&&db&&typeof db.rpc==='function') return db;
    }catch{}
    return window.db&&typeof window.db.rpc==='function'?window.db:null;
  }

  function appState(){
    try{
      if(typeof state!=='undefined'&&state) return state;
    }catch{}
    return window.state||null;
  }

  function actorError(){
    return {
      message:'Diese Funktion ist an eine persönliche Charakter-Identität gebunden. Wechsle im LMH zu einem RP-Charakter.',
      code:'IDENTITY_CHARACTER_REQUIRED',
      details:'Organization identities cannot use private chats, contacts or calls.',
      hint:'Identität im Los Santos Mobile Hub wechseln.'
    };
  }

  function wrapRpc(){
    const c=client();
    if(!c||actorState.clientWrapped) return false;
    const original=c.rpc.bind(c);
    window.__LS_CONNECT_V095_ORIGINAL_RPC__=original;

    c.rpc=(name,args,options)=>{
      if(isOrganization()){
        if(ORGANIZATION_NOOP_RPCS.has(name)){
          return Promise.resolve({data:null,error:null});
        }
        if(CHARACTER_ONLY_RPCS.has(name)){
          return Promise.resolve({data:null,error:actorError()});
        }
        name=ORGANIZATION_RPC_MAP[name]||name;
      }
      return original(name,args,options);
    };

    actorState.clientWrapped=true;
    return true;
  }

  function ensureActorProxy(ctx){
    const s=appState();
    const active=ctx?.active_identity;
    const profile=active?.profile;
    if(!s||!active?.id||!profile) return;

    s.lmhIdentityV2=ctx;
    s.activeIdentityId=active.id;
    s.activeIdentityType=active.type;
    s.activeOrganizationId=active.type==='organization'?active.id:null;

    // UI compatibility only. The server remains authoritative and the RPC bridge
    // blocks Character-only actions while an organization is active.
    s.activeCharacterId=active.id;

    if(Array.isArray(s.characters)){
      const existing=s.characters.find(item=>item?.id===active.id);
      const proxy={
        ...profile,
        id:active.id,
        _identityType:active.type,
        _identityV2:true,
        access_role:ctx.organization_access_role||profile.access_role||null
      };
      if(existing) Object.assign(existing,proxy);
      else s.characters.unshift(proxy);
    }
  }

  function renderIdentityBadge(ctx){
    const active=ctx?.active_identity;
    if(!active?.profile) return;
    let badge=document.querySelector('[data-ls-identity-v2-badge]');
    if(!badge){
      badge=document.createElement('div');
      badge.dataset.lsIdentityV2Badge='1';
      badge.style.cssText=[
        'position:fixed','right:14px','top:12px','z-index:2147482000',
        'display:flex','align-items:center','gap:8px','max-width:min(420px,calc(100vw - 28px))',
        'padding:7px 10px','border-radius:12px','background:rgba(15,23,42,.94)',
        'color:#e2e8f0','font:600 12px/1.25 system-ui,sans-serif',
        'box-shadow:0 8px 28px rgba(0,0,0,.28)','backdrop-filter:blur(12px)',
        'border:1px solid rgba(148,163,184,.24)','pointer-events:none'
      ].join(';');
      document.body.appendChild(badge);
    }
    const type=active.type==='organization'?'Organisation':'Charakter';
    badge.textContent=`${type} · ${active.profile.name||active.id}`;
    badge.dataset.identityType=active.type;
  }

  function renderOrganizationGuard(ctx){
    const active=ctx?.active_identity;
    let notice=document.querySelector('[data-ls-identity-v2-guard]');
    if(active?.type!=='organization'){
      notice?.remove();
      return;
    }

    if(!notice){
      notice=document.createElement('div');
      notice.dataset.lsIdentityV2Guard='1';
      notice.style.cssText=[
        'position:fixed','left:50%','bottom:14px','transform:translateX(-50%)',
        'z-index:2147481999','max-width:min(680px,calc(100vw - 28px))',
        'padding:8px 12px','border-radius:12px','background:rgba(2,6,23,.94)',
        'color:#cbd5e1','font:500 12px/1.35 system-ui,sans-serif',
        'border:1px solid rgba(148,163,184,.2)','box-shadow:0 8px 28px rgba(0,0,0,.25)',
        'pointer-events:none','text-align:center'
      ].join(';');
      document.body.appendChild(notice);
    }
    notice.textContent='Organisationsidentität aktiv · Unternehmenskanäle und Community sind freigegeben · Private Chats, Kontakte und Anrufe bleiben Character-only.';
  }

  async function loadContext({reloadOnTypeChange=false}={}){
    const c=client();
    if(!c) return null;
    const original=window.__LS_CONNECT_V095_ORIGINAL_RPC__||c.rpc.bind(c);
    const {data,error}=await original('lsc2_current_context_v2');
    if(error||!data?.active_identity) throw error||new Error('Identity-v2-Kontext fehlt.');

    const previousType=actorState.lastType;
    const previousRevision=actorState.lastRevision;
    const nextType=data.active_identity.type;
    const nextRevision=Number(data.identity_revision??0);

    actorState.context=data;
    actorState.lastType=nextType;
    actorState.lastRevision=nextRevision;
    actorState.loadedAt=new Date().toISOString();

    ensureActorProxy(data);
    renderIdentityBadge(data);
    renderOrganizationGuard(data);

    window.__LS_CONNECT_IDENTITY_V2__=data;
    window.dispatchEvent(new CustomEvent('ls-connect:identity-v2-changed',{detail:data}));

    if(reloadOnTypeChange&&previousType&&(
      previousType!==nextType
      ||(Number.isFinite(previousRevision)&&previousRevision!==nextRevision)
    )){
      window.location.reload();
    }
    return data;
  }

  async function boot(){
    const deadline=Date.now()+15000;
    while(Date.now()<deadline){
      if(client()&&appState()) break;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    if(!client()) throw new Error('LS Connect RPC-Client nicht verfügbar.');

    wrapRpc();
    await loadContext();

    const oldLoad=typeof window.loadSessionIdentity==='function'?window.loadSessionIdentity:null;
    if(oldLoad&&!window.__LS_CONNECT_V095_LOAD_IDENTITY_WRAPPED__){
      window.__LS_CONNECT_V095_LOAD_IDENTITY_WRAPPED__=true;
      window.loadSessionIdentity=async function(...args){
        let result;
        try{ result=await oldLoad.apply(this,args); }catch(error){
          if(!isOrganization()) throw error;
        }
        try{ await loadContext(); }catch{}
        return result;
      };
    }

    window.addEventListener('focus',()=>{void loadContext({reloadOnTypeChange:true}).catch(()=>{});});
    document.addEventListener('visibilitychange',()=>{
      if(document.visibilityState==='visible') void loadContext({reloadOnTypeChange:true}).catch(()=>{});
    });

    setInterval(()=>{
      if(document.visibilityState==='visible') void loadContext({reloadOnTypeChange:true}).catch(()=>{});
    },30000);

    window.__LS_CONNECT_RELOAD_IDENTITY_V2__=()=>loadContext({reloadOnTypeChange:false});
    console.info('[LS Connect] Identity v2 actor bridge active',activeIdentity());
  }

  boot().catch(error=>{
    console.error('[LS Connect] Identity v2 actor bridge failed',error);
    window.__LS_CONNECT_IDENTITY_V2_ERROR__=String(error?.message||error);
  });
})();