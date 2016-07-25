function id(idString){
	return document.getElementById(idString);
}
var url = "https://googledrive.com/host/0B43RjYofYZaJcFQtRTNZSUNrR0E/";
//var url = "https://SabbaKilam.github.io/music/";
var songs = ["whatiam", "wordup", "venicequeen", "healed", "shame", "crazy"];
var speakersArray = ["speakerMute","speakerSoft","speakerMedium","speakerLoud"];
var song = songs[0];
var player = id("player");
var btnPlay = id("btnPlay");
var btnStop = id("btnStop");
var currentTime = id("currentTime");
var duration = id("duration");
var playIcon = "&#9658;";
var pauseIcon = " &#10074;&#10074;";//"&#9612;&#9612;" "&#10073;&#10073;";//"&#x00399;&#x00399; ";//
var stopIcon = "&#9632";
var sliderWidth = 36;
var sliderTime = id("sliderTime");
var timeSlider = id("timeSlider");
var volumeSlider = id("volumeSlider");
var sliderPlay = id("sliderPlay");
var sliderSpeaker = id("sliderSpeaker");
//=====| App STARTS here |====
window.onload = function(){
	document.documentElement.style.fontSize = 2.5 + window.innerWidth/85 + "px";
	window.onresize = function(){
		document.documentElement.style.fontSize = (2.5 + window.innerWidth/85) + "px";
	};
	
	rotateSongsRandomly();
	player.pause();
	showCurrentTimes();
	(function makeButtonsWork(){
		var playing = false;
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
				reduceSize(true);
				sliderPlay.innerHTML = pauseIcon;				
			}
		};
		sliderPlay.onmousedown = btnPlay.click();
		player.onended = function(){
			playing = false;
			btnPlay.innerHTML = "Play " + playIcon;
			reduceSize(false);
			sliderPlay.innerHTML = playIcon;			
			queueNextSong();
			setTimeout(function(){
				btnPlay.innerHTML = "Pause " + pauseIcon;
				reduceSize(true);
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
		(function volumeSliderStuff(){
			var mousedown = false;
			var sliderData = volumeSlider.getBoundingClientRect();			
			volumeSlider.onmousedown = function(e){
				mousedown = true;
				var xDiff = e.clientX - sliderData.left;
				var ratio = xDiff / sliderData.width;
				player.volume = ratio;
				
				var vol = player.volume;
				var fullWidth = sliderData.width;
				if(vol >= 5/6){
					sliderSpeaker.style.background = "url(img/" +
						speakersArray[3] + ".png) " +
						"no-repeat center";
					sliderSpeaker.style.backgroundSize = "contain";
				}
				else if(vol < 5/6  && vol > 1/3){
					sliderSpeaker.style.background = "url(img/" +
						speakersArray[2] + ".png) " +
						"no-repeat center";
					sliderSpeaker.style.backgroundSize = "contain";					
				}
				else if(vol <= 1/3 && vol > 0.065){
					sliderSpeaker.style.background = "url(img/" +
						speakersArray[1] + ".png) " +
						"no-repeat center";
					sliderSpeaker.style.backgroundSize = "contain";					
				}
				else if(vol <= 0.065){
					sliderSpeaker.style.background = "url(img/" +
						speakersArray[0] + ".png) " +
						"no-repeat center";
					sliderSpeaker.style.backgroundSize = "contain";					
					player.mute = true;
					player.volume = 0;
					vol = 0;
				}
				volumeSlider.style.borderLeft = (fullWidth * vol) + "px solid #aaa";
				volumeSlider.style.width = fullWidth - (fullWidth * vol) + "px";				
			};
			sliderSpeaker.onmousedown = function(){
				volumeSlider.style.borderLeft = 0;
				var width = volumeSlider.getBoundingClientRect().width;
				volumeSlider.style.width = width + "px";
				
				sliderSpeaker.style.background = "url(img/" +
					speakersArray[0] + ".png) " +
					"no-repeat center";
				sliderSpeaker.style.backgroundSize = "contain";					
				player.mute = true;
				player.volume = 0;
			};
		})();
		//--------------
	})();
};
//====| App ENDS here  |====

//====| Under The Hood |=====
function rotateSongsRandomly(){
	var rotations = Math.ceil( songs.length*Math.random() ); //ceiling for a least one rotation
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
function getCurrentTime(){
	var currentTime = "00:00";
	var minutes = parseInt(player.currentTime / 60);	
	var seconds = parseInt(player.currentTime % 60);
	if(seconds < 10 ){
		seconds = "0" + seconds;
	}
	currentTime = minutes + ":" + seconds;
	return currentTime;
}
//-------------------
function getDuration(){
	var duration = "00:00";
	var minutes = parseInt(player.duration / 60);	
	var seconds = parseInt(player.duration % 60);
	if(seconds < 10 ){
		seconds = "0" + seconds;
	}
	duration = minutes + ":" + seconds;
	return duration;
}
//-------------------
function showCurrentTimes(){
	var fullWidth = timeSlider.getBoundingClientRect().width
	setInterval(function(){
		var ratio = player.currentTime / player.duration ;
		var	borderLeft = fullWidth * ratio;	
		if(player.duration){
			duration.innerHTML = getDuration();			
		}
		currentTime.innerHTML = getCurrentTime();
		sliderTime.innerHTML = getCurrentTime();
		
		timeSlider.style.borderLeft = (borderLeft) + "px solid #aaa";
		var newWidth = fullWidth - borderLeft;
		timeSlider.style.width = newWidth + "px";
	}, 250);
}
//-------------------
function queueNextSong(){
	songs.push(songs.shift());
	song = songs[0];
	player.src = url +  song + ".mp3";
}










