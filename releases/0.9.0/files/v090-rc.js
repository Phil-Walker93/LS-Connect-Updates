/* LS Connect v0.9.0 – Redesign Release Candidate verifier */
(function v090ReleaseCandidateVerifier(){
  if(window.__LS_CONNECT_V090_RC__) return;
  window.__LS_CONNECT_V090_RC__=true;

  const VERSION='0.9.0';
  const EXPECTED=[
    ['theme','__LS_CONNECT_V080_THEME__'],
    ['structure','__LS_CONNECT_V080_STRUCTURE__'],
    ['navigation','__LS_CONNECT_V0801_NAVIGATION__'],
    ['workspace','__LS_CONNECT_V0802_WORKSPACE__'],
    ['communityProfile','__LS_CONNECT_V0803_COMMUNITY_PROFILE__'],
    ['settingsAdmin','__LS_CONNECT_V0804_SETTINGS_ADMIN__'],
    ['mobilePolish','__LS_CONNECT_V0805_MOBILE__'],
    ['performanceAccessibility','__LS_CONNECT_V0806_PERF_A11Y__']
  ];

  function buildReport(){
    const modules=Object.fromEntries(EXPECTED.map(([name,marker])=>[name,Boolean(window[marker])]));
    const requiredApis={
      mutationObserver:typeof MutationObserver==='function',
      requestAnimationFrame:typeof requestAnimationFrame==='function',
      matchMedia:typeof matchMedia==='function',
      cssSupports:Boolean(globalThis.CSS&&typeof CSS.supports==='function')
    };
    const ready=Object.values(modules).every(Boolean)&&requiredApis.mutationObserver&&requiredApis.requestAnimationFrame;
    return Object.freeze({
      version:VERSION,
      channel:'redesign-rc',
      ready,
      modules:Object.freeze(modules),
      requiredApis:Object.freeze(requiredApis),
      checkedAt:new Date().toISOString(),
      stableLoaderChanged:false,
      backendChanged:false
    });
  }

  function publishReport(){
    const report=buildReport();
    window.__LS_CONNECT_RC_REPORT__=report;
    document.documentElement.dataset.lsRcStatus=report.ready?'ready':'incomplete';
    document.documentElement.dataset.lsVersion=VERSION;
    window.__LS_CONNECT_RUNTIME_VERSION__=VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=VERSION;

    const badge=document.querySelector('.v080-ui-badge');
    if(badge){
      badge.textContent=report.ready?'Hub UI · RC 0.9.0':'Hub UI · RC unvollständig';
      badge.setAttribute('title',report.ready?'LS Connect Redesign Release Candidate 0.9.0 bereit':'LS Connect RC-Prüfung unvollständig');
    }

    if(report.ready) console.info('[LS Connect] v0.9.0 RC verification passed',report);
    else console.error('[LS Connect] v0.9.0 RC verification failed',report);
    return report;
  }

  publishReport();
  setTimeout(publishReport,250);
  setTimeout(publishReport,900);
})();
