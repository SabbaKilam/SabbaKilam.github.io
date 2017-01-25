/*global $*/
/*global scrammbleThis*/
//====| Gather DOM elements, then make a global data model for the app |====//
$.holder =  // outer div of the project
$.app =     // the app div holds audio player and custom controls
$.splash1 = // first flash screen
$.splash2 = // 2nd splash screen
$.controls = // holds custom control buttons
$.controls2 = //
$.controls3 = //
$.bottomMusicInfo = //
$.audioPlayer = // html5 audio element on the webpage
$.backButton =    // the back button
$.backButtonSpan = // the span that holds the back button icon entities
$.playPauseButton = // you know
$.menuButton = // used to skip past adverisements in the audio
$.muteButton = // button used to mute sound (duh)
$.muteButtonSpan = // inside the muteButton div to hold the speaker icons
$.nonStopButton = // used for coninuous play (streaming?)
$.shuffleButton = // plays songs randomly from song pool
//$.message = //place to put test messages, etc.
$.shuffleButtonSpan = //holds images inside shuffle button
$.nextButton = // button that skips to next song
$.timeHolder = //div that shows podcast play time info
$.currentTime = // time played so far
$.duration = // total time of the sound file (podcast)
$.sliderHolder = // div that holds both visible and hiddden sliders
$.slot = // visible slider bar
$.bead = // visible button in the visible slider
$.hiddenSlider = //
$.topic = //text that describes the page
$.songListHolder = // div that holds selection list
$.songSelector = // select element to be filled with song choices
$.pictureFrame = //primary holder of song photo (splash2 is the secondsry holder)
$.pictureSlider = //hidden range input element over pictureFrame used to slide picture
$.newGithubId = //text input for another github user's music list
//$.etc =   // describe each DOM object to be accessed in this app project
"domObjects";// dummy string variable
$.attachDomObjects();

//----| Attach non- DOM objects |----//
$.toggleTime = 200; //number of milliseconds to toggle the buttons
$.scrammbleThis = scrammbleThis; // mix returns a new array, a randomized version of its given array
$.githubId = "SabbaKilam";

//====| Make the global data model object that holds the app's state variables |====//
var model = {
    startingUp: true
    ,noPictureFiles: ["img/StarSphere.gif", "img/WarpSpeed.gif"]
    ,audioPlayer: $.audioPlayer
    ,introAudioSource: "http://sabbakilam.github.io/gitmusicapp/silent.mp3" 
    ,audioSource: ""
    ,picturePath: ""
    ,currentMusicPath: "https://" + $.githubId + ".github.io/music/list.json"
    ,baseUrl: "https://" + $.githubId + ".github.io/music/"
    ,musicListObject: {}
    ,musicListString: ""
    ,masterSongsArray: []
    ,currentSongsArray: []
    ,currentSongIndex: 0
    ,maximumAppWidth: 480
    ,windowWidth: window.innerWidth
    ,windowHeight: window.innerHeight
    ,playIcon: "&#9658;"
    ,pauseIcon: "&#10074;&nbsp;&#10074;"
    ,speakerLoudIconPath: "img/speakerLoud.png"
    ,speakerMuteIconPath: "img/speakerOff.png"
    ,progress: 0 //0 - 1000
    ,fractionLeft: 0
    ,fractionRight: 1
    ,shuffleImages: []
    ,shuffleTimerId: 0
    ,resized: false    
    ,hiddenSliderTouched: false    
    ,backButtonTouched: false
    ,playPauseButtonTouched: false
    ,nextButtonTouched: false
    ,menuButtonTouched: false
    ,shuffleButtonTouched: false
    ,shuffling: false
    ,nonStopButtonTouched: false
    ,nonStop: false
    ,muteButtonTouched: false
    ,muted: false
    ,updatingView: false
    ,playedYet: false
    ,durationDiscovered: false
    ,playing: false // starts true if autoplay is enabled
    ,newList: false
    ,songListHolderTouched: false
    ,appTouched: false
    ,splash2Touched: false
    ,songSelectedManually: false
    //----| picture sliding state variables |----//
    ,pictureSliderTouched: false
    ,delayNextTouchResponse: false
    ,firstSliderValue: 50
    ,lastSliderValue: 50
    ,sliderTravelAmount: 0
    ,sliderTimerId: 0
    ,picWidth: $.pictureFrame.getBoundingClientRect().width
    ,picLeft: 0
    ,sliding: false
    ,firstPress: true
    ,appInStartupMode: true
};
//====================| END of Model |===================//

