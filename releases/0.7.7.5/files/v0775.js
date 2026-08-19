/* LS Connect v0.7.7.5 – quick UI & comfort patch */
const LS_CONNECT_V0775_VERSION='0.7.7.5';

(function v0775Styles(){
  if(document.getElementById('v0775-styles'))return;
  const s=document.createElement('style');s.id='v0775-styles';s.textContent=`
    .ticket-status.status-triaged{color:#c084fc}
    .character-menu-section{padding:7px 12px 5px;color:var(--muted);font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
    .call-history .call-history-success{color:#34d399;font-weight:800}.call-history .call-history-missed{color:#f87171;font-weight:800}
    .emoji-compose-button{font-size:1.12rem}.emoji-compose-picker{position:fixed;z-index:160;display:grid;grid-template-columns:repeat(8,34px);gap:4px;padding:9px;border:1px solid var(--border);border-radius:14px;background:var(--panel);box-shadow:0 18px 45px rgba(0,0,0,.38);max-width:320px}
    .emoji-compose-picker.hidden{display:none}.emoji-compose-picker button{width:34px;height:34px;border:0;border-radius:8px;background:transparent;font-size:1.2rem;cursor:pointer}.emoji-compose-picker button:hover{background:var(--panel-2)}
    @media(max-width:700px){.emoji-compose-picker{grid-template-columns:repeat(7,34px);max-width:292px}}
  `;document.head.appendChild(s);
})();

// 1) Ticket status "Eingestuft".
const v0775StatusLabelBase=v076StatusLabel;
v076StatusLabel=function v076StatusLabelV0775(value){return value==='triaged'?'Eingestuft':v0775StatusLabelBase(value);};
const v0775RenderTicketsBase=v076RenderAdminTickets;
v076RenderAdminTickets=function v076RenderAdminTicketsV0775(tickets){
  v0775RenderTicketsBase(tickets);
  const box=$('adminTicketResultsV076');if(!box)return;
  (tickets||[]).forEach(t=>{
    const sel=box.querySelector(`[data-ticket-status="${t.id}"]`);if(!sel)return;
    if(![...sel.options].some(o=>o.value==='triaged')){
      const o=document.createElement('option');o.value='triaged';o.textContent='Eingestuft';
      const before=[...sel.options].find(x=>x.value==='in_progress');sel.insertBefore(o,before||null);
    }
    sel.value=t.status;
  });
};
const v0775AdminModalBase=openAdminModal;
openAdminModal=async function openAdminModalV0775(){
  await v0775AdminModalBase();
  const filter=$('adminTicketStatusV076');
  if(filter&&![...filter.options].some(o=>o.value==='triaged')){const o=document.createElement('option');o.value='triaged';o.textContent='Eingestuft';const before=[...filter.options].find(x=>x.value==='in_progress');filter.insertBefore(o,before||null);}
};

// 2) Account/settings cleanup: character/channel creation belongs to its dedicated UI.
const v0775AccountBase=openAccountModal;
openAccountModal=async function openAccountModalV0775(){
  await v0775AccountBase();
  if(!els.modalContent)return;
  $('manageCharactersFromAccount')?.remove();
  els.modalContent.querySelectorAll('button').forEach(btn=>{
    const t=btn.textContent.trim().toLowerCase();
    if(t==='unternehmenskanäle'||t.includes('charakter erstellen')||t==='charaktere verwalten')btn.remove();
  });
};

// 3) Deleted company-channel posts vanish instead of leaving a tombstone.
const v0775ChannelPostsBase=v07RenderChannelPosts;
v07RenderChannelPosts=function v07RenderChannelPostsV0775(ch,posts){return v0775ChannelPostsBase(ch,(posts||[]).filter(p=>!p.deleted_at));};

// 4) Colored call-history arrows.
callHistoryHtml=function callHistoryHtmlV0775(calls){
  if(!calls?.length)return '<p class="notification-note">Noch keine RP-Anrufe.</p>';
  const labels={ringing:'Klingelt',answered:'Angenommen',declined:'Abgelehnt',missed:'Verpasst',cancelled:'Abgebrochen',ended:'Beendet'};
  return `<div class="call-history">${calls.map(c=>{
    const arrow=c.initiator_character_id===state.activeCharacterId?'↗':'↙';
    const cls=['missed','declined','cancelled'].includes(c.status)?'call-history-missed':['answered','ended'].includes(c.status)?'call-history-success':'';
    return `<div><span class="${cls}">${arrow} ${escapeHtml(labels[c.status]||c.status)}</span><small>${new Date(c.started_at).toLocaleString('de-DE')}</small></div>`;
  }).join('')}</div>`;
};

