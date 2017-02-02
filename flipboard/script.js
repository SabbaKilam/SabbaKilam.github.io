/*global L*/
//==============================//
//==========| STARTUP |=========//
//==============================//
window.onload = function(){
 c.initialize();
 [
 	'touchstart',
 	'touchend',
  	'touchmove',
	'mousedown',
 	'mouseup',
 	'mousemove',
 	'resize'	 	
  ].forEach(eventType=>{
  	window.addEventListener(eventType, eventObject=>{
  	    eventObject.preventDefault();
  		eventObject.stopPropagation();
		c.updateModel(eventObject, c.updateView);
  	}, true);
  });
 };
 
//==============================//
//=========| MODEL |============//
//==============================//
let m = {};
m.UP = "up";
m.DOWN = "down";
m.direction = m.UP;
m.pressed = false;
m.priorY = window.innerHeight;
m.currentY = m.priorY;
m.currentAngle = 0; //in degrees


//==============================//
//=========| VIEW |=============//
//==============================//
let v = {};

//==============================//
//=======| CONTROLLER |=========//
//==============================//
let c = {};

//-----| INITIALIZE |------//
c.initialize = function (){
    L.adjustRem(8,24);
	L.attachAllElementsById(v);
};

//-----| UPDATE MODEL |------//
c.updateModel = function updateModel(eventObject, updateView){
    let source = eventObject.target;
    let type = eventObject.type;
    let id = source.id;

    
    // Check on movement
    if(type === "mousemove" || type === "touchmove"){
        let y = eventObject.clientY || eventObject.touches[0].clientY;        
        m.priorY = m.currentY;
        m.currentY = y;
        if(m.currentY < m.priorY){
            m.direction= m.UP;
        }
        else if(m.currentY > m.priorY){
            m.direction = m.DOWN;
        }
        if(m.pressed){
            let degrees = L.clientYToDeg(m.currentY, window.innerHeight, m.direction);
            m.currentAngle = degrees
            L(v.mover)
                .styles
                    ("transform: rotateX(" + degrees +"deg)")
            ;
            if(degrees >= 90 && degrees <= 180 ){
                L(v.msg).styles("transform: rotateX(180deg)");
            }
            else{
                L(v.msg).styles("transform: rotateX(0deg)");                
            }
        }
        
    }
    // check on pressed
    else if((type === "mousedown" || type === "touchstart") &&
            source === v.mover || source === v.msg){
        m.pressed = true;
    }
    else if(type === "mouseup" || type === "touchend"){
        m.pressed = false;        
        if(m.pressed && m.direction === m.UP &&  m.currentAngle > 45){
            L(v.mover).styles("transform: rotateX(180deg)")("transition: all 0.2s ease");
            m.currentAngle = 180;
        }
        else if(m.pressed && m.direction === m.DOWN &&  m.currentAngle < 135){
            L(v.mover).styles("transform: rotateX(0deg)")("transition: all 0.2s ease");
            m.currentAngle = 0;
        }
        setTimeout(function(){
            L(v.mover).styles("transition: all 0.0s ease");
            if(m.currentAngle >= 90 && m.currentAngle <= 180 ){
                L(v.msg).styles("transform: rotateX(180deg)");
                m.currentAngle = 180;                
            }
            else{
                L(v.msg).styles("transform: rotateX(0deg)");
                m.currentAngle = 0;                
            }            
        },100);
    }
    else if(type === "resize"){
        L.adjustRem();
    }
    else if(false){}
    else if(false){}
    

	updateView(eventObject);
};

//-----| UPDATE VIEW |------//
c.updateView = function updateView(eventObject){
 	L.showEvent(eventObject, v.msg);
};

//==============================//
//=======| END of app |==========//
//==============================//
//-------| a small helper library |--------//

L.attachAllElementsById = function(attachHere){
	let allElements = document.getElementsByTagName('*');
	[].forEach.call(allElements, function(element){
		if(element.id){
			attachHere[element.id] = element;
		}
	});
};
//----------------------//
L.showEvent = function showEvent(eventObject, here){
    let degrees = L.clientYToDeg(m.currentY, window.innerHeight, m.direction).toFixed(2)    
	here.innerHTML = eventObject.target.id +", "+eventObject.type + 
	'<br>' + m.direction +
	"<br>Angle: " + degrees;

};
//--------------------//
L.clientYToDeg = function clientYToDeg(currentY, screenHeight, direction){
    if(currentY > screenHeight){
        currentY = screenHeight;
    }
    else if(currentY < 0){
        currentY = 0;
    }
    let rawSin = 1 - (2 * currentY / screenHeight);
    let radians = Math.asin(rawSin);
    let offsetAngle = 90;
    let degrees = 180 * radians / Math.PI  + offsetAngle;
    if(degrees >= 86 && degrees < 92 && m.direction === m.UP){
        degrees = 92;
    }
    else if(degrees <= 92 &&  degrees > 86  && m.direction === m.DOWN ){
        degrees = 86;
    }
    return degrees;
};
 
 
 
 
 
 