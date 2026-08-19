/* LS Connect v0.7.9 – Hybrid Online/Desktop compatibility layer */
const LS_CONNECT_V079_VERSION = '0.7.9';

Object.assign(state, {
  clientRuntimeV079: {
    client: 'online',
    launcherVersion: null,
    serverVersion: null,
    detected: false
  },
  backendCompatV079: null
});

(function v079Styles(){
  if (document.getElementById('v079-styles')) return;
  const s=document.createElement('style');
  s.id='v079-styles';
  s.textContent=`
    .v079-runtime-card{display:grid;gap:7px;padding:12px;border:1px solid var(--border);border-radius:12px;background:var(--panel-2)}
    .v079-runtime-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
    .v079-runtime-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 8px;border:1px solid var(--border);border-radius:999px;font-size:.78rem;font-weight:800}
    .v079-runtime-dot{width:8px;height:8px;border-radius:50%;background:#22c55e}
    .v079-runtime-warning{padding:10px 12px;border:1px solid #f59e0b;border-radius:10px;background:rgba(245,158,11,.08)}
  `;
  document.head.appendChild(s);
})();

function v079Semver(value){
  return String(value||'0').split('.').map(x=>Number.parseInt(x,10)||0);
}
function v079CompareVersions(a,b){
  const aa=v079Semver(a),bb=v079Semver(b),n=Math.max(aa.length,bb.length);
  for(let i=0;i<n;i++){const av=aa[i]||0,bv=bb[i]||0;if(av>bv)return 1;if(av<bv)return -1;}
  return 0;
}
function v079RuntimeLabel(){
  return state.clientRuntimeV079?.client==='desktop'?'Desktop/BAT':'Online';
}

async function v079DetectRuntime(){
  const fallback={client:'online',launcherVersion:null,serverVersion:null,detected:true};
  const localHost=['127.0.0.1','localhost','::1'].includes(location.hostname);
  if(!localHost){
    state.clientRuntimeV079=fallback;
    document.documentElement.dataset.lsRuntime='online';
    return fallback;
  }
  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),1200);
    const response=await fetch('/__lsconnect/runtime',{cache:'no-store',signal:controller.signal});
    clearTimeout(timer);
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    if(data?.client!=='desktop')throw new Error('Ungültiger Desktop-Runtime-Handshake');
    const runtime={
      client:'desktop',
      launcherVersion:data.launcher_version||null,
      serverVersion:data.server_version||null,
      detected:true
    };
    state.clientRuntimeV079=runtime;
    document.documentElement.dataset.lsRuntime='desktop';
    return runtime;
  }catch(error){
    state.clientRuntimeV079=fallback;
    document.documentElement.dataset.lsRuntime='online';
    return fallback;
  }
}

async function v079CheckBackendCompatibility({silent=false}={}){
  if(typeof db==='undefined'||!db)return null;
  try{
    const {data,error}=await db.rpc('ls_connect_backend_compat_v079');
    if(error)throw error;
    const compat=data||{};
    state.backendCompatV079=compat;
    const minimum=compat.minimum_client_version||'0';
    const recommended=compat.recommended_client_version||LS_CONNECT_V079_VERSION;
    const supported=Array.isArray(compat.supported_clients)?compat.supported_clients:[];
    const runtime=state.clientRuntimeV079?.client||'online';
    if(supported.length&&!supported.includes(runtime)){
      throw new Error(`Der Client-Typ "${runtime}" wird vom Backend nicht unterstützt.`);
    }
    if(v079CompareVersions(LS_CONNECT_V079_VERSION,minimum)<0){
      const msg=`LS Connect ${LS_CONNECT_V079_VERSION} ist für das aktuelle Backend zu alt. Mindestversion: ${minimum}.`;
      if(typeof showToast==='function')showToast(msg,'error');
      v079InstallCompatibilityWarning(msg,true);
    }else if(v079CompareVersions(LS_CONNECT_V079_VERSION,recommended)<0){
      const msg=`Eine neuere LS-Connect-Version (${recommended}) wird für dieses Backend empfohlen.`;
      if(!silent&&typeof showToast==='function')showToast(msg,'info');
      v079InstallCompatibilityWarning(msg,false);
    }else{
      document.getElementById('v079CompatibilityWarning')?.remove();
    }
    return compat;
  }catch(error){
    if(!silent)console.warn('[LS Connect] Backend-Kompatibilität konnte nicht geprüft werden.',error);
    return null;
  }
}

