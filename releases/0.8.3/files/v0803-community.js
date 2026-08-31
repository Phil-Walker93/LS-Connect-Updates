/* LS Connect v0.8.3 – Community & Profile */
(function v0803CommunityProfile(){
  if(window.__LS_CONNECT_V0803_COMMUNITY_PROFILE__) return;
  window.__LS_CONNECT_V0803_COMMUNITY_PROFILE__=true;

  const VERSION='0.8.3';
  const STYLE_ID='v0803-community-profile-style';
  const SECTION_CLASS='v0803-section-label';

  function installStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-panel{min-width:0!important;background:linear-gradient(180deg,rgba(11,18,31,.92),rgba(8,14,25,.88))!important}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-header{position:sticky;top:0;z-index:6;min-height:64px!important;padding:12px 14px!important;background:rgba(8,15,27,.84)!important}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-card,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .info-card,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='profile-card']{margin:9px 10px!important;padding:14px!important;border:1px solid rgba(148,163,184,.10)!important;border-radius:18px!important;background:linear-gradient(180deg,rgba(30,41,59,.48),rgba(15,23,42,.40))!important;box-shadow:none!important}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-card .profile-card,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-card .info-card{margin:8px 0 0!important;background:rgba(15,23,42,.34)!important}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-panel h1,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-panel h2,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-panel h3{margin-top:0!important;letter-spacing:-.015em}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-panel p,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-panel small{color:#91a0b7;line-height:1.5}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-avatar,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='profile-avatar'],
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='avatar'][class*='large']{width:76px!important;height:76px!important;border:3px solid rgba(125,211,252,.18)!important;border-radius:24px!important;box-shadow:0 10px 28px rgba(0,0,0,.24)!important}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-actions,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='profile-actions']{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-actions button,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='profile-actions'] button{min-height:36px;border-radius:11px!important}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .${SECTION_CLASS}{margin:15px 14px 5px;color:#6f8098;font-size:9px;font-weight:850;letter-spacing:.12em;text-transform:uppercase;user-select:none}

      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .channel-item{position:relative;overflow:hidden}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .channel-item:after{content:'';position:absolute;inset:0 auto 0 0;width:2px;background:transparent;transition:background .14s ease}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .channel-item.active:after{background:#38bdf8}

      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .channel-post,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .channel-post-card,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .feed-card,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .feed-item,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='community-card']{border:1px solid rgba(148,163,184,.10)!important;border-radius:18px!important;background:rgba(15,23,42,.50)!important;box-shadow:none!important}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .channel-post,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .channel-post-card,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .feed-card,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .feed-item{margin:8px 0!important;padding:13px 14px!important}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .channel-post-content,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .channel-post-body,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='post-content'],
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='post-body']{color:#dbe4ef!important;line-height:1.55!important}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .channel-post-actions,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='post-actions']{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;padding-top:9px;border-top:1px solid rgba(148,163,184,.08)}

      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .stories,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .story-list,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='stories-list']{display:flex;gap:9px;overflow-x:auto;padding:8px 10px 12px;scroll-snap-type:x proximity}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .story-card,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .story-item,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='story-card'],
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='story-item']{flex:0 0 auto;scroll-snap-align:start;border-radius:17px!important;border-color:rgba(148,163,184,.10)!important;box-shadow:none!important;overflow:hidden}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='story'] img{object-fit:cover}

      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .organization-card,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .org-card,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='organization-card'],
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] [class*='organisation-card']{position:relative;padding:14px!important;border:1px solid rgba(56,189,248,.12)!important;border-radius:18px!important;background:linear-gradient(145deg,rgba(14,165,233,.07),rgba(30,41,59,.44))!important;box-shadow:none!important}
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .organization-card:before,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .org-card:before{content:'';position:absolute;left:0;top:18px;bottom:18px;width:2px;border-radius:999px;background:rgba(56,189,248,.55)}

      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .badge,
      html[data-ls-connect-redesign='080'][data-v0803-community='1'] .tag{border-radius:999px!important}

      @media(max-width:900px){html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-card,html[data-ls-connect-redesign='080'][data-v0803-community='1'] .info-card{margin:8px!important;padding:12px!important}}
      @media(max-width:700px){
        html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-header{min-height:56px!important;padding:9px 11px!important}
        html[data-ls-connect-redesign='080'][data-v0803-community='1'] .profile-card,
        html[data-ls-connect-redesign='080'][data-v0803-community='1'] .info-card{margin:7px 8px!important;border-radius:15px!important}
        html[data-ls-connect-redesign='080'][data-v0803-community='1'] .stories,
        html[data-ls-connect-redesign='080'][data-v0803-community='1'] .story-list{padding-left:9px;padding-right:9px}
      }
    `;
    document.head.appendChild(style);
  }

  const normalizedText=el=>String(el?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();

  function sectionFor(card){
    const text=normalizedText(card).slice(0,900);
    if(/bio|über mich|beschreibung|about/.test(text)) return 'Über';
    if(/organisation|unternehmen|fraktion|behörde|medien|rolle|position/.test(text)) return 'Zugehörigkeit';
    if(/kontakt|freund|nachricht|anruf|erreichen/.test(text)) return 'Kontakt';
    if(/aktivität|beitrag|story|stories|feed|kanal/.test(text)) return 'Aktivität';
    return '';
  }

  function labelProfileSections(){
    const panel=document.querySelector('.profile-panel');
    if(!panel) return;
    const cards=[...panel.querySelectorAll(':scope > .profile-card,:scope > .info-card,:scope > [class*="profile-card"]')];
    const signature=cards.map(card=>sectionFor(card)).join('|');
    if(panel.dataset.v0803ProfileSignature===signature) return;
    panel.dataset.v0803ProfileSignature=signature;
    panel.querySelectorAll(`:scope > .${SECTION_CLASS}`).forEach(label=>label.remove());

    let previous='';
    for(const card of cards){
      const section=sectionFor(card);
      if(!section||section===previous) continue;
      const label=document.createElement('div');
      label.className=SECTION_CLASS;
      label.textContent=section;
      card.before(label);
      previous=section;
    }
  }

  function markAccountKinds(){
    document.querySelectorAll('.profile-card,.info-card,.organization-card,.org-card').forEach(card=>{
      const text=normalizedText(card).slice(0,1200);
      const kind=/organisation|unternehmen|fraktion|behörde|medien/.test(text)?'organization':(/person|charakter|profil|bio/.test(text)?'person':'');
      if(kind) card.dataset.v0803AccountKind=kind;
      else delete card.dataset.v0803AccountKind;
    });
  }

  function refresh(){
    installStyles();
    document.documentElement.dataset.v0803Community='1';
    labelProfileSections();
    markAccountKinds();
    document.documentElement.dataset.lsVersion=VERSION;
    window.__LS_CONNECT_RUNTIME_VERSION__=VERSION;
    window.__LS_CONNECT_DYNAMIC_RELEASE__=VERSION;
  }

  let timer=0;
  new MutationObserver(mutations=>{
    if(!mutations.some(m=>m.addedNodes.length||m.removedNodes.length)) return;
    clearTimeout(timer);
    timer=setTimeout(refresh,110);
  }).observe(document.documentElement,{childList:true,subtree:true});

  refresh();
  [250,800,1700,3400].forEach(ms=>setTimeout(refresh,ms));
  console.info('[LS Connect] v0.8.3 Community & Profile active');
})();
