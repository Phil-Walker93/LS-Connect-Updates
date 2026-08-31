/* LS Connect v0.7.11 r4 – isolated account design sync */
var LS_CONNECT_V0711_R4_VERSION='0.7.11-r4';
(function v0711R4DesignSync(){
  if(window.__LS_CONNECT_V0711_R4_DESIGN_SYNC__)return;
  window.__LS_CONNECT_V0711_R4_DESIGN_SYNC__=true;

  if(typeof db==='undefined'||!db||typeof db.rpc!=='function'){
    console.warn('[LS Connect] v0.7.11 r4: Supabase RPC client nicht verfügbar.');
    return;
  }

  const DESIGN_READ_TTL_MS=30000;
  const DESIGN_WRITE_DEDUPE_MS=1500;
  const rpcBase=db.rpc.bind(db);
  let readCache=null;
  let readInFlight=null;
  let writeInFlight=null;
  let lastWrite=null;

  db.rpc=function v0711R4Rpc(name,args,options){
    const mapped=name==='set_design_preset_v071012'
      ? 'set_design_preset_v0711'
      : name==='my_design_preset_v071012'
        ? 'my_design_preset_v0711'
        : name;

    if(mapped==='my_design_preset_v0711'){
      const now=Date.now();
      if(readCache&&readCache.expiresAt>now)return Promise.resolve(readCache.result);
      if(readInFlight)return readInFlight;
      readInFlight=Promise.resolve(rpcBase(mapped,args,options))
        .then(result=>{
          if(!result?.error)readCache={expiresAt:Date.now()+DESIGN_READ_TTL_MS,result};
          return result;
        })
        .finally(()=>{readInFlight=null;});
      return readInFlight;
    }

    if(mapped==='set_design_preset_v0711'){
      const preset=String(args?.p_preset||'');
      const now=Date.now();
      if(writeInFlight&&writeInFlight.preset===preset)return writeInFlight.promise;
      if(lastWrite&&lastWrite.preset===preset&&now-lastWrite.at<DESIGN_WRITE_DEDUPE_MS){
        return Promise.resolve(lastWrite.result);
      }
      const promise=Promise.resolve(rpcBase(mapped,args,options))
        .then(result=>{
          if(!result?.error){
            lastWrite={preset,at:Date.now(),result};
            readCache={expiresAt:Date.now()+DESIGN_READ_TTL_MS,result:{data:preset,error:null}};
          }
          return result;
        })
        .finally(()=>{if(writeInFlight?.promise===promise)writeInFlight=null;});
      writeInFlight={preset,promise};
      return promise;
    }

    return rpcBase(mapped,args,options);
  };

  console.info('[LS Connect] v0.7.11 r4 isolated design account sync active');
})();
