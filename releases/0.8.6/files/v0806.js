/* LS Connect v0.8.6 – Performance & Accessibility bootloader */
var LS_CONNECT_V0806_VERSION='0.8.6';
(async function v0806Boot(){
  if(window.__LS_CONNECT_V0806_BOOT__) return;
  window.__LS_CONNECT_V0806_BOOT__=true;

  const chain=[['0.8.5','v0805.js'],['0.8.6','v0806-performance-a11y.js']];
  for(const [version,file] of chain){
    const marker=`${version}:${file}`;
    const loaded=[...document.scripts].some(script=>script.dataset?.lsReleaseFile===marker||(script.src&&script.src.includes(`version=${encodeURIComponent(version)}`)&&script.src.includes(`file=${encodeURIComponent(file)}`)));
    if(loaded) continue;
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.dataset.lsReleaseFile=marker;
      script.src=`/api/script?version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}&v=0806-performance-a11y`;
      script.async=false;
      script.onload=resolve;
      script.onerror=()=>reject(new Error(`LS Connect v0.8.6 Modul konnte nicht geladen werden: ${file}`));
      document.head.appendChild(script);
    });
  }

  document.documentElement.dataset.lsVersion=LS_CONNECT_V0806_VERSION;
  window.__LS_CONNECT_RUNTIME_VERSION__=LS_CONNECT_V0806_VERSION;
  window.__LS_CONNECT_DYNAMIC_RELEASE__=LS_CONNECT_V0806_VERSION;
  console.info('[LS Connect] v0.8.6 Performance & Accessibility boot complete');
})().catch(error=>console.error('[LS Connect] v0.8.6 startup failed',error));
