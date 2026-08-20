/* LS Connect v0.7.10.13 – Discord-inspired design preset refresh */
const LS_CONNECT_V071013_VERSION='0.7.10.13';

(function v071013RefreshPresetMetadata(){
  if(typeof V071012_PRESETS==='undefined')return;
  Object.assign(V071012_PRESETS.classic,{name:'Discord Classic',description:'Klarer Discord-Look mit Blurple-Akzent und sauber getrennten Flächen.',accent:'#5865f2',tone:'#4752c4',swatches:['#5865f2','#313338','#1e1f22'],sidebar:'#1e1f22',panel:'#313338',surface:'#2b2d31',surface2:'#383a40',border:'#3f4147',text:'#f2f3f5',muted:'#b5bac1'});
  Object.assign(V071012_PRESETS.violet,{name:'Blurple Night',description:'Dunkler, moderner Discord-Stil mit kräftigem Blurple für aktive Elemente.',accent:'#5865f2',tone:'#7289da',swatches:['#5865f2','#23262b','#191b1f'],sidebar:'#17191d',panel:'#23262b',surface:'#2b2f36',surface2:'#333842',border:'#414650',text:'#f5f7fb',muted:'#aeb5c1'});
  Object.assign(V071012_PRESETS.midnight,{name:'Night Slate',description:'Ruhiger Slate-Look mit kühlen Graublau-Tönen für lange Sessions.',accent:'#7c8da6',tone:'#56657a',swatches:['#7c8da6','#1a1d21','#111214'],sidebar:'#111214',panel:'#1a1d21',surface:'#23272e',surface2:'#2a3038',border:'#343b45',text:'#eef2f6',muted:'#9ca8b6'});
  Object.assign(V071012_PRESETS.graphite,{name:'Graphite',description:'Minimalistisch, neutral und technisch – Farbe nur dort, wo sie wirklich hilft.',accent:'#9aa4b2',tone:'#66717f',swatches:['#9aa4b2','#181b20','#0f1115'],sidebar:'#0f1115',panel:'#181b20',surface:'#22262d',surface2:'#292e36',border:'#353b45',text:'#f1f3f5',muted:'#9ca3ad'});
  Object.assign(V071012_PRESETS.emerald,{name:'Deep Forest',description:'Discord-artige Flächen mit tiefem Grün als ruhigem LS-Connect-Akzent.',accent:'#22c55e',tone:'#15803d',swatches:['#22c55e','#1b211d','#131614'],sidebar:'#111512',panel:'#1b211d',surface:'#252d27',surface2:'#2d3730',border:'#39433c',text:'#eef7f0',muted:'#a5b5a8'});
  Object.assign(V071012_PRESETS.sunset,{name:'Rose Night',description:'Weicher Night-Look mit edlem Rosé-/Magenta-Akzent statt greller Farbflächen.',accent:'#e879f9',tone:'#c05bd3',swatches:['#e879f9','#211c21','#171417'],sidebar:'#141116',panel:'#211c21',surface:'#2c2630',surface2:'#342d39',border:'#463c49',text:'#f8f1f8',muted:'#b9aebb'});
})();

