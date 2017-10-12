/*global L*/
/*global m*/
/*global v*/
/*global c*/

c.updateMetaEvents = function(eventObject){
  m.priorEventObject = m.eventObject
  m.eventObject = eventObject
  m.source = eventObject.target
  m.type = eventObject.type
  m.id = eventObject.target.id
  
  m.pressed = m.type === 'mousedown' || m.type === 'touchstart'
  m.released = m.type === 'mouseup'  || m.type === 'touchend'
  m.moved = m.type === 'mousemove' || m.type === 'touchmove'
  
  m.moveCount = m.moved ? ++m.moveCount : m.moveCount = 0
}

//------------------
c.setFileChangeStatus = function(){
  if(m.type === 'change' && m.source === v.fileElement){
    m.fileChanged = true
  }
  else{
    m.fileChanged = false
  }
}

//------------
c.setFakeFileUpload = function(){
  if (m.uploadBusy){return}
  m.uploadBusy = true
  m.fractionUpload = 0
  m.fakeUploadTimer = setInterval(function(){
    if(m.fractionUpload >= 1){
      clearInterval(m.fakeUploadTimer)
      m.uploadBusy = false
      setTimeout(function(){
        m.fractionUpload = 0        
      }, m.showFullUploadDuration)
    }else{
      m.fractionUpload += m.fakeUploadIncrement
    }
  }, m.fakeUploadPeriod)  
}