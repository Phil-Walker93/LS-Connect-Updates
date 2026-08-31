/* LS Connect v0.7.10.14 – promoted release metadata bridge */
(function v071014ReleaseMetadataBridge(){
  if(window.__LS_CONNECT_RELEASE_META_V071014__)return;
  window.__LS_CONNECT_RELEASE_META_V071014__=true;

  const TEST_PARAM='ls-test';
  let currentRelease=null;
  let runtimeCardBase=null;

  const isTestMode=()=>new URLSearchParams(location.search).get(TEST_PARAM)==='1';
  const runtimeVersion=()=>String(currentRelease?.version||window.__LS_CONNECT_RUNTIME_VERSION__||window.__LS_CONNECT_DYNAMIC_RELEASE__||window.__LS_CONNECT_ONLINE_VERSION__||'0.7.10.13');
  const escapeVersion=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function changelogTarget(){
    if(typeof V07_LOCAL_CHANGELOG!=='undefined'&&Array.isArray(V07_LOCAL_CHANGELOG))return V07_LOCAL_CHANGELOG;
    if(typeof V076_LOCAL_CHANGELOG!=='undefined'&&Array.isArray(V076_LOCAL_CHANGELOG))return V076_LOCAL_CHANGELOG;
    return null;
  }

  function releaseChangelogEntry(release){
    const version=String(release?.version||'').trim();
    const raw=String(release?.notes||'').trim();
    let title=`Update v${version}`;
    let body=raw;

    if(raw.includes(':')){
      const index=raw.indexOf(':');
      const candidateTitle=raw.slice(0,index).trim().replace(/^v?\d+(?:\.\d+){2,3}(?:\s+r\d+)?\s*[-–—]?\s*/i,'');
      if(candidateTitle&&candidateTitle.length<=90){
        title=candidateTitle;
        body=raw.slice(index+1).trim();
      }
    }

    const items=(body||'').split(/\s*;\s*|\s*\n+\s*/).map(x=>x.trim()).filter(Boolean).slice(0,8);
    if(!items.length)items.push(`Version v${version} wurde über das Release Center freigegeben.`);
    return {version,title,items,_releaseCenter:true};
  }

  function registerStableChangelog(release){
    if(!release||release.channel!=='stable')return;
    const target=changelogTarget();
    if(!target)return;
    const version=String(release.version||'');
    const entry=releaseChangelogEntry(release);
    const index=target.findIndex(x=>String(x?.version||'')===version);
    if(index<0){target.unshift(entry);return;}
    if(target[index]?._releaseCenter)target[index]=entry;
  }

  function updateKnownVersionElements(version){
    const selectors=['[data-ls-version]','[data-version-label]','#appVersion','#currentVersion','#versionBadge','#clientVersion','.app-version','.version-label'];
    document.querySelectorAll(selectors.join(',')).forEach(el=>{
      if(el.closest?.('.changelog,.changelog-list,[data-changelog]'))return;
      const text=String(el.textContent||'').trim();
      if(!text||/^v?\d+(?:\.\d+){2,3}$/i.test(text))el.textContent=`v${version}`;
      else if(/^(?:client-?)?version\s*[:\-]?\s*v?\d+(?:\.\d+){2,3}$/i.test(text))el.textContent=`Version v${version}`;
    });
  }

  function patchRuntimeCard(){
    if(typeof v079RuntimeCardHtml==='function'&&!runtimeCardBase){
      runtimeCardBase=v079RuntimeCardHtml;
      v079RuntimeCardHtml=function v079RuntimeCardHtmlReleaseAware(){
        const html=runtimeCardBase.apply(this,arguments);
        const version=escapeVersion(runtimeVersion());
        return String(html).replace(/(<span>Client-Version<\/span><strong>)[^<]*(<\/strong>)/,`$1${version}$2`);
      };
    }

    const card=document.getElementById('v079RuntimeCard');
    if(card){
      [...card.querySelectorAll('.v079-runtime-row')].forEach(row=>{
        const label=row.querySelector('span')?.textContent?.trim();
        if(label==='Client-Version'){
          const strong=row.querySelector('strong');
          if(strong)strong.textContent=runtimeVersion();
        }
      });
    }
  }

  function applyRelease(release){
    if(!release?.version)return;
    currentRelease=release;
    window.__LS_CONNECT_RUNTIME_VERSION__=release.version;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=release.version;
    window.__LS_CONNECT_RELEASE_CHANNEL__=release.channel;
    document.documentElement.dataset.lsVersion=release.version;
    registerStableChangelog(release);
    patchRuntimeCard();
    updateKnownVersionElements(release.version);
  }

  async function readCurrentRelease(){
    if(typeof db==='undefined'||!db||typeof state==='undefined'||state?.mode!=='online')return null;
    const channel=isTestMode()?'candidate':'stable';
    try{
      const {data,error}=await db.rpc('release_current_v071014',{p_channel:channel});
      if(error)throw error;
      if(data)applyRelease(data);
      return data||null;
    }catch(error){
      console.warn('[LS Connect] Release-Metadaten konnten nicht synchronisiert werden.',error);
      return null;
    }
  }

  function scheduleRefresh(){[350,1100,2600].forEach(delay=>setTimeout(readCurrentRelease,delay));}

  document.addEventListener('click',event=>{
    if(event.target?.closest?.('[data-v071014-promote],[data-v071014-rollback]'))scheduleRefresh();
  },true);

  const observer=new MutationObserver(()=>{
    if(document.getElementById('v079RuntimeCard'))patchRuntimeCard();
    if(currentRelease?.version)updateKnownVersionElements(currentRelease.version);
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  let tries=0;
  const boot=async()=>{
    tries++;
    const release=await readCurrentRelease();
    if(!release&&tries<24)setTimeout(boot,250);
  };
  boot();
  window.addEventListener('pageshow',()=>setTimeout(readCurrentRelease,0),{passive:true});

  console.info('[LS Connect] promoted release metadata bridge active');
})();

(async function v071014LoadEgressOptimizers(){
  if(window.__LS_CONNECT_EGRESS_OPTIMIZER_BOOTSTRAP__)return;
  window.__LS_CONNECT_EGRESS_OPTIMIZER_BOOTSTRAP__=true;
  const modules=[
    {key:'v07113-perf',file:'v07113-perf.js',revision:'0.7.11.3-perf2'},
    {key:'v07113-call-fallback',file:'v07113-call-fallback.js',revision:'0.7.11.3-call1'}
  ];
  try{
    for(const module of modules){
      if([...document.scripts].some(script=>script.dataset?.lsBootstrapKey===module.key))continue;
      const script=document.createElement('script');
      script.dataset.lsBootstrapKey=module.key;
      script.src=`/api/script?version=0.7.11.3&file=${encodeURIComponent(module.file)}&v=${encodeURIComponent(module.revision)}`;
      script.async=false;
      await new Promise((resolve,reject)=>{
        script.onload=resolve;
        script.onerror=()=>reject(new Error(`LS Connect Optimierungsmodul konnte nicht geladen werden: ${module.file}`));
        document.head.appendChild(script);
      });
    }
  }catch(error){
    console.warn('[LS Connect] Egress-Optimierung konnte nicht vollständig geladen werden.',error);
  }
})();
