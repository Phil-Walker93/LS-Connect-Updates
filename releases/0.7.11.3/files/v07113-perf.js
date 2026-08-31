/* LS Connect – Supabase egress optimization */
(function installLsConnectEgressOptimizer(){
  if(window.__LS_CONNECT_EGRESS_OPTIMIZER__)return;
  window.__LS_CONNECT_EGRESS_OPTIMIZER__=true;

  const VISIBLE_UNREAD_MS=90000;
  const VISIBLE_NOTICE_MS=180000;
  const VISIBLE_PRESENCE_MS=60000;
  const VISIBLE_LAST_SEEN_MS=120000;
  const HIDDEN_PRESENCE_MS=120000;
  const AVATAR_MAX_CACHE_MS=50*60*1000;
  const AVATAR_SAFETY_MS=5*60*1000;
  const avatarSignedUrlCache=new Map();

  const online=()=>typeof state!=='undefined'&&state?.mode==='online'&&typeof db!=='undefined'&&!!db&&!!state.activeCharacterId;
  const userKey=()=>String((typeof state!=='undefined'&&state?.user?.id)||'anonymous');
  const optionKey=value=>{try{return JSON.stringify(value??null);}catch{return '';}};

  function clearTimer(name){
    if(typeof state==='undefined')return;
    const timer=state?.[name];
    if(timer){clearInterval(timer);state[name]=null;}
  }

  function pruneAvatarCache(now=Date.now()){
    if(avatarSignedUrlCache.size<250)return;
    for(const [key,value] of avatarSignedUrlCache){
      if(!value||value.expiresAt<=now)avatarSignedUrlCache.delete(key);
    }
  }

  function installAvatarCache(){
    if(typeof db==='undefined'||!db?.storage?.from||db.storage.__lsConnectEgressPatched)return false;
    const storage=db.storage;
    const originalFrom=storage.from.bind(storage);
    storage.from=function lsConnectCachedStorageFrom(bucket){
      const client=originalFrom(bucket);
      if(String(bucket)!=='ls-avatars'||!client?.createSignedUrl)return client;
      const originalCreateSignedUrl=client.createSignedUrl.bind(client);
      client.createSignedUrl=async function lsConnectCachedSignedAvatar(path,expiresIn,options){
        const ttlSeconds=Math.max(1,Number(expiresIn)||3600);
        if(ttlSeconds<600)return originalCreateSignedUrl(path,expiresIn,options);
        const now=Date.now();
        pruneAvatarCache(now);
        const cacheMs=Math.max(30000,Math.min(AVATAR_MAX_CACHE_MS,ttlSeconds*1000-AVATAR_SAFETY_MS));
        const key=`${userKey()}|ls-avatars|${String(path||'')}|${ttlSeconds}|${optionKey(options)}`;
        const cached=avatarSignedUrlCache.get(key);
        if(cached&&cached.expiresAt>now)return cached.promise;
        const promise=Promise.resolve(originalCreateSignedUrl(path,expiresIn,options))
          .then(result=>{
            if(result?.error||!result?.data?.signedUrl)avatarSignedUrlCache.delete(key);
            return result;
          })
          .catch(error=>{avatarSignedUrlCache.delete(key);throw error;});
        avatarSignedUrlCache.set(key,{expiresAt:now+cacheMs,promise});
        return promise;
      };
      return client;
    };
    storage.__lsConnectEgressPatched=true;
    return true;
  }

  function scheduleUnreadAndNotices({refresh=false}={}){
    if(typeof state==='undefined')return;
    clearTimer('unreadRefreshTimerV078');
    clearTimer('noticePollTimerV078');
    if(!online()||document.hidden)return;
    if(typeof v078RefreshUnread==='function'){
      state.unreadRefreshTimerV078=setInterval(()=>{
        if(!document.hidden&&online())v078RefreshUnread({silent:true});
      },VISIBLE_UNREAD_MS);
    }
    if(typeof v078PollNotices==='function'){
      state.noticePollTimerV078=setInterval(()=>{
        if(!document.hidden&&online())v078PollNotices({silent:true});
      },VISIBLE_NOTICE_MS);
    }
    if(refresh){
      if(typeof v078RefreshUnread==='function')v078RefreshUnread({silent:true});
      if(typeof v078PollNotices==='function')v078PollNotices({silent:true});
    }
  }

  function schedulePresence({refresh=false}={}){
    if(typeof state==='undefined')return;
    clearTimer('presenceHeartbeatTimerV077');
    clearTimer('lastSeenRefreshTimerV077');
    if(!online())return;
    const characterId=state.activeCharacterId;
    const presenceMs=document.hidden?HIDDEN_PRESENCE_MS:VISIBLE_PRESENCE_MS;
    if(typeof v077TouchPresence==='function'){
      state.presenceHeartbeatTimerV077=setInterval(()=>{
        if(state.activeCharacterId===characterId&&online())v077TouchPresence(characterId);
      },presenceMs);
    }
    if(!document.hidden&&typeof v077LoadLastSeen==='function'){
      state.lastSeenRefreshTimerV077=setInterval(async()=>{
        if(state.activeCharacterId!==characterId||!online())return;
        await v077LoadLastSeen();
        if(typeof renderHeaderAndProfile==='function')renderHeaderAndProfile();
      },VISIBLE_LAST_SEEN_MS);
    }
    if(refresh&&!document.hidden&&typeof v077LoadLastSeen==='function'){
      Promise.resolve(v077LoadLastSeen()).then(()=>{
        if(typeof renderHeaderAndProfile==='function')renderHeaderAndProfile();
      }).catch(()=>{});
    }
  }

  function patchKnownSchedulers(){
    if(typeof v078StartPolling==='function'&&!window.__LS_CONNECT_EGRESS_V078_BASE__){
      const base=v078StartPolling;
      window.__LS_CONNECT_EGRESS_V078_BASE__=base;
      v078StartPolling=function v078StartPollingEgressOptimized(){
        const result=base.apply(this,arguments);
        scheduleUnreadAndNotices();
        return result;
      };
    }
    if(typeof startPresence==='function'&&!window.__LS_CONNECT_EGRESS_PRESENCE_BASE__){
      const base=startPresence;
      window.__LS_CONNECT_EGRESS_PRESENCE_BASE__=base;
      startPresence=async function startPresenceEgressOptimized(){
        const result=await base.apply(this,arguments);
        schedulePresence();
        return result;
      };
    }
  }

  function applyOptimizer({refresh=false}={}){
    installAvatarCache();
    patchKnownSchedulers();
    scheduleUnreadAndNotices({refresh});
    schedulePresence({refresh});
  }

  document.addEventListener('visibilitychange',()=>{
    applyOptimizer({refresh:!document.hidden});
    if(!document.hidden&&typeof v076PollIncomingCall==='function'){
      Promise.resolve(v076PollIncomingCall()).catch(()=>{});
    }
  });

  window.addEventListener('pageshow',()=>setTimeout(()=>applyOptimizer({refresh:true}),0),{passive:true});

  // Older LS Connect modules are loaded in stages. Re-apply locally a few times so the optimizer
  // wins over their legacy timers without creating any additional Supabase traffic itself.
  [0,500,1800,3500].forEach(delay=>setTimeout(()=>applyOptimizer({refresh:delay===3500}),delay));

  console.info('[LS Connect] Supabase egress optimization active');
})();
