/* LS Connect v0.7.10.12 – session choice & design presets */
const LS_CONNECT_V071012_VERSION='0.7.10.12';
const V071012_REMEMBER_KEY='ls-connect:remember-login:v1';
const V071012_SESSION_MARKER='ls-connect:ephemeral-session:v1';
const V071012_DESIGN_KEY='ls-connect:design-preset:v1';
const V071012_AUTH_STORAGE_KEYS=['sb-dzetqgphtswsxksobvxo-auth-token'];
const V071012_PRESETS={
  classic:{name:'Classic',description:'Der bekannte LS-Connect-Look.',accent:'#22c55e',tone:'#22c55e',swatches:['#22c55e','#0f172a','#1e293b']},
  midnight:{name:'Midnight',description:'Kühles Blau mit ruhiger Nacht-Atmosphäre.',accent:'#38bdf8',tone:'#2563eb',swatches:['#38bdf8','#0b1630','#172554']},
  emerald:{name:'Emerald',description:'Satter Smaragd-Look mit kräftigem Grün.',accent:'#10b981',tone:'#059669',swatches:['#10b981','#052e2b','#064e3b']},
  violet:{name:'Violet',description:'Moderner Violett-Look mit weichen Akzenten.',accent:'#a78bfa',tone:'#7c3aed',swatches:['#a78bfa','#2e1065','#4c1d95']},
  graphite:{name:'Graphite',description:'Zurückhaltend, neutral und technisch.',accent:'#94a3b8',tone:'#64748b',swatches:['#cbd5e1','#1e293b','#334155']},
  sunset:{name:'Sunset',description:'Warme Orange- und Rosé-Akzente.',accent:'#fb7185',tone:'#f97316',swatches:['#fb7185','#f97316','#7c2d12']}
};

(function v071012PreBootSessionGuard(){
  try{
    const remember=localStorage.getItem(V071012_REMEMBER_KEY);
    const sameBrowserSession=sessionStorage.getItem(V071012_SESSION_MARKER)==='1';
    if(remember==='0'&&!sameBrowserSession){
      const keys=new Set(V071012_AUTH_STORAGE_KEYS);
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i)||'';
        if(/^sb-dzetqgphtswsxksobvxo-auth-token(?:$|[-:])/i.test(key))keys.add(key);
      }
      keys.forEach(key=>localStorage.removeItem(key));
    }
  }catch(error){console.warn('[LS Connect] Session-Vorbereitung fehlgeschlagen.',error);}
})();

