/* LS Connect v0.7.11 r3 – durable design persistence */
var LS_CONNECT_V0711_R3_VERSION='0.7.11-r3';
(function v0711R3PersistenceRepair(){
  if(window.__LS_CONNECT_V0711_R3_PERSISTENCE__)return;
  window.__LS_CONNECT_V0711_R3_PERSISTENCE__=true;

  const BASE_KEY='ls-connect:design-preset:v1';
  const CANDIDATE_KEY='ls-connect:design-preset:v0711-candidate';

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

  // Restore the candidate-owned choice immediately. This key is intentionally
  // separate from the legacy Stable key so older startup code cannot destroy it.
  if(!restoreCandidatePreset()){
    const current=valid(document.documentElement.dataset.lsDesign)||read(BASE_KEY);
    if(current)remember(current);
  }

  if(typeof v071012LoadServerPreset==='function'){
    v071012LoadServerPreset=async function v071012LoadServerPresetV0711R3(){
      if(typeof db==='undefined'||!db||typeof state==='undefined'||state?.mode!=='online')return false;
      try{
        const candidate=read(CANDIDATE_KEY);
        if(candidate){
          v071012ApplyPreset(candidate,{saveLocal:true});
          const {error}=await db.rpc('set_design_preset_v071012',{p_preset:candidate});
          if(error)throw error;
          try{v071012ServerPresetLoaded=true;}catch{}
          return true;
        }

        const {data,error}=await db.rpc('my_design_preset_v071012');
        if(error)throw error;
        const preset=valid(data)||'classic';
        remember(preset);
        v071012ApplyPreset(preset,{saveLocal:true});
        try{v071012ServerPresetLoaded=true;}catch{}
        return true;
      }catch(error){
        console.warn('[LS Connect] v0.7.11 r3 Design-Persistenz konnte nicht synchronisiert werden.',error);
        restoreCandidatePreset();
        return false;
      }
    };
  }

  // A legacy server request may already be in flight before the Candidate loads.
  // Re-assert the candidate value a few times during boot; no interval/loop remains active.
  [0,120,450,1200].forEach(delay=>setTimeout(restoreCandidatePreset,delay));
  window.addEventListener('pageshow',()=>setTimeout(restoreCandidatePreset,0),{passive:true});

  console.info('[LS Connect] v0.7.11 r3 durable design persistence active');
})();
