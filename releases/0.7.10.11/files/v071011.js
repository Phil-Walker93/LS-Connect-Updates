/* LS Connect v0.7.10.11 – stable company-channel collapse hotfix */
const LS_CONNECT_V071011_VERSION='0.7.10.11';

(function v071011InstallStyles(){
  if(document.getElementById('v071011-styles'))return;
  const style=document.createElement('style');style.id='v071011-styles';style.textContent=`
    .v07108-post-body.v071011-preview{max-height:220px!important;overflow:hidden!important;position:relative}
    .v07108-post-body.v071011-preview:after{content:'';position:absolute;left:0;right:0;bottom:0;height:64px;pointer-events:none;background:linear-gradient(transparent,var(--panel-2))}
    .v071011-more{display:inline-flex;align-items:center;gap:6px;margin:6px 0 1px;padding:5px 0;border:0;background:transparent;color:var(--accent);font:inherit;font-weight:850;cursor:pointer}
    .v071011-more:hover{text-decoration:underline}.v071011-more:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:4px}
    @media(max-width:700px){.v07108-post-body.v071011-preview{max-height:176px!important}.v07108-post-body.v071011-preview:after{height:54px}}
  `;document.head.appendChild(style);
})();

// v0.7.10.10 observed every DOM change including the button it inserted itself.
// Disable that self-triggering observer before installing the stable renderer.
try{if(typeof v071010Observer!=='undefined')v071010Observer.disconnect();}catch(error){console.warn('[LS Connect] v0.7.10.11 observer cleanup',error);}

function v071011SourceKey(source){
  let h=2166136261;
  const s=String(source||'');
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
  return (h>>>0).toString(36);
}
function v071011RemoveMore(bodyEl){
  if(!bodyEl)return;
  let next=bodyEl.nextElementSibling;
  while(next&&(next.classList?.contains('v07108-more')||next.classList?.contains('v071010-more')||next.classList?.contains('v071011-more'))){
    const current=next;next=next.nextElementSibling;current.remove();
  }
  bodyEl.classList.remove('v07108-collapsed','v071010-preview','v071011-preview');
}
function v071011MeasureAndApply(bodyEl,source,{force=false}={}){
  if(!bodyEl||!bodyEl.isConnected)return;
  const key=v071011SourceKey(source);
  const width=Math.max(1,Math.round(bodyEl.getBoundingClientRect().width||bodyEl.clientWidth||0));
  const mobile=matchMedia('(max-width:700px)').matches;
  const limit=mobile?176:220;
  const sameMeasurement=!force
    && bodyEl.dataset.v071011Measured==='1'
    && bodyEl.dataset.v071011SourceKey===key
    && bodyEl.dataset.v071011Width===String(width);
  if(sameMeasurement)return;

  const sourceChanged=bodyEl.dataset.v071011SourceKey!==key;
  if(sourceChanged)bodyEl.dataset.v071011Expanded='0';
  const wasExpanded=bodyEl.dataset.v071011Expanded==='1';

  v071011RemoveMore(bodyEl);
  bodyEl.dataset.v071011Measured='0';
  bodyEl.dataset.v071011SourceKey=key;
  bodyEl.dataset.v071011Width=String(width);

  requestAnimationFrame(()=>{
    if(!bodyEl.isConnected)return;
    const fullHeight=Math.ceil(bodyEl.scrollHeight);
    const shouldCollapse=fullHeight>limit+12;
    bodyEl.dataset.v071011Measured='1';
    bodyEl.dataset.v071011FullHeight=String(fullHeight);
    if(!shouldCollapse)return;

    if(!wasExpanded)bodyEl.classList.add('v071011-preview');
    const button=document.createElement('button');
    button.type='button';button.className='v071011-more';
    button.textContent=wasExpanded?'Weniger anzeigen':'Mehr anzeigen';
    button.setAttribute('aria-expanded',wasExpanded?'true':'false');
    button.addEventListener('click',()=>{
      const currentlyCollapsed=bodyEl.classList.contains('v071011-preview');
      if(currentlyCollapsed){
        bodyEl.classList.remove('v071011-preview');
        bodyEl.dataset.v071011Expanded='1';
        button.textContent='Weniger anzeigen';button.setAttribute('aria-expanded','true');
      }else{
        bodyEl.classList.add('v071011-preview');
        bodyEl.dataset.v071011Expanded='0';
        button.textContent='Mehr anzeigen';button.setAttribute('aria-expanded','false');
      }
    });
    bodyEl.insertAdjacentElement('afterend',button);
  });
}
function v071011RenderPost(card,post,{forceMeasure=false}={}){
  if(!card||!post)return false;
  card.classList.add('v07108-channel-post');
  if(post.id)card.dataset.v07108PostId=post.id;
  const bodyEl=typeof v071010FindBody==='function'?v071010FindBody(card,post):
    (typeof v07109FindBody==='function'?v07109FindBody(card,post):card.querySelector('.v07108-post-body'));
  if(!bodyEl)return false;
  const source=String(post.body||'');
  const sourceChanged=bodyEl.dataset.v07109Source!==source;
  if(sourceChanged){
    const renderer=typeof v07109Markdown==='function'?v07109Markdown:(typeof v07108Markdown==='function'?v07108Markdown:null);
    if(renderer)bodyEl.innerHTML=renderer(source);
    bodyEl.dataset.v07109Source=source;
    bodyEl.dataset.v071011Measured='0';
    bodyEl.dataset.v071011Expanded='0';
  }
  bodyEl.classList.add('v07108-post-body');
  card.dataset.v07109Enhanced='1';card.dataset.v071010Enhanced='1';card.dataset.v071011Enhanced='1';
  v071011MeasureAndApply(bodyEl,source,{force:forceMeasure||sourceChanged});
  return true;
}
function v071011RefreshChannel(postsOverride=null,{forceMeasure=false}={}){
  const root=typeof els!=='undefined'?els.modalContent:null;
  if(!root||!root.classList.contains('v07108-channel-content'))return;
  const posts=typeof v071010VisiblePosts==='function'
    ?v071010VisiblePosts(postsOverride||state.v071010LastChannelPosts||state.channelPosts||[])
    :(postsOverride||state.channelPosts||[]).filter(p=>p&&!p.deleted_at);
  const pairs=typeof v071010PairPostsToCards==='function'
    ?v071010PairPostsToCards(root,posts)
    :posts.map((post,i)=>[post,[...root.querySelectorAll('.v07108-channel-post')][i]||null]);
  for(const [post,card] of pairs)if(card)v071011RenderPost(card,post,{forceMeasure});
}

