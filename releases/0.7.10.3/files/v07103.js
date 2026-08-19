/* LS Connect v0.7.10.3 – call forwarding visibility hotfix */
const LS_CONNECT_V07103_VERSION='0.7.10.3';

(function v07103InstallStyles(){
  if(document.getElementById('v07103-styles'))return;
  const style=document.createElement('style');style.id='v07103-styles';style.textContent=`
    .v07103-forwarding-card{display:grid;gap:12px}
    .v07103-forwarding-state{padding:10px 12px;border:1px solid var(--border);border-radius:12px;background:var(--panel-2)}
    .v07103-forwarding-state.active{border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
    .v07103-forwarding-note{color:var(--muted);font-size:.78rem;line-height:1.45}
    .v07103-forwarding-form{display:grid;gap:10px}
    .v07103-forwarding-form label{display:grid;gap:6px}
    .v07103-forwarding-form .inline-check{display:flex;align-items:center;gap:8px}
    .v07103-forwarding-form input[type="text"]{width:100%;box-sizing:border-box;border:1px solid var(--border);border-radius:11px;background:var(--panel-2);color:var(--text);padding:10px 11px;font:inherit}
    .v07103-forwarding-form input[type="text"]:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 18%,transparent)}
    #v07103ForwardingButton{width:100%;display:flex;align-items:center;justify-content:flex-start;gap:10px;text-align:left}
    #v07103AccountForwardingShortcut{display:grid;gap:9px}
  `;document.head.appendChild(style);
})();

