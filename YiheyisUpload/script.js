// wrapper for a long method name
function id(idString){
    return document.getElementById(idString);
}

//====| gather all the players |====//
var fileElement = id("fileElement");
var progressBar = id("progressBar");
// make an xhr agent
var ajax = new XMLHttpRequest();

//====| handle all events |====//
ajax.onload = showMessage;
fileElement.onchange = sendFile;


//====| event handler functions |====//
//handler to show server's message
function showMessage(){
    alert(ajax.response);
}
//handler to upload a file
function sendFile(){
    /*
        get the chosen file and its name
    */
    var file = fileElement.files[0];
    var filename = file.name;
    
    /*
        Open a communication channel to POST to the server,
        set a filename header, and
        send the file.
    */
    ajax.open("POST", "getFile.php");
    ajax.setRequestHeader("filename", filename );
    ajax.send(file);    
}



