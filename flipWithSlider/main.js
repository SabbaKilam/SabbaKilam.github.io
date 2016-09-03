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
  _.adjustRem(10,100); //initial guess for  resizing
  window.onresize = _.adjustRem;
  

};
//==========| App starts here |============
window.onload = function(){
  _.initialize();

  //====| gather all the players |====//
  _.div1 = //id first flipper page
  _.div2 = //id second flipper page
  _.app = // the outer wrapper for the entire app
  //add more here as "_.domElement = //comment"
  //_.domElement = //comment"
  _.domElements;
  _.attachDomElements();
  _.twoPages = [_.div1, _.div2];
  _.flipTime = 1;
  _.busyFlipping = false;
  
  _(".slider").styles
    ("height", window.innerWidth + "px")
    ("width", 40 + "rem")
  ;  
  //====| handle all the events |====//
  window.onresize = _.adjustRem;

  _.app.onresize = function(){
    _(".slider").styles
      ("height", window.innerWidth + "px")
      ("width", _.div1.offsetHeight + "px")
      ("", "")
    ;
  };
  
  _(".slider").on("input", handleSlide);
  
  //====| under the hood |====//
  //----| Handle slide |----//
  function handleSlide(e){
    var initialY = e.target.value;
    _(".slider").on("input", function(slideEvent){
      var newValue = slideEvent.target.value;
      if( (newValue < initialY - 5) ){
          initialY = 0;
          _(".slider").getArray().forEach(function(m){
            m.value = 0;
          });
        //----| handle flip |----//
          if( _.busyFlipping  ) return;
          _.busyFlipping = true;
          
          // restore transition time to both pages
          _.twoPages.forEach(m=>{
              m.style.transition = "all " + _.flipTime +"s ease" ; 
          });
          
          // prepare back page for viewing
          _.twoPages[0].style.opacity = "1";
          
          // flip front page out of view (this is the main action of the app)
          _.twoPages[1].style.transform = "rotateX(270deg)";
          
          /*
            Let the back page now be up front, and ...
            restore the new back page to 0 degrees (unflipped),
            quickly ("transition","all 0s ease") and invisibly ("opacity", "0").
          */
          setTimeout(()=>{
            //swap pages in array
            _.twoPages.unshift(_.twoPages.pop());
            // hide previous one behind new one
            _.twoPages[0].style.zIndex = 1;
            _.twoPages[1].style.zIndex = 2;
            _(_.twoPages[0]).styles
              ("transition","all 0s ease")
              ("opacity", "0")
              ("transform", "rotateX(0deg)")
            ;
            _.busyFlipping = false;
          },1000*_.flipTime + 10);
        //---------------------------------//
      }
    });
  }
//==========| App ends here |===============
};//This '};' closes the app. Do not accidentally remove it.
//==========| App ends here |===============
