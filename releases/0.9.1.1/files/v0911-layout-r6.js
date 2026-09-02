/* LS Connect v0.9.1.1 – chat bubble + settings overlay stabilization r6 */
(function installLsConnectLayoutR6(){
  if(window.__LS_CONNECT_V0911_LAYOUT_R6__) return;
  window.__LS_CONNECT_V0911_LAYOUT_R6__=true;

  const root=document.documentElement;
  root.dataset.lsLayoutR6='1';

  const style=document.createElement('style');
  style.id='v0911-layout-r6-style';
  style.textContent=`
    html[data-ls-layout-r6='1'] .conversation-panel{
      min-width:0!important;overflow:hidden!important;
    }
    html[data-ls-layout-r6='1'] .messages{
      display:flex!important;flex-direction:column!important;align-items:stretch!important;
      gap:2px!important;min-width:0!important;min-height:0!important;box-sizing:border-box!important;
    }
    html[data-ls-layout-r6='1'] .message-row{
      display:flex!important;flex:0 0 auto!important;align-items:flex-end!important;
      width:100%!important;min-width:0!important;height:auto!important;min-height:0!important;max-height:none!important;
      margin:5px 0!important;padding:0!important;box-sizing:border-box!important;
    }
    html[data-ls-layout-r6='1'] .message-row.out{justify-content:flex-end!important}
    html[data-ls-layout-r6='1'] .message-row.in,
    html[data-ls-layout-r6='1'] .message-row:not(.out){justify-content:flex-start!important}

    html[data-ls-layout-r6='1'] .message-row > .message-bubble,
    html[data-ls-layout-r6='1'] .message-bubble{
      position:relative!important;display:block!important;flex:0 1 auto!important;align-self:auto!important;
      width:auto!important;min-width:0!important;height:auto!important;min-height:0!important;max-height:none!important;
      max-width:min(680px,72%)!important;margin:0!important;padding:10px 13px!important;
      border-radius:16px!important;box-sizing:border-box!important;overflow:visible!important;
      white-space:pre-wrap!important;overflow-wrap:anywhere!important;word-break:break-word!important;line-height:1.45!important;
    }
    html[data-ls-layout-r6='1'] .message-bubble > *{
      min-width:0!important;min-height:0!important;max-width:100%!important;box-sizing:border-box!important;
    }
    html[data-ls-layout-r6='1'] .message-bubble p,
    html[data-ls-layout-r6='1'] .message-bubble [class*='message-text'],
    html[data-ls-layout-r6='1'] .message-bubble [class*='message-content']{
      width:auto!important;height:auto!important;min-height:0!important;margin-top:0!important;margin-bottom:0!important;
    }

    /* Legacy action bars were stretching the whole bubble into large cards. */
    html[data-ls-layout-r6='1'] .message-bubble .message-actions,
    html[data-ls-layout-r6='1'] .message-bubble [class*='message-actions']{
      position:static!important;inset:auto!important;display:flex!important;flex:0 0 auto!important;flex-wrap:wrap!important;
      justify-content:flex-end!important;align-items:center!important;gap:8px!important;
      width:auto!important;min-width:0!important;max-width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;
      margin:7px 0 0!important;padding:0!important;border:0!important;border-radius:0!important;
      background:transparent!important;box-shadow:none!important;backdrop-filter:none!important;
    }
    html[data-ls-layout-r6='1'] .message-bubble .message-actions button,
    html[data-ls-layout-r6='1'] .message-bubble [class*='message-actions'] button{
      width:auto!important;min-width:0!important;height:auto!important;min-height:0!important;margin:0!important;padding:2px 0!important;
      border:0!important;background:transparent!important;box-shadow:none!important;
    }
    html[data-ls-layout-r6='1'] .message-bubble .message-time,
    html[data-ls-layout-r6='1'] .message-bubble .timestamp,
    html[data-ls-layout-r6='1'] .message-bubble [class*='message-meta']{
      position:static!important;inset:auto!important;display:block!important;
      width:auto!important;min-width:0!important;height:auto!important;min-height:0!important;max-height:none!important;
      margin:6px 0 0!important;padding:0!important;background:transparent!important;
    }
    html[data-ls-layout-r6='1'] .message-bubble [class*='reaction']{
      min-height:0!important;height:auto!important;
    }

    /* Settings/utility content must overlay the sidebar instead of changing chat geometry. */
    html[data-ls-layout-r6='1'] .sidebar{position:relative!important;min-width:0!important;overflow:hidden!important}
    html[data-ls-layout-r6='1'] .ls-r6-utility-drawer{
      position:absolute!important;z-index:1600!important;
      left:8px!important;right:8px!important;top:var(--ls-r6-drawer-top,170px)!important;bottom:8px!important;
      width:auto!important;min-width:0!important;max-width:none!important;height:auto!important;min-height:0!important;max-height:none!important;
      margin:0!important;padding-bottom:10px!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain!important;
      border:1px solid rgba(148,163,184,.16)!important;border-radius:16px!important;
      background:rgba(8,15,27,.985)!important;box-shadow:0 22px 58px rgba(0,0,0,.46)!important;backdrop-filter:blur(18px)!important;
      contain:layout paint!important;
    }
    html[data-ls-layout-r6='1'] [data-ls-r5-persistent='1']{z-index:1700!important}

    @media(max-width:900px){
      html[data-ls-layout-r6='1'] .message-row > .message-bubble,
      html[data-ls-layout-r6='1'] .message-bubble{max-width:82%!important}
    }
    @media(max-width:700px){
      html[data-ls-layout-r6='1'] .messages{gap:1px!important}
      html[data-ls-layout-r6='1'] .message-row{margin:4px 0!important}
      html[data-ls-layout-r6='1'] .message-row > .message-bubble,
      html[data-ls-layout-r6='1'] .message-bubble{max-width:90%!important;padding:9px 11px!important}
      html[data-ls-layout-r6='1'] .ls-r6-utility-drawer{left:7px!important;right:7px!important;bottom:7px!important;border-radius:15px!important}
    }
  `;
  document.head.appendChild(style);

  const norm=el=>String(el?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();

  function findSidebar(){return document.querySelector('.sidebar');}

  function findGear(sidebar){
    if(!sidebar) return null;
    const buttons=[...sidebar.querySelectorAll('button,[role="button"]')].filter(el=>!el.closest('.v0801-nav-deck'));
    return buttons.find(el=>{
      const text=norm(el);
      const aria=String(el.getAttribute('aria-label')||el.getAttribute('title')||'').toLowerCase();
      return text==='⚙'||text==='⚙️'||/einstellungen|settings|menü|menu/.test(aria);
    })||null;
  }

  function findUtilityDrawer(sidebar){
    if(!sidebar) return null;
    const candidates=[...sidebar.querySelectorAll('div,section,nav,aside')].filter(el=>{
      if(el.classList.contains('v0801-nav-deck')) return false;
      const t=norm(el);
      return (t.includes('charakter erstellen')&&t.includes('gruppe erstellen'))||
             (t.includes('rufnummernweiterleitung')&&t.includes('kontakte'))||
             (t.includes('unternehmenskanäle')&&t.includes('kontakte & anfragen')&&t.includes('charakter'));
    });
    candidates.sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length);
    return candidates[0]||null;
  }

  function computeDrawerTop(sidebar,drawer){
    const sr=sidebar.getBoundingClientRect();
    const dr=drawer.getBoundingClientRect();
    const deck=sidebar.querySelector('.v0801-nav-deck');
    const active=sidebar.querySelector('[data-v0801-active-section]');
    let top=dr.height>0?dr.top-sr.top:0;
    const minFromHeader=Math.max(
      150,
      deck?deck.getBoundingClientRect().bottom-sr.top+8:0,
      active?active.getBoundingClientRect().bottom-sr.top+8:0
    );
    if(!Number.isFinite(top)||top<minFromHeader||top>sr.height*.72) top=minFromHeader;
    return Math.min(Math.max(Math.round(top),150),Math.max(150,Math.round(sr.height-180)));
  }

  function pinDrawer(){
    const sidebar=findSidebar();
    const drawer=findUtilityDrawer(sidebar);
    if(!sidebar||!drawer) return false;
    if(!drawer.classList.contains('ls-r6-utility-drawer')){
      const top=computeDrawerTop(sidebar,drawer);
      sidebar.style.setProperty('--ls-r6-drawer-top',`${top}px`);
      drawer.classList.add('ls-r6-utility-drawer');
    }
    return true;
  }

  function schedulePin(){[0,40,100,220,500].forEach(ms=>setTimeout(pinDrawer,ms));}

  document.addEventListener('click',event=>{
    const sidebar=findSidebar();
    if(!sidebar||!sidebar.contains(event.target)) return;
    const gear=findGear(sidebar);
    if(gear&&(event.target===gear||gear.contains(event.target))) schedulePin();
    if(event.target.closest?.('[data-v0801-filter-button="account"],[data-v0801-filter-button="admin"]')) schedulePin();
  },true);

  window.addEventListener('resize',()=>{
    const sidebar=findSidebar();
    const drawer=findUtilityDrawer(sidebar);
    if(!sidebar||!drawer||!drawer.classList.contains('ls-r6-utility-drawer')) return;
    const top=computeDrawerTop(sidebar,drawer);
    sidebar.style.setProperty('--ls-r6-drawer-top',`${top}px`);
  },{passive:true});

  [0,120,420,1100,2600].forEach(ms=>setTimeout(pinDrawer,ms));
  console.info('[LS Connect] v0.9.1.1 layout stabilization r6 active');
})();
