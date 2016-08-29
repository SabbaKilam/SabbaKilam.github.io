/*
  Author: Abbas Abdulmalik
  Created:
  Revised: N/A
  Title:
  Purpose:
  Notes:

  My preferred Screen-Size-Sensitive technique (SSS = Responsive Design) is
  is to size webpage elements in units of root ems (rem), and
  adjust the root em according to screen size upon loading,
  and whenever the screen size changes; I understand that the root em 
  is the width, in pixels, of an upper-case "M" in the root element (the html element)
  on the webpage (I would argue that an upper-case "W" is wider, but ...).
*/
/*global _*/
_.uploadBusy = false;
_.setSizeSensitivity = function(){
  _.adjustRem(5,50);
  window.onresize = _.adjustRem;
};
//==========| App starts here |============
window.onload = function(){
  _.setSizeSensitivity();
  //-----cast of DOM characters:---------
  _.background = //Shimmering background
  _.slot = //narrow slit that reveals the shimmer
  _.domElements;
  _.attachDomElements();
  //-------cover the slot with the right border----
  _(_.slot).styles
    ("border-right", _.slot.getBoundingClientRect().width/_.adjustRem() +"rem solid teal")
    ("width","0")
  ;
  //-------------------------------
  document.body.onmousedown = function(e){
    if(_.uploadBusy)return;
    _.uploadBusy = true;
    var clearingKey = null;
    var fractionStep = 1/200;
    var fraction = 0;
    clearingKey = setInterval(function(){
      var slotInfo = _.slot.getBoundingClientRect();
      //  Move a shimmering band from left to right in a short time
      //  simulating a progress bar.      
      //---------------------
      fraction += fractionStep;
      if(fraction <= 1){
        var width =  parseInt(fraction * e.target.offsetWidth, 10);//parseInt(fraction * slotInfo.width, 10);
        var borderWidth = parseInt((slotInfo.width - width), 10);
        _(_.slot).styles
          ("width", width/_.adjustRem() + "rem")
          ("border-right", borderWidth/_.adjustRem() + "rem solid teal")
        ;
        _.slot.innerHTML = parseInt(fraction * 100, 10).toFixed(0) + "%";
      }
      else{
        _.slot.innerHTML = parseInt(fraction * 100, 10).toFixed(0) + "%";        
        _(_.slot).styles
          ("width", "100%")
          ("border-right", "0")
        ;        
        clearTimeout(clearingKey);
        _.uploadBusy = false;
      }
      //---------------------
    },20);
  };
//==========| App ends here |===============
};//This '};' closes the app. Do not accidentally remove it.
//==========| App ends here |===============
