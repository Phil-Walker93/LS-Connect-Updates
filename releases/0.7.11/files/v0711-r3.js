/* LS Connect v0.7.11 r3 – durable design persistence */
var LS_CONNECT_V0711_R3_VERSION='0.7.11-r3';
(function v0711R3PersistenceRepair(){
  if(window.__LS_CONNECT_V0711_R3_PERSISTENCE__)return;
  window.__LS_CONNECT_V0711_R3_PERSISTENCE__=true;

  const BASE_KEY='ls-connect:design-preset:v1';
  const CANDIDATE_KEY='ls-connect:design-preset:v0711-candidate';
  const RETRY_DELAY_MS=30000;
  const syncState=window.__LS_CONNECT_V0711_R3_SYNC_STATE__||{
    inFlight:null,
    retryAfter:0,
    syncedPreset:null
  };
  window.__LS_CONNECT_V0711_R3_SYNC_STATE__=syncState;

  const valid=value=>{
    const key=String(value||'').toLowerCase();
    try{return typeof V071012_PRESETS!=='undefined'&&V071012_PRESETS[key]?key:null;}catch{return null;}
  };
  const read=key=>{try{return valid(localStorage.getItem(key));}catch{return null;}};
  const remember=value=>{
    const preset=valid(value);if(!preset)return null;
    try{localStorage.setItem(CANDIDATE_KEY,preset);localStorage.setItem(BASE_KEY,preset);}catch{}
    return preset;
  };

  if(typeof v071012ApplyPreset==='function'){
    const applyBase=v071012ApplyPreset;
    v071012ApplyPreset=function v071012ApplyPresetV0711R3(value,options={}){
      const preset=applyBase(value,options);
      if(options?.saveLocal!==false)remember(preset);
      return preset;
    };
  }

  const restoreCandidatePreset=()=>{
    const saved=read(CANDIDATE_KEY);if(!saved||typeof v071012ApplyPreset!=='function')return false;
    v071012ApplyPreset(saved,{saveLocal:true});
    return true;
  };

  if(!restoreCandidatePreset()){
    const current=valid(document.documentElement.dataset.lsDesign)||read(BASE_KEY);
    if(current)remember(current);
  }

  if(typeof v071012LoadServerPreset==='function'){
    v071012LoadServerPreset=async function v071012LoadServerPresetV0711R3(){
      if(typeof db==='undefined'||!db||typeof state==='undefined'||state?.mode!=='online')return false;
      try{if(v071012ServerPresetLoaded)return true;}catch{}
      if(syncState.inFlight)return syncState.inFlight;
      if(Date.now()<Number(syncState.retryAfter||0))return false;

      const task=(async()=>{
        try{
          const candidate=read(CANDIDATE_KEY);
          if(candidate)v071012ApplyPreset(candidate,{saveLocal:true});

          // Use the stable v0.7.11 RPCs directly. This avoids the short startup race where
          // the legacy v071012 names have not yet been remapped by r4.
          const {data,error}=await db.rpc('my_design_preset_v0711');
          if(error)throw error;
          const serverPreset=valid(data);

          if(candidate){
            if(serverPreset!==candidate){
              const {error:setError}=await db.rpc('set_design_preset_v0711',{p_preset:candidate});
              if(setError)throw setError;
            }
            syncState.syncedPreset=candidate;
          }else{
            const preset=serverPreset||'classic';
            remember(preset);
            v071012ApplyPreset(preset,{saveLocal:true});
            syncState.syncedPreset=preset;
          }

          syncState.retryAfter=0;
          try{v071012ServerPresetLoaded=true;}catch{}
          return true;
        }catch(error){
          syncState.retryAfter=Date.now()+RETRY_DELAY_MS;
          console.warn('[LS Connect] v0.7.11 r3 Design-Persistenz konnte nicht synchronisiert werden.',error);
          restoreCandidatePreset();
          return false;
        }finally{
          syncState.inFlight=null;
        }
      })();
      syncState.inFlight=task;
      return task;
    };
  }

  [0,120,450,1200].forEach(delay=>setTimeout(restoreCandidatePreset,delay));
  window.addEventListener('pageshow',()=>setTimeout(restoreCandidatePreset,0),{passive:true});

  console.info('[LS Connect] v0.7.11 r3 durable design persistence active');
})();
