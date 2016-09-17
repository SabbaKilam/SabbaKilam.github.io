/*
  Author: Abbas Abdulmalik
  Created:
  Revised: N/A
  Title:
  Purpose:
  Notes:
*/
/*global $*/

$.initialize = function(){
  $.adjustRem(5, 50);
  //----| Create the model |----//
  //original audio source:
  $.remoteSource ="http://cdn.5by5.tv/audio/broadcasts/changelog/2016/changelog-218.mp3";
  $.localSource ="https://SabbaKilam.github.io/ElmPodcast/podcast/EvanRichard.mp3";
  $.model = {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    audioPlayer: document.createElement("audio"),
    audioSource: $.remoteSource,
    updateBusy: false,
    windowResized: false,
    playButtonTouched: false,
    sliderTouched: false,
    progressNumber: 0 // 0 through 100 ?
  };
  $.model.audioPlayer.setAttribute("src", $.model.audioSource);  
  // Attach the player to the DOM so that the local devices knows about it.
  document.getElementById("playerHolder").appendChild($.model.audioPlayer);
  $($.currentTime).html( $.secToMinSec($.model.audioPlayer.currentTime) );
  $($.duration).html( $.secToMinSec($.model.audioPlayer.duration) );  
};
//==========| App starts here |============
window.onload = function(){
  $.initialize();
  reportResize();
  //====| Gather the elements |====//
  $.app =         // outer wrapper of app (sss to 40% for large screens, 100% small screens)
  $.audioHolder = // time, slide-able progress bar, speaker icon
  $.playButton = // play-pause button
  $.hiddenSlider = // The slider out front that feels the user input
  $.progressSlider = //The visible slider that shows music progress
  $.timeHolder = //div that holds the follwong two time data:
  $.currentTime = // amount of podcast plyed so far in minutes
  $.duration = // total time of podcast
  $.domElements;
  $.attachDomElements();
  
  
  //show initial times and play icon
  $($.playButton).html("&#9658;");
  $($.currentTime).html( $.secToMinSec($.model.audioPlayer.currentTime) );
  $($.duration).html( $.secToMinSec($.model.audioPlayer.duration) ); 
  $.hiddenSlider.value = 0;
  
  //====| Handle all events |====//
  window.onresize = reportResize;
  $.playButton.onclick = reportPlayTouched;
  $.hiddenSlider.oninput = reportSliderTouched;
  
  //====| Handlers that update the model on events |====/
  function reportResize(e){
    $.model.windowHeight = window.innerHeight;
    $.model.windowWidth = window.innerWidth;
    $.model.windowResized = true;
  }
  function reportPlayTouched(e){
    $.model.playButtonTouched = true;
  }
  function reportSliderTouched(e){
    $.model.sliderTouched = true;
  }
  
  //====| Poll the model and update the view |====//
  setInterval(updateView, 16.667); // 50mS: don't need 60fps = 16.667mS
  function updateView(){
    if($.model.updateBusy) return;
    $.model.updateBusy = true;
    
    //----| Test for model changes & update the view |----//
    if(!isNaN($.model.audioPlayer.duration)){
      $($.duration).html( $.secToMinSec($.model.audioPlayer.duration) );
    }
    
    if($.model.windowResized){
      var adjustedWidth = ($.model.windowWidth > 640) ? "75%" : "100%";
      $.adjustRem();
      $($.app).style("width", adjustedWidth);
      $.model.windowResized = false;
    }
    
    if($.model.playButtonTouched){
      //handle here:
      if($.model.audioPlayer.paused){
        var source = $.model.audioPlayer.src;
        if ( source === $.localSource || source === $.remoteSource ){
          $.model.audioPlayer.play();
        }
        //then show pause icon
        $($.playButton).html("&#10074;&nbsp;&#10074;");
      }
      else{
       $.model.audioPlayer.pause();
       //then show play icon
        $($.playButton).html("&#9658;");       
      }
      $.model.playButtonTouched = false;
    }
    
    if($.model.sliderTouched){
      $.model.progressNumber = $.hiddenSlider.value;
      var newTime = ($.model.progressNumber/100) * $.model.audioPlayer.duration;
      $.model.audioPlayer.currentTime = newTime;
      //$($.currentTime).html( ($.model.audioPlayer.currentTime / 60).toFixed(2) );
      $($.currentTime).html( $.secToMinSec($.model.audioPlayer.currentTime) );
      $.model.sliderTouched = false;
    }
    if(! $.model.audioPlayer.paused && ! $.model.audioPlayer.ended ){
      $($.currentTime).html( $.secToMinSec($.model.audioPlayer.currentTime) );
      $.hiddenSlider.value = 100 * ($.model.audioPlayer.currentTime / $.model.audioPlayer.duration);
    }
    else{
      $($.playButton).html("&#9658;");       
    }

    //----| Report that the view update is no longer busy |----//
    $.model.updateBusy = false;
  }
//==========| App ends here |===============
};//This '};' closes the app. Do not accidentally remove it.
//==========| App ends here |===============