function v079InstallCompatibilityWarning(message,critical){
  let box=document.getElementById('v079CompatibilityWarning');
  if(!box){
    box=document.createElement('div');
    box.id='v079CompatibilityWarning';
    box.className='v079-runtime-warning';
    const target=document.querySelector('.main-panel,.chat-panel,#app')||document.body;
    target.prepend(box);
  }
  box.textContent=message;
  box.dataset.critical=critical?'1':'0';
}

function v079RuntimeCardHtml(){
  const rt=state.clientRuntimeV079||{};
  const compat=state.backendCompatV079||{};
  const backend=compat.backend_version||'nicht geprüft';
  const contract=compat.api_contract??'—';
  return `<section id="v079RuntimeCard" class="v079-runtime-card">
    <div class="v079-runtime-row"><strong>Client-Modus</strong><span class="v079-runtime-badge"><span class="v079-runtime-dot"></span>${v079RuntimeLabel()}</span></div>
    <div class="v079-runtime-row"><span>Client-Version</span><strong>${LS_CONNECT_V079_VERSION}</strong></div>
    <div class="v079-runtime-row"><span>Backend-Version</span><strong>${escapeHtml(String(backend))}</strong></div>
    <div class="v079-runtime-row"><span>API-Vertrag</span><strong>${escapeHtml(String(contract))}</strong></div>
    ${rt.client==='desktop'?`<div class="v079-runtime-row"><span>Desktop-Server</span><strong>${escapeHtml(String(rt.serverVersion||'0.7.9'))}</strong></div>`:''}
  </section>`;
}

function v079InjectRuntimeCard(){
  if(typeof els==='undefined'||!els.modalContent)return;
  const root=els.modalContent;
  root.querySelector('#v079RuntimeCard')?.remove();
  const host=root.querySelector('.settings-block')||root;
  host.insertAdjacentHTML('beforeend',v079RuntimeCardHtml());
}

if(typeof openAccountModal==='function'){
  const v079AccountBase=openAccountModal;
  openAccountModal=async function openAccountModalV079(){
    const result=await v079AccountBase.apply(this,arguments);
    await v079CheckBackendCompatibility({silent:true});
    v079InjectRuntimeCard();
    return result;
  };
}

if(typeof startOnlineSession==='function'){
  const v079StartOnlineBase=startOnlineSession;
  startOnlineSession=async function startOnlineSessionV079(){
    const result=await v079StartOnlineBase.apply(this,arguments);
    await v079CheckBackendCompatibility({silent:true});
    return result;
  };
}

(async function v079Bootstrap(){
  await v079DetectRuntime();
  let tries=0;
  const check=async()=>{
    tries++;
    if(typeof db!=='undefined'&&db){await v079CheckBackendCompatibility({silent:true});return;}
    if(tries<20)setTimeout(check,250);
  };
  check();
})();

if(typeof v07ApplyRemoteUpdate==='function'){
  const v079ApplyUpdateBase=v07ApplyRemoteUpdate;
  v07ApplyRemoteUpdate=async function v07ApplyRemoteUpdateV079(){
    const runtime=state.clientRuntimeV079?.detected?state.clientRuntimeV079:await v079DetectRuntime();
    if(runtime.client==='desktop'){
      return v079ApplyUpdateBase.apply(this,arguments);
    }
    if(typeof showToast==='function')showToast('Die Online-Version wird zentral bereitgestellt. LS Connect wird neu geladen.','info');
    try{
      if('serviceWorker' in navigator){
        const regs=await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r=>r.update().catch(()=>null)));
      }
    }catch{}
    setTimeout(()=>location.reload(),500);
  };
}

const v079ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v079ChangelogTarget&&!v079ChangelogTarget.some(x=>x.version===LS_CONNECT_V079_VERSION)){
  v079ChangelogTarget.unshift({
    version:LS_CONNECT_V079_VERSION,
    title:'Hybrid Online + Desktop/BAT',
    items:[
      'Online- und Desktop/BAT-Client verwenden denselben Supabase-Backendstand',
      'Automatische Erkennung zwischen Browser/PWA und lokalem Desktop-Server',
      'Gemeinsame Client-/Backend-Kompatibilitätsprüfung mit API-Vertrag',
      'Desktop-Runtime meldet ihren Status über einen lokalen Health-/Runtime-Endpunkt',
      'Desktop-Paket erhält lokalen PowerShell-Server und eigenen SHA-256-Updater'
    ]
  });
}
console.info('[LS Connect] v0.7.9 hybrid compatibility active');
