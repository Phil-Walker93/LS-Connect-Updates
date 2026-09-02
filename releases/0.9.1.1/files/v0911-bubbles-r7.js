/* LS Connect v0.9.1.1 – real message-card normalization r7
 * r6 targeted legacy .message-bubble selectors. The live base can render the
 * visible card with different class names, so r7 detects the actual visible
 * card from its action controls and applies the size/alignment fix there.
 */
(function installLsConnectBubbleR7(){
  if(window.__LS_CONNECT_V0911_BUBBLES_R7__) return;
  window.__LS_CONNECT_V0911_BUBBLES_R7__=true;

  const root=document.documentElement;
  root.dataset.lsBubblesR7='1';
  const ACTION_RE=/^(antworten|reagieren|bearbeiten|löschen|loschen)$/i;
  const TIME_RE=/^\d{1,2}:\d{2}(?:\s*·\s*bearbeitet)?$/i;

  const style=document.createElement('style');
  style.id='v0911-bubbles-r7-style';
  style.textContent=`
    html[data-ls-bubbles-r7='1'] .ls-r7-message-row{
      display:flex!important;flex:0 0 auto!important;width:100%!important;min-width:0!important;
      height:auto!important;min-height:0!important;max-height:none!important;margin:5px 0!important;padding:0!important;
      align-items:flex-end!important;box-sizing:border-box!important;
    }
    html[data-ls-bubbles-r7='1'] .ls-r7-message-row.ls-r7-out{justify-content:flex-end!important}
    html[data-ls-bubbles-r7='1'] .ls-r7-message-row.ls-r7-in{justify-content:flex-start!important}
    html[data-ls-bubbles-r7='1'] .ls-r7-message-card{
      position:relative!important;display:flex!important;flex:0 1 auto!important;flex-direction:column!important;
      justify-content:flex-start!important;align-items:stretch!important;gap:7px!important;
      width:fit-content!important;min-width:0!important;height:auto!important;min-height:0!important;max-height:none!important;
      margin-top:0!important;margin-bottom:0!important;padding:11px 13px!important;border-radius:16px!important;
      box-sizing:border-box!important;overflow:visible!important;white-space:normal!important;
      overflow-wrap:anywhere!important;word-break:break-word!important;line-height:1.45!important;
    }
    html[data-ls-bubbles-r7='1'] .ls-r7-message-card.ls-r7-out{margin-left:auto!important;margin-right:0!important}
    html[data-ls-bubbles-r7='1'] .ls-r7-message-card.ls-r7-in{margin-left:0!important;margin-right:auto!important}
    html[data-ls-bubbles-r7='1'] .ls-r7-message-card > *{
      flex:0 0 auto!important;min-width:0!important;min-height:0!important;max-height:none!important;box-sizing:border-box!important;
    }
    html[data-ls-bubbles-r7='1'] .ls-r7-message-actions{
      position:static!important;inset:auto!important;display:flex!important;flex:0 0 auto!important;flex-wrap:wrap!important;
      justify-content:flex-end!important;align-items:center!important;gap:9px!important;width:auto!important;min-width:0!important;
      height:auto!important;min-height:0!important;max-height:none!important;margin:2px 0 0!important;padding:0!important;
      background:transparent!important;border:0!important;box-shadow:none!important;
    }
    html[data-ls-bubbles-r7='1'] .ls-r7-message-time{
      position:static!important;inset:auto!important;width:auto!important;height:auto!important;min-height:0!important;
      margin:1px 0 0!important;padding:0!important;align-self:flex-end!important;background:transparent!important;
    }
    @media(max-width:900px){
      html[data-ls-bubbles-r7='1'] .ls-r7-message-card{max-width:82%!important}
    }
    @media(max-width:700px){
      html[data-ls-bubbles-r7='1'] .ls-r7-message-card{max-width:90%!important;padding:9px 11px!important;gap:6px!important}
    }
  `;
  document.head.appendChild(style);

  const ownText=el=>String(el?.textContent||'').replace(/\s+/g,' ').trim();

  function bgVisible(style){
    const bg=String(style.backgroundColor||'');
    if(bg&&bg!=='transparent'&&!/rgba\([^)]*,\s*0(?:\.0+)?\s*\)$/.test(bg)) return true;
    return style.backgroundImage&&style.backgroundImage!=='none';
  }

  function looksLikeCard(el,messages){
    if(!(el instanceof Element)||el===messages) return false;
    const r=el.getBoundingClientRect(),m=messages.getBoundingClientRect();
    if(r.width<55||r.height<34||r.width>Math.max(900,m.width*.88)||r.height>m.height*.86) return false;
    const s=getComputedStyle(el);
    const radius=parseFloat(s.borderTopLeftRadius)||0;
    return bgVisible(s)||radius>=8||String(el.className||'').toLowerCase().includes('message');
  }

  function nearestCard(anchor,messages){
    let el=anchor instanceof Element?anchor.parentElement:null;
    let fallback=null;
    while(el&&el!==messages){
      if(!fallback) fallback=el;
      if(looksLikeCard(el,messages)) return el;
      el=el.parentElement;
    }
    return fallback&&fallback!==messages?fallback:null;
  }

  function nearestWideRow(card,messages){
    const m=messages.getBoundingClientRect();
    let el=card.parentElement,best=null;
    while(el&&el!==messages){
      const r=el.getBoundingClientRect();
      if(r.width>=m.width*.78){best=el;break;}
      el=el.parentElement;
    }
    if(!best){
      let direct=card;
      while(direct.parentElement&&direct.parentElement!==messages) direct=direct.parentElement;
      best=direct;
    }
    return best===messages?null:best;
  }

  function force(el,prop,value){try{el.style.setProperty(prop,value,'important');}catch{}}

  function normalizeChildren(card){
    [...card.children].forEach(child=>{
      force(child,'height','auto');force(child,'min-height','0');force(child,'max-height','none');
      force(child,'flex','0 0 auto');
      const cs=getComputedStyle(child);
      if(cs.position==='absolute'||cs.position==='fixed'){
        force(child,'position','static');force(child,'inset','auto');force(child,'transform','none');
      }
    });

    const actionNodes=[...card.querySelectorAll('button,a,[role="button"],span,div')].filter(el=>{
      const text=ownText(el);
      return text.length<=18&&ACTION_RE.test(text);
    });
    const parents=new Map();
    actionNodes.forEach(el=>{if(el.parentElement&&card.contains(el.parentElement))parents.set(el.parentElement,(parents.get(el.parentElement)||0)+1);});
    const actionBar=[...parents.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0];
    if(actionBar){
      actionBar.classList.add('ls-r7-message-actions');
      force(actionBar,'position','static');force(actionBar,'inset','auto');force(actionBar,'height','auto');force(actionBar,'min-height','0');
    }

    [...card.querySelectorAll('span,small,time,div')].forEach(el=>{
      const text=ownText(el);
      if(text.length<=28&&TIME_RE.test(text)){
        el.classList.add('ls-r7-message-time');
        force(el,'position','static');force(el,'inset','auto');force(el,'height','auto');force(el,'min-height','0');
      }
    });
  }

  function normalizeCard(card,messages){
    if(!(card instanceof Element)||!card.isConnected) return;
    const mr=messages.getBoundingClientRect(),cr=card.getBoundingClientRect();
    const outgoing=(cr.left+cr.width/2)>(mr.left+mr.width/2);
    const side=outgoing?'out':'in';
    const maxPx=Math.max(220,Math.min(680,Math.round(mr.width*(innerWidth<=700?.90:innerWidth<=900?.82:.72))));

    card.classList.add('ls-r7-message-card',`ls-r7-${side}`);
    card.classList.remove(`ls-r7-${outgoing?'in':'out'}`);
    force(card,'position','relative');force(card,'display','flex');force(card,'flex-direction','column');
    force(card,'justify-content','flex-start');force(card,'align-items','stretch');force(card,'flex','0 1 auto');
    force(card,'width','fit-content');force(card,'min-width','0');force(card,'max-width',`${maxPx}px`);
    force(card,'height','auto');force(card,'min-height','0');force(card,'max-height','none');
    force(card,'margin-left',outgoing?'auto':'0');force(card,'margin-right',outgoing?'0':'auto');
    force(card,'padding','11px 13px');

    normalizeChildren(card);

    const row=nearestWideRow(card,messages);
    if(row&&row!==card){
      row.classList.add('ls-r7-message-row',`ls-r7-${side}`);
      row.classList.remove(`ls-r7-${outgoing?'in':'out'}`);
      force(row,'display','flex');force(row,'width','100%');force(row,'height','auto');force(row,'min-height','0');force(row,'max-height','none');
      force(row,'justify-content',outgoing?'flex-end':'flex-start');force(row,'align-items','flex-end');
    }
  }

  function scan(){
    document.querySelectorAll('.messages').forEach(messages=>{
      const anchors=[...messages.querySelectorAll('button,a,[role="button"],span,div')].filter(el=>{
        const text=ownText(el);
        return text.length<=22&&/^(antworten|reagieren)$/i.test(text);
      });
      const cards=new Set();
      anchors.forEach(anchor=>{const card=nearestCard(anchor,messages);if(card)cards.add(card);});
      cards.forEach(card=>normalizeCard(card,messages));
    });
  }

  let timer=0;
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(scan,45);};
  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.type==='childList'&&(m.addedNodes.length||m.removedNodes.length))) schedule();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',event=>{if(event.target.closest?.('.chat-item,.channel-item,[data-chat-id]'))[40,140,360].forEach(ms=>setTimeout(scan,ms));},true);
  window.addEventListener('resize',schedule,{passive:true});
  [0,100,300,800,1600,3200].forEach(ms=>setTimeout(scan,ms));

  console.info('[LS Connect] v0.9.1.1 real message-card normalization r7 active');
})();
