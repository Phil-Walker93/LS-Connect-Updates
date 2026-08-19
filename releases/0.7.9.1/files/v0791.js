/* LS Connect v0.7.9.1 – Admin panel segmented navigation */
const LS_CONNECT_V0791_VERSION = '0.7.9.1';

Object.assign(state, {
  adminSegmentV0791: state.adminSegmentV0791 || 'management'
});

(function v0791InstallStyles(){
  if (document.getElementById('v0791-styles')) return;
  const style = document.createElement('style');
  style.id = 'v0791-styles';
  style.textContent = `
    .v0791-admin-segment-switch{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:4px;
      margin:16px 0 8px;
      padding:4px;
      border:1px solid var(--border);
      border-radius:15px;
      background:color-mix(in srgb,var(--panel-2) 88%,transparent);
    }
    .v0791-admin-segment-button{
      display:flex;
      align-items:center;
      justify-content:center;
      gap:8px;
      min-width:0;
      border:0;
      border-radius:11px;
      padding:10px 12px;
      background:transparent;
      color:var(--muted);
      font:inherit;
      font-weight:800;
      cursor:pointer;
      transition:background .16s ease,color .16s ease,box-shadow .16s ease,transform .16s ease;
    }
    .v0791-admin-segment-button:hover{color:var(--text);background:color-mix(in srgb,var(--panel) 78%,transparent)}
    .v0791-admin-segment-button:active{transform:translateY(1px)}
    .v0791-admin-segment-button.active{
      background:var(--accent);
      color:#06120b;
      box-shadow:0 5px 16px color-mix(in srgb,var(--accent) 26%,transparent);
    }
    .v0791-admin-segment-button .v0791-admin-segment-icon{font-size:1.02rem;line-height:1}
    .admin-tabs.v0791-admin-subtabs{margin-top:8px}
    .admin-tabs .admin-tab.v0791-segment-hidden{display:none!important}
    @media(max-width:620px){
      .v0791-admin-segment-switch{grid-template-columns:1fr;gap:3px}
      .v0791-admin-segment-button{justify-content:flex-start;padding:10px 13px}
      .admin-tabs.v0791-admin-subtabs{overflow-x:auto;scrollbar-width:thin}
      .admin-tabs.v0791-admin-subtabs .admin-tab{min-width:max-content}
    }
  `;
  document.head.appendChild(style);
})();

function v0791AdminRoot(){
  return (typeof els !== 'undefined' && els.modalContent) || document.querySelector('.modal-content');
}

function v0791AdminTabGroups(root){
  const get=id=>root?.querySelector(`#${id}`) || document.getElementById(id);
  return {
    management: [get('adminActiveTab'), get('adminTrashTab')].filter(Boolean),
    operations: [get('adminTicketsTabV076'), get('adminChannelsTabV0773'), get('adminNoticesTabV078')].filter(Boolean)
  };
}

function v0791AdminSegmentForTab(tab, groups){
  if (!tab) return null;
  if (groups.management.includes(tab)) return 'management';
  if (groups.operations.includes(tab)) return 'operations';
  return null;
}

function v0791ApplyAdminSegment(segment, {activateFallback=true}={}){
  const root = v0791AdminRoot();
  const tabs = root?.querySelector('.admin-tabs');
  const switcher = root?.querySelector('#v0791AdminSegmentSwitch');
  if (!root || !tabs || !switcher) return;

  const groups = v0791AdminTabGroups(root);
  const normalized = segment === 'operations' ? 'operations' : 'management';
  state.adminSegmentV0791 = normalized;

  switcher.querySelectorAll('[data-v0791-admin-segment]').forEach(button=>{
    const active = button.dataset.v0791AdminSegment === normalized;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
    button.tabIndex = active ? 0 : -1;
  });

  for (const [group, buttons] of Object.entries(groups)) {
    buttons.forEach(button=>button.classList.toggle('v0791-segment-hidden', group !== normalized));
  }

  const current = tabs.querySelector('.admin-tab.active');
  const currentSegment = v0791AdminSegmentForTab(current, groups);
  if (activateFallback && currentSegment !== normalized) {
    const fallback = groups[normalized][0];
    if (fallback) queueMicrotask(()=>fallback.click());
  }
}

