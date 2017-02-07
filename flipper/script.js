/**
 Inteded global variable list:
 L = our little library of methods loaded by index.html
 
 The objects introduce on this page
 m = our MODEL object
 v = or VIEW object
 c = our CONTROLLER object
 
 If prefixfree is loaded, it adds these two global objects:
  StyleFix, PrefixFree
 
 If Google Javascript Client is loaded, it adds globsal object:
  gapi
*/
/*global L*/
/*global StyleFix*/
/*global PrefixFree*/
/*global gapi*/
//==============================================//
//=================| STARTUP |==================//
//==============================================//
window.onload = function(){
//===============================================//
  
  c.initialize();
  
  //common DOM events:
  [ "mouseover",
    "mousedown",
    "mousemove",
    "mouseup",
    "click",
    "input",
    "keyup",
    "keydown",
    "resize",
    "change",
    "touchstart",
    "touchmove",
    "touchend"].forEach(eventType=>{
      window.addEventListener(eventType, function(eventObject){
        eventObject.stopPropagation();
        c.updateModel(eventObject, c.updateView);
      }, true);
  });


//=============================================//
};
//==============================================//
//==============| END ofSTARTUP |===============//
//==============================================//



//==============================================//
//==================| MODEL |===================//
//==============================================//
var m = {};
m.UP = "up";
m.DOWN = "down";
m.LEFT = "left";
m.RIGHT = "right";

m.startX = window.innerWidth / 2;
m.startY = window.innerHeight / 2;

m.priorX = window.innerWidth;
m.priorY = window.innerHeight;

m.currentX = null;
m.currentY = null;

m.deltaX = m.startX - m.currentX;
m.deltaY = m.startY - m.currentY;

m.priorDirectionX;
m.priorDirectionY;

m.directionChangedY = false;
m.directionChangedX = false;

m.directionX = m.RIGHT;
m.directionY = m.DOWN;

m.pressed = false;
//==============================================//
//===================| VIEW |===================//
//==============================================//
var v = {};
L.attachAllElementsById(v);

v.body = document.body;
v.body.id = "body";

v.window = window;
v.window.id = "window";

v.html = document.documentElement;
v.html.id = "root";

//==============================================//
//=================| CONTROLLER |===============//
//==============================================//
var c = {};
//-------| initialzation method |-----------//
c.initialize = function initialize(){
  L.adjustRemByArea(7,70);

};//-----| END of c.initialize |--------//

//---------------------------------------//
//-------| updateModel method |----------//
//---------------------------------------//
c.updateModel = function updateModel(eventObject, updateView){
  var source = eventObject.target;
  var type = eventObject.type;
  var id = source.id;
  
  let pressed = ( type === "mousedown" || type === "touchstart" );
  let released = ( type === "mouseup" || type === "touchend" );
  let moving =( type === "mousemove" || type === "touchmove" );
  
  if(pressed){
    m.pressed = true;
    m.startX = m.currentX = eventObject.clientX || eventObject.touches[0].clientX;
    m.startY = m.currentX = eventObject.clientY || eventObject.touches[0].clientY;
    m.deltaX = 0;
    m.deltaY = 0;
  }
  if(released){
    m.pressed = false;
    
    m.priorX = m.currentX;
    m.priorY = m.currentY;
    
    m.currentX = eventObject.clientX || eventObject.touches[0].clientX;
    m.currentY = eventObject.clientY || eventObject.touches[0].clientY;
    m.deltaX = m.startX - m.currentX;
    m.deltaY = m.startY - m.currentY;
    
    if(m.directionY === m.UP){
      L(v.flipper)
        .styles
          ("transform: rotateX(180deg)")
          ("transition: all 0.25s ease")
      ;
    }
    else if(m.directionY === m.DOWN){
      L(v.flipper)
        .styles
          ("transform: rotateX(0deg)")
          ("transition: all 0.25s ease")
      ;  
    }
    setTimeout(function(){
      L(v.flipper)
        .styles
          ("visibility: hidden")
          ("transition: all 0.0s ease")
      ;       
    },260);
  }
  if(moving){
    m.priorX = m.currentX;
    m.priorY = m.currentY;
 
    
    m.currentX = eventObject.clientX || eventObject.touches[0].clientX;
    m.currentY = eventObject.clientY || eventObject.touches[0].clientY;
    
   
    
    m.deltaX = m.startX - m.currentX;
    m.deltaY = m.startY - m.currentY;
    
    //determine direction
    if(m.currentX <= m.priorX){
      m.directionX = m.LEFT;
    }
    else if(m.currentX > m.priorX){
      m.directionX = m.RIGHT;      
    }
    
    if(m.currentY <= m.priorY){
      m.directionY = m.UP;
    }
    else if(m.currentY > m.priorY){
      m.directionY = m.DOWN;
    }
    
    //determine if direction changed
    
    if(m.priorDirectionX != m.directionX){m.directionChangedX = true;}
    else{m.directionChangedX = false;}
    
    if(m.priorDirectionY != m.directionY){
      m.directionChangedY = true;
      //m.pressed = true;
      m.startX = m.currentX = eventObject.clientX || eventObject.touches[0].clientX;
      m.startY = m.currentX = eventObject.clientY || eventObject.touches[0].clientY;
      m.deltaX = 0;
      m.deltaY = 0; 
      
    }
    else{m.directionChangedY = false;}
    
    m.priorDirectionX = m.directionX;
    m.priorDirectionY = m.directionY;    
  }

  if(false){}
  if(false){}
  if(false){}
  if(false){}
  if(false){}
  if(false){} 
  
  updateView(eventObject);
};//-----| END of updateModel |----------//

