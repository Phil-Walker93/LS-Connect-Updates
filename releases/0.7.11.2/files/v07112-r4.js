/* LS Connect v0.7.11.2 r4 – safe release UI + compact multiline bubbles */
(function v07112R4(){
  if(window.__LS_CONNECT_V07112_R4__)return;
  window.__LS_CONNECT_V07112_R4__=true;

  const VERSION='0.7.11.2';
  const ENTRY={
    version:VERSION,
    title:'Profilbilder, Versionsanzeige & Chat-Absätze',
    items:[
      'Profilbilder können jetzt bis zu 5 MB groß sein',
      'Enter fügt im Chat eine neue Zeile bzw. einen Absatz ein',
      'Senden erfolgt über den Senden-Button oder Strg/Cmd + Enter',
      'Zeilenumbrüche und Leerzeilen bleiben nach dem Senden erhalten',
      'Nachrichtenblasen bleiben auch bei längeren Absatztexten kompakt',
      'Die sichtbare Versionsanzeige folgt dem aktuellen Release-Stand'
    ]
  };

  function installStyles(){
    if(document.getElementById('v07112-r4-style'))return;
    const s=document.createElement('style');
    s.id='v07112-r4-style';
    s.textContent=`
      .message-bubble{white-space:normal!important}
      .message-bubble .message-text,
      .message-bubble .message-content,
      .message-bubble [data-message-content],
      .message-content,
      [data-message-content],
      .channel-post-content,
      .channel-post-body,
      .v07112-direct-message-text{
        white-space:pre-wrap!important;
        overflow-wrap:anywhere;
        word-break:break-word;
      }
      .message-bubble p,.message-content p,[data-message-content] p{margin:0 0 .42em}
      .message-bubble p:last-child,.message-content p:last-child,[data-message-content] p:last-child{margin-bottom:0}
      #v07112WhatsNewEntry{margin:0 0 12px;padding:12px;border:1px solid var(--border);border-radius:12px;background:var(--panel-2)}
      #v07112WhatsNewEntry h3{margin:2px 0 7px;font-size:1rem}
      #v07112WhatsNewEntry small{color:var(--muted);font-weight:800}
      #v07112WhatsNewEntry ul{margin:8px 0 0;padding-left:20px;display:grid;gap:4px}
    `;
    document.head.appendChild(s);
  }

  function wrapDirectBubbleText(root=document){
    root.querySelectorAll?.('.message-bubble').forEach(bubble=>{
      [...bubble.childNodes].forEach(node=>{
        if(node.nodeType!==Node.TEXT_NODE||!String(node.nodeValue||'').trim())return;
        const span=document.createElement('span');
        span.className='v07112-direct-message-text';
        span.textContent=node.nodeValue;
        node.replaceWith(span);
      });
    });
  }

  function replaceVersionTextWithin(root){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      const oldText=String(node.nodeValue||'');
      if(!/v?0\.7\.\d+(?:\.\d+)?/i.test(oldText))continue;
      const newText=oldText.replace(/v?0\.7\.\d+(?:\.\d+)?/gi,m=>m.startsWith('v')?`v${VERSION}`:VERSION);
      if(newText!==oldText)node.nodeValue=newText;
    }
  }

  function fixBrandVersion(){
    window.__LS_CONNECT_RUNTIME_VERSION__=VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=VERSION;
    window.__LS_CONNECT_ONLINE_VERSION__=VERSION;
    document.documentElement.dataset.lsVersion=VERSION;

    const selectors=[
      '.brand-copy','.brand','.app-brand','.sidebar header','.sidebar [class*="brand"]',
      'header [class*="brand"]','[data-ls-version]','[data-version-label]','#appVersion','#currentVersion',
      '#versionBadge','.app-version','.version-label'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(el=>{
      const text=String(el.textContent||'');
      if(/LS\s*Connect|Roleplay\s*Messenger|^\s*v?0\.7\./i.test(text))replaceVersionTextWithin(el);
    });

    const sidebar=document.querySelector('.sidebar');
    sidebar?.querySelectorAll('small,span,div').forEach(el=>{
      const oldText=String(el.textContent||'').trim();
      if(/^Roleplay\s*Messenger/i.test(oldText)&&/v?0\.7\./i.test(oldText))replaceVersionTextWithin(el);
      else if(/^v?0\.7\.\d+(?:\.\d+)?$/i.test(oldText)){
        const wanted=`v${VERSION}`;
        if(oldText!==wanted)el.textContent=wanted;
      }
    });
  }

  function ensureChangelogData(){
    const targets=[];
    try{if(typeof V07_LOCAL_CHANGELOG!=='undefined'&&Array.isArray(V07_LOCAL_CHANGELOG))targets.push(V07_LOCAL_CHANGELOG);}catch{}
    try{if(typeof V076_LOCAL_CHANGELOG!=='undefined'&&Array.isArray(V076_LOCAL_CHANGELOG))targets.push(V076_LOCAL_CHANGELOG);}catch{}
    targets.forEach(target=>{
      const index=target.findIndex(x=>String(x?.version||'')===VERSION);
      if(index<0){target.unshift({...ENTRY,items:[...ENTRY.items]});return;}
      const current=target[index]||{};
      const mergedItems=Array.from(new Set([...(current.items||[]),...ENTRY.items]));
      if(current.title!==ENTRY.title||mergedItems.length!==(current.items||[]).length){
        target[index]={...current,...ENTRY,items:mergedItems};
      }
    });
  }

  function visible(el){
    if(!el)return false;
    const style=getComputedStyle(el);
    return style.display!=='none'&&style.visibility!=='hidden'&&!el.classList.contains('hidden');
  }

  function injectWhatsNew(){
    ensureChangelogData();
    const candidates=[
      document.getElementById('modalContent'),
      (()=>{try{return typeof els!=='undefined'?els?.modalContent:null;}catch{return null;}})(),
      ...document.querySelectorAll('[role="dialog"],.modal,.modal-content')
    ].filter(Boolean);

    [...new Set(candidates)].forEach(root=>{
      if(!visible(root))return;
      const host=root.closest?.('[role="dialog"],.modal')||root;
      const title=String(host.querySelector?.('#modalTitle,h1,h2,h3,.modal-title')?.textContent||'');
      const text=String(root.textContent||'');
      if(!(/was\s+ist\s+neu/i.test(title)||(/was\s+ist\s+neu/i.test(text)&&/0\.7\./.test(text))))return;
      if(root.querySelector('#v07112WhatsNewEntry')||text.includes(`v${VERSION}`)||text.includes(VERSION))return;
      const section=document.createElement('section');
      section.id='v07112WhatsNewEntry';
      section.innerHTML=`<small>v${VERSION}</small><h3>${ENTRY.title}</h3><ul>${ENTRY.items.map(i=>`<li>${i}</li>`).join('')}</ul>`;
      root.prepend(section);
    });
  }

  function refresh(){
    installStyles();
    wrapDirectBubbleText();
    fixBrandVersion();
    ensureChangelogData();
    injectWhatsNew();
  }

  let timer=null;
  const observer=new MutationObserver(mutations=>{
    const relevant=mutations.some(m=>m.type==='childList'&&m.addedNodes.length);
    if(!relevant)return;
    clearTimeout(timer);
    timer=setTimeout(refresh,40);
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  document.addEventListener('click',event=>{
    const trigger=event.target?.closest?.('button,a,[role="button"],.menu-item,.settings-row');
    if(trigger&&/was\s+ist\s+neu/i.test(String(trigger.textContent||''))){
      [0,60,180,450].forEach(ms=>setTimeout(injectWhatsNew,ms));
    }
  },true);

  refresh();
  [150,600,1600].forEach(ms=>setTimeout(refresh,ms));
  console.info('[LS Connect] v0.7.11.2 r4 safe release UI active');
})();
