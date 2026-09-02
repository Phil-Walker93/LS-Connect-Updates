/* LS Connect v0.9.1.2 – Recovery & Stabilization candidate bootloader */
var LS_CONNECT_V0912_VERSION='0.9.1.2';
(async function v0912Boot(){
  if(window.__LS_CONNECT_V0912_BOOT__) return;
  window.__LS_CONNECT_V0912_BOOT__=true;

  // Recovery mode deliberately disables the DOM-heavy redesign layers that can
  // hide/replace controls or install conflicting observers. The visual rebuild
  // can be reintroduced later module-by-module after functional verification.
  window.__LS_CONNECT_V0912_RECOVERY_GUARDS__={
    multilineReleaseUiR3:true,
    multilineReleaseUiR4:true,
    navigationFilterV0801:true,
    workspaceOverflowV0802:true,
    settingsAdminFilterV0804:true,
    mobileLayoutV0805:true,
    performanceContainmentV0806:true,
    liveLayoutV0911:true
  };

  window.__LS_CONNECT_V07112_R3__=true;
  window.__LS_CONNECT_V07112_R4__=true;
  window.__LS_CONNECT_V0801_NAVIGATION__=true;
  window.__LS_CONNECT_V0802_WORKSPACE__=true;
  window.__LS_CONNECT_V0804_SETTINGS_ADMIN__=true;
  window.__LS_CONNECT_V0805_MOBILE__=true;
  window.__LS_CONNECT_V0806_PERF_A11Y__=true;
  window.__LS_CONNECT_V0911_LIVE_LAYOUT__=true;

  const runtimeErrors=window.__LS_CONNECT_RC_RUNTIME_ERRORS__=Array.isArray(window.__LS_CONNECT_RC_RUNTIME_ERRORS__)?window.__LS_CONNECT_RC_RUNTIME_ERRORS__:[];
  const remember=(type,message,source,line,column)=>{
    runtimeErrors.push({type,message:String(message||'Unbekannter Laufzeitfehler').slice(0,500),source:String(source||'').slice(0,250),line:Number(line||0),column:Number(column||0),at:new Date().toISOString()});
    if(runtimeErrors.length>80) runtimeErrors.splice(0,runtimeErrors.length-80);
  };
  if(!window.__LS_CONNECT_V0912_ERROR_CAPTURE__){
    window.__LS_CONNECT_V0912_ERROR_CAPTURE__=true;
    window.addEventListener('error',event=>remember('error',event.message,event.filename,event.lineno,event.colno),true);
    window.addEventListener('unhandledrejection',event=>remember('unhandledrejection',event.reason?.message||event.reason||'Unhandled Promise Rejection','',0,0),true);
  }

  const chain=[
    ['0.9.1','v091.js'],
    ['0.9.1.2','v0912-stabilize.js'],
    ['0.9.1.2','v0912-qa.js']
  ];

  for(const [version,file] of chain){
    const marker=`${version}:${file}`;
    const loaded=[...document.scripts].some(script=>script.dataset?.lsReleaseFile===marker||(script.src&&script.src.includes(`version=${encodeURIComponent(version)}`)&&script.src.includes(`file=${encodeURIComponent(file)}`)));
    if(loaded) continue;
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.dataset.lsReleaseFile=marker;
      script.src=`/api/script?version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}&v=0912-recovery-r2`;
      script.async=false;
      script.onload=resolve;
      script.onerror=()=>reject(new Error(`LS Connect v0.9.1.2 Modul konnte nicht geladen werden: ${file}`));
      document.head.appendChild(script);
    });
  }

  document.documentElement.dataset.lsVersion=LS_CONNECT_V0912_VERSION;
  document.documentElement.dataset.lsRecoveryMode='1';
  window.__LS_CONNECT_RUNTIME_VERSION__=LS_CONNECT_V0912_VERSION;
  window.__LS_CONNECT_DYNAMIC_RELEASE__=LS_CONNECT_V0912_VERSION;
  console.info('[LS Connect] v0.9.1.2 recovery candidate r2 boot complete');
})().catch(error=>{
  window.__LS_CONNECT_RC_RUNTIME_ERRORS__?.push({type:'boot',message:String(error?.message||error),source:'v0912.js',line:0,column:0,at:new Date().toISOString()});
  console.error('[LS Connect] v0.9.1.2 recovery candidate startup failed',error);
});
