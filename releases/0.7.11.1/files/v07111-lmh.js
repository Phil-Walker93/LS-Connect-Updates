/* LS Connect v0.7.11.1 – LS Mobile Hub return bridge */
(function lmhReturnBridge(){
  if(window.__LS_CONNECT_LMH_RETURN_BRIDGE__)return;
  window.__LS_CONNECT_LMH_RETURN_BRIDGE__=true;

  const HUB_URL='https://ls-mobile-hub.vercel.app';
  const BUTTON_ID='lsConnectBackToHub';
  const STYLE_ID='lsConnectBackToHubStyles';

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      #${BUTTON_ID}{position:fixed;top:max(12px,env(safe-area-inset-top));left:max(12px,env(safe-area-inset-left));z-index:2147483000;display:inline-flex;align-items:center;gap:7px;min-height:38px;padding:8px 12px;border:1px solid rgba(148,163,184,.35);border-radius:999px;background:rgba(15,23,42,.92);color:#f8fafc;text-decoration:none;font:700 13px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.01em;box-shadow:0 8px 24px rgba(0,0,0,.28);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);transition:transform .15s ease,background .15s ease,border-color .15s ease}
      #${BUTTON_ID}:hover{transform:translateY(-1px);background:rgba(30,41,59,.96);border-color:rgba(148,163,184,.6)}
      #${BUTTON_ID}:focus-visible{outline:2px solid #38bdf8;outline-offset:2px}
      @media(max-width:520px){#${BUTTON_ID}{top:max(8px,env(safe-area-inset-top));left:max(8px,env(safe-area-inset-left));min-height:34px;padding:7px 10px;font-size:12px}}
    `;
    document.head.appendChild(style);
  }

  function installButton(){
    if(!document.body||document.getElementById(BUTTON_ID))return;
    installStyle();
    const link=document.createElement('a');
    link.id=BUTTON_ID;
    link.href=HUB_URL;
    link.setAttribute('aria-label','Zurück zum LS Mobile Hub');
    link.innerHTML='<span aria-hidden="true">‹</span><span>Zurück zum Handy</span>';
    document.body.appendChild(link);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installButton,{once:true});
  else installButton();

  const observer=new MutationObserver(()=>installButton());
  observer.observe(document.documentElement,{childList:true,subtree:true});

  console.info('[LS Connect] LMH-Rückweg aktiv');
})();