function v0791InstallAdminSegments(){
  const root = v0791AdminRoot();
  const tabs = root?.querySelector('.admin-tabs');
  if (!root || !tabs) return;
  tabs.classList.add('v0791-admin-subtabs');

  let switcher = root.querySelector('#v0791AdminSegmentSwitch');
  if (!switcher) {
    switcher = document.createElement('div');
    switcher.id = 'v0791AdminSegmentSwitch';
    switcher.className = 'v0791-admin-segment-switch';
    switcher.setAttribute('role','tablist');
    switcher.setAttribute('aria-label','Admin-Bereich wechseln');
    switcher.innerHTML = `
      <button type="button" class="v0791-admin-segment-button" data-v0791-admin-segment="management" role="tab" aria-selected="false">
        <span class="v0791-admin-segment-icon">⚙</span><span>Verwaltung</span>
      </button>
      <button type="button" class="v0791-admin-segment-button" data-v0791-admin-segment="operations" role="tab" aria-selected="false">
        <span class="v0791-admin-segment-icon">◆</span><span>System & Moderation</span>
      </button>`;
    tabs.parentElement.insertBefore(switcher, tabs);

    switcher.querySelectorAll('[data-v0791-admin-segment]').forEach(button=>{
      button.addEventListener('click',()=>v0791ApplyAdminSegment(button.dataset.v0791AdminSegment));
      button.addEventListener('keydown',event=>{
        if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        const next = button.dataset.v0791AdminSegment === 'management' ? 'operations' : 'management';
        const nextButton = switcher.querySelector(`[data-v0791-admin-segment="${next}"]`);
        nextButton?.focus();
        v0791ApplyAdminSegment(next);
      });
    });
  }

  const groups = v0791AdminTabGroups(root);
  [...groups.management, ...groups.operations].forEach(tab=>{
    if (tab.dataset.v0791SegmentBound === '1') return;
    tab.dataset.v0791SegmentBound = '1';
    tab.addEventListener('click',()=>{
      const segment = v0791AdminSegmentForTab(tab, v0791AdminTabGroups(root));
      if (segment && state.adminSegmentV0791 !== segment) v0791ApplyAdminSegment(segment,{activateFallback:false});
    }, true);
  });

  const active = tabs.querySelector('.admin-tab.active');
  const activeSegment = v0791AdminSegmentForTab(active, groups);
  const preferred = activeSegment || state.adminSegmentV0791 || 'management';
  v0791ApplyAdminSegment(preferred);
}

if (typeof openAdminModal === 'function') {
  const v0791AdminBase = openAdminModal;
  openAdminModal = async function openAdminModalV0791(){
    const result = await v0791AdminBase.apply(this, arguments);
    v0791InstallAdminSegments();
    setTimeout(v0791InstallAdminSegments, 0);
    return result;
  };
}

if (typeof V07_LOCAL_CHANGELOG !== 'undefined' && !V07_LOCAL_CHANGELOG.some(x=>x.version===LS_CONNECT_V0791_VERSION)) {
  V07_LOCAL_CHANGELOG.unshift({
    version:LS_CONNECT_V0791_VERSION,
    title:'Admin-Panel neu strukturiert',
    items:[
      'Administration und Papierkorb sind im Segment Verwaltung gebündelt',
      'Tickets, Kanäle und Hinweise sind im Segment System & Moderation gebündelt',
      'Neuer Segment-Switch reduziert die sichtbaren Admin-Tabs und verbessert die Übersicht',
      'Desktop/BAT und Online verwenden dieselbe v0.7.9.1-Oberfläche'
    ]
  });
}

console.info('[LS Connect] v0.7.9.1 admin segmentation active');
