/* LS Connect v0.9.5 – Identity v2 RC bootloader */
var LS_CONNECT_V095_VERSION='0.9.5';
(async function v095Boot(){
  if(window.__LS_CONNECT_V095_BOOT__) return;
  window.__LS_CONNECT_V095_BOOT__=true;

  const chain=[
    ['0.9.1.2','v0912.js'],
    ['0.9.5','v095-identity-v2.js']
  ];

  for(const [version,file] of chain){
    const marker=`${version}:${file}`;
    const loaded=[...document.scripts].some(script=>
      script.dataset?.lsReleaseFile===marker
      ||(script.src&&script.src.includes(`version=${encodeURIComponent(version)}`)
        &&script.src.includes(`file=${encodeURIComponent(file)}`))
    );
    if(loaded) continue;

    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.dataset.lsReleaseFile=marker;
      script.src=`/api/script?version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}&v=095-identity-v2`;
      script.async=false;
      script.onload=resolve;
      script.onerror=()=>reject(new Error(`LS Connect v0.9.5 Modul konnte nicht geladen werden: ${file}`));
      document.head.appendChild(script);
    });
  }

  document.documentElement.dataset.lsVersion=LS_CONNECT_V095_VERSION;
  document.documentElement.dataset.lsIdentityContract='v2';
  window.__LS_CONNECT_RUNTIME_VERSION__=LS_CONNECT_V095_VERSION;
  window.__LS_CONNECT_DYNAMIC_RELEASE__=LS_CONNECT_V095_VERSION;
  console.info('[LS Connect] v0.9.5 Identity v2 RC boot complete');
})().catch(error=>{
  console.error('[LS Connect] v0.9.5 RC startup failed',error);
});
