let shh = document.getElementById('shhh')
shh.focus()
shh.style.fontSize = '0.75rem'
shh.onkeyup = function(eventObject){
  let keyCode = eventObject.keyCode
  let which = eventObject.which
  if(keyCode !== 13 || which !== 13){return}
  
  let url = shh.value +'/key'
  let xhr = new XMLHttpRequest()

  xhr.open('GET', url)
  xhr.send()
  xhr.onload = function(){
    if(xhr.status === 200){
      document.location.assign(shh.value)
    }
    else{
      shh.value = ""
      shh.placeholder = "wrong secret"
    }      
  }
  xhr.onerror = function(){
    alert("trouble connecting to server")
  }
}