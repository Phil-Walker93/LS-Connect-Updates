/* LS Connect v0.9.1.1 – stabilized live bootloader r6 */
var LS_CONNECT_V0911_VERSION='0.9.1.1';
(async function v0911Boot(){
  if(window.__LS_CONNECT_V0911_BOOT__) return;
  window.__LS_CONNECT_V0911_BOOT__=true;

  /* Guard legacy layers before the v0.9.1 dependency chain starts. */
  window.__LS_CONNECT_V07112_R3__=true;
  window.__LS_CONNECT_V07112_R4__=true;
  window.__LS_CONNECT_V080_STRUCTURE__=true;
  window.__LS_CONNECT_V0801_NAVIGATION__=true;
  window.__LS_CONNECT_V0802_WORKSPACE__=true;
  window.__LS_CONNECT_V0804_SETTINGS_ADMIN__=true;
  window.__LS_CONNECT_V0805_MOBILE__=true;
  window.__LS_CONNECT_V0806_PERF_A11Y__=true;
  window.__LS_CONNECT_V0911_LIVE_LAYOUT__=true;
  window.__LS_CONNECT_V0911_TABS_R4__=true;
  document.documentElement.dataset.lsConnectRedesign='080';

  const chain=[
    ['0.9.1','v091.js'],
    ['0.9.1.1','v0911-repair-ui.js'],
    ['0.9.1.1','v0911-scroll-r3.js'],
    ['0.9.1.1','v0911-tabs-layout-r5.js'],
    ['0.9.1.1','v0911-layout-r6.js']
  ];

  for(const [version,file] of chain){
    const marker=`${version}:${file}`;
    const loaded=[...document.scripts].some(script=>script.dataset?.lsReleaseFile===marker||(script.src&&script.src.includes(`version=${encodeURIComponent(version)}`)&&script.src.includes(`file=${encodeURIComponent(file)}`)));
    if(loaded) continue;
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.dataset.lsReleaseFile=marker;
      script.src=`/api/script?version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}&v=0911-stable-repair-r6`;
      script.async=false;
      script.onload=resolve;
      script.onerror=()=>reject(new Error(`LS Connect v0.9.1.1 Modul konnte nicht geladen werden: ${file}`));
      document.head.appendChild(script);
    });
  }

  document.documentElement.dataset.lsVersion=LS_CONNECT_V0911_VERSION;
  window.__LS_CONNECT_RUNTIME_VERSION__=LS_CONNECT_V0911_VERSION;
  window.__LS_CONNECT_DYNAMIC_RELEASE__=LS_CONNECT_V0911_VERSION;
  console.info('[LS Connect] v0.9.1.1 stabilized live boot r6 complete');
})().catch(error=>console.error('[LS Connect] v0.9.1.1 stabilized startup failed',error));
