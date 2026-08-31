/* LS Connect v0.8.0 – clearer navigation structure */
(function v080Structure(){
  if(window.__LS_CONNECT_V080_STRUCTURE__) return;
  window.__LS_CONNECT_V080_STRUCTURE__=true;

  const norm=el=>String(el?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
  const groupFor=text=>{
    if(/admin|moderation|system|ticket|audit/.test(text)) return 'Verwaltung';
    if(/profil|einstellung|account|charakter|design|abmelden/.test(text)) return 'Konto';
    if(/kanal|story|gruppe|community|forum|feed/.test(text)) return 'Community';
    if(/chat|nachricht|kontakt|anruf|call|freunde/.test(text)) return 'Kommunikation';
    return '';
  };

  function addBadge(){
    if(document.querySelector('.v080-ui-badge')) return;
    const host=document.querySelector('.brand-copy,.app-brand,.brand');
    if(!host) return;
    const badge=document.createElement('span');
    badge.className='v080-ui-badge';
    badge.textContent='Hub UI · v0.8';
    host.appendChild(badge);
  }

  function structureSidebar(){
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar) return;
    const candidates=[...sidebar.querySelectorAll('button,a,[role="button"],.chat-item,.channel-item')]
      .filter(el=>norm(el)&&!el.closest('.v080-nav-section-label'));
    const signature=candidates.map(el=>`${groupFor(norm(el))}:${norm(el).slice(0,45)}`).join('|');
    if(sidebar.dataset.v080StructureSignature===signature) return;
    sidebar.dataset.v080StructureSignature=signature;
    sidebar.querySelectorAll('.v080-nav-section-label').forEach(el=>el.remove());

    let previous='';
    for(const el of candidates){
      const group=groupFor(norm(el));
      if(!group||group===previous) continue;
      const label=document.createElement('div');
      label.className='v080-nav-section-label';
      label.textContent=group;
      el.parentElement?.insertBefore(label,el);
      previous=group;
    }
  }

  function accessibility(){
    document.querySelectorAll('button.icon-button').forEach(button=>{
      if(button.getAttribute('aria-label')) return;
      const title=String(button.getAttribute('title')||'').trim();
      if(title) button.setAttribute('aria-label',title);
    });
  }

  function refresh(){
    addBadge();
    structureSidebar();
    accessibility();
  }

  let timer=0;
  const schedule=()=>{
    clearTimeout(timer);
    timer=setTimeout(refresh,60);
  };
  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  refresh();
  [250,700,1500,3000].forEach(ms=>setTimeout(refresh,ms));

  console.info('[LS Connect] v0.8.0 structure layer active');
})();
