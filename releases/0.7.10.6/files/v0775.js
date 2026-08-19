/* LS Connect v0.7.10.6 cumulative hybrid loader */
(async()=>{
  const scripts=[
    './v0775-core.js?v=0.7.10.6','./v078.js?v=0.7.10.6','./v0781.js?v=0.7.10.6','./v079.js?v=0.7.10.6','./v0791.js?v=0.7.10.6','./v0795.js?v=0.7.10.6','./v0710.js?v=0.7.10.6','./v07101.js?v=0.7.10.6','./v07102.js?v=0.7.10.6','./v07103.js?v=0.7.10.6','./v07104.js?v=0.7.10.6','./v07105.js?v=0.7.10.6','./v07106.js?v=0.7.10.6'
  ];
  for(const src of scripts){
    if([...document.scripts].some(s=>s.src&&s.src.includes(src.split('?')[0].replace('./','/'))))continue;
    await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error(`LS Connect Modul konnte nicht geladen werden: ${src}`));document.head.appendChild(s);});
  }
})().catch(error=>console.error('[LS Connect] v0.7.10.6 Loaderfehler',error));
