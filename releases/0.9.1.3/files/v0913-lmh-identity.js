/* LS Connect v0.9.1.3 – LMH-only identity management compatibility patch
 * Purpose: LS Connect consumes the active Hub identity but no longer creates,
 * selects or reorders characters/organization profiles locally.
 */
(function installV0913LmhIdentity(){
  if(window.__LS_CONNECT_V0913_LMH_IDENTITY__)return;
  window.__LS_CONNECT_V0913_LMH_IDENTITY__=true;

  const HUB_URL='https://ls-mobile-hub.vercel.app/?manage=identity&source=ls-connect';
  const root=document.documentElement;
  root.dataset.lsIdentityOwner='lmh';

  function toast(message,type='info'){
    if(typeof showToast==='function')showToast(message,type);
    else console.info('[LS Connect]',message);
  }

  function goToHub(){
    try{window.location.assign(HUB_URL);}
    catch{window.location.href=HUB_URL;}
  }

  function makeHubButton(className='ghost-button'){
    const button=document.createElement('button');
    button.type='button';
    button.className=`${className} v0913-lmh-identity-button`;
    button.dataset.v0913LmhIdentity='1';
    button.innerHTML='<span class="v0913-lmh-icon" aria-hidden="true">◎</span><span><strong>Charaktere & Profile</strong><small>Im Mobile Hub verwalten</small></span><span class="v0913-lmh-arrow" aria-hidden="true">↗</span>';
    button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();goToHub();});
    return button;
  }

  function installStyles(){
    if(document.getElementById('v0913-lmh-identity-style'))return;
    const style=document.createElement('style');
    style.id='v0913-lmh-identity-style';
    style.textContent=`
      html[data-ls-identity-owner='lmh'] .v0913-lmh-identity-button{
        width:100%;display:grid!important;grid-template-columns:28px minmax(0,1fr) auto;align-items:center;
        gap:9px;text-align:left!important;padding:10px 11px!important;border:1px solid color-mix(in srgb,var(--accent) 28%,var(--border))!important;
        background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 11%,var(--panel-2)),var(--panel-2))!important;
      }
      html[data-ls-identity-owner='lmh'] .v0913-lmh-identity-button>span:nth-child(2){display:grid;gap:2px;min-width:0}
      html[data-ls-identity-owner='lmh'] .v0913-lmh-identity-button strong{font-size:.78rem;color:var(--text)}
      html[data-ls-identity-owner='lmh'] .v0913-lmh-identity-button small{font-size:.67rem;color:var(--muted);font-weight:700}
      html[data-ls-identity-owner='lmh'] .v0913-lmh-icon{width:26px;height:26px;display:grid;place-items:center;border-radius:9px;background:color-mix(in srgb,var(--accent) 18%,transparent);color:var(--accent);font-weight:900}
      html[data-ls-identity-owner='lmh'] .v0913-lmh-arrow{color:var(--muted);font-weight:900}
      html[data-ls-identity-owner='lmh'] .v0913-identity-note{margin:0;padding:7px 9px;border-radius:9px;background:color-mix(in srgb,var(--accent) 6%,transparent);color:var(--muted);font-size:.66rem;line-height:1.4}
      html[data-ls-identity-owner='lmh'] [data-v0913-lmh-hidden='1']{display:none!important}
    `;
    document.head.appendChild(style);
  }

  function centralizeQuickSettings(){
    const newCharacter=document.getElementById('newCharacterButton');
    const manageCharacters=document.getElementById('manageCharactersButton');
    const group=newCharacter?.closest('.v0795-quick-group')||manageCharacters?.closest('.v0795-quick-group');
    if(!group)return false;

    newCharacter?.setAttribute('data-v0913-lmh-hidden','1');
    manageCharacters?.setAttribute('data-v0913-lmh-hidden','1');
    const title=group.querySelector('.v0795-quick-group-title span:last-child');
    if(title)title.textContent='Identität';
    if(!group.querySelector('[data-v0913-lmh-identity]')){
      group.appendChild(makeHubButton('ghost-button'));
      const note=document.createElement('p');
      note.className='v0913-identity-note';
      note.textContent='Erstellung, Auswahl und Unternehmensprofile werden zentral im LS Mobile Hub verwaltet.';
      group.appendChild(note);
    }
    return true;
  }

  function centralizeCharacterMenu(){
    const menu=(typeof els!=='undefined'&&els?.characterMenu)||document.getElementById('characterMenu');
    if(!menu)return false;

    /* This menu exists specifically for character switching/creation. Hide all
       legacy actions, not the surrounding account/settings navigation. */
    menu.querySelectorAll('button').forEach(button=>{
      if(button.matches('[data-v0913-lmh-identity]'))return;
      button.setAttribute('data-v0913-lmh-hidden','1');
      button.setAttribute('aria-hidden','true');
      button.tabIndex=-1;
    });
    menu.querySelectorAll('[data-add-character],[data-v07111-open-order]').forEach(element=>element.setAttribute('data-v0913-lmh-hidden','1'));

    if(!menu.querySelector('[data-v0913-lmh-identity]')){
      menu.appendChild(makeHubButton('ghost-button'));
    }
    return true;
  }

  function centralizeAccountModal(){
    const legacy=document.getElementById('v07111AccountOrderShortcut');
    if(legacy)legacy.setAttribute('data-v0913-lmh-hidden','1');
    const content=(typeof els!=='undefined'&&els?.modalContent)||document.getElementById('modalContent');
    if(!content||content.querySelector('[data-v0913-account-identity]'))return false;
    const text=String(document.getElementById('modalTitle')?.textContent||'').toLowerCase();
    if(!/account|konto|einstellung/.test(text))return false;
    const section=document.createElement('section');
    section.className='settings-block';
    section.dataset.v0913AccountIdentity='1';
    section.innerHTML='<h3>Charaktere & Profile</h3><p class="notification-note">Die aktive RP-Identität und Unternehmensprofile werden zentral im LS Mobile Hub verwaltet.</p>';
    section.appendChild(makeHubButton('small-button'));
    content.appendChild(section);
    return true;
  }

  function disableStrayLegacyButtons(){
    const candidates=[...document.querySelectorAll('button,[role="button"]')];
    for(const element of candidates){
      if(element.matches('[data-v0913-lmh-identity]'))continue;
      const label=String(element.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      if(label==='charakter erstellen'||label==='charaktere verwalten'||label==='reihenfolge verwalten'){
        element.setAttribute('data-v0913-lmh-hidden','1');
        element.setAttribute('aria-hidden','true');
        if('tabIndex' in element)element.tabIndex=-1;
      }
    }
  }

  function sync(){
    installStyles();
    centralizeQuickSettings();
    centralizeCharacterMenu();
    centralizeAccountModal();
    disableStrayLegacyButtons();
  }

  /* Capture clicks before legacy handlers when a stale character-menu node was
     added between observer cycles. Only the dedicated character menu is gated. */
  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    const menu=target.closest('#characterMenu');
    if(!menu||target.closest('[data-v0913-lmh-identity]'))return;
    const actionable=target.closest('button,[role="button"],a');
    if(!actionable)return;
    event.preventDefault();event.stopImmediatePropagation();event.stopPropagation();
    toast('Charaktere und Profile werden jetzt im LS Mobile Hub verwaltet.','info');
    goToHub();
  },true);

  const observer=new MutationObserver(()=>{
    cancelAnimationFrame(window.__LS_CONNECT_V0913_LMH_RAF__||0);
    window.__LS_CONNECT_V0913_LMH_RAF__=requestAnimationFrame(sync);
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  if(typeof renderCharacter==='function'){
    const base=renderCharacter;
    renderCharacter=function renderCharacterV0913(){
      const result=base.apply(this,arguments);
      queueMicrotask(sync);
      return result;
    };
  }

  sync();
  [80,240,600].forEach(ms=>setTimeout(sync,ms));
  console.info('[LS Connect] v0.9.1.3 LMH-only identity management ready');
})();
