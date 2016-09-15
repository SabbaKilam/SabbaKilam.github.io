//====| id wrapper |=====//
function id(idString){
    return document.getElementById(idString);
}

//====| gather all the players (global variables)|========//
var fileElement = id("fileElement");
var progressBar = id("progressBar");
var message = id("message");
var ajax = new XMLHttpRequest();
var fraction = 0;
var otherFraction = 1 - fraction;
var testObject = {
	song1: {
		artist: "Adele",
		song: "Hi there"
	},
	song2: {
		artist: "LLKoolJ",
		song: "smoke 'em"
	},
	song3: {
		artist: "snoopDog",
		song: "going up!"
	}
}

//====| handle the events |====//
fileElement.onchange = sendFile;
ajax.onload = serverResponse;
ajax.upload.onprogress = showProgress;
window.onload = function(){
    resizeStuff();
    saveOurObject(); // saves the test object to the server
};
window.onresize = resizeStuff;

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
    fraction = top / bottom;
    var pct = 100 * fraction;
    
    //show percentage uploaded
    message.innerHTML = pct.toFixed(0) + "%";
    
    //show progress on progress bar
    var totalWidth = window.innerWidth;
    var leftBorderWidth = fraction * totalWidth;
    
    // resize left border of progress bar
    progressBar.style.borderLeft = leftBorderWidth + "px solid red";
    
    // resize progressBar as the remainder of the fraction
    otherFraction = 1 - fraction; //what remains after the fraction
    progressBar.style.width = otherFraction * totalWidth + "px";
}

function resizeStuff(){
    var totalWidth = window.innerWidth;
    var leftBorderWidth = fraction * totalWidth;    
    // adjust left border and width of progress bar based on global variables
    progressBar.style.borderLeft = leftBorderWidth + "px solid red"; 
    progressBar.style.width = otherFraction * totalWidth + "px";
}

function saveOurObject(){
    /*
        1. stringify our test object
        2. make an ajax agent to send it to server
        3. send the data to be handled at the server by a php script
    */
    //1.
    var dataString = JSON.stringify(testObject);
    var dataObject = new FormData(); // create a data-holding vehicle

    //2.
    var saveOurString = new XMLHttpRequest();
    
    //3.
    saveOurString.open("POST", "saveJSON.php");
    dataObject.append("data", dataString);
    dataObject.append("filename", "musicList");
    saveOurString.send(dataObject);
    
    //4. wait for and show response from server
    saveOurString.onload = function(){
        message.innerHTML = ("Data you gave me: " + saveOurString.response);
    };
}