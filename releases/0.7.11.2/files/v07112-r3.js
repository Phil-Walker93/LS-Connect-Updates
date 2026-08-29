/* LS Connect v0.7.11.2 r3 – release UI + compact multiline bubbles */
(function v07112R3(){
  if(window.__LS_CONNECT_V07112_R3__)return;
  window.__LS_CONNECT_V07112_R3__=true;

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
    if(document.getElementById('v07112-r3-style'))return;
    const s=document.createElement('style');
    s.id='v07112-r3-style';
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

  function wrapDirectBubbleText(){
    document.querySelectorAll('.message-bubble').forEach(bubble=>{
      [...bubble.childNodes].forEach(node=>{
        if(node.nodeType!==Node.TEXT_NODE)return;
        const text=node.nodeValue||'';
        if(!text.trim())return;
        const span=document.createElement('span');
        span.className='v07112-direct-message-text';
        span.textContent=text;
        node.replaceWith(span);
      });
    });
  }

  function replaceVersionTextWithin(root){
    if(!root)return false;
    let changed=false;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      const text=String(node.nodeValue||'');
      if(!/v?0\.7\.\d+(?:\.\d+)?/i.test(text))continue;
      node.nodeValue=text.replace(/v?0\.7\.\d+(?:\.\d+)?/gi,match=>match.startsWith('v')?`v${VERSION}`:VERSION);
      changed=true;
    }
    return changed;
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
      const context=String(el.textContent||'');
      if(/LS\s*Connect|Roleplay\s*Messenger|^\s*v?0\.7\./i.test(context))replaceVersionTextWithin(el);
    });

    const sidebar=document.querySelector('.sidebar');
    if(sidebar){
      sidebar.querySelectorAll('small,span,div').forEach(el=>{
        const text=String(el.textContent||'').trim();
        if(/^Roleplay\s*Messenger/i.test(text)&&/v?0\.7\./i.test(text))replaceVersionTextWithin(el);
        else if(/^v?0\.7\.\d+(?:\.\d+)?$/i.test(text))el.textContent=`v${VERSION}`;
      });
    }
  }

  function ensureChangelogData(){
    const targets=[];
    try{if(typeof V07_LOCAL_CHANGELOG!=='undefined'&&Array.isArray(V07_LOCAL_CHANGELOG))targets.push(V07_LOCAL_CHANGELOG);}catch{}
    try{if(typeof V076_LOCAL_CHANGELOG!=='undefined'&&Array.isArray(V076_LOCAL_CHANGELOG))targets.push(V076_LOCAL_CHANGELOG);}catch{}
    for(const target of targets){
      const index=target.findIndex(x=>String(x?.version||'')===VERSION);
      if(index<0)target.unshift({...ENTRY,items:[...ENTRY.items]});
      else target[index]={...target[index],...ENTRY,items:Array.from(new Set([...(target[index]?.items||[]),...ENTRY.items]))};
    }
  }

  function visible(el){
    if(!el)return false;
    const style=getComputedStyle(el);
    return style.display!=='none'&&style.visibility!=='hidden'&&!el.classList.contains('hidden');
  }

  function whatsNewRoots(){
    const roots=[];
    const candidates=[
      document.getElementById('modalContent'),
      (()=>{try{return typeof els!=='undefined'?els?.modalContent:null;}catch{return null;}})(),
      ...document.querySelectorAll('[role="dialog"],.modal,.modal-content')
    ].filter(Boolean);
    for(const root of candidates){
      if(!visible(root))continue;
      const host=root.closest?.('[role="dialog"],.modal')||root;
      const title=String(host.querySelector?.('#modalTitle,h1,h2,h3,.modal-title')?.textContent||'');
      const text=String(root.textContent||'');
      if(/was\s+ist\s+neu/i.test(title)||(/was\s+ist\s+neu/i.test(text)&&/0\.7\./.test(text)))roots.push(root);
    }
    return [...new Set(roots)];
  }

  function injectWhatsNew(){
    ensureChangelogData();
    for(const root of whatsNewRoots()){
      if(root.querySelector('#v07112WhatsNewEntry')||String(root.textContent||'').includes(`v${VERSION}`)||String(root.textContent||'').includes(VERSION))continue;
      const section=document.createElement('section');
      section.id='v07112WhatsNewEntry';
      section.innerHTML=`<small>v${VERSION}</small><h3>${ENTRY.title}</h3><ul>${ENTRY.items.map(item=>`<li>${item}</li>`).join('')}</ul>`;
      root.prepend(section);
    }
  }

  function scheduleWhatsNew(){[0,40,120,300,700].forEach(ms=>setTimeout(injectWhatsNew,ms));}

  document.addEventListener('click',event=>{
    const trigger=event.target?.closest?.('button,a,[role="button"],.menu-item,.settings-row');
    if(trigger&&/was\s+ist\s+neu/i.test(String(trigger.textContent||'')))scheduleWhatsNew();
  },true);

  for(const name of ['v07OpenChangelog','openChangelog','openWhatsNew','v07OpenWhatsNew']){
    try{
      if(typeof window[name]!=='function'||window[name].__v07112R3)continue;
      const base=window[name];
      const wrapped=function(){const result=base.apply(this,arguments);scheduleWhatsNew();return result;};
      wrapped.__v07112R3=true;
      window[name]=wrapped;
    }catch{}
  }

  let queued=false;
  const refresh=()=>{
    if(queued)return;
    queued=true;
    queueMicrotask(()=>{
      queued=false;
      installStyles();
      wrapDirectBubbleText();
      fixBrandVersion();
      ensureChangelogData();
      injectWhatsNew();
    });
  };
  new MutationObserver(refresh).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  refresh();
  [100,350,900,1800,3500].forEach(ms=>setTimeout(refresh,ms));

  console.info('[LS Connect] v0.7.11.2 r3 release UI + compact multiline bubbles active');
})();
