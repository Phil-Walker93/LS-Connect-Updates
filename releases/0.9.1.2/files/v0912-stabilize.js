/* LS Connect v0.9.1.2 – Recovery & Stabilization runtime */
(function v0912Stabilize(){
  if(window.__LS_CONNECT_V0912_STABILIZE__) return;
  window.__LS_CONNECT_V0912_STABILIZE__=true;

  const VERSION='0.9.1.2';
  const STYLE_ID='v0912-recovery-style';
  const VALID_FILTERS=new Set(['all','communication','community','account','admin']);

  function removeKnownRegressionArtifacts(){
    document.getElementById('v07112-r3-style')?.remove();
    document.getElementById('v07112-r4-style')?.remove();
    document.getElementById('v0911-live-layout-style')?.remove();

    document.querySelectorAll('.v0801-nav-deck').forEach(node=>node.remove());
    document.querySelectorAll('.v0801-active-section').forEach(node=>node.remove());
    document.querySelectorAll('.v0801-filter-hidden').forEach(node=>node.classList.remove('v0801-filter-hidden'));

    const sidebar=document.querySelector('.sidebar');
    if(sidebar){
      const filter=sidebar.dataset.v0801Filter;
      if(filter&&!VALID_FILTERS.has(filter)) delete sidebar.dataset.v0801Filter;
      else delete sidebar.dataset.v0801Filter;
    }
    try{sessionStorage.removeItem('ls-connect-v0801-nav-filter');}catch{}
  }

  function installStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html[data-ls-connect-redesign='080'] .app-shell{min-width:0!important}
      html[data-ls-connect-redesign='080'] .sidebar,
      html[data-ls-connect-redesign='080'] .conversation-panel,
      html[data-ls-connect-redesign='080'] .profile-panel,
      html[data-ls-connect-redesign='080'] .messages{min-width:0!important}
      html[data-ls-connect-redesign='080'] .conversation-panel{overflow:hidden}
      html[data-ls-connect-redesign='080'] .message-bubble{max-width:min(82%,760px)}
      @media(max-width:900px){
        html[data-ls-connect-redesign='080'] .message-bubble{max-width:88%}
      }
      .v0801-filter-hidden{display:revert!important}
    `;
    document.head.appendChild(style);
  }

  function normalizeDuplicateIds(){
    const seen=new Set();
    document.querySelectorAll('[id]').forEach(node=>{
      const id=node.id;
      if(!id) return;
      if(!seen.has(id)){seen.add(id);return;}
      if(id.startsWith('v0801')||id.startsWith('v0911')) node.removeAttribute('id');
    });
  }

  function markVersion(){
    document.documentElement.dataset.lsVersion=VERSION;
    window.__LS_CONNECT_RUNTIME_VERSION__=VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=VERSION;
  }

  function refresh(){
    removeKnownRegressionArtifacts();
    installStyles();
    normalizeDuplicateIds();
    markVersion();
  }

  let timer=0;
  const observer=new MutationObserver(mutations=>{
    if(!mutations.some(m=>m.addedNodes.length||m.removedNodes.length)) return;
    clearTimeout(timer);
    timer=setTimeout(refresh,80);
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.__LS_CONNECT_V0912_RECOVERY_OBSERVER__=observer;

  refresh();
  [150,500,1200,2500,5000].forEach(ms=>setTimeout(refresh,ms));
  console.info('[LS Connect] v0.9.1.2 recovery stabilization active');
})();
