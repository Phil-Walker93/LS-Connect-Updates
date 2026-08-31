/* LS Connect v0.9.1 – RC QA verifier */
(function v091Qa(){
  if(window.__LS_CONNECT_V091_QA__) return;
  window.__LS_CONNECT_V091_QA__=true;

  const VERSION='0.9.1';
  const ASSETS=[
    ['0.7.11.2','v07112.js','LS Connect'],['0.7.11.2','v07112-r2.js','LS Connect'],['0.7.11.2','v07112-r3.js','LS Connect'],['0.7.11.2','v07112-r4.js','LS Connect'],['0.7.11.2','v07112-r5.js','LS Connect'],
    ['0.8.0','v080.js','v0.8.0'],['0.8.0','v080-theme.js','v0.8.0'],['0.8.0','v080-structure.js','v0.8.0'],
    ['0.8.1','v0801.js','v0.8.1'],['0.8.1','v0801-navigation.js','v0.8.1'],['0.8.2','v0802.js','v0.8.2'],['0.8.2','v0802-workspace.js','v0.8.2'],
    ['0.8.3','v0803.js','v0.8.3'],['0.8.3','v0803-community.js','v0.8.3'],['0.8.4','v0804.js','v0.8.4'],['0.8.4','v0804-settings-admin.js','v0.8.4'],
    ['0.8.5','v0805.js','v0.8.5'],['0.8.5','v0805-mobile.js','v0.8.5'],['0.8.6','v0806.js','v0.8.6'],['0.8.6','v0806-performance-a11y.js','v0.8.6'],
    ['0.9.0','v090.js','v0.9.0'],['0.9.0','v090-rc.js','v0.9.0']
  ];
  const MODULES=[['theme','__LS_CONNECT_V080_THEME__'],['structure','__LS_CONNECT_V080_STRUCTURE__'],['navigation','__LS_CONNECT_V0801_NAVIGATION__'],['workspace','__LS_CONNECT_V0802_WORKSPACE__'],['communityProfile','__LS_CONNECT_V0803_COMMUNITY_PROFILE__'],['settingsAdmin','__LS_CONNECT_V0804_SETTINGS_ADMIN__'],['mobilePolish','__LS_CONNECT_V0805_MOBILE__'],['performanceAccessibility','__LS_CONNECT_V0806_PERF_A11Y__'],['releaseCandidate','__LS_CONNECT_V090_RC__']];
  const DOM={appShell:'.app-shell',sidebar:'.sidebar',conversation:'.conversation-panel',profile:'.profile-panel',messages:'.messages'};

  async function testAsset([version,file,marker]){
    const url=`/api/script?version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}&qa=${VERSION}`;
    try{
      const start=performance.now();
      const response=await fetch(url,{cache:'no-store',credentials:'same-origin'});
      const body=await response.text();
      const type=String(response.headers.get('content-type')||'').toLowerCase();
      const markerOk=!marker||body.includes(marker);
      return {version,file,ok:response.ok&&type.includes('javascript')&&body.length>40&&markerOk,status:response.status,bytes:body.length,markerOk,durationMs:Math.round(performance.now()-start)};
    }catch(error){return {version,file,ok:false,status:0,bytes:0,markerOk:false,durationMs:0,error:String(error?.message||error)};}
  }

  function authGateLikely(){const text=String(document.body?.innerText||'').slice(0,3000).toLowerCase();return /anmelden|login|einloggen|charakter auswählen|account/.test(text)&&!document.querySelector('.app-shell');}
  function browserReport(){return {mutationObserver:typeof MutationObserver==='function',requestAnimationFrame:typeof requestAnimationFrame==='function',matchMedia:typeof matchMedia==='function',fetch:typeof fetch==='function',promise:typeof Promise==='function',cssSupports:Boolean(globalThis.CSS&&typeof CSS.supports==='function'),decompressionStream:typeof DecompressionStream==='function'};}
  function updateBadge(status){const badge=document.querySelector('.v080-ui-badge');if(!badge)return;badge.textContent=status==='pass'?'Hub UI · RC QA PASS':status==='warn'?'Hub UI · RC QA WARN':'Hub UI · RC QA FAIL';badge.title=`LS Connect ${VERSION} RC QA: ${status.toUpperCase()}`;}

  async function runQa(){
    const assetResults=await Promise.all(ASSETS.map(testAsset));
    const modules=Object.fromEntries(MODULES.map(([name,marker])=>[name,Boolean(window[marker])]));
    const browser=browserReport();
    const dom=Object.fromEntries(Object.entries(DOM).map(([name,selector])=>[name,Boolean(document.querySelector(selector))]));
    const runtimeErrors=Array.isArray(window.__LS_CONNECT_RC_RUNTIME_ERRORS__)?window.__LS_CONNECT_RC_RUNTIME_ERRORS__.slice(-20):[];
    const blockers=[];const warnings=[];
    if(assetResults.some(item=>!item.ok))blockers.push('asset-integrity');
    if(Object.values(modules).some(value=>!value))blockers.push('module-chain');
    if(!(browser.mutationObserver&&browser.requestAnimationFrame&&browser.fetch&&browser.promise))blockers.push('browser-runtime');
    if(runtimeErrors.length)blockers.push('runtime-errors');
    const coreDomOk=dom.appShell&&dom.sidebar&&dom.conversation;
    if(!coreDomOk)warnings.push(authGateLikely()?'ui-check-deferred-auth-gate':'core-ui-not-visible');
    if(!browser.matchMedia)warnings.push('match-media-unavailable');
    if(!browser.cssSupports)warnings.push('css-supports-unavailable');
    const status=blockers.length?'fail':warnings.length?'warn':'pass';
    const report=Object.freeze({version:VERSION,channel:'redesign-rc',status,pass:status==='pass',blockers:Object.freeze(blockers),warnings:Object.freeze(warnings),assets:Object.freeze({total:assetResults.length,failed:Object.freeze(assetResults.filter(item=>!item.ok).map(item=>`${item.version}/${item.file}`)),results:Object.freeze(assetResults)}),modules:Object.freeze(modules),browser:Object.freeze(browser),dom:Object.freeze(dom),runtimeErrors:Object.freeze(runtimeErrors),checkedAt:new Date().toISOString(),stableLoaderChanged:false,backendChanged:false});
    window.__LS_CONNECT_RC_QA_REPORT__=report;
    document.documentElement.dataset.lsRcQa=status;
    document.documentElement.dataset.lsVersion=VERSION;
    window.__LS_CONNECT_RUNTIME_VERSION__=VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=VERSION;
    updateBadge(status);
    console[status==='fail'?'error':status==='warn'?'warn':'info']('[LS Connect] v0.9.1 RC QA',report);
    window.dispatchEvent(new CustomEvent('ls-connect:rc-qa',{detail:{status,version:VERSION}}));
    return report;
  }

  window.__LS_CONNECT_RUN_RC_QA__=runQa;
  runQa();
  setTimeout(runQa,1200);
})();
