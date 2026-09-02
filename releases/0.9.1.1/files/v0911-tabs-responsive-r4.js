/* LS Connect v0.9.1.1 – functional tabs + narrow responsive layout r4 */
(function installLsConnectTabsResponsiveR4(){
  if(window.__LS_CONNECT_V0911_TABS_R4__) return;
  window.__LS_CONNECT_V0911_TABS_R4__=true;

  const root=document.documentElement;
  root.dataset.lsTabsFix='r4';
  const mq=window.matchMedia('(max-width:760px)');
  let currentTab='all';
  let mobilePane='sidebar';

  const style=document.createElement('style');
  style.id='v0911-tabs-responsive-r4-style';
  style.textContent=`
    html[data-ls-tabs-fix='r4'] .ls-r4-tab-hidden{display:none!important}
    html[data-ls-tabs-fix='r4'] .v0801-filter-hidden{display:revert!important}
    html[data-ls-tabs-fix='r4'] .v0801-active-section{display:block!important;min-height:13px}
    html[data-ls-tabs-fix='r4'] .sidebar[data-ls-nav-tab='all'] .v0801-active-section{display:none!important}
    html[data-ls-tabs-fix='r4'] .ls-r4-nav-drawer{box-sizing:border-box!important}
    html[data-ls-tabs-fix='r4'] .ls-r4-drawer-section-hidden{display:none!important}
    html[data-ls-tabs-fix='r4'] .ls-r4-mobile-back{display:none}

    @media(max-width:760px){
      html[data-ls-tabs-fix='r4'] body{overflow:hidden!important}
      html[data-ls-tabs-fix='r4'] .app-shell{
        display:block!important;position:relative!important;width:100%!important;max-width:100%!important;min-width:0!important;
        overflow:hidden!important;padding:0!important;gap:0!important;
      }
      html[data-ls-tabs-fix='r4'] .sidebar,
      html[data-ls-tabs-fix='r4'] .conversation-panel,
      html[data-ls-tabs-fix='r4'] .profile-panel{
        position:absolute!important;inset:0!important;width:100%!important;min-width:0!important;max-width:100%!important;
        height:100%!important;max-height:100%!important;margin:0!important;transform:none!important;border-radius:0!important;
      }
      html[data-ls-tabs-fix='r4'][data-ls-mobile-pane='sidebar'] .conversation-panel,
      html[data-ls-tabs-fix='r4'][data-ls-mobile-pane='sidebar'] .profile-panel{display:none!important}
      html[data-ls-tabs-fix='r4'][data-ls-mobile-pane='conversation'] .sidebar,
      html[data-ls-tabs-fix='r4'][data-ls-mobile-pane='conversation'] .profile-panel{display:none!important}
      html[data-ls-tabs-fix='r4'][data-ls-mobile-pane='profile'] .sidebar,
      html[data-ls-tabs-fix='r4'][data-ls-mobile-pane='profile'] .conversation-panel{display:none!important}
      html[data-ls-tabs-fix='r4'][data-ls-mobile-pane='sidebar'] .sidebar,
      html[data-ls-tabs-fix='r4'][data-ls-mobile-pane='conversation'] .conversation-panel,
      html[data-ls-tabs-fix='r4'][data-ls-mobile-pane='profile'] .profile-panel{display:flex!important;flex-direction:column!important}

      html[data-ls-tabs-fix='r4'] .v0801-nav-deck{margin:10px 12px 8px!important;padding:5px!important;gap:4px!important;grid-template-columns:repeat(5,minmax(0,1fr))!important}
      html[data-ls-tabs-fix='r4'] .v0801-nav-filter{min-height:50px!important;padding:5px 2px!important}
      html[data-ls-tabs-fix='r4'] .v0801-nav-filter-icon{font-size:13px!important}
      html[data-ls-tabs-fix='r4'] .v0801-nav-filter-label{display:block!important;max-width:42px!important;font-size:8px!important;line-height:1.05!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
      html[data-ls-tabs-fix='r4'] .v0801-nav-filter-count{font-size:7px!important;min-width:14px!important}
      html[data-ls-tabs-fix='r4'] .v0801-active-section{margin:8px 22px 5px!important;font-size:10px!important}

      html[data-ls-tabs-fix='r4'] .ls-r4-nav-drawer{
        position:absolute!important;z-index:1000!important;left:10px!important;right:10px!important;top:84px!important;bottom:10px!important;
        width:auto!important;min-width:0!important;max-width:none!important;height:auto!important;max-height:none!important;
        margin:0!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain!important;
        transform:none!important;border-radius:16px!important;box-shadow:0 22px 60px rgba(0,0,0,.45)!important;
      }
      html[data-ls-tabs-fix='r4'] .ls-r4-nav-drawer button,
      html[data-ls-tabs-fix='r4'] .ls-r4-nav-drawer a{max-width:100%!important;box-sizing:border-box!important}
      html[data-ls-tabs-fix='r4'] .ls-r4-mobile-back{
        display:inline-flex!important;align-items:center;justify-content:center;flex:0 0 auto;min-width:38px;min-height:38px;margin-right:8px;
        border:1px solid rgba(148,163,184,.14);border-radius:11px;background:rgba(255,255,255,.04);color:#dbeafe;font-weight:900;cursor:pointer
      }
      html[data-ls-tabs-fix='r4'] .chat-header,
      html[data-ls-tabs-fix='r4'] .conversation-header,
      html[data-ls-tabs-fix='r4'] .profile-header{width:100%!important;min-width:0!important;box-sizing:border-box!important}
      html[data-ls-tabs-fix='r4'] .messages{width:100%!important;max-width:100%!important}
    }
  `;
  document.head.appendChild(style);

  const norm=el=>String(el?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
  const topChild=(el,sidebar)=>{
    let node=el;
    while(node&&node.parentElement&&node.parentElement!==sidebar) node=node.parentElement;
    return node&&node.parentElement===sidebar?node:null;
  };
  const markBlock=(el,sidebar,group)=>{
    const block=topChild(el,sidebar);
    if(block&&block!==sidebar.querySelector('.v0801-nav-deck')) block.dataset.lsR4Group=group;
  };

  function tagSidebarBlocks(sidebar){
    sidebar.querySelectorAll('.ls-r4-tab-hidden').forEach(el=>el.classList.remove('ls-r4-tab-hidden'));
    sidebar.querySelectorAll('[data-ls-r4-group]').forEach(el=>delete el.dataset.lsR4Group);

    sidebar.querySelectorAll('.chat-item').forEach(el=>markBlock(el,sidebar,'chat'));
    sidebar.querySelectorAll('.channel-item').forEach(el=>markBlock(el,sidebar,'community'));

    sidebar.querySelectorAll('input,textarea').forEach(el=>{
      const p=String(el.getAttribute('placeholder')||'').toLowerCase();
      if(/chat|nachricht/.test(p)) markBlock(el,sidebar,'chat');
    });

    const elements=[...sidebar.querySelectorAll('button,a,div,section,header,h1,h2,h3,h4,span')];
    for(const el of elements){
      const text=norm(el);
      if(!text||text.length>90) continue;
      if(text==='chats'||text==='chat') markBlock(el,sidebar,'chat');
      if(/^(unternehmenskanäle|unternehmenskanale|kanäle entdecken|kanale entdecken|status\s*\/\s*stories|stories|community)$/.test(text)) markBlock(el,sidebar,'community');
    }
  }

  function setTaggedVisibility(sidebar,tab){
    sidebar.querySelectorAll('[data-ls-r4-group]').forEach(block=>{
      const group=block.dataset.lsR4Group;
      const hide=(tab==='communication'&&group==='community')||(tab==='community'&&group==='chat')||((tab==='account'||tab==='admin')&&(group==='chat'||group==='community'));
      block.classList.toggle('ls-r4-tab-hidden',hide);
    });
  }

  function findDrawer(sidebar){
    const candidates=[...sidebar.querySelectorAll('div,section,nav,aside')].filter(el=>{
      const t=norm(el);
      return t.includes('rufnummernweiterleitung')&&t.includes('charakter erstellen');
    });
    candidates.sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length);
    return candidates[0]||null;
  }

  function drawerSectionForText(text){
    if(/verwaltung|admin|moderation|system|audit/.test(text)) return 'admin';
    if(/charakter|konto|account|profil|einstellung|design/.test(text)) return 'account';
    if(/kommunikation|kontakt|gruppe|rufnummer|kanal/.test(text)) return 'communication';
    if(/community|story|feed|forum/.test(text)) return 'community';
    return '';
  }

  function tagDrawerSections(drawer){
    drawer.querySelectorAll('[data-ls-r4-drawer-section]').forEach(el=>delete el.dataset.lsR4DrawerSection);
    const headings=[...drawer.querySelectorAll('h1,h2,h3,h4,h5,strong,div,span')].filter(el=>{
      const t=norm(el);
      return t&&t.length<45&&!!drawerSectionForText(t);
    });
    for(const heading of headings){
      let node=heading;
      while(node&&node.parentElement&&node.parentElement!==drawer) node=node.parentElement;
      if(node&&node.parentElement===drawer){
        const group=drawerSectionForText(norm(heading));
        if(group&&!node.dataset.lsR4DrawerSection) node.dataset.lsR4DrawerSection=group;
      }
    }
  }

  function filterDrawer(drawer,tab){
    if(!drawer) return;
    drawer.classList.add('ls-r4-nav-drawer');
    tagDrawerSections(drawer);
    const sections=[...drawer.querySelectorAll(':scope > [data-ls-r4-drawer-section]')];
    const wanted=tab==='account'?'account':tab==='admin'?'admin':'';
    const matches=wanted&&sections.some(el=>el.dataset.lsR4DrawerSection===wanted);
    sections.forEach(section=>section.classList.toggle('ls-r4-drawer-section-hidden',!!matches&&section.dataset.lsR4DrawerSection!==wanted));
  }

  function drawerOpen(sidebar){
    const drawer=findDrawer(sidebar);
    if(drawer&&getComputedStyle(drawer).display!=='none') return drawer;
    return null;
  }

  function candidateMenuTriggers(sidebar){
    const buttons=[...sidebar.querySelectorAll('button,[role="button"]')].filter(el=>!el.closest('.v0801-nav-deck'));
    const preferred=buttons.filter(el=>{
      const text=norm(el), aria=String(el.getAttribute('aria-label')||el.getAttribute('title')||'').toLowerCase();
      return /^\.{3}$|^…$|^•••$/.test(text)||/menü|menu|option|einstellung|navigation/.test(aria);
    });
    const rect=sidebar.getBoundingClientRect();
    const corner=buttons.filter(el=>{
      const r=el.getBoundingClientRect();
      return r.width>0&&r.width<=60&&r.height>0&&r.height<=60&&r.left<rect.left+70&&r.bottom>rect.bottom-90;
    });
    return [...new Set([...preferred,...corner])];
  }

  function ensureDrawerFor(tab){
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar) return;
    const existing=drawerOpen(sidebar);
    if(existing){filterDrawer(existing,tab);return;}
    const triggers=candidateMenuTriggers(sidebar);
    let index=0;
    const tryNext=()=>{
      const open=drawerOpen(sidebar);
      if(open){filterDrawer(open,tab);return;}
      const trigger=triggers[index++];
      if(!trigger) return;
      trigger.click();
      setTimeout(tryNext,90);
    };
    tryNext();
  }

  function closeDrawerIfOpen(){
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar) return;
    const drawer=drawerOpen(sidebar);
    if(!drawer) return;
    const close=[...drawer.querySelectorAll('button,[role="button"]')].find(el=>{
      const t=norm(el), aria=String(el.getAttribute('aria-label')||el.getAttribute('title')||'').toLowerCase();
      return t==='×'||t==='✕'||/schließen|close/.test(aria);
    });
    close?.click();
  }

  function applyTab(tab,{openDrawer=true}={}){
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar) return;
    currentTab=['all','communication','community','account','admin'].includes(tab)?tab:'all';
    sidebar.dataset.lsNavTab=currentTab;
    sidebar.dataset.v0801Filter='all';
    try{sessionStorage.setItem('ls-connect-v0801-nav-filter','all');}catch{}
    sidebar.querySelectorAll('.v0801-filter-hidden').forEach(el=>el.classList.remove('v0801-filter-hidden'));
    tagSidebarBlocks(sidebar);
    setTaggedVisibility(sidebar,currentTab);

    sidebar.querySelectorAll('[data-v0801-filter-button]').forEach(button=>{
      const active=button.dataset.v0801FilterButton===currentTab;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',active?'true':'false');
    });
    const title=sidebar.querySelector('[data-v0801-active-section]');
    if(title){
      title.textContent=currentTab==='communication'?'Chats':currentTab==='community'?'Community':currentTab==='account'?'Konto':currentTab==='admin'?'Verwaltung':'';
    }

    if(currentTab==='account'||currentTab==='admin'){
      if(openDrawer) setTimeout(()=>ensureDrawerFor(currentTab),20);
    }else{
      const drawer=drawerOpen(sidebar);
      if(drawer) drawer.querySelectorAll('.ls-r4-drawer-section-hidden').forEach(el=>el.classList.remove('ls-r4-drawer-section-hidden'));
      if(currentTab==='all'||currentTab==='communication'||currentTab==='community') closeDrawerIfOpen();
    }
  }

  function setMobilePane(pane){
    mobilePane=['sidebar','conversation','profile'].includes(pane)?pane:'sidebar';
    root.dataset.lsMobilePane=mobilePane;
    if(!mq.matches) return;
    const target=document.querySelector(mobilePane==='sidebar'?'.sidebar':mobilePane==='conversation'?'.conversation-panel':'.profile-panel');
    target?.scrollTo?.({top:0,behavior:'auto'});
  }

  function ensureBackButton(panel,pane){
    if(!panel||panel.querySelector('.ls-r4-mobile-back')) return;
    const header=panel.querySelector('.chat-header,.conversation-header,.profile-header,header');
    if(!header) return;
    const button=document.createElement('button');
    button.type='button';
    button.className='ls-r4-mobile-back';
    button.setAttribute('aria-label','Zurück zur Übersicht');
    button.textContent='‹';
    button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();setMobilePane(pane==='profile'?'conversation':'sidebar');});
    header.prepend(button);
  }

  function syncResponsive(){
    root.dataset.lsTabsFix='r4';
    if(mq.matches){
      root.dataset.lsMobilePane=mobilePane;
      ensureBackButton(document.querySelector('.conversation-panel'),'conversation');
      ensureBackButton(document.querySelector('.profile-panel'),'profile');
    }else{
      delete root.dataset.lsMobilePane;
    }
    const drawer=document.querySelector('.sidebar')?findDrawer(document.querySelector('.sidebar')):null;
    if(drawer) filterDrawer(drawer,currentTab);
  }

  document.addEventListener('click',event=>{
    const tabButton=event.target.closest?.('[data-v0801-filter-button]');
    if(tabButton&&tabButton.closest('.v0801-nav-deck')){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      applyTab(tabButton.dataset.v0801FilterButton||'all');
      return;
    }

    if(mq.matches&&event.target.closest?.('.chat-item,.channel-item')){
      setTimeout(()=>setMobilePane('conversation'),40);
    }

    if(event.target.closest?.('button,[role="button"]')){
      setTimeout(()=>{
        const sidebar=document.querySelector('.sidebar');
        const drawer=sidebar?drawerOpen(sidebar):null;
        if(drawer) filterDrawer(drawer,currentTab);
      },70);
    }
  },true);

  mq.addEventListener?.('change',syncResponsive);
  window.addEventListener('resize',syncResponsive,{passive:true});
  window.addEventListener('pageshow',()=>{applyTab(currentTab,{openDrawer:false});syncResponsive();},{passive:true});

  [0,180,600,1500,3200].forEach(delay=>setTimeout(()=>{
    const sidebar=document.querySelector('.sidebar');
    if(sidebar){
      if(delay===0){
        const old=sidebar.dataset.v0801Filter;
        currentTab=['communication','community','account','admin'].includes(old)?old:'all';
      }
      applyTab(currentTab,{openDrawer:false});
    }
    syncResponsive();
  },delay));

  console.info('[LS Connect] functional tabs + narrow responsive layout r4 active');
})();
