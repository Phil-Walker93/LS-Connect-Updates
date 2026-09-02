/* LS Connect v0.9.1.3 – LMH identity handoff bootloader */
var LS_CONNECT_V0913_VERSION='0.9.1.3';
(async function v0913Boot(){
  if(window.__LS_CONNECT_V0913_BOOT__)return;
  window.__LS_CONNECT_V0913_BOOT__=true;

  const root=document.documentElement;
  const load=(version,file)=>new Promise((resolve,reject)=>{
    const marker=`${version}:${file}`;
    const already=[...document.scripts].some(script=>
      script.dataset?.lsReleaseFile===marker ||
      (script.src&&script.src.includes(`version=${encodeURIComponent(version)}`)&&script.src.includes(`file=${encodeURIComponent(file)}`))
    );
    if(already){resolve();return;}
    const script=document.createElement('script');
    script.dataset.lsReleaseFile=marker;
    script.src=`/api/script?version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}&v=0913-lmh-identity`;
    script.async=false;
    script.onload=resolve;
    script.onerror=()=>reject(new Error(`LS Connect v0.9.1.3 Modul konnte nicht geladen werden: ${version}/${file}`));
    document.head.appendChild(script);
  });

  await load('0.9.1.1','v0911-baseline.js');

  if(root.dataset.lsBaselineState!=='ready'){
    await new Promise((resolve,reject)=>{
      let settled=false;
      const done=()=>{if(settled)return;settled=true;cleanup();resolve();};
      const fail=event=>{if(settled)return;settled=true;cleanup();reject(new Error(event?.detail?.message||'LS Connect Stable-Baseline konnte nicht geladen werden.'));};
      const timer=setTimeout(()=>{
        if(root.dataset.lsBaselineState==='ready')done();
        else fail({detail:{message:'Timeout beim Laden des LS Connect Stable-Baseline.'}});
      },15000);
      const cleanup=()=>{
        clearTimeout(timer);
        window.removeEventListener('ls-connect-baseline-ready',done);
        window.removeEventListener('ls-connect-baseline-error',fail);
      };
      window.addEventListener('ls-connect-baseline-ready',done,{once:true});
      window.addEventListener('ls-connect-baseline-error',fail,{once:true});
      if(root.dataset.lsBaselineState==='ready')done();
    });
  }

  await load('0.9.1.3','v0913-lmh-identity.js');

  root.dataset.lsVersion=LS_CONNECT_V0913_VERSION;
  root.dataset.lsIdentityOwner='lmh';
  window.__LS_CONNECT_RUNTIME_VERSION__=LS_CONNECT_V0913_VERSION;
  window.__LS_CONNECT_DYNAMIC_RELEASE__=LS_CONNECT_V0913_VERSION;
  window.dispatchEvent(new CustomEvent('ls-connect-release-ready',{detail:{version:LS_CONNECT_V0913_VERSION,feature:'lmh-identity'}}));
  console.info('[LS Connect] v0.9.1.3 LMH identity handoff live');
})().catch(error=>{
  console.error('[LS Connect] v0.9.1.3 startup failed',error);
  window.dispatchEvent(new CustomEvent('ls-connect-release-error',{detail:{version:LS_CONNECT_V0913_VERSION,message:String(error?.message||error)}}));
});
