/* LS Connect v0.7.10.10 – compact company-channel previews by rendered height */
const LS_CONNECT_V071010_VERSION='0.7.10.10';

(function v071010InstallStyles(){
  if(document.getElementById('v071010-styles'))return;
  const style=document.createElement('style');style.id='v071010-styles';style.textContent=`
    .v07108-post-body.v071010-preview{max-height:220px!important;overflow:hidden!important;position:relative}
    .v07108-post-body.v071010-preview:after{content:'';position:absolute;left:0;right:0;bottom:0;height:64px;pointer-events:none;background:linear-gradient(transparent,var(--panel-2))}
    .v071010-more{display:inline-flex;align-items:center;gap:6px;margin:6px 0 1px;padding:5px 0;border:0;background:transparent;color:var(--accent);font:inherit;font-weight:850;cursor:pointer}
    .v071010-more:hover{text-decoration:underline}.v071010-more:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:4px}
    @media(max-width:700px){.v07108-post-body.v071010-preview{max-height:176px!important}.v07108-post-body.v071010-preview:after{height:54px}.v071010-more{margin-top:5px}}
  `;document.head.appendChild(style);
})();

function v071010Normalize(value){
  return String(value||'').replace(/\r/g,' ')
    .replace(/(^|\s)#{1,6}\s+/g,'$1')
    .replace(/(^|\s)>\s*/g,'$1')
    .replace(/(^|\s)[-*]\s+/g,'$1')
    .replace(/\*\*|__|`/g,'')
    .replace(/(^|\s)[*_]([^*_\n]+)[*_](?=\s|$)/g,'$1$2')
    .replace(/\s+/g,' ').trim().toLowerCase();
}
function v071010VisiblePosts(posts){return (posts||[]).filter(p=>p&&!p.deleted_at);}
function v071010CandidateCards(root){
  if(!root)return [];
  const direct=[...root.querySelectorAll('.v07108-channel-post')];
  if(direct.length)return direct;
  return [...root.querySelectorAll('article,[data-post-id],[data-channel-post-id],.channel-post,.channel-post-card,.channel-post-item,.channel-feed-item')]
    .filter(el=>!el.closest('.v07108-composer-shell')&&!el.classList.contains('v07108-channel-header'));
}
function v071010FindBody(card,post){
  if(!card)return null;
  const existing=card.querySelector('.v07108-post-body');if(existing)return existing;
  if(typeof v07109FindBody==='function'){const found=v07109FindBody(card,post);if(found)return found;}
  const needle=v071010Normalize(post?.body).slice(0,55);
  const nodes=[...card.querySelectorAll('.channel-post-body,.channel-post-text,.post-body,.post-text,p,div')]
    .filter(el=>!el.closest('button')&&!el.querySelector('button')&&!el.classList.contains('v07108-channel-meta'));
  return nodes.find(el=>needle&&v071010Normalize(el.textContent).includes(needle))||null;
}
function v071010RemoveOldMore(bodyEl){
  if(!bodyEl)return;
  let next=bodyEl.nextElementSibling;
  while(next&&(next.classList?.contains('v07108-more')||next.classList?.contains('v071010-more'))){const remove=next;next=next.nextElementSibling;remove.remove();}
  bodyEl.classList.remove('v07108-collapsed','v071010-preview');
}
function v071010ApplyRenderedCollapse(bodyEl){
  if(!bodyEl)return;
  v071010RemoveOldMore(bodyEl);
  requestAnimationFrame(()=>{
    if(!bodyEl.isConnected)return;
    const mobile=matchMedia('(max-width:700px)').matches;
    const limit=mobile?176:220;
    const fullHeight=Math.ceil(bodyEl.scrollHeight);
    if(fullHeight<=limit+18)return;
    bodyEl.classList.add('v071010-preview');
    const button=document.createElement('button');button.type='button';button.className='v071010-more';button.textContent='Mehr anzeigen';button.setAttribute('aria-expanded','false');
    button.addEventListener('click',()=>{
      const collapsed=bodyEl.classList.toggle('v071010-preview');
      button.textContent=collapsed?'Mehr anzeigen':'Weniger anzeigen';button.setAttribute('aria-expanded',collapsed?'false':'true');
    });
    bodyEl.insertAdjacentElement('afterend',button);
  });
}
function v071010RenderPost(card,post){
  if(!card||!post)return false;
  card.classList.add('v07108-channel-post');if(post.id)card.dataset.v07108PostId=post.id;
  const bodyEl=v071010FindBody(card,post);if(!bodyEl)return false;
  const source=String(post.body||'');
  const renderer=typeof v07109Markdown==='function'?v07109Markdown:(typeof v07108Markdown==='function'?v07108Markdown:null);
  if(renderer){bodyEl.classList.add('v07108-post-body');bodyEl.innerHTML=renderer(source);bodyEl.dataset.v07109Source=source;}
  card.dataset.v07109Enhanced='1';card.dataset.v071010Enhanced='1';
  v071010ApplyRenderedCollapse(bodyEl);
  return true;
}
function v071010PairPostsToCards(root,posts){
  const cards=v071010CandidateCards(root),used=new Set(),pairs=[];
  for(const post of posts){
    let card=null;
    if(post.id)card=cards.find(c=>!used.has(c)&&String(c.dataset.v07108PostId||c.dataset.postId||c.dataset.channelPostId||'')===String(post.id));
    if(!card&&typeof v07109FindCard==='function'){const found=v07109FindCard(root,post);if(found&&!used.has(found))card=found;}
    if(!card){const needle=v071010Normalize(post.body).slice(0,64);if(needle)card=cards.find(c=>!used.has(c)&&v071010Normalize(c.textContent).includes(needle));}
    if(card){used.add(card);pairs.push([post,card]);}else pairs.push([post,null]);
  }
  const unresolved=pairs.filter(([,card])=>!card),remaining=cards.filter(c=>!used.has(c));
  if(unresolved.length&&unresolved.length===remaining.length){unresolved.forEach((pair,i)=>{pair[1]=remaining[i];used.add(remaining[i]);});}
  return pairs;
}
function v071010RefreshChannel(postsOverride=null){
  const root=typeof els!=='undefined'?els.modalContent:null;
  if(!root||!root.classList.contains('v07108-channel-content'))return;
  const posts=v071010VisiblePosts(postsOverride||state.v071010LastChannelPosts||state.channelPosts||[]);
  const pairs=v071010PairPostsToCards(root,posts);
  for(const [post,card] of pairs)if(card)v071010RenderPost(card,post);
}

state.v071010LastChannelPosts=state.v071010LastChannelPosts||null;
if(typeof v07RenderChannelPosts==='function'){
  const v071010RenderBase=v07RenderChannelPosts;
  v07RenderChannelPosts=function v07RenderChannelPostsV071010(ch,posts){
    state.v071010LastChannelPosts=v071010VisiblePosts(posts);
    const result=v071010RenderBase.apply(this,arguments);
    queueMicrotask(()=>v071010RefreshChannel(state.v071010LastChannelPosts));
    setTimeout(()=>v071010RefreshChannel(state.v071010LastChannelPosts),100);
    return result;
  };
}
if(typeof openChannelView==='function'){
  const v071010OpenBase=openChannelView;
  openChannelView=async function openChannelViewV071010(){const result=await v071010OpenBase.apply(this,arguments);requestAnimationFrame(()=>v071010RefreshChannel());setTimeout(()=>v071010RefreshChannel(),150);return result;};
}

let v071010RefreshQueued=false;
const v071010Observer=new MutationObserver(()=>{
  if(!document.getElementById('modal')?.classList.contains('v07108-channel-modal')||v071010RefreshQueued)return;
  v071010RefreshQueued=true;requestAnimationFrame(()=>{v071010RefreshQueued=false;v071010RefreshChannel();});
});
if(document.body)v071010Observer.observe(document.body,{childList:true,subtree:true});
window.addEventListener('resize',()=>{if(document.getElementById('modal')?.classList.contains('v07108-channel-modal'))v071010RefreshChannel();},{passive:true});
setTimeout(()=>v071010RefreshChannel(),350);

const v071010ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v071010ChangelogTarget&&!v071010ChangelogTarget.some(x=>x.version===LS_CONNECT_V071010_VERSION))v071010ChangelogTarget.unshift({version:LS_CONNECT_V071010_VERSION,title:'Kanalbeiträge kompakter dargestellt',items:['Die Kürzung richtet sich jetzt nach der tatsächlich gerenderten Beitragshöhe statt nur nach Zeichen oder Quelltextzeilen','Auch stark umbrochene Beiträge werden zuverlässig platzsparend eingeklappt','Ältere Beiträge erhalten einen zusätzlichen Reihenfolge-Fallback und werden zuverlässiger mit Markdown formatiert','Mehr anzeigen und Weniger anzeigen reagieren sauber auf Desktop- und Mobilbreiten']});
console.info('[LS Connect] v0.7.10.10 rendered-height channel compactness hotfix active');
