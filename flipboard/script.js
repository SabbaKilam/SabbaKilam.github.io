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
 	'resize',
 	'orientationchange'
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
m.flipperPosition = m.DOWN;
m.finalPosition = true;
m.BACKGROUND_COLOR =  '#ddd';
m.CONTENT_COLOR =  '#eee';
m.topContent = document.getElementById("topContent").innerHTML;
document.getElementById("topContent").innerHTML = "";
m.bottomContent = document.getElementById("bottomContent").innerHTML;
document.getElementById("bottomContent").innerHTML = "";



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

    /*
    L.adjustRem(9,27);
    if(window.innerWidth <= 600){
        L(v.app).styles("width: 100%");
        L.adjustRem();            
    }else{
        L(v.app).styles("width: 600px");
        L.adjustRem("", "", 600);
    }   
    */
    L.adjustRemByArea(9,27);
    if(window.innerWidth <= 600){
        L(v.app).styles("width: 100%");
        L.adjustRemByArea();            
    }else{
        L(v.app).styles("width: 600px");
        L.adjustRemByArea("", "", 600);
    }     
    //just in case words appear upsidedown
    setInterval(function(){
        if(m.flipperPosition === m.DOWN) {
            L(v.msg).styles('transform: rotateX(0deg)');
            L(v.flipperContent).styles('transform: rotateX(0deg)');
        }
        else if(m.flipperPosition === m.UP ) { 
            L(v.msg).styles('transform: rotateX(180deg)');
            L(v.flipperContent).styles('transform: rotateX(180deg)');
        }
        if(m.finalPosition){
            L(v.mover).styles("background-color: " + m.BACKGROUND_COLOR);
            L(v.flipperContent).styles("background-color: " + m.CONTENT_COLOR);              
        }
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
        /*
        if(window.innerWidth <= 600){
            L(v.app).styles("width: 100%");
            L.adjustRem();            
        }else{
            L(v.app).styles("width: 600px");
            L.adjustRem("", "", 600);
        }
        */
        if(window.innerWidth <= 600){
            L(v.app).styles("width: 100%");
            L.adjustRemByArea();            
        }else{
            L(v.app).styles("width: 600px");
            L.adjustRemByArea("", "", 600);
        }        
    }
    
    
    if(type === 'orientationchange'){
        alert(window.screen.orientation);
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

/*global minimumRem*/
/*globalmaximumRem*/

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
        m.finalPosition = true;
        //If flipper is slid enough, continue to flip, or back off otherwise
        if(m.pressed && m.direction === m.UP &&  m.currentAngle > 60){
            L(v.mover).styles("transform: rotateX(180deg)")("transition: all 0.2s ease");
            m.currentAngle = 180;
            m.flipperPosition = m.UP;
            v.flipperContent.innerHTML = m.topContent;
        }
        else if(m.pressed && m.direction === m.UP &&  m.currentAngle <= 60) {
            L(v.mover).styles("transform: rotateX(0deg)")("transition: all 0.2s ease");
            m.currentAngle = 0;
            m.flipperPosition = m.DOWN;
            v.flipperContent.innerHTML = m.bottomContent;            
        }
        else if(m.pressed && m.direction === m.DOWN &&  m.currentAngle < 120){
            L(v.mover).styles("transform: rotateX(0deg)")("transition: all 0.2s ease");
            m.currentAngle = 0;
            m.flipperPosition = m.DOWN;
            v.flipperContent.innerHTML = m.bottomContent;             
        }
        else if(m.pressed && m.direction === m.DOWN &&  m.currentAngle >= 120){
            L(v.mover).styles("transform: rotateX(180deg)")("transition: all 0.2s ease");
            m.currentAngle = 180;
            m.flipperPosition = m.UP; 
            v.flipperContent.innerHTML = m.topContent;            
        }
        
        m.pressed = false;
        
        setTimeout(function(){
            L(v.mover).styles("transition: all 0.0s ease");// 'zero' seconds
            if(m.pressed && m.currentAngle >= 90 && m.currentAngle <= 180  && m.direction === m.UP){
                L(v.msg).styles("transform: rotateX(180deg)");
                L(v.flipperContent).styles('transform: rotateX(180deg)');                
                m.currentAngle = 180;
                m.flipperPosition = m.UP;
            }
            if(m.pressed && m.currentAngle < 90 && m.direction === m.DOWN){
                L(v.msg).styles("transform: rotateX(0deg)");
                L(v.flipperContent).styles('transform: rotateX(0deg)');
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
            m.finalPosition = false;
            L(v.mover).styles("background-color: lightgray");
            L(v.flipperContent).styles("background-color: #dbdbdb");
            
            let degrees = L.clientYToDeg(m.currentY, window.innerHeight, m.direction);
            m.currentAngle = degrees;
            L(v.mover)
                .styles
                    ("transform: rotateX(" + degrees +"deg)")
            ;
            if(degrees >= 90 && degrees <= 180 ){
                L(v.msg).styles("transform: rotateX(180deg)");
                m.flipperPosition = m.UP;
                v.flipperContent.innerHTML = m.topContent;                
            }
            else{
                L(v.msg).styles("transform: rotateX(0deg)");
                m.flipperPosition = m.DOWN;
                v.flipperContent.innerHTML = m.bottomContent;                  
            }            
        }
        else if(!m.pressed){
            m.finalPosition = true;
            L(v.mover).styles("background-color: " + m.BACKGROUND_COLOR);
            L(v.flipperContent).styles("background-color: " + m.CONTENT_COLOR);            
        }

    }    
};
//====| adjustRemBySpace(min,max, optionalWindowWidth) called when app loads & when screen size changes |====//
L.minimumRem = 0;
L.maximumRem = 18;

L.adjustRemByArea = function adjustRemByArea(min, max, optionalWindowWidth){
    if(typeof min === 'number' && typeof max === 'number' && max >= min){
        L.minimumRem = min;
        L.maximumRem = max;
    }
    
    const maxArea = 1920 * 900;
    var windowHeight = window.innerHeight;
    var windowArea;
    var windowWidth;
    if(optionalWindowWidth !== undefined && typeof optionalWindowWidth === 'number'){
        windowWidth = optionalWindowWidth;
    }
    else{
        windowWidth = window.innerWidth;
    }
    windowArea = windowWidth * windowHeight;
    var rootEm = (L.minimumRem + (L.maximumRem - L.minimumRem)* windowArea / maxArea );
    document.documentElement.style.fontSize = rootEm + "px";
    return rootEm;
};

//====| END of adjustRemByArea |====//

//====================================//
//========| END OF APPENDIX |=========//
//====================================//
 
 
 