(function v071012InstallStyles(){
  if(document.getElementById('v071012-styles'))return;
  const style=document.createElement('style');style.id='v071012-styles';style.textContent=`
    .v071012-remember{display:flex!important;align-items:flex-start;gap:9px;margin:-2px 0 2px;color:var(--muted);font-size:.78rem;line-height:1.35;cursor:pointer}
    .v071012-remember input{width:17px!important;height:17px!important;min-height:0!important;margin:1px 0 0!important;accent-color:var(--accent);flex:0 0 17px}
    .v071012-remember strong{display:block;color:var(--text);font-size:.82rem;margin-bottom:1px}.v071012-remember small{display:block;color:var(--muted)}
    .v071012-design-intro{margin:0 0 13px;color:var(--muted);line-height:1.5}
    .v071012-design-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .v071012-design-card{position:relative;display:grid;grid-template-columns:76px minmax(0,1fr);align-items:center;gap:12px;width:100%;padding:11px;border:1px solid var(--border);border-radius:14px;background:var(--panel-2);color:var(--text);text-align:left;cursor:pointer;transition:.16s ease}
    .v071012-design-card:hover{border-color:color-mix(in srgb,var(--accent) 42%,var(--border));transform:translateY(-1px)}
    .v071012-design-card.active{border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 16%,transparent)}
    .v071012-design-card.active:after{content:'✓';position:absolute;right:10px;top:9px;display:grid;place-items:center;width:22px;height:22px;border-radius:999px;background:var(--accent);color:#06111d;font-weight:1000}
    .v071012-design-preview{height:58px;border:1px solid color-mix(in srgb,var(--border) 80%,transparent);border-radius:11px;overflow:hidden;display:grid;grid-template-columns:22px 1fr;background:var(--panel)}
    .v071012-design-preview aside{background:var(--v071012-preview-side,#132033)}.v071012-design-preview main{padding:7px 6px;display:grid;gap:5px;background:linear-gradient(145deg,var(--v071012-preview-main,#111827),color-mix(in srgb,var(--v071012-preview-tone,#22c55e) 14%,var(--v071012-preview-main,#111827)))}
    .v071012-design-preview i{display:block;height:7px;border-radius:999px;background:color-mix(in srgb,var(--v071012-preview-tone,#22c55e) 78%,white 8%)}.v071012-design-preview i:nth-child(2){width:72%;background:color-mix(in srgb,var(--v071012-preview-tone,#22c55e) 28%,#64748b)}.v071012-design-preview i:nth-child(3){width:55%;background:color-mix(in srgb,var(--v071012-preview-tone,#22c55e) 18%,#475569)}
    .v071012-design-copy{min-width:0;padding-right:20px}.v071012-design-copy strong{display:block;margin-bottom:3px}.v071012-design-copy small{display:block;color:var(--muted);line-height:1.35}
    .v071012-design-note{margin:13px 0 0;padding:10px 11px;border:1px solid var(--border);border-radius:11px;background:var(--panel-2);color:var(--muted);font-size:.78rem;line-height:1.4}

    html[data-ls-design='midnight']{--accent:#38bdf8;--v071012-tone:#2563eb;--v071012-glow:rgba(37,99,235,.18)}
    html[data-ls-design='emerald']{--accent:#10b981;--v071012-tone:#059669;--v071012-glow:rgba(5,150,105,.18)}
    html[data-ls-design='violet']{--accent:#a78bfa;--v071012-tone:#7c3aed;--v071012-glow:rgba(124,58,237,.19)}
    html[data-ls-design='graphite']{--accent:#94a3b8;--v071012-tone:#64748b;--v071012-glow:rgba(100,116,139,.14)}
    html[data-ls-design='sunset']{--accent:#fb7185;--v071012-tone:#f97316;--v071012-glow:rgba(249,115,22,.17)}
    html[data-ls-design]:not([data-ls-design='classic']) body{background-image:radial-gradient(circle at 10% 0%,var(--v071012-glow,transparent),transparent 36%),radial-gradient(circle at 95% 100%,color-mix(in srgb,var(--v071012-tone) 12%,transparent),transparent 34%);background-attachment:fixed}
    html[data-ls-design]:not([data-ls-design='classic']) .sidebar,
    html[data-ls-design]:not([data-ls-design='classic']) .conversation-panel,
    html[data-ls-design]:not([data-ls-design='classic']) .profile-panel,
    html[data-ls-design]:not([data-ls-design='classic']) .modal,
    html[data-ls-design]:not([data-ls-design='classic']) .auth-card{background-image:linear-gradient(145deg,color-mix(in srgb,var(--v071012-tone) 4%,transparent),transparent 42%)}
    html[data-ls-design='midnight'] .brand-mark,html[data-ls-design='emerald'] .brand-mark,html[data-ls-design='violet'] .brand-mark,html[data-ls-design='sunset'] .brand-mark{background:linear-gradient(145deg,var(--accent),var(--v071012-tone))!important}
    html[data-ls-design='graphite'] .brand-mark{background:linear-gradient(145deg,#cbd5e1,#64748b)!important;color:#0f172a!important}
    html[data-ls-design='violet'] .round-button,html[data-ls-design='sunset'] .round-button{box-shadow:0 8px 28px var(--v071012-glow)}
    html[data-ls-design='graphite'] .primary-button,html[data-ls-design='graphite'] .send-button{color:#0f172a!important}

    @media(max-width:700px){.v071012-design-grid{grid-template-columns:1fr}.v071012-design-card{grid-template-columns:68px minmax(0,1fr)}.v071012-design-preview{height:52px}}
  `;document.head.appendChild(style);
})();

function v071012Toast(message,type='info'){if(typeof showToast==='function')showToast(message,type);else console.info('[LS Connect]',message);}
function v071012ValidPreset(value){const key=String(value||'').toLowerCase();return V071012_PRESETS[key]?key:'classic';}
function v071012CurrentPreset(){return v071012ValidPreset(document.documentElement.dataset.lsDesign||localStorage.getItem(V071012_DESIGN_KEY)||'classic');}
function v071012ApplyPreset(value,{saveLocal=true}={}){
  const preset=v071012ValidPreset(value);document.documentElement.dataset.lsDesign=preset;
  if(saveLocal){try{localStorage.setItem(V071012_DESIGN_KEY,preset);}catch{}}
  document.querySelectorAll('[data-v071012-preset]').forEach(card=>card.classList.toggle('active',card.dataset.v071012Preset===preset));
  return preset;
}
v071012ApplyPreset(localStorage.getItem(V071012_DESIGN_KEY)||'classic');

