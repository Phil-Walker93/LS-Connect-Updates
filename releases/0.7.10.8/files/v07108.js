/* LS Connect v0.7.10.8 – company channel readability redesign */
const LS_CONNECT_V07108_VERSION='0.7.10.8';

(function v07108InstallStyles(){
  if(document.getElementById('v07108-styles'))return;
  const style=document.createElement('style');style.id='v07108-styles';style.textContent=`
    #modal.v07108-channel-modal{width:min(900px,calc(100vw - 48px));max-height:min(90dvh,980px);overflow:hidden}
    #modal.v07108-channel-modal .modal-content.v07108-channel-content{overflow-y:auto!important;overflow-x:hidden!important;max-height:calc(min(90dvh,980px) - 64px);padding:14px 16px 20px;scrollbar-gutter:stable}
    #modal.v07108-channel-modal .v07108-feed{overflow:visible!important;max-height:none!important;height:auto!important;min-height:0}
    .v07108-channel-header{position:sticky;top:-14px;z-index:6;display:flex;align-items:center;justify-content:space-between;gap:14px;margin:-14px -16px 14px;padding:13px 16px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--panel) 96%,transparent);backdrop-filter:blur(12px)}
    .v07108-channel-identity{display:flex;align-items:center;gap:11px;min-width:0}.v07108-channel-avatar{width:44px;height:44px;flex:0 0 44px;border-radius:13px;display:grid;place-items:center;overflow:hidden;border:1px solid var(--border);background:var(--panel-2);font-weight:900}.v07108-channel-avatar img{width:100%;height:100%;object-fit:cover}
    .v07108-channel-meta{display:grid;gap:2px;min-width:0}.v07108-channel-meta strong{font-size:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v07108-channel-meta small{color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v07108-channel-header-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}
    .v07108-composer-shell{margin:0 0 14px;border:1px solid var(--border);border-radius:14px;background:var(--panel-2);overflow:hidden}.v07108-composer-toggle{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 13px;border:0;background:transparent;color:var(--text);font:inherit;font-weight:800;cursor:pointer}.v07108-composer-toggle:hover{background:color-mix(in srgb,var(--accent) 8%,transparent)}.v07108-composer-toggle span:last-child{color:var(--muted);font-size:.8rem}.v07108-composer-shell form{margin:0!important;padding:0 12px 12px}.v07108-composer-shell.v07108-collapsed form{display:none!important}
    .v07108-channel-post{position:relative;margin:0 0 14px!important;padding:14px!important;border:1px solid var(--border)!important;border-radius:15px!important;background:var(--panel-2)!important;box-shadow:0 7px 24px rgba(0,0,0,.08)}.v07108-channel-post:last-child{margin-bottom:2px!important}.v07108-channel-post:hover{border-color:color-mix(in srgb,var(--accent) 28%,var(--border))!important}
    .v07108-post-body{position:relative;line-height:1.58;overflow-wrap:anywhere}.v07108-post-body.v07108-collapsed{max-height:14.2em;overflow:hidden}.v07108-post-body.v07108-collapsed:after{content:'';position:absolute;left:0;right:0;bottom:0;height:4.2em;pointer-events:none;background:linear-gradient(transparent,var(--panel-2))}.v07108-more{margin:8px 0 2px;padding:5px 0;border:0;background:transparent;color:var(--accent);font:inherit;font-weight:800;cursor:pointer}.v07108-more:hover{text-decoration:underline}
    .v07108-md-h2{margin:15px 0 8px;font-size:1.12rem;line-height:1.3}.v07108-md-h3{margin:13px 0 7px;font-size:1rem;line-height:1.35}.v07108-md-p{margin:0 0 10px}.v07108-md-quote{margin:10px 0;padding:9px 11px;border-left:3px solid var(--accent);border-radius:0 9px 9px 0;background:color-mix(in srgb,var(--accent) 8%,transparent);font-style:italic}.v07108-md-hr{height:1px;border:0;background:var(--border);margin:14px 0}.v07108-md-li{display:flex;gap:8px;margin:4px 0;padding-left:4px}.v07108-md-li:before{content:'•';color:var(--accent);font-weight:900}.v07108-md-gap{height:4px}
    .v07108-channel-post img{display:block;max-width:100%!important;width:auto!important;height:auto!important;max-height:520px!important;object-fit:contain!important;margin:10px auto;border-radius:12px;cursor:zoom-in;background:var(--panel)}
    .v07108-image-viewer{position:fixed;inset:0;z-index:2200;display:grid;place-items:center;padding:24px;background:rgba(2,6,23,.86);backdrop-filter:blur(8px);cursor:zoom-out}.v07108-image-viewer img{max-width:min(1200px,96vw);max-height:92dvh;object-fit:contain;border-radius:14px;box-shadow:0 30px 90px rgba(0,0,0,.55)}
    @media(max-width:700px){#modal.v07108-channel-modal{width:100vw;height:100dvh;max-height:100dvh;border-radius:0!important}#modal.v07108-channel-modal .modal-content.v07108-channel-content{max-height:calc(100dvh - 58px);padding:10px 10px max(18px,env(safe-area-inset-bottom));scrollbar-gutter:auto}.v07108-channel-header{top:-10px;margin:-10px -10px 10px;padding:10px}.v07108-channel-avatar{width:40px;height:40px;flex-basis:40px}.v07108-channel-header-actions{gap:5px}.v07108-channel-post{padding:12px!important;margin-bottom:10px!important}.v07108-channel-post img{max-height:56dvh!important}.v07108-post-body.v07108-collapsed{max-height:12.8em}}
  `;document.head.appendChild(style);
})();

