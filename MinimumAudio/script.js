//The only global variable:
var $ = {
  player: document.createElement("audio"),
  timeMouseIsDown: false,
  volumeMouseIsDown: false,
  pauseIcon: "Pause &#10074;&#10074;",
  playIcon: "Play &#9658;",
  playRequested: true,
  speakerIsClicked: false,
  mutedVolume: 1/3,
  secToMinSec: function secToMinSec(seconds){
  	//-----------------------
  	if(typeof seconds !== "number"){
  		throw new Error("Numeric arguement required.");
  	}
  	//-----------------------
  	var minSec = "";
  	var minutes = parseInt(seconds / 60, 10);
  	var seconds = parseInt(seconds % 60, 10);
  	if(seconds < 10){
  		minSec = minutes + ":0" + seconds; 
  	}
  	else{
		minSec = minutes + ":" + seconds; 
  	}
  	return minSec;
  }
};	
// Add methods for DOM and CSS chores:
    // a.) Make a shortcut for document.getElementById():
$.id = function id(idString){
	return document.getElementById(idString);
};
    // b.) A chainable styles method:
$.styles = function styles(object){
	return function style(property, value){
		object.style[property] = value;
		return style;
	};
};
    // c.) A function that adjusts the root em according to screen font-size:
$.adjustRem = function adjustRem(){
	var pseudoWidth = 640; //try this one first
	var newRootEm = 16; //default system value to start with
	if (window.innerWidth < pseudoWidth){
		newRootEm = (5 + window.innerWidth/50);//use real window.innerWidth
		$.styles($.app)("width", window.innerWidth + "px");
		$.styles($.topBanner)("width", window.innerWidth + "px");
		$.styles($.holder)("width", window.innerWidth + "px");
		var top = $.topBanner.getBoundingClientRect().bottom;
		var bottom = $.app.getBoundingClientRect().top;
		var height = document.body.getBoundingClientRect().height;//top - bottom;
		$.styles($.holder)
			("padding-bottom",  height + "px")
		;
	}
	else{
		newRootEm = (5 + pseudoWidth/50);//use a fixed width for larger screens
		$.styles($.app)("width", pseudoWidth + "px");
		$.styles($.topBanner)("width", pseudoWidth + "px");
		$.styles($.holder)("width", pseudoWidth + "px");
		top = $.topBanner.getBoundingClientRect().bottom;
		bottom = $.app.getBoundingClientRect().top;
		height = document.body.getBoundingClientRect().height;//top - bottom;
		$.styles($.holder)
			("padding-bottom",  height + "px")
		;
		$.styles($.holder)
			("padding-bottom",  height + "px")
		;
	}
	document.documentElement.style.fontSize =  newRootEm +"px";	
	return newRootEm;
};
    // d.) Assemble browser prefixes to be used for CSS styling
