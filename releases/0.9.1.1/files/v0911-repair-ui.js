/* LS Connect v0.9.1.1 – live recovery UI
 * Safe visual layer: no MutationObserver, no DOM proxy menus, no fixed mobile composer.
 */
(function installLsConnectLiveRepairUi(){
  if(window.__LS_CONNECT_V0911_REPAIR_UI__) return;
  window.__LS_CONNECT_V0911_REPAIR_UI__=true;

  const VERSION='0.9.1.1';
  const root=document.documentElement;
  root.dataset.lsConnectRedesign='080';
  root.dataset.lsLiveRepair='1';

  const style=document.createElement('style');
  style.id='v0911-repair-ui-style';
  style.textContent=`
    html[data-ls-live-repair='1']{
      --lsr-bg:#07101d;
      --lsr-panel:rgba(13,22,37,.94);
      --lsr-panel-2:rgba(18,29,47,.78);
      --lsr-border:rgba(148,163,184,.13);
      --lsr-border-strong:rgba(125,211,252,.22);
      --lsr-text:#e6edf7;
      --lsr-muted:#8493aa;
      --lsr-accent:#38bdf8;
      --lsr-accent-2:#4f6df5;
      --lsr-radius:18px;
      --lsr-radius-sm:13px;
    }
    html[data-ls-live-repair='1'] body{
      background:radial-gradient(circle at 14% 8%,rgba(56,189,248,.12),transparent 30%),radial-gradient(circle at 88% 90%,rgba(79,109,245,.10),transparent 32%),linear-gradient(145deg,#050b14,#081322 50%,#050b13)!important;
      color:var(--lsr-text)!important;
    }
    html[data-ls-live-repair='1'] .app-shell{
      width:100%!important;max-width:none!important;min-width:0!important;box-sizing:border-box!important;
      gap:10px!important;padding:10px!important;background:transparent!important;
    }
    @media(min-width:901px){
      html[data-ls-live-repair='1'] .app-shell{grid-template-columns:minmax(260px,300px) minmax(0,1fr) minmax(270px,310px)!important;align-items:stretch!important}
    }
    html[data-ls-live-repair='1'] .sidebar,
    html[data-ls-live-repair='1'] .conversation-panel,
    html[data-ls-live-repair='1'] .profile-panel{
      min-width:0!important;max-width:none!important;border:1px solid var(--lsr-border)!important;border-radius:var(--lsr-radius)!important;
      background:linear-gradient(180deg,rgba(15,24,39,.96),rgba(8,15,26,.94))!important;
      box-shadow:0 18px 44px rgba(0,0,0,.20)!important;overflow:hidden;
    }
    html[data-ls-live-repair='1'] .conversation-panel{display:flex!important;flex-direction:column!important;min-height:0!important}
    html[data-ls-live-repair='1'] .brand,
    html[data-ls-live-repair='1'] .brand-copy,
    html[data-ls-live-repair='1'] .app-brand{padding:10px 12px!important}

    /* Repair the partially rendered v0.8 navigation shown as white text buttons. */
    html[data-ls-live-repair='1'] .v0801-nav-deck{
      position:relative!important;top:auto!important;z-index:5!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;
      gap:5px!important;margin:2px 8px 10px!important;padding:6px!important;border:1px solid var(--lsr-border)!important;
      border-radius:15px!important;background:rgba(7,15,26,.86)!important;box-shadow:none!important;backdrop-filter:blur(18px)!important;
    }
    html[data-ls-live-repair='1'] .v0801-nav-filter{
      min-width:0!important;min-height:42px!important;display:grid!important;place-items:center!important;gap:2px!important;
      padding:5px 3px!important;border:1px solid transparent!important;border-radius:11px!important;
      background:transparent!important;color:var(--lsr-muted)!important;box-shadow:none!important;font:800 9px/1.15 system-ui,-apple-system,"Segoe UI",sans-serif!important;
    }
    html[data-ls-live-repair='1'] .v0801-nav-filter:hover{background:rgba(255,255,255,.045)!important;color:#dbeafe!important}
    html[data-ls-live-repair='1'] .v0801-nav-filter.active{border-color:rgba(56,189,248,.18)!important;background:rgba(56,189,248,.11)!important;color:#7dd3fc!important}
    html[data-ls-live-repair='1'] .v0801-nav-filter-icon{font-size:14px!important;line-height:1!important}
    html[data-ls-live-repair='1'] .v0801-nav-filter-label{max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    html[data-ls-live-repair='1'] .v0801-nav-filter-count{min-width:16px!important;padding:1px 4px!important;border-radius:999px!important;background:rgba(148,163,184,.11)!important;font-size:8px!important;line-height:1.3!important}
    html[data-ls-live-repair='1'] .v0801-active-section{margin:7px 12px 8px!important;color:#7dd3fc!important;font-size:10px!important;font-weight:850!important;letter-spacing:.08em!important;text-transform:uppercase!important}

    html[data-ls-live-repair='1'] .chat-item,
    html[data-ls-live-repair='1'] .channel-item{
      min-height:54px!important;margin:3px 7px!important;padding:10px 11px!important;border:1px solid transparent!important;border-radius:14px!important;
      background:transparent!important;box-shadow:none!important;transition:background .14s ease,border-color .14s ease!important;
    }
    html[data-ls-live-repair='1'] .chat-item:hover,
    html[data-ls-live-repair='1'] .channel-item:hover{background:rgba(255,255,255,.045)!important;border-color:rgba(148,163,184,.09)!important}
    html[data-ls-live-repair='1'] .chat-item.active,
    html[data-ls-live-repair='1'] .channel-item.active{background:linear-gradient(90deg,rgba(56,189,248,.14),rgba(255,255,255,.025))!important;border-color:rgba(56,189,248,.18)!important;box-shadow:inset 3px 0 0 var(--lsr-accent)!important}
    html[data-ls-live-repair='1'] .chat-item small,
    html[data-ls-live-repair='1'] .channel-item small{color:var(--lsr-muted)!important}
    html[data-ls-live-repair='1'] .sidebar input,
    html[data-ls-live-repair='1'] .sidebar textarea,
    html[data-ls-live-repair='1'] .sidebar select{
      border:1px solid var(--lsr-border)!important;border-radius:13px!important;background:rgba(8,15,27,.72)!important;color:var(--lsr-text)!important;box-shadow:none!important;
    }

    html[data-ls-live-repair='1'] .chat-header,
    html[data-ls-live-repair='1'] .conversation-header,
    html[data-ls-live-repair='1'] .profile-header{
      flex:0 0 auto!important;min-height:62px!important;padding:10px 14px!important;border-bottom:1px solid var(--lsr-border)!important;
      background:rgba(8,15,27,.84)!important;box-shadow:none!important;backdrop-filter:blur(18px)!important;
    }
    html[data-ls-live-repair='1'] .messages{
      flex:1 1 auto!important;min-width:0!important;min-height:0!important;overflow-y:auto!important;
      padding:18px clamp(12px,2vw,26px) 24px!important;background:radial-gradient(circle at 50% 0,rgba(56,189,248,.035),transparent 34%)!important;
      scroll-padding-bottom:96px!important;
    }
    html[data-ls-live-repair='1'] .message-row{margin:4px 0!important}
    html[data-ls-live-repair='1'] .message-bubble{
      max-width:min(74%,760px)!important;padding:10px 13px!important;border-radius:17px!important;line-height:1.48!important;
      white-space:pre-wrap!important;overflow-wrap:anywhere!important;word-break:break-word!important;box-shadow:none!important;
    }
    html[data-ls-live-repair='1'] .message-row.in .message-bubble,
    html[data-ls-live-repair='1'] .message-row:not(.out) .message-bubble{border:1px solid rgba(148,163,184,.10)!important;background:rgba(30,41,59,.66)!important}
    html[data-ls-live-repair='1'] .message-row.out .message-bubble{border:1px solid rgba(125,211,252,.20)!important;background:linear-gradient(145deg,rgba(14,165,233,.88),rgba(79,109,245,.86))!important;color:#fff!important}
    html[data-ls-live-repair='1'] .message-time,
    html[data-ls-live-repair='1'] .timestamp,
    html[data-ls-live-repair='1'] [class*='message-meta']{color:#65758d!important;font-size:10px!important}
    html[data-ls-live-repair='1'] .message-compose,
    html[data-ls-live-repair='1'] .composer{
      position:sticky!important;bottom:0!important;z-index:12!important;flex:0 0 auto!important;margin:0!important;padding:10px 12px 12px!important;
      border-top:1px solid var(--lsr-border)!important;background:rgba(8,15,27,.92)!important;box-shadow:none!important;backdrop-filter:blur(18px)!important;
    }
    html[data-ls-live-repair='1'] .message-compose textarea,
    html[data-ls-live-repair='1'] .message-compose input,
    html[data-ls-live-repair='1'] .composer textarea,
    html[data-ls-live-repair='1'] .composer input{
      min-height:44px!important;max-height:170px!important;padding:10px 13px!important;border:1px solid var(--lsr-border)!important;border-radius:15px!important;
      background:rgba(15,23,42,.88)!important;color:var(--lsr-text)!important;box-shadow:none!important;
    }
    html[data-ls-live-repair='1'] .send-button{min-width:44px!important;min-height:44px!important;border-radius:14px!important;box-shadow:0 8px 18px rgba(56,189,248,.13)!important}

    html[data-ls-live-repair='1'] .profile-card,
    html[data-ls-live-repair='1'] .info-card,
    html[data-ls-live-repair='1'] .settings-block,
    html[data-ls-live-repair='1'] .request-card,
    html[data-ls-live-repair='1'] .admin-channel-row{
      margin:8px!important;padding:13px!important;border:1px solid var(--lsr-border)!important;border-radius:16px!important;
      background:rgba(30,41,59,.44)!important;box-shadow:none!important;
    }
    html[data-ls-live-repair='1'] .modal-backdrop{background:rgba(2,6,23,.72)!important;backdrop-filter:blur(8px)!important}
    html[data-ls-live-repair='1'] .modal{border:1px solid rgba(148,163,184,.16)!important;border-radius:22px!important;background:linear-gradient(180deg,rgba(17,24,39,.99),rgba(8,15,27,.99))!important;box-shadow:0 24px 70px rgba(0,0,0,.40)!important}
    html[data-ls-live-repair='1'] button,
    html[data-ls-live-repair='1'] a[role='button']{touch-action:manipulation}

    /* Give the LMH return control its own compact app bar instead of letting it overlap LS Connect. */
    html[data-ls-live-repair='1'][data-lmh-return='1'] body{padding-top:50px!important;box-sizing:border-box!important}
    html[data-ls-live-repair='1'][data-lmh-return='1'] body:before{
      content:'';position:fixed;z-index:2147482990;left:0;right:0;top:0;height:50px;pointer-events:none;
      border-bottom:1px solid rgba(148,163,184,.11);background:rgba(5,11,20,.93);backdrop-filter:blur(18px);
    }
    html[data-ls-live-repair='1'][data-lmh-return='1'] #lsConnectBackToHub{top:8px!important;left:10px!important;min-height:34px!important;padding:7px 11px!important;border-color:rgba(125,211,252,.18)!important;background:rgba(15,23,42,.92)!important;box-shadow:none!important}
    html[data-ls-live-repair='1'][data-lmh-return='1'] .app-shell{height:auto!important;min-height:calc(100dvh - 50px)!important}

    @media(max-width:900px){
      html[data-ls-live-repair='1'] .app-shell{gap:7px!important;padding:7px!important}
      html[data-ls-live-repair='1'] .v0801-nav-filter-label{display:none!important}
      html[data-ls-live-repair='1'] .v0801-nav-deck{margin:2px 6px 8px!important;padding:5px!important;gap:4px!important}
      html[data-ls-live-repair='1'] .message-bubble{max-width:82%!important}
    }
    @media(max-width:700px){
      html[data-ls-live-repair='1'] body{background:#07101d!important}
      html[data-ls-live-repair='1'] .app-shell{padding:0!important;gap:0!important}
      html[data-ls-live-repair='1'] .sidebar,
      html[data-ls-live-repair='1'] .conversation-panel,
      html[data-ls-live-repair='1'] .profile-panel{border-left:0!important;border-right:0!important;border-radius:0!important;box-shadow:none!important}
      html[data-ls-live-repair='1'] .v0801-nav-deck{grid-template-columns:repeat(5,minmax(0,1fr))!important;margin:4px 8px 8px!important;padding:5px!important;border-radius:14px!important}
      html[data-ls-live-repair='1'] .v0801-nav-filter{min-height:38px!important;padding:4px 2px!important}
      html[data-ls-live-repair='1'] .v0801-nav-filter-count{font-size:7px!important}
      html[data-ls-live-repair='1'] .chat-header,
      html[data-ls-live-repair='1'] .conversation-header,
      html[data-ls-live-repair='1'] .profile-header{min-height:56px!important;padding:8px 10px!important}
      html[data-ls-live-repair='1'] .messages{padding:12px 9px 18px!important}
      html[data-ls-live-repair='1'] .message-bubble{max-width:90%!important;padding:9px 11px!important;border-radius:15px!important;font-size:13px!important}
      html[data-ls-live-repair='1'] .message-compose,
      html[data-ls-live-repair='1'] .composer{padding:8px 8px calc(9px + env(safe-area-inset-bottom))!important}
      html[data-ls-live-repair='1'] .message-compose textarea,
      html[data-ls-live-repair='1'] .composer textarea{font-size:16px!important}
      html[data-ls-live-repair='1'] .profile-card,
      html[data-ls-live-repair='1'] .info-card{margin:7px 8px!important;border-radius:14px!important}
    }
    @media(max-width:380px){
      html[data-ls-live-repair='1'] .v0801-nav-filter-icon{font-size:13px!important}
      html[data-ls-live-repair='1'] .message-bubble{max-width:94%!important}
    }
    @media(prefers-reduced-motion:reduce){
      html[data-ls-live-repair='1'] *,html[data-ls-live-repair='1'] *:before,html[data-ls-live-repair='1'] *:after{transition:none!important;animation-duration:.01ms!important;animation-iteration-count:1!important}
    }
  `;
  document.head.appendChild(style);

  function sync(){
    root.dataset.lsConnectRedesign='080';
    root.dataset.lsLiveRepair='1';
    root.dataset.lsVersion=VERSION;
    if(document.getElementById('lsConnectBackToHub')) root.dataset.lmhReturn='1';
    window.__LS_CONNECT_RUNTIME_VERSION__=VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=VERSION;
  }

  sync();
  [120,450,1200,2800].forEach(delay=>setTimeout(sync,delay));
  window.addEventListener('pageshow',sync,{passive:true});
  console.info('[LS Connect] v0.9.1.1 live recovery UI active');
})();
