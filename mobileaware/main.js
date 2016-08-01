//make a wrapper for document.getElementById();
function id(idString){
    return document.getElementById(idString);
}
// Gather our elements by id
var remPixels = id("remPixels");

//make handler for window resize and loading
function adjustRem(){
    document.documentElement.style.fontSize = window.innerWidth/50 + "px";
    //try to get root font size (rem)
    var rem = id("oneRem").getBoundingClientRect().width;
    //try to show what it is
    remPixels.innerHTML = "Root ems = " + rem.toFixed(2);
}

//Assign the handler to window.resize and load events
window.onload = adjustRem;
window.onresize =  adjustRem;