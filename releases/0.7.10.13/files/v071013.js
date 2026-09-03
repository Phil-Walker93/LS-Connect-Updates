/* LS Connect v0.7.10.13 – online bootstrap wrapper + atomic stable UI gate */
(function installOnlineBaselineGate(){
  if(window.__LS_CONNECT_ONLINE_BASELINE_GATE__)return;
  window.__LS_CONNECT_ONLINE_BASELINE_GATE__=true;

  const root=document.documentElement;
  const STYLE_ID='lsConnectBaselineGateStyle';
  const GATE_ID='lsConnectBaselineGate';
  root.dataset.lsBaselineBooting='1';

  if(!document.getElementById(STYLE_ID)){
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html[data-ls-baseline-booting='1'] .app-shell{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
      #${GATE_ID}{position:fixed;z-index:2147483640;inset:0;display:grid;place-items:center;padding:24px;background:#07101d;color:#e6edf7;font:600 14px/1.4 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-align:center}
      #${GATE_ID} .ls-baseline-card{display:grid;justify-items:center;gap:12px;max-width:320px}
      #${GATE_ID} .ls-baseline-spinner{width:30px;height:30px;border:3px solid rgba(148,163,184,.22);border-top-color:#38bdf8;border-radius:50%;animation:lsBaselineSpin .8s linear infinite}
      #${GATE_ID} small{color:#8493aa;font-weight:500}
      @keyframes lsBaselineSpin{to{transform:rotate(360deg)}}
      @media(prefers-reduced-motion:reduce){#${GATE_ID} .ls-baseline-spinner{animation-duration:1.6s}}
    `;
    document.head.appendChild(style);
  }

  const installGate=()=>{
    if(!document.body||document.getElementById(GATE_ID))return;
    const gate=document.createElement('div');
    gate.id=GATE_ID;
    gate.setAttribute('role','status');
    gate.setAttribute('aria-live','polite');
    gate.innerHTML='<div class="ls-baseline-card"><div class="ls-baseline-spinner" aria-hidden="true"></div><strong>LS Connect wird vorbereitet…</strong><small>Aktuelle Oberfläche wird geladen</small></div>';
    document.body.appendChild(gate);
  };
  if(document.body)installGate();
  else document.addEventListener('DOMContentLoaded',installGate,{once:true});

  let revealed=false;
  window.__LS_CONNECT_REVEAL_BASELINE__=function revealLsConnectBaseline(reason='ready'){
    if(revealed)return;
    revealed=true;
    delete root.dataset.lsBaselineBooting;
    root.dataset.lsBaselineReveal=String(reason);
    document.getElementById(GATE_ID)?.remove();
  };
  window.addEventListener('ls-connect-baseline-ready',()=>window.__LS_CONNECT_REVEAL_BASELINE__('ready'),{once:true});
  window.addEventListener('ls-connect-baseline-error',()=>window.__LS_CONNECT_REVEAL_BASELINE__('baseline-error'),{once:true});

  /* Do not delay a real login/auth gate if there is no active messenger session. */
  setTimeout(()=>{
    if(revealed)return;
    const text=String(document.body?.innerText||'').slice(0,3500).toLowerCase();
    const authLikely=/\b(anmelden|einloggen|login)\b/.test(text)&&!document.querySelector('.chat-item,.channel-item');
    if(authLikely)window.__LS_CONNECT_REVEAL_BASELINE__('auth-gate');
  },3500);

  /* Last-resort safety: never leave the user behind the loading gate forever. */
  setTimeout(()=>window.__LS_CONNECT_REVEAL_BASELINE__?.('timeout'),12000);
})();

(async()=>{
  if(window.__LS_CONNECT_V071013_BOOTSTRAP__)return;
  window.__LS_CONNECT_V071013_BOOTSTRAP__=true;
  const load=(src,key)=>new Promise((resolve,reject)=>{
    if([...document.scripts].some(s=>s.dataset?.lsBootstrapKey===key)){resolve();return;}
    const script=document.createElement('script');script.dataset.lsBootstrapKey=key;script.src=src;script.async=false;script.onload=resolve;script.onerror=()=>reject(new Error(`LS Connect Bootstrap-Modul konnte nicht geladen werden: ${key}`));document.head.appendChild(script);
  });
  try{
    await load('/api/script?version=0.7.10.13&file=v071013-core.js&v=0.7.10.13-core1','v071013-core');
    await load('/api/script?version=0.7.10.14&file=v071014.js&v=0.7.10.14-r1','v071014-release-center');
    await load('/api/script?version=0.7.10.14&file=v071014-meta.js&v=0.7.10.14-meta1','v071014-release-meta');
    await load('/api/script?version=0.7.10.14&file=v071014-lmh.js&v=0.7.10.14-lmh2','lmh-return');
    await load('/api/script?version=0.9.1.3&file=v0913-layout-r3.js&v=online-gear-r3','v0913-layout-r3');
    await load('/api/script?version=0.9.1.4&file=v0914.js&v=online-org-context-r1','v0914-org-context');
    console.info('[LS Connect] Online Release Center bootstrap active');
  }catch(error){
    console.error('[LS Connect] Release Center bootstrap failed',error);
    window.__LS_CONNECT_REVEAL_BASELINE__?.('bootstrap-error');
  }
})();
