/* LS Connect v0.7.10.6 – ticket conversation notifications */
const LS_CONNECT_V07106_VERSION='0.7.10.6';

Object.assign(state,{
  v07106ShownTicketMessages: state.v07106ShownTicketMessages instanceof Set ? state.v07106ShownTicketMessages : new Set(),
  v07106TicketPopupQueue: Array.isArray(state.v07106TicketPopupQueue) ? state.v07106TicketPopupQueue : [],
  v07106TicketPopupVisible:false,
  v07106TicketPollBusy:false,
  v07106TicketPollTimer:null,
  v07106AdminUnread: state.v07106AdminUnread instanceof Map ? state.v07106AdminUnread : new Map(),
  v07106AdminUnreadBusy:false,
  v07106AdminUnreadTimer:null
});

(function v07106InstallStyles(){
  if(document.getElementById('v07106-styles'))return;
  const style=document.createElement('style');style.id='v07106-styles';style.textContent=`
    .v07106-ticket-popup{position:fixed;top:max(14px,env(safe-area-inset-top));right:14px;z-index:1500;width:min(390px,calc(100vw - 28px));padding:14px;border:1px solid color-mix(in srgb,var(--accent) 55%,var(--border));border-radius:16px;background:var(--panel);box-shadow:0 20px 60px rgba(0,0,0,.38);display:grid;gap:10px;animation:v07106In .18s ease-out}
    .v07106-ticket-popup-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.v07106-ticket-popup-title{display:grid;gap:3px;min-width:0}.v07106-ticket-popup-title strong{font-size:.95rem}.v07106-ticket-popup-title small{color:var(--muted)}
    .v07106-ticket-popup-preview{margin:0;color:var(--text);line-height:1.4;overflow-wrap:anywhere}.v07106-ticket-popup-actions{display:flex;justify-content:flex-end;gap:8px}.v07106-ticket-popup-close{border:0;background:transparent;color:var(--muted);font-size:1.15rem;cursor:pointer;padding:0 2px}
    .v07106-admin-unread{display:inline-flex;align-items:center;gap:5px;margin-left:8px;padding:3px 7px;border-radius:999px;background:#ef4444;color:#fff;font-size:.68rem;font-weight:900;line-height:1}.v07106-admin-ticket-new{border-color:color-mix(in srgb,#ef4444 55%,var(--border))!important;box-shadow:0 0 0 1px color-mix(in srgb,#ef4444 16%,transparent)}
    .v07106-admin-ticket-note{display:flex;align-items:center;gap:7px;margin:8px 0;padding:7px 9px;border-radius:10px;background:color-mix(in srgb,#ef4444 10%,var(--panel-2));color:#fca5a5;font-size:.75rem;font-weight:800}
    @keyframes v07106In{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
    @media(max-width:700px){.v07106-ticket-popup{top:auto;bottom:max(76px,calc(env(safe-area-inset-bottom) + 68px));left:10px;right:10px;width:auto}.v07106-ticket-popup-actions .primary-button{flex:1}}
  `;document.head.appendChild(style);
})();

