/* LS Connect v0.7.7.5 safe compatibility loader */
(function(){
  const load=(src,tag,next)=>{
    if(document.querySelector(`script[data-ls-loader="${tag}"]`)){next?.();return;}
    const s=document.createElement('script');
    s.src=src;s.dataset.lsLoader=tag;
    s.onload=()=>next?.();
    s.onerror=()=>console.error(`[LS Connect] ${src} konnte nicht geladen werden.`);
    document.head.appendChild(s);
  };
  load('v0773-core.js?v=0.7.7.5','v0773-core',()=>load('v0775.js?v=0.7.7.5','v0775'));
})();
