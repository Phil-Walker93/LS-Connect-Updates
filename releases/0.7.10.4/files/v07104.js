/* LS Connect v0.7.10.4 – ticket media, unread sync, story sizing & chat favorites */
const LS_CONNECT_V07104_VERSION='0.7.10.4';

Object.assign(state,{
  v07104ConversationFavorites: state.v07104ConversationFavorites instanceof Set ? state.v07104ConversationFavorites : new Set(),
  v07104TicketMediaCache: state.v07104TicketMediaCache instanceof Map ? state.v07104TicketMediaCache : new Map()
});

(function v07104InstallStyles(){
  if(document.getElementById('v07104-styles'))return;
  const style=document.createElement('style');style.id='v07104-styles';style.textContent=`
    /* Story viewer: the legacy viewer emits a direct <img> without .story-media. */
    .story-viewer>img{
      display:block;width:auto;max-width:100%;height:auto;max-height:min(56vh,680px);object-fit:contain;
      margin:0 auto;border-radius:14px;background:var(--panel-2)
    }
    .v07104-ticket-image-wrap{display:grid;gap:6px;margin:10px 0}
    .v07104-ticket-image{
      display:block;width:auto;max-width:100%;height:auto;max-height:360px;object-fit:contain;
      border:1px solid var(--border);border-radius:12px;background:var(--panel-2);margin:0 auto
    }
    .v07104-ticket-image-meta{color:var(--muted);font-size:.72rem;text-align:center}
    .v07104-ticket-file-row{display:grid;gap:5px}
    .v07104-ticket-file-row input[type="file"]{width:100%;box-sizing:border-box}
    .v07104-ticket-file-name{color:var(--muted);font-size:.72rem;overflow-wrap:anywhere}
    .v07104-thread-compose{display:grid;gap:7px}
    .v07104-chat-favorite{font-size:.9rem;color:#fbbf24;line-height:1;margin-left:5px;flex:0 0 auto}
    .v07104-favorite-block{display:grid;gap:9px}
    .v07104-favorite-state{display:flex;align-items:center;gap:8px;padding:9px 10px;border:1px solid var(--border);border-radius:11px;background:var(--panel-2)}
    @media(max-width:700px){
      .story-viewer>img{max-width:100%;max-height:46dvh;object-fit:contain}
      .v07104-ticket-image{width:100%;max-height:40dvh}
      .v07104-thread-compose .primary-button{width:100%}
    }
  `;document.head.appendChild(style);
})();

