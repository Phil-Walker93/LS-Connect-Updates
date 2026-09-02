/* LS Connect v0.9.1.1 – source-aware quick-settings containment r10
 * Root cause: the legacy v0.7.9.5 quick panel is valid on its own, but r6 turns
 * it into an absolute sidebar overlay while the persistent gear control remains
 * at the sidebar bottom. Without reserving the gear's real footprint, the
 * overlay scroll area runs underneath that control and visually clips/overlaps
 * the following quick groups. This patch changes only that quick panel.
 */
(function installLsConnectSettingsR10(){
  if(window.__LS_CONNECT_V0911_SETTINGS_R10__) return;
  window.__LS_CONNECT_V0911_SETTINGS_R10__=true;

  const root=document.documentElement;
  root.dataset.lsSettingsFix='r10';

  const style=document.createElement('style');
  style.id='v0911-settings-r10-style';
  style.textContent=`
    /* Scope every rule to the original v0.7.9.5 quick panel. */
    html[data-ls-settings-fix='r10'] .sidebar-actions.v0795-quick-panel.ls-r10-settings-drawer{
      left:8px!important;
      right:8px!important;
      bottom:var(--ls-r10-drawer-bottom,8px)!important;
      box-sizing:border-box!important;
      overflow-x:hidden!important;
      overflow-y:auto!important;
      overscroll-behavior:contain!important;
      scrollbar-gutter:stable!important;
      scroll-padding:10px 0 14px!important;
      padding-bottom:12px!important;
    }

    /* v0.7.9.5 created these groups in normal flow. Restore exactly that flow;
       do not touch buttons/modals/chat/sidebar structures outside this panel. */
    html[data-ls-settings-fix='r10'] .sidebar-actions.v0795-quick-panel.ls-r10-settings-drawer > .v0795-quick-group{
      position:relative!important;
      inset:auto!important;
      float:none!important;
      clear:both!important;
      display:grid!important;
      grid-template-columns:minmax(0,1fr)!important;
      grid-auto-flow:row!important;
      grid-auto-rows:max-content!important;
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
    html[data-ls-settings-fix='r10'] .sidebar-actions.v0795-quick-panel.ls-r10-settings-drawer > .v0795-quick-group:last-child{
      margin-bottom:0!important;
    }
    html[data-ls-settings-fix='r10'] .sidebar-actions.v0795-quick-panel.ls-r10-settings-drawer > .v0795-quick-group > .v0795-quick-group-title{
      position:static!important;
      inset:auto!important;
      float:none!important;
      display:flex!important;
      width:100%!important;
      min-width:0!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      margin:0!important;
      padding:1px 3px 4px!important;
      box-sizing:border-box!important;
      transform:none!important;
    }
    html[data-ls-settings-fix='r10'] .sidebar-actions.v0795-quick-panel.ls-r10-settings-drawer > .v0795-quick-group > .ghost-button,
    html[data-ls-settings-fix='r10'] .sidebar-actions.v0795-quick-panel.ls-r10-settings-drawer > .v0795-quick-group > button{
      position:relative!important;
      inset:auto!important;
      float:none!important;
      width:100%!important;
      min-width:0!important;
      max-width:100%!important;
      height:auto!important;
      min-height:44px!important;
      max-height:none!important;
      margin:0!important;
      box-sizing:border-box!important;
      transform:none!important;
    }

    /* The settings trigger owns its own reserved footer lane. */
    html[data-ls-settings-fix='r10'] .ls-r10-settings-trigger{
      z-index:1800!important;
    }

    @media(max-width:760px){
      html[data-ls-settings-fix='r10'] .sidebar-actions.v0795-quick-panel.ls-r10-settings-drawer{
        left:7px!important;
        right:7px!important;
        border-radius:15px!important;
      }
    }
  `;
  document.head.appendChild(style);

  const norm=el=>String(el?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();

  function getSidebar(){ return document.querySelector('.sidebar'); }

  function getDrawer(sidebar){
    if(!sidebar) return null;
    /* Exact source component first; compatibility classes only confirm that r6
       has already promoted it to the overlay layer. */
    return sidebar.querySelector('.sidebar-actions.v0795-quick-panel');
  }

  function getGear(sidebar,drawer){
    if(!sidebar) return null;
    const buttons=[...sidebar.querySelectorAll('button,[role="button"]')]
      .filter(el=>!drawer?.contains(el)&&!el.closest('.v0801-nav-deck'));

    let gear=buttons.find(el=>{
      const label=`${el.getAttribute('aria-label')||''} ${el.getAttribute('title')||''}`.toLowerCase();
      const text=norm(el);
      return text==='⚙'||text==='⚙️'||/einstellungen|settings/.test(label);
    });

    if(!gear){
      const sr=sidebar.getBoundingClientRect();
      gear=buttons.find(el=>{
        const r=el.getBoundingClientRect();
        return r.width>0&&r.width<=64&&r.height>0&&r.height<=64&&r.left<sr.left+72&&r.bottom>sr.bottom-96;
      })||null;
    }
    return gear;
  }

  function clearLegacyInline(group){
    if(!group) return;
    for(const el of [group,group.querySelector(':scope > .v0795-quick-group-title')].filter(Boolean)){
      for(const prop of ['position','top','right','bottom','left','inset','float','transform','height','max-height']){
        if(el.style?.getPropertyValue(prop)) el.style.removeProperty(prop);
      }
    }
  }

  function syncLayout(){
    const sidebar=getSidebar();
    const drawer=getDrawer(sidebar);
    if(!sidebar||!drawer) return false;

    drawer.classList.add('ls-r10-settings-drawer');
    drawer.querySelectorAll(':scope > .v0795-quick-group').forEach(clearLegacyInline);

    const gear=getGear(sidebar,drawer);
    let reserve=8;
    if(gear){
      gear.classList.add('ls-r10-settings-trigger');
      const sr=sidebar.getBoundingClientRect();
      const gr=gear.getBoundingClientRect();
      /* Reserve the actual rendered footprint, not a guessed fixed height. */
      if(gr.height>0&&gr.bottom>sr.top&&gr.top<sr.bottom){
        reserve=Math.max(8,Math.ceil(sr.bottom-gr.top+8));
      }
    }

    /* Cap only against pathological stale rectangles; the drawer itself keeps
       r6's top coordinate and therefore cannot affect chat/app-shell geometry. */
    const maxReserve=Math.max(8,Math.floor(sidebar.getBoundingClientRect().height*.28));
    reserve=Math.min(reserve,maxReserve);
    sidebar.style.setProperty('--ls-r10-drawer-bottom',`${reserve}px`);
    return true;
  }

  let raf=0;
  function schedule(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(syncLayout);
    [40,120,260].forEach(ms=>setTimeout(syncLayout,ms));
  }

  document.addEventListener('click',event=>{
    const sidebar=getSidebar();
    if(sidebar&&sidebar.contains(event.target)) schedule();
  },true);
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('orientationchange',schedule,{passive:true});
  window.addEventListener('pageshow',schedule,{passive:true});
  window.addEventListener('ls-connect-baseline-ready',schedule,{once:true});

  schedule();
  console.info('[LS Connect] v0.9.1.1 quick-settings containment r10 active');
})();
