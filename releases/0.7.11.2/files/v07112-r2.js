/* LS Connect v0.7.11.2 r2 – multiline chat composer & preserved line breaks */
(function v07112MultilineChat(){
  if(window.__LS_CONNECT_V07112_MULTILINE__)return;
  window.__LS_CONNECT_V07112_MULTILINE__=true;

  const STYLE_ID='v07112-multiline-chat-style';
  const BOUND='v07112MultilineBound';

  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .message-bubble,
      .message-bubble .message-text,
      .message-content,
      [data-message-content],
      .channel-post-content,
      .channel-post-body{
        white-space:pre-wrap!important;
        overflow-wrap:anywhere;
        word-break:break-word;
      }
      .message-compose textarea,
      .composer textarea,
      textarea[data-v07112-message-input]{
        white-space:pre-wrap;
        overflow-y:auto;
        resize:none;
        min-height:38px;
        max-height:160px;
        line-height:1.4;
      }
    `;
    document.head.appendChild(s);
  }

  function getMessageInput(){
    try{
      if(typeof els!=='undefined'&&els?.messageInput instanceof HTMLElement)return els.messageInput;
    }catch{}
    return document.querySelector('#messageInput,textarea[placeholder*="Nachricht" i],input[placeholder*="Nachricht" i],.message-compose textarea,.composer textarea,.message-compose input,.composer input');
  }

  function autoGrow(input){
    if(!(input instanceof HTMLTextAreaElement))return;
    input.style.height='auto';
    input.style.height=`${Math.min(160,Math.max(38,input.scrollHeight))}px`;
  }

  function replaceLegacyInput(input){
    if(!(input instanceof HTMLInputElement)||input.type==='file')return input;
    const ta=document.createElement('textarea');
    for(const attr of [...input.attributes]){
      if(attr.name==='type'||attr.name==='value')continue;
      try{ta.setAttribute(attr.name,attr.value);}catch{}
    }
    ta.value=input.value||'';
    ta.rows=1;
    ta.dataset.v07112MessageInput='1';
    input.replaceWith(ta);
    try{if(typeof els!=='undefined'&&els?.messageInput===input)els.messageInput=ta;}catch{}
    ta.dispatchEvent(new Event('input',{bubbles:true}));
    return ta;
  }

  function sendShortcut(input){
    const button=document.querySelector('.send-button,[data-send-message],#sendButton,.message-compose button[type="submit"],.composer button[type="submit"]');
    if(button instanceof HTMLElement){button.click();return true;}
    const candidates=['sendMessage','sendCurrentMessage','submitMessage'];
    for(const name of candidates){
      try{if(typeof window[name]==='function'){window[name]();return true;}}catch{}
    }
    return false;
  }

  function bindInput(raw){
    if(!(raw instanceof HTMLElement))return;
    let input=replaceLegacyInput(raw);
    if(!(input instanceof HTMLTextAreaElement))return;
    if(input.dataset[BOUND])return;
    input.dataset[BOUND]='1';
    input.dataset.v07112MessageInput='1';
    input.rows=1;

    input.addEventListener('keydown',event=>{
      if(event.key!=='Enter'||event.isComposing)return;
      if(event.ctrlKey||event.metaKey){
        event.preventDefault();
        event.stopImmediatePropagation();
        sendShortcut(input);
        return;
      }
      // Normal Enter must remain a native textarea line break.
      // Stop older LS-Connect handlers from turning Enter into "send".
      event.stopImmediatePropagation();
      queueMicrotask(()=>autoGrow(input));
    },true);

    input.addEventListener('input',()=>autoGrow(input),true);
    autoGrow(input);

    // If the old emoji picker captured a replaced legacy input, take over emoji insertion.
    document.getElementById('emojiComposePicker')?.addEventListener('click',event=>{
      const b=event.target.closest?.('[data-compose-emoji]');
      if(!b)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const emoji=b.dataset.composeEmoji||b.textContent||'';
      const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;
      input.setRangeText(emoji,start,end,'end');
      input.dispatchEvent(new Event('input',{bubbles:true}));
      input.focus();
    },true);
  }

  function refresh(){
    installStyles();
    const input=getMessageInput();
    if(input)bindInput(input);
  }

  const observer=new MutationObserver(()=>refresh());
  observer.observe(document.documentElement,{childList:true,subtree:true});
  refresh();
  [250,700,1500,3000].forEach(ms=>setTimeout(refresh,ms));

  const changelog=typeof V07_LOCAL_CHANGELOG!=='undefined'&&Array.isArray(V07_LOCAL_CHANGELOG)?V07_LOCAL_CHANGELOG:null;
  if(changelog){
    const entry=changelog.find(x=>String(x?.version||'')==='0.7.11.2');
    const additions=[
      'Enter fügt im Chat jetzt eine neue Zeile bzw. einen Absatz ein',
      'Nachrichten werden über den Senden-Button oder Strg/Cmd + Enter gesendet',
      'Zeilenumbrüche und Leerzeilen bleiben in gesendeten Nachrichten sichtbar'
    ];
    if(entry){
      entry.items=Array.from(new Set([...(entry.items||[]),...additions]));
    }else{
      changelog.unshift({version:'0.7.11.2',title:'Profilbilder, Versionsanzeige & Chat-Absätze',items:additions});
    }
  }

  console.info('[LS Connect] v0.7.11.2 r2 multiline chat active');
})();
