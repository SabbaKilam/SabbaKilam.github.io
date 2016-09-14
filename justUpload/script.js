//====| id wrapper |=====//
function id(idString){
    return document.getElementById(idString);
}

//====| gather all the players |========//
var fileElement = id("fileElement");
var progressBar = id("progressBar");
var message = id("message");
var ajax = new XMLHttpRequest();

//====| handle the events |====//
fileElement.onchange = sendFile;
ajax.onload = serverResponse;
ajax.upload.onprogress = showProgress;

//====| these are the handlers |====//
function sendFile(e){
    var file = e.target.files[0];
    var filename = file.name;
    // use ajax to send file to be stored on the server
    ajax.open("POST", "getFile.php");
    ajax.setRequestHeader("filename", filename);
    ajax.send(file);
}

function serverResponse(){
    message.innerHTML = ajax.response;
}

function showProgress(e){
    var top =  e.loaded;
    var bottom = e.total;
    var fraction = top / bottom;
    var pct = 100 * fraction;
    
    message.innerHTML = pct.toFixed(0) + "%";
    
}