/*global $*/
//========| Gather the domElements and make the data model |========//
$.currentTime = // 
$.duration = //
$.backButton = //
$.playButton = //
$.advertSkipper = //
$.hiddenSlider = // range input element that will be a hidden overlay of the progress bar
$.progressBar = // the visible slider showing progress of the podcast
$.bead = // a 'button' that sits at the current progress position'
$.info = // explains the content
"domObjects"; //dummy DOM value
$.attachDomObjects();
//-------| make the data model (state variables) global |------//
var model = {
    audioPlayer: document.createElement("audio")
    ,progress: 0 //from 0 - 100
    ,playIcon: "&#9658;"
    ,pauseIcon: "&#10074;&nbsp;&#10074;"
    
    
    
};
//==================================
$(window).on("load", function(){
    window.adjustRem(9, 20);
    $(window).on("resize", window.adjustRem);
    //position the info div
    $($.info).styles
        ("position: absolute")
        ("bottom: 15%")("left: 0")
        ("right: 0")
        ("margin: auto")
        ("background: rgb(50, 50, 50)")
        ("padding: 2%")
        ("background: hsla(0, 0%, 0%, 0.6)")
        ("border-radius: 0.5rem")
        ("border: 1px solid lightgray")
        ("box-shadow: 0 2px 3px gray")
        ("width: 90%")
        ("")
        
        
    ;
});
//====| useful global functions |====//
(function(){
    var minimumRem = 10;
    var maximumRem = 30;
    function adjustRem(min,max){
        if(typeof min === 'number' && typeof max === 'number' && max >= min){
            minimumRem = min;
            maximumRem = max;
        }
        var rootEm = (minimumRem + (maximumRem - minimumRem)*window.innerWidth / 1920 );
        document.documentElement.style.fontSize = rootEm + "px";
        return rootEm;
    }
    window.adjustRem = adjustRem;
})();


