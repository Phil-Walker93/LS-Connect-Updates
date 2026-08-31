/* LS Connect v0.8.1 – Navigation Cleanup bootloader */
var LS_CONNECT_V0801_VERSION='0.8.1';
(async function v0801Boot(){
  if(window.__LS_CONNECT_V0801_BOOT__) return;
  window.__LS_CONNECT_V0801_BOOT__=true;

  const chain=[
    ['0.8.0','v080.js'],
    ['0.8.1','v0801-navigation.js']
  ];

  for(const [version,file] of chain){
    const marker=`${version}:${file}`;
    const loaded=[...document.scripts].some(script=>
      script.dataset?.lsReleaseFile===marker ||
      (script.src&&script.src.includes(`version=${encodeURIComponent(version)}`)&&script.src.includes(`file=${encodeURIComponent(file)}`))
    );
    if(loaded) continue;
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.dataset.lsReleaseFile=marker;
      script.src=`/api/script?version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}&v=0801-navigation`;
      script.async=false;
      script.onload=resolve;
      script.onerror=()=>reject(new Error(`LS Connect v0.8.1 Modul konnte nicht geladen werden: ${file}`));
      document.head.appendChild(script);
    });
  }

  const cleanupLegacyLabels=()=>{
    document.querySelectorAll('.v0801-nav-deck .v080-nav-section-label').forEach(label=>label.remove());
  };
  [0,100,300,900].forEach(ms=>setTimeout(cleanupLegacyLabels,ms));

  document.documentElement.dataset.lsVersion=LS_CONNECT_V0801_VERSION;
  window.__LS_CONNECT_RUNTIME_VERSION__=LS_CONNECT_V0801_VERSION;
  window.__LS_CONNECT_DYNAMIC_RELEASE__=LS_CONNECT_V0801_VERSION;
  console.info('[LS Connect] v0.8.1 navigation cleanup boot complete');
})().catch(error=>console.error('[LS Connect] v0.8.1 navigation cleanup startup failed',error));
