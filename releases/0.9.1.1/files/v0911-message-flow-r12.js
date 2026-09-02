/* LS Connect v0.9.1.1 – compact message flow r12
 * Scope: conversation message flow only.
 * Keeps r11 settings scrolling and composer containment untouched.
 */
(function installLsConnectMessageFlowR12(){
  if(window.__LS_CONNECT_V0911_MESSAGE_FLOW_R12__) return;
  window.__LS_CONNECT_V0911_MESSAGE_FLOW_R12__=true;

  const root=document.documentElement;
  root.dataset.lsMessageFlowFix='r12';

  const style=document.createElement('style');
  style.id='v0911-message-flow-r12-style';
  style.textContent=`
    /* The regression visible in the live chat is free space being distributed
       between message rows. The scrolling region must stack messages normally. */
    html[data-ls-message-flow-fix='r12'] .conversation-panel .messages{
      display:flex!important;
      flex-direction:column!important;
      justify-content:flex-start!important;
      align-content:flex-start!important;
      align-items:stretch!important;
      gap:8px!important;
      min-height:0!important;
      overflow-y:auto!important;
    }

    /* Only actual message rows are normalized. No sidebar/settings selectors. */
    html[data-ls-message-flow-fix='r12'] .conversation-panel .messages > .message-row,
    html[data-ls-message-flow-fix='r12'] .conversation-panel .messages > .ls-r7-message-row,
    html[data-ls-message-flow-fix='r12'] .conversation-panel .messages > .ls-r12-flow-item{
      flex:0 0 auto!important;
      align-self:stretch!important;
      width:100%!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      margin:0!important;
    }

    html[data-ls-message-flow-fix='r12'] .conversation-panel .ls-r7-message-row{
      flex:0 0 auto!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      margin:0!important;
    }

    /* The message card remains content-sized. r7 still owns the visual bubble
       detection and left/right alignment; r12 only prevents vertical stretching. */
    html[data-ls-message-flow-fix='r12'] .conversation-panel .ls-r7-message-card,
    html[data-ls-message-flow-fix='r12'] .conversation-panel .message-bubble{
      flex-grow:0!important;
      flex-shrink:1!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
    }

    @media(max-width:700px){
      html[data-ls-message-flow-fix='r12'] .conversation-panel .messages{gap:6px!important}
    }
  `;
  document.head.appendChild(style);

  const actionText=/^(antworten|reagieren|bearbeiten|löschen|loschen)$/i;
  const text=el=>String(el?.textContent||'').replace(/\s+/g,' ').trim();

  function directChild(node,parent){
    let current=node;
    while(current&&current.parentElement&&current.parentElement!==parent) current=current.parentElement;
    return current?.parentElement===parent?current:null;
  }

  function markFlowItems(messages){
    if(!messages) return;
    const wasNearBottom=messages.scrollHeight-messages.scrollTop-messages.clientHeight<120;

    /* Existing normalized rows first. */
    messages.querySelectorAll('.message-row,.ls-r7-message-row').forEach(row=>{
      const direct=directChild(row,messages);
      if(direct) direct.classList.add('ls-r12-flow-item');
    });

    /* Fallback for legacy rows whose class differs: use the same message actions
       that are already present in the healthy UI, but only tag the direct child. */
    [...messages.querySelectorAll('button,a,[role="button"],span')].forEach(node=>{
      if(!actionText.test(text(node))) return;
      const direct=directChild(node,messages);
      if(direct) direct.classList.add('ls-r12-flow-item');
    });

    if(wasNearBottom){
      requestAnimationFrame(()=>{messages.scrollTop=messages.scrollHeight;});
    }
  }

  function scan(){ document.querySelectorAll('.conversation-panel .messages').forEach(markFlowItems); }
  let timer=0;
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(scan,35);};

  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.type==='childList'&&(m.addedNodes.length||m.removedNodes.length))) schedule();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  document.addEventListener('click',event=>{
    if(event.target.closest?.('.chat-item,[data-chat-id]')) [30,100,240].forEach(ms=>setTimeout(scan,ms));
  },true);
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('ls-connect-baseline-ready',schedule,{once:true});
  [0,80,220,600].forEach(ms=>setTimeout(scan,ms));

  console.info('[LS Connect] v0.9.1.1 compact message flow r12 active');
})();
