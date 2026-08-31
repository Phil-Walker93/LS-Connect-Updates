/* LS Connect v0.8.4 – Settings & Admin Cleanup */
(function v0804SettingsAdmin(){
  if(window.__LS_CONNECT_V0804_SETTINGS_ADMIN__) return;
  window.__LS_CONNECT_V0804_SETTINGS_ADMIN__=true;

  const VERSION='0.8.4';
  const STYLE_ID='v0804-settings-admin-style';
  const NAV_CLASS='v0804-settings-nav';
  const HIDDEN_CLASS='v0804-settings-hidden';
  const CATEGORIES=[
    ['all','Alle','⌂'],
    ['account','Konto','◎'],
    ['design','Design','◈'],
    ['notifications','Hinweise','◉'],
    ['privacy','Privatsphäre','◇'],
    ['system','System','⚙'],
    ['other','Weitere','•••']
  ];

  function installStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .modal{max-width:min(980px,94vw)!important;max-height:min(88vh,920px)!important;overflow:hidden!important}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] #modalContent,
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .modal-content{overflow:auto!important;padding:14px 16px 20px!important;scroll-padding-top:64px}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .settings-block{margin:8px 0!important;padding:14px!important;border-radius:16px!important;background:rgba(15,23,42,.48)!important}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .settings-block h3,
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .settings-block h4{margin:0 0 7px!important;font-size:13px!important;letter-spacing:-.01em}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .settings-block p,
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .notification-note{margin:4px 0 10px!important;color:#8796ab!important;font-size:11px!important;line-height:1.48!important}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .settings-block label{display:grid;gap:5px;margin:8px 0;color:#b9c5d4;font-size:11px;font-weight:700}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .settings-block input,
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .settings-block select,
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .settings-block textarea{min-height:40px!important}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .${NAV_CLASS}{position:sticky;top:-14px;z-index:25;display:flex;gap:6px;overflow-x:auto;margin:-2px -2px 12px;padding:8px 2px 10px;background:linear-gradient(180deg,rgba(10,17,29,.98) 70%,rgba(10,17,29,.82) 88%,transparent);backdrop-filter:blur(14px)}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .v0804-settings-filter{flex:0 0 auto;min-height:36px;padding:7px 10px!important;border:1px solid rgba(148,163,184,.10)!important;border-radius:11px!important;background:rgba(255,255,255,.025)!important;color:#8291a8!important;box-shadow:none!important;font-size:10px!important;font-weight:800!important}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .v0804-settings-filter.active{color:#7dd3fc!important;border-color:rgba(56,189,248,.20)!important;background:rgba(14,165,233,.10)!important}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .v0804-settings-count{margin-left:5px;padding:1px 5px;border-radius:999px;background:rgba(148,163,184,.10);font-size:8px}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .${HIDDEN_CLASS}{display:none!important}

      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .admin-tabs,
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] [class*='admin-tabs']{position:sticky;top:0;z-index:24;display:flex;gap:5px;overflow-x:auto;padding:7px;margin:0 0 12px;border:1px solid rgba(148,163,184,.10);border-radius:14px;background:rgba(8,15,27,.90);backdrop-filter:blur(14px)}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .admin-tab{flex:0 0 auto;min-height:36px;padding:7px 10px!important;border-radius:10px!important;color:#8e9db2!important;font-size:10px!important;font-weight:800!important}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .admin-tab.active{color:#7dd3fc!important;background:rgba(14,165,233,.11)!important;box-shadow:none!important}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .admin-channel-row,
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .request-card,
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] [class*='admin-user-row'],
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] [class*='admin-role-row'],
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] [class*='admin-log-row']{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px;margin:6px 0!important;padding:11px 12px!important;border:1px solid rgba(148,163,184,.09)!important;border-radius:14px!important;background:rgba(15,23,42,.42)!important}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .admin-channel-row:hover,
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .request-card:hover{border-color:rgba(56,189,248,.16)!important;background:rgba(30,41,59,.46)!important}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .admin-actions,
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] [class*='admin-actions']{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .admin-actions button,
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] [class*='admin-actions'] button{min-height:34px;padding:6px 9px!important;border-radius:10px!important}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] button.danger,
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .danger-button{border-color:rgba(248,113,113,.22)!important;background:rgba(127,29,29,.12)!important;color:#fca5a5!important;box-shadow:none!important}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] table{width:100%;border-collapse:separate;border-spacing:0 5px}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] th{padding:5px 9px;color:#6f8098;font-size:9px;letter-spacing:.08em;text-transform:uppercase;text-align:left}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] td{padding:9px;background:rgba(15,23,42,.42);border-top:1px solid rgba(148,163,184,.08);border-bottom:1px solid rgba(148,163,184,.08);font-size:11px}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] td:first-child{border-left:1px solid rgba(148,163,184,.08);border-radius:11px 0 0 11px}
      html[data-ls-connect-redesign='080'][data-v0804-admin='1'] td:last-child{border-right:1px solid rgba(148,163,184,.08);border-radius:0 11px 11px 0}
      @media(max-width:700px){
        html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .modal{max-width:100vw!important;max-height:100vh!important;border-radius:0!important}
        html[data-ls-connect-redesign='080'][data-v0804-admin='1'] #modalContent,
        html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .modal-content{padding:10px 10px 82px!important}
        html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .${NAV_CLASS}{top:-10px;margin-left:-1px;margin-right:-1px}
        html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .admin-channel-row,
        html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .request-card,
        html[data-ls-connect-redesign='080'][data-v0804-admin='1'] [class*='admin-user-row'],
        html[data-ls-connect-redesign='080'][data-v0804-admin='1'] [class*='admin-role-row']{grid-template-columns:1fr!important}
        html[data-ls-connect-redesign='080'][data-v0804-admin='1'] .admin-actions,
        html[data-ls-connect-redesign='080'][data-v0804-admin='1'] [class*='admin-actions']{justify-content:flex-start}
      }
    `;
    document.head.appendChild(style);
  }

  function textOf(el){return String(el?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();}

  function categorize(block){
    const text=textOf(block).slice(0,1800);
    if(/profil|konto|account|charakter|reihenfolge|name|avatar/.test(text)) return 'account';
    if(/design|theme|farbe|darstellung|oberfläche|preset/.test(text)) return 'design';
    if(/benachrichtigung|notification|hinweis|ticket|meldung|push/.test(text)) return 'notifications';
    if(/privat|sichtbar|sichtbarkeit|block|sicherheit|passwort|session/.test(text)) return 'privacy';
    if(/admin|system|version|audit|log|moderation|rolle|berechtigung/.test(text)) return 'system';
    return 'other';
  }

  function applySettingsFilter(root,value){
    root.dataset.v0804Filter=value;
    root.querySelectorAll(':scope > .settings-block').forEach(block=>{
      block.classList.toggle(HIDDEN_CLASS,value!=='all'&&block.dataset.v0804Category!==value);
    });
    root.querySelectorAll('[data-v0804-filter]').forEach(button=>{
      const active=button.dataset.v0804Filter===value;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',active?'true':'false');
    });
  }

  function ensureSettingsNav(root){
    if(!(root instanceof Element)) return;
    const blocks=[...root.querySelectorAll(':scope > .settings-block')];
    const existing=root.querySelector(`:scope > .${NAV_CLASS}`);
    if(blocks.length<4){existing?.remove();return;}

    const counts={account:0,design:0,notifications:0,privacy:0,system:0,other:0};
    for(const block of blocks){
      const category=categorize(block);
      block.dataset.v0804Category=category;
      counts[category]=(counts[category]||0)+1;
    }
    const signature=blocks.map(block=>`${block.dataset.v0804Category}:${textOf(block).slice(0,80)}`).join('|');
    if(existing?.dataset.v0804Signature===signature) return;
    existing?.remove();

    const nav=document.createElement('nav');
    nav.className=NAV_CLASS;
    nav.dataset.v0804Signature=signature;
    nav.setAttribute('aria-label','Einstellungsbereiche');
    for(const [id,label,icon] of CATEGORIES){
      if(id!=='all'&&!counts[id]) continue;
      const button=document.createElement('button');
      button.type='button';
      button.className='v0804-settings-filter';
      button.dataset.v0804Filter=id;
      button.innerHTML=`<span aria-hidden="true">${icon}</span> ${label}${id==='all'?'':` <span class="v0804-settings-count">${counts[id]}</span>`}`;
      button.addEventListener('click',()=>applySettingsFilter(root,id));
      nav.appendChild(button);
    }
    root.prepend(nav);
    applySettingsFilter(root,'all');
  }

  function refresh(){
    installStyles();
    document.documentElement.dataset.v0804Admin='1';
    const roots=new Set();
    document.querySelectorAll('#modalContent,.modal-content').forEach(root=>roots.add(root));
    roots.forEach(ensureSettingsNav);
    document.documentElement.dataset.lsVersion=VERSION;
    window.__LS_CONNECT_RUNTIME_VERSION__=VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=VERSION;
  }

  let timer=0;
  new MutationObserver(mutations=>{
    if(!mutations.some(m=>m.addedNodes.length||m.removedNodes.length)) return;
    clearTimeout(timer);
    timer=setTimeout(refresh,120);
  }).observe(document.documentElement,{childList:true,subtree:true});

  refresh();
  [250,800,1800,3500].forEach(ms=>setTimeout(refresh,ms));
  console.info('[LS Connect] v0.8.4 Settings & Admin Cleanup active');
})();
