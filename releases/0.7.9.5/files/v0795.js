/* LS Connect v0.7.9.5 – quick hybrid UI & usability collection */
const LS_CONNECT_V0795_VERSION = '0.7.9.5';

Object.assign(state, {
  v0795AppVersion: state.v0795AppVersion || LS_CONNECT_V0795_VERSION,
  v0795TicketPriority: state.v0795TicketPriority || '',
  v0795CharacterType: state.v0795CharacterType || '',
  v0795StoryIndicatorBusy: false,
  v0795StoryIndicatorTimer: null
});

(function v0795Styles(){
  if (document.getElementById('v0795-styles')) return;
  const style=document.createElement('style');
  style.id='v0795-styles';
  style.textContent=`
    /* Admin panel: dynamically scale with viewport */
    #modal.v0795-admin-modal{width:min(1180px,calc(100vw - 36px));max-height:min(92dvh,980px)}
    #modal.v0795-admin-modal .modal-content{min-width:0;overflow:auto}
    #modal.v0795-admin-modal .admin-stats{grid-template-columns:repeat(auto-fit,minmax(120px,1fr))}
    #modal.v0795-admin-modal .admin-tab-pane{min-width:0}
    #modal.v0795-admin-modal .ticket-filter-row{grid-template-columns:minmax(180px,1.6fr) minmax(150px,.8fr) minmax(150px,.8fr);align-items:center}
    #modal.v0795-admin-modal .staff-card,#modal.v0795-admin-modal .admin-ticket-card{min-width:0}

    /* Theme-sync for admin notices */
    #adminNoticesPaneV078 input,
    #adminNoticesPaneV078 select,
    #adminNoticesPaneV078 textarea{
      width:100%;box-sizing:border-box;border:1px solid var(--border);border-radius:11px;
      background:var(--panel-2);color:var(--text);font:inherit;outline:none;
    }
    #adminNoticesPaneV078 input,#adminNoticesPaneV078 select{min-height:42px;padding:9px 11px}
    #adminNoticesPaneV078 textarea{padding:10px 11px;resize:vertical;min-height:110px}
    #adminNoticesPaneV078 input::placeholder,#adminNoticesPaneV078 textarea::placeholder{color:var(--muted);opacity:.88}
    #adminNoticesPaneV078 input:focus,#adminNoticesPaneV078 select:focus,#adminNoticesPaneV078 textarea:focus{border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 18%,transparent)}

    /* Extra filters */
    .v0795-character-filter-row{display:grid;grid-template-columns:minmax(180px,1fr) minmax(170px,.55fr);gap:9px;margin-bottom:9px}
    .v0795-character-filter-row .contact-search{margin:0}
    .v0795-character-filter-row select,.ticket-filter-row #adminTicketPriorityV0795{
      width:100%;border:1px solid var(--border);border-radius:11px;background:var(--panel-2);color:var(--text);padding:10px 11px;outline:none
    }

    /* Persistent Stories entry below company channels */
    .v0795-persistent-stories{padding:8px 0 4px;flex:0 0 auto}
    .v0795-persistent-stories .ghost-button{width:100%;display:flex;align-items:center;justify-content:flex-start;gap:9px;border:1px solid var(--border);background:var(--panel-2)}
    .v0795-story-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#ef4444;box-shadow:0 0 0 3px color-mix(in srgb,#ef4444 16%,transparent);margin-left:auto;flex:0 0 auto}
    .v0795-story-dot.hidden{display:none!important}
    .mobile-nav [data-mobile-action="stories"]{position:relative}
    .mobile-nav [data-mobile-action="stories"] .v0795-mobile-story-dot{position:absolute;top:7px;right:calc(50% - 18px);width:8px;height:8px;border-radius:50%;background:#ef4444;box-shadow:0 0 0 2px var(--panel)}
    .mobile-nav [data-mobile-action="stories"] .v0795-mobile-story-dot.hidden{display:none!important}

    /* Cleaner quick settings panel */
    .sidebar-actions.v0795-quick-panel{gap:10px!important;padding:44px 10px 10px!important;border:1px solid var(--border);border-radius:16px;background:color-mix(in srgb,var(--panel-2) 94%,transparent);box-shadow:0 16px 44px rgba(0,0,0,.22)}
    .v0795-quick-group{display:grid;gap:7px;padding:9px;border:1px solid var(--border);border-radius:13px;background:var(--panel)}
    .v0795-quick-group-title{display:flex;align-items:center;gap:7px;color:var(--muted);font-size:.68rem;font-weight:900;letter-spacing:.07em;text-transform:uppercase;padding:1px 3px 4px}
    .v0795-quick-group .ghost-button{width:100%;display:flex;align-items:center;justify-content:flex-start;gap:10px;text-align:left;padding:10px 11px;border-radius:11px}
    .v0795-quick-icon{width:24px;display:inline-grid;place-items:center;flex:0 0 24px;font-size:1rem}

    @media(max-width:820px){
      #modal.v0795-admin-modal{width:calc(100vw - 16px);max-height:calc(100dvh - 16px)}
      #modal.v0795-admin-modal .ticket-filter-row{grid-template-columns:1fr 1fr}
      #modal.v0795-admin-modal .ticket-filter-row input{grid-column:1/-1}
      .v0795-character-filter-row{grid-template-columns:1fr}
    }
    @media(max-width:700px){
      #modalBackdrop.v0795-admin-backdrop{padding:0;align-items:stretch}
      #modal.v0795-admin-modal{width:100vw;height:100dvh;max-height:100dvh;border-radius:0;border-left:0;border-right:0;border-bottom:0}
      #modal.v0795-admin-modal .modal-header{padding:max(12px,env(safe-area-inset-top)) 14px 12px;position:sticky;top:0;z-index:4;background:var(--panel)}
      #modal.v0795-admin-modal .modal-content{padding:12px;padding-bottom:max(18px,env(safe-area-inset-bottom))}
      #modal.v0795-admin-modal .ticket-filter-row{grid-template-columns:1fr}
      #modal.v0795-admin-modal .ticket-filter-row input{grid-column:auto}
      #modal.v0795-admin-modal .admin-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
      .v0795-persistent-stories{padding:7px 0}
      .sidebar-actions.v0795-quick-panel:not(.v072-hidden){display:grid!important;margin-top:8px}
      .v0795-quick-group .ghost-button{min-height:44px}
    }
  `;
  document.head.appendChild(style);
})();