$.browserPrefixes = ["","-webkit-","-moz-","-ms-","-o-"];
//=======| App BEGINS here |========//
window.onload = function(){
	//attach all elements by id to the global $:
	attachElements();	
	document.body.appendChild($.player);//to let device have some control
	$.adjustRem();
	$.fullSliderWidth = 20.8; //in rem;
	$.url = "https://SabbaKilam.github.io/music/";
	//$.urlImages = "https://SabbaKilam.github.io/apps/music/img/";
	$.urlImages = "img/";//local path
	$.speakers = ["speakerMute","speakerSoft","speakerMedium","speakerLoud"];
	//$.player.src = $.url + "Allman Brothers Band - Blue Sky.mp3";
	$.player.src = $.url + "Chicago - Introduction.mp3";	
	//$.player.src = $.url + "childrendarkness.mp3";
	//$.player.src = $.url + "Geoff  Nunberg - Trump, Race, Law & Order.mp3";	
	monitorModel();
	$.player.volume = 1/3;
    //reverse the "back" arrows (like rewind arrows):
    $.browserPrefixes.forEach(function(m){
        $.styles($.reverse)(m + "transform", "rotateY(180deg)");        
    });
	$.allSliders = document.getElementsByClassName("slider");
	styleThese($.allSliders);
	//____________| Helper Functions |______________//
	function styleThese(objectList){
		[].forEach.call(objectList, function(m){
			$.styles(m)
				("margin","0.5rem auto 0.75rem")
				("width", $.fullSliderWidth + "rem")
				("box-shadow"," inset 2px 1px 6px black")
				("height","1.5rem")
				("color","white")
				("text-align","left")
				("border-radius","1.5rem")
				("background","#55a")
				("font-size","1.22rem")
			;
		});
		$.styles($.volumeSlider)
			("color","white")
			("text-shadow","0 1px 0 black")
		;
	}
	//____________________________________________//
	function attachElements(){
		$.timeSlider = $.id("timeSlider");
		$.volumeSlider = $.id("volumeSlider");
		$.speaker = $.id("speaker");
        $.btnPlay = $.id("btnPlay");
        $.btnNext = $.id("btnNext");
        $.btnBack = $.id("btnBack");
        $.reverse = $.id("reverse");
        $.timePrefix = $.id("timePrefix");
        $.timeSuffix = $.id("timeSuffix");
        $.app = $.id("app");
        $.topBanner = $.id("topBanner");
        $.holder = $.id("holder");
	}
	$.speakerImage = function speakerImage(index){
	  $.styles($.speaker)
	    ("background", "url("  + $.urlImages + $.speakers[index]+ ".png) no-repeat center")
	    ("background-size", "contain")
    ;	  
	};
	$.adjustSpeakerImage = function adjustSpeakerImage(){
	  var vol = $.player.volume;
	  if(vol < 0.011){
	    $.speakerImage(0);
	    $.player.volume = 0.00;
	  }
	  else if( vol > 0 && vol < 1/6){
	    $.speakerImage(1);
	  }
	  else if(vol >= 1/6 && vol < 2/3){
	    $.speakerImage(2);
	  }
	  else if(vol >= 2/3 && vol < 0.991){
	    $.speakerImage(3);
	  }
	  else if(vol >= 0.991){
	    $.speakerImage(3);
	    $.player.volume = 1;	  	
	  }
	};
	//____________| User Events Group (Updates Model and player) |___________
	$.player.addEventListener("play", function(){
		$.btnPlay.innerHTML = $.pauseIcon;
		$.playRequested = false;			
	});
	$.player.addEventListener("pause", function(){
		$.btnPlay.innerHTML = $.playIcon;
		$.playRequested = true;			
	});
	$.btnBack.addEventListener("click", function(){
		$.player.pause();
		$.player.currentTime = 0;
		$.btnPlay.innerHTML = $.playIcon;
		$.playRequested = true;
		//----restore the play button
		$.btnPlay.innerHTML = $.playIcon;
		$.styles(this)
			("box-shadow","1px 1px 1px black")
			("font-size","1.5rem")
		;
		$.browserPrefixes.forEach(function(prefix){
			$.styles($.btnPlay)
				("background", prefix + "linear-gradient(#ddd, #aaa, #ddd)")
			;
		}); 		
		
	});
	$.player.addEventListener("ended", function(){
		$.btnPlay.innerHTML = $.playIcon;
		$.playRequested = true;
	});
	
	$.btnPlay.addEventListener("click", function(e){
        if($.playRequested){
            $.player.play();
            $.playRequested = false;
        }
        else{
            $.player.pause();
            $.playRequested = true;
        }
    });
    $.speaker.addEventListener("click", function(){
      if($.speakerIsClicked){
      	$.speakerIsClicked = false;
      	$.player.volume = $.mutedVolume;//restore the muted volume
      }
      else{
      	$.mutedVolume = $.player.volume;//save current volume
      	$.speakerIsClicked = true;
		$.player.volume = 0.00; //"mute" the volume
      }
	});
	window.addEventListener("resize", $.adjustRem);
	window.addEventListener("mousemove", function(e){
		var mouseX = e.clientX;
		var fullWidth = parseInt($.fullSliderWidth * $.adjustRem(), 10);
		var leftMargin = 0;
	  	  if($.timeMouseIsDown){
			$.styles($.timeSlider)("cursor","ew-resize");	  	  	
			var left = $.timeSlider.getBoundingClientRect().left;
			var right = $.timeSlider.getBoundingClientRect().right;
			var notTooFarLeft = mouseX >= left;
			var notTooFarRight = mouseX <= right;
			if(notTooFarLeft && notTooFarRight){
				leftMargin = parseInt(mouseX - left, 10);
        		//inform the player of the new time:
        		if(!isNaN($.player.duration)){
        		    $.player.currentTime = $.player.duration * leftMargin/fullWidth;
    	        }
			}
	  	  }
		  if($.volumeMouseIsDown){
			$.styles($.volumeSlider)("cursor","ew-resize");		  	
		  	$.speakerIsClicked = false;
			var volLeft = $.volumeSlider.getBoundingClientRect().left;
			var volRight = $.volumeSlider.getBoundingClientRect().right;
			var notPassedLeft = mouseX >= volLeft;
			var notPassedRight = mouseX <= volRight;
			if(notPassedLeft && notPassedRight){
				leftMargin = parseInt(mouseX - volLeft, 10);
				//inform player of new volume
				$.player.volume = leftMargin / fullWidth;
			  }
		  }
	});
	window.addEventListener("mouseup", function(e){
	  $.timeMouseIsDown = false;
	  $.volumeMouseIsDown = false;
	  
	});	
	//timeSlider
	$.timeSlider.addEventListener("mousedown", function(e){
		$.timeMouseIsDown = true;
		$.volumeMouseIsDown = false;
		var fullWidth = parseInt($.fullSliderWidth * $.adjustRem(), 10);
		var left = this.getBoundingClientRect().left;
		var mouseX = e.clientX;
		var leftMargin = parseInt(mouseX - left, 10);
		//inform the player of the new time:
		if(!isNaN($.player.duration)){
		    $.player.currentTime = $.player.duration * leftMargin/fullWidth;
		}	
	});
	$.timeSlider.addEventListener("mouseover", function(e){
	    $.styles(this)
	    	("opacity","0.85")
	    	("cursor","pointer")	
    	;	    
	});
	$.timeSlider.addEventListener("mouseout", function(e){
	    $.styles(this)
	    	("opacity","1")
	    	("cursor","pointer")	
    	;	
	});
	$.timeSlider.addEventListener("click", function(e){});
	
	//volumeSlider
	$.volumeSlider.addEventListener("mousedown", function(e){
		$.volumeMouseIsDown = true;
		$.timeMouseIsDown = false;
		
		var mouseX = e.clientX;
		var volLeft = $.volumeSlider.getBoundingClientRect().left;
		var leftMargin = parseInt(mouseX - volLeft, 10);
		if(leftMargin > 0){$.speakerIsClicked = false;}
		var fullWidth = parseInt($.fullSliderWidth * $.adjustRem(), 10);
		//inform player of new volume
		$.player.volume = leftMargin / fullWidth;
	});
	$.volumeSlider.addEventListener("mouseup", function(e){});
	$.volumeSlider.addEventListener("mouseover", function(e){
	    $.styles(this)
	    	("opacity","0.8")
	    	("cursor","pointer");
	});
	$.volumeSlider.addEventListener("mouseout", function(e){
	    $.styles(this)
	    	("opacity","1")
	    	("cursor","pointer");	    
	});
	$.volumeSlider.addEventListener("click", function(e){});

	//____________| Model Data Monitor (updates view) |___________//
	function monitorModel(){
	    setInterval(function(){
	        var timeFraction = $.player.currentTime / $.player.duration;
	        var fullSliderWidth = parseInt( $.fullSliderWidth * $.adjustRem(), 10 );
	        var timeLeftBorder = parseInt(timeFraction * fullSliderWidth, 10);
	        var volumeLeftBorder = parseInt($.player.volume * fullSliderWidth, 10);
	        
	        //move timeSlider
	        $.styles($.timeSlider)
	            ("border-left", timeLeftBorder + "px solid #aaa")
	            ("width", (fullSliderWidth - timeLeftBorder)+"px")
    		;
 	    	$.timeSlider.innerHTML = "&nbsp;" + $.secToMinSec($.player.currentTime);
 	    	$.timePrefix.innerHTML =  $.secToMinSec($.player.currentTime);
 	    	if(!isNaN($.player.duration)){
 	    		$.timeSuffix.innerHTML =  $.secToMinSec($.player.duration);
 	    	}
 	    	
    	    //adjust volume slider	
            $.styles($.volumeSlider) 
                ("border-left", volumeLeftBorder + "px solid #aaa")
                ("width", (fullSliderWidth - volumeLeftBorder)+ "px")
            	;
	        var pct = "&nbsp;" + parseInt($.player.volume * 100,10) + "%";
	        $.volumeSlider.innerHTML = pct;
	        
	        //adjust play button
	        if($.playRequested){
	            $.btnPlay.innerHTML = $.playIcon;
	            $.styles($.btnPlay)
	            	("box-shadow","1px 1px 1px black")
	            	("font-size","1.5rem")
	            ;
	            $.browserPrefixes.forEach(function(prefix){
	            	$.styles($.btnPlay)
	            		("background", prefix + "linear-gradient(#ddd, #aaa, #ddd)")
	        		;
	            }); 	        	
	        }
	        else{
	            $.btnPlay.innerHTML = $.pauseIcon;
	            $.styles($.btnPlay)
	            	("box-shadow","1px 1px 1px white")
	            	("font-size","1.48rem")
	            ;
	            $.browserPrefixes.forEach(function(prefix){
	            	$.styles($.btnPlay)
	            		("background", prefix + "linear-gradient(gray, lightgray)")
	        		;
	            });
	        }
	        //choose proper speaker image
      	    $.adjustSpeakerImage(); 
	    }, 50);
	}
};
//=======| App ENDS here |==========//

