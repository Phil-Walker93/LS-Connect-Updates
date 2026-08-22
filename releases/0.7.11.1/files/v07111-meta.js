/* LS Connect v0.7.11.1 – release metadata bridge loader */
(function(){
  if(window.__LS_CONNECT_V07111_META_LOADER__)return;
  window.__LS_CONNECT_V07111_META_LOADER__=true;
  if(window.__LS_CONNECT_RELEASE_META_V071014__)return;
  const script=document.createElement('script');
  script.src='/api/script?version=0.7.10.14&file=v071014-meta.js&v=0.7.10.14-meta1';
  script.async=false;
  script.onload=()=>console.info('[LS Connect] Release metadata bridge loaded from v0.7.11.1');
  script.onerror=()=>console.error('[LS Connect] Release metadata bridge could not be loaded');
  document.head.appendChild(script);
})();