function v071012ClearStoredAuth(){
  try{
    for(const key of Object.keys(localStorage))if(/^sb-dzetqgphtswsxksobvxo-auth-token(?:$|[-:])/i.test(key))localStorage.removeItem(key);
  }catch{}
}
function v071012InstallRememberLogin(){
  const form=document.getElementById('authForm'),password=document.getElementById('authPassword');
  if(!form||!password||document.getElementById('rememberLoginV071012'))return false;
  const label=password.closest('label');if(!label)return false;
  const row=document.createElement('label');row.id='rememberLoginRowV071012';row.className='v071012-remember';
  const remembered=localStorage.getItem(V071012_REMEMBER_KEY)!=='0';
  row.innerHTML=`<input id="rememberLoginV071012" type="checkbox" ${remembered?'checked':''}><span><strong>Angemeldet bleiben</strong><small>Auf diesem Gerät beim nächsten Start automatisch anmelden.</small></span>`;
  label.insertAdjacentElement('afterend',row);
  const checkbox=row.querySelector('input');
  const syncVisibility=()=>{const isLogin=document.getElementById('loginTab')?.classList.contains('active')!==false;row.classList.toggle('hidden',!isLogin);};
  document.getElementById('loginTab')?.addEventListener('click',()=>setTimeout(syncVisibility,0));
  document.getElementById('registerTab')?.addEventListener('click',()=>setTimeout(syncVisibility,0));
  syncVisibility();
  checkbox.addEventListener('change',()=>{try{localStorage.setItem(V071012_REMEMBER_KEY,checkbox.checked?'1':'0');if(checkbox.checked)sessionStorage.removeItem(V071012_SESSION_MARKER);else sessionStorage.setItem(V071012_SESSION_MARKER,'1');}catch{}});
  form.addEventListener('submit',()=>{
    const isLogin=document.getElementById('loginTab')?.classList.contains('active')!==false;if(!isLogin)return;
    try{localStorage.setItem(V071012_REMEMBER_KEY,checkbox.checked?'1':'0');if(checkbox.checked)sessionStorage.removeItem(V071012_SESSION_MARKER);else sessionStorage.setItem(V071012_SESSION_MARKER,'1');}catch{}
  },true);
  return true;
}

