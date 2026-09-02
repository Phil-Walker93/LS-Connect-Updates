/* LS Connect v0.9.1.1 – flattened online baseline
 * Replaces the nested 0.8/0.9 bootloader cascade for the online stable channel.
 * Functional legacy modules that are still required are loaded directly once;
 * known regression layers stay guarded. The current UI is revealed only after
 * this baseline is fully ready.
 */
(function installLsConnectBaseline(){
  if(window.__LS_CONNECT_V0911_BASELINE__) return;
  window.__LS_CONNECT_V0911_BASELINE__=true;

  const VERSION='0.9.1.1';
  const REVISION='baseline-r13';
  const root=document.documentElement;
  root.dataset.lsBaseline='0911';
  root.dataset.lsConnectRedesign='080';

  Object.assign(window,{
    __LS_CONNECT_V07112_R3__:true,
    __LS_CONNECT_V07112_R4__:true,
    __LS_CONNECT_V080_STRUCTURE__:true,
    __LS_CONNECT_V0801_NAVIGATION__:true,
    __LS_CONNECT_V0802_WORKSPACE__:true,
    __LS_CONNECT_V0804_SETTINGS_ADMIN__:true,
    __LS_CONNECT_V0805_MOBILE__:true,
    __LS_CONNECT_V0806_PERF_A11Y__:true,
    __LS_CONNECT_V0911_LIVE_LAYOUT__:true,
    __LS_CONNECT_V0911_TABS_R4__:true,
    __LS_CONNECT_V0911_SETTINGS_R9__:true,
    __LS_CONNECT_V0911_SETTINGS_R10__:true,
    __LS_CONNECT_V0911_MESSAGE_FLOW_R12__:true
  });

  Object.assign(window,{
    __LS_CONNECT_V080_BOOT__:true,
    __LS_CONNECT_V0801_BOOT__:true,
    __LS_CONNECT_V0802_BOOT__:true,
    __LS_CONNECT_V0803_BOOT__:true,
    __LS_CONNECT_V0804_BOOT__:true,
    __LS_CONNECT_V0805_BOOT__:true,
    __LS_CONNECT_V0806_BOOT__:true,
    __LS_CONNECT_V090_BOOT__:true,
    __LS_CONNECT_V091_BOOT__:true,
    __LS_CONNECT_V0911_BOOT__:true
  });

  const chain=[
    ['0.7.11','v0711.js'],
    ['0.7.11','v0711-r2.js'],
    ['0.7.11','v0711-r3.js'],
    ['0.7.11','v0711-r4.js'],
    ['0.7.11','v0711-init.js'],
    ['0.7.11.1','v07111.js'],
    ['0.7.11.1','v07111-r2.js'],
    ['0.7.11.1','v07111-meta.js'],
    ['0.7.11.2','v07112.js'],
    ['0.7.11.2','v07112-r2.js'],
    ['0.7.11.2','v07112-r5.js'],
    ['0.8.0','v080-theme.js'],
    ['0.8.3','v0803-community.js'],
    ['0.9.1.1','v0911-repair-ui.js'],
    ['0.9.1.1','v0911-scroll-r3.js'],
    ['0.9.1.1','v0911-tabs-layout-r5.js'],
    ['0.9.1.1','v0911-layout-r6.js'],
    ['0.9.1.1','v0911-bubbles-r7.js'],
    ['0.9.1.1','v0911-settings-chat-r11.js'],
    ['0.9.1.1','v0911-message-flow-r13.js']
  ];

  const signature=(version,file)=>`${version}:${file}`;
  const isLoaded=(version,file)=>{
    const marker=signature(version,file);
    return [...document.scripts].some(script=>
      script.dataset?.lsReleaseFile===marker ||
      (script.src&&script.src.includes(`version=${encodeURIComponent(version)}`)&&script.src.includes(`file=${encodeURIComponent(file)}`))
    );
  };

  const load=(version,file)=>new Promise((resolve,reject)=>{
    if(isLoaded(version,file)){resolve();return;}
    const script=document.createElement('script');
    script.dataset.lsReleaseFile=signature(version,file);
    script.src=`/api/script?version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}&v=${encodeURIComponent(REVISION)}`;
    script.async=false;
    script.onload=resolve;
    script.onerror=()=>reject(new Error(`Baseline-Modul konnte nicht geladen werden: ${version}/${file}`));
    document.head.appendChild(script);
  });

  async function boot(){
    root.dataset.lsBaselineState='loading';
    for(const [version,file] of chain) await load(version,file);

    root.dataset.lsBaselineState='ready';
    root.dataset.lsVersion=VERSION;
    window.__LS_CONNECT_RUNTIME_VERSION__=VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=VERSION;
    window.__LS_CONNECT_BASELINE_REVISION__=REVISION;

    window.dispatchEvent(new CustomEvent('ls-connect-baseline-ready',{detail:{version:VERSION,revision:REVISION}}));
    window.__LS_CONNECT_REVEAL_BASELINE__?.('ready');
    console.info(`[LS Connect] v${VERSION} flattened online baseline ready (${REVISION})`);
  }

  boot().catch(error=>{
    root.dataset.lsBaselineState='error';
    console.error('[LS Connect] flattened online baseline failed',error);
    window.dispatchEvent(new CustomEvent('ls-connect-baseline-error',{detail:{version:VERSION,revision:REVISION,message:String(error?.message||error)}}));
    window.__LS_CONNECT_REVEAL_BASELINE__?.('error');
  });
})();