//---------------------------------------//
//-------| updateView method |-----------//
//---------------------------------------//
c.updateView = function updateView(eventObject){
  var source = eventObject.target;
  var type = eventObject.type;
  var id = source.id;
  
  //show event source id and type oef event:
  v.flipper.innerHTML = `${id}, ${type}<br>deltaY: ${m.deltaY}<br>DirectionY: ${m.directionY}<br>DirectionX: ${m.directionX}`;
  let clientY = eventObject.clientY;
  let moving =( type === "mousemove" || type === "touchmove" );  
  if(m.pressed && moving){
    L(v.flipper).styles("transform: rotateX(" + L.clientYToDeg(clientY, window.innerHeight) + "deg)");    
    setTimeout(function(){
      L(v.flipper)
        .styles
          ("visibility: visible")
          ("transition: all 0.0s ease")
      ;   
    },100); 
   
  }
  
  if(source === window && type === "resize" ){
    L.adjustRemByArea();
  }
  else if(false){}
  else if(false){}
  else if(false){}
  else if(false){}
  else if(false){}
  
};//-----| END of updateView |----------//

//====| adjustRemByArea() to be called when app loads and when screen size changes |====//
L.minimumRem = 10;
L.maximumRem = 30;
L.adjustRemByArea = function adjustRemByArea(min,max, optionalWindowWidth){
    //let minArea = 320 * 480;
    let maxArea = 1920 * 900;
    if(typeof min === 'number' && typeof max === 'number' && max >= min){
      L.minimumRem = min;
      L.maximumRem = max;
    }
    var windowWidth;
    if(optionalWindowWidth !== undefined && typeof optionalWindowWidth === 'number'){
        windowWidth = optionalWindowWidth;
    }else{
        windowWidth = window.innerWidth;
    }
    let area = windowWidth * window.innerHeight;    
    var rootEm = (L.minimumRem + (L.maximumRem - L.minimumRem)* area / maxArea );
    document.documentElement.style.fontSize = rootEm + "px";
    return rootEm;
};
//====| END of adjustRemByArea |====//
L.clientYToDeg = function clientYToDeg(currentY, screenHeight){
    let fraction = 0;
    if(m.directionY === m.UP){
      fraction = Math.abs(m.deltaY / m.startY);
    }
    else if(m.directionY === m.DOWN){
      fraction = Math.abs(m.deltaY / ( window.innerHeight - m.startY));
    }
    
    /*
    if(currentY > screenHeight){
        currentY = screenHeight;
    }
    else if(currentY < 0){
        currentY = 0;
    }
    */
    //let rawSin = 1 - (2 * currentY / screenHeight);
    let rawSin = 1 - (2 * fraction);
    
    let radians = Math.asin(rawSin);
    let offsetAngle = 90;
    let degrees = 180 * radians / Math.PI  + offsetAngle;
    
    if(m.directionY === m.UP){
      degrees = 180 - degrees;
    }
    return degrees;
};

