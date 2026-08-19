/* LS Connect v0.7.8.1 compatibility loader */
(function v0781CompatibilityLoader(){
  const loaded=src=>[...document.scripts].some(s=>s.src&&s.src.includes(src.replace(/^\.\//,''))&&s.dataset.lsReady==='1');
  const load=src=>new Promise((resolve,reject)=>{
    const key=src.replace(/^\.\//,'').split('?')[0];
    const existing=[...document.scripts].find(s=>s.src&&s.src.includes(key));
    if(existing){
      if(existing.dataset.lsReady==='1'||existing.readyState==='complete') return resolve();
      existing.addEventListener('load',()=>{existing.dataset.lsReady='1';resolve();},{once:true});
      existing.addEventListener('error',reject,{once:true});
      return;
    }
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    script.onload=()=>{script.dataset.lsReady='1';resolve();};
    script.onerror=()=>reject(new Error(`Modul konnte nicht geladen werden: ${src}`));
    document.head.appendChild(script);
  });
  (async()=>{
    try{
      await load('./v0775-core.js?v=0.7.8.1');
      await load('./v078.js?v=0.7.8.1');
      await load('./v0781.js?v=0.7.8.1');
    }catch(error){
      console.error('[LS Connect] v0.7.8.1 Loaderfehler',error);
    }
  })();
})();