function v0795Escape(value){return typeof escapeHtml==='function'?escapeHtml(String(value??'')):String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

async function v0795LoadAppVersion(){
  try{
    const response=await fetch('./version.json?v=0795',{cache:'no-store'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    if(data?.version)state.v0795AppVersion=String(data.version);
  }catch{state.v0795AppVersion=LS_CONNECT_V0795_VERSION;}
  return state.v0795AppVersion;
}

function v0795RuntimeCardHtml(){
  const rt=state.clientRuntimeV079||{};
  const compat=state.backendCompatV079||{};
  const backend=compat.backend_version||'nicht geprüft';
  const contract=compat.api_contract??'—';
  const mode=typeof v079RuntimeLabel==='function'?v079RuntimeLabel():(rt.client==='desktop'?'Desktop/BAT':'Online');
  return `<section id="v079RuntimeCard" class="v079-runtime-card">
    <div class="v079-runtime-row"><strong>Client-Modus</strong><span class="v079-runtime-badge"><span class="v079-runtime-dot"></span>${v0795Escape(mode)}</span></div>
    <div class="v079-runtime-row"><span>App-Version</span><strong>${v0795Escape(state.v0795AppVersion||LS_CONNECT_V0795_VERSION)}</strong></div>
    <div class="v079-runtime-row"><span>Backend-Version</span><strong>${v0795Escape(backend)}</strong></div>
    <div class="v079-runtime-row"><span>API-Vertrag</span><strong>${v0795Escape(contract)}</strong></div>
    ${rt.client==='desktop'?`<div class="v079-runtime-row"><span>Desktop-Runtime</span><strong>${v0795Escape(rt.serverVersion||'0.7.9')}</strong></div>`:''}
  </section>`;
}
if(typeof v079RuntimeCardHtml==='function')v079RuntimeCardHtml=v0795RuntimeCardHtml;

function v0795NormalizeType(value){
  const s=String(value||'').trim().toLowerCase().replace(/[-_]+/g,' ');
  if(s.includes('krimin'))return 'criminal_org';
  if(s.includes('medien')||s.includes('media'))return 'media';
  if(s.includes('behörde')||s.includes('behoerde')||s.includes('authority'))return 'authority';
  if(s.includes('organisation')||s.includes('organization'))return 'organization';
  if(s.includes('privat')||s.includes('private'))return 'private';
  return s;
}

function v0795InstallCharacterTypeFilter(){
  const pane=document.getElementById('adminActivePane');
  const search=document.getElementById('adminActiveSearch');
  if(!pane||!search||document.getElementById('adminCharacterTypeV0795'))return;
  const existing=search.closest('.contact-search');
  const row=document.createElement('div');row.className='v0795-character-filter-row';
  existing.parentElement.insertBefore(row,existing);row.appendChild(existing);
  const select=document.createElement('select');select.id='adminCharacterTypeV0795';select.setAttribute('aria-label','Charaktertyp filtern');
  select.innerHTML='<option value="">Alle Typen</option><option value="private">Privat</option><option value="media">Medien</option><option value="authority">Behörde</option><option value="organization">Organisation</option><option value="criminal_org">Kriminelle Organisation</option>';
  select.value=state.v0795CharacterType||'';row.appendChild(select);
  select.addEventListener('change',()=>{state.v0795CharacterType=select.value;if(typeof v071RefreshAdminTab==='function')v071RefreshAdminTab('active');});
}
if(typeof v071RenderAdminActive==='function'){
  const v0795RenderActiveBase=v071RenderAdminActive;
  v071RenderAdminActive=function v071RenderAdminActiveV0795(chars){
    const filter=state.v0795CharacterType||document.getElementById('adminCharacterTypeV0795')?.value||'';
    const list=filter?(chars||[]).filter(c=>v0795NormalizeType(c.account_type)===filter):(chars||[]);
    return v0795RenderActiveBase(list);
  };
}

function v0795InstallTicketPriorityFilter(){
  const row=document.querySelector('#adminTicketsPaneV076 .ticket-filter-row');
  if(!row||document.getElementById('adminTicketPriorityV0795'))return;
  const select=document.createElement('select');select.id='adminTicketPriorityV0795';select.setAttribute('aria-label','Ticket-Priorität filtern');
  select.innerHTML='<option value="">Alle Prioritäten</option><option value="low">Niedrig</option><option value="normal">Normal</option><option value="high">Hoch</option><option value="critical">Kritisch</option>';
  select.value=state.v0795TicketPriority||'';row.appendChild(select);
  select.addEventListener('change',()=>{state.v0795TicketPriority=select.value;if(typeof v076RefreshAdminTickets==='function')v076RefreshAdminTickets();});
}
if(typeof v076RenderAdminTickets==='function'){
  const v0795RenderTicketsBase=v076RenderAdminTickets;
  v076RenderAdminTickets=function v076RenderAdminTicketsV0795(tickets){
    const filter=state.v0795TicketPriority||document.getElementById('adminTicketPriorityV0795')?.value||'';
    const list=filter?(tickets||[]).filter(t=>String(t.priority||'normal')===filter):(tickets||[]);
    return v0795RenderTicketsBase(list);
  };
}

function v0795SyncNoticeTheme(){
  const pane=document.getElementById('adminNoticesPaneV078');if(!pane)return;
  const bg=getComputedStyle(document.body).backgroundColor.match(/\d+/g)?.slice(0,3).map(Number)||[11,18,32];
  const lum=(.2126*bg[0]+.7152*bg[1]+.0722*bg[2]);
  pane.style.colorScheme=lum<150?'dark':'light';
}

function v0795InstallAdminResponsive(){
  const content=(typeof els!=='undefined'&&els.modalContent)||document.getElementById('modalContent');
  const modal=document.getElementById('modal');const backdrop=document.getElementById('modalBackdrop');
  if(!content||!modal)return;
  modal.classList.add('v0795-admin-modal');backdrop?.classList.add('v0795-admin-backdrop');
  v0795InstallCharacterTypeFilter();v0795InstallTicketPriorityFilter();v0795SyncNoticeTheme();
}

function v0795RemoveAdminResponsive(){
  document.getElementById('modal')?.classList.remove('v0795-admin-modal');
  document.getElementById('modalBackdrop')?.classList.remove('v0795-admin-backdrop');
}

if(typeof openAdminModal==='function'){
  const v0795AdminBase=openAdminModal;
  openAdminModal=async function openAdminModalV0795(){
    const result=await v0795AdminBase.apply(this,arguments);
    v0795InstallAdminResponsive();
    requestAnimationFrame(v0795InstallAdminResponsive);
    return result;
  };
}

/* Reformat the legacy quick-actions block into categories, while Stories remain persistent. */
function v0795BeautifyButton(button,icon,label){
  if(!button)return;
  button.innerHTML=`<span class="v0795-quick-icon" aria-hidden="true">${icon}</span><span>${label}</span>`;
}
function v0795MakeQuickGroup(title,icon){
  const group=document.createElement('section');group.className='v0795-quick-group';
  group.innerHTML=`<div class="v0795-quick-group-title"><span aria-hidden="true">${icon}</span><span>${title}</span></div>`;
  return group;
}
function v0795InstallQuickNavigation(){
  const actions=document.querySelector('.sidebar-actions');const channelList=document.getElementById('channelList');
  if(!actions||!channelList)return;
  actions.classList.add('v0795-quick-panel');

  const stories=document.getElementById('storiesButton');
  if(stories&&!stories.closest('.v0795-persistent-stories')){
    const persistent=document.createElement('div');persistent.className='v0795-persistent-stories';persistent.id='v0795PersistentStories';
    channelList.insertAdjacentElement('afterend',persistent);persistent.appendChild(stories);
    stories.innerHTML='<span aria-hidden="true">◉</span><span>Status / Stories</span><span id="v0795StoryDot" class="v0795-story-dot hidden" aria-label="Neue Stories"></span>';
  }

  if(actions.querySelector('.v0795-quick-group'))return;
  const communication=v0795MakeQuickGroup('Kommunikation','⌁');
  const characters=v0795MakeQuickGroup('Charaktere','♙');
  const appearance=v0795MakeQuickGroup('App & Darstellung','⚙');
  const move=(id,group,icon,label)=>{const b=document.getElementById(id);if(!b)return;v0795BeautifyButton(b,icon,label);group.appendChild(b);};
  move('channelsButton',communication,'▣','Unternehmenskanäle');
  move('contactsButton',communication,'♙','Kontakte & Anfragen');
  move('newGroupButton',communication,'＋','Gruppe erstellen');
  move('joinGroupButton',communication,'↪','Gruppenlink beitreten');
  move('newCharacterButton',characters,'＋','Charakter erstellen');
  move('manageCharactersButton',characters,'◎','Charaktere verwalten');
  move('themeButton',appearance,'◐','Darstellung wechseln');
  actions.append(communication,characters,appearance);
}

function v0795SetStoryIndicator(show){
  document.getElementById('v0795StoryDot')?.classList.toggle('hidden',!show);
  const mobile=document.querySelector('[data-mobile-action="stories"]');
  if(mobile){
    let dot=mobile.querySelector('.v0795-mobile-story-dot');
    if(!dot){dot=document.createElement('span');dot.className='v0795-mobile-story-dot hidden';dot.setAttribute('aria-label','Neue Stories');mobile.appendChild(dot);}
    dot.classList.toggle('hidden',!show);
  }
}
async function v0795RefreshStoryIndicator(){
  if(state.v0795StoryIndicatorBusy||state.mode!=='online'||!state.activeCharacterId||typeof db==='undefined'||!db)return;
  state.v0795StoryIndicatorBusy=true;
  try{
    const {data,error}=await db.rpc('story_feed',{p_viewer_character_id:state.activeCharacterId});
    if(error)throw error;
    const fresh=(data||[]).some(s=>s.character_id!==state.activeCharacterId&&!s.viewed);
    v0795SetStoryIndicator(fresh);
  }catch(error){console.warn('[LS Connect v0.7.9.5] Story-Indikator konnte nicht aktualisiert werden.',error);}
  finally{state.v0795StoryIndicatorBusy=false;}
}
if(typeof openStoriesModal==='function'){
  const v0795StoriesBase=openStoriesModal;
  openStoriesModal=async function openStoriesModalV0795(){const result=await v0795StoriesBase.apply(this,arguments);await v0795RefreshStoryIndicator();return result;};
}
if(typeof openStoryViewer==='function'){
  const v0795StoryViewerBase=openStoryViewer;
  openStoryViewer=async function openStoryViewerV0795(){const result=await v0795StoryViewerBase.apply(this,arguments);setTimeout(v0795RefreshStoryIndicator,180);return result;};
}
if(typeof selectCharacter==='function'){
  const v0795SelectCharacterBase=selectCharacter;
  selectCharacter=async function selectCharacterV0795(){const result=await v0795SelectCharacterBase.apply(this,arguments);setTimeout(v0795RefreshStoryIndicator,200);return result;};
}

/* Keep non-admin modals at their normal size. */
if(typeof openModal==='function'){
  const v0795OpenModalBase=openModal;
  openModal=function openModalV0795(title,html){
    const result=v0795OpenModalBase.apply(this,arguments);
    if(!/Administration/i.test(String(title||'')))v0795RemoveAdminResponsive();
    return result;
  };
}

(async function v0795Bootstrap(){
  await v0795LoadAppVersion();
  v0795InstallQuickNavigation();
  v0795RefreshStoryIndicator();
  clearInterval(state.v0795StoryIndicatorTimer);
  state.v0795StoryIndicatorTimer=setInterval(v0795RefreshStoryIndicator,30000);
  const themeObserver=new MutationObserver(()=>v0795SyncNoticeTheme());
  themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class','data-theme','style']});
  themeObserver.observe(document.body,{attributes:true,attributeFilter:['class','data-theme','style']});
})();

const v0795ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v0795ChangelogTarget&&!v0795ChangelogTarget.some(x=>x.version===LS_CONNECT_V0795_VERSION)){
  v0795ChangelogTarget.unshift({version:LS_CONNECT_V0795_VERSION,title:'UI, Filter & mobile Navigation',items:[
    'Hybrid-Statuskarte liest die App-Version dynamisch und trennt App, Backend, API-Vertrag und Desktop-Runtime',
    'Admin-Panel skaliert dynamisch bis zur vollflächigen Mobilansicht',
    'Tickets können nach Priorität und Charaktere nach Typ gefiltert werden',
    'Admin-Hinweise folgen Dark- und Light-Mode',
    'Mobile Schnellzugriffe sind in Kategorien gegliedert und Stories bleiben unabhängig vom Zahnrad erreichbar',
    'Neue Stories erhalten einen einfachen Neu-Indikator ohne Zähler'
  ]});
}
console.info('[LS Connect] v0.7.9.5 quick hybrid collection active');
