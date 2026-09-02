/* LS Connect v0.9.1.2 – Recovery & Stabilization QA */
(function v0912Qa(){
  if(window.__LS_CONNECT_V0912_QA__) return;
  window.__LS_CONNECT_V0912_QA__=true;

  const VERSION='0.9.1.2';
  const ASSETS=['v0912.js','v0912-stabilize.js','v0912-qa.js'];
  const ESSENTIAL_MODULES={
    theme:'__LS_CONNECT_V080_THEME__',
    structure:'__LS_CONNECT_V080_STRUCTURE__',
    communityProfile:'__LS_CONNECT_V0803_COMMUNITY_PROFILE__',
    releaseCandidate:'__LS_CONNECT_V090_RC__',
    stabilization:'__LS_CONNECT_V0912_STABILIZE__'
  };

  async function testAsset(file){
    const url=`/api/script?version=${VERSION}&file=${encodeURIComponent(file)}&qa=0912-r2`;
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
    const essentialModules=Object.fromEntries(Object.entries(ESSENTIAL_MODULES).map(([name,marker])=>[name,Boolean(window[marker])]));
    const blockers=[];
    const warnings=[];

    const guard=window.__LS_CONNECT_V0912_RECOVERY_GUARDS__||{};
    const guardsOk=[
      'multilineReleaseUiR3','multilineReleaseUiR4','navigationFilterV0801','workspaceOverflowV0802',
      'settingsAdminFilterV0804','mobileLayoutV0805','performanceContainmentV0806','liveLayoutV0911'
    ].every(key=>guard[key]===true);
    if(!guardsOk) blockers.push('recovery-guards-missing');

    if(assets.some(asset=>!asset.ok)) blockers.push('candidate-asset-integrity');
    if(Object.values(essentialModules).some(value=>!value)) blockers.push('essential-module-chain');

    const regressionArtifacts={
      r3Style:Boolean(document.getElementById('v07112-r3-style')),
      r4Style:Boolean(document.getElementById('v07112-r4-style')),
      navigationStyle:Boolean(document.getElementById('v0801-navigation-style')),
      workspaceStyle:Boolean(document.getElementById('v0802-workspace-style')),
      settingsAdminStyle:Boolean(document.getElementById('v0804-settings-admin-style')),
      mobileStyle:Boolean(document.getElementById('v0805-mobile-style')),
      performanceStyle:Boolean(document.getElementById('v0806-performance-a11y-style')),
      v0911LayoutStyle:Boolean(document.getElementById('v0911-live-layout-style')),
      navDecks:document.querySelectorAll('.v0801-nav-deck').length,
      hiddenSidebarActions:document.querySelectorAll('.sidebar .v0801-filter-hidden').length,
      overflowMenus:document.querySelectorAll('.v0802-header-overflow').length,
      hiddenHeaderActions:document.querySelectorAll('.v0802-overflow-source').length,
      settingsNavs:document.querySelectorAll('.v0804-settings-nav').length,
      hiddenSettingsBlocks:document.querySelectorAll('.v0804-settings-hidden').length
    };
    if(Object.values(regressionArtifacts).some(value=>value===true||(typeof value==='number'&&value>0))){
      blockers.push('known-regression-artifacts-active');
    }

    const runtimeVersion=String(window.__LS_CONNECT_RUNTIME_VERSION__||'');
    const dynamicVersion=String(window.__LS_CONNECT_DYNAMIC_RELEASE__||'');
    const htmlVersion=String(document.documentElement.dataset.lsVersion||'');
    const recoveryMode=String(document.documentElement.dataset.lsRecoveryMode||'');
    if(runtimeVersion!==VERSION||dynamicVersion!==VERSION||htmlVersion!==VERSION||recoveryMode!=='1') blockers.push('version-marker-drift');

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
    const headerActionCount=document.querySelectorAll('.chat-header-actions button,.conversation-header-actions button,.header-actions button,.chat-actions button,.conversation-actions button').length;
    const visibleSettingsBlocks=[...document.querySelectorAll('#modalContent > .settings-block,.modal-content > .settings-block')].filter(node=>getComputedStyle(node).display!=='none').length;
    if(sidebar&&sidebarActionCount===0) blockers.push('sidebar-actions-missing');

    const status=blockers.length?'fail':warnings.length?'warn':'pass';
    const report=Object.freeze({
      version:VERSION,
      revision:'recovery-r2',
      channel:'recovery-candidate',
      status,
      pass:status==='pass',
      blockers:Object.freeze(blockers),
      warnings:Object.freeze(warnings),
      guards:Object.freeze({...guard}),
      assets:Object.freeze(assets),
      essentialModules:Object.freeze(essentialModules),
      regressionArtifacts:Object.freeze(regressionArtifacts),
      dom:Object.freeze({appShell,sidebar,conversation,profile,messages,sidebarActionCount,headerActionCount,visibleSettingsBlocks,duplicateIds:Object.freeze(duplicateIdList)}),
      versions:Object.freeze({runtimeVersion,dynamicVersion,htmlVersion,recoveryMode}),
      runtimeErrors:Object.freeze(runtimeErrors),
      checkedAt:new Date().toISOString(),
      backendChanged:false,
      authChanged:false,
      stableChanged:false
    });

    window.__LS_CONNECT_V0912_QA_REPORT__=report;
    document.documentElement.dataset.lsRecoveryQa=status;
    console[status==='fail'?'error':status==='warn'?'warn':'info']('[LS Connect] v0.9.1.2 Recovery QA r2',report);
    window.dispatchEvent(new CustomEvent('ls-connect:recovery-qa',{detail:{status,version:VERSION,revision:'recovery-r2'}}));
    return report;
  }

  window.__LS_CONNECT_RUN_V0912_QA__=runQa;
  runQa();
  setTimeout(runQa,1400);
  setTimeout(runQa,4200);
})();
