/* LS Connect v0.8.5 – Mobile Polish bootloader */
var LS_CONNECT_V0805_VERSION='0.8.5';
(async function v0805Boot(){
  if(window.__LS_CONNECT_V0805_BOOT__) return;
  window.__LS_CONNECT_V0805_BOOT__=true;
  const chain=[['0.8.4','v0804.js'],['0.8.5','v0805-mobile.js']];
  for(const [version,file] of chain){
    const marker=`${version}:${file}`;
    const loaded=[...document.scripts].some(script=>script.dataset?.lsReleaseFile===marker||(script.src&&script.src.includes(`version=${encodeURIComponent(version)}`)&&script.src.includes(`file=${encodeURIComponent(file)}`)));
    if(loaded) continue;
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.dataset.lsReleaseFile=marker;
      script.src=`/api/script?version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}&v=0805-mobile-polish`;
      script.async=false;script.onload=resolve;script.onerror=()=>reject(new Error(`LS Connect v0.8.5 Modul konnte nicht geladen werden: ${file}`));document.head.appendChild(script);
    });
  }
  document.documentElement.dataset.lsVersion=LS_CONNECT_V0805_VERSION;
  window.__LS_CONNECT_RUNTIME_VERSION__=LS_CONNECT_V0805_VERSION;
  window.__LS_CONNECT_DYNAMIC_RELEASE__=LS_CONNECT_V0805_VERSION;
  console.info('[LS Connect] v0.8.5 Mobile Polish boot complete');
})().catch(error=>console.error('[LS Connect] v0.8.5 startup failed',error));
