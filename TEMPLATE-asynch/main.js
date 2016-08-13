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
  window.onresize = _.adjustRem;

};
//==========| App starts here |============
window.onload = function(){
  _.initialize();

  //---------------------
  _.div1 = //id of outer div
  _.div2 = //id of app div
  _.domElements;
  _.attachDomElements();
  //-------------------------------
  _.div2.innerHTML += "(This text was added by JS)";
  _.adjustRem(5,50);
  window.onresize = _.adjustRem;
//==========| App ends here |===============
};//This '};' closes the app. Do not accidentally remove it.
//==========| App ends here |===============
