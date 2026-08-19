/* LS Connect v0.7.8.1 – chat composer layout hotfix */
const LS_CONNECT_V0781_VERSION='0.7.8.1';

(function v0781InstallComposerFix(){
  if(document.getElementById('v0781-composer-styles')) return;

  const style=document.createElement('style');
  style.id='v0781-composer-styles';
  style.textContent=`
    .v0781-compose-form{
      min-height:0!important;
      height:auto!important;
      max-height:none!important;
      padding:10px 12px!important;
      box-sizing:border-box!important;
    }
    .v0781-compose-row{
      display:flex!important;
      align-items:flex-end!important;
      gap:8px!important;
      flex-wrap:nowrap!important;
      width:100%!important;
      min-width:0!important;
      min-height:44px!important;
      height:auto!important;
      max-height:none!important;
      box-sizing:border-box!important;
    }
    .v0781-compose-row #messageInput{
      display:block!important;
      visibility:visible!important;
      opacity:1!important;
      position:relative!important;
      inset:auto!important;
      float:none!important;
      flex:1 1 auto!important;
      order:50!important;
      width:auto!important;
      min-width:120px!important;
      max-width:none!important;
      min-height:44px!important;
      height:44px;
      max-height:144px!important;
      margin:0!important;
      padding:10px 13px!important;
      box-sizing:border-box!important;
      overflow-y:auto!important;
      resize:none!important;
      border:1px solid var(--border,#26364a)!important;
      border-radius:14px!important;
      background:var(--panel-2,#111c2d)!important;
      color:var(--text,#f8fafc)!important;
      line-height:1.35!important;
      font:inherit!important;
      outline:none!important;
    }
    .v0781-compose-row #messageInput::placeholder{
      color:var(--muted,#8291a8)!important;
      opacity:1!important;
    }
    .v0781-compose-row #messageInput:focus{
      border-color:color-mix(in srgb,var(--accent,#22c55e) 60%,var(--border,#26364a))!important;
      box-shadow:0 0 0 2px color-mix(in srgb,var(--accent,#22c55e) 18%,transparent)!important;
    }
    .v0781-compose-row > button,
    .v0781-compose-row .icon-button{
      flex:0 0 44px!important;
      width:44px!important;
      min-width:44px!important;
      height:44px!important;
      min-height:44px!important;
      margin:0!important;
      padding:0!important;
      align-self:flex-end!important;
    }
    .v0781-compose-row .v0781-send-button{
      order:100!important;
    }
    .v0781-compose-row #emojiComposeButton{order:40!important}
    @media(max-width:700px){
      .v0781-compose-form{padding:8px!important}
      .v0781-compose-row{gap:6px!important}
      .v0781-compose-row > button,
      .v0781-compose-row .icon-button{
        flex-basis:40px!important;
        width:40px!important;
        min-width:40px!important;
        height:40px!important;
        min-height:40px!important;
      }
      .v0781-compose-row #messageInput{
        min-width:72px!important;
        min-height:40px!important;
        height:40px;
        padding:8px 11px!important;
        border-radius:12px!important;
      }
    }
    @media(max-width:430px){
      .v0781-compose-row{
        display:grid!important;
        grid-template-columns:repeat(4,40px) minmax(0,1fr) 40px!important;
        align-items:end!important;
      }
      .v0781-compose-row #messageInput{
        grid-column:1/-2!important;
        grid-row:2!important;
        width:100%!important;
      }
      .v0781-compose-row .v0781-send-button{
        grid-column:-2/-1!important;
        grid-row:2!important;
      }
    }
  `;
  document.head.appendChild(style);

  const resolveInput=()=>(
    (typeof els!=='undefined'&&els?.messageInput) ||
    document.getElementById('messageInput') ||
    document.querySelector('textarea[name="message"],input[name="message"]')
  );

  const autoSize=input=>{
    if(!input || input.tagName!=='TEXTAREA') return;
    input.style.height='44px';
    const max=innerWidth<=700?120:144;
    input.style.height=`${Math.max(innerWidth<=700?40:44,Math.min(max,input.scrollHeight||44))}px`;
  };

  const fix=()=>{
    const input=resolveInput();
    if(!input) return false;

    const row=input.parentElement;
    if(!row) return false;
    row.classList.add('v0781-compose-row');

    const form=input.closest('form');
    if(form) form.classList.add('v0781-compose-form');

    if(!input.placeholder) input.placeholder='Nachricht schreiben…';
    input.removeAttribute('size');

    const send=(
      (typeof els!=='undefined'&&(els?.sendButton||els?.messageSendButton)) ||
      document.getElementById('sendButton') ||
      document.getElementById('messageSendButton') ||
      form?.querySelector('button[type="submit"]')
    );

    if(send){
      send.classList.add('v0781-send-button');
      if(send.parentElement!==row) row.appendChild(send);
    }

    if(!input.dataset.v0781Autosize){
      input.dataset.v0781Autosize='1';
      input.addEventListener('input',()=>autoSize(input));
      input.addEventListener('focus',()=>autoSize(input));
    }
    autoSize(input);
    return true;
  };

  let attempts=0;
  const timer=setInterval(()=>{
    attempts++;
    if(fix()||attempts>30) clearInterval(timer);
  },150);

  const observer=new MutationObserver(()=>fix());
  observer.observe(document.documentElement,{childList:true,subtree:true});

  addEventListener('resize',()=>fix(),{passive:true});
  setTimeout(fix,0);
  setTimeout(fix,800);
})();

if(typeof V07_LOCAL_CHANGELOG!=='undefined'&&!V07_LOCAL_CHANGELOG.some(x=>x.version===LS_CONNECT_V0781_VERSION)){
  V07_LOCAL_CHANGELOG.unshift({
    version:LS_CONNECT_V0781_VERSION,
    title:'Chat-Eingabefeld Hotfix',
    items:[
      'Schreibfeld im Chat wieder dauerhaft sichtbar',
      'Werkzeugbuttons, Texteingabe und Senden kompakt ausgerichtet',
      'Composer-Höhe auf Desktop und Mobil stabilisiert',
      'Mehrzeilige Nachrichten wachsen nur bis zu einer sinnvollen Maximalhöhe'
    ]
  });
}
console.info('[LS Connect] v0.7.8.1 chat composer hotfix active');