function v07106Escape(value){return typeof escapeHtml==='function'?escapeHtml(String(value??'')):String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function v07106Online(){return typeof state!=='undefined'&&state.mode==='online'&&!!state.activeCharacterId&&typeof db!=='undefined'&&!!db;}
function v07106Preview(value,max=170){const s=String(value||'').trim().replace(/\s+/g,' ');return s.length>max?s.slice(0,max-1)+'…':s;}

async function v07106MarkUserThreadRead(ticketId){
  if(!v07106Online()||!ticketId)return;
  const {error}=await db.rpc('mark_ticket_thread_read_v07106',{p_ticket_id:ticketId,p_character_id:state.activeCharacterId});
  if(error)throw error;
}

async function v07106OpenTicket(ticketId){
  try{
    const loader=typeof v07104LoadMyTickets==='function'?v07104LoadMyTickets:(typeof v076LoadMyTickets==='function'?v076LoadMyTickets:null);
    if(!loader||typeof v0710OpenUserTicketThread!=='function')throw new Error('Ticket-Unterhaltung ist noch nicht bereit.');
    const tickets=await loader();const ticket=(tickets||[]).find(t=>t.id===ticketId);
    if(!ticket)throw new Error('Ticket wurde nicht gefunden.');
    await v0710OpenUserTicketThread(ticket);
  }catch(error){if(typeof v07104Error==='function')v07104Error(error);else console.error('[LS Connect v0.7.10.6]',error);}
}

function v07106ClosePopup(){document.getElementById('v07106TicketPopup')?.remove();state.v07106TicketPopupVisible=false;setTimeout(v07106ShowNextPopup,120);}
function v07106ShowNextPopup(){
  if(state.v07106TicketPopupVisible||!state.v07106TicketPopupQueue.length)return;
  const row=state.v07106TicketPopupQueue.shift();state.v07106TicketPopupVisible=true;
  const popup=document.createElement('aside');popup.id='v07106TicketPopup';popup.className='v07106-ticket-popup';popup.setAttribute('role','status');
  const count=Math.max(1,Number(row.unread_count||1));const preview=v07106Preview(row.latest_body)||'Neue Nachricht in deiner Ticket-Unterhaltung.';
  popup.innerHTML=`<div class="v07106-ticket-popup-head"><div class="v07106-ticket-popup-title"><strong>Neue Ticket-Nachricht</strong><small>${v07106Escape(row.title||'Ticket')}${count>1?` · ${count} neue Nachrichten`:''}</small></div><button class="v07106-ticket-popup-close" type="button" aria-label="Schließen">×</button></div><p class="v07106-ticket-popup-preview">${v07106Escape(preview)}</p><div class="v07106-ticket-popup-actions"><button type="button" class="primary-button" data-v07106-open-ticket>Unterhaltung öffnen</button></div>`;
  document.body.appendChild(popup);
  popup.querySelector('.v07106-ticket-popup-close')?.addEventListener('click',v07106ClosePopup);
  popup.querySelector('[data-v07106-open-ticket]')?.addEventListener('click',async()=>{const btn=popup.querySelector('[data-v07106-open-ticket]');if(btn)btn.disabled=true;await v07106OpenTicket(row.ticket_id);v07106ClosePopup();});
}
function v07106QueueNotification(row){
  const id=row?.latest_message_id;if(!id||state.v07106ShownTicketMessages.has(id))return;
  state.v07106ShownTicketMessages.add(id);state.v07106TicketPopupQueue.push(row);v07106ShowNextPopup();
}

async function v07106PollUserTicketNotifications({silent=true}={}){
  if(!v07106Online()||state.v07106TicketPollBusy)return;
  state.v07106TicketPollBusy=true;
  try{
    const {data,error}=await db.rpc('my_ticket_notifications_v07106',{p_character_id:state.activeCharacterId});if(error)throw error;
    (data||[]).slice().reverse().forEach(v07106QueueNotification);
  }catch(error){if(!silent)console.warn('[LS Connect] Ticket-Benachrichtigungen konnten nicht geladen werden.',error);}
  finally{state.v07106TicketPollBusy=false;}
}

if(typeof v0710OpenUserTicketThread==='function'){
  const v07106UserThreadBase=v0710OpenUserTicketThread;
  v0710OpenUserTicketThread=async function v0710OpenUserTicketThreadV07106(ticket){
    const result=await v07106UserThreadBase.apply(this,arguments);
    if(ticket?.id){try{await v07106MarkUserThreadRead(ticket.id);}catch(error){console.warn('[LS Connect] Ticket konnte nicht als gelesen markiert werden.',error);}}
    return result;
  };
}

function v07106AdminCardId(card){return card?.querySelector?.('[data-ticket-save]')?.dataset?.ticketSave||card?.querySelector?.('[data-ticket-thread]')?.dataset?.ticketThread||null;}
function v07106DecorateAdminUnread(){
  const root=document.getElementById('adminTicketResultsV076');if(!root)return;
  root.querySelectorAll('.admin-ticket-card').forEach(card=>{
    card.classList.remove('v07106-admin-ticket-new');card.querySelector('.v07106-admin-ticket-note')?.remove();
    const id=v07106AdminCardId(card),row=id?state.v07106AdminUnread.get(id):null;if(!row)return;
    card.classList.add('v07106-admin-ticket-new');const note=document.createElement('div');note.className='v07106-admin-ticket-note';note.innerHTML=`<span>●</span><span>Neue Antwort${Number(row.unread_count)>1?` (${Number(row.unread_count)})`:''}</span>`;
    const head=card.querySelector('.ticket-card-head,.admin-ticket-head')||card.firstElementChild;head?.insertAdjacentElement('afterend',note);
  });
  const tab=document.getElementById('adminTicketsTabV076');if(tab){tab.querySelector('.v07106-admin-unread')?.remove();const total=[...state.v07106AdminUnread.values()].reduce((sum,row)=>sum+Number(row.unread_count||0),0);if(total>0){const badge=document.createElement('span');badge.className='v07106-admin-unread';badge.textContent=total>99?'99+':String(total);badge.title=`${total} neue Ticket-Antwort${total===1?'':'en'}`;tab.appendChild(badge);}}
}

async function v07106RefreshAdminUnread({silent=true}={}){
  const root=document.getElementById('adminTicketResultsV076');if(!root||state.v07106AdminUnreadBusy||typeof db==='undefined'||!db)return;
  state.v07106AdminUnreadBusy=true;
  try{const {data,error}=await db.rpc('admin_ticket_unread_v07106');if(error)throw error;state.v07106AdminUnread=new Map((data||[]).map(row=>[row.ticket_id,row]));v07106DecorateAdminUnread();}
  catch(error){if(!silent)console.warn('[LS Connect] Neue Ticket-Antworten konnten nicht geladen werden.',error);}
  finally{state.v07106AdminUnreadBusy=false;}
}
async function v07106MarkAdminThreadRead(ticketId){
  if(!ticketId||typeof db==='undefined'||!db)return;
  const {error}=await db.rpc('admin_mark_ticket_thread_read_v07106',{p_ticket_id:ticketId});if(error)throw error;
  state.v07106AdminUnread.delete(ticketId);v07106DecorateAdminUnread();
}

if(typeof v0710RenderAdminThread==='function'){
  const v07106AdminThreadBase=v0710RenderAdminThread;
  v0710RenderAdminThread=async function v0710RenderAdminThreadV07106(ticket,host){
    const result=await v07106AdminThreadBase.apply(this,arguments);
    if(ticket?.id){try{await v07106MarkAdminThreadRead(ticket.id);}catch(error){console.warn('[LS Connect] Admin-Ticket konnte nicht als gelesen markiert werden.',error);}}
    return result;
  };
}
if(typeof v076RenderAdminTickets==='function'){
  const v07106RenderAdminTicketsBase=v076RenderAdminTickets;
  v076RenderAdminTickets=function v076RenderAdminTicketsV07106(){const result=v07106RenderAdminTicketsBase.apply(this,arguments);queueMicrotask(v07106DecorateAdminUnread);return result;};
}
if(typeof openAdminModal==='function'){
  const v07106AdminModalBase=openAdminModal;
  openAdminModal=async function openAdminModalV07106(){
    const result=await v07106AdminModalBase.apply(this,arguments);
    clearInterval(state.v07106AdminUnreadTimer);setTimeout(()=>v07106RefreshAdminUnread({silent:true}),80);
    state.v07106AdminUnreadTimer=setInterval(()=>{if(document.getElementById('adminTicketResultsV076'))v07106RefreshAdminUnread({silent:true});else clearInterval(state.v07106AdminUnreadTimer);},12000);
    return result;
  };
}

if(typeof selectCharacter==='function'){
  const v07106SelectCharacterBase=selectCharacter;
  selectCharacter=async function selectCharacterV07106(){const result=await v07106SelectCharacterBase.apply(this,arguments);setTimeout(()=>v07106PollUserTicketNotifications({silent:true}),250);return result;};
}

clearInterval(state.v07106TicketPollTimer);
state.v07106TicketPollTimer=setInterval(()=>v07106PollUserTicketNotifications({silent:true}),12000);
setTimeout(()=>v07106PollUserTicketNotifications({silent:true}),1800);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)v07106PollUserTicketNotifications({silent:true});});

const v07106ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v07106ChangelogTarget&&!v07106ChangelogTarget.some(x=>x.version===LS_CONNECT_V07106_VERSION)){
  v07106ChangelogTarget.unshift({version:LS_CONNECT_V07106_VERSION,title:'Ticket-Benachrichtigungen & Antwortstatus',items:[
    'Neue Admin-Nachrichten in Ticket-Unterhaltungen erscheinen als kurzes In-App-Popup',
    'Ein Button im Popup führt direkt in die betroffene Ticket-Unterhaltung',
    'Das Admin-Panel markiert Tickets mit neuen Nutzerantworten samt Anzahl',
    'Admin-Hinweise werden nur innerhalb des geöffneten Admin-Panels aktualisiert',
    'Lesestatus wird pro Nutzer und pro Admin getrennt gespeichert'
  ]});
}
console.info('[LS Connect] v0.7.10.6 ticket notifications active');
