/* LS Connect v0.7.10.7 – ticket reply field theme hotfix */
const LS_CONNECT_V07107_VERSION='0.7.10.7';

(function v07107InstallStyles(){
  if(document.getElementById('v07107-styles'))return;
  const style=document.createElement('style');
  style.id='v07107-styles';
  style.textContent=`
    /* Ticket reply composer: force LS Connect theme instead of browser default form colors. */
    .v0710-thread-form textarea,
    .v07104-thread-compose textarea,
    #v07104UserTicketForm textarea,
    [data-v07104-admin-start] textarea,
    [data-v07104-admin-send] textarea{
      width:100%;
      box-sizing:border-box;
      min-height:96px;
      padding:11px 12px;
      border:1px solid var(--border);
      border-radius:11px;
      background:var(--panel-2)!important;
      color:var(--text)!important;
      caret-color:var(--accent);
      font:inherit;
      line-height:1.45;
      resize:vertical;
      outline:none;
      -webkit-text-fill-color:var(--text);
      color-scheme:dark light;
    }
    .v0710-thread-form textarea::placeholder,
    .v07104-thread-compose textarea::placeholder,
    #v07104UserTicketForm textarea::placeholder,
    [data-v07104-admin-start] textarea::placeholder,
    [data-v07104-admin-send] textarea::placeholder{
      color:var(--muted)!important;
      opacity:.92;
      -webkit-text-fill-color:var(--muted);
    }
    .v0710-thread-form textarea:focus,
    .v07104-thread-compose textarea:focus,
    #v07104UserTicketForm textarea:focus,
    [data-v07104-admin-start] textarea:focus,
    [data-v07104-admin-send] textarea:focus{
      border-color:var(--accent);
      box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 18%,transparent);
    }
    .v07104-ticket-file-row{color:var(--text);}
    .v07104-ticket-file-row input[type="file"]{
      width:100%;
      box-sizing:border-box;
      min-height:42px;
      padding:6px;
      border:1px solid var(--border);
      border-radius:10px;
      background:var(--panel-2);
      color:var(--text);
      font:inherit;
      color-scheme:dark light;
    }
    .v07104-ticket-file-row input[type="file"]::file-selector-button{
      margin-right:9px;
      padding:7px 10px;
      border:1px solid var(--border);
      border-radius:8px;
      background:var(--panel);
      color:var(--text);
      font:inherit;
      font-weight:700;
      cursor:pointer;
    }
    @media(max-width:700px){
      .v0710-thread-form textarea,
      .v07104-thread-compose textarea,
      #v07104UserTicketForm textarea{
        min-height:110px;
        font-size:16px;
      }
      .v07104-ticket-file-row input[type="file"]{font-size:.86rem;}
    }
  `;
  document.head.appendChild(style);
})();

const v07107ChangelogTarget=typeof V07_LOCAL_CHANGELOG!=='undefined'?V07_LOCAL_CHANGELOG:(typeof V076_LOCAL_CHANGELOG!=='undefined'?V076_LOCAL_CHANGELOG:null);
if(v07107ChangelogTarget&&!v07107ChangelogTarget.some(x=>x.version===LS_CONNECT_V07107_VERSION)){
  v07107ChangelogTarget.unshift({
    version:LS_CONNECT_V07107_VERSION,
    title:'Ticket-Antwortfeld im Dark-Mode repariert',
    items:[
      'Text im Antwortfeld von Ticket-Unterhaltungen ist wieder deutlich sichtbar',
      'Hintergrund, Text, Cursor und Platzhalter folgen jetzt dem LS-Connect-Theme',
      'Der Fokuszustand erhält einen klaren Akzentrahmen',
      'Die Dateiauswahl im Ticket-Antwortbereich wurde ebenfalls an Dark- und Light-Mode angepasst',
      'Mobile Antwortfelder bleiben groß genug und verhindern unnötiges Browser-Zoomen'
    ]
  });
}
console.info('[LS Connect] v0.7.10.7 ticket reply theme hotfix active');
