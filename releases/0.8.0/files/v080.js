/* LS Connect v0.8.0 – redesign bootloader */
var LS_CONNECT_V080_VERSION='0.8.0';
(async function v080Boot(){
  if(window.__LS_CONNECT_V080_BOOT__) return;
  window.__LS_CONNECT_V080_BOOT__=true;

  const chain=[
    ['0.7.11.2','v07112.js'],
    ['0.7.11.2','v07112-r2.js'],
    ['0.7.11.2','v07112-r3.js'],
    ['0.7.11.2','v07112-r4.js'],
    ['0.7.11.2','v07112-r5.js'],
    ['0.8.0','v080-theme.js'],
    ['0.8.0','v080-structure.js']
  ];

  for(const [version,file] of chain){
    const marker=`${version}:${file}`;
    const loaded=[...document.scripts].some(s=>s.dataset?.lsReleaseFile===marker || (s.src&&s.src.includes(`version=${encodeURIComponent(version)}`)&&s.src.includes(`file=${encodeURIComponent(file)}`)));
    if(loaded) continue;
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.dataset.lsReleaseFile=marker;
      script.src=`/api/script?version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}&v=080-hub-ui`;
      script.async=false;
      script.onload=resolve;
      script.onerror=()=>reject(new Error(`LS Connect v0.8.0 Modul konnte nicht geladen werden: ${file}`));
      document.head.appendChild(script);
    });
  }

  document.documentElement.dataset.lsVersion=LS_CONNECT_V080_VERSION;
  window.__LS_CONNECT_RUNTIME_VERSION__=LS_CONNECT_V080_VERSION;
  window.__LS_CONNECT_DYNAMIC_RELEASE__=LS_CONNECT_V080_VERSION;
  console.info('[LS Connect] v0.8.0 redesign boot complete');
})().catch(error=>console.error('[LS Connect] v0.8.0 redesign startup failed',error));
