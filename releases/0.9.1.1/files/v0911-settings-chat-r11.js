/* LS Connect v0.9.1.1 – settings scroll + composer containment r11
 * Fixes two coupled viewport regressions without changing chat/message data:
 * 1) the v0.7.9.5 quick-settings overlay gets a real measured scroll viewport;
 * 2) the active chat composer is kept inside the conversation panel and cannot
 *    be pushed below the viewport when the sidebar drawer is opened.
 */
(function installLsConnectSettingsChatR11(){
  if(window.__LS_CONNECT_V0911_SETTINGS_CHAT_R11__) return;
  window.__LS_CONNECT_V0911_SETTINGS_CHAT_R11__=true;

  const root=document.documentElement;
  root.dataset.lsSettingsChatFix='r11';

  const style=document.createElement('style');
  style.id='v0911-settings-chat-r11-style';
  style.textContent=`
    /* Drawer: finite viewport, explicit vertical scrolling, no page/chat reflow. */
    html[data-ls-settings-chat-fix='r11'] .sidebar-actions.v0795-quick-panel.ls-r11-settings-drawer{
      position:absolute!important;
      left:8px!important;
      right:8px!important;
      bottom:auto!important;
      width:auto!important;
      min-width:0!important;
      max-width:none!important;
      min-height:0!important;
      box-sizing:border-box!important;
      overflow-x:hidden!important;
      overflow-y:scroll!important;
      overscroll-behavior:contain!important;
      touch-action:pan-y!important;
      scrollbar-gutter:stable!important;
      scrollbar-width:thin!important;
      pointer-events:auto!important;
      contain:layout paint!important;
    }
    html[data-ls-settings-chat-fix='r11'] .sidebar-actions.v0795-quick-panel.ls-r11-settings-drawer::-webkit-scrollbar{width:8px}
    html[data-ls-settings-chat-fix='r11'] .sidebar-actions.v0795-quick-panel.ls-r11-settings-drawer::-webkit-scrollbar-track{background:transparent}
    html[data-ls-settings-chat-fix='r11'] .sidebar-actions.v0795-quick-panel.ls-r11-settings-drawer::-webkit-scrollbar-thumb{background:rgba(148,163,184,.34);border-radius:999px}

    html[data-ls-settings-chat-fix='r11'] .sidebar-actions.v0795-quick-panel.ls-r11-settings-drawer > .v0795-quick-group{
      position:relative!important;
      inset:auto!important;
      display:grid!important;
      grid-template-columns:minmax(0,1fr)!important;
      grid-auto-flow:row!important;
      grid-auto-rows:max-content!important;
      width:100%!important;
      min-width:0!important;
      max-width:100%!important;
      height:auto!important;
      min-height:max-content!important;
      max-height:none!important;
      flex:0 0 auto!important;
      margin:0 0 10px!important;
      box-sizing:border-box!important;
      overflow:visible!important;
      transform:none!important;
    }
    html[data-ls-settings-chat-fix='r11'] .sidebar-actions.v0795-quick-panel.ls-r11-settings-drawer > .v0795-quick-group:last-child{margin-bottom:4px!important}
    html[data-ls-settings-chat-fix='r11'] .sidebar-actions.v0795-quick-panel.ls-r11-settings-drawer > .v0795-quick-group > .v0795-quick-group-title,
    html[data-ls-settings-chat-fix='r11'] .sidebar-actions.v0795-quick-panel.ls-r11-settings-drawer > .v0795-quick-group > button{
      position:relative!important;
      inset:auto!important;
      float:none!important;
      max-height:none!important;
      transform:none!important;
    }

    /* Conversation: fixed three-part flex frame. Sidebar overlays cannot alter it. */
    html[data-ls-settings-chat-fix='r11'] .conversation-panel{
      display:flex!important;
      flex-direction:column!important;
      height:100%!important;
      min-height:0!important;
      max-height:100%!important;
      overflow:hidden!important;
      box-sizing:border-box!important;
    }
    html[data-ls-settings-chat-fix='r11'] .conversation-panel .messages{
      flex:1 1 0!important;
      min-height:0!important;
      max-height:none!important;
      overflow-x:hidden!important;
      overflow-y:auto!important;
      overscroll-behavior-y:contain!important;
      box-sizing:border-box!important;
    }
    html[data-ls-settings-chat-fix='r11'][data-ls-chat-active-r11='1'] .ls-r11-chat-composer{
      display:flex!important;
      flex:0 0 auto!important;
      align-items:flex-end!important;
      visibility:visible!important;
      opacity:1!important;
      position:relative!important;
      inset:auto!important;
      left:auto!important;
      right:auto!important;
      top:auto!important;
      bottom:auto!important;
      width:100%!important;
      min-width:0!important;
      max-width:100%!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      margin:0!important;
      box-sizing:border-box!important;
      transform:none!important;
      z-index:20!important;
    }
    html[data-ls-settings-chat-fix='r11'][data-ls-chat-active-r11='1'] .ls-r11-chat-composer input,
    html[data-ls-settings-chat-fix='r11'][data-ls-chat-active-r11='1'] .ls-r11-chat-composer textarea{
      flex:1 1 auto!important;
      min-width:0!important;
      max-width:100%!important;
    }

    @media(max-width:760px){
      html[data-ls-settings-chat-fix='r11'] .sidebar-actions.v0795-quick-panel.ls-r11-settings-drawer{left:7px!important;right:7px!important}
    }
  `;
  document.head.appendChild(style);

  const norm=el=>String(el?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
  const px=value=>{const n=parseFloat(String(value||''));return Number.isFinite(n)?n:0;};

  function sidebar(){ return document.querySelector('.sidebar'); }
  function drawer(sb){ return sb?.querySelector('.sidebar-actions.v0795-quick-panel')||null; }

  function gear(sb,dr){
    if(!sb) return null;
    const buttons=[...sb.querySelectorAll('button,[role="button"]')].filter(el=>!dr?.contains(el)&&!el.closest('.v0801-nav-deck'));
    let found=buttons.find(el=>{
      const label=`${el.getAttribute('aria-label')||''} ${el.getAttribute('title')||''}`.toLowerCase();
      const text=norm(el);
      return text==='⚙'||text==='⚙️'||/einstellungen|settings/.test(label);
    });
    if(found) return found;
    const sr=sb.getBoundingClientRect();
    return buttons.find(el=>{
      const r=el.getBoundingClientRect();
      return r.width>0&&r.width<=68&&r.height>0&&r.height<=68&&r.left<sr.left+76&&r.bottom>sr.bottom-104;
    })||null;
  }

  function desiredTop(sb,dr){
    const sr=sb.getBoundingClientRect();
    const stories=sb.querySelector('#v0795PersistentStories,#storiesButton,.v0795-persistent-stories');
    if(stories){
      const r=stories.getBoundingClientRect();
      if(r.height>0&&r.bottom>sr.top&&r.bottom<sr.bottom) return Math.max(8,Math.ceil(r.bottom-sr.top+8));
    }
    const current=px(getComputedStyle(dr).top);
    if(current>0&&current<sr.height-120) return Math.ceil(current);
    return Math.max(8,Math.min(220,Math.floor(sr.height*.30)));
  }

  function drawerOpen(dr){
    if(!dr) return false;
    const cs=getComputedStyle(dr);
    const r=dr.getBoundingClientRect();
    return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0;
  }

  function syncDrawer(){
    const sb=sidebar();
    const dr=drawer(sb);
    if(!sb||!dr) return false;

    dr.classList.add('ls-r11-settings-drawer');
    const sr=sb.getBoundingClientRect();
    if(sr.height<120) return false;

    const top=desiredTop(sb,dr);
    const g=gear(sb,dr);
    let footer=10;
    if(g){
      g.classList.add('ls-r11-settings-trigger');
      const gr=g.getBoundingClientRect();
      if(gr.height>0&&gr.top>sr.top&&gr.top<sr.bottom) footer=Math.max(10,Math.ceil(sr.bottom-gr.top+8));
    }

    /* Give the drawer a concrete pixel height. This avoids the previous
       top+bottom/auto-height ambiguity and guarantees a real scroll container. */
    const available=Math.max(140,Math.floor(sr.height-top-footer));
    dr.style.setProperty('top',`${top}px`,'important');
    dr.style.setProperty('bottom','auto','important');
    dr.style.setProperty('height',`${available}px`,'important');
    dr.style.setProperty('max-height',`${available}px`,'important');
    dr.style.setProperty('min-height','0','important');
    dr.style.setProperty('overflow-y','scroll','important');

    return drawerOpen(dr);
  }

  function findMessageInput(panel){
    if(!panel) return null;
    if(typeof els!=='undefined'&&els?.messageInput&&panel.contains(els.messageInput)) return els.messageInput;
    return panel.querySelector('#messageInput,[data-message-input],textarea[placeholder*="Nachricht" i],input[placeholder*="Nachricht" i],textarea');
  }

  function composerRoot(panel,input){
    if(!panel||!input) return null;
    let node=input;
    while(node&&node.parentElement&&node.parentElement!==panel) node=node.parentElement;
    if(node?.parentElement===panel) return node;
    return input.closest('.message-compose,.composer,[class*="compose"],[class*="composer"]');
  }

  function hasActiveChat(panel,input){
    if(!panel||!input||input.disabled) return false;
    try{
      if(typeof state!=='undefined'&&state){
        const keys=['activeConversationId','activeChatId','activeConversation','activeRoomId','selectedConversationId'];
        if(keys.some(key=>Boolean(state[key]))) return true;
      }
    }catch{}
    if(panel.querySelector('.messages .message-row,.message-row')) return true;
    const header=panel.querySelector('.chat-header,.conversation-header');
    return Boolean(header&&norm(header).length>0);
  }

  function syncComposer(){
    const panel=document.querySelector('.conversation-panel');
    const input=findMessageInput(panel);
    const host=composerRoot(panel,input);
    const active=hasActiveChat(panel,input);
    root.dataset.lsChatActiveR11=active?'1':'0';
    if(!panel||!input||!host||!active) return false;

    host.classList.add('ls-r11-chat-composer');
    /* Remove only known generic visibility classes from the composer root.
       No sidebar/chat message nodes are touched. */
    host.classList.remove('hidden','v072-hidden','v0801-filter-hidden','ls-r4-tab-hidden','ls-r5-hidden','ls-r5-utility-hidden');

    /* Keep composer after the scrolling message region if a legacy patch moved
       it inside another container. This is a structural no-op in the healthy UI. */
    const messages=panel.querySelector(':scope > .messages')||panel.querySelector('.messages');
    if(host.parentElement===panel&&messages?.parentElement===panel&&messages.nextElementSibling!==host){
      messages.insertAdjacentElement('afterend',host);
    }
    return true;
  }

  let raf=0;
  function syncAll(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{syncDrawer();syncComposer();});
  }
  function burst(){
    syncAll();
    [30,90,180,360,700].forEach(ms=>setTimeout(()=>{syncDrawer();syncComposer();},ms));
  }

  document.addEventListener('click',event=>{
    const sb=sidebar();
    if(sb&&sb.contains(event.target)) burst();
  },true);
  window.addEventListener('resize',burst,{passive:true});
  window.addEventListener('orientationchange',burst,{passive:true});
  window.addEventListener('pageshow',burst,{passive:true});
  window.visualViewport?.addEventListener?.('resize',burst,{passive:true});
  window.addEventListener('ls-connect-baseline-ready',burst,{once:true});

  burst();
  console.info('[LS Connect] v0.9.1.1 settings scroll + composer containment r11 active');
})();
