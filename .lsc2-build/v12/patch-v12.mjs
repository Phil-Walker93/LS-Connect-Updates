import{readFileSync,writeFileSync,existsSync}from'node:fs';
function rep(p,a,b,l){const s=readFileSync(p,'utf8');if(!s.includes(a))throw Error('v12 missing '+l);writeFileSync(p,s.replace(a,b))}
function block(p,a,b,v,l){const s=readFileSync(p,'utf8'),i=s.indexOf(a),j=s.indexOf(b,i+a.length);if(i<0||j<0)throw Error('v12 block '+l+' '+i+' '+j);writeFileSync(p,s.slice(0,i)+v+s.slice(j))}
const m='src/features/messenger/MessengerHome.tsx';
rep(m,"import { listConversationMessagesV11,listMyConversationsV11,setConversationFavoriteV11,type ConversationMessageV11,type ConversationSummaryV11 } from '../../lib/messenger-v11-api'","import { deleteConversationForMeV12,listArchivedConversationsV12,listConversationMessagesV11,listMyConversationsV11,setConversationArchivedV12,setConversationFavoriteV11,type ConversationMessageV11,type ConversationSummaryV11 } from '../../lib/messenger-v11-api'",'messenger imports');
rep(m,'  const [threads, setThreads] = useState<ConversationSummaryV11[]>([])','  const [threads, setThreads] = useState<ConversationSummaryV11[]>([])\n  const [archivedThreads,setArchivedThreads]=useState<ConversationSummaryV11[]>([])\n  const [showArchived,setShowArchived]=useState(false)','archive states');
rep(m,"  const chatThreads=useMemo(()=>threads.filter(t=>t.kind!=='organization'),[threads])","  const chatThreads=useMemo(()=>threads.filter(t=>t.kind!=='organization'),[threads])\n  const visibleThreads=useMemo(()=>showArchived?archivedThreads.filter(t=>t.kind!=='organization'):chatThreads,[showArchived,archivedThreads,chatThreads])",'visible threads');
block(m,'  const refreshThreads = useCallback(async (preferredId?: string | null) => {','  const refreshMessages = useCallback',readFileSync('refresh-v12.txt','utf8'),'refresh');
rep(m,'  function updateDraft(value: string) {',readFileSync('handlers-v12.txt','utf8'),'chat handlers');
rep(m,'COMMUNICATION · API v1.1.0','COMMUNICATION · API v1.2.0','version');
rep(m,'          <div className="thread-list">','          <div className="archive-switch"><button type="button" className={showArchived?\'archive-toggle is-active\':\'archive-toggle\'} onClick={()=>{setShowArchived(v=>!v);setActiveId(null)}}>Archiviert{archivedThreads.length?\' (\'+archivedThreads.length+\')\':\'\'}</button></div>\n          <div className="thread-list">','archive switch');
rep(m,'{chatThreads.length === 0 ? <div className="empty-state">Noch keine Direkt- oder Gruppenchats.</div> : null}','{visibleThreads.length===0?<div className="empty-state">{showArchived?\'Keine archivierten Chats.\':\'Noch keine Direkt- oder Gruppenchats.\'}</div>:null}','archive empty');
rep(m,'{chatThreads.map((thread)=>(','{visibleThreads.map((thread)=>(','visible rows');
rep(m,'onClick={()=>setActiveId(thread.conversation_id)}','onClick={()=>{if(!showArchived)setActiveId(thread.conversation_id)}}','archived row click');
rep(m,readFileSync('row-old.txt','utf8'),readFileSync('row-new.txt','utf8'),'row actions');
rep(m,'>Medien</button>','>Medien</button>\n                  <button className="secondary-action" type="button" onClick={()=>void changeArchive(activeThread,true)}>Archivieren</button>\n                  <button className="secondary-action conversation-danger" type="button" onClick={()=>void deleteChatPermanently(activeThread)}>Löschen</button>','header chat management');

const c='src/features/community/CommunityHome.tsx';
rep(c,"  const [error, setError] = useState('')","  const [error, setError] = useState('')\n  const [saveNotice,setSaveNotice]=useState('')\n  const saveNoticeTimer=useRef<number|null>(null)",'save state');
rep(c,'  async function savePostEdit(postId: string) {',readFileSync('toggle-saved-v12.txt','utf8'),'toggle saved');
rep(c,'<span className="eyebrow">COMMUNITY · v0.8.0</span>','<span className="eyebrow">COMMUNITY · v1.2.0</span>','community version');
rep(c,"{([['all','Alle'],['following','Folge ich'],['saved','Gespeichert']] as Array<[FeedMode,string]>).map(([id,label]) => (","{([['all','Alle'],['following','Folge ich'],['saved','🔖 Gespeichert']] as Array<[FeedMode,string]>).map(([id,label]) => (",'saved tab');
rep(c,'          {error ? <div className="inline-error community-error">{error}</div> : null}','          {mode===\'saved\'?<div className="saved-gallery-head"><div><strong>🔖 Gespeicherte Beiträge</strong><span>Deine persönliche Post-Galerie – nur für diesen Charakter sichtbar.</span></div><span className="saved-count">{posts.length}</span></div>:null}\n          {saveNotice?<div className="save-toast"><span>{saveNotice}</span>{saveNotice.startsWith(\'Post gespeichert\')?<button type="button" onClick={()=>setMode(\'saved\')}>Galerie öffnen</button>:null}</div>:null}\n          {error ? <div className="inline-error community-error">{error}</div> : null}','saved gallery');
rep(c,'          {!loading && posts.length===0 ? <div className="empty-community">Noch keine Beiträge in diesem Feed.</div> : null}','          {!loading&&posts.length===0?<div className="empty-community">{mode===\'saved\'?\'Noch keine gespeicherten Beiträge. Speichere einen Post mit dem Lesezeichen-Symbol.\':\'Noch keine Beiträge in diesem Feed.\'}</div>:null}','saved empty');
rep(c,'          <div className="feed-list">','          <div className={mode===\'saved\'?\'feed-list saved-feed-list\':\'feed-list\'}>','saved gallery grid');
rep(c,readFileSync('save-old.txt','utf8'),readFileSync('save-new.txt','utf8'),'save button');

writeFileSync('src/styles/app.css',readFileSync('src/styles/app.css','utf8')+'\n'+readFileSync('v12.css','utf8')+'\n');
if(existsSync('src/config/runtime.ts')){let s=readFileSync('src/config/runtime.ts','utf8');s=s.replace(/1\.1\.0/g,'1.2.0').replace(/1\.0\.0/g,'1.2.0');writeFileSync('src/config/runtime.ts',s)}
const pkg=JSON.parse(readFileSync('package.json','utf8'));pkg.version='1.2.0';writeFileSync('package.json',JSON.stringify(pkg,null,2)+'\n');

const fm=readFileSync(m,'utf8'),fc=readFileSync(c,'utf8');
for(const x of ['listArchivedConversationsV12','visibleThreads.map','Archiviert','deleteChatPermanently','COMMUNICATION · API v1.2.0'])if(!fm.includes(x))throw Error('v12 messenger marker '+x);
for(const x of ['COMMUNITY · v1.2.0','saved-gallery-head','toggleSaved(post','🔖 Gespeichert','saved-feed-list'])if(!fc.includes(x))throw Error('v12 community marker '+x);
console.log('v1.2 patch markers OK')