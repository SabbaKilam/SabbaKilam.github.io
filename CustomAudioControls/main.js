/*
	curing visual jitters: 
	* body line-height over 150% (css)
	* resized REM adjustment uses parseInt
	* slider widths in px, not REM after converting
	from rem to px

*/
function id(idString){
	return document.getElementById(idString);
}
var url = "https://googledrive.com/host/0B43RjYofYZaJcFQtRTNZSUNrR0E/";
var imageBase = "https://SabbaKilam.github.io/CustomAudioControls/img/";
//var url = "https://SabbaKilam.github.io/music/";
var songs = ["whatiam", "wordup", "venicequeen", "healed", "shame", "crazy"];
var speakers = ["speakerMute","speakerSoft","speakerMedium","speakerLoud"];
var song = songs[0];
var player = id("player");
var btnPlay = id("btnPlay");
var btnStop = id("btnStop");
var currentTime = id("currentTime");
var duration = id("duration");
var playIcon = "&#9658;";
var pauseIcon = " &#10074;&#10074;";//"&#9612;&#9612;" "&#10073;&#10073;";//"&#x00399;&#x00399; ";//
var stopIcon = "&#9632";
var sliderWidth = 27;
var sliderTime = id("sliderTime");
var timeSlider = id("timeSlider");
var sliderPlay = id("sliderPlay");
var sliderSpeaker = id("sliderSpeaker");
//=====| App STARTS here |====
window.onload = function(){
	adjustRem();
	window.onresize = function(){
		adjustRem();
	};
	sliderSpeaker.style.background = "url("+
		imageBase + speakers[3] + ".png) no-repeat center";
	sliderSpeaker.style.backgroundSize = "contain"	;	
	rotateSongsRandomly();
	player.pause();
	showCurrentTimes();
	(function makeButtonsWork(){
		var playing = false;
		var timeMonitor = 0;
		var smallerFont = "1.30rem";
		var regularFont = "1.5rem";
		var lessPadding = "0.59%";
		var regularPadding = "0.75%";
		btnPlay.onclick = function(){
			if(playing){
				player.pause();
				playing = false;
				btnPlay.innerHTML = "Play " + playIcon;
				reduceSize(false);
				sliderPlay.innerHTML = playIcon;				
			}
			else if(!playing){
				player.play();
				playing = true;
				btnPlay.innerHTML = "Pause " + pauseIcon;
				//reduceSize(true);
				sliderPlay.innerHTML = pauseIcon;				
			}
		};
		player.onended = function(){
			playing = false;
			btnPlay.innerHTML = "Play " + playIcon;
			reduceSize(false);
			sliderPlay.innerHTML = playIcon;			
			queueNextSong();
			setTimeout(function(){
				btnPlay.innerHTML = "Pause " + pauseIcon;
				//reduceSize(true);
				sliderPlay.innerHTML = pauseIcon;				
				player.play();
				playing = true;
			},1000);
		};
		btnStop.onmousedown = function(){
			player.pause();
			playing = false;
			player.currentTime = 0;
			btnPlay.innerHTML = "Play " + playIcon;
			sliderPlay.innerHTML = playIcon;			
			reduceSize(false);			
		};
		//--------------
		function reduceSize(makeSmaller){
			if(makeSmaller){
				btnPlay.style.fontSize = smallerFont;			
				btnPlay.style.paddingTop = lessPadding;
				//btnPlay.style.paddingBottom = lessPadding;
			}
			else{
				btnPlay.style.fontSize = regularFont;			
				btnPlay.style.paddingTop = regularPadding;
				//btnPlay.style.paddingBottom = regularPadding;
			}
		}
		//--------------
		(function(){
			var mousedown = false;
			timeSlider.onmousedown = function(e){
				mousedown = true;
				var sliderData = timeSlider.getBoundingClientRect();
				var xDiff = parseInt(e.clientX - sliderData.left);
				var ratio = xDiff / sliderData.width;
				var newTime = parseInt(ratio * player.duration);
				player.currentTime = newTime;				
			};
			document.onmousemove = function(e){
				if(mousedown){
					var sliderData = timeSlider.getBoundingClientRect();				
					if(e.clientX > sliderData.left && e.clientX < sliderData.right){
						var xDiff = parseInt(e.clientX - sliderData.left);
						var ratio = xDiff / sliderData.width;
						var newTime = parseInt(ratio * player.duration);
						player.currentTime = newTime;
					}
				}
			};
			document.onmouseup = function(){
				mousedown = false;
			};
		})();
		//--------------
		sliderPlay.onmousedown = function(){
			btnPlay.click();
		};
	})();
};
//====| App ENDS here  |====

//====| Under The Hood |=====
//--------------
function getCurrentTime(){
	var currentTime = "00:00";
	var minutes = parseInt(player.currentTime / 60, 10);	
	var seconds = parseInt(player.currentTime % 60, 10);
	if(seconds < 10 ){
		seconds = "0" + seconds;
	}
	currentTime = minutes + ":" + seconds;
	return currentTime;
}		
//--------------

function rotateSongsRandomly(){
	var rawRotations = (songs.length)*Math.random();
	var rotations = Math.ceil( rawRotations );
	//ceiling for a least one rotation
	for(var i = 0; i < rotations; i++){
		rotateOnce();
	}
	song = songs[0];
	player.src = url + song + ".mp3";
	//===| helpers |===
	function rotateOnce(){
		songs.push(songs.shift());
	}
}
//-------------------
function getDuration(){
	var duration = "0:00";
	var minutes = parseInt(player.duration / 60, 10);	
	var seconds = parseInt(player.duration % 60, 10);
	if(!isNaN(seconds) && seconds < 10  ){
		seconds = "0" + seconds;
	}
	if(!isNaN(seconds) && !isNaN(minutes)){
		duration = minutes + ":" + seconds;
	}
	return duration;
}
//-------------------
function showCurrentTimes(){
	setInterval(function(){
		var fullWidthPx = sliderWidth * adjustRem();
		var ratio = player.currentTime / player.duration
		var	borderLeft = parseInt(fullWidthPx * ratio, 10);	
		if(player.duration){
			duration.innerHTML = getDuration();			
		}
		currentTime.innerHTML = getCurrentTime();
		sliderTime.innerHTML = getCurrentTime();
		timeSlider.style.borderLeft = borderLeft + "px solid #8c8c8c";
		timeSlider.style.width = ( fullWidthPx - borderLeft ) + "px";
	}, 250);
}
//-------------------
function queueNextSong(){
	songs.push(songs.shift());
	song = songs[0];
	player.src = url +  song + ".mp3";
}
function adjustRem(){
	var newRem = parseInt(3 + window.innerWidth/100, 10);
	 document.documentElement.style.fontSize = newRem + "px";
	 return newRem;
}









