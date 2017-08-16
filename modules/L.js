//improved-library-abbas
var L = {}
L.styles = function(styleString){
  let keyValue = styleString.split(':')
  this.style[keyValue[0].trim()] = keyValue[1].trim()
  return this.styles  
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