/* LS Connect v0.7.7 \u2013 missed calls in chat + stale-call expiry */
(function v077InstallCallEventStyles(){
  if(document.getElementById('v077-call-event-styles'))return;
  const s=document.createElement('style');s.id='v077-call-event-styles';s.textContent=`
    .message-row.system-event-row{justify-content:center!important;padding:4px 0}
    .message-row.system-event-row .message-bubble{max-width:min(440px,88%)!important;background:color-mix(in srgb,var(--panel-2) 86%,transparent)!important;border:1px solid var(--border)!important;color:var(--text)!important;box-shadow:none!important;text-align:left}
    .message-bubble.system-call-event .message-actions,.message-bubble.system-call-event .reaction-picker,.message-bubble.system-call-event .reaction-row{display:none!important}
    .call-system-card{display:flex;align-items:center;gap:10px;min-width:210px}
    .call-system-icon{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--accent) 18%,transparent);font-size:1.05rem;flex:0 0 auto}
    .call-system-copy{display:grid;gap:2px}.call-system-copy strong{font-size:.92rem}.call-system-copy span{font-size:.76rem;color:var(--muted)}
  `;document.head.appendChild(s);
})();

const v077MessagePreviewBase = messagePreviewV04;
messagePreviewV04 = function messagePreviewV077(msg) {
  if (msg?.message_type === 'system' && msg.body === 'Verpasster Anruf') return '\ud83d\udcde Verpasster Anruf';
  return v077MessagePreviewBase(msg);
};

const v077RenderMessageContentBase = renderMessageContent;
renderMessageContent = function renderMessageContentV077(msg) {
  if (msg?.message_type === 'system' && msg.body === 'Verpasster Anruf') {
    const outgoing = msg.sender_character_id === state.activeCharacterId;
    return `<div class="call-system-card"><div class="call-system-icon">${outgoing?'\u2197':'\u2199'}</div><div class="call-system-copy"><strong>${outgoing?'Anruf nicht angenommen':'Verpasster Anruf'}</strong><span>${outgoing?'Der Kontakt hat den Anruf nicht angenommen.':'Du hast diesen Anruf verpasst.'}</span></div></div>`;
  }
  return v077RenderMessageContentBase(msg);
};

const v077RenderMessagesBase = renderMessages;
renderMessages = function renderMessagesV077() {
  v077RenderMessagesBase();
  for (const msg of state.currentMessages || []) {
    if (msg.message_type !== 'system' || msg.body !== 'Verpasster Anruf') continue;
    const bubble = els.messages?.querySelector(`[data-message="${msg.id}"]`);
    if (!bubble) continue;
    bubble.classList.add('system-call-event');
    bubble.closest('.message-row')?.classList.add('system-event-row');
    bubble.querySelector('.message-actions')?.remove();
    bubble.querySelector('.reaction-picker')?.remove();
    bubble.querySelector('.reaction-row')?.remove();
  }
};

v076PollIncomingCall = async function v076PollIncomingCallV077() {
  if(state.callPollBusyV076||state.mode!=='online'||!db||!state.activeCharacterId||activeCharacter()?.is_suspended)return;
  state.callPollBusyV076=true;
  try{
    const {data,error}=await db.from('calls').select('*').eq('callee_character_id',state.activeCharacterId).eq('status','ringing').order('started_at',{ascending:false}).limit(1);
    if(error)return;
    const call=data?.[0];
    if(!call)return;
    const age=Date.now()-new Date(call.started_at).getTime();
    if(age>=25000){
      const {error:expireError}=await db.rpc('expire_call',{p_call_id:call.id,p_character_id:state.activeCharacterId});
      if(!expireError){
        if(state.activeCall?.id===call.id){state.activeCall={...call,status:'missed',ended_at:new Date().toISOString()};if(state.callModalOpen)await showCallModal(state.activeCall,true);}
        await loadChats();
        if(state.activeConversationId===call.conversation_id)await loadMessages(call.conversation_id);
        renderAll();
      }
      return;
    }
    if(state.activeCall?.id!==call.id||!state.callModalOpen){state.activeCall=call;await showCallModal(call,true);}
  }finally{state.callPollBusyV076=false;}
};

// When a missed call arrives as a system message, refresh the chat even if another conversation is open.
if (db && typeof db.channel === 'function') {
  // The existing inbox subscription already receives message inserts; no extra global channel is required.
}

console.info('[LS Connect] v0.7.7 missed-call chat events active');
