/* LS Connect v0.7.10 – moderation, ticket threads, criminal orgs & call forwarding */
const LS_CONNECT_V0710_VERSION = '0.7.10';

Object.assign(state, {
  v0710TicketThreadBusy: false,
  v0710Forwarding: null
});

(function v0710InstallStyles(){
  if(document.getElementById('v0710-styles')) return;
  const style=document.createElement('style');
  style.id='v0710-styles';
  style.textContent=`
    .v0710-thread{display:grid;gap:9px;margin-top:12px;padding:11px;border:1px solid var(--border);border-radius:13px;background:var(--panel-2)}
    .v0710-thread-list{display:grid;gap:8px;max-height:340px;overflow:auto;padding-right:2px}
    .v0710-thread-msg{max-width:88%;padding:9px 11px;border:1px solid var(--border);border-radius:12px;background:var(--panel);display:grid;gap:3px}
    .v0710-thread-msg.admin{justify-self:start;border-top-left-radius:5px}
    .v0710-thread-msg.reporter{justify-self:end;border-top-right-radius:5px;background:color-mix(in srgb,var(--accent) 10%,var(--panel))}
    .v0710-thread-msg small{color:var(--muted);font-size:.72rem}.v0710-thread-msg p{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
    .v0710-thread-form{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end}
    .v0710-thread-form textarea{min-height:58px;max-height:140px;resize:vertical}
    .v0710-ticket-thread-toggle{margin-left:auto}
    .v0710-notice-admin-actions{display:flex;gap:7px;align-items:center;flex-wrap:wrap}
    .v0710-forwarding-card{display:grid;gap:10px}.v0710-forwarding-state{padding:9px 11px;border:1px solid var(--border);border-radius:11px;background:var(--panel-2)}
    .v0710-forwarded-call-note{margin-top:9px;padding:8px 10px;border:1px solid var(--border);border-radius:10px;color:var(--muted);font-size:.8rem;background:var(--panel-2)}
    .v0710-criminal-note{margin-top:6px;color:var(--muted);font-size:.76rem}
    @media(max-width:700px){.v0710-thread-form{grid-template-columns:1fr}.v0710-thread-form button{width:100%}.v0710-thread-msg{max-width:96%}.v0710-notice-admin-actions{width:100%}.v0710-notice-admin-actions button{flex:1}}
  `;
  document.head.appendChild(style);
})();

