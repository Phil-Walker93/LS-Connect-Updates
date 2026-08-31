/* LS Connect v0.9.4 – local preview endpoint routing shim */
(function v094PreviewRouting(){
  if(window.__LS_CONNECT_V094_PREVIEW_ROUTING__) return;
  window.__LS_CONNECT_V094_PREVIEW_ROUTING__=true;

  const ORIGIN='https://ls-connect-online.vercel.app';
  const absolute=value=>typeof value==='string'&&value.startsWith('/api/script')?ORIGIN+value:value;

  const originalFetch=window.fetch.bind(window);
  window.fetch=function previewFetch(input,init){
    if(typeof input==='string') return originalFetch(absolute(input),init);
    if(input instanceof Request && input.url.startsWith(location.origin+'/api/script')){
      const path=input.url.slice(location.origin.length);
      return originalFetch(new Request(ORIGIN+path,input),init);
    }
    return originalFetch(input,init);
  };

  const srcDescriptor=Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,'src');
  if(srcDescriptor?.get&&srcDescriptor?.set){
    Object.defineProperty(HTMLScriptElement.prototype,'src',{
      configurable:srcDescriptor.configurable,
      enumerable:srcDescriptor.enumerable,
      get(){return srcDescriptor.get.call(this);},
      set(value){return srcDescriptor.set.call(this,absolute(value));}
    });
  }

  const originalSetAttribute=HTMLScriptElement.prototype.setAttribute;
  HTMLScriptElement.prototype.setAttribute=function(name,value){
    if(String(name).toLowerCase()==='src') value=absolute(value);
    return originalSetAttribute.call(this,name,value);
  };

  window.__LS_CONNECT_PREVIEW_API_ORIGIN__=ORIGIN;
  console.info('[LS Connect] v0.9.4 preview routing active');
})();
