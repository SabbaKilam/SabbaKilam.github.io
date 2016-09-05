/*
  Author: Abbas Abdulmalik
  Created:
  Revised: N/A
  Title:
  Purpose:
  Notes:
*/
/*
  My preferred Screen-Size-Sensitive technique (SSS = Responsive Design) is
  is to size webpage elements in units of root ems (rem), and
  adjust the root em according to screen size upon loading,
  and whenever the screen size changes; I understand that the root em 
  is the width, in pixels, of an upper-case "M" in the root element (the html element)
  on the webpage (I would argue that an upper-case "W" is wider, but ...).
*/
/*global _*/
_.initialize = function(){
  _.adjustRem(10,100);
  //----| adjust slider size |----//
  _(".overlap").styles
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
  _.app =             // the outer app div
  _.flipPage =        // the page that will flip
  _.sliderDiv =       // div holds the vertical slider
  _.slider =          // the slider that wil be transformed to the vertical
  _.msg =             // place to show results on the page
  _.domElements;
  _.attachDomElements();
  _.angle = 0;        // initial flip angle (page starts down)
  _.fippingUp = true;
  _.busyFlipping = false;

   //====| handle the events |====//
  window.onresize = resizeAll;
  _(_.slider).on("input", flipThePage);

  
  //====| under the hood |====//
  function resizeAll(){
    _.adjustRem();
    //----| adjust slider size |----//
    _(".overlap").styles
      ("width", window.innerHeight + "px")
      ("height", window.innerWidth + "px")
    ;
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
    _.msg.innerHTML = window.innerWidth + "px";
  }
  function flipThePage(e){
    if(_.busyFlipping)return;
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
    _(_.flipPage).styles
      ("transform", "rotateX("+ (180-_.slider.value) +"deg)")
    ;

  }
//==========| App ends here |===============
};//This '};' closes the app. Do not accidentally remove it.
//==========| App ends here |===============
