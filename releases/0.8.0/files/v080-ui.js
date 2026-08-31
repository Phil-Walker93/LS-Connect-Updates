/* LS Connect v0.8.0 – Hub UI redesign foundation */
(function lsConnectV080HubUI(){
  if(window.__LS_CONNECT_V080_HUB_UI__) return;
  window.__LS_CONNECT_V080_HUB_UI__ = true;

  const ROOT_ATTR = 'data-ls-connect-redesign';
  const STYLE_ID = 'ls-connect-v080-hub-ui';
  const VERSION = '0.8.0';

  function installStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      html[${ROOT_ATTR}='080']{
        --v080-radius-xl:24px;
        --v080-radius-lg:18px;
        --v080-radius-md:14px;
        --v080-shadow:0 24px 70px rgba(0,0,0,.30);
        --v080-shadow-soft:0 10px 28px rgba(0,0,0,.18);
        --v080-glass:rgba(15,23,42,.72);
        --v080-glass-strong:rgba(15,23,42,.90);
        --v080-line:rgba(148,163,184,.13);
        --v080-muted:#91a0b7;
      }

      html[${ROOT_ATTR}='080'] body{
        background:
          radial-gradient(circle at 12% 10%,rgba(14,165,233,.13),transparent 30%),
          radial-gradient(circle at 88% 82%,rgba(124,58,237,.10),transparent 32%),
          linear-gradient(145deg,#06111f,#091426 48%,#070d17)!important;
      }

      html[${ROOT_ATTR}='080'] .app-shell{
        min-height:100vh;
        gap:12px!important;
        padding:12px!important;
        background:transparent!important;
      }

      html[${ROOT_ATTR}='080'] .sidebar,
      html[${ROOT_ATTR}='080'] .conversation-panel,
      html[${ROOT_ATTR}='080'] .profile-panel{
        border:1px solid var(--v080-line)!important;
        border-radius:var(--v080-radius-xl)!important;
        background:linear-gradient(180deg,rgba(17,24,39,.88),rgba(9,16,29,.84))!important;
        box-shadow:var(--v080-shadow-soft)!important;
        overflow:hidden;
        backdrop-filter:blur(20px);
      }

      html[${ROOT_ATTR}='080'] .sidebar{
        border-right:1px solid var(--v080-line)!important;
        padding:12px 8px!important;
      }

      html[${ROOT_ATTR}='080'] .brand,
      html[${ROOT_ATTR}='080'] .brand-copy,
      html[${ROOT_ATTR}='080'] .app-brand{
        padding:6px 10px 12px!important;
      }

      .v080-ui-badge{
        display:inline-flex;
        align-items:center;
        width:max-content;
        margin:3px 0 0;
        padding:3px 7px;
        border:1px solid rgba(56,189,248,.22);
        border-radius:999px;
        color:#7dd3fc;
        background:rgba(14,165,233,.08);
        font-size:9px;
        font-weight:800;
        letter-spacing:.05em;
        text-transform:uppercase;
      }

      .v080-nav-section-label{
        margin:14px 12px 5px;
        color:#64748b;
        font-size:9px;
        font-weight:850;
        letter-spacing:.12em;
        text-transform:uppercase;
        user-select:none;
      }

      html[${ROOT_ATTR}='080'] .chat-item,
      html[${ROOT_ATTR}='080'] .channel-item,
      html[${ROOT_ATTR}='080'] .sidebar button,
      html[${ROOT_ATTR}='080'] .sidebar a{
        border-radius:var(--v080-radius-md)!important;
      }

      html[${ROOT_ATTR}='080'] .chat-item,
      html[${ROOT_ATTR}='080'] .channel-item{
        margin:4px 7px!important;
        padding:10px!important;
        border:1px solid transparent!important;
        background:transparent!important;
        transition:background .16s ease,border-color .16s ease,transform .16s ease!important;
      }

      html[${ROOT_ATTR}='080'] .chat-item:hover,
      html[${ROOT_ATTR}='080'] .channel-item:hover{
        background:rgba(255,255,255,.045)!important;
        border-color:rgba(148,163,184,.10)!important;
        transform:translateY(-1px);
      }

      html[${ROOT_ATTR}='080'] .chat-item.active,
      html[${ROOT_ATTR}='080'] .channel-item.active{
        background:linear-gradient(90deg,rgba(14,165,233,.15),rgba(255,255,255,.035))!important;
        border-color:rgba(56,189,248,.22)!important;
        box-shadow:inset 3px 0 0 #38bdf8!important;
      }

      html[${ROOT_ATTR}='080'] .chat-header,
      html[${ROOT_ATTR}='080'] .conversation-header,
      html[${ROOT_ATTR}='080'] .profile-header{
        min-height:62px;
        padding:10px 16px!important;
        border-bottom:1px solid var(--v080-line)!important;
        background:rgba(8,15,27,.76)!important;
        box-shadow:none!important;
        backdrop-filter:blur(18px);
      }

      html[${ROOT_ATTR}='080'] .messages{
        padding:20px 18px 26px!important;
        background:
          radial-gradient(circle at 50% 0,rgba(14,165,233,.045),transparent 34%),
          transparent!important;
      }

      html[${ROOT_ATTR}='080'] .message-row{
        margin:7px 0!important;
      }

      html[${ROOT_ATTR}='080'] .message-bubble{
        max-width:min(72%,700px)!important;
        padding:10px 13px!important;
        border-radius:18px!important;
        line-height:1.48!important;
        box-shadow:none!important;
      }

      html[${ROOT_ATTR}='080'] .message-row.in .message-bubble,
      html[${ROOT_ATTR}='080'] .message-row:not(.out) .message-bubble{
        border:1px solid rgba(148,163,184,.10)!important;
        background:rgba(30,41,59,.78)!important;
      }

      html[${ROOT_ATTR}='080'] .message-row.out .message-bubble{
        border:1px solid rgba(125,211,252,.22)!important;
        background:linear-gradient(145deg,rgba(14,165,233,.92),rgba(37,99,235,.88))!important;
        color:white!important;
      }

      html[${ROOT_ATTR}='080'] .message-compose,
      html[${ROOT_ATTR}='080'] .composer{
        gap:9px!important;
        padding:12px 14px 15px!important;
        border-top:1px solid var(--v080-line)!important;
        background:rgba(8,15,27,.78)!important;
        box-shadow:none!important;
        backdrop-filter:blur(18px);
      }

      html[${ROOT_ATTR}='080'] .message-compose textarea,
      html[${ROOT_ATTR}='080'] .message-compose input,
      html[${ROOT_ATTR}='080'] .composer textarea,
      html[${ROOT_ATTR}='080'] .composer input{
        min-height:42px!important;
        padding:10px 13px!important;
        border:1px solid rgba(148,163,184,.13)!important;
        border-radius:16px!important;
        background:rgba(15,23,42,.82)!important;
        box-shadow:none!important;
      }

      html[${ROOT_ATTR}='080'] .send-button,
      html[${ROOT_ATTR}='080'] .primary-button{
        border-radius:14px!important;
        box-shadow:0 8px 18px rgba(14,165,233,.15)!important;
      }

      html[${ROOT_ATTR}='080'] .settings-block,
      html[${ROOT_ATTR}='080'] .request-card,
      html[${ROOT_ATTR}='080'] .admin-channel-row,
      html[${ROOT_ATTR}='080'] .info-card,
      html[${ROOT_ATTR}='080'] .profile-card,
      html[${ROOT_ATTR}='080'] .v078-own-contact-row,
      html[${ROOT_ATTR}='080'] .v078-notice-row{
        border:1px solid rgba(148,163,184,.11)!important;
        border-radius:var(--v080-radius-lg)!important;
        background:rgba(30,41,59,.50)!important;
        box-shadow:none!important;
      }

      html[${ROOT_ATTR}='080'] .modal-backdrop{
        background:rgba(2,6,23,.70)!important;
        backdrop-filter:blur(8px);
      }

      html[${ROOT_ATTR}='080'] .modal{
        border:1px solid rgba(148,163,184,.16)!important;
        border-radius:24px!important;
        background:linear-gradient(180deg,rgba(17,24,39,.98),rgba(10,17,29,.98))!important;
        box-shadow:var(--v080-shadow)!important;
      }

      html[${ROOT_ATTR}='080'] .character-switcher{
        border:1px solid rgba(148,163,184,.12)!important;
        border-radius:16px!important;
        background:rgba(30,41,59,.52)!important;
        box-shadow:none!important;
      }

      html[${ROOT_ATTR}='080'] .profile-panel{
        padding-bottom:12px;
      }

      html[${ROOT_ATTR}='080'] .mobile-nav{
        left:50%!important;
        bottom:10px!important;
        width:calc(100% - 20px)!important;
        max-width:520px;
        transform:translateX(-50%);
        padding:7px!important;
        border:1px solid rgba(148,163,184,.14)!important;
        border-radius:18px!important;
        background:rgba(8,15,27,.90)!important;
        box-shadow:0 16px 34px rgba(0,0,0,.34)!important;
        backdrop-filter:blur(18px);
      }

      html[${ROOT_ATTR}='080'] .mobile-nav button{
        min-height:44px;
        border-radius:13px!important;
      }

      html[${ROOT_ATTR}='080'] .mobile-nav button.active{
        color:#7dd3fc!important;
        background:rgba(14,165,233,.12)!important;
      }

      html[${ROOT_ATTR}='080'] .mobile-nav button.active:before{
        display:none!important;
      }

      html[${ROOT_ATTR}='080'] input,
      html[${ROOT_ATTR}='080'] textarea,
      html[${ROOT_ATTR}='080'] select{
        border-radius:12px!important;
      }

      html[${ROOT_ATTR}='080'] ::-webkit-scrollbar{width:8px;height:8px}
      html[${ROOT_ATTR}='080'] ::-webkit-scrollbar-thumb{background:rgba(148,163,184,.16);border-radius:999px}
      html[${ROOT_ATTR}='080'] ::-webkit-scrollbar-track{background:transparent}

      @media(max-width:900px){
        html[${ROOT_ATTR}='080'] .app-shell{padding:8px!important;gap:8px!important}
        html[${ROOT_ATTR}='080'] .sidebar,
        html[${ROOT_ATTR}='080'] .conversation-panel,
        html[${ROOT_ATTR}='080'] .profile-panel{border-radius:19px!important}
      }

      @media(max-width:700px){
        html[${ROOT_ATTR}='080'] body{background:#07101d!important}
        html[${ROOT_ATTR}='080'] .app-shell{padding:0!important;gap:0!important}
        html[${ROOT_ATTR}='080'] .sidebar,
        html[${ROOT_ATTR}='080'] .conversation-panel,
        html[${ROOT_ATTR}='080'] .profile-panel{
          border-radius:0!important;
          border-left:0!important;
          border-right:0!important;
        }
        html[${ROOT_ATTR}='080'] .messages{padding:14px 11px 88px!important}
        html[${ROOT_ATTR}='080'] .message-bubble{max-width:86%!important}
        html[${ROOT_ATTR}='080'] .message-compose,
        html[${ROOT_ATTR}='080'] .composer{padding-bottom:78px!important}
        .v080-nav-section-label{margin-left:14px}
      }

      @media(prefers-reduced-motion:reduce){
        html[${ROOT_ATTR}='080'] *,html[${ROOT_ATTR}='080'] *:before,html[${ROOT_ATTR}='080'] *:after{
          transition:none!important;animation-duration:.01ms!important;animation-iteration-count:1!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const normalizedText = el => String(el?.textContent || '').replace(/\s+/g,' ').trim().toLowerCase();

  function groupFor(text){
    if(/admin|moderation|system|ticket|audit/.test(text)) return 'Verwaltung';
    if(/profil|einstellung|account|charakter|design|abmelden/.test(text)) return 'Konto';
    if(/kanal|story|gruppe|community|forum|feed/.test(text)) return 'Community';
    if(/chat|nachricht|kontakt|anruf|call|freunde/.test(text)) return 'Kommunikation';
    return '';
  }

  function structureSidebar(){
    const sidebar = document.querySelector('.sidebar');
    if(!sidebar) return;

    sidebar.querySelectorAll('.v080-nav-section-label').forEach(el=>el.remove());
    const candidates = [...sidebar.querySelectorAll('button,a,[role="button"],.chat-item,.channel-item')]
      .filter(el => normalizedText(el));

    let previous = '';
    for(const el of candidates){
      const group = groupFor(normalizedText(el));
      if(!group || group === previous) continue;
      const label = document.createElement('div');
      label.className = 'v080-nav-section-label';
      label.textContent = group;
      el.parentElement?.insertBefore(label,el);
      previous = group;
    }
  }

  function installBadge(){
    if(document.querySelector('.v080-ui-badge')) return;
    const host = document.querySelector('.brand-copy,.app-brand,.brand');
    if(!host) return;
    const badge = document.createElement('span');
    badge.className = 'v080-ui-badge';
    badge.textContent = 'Hub UI · v0.8';
    host.appendChild(badge);
  }

  function improveIconButtons(){
    document.querySelectorAll('button.icon-button,button[aria-label]').forEach(button=>{
      if(button.getAttribute('aria-label')) return;
      const title = String(button.getAttribute('title') || '').trim();
      if(title) button.setAttribute('aria-label',title);
    });
  }

  function refresh(){
    document.documentElement.setAttribute(ROOT_ATTR,'080');
    document.documentElement.dataset.lsVersion = VERSION;
    window.__LS_CONNECT_RUNTIME_VERSION__ = VERSION;
    installStyles();
    installBadge();
    structureSidebar();
    improveIconButtons();
  }

  let queued = false;
  const observer = new MutationObserver(()=>{
    if(queued) return;
    queued = true;
    requestAnimationFrame(()=>{queued=false;refresh();});
  });

  observer.observe(document.documentElement,{childList:true,subtree:true});
  refresh();
  [200,600,1400,3000].forEach(ms=>setTimeout(refresh,ms));

  console.info('[LS Connect] v0.8.0 Hub UI redesign active');
})();