function v071012DesignCard(key,preset){
  const sw=preset.swatches||[];
  return `<button type="button" class="v071012-design-card${v071012CurrentPreset()===key?' active':''}" data-v071012-preset="${key}">
    <span class="v071012-design-preview" style="--v071012-preview-tone:${sw[0]||preset.accent};--v071012-preview-main:${sw[1]||'#111827'};--v071012-preview-side:${sw[2]||'#1e293b'}"><aside></aside><main><i></i><i></i><i></i></main></span>
    <span class="v071012-design-copy"><strong>${preset.name}</strong><small>${preset.description}</small></span>
  </button>`;
}
function v071012OpenDesignModal(){
  const html=`<p class="v071012-design-intro">Wähle einen vorgefertigten LS-Connect-Stil. <strong>Hell/Dunkel bleibt davon unabhängig</strong> und kann weiterhin separat gewechselt werden.</p><div class="v071012-design-grid">${Object.entries(V071012_PRESETS).map(([key,p])=>v071012DesignCard(key,p)).join('')}</div><p class="v071012-design-note">Das gewählte Design wird für deinen Account gespeichert. Classic stellt den bisherigen LS-Connect-Look wieder her.</p>`;
  if(typeof openModal==='function')openModal('Design auswählen',html);else if(typeof els!=='undefined'&&els.modalContent){document.getElementById('modalTitle').textContent='Design auswählen';els.modalContent.innerHTML=html;document.getElementById('modalBackdrop')?.classList.remove('hidden');}
  const root=(typeof els!=='undefined'&&els.modalContent)||document.getElementById('modalContent');
  root?.querySelectorAll('[data-v071012-preset]').forEach(button=>button.addEventListener('click',async()=>{
    const preset=v071012ApplyPreset(button.dataset.v071012Preset);root.querySelectorAll('[data-v071012-preset]').forEach(x=>x.classList.toggle('active',x===button));
    try{
      if(typeof db!=='undefined'&&db&&state?.mode==='online'){
        const {error}=await db.rpc('set_design_preset_v071012',{p_preset:preset});if(error)throw error;
      }
      v071012Toast(`Design „${V071012_PRESETS[preset].name}“ aktiviert.`,'success');
    }catch(error){console.warn('[LS Connect] Design konnte nicht mit dem Account synchronisiert werden.',error);v071012Toast('Design lokal gespeichert; Account-Synchronisierung fehlgeschlagen.','info');}
  }));
}
function v071012InstallDesignButton(){
  const theme=document.getElementById('themeButton');if(!theme)return false;
  if(theme.lastElementChild&&theme.querySelector('.v0795-quick-icon'))theme.lastElementChild.textContent='Hell / Dunkel wechseln';else if(!theme.querySelector('.v0795-quick-icon'))theme.textContent='◐ Hell / Dunkel wechseln';
  if(document.getElementById('designPresetButtonV071012'))return true;
  const button=document.createElement('button');button.id='designPresetButtonV071012';button.type='button';button.className='ghost-button';
  if(theme.querySelector('.v0795-quick-icon'))button.innerHTML='<span class="v0795-quick-icon" aria-hidden="true">✦</span><span>Design auswählen</span>';else button.textContent='✦ Design auswählen';
  theme.insertAdjacentElement('afterend',button);button.addEventListener('click',v071012OpenDesignModal);return true;
}

let v071012ServerPresetLoaded=false;
async function v071012LoadServerPreset(){
  if(v071012ServerPresetLoaded||typeof db==='undefined'||!db||state?.mode!=='online')return false;
  try{
    const {data,error}=await db.rpc('my_design_preset_v071012');if(error)throw error;
    const preset=v071012ValidPreset(data);v071012ApplyPreset(preset);v071012ServerPresetLoaded=true;return true;
  }catch(error){console.warn('[LS Connect] Design-Preset konnte nicht geladen werden.',error);return false;}
}

if(typeof selectCharacter==='function'){
  const v071012SelectCharacterBase=selectCharacter;
  selectCharacter=async function selectCharacterV071012(){const result=await v071012SelectCharacterBase.apply(this,arguments);setTimeout(v071012LoadServerPreset,50);return result;};
}

// Explicit logout should always return to a clean login state next time.
document.addEventListener('click',event=>{
  const button=event.target?.closest?.('button,[role="button"]');if(!button)return;
  if(/^abmelden$/i.test(String(button.textContent||'').trim())||/logout|signout/i.test(String(button.id||''))){
    try{localStorage.removeItem(V071012_REMEMBER_KEY);sessionStorage.removeItem(V071012_SESSION_MARKER);}catch{}
  }
},true);

let v071012InstallTries=0;
const v071012InstallTimer=setInterval(()=>{
  v071012InstallTries++;
  const authReady=v071012InstallRememberLogin();
  const designReady=v071012InstallDesignButton();
  v071012LoadServerPreset();
  if(v071012InstallTries>30||(authReady&&designReady&&v071012ServerPresetLoaded))clearInterval(v071012InstallTimer);
},250);
setTimeout(()=>{v071012InstallRememberLogin();v071012InstallDesignButton();v071012LoadServerPreset();},50);

const v071012ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v071012ChangelogTarget&&!v071012ChangelogTarget.some(x=>x.version===LS_CONNECT_V071012_VERSION))v071012ChangelogTarget.unshift({
  version:LS_CONNECT_V071012_VERSION,
  title:'Login-Sitzung & Design-Presets',
  items:[
    'Neue Option Angemeldet bleiben auf der Login-Seite',
    'Ohne Angemeldet bleiben wird die gespeicherte Sitzung beim nächsten echten Browserstart verworfen',
    'Sechs vorgefertigte Designs: Classic, Midnight, Emerald, Violet, Graphite und Sunset',
    'Design-Presets funktionieren zusätzlich zum bestehenden Hell-/Dunkel-Modus und werden pro Account gespeichert'
  ]
});
console.info('[LS Connect] v0.7.10.12 session choice & design presets active');
