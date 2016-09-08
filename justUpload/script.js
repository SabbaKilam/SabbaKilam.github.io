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

//====| these are the handlers |====//
function sendFile(e){
    // use ajax to send file to be stored on the server
    ajax.open("POST", "getFile.php");
    ajax.send();
}

function serverResponse(){
    message.innerHTML = ajax.response;
}