function v0710Escape(value){
  return typeof escapeHtml==='function' ? escapeHtml(String(value??'')) : String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function v0710Toast(message,type='info'){ if(typeof showToast==='function') showToast(message,type); else console.info('[LS Connect]',message); }
function v0710Error(error){ if(typeof throwWithToast==='function') return throwWithToast(error); console.error(error); v0710Toast(error?.message||'Unbekannter Fehler','error'); }
function v0710FormatDate(value){ try{return new Date(value).toLocaleString('de-DE');}catch{return String(value||'');} }

/* ---- Character type: Kriminelle Organisation ----------------------------------------------- */
function v0710EnsureCriminalTypeOption(){
  ['characterType','editCharacterType'].forEach(id=>{
    const select=document.getElementById(id);if(!select)return;
    if(![...select.options].some(o=>o.value==='Kriminelle Organisation'||o.textContent==='Kriminelle Organisation')){
      const option=document.createElement('option');option.value='Kriminelle Organisation';option.textContent='Kriminelle Organisation';select.appendChild(option);
    }
    if(!select.parentElement?.querySelector('.v0710-criminal-note')){
      const note=document.createElement('small');note.className='v0710-criminal-note';note.textContent='Kriminelle Organisationen sind in der normalen Kontaktsuche verborgen und können Kontaktanfragen nur selbst initiieren.';select.parentElement?.appendChild(note);
    }
  });
}
if(typeof openCharacterModal==='function'){
  const v0710CharacterCreateBase=openCharacterModal;
  openCharacterModal=function openCharacterModalV0710(){const result=v0710CharacterCreateBase.apply(this,arguments);v0710EnsureCriminalTypeOption();return result;};
}
if(typeof openEditCharacterModal==='function'){
  const v0710CharacterEditBase=openEditCharacterModal;
  openEditCharacterModal=function openEditCharacterModalV0710(ch){const result=v0710CharacterEditBase.apply(this,arguments);v0710EnsureCriminalTypeOption();const select=document.getElementById('editCharacterType');if(select&&ch?.account_type==='Kriminelle Organisation')select.value='Kriminelle Organisation';return result;};
}

/* ---- Ticket conversation ------------------------------------------------------------------- */
async function v0710TicketMessages(ticketId, characterId=null){
  const {data,error}=await db.rpc('ticket_messages_v0710',{p_ticket_id:ticketId,p_character_id:characterId});
  if(error)throw error;return data||[];
}
function v0710ThreadMessagesHtml(messages){
  return messages.length?`<div class="v0710-thread-list">${messages.map(m=>`<article class="v0710-thread-msg ${m.sender_role==='admin'?'admin':'reporter'}"><small>${v0710Escape(m.sender_name|| (m.sender_role==='admin'?'Administration':'Charakter'))} · ${v0710FormatDate(m.created_at)}</small><p>${v0710Escape(m.body)}</p></article>`).join('')}</div>`:'<p class="notification-note">Die Administration hat für dieses Ticket noch keine Unterhaltung gestartet.</p>';
}
async function v0710OpenUserTicketThread(ticket){
  try{
    const messages=await v0710TicketMessages(ticket.id,state.activeCharacterId);
    const canWrite=ticket.status!=='completed'&&messages.length>0;
    openModal(`Ticket · ${ticket.title}`,`<section class="settings-block"><div class="ticket-card-head"><div><strong>${v0710Escape(ticket.title)}</strong><small>${v0710Escape(typeof v076CategoryLabel==='function'?v076CategoryLabel(ticket.category):ticket.category)} · ${v0710Escape(typeof v076StatusLabel==='function'?v076StatusLabel(ticket.status):ticket.status)}</small></div></div><p>${v0710Escape(ticket.description)}</p></section><section class="settings-block"><h3>Unterhaltung mit der Administration</h3><div id="v0710UserTicketThread" class="v0710-thread">${v0710ThreadMessagesHtml(messages)}${canWrite?`<form id="v0710UserTicketForm" class="v0710-thread-form"><textarea id="v0710UserTicketBody" maxlength="4000" required placeholder="Antwort schreiben…"></textarea><button class="primary-button" type="submit">Senden</button></form>`:ticket.status==='completed'?'<p class="notification-note">Dieses Ticket ist abgeschlossen. Die Unterhaltung ist schreibgeschützt.</p>':''}</div></section><button id="v0710BackToTickets" class="ghost-button wide" type="button">Zurück zu meinen Tickets</button>`);
    document.getElementById('v0710BackToTickets')?.addEventListener('click',()=>openFeedbackCenterV076());
    document.getElementById('v0710UserTicketForm')?.addEventListener('submit',async e=>{
      e.preventDefault();const btn=e.currentTarget.querySelector('button'),body=document.getElementById('v0710UserTicketBody').value.trim();if(!body)return;
      btn.disabled=true;try{const {error}=await db.rpc('send_ticket_message_v0710',{p_ticket_id:ticket.id,p_character_id:state.activeCharacterId,p_body:body});if(error)throw error;await v0710OpenUserTicketThread(ticket);}catch(error){v0710Error(error);}finally{btn.disabled=false;}
    });
  }catch(error){v0710Error(error);}
}
async function v0710EnhanceUserTicketCenter(){
  if(state.mode!=='online'||!state.activeCharacterId)return;
  try{
    const tickets=await v076LoadMyTickets();
    const cards=[...document.querySelectorAll('.ticket-list .ticket-card')];
    cards.forEach((card,index)=>{
      const ticket=tickets[index];if(!ticket||card.querySelector('[data-v0710-user-thread]'))return;
      const footer=document.createElement('div');footer.className='ticket-footer';footer.innerHTML=`<button type="button" class="small-button" data-v0710-user-thread="${ticket.id}">Unterhaltung${ticket.status==='completed'?' ansehen':''}</button>`;card.appendChild(footer);
      footer.querySelector('button')?.addEventListener('click',()=>v0710OpenUserTicketThread(ticket));
    });
  }catch(error){console.warn('[LS Connect] Ticket-Unterhaltungen konnten nicht ergänzt werden.',error);}
}
if(typeof openFeedbackCenterV076==='function'){
  const v0710FeedbackCenterBase=openFeedbackCenterV076;
  openFeedbackCenterV076=async function openFeedbackCenterV0710(){const result=await v0710FeedbackCenterBase.apply(this,arguments);await v0710EnhanceUserTicketCenter();return result;};
}

async function v0710RenderAdminThread(ticket,host){
  if(!host)return;
  try{
    const messages=await v0710TicketMessages(ticket.id,null);
    const canWrite=ticket.status!=='completed';
    host.innerHTML=`${v0710ThreadMessagesHtml(messages)}${canWrite?messages.length?`<form class="v0710-thread-form" data-v0710-admin-send="${ticket.id}"><textarea maxlength="4000" required placeholder="Antwort an Ticket-Ersteller…"></textarea><button class="primary-button" type="submit">Senden</button></form>`:`<form class="v0710-thread-form" data-v0710-admin-start="${ticket.id}"><textarea maxlength="4000" required placeholder="Erste Nachricht – startet die Unterhaltung…"></textarea><button class="primary-button" type="submit">Unterhaltung starten</button></form>`:'<p class="notification-note">Ticket abgeschlossen – Unterhaltung schreibgeschützt.</p>'}`;
    host.querySelector('[data-v0710-admin-start]')?.addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget,btn=form.querySelector('button'),body=form.querySelector('textarea').value.trim();if(!body)return;btn.disabled=true;try{const {error}=await db.rpc('admin_start_ticket_conversation_v0710',{p_ticket_id:ticket.id,p_body:body});if(error)throw error;await v0710RenderAdminThread(ticket,host);}catch(error){v0710Error(error);}finally{btn.disabled=false;}});
    host.querySelector('[data-v0710-admin-send]')?.addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget,btn=form.querySelector('button'),body=form.querySelector('textarea').value.trim();if(!body)return;btn.disabled=true;try{const {error}=await db.rpc('send_ticket_message_v0710',{p_ticket_id:ticket.id,p_character_id:null,p_body:body});if(error)throw error;await v0710RenderAdminThread(ticket,host);}catch(error){v0710Error(error);}finally{btn.disabled=false;}});
  }catch(error){host.innerHTML=`<p class="notification-note">${v0710Escape(error?.message||'Unterhaltung konnte nicht geladen werden.')}</p>`;}
}
function v0710EnhanceAdminTickets(tickets){
  const box=document.getElementById('adminTicketResultsV076');if(!box)return;
  const cards=[...box.querySelectorAll('.admin-ticket-card')];
  cards.forEach((card,index)=>{
    const ticket=tickets[index];if(!ticket||card.querySelector('[data-v0710-admin-thread-toggle]'))return;
    let footer=card.querySelector('.ticket-footer');if(!footer){footer=document.createElement('div');footer.className='ticket-footer';card.appendChild(footer);}
    const button=document.createElement('button');button.type='button';button.className='small-button v0710-ticket-thread-toggle';button.dataset.v0710AdminThreadToggle=ticket.id;button.textContent='Unterhaltung';footer.appendChild(button);
    const thread=document.createElement('div');thread.className='v0710-thread hidden';thread.dataset.v0710AdminThread=ticket.id;card.appendChild(thread);
    button.addEventListener('click',async()=>{const hidden=thread.classList.toggle('hidden');if(!hidden)await v0710RenderAdminThread(ticket,thread);});
  });
}
if(typeof v076RenderAdminTickets==='function'){
  const v0710AdminTicketRenderBase=v076RenderAdminTickets;
  v076RenderAdminTickets=function v076RenderAdminTicketsV0710(tickets){const result=v0710AdminTicketRenderBase.apply(this,arguments);queueMicrotask(()=>v0710EnhanceAdminTickets(tickets||[]));return result;};
}

