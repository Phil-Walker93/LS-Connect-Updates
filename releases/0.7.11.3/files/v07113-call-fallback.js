/* LS Connect – adaptive incoming-call fallback */
(function installAdaptiveCallFallback(){
  if(window.__LS_CONNECT_ADAPTIVE_CALL_FALLBACK__)return;
  window.__LS_CONNECT_ADAPTIVE_CALL_FALLBACK__=true;

  const NORMAL_CALL_MS=15000;
  const DEGRADED_CALL_MS=3000;
  const HEALTH_CHECK_MS=2000;
  const CALL_FIELDS='id,conversation_id,initiator_character_id,callee_character_id,call_type,status,started_at,answered_at,ended_at,ended_by_character_id,original_callee_character_id';

  const canPoll=()=>{
    if(typeof state==='undefined'||state?.mode!=='online'||typeof db==='undefined'||!db||!state.activeCharacterId)return false;
    const current=typeof activeCharacter==='function'?activeCharacter():null;
    return !current?.is_suspended;
  };

  function realtimeHealthy(){
    if(typeof navigator!=='undefined'&&navigator.onLine===false)return false;
    try{
      if(typeof db?.realtime?.isConnected==='function')return !!db.realtime.isConnected();
      if(typeof db?.getChannels==='function'){
        const channels=db.getChannels()||[];
        if(channels.length){
          return channels.some(channel=>{
            const status=String(channel?.state||'').toLowerCase();
            return status==='joined'||status==='subscribed';
          });
        }
      }
    }catch{}
    // If the SDK exposes no reliable health accessor, prefer the low-traffic mode.
    // The database fallback still runs every 15 seconds.
    return true;
  }

  function callDelay(){
    if(typeof state!=='undefined'&&Number(state.callPollDegradedUntilV07113||0)>Date.now())return DEGRADED_CALL_MS;
    return realtimeHealthy()?NORMAL_CALL_MS:DEGRADED_CALL_MS;
  }

  async function adaptivePollIncomingCall(){
    if(!canPoll()||state.callPollBusyV076)return;
    state.callPollBusyV076=true;
    try{
      const {data,error}=await db.from('calls')
        .select(CALL_FIELDS)
        .eq('callee_character_id',state.activeCharacterId)
        .eq('status','ringing')
        .order('started_at',{ascending:false})
        .limit(1);
      if(error){
        state.callPollDegradedUntilV07113=Date.now()+30000;
        return;
      }
      state.callPollDegradedUntilV07113=0;
      const call=data?.[0];
      if(!call)return;

      const age=Date.now()-new Date(call.started_at).getTime();
      if(age>=25000){
        const {error:expireError}=await db.rpc('expire_call',{p_call_id:call.id,p_character_id:state.activeCharacterId});
        if(!expireError){
          if(state.activeCall?.id===call.id){
            state.activeCall={...call,status:'missed',ended_at:new Date().toISOString()};
            if(state.callModalOpen&&typeof showCallModal==='function')await showCallModal(state.activeCall,true);
          }
          if(typeof loadChats==='function')await loadChats();
          if(state.activeConversationId===call.conversation_id&&typeof loadMessages==='function')await loadMessages(call.conversation_id);
          if(typeof renderAll==='function')renderAll();
        }
        return;
      }

      if(state.activeCall?.id!==call.id||!state.callModalOpen){
        state.activeCall=call;
        if(typeof showCallModal==='function')await showCallModal(call,true);
      }
    }finally{
      state.callPollBusyV076=false;
    }
  }

  function clearCallTimer(){
    if(typeof state==='undefined')return;
    if(state.callPollTimerV076){
      clearTimeout(state.callPollTimerV076);
      clearInterval(state.callPollTimerV076);
      state.callPollTimerV076=null;
    }
  }

  function scheduleCallPoll(delay=callDelay()){
    clearCallTimer();
    if(!canPoll())return;
    state.callPollTimerV076=setTimeout(async()=>{
      state.callPollTimerV076=null;
      try{await adaptivePollIncomingCall();}
      finally{scheduleCallPoll(callDelay());}
    },Math.max(250,delay));
  }

  function installPollFunction(){
    if(typeof window!=='undefined')window.v076PollIncomingCall=adaptivePollIncomingCall;
    try{v076PollIncomingCall=adaptivePollIncomingCall;}catch{}
  }

  function installSubscriptionWrapper(){
    if(typeof startCallSubscription!=='function'||startCallSubscription.__lsAdaptiveCallFallbackV07113)return;
    const base=startCallSubscription;
    const wrapped=async function startCallSubscriptionAdaptiveV07113(){
      const result=await base.apply(this,arguments);
      installPollFunction();
      scheduleCallPoll(500);
      return result;
    };
    wrapped.__lsAdaptiveCallFallbackV07113=true;
    startCallSubscription=wrapped;
  }

  function apply({immediate=false}={}){
    if(typeof state==='undefined'||typeof db==='undefined'||!db)return;
    installPollFunction();
    installSubscriptionWrapper();
    scheduleCallPoll(immediate?250:callDelay());
  }

  let lastHealth=null;
  function healthTick(){
    if(!canPoll())return;
    const healthy=realtimeHealthy();
    if(healthy!==lastHealth){
      lastHealth=healthy;
      scheduleCallPoll(healthy?1000:250);
    }
  }

  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden)apply({immediate:true});
  });
  window.addEventListener('online',()=>apply({immediate:true}),{passive:true});
  window.addEventListener('offline',()=>scheduleCallPoll(DEGRADED_CALL_MS),{passive:true});
  window.addEventListener('pageshow',()=>setTimeout(()=>apply({immediate:true}),0),{passive:true});

  if(typeof state!=='undefined'){
    clearInterval(state.callFallbackHealthTimerV07113);
    state.callFallbackHealthTimerV07113=setInterval(healthTick,HEALTH_CHECK_MS);
  }

  // Older call modules are loaded in stages. Re-apply without generating network traffic so
  // this optimizer remains the last scheduler even if legacy code initializes a little later.
  [0,500,1800,3500,7000].forEach((delay,index)=>setTimeout(()=>apply({immediate:index===4}),delay));

  console.info('[LS Connect] adaptive call fallback active');
})();