function v07108Escape(value){return typeof escapeHtml==='function'?escapeHtml(String(value??'')):String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function v07108Inline(text){
  let s=v07108Escape(text);
  s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/__([^_]+)__/g,'<strong>$1</strong>');
  s=s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g,'$1<em>$2</em>').replace(/(^|[^_])_([^_\n]+)_(?!_)/g,'$1<em>$2</em>');
  return s;
}
function v07108Markdown(text){
  const lines=String(text||'').replace(/\r/g,'').split('\n');const out=[];
  for(const raw of lines){const line=raw.trimEnd(),trim=line.trim();
    if(!trim){out.push('<div class="v07108-md-gap"></div>');continue;}
    if(/^---+$/.test(trim)){out.push('<hr class="v07108-md-hr">');continue;}
    let m;if((m=trim.match(/^###\s+(.+)/))){out.push(`<h3 class="v07108-md-h3">${v07108Inline(m[1])}</h3>`);continue;}
    if((m=trim.match(/^##\s+(.+)/))){out.push(`<h2 class="v07108-md-h2">${v07108Inline(m[1])}</h2>`);continue;}
    if((m=trim.match(/^>\s*(.+)/))){out.push(`<blockquote class="v07108-md-quote">${v07108Inline(m[1])}</blockquote>`);continue;}
    if((m=trim.match(/^[-*]\s+(.+)/))){out.push(`<div class="v07108-md-li"><span>${v07108Inline(m[1])}</span></div>`);continue;}
    out.push(`<p class="v07108-md-p">${v07108Inline(line)}</p>`);
  }
  return out.join('');
}
function v07108Initials(value){return String(value||'LS').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'LS';}
function v07108ChannelAvatar(ch){const url=ch?.resolved_avatar_url||ch?.publisher_avatar_url||ch?.avatar_url||'';return url?`<img src="${v07108Escape(url)}" alt="">`:v07108Escape(v07108Initials(ch?.title));}
function v07108FindPostCard(root,post){
  if(!root||!post)return null;const body=String(post.body||'').trim();const probe=body.replace(/\s+/g,' ').slice(0,70);
  const candidates=[...root.querySelectorAll('article,[data-post-id],[data-channel-post-id],.channel-post,.channel-post-card,.channel-post-item,.channel-feed-item')];
  let found=candidates.find(el=>String(el.dataset.postId||el.dataset.channelPostId||'')===String(post.id||''));
  if(!found&&probe)found=candidates.find(el=>el.textContent.replace(/\s+/g,' ').includes(probe));
  if(!found&&probe){const leaf=[...root.querySelectorAll('p,div')].find(el=>el.children.length<4&&el.textContent.replace(/\s+/g,' ').includes(probe));found=leaf?.closest('article,.channel-post,.channel-post-card,.channel-post-item,.channel-feed-item')||leaf?.parentElement||null;}
  return found;
}
function v07108FindBody(card,post){
  if(!card)return null;const body=String(post?.body||'').trim(),probe=body.replace(/\s+/g,' ').slice(0,70);
  const nodes=[...card.querySelectorAll('p,.channel-post-body,.channel-post-text,.post-body,.post-text,div')].filter(el=>!el.closest('button')&&!el.querySelector('button'));
  return nodes.find(el=>body&&el.textContent.trim()===body)||nodes.find(el=>probe&&el.textContent.replace(/\s+/g,' ').includes(probe))||null;
}
function v07108EnhancePost(card,post){
  if(!card||card.dataset.v07108Enhanced==='1')return;card.dataset.v07108Enhanced='1';card.classList.add('v07108-channel-post');if(post?.id)card.dataset.v07108PostId=post.id;
  const bodyEl=v07108FindBody(card,post);if(bodyEl){bodyEl.classList.add('v07108-post-body');bodyEl.innerHTML=v07108Markdown(post.body||'');const long=String(post.body||'').length>650||String(post.body||'').split('\n').length>9;if(long){bodyEl.classList.add('v07108-collapsed');const more=document.createElement('button');more.type='button';more.className='v07108-more';more.textContent='Mehr anzeigen';more.addEventListener('click',()=>{const collapsed=bodyEl.classList.toggle('v07108-collapsed');more.textContent=collapsed?'Mehr anzeigen':'Weniger anzeigen';});bodyEl.insertAdjacentElement('afterend',more);}}
  card.querySelectorAll('img').forEach(img=>{if(img.dataset.v07108Zoom==='1')return;img.dataset.v07108Zoom='1';img.addEventListener('click',()=>{if(!img.src)return;const viewer=document.createElement('div');viewer.className='v07108-image-viewer';viewer.innerHTML=`<img src="${v07108Escape(img.src)}" alt="Bildansicht">`;viewer.addEventListener('click',()=>viewer.remove());document.body.appendChild(viewer);});});
}
function v07108CommonParent(cards,root){if(!cards.length)return null;let parent=cards[0].parentElement;while(parent&&parent!==root){if(cards.every(c=>parent.contains(c)))return parent;parent=parent.parentElement;}return cards[0].parentElement;}
function v07108InstallComposer(root){
  const form=root?.querySelector('#channelPostForm');if(!form||form.closest('.v07108-composer-shell'))return;
  const shell=document.createElement('section');shell.className='v07108-composer-shell v07108-collapsed';const toggle=document.createElement('button');toggle.type='button';toggle.className='v07108-composer-toggle';toggle.innerHTML='<span>＋ Neuen Beitrag erstellen</span><span>Aufklappen</span>';
  form.parentElement.insertBefore(shell,form);shell.append(toggle,form);toggle.addEventListener('click',()=>{const collapsed=shell.classList.toggle('v07108-collapsed');toggle.firstElementChild.textContent=collapsed?'＋ Neuen Beitrag erstellen':'− Editor schließen';toggle.lastElementChild.textContent=collapsed?'Aufklappen':'Einklappen';if(!collapsed)setTimeout(()=>root.querySelector('#channelPostBody')?.focus(),50);});
}
function v07108InstallHeader(root,ch){
  if(!root||root.querySelector('#v07108ChannelHeader'))return;const header=document.createElement('section');header.id='v07108ChannelHeader';header.className='v07108-channel-header';
  const followers=Number(ch?.follower_count||ch?.followers_count||0);header.innerHTML=`<div class="v07108-channel-identity"><div class="v07108-channel-avatar">${v07108ChannelAvatar(ch)}</div><div class="v07108-channel-meta"><strong>${v07108Escape(ch?.title||'Unternehmenskanal')}</strong><small>@${v07108Escape(ch?.slug||'kanal')} · ${followers.toLocaleString('de-DE')} Follower</small></div></div><div class="v07108-channel-header-actions"></div>`;root.prepend(header);
  const actions=root.querySelector('.channel-view-actions');if(actions){actions.querySelectorAll('button').forEach(btn=>header.querySelector('.v07108-channel-header-actions').appendChild(btn));actions.remove();}
}
function v07108EnhanceChannelView(ch){
  const root=typeof els!=='undefined'?els.modalContent:null,modal=document.getElementById('modal');if(!root||!modal)return;modal.classList.add('v07108-channel-modal');root.classList.add('v07108-channel-content');v07108InstallHeader(root,ch);v07108InstallComposer(root);
  const posts=(state.channelPosts||[]).filter(p=>!p.deleted_at);const cards=[];for(const post of posts){const card=v07108FindPostCard(root,post);if(card){cards.push(card);v07108EnhancePost(card,post);}}
  const feed=v07108CommonParent([...new Set(cards)],root);if(feed)feed.classList.add('v07108-feed');
}
function v07108ClearModalClass(){document.getElementById('modal')?.classList.remove('v07108-channel-modal');if(typeof els!=='undefined')els.modalContent?.classList.remove('v07108-channel-content');}

if(typeof v07RenderChannelPosts==='function'){
  const v07108RenderPostsBase=v07RenderChannelPosts;
  v07RenderChannelPosts=function v07RenderChannelPostsV07108(ch,posts){const result=v07108RenderPostsBase.apply(this,arguments);queueMicrotask(()=>v07108EnhanceChannelView(ch));return result;};
}
if(typeof openChannelView==='function'){
  const v07108OpenChannelBase=openChannelView;
  openChannelView=async function openChannelViewV07108(channelId){const result=await v07108OpenChannelBase.apply(this,arguments);const ch=(state.companyChannels||[]).find(x=>x.id===channelId);requestAnimationFrame(()=>v07108EnhanceChannelView(ch));return result;};
}
if(typeof openModal==='function'){
  const v07108OpenModalBase=openModal;
  openModal=function openModalV07108(){const title=String(arguments[0]||'');if(!/kanal|channel/i.test(title))v07108ClearModalClass();return v07108OpenModalBase.apply(this,arguments);};
}

const v07108ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v07108ChangelogTarget&&!v07108ChangelogTarget.some(x=>x.version===LS_CONNECT_V07108_VERSION))v07108ChangelogTarget.unshift({version:LS_CONNECT_V07108_VERSION,title:'Unternehmenskanäle neu strukturiert',items:['Unternehmenskanäle nutzen auf Desktop mehr Breite und auf Mobilgeräten eine vollflächige Ansicht','Doppelte Scrollbereiche wurden auf eine zentrale Scrollfläche reduziert','Der Editor zum Erstellen neuer Beiträge ist standardmäßig eingeklappt','Beiträge werden als klar getrennte Karten dargestellt','Markdown wie Überschriften, Fetttext, Zitate, Trennlinien und Listen wird formatiert dargestellt','Lange Beiträge werden gekürzt und können über Mehr anzeigen vollständig geöffnet werden','Kanalbilder lassen sich per Klick in einer großen Bildansicht öffnen']});
console.info('[LS Connect] v0.7.10.8 company channel readability patch active');
