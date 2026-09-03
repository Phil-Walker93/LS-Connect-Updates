/* LS Connect v0.9.1.3 – compact chat flow + pinned admin navigation r3
 * Visual-only hotfix. No message, identity or permission data is changed.
 */
(function installV0913LayoutR3(){
  if(window.__LS_CONNECT_V0913_LAYOUT_R3__) return;
  window.__LS_CONNECT_V0913_LAYOUT_R3__=true;

  const root=document.documentElement;
  root.dataset.lsLayoutIntegrity='r3';

  const style=document.createElement('style');
  style.id='v0913-layout-r3-style';
  style.textContent=`
    html[data-ls-layout-integrity='r3'],
    html[data-ls-layout-integrity='r3'] body{
      max-width:100vw!important;
      overflow-x:hidden!important;
    }
    html[data-ls-layout-integrity='r3'] .app-shell,
    html[data-ls-layout-integrity='r3'] .sidebar{
      min-width:0!important;
      max-width:100%!important;
      box-sizing:border-box!important;
    }
    html[data-ls-layout-integrity='r3'] .sidebar{
      container-type:inline-size!important;
      overflow-x:hidden!important;
    }
    html[data-ls-layout-integrity='r3'] .sidebar .v0801-nav-deck{
      position:relative!important;
      inset:auto!important;
      display:grid!important;
      grid-template-columns:repeat(4,minmax(0,1fr))!important;
      width:calc(100% - 16px)!important;
      min-width:0!important;
      max-width:calc(100% - 16px)!important;
      min-height:52px!important;
      margin:8px!important;
      padding:4px 44px 4px 4px!important;
      gap:2px!important;
      box-sizing:border-box!important;
      overflow:hidden!important;
    }
    html[data-ls-layout-integrity='r3'] .sidebar .v0801-nav-filter{
      position:relative!important;
      inset:auto!important;
      display:grid!important;
      grid-template-rows:auto auto auto!important;
      justify-items:center!important;
      align-content:center!important;
      width:100%!important;
      min-width:0!important;
      max-width:100%!important;
      min-height:44px!important;
      margin:0!important;
      padding:4px 1px!important;
      overflow:hidden!important;
      box-sizing:border-box!important;
    }
    html[data-ls-layout-integrity='r3'] .sidebar .v0801-nav-filter-icon{
      display:block!important;
      width:100%!important;
      min-width:0!important;
      overflow:hidden!important;
      font-size:13px!important;
      line-height:1!important;
      text-align:center!important;
      text-overflow:clip!important;
      white-space:nowrap!important;
    }
    html[data-ls-layout-integrity='r3'] .sidebar .v0801-nav-filter-label{
      display:block!important;
      width:100%!important;
      min-width:0!important;
      max-width:100%!important;
      overflow:hidden!important;
      font-size:7px!important;
      line-height:1.05!important;
      text-align:center!important;
      text-overflow:ellipsis!important;
      white-space:nowrap!important;
    }
    html[data-ls-layout-integrity='r3'] .sidebar .v0801-nav-filter-count{
      min-width:12px!important;
      max-width:100%!important;
      padding:1px 3px!important;
      overflow:hidden!important;
      font-size:6px!important;
      text-overflow:ellipsis!important;
    }
    html[data-ls-layout-integrity='r3'] .sidebar [data-v0801-filter-button='admin']{
      position:absolute!important;
      top:4px!important;
      right:4px!important;
      bottom:4px!important;
      left:auto!important;
      z-index:5!important;
      display:grid!important;
      grid-template-rows:1fr!important;
      place-items:center!important;
      width:36px!important;
      min-width:36px!important;
      max-width:36px!important;
      height:auto!important;
      min-height:0!important;
      margin:0!important;
      padding:0!important;
      visibility:visible!important;
      opacity:1!important;
      overflow:hidden!important;
      transform:none!important;
      pointer-events:auto!important;
      box-sizing:border-box!important;
    }
    html[data-ls-layout-integrity='r3'] .sidebar [data-v0801-filter-button='admin'] .v0801-nav-filter-icon{
      width:auto!important;
      font-size:15px!important;
    }
    html[data-ls-layout-integrity='r3'] .sidebar [data-v0801-filter-button='admin'] .v0801-nav-filter-label,
    html[data-ls-layout-integrity='r3'] .sidebar [data-v0801-filter-button='admin'] .v0801-nav-filter-count{
      display:none!important;
    }

    html[data-ls-layout-integrity='r3'] .conversation-panel .messages{
      display:flex!important;
      flex:1 1 0!important;
      flex-direction:column!important;
      justify-content:flex-start!important;
      align-content:flex-start!important;
      align-items:stretch!important;
      gap:8px!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      overflow-x:hidden!important;
      overflow-y:auto!important;
      box-sizing:border-box!important;
    }
    html[data-ls-layout-integrity='r3'] .conversation-panel .messages > .message-row,
    html[data-ls-layout-integrity='r3'] .conversation-panel .message-row{
      position:relative!important;
      inset:auto!important;
      display:flex!important;
      flex:0 0 auto!important;
      align-self:stretch!important;
      align-items:flex-end!important;
      width:100%!important;
      min-width:0!important;
      height:max-content!important;
      min-height:0!important;
      max-height:none!important;
      margin:0!important;
      padding:0!important;
      transform:none!important;
      box-sizing:border-box!important;
    }
    html[data-ls-layout-integrity='r3'] .conversation-panel .message-row.in{justify-content:flex-start!important}
    html[data-ls-layout-integrity='r3'] .conversation-panel .message-row.out{justify-content:flex-end!important}
    html[data-ls-layout-integrity='r3'] .conversation-panel .message-bubble,
    html[data-ls-layout-integrity='r3'] .conversation-panel [data-message]{
      position:relative!important;
      inset:auto!important;
      display:flex!important;
      flex:0 1 auto!important;
      flex-direction:column!important;
      justify-content:flex-start!important;
      align-content:flex-start!important;
      align-items:stretch!important;
      align-self:auto!important;
      gap:5px!important;
      width:fit-content!important;
      min-width:0!important;
      height:max-content!important;
      min-height:0!important;
      max-height:none!important;
      margin:0!important;
      padding:10px 13px!important;
      transform:none!important;
      box-sizing:border-box!important;
      overflow-wrap:anywhere!important;
      word-break:break-word!important;
    }
    html[data-ls-layout-integrity='r3'] .conversation-panel .message-bubble > *,
    html[data-ls-layout-integrity='r3'] .conversation-panel [data-message] > *{
      flex:0 0 auto!important;
      min-width:0!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      box-sizing:border-box!important;
    }
    html[data-ls-layout-integrity='r3'] .conversation-panel .message-time,
    html[data-ls-layout-integrity='r3'] .conversation-panel .message-actions{
      position:static!important;
      inset:auto!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      margin-top:2px!important;
      transform:none!important;
    }

    @container(max-width:230px){
      html[data-ls-layout-integrity='r3'] .sidebar .v0801-nav-deck{
        width:calc(100% - 10px)!important;
        max-width:calc(100% - 10px)!important;
        margin:5px!important;
        padding:3px 41px 3px 3px!important;
        gap:1px!important;
      }
      html[data-ls-layout-integrity='r3'] .sidebar .v0801-nav-filter-label{font-size:0!important}
      html[data-ls-layout-integrity='r3'] .sidebar .v0801-nav-filter{min-height:38px!important}
      html[data-ls-layout-integrity='r3'] .sidebar [data-v0801-filter-button='admin']{
        top:3px!important;
        right:3px!important;
        bottom:3px!important;
        width:34px!important;
        min-width:34px!important;
        max-width:34px!important;
      }
    }
    @media(max-width:700px){
      html[data-ls-layout-integrity='r3'] .conversation-panel .messages{gap:6px!important}
      html[data-ls-layout-integrity='r3'] .conversation-panel .message-bubble,
      html[data-ls-layout-integrity='r3'] .conversation-panel [data-message]{max-width:90%!important;padding:9px 11px!important}
    }
  `;
  document.getElementById(style.id)?.remove();
  document.head.appendChild(style);

  const force=(element,property,value)=>{
    try{element.style.setProperty(property,value,'important');}catch{}
  };

  function normalizeNavigation(){
    const sidebar=document.querySelector('.sidebar');
    const deck=sidebar?.querySelector('.v0801-nav-deck');
    if(!sidebar||!deck) return;

    deck.dataset.v0913Contained='r3';
    let admin=deck.querySelector('[data-v0801-filter-button="admin"]');
    if(!admin){
      admin=document.createElement('button');
      admin.type='button';
      admin.className='v0801-nav-filter';
      admin.dataset.v0801FilterButton='admin';
      admin.innerHTML='<span class="v0801-nav-filter-icon" aria-hidden="true">⚙</span><span class="v0801-nav-filter-label">Verwalten</span>';
      deck.appendChild(admin);
    }else if(admin.nextElementSibling){
      deck.appendChild(admin);
    }

    admin.hidden=false;
    admin.removeAttribute('hidden');
    admin.removeAttribute('aria-hidden');
    admin.setAttribute('aria-label','Verwalten');
    admin.setAttribute('title','Verwalten');
    admin.classList.remove('hidden','v072-hidden','v0801-filter-hidden','ls-r4-tab-hidden','ls-r5-hidden','ls-r5-utility-hidden');

    force(deck,'position','relative');
    force(deck,'overflow','hidden');
    force(admin,'position','absolute');
    force(admin,'right','4px');
    force(admin,'left','auto');
    force(admin,'display','grid');
    force(admin,'visibility','visible');
    force(admin,'opacity','1');
    force(admin,'transform','none');

    requestAnimationFrame(()=>{
      const sidebarRect=sidebar.getBoundingClientRect();
      const adminRect=admin.getBoundingClientRect();
      if(adminRect.right>sidebarRect.right||adminRect.left<sidebarRect.left){
        force(deck,'width',`${Math.max(0,sidebar.clientWidth-16)}px`);
        force(deck,'max-width',`${Math.max(0,sidebar.clientWidth-16)}px`);
        force(admin,'right','4px');
      }
    });
  }

  function normalizeMessageFlow(){
    document.querySelectorAll('.conversation-panel .messages').forEach(messages=>{
      force(messages,'display','flex');
      force(messages,'flex-direction','column');
      force(messages,'justify-content','flex-start');
      force(messages,'align-content','flex-start');
      force(messages,'align-items','stretch');
      force(messages,'gap',innerWidth<=700?'6px':'8px');

      messages.querySelectorAll('.message-row').forEach(row=>{
        force(row,'display','flex');
        force(row,'flex','0 0 auto');
        force(row,'align-self','stretch');
        force(row,'height','max-content');
        force(row,'min-height','0');
        force(row,'max-height','none');
        force(row,'margin','0');

        const bubble=row.querySelector(':scope > .message-bubble,:scope > [data-message]');
        if(!bubble) return;
        force(bubble,'display','flex');
        force(bubble,'flex','0 1 auto');
        force(bubble,'flex-direction','column');
        force(bubble,'justify-content','flex-start');
        force(bubble,'align-content','flex-start');
        force(bubble,'height','max-content');
        force(bubble,'min-height','0');
        force(bubble,'max-height','none');
        force(bubble,'margin','0');
      });
    });
  }

  let frame=0;
  function schedule(){
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      normalizeNavigation();
      normalizeMessageFlow();
    });
  }

  new MutationObserver(mutations=>{
    if(mutations.some(mutation=>mutation.type==='childList'&&(mutation.addedNodes.length||mutation.removedNodes.length))) schedule();
  }).observe(document.documentElement,{childList:true,subtree:true});

  document.addEventListener('click',event=>{
    if(event.target.closest?.('.chat-item,.channel-item,[data-chat-id],[data-v0801-filter-button]')){
      [0,50,160,420].forEach(delay=>setTimeout(schedule,delay));
    }
  },true);
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('pageshow',schedule,{passive:true});
  window.addEventListener('ls-connect-baseline-ready',schedule,{once:true});
  [0,80,240,700,1600,3500].forEach(delay=>setTimeout(schedule,delay));

  console.info('[LS Connect] v0.9.1.3 compact chat flow + pinned admin navigation r3 active');
})();
