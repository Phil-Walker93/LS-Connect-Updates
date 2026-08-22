/* LS Connect v0.7.11 r4 – isolated account design sync */
var LS_CONNECT_V0711_R4_VERSION='0.7.11-r4';
(function v0711R4DesignSync(){
  if(window.__LS_CONNECT_V0711_R4_DESIGN_SYNC__)return;
  window.__LS_CONNECT_V0711_R4_DESIGN_SYNC__=true;

  if(typeof db==='undefined'||!db||typeof db.rpc!=='function'){
    console.warn('[LS Connect] v0.7.11 r4: Supabase RPC client nicht verfügbar.');
    return;
  }

  const rpcBase=db.rpc.bind(db);
  db.rpc=function v0711R4Rpc(name,args,options){
    const mapped=name==='set_design_preset_v071012'
      ? 'set_design_preset_v0711'
      : name==='my_design_preset_v071012'
        ? 'my_design_preset_v0711'
        : name;
    return rpcBase(mapped,args,options);
  };

  console.info('[LS Connect] v0.7.11 r4 isolated design account sync active');
})();
