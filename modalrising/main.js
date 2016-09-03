/**
*   Author: Abbas Abdulmalik
*   Creation Date: February 22, 2016
*   Purpose: Modal shroud with transforming message box
*   Modified: N/A
*   Notes:
*
*/
/*global O*/
/*global S*/
/*global C*/
/*global makeDraggable*/
/*global lib*/

//=====constants and variables=========
var base = "https://dl.dropboxusercontent.com/u/21142484/modules/";
var $ = lib;
var msgUp = true;

//=======DRIVER'S SEAT==================
window.onload = initialize;
window.onresize = resize;
$("#backPanel").click(showMessage);
$("#exit").click(hideMessage);

//=======UNDER THE HOOD=================
//----------------(robot Factory)-------------
function initialize(){
    //=================prepare for unit test============
    //-------test suite--------
    (function(){
      if(document.getElementById("btnTest")){
          O("btnTest").onclick = function(){
              document.location = "test.html";
          };
          O("btnTest").onmouseover = function(){
              S(this).opacity = 1;
          };
          O("btnTest").onmouseout = function(){
              S(this).opacity = 0;
          };
      }
  })();
  //-------------------
  resize();
  $("#message").html("<div id='tape'></div>Pop-Up message:<br>Click the <span id='x'>&#x02297;</span>&nbsp;to exit.");
  setTimeout(function(){
      $("#x").click(hideMessage);
      makeDraggable($("#box").getElement())
    ;
  },100);
}//---END of initialize() function----
function resize(){
  document.documentElement.style.fontSize = (5 + window.innerWidth/200)+"px";
}
function showMessage(){
  $("#shroud")
    .css("visibility","visible")
    .css("opacity","1")
  ;
  $("#box")
    .css("top","20%")
    .css("visibility","visible")
    .css("opacity","1")
    .css("-moz-transform","rotate(0deg)")
  ;
}
function hideMessage(e){
  e.stopPropagation();
  $("#shroud")
    .css("visibility","hidden")
    .css("opacity","0")
  ;
  $("#box")
    .css("visibility","hidden")
    .css("opacity","0")
    .css("-moz-transform","rotate(90deg)")
  ;
  if(msgUp){
    $("#box").css("top","100%");
    msgUp = false;
  }
  else{
    $("#box").css("top","-30%");
    msgUp = true;    
  }
}
//========================================================//


//======================| unit tests |====================//
if(this.test !== undefined){
    test("Generic unit test assertions", function(assert){
        expect(5);
        //----assertions below----------------

            assert.ok( 3 === 1+2,"3 === 1+2");
            deepEqual(function(){},"return value expected","comment");
            deepEqual(function(){}(),undefined,"undefined expected");
            deepEqual(function(){},"return value expected","comment");
            deepEqual(function(){}(),undefined,"undefined expected");

        //------------------------------------
    });}
//==================================================