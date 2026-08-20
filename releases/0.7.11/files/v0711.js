/* LS Connect v0.7.11 – repaired design system */
var LS_CONNECT_V0711_VERSION='0.7.11';

(function v0711RegisterPresets(){
  if(typeof V071012_PRESETS==='undefined')return;
  V071012_PRESETS.lsclassic={
    name:'LS Classic',description:'Der originale LS-Connect-Look mit tiefem Navy und kräftigem Grün.',
    accent:'#22c55e',tone:'#16a34a',swatches:['#22c55e','#111827','#0f172a'],
    sidebar:'#0f172a',panel:'#111827',surface:'#172033',surface2:'#1e293b',active:'#24324a',border:'#2a3a50',text:'#f8fafc',muted:'#94a3b8'
  };
  Object.assign(V071012_PRESETS.classic,{name:'Discord Classic',description:'Neutralgraue Flächen mit Blurple-Akzent.'});
  Object.assign(V071012_PRESETS.violet,{name:'Blurple Night',description:'Dunkler Messenger-Look mit kräftigem Blurple.'});
  Object.assign(V071012_PRESETS.midnight,{name:'Night Slate',description:'Ruhiger Slate-Look mit kühlen Graublau-Tönen.'});
  Object.assign(V071012_PRESETS.graphite,{name:'Graphite',description:'Neutraler technischer Look mit dezenten Kontrasten.'});
  Object.assign(V071012_PRESETS.emerald,{name:'Deep Forest',description:'Dunkle Flächen mit ruhigem Emerald-Akzent.'});
  Object.assign(V071012_PRESETS.sunset,{name:'Rose Night',description:'Dunkler Look mit weichem Rosé-/Magenta-Akzent.'});
})();

