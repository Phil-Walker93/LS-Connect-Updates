/* LS Connect v0.7.8 compatibility loader: keep v0.7.7.5 patch, then load v0.7.8 */
(function v078CompatibilityLoader(){
  const load=src=>new Promise((resolve,reject)=>{
    const existing=[...document.scripts].find(s=>s.src&&s.src.includes(src.replace(/^\.\//,'')));
    if(existing){if(existing.dataset.loadedV078==='1')return resolve();existing.addEventListener('load',resolve,{once:true});existing.addEventListener('error',reject,{once:true});return;}
    const script=document.createElement('script');script.src=src;script.async=false;script.dataset.loadedV078='1';script.onload=resolve;script.onerror=()=>reject(new Error(`Modul konnte nicht geladen werden: ${src}`));document.head.appendChild(script);
  });
  (async()=>{try{await load('./v0775-core.js?v=0.7.8');await load('./v078.js?v=0.7.8');}catch(error){console.error('[LS Connect] v0.7.8 Loaderfehler',error);}})();
})();
