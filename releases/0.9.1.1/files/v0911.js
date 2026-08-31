/* LS Connect v0.9.1.1 – live hotfix bootloader */
var LS_CONNECT_V0911_VERSION='0.9.1.1';
(async function v0911Boot(){
  if(window.__LS_CONNECT_V0911_BOOT__) return;
  window.__LS_CONNECT_V0911_BOOT__=true;
  const chain=[['0.9.1','v091.js'],['0.9.1.1','v0911-live-layout.js']];
  for(const [version,file] of chain){
    const marker=`${version}:${file}`;
    const loaded=[...document.scripts].some(script=>script.dataset?.lsReleaseFile===marker||(script.src&&script.src.includes(`version=${encodeURIComponent(version)}`)&&script.src.includes(`file=${encodeURIComponent(file)}`)));
    if(loaded) continue;
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.dataset.lsReleaseFile=marker;
      script.src=`/api/script?version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}&v=0911-live-layout`;
      script.async=false;
      script.onload=resolve;
      script.onerror=()=>reject(new Error(`LS Connect v0.9.1.1 Modul konnte nicht geladen werden: ${file}`));
      document.head.appendChild(script);
    });
  }
  document.documentElement.dataset.lsVersion=LS_CONNECT_V0911_VERSION;
  window.__LS_CONNECT_RUNTIME_VERSION__=LS_CONNECT_V0911_VERSION;
  window.__LS_CONNECT_DYNAMIC_RELEASE__=LS_CONNECT_V0911_VERSION;
  console.info('[LS Connect] v0.9.1.1 live hotfix boot complete');
})().catch(error=>console.error('[LS Connect] v0.9.1.1 startup failed',error));
