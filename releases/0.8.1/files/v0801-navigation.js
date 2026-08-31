/* LS Connect v0.8.1 – Navigation Cleanup */
(function v0801NavigationCleanup(){
  if(window.__LS_CONNECT_V0801_NAVIGATION__) return;
  window.__LS_CONNECT_V0801_NAVIGATION__ = true;

  const VERSION = '0.8.1';
  const STYLE_ID = 'v0801-navigation-style';
  const DECK_CLASS = 'v0801-nav-deck';
  const STORAGE_KEY = 'ls-connect-v0801-nav-filter';
  const GROUPS = [
    { id:'communication', label:'Chats', icon:'💬' },
    { id:'community', label:'Community', icon:'◫' },
    { id:'account', label:'Konto', icon:'◎' },
    { id:'admin', label:'Verwaltung', icon:'⚙' }
  ];

  function installStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      html[data-ls-connect-redesign='080'] .${DECK_CLASS}{
        position:sticky;top:0;z-index:8;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;
        margin:0 7px 10px;padding:7px;border:1px solid rgba(148,163,184,.11);border-radius:16px;
        background:rgba(8,15,27,.86);box-shadow:0 8px 20px rgba(0,0,0,.16);backdrop-filter:blur(18px)
      }
      html[data-ls-connect-redesign='080'] .v0801-nav-filter{
        min-width:0!important;min-height:40px!important;display:grid!important;place-items:center!important;gap:2px!important;
        padding:6px 3px!important;border:1px solid transparent!important;border-radius:11px!important;color:#8291a8!important;
        background:transparent!important;box-shadow:none!important;cursor:pointer!important;font-size:9px!important;font-weight:800!important
      }
      html[data-ls-connect-redesign='080'] .v0801-nav-filter:hover{color:#dbeafe!important;background:rgba(255,255,255,.045)!important}
      html[data-ls-connect-redesign='080'] .v0801-nav-filter.active{color:#7dd3fc!important;border-color:rgba(56,189,248,.18)!important;background:rgba(14,165,233,.11)!important}
      html[data-ls-connect-redesign='080'] .v0801-nav-filter-icon{font-size:14px;line-height:1}
      html[data-ls-connect-redesign='080'] .v0801-nav-filter-label{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      html[data-ls-connect-redesign='080'] .v0801-nav-filter-count{min-width:16px;padding:1px 4px;border-radius:999px;background:rgba(148,163,184,.10);font-size:8px;line-height:1.3}
      html[data-ls-connect-redesign='080'] .v0801-filter-hidden{display:none!important}
      html[data-ls-connect-redesign='080'] .sidebar[data-v0801-filter]:not([data-v0801-filter='all']) .v080-nav-section-label{display:none!important}
      html[data-ls-connect-redesign='080'] .v0801-active-section{
        display:none;margin:7px 12px 8px;color:#7dd3fc;font-size:10px;font-weight:850;letter-spacing:.08em;text-transform:uppercase
      }
      html[data-ls-connect-redesign='080'] .sidebar[data-v0801-filter]:not([data-v0801-filter='all']) .v0801-active-section{display:block}
      @media(max-width:900px){
        html[data-ls-connect-redesign='080'] .${DECK_CLASS}{margin:0 5px 8px;padding:6px;gap:4px}
        html[data-ls-connect-redesign='080'] .v0801-nav-filter-label{display:none}
        html[data-ls-connect-redesign='080'] .v0801-nav-filter{min-height:38px!important}
      }
      @media(max-width:700px){
        html[data-ls-connect-redesign='080'] .${DECK_CLASS}{position:relative;top:auto;margin:7px 9px 9px;border-radius:14px}
      }
    `;
    document.head.appendChild(style);
  }

  function normalizedText(el){
    return String(el?.textContent || '').replace(/\s+/g,' ').trim().toLowerCase();
  }

  function classify(el){
    const text = normalizedText(el);
    const marker = `${el.id || ''} ${typeof el.className === 'string' ? el.className : ''} ${text}`.toLowerCase();
    if(/admin|moderation|system|ticket|audit|verwaltung|notice|ankündigung/.test(marker)) return 'admin';
    if(/profil|einstellung|account|charakter|design|abmelden|logout|reihenfolge/.test(marker)) return 'account';
    if(el.matches('.channel-item') || /kanal|story|stories|gruppe|community|forum|feed|organisation|fraktion/.test(marker)) return 'community';
    if(el.matches('.chat-item') || /chat|nachricht|kontakt|anruf|call|freund|conversation|message/.test(marker)) return 'communication';
    return '';
  }

  function getActions(sidebar){
    return [...sidebar.querySelectorAll('.chat-item,.channel-item,button,a,[role="button"]')].filter(el=>{
      if(el.closest(`.${DECK_CLASS}`)) return false;
      if(el.matches('button,a,[role="button"]') && el.closest('.chat-item,.channel-item')) return false;
      return Boolean(normalizedText(el));
    });
  }

  function readFilter(){
    try{
      const value = sessionStorage.getItem(STORAGE_KEY) || 'all';
      return value === 'all' || GROUPS.some(group=>group.id===value) ? value : 'all';
    }catch{return 'all';}
  }

  function writeFilter(value){
    try{sessionStorage.setItem(STORAGE_KEY,value);}catch{}
  }

  function ensureDeck(sidebar){
    let deck = sidebar.querySelector(`.${DECK_CLASS}`);
    if(deck) return deck;

    deck = document.createElement('nav');
    deck.className = DECK_CLASS;
    deck.setAttribute('aria-label','LS Connect Bereiche');
    deck.innerHTML = [
      `<button type="button" class="v0801-nav-filter" data-v0801-filter-button="all" aria-label="Alle Bereiche"><span class="v0801-nav-filter-icon">⌂</span><span class="v0801-nav-filter-label">Alle</span></button>`,
      ...GROUPS.map(group=>`<button type="button" class="v0801-nav-filter" data-v0801-filter-button="${group.id}" aria-label="Bereich ${group.label}"><span class="v0801-nav-filter-icon">${group.icon}</span><span class="v0801-nav-filter-label">${group.label}</span><span class="v0801-nav-filter-count" data-v0801-count="${group.id}">0</span></button>`)
    ].join('');

    const brand = sidebar.querySelector('.brand-copy,.app-brand,.brand,header');
    if(brand?.parentElement === sidebar) brand.insertAdjacentElement('afterend',deck);
    else sidebar.prepend(deck);

    const activeSection = document.createElement('div');
    activeSection.className = 'v0801-active-section';
    activeSection.dataset.v0801ActiveSection = '1';
    deck.insertAdjacentElement('afterend',activeSection);

    deck.addEventListener('click',event=>{
      const button = event.target.closest?.('[data-v0801-filter-button]');
      if(!button) return;
      applyFilter(sidebar,button.dataset.v0801FilterButton || 'all');
    });
    return deck;
  }

  function updateCounts(sidebar,actions){
    const counts = Object.fromEntries(GROUPS.map(group=>[group.id,0]));
    for(const action of actions){
      const group = action.dataset.v0801NavGroup || '';
      if(group in counts) counts[group] += 1;
    }
    for(const group of GROUPS){
      const counter = sidebar.querySelector(`[data-v0801-count="${group.id}"]`);
      if(counter) counter.textContent = String(counts[group.id]);
    }
  }

  function applyFilter(sidebar,value){
    const filter = value === 'all' || GROUPS.some(group=>group.id===value) ? value : 'all';
    sidebar.dataset.v0801Filter = filter;
    writeFilter(filter);

    const actions = getActions(sidebar);
    for(const action of actions){
      const group = action.dataset.v0801NavGroup || '';
      action.classList.toggle('v0801-filter-hidden',filter !== 'all' && Boolean(group) && group !== filter);
    }

    sidebar.querySelectorAll('[data-v0801-filter-button]').forEach(button=>{
      const active = button.dataset.v0801FilterButton === filter;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',active ? 'true' : 'false');
    });

    const title = sidebar.querySelector('[data-v0801-active-section]');
    if(title){
      const group = GROUPS.find(item=>item.id===filter);
      title.textContent = group ? group.label : '';
    }
  }

  function refresh(){
    installStyles();
    const sidebar = document.querySelector('.sidebar');
    if(!sidebar) return;
    ensureDeck(sidebar);

    const actions = getActions(sidebar);
    for(const action of actions){
      const group = classify(action);
      if(group) action.dataset.v0801NavGroup = group;
      else delete action.dataset.v0801NavGroup;
    }
    updateCounts(sidebar,actions);
    applyFilter(sidebar,sidebar.dataset.v0801Filter || readFilter());

    document.documentElement.dataset.lsVersion = VERSION;
    window.__LS_CONNECT_RUNTIME_VERSION__ = VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__ = VERSION;
  }

  let timer = 0;
  const schedule = ()=>{
    clearTimeout(timer);
    timer = setTimeout(refresh,90);
  };
  new MutationObserver(mutations=>{
    if(mutations.some(mutation=>mutation.addedNodes.length || mutation.removedNodes.length)) schedule();
  }).observe(document.documentElement,{childList:true,subtree:true});

  refresh();
  [250,800,1800,3500].forEach(ms=>setTimeout(refresh,ms));
  console.info('[LS Connect] v0.8.1 navigation cleanup active');
})();