// Rebind the names already used by the v0.7.10.10 wrappers and resize handler.
try{v071010RenderPost=v071011RenderPost;}catch{}
try{v071010RefreshChannel=function v071010RefreshChannelV071011(postsOverride=null){return v071011RefreshChannel(postsOverride);};}catch{}

// v07RenderChannelPosts/openChannelView already call v071010RefreshChannel dynamically.
// A lightweight delayed refresh is enough; no DOM-wide observer is needed anymore.
setTimeout(()=>v071011RefreshChannel(null,{forceMeasure:true}),180);
setTimeout(()=>v071011RefreshChannel(null,{forceMeasure:true}),500);

let v071011ResizeTimer=null;
window.addEventListener('resize',()=>{
  clearTimeout(v071011ResizeTimer);
  v071011ResizeTimer=setTimeout(()=>v071011RefreshChannel(null,{forceMeasure:true}),120);
},{passive:true});

const v071011ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v071011ChangelogTarget&&!v071011ChangelogTarget.some(x=>x.version===LS_CONNECT_V071011_VERSION))v071011ChangelogTarget.unshift({
  version:LS_CONNECT_V071011_VERSION,
  title:'Kanal-Einklappen stabilisiert',
  items:[
    'Selbsttriggernde Render-Schleife aus v0.7.10.10 entfernt',
    'Mehr anzeigen bleibt nach der Höhenmessung dauerhaft sichtbar',
    'Beiträge werden nur bei geänderten Inhalten neu gerendert',
    'Höhenmessung wird nur bei neuem Inhalt oder geänderter Fensterbreite wiederholt'
  ]
});
console.info('[LS Connect] v0.7.10.11 stable channel collapse hotfix active');
