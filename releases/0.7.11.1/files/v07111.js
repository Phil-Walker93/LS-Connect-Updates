/* LS Connect v0.7.11.1 – personal character ordering */
var LS_CONNECT_V07111_VERSION='0.7.11.1';

(async function v07111Boot(){
  if(window.__LS_CONNECT_V07111_CHARACTER_ORDER__)return;
  window.__LS_CONNECT_V07111_CHARACTER_ORDER__=true;

  const stableFiles=['v0711.js','v0711-r2.js','v0711-r3.js','v0711-r4.js','v0711-init.js'];
  for(const file of stableFiles){
    const marker=`0.7.11:${file}`;
    const already=[...document.scripts].some(s=>
      s.dataset?.lsReleaseFile===marker ||
      (s.src&&s.src.includes('version=0.7.11')&&s.src.includes(`file=${encodeURIComponent(file)}`))
    );
    if(already)continue;
    await new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.dataset.lsReleaseFile=marker;
      s.src=`/api/script?version=0.7.11&file=${encodeURIComponent(file)}&v=r4`;
      s.async=false;
      s.onload=resolve;
      s.onerror=()=>reject(new Error(`Stable-Modul konnte nicht geladen werden: ${file}`));
      document.head.appendChild(s);
    });
  }

  const esc=value=>typeof escapeHtml==='function'
    ? escapeHtml(String(value??''))
    : String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const toast=(message,type='info')=>{
    if(typeof showToast==='function')showToast(message,type);
    else console.info('[LS Connect]',message);
  };

  const isOrg=ch=>/unternehmen|medien|behörde|organisation|fraktion/i.test(String(ch?.account_type||''));

  function installStyles(){
    if(document.getElementById('v07111-character-order-styles'))return;
    const style=document.createElement('style');
    style.id='v07111-character-order-styles';
    style.textContent=`
      .v07111-order-menu-button{width:100%;display:flex!important;align-items:center;gap:9px;justify-content:flex-start!important;margin-top:5px}
      .v07111-order-intro{margin:0 0 12px;color:var(--muted);line-height:1.45}
      .v07111-order-section{display:grid;gap:7px;margin-top:13px}
      .v07111-order-section>h4{margin:0 0 2px;color:var(--muted);font-size:.72rem;letter-spacing:.07em;text-transform:uppercase}
      .v07111-order-list{display:grid;gap:7px}
      .v07111-order-row{display:grid;grid-template-columns:28px 38px minmax(0,1fr) auto;align-items:center;gap:9px;padding:9px 10px;border:1px solid var(--border);border-radius:12px;background:var(--panel-2);transition:border-color .14s ease,background .14s ease,opacity .14s ease}
      .v07111-order-row[draggable="true"]{cursor:grab}
      .v07111-order-row.v07111-dragging{opacity:.45;border-color:var(--accent)}
      .v07111-drag-handle{color:var(--muted);font-weight:900;text-align:center;user-select:none}
      .v07111-order-avatar{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;overflow:hidden;background:var(--accent);color:#fff;font-weight:900;font-size:.78rem}
      .v07111-order-avatar img{width:100%;height:100%;object-fit:cover}
      .v07111-order-copy{min-width:0}
      .v07111-order-copy strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .v07111-order-copy small{display:block;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .v07111-order-arrows{display:flex;gap:5px}
      .v07111-order-arrows button{min-width:34px;padding:6px 8px}
      .v07111-order-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}
      .v07111-order-note{margin:10px 0 0;color:var(--muted);font-size:.76rem;line-height:1.4}
      @media(max-width:600px){
        .v07111-order-row{grid-template-columns:22px 34px minmax(0,1fr) auto;padding:8px}
        .v07111-drag-handle{display:none}
        .v07111-order-actions{flex-direction:column}
        .v07111-order-actions button{width:100%}
      }
    `;
    document.head.appendChild(style);
  }

  function avatarHtml(ch){
    const letter=esc((String(ch?.name||'?').trim()[0]||'?').toUpperCase());
    const url=String(ch?.avatar_url||'').trim();
    if(url)return `<span class="v07111-order-avatar"><img src="${esc(url)}" alt=""></span>`;
    const color=String(ch?.profile_color||'').trim();
    const style=color?` style="background:${esc(color)}"`:'';
    return `<span class="v07111-order-avatar"${style}>${letter}</span>`;
  }

  function rowHtml(ch){
    return `<div class="v07111-order-row" draggable="true" data-v07111-character-id="${esc(ch.id)}">
      <span class="v07111-drag-handle" aria-hidden="true">☰</span>
      ${avatarHtml(ch)}
      <span class="v07111-order-copy"><strong>${esc(ch.name||'Unbenannt')}</strong><small>${esc(ch.handle||ch.account_type||'Charakter')}</small></span>
      <span class="v07111-order-arrows">
        <button type="button" class="small-button" data-v07111-up title="Nach oben" aria-label="${esc(ch.name||'Charakter')} nach oben">↑</button>
        <button type="button" class="small-button" data-v07111-down title="Nach unten" aria-label="${esc(ch.name||'Charakter')} nach unten">↓</button>
      </span>
    </div>`;
  }

  function sectionHtml(title,items,key){
    if(!items.length)return '';
    return `<section class="v07111-order-section"><h4>${esc(title)}</h4><div class="v07111-order-list" data-v07111-list="${key}">${items.map(rowHtml).join('')}</div></section>`;
  }

  function moveRow(row,direction){
    const list=row?.parentElement;
    if(!list)return;
    if(direction<0){
      const prev=row.previousElementSibling;
      if(prev)list.insertBefore(row,prev);
    }else{
      const next=row.nextElementSibling;
      if(next)list.insertBefore(next,row);
    }
  }

  function bindDnD(root){
    let dragged=null;
    root.querySelectorAll('.v07111-order-row').forEach(row=>{
      row.addEventListener('dragstart',event=>{
        dragged=row;
        row.classList.add('v07111-dragging');
        if(event.dataTransfer){
          event.dataTransfer.effectAllowed='move';
          try{event.dataTransfer.setData('text/plain',row.dataset.v07111CharacterId||'');}catch{}
        }
      });
      row.addEventListener('dragend',()=>{
        row.classList.remove('v07111-dragging');
        dragged=null;
      });
    });

    root.querySelectorAll('.v07111-order-list').forEach(list=>{
      list.addEventListener('dragover',event=>{
        if(!dragged||dragged.parentElement!==list)return;
        event.preventDefault();
        const target=event.target?.closest?.('.v07111-order-row');
        if(!target||target===dragged||target.parentElement!==list)return;
        const rect=target.getBoundingClientRect();
        const after=event.clientY>rect.top+rect.height/2;
        if(after)list.insertBefore(dragged,target.nextElementSibling);
        else list.insertBefore(dragged,target);
      });
      list.addEventListener('drop',event=>event.preventDefault());
    });

    root.querySelectorAll('[data-v07111-up]').forEach(button=>
      button.addEventListener('click',()=>moveRow(button.closest('.v07111-order-row'),-1))
    );
    root.querySelectorAll('[data-v07111-down]').forEach(button=>
      button.addEventListener('click',()=>moveRow(button.closest('.v07111-order-row'),1))
    );
  }

  async function saveOrder(root,button){
    if(typeof db==='undefined'||!db||typeof state==='undefined'||state.mode!=='online'){
      toast('Die Reihenfolge kann nur im Online-Modus gespeichert werden.','error');
      return;
    }
    const ids=[...root.querySelectorAll('[data-v07111-character-id]')].map(row=>row.dataset.v07111CharacterId).filter(Boolean);
    if(!ids.length){toast('Keine Charaktere zum Sortieren gefunden.','info');return;}
    if(button)button.disabled=true;
    try{
      const {error}=await db.rpc('set_character_order_v07111',{p_character_ids:ids});
      if(error)throw error;

      const byId=new Map((state.characters||[]).map(ch=>[String(ch.id),ch]));
      state.characters=ids.map((id,index)=>{
        const ch=byId.get(String(id));
        if(ch)ch.sort_order=index;
        return ch;
      }).filter(Boolean);

      if(typeof renderCharacter==='function')renderCharacter();
      toast('Charakter-Reihenfolge gespeichert.','success');
      if(typeof closeModal==='function')closeModal();
      else document.getElementById('modalBackdrop')?.classList.add('hidden');
    }catch(error){
      console.error('[LS Connect] Charakter-Reihenfolge konnte nicht gespeichert werden.',error);
      toast(error?.message||'Reihenfolge konnte nicht gespeichert werden.','error');
    }finally{
      if(button)button.disabled=false;
    }
  }

  function openOrderManager(){
    const chars=(typeof state!=='undefined'&&Array.isArray(state.characters)?state.characters:[]).filter(Boolean);
    if(!chars.length){toast('Keine Charaktere verfügbar.','info');return;}
    const people=chars.filter(ch=>!isOrg(ch));
    const orgs=chars.filter(isOrg);
    const html=`<p class="v07111-order-intro">Lege deine persönliche Reihenfolge im Charakterwechsel fest. Am Desktop kannst du ziehen; auf Handy und Touch funktionieren die Pfeile.</p>
      ${sectionHtml('Personen',people,'people')}
      ${sectionHtml('Organisationen & Fraktionen',orgs,'orgs')}
      <p class="v07111-order-note">Die Sortierung gilt nur für deinen Account. Andere Nutzer mit Zugriff auf dieselben Charaktere behalten ihre eigene Reihenfolge.</p>
      <div class="v07111-order-actions"><button type="button" class="primary-button" data-v07111-save>Reihenfolge speichern</button></div>`;

    if(typeof openModal==='function')openModal('Charakter-Reihenfolge',html);
    else if(typeof els!=='undefined'&&els.modalContent){
      const title=document.getElementById('modalTitle');if(title)title.textContent='Charakter-Reihenfolge';
      els.modalContent.innerHTML=html;
      document.getElementById('modalBackdrop')?.classList.remove('hidden');
    }

    const root=(typeof els!=='undefined'&&els.modalContent)||document.getElementById('modalContent');
    if(!root)return;
    bindDnD(root);
    root.querySelector('[data-v07111-save]')?.addEventListener('click',event=>saveOrder(root,event.currentTarget));
  }

  window.v07111OpenCharacterOrderManager=openOrderManager;

  function installMenuButton(){
    const menu=typeof els!=='undefined'?els.characterMenu:document.getElementById('characterMenu');
    if(!menu||menu.querySelector('[data-v07111-open-order]'))return false;
    const button=document.createElement('button');
    button.type='button';
    button.className='ghost-button v07111-order-menu-button';
    button.dataset.v07111OpenOrder='1';
    button.innerHTML='<span aria-hidden="true">↕</span><span>Reihenfolge verwalten</span>';
    button.addEventListener('click',openOrderManager);
    const add=menu.querySelector('[data-add-character]');
    if(add)menu.insertBefore(button,add);
    else menu.appendChild(button);
    return true;
  }

  if(typeof renderCharacter==='function'){
    const baseRenderCharacter=renderCharacter;
    renderCharacter=function renderCharacterV07111(){
      const result=baseRenderCharacter.apply(this,arguments);
      queueMicrotask(installMenuButton);
      return result;
    };
  }

  if(typeof openAccountModal==='function'){
    const baseOpenAccountModal=openAccountModal;
    openAccountModal=async function openAccountModalV07111(){
      const result=await baseOpenAccountModal.apply(this,arguments);
      queueMicrotask(()=>{
        if(typeof els==='undefined'||!els.modalContent||document.getElementById('v07111AccountOrderShortcut'))return;
        const section=document.createElement('section');
        section.id='v07111AccountOrderShortcut';
        section.className='settings-block';
        section.innerHTML='<h3>Charakter-Reihenfolge</h3><p class="notification-note">Bestimme, in welcher Reihenfolge deine Charaktere im Wechselmenü erscheinen.</p><button type="button" class="small-button" data-v07111-account-order>Reihenfolge verwalten</button>';
        els.modalContent.appendChild(section);
        section.querySelector('[data-v07111-account-order]')?.addEventListener('click',openOrderManager);
      });
      return result;
    };
  }

  installStyles();
  installMenuButton();
  setTimeout(installMenuButton,250);
  console.info('[LS Connect] v0.7.11.1 personal character ordering active');
})().catch(error=>console.error('[LS Connect] v0.7.11.1 startup failed',error));
