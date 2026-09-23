/* LS Connect v0.9.1.5 – "Was ist neu?" release date/time */
(function v0915WhatsNewReleaseTime(){
  if(window.__LS_CONNECT_WHATS_NEW_TIME_V0915__)return;
  window.__LS_CONNECT_WHATS_NEW_TIME_V0915__=true;

  const KNOWN_RELEASE_TIMES={
    '0.9.1.3':'2026-09-03T00:06:05+02:00',
    '0.9.1.1':'2026-08-31T19:40:04+02:00',
    '0.9.1':'2026-08-31T19:33:05+02:00',
    '0.7.11.2':'2026-08-30T00:09:40+02:00',
    '0.7.11.1':'2026-08-23T01:10:32+02:00',
    '0.7.11':'2026-08-22T22:52:06+02:00'
  };

  function installStyles(){
    if(document.getElementById('v0915-whats-new-time-styles'))return;
    const style=document.createElement('style');
    style.id='v0915-whats-new-time-styles';
    style.textContent=`
      .changelog-release-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin:5px 0 9px;color:var(--muted);font-size:.78rem}
      .changelog-release-meta time{display:inline-flex;align-items:center;gap:5px;padding:3px 7px;border:1px solid var(--border);border-radius:999px;background:var(--panel-2)}
      .changelog-release-meta time::before{content:'🕒';font-size:.72rem}
      @media(max-width:700px){.changelog-release-meta{font-size:.74rem}.changelog-release-meta time{padding:3px 6px}}
    `;
    document.head.appendChild(style);
  }

  function releaseTimestamp(release){
    const raw=release?.released_at||release?.releasedAt||release?.promoted_at||KNOWN_RELEASE_TIMES[String(release?.version||'')]||null;
    if(!raw)return null;
    const date=new Date(raw);
    if(Number.isNaN(date.getTime()))return null;
    return {raw:String(raw),date};
  }

  function formatReleaseTimestamp(release){
    const value=releaseTimestamp(release);
    if(!value)return null;
    return {
      raw:value.raw,
      text:new Intl.DateTimeFormat('de-DE',{
        day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'
      }).format(value.date)
    };
  }

  function localChangelog(){
    if(typeof V07_LOCAL_CHANGELOG!=='undefined'&&Array.isArray(V07_LOCAL_CHANGELOG))return V07_LOCAL_CHANGELOG;
    if(typeof V076_LOCAL_CHANGELOG!=='undefined'&&Array.isArray(V076_LOCAL_CHANGELOG))return V076_LOCAL_CHANGELOG;
    return [];
  }

  async function loadChangelog(){
    let releases=localChangelog();
    try{
      const source=typeof LS_CONNECT_CHANGELOG_SOURCE!=='undefined'
        ? LS_CONNECT_CHANGELOG_SOURCE
        : 'https://raw.githubusercontent.com/Phil-Walker93/LS-Connect-Updates/main/changelog.json';
      const response=await fetch(`${source}${source.includes('?')?'&':'?'}t=${Date.now()}`,{cache:'no-store'});
      if(response.ok){
        const payload=await response.json();
        if(Array.isArray(payload?.releases)&&payload.releases.length)releases=payload.releases;
      }
    }catch(error){
      console.warn('[LS Connect] Was-ist-neu Zeitstempel: zentraler Changelog nicht erreichbar, lokaler Fallback aktiv.',error);
    }
    return Array.isArray(releases)?releases:[];
  }

  function releaseHtml(release,index){
    const timestamp=formatReleaseTimestamp(release);
    const meta=timestamp
      ? `<div class="changelog-release-meta"><time datetime="${escapeHtml(timestamp.raw)}">${escapeHtml(timestamp.text)} Uhr</time></div>`
      : '';
    const items=release?.items||release?.notes||[];
    return `<section class="changelog-release ${index===0?'latest':''}">
      <div class="changelog-version"><strong>v${escapeHtml(release?.version||'—')}</strong>${index===0?'<span>AKTUELL</span>':''}</div>
      <h3>${escapeHtml(release?.title||'Update')}</h3>
      ${meta}
      <ul>${items.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </section>`;
  }

  async function openChangelogWithReleaseTime(){
    const releases=await loadChangelog();
    openModal('Was ist neu?',`<div class="changelog-list">${releases.map(releaseHtml).join('')}</div>`);
  }

  function install(){
    installStyles();
    if(typeof openModal!=='function'||typeof escapeHtml!=='function')return false;
    openChangelogModal=openChangelogWithReleaseTime;
    window.__LS_CONNECT_WHATS_NEW_TIME_FORMATTER__=formatReleaseTimestamp;
    console.info('[LS Connect] Was ist neu zeigt jetzt Release-Datum und Uhrzeit.');
    return true;
  }

  if(install())return;
  let attempts=0;
  const timer=setInterval(()=>{
    attempts+=1;
    if(install()||attempts>=40)clearInterval(timer);
  },250);
})();