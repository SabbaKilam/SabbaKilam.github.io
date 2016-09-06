/*
  Author: Abbas Abdulmalik
  Created: August 4, 2016
  Revised: N/A
  Title: vertSlider: Flip up with invisible slider
  Purpose:
  Notes:
*/
/*
  My preferred Screen-Size-Sensitive technique (SSS = Responsive Design) is
  is to size webpage elements in units of root ems (rem), and
  adjust the root em according to screen size upon loading,
  and whenever the screen size changes; I understand that the root em 
  is the width, in pixels, of an upper-case "M" in the root element (the html element)
  on the webpage.
*/
/*global _*/
var $ = _; // Not really going to use jQuery, so I'll use $ sometimes for my stuff
_.initialize = function(){
  _.adjustRem(10,100);
  
  //----| adjust slider size |----//
  _("#sliderDiv").styles
    ("width", window.innerHeight + "px")
    ("height", window.innerWidth+ "px")
  ;
  //----| adjust notepad page width |----//
      if(window.innerWidth <= 360){
      _(".notepad").styles
        ("width", "100%")
      ;
    }
    else{
      _(".notepad").styles
        ("width", "80%")
      ;      
    }
};
//==========| App starts here |============
window.onload = function(){
  _.initialize();
  //====| gather all the players |====//
  _.app =             // the outer div of the app
  _.flipPage =        // the page that flips
  _.sliderDiv =       // div that holds the vertical slider
  _.slider =          // the slider that will be transformed to the vertical
  _.msg =             // place to show results on the front page
  _.msg2 =            // place to show results on the 2nd page
  _.stripePage =      // the page behind the flipPage
  //====| The DOM elements above are attached using two statements: |====//
  _.domElements;        // predefined dummy value
  _.attachDomElements();// Object.keys() is used to attach DOM elements
  //====| DO NOT DELETE the two lines above |====//
  
  _.flipThePage = flipThePage;  // handler that reponds to slider input
  _.autoFlip = autoFlip;        // function that "handles" end of slider input called by flipThePage
  _.angle = 0;                  // initial flip angle (page starts down)
  _.flippingUp = true;
  _.busyFlipping = false;
  _.slidingTimerId = 0;

   //====| handle the events |====//
  window.onresize = resizeAll;
  _(_.slider).on("input", _.flipThePage);

  //====| under the hood |====//
  function resizeAll(){
    _.adjustRem();
    
    //----| adjust slider size |----//
    _(_.sliderDiv).styles
      ("width", window.innerHeight + "px")
      ("height", window.innerWidth + "px")
    ;
    
    //----| adjust notepad page width |----//    
    if(window.innerWidth <= 360){
      _(".notepad").styles
        ("width", "100%")
      ;
    }
    else{
      $(".notepad").styles  // testing _ as $
        ("width", "80%")
      ;      
    }
    
    //====| show new width |====//
    _.msg.innerHTML = window.innerWidth + " px";
    _.msg2.innerHTML = window.innerWidth + " px";
  }//----| END of resizeAll() |----//
  
function flipThePage(e){
    //----| detects and handles "no more slider input" events |----//
    clearTimeout(_.slidingTimerId);
    _.slidingTimerId = setTimeout( function(){
      _.autoFlip();
    },100); 
    //------------------------------------------------------------//
    var angle = _.slider.value;
    var direction = "";
    if( (180 - angle) >= (180 - _.angle) ){
      _.flippingUp = true;
      direction = "up";
    }
    else{
      _.flippingUp = false;
      direction = "down";
    }
    _.angle = angle;
    
    _(_.msg).html((180 - _.slider.value) + " &#x000B0; " + direction);
    
    if(angle <= 90){
      _(_.msg2).html((180 - _.slider.value) + " &#x000B0; " + direction);      
    }
    else{
      _.msg2.innerHTML = window.innerWidth + " px";
    }
    
    _(_.flipPage).styles
      ("transform", "rotateX("+ (180 - _.angle) +"deg)")
    ;

    if(_.slider.value >= 90){
      var addedLight = 30 * (180 - _.angle)/90 ; 
      _(_.stripePage).styles
        ("background", "hsl(0, 0%, " + (70 + addedLight) +"%)" )
      ;
    }
    else{
      _(_.stripePage).styles
        ("background", "hsl(0, 0%, 100%)" )
      ;      
    }
    
  }//----| END of flipThePAge() |----//

  function autoFlip(){
    if(_.busyFlipping) return;
    var canAutoFlipUp = _.flippingUp && (_.angle <= 135) ||
      !_.flippingUp && (_.angle < 45);
    var canAutoFlipDown = !_.flippingUp && (_.angle >= 45 ) ||
      _.flippingUp && (_.angle > 135);
    
    if(canAutoFlipUp){
      _.busyFlipping = true;
      var stopper1 = setInterval(()=>{
        var value = 1 * _.slider.value; // convert text to number;
        value -= 1;
        if(value >= 0){
          _.slider.value = value;
          _.flipThePage();          
        }
        else {
          clearInterval(stopper1);
          _.slider.value = 0;
          _.angle = 0;
          _.busyFlipping = false;
        }
      },1);
    }
    else if(canAutoFlipDown){
      _.busyFlipping = true;
      var stopper2 = setInterval(()=>{
        var value = 1 * _.slider.value; // convert text to number;
        value += 1;
        if(value <= 180){
          _.slider.value = value;
          _.flipThePage();
        }
        else{
          clearInterval(stopper2);          
          _.slider.value = 180;
          _.angle = 180;
          _.busyFlipping = false;
        }
      },1);      
    }
  }//----| END of autoFlip() |----//  
//==========| App ends here |===============
};//This '};' closes the app. Do not accidentally remove thi line.
//==========| App ends here |===============
