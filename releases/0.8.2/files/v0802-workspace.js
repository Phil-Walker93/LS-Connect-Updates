/* LS Connect v0.8.2 – Messenger Workspace */
(function v0802MessengerWorkspace(){
  if(window.__LS_CONNECT_V0802_WORKSPACE__) return;
  window.__LS_CONNECT_V0802_WORKSPACE__ = true;

  const VERSION='0.8.2';
  const STYLE_ID='v0802-workspace-style';
  const OVERFLOW_CLASS='v0802-header-overflow';
  const SOURCE_CLASS='v0802-overflow-source';
  const ACTION_CONTAINER_SELECTOR='.chat-header-actions,.conversation-header-actions,.header-actions,.chat-actions,.conversation-actions';

  function installStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .app-shell{
        align-items:stretch!important;
      }
      @media(min-width:901px){
        html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .app-shell{
          grid-template-columns:minmax(250px,300px) minmax(420px,1fr) minmax(260px,320px)!important;
        }
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .conversation-panel{
        position:relative;min-width:0!important;display:flex!important;flex-direction:column!important;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .chat-header,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .conversation-header{
        position:sticky;top:0;z-index:7;min-height:66px!important;padding:10px 14px!important;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .chat-header h1,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .chat-header h2,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .chat-header h3,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .conversation-header h1,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .conversation-header h2,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .conversation-header h3{
        margin:0!important;font-size:15px!important;line-height:1.25!important;letter-spacing:-.01em;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .messages{
        flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important;padding:22px clamp(12px,2.3vw,28px) 28px!important;
        scroll-padding-bottom:100px;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-row{
        margin:4px 0!important;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-bubble{
        position:relative;max-width:min(68%,720px)!important;padding:9px 12px!important;border-radius:16px!important;
        font-size:14px;line-height:1.48!important;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-row.out .message-bubble{
        border-bottom-right-radius:6px!important;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-row.in .message-bubble,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-row:not(.out) .message-bubble{
        border-bottom-left-radius:6px!important;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-time,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .timestamp,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] [class*='message-meta']{
        color:#64748b!important;font-size:10px!important;opacity:.82;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-actions,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] [class*='message-actions']{
        opacity:.12;transition:opacity .14s ease!important;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-row:hover .message-actions,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-row:focus-within .message-actions,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-row:hover [class*='message-actions'],
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-row:focus-within [class*='message-actions']{
        opacity:1;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-compose,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .composer{
        position:sticky;bottom:0;z-index:7;margin:0!important;padding:11px 13px 13px!important;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-compose textarea,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .composer textarea{
        min-height:44px!important;max-height:170px!important;padding:11px 13px!important;border-radius:16px!important;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .send-button{
        min-width:44px;min-height:44px;padding:9px 13px!important;border-radius:14px!important;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .chat-list,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .conversation-list,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .channel-list{
        display:grid;gap:3px;padding:4px 2px 12px;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .chat-item,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .channel-item{
        min-height:54px!important;margin:2px 6px!important;padding:9px 10px!important;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .chat-item strong,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .channel-item strong{
        font-size:13px!important;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .chat-item small,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .channel-item small{
        color:#718096!important;font-size:10px!important;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .empty-state,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .conversation-empty,
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .chat-empty{
        max-width:420px;margin:auto;padding:24px;border:1px solid rgba(148,163,184,.10);border-radius:20px;
        background:rgba(15,23,42,.38);text-align:center;color:#91a0b7;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] ${ACTION_CONTAINER_SELECTOR}{
        position:relative;display:flex;align-items:center;gap:6px;
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .${SOURCE_CLASS}{display:none!important}
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .${OVERFLOW_CLASS}{position:relative;display:inline-flex}
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .v0802-overflow-toggle{
        width:38px;height:38px;display:grid;place-items:center;padding:0!important;border:1px solid rgba(148,163,184,.11)!important;
        border-radius:12px!important;background:rgba(255,255,255,.035)!important;color:#b8c3d4!important;font-size:18px!important;box-shadow:none!important
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .v0802-overflow-menu{
        position:absolute;top:calc(100% + 7px);right:0;z-index:40;min-width:190px;display:none;padding:6px;
        border:1px solid rgba(148,163,184,.15);border-radius:14px;background:rgba(8,15,27,.98);box-shadow:0 18px 45px rgba(0,0,0,.38)
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .${OVERFLOW_CLASS}.open .v0802-overflow-menu{display:grid;gap:3px}
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .v0802-overflow-menu button{
        width:100%;min-height:36px;padding:8px 10px!important;text-align:left;border:0!important;border-radius:9px!important;
        background:transparent!important;color:#d9e2ef!important;box-shadow:none!important;font-size:12px!important
      }
      html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .v0802-overflow-menu button:hover{background:rgba(255,255,255,.055)!important}
      @media(max-width:900px){
        html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-bubble{max-width:78%!important}
        html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .profile-panel{box-shadow:none!important}
      }
      @media(max-width:700px){
        html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .chat-header,
        html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .conversation-header{min-height:58px!important;padding:8px 10px!important}
        html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .messages{padding:14px 10px 92px!important}
        html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-bubble{max-width:88%!important;font-size:13px}
        html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .message-compose,
        html[data-ls-connect-redesign='080'][data-v0802-workspace='1'] .composer{padding:9px 9px 78px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function buttonLabel(button,index){
    return String(button.getAttribute('aria-label') || button.getAttribute('title') || button.textContent || `Aktion ${index+1}`)
      .replace(/\s+/g,' ').trim().slice(0,60) || `Aktion ${index+1}`;
  }

  function closeOverflowMenus(except=null){
    document.querySelectorAll(`.${OVERFLOW_CLASS}.open`).forEach(wrapper=>{
      if(wrapper!==except) wrapper.classList.remove('open');
    });
  }

  function syncOverflow(container){
    if(!(container instanceof Element)) return;
    const directButtons=[...container.children].filter(el=>el instanceof HTMLButtonElement && !el.classList.contains('v0802-overflow-toggle'));
    const originals=directButtons.filter(button=>!button.closest(`.${OVERFLOW_CLASS}`));

    originals.forEach(button=>button.classList.remove(SOURCE_CLASS));
    const old=container.querySelector(`:scope > .${OVERFLOW_CLASS}`);
    if(originals.length<=3){old?.remove();return;}

    const keepCount=2;
    const hidden=originals.slice(keepCount);
    hidden.forEach(button=>button.classList.add(SOURCE_CLASS));

    const signature=hidden.map((button,index)=>`${button.id}|${button.className}|${buttonLabel(button,index)}`).join('::');
    let wrapper=old;
    if(!wrapper){
      wrapper=document.createElement('span');
      wrapper.className=OVERFLOW_CLASS;
      wrapper.innerHTML='<button type="button" class="v0802-overflow-toggle" aria-label="Weitere Aktionen" aria-expanded="false">•••</button><span class="v0802-overflow-menu" role="menu"></span>';
      container.appendChild(wrapper);
      wrapper.querySelector('.v0802-overflow-toggle')?.addEventListener('click',event=>{
        event.stopPropagation();
        const open=!wrapper.classList.contains('open');
        closeOverflowMenus(wrapper);
        wrapper.classList.toggle('open',open);
        event.currentTarget.setAttribute('aria-expanded',open?'true':'false');
      });
    }

    if(wrapper.dataset.v0802Signature===signature) return;
    wrapper.dataset.v0802Signature=signature;
    const menu=wrapper.querySelector('.v0802-overflow-menu');
    if(!menu) return;
    menu.replaceChildren();
    hidden.forEach((source,index)=>{
      const proxy=document.createElement('button');
      proxy.type='button';
      proxy.setAttribute('role','menuitem');
      proxy.textContent=buttonLabel(source,index);
      proxy.addEventListener('click',()=>{
        wrapper.classList.remove('open');
        wrapper.querySelector('.v0802-overflow-toggle')?.setAttribute('aria-expanded','false');
        source.click();
      });
      menu.appendChild(proxy);
    });
  }

  function refresh(){
    installStyles();
    document.documentElement.dataset.v0802Workspace='1';
    document.querySelectorAll(ACTION_CONTAINER_SELECTOR).forEach(syncOverflow);
    document.documentElement.dataset.lsVersion=VERSION;
    window.__LS_CONNECT_RUNTIME_VERSION__=VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=VERSION;
  }

  document.addEventListener('click',event=>{
    if(!event.target.closest?.(`.${OVERFLOW_CLASS}`)) closeOverflowMenus();
  },true);

  let timer=0;
  new MutationObserver(mutations=>{
    if(!mutations.some(mutation=>mutation.addedNodes.length || mutation.removedNodes.length)) return;
    clearTimeout(timer);
    timer=setTimeout(refresh,100);
  }).observe(document.documentElement,{childList:true,subtree:true});

  refresh();
  [250,800,1800,3600].forEach(ms=>setTimeout(refresh,ms));
  console.info('[LS Connect] v0.8.2 Messenger Workspace active');
})();
