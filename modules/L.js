//improved-library-abbas
var L = {}
L.styles = function(styleString){
  let keyValue = styleString.split(':')
  this.style[keyValue[0].trim()] = keyValue[1].trim()
  return this.styles  
}

L.noPinchZoom = function(){
  window.ontouchstart = function(eventObject){
    if(eventObject.touches && eventObject.touches.length > 1){
      eventObject.preventDefault();
    }
  }  
}

L.runQualifiedMethods = function(functionQualifiers, object, runNextUpdate){
  Object
    .keys(functionQualifiers)
    .filter(qualifyFunction)
    .forEach(runFunction)
  if(typeof runNextUpdate === 'function'){runNextUpdate()}
  
  //-----| helpers |-----//
  function qualifyFunction(functionName){
    const isQualified = functionQualifiers[functionName].every( qualifier => qualifier)
    return isQualified
  }
  function runFunction(functionName){
    object[functionName]()
  }
}


L.attachAllElementsById = function(here){
    let allElements = document.getElementsByTagName('*')
    let array = []
    array.forEach.call(allElements, function(element)  {
        if(element.id){
            here[element.id] = element
            element.styles = L.styles.bind(element)          
        }
    })
}