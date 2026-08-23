/* LS Connect v0.7.11.2 – avatar 5 MB + visible release version */
var LS_CONNECT_V07112_VERSION='0.7.11.2';

(async function v07112Boot(){
  if(window.__LS_CONNECT_V07112_AVATAR_VERSION__)return;
  window.__LS_CONNECT_V07112_AVATAR_VERSION__=true;

  const PREVIOUS_VERSION='0.7.11.1';
  const previousFiles=['v07111.js','v07111-r2.js','v07111-meta.js'];
  for(const file of previousFiles){
    const marker=`${PREVIOUS_VERSION}:${file}`;
    const already=[...document.scripts].some(s=>
      s.dataset?.lsReleaseFile===marker ||
      (s.src&&s.src.includes(`version=${encodeURIComponent(PREVIOUS_VERSION)}`)&&s.src.includes(`file=${encodeURIComponent(file)}`))
    );
    if(already)continue;
    await new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.dataset.lsReleaseFile=marker;
      s.src=`/api/script?version=${encodeURIComponent(PREVIOUS_VERSION)}&file=${encodeURIComponent(file)}&v=r3-meta`;
      s.async=false;
      s.onload=resolve;
      s.onerror=()=>reject(new Error(`Vorheriges Stable-Modul konnte nicht geladen werden: ${file}`));
      document.head.appendChild(s);
    });
  }

  const MAX_AVATAR_BYTES=5*1024*1024;
  const LEGACY_SAFE_BYTES=(2*1024*1024)-1;
  const actualAvatarSizes=new WeakMap();
  const toast=(message,type='info')=>typeof showToast==='function'?showToast(message,type):console.info('[LS Connect]',message);

  function isAvatarInput(input){
    if(!(input instanceof HTMLInputElement)||input.type!=='file')return false;
    const idName=`${input.id||''} ${input.name||''}`.toLowerCase();
    if(/avatar|profile|profil/.test(idName))return true;
    const accept=String(input.accept||'').toLowerCase();
    const scope=input.closest('.modal,.modal-content,[role="dialog"],form')||input.parentElement;
    const nearby=String(scope?.textContent||'').slice(0,5000);
    return (accept.includes('image')||accept.includes('image/'))&&/profilbild|avatar/i.test(nearby);
  }

  function spoofLegacySize(file){
    if(!file||actualAvatarSizes.has(file))return true;
    const actual=Number(file.size)||0;
    if(actual<=LEGACY_SAFE_BYTES)return true;
    actualAvatarSizes.set(file,actual);
    try{
      Object.defineProperty(file,'size',{
        configurable:true,
        enumerable:false,
        get(){return Math.min(actualAvatarSizes.get(file)||actual,LEGACY_SAFE_BYTES);}
      });
      return true;
    }catch(error){
      actualAvatarSizes.delete(file);
      console.warn('[LS Connect] Legacy-Avatar-Limit konnte nicht überbrückt werden.',error);
      return false;
    }
  }

  function actualFileSize(file){return actualAvatarSizes.get(file)??Number(file?.size||0);}

  document.addEventListener('change',event=>{
    const input=event.target;
    if(!isAvatarInput(input))return;
    const file=input.files?.[0];
    if(!file)return;
    const size=actualFileSize(file);
    if(size>MAX_AVATAR_BYTES){
      event.preventDefault();
      event.stopImmediatePropagation();
      input.value='';
      toast('Profilbild darf maximal 5 MB groß sein.','error');
      return;
    }
    if(size>LEGACY_SAFE_BYTES&&!spoofLegacySize(file)){
      event.preventDefault();
      event.stopImmediatePropagation();
      input.value='';
      toast('Profilbild konnte nicht für den 5-MB-Upload vorbereitet werden.','error');
    }
  },true);

  if(typeof showToast==='function'&&!showToast.__v07112AvatarLimit){
    const baseShowToast=showToast;
    const patched=function showToastV07112(message,type){
      let text=message;
      if(typeof text==='string'&&/profilbild/i.test(text)&&/2\s*MB/i.test(text)){
        text=text.replace(/2\s*MB/gi,'5 MB');
      }
      return baseShowToast.call(this,text,type);
    };
    patched.__v07112AvatarLimit=true;
    showToast=patched;
  }

  function replaceLimitText(root=document.body){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      const text=String(node.nodeValue||'');
      if(!/2\s*MB/i.test(text))continue;
      const scope=node.parentElement?.closest?.('.modal,.modal-content,[role="dialog"],form')||node.parentElement;
      const context=String(scope?.textContent||'');
      if(/profilbild|avatar/i.test(context))node.nodeValue=text.replace(/2\s*MB/gi,'5 MB');
    }
  }

  function replaceBrandVersion(root=document.body){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      const text=String(node.nodeValue||'');
      if(!/Roleplay\s+Messenger/i.test(text)||!(/v\d+\.\d+\.\d+/i.test(text)))continue;
      if(text.includes(`v${LS_CONNECT_V07112_VERSION}`))continue;
      node.nodeValue=text.replace(/v\d+(?:\.\d+){2,3}/i,`v${LS_CONNECT_V07112_VERSION}`);
    }
    document.documentElement.dataset.lsVersion=LS_CONNECT_V07112_VERSION;
    window.__LS_CONNECT_RUNTIME_VERSION__=LS_CONNECT_V07112_VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=LS_CONNECT_V07112_VERSION;
  }

  function refreshVisibleMetadata(){
    replaceLimitText(document.body);
    replaceBrandVersion(document.body);
  }

  let refreshQueued=false;
  const observer=new MutationObserver(()=>{
    if(refreshQueued)return;
    refreshQueued=true;
    queueMicrotask(()=>{refreshQueued=false;refreshVisibleMetadata();});
  });
  observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true});

  refreshVisibleMetadata();
  [150,500,1200,2600].forEach(ms=>setTimeout(refreshVisibleMetadata,ms));

  const changelog=typeof V07_LOCAL_CHANGELOG!=='undefined'&&Array.isArray(V07_LOCAL_CHANGELOG)?V07_LOCAL_CHANGELOG:null;
  if(changelog&&!changelog.some(x=>String(x?.version||'')===LS_CONNECT_V07112_VERSION)){
    changelog.unshift({
      version:LS_CONNECT_V07112_VERSION,
      title:'Profilbilder bis 5 MB & Versionsanzeige',
      items:[
        'Profilbilder können jetzt bis zu 5 MB groß sein',
        'Hinweise und Fehlermeldungen zeigen die neue 5-MB-Grenze',
        'Die sichtbare LS-Connect-Version im Branding folgt dem aktuellen Release-Stand',
        'Die bestehende Charakter-Erstellung und Avatar-Vorschau bleiben unverändert'
      ]
    });
  }

  console.info('[LS Connect] v0.7.11.2 avatar 5 MB + visible version active');
})().catch(error=>console.error('[LS Connect] v0.7.11.2 startup failed',error));
