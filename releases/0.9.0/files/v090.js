/* LS Connect v0.9.0 – Redesign Release Candidate bootloader */
var LS_CONNECT_V090_VERSION='0.9.0';
(async function v090Boot(){
  if(window.__LS_CONNECT_V090_BOOT__) return;
  window.__LS_CONNECT_V090_BOOT__=true;

  const chain=[['0.8.6','v0806.js'],['0.9.0','v090-rc.js']];
  for(const [version,file] of chain){
    const marker=`${version}:${file}`;
    const loaded=[...document.scripts].some(script=>script.dataset?.lsReleaseFile===marker||(script.src&&script.src.includes(`version=${encodeURIComponent(version)}`)&&script.src.includes(`file=${encodeURIComponent(file)}`)));
    if(loaded) continue;
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.dataset.lsReleaseFile=marker;
      script.src=`/api/script?version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}&v=090-release-candidate`;
      script.async=false;
      script.onload=resolve;
      script.onerror=()=>reject(new Error(`LS Connect v0.9.0 Modul konnte nicht geladen werden: ${file}`));
      document.head.appendChild(script);
    });
  }

  document.documentElement.dataset.lsVersion=LS_CONNECT_V090_VERSION;
  window.__LS_CONNECT_RUNTIME_VERSION__=LS_CONNECT_V090_VERSION;
  window.__LS_CONNECT_DYNAMIC_RELEASE__=LS_CONNECT_V090_VERSION;
  console.info('[LS Connect] v0.9.0 Release Candidate boot complete');
})().catch(error=>console.error('[LS Connect] v0.9.0 RC startup failed',error));
