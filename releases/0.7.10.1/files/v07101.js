/* LS Connect v0.7.10.1 – compatibility/layout hotfix */
const LS_CONNECT_V07101_VERSION = '0.7.10.1';

(function v07101Styles(){
  if(document.getElementById('v07101-styles')) return;
  const s=document.createElement('style');
  s.id='v07101-styles';
  s.textContent=`
    #v079CompatibilityWarning.v07101-compat-warning{
      position:fixed!important;
      top:max(12px,env(safe-area-inset-top));
      left:50%!important;
      transform:translateX(-50%);
      z-index:1200;
      width:min(620px,calc(100vw - 24px));
      box-sizing:border-box;
      padding:10px 14px;
      border:1px solid #f59e0b;
      border-radius:12px;
      background:color-mix(in srgb,var(--panel) 96%,#f59e0b 4%);
      color:var(--text);
      box-shadow:0 14px 40px rgba(0,0,0,.28);
      pointer-events:none;
    }
    #v079CompatibilityWarning.v07101-compat-warning[data-critical="1"]{
      border-color:#ef4444;
      background:color-mix(in srgb,var(--panel) 95%,#ef4444 5%);
    }
    @media(max-width:700px){
      #v079CompatibilityWarning.v07101-compat-warning{
        top:max(8px,env(safe-area-inset-top));
        width:calc(100vw - 16px);
        font-size:.82rem;
      }
    }
  `;
  document.head.appendChild(s);
})();

async function v07101CurrentAppVersion(){
  try{
    const response=await fetch('./version.json?v=07101',{cache:'no-store'});
    if(response.ok){
      const data=await response.json();
      if(data?.version){
        if(typeof state!=='undefined') state.v0795AppVersion=String(data.version);
        return String(data.version);
      }
    }
  }catch{}
  return (typeof state!=='undefined'&&state.v0795AppVersion) ||
         (typeof LS_CONNECT_V0710_VERSION!=='undefined'&&LS_CONNECT_V0710_VERSION) ||
         LS_CONNECT_V07101_VERSION;
}

function v07101RemoveBrokenWarning(){
  const box=document.getElementById('v079CompatibilityWarning');
  if(box && !box.classList.contains('v07101-compat-warning')) box.remove();
}

function v07101InstallCompatibilityWarning(message,critical){
  let box=document.getElementById('v079CompatibilityWarning');
  if(!box){
    box=document.createElement('div');
    box.id='v079CompatibilityWarning';
    document.body.appendChild(box);
  }else if(box.parentElement!==document.body){
    box.remove();
    document.body.appendChild(box);
  }
  box.className='v079-runtime-warning v07101-compat-warning';
  box.textContent=message;
  box.dataset.critical=critical?'1':'0';
  return box;
}

if(typeof v079InstallCompatibilityWarning==='function'){
  v079InstallCompatibilityWarning=v07101InstallCompatibilityWarning;
}

if(typeof v079CheckBackendCompatibility==='function'){
  v079CheckBackendCompatibility=async function v079CheckBackendCompatibilityV07101({silent=false}={}){
    if(typeof db==='undefined'||!db)return null;
    try{
      const [{data,error},currentVersion]=await Promise.all([
        db.rpc('ls_connect_backend_compat_v079'),
        v07101CurrentAppVersion()
      ]);
      if(error)throw error;

      const compat=data||{};
      state.backendCompatV079=compat;

      const minimum=compat.minimum_client_version||'0';
      const recommended=compat.recommended_client_version||currentVersion;
      const supported=Array.isArray(compat.supported_clients)?compat.supported_clients:[];
      const runtime=state.clientRuntimeV079?.client||'online';

      if(supported.length&&!supported.includes(runtime)){
        throw new Error(`Der Client-Typ "${runtime}" wird vom Backend nicht unterstützt.`);
      }

      if(typeof v079CompareVersions!=='function')return compat;

      if(v079CompareVersions(currentVersion,minimum)<0){
        const msg=`LS Connect ${currentVersion} ist für das aktuelle Backend zu alt. Mindestversion: ${minimum}.`;
        if(typeof showToast==='function')showToast(msg,'error');
        v07101InstallCompatibilityWarning(msg,true);
      }else if(v079CompareVersions(currentVersion,recommended)<0){
        const msg=`Eine neuere LS-Connect-Version (${recommended}) wird für dieses Backend empfohlen.`;
        if(!silent&&typeof showToast==='function')showToast(msg,'info');
        v07101InstallCompatibilityWarning(msg,false);
      }else{
        document.getElementById('v079CompatibilityWarning')?.remove();
      }
      return compat;
    }catch(error){
      if(!silent)console.warn('[LS Connect] Backend-Kompatibilität konnte nicht geprüft werden.',error);
      return null;
    }
  };
}

(async function v07101RepairExistingState(){
  v07101RemoveBrokenWarning();
  await v07101CurrentAppVersion();
  if(typeof v079CheckBackendCompatibility==='function'){
    setTimeout(()=>v079CheckBackendCompatibility({silent:true}),50);
    setTimeout(()=>v079CheckBackendCompatibility({silent:true}),700);
  }
})();

const v07101ChangelogTarget=
  typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:
  (typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v07101ChangelogTarget&&!v07101ChangelogTarget.some(x=>x.version===LS_CONNECT_V07101_VERSION)){
  v07101ChangelogTarget.unshift({
    version:LS_CONNECT_V07101_VERSION,
    title:'Kompatibilitäts- & Layout-Hotfix',
    items:[
      'Backend-Kompatibilitätsprüfung verwendet die tatsächlich installierte App-Version',
      'Falsche Updateempfehlung bei bereits installiertem v0.7.10 behoben',
      'Kompatibilitätswarnungen verändern das Hauptlayout nicht mehr',
      'Zerrissene Desktop-Chatansicht durch zusätzliche Grid-Spalte behoben'
    ]
  });
}
console.info('[LS Connect] v0.7.10.1 compatibility/layout hotfix active');
