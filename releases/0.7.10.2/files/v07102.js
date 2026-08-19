/* LS Connect v0.7.10.2 – mobile navigation cleanup */
const LS_CONNECT_V07102_VERSION = '0.7.10.2';

(function v07102InstallStyles(){
  if(document.getElementById('v07102-styles')) return;
  const style=document.createElement('style');
  style.id='v07102-styles';
  style.textContent=`
    @media(max-width:700px){
      /* Status is already available in the bottom navigation on mobile. */
      #v0795PersistentStories,
      #storiesButton{
        display:none!important;
      }

      /* The bottom "Mehr" entry replaces the old floating gear on mobile. */
      #sidebarQuickActionsGear,
      .v072-quick-actions-gear{
        display:none!important;
      }

      .mobile-nav [data-mobile-action="profile"]{
        position:relative;
      }
      .mobile-nav [data-mobile-action="profile"] small{
        white-space:nowrap;
      }
    }
  `;
  document.head.appendChild(style);
})();

function v07102IsMobile(){
  return !!window.matchMedia?.('(max-width:700px)').matches;
}

function v07102MobileMoreButton(){
  return document.querySelector('.mobile-nav [data-mobile-action="profile"]');
}

function v07102RelabelMobileMore(){
  const button=v07102MobileMoreButton();
  if(!button) return;

  const icon=button.querySelector('span');
  const label=button.querySelector('small');

  if(icon) icon.textContent='⋯';
  if(label) label.textContent='Mehr';

  button.title='Mehr / Schnellzugriffe';
  button.setAttribute('aria-label','Mehr / Schnellzugriffe');
}

function v07102SyncFloatingGear(){
  const gear=document.getElementById('sidebarQuickActionsGear');
  if(!gear) return;

  if(v07102IsMobile()){
    gear.classList.add('hidden');
    gear.setAttribute('aria-hidden','true');
    gear.tabIndex=-1;
  }else{
    gear.removeAttribute('tabindex');
    const hidden=typeof v072QuickActionsHidden==='function' ? v072QuickActionsHidden() : false;
    gear.classList.toggle('hidden',!hidden);
    gear.setAttribute('aria-hidden',hidden?'false':'true');
  }
}

function v07102OpenQuickMenu(){
  if(typeof v072SetQuickActionsHidden==='function'){
    v072SetQuickActionsHidden(false);
  }else{
    const actions=document.querySelector('.sidebar-actions');
    actions?.classList.remove('v072-hidden');
  }

  const actions=document.querySelector('.sidebar-actions');
  actions?.classList.add('v0795-quick-panel');

  document.querySelectorAll('.mobile-nav button').forEach(button=>{
    button.classList.toggle('active',button.dataset.mobileAction==='profile');
  });

  v07102SyncFloatingGear();

  if(actions){
    requestAnimationFrame(()=>{
      try{actions.scrollIntoView({behavior:'smooth',block:'nearest'});}catch{}
    });
  }
}

if(typeof v05OpenMobileSection==='function'){
  const v07102MobileSectionBase=v05OpenMobileSection;
  v05OpenMobileSection=function v05OpenMobileSectionV07102(action){
    if(action==='profile'&&v07102IsMobile()){
      v07102OpenQuickMenu();
      return;
    }
    return v07102MobileSectionBase.apply(this,arguments);
  };
}

/* If the quick menu is closed with its × button, keep the bottom bar available
   and never resurrect the floating gear on mobile. */
if(typeof v072SetQuickActionsHidden==='function'){
  const v07102SetQuickActionsBase=v072SetQuickActionsHidden;
  v072SetQuickActionsHidden=function v072SetQuickActionsHiddenV07102(hidden){
    const result=v07102SetQuickActionsBase.apply(this,arguments);
    v07102SyncFloatingGear();
    return result;
  };
}

function v07102ApplyMobileLayout(){
  v07102RelabelMobileMore();
  v07102SyncFloatingGear();

  const persistent=document.getElementById('v0795PersistentStories');
  if(persistent) persistent.setAttribute('aria-hidden',v07102IsMobile()?'true':'false');
}

window.addEventListener('resize',()=>{
  clearTimeout(state.v07102ResizeTimer);
  state.v07102ResizeTimer=setTimeout(v07102ApplyMobileLayout,120);
});

if(typeof v0795InstallQuickNavigation==='function'){
  const v07102QuickNavigationBase=v0795InstallQuickNavigation;
  v0795InstallQuickNavigation=function v0795InstallQuickNavigationV07102(){
    const result=v07102QuickNavigationBase.apply(this,arguments);
    v07102ApplyMobileLayout();
    return result;
  };
}

setTimeout(v07102ApplyMobileLayout,0);
setTimeout(v07102ApplyMobileLayout,350);
setTimeout(v07102ApplyMobileLayout,1200);

const v07102ChangelogTarget=
  typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:
  (typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);

if(v07102ChangelogTarget&&!v07102ChangelogTarget.some(x=>x.version===LS_CONNECT_V07102_VERSION)){
  v07102ChangelogTarget.unshift({
    version:LS_CONNECT_V07102_VERSION,
    title:'Mobile Navigation aufgeräumt',
    items:[
      'Oberer Status-/Stories-Eintrag wird auf Mobilgeräten ausgeblendet',
      'Schwebendes Zahnrad wird auf Mobilgeräten entfernt',
      'Unterer Einstellungen-Eintrag heißt jetzt Mehr und öffnet die Schnellzugriffe',
      'Konto & Verbindung bleibt getrennt über das Drei-Punkte-Menü erreichbar'
    ]
  });
}

console.info('[LS Connect] v0.7.10.2 mobile navigation cleanup active');
