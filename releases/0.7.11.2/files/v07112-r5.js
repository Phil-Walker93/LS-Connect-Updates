/* LS Connect v0.7.11.2 r5 – precise multiline message rendering */
(function v07112R5(){
  if(window.__LS_CONNECT_V07112_R5__)return;
  window.__LS_CONNECT_V07112_R5__=true;

  const STYLE_ID='v07112-r5-style';
  const TEXT_CLASS='v07112-r5-message-text';
  const CONTROL_RE=/(time|timestamp|meta|action|reply|react|reaction|edit|delete|menu|toolbar|status|check|read)/i;

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .${TEXT_CLASS}{
        white-space:pre-wrap!important;
        overflow-wrap:anywhere!important;
        word-break:break-word!important;
      }
      .message-bubble{white-space:normal!important}
    `;
    document.head.appendChild(s);
  }

  function isControlNode(el,bubble){
    if(!(el instanceof Element))return false;
    if(el===bubble)return false;
    if(el.matches('button,a,input,textarea,select,option,script,style,svg'))return true;
    const marker=`${el.id||''} ${typeof el.className==='string'?el.className:''} ${el.getAttribute('role')||''}`;
    return CONTROL_RE.test(marker);
  }

  function markMultilineTextInBubble(bubble){
    if(!(bubble instanceof Element))return;

    const walker=document.createTreeWalker(bubble,NodeFilter.SHOW_TEXT);
    const nodes=[];
    let node;
    while((node=walker.nextNode()))nodes.push(node);

    for(const textNode of nodes){
      const text=String(textNode.nodeValue||'');
      if(!text.includes('\n')||!text.trim())continue;
      const parent=textNode.parentElement;
      if(!parent||parent.closest(`.${TEXT_CLASS}`))continue;

      let cursor=parent;
      let blocked=false;
      while(cursor&&cursor!==bubble){
        if(isControlNode(cursor,bubble)){blocked=true;break;}
        cursor=cursor.parentElement;
      }
      if(blocked)continue;

      // If the text already sits in a leaf text element, only mark that element.
      if(parent!==bubble&&parent.children.length===0){
        parent.classList.add(TEXT_CLASS);
        continue;
      }

      // Direct text inside the bubble: wrap only the actual message text node.
      const span=document.createElement('span');
      span.className=TEXT_CLASS;
      span.textContent=text;
      textNode.replaceWith(span);
    }
  }

  function processRoot(root=document){
    installStyle();
    if(root instanceof Element&&root.matches('.message-bubble'))markMultilineTextInBubble(root);
    root.querySelectorAll?.('.message-bubble').forEach(markMultilineTextInBubble);
  }

  let timer=null;
  const observer=new MutationObserver(mutations=>{
    const roots=[];
    for(const mutation of mutations){
      for(const added of mutation.addedNodes){
        if(added.nodeType!==Node.ELEMENT_NODE)continue;
        roots.push(added);
      }
    }
    if(!roots.length)return;
    clearTimeout(timer);
    timer=setTimeout(()=>roots.forEach(processRoot),30);
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  processRoot(document);
  [100,400,1200].forEach(ms=>setTimeout(()=>processRoot(document),ms));
  console.info('[LS Connect] v0.7.11.2 r5 precise multiline rendering active');
})();