$.initialize = function initialize(){
    var OSName="Unknown OS";
    if (window.navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (window.navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    if (window.navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    if (window.navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
    model.OSName = OSName;
    alert(model.OSName);
    //gather shuffle images
    for(var i=1; i<=4; i++){
        model.shuffleImages.push("shuffle" + i + ".png");
    }
    
    //fill dropdown list
    getMusicList(fillSelectOptions);
    
    //swap and kill opening splash screens, then load first picture in spalsh 2.
    $($.splash1).styles("visibility: visible")("opacity: 1"); 
    setTimeout(function(){
        // kill first splash screen and show next one (css eases in 2seconds)
        $($.splash1).styles("visibility: hidden")("opacity: 0");
        $($.splash2).styles("visibility: visible")("opacity: 1");        
        setTimeout(function(){
            // kill second screen.
            $($.splash2).styles("visibility: hidden")("opacity: 0");
            $($.app).styles("visibility: visible")("opacity: 1");
            model.startingUp = false;
            setTimeout(function(){
                //okay now time to replace the spalsh screen2 image with current song's picture
                $.splash2.style.background = "url(" + model.picturePath + ") no-repeat top";
                $.splash2.style.backgroundSize = "cover";
                model.appInStartupMode = false;  
            },1000);
        },1500);
    },1500);
    
    //put slider all the way to the left
    document.getElementById("hiddenSlider").value = 0;
    
    $.adjustRem(1, 85); // $.adjustRem(1, 85) has worked well so far
    if(window.innerWidth >= model.maximumAppWidth){
        model.windowWidth = model.maximumAppWidth;            
    }else{
        model.windowWidth = window.innerWidth;
    }
    model.windowHeight = window.innerHeight;
    model.resized = true;
    model.audioPlayer.volume = 1.0; //100% volume. Let local device reduce (adjust) volume
};

//====| app "starts" here |====//
$(window).on("load", function(){
    $.initialize();
    updateSlider();
    
    //place local audio player near the top to overlap our playPause button:
    adjustAudioPlayer();    
    
    //====| Register DOM events into the data model |====//
    // Note: handlers should only change model flags and model data, not the DOM.
    $(window).on("resize", function(){
        ignoreNewGithubId();       
        if(window.innerWidth >= model.maximumAppWidth){
            model.windowWidth = model.maximumAppWidth;            
        }else{
            model.windowWidth = window.innerWidth;
        }
        model.windowHeight = window.innerHeight;
        model.resized = true;
    });
    
    $(window).on("click", function(e){
        if(e.target.id !== "newGithubId"){
            ignoreNewGithubId();
        }
        if(e.target.id === 'audioPlayer'){
            model.playPauseButtonTouched = true;
        }
    });
    
    $($.backButton).on("mousedown", function(){
        model.backButtonTouched = true;
    });
    $($.playPauseButton).on("mousedown", function(){
        model.playPauseButtonTouched = true;
    });
    $($.menuButton).on("mousedown", function(){
        model.menuButtonTouched = true;
    });
    $($.hiddenSlider).on("input", function(){
        model.hiddenSliderTouched = true;
    });
    $($.muteButton).on("mousedown", function(){
        model.muteButtonTouched = true;
    });
    $($.shuffleButton).on("mousedown", function(){
        model.shuffleButtonTouched = true;
    });    
    $($.nonStopButton).on("mousedown", function(){
        model.nonStopButtonTouched = true;
    });
    $($.nextButton).on("mousedown", function(){
        model.nextButtonTouched = true;
    });
    model.audioPlayer.onplay = function(){
        model.playedYet = true;
    };
    $.audioPlayer.onended = function(){
        //---------------------------//
        if(model.nonStop){
            if(model.currentSongIndex >= (model.currentSongsArray.length - 1) ){
                model.currentSongIndex = 0;               
            }
            else{
                model.currentSongIndex += 1;
            }
            $.songSelector.selectedIndex = model.currentSongIndex;
            cueNextSong(model.currentSongIndex);
            model.audioPlayer.play();                
        }
        else{
           model.backButtonTouched = true; 
        }
        //---------------------------//        
    };
    $($.songListHolder).on("mousedown", function(e){
        if(e.target.id !=="songSelector"){
            model.songListHolderTouched = true;    
        }
    });
    $($.songSelector).on("change", function(){
        model.songSelectedManually = true;
    });
    
    $($.pictureFrame).on("mousedown", function(){
        model.appTouched = true;        
    });
    
    $($.splash2).on("mousedown", function(){
        model.splash2Touched = true;
    });
    $($.pictureSlider).on("mousedown", function(){
        if(model.delayNextTouchResponse)return;
        model.delayNextTouchResponse = true;
        setTimeout(function(){
            model.delayNextTouchResponse = false;            
        }, 750);
        model.sliding = false;        
    });
    $($.pictureSlider).on("input", function(){
        model.pictureSliderTouched = true;
    });
    $($.newGithubId).on("mousedown", function(){
        $($.newGithubId).styles("opacity: 1");
    });
    $($.newGithubId).on("keyup", function(e){
        if(e.keyCode && e.keyCode === 13){
            $.newGithubId.blur();
            $($.newGithubId).styles("opacity: 0");

                var possibleGithubId = $.newGithubId.value.trim();
                $.newGithubId.value = "";
                var possibleListUrl = "https://" + possibleGithubId + ".github.io/music/list.json";
                var getList = new XMLHttpRequest();
            try{                
                getList.open("GET", possibleListUrl);
                getList.send();
                getList.onload = function(){
                    if(getList.status === 200 || getList.status === 0){
                        if(getList.response.length !== 0){
                            $.githubId = possibleGithubId;
                            model.currentMusicPath = "https://" + $.githubId + ".github.io/music/list.json";
                            model.baseUrl = "https://" + $.githubId + ".github.io/music/";
                            getMusicList(fillSelectOptions); 
                        }
                    }
                    else{
                        alert("Trouble getting new music list");
                    }
                };//END getList.onload
            }catch(e){
                alert(e);
            }    
        }
    });
    

    //=====| UPDATE the view (GUI) with this polling timer |====//
    /* 
        Note: The "real" handlers here in the View updater,
        which checks the model for changes, and updates the GUI accordingly
    */
    setInterval(updateView, 16.667); // polls the model at 60 frames/second
    function updateView(){
        if(model.updatingView) return;
        model.updatingView = true;
        //-----------------------------//
        
        showTimes();
        updateSlider(); 
        // don't attempt to display song duration until that info is available
        if( ! model.durationDiscovered ){ 
            if( !isNaN(model.audioPlayer.duration) && model.audioPlayer.duration !== 0){
                $.duration.innerHTML = $.secToMinSec(model.audioPlayer.duration);
                model.durationDiscovered = true;
            }
        }
        
        // show proper play/pause icon based on reported play or pause
        if(! model.audioPlayer.paused && ! model.audioPlayer.ended){
            pressIn($.playPauseButton);
            $($.playPauseButton).html(model.pauseIcon);            
        }else{
            release($.playPauseButton);
            $($.playPauseButton).html(model.playIcon);             
        }
        
        //check for resizing
        if(model.resized){
            if(model.windowWidth >= model.maximumAppWidth){
                $($.app).styles("width: " + model.maximumAppWidth + "px");
                model.windowWidth = model.maximumAppWidth;
            }
            else{
                $($.app).styles("width: 100%");
            }
            $.adjustRem("", "", model.windowWidth); 
            
            //make audio element track the playPause button
            adjustAudioPlayer();
            
            //stuff for sliding picture
            model.picWidth = $.pictureFrame.getBoundingClientRect().width;          
            
            updateSlider();
            
            //----| try this for a better fit (centered) on computer screens |----//
            let fudgeTerm = 75;
            let niceHeight =  0;
            let h1 = $.controls.getBoundingClientRect().height;
            let h2 = $.controls2.getBoundingClientRect().height;
            let h3 = $.controls3.getBoundingClientRect().height;
            let hPic = $.app.getBoundingClientRect().width; //pic height == app width
            let hInfo = $.bottomMusicInfo.getBoundingClientRect().height;
            niceHeight = h1 + h2 + h3 + hPic + hInfo + fudgeTerm;
            if(model.windowHeight > niceHeight){
              $($.app).styles("height: " + niceHeight + "px");
            }
            else{
              $($.app).styles("height: 100%");              
            }
            //---------------------------------------------------------//
            
            model.resized = false;
        }        
        //maybe check for muted condition
        if(model.audioPlayer.muted || model.audioPlayer.volume === 0){
            pressInMute();
        }
        else if(! model.audioPlayer.muted || model.audioPlayer.volume !== 0){
            releaseMute();          
            //model.muted = false;          
        }
        
        if(model.backButtonTouched){
            togglePress($.backButton, $.toggleTime); // 75 milliseconds?            
            if(model.audioPlayer.currentTime === 0){
                if(model.currentSongIndex <= 0 ){
                    model.currentSongIndex = model.currentSongsArray.length -1;               
                }
                else{
                    model.currentSongIndex -= 1;
                }
                model.audioPlayer.pause();
                model.audioPlayer.load();
                $.songSelector.selectedIndex = model.currentSongIndex;                 
                cueNextSong(model.currentSongIndex);
            }else{
                model.audioPlayer.pause();
                model.audioPlayer.currentTime = 0;
                model.audioPlayer.ended = true;
                if(model.audioPlayer.paused && model.audioPlayer.currentTime == 0.0){
                    model.playing = false;
                    model.fractionLeft = 0;
                    model.fractionRight = 1;
                    $.hiddenSlider.value = 0;
                    updateSlider();
                    $($.playPauseButton).html(model.playIcon);
                    release($.playPauseButton);
                }
            }
            model.backButtonTouched = false;            
        }
        
        if(model.playPauseButtonTouched && model.audioPlayer.paused){
            model.audioPlayer.play();
            pressIn($.playPauseButton);
            $($.playPauseButton).html(model.pauseIcon);
            model.playPauseButtonTouched = false;
        }
        else if(model.playPauseButtonTouched && ! model.audioPlayer.paused){
            model.audioPlayer.pause();
            release($.playPauseButton);
            $($.playPauseButton).html(model.playIcon);
            model.playPauseButtonTouched = false;            
        }
        if(model.menuButtonTouched){
            togglePress($.menuButton, $.toggleTime); // 100 milliseconds?
            //-----------------------------------//
            show($.songListHolder);
            $.songSelector.click();
            //-----------------------------------//
            model.menuButtonTouched = false;
        }
        // Here the slider drives the audio progress (elsewhere, the audio drives the slider)
        if(model.hiddenSliderTouched){
            //model.progress = $.hiddenSlider.value;
            
            if(!isNaN(model.audioPlayer.duration) && model.audioPlayer.duration !== 0){
                    model.progress = $.hiddenSlider.value;                
                    model.fractionLeft = $.hiddenSlider.value / 1000 ;
                    model.fractionRight = 1 - model.fractionLeft;
                    model.audioPlayer.currentTime = model.fractionLeft * model.audioPlayer.duration;
                    updateSlider();
            }
            if(! model.playedYet){
                $.hiddenSlider.value = 0;
                //$.message.innerHTML = "<br>Play "+model.playIcon+" needs initial press.";
            }
            model.hiddenSliderTouched = false;
        }
        // Here the audio drives the slider
        driveSlider();

        if(model.muteButtonTouched){
            if( ! model.muted && ! model.audioPlayer.muted){
                model.audioPlayer.muted = true;
                model.muted = true;
                pressInMute();
            }else{
                model.audioPlayer.muted = false;
                model.muted = false;
                releaseMute();
            }
            model.muteButtonTouched = false;
        }
        if(model.nonStopButtonTouched){
            if(model.nonStop){
                model.audioPlayer.removeAttribute("autoplay");
                release($.nonStopButton);
                 if(model.shuffling){
                    toggleShuffleImages(false);
                    model.shuffling = true;
                    staticShuffle();
                }
                model.nonStop = false;                
            }
            else{
                model.audioPlayer.setAttribute("autoplay", "autoplay");
                pressIn($.nonStopButton);
                if(model.shuffling){
                    toggleShuffleImages(true);
                }
                model.nonStop = true;                
            }
            model.nonStopButtonTouched = false;
        }
        if(model.shuffleButtonTouched){
            if(model.shuffling){
                release($.shuffleButton);
                $($.shuffleButton).styles("color: transparent");
                toggleShuffleImages(false);
                model.currentSongsArray = model.masterSongsArray;
                fillSelectOptions(model.currentSongsArray, $.songSelector);
                //$.songSelector.selectedIndex = model.currentSongsArray.indexOf($.audioPlayer.src); 
                $.songSelector.selectedIndex = model.currentSongIndex;                
                model.shuffling = false;
            }
            else{
                staticShuffle();
                if(model.nonStop){
                    toggleShuffleImages(true);
                }
                model.currentSongsArray = $.scrammbleThis(model.masterSongsArray);
                fillSelectOptions(model.currentSongsArray, $.songSelector);
                $.songSelector.selectedIndex = model.currentSongIndex;
                model.shuffling = true;
            }
            model.shuffleButtonTouched = false;
        }
        if(model.nextButtonTouched){
            togglePress($.nextButton, $.toggleTime); // 75 milliseconds?
            if(model.currentSongIndex >= (model.currentSongsArray.length - 1) ){
                model.currentSongIndex = 0;               
            }
            else{
                model.currentSongIndex += 1;
            }
            model.audioPlayer.pause();
            model.audioPlayer.load();
            $.songSelector.selectedIndex = model.currentSongIndex;            
            cueNextSong(model.currentSongIndex);
            model.nextButtonTouched = false;
        }
        if(model.songListHolderTouched){
            hide($.songListHolder);
            model.songListHolderTouched = false;
        }
        if(model.songSelectedManually){
            //update index, play selected song
            hide($.songListHolder);
            model.currentSongIndex = $.songSelector.selectedIndex;
            model.audioPlayer.load();
            //model.audioPlayer.pause();
            model.audioPlayer.play();
            //---| Per Ryan Linehan's suggestion to immediately play chosen song |----//
            //model.playPauseButtonTouched = true;           
            /**
              This works* because we paused the player (above);
              When the playPauseButtonTouched is checked, model.player.paused
              is checked as well. If both are true (as is the case here), play will result.
              
              *It fails if non-stop is active: load, pause, and play interrupt each other.              
            */
            //---| END of suggested change |----// 
            cueNextSong(model.currentSongIndex);
            //let cueNextSong  change model.songSelectedManually = false;
            //model.songSelectedManually = false;
        }

        if(model.splash2Touched){
            $($.splash2).styles("visibility: hidden")("opacity: 0");
            model.splash2Touched = false;
        }
        
        /*********************************************
        ==========| Picture Slider Handler |==========
        **********************************************/
        if(model.pictureSliderTouched){
            if(model.firstPress){
                model.firstSliderValue = 1* $.pictureSlider.value;
                model.firstPress = false;
            }
            var entryValue = 1 * $.pictureSlider.value;
            clearTimeout(model.sliderTimerId);
            model.sliderTimerId = setTimeout(function(){
                model.lastSliderValue = entryValue;
                $.pictureSlider.value = 50;
                $($.pictureFrame).styles("left: 0");
                model.picLeft = 0;                
                model.firstPress = true;
                model.sliding = false;                 
                if(model.firstSliderValue === model.lastSliderValue){
                  enlargePicture();
                }

            },500);
            //---------------------//
              model.sliderTravelAmount =  entryValue - model.firstSliderValue;
              model.picLeft = parseInt(model.picWidth * model.sliderTravelAmount / 100, 10);
              var goodSlideConditions = (model.firstSliderValue <= 45 &&  entryValue  >= model.firstSliderValue) ||
                  (model.firstSliderValue >= 55 && entryValue <= model.firstSliderValue);
              if(model.sliding){
                if(goodSlideConditions){
                  if(model.picLeft >= 0){
                    $($.pictureFrame).styles("left: " + model.picLeft + "px");
                    if(model.picLeft > 0.75 * $.pictureFrame.getBoundingClientRect().width){
                        clearTimeout(model.sliderTimerId);
                        model.firstPress = true; //crucial! to prevent fast forwarding.
                        model.backButtonTouched = true;
                        slideSlowlyFromLeft();
                    }
                  }else{
                    $($.pictureFrame).styles("left: " +  2 * model.picLeft + "px");
                    if( Math.abs(model.picLeft) > 0.75 * Math.abs($.pictureFrame.getBoundingClientRect().width) ){
                        clearTimeout(model.sliderTimerId);
                        model.firstPress = true; //crucial! to prevent fast forwarding.
                        model.nextButtonTouched = true;
                        slideSlowlyFromRight();                        
                    }  
                  } 
                }
              }else{
                model.sliding = true;    
              }
            //---------------------//
            model.pictureSliderTouched = false;
        }
        if(true){}
        if(true){}
        
        //etc.
        //====| helper functions |====//
        
        //===| staticShuffle |==========//
        function staticShuffle(){
            model.shuffle = true;
            pressIn($.shuffleButton);
            $($.shuffleButton).styles("color: transparent");
            $($.shuffleButtonSpan).styles
              ("background: url(img/shuffleBlue.png) no-repeat center")
              ("background-size: contain")
            ;
        }
        //===| END of staticShuffle |===//
        
        function slideSlowlyFromLeft(){
            $($.pictureFrame).styles("transition: left 0s ease");            
            var left = -2 * $.pictureFrame.getBoundingClientRect().width;
            $($.pictureFrame).styles
                ("left: " + left + "px");
            setTimeout(function(){
                $($.pictureFrame).styles("transition: left 0.75s ease")("left: 0");
                    setTimeout(function(){
                    $($.pictureFrame).styles("transition: left 0s ease");
                    }, 700);                
            }, 10); 
        }
        function slideSlowlyFromRight(){
            var left = $.pictureFrame.getBoundingClientRect().width;
            $($.pictureFrame).styles
                ("left: " + left + "px");
            setTimeout(function(){
                $($.pictureFrame).styles("transition: left 0.75s ease")("left: 0");
                    setTimeout(function(){
                    $($.pictureFrame).styles("transition: left 0s ease");
                    }, 700);                
            }, 10);
        }
        function enlargePicture(){
            $($.splash2).styles("visibility: visible")("opacity: 1");            
        }        
        function pressInMute(){
            $($.muteButtonSpan).styles
                ("background: url("+ model.speakerMuteIconPath +") no-repeat top")
                ("background-size: 80% 75%")               
            ;
            $($.muteButton).styles
                ("border: none")
                ("box-shadow: none")
                ("border-top: 1px solid black")
                ("border-left: 1px solid black")
                ("box-shadow: 1px 1px 1px #aaa")
                ("font-size: 0.895rem")
                ("color: transparent")
            ;
            $.browserPrefix.forEach(prefix=>{
                $($.muteButton).styles("background: " + prefix + "linear-gradient(#3a3a3a, #666)");
            });
            
        }
        function releaseMute(){
            $($.muteButtonSpan).styles
                ("background: url("+ model.speakerLoudIconPath +") no-repeat top")
                ("background-size: 80% 75%")
            ;
            $($.muteButton).styles
                ("border: none")
                ("box-shadow: none")                    
                ("border-top: 1px solid #aaa")
                ("border-left: 1px solid #666")
                ("box-shadow: 1px 1px 2px black")
                ("font-size: 0.90rem")
                ("color: transparent")
            ;
            $.browserPrefix.forEach(prefix=>{
                $($.muteButton).styles("background: " + prefix + "linear-gradient(#666, #3a3a3a)");
            });
        }
        function driveSlider(){
            if(!isNaN(model.audioPlayer.duration) && model.audioPlayer.duration !== 0){
                let newLeftFraction = model.audioPlayer.currentTime / model.audioPlayer.duration;
                let newRightFraction = 1 - newLeftFraction;
                let newProgress = 1000 * newLeftFraction;
                model.fractionLeft = newLeftFraction;
                model.fractionRight = newRightFraction;
                model.progress = newProgress;
                $.hiddenSlider.value = newProgress;
                updateSlider();
            }            
        }
        function togglePress(domObject, moment){
            pressIn(domObject);
            setTimeout(function(){
                release(domObject);
            }, moment);
        }//---| END of togglePress() |----//
        function pressIn(domObject){
            $(domObject).styles
                ("border: none")
                ("box-shadow: none")
                ("border-top: 1px solid black")
                ("border-left: 1px solid black")
                ("box-shadow: 1px 1px 1px #aaa")
                ("font-size: 0.895rem")
                ("color: hsl(195, 100%, 50%)")
            ;
            $.browserPrefix.forEach(prefix=>{
                $(domObject).styles("background: " + prefix + "linear-gradient(#3a3a3a, #666)");
            });            
        }
        function release(domObject){
            $(domObject).styles
                ("border: none")
                ("box-shadow: none")                    
                ("border-top: 1px solid #aaa")
                ("border-left: 1px solid #666")
                ("box-shadow: 1px 1px 2px black")
                ("font-size: 0.90rem")
                ("color: white")
            ;
            $.browserPrefix.forEach(prefix=>{
                $(domObject).styles("background: " + prefix + "linear-gradient(#666, #3a3a3a)");
            });
        }
        //----------------------------------//        
        model.updatingView = false;
    }
        function updateSlider(){
            var width = parseInt(0.92 * model.windowWidth, 10);
            var leftBorder = parseInt(model.fractionLeft * width, 10);
            var slotWidth = parseInt(model.fractionRight * width, 10);
            $($.slot).styles
                ("border-left: " + leftBorder + "px solid red")
                ("width: " + slotWidth + "px")
            ;
            $($.sliderHolder).styles("width: " + width + "px");
        }
        function showTimes(){
            $($.currentTime).html($.secToMinSec(model.audioPlayer.currentTime));        
            $($.duration).html($.secToMinSec(model.audioPlayer.duration));
        }
});
//====| app "ends" here |====//
function getMusicList(fillSelectOptions){
    var listGetter = new XMLHttpRequest();
    listGetter.open("GET", model.currentMusicPath);
    listGetter.send();
    listGetter.onload = showStatus;
    function showStatus(){
        if(listGetter.status === 200 || listGetter.status === 0){
            model.musicListString = listGetter.responseText;
            model.musicListObject = JSON.parse(listGetter.responseText);
            var songFilenameArray = [];
            Object.keys(model.musicListObject).forEach(key=>{
                songFilenameArray.push(key);
            });
            model.masterSongsArray = songFilenameArray.sort();
            model.currentSongsArray = model.masterSongsArray;
            //start with random song
            model.currentSongIndex = Math.floor( model.currentSongsArray.length * Math.random() );
 
            cueNextSong(model.currentSongIndex);
            if(typeof fillSelectOptions === "function"){
                fillSelectOptions(model.currentSongsArray, $.songSelector);
            }
        }
        else{
            alert("no can get!\nStatus: " + listGetter.status);
        }
    }
}

function toggleShuffleImages(doIt){
    if(doIt === false){// && model.shuffling){
        //--------------------------------
        clearInterval(model.shuffleTimerId);
        $.shuffleButtonSpan.style.background = "url(img/shuffleWhite.png) no-repeat center";
        $.shuffleButtonSpan.style.backgroundSize = "contain";
        model.shuffling = false;
        //--------------------------------
    }else if(doIt === true ){
        model.shuffleTimerId = setInterval(()=>{
            model.shuffleImages.unshift(model.shuffleImages.pop());
            $.shuffleButtonSpan.style.background = "url(img/" + model.shuffleImages[0]  + ") no-repeat center";
            $.shuffleButtonSpan.style.backgroundSize = "contain";
            model.shuffling = true;
        }, 1000);
    }
}//====| END of toggleShuffleImages(bol) |====//
function cueNextSong(index){
    var audioFilename = model.currentSongsArray[index] + ".mp3";
    var pictureFile;
    if(model.musicListObject[model.currentSongsArray[index]].picture){
        pictureFile = model.musicListObject[model.currentSongsArray[index]].picture;
        model.picturePath = model.baseUrl + "pictures/" + pictureFile;
        $.pictureFrame.style.background = "url(" + model.picturePath + ") no-repeat top";
        $.pictureFrame.style.backgroundSize = "contain";
        
        if(!model.startingUp){
            //place picture in splash screen #2 to be brought forward if required (by user request)
            $.splash2.style.background = "url(" + model.picturePath + ") no-repeat top";
            $.splash2.style.backgroundSize = "cover";              
        }
    }
    else{
        pictureFile = swapNoPictures();//"img/WarpSpeed.gif";
        model.picturePath = pictureFile;
        $.pictureFrame.style.background = "url(" + model.picturePath + ") no-repeat top";
        $.pictureFrame.style.backgroundSize = "contain";
        
        if(!model.startingUp){
            //place picture in splash screen #2 to be brought forward if required (by user request)
            $.splash2.style.background = "url(" + model.picturePath + ") no-repeat top";
            $.splash2.style.backgroundSize = "cover";               
        }
    }
    var artist = model.musicListObject[model.currentSongsArray[index]].artist;
    var title = model.musicListObject[model.currentSongsArray[index]].title;
    model.audioSource = model.baseUrl + audioFilename;
    
    //pause audioPlayer before loading new source:
    model.audioPlayer.pause();
    model.audioPlayer.src = model.audioSource;
    
    $($.topic).html(artist + "<br/>");
    $($.topic).addhtml(title);
    if(! model.appInStartupMode ){
      if(model.songSelectedManually){
        model.audioPlayer.play();
        model.songSelectedManually = false;
      }
    }
    //---| a helper function swapNoPictures() |----//
    function swapNoPictures(){
      model.noPictureFiles.push(model.noPictureFiles.shift());
      return model.noPictureFiles[0];
    }
    //--------------------------------------------//
}
function show(element){
   $(element).styles
        ("opacity: 1")
        ("visibility: visible")
    ;    
}
function hide(element){
    $(element).styles
        ("opacity: 0")
        ("visibility: hidden")
    ; 
}
function fillSelectOptions(array, selectionTarget){
    if(Object.prototype.toString.call(array) === "[object Array]"){
        selectionTarget.innerHTML = "";
        array.forEach(song=>{
            var option = document.createElement("option");
            var text = document.createTextNode(song);
            option.appendChild(text);
            selectionTarget.appendChild(option);
            //selectionTarget.selectedIndex = model.currentSongsArray.indexOf(model.audioPlayer.src);                
            selectionTarget.selectedIndex = model.currentSongIndex;            
        });
    }
}
function adjustAudioPlayer(){
   //make native (& hidden) audio element track the playPause button
   var btnPlaceAndSize = document.getElementById("playPauseButton").getBoundingClientRect();
   //$($.audioPlayer).styles("top: " + (btnPlaceAndSize.height/0.65)  + "px");
   $($.audioPlayer).styles("top: 4.1rem"); 
}
function ignoreNewGithubId(){
  //$.newGithubId.blur();
  $($.newGithubId).styles("opacity: 0");
}





