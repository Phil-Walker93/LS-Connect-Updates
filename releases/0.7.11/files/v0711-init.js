/* LS Connect v0.7.11 – saved design preset compatibility refresh */
(function v0711RefreshSavedPresetOnce(){
  if(typeof v071012LoadServerPreset!=='function')return;
  try{
    if(typeof v071012ServerPresetLoaded!=='undefined')v071012ServerPresetLoaded=false;
    Promise.resolve(v071012LoadServerPreset()).catch(error=>console.warn('[LS Connect] v0.7.11 Design-Preset-Refresh fehlgeschlagen.',error));
  }catch(error){console.warn('[LS Connect] v0.7.11 Design-Preset-Refresh fehlgeschlagen.',error);}
})();
