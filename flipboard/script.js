/*global L*/
//=====================================//
//==========| *** STARTUP ***|=========//
//=====================================//
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
m.flipperPosition = m.DOWN
m.BACKGROUND_COLOR =  '#ddd';

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
	L.attachAllElementsById(v);
	
    L.adjustRem(5,20);
    if(window.innerWidth <= 360){
        L(v.app).styles("width: 100%");
    }else{
        L(v.app).styles("width: 60%");
    }    

    //just in case words appear upsidedown
    setInterval(function(){
        if(m.flipperPosition === m.DOWN) { L(v.msg).styles('transform: rotateX(0deg)') }
        else if(m.flipperPosition === m.UP) { L(v.msg).styles('transform: rotateX(180deg)') }
    },10);
};

//-----| UPDATE MODEL |------//
c.updateModel = function updateModel(eventObject, updateView){
    let source = eventObject.target;
    let type = eventObject.type;
    
    // check on pressed
    if(
        (type === "mousedown" || type === "touchstart") &&
        (source === v.mover || source === v.msg)
    )
    {
        m.pressed = true;
    }
    
    // Check on movement
    if(type === "mousemove" || type === "touchmove"){
        let y = eventObject.clientY || eventObject.touches[0].clientY;        
        m.priorY = m.currentY;
        m.currentY = y;
        m.currentAngle = L.clientYToDeg(m.currentY, window.innerHeight);
        if(m.currentY < m.priorY){
            m.direction= m.UP;
        }
        else if(m.currentY > m.priorY){
            m.direction = m.DOWN;
        }
    }
    else if(false){}
    else if(false){}

	updateView(eventObject);
};

//-----| UPDATE VIEW |------//
c.updateView = function updateView(eventObject){
    let source = eventObject.target;
    let type = eventObject.type;
    
    //---------------------------------------------------// 	
    //---------| Option to display current event |-------//
    //---------------------------------------------------//    
 	L.showEvent(eventObject, v.msg);
 	
    //---------------------------------------------------// 	
    //---------| Handle flip request ending 	|--------//
    //---------------------------------------------------//
    L.setDirectionAndPosition(eventObject);
    
    //---------------------------------------------------// 	
    //------------| Handle flipper movement |------------//
    //---------------------------------------------------//   
    L.moveFlipper(eventObject);
    
    //----------------------------------------------------// 	
    //-------------|  Handle screen resizing |------------//
    //----------------------------------------------------//    
    if(type === "resize"){
        if(window.innerWidth <= 600){
            L(v.app).styles("width: 100%");
            L.adjustRem();            
        }else{
            L(v.app).styles("width: 600px");
            L.adjustRem("", "", 600);
        }
    } 	
};

//======================================//
//=======| *** END OF APP *** |=========//
//======================================//


//===============================//
//=========| APPENDIX |==========//
//===============================//

//--------------------------------------------------//
//-------| helper methods added to library |--------//
//--------------------------------------------------//
L.showEvent = function showEvent(eventObject, here){
    let degrees = L.clientYToDeg(m.currentY, window.innerHeight).toFixed(2) + '&deg;';   
	here.innerHTML = eventObject.target.id +", "+eventObject.type + 
	'<br>' + m.direction +
	"<br>Angle: " + degrees;

};

//--------------------//
L.clientYToDeg = function clientYToDeg(currentY, screenHeight){
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

    return degrees;
};

//--------------------//
L.setDirectionAndPosition = function setDirectionAndPosition(eventObject){

    let type = eventObject.type;
    
    if(type === "mouseup" || type === "touchend"){
        //If flipper is slid enough, continue to flip, or back off otherwise
        if(m.pressed && m.direction === m.UP &&  m.currentAngle > 60){
            L(v.mover).styles("transform: rotateX(180deg)")("transition: all 0.2s ease");
            m.currentAngle = 180;
            m.flipperPosition = m.UP;
        }
        else if(m.pressed && m.direction === m.UP &&  m.currentAngle <= 60) {
            L(v.mover).styles("transform: rotateX(0deg)")("transition: all 0.2s ease");
            m.currentAngle = 0;
            m.flipperPosition = m.DOWN;
        }
        else if(m.pressed && m.direction === m.DOWN &&  m.currentAngle < 120){
            L(v.mover).styles("transform: rotateX(0deg)")("transition: all 0.2s ease");
            m.currentAngle = 0;
            m.flipperPosition = m.DOWN;            
        }
        else if(m.pressed && m.direction === m.DOWN &&  m.currentAngle >= 120){
            L(v.mover).styles("transform: rotateX(180deg)")("transition: all 0.2s ease");
            m.currentAngle = 180;
            m.flipperPosition = m.UP;            
        }
        
        m.pressed = false;
        
        setTimeout(function(){
            L(v.mover).styles("transition: all 0.0s ease");// 'zero' seconds
            if(m.currentAngle >= 90 && m.currentAngle <= 180  && m.direction === m.UP){
                L(v.msg).styles("transform: rotateX(180deg)");
                m.currentAngle = 180;
                m.flipperPosition = m.UP;
            }
            if(m.currentAngle < 90 && m.direction === m.DOWN){
                L(v.msg).styles("transform: rotateX(0deg)");
                m.currentAngle = 0;
                m.flipperPosition = m.DOWN;
            }
            L(v.mover).styles("background-color: " + m.BACKGROUND_COLOR);
        },100);
    }    
};

//------------------------------//
L.moveFlipper = function moveFlipper(eventObject){
    let type = eventObject.type;
    
    if (type === "mousemove" || type === "touchmove" ){
        if(m.pressed){
            L(v.mover).styles("background-color: lightgray");
            let degrees = L.clientYToDeg(m.currentY, window.innerHeight, m.direction);
            m.currentAngle = degrees;
            L(v.mover)
                .styles
                    ("transform: rotateX(" + degrees +"deg)")
            ;
            if(degrees >= 90 && degrees <= 180 ){
                L(v.msg).styles("transform: rotateX(180deg)");
                m.flipperPosition = m.UP;
            }
            else{
                L(v.msg).styles("transform: rotateX(0deg)");
                m.flipperPosition = m.DOWN;
            }            
        }
        else if(!m.pressed){
            L(v.mover).styles("background-color: " + m.BACKGROUND_COLOR);            
        }

    }    
};
 
//====================================//
//========| END OF APPENDIX |=========//
//====================================//
 
 
 