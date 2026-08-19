/* LS Connect v0.7.7 \u2013 robust image/media upload commit pipeline */
function v077MimeFromFile(file) {
  const direct = String(file?.type || '').toLowerCase().split(';')[0];
  if (direct) return direct;
  const ext = String(file?.name || '').split('.').pop()?.toLowerCase() || '';
  return ({jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',gif:'image/gif',webm:'audio/webm',ogg:'audio/ogg',mp3:'audio/mpeg',mpeg:'audio/mpeg',m4a:'audio/mp4',mp4:'audio/mp4',wav:'audio/wav',pdf:'application/pdf',txt:'text/plain',csv:'text/csv',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})[ext] || 'application/octet-stream';
}

async function v077RemoveStorageObject(bucket, path) {
  if (!path || !db) return;
  try {
    const { error } = await db.storage.from(bucket).remove([path]);
    if (error) console.warn(`[LS Connect] Verwaiste Datei konnte aus ${bucket} nicht entfernt werden.`, error);
  } catch (error) {
    console.warn(`[LS Connect] Storage-Cleanup in ${bucket} fehlgeschlagen.`, error);
  }
}

async function v077VerifyStorageRead(bucket, path) {
  const { data, error } = await db.storage.from(bucket).createSignedUrl(path, 120);
  if (error || !data?.signedUrl) throw error || new Error('Die hochgeladene Datei konnte nicht wieder gelesen werden.');
  return data.signedUrl;
}

function v077ValidateImage(file, maxBytes, label='Bild') {
  if (!file) return null;
  const mime = v077MimeFromFile(file);
  if (!['image/jpeg','image/png','image/webp','image/gif'].includes(mime)) throw new Error(`${label}: Nur JPG, PNG, WEBP oder GIF sind erlaubt.`);
  if (file.size > maxBytes) throw new Error(`${label} darf maximal ${Math.round(maxBytes/1024/1024)} MB gro\u00df sein.`);
  return mime;
}

createCharacter = async function createCharacterV077(event) {
  event.preventDefault();
  const button = $('createCharacterSubmit');
  const payload = {
    name:$('characterName').value.trim(),
    handle:normalizeHandle($('characterHandle').value),
    phone:$('characterPhone').value.trim(),
    bio:$('characterBio').value.trim(),
    account_type:$('characterType').value,
    profile_color:v07SafeHex($('characterColorHex').value)
  };
  if (!/^@[a-z0-9._]{2,30}$/.test(payload.handle)) return showToast('Der Username darf nur a\u2013z, 0\u20139, Punkt und Unterstrich enthalten.','error');
  const file = $('characterAvatarFile')?.files?.[0] || null;
  let mime = null;
  try { if (file) mime = v077ValidateImage(file,2*1024*1024,'Profilbild'); }
  catch (error) { return showToast(error.message,'error'); }
  setBusy(button,true,'Wird erstellt\u2026');
  let uploadedPath = null;
  try {
    if (state.mode === 'demo') {
      const char={...payload,id:`demo-char-${Date.now()}`,sort_order:state.demo.characters.length};
      state.demo.characters.push(char);state.demo.mapping[char.id]=[];state.activeCharacterId=char.id;await loadCharacters();
    } else {
      const { data:id, error } = await db.rpc('create_character_v077',{
        p_name:payload.name,p_handle:payload.handle,p_phone:payload.phone,p_bio:payload.bio,p_account_type:payload.account_type,p_profile_color:payload.profile_color
      });
      if (error) throw error;
      if (!id) throw new Error('Charakter konnte nicht angelegt werden.');
      if (file) {
        const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
        uploadedPath=`${state.user.id}/${id}/avatar-${Date.now()}.${ext}`;
        const up=await db.storage.from('ls-avatars').upload(uploadedPath,file,{upsert:false,contentType:mime});
        if (up.error) throw up.error;
        await v077VerifyStorageRead('ls-avatars',uploadedPath);
        const commit=await db.rpc('set_character_avatar_v077',{p_character_id:id,p_avatar_path:uploadedPath});
        if (commit.error) throw commit.error;
      }
      state.activeCharacterId=id;
      await v077PersistActiveCharacter(id);
      await loadCharacters();
    }
    closeModal();renderAll();v07RenderChannelList();showToast('Charakter erstellt.','success');
  } catch (error) {
    if (uploadedPath) await v077RemoveStorageObject('ls-avatars',uploadedPath);
    showToast(humanizeDbError(error),'error');
  } finally { setBusy(button,false); }
};

saveCharacterProfile = async function saveCharacterProfileV077(event,ch) {
  event.preventDefault();
  const button=$('saveCharacterEdit');
  const name=$('editCharacterName').value.trim(),handle=normalizeHandle($('editCharacterHandle').value),phone=$('editCharacterPhone').value.trim(),bio=$('editCharacterBio').value.trim(),accountType=$('editCharacterType').value;
  const profileColor=v07SafeHex($('editCharacterColorHex').value,'');
  const file=$('editCharacterAvatar')?.files?.[0]||null,removeAvatar=!!$('removeCharacterAvatar')?.checked;
  if(!/^@[a-z0-9._]{2,30}$/.test(handle))return showToast('Der Username darf nur a\u2013z, 0\u20139, Punkt und Unterstrich enthalten.','error');
  if(!profileColor)return showToast('Bitte eine g\u00fcltige HEX-Farbe wie #2563EB eingeben.','error');
  let mime=null;
  try { if(file)mime=v077ValidateImage(file,2*1024*1024,'Profilbild'); }
  catch(error){return showToast(error.message,'error');}
  setBusy(button,true,'Speichere\u2026');
  let newPath=removeAvatar?null:(ch.avatar_path||null),uploadedPath=null;
  try{
    if(state.mode==='demo'){
      Object.assign(ch,{name,handle,phone,bio,account_type:accountType,profile_color:profileColor,avatar_path:null,avatar_url:null});
      const o=state.demo.characters.find(x=>x.id===ch.id);if(o)Object.assign(o,ch);
    } else {
      if(file){
        const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
        uploadedPath=`${state.user.id}/${ch.id}/avatar-${Date.now()}.${ext}`;
        const up=await db.storage.from('ls-avatars').upload(uploadedPath,file,{upsert:false,contentType:mime});if(up.error)throw up.error;
        await v077VerifyStorageRead('ls-avatars',uploadedPath);newPath=uploadedPath;
      }
      const {error}=await db.rpc('update_character_profile_v07',{p_character_id:ch.id,p_name:name,p_handle:handle,p_phone:phone,p_bio:bio,p_account_type:accountType,p_avatar_path:newPath,p_profile_color:profileColor});
      if(error)throw error;
      if((removeAvatar||uploadedPath)&&ch.avatar_path&&ch.avatar_path!==newPath&&v05OwnAvatarPath(ch.avatar_path))await v077RemoveStorageObject('ls-avatars',ch.avatar_path);
    }
    state.avatarUrlCache?.clear?.();
    await loadCharacters();renderAll();v07RenderChannelList();showToast('Charakterprofil aktualisiert.','success');await openCharacterManagerModal();
  }catch(error){if(uploadedPath)await v077RemoveStorageObject('ls-avatars',uploadedPath);throwWithToast(error);}finally{setBusy(button,false);}
};

sendMediaMessage = async function sendMediaMessageV077({ file, messageType, audioDurationMs = null, context = null }) {
  if (state.mode !== 'online') return showToast('Medien sind im Online-Modus verf\u00fcgbar.','info');
  const chat=context?.chat||activeChat(),character=context?.character||activeCharacter(),replyId=context?.replyId??state.replyToMessage?.id??null;
  if(!chat||!character||character.is_suspended)return;
  if(!file||file.size>20*1024*1024)return showToast('Dateien d\u00fcrfen maximal 20 MB gro\u00df sein.','error');
  const mime=v077MimeFromFile(file);
  const allowed=/^(image\/(jpeg|png|webp|gif)|audio\/(webm|ogg|mp4|mpeg|wav)|application\/pdf|text\/(plain|csv)|application\/vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet))$/i.test(mime);
  if(!allowed)return showToast('Dieser Dateityp ist nicht freigegeben.','error');
  const normalizedType=mime.startsWith('image/')?'image':messageType;
  const caption=context?.caption??els.messageInput.value.trim();
  const path=`${chat.id}/${character.id}/${Date.now()}-${safeFileName(file.name||(normalizedType==='audio'?'voice.webm':'file'))}`;
  const upload=await db.storage.from('ls-media').upload(path,file,{upsert:false,contentType:mime});
  if(upload.error)return throwWithToast(upload.error);
  try{
    await v077VerifyStorageRead('ls-media',path);
    const {data:id,error}=await db.rpc('send_media_message_v077',{
      p_conversation_id:chat.id,p_character_id:character.id,p_body:caption,p_reply_to_message_id:replyId,
      p_message_type:normalizedType,p_media_path:path,p_media_name:file.name||(normalizedType==='audio'?'Sprachnachricht':'Datei'),p_media_mime:mime,p_media_size:file.size,p_audio_duration_ms:audioDurationMs
    });
    if(error)throw error;
    if(chat.id===state.activeConversationId&&character.id===state.activeCharacterId)await loadMessages(chat.id);
    els.messageInput.value='';clearReply();await loadChats();renderAll();
    showToast(normalizedType==='audio'?'Sprachnachricht gesendet.':normalizedType==='image'?'Bild gesendet.':'Datei gesendet.','success');
    return id;
  }catch(error){await v077RemoveStorageObject('ls-media',path);throwWithToast(error);}
};

createStory = async function createStoryV077(event) {
  event.preventDefault();
  const me=activeCharacter(),body=$('storyText').value.trim(),file=$('storyFile').files?.[0]||null;
  if(!body&&!file)return showToast('Schreibe einen Status oder w\u00e4hle ein Bild.','error');
  let mediaPath=null,mime=null;
  try{
    if(file){
      mime=v077ValidateImage(file,8*1024*1024,'Story-Bild');
      mediaPath=`${me.id}/story-${Date.now()}-${safeFileName(file.name)}`;
      const upload=await db.storage.from('ls-stories').upload(mediaPath,file,{upsert:false,contentType:mime});if(upload.error)throw upload.error;
      await v077VerifyStorageRead('ls-stories',mediaPath);
    }
    const {error}=await db.rpc('create_story_v077',{p_character_id:me.id,p_body:body,p_media_path:mediaPath,p_media_mime:mime});
    if(error)throw error;
    showToast('Status ver\u00f6ffentlicht \u2013 24 Stunden sichtbar.','success');await openStoriesModal();
  }catch(error){if(mediaPath)await v077RemoveStorageObject('ls-stories',mediaPath);throwWithToast(error);}
};

// Rebind company-channel publishing with the same verified upload -> RPC commit pattern.
v07BindChannelView = function v07BindChannelViewV077(ch) {
  $('channelFollowToggle')?.addEventListener('click',async()=>{const fn=ch.is_following?'leave_company_channel':'join_company_channel';const {error}=await db.rpc(fn,{p_channel_id:ch.id,p_character_id:state.activeCharacterId});if(error)return throwWithToast(error);showToast(ch.is_following?'Kanal verlassen.':'Kanal beigetreten.','success');await v07LoadChannels();openChannelView(ch.id);});
  $('editChannelButton')?.addEventListener('click',()=>openEditChannelModal(ch));
  $('channelPostImage')?.addEventListener('change',e=>{$('channelPostFileName').textContent=e.target.files?.[0]?.name||'';});
  $('channelPostForm')?.addEventListener('submit',async e=>{
    e.preventDefault();const btn=$('publishChannelPost'),body=$('channelPostBody').value.trim(),file=$('channelPostImage').files?.[0]||null;
    if(!body&&!file)return showToast('Schreibe einen Beitrag oder w\u00e4hle ein Bild.','error');
    let mime=null;try{if(file)mime=v077ValidateImage(file,8*1024*1024,'Kanalbild');}catch(error){return showToast(error.message,'error');}
    setBusy(btn,true,'Ver\u00f6ffentliche\u2026');let path=null;
    try{
      if(file){const ext=(file.name.split('.').pop()||'jpg').replace(/[^a-z0-9]/gi,'').toLowerCase()||'jpg';path=`${ch.id}/${ch.publisher_character_id}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;const up=await db.storage.from('ls-channel-media').upload(path,file,{upsert:false,contentType:mime});if(up.error)throw up.error;await v077VerifyStorageRead('ls-channel-media',path);}
      const {error}=await db.rpc('publish_company_channel_post',{p_channel_id:ch.id,p_body:body,p_media_path:path,p_media_mime:mime});if(error)throw error;
      showToast('Beitrag ver\u00f6ffentlicht.','success');await v07LoadChannels();openChannelView(ch.id);
    }catch(error){if(path)await v077RemoveStorageObject('ls-channel-media',path);throwWithToast(error);}finally{setBusy(btn,false);}
  });
  v07BindChannelPostActions(ch);
};

console.info('[LS Connect] v0.7.7 media upload pipeline active');
