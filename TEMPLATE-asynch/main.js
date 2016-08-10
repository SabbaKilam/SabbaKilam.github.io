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
_.adjustRem = function adjustRem(){
  //This initial equation can be modified to taste.
  var newRem = 5 + window.innerWidth / 50;
  //document.documentElement is the html (root) element of a webpage
  document.documentElement.style.fontSize = newRem + "px";
  return newRem;
};
_.initialize = function(){
  _.adjustRem();
  window.onresize = _.adjustRem;

};
//==========| App starts here |============
window.onload = function(){
  _.initialize();
  //---------------------

  _.attachByGroupName = function attachByGroupName(groupName){
    Object.keys(_).forEach(key=>{
      if(_[key] === groupName){
        _.attach(key);
      }
    });    
  };
  //-------------------------------
  _.div1 = //name of outer div
  _.div2 = //name of app div
  "newGroup";
  _.attachByGroupName("newGroup");
  var minMax = _.sizeFactory(320, 1280);
  //---------------------------
  _.attach(["holder", "app"]);
  _(_.div1).styles
    ("border-radius","0.25rem")
    ("height",minMax(5,500)/_.adjustRem()+"rem")
    ("width",minMax(10,500)/_.adjustRem()+"rem")
    //("margin"," 0 auto")
    ("background","cyan")
    ("opacity", "0.5")
    ("font-size","1rem")    
  ;
  
  _(_.div2).styles
    ("border-radius","0.25rem")
    ("height","3rem")
    ("width","8rem")
    ("margin"," 0 auto")
    ("background","yellow")     
    ("opacity", "0.5")
    ("font-size","1rem")
  ; 
  _.makeDraggable(_.div2);
  _.makeDraggable(_.div1);
  
  
  var a1 = [0,1,2,3,4,5];
  var a2 = [3,4,5,6,7,8];
  var a3 = [6,7,8,9,10,11];
 //alert(_.symDiff(a2,a3,a1));
  var list = _.makeList();
  list.addData(a1);
  list.addData(a2);
  list.addData(a3);
  alert(list.getHead().next.data);
  alert(list.length());
  
  (function(){
    _("#div1").toggle(down, up);
    //---| handlers |---//
    function down(){
      _(_.div1).html("Click 1");
    }
    function up(){
      _(_.div1).html("Click 2");
    }
  })(); 

  (function(){
    _("#div2").touchHover(down, up);
    //---| handlers |---//
    function down(){
      _(_.div2).html("Touching");
    }
    function up(){
      _(_.div2).html("Not Touching");
    }
  })();
  
    (function(){
    _("#div2").hover(down, up);
    //---| handlers |---//
    function down(){
      _(_.div2).html("Hovering");
    }
    function up(){
      _(_.div2).html("Not Hovering");
    }
  })();

  _.log("This", "is", "a", "test");
  alert(_.trueType(_.div2));
  
  
};
//==========| App ends here |===============
