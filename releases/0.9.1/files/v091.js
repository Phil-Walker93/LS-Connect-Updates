/* LS Connect v0.9.1 – RC QA bootloader */
var LS_CONNECT_V091_VERSION='0.9.1';
(async function v091Boot(){
  if(window.__LS_CONNECT_V091_BOOT__) return;
  window.__LS_CONNECT_V091_BOOT__=true;

  const runtimeErrors=window.__LS_CONNECT_RC_RUNTIME_ERRORS__=Array.isArray(window.__LS_CONNECT_RC_RUNTIME_ERRORS__)?window.__LS_CONNECT_RC_RUNTIME_ERRORS__:[];
  const remember=(type,message,source,line,column)=>{
    runtimeErrors.push({type,message:String(message||'Unbekannter Laufzeitfehler').slice(0,500),source:String(source||'').slice(0,250),line:Number(line||0),column:Number(column||0),at:new Date().toISOString()});
    if(runtimeErrors.length>50)runtimeErrors.splice(0,runtimeErrors.length-50);
  };
  if(!window.__LS_CONNECT_RC_ERROR_CAPTURE__){
    window.__LS_CONNECT_RC_ERROR_CAPTURE__=true;
    window.addEventListener('error',event=>remember('error',event.message,event.filename,event.lineno,event.colno),true);
    window.addEventListener('unhandledrejection',event=>remember('unhandledrejection',event.reason?.message||event.reason||'Unhandled Promise Rejection','',0,0),true);
  }

  const chain=[['0.9.0','v090.js'],['0.9.1','v091-qa.js']];
  for(const [version,file] of chain){
    const marker=`${version}:${file}`;
    const loaded=[...document.scripts].some(script=>script.dataset?.lsReleaseFile===marker||(script.src&&script.src.includes(`version=${encodeURIComponent(version)}`)&&script.src.includes(`file=${encodeURIComponent(file)}`)));
    if(loaded)continue;
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.dataset.lsReleaseFile=marker;
      script.src=`/api/script?version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}&v=091-rc-qa`;
      script.async=false;
      script.onload=resolve;
      script.onerror=()=>reject(new Error(`LS Connect v0.9.1 Modul konnte nicht geladen werden: ${file}`));
      document.head.appendChild(script);
    });
  }

  document.documentElement.dataset.lsVersion=LS_CONNECT_V091_VERSION;
  window.__LS_CONNECT_RUNTIME_VERSION__=LS_CONNECT_V091_VERSION;
  window.__LS_CONNECT_DYNAMIC_RELEASE__=LS_CONNECT_V091_VERSION;
  console.info('[LS Connect] v0.9.1 RC QA boot complete');
})().catch(error=>{
  window.__LS_CONNECT_RC_RUNTIME_ERRORS__?.push({type:'boot',message:String(error?.message||error),source:'v091.js',line:0,column:0,at:new Date().toISOString()});
  console.error('[LS Connect] v0.9.1 RC QA startup failed',error);
});
