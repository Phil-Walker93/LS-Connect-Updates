/* LS Connect v0.9.1.1 – scroll containment hardening r3
 * Purpose: the browser document never scrolls. Each LS Connect pane owns its
 * own scroll area; the conversation itself scrolls only inside .messages.
 */
(function installLsConnectScrollContainmentR3(){
  if(window.__LS_CONNECT_V0911_SCROLL_R3__) return;
  window.__LS_CONNECT_V0911_SCROLL_R3__=true;

  const root=document.documentElement;
  root.dataset.lsScrollFix='r3';
  root.dataset.lsConnectRedesign='080';

  const style=document.createElement('style');
  style.id='v0911-scroll-r3-style';
  style.textContent=`
    html[data-ls-scroll-fix='r3']{
      --ls-topbar-height:50px;
      width:100%!important;
      height:100%!important;
      min-height:100%!important;
      overflow:hidden!important;
      overscroll-behavior:none!important;
    }
    html[data-ls-scroll-fix='r3'] body{
      width:100%!important;
      height:100%!important;
      min-height:0!important;
      max-height:100%!important;
      margin:0!important;
      padding:var(--ls-topbar-height) 0 0!important;
      box-sizing:border-box!important;
      overflow:hidden!important;
      overscroll-behavior:none!important;
    }

    /* The app shell is a fixed viewport frame, never a page-height document. */
    html[data-ls-scroll-fix='r3'] .app-shell{
      width:100%!important;
      height:calc(var(--ls-viewport-height, 100dvh) - var(--ls-topbar-height))!important;
      min-height:0!important;
      max-height:calc(var(--ls-viewport-height, 100dvh) - var(--ls-topbar-height))!important;
      box-sizing:border-box!important;
      overflow:hidden!important;
      overscroll-behavior:none!important;
      align-items:stretch!important;
    }

    /* Each major pane is constrained to the shell height. */
    html[data-ls-scroll-fix='r3'] .sidebar,
    html[data-ls-scroll-fix='r3'] .conversation-panel,
    html[data-ls-scroll-fix='r3'] .profile-panel{
      height:100%!important;
      min-height:0!important;
      max-height:100%!important;
      box-sizing:border-box!important;
    }

    /* Side panes may scroll independently, but never move the whole app. */
    html[data-ls-scroll-fix='r3'] .sidebar,
    html[data-ls-scroll-fix='r3'] .profile-panel{
      overflow-x:hidden!important;
      overflow-y:auto!important;
      overscroll-behavior-y:contain!important;
      scrollbar-gutter:stable;
    }

    /* Conversation frame itself is fixed. Only .messages owns chat scrolling. */
    html[data-ls-scroll-fix='r3'] .conversation-panel{
      display:flex!important;
      flex-direction:column!important;
      overflow:hidden!important;
      overscroll-behavior:none!important;
    }
    html[data-ls-scroll-fix='r3'] .chat-header,
    html[data-ls-scroll-fix='r3'] .conversation-header{
      flex:0 0 auto!important;
      position:relative!important;
      top:auto!important;
    }
    html[data-ls-scroll-fix='r3'] .messages{
      flex:1 1 0!important;
      width:100%!important;
      height:auto!important;
      min-height:0!important;
      max-height:none!important;
      box-sizing:border-box!important;
      overflow-x:hidden!important;
      overflow-y:auto!important;
      overscroll-behavior-y:contain!important;
      -webkit-overflow-scrolling:touch;
      scrollbar-gutter:stable;
    }
    html[data-ls-scroll-fix='r3'] .message-compose,
    html[data-ls-scroll-fix='r3'] .composer{
      flex:0 0 auto!important;
      position:relative!important;
      left:auto!important;
      right:auto!important;
      top:auto!important;
      bottom:auto!important;
      width:auto!important;
      max-width:none!important;
      box-sizing:border-box!important;
    }

    /* If the lists are flex children in the base build, keep their own scroll. */
    html[data-ls-scroll-fix='r3'] .chat-list,
    html[data-ls-scroll-fix='r3'] .conversation-list,
    html[data-ls-scroll-fix='r3'] .channel-list{
      min-height:0!important;
      overflow-x:hidden!important;
      overscroll-behavior-y:contain!important;
    }

    /* v0.8.0 legacy structure labels were being injected into the v0.8.1 nav
       grid and are responsible for the tiny overlapping KOMMUNIKATION / COMMUNITY
       text visible in the live screenshot. */
    html[data-ls-scroll-fix='r3'] .v080-nav-section-label{
      display:none!important;
    }
    html[data-ls-scroll-fix='r3'] .v0801-nav-deck{
      overflow:hidden!important;
      align-items:stretch!important;
    }
    html[data-ls-scroll-fix='r3'] .v0801-nav-filter{
      min-width:0!important;
      overflow:hidden!important;
    }

    /* The LMH return button sits in a dedicated top strip outside the app frame. */
    html[data-ls-scroll-fix='r3'] body:before{
      content:'';
      position:fixed;
      z-index:2147482990;
      left:0;right:0;top:0;
      height:var(--ls-topbar-height);
      pointer-events:none;
      border-bottom:1px solid rgba(148,163,184,.11);
      background:rgba(5,11,20,.94);
      backdrop-filter:blur(18px);
      -webkit-backdrop-filter:blur(18px);
    }
    html[data-ls-scroll-fix='r3'] #lsConnectBackToHub{
      position:fixed!important;
      top:8px!important;
      left:10px!important;
      z-index:2147483000!important;
      margin:0!important;
    }

    @media(max-width:700px){
      html[data-ls-scroll-fix='r3']{--ls-topbar-height:48px}
      html[data-ls-scroll-fix='r3'] .app-shell{
        height:calc(var(--ls-viewport-height, 100dvh) - var(--ls-topbar-height))!important;
        max-height:calc(var(--ls-viewport-height, 100dvh) - var(--ls-topbar-height))!important;
      }
      html[data-ls-scroll-fix='r3'] .sidebar,
      html[data-ls-scroll-fix='r3'] .conversation-panel,
      html[data-ls-scroll-fix='r3'] .profile-panel{
        height:100%!important;
        max-height:100%!important;
      }
      html[data-ls-scroll-fix='r3'] .messages{
        padding-bottom:18px!important;
      }
      html[data-ls-scroll-fix='r3'] .message-compose,
      html[data-ls-scroll-fix='r3'] .composer{
        padding-bottom:calc(9px + env(safe-area-inset-bottom))!important;
      }
    }

    @supports not (height:100dvh){
      html[data-ls-scroll-fix='r3'] .app-shell{
        height:calc(var(--ls-viewport-height, 100vh) - var(--ls-topbar-height))!important;
        max-height:calc(var(--ls-viewport-height, 100vh) - var(--ls-topbar-height))!important;
      }
    }
  `;
  document.head.appendChild(style);

  let frame=0;
  function syncViewport(){
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      const height=Math.max(320,Math.round(window.visualViewport?.height||window.innerHeight||document.documentElement.clientHeight||720));
      root.style.setProperty('--ls-viewport-height',`${height}px`);
      root.dataset.lsScrollFix='r3';
      try{
        if(document.scrollingElement) document.scrollingElement.scrollTop=0;
        window.scrollTo(0,0);
      }catch{}
    });
  }

  syncViewport();
  window.addEventListener('resize',syncViewport,{passive:true});
  window.addEventListener('orientationchange',syncViewport,{passive:true});
  window.addEventListener('pageshow',syncViewport,{passive:true});
  window.visualViewport?.addEventListener?.('resize',syncViewport,{passive:true});

  console.info('[LS Connect] scroll containment r3 active');
})();
