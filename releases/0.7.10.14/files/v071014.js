/* LS Connect v0.7.10.14 – Release Center & isolated candidate testing */
var LS_CONNECT_V071014_VERSION='0.7.10.14';
(function(){
  if(window.__LS_CONNECT_RELEASE_CENTER_V071014__)return;
  window.__LS_CONNECT_RELEASE_CENTER_V071014__=true;

  const TEST_PARAM='ls-test';
  const BOOTSTRAP_VERSION=String(window.__LS_CONNECT_RUNTIME_VERSION__||window.__LS_CONNECT_ONLINE_VERSION__||'0.7.10.13');
  const state714={center:null,loadedRelease:null,loading:false,testErrors:[],testMode:new URLSearchParams(location.search).get(TEST_PARAM)==='1'};

  const esc=value=>typeof escapeHtml==='function'?escapeHtml(String(value??'')):String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast=(message,type='info')=>typeof showToast==='function'?showToast(message,type):console.info('[LS Connect]',message);
  const versionParts=v=>String(v||'0').split('.').map(x=>Number(x)||0);
  const versionGt=(a,b)=>{const A=versionParts(a),B=versionParts(b),n=Math.max(A.length,B.length);for(let i=0;i<n;i++){const x=A[i]||0,y=B[i]||0;if(x!==y)return x>y;}return false;};
  const dbReady=()=>typeof db!=='undefined'&&!!db&&typeof state!=='undefined'&&state.mode==='online';

  window.addEventListener('error',e=>{if(e?.error||e?.message)state714.testErrors.push(String(e.error?.stack||e.message||e.error));});
  window.addEventListener('unhandledrejection',e=>{state714.testErrors.push(String(e?.reason?.stack||e?.reason||'Unhandled rejection'));});

  function installStyles(){
    if(document.getElementById('v071014-release-styles'))return;
    const s=document.createElement('style');s.id='v071014-release-styles';s.textContent=`
      .v071014-release-head{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}.v071014-release-card{padding:12px;border:1px solid var(--border);border-radius:13px;background:var(--panel-2)}
      .v071014-release-card small{display:block;color:var(--muted);margin-bottom:4px}.v071014-release-card strong{font-size:1.05rem}.v071014-release-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}
      .v071014-progress{height:9px;background:rgba(148,163,184,.16);border-radius:999px;overflow:hidden;margin:8px 0 4px}.v071014-progress>i{display:block;height:100%;background:var(--accent);width:0}
      .v071014-test-groups{display:grid;gap:12px}.v071014-test-group{border:1px solid var(--border);border-radius:13px;overflow:hidden}.v071014-test-group>h4{margin:0;padding:10px 12px;background:var(--panel-2);border-bottom:1px solid var(--border)}
      .v071014-test-row{display:grid;grid-template-columns:minmax(160px,1fr) 116px minmax(140px,1fr) 76px;gap:8px;align-items:center;padding:9px 11px;border-bottom:1px solid var(--border)}.v071014-test-row:last-child{border-bottom:0}.v071014-test-row small{color:var(--muted)}
      .v071014-status{font-size:.72rem;font-weight:900;text-transform:uppercase;letter-spacing:.04em}.v071014-status.pass{color:#22c55e}.v071014-status.fail{color:#ef4444}.v071014-status.pending{color:#f59e0b}.v071014-status.skipped{color:#94a3b8}
      .v071014-test-banner{position:fixed;z-index:10000;left:50%;top:8px;transform:translateX(-50%);display:flex;gap:9px;align-items:center;padding:8px 12px;border:1px solid #f59e0b;border-radius:999px;background:#241806;color:#fde68a;box-shadow:0 8px 24px rgba(0,0,0,.3);font-size:.78rem;font-weight:850}.v071014-test-banner button{padding:3px 8px;border-radius:999px}
      .v071014-warning{padding:10px 12px;border:1px solid #f59e0b;border-radius:12px;background:rgba(245,158,11,.08);color:#fbbf24}.v071014-success{padding:10px 12px;border:1px solid #22c55e;border-radius:12px;background:rgba(34,197,94,.08)}
      @media(max-width:760px){.v071014-release-head{grid-template-columns:1fr}.v071014-test-row{grid-template-columns:1fr 110px}.v071014-test-row input{grid-column:1/-1}.v071014-test-row button{width:100%}}
    `;document.head.appendChild(s);
  }

  async function rpc(name,args={}){if(!dbReady())throw new Error('Release Center benötigt Online-Modus.');const {data,error}=await db.rpc(name,args);if(error)throw error;return data;}
  async function isAdmin(){try{return !!(await rpc('my_admin_status'));}catch{return false;}}

  function releaseScriptUrl(version,file,revision){const q=new URLSearchParams({version,file,v:revision||version});return `/api/script?${q.toString()}`;}
  async function loadReleasePayload(release){
    if(!release||!release.version||!Array.isArray(release.script_files)||!release.script_files.length)return false;
    if(state714.loadedRelease===release.version)return true;
    if(state714.loading)return false;state714.loading=true;
    try{
      for(const file of release.script_files){
        const signature=`${release.version}:${file}`;
        if([...document.scripts].some(s=>s.dataset?.lsReleaseFile===signature))continue;
        await new Promise((resolve,reject)=>{const s=document.createElement('script');s.dataset.lsReleaseFile=signature;s.src=releaseScriptUrl(release.version,file,release.revision);s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error(`Release-Modul konnte nicht geladen werden: ${file}`));document.head.appendChild(s);});
      }
      state714.loadedRelease=release.version;window.__LS_CONNECT_DYNAMIC_RELEASE__=release.version;window.__LS_CONNECT_RELEASE_CHANNEL__=release.channel;window.__LS_CONNECT_RUNTIME_VERSION__=release.version;
      if(release.channel==='candidate')installTestBanner(release);
      console.info(`[LS Connect] ${release.channel} payload v${release.version} loaded`);return true;
    }finally{state714.loading=false;}
  }

  function installTestBanner(release){
    document.getElementById('v071014TestBanner')?.remove();
    const b=document.createElement('div');b.id='v071014TestBanner';b.className='v071014-test-banner';b.innerHTML=`🧪 TESTMODUS · v${esc(release.version)} <button type="button" class="small-button" data-v071014-exit-test>Beenden</button>`;document.body.appendChild(b);
    b.querySelector('[data-v071014-exit-test]')?.addEventListener('click',()=>{const u=new URL(location.href);u.searchParams.delete(TEST_PARAM);location.href=u.toString();});
  }

  async function resolveReleaseChannel(){
    if(!dbReady())return false;
    if(state714.testMode){
      if(!(await isAdmin())){toast('Der Testbereich ist nur für Administratoren verfügbar.','error');return false;}
      const release=await rpc('release_current_v071014',{p_channel:'candidate'});if(!release)throw new Error('Kein Candidate registriert.');return loadReleasePayload(release);
    }
    const release=await rpc('release_current_v071014',{p_channel:'stable'});if(!release)return false;
    if(versionGt(release.version,BOOTSTRAP_VERSION)&&Array.isArray(release.script_files)&&release.script_files.length)return loadReleasePayload(release);
    return true;
  }

  async function releaseCenterData(){state714.center=await rpc('release_center_v071014');return state714.center;}
  function groupedTests(tests){const map=new Map();for(const t of tests||[]){if(!map.has(t.category))map.set(t.category,[]);map.get(t.category).push(t);}return map;}
  function progressInfo(tests){const required=(tests||[]).filter(t=>t.required),passed=required.filter(t=>t.status==='pass').length;return {passed,total:required.length,percent:required.length?Math.round(passed/required.length*100):0,blocked:required.filter(t=>t.status!=='pass').length};}

  function testRow(t){return `<div class="v071014-test-row" data-test-key="${esc(t.key)}"><div><strong>${esc(t.label)}</strong><small class="v071014-status ${esc(t.status)}">${esc(t.status)}</small></div><select data-v071014-test-status><option value="pending"${t.status==='pending'?' selected':''}>Offen</option><option value="pass"${t.status==='pass'?' selected':''}>Bestanden</option><option value="fail"${t.status==='fail'?' selected':''}>Fehler</option><option value="skipped"${t.status==='skipped'?' selected':''}>Übersprungen</option></select><input data-v071014-test-note maxlength="500" placeholder="Notiz…" value="${esc(t.note||'')}"><button type="button" class="small-button" data-v071014-save-test>Speichern</button></div>`;}

  async function renderReleaseCenter(){
    const pane=document.getElementById('adminReleasePaneV071014');if(!pane)return;
    try{
      const data=await releaseCenterData(),stable=data?.stable||{},candidate=data?.candidate||{},tests=data?.tests||[],p=progressInfo(tests),groups=groupedTests(tests);
      pane.innerHTML=`<h3>Release Center</h3><p class="notification-note">Patches werden zuerst als Candidate getestet. Erst nach bestandener Pflichtmatrix kann die Version global auf Stable geschaltet werden.</p>
      <div class="v071014-release-head"><div class="v071014-release-card"><small>GLOBAL STABLE</small><strong>v${esc(stable.version||'—')}</strong><small>${stable.previous_version?`Rollback-Ziel: v${esc(stable.previous_version)}`:'Kein Rollback-Ziel gesetzt'}</small></div><div class="v071014-release-card"><small>TEST CANDIDATE</small><strong>v${esc(candidate.version||'—')}</strong><small>${esc(candidate.status||'—')} · ${esc(candidate.revision||'ohne Revision')}</small></div></div>
      <div class="v071014-progress"><i style="width:${p.percent}%"></i></div><p class="notification-note">${p.passed}/${p.total} Pflichtprüfungen bestanden · ${p.blocked} offen/blockierend</p>
      ${p.blocked?`<div class="v071014-warning">Globale Freigabe bleibt gesperrt, bis alle Pflichtprüfungen auf „Bestanden“ stehen.</div>`:`<div class="v071014-success">Alle Pflichtprüfungen bestanden. Der Candidate kann global freigegeben werden.</div>`}
      <div class="v071014-release-actions"><button type="button" class="primary-button" data-v071014-open-test>🧪 Testbereich öffnen</button><button type="button" class="small-button" data-v071014-auto-tests>Automatische Checks</button><button type="button" class="small-button" data-v071014-refresh>Aktualisieren</button><button type="button" class="primary-button" data-v071014-promote ${p.blocked?'disabled':''}>🚀 Für alle freigeben</button>${stable.previous_version?'<button type="button" class="small-button" data-v071014-rollback>↩ Rollback</button>':''}</div>
      <div class="v071014-test-groups">${[...groups.entries()].map(([cat,rows])=>`<section class="v071014-test-group"><h4>${esc(cat)}</h4>${rows.map(testRow).join('')}</section>`).join('')}</div>`;
      bindReleaseCenterActions(pane,data,p);
    }catch(error){pane.innerHTML=`<h3>Release Center</h3><p class="v071014-warning">${esc(error?.message||error)}</p>`;}
  }

  function openTestArea(){const u=new URL(location.href);u.searchParams.set(TEST_PARAM,'1');u.hash='release-test';window.open(u.toString(),'_blank','noopener');}
  async function saveTest(row){const id=state714.center?.candidate?.candidate_id,key=row?.dataset?.testKey;if(!id||!key)return;const status=row.querySelector('[data-v071014-test-status]')?.value||'pending',note=row.querySelector('[data-v071014-test-note]')?.value||null;await rpc('release_set_test_result_v071014',{p_candidate_id:id,p_test_key:key,p_status:status,p_note:note,p_details:{runtime_version:window.__LS_CONNECT_RUNTIME_VERSION__||null,user_agent:navigator.userAgent,viewport:`${innerWidth}x${innerHeight}`}});await renderReleaseCenter();}

  async function autoTests(){
    const id=state714.center?.candidate?.candidate_id;if(!id)throw new Error('Kein Candidate aktiv.');
    const results={};
    results.startup=document.readyState==='complete'||document.readyState==='interactive';
    results.connection=dbReady();
    results.admin_panel=!!document.querySelector('.admin-tabs');
    if(typeof V071012_PRESETS!=='undefined'&&typeof v071012ApplyPreset==='function'){
      const keys=['lsclassic','classic','violet','midnight','graphite','emerald','sunset'],old=typeof v071012CurrentPreset==='function'?v071012CurrentPreset():'classic';
      for(const key of keys){try{results[`theme_${key}`]=!!V071012_PRESETS[key]&&v071012ApplyPreset(key,{saveLocal:false})===key;}catch{results[`theme_${key}`]=false;}}
      let stress=true;try{for(let i=0;i<200;i++)v071012ApplyPreset(keys[i%keys.length],{saveLocal:false});v071012ApplyPreset(old,{saveLocal:false});}catch{stress=false;}results.theme_stress=stress;
    }
    results.console=state714.testErrors.length===0;
    for(const [key,ok] of Object.entries(results)){
      const exists=(state714.center?.tests||[]).some(t=>t.key===key);if(!exists)continue;
      await rpc('release_set_test_result_v071014',{p_candidate_id:id,p_test_key:key,p_status:ok?'pass':'fail',p_note:ok?'Automatischer Check bestanden.':`Automatischer Check fehlgeschlagen${key==='console'&&state714.testErrors.length?': '+state714.testErrors[0].slice(0,300):'.'}`,p_details:{automatic:true,runtime_version:window.__LS_CONNECT_RUNTIME_VERSION__||null}});
    }
    toast('Automatische Release-Checks abgeschlossen.','success');await renderReleaseCenter();
  }

  function bindReleaseCenterActions(pane,data,p){
    pane.querySelector('[data-v071014-open-test]')?.addEventListener('click',openTestArea);
    pane.querySelector('[data-v071014-refresh]')?.addEventListener('click',renderReleaseCenter);
    pane.querySelector('[data-v071014-auto-tests]')?.addEventListener('click',async e=>{e.currentTarget.disabled=true;try{await autoTests();}catch(error){toast(error?.message||String(error),'error');}finally{e.currentTarget.disabled=false;}});
    pane.querySelectorAll('[data-v071014-save-test]').forEach(btn=>btn.addEventListener('click',async()=>{btn.disabled=true;try{await saveTest(btn.closest('[data-test-key]'));toast('Testergebnis gespeichert.','success');}catch(error){toast(error?.message||String(error),'error');}finally{btn.disabled=false;}}));
    pane.querySelector('[data-v071014-promote]')?.addEventListener('click',async e=>{if(p.blocked)return;const version=data?.candidate?.version;if(!confirm(`v${version} wirklich für alle Nutzer freigeben?\n\nAktueller Stable: v${data?.stable?.version}`))return;e.currentTarget.disabled=true;try{const result=await rpc('release_promote_candidate_v071014',{p_candidate_id:data.candidate.candidate_id});toast(`v${result.version} wurde global freigegeben.`,'success');await renderReleaseCenter();}catch(error){toast(error?.message||String(error),'error');}finally{e.currentTarget.disabled=false;}});
    pane.querySelector('[data-v071014-rollback]')?.addEventListener('click',async e=>{if(!confirm(`Stable wirklich auf v${data?.stable?.previous_version} zurücksetzen?`))return;e.currentTarget.disabled=true;try{const result=await rpc('release_rollback_v071014');toast(`Rollback auf v${result.version} abgeschlossen.`,'success');await renderReleaseCenter();}catch(error){toast(error?.message||String(error),'error');}finally{e.currentTarget.disabled=false;}});
  }

  function installAdminPane(){
    if(typeof els==='undefined'||!els.modalContent||document.getElementById('adminReleaseTabV071014'))return;
    const tabs=els.modalContent.querySelector('.admin-tabs');if(!tabs)return;
    const tab=document.createElement('button');tab.id='adminReleaseTabV071014';tab.className='admin-tab';tab.type='button';tab.textContent='Tester / Releases';tabs.appendChild(tab);
    const pane=document.createElement('section');pane.id='adminReleasePaneV071014';pane.className='settings-block admin-tab-pane hidden';pane.innerHTML='<p class="notification-note">Release Center wird geladen…</p>';els.modalContent.appendChild(pane);
    tab.addEventListener('click',()=>{tabs.querySelectorAll('.admin-tab').forEach(x=>x.classList.remove('active'));els.modalContent.querySelectorAll('.admin-tab-pane').forEach(x=>x.classList.add('hidden'));tab.classList.add('active');pane.classList.remove('hidden');renderReleaseCenter();});
  }

  if(typeof openAdminModal==='function'){
    const base=openAdminModal;
    openAdminModal=async function openAdminModalV071014(){const result=await base.apply(this,arguments);installAdminPane();return result;};
  }

  function boot(attempt=0){
    installStyles();installAdminPane();
    if(dbReady()){resolveReleaseChannel().catch(error=>{console.error('[LS Connect] Release channel failed',error);if(state714.testMode)toast(error?.message||String(error),'error');});return;}
    if(attempt<20)setTimeout(()=>boot(attempt+1),250);
  }
  boot();
  console.info('[LS Connect] v0.7.10.14 Release Center active');
})();
