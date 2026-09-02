/* LS Connect v0.9.1.2 – Recovery & Stabilization QA */
(function v0912Qa(){
  if(window.__LS_CONNECT_V0912_QA__) return;
  window.__LS_CONNECT_V0912_QA__=true;

  const VERSION='0.9.1.2';
  const ASSETS=['v0912.js','v0912-stabilize.js','v0912-qa.js'];
  const REQUIRED_MODULES={
    theme:'__LS_CONNECT_V080_THEME__',
    structure:'__LS_CONNECT_V080_STRUCTURE__',
    workspace:'__LS_CONNECT_V0802_WORKSPACE__',
    communityProfile:'__LS_CONNECT_V0803_COMMUNITY_PROFILE__',
    settingsAdmin:'__LS_CONNECT_V0804_SETTINGS_ADMIN__',
    mobilePolish:'__LS_CONNECT_V0805_MOBILE__',
    performanceAccessibility:'__LS_CONNECT_V0806_PERF_A11Y__',
    releaseCandidate:'__LS_CONNECT_V090_RC__',
    stabilization:'__LS_CONNECT_V0912_STABILIZE__'
  };

  async function testAsset(file){
    const url=`/api/script?version=${VERSION}&file=${encodeURIComponent(file)}&qa=0912`;
    try{
      const started=performance.now();
      const response=await fetch(url,{cache:'no-store',credentials:'same-origin'});
      const body=await response.text();
      const type=String(response.headers.get('content-type')||'').toLowerCase();
      return {file,ok:response.ok&&type.includes('javascript')&&body.length>80,status:response.status,bytes:body.length,durationMs:Math.round(performance.now()-started)};
    }catch(error){
      return {file,ok:false,status:0,bytes:0,durationMs:0,error:String(error?.message||error)};
    }
  }

  function authGateLikely(){
    const text=String(document.body?.innerText||'').slice(0,4000).toLowerCase();
    return /anmelden|login|einloggen|charakter auswählen|account/.test(text)&&!document.querySelector('.app-shell');
  }

  function duplicateIds(){
    const counts=new Map();
    document.querySelectorAll('[id]').forEach(node=>counts.set(node.id,(counts.get(node.id)||0)+1));
    return [...counts.entries()].filter(([,count])=>count>1).map(([id,count])=>({id,count}));
  }

  async function runQa(){
    const assets=await Promise.all(ASSETS.map(testAsset));
    const modules=Object.fromEntries(Object.entries(REQUIRED_MODULES).map(([name,marker])=>[name,Boolean(window[marker])]));
    const blockers=[];
    const warnings=[];

    const guard=window.__LS_CONNECT_V0912_RECOVERY_GUARDS__||{};
    const guardsOk=guard.multilineReleaseUiR3===true&&guard.multilineReleaseUiR4===true&&guard.navigationFilterV0801===true&&guard.liveLayoutV0911===true;
    if(!guardsOk) blockers.push('recovery-guards-missing');

    if(assets.some(asset=>!asset.ok)) blockers.push('candidate-asset-integrity');
    if(Object.values(modules).some(value=>!value)) blockers.push('required-module-chain');

    const regressionArtifacts={
      r3Style:Boolean(document.getElementById('v07112-r3-style')),
      r4Style:Boolean(document.getElementById('v07112-r4-style')),
      v0911LayoutStyle:Boolean(document.getElementById('v0911-live-layout-style')),
      navDecks:document.querySelectorAll('.v0801-nav-deck').length,
      hiddenSidebarActions:document.querySelectorAll('.sidebar .v0801-filter-hidden').length
    };
    if(regressionArtifacts.r3Style||regressionArtifacts.r4Style||regressionArtifacts.v0911LayoutStyle||regressionArtifacts.navDecks>0||regressionArtifacts.hiddenSidebarActions>0){
      blockers.push('known-regression-artifacts-active');
    }

    const runtimeVersion=String(window.__LS_CONNECT_RUNTIME_VERSION__||'');
    const dynamicVersion=String(window.__LS_CONNECT_DYNAMIC_RELEASE__||'');
    const htmlVersion=String(document.documentElement.dataset.lsVersion||'');
    if(runtimeVersion!==VERSION||dynamicVersion!==VERSION||htmlVersion!==VERSION) blockers.push('version-marker-drift');

    const runtimeErrors=Array.isArray(window.__LS_CONNECT_RC_RUNTIME_ERRORS__)?window.__LS_CONNECT_RC_RUNTIME_ERRORS__.slice(-30):[];
    if(runtimeErrors.length) blockers.push('runtime-errors');

    const appShell=Boolean(document.querySelector('.app-shell'));
    const sidebar=Boolean(document.querySelector('.sidebar'));
    const conversation=Boolean(document.querySelector('.conversation-panel'));
    const profile=Boolean(document.querySelector('.profile-panel'));
    const messages=Boolean(document.querySelector('.messages'));
    const deferred=authGateLikely();
    if(!(appShell&&sidebar&&conversation)){
      if(deferred) warnings.push('ui-check-deferred-auth-gate');
      else blockers.push('core-ui-missing');
    }
    if(appShell&&!messages) warnings.push('messages-container-not-visible');
    if(appShell&&!profile) warnings.push('profile-panel-not-visible');

    const duplicateIdList=duplicateIds();
    if(duplicateIdList.length) warnings.push('duplicate-dom-ids');

    const sidebarActionCount=document.querySelectorAll('.sidebar .chat-item,.sidebar .channel-item,.sidebar button,.sidebar a,.sidebar [role="button"]').length;
    if(sidebar&&sidebarActionCount===0) blockers.push('sidebar-actions-missing');

    const status=blockers.length?'fail':warnings.length?'warn':'pass';
    const report=Object.freeze({
      version:VERSION,
      channel:'recovery-candidate',
      status,
      pass:status==='pass',
      blockers:Object.freeze(blockers),
      warnings:Object.freeze(warnings),
      guards:Object.freeze({...guard}),
      assets:Object.freeze(assets),
      modules:Object.freeze(modules),
      regressionArtifacts:Object.freeze(regressionArtifacts),
      dom:Object.freeze({appShell,sidebar,conversation,profile,messages,sidebarActionCount,duplicateIds:Object.freeze(duplicateIdList)}),
      versions:Object.freeze({runtimeVersion,dynamicVersion,htmlVersion}),
      runtimeErrors:Object.freeze(runtimeErrors),
      checkedAt:new Date().toISOString(),
      backendChanged:false,
      authChanged:false,
      stableChanged:false
    });

    window.__LS_CONNECT_V0912_QA_REPORT__=report;
    document.documentElement.dataset.lsRecoveryQa=status;
    console[status==='fail'?'error':status==='warn'?'warn':'info']('[LS Connect] v0.9.1.2 Recovery QA',report);
    window.dispatchEvent(new CustomEvent('ls-connect:recovery-qa',{detail:{status,version:VERSION}}));
    return report;
  }

  window.__LS_CONNECT_RUN_V0912_QA__=runQa;
  runQa();
  setTimeout(runQa,1400);
  setTimeout(runQa,4200);
})();
