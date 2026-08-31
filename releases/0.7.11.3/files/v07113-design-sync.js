/* LS Connect – design preset sync optimization */
(function installDesignPresetSyncOptimizer(){
  if(window.__LS_CONNECT_DESIGN_SYNC_OPTIMIZER__)return;
  window.__LS_CONNECT_DESIGN_SYNC_OPTIMIZER__=true;

  const READ_TTL_MS=30000;
  const WRITE_DEDUPE_MS=1500;
  const RETRY_DELAY_MS=30000;
  const BASE_KEY='ls-connect:design-preset:v1';
  const CANDIDATE_KEY='ls-connect:design-preset:v0711-candidate';

  const valid=value=>{
    const key=String(value||'').toLowerCase();
    try{return typeof V071012_PRESETS!=='undefined'&&V071012_PRESETS[key]?key:null;}catch{return null;}
  };
  const readLocal=()=>{
    try{return valid(localStorage.getItem(CANDIDATE_KEY))||valid(localStorage.getItem(BASE_KEY));}
    catch{return null;}
  };
  const online=()=>typeof db!=='undefined'&&!!db&&typeof state!=='undefined'&&state?.mode==='online';

  const syncState=window.__LS_CONNECT_DESIGN_SYNC_STATE__||{
    inFlight:null,
    retryAfter:0,
    readCache:null,
    readInFlight:null,
    writeInFlight:null,
    lastWrite:null
  };
  window.__LS_CONNECT_DESIGN_SYNC_STATE__=syncState;

  function patchDesignRpc(){
    if(typeof db==='undefined'||!db||typeof db.rpc!=='function'||db.__lsConnectDesignSyncPatched)return false;
    const rpcBase=db.rpc.bind(db);
    db.rpc=function lsConnectDesignRpc(name,args,options){
      const mapped=name==='set_design_preset_v071012'?'set_design_preset_v0711':name==='my_design_preset_v071012'?'my_design_preset_v0711':name;

      if(mapped==='my_design_preset_v0711'){
        const now=Date.now();
        if(syncState.readCache&&syncState.readCache.expiresAt>now)return Promise.resolve(syncState.readCache.result);
        if(syncState.readInFlight)return syncState.readInFlight;
        syncState.readInFlight=Promise.resolve(rpcBase(mapped,args,options))
          .then(result=>{
            if(!result?.error)syncState.readCache={expiresAt:Date.now()+READ_TTL_MS,result};
            return result;
          })
          .finally(()=>{syncState.readInFlight=null;});
        return syncState.readInFlight;
      }

      if(mapped==='set_design_preset_v0711'){
        const preset=String(args?.p_preset||'');
        const now=Date.now();
        if(syncState.writeInFlight&&syncState.writeInFlight.preset===preset)return syncState.writeInFlight.promise;
        if(syncState.lastWrite&&syncState.lastWrite.preset===preset&&now-syncState.lastWrite.at<WRITE_DEDUPE_MS){
          return Promise.resolve(syncState.lastWrite.result);
        }
        const promise=Promise.resolve(rpcBase(mapped,args,options))
          .then(result=>{
            if(!result?.error){
              syncState.lastWrite={preset,at:Date.now(),result};
              syncState.readCache={expiresAt:Date.now()+READ_TTL_MS,result:{data:preset,error:null}};
            }
            return result;
          })
          .finally(()=>{if(syncState.writeInFlight?.promise===promise)syncState.writeInFlight=null;});
        syncState.writeInFlight={preset,promise};
        return promise;
      }

      return rpcBase(mapped,args,options);
    };
    db.__lsConnectDesignSyncPatched=true;
    return true;
  }

  function installLoadGuard(){
    if(typeof v071012LoadServerPreset!=='function')return false;
    v071012LoadServerPreset=async function v071012LoadServerPresetOptimized(){
      if(!online())return false;
      try{if(v071012ServerPresetLoaded)return true;}catch{}
      if(syncState.inFlight)return syncState.inFlight;
      if(Date.now()<Number(syncState.retryAfter||0))return false;

      const task=(async()=>{
        try{
          const local=readLocal();
          if(local&&typeof v071012ApplyPreset==='function')v071012ApplyPreset(local,{saveLocal:true});

          const {data,error}=await db.rpc('my_design_preset_v0711');
          if(error)throw error;
          const server=valid(data);

          if(local){
            if(server!==local){
              const {error:setError}=await db.rpc('set_design_preset_v0711',{p_preset:local});
              if(setError)throw setError;
            }
          }else{
            const preset=server||'classic';
            if(typeof v071012ApplyPreset==='function')v071012ApplyPreset(preset,{saveLocal:true});
          }

          syncState.retryAfter=0;
          try{v071012ServerPresetLoaded=true;}catch{}
          return true;
        }catch(error){
          syncState.retryAfter=Date.now()+RETRY_DELAY_MS;
          console.warn('[LS Connect] Design-Preset-Synchronisierung wurde vorübergehend zurückgestellt.',error);
          return false;
        }finally{
          syncState.inFlight=null;
        }
      })();
      syncState.inFlight=task;
      return task;
    };
    return true;
  }

  function apply(){
    if(!online())return;
    patchDesignRpc();
    if(installLoadGuard())Promise.resolve(v071012LoadServerPreset()).catch(()=>{});
  }

  [0,300,1000,2500].forEach(delay=>setTimeout(apply,delay));
  window.addEventListener('pageshow',()=>setTimeout(apply,0),{passive:true});

  console.info('[LS Connect] design preset sync optimization active');
})();