(function v0711InstallStyles(){
  if(document.getElementById('v0711-design-system'))return;
  const style=document.createElement('style');
  style.id='v0711-design-system';
  style.textContent=`
    html[data-ls-design]{
      --ls11-app:#101318;--ls11-layer-1:#171a20;--ls11-layer-2:#1e2229;--ls11-layer-3:#272c34;--ls11-active:#303640;
      --ls11-border-soft:rgba(255,255,255,.055);--ls11-border:rgba(255,255,255,.09);--ls11-border-strong:rgba(255,255,255,.14);
      --ls11-text:#f5f7fa;--ls11-muted:#a5adba;--ls11-on-accent:#ffffff;--ls11-shadow-soft:0 4px 14px rgba(0,0,0,.18);--ls11-shadow-card:0 8px 24px rgba(0,0,0,.20);--ls11-shadow-modal:0 20px 54px rgba(0,0,0,.42);
      --panel:var(--ls11-layer-2);--panel-2:var(--ls11-layer-3);--border:var(--ls11-border);--text:var(--ls11-text);--muted:var(--ls11-muted);
    }
    html[data-ls-design='lsclassic']{--accent:#22c55e;--v071013-accent:#22c55e;--v071013-tone:#16a34a;--ls11-app:#08111f;--ls11-layer-1:#0f172a;--ls11-layer-2:#111827;--ls11-layer-3:#172033;--ls11-active:#1e293b;--ls11-border-soft:rgba(148,163,184,.12);--ls11-border:rgba(148,163,184,.19);--ls11-border-strong:rgba(148,163,184,.28);--ls11-text:#f8fafc;--ls11-muted:#94a3b8;--ls11-on-accent:#07120b}
    html[data-ls-design='classic']{--accent:#5865f2;--v071013-accent:#5865f2;--v071013-tone:#4752c4;--ls11-app:#1a1b1e;--ls11-layer-1:#1e1f22;--ls11-layer-2:#2b2d31;--ls11-layer-3:#313338;--ls11-active:#383a40;--ls11-text:#f2f3f5;--ls11-muted:#b5bac1;--ls11-on-accent:#ffffff}
    html[data-ls-design='violet']{--accent:#5865f2;--v071013-accent:#5865f2;--v071013-tone:#7289da;--ls11-app:#111318;--ls11-layer-1:#17191d;--ls11-layer-2:#202329;--ls11-layer-3:#2b2f36;--ls11-active:#333842;--ls11-text:#f5f7fb;--ls11-muted:#aeb5c1;--ls11-on-accent:#ffffff}
    html[data-ls-design='midnight']{--accent:#7c8da6;--v071013-accent:#7c8da6;--v071013-tone:#56657a;--ls11-app:#0b0c0f;--ls11-layer-1:#111214;--ls11-layer-2:#1a1d21;--ls11-layer-3:#23272e;--ls11-active:#2a3038;--ls11-text:#eef2f6;--ls11-muted:#9ca8b6;--ls11-on-accent:#0b0d10}
    html[data-ls-design='graphite']{--accent:#9aa4b2;--v071013-accent:#9aa4b2;--v071013-tone:#66717f;--ls11-app:#090b0e;--ls11-layer-1:#0f1115;--ls11-layer-2:#181b20;--ls11-layer-3:#22262d;--ls11-active:#292e36;--ls11-text:#f1f3f5;--ls11-muted:#9ca3ad;--ls11-on-accent:#111318}
    html[data-ls-design='emerald']{--accent:#22c55e;--v071013-accent:#22c55e;--v071013-tone:#15803d;--ls11-app:#0b0f0c;--ls11-layer-1:#111512;--ls11-layer-2:#1b211d;--ls11-layer-3:#252d27;--ls11-active:#2d3730;--ls11-text:#eef7f0;--ls11-muted:#a5b5a8;--ls11-on-accent:#07120b}
    html[data-ls-design='sunset']{--accent:#e879f9;--v071013-accent:#e879f9;--v071013-tone:#c05bd3;--ls11-app:#0f0c10;--ls11-layer-1:#141116;--ls11-layer-2:#211c21;--ls11-layer-3:#2c2630;--ls11-active:#342d39;--ls11-text:#f8f1f8;--ls11-muted:#b9aebb;--ls11-on-accent:#160b17}

    html[data-ls-design] body{background:var(--ls11-app)!important;color:var(--ls11-text)!important;background-image:none!important}
    html[data-ls-design] .app-shell{background:var(--ls11-app)!important}
    html[data-ls-design] .sidebar{background:var(--ls11-layer-1)!important;border-right:1px solid var(--ls11-border-soft)!important;box-shadow:inset -1px 0 rgba(255,255,255,.02),4px 0 14px rgba(0,0,0,.10)}
    html[data-ls-design] .conversation-panel{background:var(--ls11-layer-2)!important;border-color:var(--ls11-border-soft)!important}
    html[data-ls-design] .profile-panel{background:var(--ls11-layer-1)!important;border-color:var(--ls11-border-soft)!important}
    html[data-ls-design] .chat-header,html[data-ls-design] .conversation-header,html[data-ls-design] .profile-header{background:var(--ls11-layer-1)!important;border-bottom:1px solid var(--ls11-border-soft)!important;box-shadow:0 3px 10px rgba(0,0,0,.08)}
    html[data-ls-design] .character-switcher{background:var(--ls11-layer-2)!important;border:1px solid var(--ls11-border-soft)!important;border-radius:12px!important;box-shadow:var(--ls11-shadow-soft)}
    html[data-ls-design] .character-switcher:hover{background:var(--ls11-layer-3)!important;border-color:var(--ls11-border)!important}

    html[data-ls-design] .chat-item,html[data-ls-design] .channel-item{border:1px solid transparent!important;border-radius:12px!important;transition:background .14s ease,border-color .14s ease,box-shadow .14s ease}
    html[data-ls-design] .chat-item:hover,html[data-ls-design] .channel-item:hover{background:var(--ls11-layer-3)!important;border-color:var(--ls11-border-soft)!important}
    html[data-ls-design] .chat-item.active,html[data-ls-design] .channel-item.active{background:var(--ls11-active)!important;border-color:var(--accent)!important;box-shadow:inset 3px 0 0 var(--accent)!important}
    html[data-ls-design] .channel-item{background:var(--ls11-layer-2)!important;border-color:var(--ls11-border-soft)!important}

    html[data-ls-design] input,html[data-ls-design] textarea,html[data-ls-design] select{background:var(--ls11-layer-1)!important;color:var(--ls11-text)!important;border:1px solid var(--ls11-border)!important;box-shadow:inset 0 1px 3px rgba(0,0,0,.14);transition:border-color .14s ease,box-shadow .14s ease}
    html[data-ls-design] input:focus,html[data-ls-design] textarea:focus,html[data-ls-design] select:focus{border-color:var(--accent)!important;box-shadow:0 0 0 2px rgba(88,101,242,.14)!important;outline:none}
    html[data-ls-design] input::placeholder,html[data-ls-design] textarea::placeholder{color:var(--ls11-muted)!important}

    html[data-ls-design] .settings-block,html[data-ls-design] .request-card,html[data-ls-design] .admin-channel-row,html[data-ls-design] .v078-own-contact-row,html[data-ls-design] .v078-notice-row,html[data-ls-design] .info-card,html[data-ls-design] .profile-card{background:var(--ls11-layer-2)!important;border:1px solid var(--ls11-border-soft)!important;border-radius:14px!important;box-shadow:0 4px 12px rgba(0,0,0,.08)}
    html[data-ls-design] .primary-button,html[data-ls-design] .send-button{background:var(--accent)!important;color:var(--ls11-on-accent)!important;border-color:transparent!important}
    html[data-ls-design] .small-button,html[data-ls-design] .secondary-button{background:var(--ls11-layer-3)!important;border:1px solid var(--ls11-border)!important}
    html[data-ls-design] .ghost-button,html[data-ls-design] .icon-button{background:transparent!important}
    html[data-ls-design] .ghost-button:hover,html[data-ls-design] .icon-button:hover{background:var(--ls11-layer-3)!important}

    html[data-ls-design] .modal-backdrop{background:rgba(0,0,0,.62)!important}
    html[data-ls-design] .modal{background:var(--ls11-layer-2)!important;border:1px solid var(--ls11-border-strong)!important;border-radius:18px!important;box-shadow:var(--ls11-shadow-modal)!important}
    html[data-ls-design] .admin-tab:hover{background:var(--ls11-layer-3)!important}
    html[data-ls-design] .admin-tab.active{background:var(--ls11-active)!important;color:var(--ls11-text)!important;box-shadow:inset 0 -2px var(--accent)!important}

    html[data-ls-design] .messages{background:var(--ls11-layer-2)!important}
    html[data-ls-design] .message-row.in .message-bubble,html[data-ls-design] .message-row:not(.out) .message-bubble{background:var(--ls11-layer-3)!important;border:1px solid var(--ls11-border-soft)!important;box-shadow:0 2px 7px rgba(0,0,0,.08)}
    html[data-ls-design] .message-row.out .message-bubble{background:var(--accent)!important;color:var(--ls11-on-accent)!important;border:1px solid transparent!important;box-shadow:0 2px 7px rgba(0,0,0,.08)}
    html[data-ls-design] .message-compose,html[data-ls-design] .composer{background:var(--ls11-layer-1)!important;border-top:1px solid var(--ls11-border-soft)!important;box-shadow:0 -4px 14px rgba(0,0,0,.07)}

    html[data-ls-design] .mobile-nav{background:var(--ls11-layer-1)!important;border-top:1px solid var(--ls11-border)!important;box-shadow:0 -6px 18px rgba(0,0,0,.16)!important}
    html[data-ls-design] .mobile-nav button{position:relative}
    html[data-ls-design] .mobile-nav button.active{background:var(--ls11-layer-3)!important;color:var(--accent)!important}
    html[data-ls-design] .mobile-nav button.active:before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:24px;height:3px;border-radius:999px;background:var(--accent)}
    html[data-ls-design] .v078-unread-badge,html[data-ls-design] .unread-badge{background:var(--accent)!important;color:var(--ls11-on-accent)!important;border:2px solid var(--ls11-layer-1)!important;box-shadow:0 2px 6px rgba(0,0,0,.18)!important}

    .v0711-design-intro{margin:0 0 13px;color:var(--muted);line-height:1.5}
    .v0711-design-note{margin:13px 0 0;padding:10px 11px;border:1px solid var(--ls11-border-soft);border-radius:11px;background:var(--ls11-layer-1);color:var(--ls11-muted);font-size:.78rem;line-height:1.45}
    .v071012-design-card{background:var(--ls11-layer-2)!important;border-color:var(--ls11-border-soft)!important;box-shadow:0 3px 10px rgba(0,0,0,.07)}
    .v071012-design-card:hover{background:var(--ls11-layer-3)!important;border-color:var(--accent)!important;transform:none!important}
    .v071012-design-card.active{border-color:var(--accent)!important;box-shadow:0 0 0 2px rgba(88,101,242,.12)!important}

    @media(max-width:900px){html[data-ls-design] .profile-panel{box-shadow:none}}
    @media(max-width:700px){html[data-ls-design] .sidebar{box-shadow:none}.v071012-design-grid{grid-template-columns:1fr!important}}
    @media(prefers-reduced-motion:reduce){html[data-ls-design] button,html[data-ls-design] .chat-item,html[data-ls-design] .channel-item,html[data-ls-design] input,html[data-ls-design] textarea,html[data-ls-design] select{transition:none!important}}
  `;
  document.head.appendChild(style);
})();

