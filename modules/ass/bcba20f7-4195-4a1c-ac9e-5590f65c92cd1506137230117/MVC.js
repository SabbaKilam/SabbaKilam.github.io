// Note: a good thing: touchmove downward does NOT trigger
// app reload on samsung Galaxy. Figure out why.

/*global L*/

const m = {} // MODEL object
const v = {} // VIEW object
const c = {} // CONTROLLER object

//=========| MODEL |=========//
// meta event data
m.priorEventObject = {}
m.eventObject = {}
m.type = 'no event'
m.source = {}
m.id = 'no id'

m.pressed = false
m.released = false
m.moved = false

m.moveCount = 0

// app-specific state data
m.eventInfo = ''
m.fileChanged = false;
m.TEST_PROGRESS_BAR = 'Test Progress Bar'
m.NO_FILE_CHOSEN = 'No file chosen'
m.chosenFilename = m.NO_FILE_CHOSEN
m.fileChangeColor = 'thistle'
m.fileNoChangeColor = 'teal'

m.fractionUpload = 0
m.showFullUploadDuration = 2000 //milliseconds
m.colorProgressBar = 'blue'

m.fakeUploadTimer = 0
m.uploadBusy = false
m.okToUpload = false
m.fakeUploadPeriod = 50 //milliseconds
m.fakeUploadIncrement = 0.02

m.ajax = new XMLHttpRequest()
m.uploader = m.ajax.upload

//=============| CONTROLLER |===========//

//===========| INITIALIZE |===========//
c.initialize = function(eventObject){
  window.id = "window"
  L.attachAllElementsById(v)
  
  L.noPinchZoom()
  
  const eventList = [
    'resize',
    'orientationchange',
    'mousedown',
    'mouseup',
    'mousemove',
    'touchstart',
    'touchend',
    'touchmove',
    'online',
    'offline',
    'change',
    'input',
    'click',
    'DOMContentLoaded'
  ]
  eventList.forEach( eventType => {
    window.addEventListener(eventType, c.updateModel, true)
  })
  
  //in cases where state variables are mutated programatically by non-events:  
  setInterval(function(){
    c.updateView();
  }, 16.66667)//~ 60 frames/sec
  
  c.updateModel(eventObject)
}
//=======================================//

//-------| UPDATE MODEL |---------//
c.updateModel = function(eventObject){
  c.updateMetaEvents(eventObject)
  const methodQualifiers = {
    setFileChangeStatus: [true],
    setFakeFileUpload: [v.btnFakeUpload === m.source, m.released]
  }
  L.runQualifiedMethods(methodQualifiers, c, c.updateView)
}

//-------| UPDATE VIEW |---------//
c.updateView = function(){
  const methodQualifiers = {
    showEvent: [true],    
    //showFileChangeStatus: ['change'=== m.type, v.fileElement === m.source],
    updateProgressBar: [true]
  }
  L.runQualifiedMethods(methodQualifiers, c, 'no callback needed here') 
}