function v07104Escape(value){return typeof escapeHtml==='function'?escapeHtml(String(value??'')):String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function v07104Toast(message,type='info'){if(typeof showToast==='function')showToast(message,type);else console.info('[LS Connect]',message);}
function v07104Error(error){if(typeof throwWithToast==='function')return throwWithToast(error);console.error('[LS Connect v0.7.10.4]',error);v07104Toast(error?.message||'Unbekannter Fehler','error');}
function v07104Mime(file){return typeof v077MimeFromFile==='function'?v077MimeFromFile(file):String(file?.type||'').toLowerCase().split(';')[0];}
function v07104SafeName(name){return typeof safeFileName==='function'?safeFileName(name):String(name||'bild').replace(/[^a-zA-Z0-9._-]+/g,'-').slice(0,120);}
function v07104ValidateTicketImage(file){
  if(!file)return null;
  if(typeof v077ValidateImage==='function')return v077ValidateImage(file,8*1024*1024,'Ticketbild');
  const mime=v07104Mime(file);if(!['image/jpeg','image/png','image/webp','image/gif'].includes(mime))throw new Error('Ticketbild: Nur JPG, PNG, WEBP oder GIF sind erlaubt.');
  if(file.size>8*1024*1024)throw new Error('Ticketbild darf maximal 8 MB groß sein.');return mime;
}
async function v07104VerifyTicketMedia(path){
  if(typeof v077VerifyStorageRead==='function')return v077VerifyStorageRead('ls-ticket-media',path);
  const {data,error}=await db.storage.from('ls-ticket-media').createSignedUrl(path,120);if(error||!data?.signedUrl)throw error||new Error('Ticketbild konnte nicht gelesen werden.');return data.signedUrl;
}
async function v07104RemoveTicketMedia(path){
  if(!path)return;if(typeof v077RemoveStorageObject==='function')return v077RemoveStorageObject('ls-ticket-media',path);
  try{await db.storage.from('ls-ticket-media').remove([path]);}catch{}
}
async function v07104TicketMediaUrl(path){
  if(!path)return null;
  const cached=state.v07104TicketMediaCache.get(path);if(cached&&cached.expires>Date.now())return cached.url;
  const {data,error}=await db.storage.from('ls-ticket-media').createSignedUrl(path,900);if(error||!data?.signedUrl)return null;
  state.v07104TicketMediaCache.set(path,{url:data.signedUrl,expires:Date.now()+12*60*1000});return data.signedUrl;
}
async function v07104HydrateTicketMedia(rows=[]){
  await Promise.all((rows||[]).map(async row=>{row.resolved_media_url=await v07104TicketMediaUrl(row.media_path);}));return rows||[];
}
function v07104TicketImageHtml(row){
  if(!row?.resolved_media_url)return '';
  return `<div class="v07104-ticket-image-wrap"><img class="v07104-ticket-image" src="${v07104Escape(row.resolved_media_url)}" alt="Ticketbild" loading="lazy"><div class="v07104-ticket-image-meta">${v07104Escape(row.media_name||'Bild')}${row.media_size?` · ${Math.max(1,Math.round(Number(row.media_size)/1024))} KB`:''}</div></div>`;
}
async function v07104UploadTicketImage(ticketId,file,actor='admin'){
  const mime=v07104ValidateTicketImage(file);if(!file)return null;
  const actorKey=String(actor||'admin').replace(/[^a-zA-Z0-9_-]/g,'-');
  const path=`${ticketId}/${actorKey}/${Date.now()}-${Math.random().toString(36).slice(2,8)}-${v07104SafeName(file.name||'bild')}`;
  const upload=await db.storage.from('ls-ticket-media').upload(path,file,{upsert:false,contentType:mime});if(upload.error)throw upload.error;
  try{await v07104VerifyTicketMedia(path);return {path,mime,name:file.name||'Bild',size:file.size};}
  catch(error){await v07104RemoveTicketMedia(path);throw error;}
}

async function v07104LoadMyTickets(){
  if(state.mode!=='online'||!state.activeCharacterId)return[];
  const {data,error}=await db.rpc('my_feedback_tickets_v07104',{p_character_id:state.activeCharacterId});if(error)throw error;
  return v07104HydrateTicketMedia(data||[]);
}
v076LoadMyTickets=v07104LoadMyTickets;

async function v07104OpenFeedbackCenter(){
  let tickets=[];try{tickets=await v07104LoadMyTickets();}catch(error){v07104Error(error);return;}
  openModal('Feedback & Tickets',`<section class="settings-block"><h3>Neues Ticket</h3><form id="feedbackTicketForm" class="stack-form">
    <label>Kategorie<select id="ticketCategory"><option value="bug">Bug melden</option><option value="change">Änderungswunsch</option><option value="suggestion">Vorschlag</option></select></label>
    <label>Titel<input id="ticketTitle" maxlength="120" required placeholder="Kurze Zusammenfassung"></label>
    <label>Beschreibung<textarea id="ticketDescription" maxlength="4000" rows="6" required placeholder="Beschreibe den Fehler oder Wunsch möglichst genau."></textarea></label>
    <label class="v07104-ticket-file-row">Bild <small>(optional, max. 8 MB)</small><input id="ticketImageV07104" type="file" accept="image/jpeg,image/png,image/webp,image/gif"><span id="ticketImageNameV07104" class="v07104-ticket-file-name"></span></label>
    <button id="submitTicket" class="primary-button" type="submit">Ticket senden</button></form></section>
    <section class="settings-block"><h3>Meine Tickets</h3><div class="ticket-list">${tickets.length?tickets.map(t=>`<article class="ticket-card status-${t.status}"><div class="ticket-card-head"><strong>${v07104Escape(t.title)}</strong><span>${v07104Escape(typeof v076StatusLabel==='function'?v076StatusLabel(t.status):t.status)}</span></div><small>${v07104Escape(typeof v076CategoryLabel==='function'?v076CategoryLabel(t.category):t.category)} · ${v07104Escape(typeof v076FormatDate==='function'?v076FormatDate(t.created_at):t.created_at)} · Priorität ${v07104Escape(typeof v076PriorityLabel==='function'?v076PriorityLabel(t.priority):t.priority)}</small><p>${v07104Escape(t.description)}</p>${v07104TicketImageHtml(t)}${t.admin_note?`<div class="ticket-admin-note"><b>Admin-Notiz</b>${v07104Escape(t.admin_note)}</div>`:''}</article>`).join(''):'<p class="notification-note">Noch keine Tickets für diesen Charakter.</p>'}</div></section>`);
  const fileInput=document.getElementById('ticketImageV07104');
  fileInput?.addEventListener('change',()=>{const n=document.getElementById('ticketImageNameV07104');if(n)n.textContent=fileInput.files?.[0]?.name||'';});
  document.getElementById('feedbackTicketForm')?.addEventListener('submit',async event=>{
    event.preventDefault();const btn=document.getElementById('submitTicket');const file=fileInput?.files?.[0]||null;let ticketId=null,uploaded=null;
    try{if(file)v07104ValidateTicketImage(file);}catch(error){v07104Toast(error.message,'error');return;}
    if(typeof setBusy==='function')setBusy(btn,true,'Sende…');else btn.disabled=true;
    try{
      const create=await db.rpc('create_feedback_ticket',{p_character_id:state.activeCharacterId,p_category:document.getElementById('ticketCategory').value,p_title:document.getElementById('ticketTitle').value.trim(),p_description:document.getElementById('ticketDescription').value.trim()});
      if(create.error)throw create.error;ticketId=create.data;if(!ticketId)throw new Error('Ticket konnte nicht erstellt werden.');
      if(file){
        uploaded=await v07104UploadTicketImage(ticketId,file,state.activeCharacterId);
        const commit=await db.rpc('set_ticket_initial_media_v07104',{p_ticket_id:ticketId,p_character_id:state.activeCharacterId,p_media_path:uploaded.path,p_media_mime:uploaded.mime,p_media_name:uploaded.name,p_media_size:uploaded.size});
        if(commit.error)throw commit.error;
      }
      v07104Toast('Ticket wurde gesendet.','success');await v07104OpenFeedbackCenter();
    }catch(error){
      if(uploaded?.path)await v07104RemoveTicketMedia(uploaded.path);
      if(ticketId)v07104Toast(`Ticket wurde erstellt, das Bild konnte aber nicht gespeichert werden: ${error?.message||'Unbekannter Fehler'}`,'error');else v07104Error(error);
      if(ticketId)await v07104OpenFeedbackCenter();
    }finally{if(typeof setBusy==='function')setBusy(btn,false);else if(btn)btn.disabled=false;}
  });
  if(typeof v0710EnhanceUserTicketCenter==='function')await v0710EnhanceUserTicketCenter();
}
openFeedbackCenterV076=v07104OpenFeedbackCenter;

v0710TicketMessages=async function v0710TicketMessagesV07104(ticketId,characterId=null){
  const {data,error}=await db.rpc('ticket_messages_v07104',{p_ticket_id:ticketId,p_character_id:characterId});if(error)throw error;
  return v07104HydrateTicketMedia(data||[]);
};
v0710ThreadMessagesHtml=function v0710ThreadMessagesHtmlV07104(messages){
  return messages.length?`<div class="v0710-thread-list">${messages.map(m=>`<article class="v0710-thread-msg ${m.sender_role==='admin'?'admin':'reporter'}"><small>${v07104Escape(m.sender_name||(m.sender_role==='admin'?'Administration':'Charakter'))} · ${v0710FormatDate(m.created_at)}</small>${m.body?`<p>${v07104Escape(m.body)}</p>`:''}${v07104TicketImageHtml(m)}</article>`).join('')}</div>`:'<p class="notification-note">Die Administration hat für dieses Ticket noch keine Unterhaltung gestartet.</p>';
};
function v07104ThreadFormHtml(kind,ticketId,label){
  const attr=kind==='user'?'id="v07104UserTicketForm"':kind==='admin-start'?`data-v07104-admin-start="${ticketId}"`:`data-v07104-admin-send="${ticketId}"`;
  return `<form ${attr} class="v0710-thread-form"><div class="v07104-thread-compose"><textarea maxlength="4000" placeholder="${kind==='admin-start'?'Erste Nachricht – startet die Unterhaltung…':'Antwort schreiben…'}"></textarea><label class="v07104-ticket-file-row"><span>Bild <small>(optional)</small></span><input type="file" accept="image/jpeg,image/png,image/webp,image/gif"><span class="v07104-ticket-file-name"></span></label></div><button class="primary-button" type="submit">${label}</button></form>`;
}
function v07104BindThreadFileName(form){const input=form?.querySelector('input[type="file"]'),name=form?.querySelector('.v07104-ticket-file-name');input?.addEventListener('change',()=>{if(name)name.textContent=input.files?.[0]?.name||'';});}

v0710OpenUserTicketThread=async function v0710OpenUserTicketThreadV07104(ticket){
  try{
    const messages=await v0710TicketMessages(ticket.id,state.activeCharacterId);const canWrite=ticket.status!=='completed'&&messages.length>0;
    openModal(`Ticket · ${ticket.title}`,`<section class="settings-block"><div class="ticket-card-head"><div><strong>${v07104Escape(ticket.title)}</strong><small>${v07104Escape(typeof v076CategoryLabel==='function'?v076CategoryLabel(ticket.category):ticket.category)} · ${v07104Escape(typeof v076StatusLabel==='function'?v076StatusLabel(ticket.status):ticket.status)}</small></div></div><p>${v07104Escape(ticket.description)}</p>${v07104TicketImageHtml(ticket)}</section><section class="settings-block"><h3>Unterhaltung mit der Administration</h3><div id="v0710UserTicketThread" class="v0710-thread">${v0710ThreadMessagesHtml(messages)}${canWrite?v07104ThreadFormHtml('user',ticket.id,'Senden'):ticket.status==='completed'?'<p class="notification-note">Dieses Ticket ist abgeschlossen. Die Unterhaltung ist schreibgeschützt.</p>':''}</div></section><button id="v0710BackToTickets" class="ghost-button wide" type="button">Zurück zu meinen Tickets</button>`);
    document.getElementById('v0710BackToTickets')?.addEventListener('click',v07104OpenFeedbackCenter);
    const form=document.getElementById('v07104UserTicketForm');v07104BindThreadFileName(form);
    form?.addEventListener('submit',async event=>{
      event.preventDefault();const btn=form.querySelector('button'),body=form.querySelector('textarea').value.trim(),file=form.querySelector('input[type="file"]')?.files?.[0]||null;let uploaded=null;
      if(!body&&!file)return v07104Toast('Schreibe eine Nachricht oder wähle ein Bild.','error');
      try{if(file)v07104ValidateTicketImage(file);}catch(error){return v07104Toast(error.message,'error');}
      btn.disabled=true;try{
        if(file)uploaded=await v07104UploadTicketImage(ticket.id,file,state.activeCharacterId);
        const {error}=await db.rpc('send_ticket_message_v07104',{p_ticket_id:ticket.id,p_character_id:state.activeCharacterId,p_body:body,p_media_path:uploaded?.path||null,p_media_mime:uploaded?.mime||null,p_media_name:uploaded?.name||null,p_media_size:uploaded?.size||null});if(error)throw error;
        await v0710OpenUserTicketThread(ticket);
      }catch(error){if(uploaded?.path)await v07104RemoveTicketMedia(uploaded.path);v07104Error(error);}finally{btn.disabled=false;}
    });
  }catch(error){v07104Error(error);}
};

v0710RenderAdminThread=async function v0710RenderAdminThreadV07104(ticket,host){
  if(!host)return;
  try{
    const messages=await v0710TicketMessages(ticket.id,null),canWrite=ticket.status!=='completed';
    host.innerHTML=`${v0710ThreadMessagesHtml(messages)}${canWrite?(messages.length?v07104ThreadFormHtml('admin-send',ticket.id,'Senden'):v07104ThreadFormHtml('admin-start',ticket.id,'Unterhaltung starten')):'<p class="notification-note">Ticket abgeschlossen – Unterhaltung schreibgeschützt.</p>'}`;
    const form=host.querySelector('[data-v07104-admin-start],[data-v07104-admin-send]');v07104BindThreadFileName(form);
    form?.addEventListener('submit',async event=>{
      event.preventDefault();const btn=form.querySelector('button'),body=form.querySelector('textarea').value.trim(),file=form.querySelector('input[type="file"]')?.files?.[0]||null,isStart=form.hasAttribute('data-v07104-admin-start');let uploaded=null;
      if(!body&&!file)return v07104Toast('Schreibe eine Nachricht oder wähle ein Bild.','error');
      try{if(file)v07104ValidateTicketImage(file);}catch(error){return v07104Toast(error.message,'error');}
      btn.disabled=true;try{
        if(file)uploaded=await v07104UploadTicketImage(ticket.id,file,'admin');
        const args={p_ticket_id:ticket.id,p_body:body,p_media_path:uploaded?.path||null,p_media_mime:uploaded?.mime||null,p_media_name:uploaded?.name||null,p_media_size:uploaded?.size||null};
        const result=isStart?await db.rpc('admin_start_ticket_conversation_v07104',args):await db.rpc('send_ticket_message_v07104',{...args,p_character_id:null});if(result.error)throw result.error;
        await v0710RenderAdminThread(ticket,host);
      }catch(error){if(uploaded?.path)await v07104RemoveTicketMedia(uploaded.path);v07104Error(error);}finally{btn.disabled=false;}
    });
  }catch(error){host.innerHTML=`<p class="notification-note">${v07104Escape(error?.message||'Unterhaltung konnte nicht geladen werden.')}</p>`;}
};

async function v07104AdminLoadTickets(status='',query=''){
  const {data,error}=await db.rpc('admin_feedback_tickets_v07104',{p_status:status||null,p_query:query||''});if(error)throw error;
  return v07104HydrateTicketMedia(data||[]);
}
v076AdminLoadTickets=v07104AdminLoadTickets;
if(typeof v076RenderAdminTickets==='function'){
  const v07104AdminRenderBase=v076RenderAdminTickets;
  v076RenderAdminTickets=function v076RenderAdminTicketsV07104(tickets){
    const result=v07104AdminRenderBase.apply(this,arguments);const byId=new Map((tickets||[]).map(t=>[t.id,t]));
    document.querySelectorAll('#adminTicketResultsV076 .admin-ticket-card').forEach(card=>{
      const id=card.querySelector('[data-ticket-save]')?.dataset.ticketSave,ticket=byId.get(id);if(!ticket?.resolved_media_url||card.querySelector('.v07104-ticket-image-wrap'))return;
      const p=card.querySelector('p');p?.insertAdjacentHTML('afterend',v07104TicketImageHtml(ticket));
    });return result;
  };
}

async function v07104LoadConversationFavorites(){
  state.v07104ConversationFavorites=new Set();if(state.mode!=='online'||!state.activeCharacterId)return;
  const {data,error}=await db.rpc('my_conversation_favorites_v07104',{p_character_id:state.activeCharacterId});if(error){console.warn('[LS Connect] Chat-Favoriten konnten nicht geladen werden.',error);return;}
  state.v07104ConversationFavorites=new Set((data||[]).map(x=>x.conversation_id));
}
function v07104ChatFavorite(id){return state.v07104ConversationFavorites?.has(id);}
function v07104SortChats(){
  if(!Array.isArray(state.chats))return;
  state.chats.sort((a,b)=>Number(v07104ChatFavorite(b.id))-Number(v07104ChatFavorite(a.id))||new Date(b.updated_at||0)-new Date(a.updated_at||0));
}
if(typeof loadChats==='function'){
  const v07104LoadChatsBase=loadChats;
  loadChats=async function loadChatsV07104(){const result=await v07104LoadChatsBase.apply(this,arguments);await v07104LoadConversationFavorites();v07104SortChats();return result;};
}
if(typeof renderChats==='function'){
  const v07104RenderChatsBase=renderChats;
  renderChats=function renderChatsV07104(){v07104SortChats();const result=v07104RenderChatsBase.apply(this,arguments);document.querySelectorAll('#chatList [data-chat]').forEach(row=>{const id=row.dataset.chat;if(!v07104ChatFavorite(id))return;const top=row.querySelector('.chat-top');if(top&&!top.querySelector('.v07104-chat-favorite')){const star=document.createElement('span');star.className='v07104-chat-favorite';star.title='Favorisierter Chat';star.textContent='★';top.appendChild(star);}});return result;};
}
if(typeof openChatToolsV04==='function'){
  const v07104ChatToolsBase=openChatToolsV04;
  openChatToolsV04=async function openChatToolsV07104(){
    const result=await v07104ChatToolsBase.apply(this,arguments),chat=typeof activeChat==='function'?activeChat():null;if(!chat||!els?.modalContent)return result;
    document.getElementById('v07104FavoriteChatBlock')?.remove();const favorite=v07104ChatFavorite(chat.id),block=document.createElement('section');block.id='v07104FavoriteChatBlock';block.className='settings-block v07104-favorite-block';
    block.innerHTML=`<h3>Chat-Favorit</h3><div class="v07104-favorite-state"><span aria-hidden="true">${favorite?'★':'☆'}</span><span>${favorite?'Dieser Chat ist favorisiert und steht oben in deiner Chatliste.':'Favorisierte Chats werden für diesen Charakter oben angeheftet.'}</span></div><button id="v07104FavoriteChatToggle" type="button" class="small-button ${favorite?'':'primary'}">${favorite?'Aus Favoriten entfernen':'Chat favorisieren'}</button>`;
    els.modalContent.appendChild(block);document.getElementById('v07104FavoriteChatToggle')?.addEventListener('click',async()=>{
      const next=!v07104ChatFavorite(chat.id),btn=document.getElementById('v07104FavoriteChatToggle');btn.disabled=true;
      try{const {error}=await db.rpc('set_conversation_favorite_v07104',{p_character_id:state.activeCharacterId,p_conversation_id:chat.id,p_favorite:next});if(error)throw error;if(next)state.v07104ConversationFavorites.add(chat.id);else state.v07104ConversationFavorites.delete(chat.id);v07104SortChats();renderChats();v07104Toast(next?'Chat favorisiert.':'Chat aus Favoriten entfernt.','success');await openChatToolsV04();}catch(error){v07104Error(error);}finally{btn.disabled=false;}
    });return result;
  };
  if(typeof openChatToolsModal!=='undefined')openChatToolsModal=openChatToolsV04;
}

function v07104ClearConversationUnread(conversationId){
  if(!conversationId)return;const chat=(state.chats||[]).find(c=>c.id===conversationId);if(chat)chat.unread=0;
  state.unreadConversationsV078?.delete?.(conversationId);
  const escaped=(window.CSS&&typeof window.CSS.escape==='function')?window.CSS.escape(conversationId):String(conversationId).replace(/["'\\]/g,'\\$&');const row=document.querySelector(`#chatList [data-chat="${escaped}"]`);row?.querySelectorAll('.unread-badge,[data-v078-badge]').forEach(el=>el.remove());
  if(typeof renderChats==='function')renderChats();if(typeof v078ApplyUnreadBadges==='function')queueMicrotask(v078ApplyUnreadBadges);
}
if(typeof v078MarkConversationRead==='function'){
  const v07104MarkReadBase=v078MarkConversationRead;
  v078MarkConversationRead=async function v078MarkConversationReadV07104(conversationId){const result=await v07104MarkReadBase.apply(this,arguments);v07104ClearConversationUnread(conversationId);return result;};
}
if(typeof loadMessages==='function'){
  const v07104LoadMessagesBase=loadMessages;
  loadMessages=async function loadMessagesV07104(conversationId){const result=await v07104LoadMessagesBase.apply(this,arguments);if(conversationId===state.activeConversationId)v07104ClearConversationUnread(conversationId);return result;};
}

const v07104ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v07104ChangelogTarget&&!v07104ChangelogTarget.some(x=>x.version===LS_CONNECT_V07104_VERSION)){
  v07104ChangelogTarget.unshift({version:LS_CONNECT_V07104_VERSION,title:'Tickets, Unread, Stories & Chat-Favoriten',items:[
    'Tickets und Ticket-Unterhaltungen unterstützen Bilder bis 8 MB',
    'Admin-Ticket-Unterhaltungen beheben den Fehler column reference id is ambiguous',
    'Gelesene Chats verlieren den Ungelesen-Hinweis sofort ohne F5',
    'Status-/Story-Bilder werden auf Handy und Desktop vollständig eingepasst statt hineingezoomt',
    'Chats können pro RP-Charakter favorisiert und oben angeheftet werden'
  ]});
}
console.info('[LS Connect] v0.7.10.4 tickets/unread/story/favorites patch active');