function v07103Escape(value){return typeof escapeHtml==='function'?escapeHtml(String(value??'')):String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function v07103Toast(message,type='info'){if(typeof showToast==='function')showToast(message,type);else console.info('[LS Connect]',message);}
function v07103Error(error){console.error('[LS Connect v0.7.10.3]',error);if(typeof throwWithToast==='function')return throwWithToast(error);v07103Toast(error?.message||'Unbekannter Fehler','error');}
function v07103CanUse(){return typeof state!=='undefined'&&state.mode==='online'&&!!state.activeCharacterId&&typeof db!=='undefined'&&!!db;}

async function v07103LoadForwarding(){
  if(!v07103CanUse())return null;
  const {data,error}=await db.rpc('my_call_forwarding_v0710',{p_character_id:state.activeCharacterId});
  if(error)throw error;
  const current=(data||[])[0]||null;
  state.v0710Forwarding=current;
  return current;
}

async function v07103OpenForwardingModal(){
  if(!v07103CanUse()){
    v07103Toast('Wähle zuerst einen aktiven Online-Charakter aus.','info');
    return;
  }
  try{
    const current=await v07103LoadForwarding();
    const stateHtml=current?.enabled
      ? `<div class="v07103-forwarding-state active"><strong>Weiterleitung aktiv</strong><br>${v07103Escape(current.target_name||'Ziel')} · ${v07103Escape(current.target_phone||'')}</div>`
      : '<div class="v07103-forwarding-state">Derzeit keine Rufnummernweiterleitung aktiv.</div>';
    const html=`<section class="settings-block v07103-forwarding-card">
      <h3>Rufnummernweiterleitung</h3>
      <p class="notification-note">Leite eingehende LS-Connect-Anrufe dieser RP-Nummer an eine andere aktive RP-Telefonnummer weiter.</p>
      ${stateHtml}
      <form id="v07103ForwardingForm" class="v07103-forwarding-form">
        <label class="inline-check"><input id="v07103ForwardingEnabled" type="checkbox" ${current?.enabled?'checked':''}> Weiterleitung aktivieren</label>
        <label>Zielnummer<input id="v07103ForwardingPhone" type="text" maxlength="30" value="${v07103Escape(current?.target_phone||'')}" placeholder="z. B. 555-0123" autocomplete="off"></label>
        <button class="primary-button" type="submit">Weiterleitung speichern</button>
      </form>
      <p class="v07103-forwarding-note">Das ursprüngliche Anrufziel bleibt erhalten. Beim weitergeleiteten Anruf kann weiterhin erkannt werden, welche LS-Connect-Rufnummer ursprünglich angerufen wurde.</p>
    </section>`;
    if(typeof openModal!=='function')throw new Error('Dialogsystem nicht verfügbar.');
    openModal('Rufnummernweiterleitung',html);
    const enabled=document.getElementById('v07103ForwardingEnabled');
    const phone=document.getElementById('v07103ForwardingPhone');
    const sync=()=>{if(phone)phone.disabled=!enabled?.checked;};
    enabled?.addEventListener('change',sync);sync();
    document.getElementById('v07103ForwardingForm')?.addEventListener('submit',async event=>{
      event.preventDefault();
      const button=event.currentTarget.querySelector('button[type="submit"]');
      const on=!!enabled?.checked,target=String(phone?.value||'').trim();
      if(on&&!target){v07103Toast('Bitte eine Zielnummer eingeben.','error');phone?.focus();return;}
      if(button)button.disabled=true;
      try{
        const {error}=await db.rpc('set_call_forwarding_v0710',{p_character_id:state.activeCharacterId,p_target_phone:target,p_enabled:on});
        if(error)throw error;
        v07103Toast(on?'Rufnummernweiterleitung aktiviert.':'Rufnummernweiterleitung deaktiviert.','success');
        await v07103OpenForwardingModal();
      }catch(error){v07103Error(error);}
      finally{if(button)button.disabled=false;}
    });
  }catch(error){v07103Error(error);}
}

function v07103FindCommunicationGroup(){
  const actions=document.querySelector('.sidebar-actions');if(!actions)return null;
  const groups=[...actions.querySelectorAll('.v0795-quick-group')];
  return groups.find(group=>/kommunikation/i.test(group.querySelector('.v0795-quick-group-title')?.textContent||''))||groups[0]||actions;
}

function v07103InstallForwardingButton(){
  if(document.getElementById('v07103ForwardingButton'))return;
  const host=v07103FindCommunicationGroup();if(!host)return;
  const button=document.createElement('button');button.id='v07103ForwardingButton';button.type='button';button.className='ghost-button';
  button.innerHTML='<span class="v0795-quick-icon" aria-hidden="true">↪</span><span>Rufnummernweiterleitung</span>';
  button.addEventListener('click',v07103OpenForwardingModal);
  host.appendChild(button);
}

function v07103InstallAccountShortcut(){
  if(typeof els==='undefined'||!els.modalContent||document.getElementById('v07103AccountForwardingShortcut'))return;
  const section=document.createElement('section');section.id='v07103AccountForwardingShortcut';section.className='settings-block';
  section.innerHTML='<h3>Telefon</h3><p class="notification-note">Eingehende Anrufe dieser RP-Nummer an eine andere LS-Connect-Rufnummer weiterleiten.</p><button id="v07103AccountForwardingOpen" class="small-button primary" type="button">Rufnummernweiterleitung öffnen</button>';
  const runtime=document.getElementById('v079RuntimeCard');
  if(runtime)els.modalContent.insertBefore(section,runtime);else els.modalContent.appendChild(section);
  document.getElementById('v07103AccountForwardingOpen')?.addEventListener('click',v07103OpenForwardingModal);
}

if(typeof openAccountModal==='function'){
  const v07103AccountBase=openAccountModal;
  openAccountModal=async function openAccountModalV07103(){
    const result=await v07103AccountBase.apply(this,arguments);
    queueMicrotask(v07103InstallAccountShortcut);
    setTimeout(v07103InstallAccountShortcut,80);
    return result;
  };
}

if(typeof v0795InstallQuickNavigation==='function'){
  const v07103QuickBase=v0795InstallQuickNavigation;
  v0795InstallQuickNavigation=function v0795InstallQuickNavigationV07103(){const result=v07103QuickBase.apply(this,arguments);queueMicrotask(v07103InstallForwardingButton);return result;};
}

setTimeout(v07103InstallForwardingButton,0);
setTimeout(v07103InstallForwardingButton,400);
setTimeout(v07103InstallForwardingButton,1400);

const v07103ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v07103ChangelogTarget&&!v07103ChangelogTarget.some(x=>x.version===LS_CONNECT_V07103_VERSION)){
  v07103ChangelogTarget.unshift({version:LS_CONNECT_V07103_VERSION,title:'Rufnummernweiterleitung sichtbar gemacht',items:[
    'Rufnummernweiterleitung ist als eigener Punkt unter Mehr erreichbar',
    'Eigener Dialog zum Aktivieren, Deaktivieren und Ändern der Zielnummer',
    'Konto & Verbindung erhält zusätzlich einen direkten Telefon-Shortcut',
    'Der Dialog verwendet die bestehenden abgesicherten v0.7.10-Backendfunktionen'
  ]});
}
console.info('[LS Connect] v0.7.10.3 call forwarding visibility hotfix active');
