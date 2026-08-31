/* LS Connect v0.8.5 – Mobile Polish */
(function v0805MobilePolish(){
  if(window.__LS_CONNECT_V0805_MOBILE__) return;
  window.__LS_CONNECT_V0805_MOBILE__=true;
  const VERSION='0.8.5';
  const STYLE_ID='v0805-mobile-style';

  function installStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      @media(max-width:700px){
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] body{overscroll-behavior-y:none;background:#07101d!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .app-shell{height:100dvh!important;min-height:100dvh!important;overflow:hidden!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .sidebar,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .conversation-panel,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .profile-panel{height:100dvh!important;min-height:100dvh!important;overflow:hidden!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .sidebar{padding:8px 6px 84px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .brand,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .brand-copy,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .app-brand{padding:8px 10px 9px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .v0801-nav-deck{margin:4px 7px 8px!important;padding:5px!important;border-radius:14px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .v0801-nav-filter{min-height:42px!important;border-radius:10px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .chat-list,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .channel-list,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .conversation-list{overflow-y:auto!important;padding-bottom:18px!important;scroll-padding-bottom:96px}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .chat-item,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .channel-item{min-height:58px!important;margin:3px 7px!important;padding:10px 11px!important;border-radius:14px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .chat-header,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .conversation-header,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .profile-header{position:sticky!important;top:0!important;z-index:20!important;min-height:58px!important;padding:8px 10px!important;padding-top:max(8px,env(safe-area-inset-top))!important;background:rgba(7,16,29,.94)!important;backdrop-filter:blur(20px)!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .chat-header button,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .conversation-header button,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .profile-header button{min-width:42px!important;min-height:42px!important;border-radius:12px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .messages{height:auto!important;min-height:0!important;overflow-y:auto!important;padding:12px 9px calc(104px + env(safe-area-inset-bottom))!important;scroll-padding-bottom:130px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .message-row{margin:3px 0!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .message-bubble{max-width:88%!important;padding:9px 11px!important;border-radius:16px!important;font-size:13px!important;line-height:1.45!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .message-actions,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] [class*='message-actions']{opacity:1!important;transform:scale(.92);transform-origin:center}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .message-compose,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .composer{position:fixed!important;left:0!important;right:0!important;bottom:0!important;z-index:30!important;padding:8px 8px calc(9px + env(safe-area-inset-bottom))!important;background:rgba(7,16,29,.96)!important;border-top:1px solid rgba(148,163,184,.10)!important;backdrop-filter:blur(22px)!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .message-compose textarea,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .composer textarea{min-height:44px!important;max-height:128px!important;border-radius:15px!important;font-size:16px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .send-button{min-width:44px!important;min-height:44px!important;border-radius:14px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .profile-panel{overflow-y:auto!important;padding-bottom:84px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .profile-card,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .info-card{margin:7px 8px!important;padding:12px!important;border-radius:15px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .stories,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .story-list{padding:7px 8px 10px!important;gap:8px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .modal-backdrop{align-items:stretch!important;padding:0!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .modal{width:100vw!important;max-width:100vw!important;height:100dvh!important;max-height:100dvh!important;border:0!important;border-radius:0!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] #modalContent,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .modal-content{padding-bottom:calc(22px + env(safe-area-inset-bottom))!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .mobile-nav{left:8px!important;right:8px!important;bottom:max(8px,env(safe-area-inset-bottom))!important;width:auto!important;max-width:none!important;transform:none!important;display:grid!important;grid-auto-flow:column!important;grid-auto-columns:1fr!important;gap:4px!important;padding:6px!important;border-radius:17px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .mobile-nav button{min-width:0!important;min-height:46px!important;padding:6px 4px!important;border-radius:12px!important;font-size:10px!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] button,
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] a[role='button']{touch-action:manipulation}
      }
      @media(max-width:380px){
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .message-bubble{max-width:92%!important}
        html[data-ls-connect-redesign='080'][data-v0805-mobile='1'] .mobile-nav button{font-size:9px!important}
      }
    `;
    document.head.appendChild(style);
  }

  const media=window.matchMedia('(max-width:700px)');
  function sync(){
    installStyles();
    if(media.matches) document.documentElement.dataset.v0805Mobile='1';
    else delete document.documentElement.dataset.v0805Mobile;
    document.documentElement.dataset.lsVersion=VERSION;
    window.__LS_CONNECT_RUNTIME_VERSION__=VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=VERSION;
  }
  if(typeof media.addEventListener==='function') media.addEventListener('change',sync);
  else if(typeof media.addListener==='function') media.addListener(sync);
  sync();
  console.info('[LS Connect] v0.8.5 Mobile Polish active');
})();
