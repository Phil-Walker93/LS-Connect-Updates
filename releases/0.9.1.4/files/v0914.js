/* LS Connect v0.9.1.4 – organization-context bootloader */
var LS_CONNECT_V0914_VERSION='0.9.1.4';
(async function(){
  if(window.__LS_CONNECT_V0914_BOOT__)return;
  window.__LS_CONNECT_V0914_BOOT__=true;

  function load(version,file,key){
    return new Promise(function(resolve,reject){
      if([].slice.call(document.scripts).some(function(script){return script.dataset&&script.dataset.lsReleaseFile===key;})){resolve();return;}
      var script=document.createElement('script');
      script.dataset.lsReleaseFile=key;
      script.src='/api/script?version='+encodeURIComponent(version)+'&file='+encodeURIComponent(file)+'&v=0914-org-context-r1';
      script.async=false;
      script.onload=resolve;
      script.onerror=function(){reject(new Error('LS Connect Modul konnte nicht geladen werden: '+version+'/'+file));};
      document.head.appendChild(script);
    });
  }

  await load('0.9.1.3','v0913-lmh-identity.js','v0913-lmh-identity');
  await load('0.9.1.4','v0914-organization-context.js','v0914-organization-context');

  document.documentElement.dataset.lsVersion=LS_CONNECT_V0914_VERSION;
  document.documentElement.dataset.lsIdentityOwner='lmh';
  document.documentElement.dataset.lsOrganizationContext='lmh';
  window.__LS_CONNECT_DYNAMIC_RELEASE__=LS_CONNECT_V0914_VERSION;
  window.dispatchEvent(new CustomEvent('ls-connect-release-ready',{detail:{version:LS_CONNECT_V0914_VERSION,feature:'lmh-organization-context'}}));
  console.info('[LS Connect] v0.9.1.4 organization context active');
})().catch(function(error){
  console.error('[LS Connect] v0.9.1.4 startup failed',error);
  window.dispatchEvent(new CustomEvent('ls-connect-release-error',{detail:{version:LS_CONNECT_V0914_VERSION,message:String(error&&error.message||error)}}));
});