/* LS Connect v0.7.11.1 r2 – safe release-center actions */
var LS_CONNECT_V07111_R2_VERSION='0.7.11.1-r2';
(function v07111R2ReleaseCenterGuard(){
  if(window.__LS_CONNECT_V07111_R2_RELEASE_GUARD__)return;
  window.__LS_CONNECT_V07111_R2_RELEASE_GUARD__=true;

  const errors=[];
  window.addEventListener('error',event=>{
    const text=String(event?.error?.stack||event?.message||event?.error||'');
    if(text)errors.push(text);
  });
  window.addEventListener('unhandledrejection',event=>{
    const text=String(event?.reason?.stack||event?.reason||'Unhandled rejection');
    if(text)errors.push(text);
  });

  const toast=(message,type='info')=>typeof showToast==='function'?showToast(message,type):console.info('[LS Connect]',message);
  const ready=()=>typeof db!=='undefined'&&!!db&&typeof state!=='undefined'&&state.mode==='online';
  async function rpc(name,args={}){
    if(!ready())throw new Error('Release Center benötigt Online-Modus.');
    const {data,error}=await db.rpc(name,args);
    if(error)throw error;
    return data;
  }
  async function center(){return await rpc('release_center_v071014');}
  function refresh(){document.querySelector('[data-v071014-refresh]')?.click();}

  async function safeAutoTests(){
    const data=await center();
    const id=data?.candidate?.candidate_id;
    if(!id)throw new Error('Kein Candidate aktiv.');
    const tests=data?.tests||[];
    const results={
      startup:document.readyState==='complete'||document.readyState==='interactive',
      console:errors.length===0
    };
    for(const [key,ok] of Object.entries(results)){
      if(!tests.some(test=>test.key===key))continue;
      await rpc('release_set_test_result_v071014',{
        p_candidate_id:id,
        p_test_key:key,
        p_status:ok?'pass':'fail',
        p_note:ok?'Automatischer Check bestanden.':`Automatischer Check fehlgeschlagen: ${errors[0]?.slice(0,300)||'Unbekannter Runtime-Fehler.'}`,
        p_details:{automatic:true,runtime_version:window.__LS_CONNECT_RUNTIME_VERSION__||null}
      });
    }
    toast('Automatische Release-Checks abgeschlossen.','success');
    refresh();
  }

  async function safePromote(){
    const data=await center();
    const candidate=data?.candidate;
    const tests=data?.tests||[];
    const blocked=tests.filter(test=>test.required&&test.status!=='pass').length;
    if(!candidate?.candidate_id)throw new Error('Kein Candidate aktiv.');
    if(blocked)throw new Error(`Freigabe blockiert: ${blocked} Pflichtprüfung(en) noch offen.`);
    if(!confirm(`v${candidate.version} wirklich für alle Nutzer freigeben?\n\nAktueller Stable: v${data?.stable?.version||'—'}`))return;
    const result=await rpc('release_promote_candidate_v071014',{p_candidate_id:candidate.candidate_id});
    toast(`v${result.version} wurde global freigegeben.`,'success');
    refresh();
  }

  async function safeRollback(){
    const data=await center();
    const target=data?.stable?.previous_version;
    if(!target)throw new Error('Kein Rollback-Ziel verfügbar.');
    if(!confirm(`Stable wirklich auf v${target} zurücksetzen?`))return;
    const result=await rpc('release_rollback_v071014');
    toast(`Rollback auf v${result.version} abgeschlossen.`,'success');
    refresh();
  }

  document.addEventListener('click',async event=>{
    const auto=event.target?.closest?.('[data-v071014-auto-tests]');
    const promote=event.target?.closest?.('[data-v071014-promote]');
    const rollback=event.target?.closest?.('[data-v071014-rollback]');
    const button=auto||promote||rollback;
    if(!button)return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    button.disabled=true;
    try{
      if(auto)await safeAutoTests();
      else if(promote)await safePromote();
      else if(rollback)await safeRollback();
    }catch(error){
      console.error('[LS Connect] Release-Center-Aktion fehlgeschlagen.',error);
      toast(error?.message||String(error),'error');
    }finally{
      if(button?.isConnected)button.disabled=false;
    }
  },true);

  console.info('[LS Connect] v0.7.11.1 r2 safe release-center actions active');
})();