(function v071013InstallStyles(){
  if(document.getElementById('v071013-styles'))return;
  const style=document.createElement('style');style.id='v071013-styles';style.textContent=`
    .v071012-design-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .v071012-design-card{grid-template-columns:112px minmax(0,1fr);min-height:96px;padding:12px;border-radius:16px;background:color-mix(in srgb,var(--panel-2) 94%,transparent);overflow:hidden}
    .v071012-design-card:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,0,0,.16)}
    .v071012-design-preview{height:72px;border-radius:10px;grid-template-columns:29px 1fr;background:var(--v071013-panel,#313338);box-shadow:inset 0 0 0 1px rgba(255,255,255,.035)}
    .v071012-design-preview aside{position:relative;background:var(--v071013-side,#1e1f22)}
    .v071012-design-preview aside:before{content:'';position:absolute;top:9px;left:8px;width:13px;height:13px;border-radius:50%;background:var(--v071013-accent,#5865f2);box-shadow:0 19px 0 color-mix(in srgb,var(--v071013-accent,#5865f2) 30%,#7b8190),0 38px 0 color-mix(in srgb,var(--v071013-accent,#5865f2) 16%,#6a7180)}
    .v071012-design-preview main{position:relative;padding:8px 7px 7px;background:var(--v071013-panel,#313338);display:block}
    .v071012-design-preview main:before{content:'';display:block;height:8px;width:72%;margin-bottom:8px;border-radius:3px;background:var(--v071013-surface2,#383a40)}
    .v071012-design-preview main:after{content:'';position:absolute;left:7px;right:7px;bottom:7px;height:11px;border-radius:4px;background:var(--v071013-surface,#2b2d31)}
    .v071012-design-preview i{display:block;height:7px!important;border-radius:4px!important;margin:0 0 5px;background:color-mix(in srgb,var(--v071013-text,#f2f3f5) 26%,transparent)!important}
    .v071012-design-preview i:nth-child(1){width:58%}.v071012-design-preview i:nth-child(2){width:80%}.v071012-design-preview i:nth-child(3){width:42%;background:var(--v071013-accent,#5865f2)!important}
    .v071012-design-copy strong{font-size:.96rem}.v071012-design-copy small{font-size:.76rem;line-height:1.42}
    .v071012-design-note{background:color-mix(in srgb,var(--panel-2) 90%,transparent)}

    html[data-ls-design]{--accent:var(--v071013-accent,#5865f2);--v071012-tone:var(--v071013-tone,#4752c4);--v071012-glow:color-mix(in srgb,var(--v071013-accent,#5865f2) 18%,transparent)}
    html[data-ls-design='classic']{--v071013-accent:#5865f2;--v071013-tone:#4752c4;--v071013-side:#1e1f22;--v071013-panel:#313338;--v071013-surface:#2b2d31;--v071013-surface2:#383a40;--v071013-border:#3f4147;--v071013-text:#f2f3f5;--v071013-muted:#b5bac1}
    html[data-ls-design='violet']{--v071013-accent:#5865f2;--v071013-tone:#7289da;--v071013-side:#17191d;--v071013-panel:#23262b;--v071013-surface:#2b2f36;--v071013-surface2:#333842;--v071013-border:#414650;--v071013-text:#f5f7fb;--v071013-muted:#aeb5c1}
    html[data-ls-design='midnight']{--v071013-accent:#7c8da6;--v071013-tone:#56657a;--v071013-side:#111214;--v071013-panel:#1a1d21;--v071013-surface:#23272e;--v071013-surface2:#2a3038;--v071013-border:#343b45;--v071013-text:#eef2f6;--v071013-muted:#9ca8b6}
    html[data-ls-design='graphite']{--v071013-accent:#9aa4b2;--v071013-tone:#66717f;--v071013-side:#0f1115;--v071013-panel:#181b20;--v071013-surface:#22262d;--v071013-surface2:#292e36;--v071013-border:#353b45;--v071013-text:#f1f3f5;--v071013-muted:#9ca3ad}
    html[data-ls-design='emerald']{--v071013-accent:#22c55e;--v071013-tone:#15803d;--v071013-side:#111512;--v071013-panel:#1b211d;--v071013-surface:#252d27;--v071013-surface2:#2d3730;--v071013-border:#39433c;--v071013-text:#eef7f0;--v071013-muted:#a5b5a8}
    html[data-ls-design='sunset']{--v071013-accent:#e879f9;--v071013-tone:#c05bd3;--v071013-side:#141116;--v071013-panel:#211c21;--v071013-surface:#2c2630;--v071013-surface2:#342d39;--v071013-border:#463c49;--v071013-text:#f8f1f8;--v071013-muted:#b9aebb}

    html[data-ls-design] body{background:var(--v071013-panel)!important;color:var(--v071013-text)}
    html[data-ls-design] .sidebar{background:var(--v071013-side)!important;border-color:var(--v071013-border)!important}
    html[data-ls-design] .conversation-panel,html[data-ls-design] .profile-panel{background:var(--v071013-panel)!important;border-color:var(--v071013-border)!important}
    html[data-ls-design] .modal,html[data-ls-design] .auth-card,html[data-ls-design] .settings-block,html[data-ls-design] .request-card,html[data-ls-design] .admin-channel-row,html[data-ls-design] .v078-own-contact-row,html[data-ls-design] .v078-notice-row{background:var(--v071013-surface)!important;border-color:var(--v071013-border)!important}
    html[data-ls-design] input,html[data-ls-design] textarea,html[data-ls-design] select{background:var(--v071013-side)!important;border-color:var(--v071013-border)!important;color:var(--v071013-text)!important}
    html[data-ls-design] input::placeholder,html[data-ls-design] textarea::placeholder{color:var(--v071013-muted)!important}
    html[data-ls-design] .chat-item:hover,html[data-ls-design] .channel-item:hover,html[data-ls-design] [data-character]:hover{background:var(--v071013-surface)!important}
    html[data-ls-design] .chat-item.active,html[data-ls-design] .channel-item.active,html[data-ls-design] [data-character].active{background:var(--v071013-surface2)!important}
    html[data-ls-design] .ghost-button,html[data-ls-design] .small-button,html[data-ls-design] .icon-button{border-color:var(--v071013-border)!important}
    html[data-ls-design] .brand-mark{background:linear-gradient(145deg,var(--v071013-accent),var(--v071013-tone))!important}
    html[data-ls-design] .primary-button,html[data-ls-design] .send-button{background:var(--v071013-accent)!important}
    html[data-ls-design='graphite'] .primary-button,html[data-ls-design='graphite'] .send-button{color:#111318!important}
    @media(max-width:700px){.v071012-design-grid{grid-template-columns:1fr}.v071012-design-card{grid-template-columns:96px minmax(0,1fr);min-height:86px}.v071012-design-preview{height:64px}}
  `;document.head.appendChild(style);
})();

