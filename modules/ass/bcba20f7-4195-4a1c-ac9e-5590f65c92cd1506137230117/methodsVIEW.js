/*global L*/
/*global m*/
/*global v*/
/*global c*/

//---------------
c.showEvent = function(){
  const moveCount = m.moveCount > 0 ? ` (${m.moveCount})`: ``
  m.eventInfo = `${m.id}, ${m.type}${moveCount}`
  v.info.innerText = m.eventInfo
}

//-----------------
c.showFileChangeStatus= function(){
  if (m.fileChanged){
    v.info.styles('background: ' + m.fileChangeColor)
    m.chosenFilename = v.fileElement.files[0] ? v.fileElement.files[0].name : m.NO_FILE_CHOSEN
    v.info.innerText = m.eventInfo + ' (' + m.chosenFilename+ ')'
    if (m.chosenFilename != m.NO_FILE_CHOSEN){
      m.okToUpload = true
      c.uploadFile()
    }
  }
  else {
    v.info.styles('background: ' + m.fileNoChangeColor)        
  }
}

//-----------
c.updateProgressBar = function(){
  const totalWidth = parseInt(window.innerWidth, 10);
  const borderLeft = parseInt(m.fractionUpload * totalWidth, 10)
  v.progressBar.styles('border-left: ' + borderLeft + 'px solid ' + m.colorProgressBar)  
  if(m.fractionUpload <= 0){
    v.btnFakeUpload.innerHTML = m.TEST_PROGRESS_BAR 
  }else{
    v.btnFakeUpload.innerHTML = parseInt(100 * m.fractionUpload, 10) + '%'     
  }
}
//-------------

c.uploadFile = function(){
  if (m.uploadBusy || m.chosenFilename === m.NO_FILE_CHOSEN || !m.okToUpload){
    return
  }
  //stop repeated uploads:
  m.okToUpload = false
  m.uploadBusy = true
  m.fileChanged = false 
  
  //================================================//
  //https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
  const reader = new FileReader()
  reader.readAsDataURL(v.fileElement.files[0])
  reader.onload = function(){
    const contents = {
      contents: reader.result,
      filename: v.fileElement.files[0].name,
      enctype: 'multipart/form-data'      
    }
    m.ajax.open('POST', 'uploadFile.php')    
    m.ajax.send(L.stuffedEnvelope(contents))
    /*
    const envelope = new FormData();
    envelope.append('contents', reader.result)
    envelope.append('filename', v.fileElement.files[0].name )
    m.ajax.send(envelope)
    */
  }
  reader.onerror = function(error){
    console.log('Error reading file:\n ' + error)
    alert('Error reading file:\n ' + error)
  }
  //================================================//
  m.ajax.addEventListener('load', eventObject => {
    if(m.ajax.status !== 200){
      alert(m.ajax.status + m.ajax.responseText)      
    }
  })
  
  m.ajax.addEventListener('error', eventObject => {
    alert("problem connecting the POST: " + m.ajax.status)
  })
  
  m.uploader.addEventListener('progress', eventObject => { 
    m.fractionUpload = (eventObject.loaded / eventObject.total)
    if(m.fractionUpload >= 1){
      setTimeout(function(){
        m.fractionUpload = 0;
      },m.showFullUploadDuration)      
      //ok to upload on file change:
      m.uploadBusy = false; 
      m.okToUpload = true;         

    }
  })
}