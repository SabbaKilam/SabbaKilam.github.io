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
  //http://cdn.5by5.tv/audio/broadcasts/changelog/2016/changelog-218.mp3
  //https://SabbaKilam.github.io/ElmPodcast/podcast/EvanRichard.mp3
  $.model = {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    audioPlayer: document.createElement("audio"),
    audioSource: "http://cdn.5by5.tv/audio/broadcasts/changelog/2016/changelog-218.mp3",
    updateBusy: false,
    windowResized: false,
    playButtonTouched: false,
    sliderTouched: false,
    progressNumber: 0 // 0 through 1000 ?
  };
  $.model.audioPlayer.setAttribute("src", $.model.audioSource);  
  // Attach the player to the DOM so that the local devices knows about it.
  document.getElementById("temp").appendChild($.model.audioPlayer);
  // Shows default controls. Will hide later when our controls work.
  //$.model.audioPlayer.setAttribute("controls","true");

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
  $.testTarget = // a place to show test results
  $.temp = // temporay place to show default audio player
  $.domElements;
  $.attachDomElements();
  
  
  $($.playButton).html("&#9658;"); 
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
    if($.model.windowResized){
      var adjustedWidth = ($.model.windowWidth > 640) ? "75%" : "100%";
      $.adjustRem();
      $($.app).style("width", adjustedWidth);
      //$($.testTarget).html("Width: " + $.model.windowWidth + ", Height: " + $.model.windowHeight);
      $.model.windowResized = false;
    }
    
    if($.model.playButtonTouched){
      //handle here:
      if($.model.audioPlayer.paused){
        $.model.audioPlayer.play();
        //then show pause icon
        $($.playButton).html("&#10074;&#10074;");
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
      //$($.testTarget).html($.model.progressNumber);
      $.model.sliderTouched = false;
    }

    //----| Report that the view update is no longer busy |----//
    $.model.updateBusy = false;
  }

//==========| App ends here |===============
};//This '};' closes the app. Do not accidentally remove it.
//==========| App ends here |===============
