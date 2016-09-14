/*
  Author: Abbas Abdulmalik
  Created: September 13, 2016
  Revised: N/A
  Title:  rotate
  Purpose: see if timer can be as smoothe as some virtual DOMs (60fps)
  Notes:
*/
/*global _*/
var $ = _; //use $ rather than _ (might use lodash, but probably not use jQuery)
$.initialize = function(){
  //setup 'model'
  $.model = {
    angle: -90,
    lastTime: Date.now(),
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  };
  $.browserPrefix = ["","-webkit-","-moz-","-ms-","-o-",];
  //---------------------
  $.clockFace = // background circle of clock
  $.needle =    //rotating needle
  $.hub =       // hub of needle
  $.domElements;
  $.attachDomElements();
  //-------------------------------
  window.onresize = adjustAllSizes;  
  function adjustAllSizes(){
    $.adjustRem(5,50);
    $.model.windowHeight = window.innerHeight;
    $.model.windowWidth = window.innerWidth;
  }
};
//==========| App starts here |============
window.onload = function(){
  $.initialize();
  setInterval(rotate, 16.6667); // 60fps = 16.666etc. mS
  function rotate(){
      //maximize circle clockFace with 5px margin of safety
      if($.model.windowHeight < $.model.windowWidth){
        $($.clockFace).styles
          ("width", ($.model.windowHeight - 5) + "px")
          ("height", ($.model.windowHeight - 5) + "px")
        ;        
      }
      else{
        $($.clockFace).styles
          ("width", ($.model.windowWidth - 5) + "px")
          ("height", ($.model.windowWidth - 5) + "px")
        ;        
      }

      //center needle horizontally
      $($.needle).style("left", $.model.windowWidth/2  + "px");
      
      //adjust needle width, not to exceed closest edge by 7px;
      if($.model.windowHeight < $.model.windowWidth){
        $($.needle).style("width", ($.model.windowHeight/2 - 7) + "px");
      }
      else{
        $($.needle).style("width", ($.model.windowWidth/2 - 7) + "px");
      }
    
      //update model with time and angle
      var now = Date.now();
      var timeIncrement = now - $.model.lastTime;
      // store current time for next time
      $.model.lastTime = now;
      // there are 60,000 mS in a minute
      var minuteFraction = timeIncrement / 60000;
      var angleIncrement = 360 * minuteFraction;
      // new angle = old angle + angle increment
      $.model.angle = $.model.angle + angleIncrement;
 
      // now rotate the needle based on current angle
      $.browserPrefix.forEach(function(prefix){
        $($.needle).style(prefix+"transform","rotateZ("+ $.model.angle +"deg)");
      });
  }//----| END of rotate |----//
//==========| App ends here |===============
};//This '};' closes the app. Do not accidentally remove it.
//==========| App ends here |===============
