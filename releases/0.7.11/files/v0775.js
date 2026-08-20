/* LS Connect v0.7.11 cumulative hybrid loader – repaired candidate */
(async()=>{
  const scripts=[
    './v0775-core.js?v=0.7.11-r1','./v078.js?v=0.7.11-r1','./v0781.js?v=0.7.11-r1','./v079.js?v=0.7.11-r1','./v0791.js?v=0.7.11-r1','./v0795.js?v=0.7.11-r1','./v0710.js?v=0.7.11-r1','./v07101.js?v=0.7.11-r1','./v07102.js?v=0.7.11-r1','./v07103.js?v=0.7.11-r1','./v07104.js?v=0.7.11-r1','./v07105.js?v=0.7.11-r1','./v07106.js?v=0.7.11-r1','./v07107.js?v=0.7.11-r1','./v07108.js?v=0.7.11-r1','./v07109.js?v=0.7.11-r1','./v071010.js?v=0.7.11-r1','./v071011.js?v=0.7.11-r1','./v071012.js?v=0.7.11-r1','./v071013.js?v=0.7.11-r1','./v0711.js?v=0.7.11-r1','./v0711-init.js?v=0.7.11-r1'
  ];
  for(const src of scripts){
    const path=src.split('?')[0].replace('./','/');
    if([...document.scripts].some(script=>script.src&&script.src.includes(path)))continue;
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src=src;script.async=false;
      script.onload=resolve;script.onerror=()=>reject(new Error(`LS Connect Modul konnte nicht geladen werden: ${src}`));
      document.head.appendChild(script);
    });
  }
})().catch(error=>console.error('[LS Connect] v0.7.11 Loaderfehler',error));
