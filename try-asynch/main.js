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
  and whenever the screen changes size; I understand that the root em 
  is the width, in pixels, of an upper-case "M" in the root element (the html element)
  on the webpage. I would argue that an upper-case "W" is wider, but ...
*/
/*global _*/
_.initialize = function(){
  _.adjustRem(2,75);
  window.onresize = _.adjustRem;

};
//==========| App starts here |============
window.onload = function(){
  _.initialize();
  _.div2 = //name of app div
  _.div3 = // target for
  _.div4 =
  _.domElements;
  _.attachDomElements(_.domElements);
  //---------------------------
  _(".divs").styles
    ("overflow","scroll")
    ("font-size","0.5rem")
    ("text-align","left")
    ("min-height","100%")
    ("display","inline-block")
    ("padding-left","1%")
    ("width","30%")
    ("float","left")
 ;
 _(".divs").getArray().forEach(m=>{
   if(m.className === "divs"){
    m.innerHTML+=m.id;
   }
 });

 _.get("modules/moduleAsynch.js", function(r){
   _.div4.innerHTML += "<pre>" + r + "</pre>";
 });
  _.get("style.css", function(r){
   _.div2.innerHTML += "<pre>" + r + "</pre>";
 });
   _.get("main.js", function(r){
   _.div3.innerHTML += "<pre>" + r + "</pre>";
 });
  window.onresize = _.adjustRem; 
};
//==========| App ends here |===============
