/* LS Connect v0.8.6 – Performance & Accessibility */
(function v0806PerformanceAccessibility(){
  if(window.__LS_CONNECT_V0806_PERF_A11Y__) return;
  window.__LS_CONNECT_V0806_PERF_A11Y__=true;

  const VERSION='0.8.6';
  const STYLE_ID='v0806-performance-a11y-style';
  const KEYBOARD_ROOTS='.v0801-nav-deck,.v0804-settings-nav,.admin-tabs,.mobile-nav';
  const SYMBOL_NAMES=new Map([
    ['×','Schließen'],['✕','Schließen'],['✖','Schließen'],['…','Weitere Aktionen'],['⋯','Weitere Aktionen'],['•••','Weitere Aktionen'],
    ['←','Zurück'],['‹','Zurück'],['+','Hinzufügen'],['⚙','Einstellungen'],['⌂','Startseite']
  ]);

  function installStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html[data-ls-connect-redesign='080'][data-v0806-a11y='1'] :where(button,a,input,textarea,select,[role='button'],[tabindex]):focus-visible{
        outline:2px solid #7dd3fc!important;
        outline-offset:2px!important;
        box-shadow:0 0 0 4px rgba(56,189,248,.14)!important;
      }
      html[data-ls-connect-redesign='080'][data-v0806-a11y='1'] :where(.chat-item,.channel-item,.settings-block,.profile-card,.info-card,.request-card,.admin-channel-row){scroll-margin-block:72px}
      html[data-ls-connect-redesign='080'][data-v0806-a11y='1'] :where(.settings-block,.profile-card,.info-card,.request-card,.admin-channel-row,.feed-card,.feed-item,.channel-post,.channel-post-card,[class*='community-card']){
        contain:layout paint style;
      }
      @supports(content-visibility:auto){
        html[data-ls-connect-redesign='080'][data-v0806-a11y='1'] :where(.settings-block,.profile-card,.info-card,.request-card,.admin-channel-row,.feed-card,.feed-item,.channel-post,.channel-post-card,[class*='community-card']){
          content-visibility:auto;
          contain-intrinsic-size:auto 96px;
        }
      }
      html[data-ls-connect-redesign='080'][data-v0806-a11y='1'] [aria-disabled='true'],
      html[data-ls-connect-redesign='080'][data-v0806-a11y='1'] :disabled{cursor:not-allowed!important;opacity:.58!important}
      @media(prefers-reduced-motion:reduce){
        html[data-ls-connect-redesign='080'][data-v0806-a11y='1'] *,
        html[data-ls-connect-redesign='080'][data-v0806-a11y='1'] *::before,
        html[data-ls-connect-redesign='080'][data-v0806-a11y='1'] *::after{
          scroll-behavior:auto!important;
          transition-duration:.01ms!important;
          animation-duration:.01ms!important;
          animation-iteration-count:1!important;
        }
      }
      @media(forced-colors:active){
        html[data-ls-connect-redesign='080'][data-v0806-a11y='1'] :where(button,a,input,textarea,select,[role='button']):focus-visible{outline:2px solid Highlight!important}
        html[data-ls-connect-redesign='080'][data-v0806-a11y='1'] .message-bubble,
        html[data-ls-connect-redesign='080'][data-v0806-a11y='1'] .settings-block,
        html[data-ls-connect-redesign='080'][data-v0806-a11y='1'] .profile-card{border:1px solid CanvasText!important}
      }
    `;
    document.head.appendChild(style);
  }

  function text(value){return String(value||'').replace(/\s+/g,' ').trim();}
  function cssEscape(value){return globalThis.CSS?.escape?CSS.escape(value):String(value).replace(/[^a-zA-Z0-9_-]/g,'\\$&');}

  function accessibleName(el){
    const explicit=text(el.getAttribute?.('aria-label')) || text(el.getAttribute?.('title')) || text(el.getAttribute?.('data-label')) || text(el.getAttribute?.('data-action'));
    if(explicit) return explicit;
    const visible=text(el.textContent);
    if(/[\p{L}\p{N}]/u.test(visible)) return visible;
    return SYMBOL_NAMES.get(visible) || '';
  }

  function labelButtons(root){
    const buttons=[];
    if(root instanceof Element && root.matches('button,[role="button"]')) buttons.push(root);
    root.querySelectorAll?.('button,[role="button"]').forEach(el=>buttons.push(el));
    for(const button of buttons){
      if(text(button.getAttribute('aria-label'))) continue;
      const visible=text(button.textContent);
      if(/[\p{L}\p{N}]/u.test(visible)) continue;
      const name=accessibleName(button);
      if(name) button.setAttribute('aria-label',name);
    }
  }

  function labelInputs(root){
    const inputs=[];
    if(root instanceof Element && root.matches('input,textarea,select')) inputs.push(root);
    root.querySelectorAll?.('input,textarea,select').forEach(el=>inputs.push(el));
    for(const input of inputs){
      if(input.id && document.querySelector(`label[for="${cssEscape(input.id)}"]`)) continue;
      if(input.closest('label')) continue;
      if(text(input.getAttribute('aria-label')) || text(input.getAttribute('aria-labelledby'))) continue;
      const name=text(input.getAttribute('placeholder')) || text(input.getAttribute('name')) || text(input.getAttribute('title'));
      if(name) input.setAttribute('aria-label',name);
    }
  }

  function enhanceMessages(root){
    const areas=[];
    if(root instanceof Element && root.matches('.messages')) areas.push(root);
    root.querySelectorAll?.('.messages').forEach(el=>areas.push(el));
    for(const area of areas){
      if(!area.getAttribute('role')) area.setAttribute('role','log');
      if(!area.getAttribute('aria-live')) area.setAttribute('aria-live','polite');
      area.setAttribute('aria-relevant','additions text');
      area.setAttribute('aria-atomic','false');
    }
  }

  function enhanceDialogs(root){
    const dialogs=[];
    if(root instanceof Element && root.matches('.modal')) dialogs.push(root);
    root.querySelectorAll?.('.modal').forEach(el=>dialogs.push(el));
    for(const dialog of dialogs){
      if(!dialog.getAttribute('role')) dialog.setAttribute('role','dialog');
      dialog.setAttribute('aria-modal','true');
      const title=dialog.querySelector('#modalTitle,.modal-title,h1,h2,h3');
      if(title){
        if(!title.id) title.id=`v0806-dialog-title-${Math.random().toString(36).slice(2,9)}`;
        if(!dialog.getAttribute('aria-labelledby')) dialog.setAttribute('aria-labelledby',title.id);
      }
    }
  }

  function enhanceNavigation(root){
    const navs=[];
    if(root instanceof Element && root.matches(KEYBOARD_ROOTS)) navs.push(root);
    root.querySelectorAll?.(KEYBOARD_ROOTS).forEach(el=>navs.push(el));
    for(const nav of navs){
      if(nav.classList.contains('admin-tabs')){
        nav.setAttribute('role','tablist');
        nav.querySelectorAll('.admin-tab').forEach(tab=>tab.setAttribute('role','tab'));
      }
      if(nav.dataset.v0806Keyboard==='1') continue;
      nav.dataset.v0806Keyboard='1';
      nav.addEventListener('keydown',event=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        const items=[...nav.querySelectorAll('button:not(:disabled),a[href],[role="button"]')].filter(el=>!el.hidden && el.offsetParent!==null);
        if(!items.length) return;
        const current=Math.max(0,items.indexOf(document.activeElement));
        let next=current;
        if(event.key==='ArrowLeft') next=(current-1+items.length)%items.length;
        if(event.key==='ArrowRight') next=(current+1)%items.length;
        if(event.key==='Home') next=0;
        if(event.key==='End') next=items.length-1;
        event.preventDefault();
        items[next]?.focus();
      });
    }
  }

  function syncStates(){
    document.querySelectorAll('.mobile-nav button,.admin-tab').forEach(button=>{
      const active=button.classList.contains('active');
      if(button.classList.contains('admin-tab')) button.setAttribute('aria-selected',active?'true':'false');
      else if(active) button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    });
  }

  function process(root){
    if(!(root instanceof Document || root instanceof Element)) return;
    labelButtons(root);
    labelInputs(root);
    enhanceMessages(root);
    enhanceDialogs(root);
    enhanceNavigation(root);
  }

  const pending=new Set();
  let frame=0;
  function schedule(root){
    if(root instanceof Element) pending.add(root);
    if(frame) return;
    frame=requestAnimationFrame(()=>{
      frame=0;
      const batch=[...pending];
      pending.clear();
      for(const node of batch) process(node);
      syncStates();
    });
  }

  installStyles();
  document.documentElement.dataset.v0806A11y='1';
  process(document);
  syncStates();

  // v0.8.1 replaced the original structural sidebar labels. Stop the now redundant
  // v0.8.0 full-document observer once the newer layers have finished booting.
  if(typeof window.__LS_CONNECT_V080_STRUCTURE_STOP__==='function') window.__LS_CONNECT_V080_STRUCTURE_STOP__();

  const observer=new MutationObserver(mutations=>{
    for(const mutation of mutations){
      for(const node of mutation.addedNodes){
        if(node instanceof Element) schedule(node);
      }
    }
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  document.addEventListener('click',()=>requestAnimationFrame(syncStates),true);
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape') return;
    const open=document.querySelector('.v0802-header-overflow.open');
    if(!open) return;
    open.classList.remove('open');
    const toggle=open.querySelector('.v0802-overflow-toggle');
    toggle?.setAttribute('aria-expanded','false');
    toggle?.focus();
  },true);

  document.documentElement.dataset.lsVersion=VERSION;
  window.__LS_CONNECT_RUNTIME_VERSION__=VERSION;
  window.__LS_CONNECT_DYNAMIC_RELEASE__=VERSION;
  console.info('[LS Connect] v0.8.6 Performance & Accessibility active');
})();
