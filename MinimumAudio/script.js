//The only global variable:
var $ = {
  player: document.createElement("audio"),
  timeMouseIsDown: false,
  volumeMouseIsDown: false,
  pauseIcon: "Pause &#10074;&#10074;",
  playIcon: "Play &#9658;",
  playRequested: true
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
    // c.) A method that returns the adjusted root em:	
$.getRem = function getRem(){
	return 5 + window.innerWidth/50;
};
    // d.) A function that adjusts the root em according to screen font-size:
$.adjustRem = function adjustRem(){
    var newRootEm = $.getRem();
	  document.documentElement.style.fontSize = newRootEm + "px";
	  return newRootEm;
};
    // e.) Assemble browser prefixes to be used for CSS styling
$.browserPrefixes = ["","-webkit-","-moz-","-ms-","-o-"];
$.quickVolume = function(fraction){
    //return 1-Math.pow(16, -fraction);
    return fraction;
};
//=======| App BEGINS here |========//
window.onload = function(){
	document.body.appendChild($.player);
	$.adjustRem();
	$.fullSliderWidth = 25; //in rem;
	$.url = "https://SabbaKilam.github.io/music/";
	$.urlImages = "https://SabbaKilam.github.io/apps/music/img/";
	$.speakers = ["speakerMute","speakerSoft","speakerMedium","speakerLoud"];
	//$.player.src = $.url + "Allman Brothers Band - Blue Sky.mp3";
	$.player.src = $.url + "Chicago - Introduction.mp3";	
	//$.player.src = $.url + "childrendarkness.mp3";
	monitorModel();
	$.player.volume = 1/3;
	//attach all elements by id to the global $:
	attachElements();
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
				("box-shadow"," inset 1px 1px 5px black")
				("height","2rem")
				("color","#ccc")
				("text-align","left")
				("border-radius","1rem")
				("background","teal")
				("font-size","1.25rem")
			;
		});
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
	  else if(vol >= 2/3){
	    $.speakerImage(3);
	  }
	};
	//____________| User Events Group (Updates Model and player) |___________
	$.player.addEventListener("play", function(){
		$.player.pause();
		$.btnPlay.innerHTML = $.pauseIcon;
		$.playRequested = false;			
	});
	$.btnBack.addEventListener("click", function(){
		$.player.pause();
		$.player.currentTime = 0;
		$.btnPlay.innerHTML = $.playIcon;
		$.playRequested = true;		
	});
	$.player.addEventListener("ended", function(){
		$.btnPlay.innerHTML = $.playIcon;
		$.playRequested = true;
	});
	
	$.btnPlay.addEventListener("click", function(e){
        if($.playRequested){
            $.player.play();
            $.playRequested = false;
            $.btnPlay.innerHTML = $.pauseIcon;
        }
        else{
            $.player.pause();
            $.playRequested = true;
            $.btnPlay.innerHTML = $.playIcon;
        }
    });
    $.speaker.addEventListener("click", function(){
	  $.player.volume = 0.00;
	  $.styles($.volumeSlider)
	    ("border-left","0")
	    ("width", ($.fullSliderWidth * $.adjustRem()) + "px")

    ;
	  $.speakerImage(0);
	});
	window.addEventListener("resize", $.adjustRem);
	window.addEventListener("mousemove", function(e){
		var mouseX = e.clientX;
		var fullWidth = parseInt($.fullSliderWidth * $.adjustRem(), 10);
		var leftMargin = 0;
	  	  if($.timeMouseIsDown){
			var left = $.timeSlider.getBoundingClientRect().left;
			var right = $.timeSlider.getBoundingClientRect().right;
			var notTooFarLeft = mouseX >= left;
			var notTooFarRight = mouseX <= right;
			if(notTooFarLeft && notTooFarRight){
				leftMargin = parseInt(mouseX - left, 10);
				$.styles($.timeSlider)
					("border-left",leftMargin +"px solid #aaa")
					("width",(fullWidth - leftMargin) + "px");
            		//inform the player of the new time:
            		if(!isNaN($.player.duration)){
            		    $.player.currentTime = $.player.duration * leftMargin/fullWidth;
	    		        $.timeSlider.innerHTML = ($.player.currentTime).toFixed(2);
            		}
			}
	  	  }
		  if($.volumeMouseIsDown){
			var volLeft = $.volumeSlider.getBoundingClientRect().left;
			var volRight = $.volumeSlider.getBoundingClientRect().right;
			var notPassedLeft = mouseX >= volLeft;
			var notPassedRight = mouseX <= volRight;
			if(notPassedLeft && notPassedRight){
				leftMargin = parseInt(mouseX - volLeft, 10);
				$.styles($.volumeSlider)
					("border-left",leftMargin +"px solid #aaa")
					("width",(fullWidth - leftMargin) + "px");				
				//inform player of new volume
				$.player.volume = $.quickVolume(leftMargin / fullWidth);
		        $.volumeSlider.innerHTML = ($.player.volume).toFixed(2);
		        $.adjustSpeakerImage();
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
		var fullWidth = parseInt($.fullSliderWidth * $.adjustRem(), 10);//$.getRem()
		var left = this.getBoundingClientRect().left;
		var mouseX = e.clientX;
		var leftMargin = parseInt(mouseX - left, 10);
		$.styles(this)
			("border-left",leftMargin +"px solid #aaa")
			("width",(fullWidth - leftMargin) + "px")   
		;
		//inform the player of the new time:
		if(!isNaN($.player.duration)){
		    $.player.currentTime = $.player.duration * leftMargin/fullWidth;
	    	$.timeSlider.innerHTML = ($.player.duration* leftMargin/fullWidth).toFixed(2);
		}	
	});
	$.timeSlider.addEventListener("mouseover", function(e){
	    $.styles(this)("opacity","0.85");	    
	});
	$.timeSlider.addEventListener("mouseout", function(e){
	    $.styles(this)("opacity","1");	    	    
	});
	$.timeSlider.addEventListener("click", function(e){});
	
	//volumeSlider
	$.volumeSlider.addEventListener("mousedown", function(e){
		$.volumeMouseIsDown = true;
		$.timeMouseIsDown = false;
		
		var mouseX = e.clientX;
		var volLeft = $.volumeSlider.getBoundingClientRect().left;
		var leftMargin = parseInt(mouseX - volLeft, 10);
		var fullWidth = parseInt($.fullSliderWidth * $.adjustRem(), 10);//$.getRem()		
		$.styles($.volumeSlider)
			("border-left",leftMargin +"px solid #aaa")
			("width",(fullWidth - leftMargin) + "px");				
			//inform player of new volume
			var vol = $.quickVolume(leftMargin / fullWidth);
			$.player.volume = vol;
	    $.volumeSlider.innerHTML = vol.toFixed(2);
	    $.adjustSpeakerImage();
	});
	$.volumeSlider.addEventListener("mouseup", function(e){});
	$.volumeSlider.addEventListener("mouseover", function(e){
	    $.styles(this)("opacity","0.8");
	});
	$.volumeSlider.addEventListener("mouseout", function(e){
	    $.styles(this)("opacity","1");	    
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
    	    	$.timeSlider.innerHTML = ($.player.currentTime).toFixed(2);
    	      //adjust volume slider	
            $.styles($.volumeSlider) 
                ("border-left", volumeLeftBorder + "px solid #aaa")
                ("width", (fullSliderWidth - volumeLeftBorder)+ "px")
            ;
      	    $.volumeSlider.innerHTML = ($.player.volume).toFixed(2);
      	    $.adjustSpeakerImage(); 
	    }, 100);
	}
};
//=======| App ENDS here |==========//