if(typeof v071012DesignCard==='function'){
  v071012DesignCard=function v071012DesignCardV071013(key,preset){
    const sw=preset.swatches||[],side=preset.sidebar||sw[2]||'#1e1f22',panel=preset.panel||sw[1]||'#313338',surface=preset.surface||'#2b2d31',surface2=preset.surface2||'#383a40',accent=preset.accent||sw[0]||'#5865f2',text=preset.text||'#f2f3f5';
    return `<button type="button" class="v071012-design-card${v071012CurrentPreset()===key?' active':''}" data-v071012-preset="${key}"><span class="v071012-design-preview" style="--v071013-accent:${accent};--v071013-side:${side};--v071013-panel:${panel};--v071013-surface:${surface};--v071013-surface2:${surface2};--v071013-text:${text}"><aside></aside><main><i></i><i></i><i></i></main></span><span class="v071012-design-copy"><strong>${preset.name}</strong><small>${preset.description}</small></span></button>`;
  };
}

if(typeof v071012OpenDesignModal==='function'){
  v071012OpenDesignModal=function v071012OpenDesignModalV071013(){
    const order=['classic','violet','midnight','graphite','emerald','sunset'];
    const html=`<p class="v071012-design-intro">Wähle einen vollständigen Oberflächen-Stil. Die Vorschau zeigt Sidebar, Content-Fläche und Akzentwirkung – nicht nur eine Farbpalette.</p><div class="v071012-design-grid">${order.map(key=>v071012DesignCard(key,V071012_PRESETS[key])).join('')}</div><p class="v071012-design-note">Die Designs orientieren sich an modernen Discord-artigen Oberflächen. Deine Auswahl wird wie bisher pro Account gespeichert.</p>`;
    if(typeof openModal==='function')openModal('Design auswählen',html);else if(typeof els!=='undefined'&&els.modalContent){document.getElementById('modalTitle').textContent='Design auswählen';els.modalContent.innerHTML=html;document.getElementById('modalBackdrop')?.classList.remove('hidden');}
    const root=(typeof els!=='undefined'&&els.modalContent)||document.getElementById('modalContent');
    root?.querySelectorAll('[data-v071012-preset]').forEach(button=>button.addEventListener('click',async()=>{
      const preset=v071012ApplyPreset(button.dataset.v071012Preset);root.querySelectorAll('[data-v071012-preset]').forEach(x=>x.classList.toggle('active',x===button));
      try{if(typeof db!=='undefined'&&db&&state?.mode==='online'){const {error}=await db.rpc('set_design_preset_v071012',{p_preset:preset});if(error)throw error;}v071012Toast(`Design „${V071012_PRESETS[preset].name}“ aktiviert.`,'success');}
      catch(error){console.warn('[LS Connect] Design konnte nicht mit dem Account synchronisiert werden.',error);v071012Toast('Design lokal gespeichert; Account-Synchronisierung fehlgeschlagen.','info');}
    }));
  };
}

if(typeof V07_LOCAL_CHANGELOG!=='undefined'&&!V07_LOCAL_CHANGELOG.some(x=>x.version===LS_CONNECT_V071013_VERSION)){
  V07_LOCAL_CHANGELOG.unshift({version:LS_CONNECT_V071013_VERSION,title:'Discord-inspirierte Design-Presets',items:['Sechs Presets als vollständige Oberflächen-Stile statt reiner Farbpaletten','Discord Classic, Blurple Night, Night Slate, Graphite, Deep Forest und Rose Night','Neue Mini-UI-Vorschauen mit Sidebar, Content-Fläche und Akzentwirkung','Stärkere Trennung von Sidebar, Panels, Karten, Eingaben und aktiven Elementen']});
}
console.info('[LS Connect] v0.7.10.13 Discord-inspired preset refresh active');

/* rollback cache-buster: v0.7.11 online bridge intentionally removed */
