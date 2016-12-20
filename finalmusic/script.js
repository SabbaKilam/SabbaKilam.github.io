var divs = document.getElementsByTagName('div');
var boxes = document.getElementsByClassName('box');
var choices = document.getElementById('choices');
var picture = document.getElementById('picture');
var player = document.getElementById('player');
var songTitle = document.getElementById('songTitle')

var app = divs[0];
var controls = divs[1];

// have window object handle resize event and load event
window.addEventListener("load", flipFlop);
window.addEventListener("resize", flipFlop);

choices.addEventListener("change", playSongShowPicture);


/*
	Event Handler functions below:
*/
function playSongShowPicture(e){
	//choose the correct picture
	var pathToPicture = "pictures/";
	var index = choices.selectedIndex;
	pathToPicture += songs[index].picture + ".png";
	picture.style.background = "url(" + pathToPicture + ") no-repeat center";
	picture.style.backgroundSize = "100% 100%";
	
	//play the correct song
	var pathToSong = "songs/";
	pathToSong += songs[index].song + ".mp3";
	player.src = pathToSong;
	player.play();
	
	//show the correct song title
	songTitle.innerHTML = songs[index].song;
}
//make a resize handler
function flipFlop(evtObj){
  var winWidth = window.innerWidth;
  var winHeight = window.innerHeight;
  if(winWidth >= winHeight){
    makeHorizontal();
  }
  else{
    makeVertical();
  }
  //--helper functions ---
  function makeVertical(){
    //alert("Gotta make it VERTICAL ||||");
    for(var i= 0; i < boxes.length; i++){
      if(boxes[i].classList.contains("horizontal")){
        boxes[i].classList.remove("horizontal");
      }
      boxes[i].classList.add("vertical")
    }
  }
  function makeHorizontal(){
    //alert("Gotta make it HORIZONTAL ----")
    for(var i=0; i < boxes.length; i++){
      if(boxes[i].classList.contains("vertical")){
        boxes[i].classList.remove("vertical");
      }
      boxes[i].classList.add("horizontal");
    }
  }
}
















