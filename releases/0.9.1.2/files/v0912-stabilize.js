/* LS Connect v0.9.1.2 – Recovery & Stabilization runtime */
(function v0912Stabilize(){
  if(window.__LS_CONNECT_V0912_STABILIZE__) return;
  window.__LS_CONNECT_V0912_STABILIZE__=true;

  const VERSION='0.9.1.2';
  const STYLE_ID='v0912-recovery-style';

  function removeStyle(id){document.getElementById(id)?.remove();}

  function restoreHeaderActions(){
    document.querySelectorAll('.v0802-overflow-source').forEach(node=>node.classList.remove('v0802-overflow-source'));
    document.querySelectorAll('.v0802-header-overflow').forEach(node=>node.remove());
  }

  function restoreSettingsAndAdmin(){
    document.querySelectorAll('.v0804-settings-hidden').forEach(node=>node.classList.remove('v0804-settings-hidden'));
    document.querySelectorAll('.v0804-settings-nav').forEach(node=>node.remove());
    document.querySelectorAll('[data-v0804-category]').forEach(node=>delete node.dataset.v0804Category);
    document.querySelectorAll('[data-v0804-filter]').forEach(node=>delete node.dataset.v0804Filter);
    document.querySelectorAll('#modalContent,.modal-content').forEach(root=>delete root.dataset.v0804Filter);
  }

  function restoreSidebar(){
    document.querySelectorAll('.v0801-nav-deck').forEach(node=>node.remove());
    document.querySelectorAll('.v0801-active-section').forEach(node=>node.remove());
    document.querySelectorAll('.v0801-filter-hidden').forEach(node=>node.classList.remove('v0801-filter-hidden'));
    const sidebar=document.querySelector('.sidebar');
    if(sidebar) delete sidebar.dataset.v0801Filter;
    try{sessionStorage.removeItem('ls-connect-v0801-nav-filter');}catch{}
  }

  function clearBlockedLayerMarkers(){
    delete document.documentElement.dataset.v0802Workspace;
    delete document.documentElement.dataset.v0804Admin;
    delete document.documentElement.dataset.v0805Mobile;
    delete document.documentElement.dataset.v0806A11y;
  }

  function removeKnownRegressionArtifacts(){
    [
      'v07112-r3-style','v07112-r4-style','v0801-navigation-style','v0802-workspace-style',
      'v0804-settings-admin-style','v0805-mobile-style','v0806-performance-a11y-style',
      'v0911-live-layout-style'
    ].forEach(removeStyle);
    restoreSidebar();
    restoreHeaderActions();
    restoreSettingsAndAdmin();
    clearBlockedLayerMarkers();
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
      html[data-ls-connect-redesign='080'] .message-bubble{max-width:min(82%,760px)}
      @media(max-width:900px){html[data-ls-connect-redesign='080'] .message-bubble{max-width:88%}}
      .v0801-filter-hidden,.v0802-overflow-source,.v0804-settings-hidden{display:revert!important}
    `;
    document.head.appendChild(style);
  }

  function normalizeDuplicateIds(){
    const seen=new Set();
    document.querySelectorAll('[id]').forEach(node=>{
      const id=node.id;
      if(!id) return;
      if(!seen.has(id)){seen.add(id);return;}
      if(/^v08|^v0911/.test(id)) node.removeAttribute('id');
    });
  }

  function markVersion(){
    document.documentElement.dataset.lsVersion=VERSION;
    document.documentElement.dataset.lsRecoveryMode='1';
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
  console.info('[LS Connect] v0.9.1.2 recovery stabilization r2 active');
})();