/* ---- Notice deletion ------------------------------------------------------------------------ */
function v0710EnhanceAdminNoticeList(){
  const box=document.getElementById('adminNoticeListV078');if(!box)return;
  box.querySelectorAll('[data-v078-notice-toggle]').forEach(toggle=>{
    const id=toggle.dataset.v078NoticeToggle,row=toggle.closest('.v078-notice-row');if(!row||row.querySelector(`[data-v0710-notice-delete="${id}"]`))return;
    const actions=document.createElement('div');actions.className='v0710-notice-admin-actions';toggle.parentElement?.insertBefore(actions,toggle);actions.appendChild(toggle);
    const del=document.createElement('button');del.type='button';del.className='small-button danger';del.dataset.v0710NoticeDelete=id;del.textContent='Löschen';actions.appendChild(del);
    del.addEventListener('click',async()=>{if(!confirm('Diesen Hinweis endgültig für alle Empfänger löschen?'))return;del.disabled=true;try{const {error}=await db.rpc('admin_delete_notice_v0710',{p_notice_id:id});if(error)throw error;v0710Toast('Hinweis gelöscht.','success');await v078AdminLoadNotices();}catch(error){v0710Error(error);}finally{del.disabled=false;}});
  });
}
if(typeof v078AdminLoadNotices==='function'){
  const v0710AdminNoticesBase=v078AdminLoadNotices;
  v078AdminLoadNotices=async function v078AdminLoadNoticesV0710(){const result=await v0710AdminNoticesBase.apply(this,arguments);v0710EnhanceAdminNoticeList();return result;};
}
if(typeof v078ShowNextNotice==='function'){
  const v0710ShowNoticeBase=v078ShowNextNotice;
  v078ShowNextNotice=function v078ShowNextNoticeV0710(){const notice=state.activeNoticesV078?.[0];const result=v0710ShowNoticeBase.apply(this,arguments);if(!notice||notice.requires_ack)return result;const actions=document.querySelector('#v078NoticeOverlay .v078-notice-actions');if(!actions||actions.querySelector('#v0710NoticeDismiss'))return result;const btn=document.createElement('button');btn.id='v0710NoticeDismiss';btn.type='button';btn.className='small-button';btn.textContent='Für diesen Charakter ausblenden';actions.insertBefore(btn,actions.firstChild);btn.addEventListener('click',async()=>{btn.disabled=true;try{const {error}=await db.rpc('dismiss_admin_notice_v0710',{p_notice_id:notice.id,p_character_id:state.activeCharacterId});if(error)throw error;if(typeof v078NoticeOverlayRemove==='function')v078NoticeOverlayRemove();await v078PollNotices({silent:true});}catch(error){v0710Error(error);}finally{btn.disabled=false;}});return result;};
}

