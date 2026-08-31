/* LS Connect v0.7.10.13 – online bootstrap wrapper */
(async()=>{
  if(window.__LS_CONNECT_V071013_BOOTSTRAP__)return;
  window.__LS_CONNECT_V071013_BOOTSTRAP__=true;
  const load=(src,key)=>new Promise((resolve,reject)=>{
    if([...document.scripts].some(s=>s.dataset?.lsBootstrapKey===key)){resolve();return;}
    const script=document.createElement('script');script.dataset.lsBootstrapKey=key;script.src=src;script.async=false;script.onload=resolve;script.onerror=()=>reject(new Error(`LS Connect Bootstrap-Modul konnte nicht geladen werden: ${key}`));document.head.appendChild(script);
  });
  try{
    await load('/api/script?version=0.7.10.13&file=v071013-core.js&v=0.7.10.13-core1','v071013-core');
    await load('/api/script?version=0.7.10.14&file=v071014.js&v=0.7.10.14-r1','v071014-release-center');
    await load('/api/script?version=0.7.10.14&file=v071014-meta.js&v=0.7.10.14-meta1','v071014-release-meta');
    await load('/api/script?version=0.7.10.14&file=lmh-return.js&v=0.7.10.14-lmh1','lmh-return');
    console.info('[LS Connect] Online Release Center bootstrap active');
  }catch(error){console.error('[LS Connect] Release Center bootstrap failed',error);}
})();
