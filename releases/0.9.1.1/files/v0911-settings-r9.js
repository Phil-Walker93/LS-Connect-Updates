/* LS Connect v0.9.1.1 – settings drawer recovery r9
 * Fixes the gear/quick-settings drawer on narrow screens: section headers and
 * buttons must stay in normal document flow and must never overlap each other.
 */
(function installLsConnectSettingsR9(){
  if(window.__LS_CONNECT_V0911_SETTINGS_R9__) return;
  window.__LS_CONNECT_V0911_SETTINGS_R9__=true;

  const root=document.documentElement;
  root.dataset.lsSettingsR9='1';

  const style=document.createElement('style');
  style.id='v0911-settings-r9-style';
  style.textContent=`
    html[data-ls-settings-r9='1'] .ls-r6-utility-drawer,
    html[data-ls-settings-r9='1'] .ls-r5-utility-drawer{
      box-sizing:border-box!important;
      overflow-x:hidden!important;
      overflow-y:auto!important;
      overscroll-behavior:contain!important;
      scrollbar-gutter:stable!important;
      scroll-padding-block:10px!important;
    }

    /* The old quick-settings groups occasionally inherit sticky/absolute
       positioning from legacy mobile layers. Force a single clean flow. */
    html[data-ls-settings-r9='1'] .ls-r9-settings-drawer.v0795-quick-panel,
    html[data-ls-settings-r9='1'] .ls-r9-settings-drawer .v0795-quick-panel{
      display:block!important;
      align-content:start!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
    }
    html[data-ls-settings-r9='1'] .ls-r9-settings-drawer > .v0795-quick-group,
    html[data-ls-settings-r9='1'] .ls-r9-settings-drawer .v0795-quick-group{
      position:relative!important;
      inset:auto!important;
      float:none!important;
      clear:both!important;
      display:grid!important;
      grid-template-columns:minmax(0,1fr)!important;
      grid-auto-flow:row!important;
      grid-auto-rows:max-content!important;
      align-items:stretch!important;
      align-content:start!important;
      gap:7px!important;
      width:100%!important;
      min-width:0!important;
      max-width:100%!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      margin:0 0 10px!important;
      padding:9px!important;
      box-sizing:border-box!important;
      overflow:visible!important;
      transform:none!important;
    }
    html[data-ls-settings-r9='1'] .ls-r9-settings-drawer .v0795-quick-group:last-of-type{
      margin-bottom:0!important;
    }
    html[data-ls-settings-r9='1'] .ls-r9-settings-drawer .v0795-quick-group-title{
      position:static!important;
      inset:auto!important;
      z-index:auto!important;
      float:none!important;
      display:flex!important;
      align-items:center!important;
      width:100%!important;
      min-width:0!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      margin:0!important;
      padding:1px 3px 4px!important;
      box-sizing:border-box!important;
      transform:none!important;
      overflow:visible!important;
    }
    html[data-ls-settings-r9='1'] .ls-r9-settings-drawer .v0795-quick-group > button,
    html[data-ls-settings-r9='1'] .ls-r9-settings-drawer .v0795-quick-group > .ghost-button,
    html[data-ls-settings-r9='1'] .ls-r9-settings-drawer .v0795-quick-group > [role='button']{
      position:relative!important;
      inset:auto!important;
      float:none!important;
      display:flex!important;
      align-items:center!important;
      width:100%!important;
      min-width:0!important;
      max-width:100%!important;
      min-height:44px!important;
      height:auto!important;
      max-height:none!important;
      margin:0!important;
      box-sizing:border-box!important;
      transform:none!important;
    }

    /* Prevent a second scrolling context inside the gear panel. */
    html[data-ls-settings-r9='1'] .ls-r9-settings-drawer .v0795-quick-group,
    html[data-ls-settings-r9='1'] .ls-r9-settings-drawer .v0795-quick-group *{
      scroll-margin-top:8px;
    }

    @media(max-width:760px){
      html[data-ls-settings-r9='1'] .ls-r9-settings-drawer{
        left:7px!important;
        right:7px!important;
        bottom:7px!important;
        min-height:0!important;
      }
      html[data-ls-settings-r9='1'] .ls-r9-settings-drawer .v0795-quick-group{
        margin-bottom:9px!important;
        padding:9px!important;
      }
    }
  `;
  document.head.appendChild(style);

  function findDrawer(){
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar) return null;
    return sidebar.querySelector('.ls-r6-utility-drawer,.ls-r5-utility-drawer,.sidebar-actions.v0795-quick-panel');
  }

  function repair(){
    const drawer=findDrawer();
    if(!drawer) return false;
    drawer.classList.add('ls-r9-settings-drawer');

    drawer.querySelectorAll('.v0795-quick-group,.v0795-quick-group-title').forEach(el=>{
      /* Clear only legacy positioning overrides; sizing/visual theme stays CSS-driven. */
      for(const prop of ['position','top','right','bottom','left','inset','float','transform','height','max-height']){
        if(el.style?.getPropertyValue(prop)) el.style.removeProperty(prop);
      }
    });
    return true;
  }

  function scheduleRepair(){
    [0,32,90,180,360].forEach(ms=>setTimeout(repair,ms));
  }

  document.addEventListener('click',event=>{
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar||!sidebar.contains(event.target)) return;
    scheduleRepair();
  },true);
  window.addEventListener('resize',scheduleRepair,{passive:true});
  window.addEventListener('orientationchange',scheduleRepair,{passive:true});
  window.addEventListener('ls-connect-baseline-ready',scheduleRepair,{once:true});

  scheduleRepair();
  console.info('[LS Connect] v0.9.1.1 settings drawer recovery r9 active');
})();
