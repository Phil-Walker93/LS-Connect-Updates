/* LS Connect v0.9.1.1 – live layout hotfix */
(function v0911LiveLayoutHotfix(){
  if(window.__LS_CONNECT_V0911_LIVE_LAYOUT__) return;
  window.__LS_CONNECT_V0911_LIVE_LAYOUT__=true;

  const VERSION='0.9.1.1';
  const STYLE_ID='v0911-live-layout-style';

  function installStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html[data-ls-connect-redesign='080'] .v0801-nav-deck,
      html[data-ls-connect-redesign='080'] .v0801-active-section{
        display:none!important;
      }
      html[data-ls-connect-redesign='080'] .v0801-filter-hidden{
        display:revert!important;
      }
      @media(min-width:901px){
        html[data-ls-connect-redesign='080'] .app-shell{
          grid-template-columns:minmax(260px,300px) minmax(0,1fr) minmax(270px,310px)!important;
          width:100%!important;
          max-width:none!important;
          min-width:0!important;
        }
        html[data-ls-connect-redesign='080'] .sidebar,
        html[data-ls-connect-redesign='080'] .conversation-panel,
        html[data-ls-connect-redesign='080'] .profile-panel{
          min-width:0!important;
          max-width:none!important;
        }
        html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-bubble{
          max-width:min(82%,760px)!important;
        }
      }
      html[data-ls-connect-redesign='080'] .conversation-panel{
        overflow:hidden!important;
      }
      html[data-ls-connect-redesign='080'] .messages{
        min-width:0!important;
      }
    `;
    document.head.appendChild(style);
  }

  function normalizeSidebar(){
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar) return;
    sidebar.dataset.v0801Filter='all';
    sidebar.querySelectorAll('.v0801-filter-hidden').forEach(el=>el.classList.remove('v0801-filter-hidden'));
    sidebar.querySelectorAll('[data-v0801-filter-button]').forEach(button=>{
      const active=button.dataset.v0801FilterButton==='all';
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',active?'true':'false');
    });
    try{sessionStorage.setItem('ls-connect-v0801-nav-filter','all');}catch{}
  }

  function markVersion(){
    document.documentElement.dataset.lsVersion=VERSION;
    window.__LS_CONNECT_RUNTIME_VERSION__=VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=VERSION;
  }

  function refresh(){
    installStyles();
    normalizeSidebar();
    markVersion();
  }

  let timer=0;
  new MutationObserver(mutations=>{
    if(!mutations.some(m=>m.addedNodes.length||m.removedNodes.length)) return;
    clearTimeout(timer);
    timer=setTimeout(refresh,120);
  }).observe(document.documentElement,{childList:true,subtree:true});

  refresh();
  [250,800,1800,3500].forEach(ms=>setTimeout(refresh,ms));
  console.info('[LS Connect] v0.9.1.1 live layout hotfix active');
})();
