/* LS Connect v0.9.1.1 – stable tabs, utilities and message sizing r5 */
(function installLsConnectTabsLayoutR5(){
  if(window.__LS_CONNECT_V0911_TABS_LAYOUT_R5__) return;
  window.__LS_CONNECT_V0911_TABS_LAYOUT_R5__=true;

  const root=document.documentElement;
  const TAB_IDS=['all','communication','community','account','admin'];
  const LABELS={all:'Übersicht',communication:'Chats',community:'Community',account:'Konto',admin:'Verwaltung'};
  const ICONS={all:'⌂',communication:'💬',community:'◫',account:'◎',admin:'⚙'};
  let currentTab='all';

  root.dataset.lsTabsFix='r5';

  const style=document.createElement('style');
  style.id='v0911-tabs-layout-r5-style';
  style.textContent=`
    html[data-ls-tabs-fix='r5'] .ls-r5-hidden{display:none!important}
    html[data-ls-tabs-fix='r5'] .v0801-filter-hidden,
    html[data-ls-tabs-fix='r5'] .ls-r4-tab-hidden{display:revert!important}

    html[data-ls-tabs-fix='r5'] .v0801-nav-deck{
      position:relative!important;top:auto!important;z-index:30!important;display:grid!important;
      grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important;margin:8px 10px 6px!important;padding:6px!important;
      border:1px solid rgba(148,163,184,.12)!important;border-radius:16px!important;background:rgba(6,13,24,.88)!important;
      box-shadow:none!important;overflow:hidden!important;backdrop-filter:blur(18px)!important;
    }
    html[data-ls-tabs-fix='r5'] .v0801-nav-filter{
      position:relative!important;min-width:0!important;min-height:48px!important;display:grid!important;place-items:center!important;gap:2px!important;
      padding:5px 2px!important;border:1px solid transparent!important;border-radius:12px!important;background:transparent!important;
      color:#8291a8!important;box-shadow:none!important;font:800 9px/1.08 system-ui,-apple-system,"Segoe UI",sans-serif!important;cursor:pointer!important;
      transition:background .14s ease,border-color .14s ease,color .14s ease,transform .14s ease!important;
    }
    html[data-ls-tabs-fix='r5'] .v0801-nav-filter:hover{color:#dbeafe!important;background:rgba(255,255,255,.04)!important}
    html[data-ls-tabs-fix='r5'] .v0801-nav-filter.active,
    html[data-ls-tabs-fix='r5'] .v0801-nav-filter[aria-pressed='true']{
      color:#7dd3fc!important;border-color:rgba(56,189,248,.28)!important;
      background:linear-gradient(180deg,rgba(56,189,248,.17),rgba(14,165,233,.08))!important;
      box-shadow:inset 0 0 0 1px rgba(125,211,252,.07)!important;transform:translateY(-1px)!important;
    }
    html[data-ls-tabs-fix='r5'] .v0801-nav-filter.active:after,
    html[data-ls-tabs-fix='r5'] .v0801-nav-filter[aria-pressed='true']:after{
      content:'';position:absolute;left:22%;right:22%;bottom:3px;height:2px;border-radius:999px;background:#38bdf8;
    }
    html[data-ls-tabs-fix='r5'] .v0801-nav-filter-icon{font-size:13px!important;line-height:1!important}
    html[data-ls-tabs-fix='r5'] .v0801-nav-filter-label{display:block!important;max-width:44px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    html[data-ls-tabs-fix='r5'] .v0801-nav-filter-count{min-width:15px!important;padding:1px 4px!important;border-radius:999px!important;background:rgba(148,163,184,.11)!important;font-size:7px!important;line-height:1.3!important}
    html[data-ls-tabs-fix='r5'] .v0801-nav-filter-count:empty{display:none!important}

    html[data-ls-tabs-fix='r5'] .v0801-active-section{
      display:block!important;min-height:14px!important;margin:8px 18px 7px!important;color:#7dd3fc!important;
      font-size:10px!important;font-weight:900!important;letter-spacing:.09em!important;text-transform:uppercase!important;
    }

    html[data-ls-tabs-fix='r5'] .sidebar{position:relative!important}
    html[data-ls-tabs-fix='r5'] [data-ls-r5-persistent='1']{
      display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:1200!important;
    }

    html[data-ls-tabs-fix='r5'] .ls-r5-utility-drawer{
      box-sizing:border-box!important;z-index:1000!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain!important;
    }
    html[data-ls-tabs-fix='r5'] .ls-r5-utility-hidden{display:none!important}

    /* Messenger sizing: short messages must never become giant cards. */
    html[data-ls-tabs-fix='r5'] .messages{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:10px!important}
    html[data-ls-tabs-fix='r5'] .message-row{
      display:flex!important;align-items:flex-end!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;
      margin:3px 0!important;box-sizing:border-box!important;
    }
    html[data-ls-tabs-fix='r5'] .message-row.out{justify-content:flex-end!important}
    html[data-ls-tabs-fix='r5'] .message-row.in,
    html[data-ls-tabs-fix='r5'] .message-row:not(.out){justify-content:flex-start!important}
    html[data-ls-tabs-fix='r5'] .message-bubble{
      display:block!important;flex:0 1 auto!important;width:fit-content!important;min-width:0!important;height:auto!important;min-height:0!important;max-height:none!important;
      max-width:min(62ch,64%)!important;padding:11px 13px!important;border-radius:16px!important;line-height:1.45!important;
      overflow-wrap:anywhere!important;word-break:break-word!important;box-sizing:border-box!important;
    }
    html[data-ls-tabs-fix='r5'] .message-bubble>*{max-width:100%!important}
    html[data-ls-tabs-fix='r5'] .message-actions,
    html[data-ls-tabs-fix='r5'] [class*='message-actions']{height:auto!important;min-height:0!important;margin-top:8px!important}
    html[data-ls-tabs-fix='r5'] .message-time,
    html[data-ls-tabs-fix='r5'] .timestamp,
    html[data-ls-tabs-fix='r5'] [class*='message-meta']{height:auto!important;min-height:0!important}

    @media(max-width:900px){
      html[data-ls-tabs-fix='r5'] .message-bubble{max-width:78%!important}
    }
    @media(max-width:760px){
      html[data-ls-tabs-fix='r5'] .v0801-nav-deck{margin:8px 12px 6px!important;padding:5px!important;gap:4px!important}
      html[data-ls-tabs-fix='r5'] .v0801-nav-filter{min-height:50px!important}
      html[data-ls-tabs-fix='r5'] .v0801-active-section{margin:7px 20px 6px!important}
      html[data-ls-tabs-fix='r5'] .message-bubble{max-width:86%!important;padding:10px 12px!important}
      html[data-ls-tabs-fix='r5'] .ls-r5-utility-drawer{
        position:absolute!important;left:8px!important;right:8px!important;top:var(--ls-r5-drawer-top,230px)!important;bottom:48px!important;
        width:auto!important;min-width:0!important;max-width:none!important;height:auto!important;max-height:none!important;margin:0!important;
        border-radius:16px!important;box-shadow:0 22px 60px rgba(0,0,0,.42)!important;
      }
    }
  `;
  document.head.appendChild(style);

  const norm=el=>String(el?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();

  function ensureDeck(sidebar){
    let deck=sidebar.querySelector('.v0801-nav-deck');
    if(!deck){
      deck=document.createElement('nav');
      deck.className='v0801-nav-deck';
      deck.setAttribute('aria-label','LS Connect Bereiche');
      const defs=[
        ['all','Alle'],['communication','Chats'],['community','Community'],['account','Konto'],['admin','Verwaltung']
      ];
      deck.innerHTML=defs.map(([id,label])=>`<button type="button" class="v0801-nav-filter" data-v0801-filter-button="${id}" aria-label="${label}"><span class="v0801-nav-filter-icon">${ICONS[id]}</span><span class="v0801-nav-filter-label">${label}</span><span class="v0801-nav-filter-count" data-v0801-count="${id}"></span></button>`).join('');
      sidebar.prepend(deck);
    }
    let title=sidebar.querySelector('[data-v0801-active-section]');
    if(!title){
      title=document.createElement('div');
      title.className='v0801-active-section';
      title.dataset.v0801ActiveSection='1';
      deck.insertAdjacentElement('afterend',title);
    }
    return deck;
  }

  function topChild(el,sidebar){
    let node=el;
    while(node&&node.parentElement&&node.parentElement!==sidebar) node=node.parentElement;
    return node&&node.parentElement===sidebar?node:null;
  }

  function clearLegacyHidden(sidebar){
    sidebar.querySelectorAll('.v0801-filter-hidden,.ls-r4-tab-hidden,.ls-r5-hidden').forEach(el=>{
      el.classList.remove('v0801-filter-hidden','ls-r4-tab-hidden','ls-r5-hidden');
    });
  }

  function tagSidebar(sidebar){
    sidebar.querySelectorAll('[data-ls-r5-group]').forEach(el=>delete el.dataset.lsR5Group);
    sidebar.querySelectorAll('.chat-item').forEach(el=>{const block=topChild(el,sidebar);if(block)block.dataset.lsR5Group='chat';});
    sidebar.querySelectorAll('.channel-item').forEach(el=>{const block=topChild(el,sidebar);if(block)block.dataset.lsR5Group='community';});
    sidebar.querySelectorAll('input,textarea').forEach(el=>{
      const p=String(el.getAttribute('placeholder')||'').toLowerCase();
      if(/chat|nachricht/.test(p)){const block=topChild(el,sidebar);if(block)block.dataset.lsR5Group='chat';}
    });
    [...sidebar.querySelectorAll('h1,h2,h3,h4,div,span,button')].forEach(el=>{
      const text=norm(el);
      if(!text||text.length>55)return;
      if(/^(chats|chat)$/.test(text)){const block=topChild(el,sidebar);if(block)block.dataset.lsR5Group='chat';}
      if(/^(unternehmenskanäle|unternehmenskanale|kanäle entdecken|kanale entdecken|status\s*\/\s*stories|stories)$/.test(text)){
        const block=topChild(el,sidebar);if(block)block.dataset.lsR5Group='community';
      }
    });
  }

  function findGear(sidebar){
    const buttons=[...sidebar.querySelectorAll('button,[role="button"]')].filter(el=>!el.closest('.v0801-nav-deck'));
    let gear=buttons.find(el=>{
      const t=norm(el),a=String(el.getAttribute('aria-label')||el.getAttribute('title')||'').toLowerCase();
      return t==='⚙'||t==='⚙️'||/einstellungen|settings|menü|menu/.test(a);
    });
    if(!gear){
      const sr=sidebar.getBoundingClientRect();
      gear=buttons.find(el=>{
        const r=el.getBoundingClientRect();
        return r.width>0&&r.width<=58&&r.height>0&&r.height<=58&&r.left<sr.left+65&&r.bottom>sr.bottom-85;
      });
    }
    if(gear){
      gear.dataset.lsR5Persistent='1';
      gear.classList.remove('v0801-filter-hidden','ls-r4-tab-hidden','ls-r5-hidden');
      let p=gear.parentElement;
      if(p&&p!==sidebar&&p.parentElement===sidebar){p.dataset.lsR5Persistent='1';p.classList.remove('v0801-filter-hidden','ls-r4-tab-hidden','ls-r5-hidden');}
    }
    return gear||null;
  }

  function updateCounts(sidebar){
    const counts={
      communication:sidebar.querySelectorAll('.chat-item').length,
      community:sidebar.querySelectorAll('.channel-item').length,
      account:0,admin:0
    };
    const drawer=findUtilityDrawer(sidebar);
    if(drawer){
      const txt=norm(drawer);
      counts.account=(txt.match(/charakter|profil|konto|design|einstellung/g)||[]).length;
      counts.admin=(txt.match(/admin|verwaltung|moderation|audit|system|rolle|berechtigung/g)||[]).length;
    }
    ['communication','community','account','admin'].forEach(id=>{
      const badge=sidebar.querySelector(`[data-v0801-count="${id}"]`);
      if(badge) badge.textContent=counts[id]?String(counts[id]):'';
    });
  }

  function applyContentVisibility(sidebar,tab){
    clearLegacyHidden(sidebar);
    tagSidebar(sidebar);
    sidebar.querySelectorAll('[data-ls-r5-group]').forEach(block=>{
      if(block.dataset.lsR5Persistent==='1') return;
      const group=block.dataset.lsR5Group;
      let hide=false;
      if(tab==='communication') hide=group==='community';
      else if(tab==='community') hide=group==='chat';
      else if(tab==='account'||tab==='admin') hide=group==='chat'||group==='community';
      block.classList.toggle('ls-r5-hidden',hide);
    });
  }

  function findUtilityDrawer(sidebar){
    const candidates=[...sidebar.querySelectorAll('div,section,nav,aside')].filter(el=>{
      const t=norm(el);
      return (t.includes('charakter erstellen')&&t.includes('gruppe erstellen'))||(t.includes('rufnummernweiterleitung')&&t.includes('kontakte'));
    });
    candidates.sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length);
    return candidates[0]||null;
  }

  function closeUtilityDrawer(sidebar){
    const drawer=findUtilityDrawer(sidebar);
    if(!drawer) return;
    drawer.querySelectorAll('.ls-r5-utility-hidden').forEach(el=>el.classList.remove('ls-r5-utility-hidden'));
    const close=[...drawer.querySelectorAll('button,[role="button"]')].find(el=>{
      const t=norm(el),a=String(el.getAttribute('aria-label')||el.getAttribute('title')||'').toLowerCase();
      return t==='×'||t==='✕'||/schließen|close/.test(a);
    });
    if(close) close.click();
  }

  function directSections(drawer){
    return [...drawer.children].filter(el=>!el.matches('script,style'));
  }

  function utilityKind(el){
    const t=norm(el).slice(0,1200);
    if(/admin|verwaltung|moderation|audit|release|systemverwaltung|rollen|berechtigungen/.test(t)) return 'admin';
    if(/charakter|profil|konto|account|design|darstellung|einstellung|sicherheit|passwort|hinweis|benachrichtigung/.test(t)) return 'account';
    if(/rufnummer|kontakt|gruppe|unternehmenskanal|kommunikation/.test(t)) return 'communication';
    if(/story|stories|community|feed|forum/.test(t)) return 'community';
    return '';
  }

  function positionDrawer(sidebar,drawer){
    if(!window.matchMedia('(max-width:760px)').matches) return;
    const sr=sidebar.getBoundingClientRect();
    let bottom=145;
    const children=[...sidebar.children];
    for(const child of children){
      if(child===drawer||child.dataset.lsR5Persistent==='1') continue;
      if(child.dataset.lsR5Group==='chat'||child.dataset.lsR5Group==='community') break;
      const r=child.getBoundingClientRect();
      if(r.height>0&&r.bottom<=sr.top+sr.height*.58) bottom=Math.max(bottom,r.bottom-sr.top);
    }
    root.style.setProperty('--ls-r5-drawer-top',`${Math.min(Math.max(165,Math.round(bottom+8)),Math.round(sr.height*.52))}px`);
  }

  function filterUtility(drawer,tab){
    drawer.classList.add('ls-r5-utility-drawer');
    const sections=directSections(drawer);
    sections.forEach(el=>el.classList.remove('ls-r5-utility-hidden'));
    const wanted=tab==='account'?'account':'admin';
    const classified=sections.map(el=>[el,utilityKind(el)]);
    const matches=classified.filter(([,kind])=>kind===wanted);
    if(matches.length){
      classified.forEach(([el,kind])=>{
        if(!kind) return;
        el.classList.toggle('ls-r5-utility-hidden',kind!==wanted);
      });
    }
  }

  function tryOpenAdminDestination(drawer){
    const button=[...drawer.querySelectorAll('button,a,[role="button"]')].find(el=>{
      const t=norm(el),a=String(el.getAttribute('aria-label')||el.getAttribute('title')||'').toLowerCase();
      return /verwaltung|admin|moderation|systemverwaltung|release center/.test(`${t} ${a}`);
    });
    if(button&&!button.dataset.lsR5AdminTried){
      button.dataset.lsR5AdminTried='1';
      button.click();
    }
  }

  function ensureUtility(tab){
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar) return;
    const ready=()=>{
      const drawer=findUtilityDrawer(sidebar);
      if(!drawer) return false;
      drawer.classList.remove('ls-r5-hidden','ls-r4-tab-hidden','v0801-filter-hidden');
      filterUtility(drawer,tab);
      positionDrawer(sidebar,drawer);
      updateCounts(sidebar);
      if(tab==='admin') setTimeout(()=>tryOpenAdminDestination(drawer),40);
      return true;
    };
    if(ready()) return;
    const gear=findGear(sidebar);
    if(gear){
      gear.click();
      [80,180,380].forEach(ms=>setTimeout(ready,ms));
    }
  }

  function applyTab(tab,{utility=true}={}){
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar) return;
    ensureDeck(sidebar);
    currentTab=TAB_IDS.includes(tab)?tab:'all';
    root.dataset.lsActiveTab=currentTab;
    sidebar.dataset.lsNavTab=currentTab;
    sidebar.dataset.v0801Filter='all';
    try{sessionStorage.setItem('ls-connect-r5-tab',currentTab);sessionStorage.setItem('ls-connect-v0801-nav-filter','all');}catch{}

    findGear(sidebar);
    applyContentVisibility(sidebar,currentTab);

    sidebar.querySelectorAll('[data-v0801-filter-button]').forEach(button=>{
      const active=button.dataset.v0801FilterButton===currentTab;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',active?'true':'false');
    });
    const title=sidebar.querySelector('[data-v0801-active-section]');
    if(title) title.textContent=LABELS[currentTab];

    if(currentTab==='account'||currentTab==='admin'){
      if(utility) setTimeout(()=>ensureUtility(currentTab),10);
    }else{
      closeUtilityDrawer(sidebar);
    }
    updateCounts(sidebar);
  }

  function installClicks(){
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar) return;
    const deck=ensureDeck(sidebar);
    if(deck.dataset.lsR5Bound==='1') return;
    deck.dataset.lsR5Bound='1';
    deck.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-v0801-filter-button]');
      if(!button) return;
      event.preventDefault();
      event.stopPropagation();
      applyTab(button.dataset.v0801FilterButton||'all');
    });
  }

  function boot(){
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar) return;
    installClicks();
    let saved='all';
    try{saved=sessionStorage.getItem('ls-connect-r5-tab')||'all';}catch{}
    if(!TAB_IDS.includes(saved)) saved='all';
    applyTab(saved,{utility:false});
  }

  window.addEventListener('pageshow',()=>setTimeout(boot,30),{passive:true});
  window.addEventListener('resize',()=>{
    const sidebar=document.querySelector('.sidebar');
    const drawer=sidebar?findUtilityDrawer(sidebar):null;
    if(sidebar&&drawer) positionDrawer(sidebar,drawer);
  },{passive:true});

  [0,120,420,1100,2600].forEach(ms=>setTimeout(boot,ms));
  console.info('[LS Connect] stable tabs/layout r5 active');
})();
