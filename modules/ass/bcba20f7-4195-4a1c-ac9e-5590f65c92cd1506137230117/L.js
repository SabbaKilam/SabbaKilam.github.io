/*
  Created: ~ May, 2017
  Revised: October 2, 2017 
  Original Filename: L.js 
  Purpose: a small personal re-usable js library for a simple MVC architecture
  Notes: 
*/

var L = {}
L.styles = function(styleString){
  const colonPosition = styleString.indexOf(':');
  const property = styleString.slice(0, colonPosition)
  const value = styleString.slice(colonPosition + 1)
  this.style[property] = value
  
  return this.styles  
}

L.attachAllElementsById = function(here){
    let allElements = document.getElementsByTagName('*')
    let array = []
    array.forEach.call(allElements, function(element)  {
        if(element.id){
            here[element.id] = element
            element.styles = L.styles.bind(element) // attach L's styles() method here         
        }
    })
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
    if(typeof object[functionName] === 'function'){
      object[functionName]()       
    }
    /*
      If the prefix of this function's name is 'set' (for updating the MODEL),
      and there is a similarly named function with a prefix of 'show' (for updating the VIEW),
      then run the 'show' version as well:
    */
    let prefix = functionName.slice(0,3)
    let newFunctionName = 'show' + functionName.slice(3) 
    if(prefix === 'set' && typeof object[newFunctionName] === 'function'){
      object[newFunctionName]()
    }
  }
}

L.stuffedEnvelope = function stuffedEnvelope(contents = { enctype: 'multipart/form-data'}, envelope = new FormData()){
  envelope.stuff = envelope.append;// use the metaphor 'stuff' as an alias for 'append'
  Object.keys(contents).forEach(key => envelope.stuff(key, contents[key]));
  return envelope;
}
