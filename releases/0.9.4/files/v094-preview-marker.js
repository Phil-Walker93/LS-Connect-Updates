/* LS Connect v0.9.4 – static RC preview marker */
(function v094PreviewMarker(){
  if(window.__LS_CONNECT_V094_PREVIEW_MARKER__) return;
  window.__LS_CONNECT_V094_PREVIEW_MARKER__=true;
  const RC_VERSION='0.9.1';
  const LOADER_VERSION='0.9.4';
  function mark(){
    window.__LS_CONNECT_PREVIEW_CHANNEL__='redesign-rc';
    window.__LS_CONNECT_PREVIEW_LOADER_VERSION__=LOADER_VERSION;
    window.__LS_CONNECT_ONLINE_VERSION__=RC_VERSION;
    window.__LS_CONNECT_RUNTIME_VERSION__=RC_VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=RC_VERSION;
    document.documentElement.dataset.lsPreview='redesign-rc';
    document.documentElement.dataset.lsPreviewLoader=LOADER_VERSION;
    document.documentElement.dataset.lsVersion=RC_VERSION;
    const badge=document.querySelector('.v080-ui-badge');
    if(badge){
      const qa=String(document.documentElement.dataset.lsRcQa||'').toUpperCase();
      badge.textContent=qa?`Hub UI · RC ${RC_VERSION} · ${qa}`:`Hub UI · RC ${RC_VERSION} · PREVIEW`;
      badge.title='LS Connect Redesign Preview v0.9.4 – Production bleibt unverändert';
    }
  }
  mark();
  [0,250,700,1400,2600].forEach(ms=>setTimeout(mark,ms));
  window.addEventListener('ls-connect:rc-qa',mark);
  console.info('[LS Connect] v0.9.4 static preview marker active');
})();
