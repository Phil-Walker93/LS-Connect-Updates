/* LS Connect v0.8.0 – Hub-inspired visual system */
(function v080Theme(){
  if(window.__LS_CONNECT_V080_THEME__) return;
  window.__LS_CONNECT_V080_THEME__ = true;
  document.documentElement.dataset.lsConnectRedesign='080';
  document.documentElement.dataset.lsVersion='0.8.0';
  window.__LS_CONNECT_RUNTIME_VERSION__='0.8.0';

  const id='v080-hub-theme';
  if(document.getElementById(id)) return;
  const style=document.createElement('style');
  style.id=id;
  style.textContent=`
  html[data-ls-connect-redesign='080']{
    --v080-line:rgba(148,163,184,.13);
    --v080-soft:rgba(255,255,255,.04);
    --v080-panel:rgba(15,23,42,.82);
    --v080-panel-strong:rgba(8,15,27,.92);
    --v080-radius-xl:24px;
    --v080-radius-lg:18px;
    --v080-radius-md:14px;
    --v080-shadow:0 18px 50px rgba(0,0,0,.24);
  }
  html[data-ls-connect-redesign='080'] body{
    background:radial-gradient(circle at 15% 12%,rgba(14,165,233,.13),transparent 30%),radial-gradient(circle at 88% 82%,rgba(124,58,237,.10),transparent 32%),linear-gradient(145deg,#06111f,#091426 48%,#070d17)!important;
  }
  html[data-ls-connect-redesign='080'] .app-shell{min-height:100vh;gap:12px!important;padding:12px!important;background:transparent!important}
  html[data-ls-connect-redesign='080'] .sidebar,
  html[data-ls-connect-redesign='080'] .conversation-panel,
  html[data-ls-connect-redesign='080'] .profile-panel{
    border:1px solid var(--v080-line)!important;border-radius:var(--v080-radius-xl)!important;background:linear-gradient(180deg,rgba(17,24,39,.88),rgba(9,16,29,.84))!important;box-shadow:var(--v080-shadow)!important;overflow:hidden;backdrop-filter:blur(20px)
  }
  html[data-ls-connect-redesign='080'] .sidebar{padding:12px 8px!important;border-right:1px solid var(--v080-line)!important}
  html[data-ls-connect-redesign='080'] .brand,
  html[data-ls-connect-redesign='080'] .brand-copy,
  html[data-ls-connect-redesign='080'] .app-brand{padding:6px 10px 12px!important}
  .v080-ui-badge{display:inline-flex;align-items:center;width:max-content;margin-top:3px;padding:3px 7px;border:1px solid rgba(56,189,248,.22);border-radius:999px;color:#7dd3fc;background:rgba(14,165,233,.08);font-size:9px;font-weight:850;letter-spacing:.05em;text-transform:uppercase}
  .v080-nav-section-label{margin:14px 12px 5px;color:#64748b;font-size:9px;font-weight:850;letter-spacing:.12em;text-transform:uppercase;user-select:none}
  html[data-ls-connect-redesign='080'] .chat-item,
  html[data-ls-connect-redesign='080'] .channel-item{margin:4px 7px!important;padding:10px!important;border:1px solid transparent!important;border-radius:var(--v080-radius-md)!important;background:transparent!important;transition:background .16s ease,border-color .16s ease,transform .16s ease!important}
  html[data-ls-connect-redesign='080'] .chat-item:hover,
  html[data-ls-connect-redesign='080'] .channel-item:hover{background:rgba(255,255,255,.045)!important;border-color:rgba(148,163,184,.10)!important;transform:translateY(-1px)}
  html[data-ls-connect-redesign='080'] .chat-item.active,
  html[data-ls-connect-redesign='080'] .channel-item.active{background:linear-gradient(90deg,rgba(14,165,233,.15),rgba(255,255,255,.035))!important;border-color:rgba(56,189,248,.22)!important;box-shadow:inset 3px 0 0 #38bdf8!important}
  html[data-ls-connect-redesign='080'] .sidebar button,
  html[data-ls-connect-redesign='080'] .sidebar a{border-radius:var(--v080-radius-md)!important}
  html[data-ls-connect-redesign='080'] .chat-header,
  html[data-ls-connect-redesign='080'] .conversation-header,
  html[data-ls-connect-redesign='080'] .profile-header{min-height:62px;padding:10px 16px!important;border-bottom:1px solid var(--v080-line)!important;background:rgba(8,15,27,.76)!important;box-shadow:none!important;backdrop-filter:blur(18px)}
  html[data-ls-connect-redesign='080'] .messages{padding:20px 18px 26px!important;background:radial-gradient(circle at 50% 0,rgba(14,165,233,.045),transparent 34%),transparent!important}
  html[data-ls-connect-redesign='080'] .message-row{margin:7px 0!important}
  html[data-ls-connect-redesign='080'] .message-bubble{max-width:min(72%,700px)!important;padding:10px 13px!important;border-radius:18px!important;line-height:1.48!important;box-shadow:none!important}
  html[data-ls-connect-redesign='080'] .message-row.in .message-bubble,
  html[data-ls-connect-redesign='080'] .message-row:not(.out) .message-bubble{border:1px solid rgba(148,163,184,.10)!important;background:rgba(30,41,59,.78)!important}
  html[data-ls-connect-redesign='080'] .message-row.out .message-bubble{border:1px solid rgba(125,211,252,.22)!important;background:linear-gradient(145deg,rgba(14,165,233,.92),rgba(37,99,235,.88))!important;color:#fff!important}
  html[data-ls-connect-redesign='080'] .message-compose,
  html[data-ls-connect-redesign='080'] .composer{gap:9px!important;padding:12px 14px 15px!important;border-top:1px solid var(--v080-line)!important;background:rgba(8,15,27,.78)!important;box-shadow:none!important;backdrop-filter:blur(18px)}
  html[data-ls-connect-redesign='080'] .message-compose textarea,
  html[data-ls-connect-redesign='080'] .message-compose input,
  html[data-ls-connect-redesign='080'] .composer textarea,
  html[data-ls-connect-redesign='080'] .composer input{min-height:42px!important;padding:10px 13px!important;border:1px solid rgba(148,163,184,.13)!important;border-radius:16px!important;background:rgba(15,23,42,.82)!important;box-shadow:none!important}
  html[data-ls-connect-redesign='080'] .send-button,
  html[data-ls-connect-redesign='080'] .primary-button{border-radius:14px!important;box-shadow:0 8px 18px rgba(14,165,233,.15)!important}
  html[data-ls-connect-redesign='080'] .settings-block,
  html[data-ls-connect-redesign='080'] .request-card,
  html[data-ls-connect-redesign='080'] .admin-channel-row,
  html[data-ls-connect-redesign='080'] .info-card,
  html[data-ls-connect-redesign='080'] .profile-card,
  html[data-ls-connect-redesign='080'] .v078-own-contact-row,
  html[data-ls-connect-redesign='080'] .v078-notice-row{border:1px solid rgba(148,163,184,.11)!important;border-radius:var(--v080-radius-lg)!important;background:rgba(30,41,59,.50)!important;box-shadow:none!important}
  html[data-ls-connect-redesign='080'] .modal-backdrop{background:rgba(2,6,23,.70)!important;backdrop-filter:blur(8px)}
  html[data-ls-connect-redesign='080'] .modal{border:1px solid rgba(148,163,184,.16)!important;border-radius:24px!important;background:linear-gradient(180deg,rgba(17,24,39,.98),rgba(10,17,29,.98))!important;box-shadow:0 24px 70px rgba(0,0,0,.40)!important}
  html[data-ls-connect-redesign='080'] .character-switcher{border:1px solid rgba(148,163,184,.12)!important;border-radius:16px!important;background:rgba(30,41,59,.52)!important;box-shadow:none!important}
  html[data-ls-connect-redesign='080'] input,
  html[data-ls-connect-redesign='080'] textarea,
  html[data-ls-connect-redesign='080'] select{border-radius:12px!important}
  html[data-ls-connect-redesign='080'] .mobile-nav{left:50%!important;bottom:10px!important;width:calc(100% - 20px)!important;max-width:520px;transform:translateX(-50%);padding:7px!important;border:1px solid rgba(148,163,184,.14)!important;border-radius:18px!important;background:rgba(8,15,27,.90)!important;box-shadow:0 16px 34px rgba(0,0,0,.34)!important;backdrop-filter:blur(18px)}
  html[data-ls-connect-redesign='080'] .mobile-nav button{min-height:44px;border-radius:13px!important}
  html[data-ls-connect-redesign='080'] .mobile-nav button.active{color:#7dd3fc!important;background:rgba(14,165,233,.12)!important}
  html[data-ls-connect-redesign='080'] .mobile-nav button.active:before{display:none!important}
  html[data-ls-connect-redesign='080'] ::-webkit-scrollbar{width:8px;height:8px}
  html[data-ls-connect-redesign='080'] ::-webkit-scrollbar-thumb{background:rgba(148,163,184,.16);border-radius:999px}
  html[data-ls-connect-redesign='080'] ::-webkit-scrollbar-track{background:transparent}
  @media(max-width:900px){
    html[data-ls-connect-redesign='080'] .app-shell{padding:8px!important;gap:8px!important}
    html[data-ls-connect-redesign='080'] .sidebar,
    html[data-ls-connect-redesign='080'] .conversation-panel,
    html[data-ls-connect-redesign='080'] .profile-panel{border-radius:19px!important}
  }
  @media(max-width:700px){
    html[data-ls-connect-redesign='080'] body{background:#07101d!important}
    html[data-ls-connect-redesign='080'] .app-shell{padding:0!important;gap:0!important}
    html[data-ls-connect-redesign='080'] .sidebar,
    html[data-ls-connect-redesign='080'] .conversation-panel,
    html[data-ls-connect-redesign='080'] .profile-panel{border-radius:0!important;border-left:0!important;border-right:0!important}
    html[data-ls-connect-redesign='080'] .messages{padding:14px 11px 88px!important}
    html[data-ls-connect-redesign='080'] .message-bubble{max-width:86%!important}
    html[data-ls-connect-redesign='080'] .message-compose,
    html[data-ls-connect-redesign='080'] .composer{padding-bottom:78px!important}
  }
  @media(prefers-reduced-motion:reduce){html[data-ls-connect-redesign='080'] *,html[data-ls-connect-redesign='080'] *:before,html[data-ls-connect-redesign='080'] *:after{transition:none!important;animation-duration:.01ms!important;animation-iteration-count:1!important}}
  `;
  document.head.appendChild(style);
  console.info('[LS Connect] v0.8.0 Hub theme active');
})();
