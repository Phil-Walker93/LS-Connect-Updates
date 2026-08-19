/* LS Connect v0.7.10.9 – company channel markdown compatibility hotfix */
const LS_CONNECT_V07109_VERSION='0.7.10.9';

(function v07109InstallStyles(){
  if(document.getElementById('v07109-styles'))return;
  const style=document.createElement('style');style.id='v07109-styles';style.textContent=`
    .v07108-md-h1{margin:4px 0 12px;font-size:1.28rem;line-height:1.25;font-weight:900;letter-spacing:-.01em}
    .v07108-md-h4{margin:11px 0 6px;font-size:.96rem;line-height:1.35;font-weight:850}
    .v07109-md-code{padding:.08em .34em;border:1px solid var(--border);border-radius:6px;background:var(--panel);font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.92em}
    @media(max-width:700px){.v07108-md-h1{font-size:1.15rem;margin-top:2px}}
  `;document.head.appendChild(style);
})();

function v07109Escape(value){return typeof escapeHtml==='function'?escapeHtml(String(value??'')):String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function v07109Inline(text){
  let s=v07109Escape(text);
  s=s.replace(/`([^`]+)`/g,'<code class="v07109-md-code">$1</code>');
  s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/__([^_]+)__/g,'<strong>$1</strong>');
  s=s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g,'$1<em>$2</em>').replace(/(^|[^_])_([^_\n]+)_(?!_)/g,'$1<em>$2</em>');
  return s;
}
function v07109Markdown(text){
  const lines=String(text||'').replace(/\r/g,'').split('\n');const out=[];
  for(const raw of lines){const line=raw.trimEnd(),trim=line.trim();
    if(!trim){out.push('<div class="v07108-md-gap"></div>');continue;}
    if(/^---+$/.test(trim)){out.push('<hr class="v07108-md-hr">');continue;}
    let m;
    if((m=trim.match(/^#\s+(.+)/))){out.push(`<h1 class="v07108-md-h1">${v07109Inline(m[1])}</h1>`);continue;}
    if((m=trim.match(/^##\s+(.+)/))){out.push(`<h2 class="v07108-md-h2">${v07109Inline(m[1])}</h2>`);continue;}
    if((m=trim.match(/^###\s+(.+)/))){out.push(`<h3 class="v07108-md-h3">${v07109Inline(m[1])}</h3>`);continue;}
    if((m=trim.match(/^####\s+(.+)/))){out.push(`<h4 class="v07108-md-h4">${v07109Inline(m[1])}</h4>`);continue;}
    if((m=trim.match(/^>\s*(.+)/))){out.push(`<blockquote class="v07108-md-quote">${v07109Inline(m[1])}</blockquote>`);continue;}
    if((m=trim.match(/^[-*]\s+(.+)/))){out.push(`<div class="v07108-md-li"><span>${v07109Inline(m[1])}</span></div>`);continue;}
    out.push(`<p class="v07108-md-p">${v07109Inline(line)}</p>`);
  }
  return out.join('');
}

if(typeof v07108Markdown==='function')v07108Markdown=v07109Markdown;
if(typeof v07108Inline==='function')v07108Inline=v07109Inline;

function v07109Normalize(value){
  return String(value||'').replace(/\r/g,'').replace(/^#{1,6}\s+/gm,'').replace(/^>\s?/gm,'').replace(/^[-*]\s+/gm,'').replace(/\*\*|__|`/g,'').replace(/(^|\s)[*_]([^*_\n]+)[*_](?=\s|$)/g,'$1$2').replace(/\s+/g,' ').trim().toLowerCase();
}
function v07109FindCard(root,post){
  if(!root||!post)return null;
  if(typeof v07108FindPostCard==='function'){const exact=v07108FindPostCard(root,post);if(exact)return exact;}
  const needle=v07109Normalize(post.body).slice(0,90);if(!needle)return null;
  const candidates=[...root.querySelectorAll('[data-v07108-post-id],article,[data-post-id],[data-channel-post-id],.channel-post,.channel-post-card,.channel-post-item,.channel-feed-item')];
  return candidates.find(el=>v07109Normalize(el.textContent).includes(needle))||null;
}
function v07109FindBody(card,post){
  if(!card)return null;
  const existing=card.querySelector('.v07108-post-body');if(existing)return existing;
  if(typeof v07108FindBody==='function'){const old=v07108FindBody(card,post);if(old)return old;}
  const needle=v07109Normalize(post?.body).slice(0,70);
  const candidates=[...card.querySelectorAll('.channel-post-body,.channel-post-text,.post-body,.post-text,p,div')].filter(el=>!el.closest('button')&&!el.querySelector('button')&&!el.classList.contains('v07108-channel-meta'));
  return candidates.find(el=>needle&&v07109Normalize(el.textContent).includes(needle))||null;
}
function v07109ApplyCollapse(bodyEl,post){
  if(!bodyEl)return;
  let button=bodyEl.nextElementSibling?.classList?.contains('v07108-more')?bodyEl.nextElementSibling:null;if(button)button.remove();
  bodyEl.classList.remove('v07108-collapsed');
  const long=String(post?.body||'').length>650||String(post?.body||'').split('\n').length>9;if(!long)return;
  bodyEl.classList.add('v07108-collapsed');button=document.createElement('button');button.type='button';button.className='v07108-more';button.textContent='Mehr anzeigen';
  button.addEventListener('click',()=>{const collapsed=bodyEl.classList.toggle('v07108-collapsed');button.textContent=collapsed?'Mehr anzeigen':'Weniger anzeigen';});bodyEl.insertAdjacentElement('afterend',button);
}
function v07109RenderPost(card,post){
  if(!card||!post)return false;
  card.classList.add('v07108-channel-post');card.dataset.v07108Enhanced='1';if(post.id)card.dataset.v07108PostId=post.id;
  const bodyEl=v07109FindBody(card,post);if(!bodyEl)return false;
  const source=String(post.body||'');if(bodyEl.dataset.v07109Source===source&&card.dataset.v07109Enhanced==='1')return true;
  bodyEl.classList.add('v07108-post-body');bodyEl.innerHTML=v07109Markdown(source);bodyEl.dataset.v07109Source=source;v07109ApplyCollapse(bodyEl,post);card.dataset.v07109Enhanced='1';return true;
}
function v07109RefreshChannelMarkdown(){
  const root=typeof els!=='undefined'?els.modalContent:null;if(!root||!root.classList.contains('v07108-channel-content'))return;
  const posts=(state.channelPosts||[]).filter(p=>!p.deleted_at);for(const post of posts){const card=v07109FindCard(root,post);if(card)v07109RenderPost(card,post);}
}

