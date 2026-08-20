/* LS Connect v0.7.11 r2 – candidate repair hotfix */
var LS_CONNECT_V0711_R2_VERSION='0.7.11-r2';
(function v0711R2Repair(){
  if(window.__LS_CONNECT_V0711_R2_REPAIR__)return;
  window.__LS_CONNECT_V0711_R2_REPAIR__=true;

  const DESIGN_KEY='ls-connect:design-preset:v1';
  const validPreset=value=>{
    const key=String(value||'').toLowerCase();
    try{return typeof V071012_PRESETS!=='undefined'&&V071012_PRESETS[key]?key:null;}catch{return null;}
  };

  if(typeof v07103InstallAccountShortcut==='function'){
    v07103InstallAccountShortcut=function v07103InstallAccountShortcutV0711R2(){
      if(typeof els==='undefined'||!els.modalContent||document.getElementById('v07103AccountForwardingShortcut'))return;
      const section=document.createElement('section');
      section.id='v07103AccountForwardingShortcut';
      section.className='settings-block';
      section.innerHTML='<h3>Telefon</h3><p class="notification-note">Eingehende Anrufe dieser RP-Nummer an eine andere LS-Connect-Rufnummer weiterleiten.</p><button id="v07103AccountForwardingOpen" class="small-button primary" type="button">Rufnummernweiterleitung öffnen</button>';
      const runtime=document.getElementById('v079RuntimeCard');
      if(runtime&&runtime.parentNode===els.modalContent)els.modalContent.insertBefore(section,runtime);
      else els.modalContent.appendChild(section);
      document.getElementById('v07103AccountForwardingOpen')?.addEventListener('click',()=>{
        if(typeof v07103OpenForwardingModal==='function')v07103OpenForwardingModal();
      });
    };
  }

  if(typeof v071012ApplyPreset==='function'){
    const applyBase=v071012ApplyPreset;
    v071012ApplyPreset=function v071012ApplyPresetV0711R2(value,options={}){
      const preset=applyBase(value,options);
      if(options?.saveLocal!==false){try{localStorage.setItem(DESIGN_KEY,preset);}catch{}}
      return preset;
    };
  }

  if(typeof v071012LoadServerPreset==='function'){
    v071012LoadServerPreset=async function v071012LoadServerPresetV0711R2(){
      if(typeof db==='undefined'||!db||typeof state==='undefined'||state?.mode!=='online')return false;
      try{
        const local=validPreset(localStorage.getItem(DESIGN_KEY));
        if(local){
          v071012ApplyPreset(local);
          const {error}=await db.rpc('set_design_preset_v071012',{p_preset:local});
          if(error)throw error;
          try{v071012ServerPresetLoaded=true;}catch{}
          return true;
        }
        const {data,error}=await db.rpc('my_design_preset_v071012');
        if(error)throw error;
        const preset=validPreset(data)||'classic';
        v071012ApplyPreset(preset);
        try{localStorage.setItem(DESIGN_KEY,preset);}catch{}
        try{v071012ServerPresetLoaded=true;}catch{}
        return true;
      }catch(error){
        console.warn('[LS Connect] v0.7.11 r2 Design-Persistenz konnte nicht synchronisiert werden.',error);
        return false;
      }
    };
  }

  try{
    const initial=validPreset(localStorage.getItem(DESIGN_KEY));
    if(initial&&typeof v071012ApplyPreset==='function')v071012ApplyPreset(initial);
  }catch{}

  if(!document.getElementById('v0711-r2-repair-styles')){
    const style=document.createElement('style');
    style.id='v0711-r2-repair-styles';
    style.textContent=`
      html[data-ls-design] #characterMenu [data-character],
      html[data-ls-design] .character-menu [data-character]{border:1px solid transparent!important;border-radius:10px!important;transition:background .14s ease,border-color .14s ease,box-shadow .14s ease,transform .14s ease!important}
      html[data-ls-design] #characterMenu [data-character]:hover,
      html[data-ls-design] .character-menu [data-character]:hover{background:var(--ls11-layer-3)!important;border-color:var(--accent)!important;box-shadow:inset 3px 0 0 var(--accent),0 3px 10px rgba(0,0,0,.12)!important;transform:translateX(2px)}
      html[data-ls-design] .chat-item{border-color:var(--ls11-border-soft)!important;box-shadow:inset 0 -1px 0 var(--ls11-border-soft)!important}
      html[data-ls-design] .chat-item:hover{border-color:var(--ls11-border)!important}
      html[data-ls-design] .chat-item.active{border-color:var(--accent)!important;box-shadow:inset 3px 0 0 var(--accent),inset 0 -1px 0 var(--ls11-border-soft)!important}
      @media(prefers-reduced-motion:reduce){html[data-ls-design] #characterMenu [data-character],html[data-ls-design] .character-menu [data-character]{transform:none!important}}
    `;
    document.head.appendChild(style);
  }

  console.info('[LS Connect] v0.7.11 r2 candidate repairs active');
})();
