/* LS Connect v0.9.1.1 – real message-thread normalization r13
 * Scope: chat message hierarchy only.
 * r12 assumed every message was a direct child of .messages. In the live base
 * the cards can sit inside an additional thread wrapper, so the large vertical
 * gaps survived. r13 detects the real common message-thread ancestor at runtime
 * and normalizes that stack without touching settings, sidebar or composer.
 */
(function installLsConnectMessageFlowR13(){
  if(window.__LS_CONNECT_V0911_MESSAGE_FLOW_R13__) return;
  window.__LS_CONNECT_V0911_MESSAGE_FLOW_R13__=true;

  const root=document.documentElement;
  root.dataset.lsMessageFlowFix='r13';

  const style=document.createElement('style');
  style.id='v0911-message-flow-r13-style';
  style.textContent=`
    html[data-ls-message-flow-fix='r13'] .conversation-panel .messages{
      min-height:0!important;
      overflow-x:hidden!important;
      overflow-y:auto!important;
      overscroll-behavior-y:contain!important;
    }

    html[data-ls-message-flow-fix='r13'] .conversation-panel .ls-r13-thread{
      display:flex!important;
      flex-direction:column!important;
      justify-content:flex-start!important;
      align-content:flex-start!important;
      align-items:stretch!important;
      gap:8px!important;
      width:100%!important;
      min-width:0!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      margin:0!important;
      padding:0!important;
      box-sizing:border-box!important;
    }

    html[data-ls-message-flow-fix='r13'] .conversation-panel .messages.ls-r13-thread{
      height:100%!important;
      min-height:0!important;
      max-height:none!important;
      padding:14px clamp(10px,1.4vw,22px) 18px!important;
    }

    html[data-ls-message-flow-fix='r13'] .conversation-panel .ls-r13-thread > .ls-r13-shell{
      position:relative!important;
      inset:auto!important;
      float:none!important;
      flex:0 0 auto!important;
      align-self:stretch!important;
      width:100%!important;
      min-width:0!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      margin:0!important;
      transform:none!important;
      box-sizing:border-box!important;
    }

    html[data-ls-message-flow-fix='r13'] .conversation-panel .ls-r13-branch{
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      flex-grow:0!important;
      flex-shrink:1!important;
    }

    /* r7 remains responsible for visual bubble sizing/alignment. r13 only
       guarantees that wrappers around those cards cannot consume free height. */
    html[data-ls-message-flow-fix='r13'] .conversation-panel .ls-r7-message-row,
    html[data-ls-message-flow-fix='r13'] .conversation-panel .ls-r7-message-card,
    html[data-ls-message-flow-fix='r13'] .conversation-panel .message-row,
    html[data-ls-message-flow-fix='r13'] .conversation-panel .message-bubble{
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      flex-grow:0!important;
    }

    @media(max-width:700px){
      html[data-ls-message-flow-fix='r13'] .conversation-panel .ls-r13-thread{gap:6px!important}
      html[data-ls-message-flow-fix='r13'] .conversation-panel .messages.ls-r13-thread{padding:10px 8px 14px!important}
    }
  `;
  document.head.appendChild(style);

  const ACTION_RE=/^(antworten|reagieren|bearbeiten|löschen|loschen)$/i;
  const norm=el=>String(el?.textContent||'').replace(/\s+/g,' ').trim();
  const visible=el=>{
    if(!(el instanceof Element)||!el.isConnected) return false;
    const r=el.getBoundingClientRect();
    const s=getComputedStyle(el);
    return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden';
  };

  function nearestCard(anchor,messages){
    let el=anchor instanceof Element?anchor.parentElement:null;
    let fallback=null;
    const mr=messages.getBoundingClientRect();
    while(el&&el!==messages){
      if(!fallback) fallback=el;
      const r=el.getBoundingClientRect();
      const s=getComputedStyle(el);
      const bg=String(s.backgroundColor||'');
      const hasBg=(bg&&bg!=='transparent'&&!/rgba\([^)]*,\s*0(?:\.0+)?\s*\)$/.test(bg))||(s.backgroundImage&&s.backgroundImage!=='none');
      const radius=parseFloat(s.borderTopLeftRadius)||0;
      if(r.width>=48&&r.height>=28&&r.width<=mr.width*.9&&(hasBg||radius>=8||/message|bubble/i.test(String(el.className||'')))) return el;
      el=el.parentElement;
    }
    return fallback&&fallback!==messages?fallback:null;
  }

  function findCards(messages){
    const existing=[...messages.querySelectorAll('.ls-r7-message-card')].filter(visible);
    if(existing.length) return existing;

    const anchors=[...messages.querySelectorAll('button,a,[role="button"],span,div')].filter(el=>{
      const text=norm(el);
      return text.length<=18&&/^(antworten|reagieren)$/i.test(text);
    });
    return [...new Set(anchors.map(anchor=>nearestCard(anchor,messages)).filter(Boolean))];
  }

  function pathTo(node,stop){
    const path=[];
    let cur=node;
    while(cur&&cur!==stop){path.push(cur);cur=cur.parentElement;}
    if(cur===stop) path.push(stop);
    return path;
  }

  function commonAncestor(cards,messages){
    if(!cards.length) return null;
    const firstPath=pathTo(cards[0],messages);
    return firstPath.find(candidate=>cards.every(card=>candidate===card||candidate.contains(card)))||messages;
  }

  function childUnder(node,ancestor){
    let cur=node;
    while(cur&&cur.parentElement&&cur.parentElement!==ancestor) cur=cur.parentElement;
    return cur?.parentElement===ancestor?cur:null;
  }

  function force(el,prop,value){
    try{el.style.setProperty(prop,value,'important');}catch{}
  }

  function normalizeBranch(card,thread){
    let cur=card;
    while(cur&&cur!==thread){
      cur.classList.add('ls-r13-branch');
      force(cur,'height','auto');
      force(cur,'min-height','0');
      force(cur,'max-height','none');
      force(cur,'flex-grow','0');
      if(cur.parentElement===thread) break;
      cur=cur.parentElement;
    }
  }

  function normalizeMessages(messages){
    if(!messages||!visible(messages)) return;
    const cards=findCards(messages);
    if(cards.length<1) return;

    const nearBottom=messages.scrollHeight-messages.scrollTop-messages.clientHeight<140;
    const oldThreads=[...messages.querySelectorAll('.ls-r13-thread')];
    oldThreads.forEach(el=>{if(el!==messages)el.classList.remove('ls-r13-thread');});
    messages.querySelectorAll('.ls-r13-shell').forEach(el=>el.classList.remove('ls-r13-shell'));

    const thread=commonAncestor(cards,messages)||messages;
    thread.classList.add('ls-r13-thread');

    /* If the real thread is nested, the scrolling .messages element must not
       distribute its single thread child with legacy flex/grid rules. */
    if(thread!==messages){
      force(messages,'display','block');
      force(messages,'justify-content','initial');
      force(messages,'align-content','initial');
      force(thread,'display','flex');
      force(thread,'flex-direction','column');
      force(thread,'justify-content','flex-start');
      force(thread,'gap',innerWidth<=700?'6px':'8px');
      force(thread,'height','auto');
      force(thread,'min-height','0');
      force(thread,'max-height','none');
      force(thread,'width','100%');
    }else{
      force(messages,'display','flex');
      force(messages,'flex-direction','column');
      force(messages,'justify-content','flex-start');
      force(messages,'align-content','flex-start');
      force(messages,'gap',innerWidth<=700?'6px':'8px');
    }

    const shells=new Set();
    cards.forEach(card=>{
      const shell=childUnder(card,thread)||card;
      shells.add(shell);
      normalizeBranch(card,thread);
    });

    shells.forEach(shell=>{
      shell.classList.add('ls-r13-shell');
      force(shell,'position','relative');
      force(shell,'inset','auto');
      force(shell,'height','auto');
      force(shell,'min-height','0');
      force(shell,'max-height','none');
      force(shell,'flex','0 0 auto');
      force(shell,'margin-top','0');
      force(shell,'margin-bottom','0');
      force(shell,'transform','none');
    });

    if(nearBottom){
      requestAnimationFrame(()=>requestAnimationFrame(()=>{messages.scrollTop=messages.scrollHeight;}));
    }
  }

  function scan(){document.querySelectorAll('.conversation-panel .messages').forEach(normalizeMessages);}
  let timer=0;
  const schedule=(delay=40)=>{clearTimeout(timer);timer=setTimeout(scan,delay);};

  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.type==='childList'&&(m.addedNodes.length||m.removedNodes.length))) schedule(35);
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  document.addEventListener('click',event=>{
    if(event.target.closest?.('.chat-item,.channel-item,[data-chat-id]')) [30,100,260,600].forEach(ms=>setTimeout(scan,ms));
  },true);
  window.addEventListener('resize',()=>schedule(30),{passive:true});
  window.addEventListener('pageshow',()=>schedule(30),{passive:true});
  window.addEventListener('ls-connect-baseline-ready',()=>schedule(20),{once:true});
  [0,80,220,600,1400].forEach(ms=>setTimeout(scan,ms));

  console.info('[LS Connect] v0.9.1.1 real message-thread normalization r13 active');
})();