if(typeof v07RenderChannelPosts==='function'){
  const v07109RenderBase=v07RenderChannelPosts;
  v07RenderChannelPosts=function v07RenderChannelPostsV07109(){const result=v07109RenderBase.apply(this,arguments);queueMicrotask(v07109RefreshChannelMarkdown);setTimeout(v07109RefreshChannelMarkdown,80);return result;};
}
if(typeof openChannelView==='function'){
  const v07109OpenBase=openChannelView;
  openChannelView=async function openChannelViewV07109(){const result=await v07109OpenBase.apply(this,arguments);requestAnimationFrame(v07109RefreshChannelMarkdown);setTimeout(v07109RefreshChannelMarkdown,120);return result;};
}

const v07109Observer=new MutationObserver(()=>{if(document.getElementById('modal')?.classList.contains('v07108-channel-modal'))queueMicrotask(v07109RefreshChannelMarkdown);});
if(document.body)v07109Observer.observe(document.body,{childList:true,subtree:true});
setTimeout(v07109RefreshChannelMarkdown,300);

const v07109ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v07109ChangelogTarget&&!v07109ChangelogTarget.some(x=>x.version===LS_CONNECT_V07109_VERSION))v07109ChangelogTarget.unshift({version:LS_CONNECT_V07109_VERSION,title:'Kanal-Markdown vervollständigt',items:['Hauptüberschriften mit # werden jetzt korrekt dargestellt','Ältere Kanalbeiträge werden robuster erkannt und erneut formatiert','Realtime nachgeladene Beiträge erhalten automatisch denselben Markdown-Renderer','Markdown unterstützt Überschriften, Fett, Kursiv, Zitate, Listen, Trennlinien und Inline-Code']});
console.info('[LS Connect] v0.7.10.9 company channel markdown compatibility hotfix active');