function v0711DesignCard(key,preset){
  const sw=preset.swatches||[];
  const side=preset.sidebar||sw[2]||'#1e1f22';
  const panel=preset.panel||sw[1]||'#313338';
  const accent=preset.accent||sw[0]||'#5865f2';
  return `<button type="button" class="v071012-design-card${typeof v071012CurrentPreset==='function'&&v071012CurrentPreset()===key?' active':''}" data-v071012-preset="${key}"><span class="v071012-design-preview" style="--v071012-preview-tone:${accent};--v071012-preview-main:${panel};--v071012-preview-side:${side}"><aside></aside><main><i></i><i></i><i></i></main></span><span class="v071012-design-copy"><strong>${preset.name}</strong><small>${preset.description}</small></span></button>`;
}

function v0711OpenDesignModal(){
  if(typeof V071012_PRESETS==='undefined'||typeof v071012ApplyPreset!=='function')return;
  const order=['lsclassic','classic','violet','midnight','graphite','emerald','sunset'];
  const html=`<p class="v0711-design-intro">Wähle den LS-Connect-Oberflächenstil. <strong>Hell/Dunkel bleibt separat steuerbar.</strong></p><div class="v071012-design-grid">${order.filter(key=>V071012_PRESETS[key]).map(key=>v0711DesignCard(key,V071012_PRESETS[key])).join('')}</div><p class="v0711-design-note">Alle Designs verwenden dieselbe UI-Struktur. Beim Wechsel werden ausschließlich Designwerte geändert – keine Verbindung, Sitzung oder Update-Logik.</p>`;
  if(typeof openModal==='function')openModal('Design auswählen',html);
  else if(typeof els!=='undefined'&&els.modalContent){
    const title=document.getElementById('modalTitle');if(title)title.textContent='Design auswählen';
    els.modalContent.innerHTML=html;document.getElementById('modalBackdrop')?.classList.remove('hidden');
  }
  const root=(typeof els!=='undefined'&&els.modalContent)||document.getElementById('modalContent');
  if(!root)return;
  root.querySelectorAll('[data-v071012-preset]').forEach(button=>button.addEventListener('click',async()=>{
    const preset=v071012ApplyPreset(button.dataset.v071012Preset);
    root.querySelectorAll('[data-v071012-preset]').forEach(card=>card.classList.toggle('active',card===button));
    try{
      if(typeof db!=='undefined'&&db&&typeof state!=='undefined'&&state?.mode==='online'){
        const {error}=await db.rpc('set_design_preset_v071012',{p_preset:preset});if(error)throw error;
      }
      if(typeof v071012Toast==='function')v071012Toast(`Design „${V071012_PRESETS[preset].name}“ aktiviert.`,'success');
      else if(typeof showToast==='function')showToast(`Design „${V071012_PRESETS[preset].name}“ aktiviert.`,'success');
    }catch(error){
      console.warn('[LS Connect] Design-Synchronisierung fehlgeschlagen.',error);
      if(typeof showToast==='function')showToast('Design lokal gespeichert; Account-Synchronisierung fehlgeschlagen.','info');
    }
  }));
}

(function v0711InstallDesignDelegation(){
  const root=document.documentElement;
  if(root.dataset.v0711DesignHandler==='1')return;
  root.dataset.v0711DesignHandler='1';
  document.addEventListener('click',event=>{
    const button=event.target?.closest?.('#designPresetButtonV071012');
    if(!button)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    v0711OpenDesignModal();
  },true);
})();

if(typeof V07_LOCAL_CHANGELOG!=='undefined'&&!V07_LOCAL_CHANGELOG.some(entry=>entry.version===LS_CONNECT_V0711_VERSION)){
  V07_LOCAL_CHANGELOG.unshift({version:LS_CONNECT_V0711_VERSION,title:'Design System & Depth Overhaul',items:[
    'LS Classic als eigenes Design zurückgebracht',
    'Sieben Designs auf ein gemeinsames Layer-System vereinheitlicht',
    'Sidebar, Chat, Karten, Eingaben, Modals und mobile Navigation klarer getrennt',
    'Theme-Wechsel von Update-, Verbindungs- und Sitzungslogik entkoppelt',
    'Performance-intensive Blur-Effekte aus dem Design-Patch entfernt'
  ]});
}
console.info('[LS Connect] v0.7.11 repaired design system active');
