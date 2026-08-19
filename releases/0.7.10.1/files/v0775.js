/* LS Connect v0.7.10.1 cumulative hybrid loader */
(async()=>{
  const scripts=[
    './v0775-core.js?v=0.7.10.1',
    './v078.js?v=0.7.10.1',
    './v0781.js?v=0.7.10.1',
    './v079.js?v=0.7.10.1',
    './v0791.js?v=0.7.10.1',
    './v0795.js?v=0.7.10.1',
    './v0710.js?v=0.7.10.1',
    './v07101.js?v=0.7.10.1'
  ];
  for(const src of scripts){
    if([...document.scripts].some(s=>s.src&&s.src.includes(src.split('?')[0].replace('./','/'))))continue;
    await new Promise((resolve,reject)=>{
      const s=document.createElement('script');s.src=src;s.async=false;
      s.onload=resolve;s.onerror=()=>reject(new Error(`LS Connect Modul konnte nicht geladen werden: ${src}`));
      document.head.appendChild(s);
    });
  }
})().catch(error=>console.error('[LS Connect] v0.7.10.1 Loaderfehler',error));
