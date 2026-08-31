/* LS Connect v0.9.2 – isolated RC preview marker */
(function v092PreviewMarker(){
  if(window.__LS_CONNECT_V092_PREVIEW_MARKER__) return;
  window.__LS_CONNECT_V092_PREVIEW_MARKER__=true;

  const RC_VERSION='0.9.1';
  const LOADER_VERSION='0.9.2';

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
      badge.title='Isolierte LS Connect Redesign Vorschau – Production bleibt unverändert';
    }
  }

  mark();
  [0,300,1000,1800].forEach(ms=>setTimeout(mark,ms));
  window.addEventListener('ls-connect:rc-qa',mark);
  console.info('[LS Connect] isolated RC preview marker active');
})();