// 5) Mobile "Profile" now opens the same Account/Settings view as desktop.
const v0775MobileSectionBase=v05OpenMobileSection;
v05OpenMobileSection=function v05OpenMobileSectionV0775(action){
  if(action==='profile'){
    document.querySelectorAll('.mobile-nav button').forEach(b=>b.classList.toggle('active',b.dataset.mobileAction==='profile'));
    openAccountModal();return;
  }
  return v0775MobileSectionBase(action);
};
const v0775MobileProfileBtn=document.querySelector('[data-mobile-action="profile"]');
if(v0775MobileProfileBtn){const icon=v0775MobileProfileBtn.querySelector('span'),label=v0775MobileProfileBtn.querySelector('small');if(icon)icon.textContent='⚙';if(label)label.textContent='Einstellungen';}

// 6) Separate people and organisations/fraktionen in the character picker.
const v0775RenderCharacterBase=renderCharacter;
renderCharacter=function renderCharacterV0775(){
  v0775RenderCharacterBase();
  const menu=els.characterMenu;if(!menu)return;
  const add=menu.querySelector('[data-add-character]');
  const buttons=[...menu.querySelectorAll('[data-character]')];
  const isOrg=ch=>/unternehmen|medien|behörde|organisation|fraktion/i.test(String(ch?.account_type||''));
  const people=buttons.filter(b=>!isOrg(state.characters.find(c=>c.id===b.dataset.character)));
  const orgs=buttons.filter(b=>isOrg(state.characters.find(c=>c.id===b.dataset.character)));
  menu.innerHTML='';
  const section=(title,items)=>{if(!items.length)return;const h=document.createElement('div');h.className='character-menu-section';h.textContent=title;menu.appendChild(h);items.forEach(b=>menu.appendChild(b));};
  section('Personen',people);section('Organisationen & Fraktionen',orgs);if(add)menu.appendChild(add);
};
renderCharacter();

// 7) Emoji picker for normal message writing.
(function v0775InstallEmojiPicker(){
  if($('emojiComposeButton'))return;
  const input=els.messageInput;if(!input)return;
  const btn=document.createElement('button');btn.id='emojiComposeButton';btn.type='button';btn.className='icon-button emoji-compose-button';btn.title='Emoji einfügen';btn.textContent='☺';
  input.parentElement.insertBefore(btn,input);
  const picker=document.createElement('div');picker.id='emojiComposePicker';picker.className='emoji-compose-picker hidden';
  const emojis=['😀','😃','😄','😁','😂','🤣','😊','😍','🥰','😘','😎','🤔','🙄','😅','😢','😭','😡','🤬','😱','🤯','🥳','😴','🤝','👍','👎','👏','🙏','💪','❤️','💔','🔥','✨','⭐','✅','❌','⚠️','💯','🎉','👀','🫡','😂','😉','😏','🤨','😇','🤍','🖤','💙','💚','💛','💜','🧡','📞','📸','🚓','🏢'];
  picker.innerHTML=emojis.map(e=>`<button type="button" data-compose-emoji="${e}">${e}</button>`).join('');document.body.appendChild(picker);
  const hide=()=>picker.classList.add('hidden');
  btn.addEventListener('click',e=>{e.stopPropagation();const show=picker.classList.contains('hidden');if(!show)return hide();const r=btn.getBoundingClientRect();picker.style.left=`${Math.max(8,Math.min(innerWidth-picker.offsetWidth-8,r.left-80))}px`;picker.style.bottom=`${Math.max(76,innerHeight-r.top+8)}px`;picker.classList.remove('hidden');});
  picker.addEventListener('click',e=>{const b=e.target.closest('[data-compose-emoji]');if(!b)return;const emoji=b.dataset.composeEmoji,start=input.selectionStart??input.value.length,end=input.selectionEnd??start;input.value=input.value.slice(0,start)+emoji+input.value.slice(end);const pos=start+emoji.length;input.focus();input.setSelectionRange(pos,pos);});
  document.addEventListener('click',e=>{if(e.target!==btn&&!picker.contains(e.target))hide();});
})();

if(typeof V07_LOCAL_CHANGELOG!=='undefined'&&!V07_LOCAL_CHANGELOG.some(x=>x.version===LS_CONNECT_V0775_VERSION)){
  V07_LOCAL_CHANGELOG.unshift({version:LS_CONNECT_V0775_VERSION,title:'UI & Komfort',items:['Ticketstatus Eingestuft','Aufgeräumte Einstellungen und reparierte mobile Einstellungen','Gelöschte Kanalbeiträge verschwinden vollständig','Verpasster Anruf beim Abbruch durch den Anrufer','Farbige Pfeile im Anrufverlauf','Personen und Organisationen in der Charakterauswahl getrennt','Emoji-Picker beim Schreiben']});
}
console.info('[LS Connect] v0.7.7.5 quick patch active');