/* ---- Call forwarding ------------------------------------------------------------------------ */
async function v0710LoadForwarding(){
  if(state.mode!=='online'||!state.activeCharacterId)return null;
  const {data,error}=await db.rpc('my_call_forwarding_v0710',{p_character_id:state.activeCharacterId});if(error)throw error;state.v0710Forwarding=(data||[])[0]||null;return state.v0710Forwarding;
}
async function v0710InjectCallForwarding(){
  if(state.mode!=='online'||!state.activeCharacterId||typeof els==='undefined'||!els.modalContent)return;
  try{
    const current=await v0710LoadForwarding();
    document.getElementById('v0710CallForwardingBlock')?.remove();
    const block=document.createElement('section');block.id='v0710CallForwardingBlock';block.className='settings-block v0710-forwarding-card';
    block.innerHTML=`<h3>Rufnummernweiterleitung</h3><p class="notification-note">Leite eingehende LS-Connect-Anrufe dieser RP-Nummer an eine andere aktive RP-Telefonnummer weiter.</p>${current?.enabled?`<div class="v0710-forwarding-state"><strong>Aktiv</strong> → ${v0710Escape(current.target_name||'Ziel')} · ${v0710Escape(current.target_phone||'')}</div>`:'<div class="v0710-forwarding-state">Derzeit keine Weiterleitung aktiv.</div>'}<form id="v0710ForwardingForm" class="stack-form"><label class="inline-check"><input id="v0710ForwardingEnabled" type="checkbox" ${current?.enabled?'checked':''}> Weiterleitung aktivieren</label><label>Zielnummer<input id="v0710ForwardingPhone" maxlength="30" value="${v0710Escape(current?.target_phone||'')}" placeholder="z. B. 555-0123"></label><button class="small-button primary" type="submit">Weiterleitung speichern</button></form>`;
    const runtime=document.getElementById('v079RuntimeCard');if(runtime)els.modalContent.insertBefore(block,runtime);else els.modalContent.appendChild(block);
    const enabled=document.getElementById('v0710ForwardingEnabled'),phone=document.getElementById('v0710ForwardingPhone');
    const sync=()=>{phone.disabled=!enabled.checked;};enabled.addEventListener('change',sync);sync();
    document.getElementById('v0710ForwardingForm').addEventListener('submit',async e=>{e.preventDefault();const btn=e.currentTarget.querySelector('button'),on=enabled.checked,target=phone.value.trim();if(on&&!target)return v0710Toast('Bitte eine Zielnummer eingeben.','error');btn.disabled=true;try{const {error}=await db.rpc('set_call_forwarding_v0710',{p_character_id:state.activeCharacterId,p_target_phone:target,p_enabled:on});if(error)throw error;v0710Toast(on?'Rufnummernweiterleitung aktiviert.':'Rufnummernweiterleitung deaktiviert.','success');await v0710InjectCallForwarding();}catch(error){v0710Error(error);}finally{btn.disabled=false;}});
  }catch(error){console.warn('[LS Connect] Rufnummernweiterleitung konnte nicht geladen werden.',error);}
}
if(typeof openAccountModal==='function'){
  const v0710AccountBase=openAccountModal;
  openAccountModal=async function openAccountModalV0710(){const result=await v0710AccountBase.apply(this,arguments);await v0710InjectCallForwarding();return result;};
}
if(typeof showCallModal==='function'){
  const v0710CallModalBase=showCallModal;
  showCallModal=async function showCallModalV0710(call,incoming){const result=await v0710CallModalBase.apply(this,arguments);if(incoming&&call?.original_callee_character_id&&call.original_callee_character_id!==call.callee_character_id){const modal=document.querySelector('.call-modal,.call-card,#callModal');if(modal&&!modal.querySelector('.v0710-forwarded-call-note')){const note=document.createElement('div');note.className='v0710-forwarded-call-note';note.textContent='Dieser Anruf wurde von einer anderen LS-Connect-Rufnummer an dich weitergeleitet.';modal.appendChild(note);}}return result;};
}

/* local changelog */
const v0710ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v0710ChangelogTarget&&!v0710ChangelogTarget.some(x=>x.version===LS_CONNECT_V0710_VERSION)){
  v0710ChangelogTarget.unshift({version:LS_CONNECT_V0710_VERSION,title:'Kommunikation & Moderation',items:[
    'Neuer Charaktertyp Kriminelle Organisation mit eingeschränkter Kontaktaufnahme',
    'Ticket-Unterhaltungen zwischen Administration und Ticket-Ersteller',
    'Admin-Hinweise können global gelöscht oder pro Charakter ausgeblendet werden',
    'Eigene Charaktere desselben Master-Accounts können normal miteinander kommunizieren',
    'Neue Rufnummernweiterleitung für eingehende LS-Connect-Anrufe',
    'Story-Neu-Anzeige verwendet weiterhin den charakterbezogenen Gesehen-Status'
  ]});
}

console.info('[LS Connect] v0.7.10 communication & moderation active');
