//======================================| ORIGINAL |=======================================
/*
  Author: Abbas Abdulmalik
  Title: hsla color picker
  Created: December 3, 2013
  Revised: May 20, 2016
  Purpose: A quick and easy way to choose colors for web apps
  Notes: I know, I know: Polluting the global namespace; code not very declarative;
         using my own old lame library functions; not enough comments; etc.
         Try not to beat yourself up too much, because it still works :)  
*/
var dragFlag = true;
var radius = 50;
var saturation = "";
var degrees = 0;
var mostRecentAngle;
var opacity = "0.95";
var luminosity = 50;
var maximumRadius = 150;
var colorString = "";
var complementString = "";
var centerX = parseInt(window.innerWidth/2, 10);
var centerY = 204;
var x = -75 + centerX;
var y = 210;
var dx, dy;
var saturationSliderFlag = false;
var hueSliderFlag = false;
var lightnessSliderFlag = false;
var opacitySliderFlag = false;
var saturationNumFlag = false;
var hueNumFlag = false;
var lightnessNumFlag = false;
var opacityNumFlag = false;
var wheelInUse = false;

//==========Event Handlers=======================
window.onload = function(){
    var yDirection = Math.floor( 2*Math.random() ) == 0 ? -1 : 1;
    var yDistance = Math.floor(maximumRadius * Math.random());
    var y = centerY + yDirection*yDistance;

    //xDistance is now restricted by y and maximumRadius
    //var xMaximum = sqrt(maximumRadius^2 - (y-centerY)^2).
     
    var xDirection = Math.floor( 2*Math.random() ) == 0 ? -1 : 1;
    var xMaximum = Math.sqrt( maximumRadius*maximumRadius - (y - centerY)*(y - centerY) );
    var xDistance = Math.floor( xMaximum * Math.random() );
    var x = centerX + xDirection*xDistance;    

    /*global id*/
    id('light').value = luminosity;
    id('opacity').value = opacity;
    showColor(x,y);
    id('lightNum').value = luminosity;
    id('opacityNum').value = opacity;
    id('hueNum').value = degrees;
    id('saturationNum').value= saturation;
};

window.onresize = function(){
    centerX = parseFloat(window.innerWidth/2, 10);
};
    
//click anywhere on the colored circle to choose the color and move the ball
/*global on*/
on("mousedown",id('colorWheel'),function(e){
    x = e.clientX;
    y = e.clientY;
    showColor(x,y);
});
//=============NEW DRAG AND NO DROP BELOW===================
//https://stackoverflow.com/questions/17992543/how-do-i-drag-an-image-smoothly-around-the-screen-using-pure-javascript
var dragAllowed = false;
on("mousedown", id('ball'), allowDrag);
on("mousemove", id('content'), dragDiv);
on("mouseup", id('ball'), prohibitDrag);
on("mouseout", id('ball'), maybeProhibitDrag);
//===========================================
function allowDrag(e){
    dragAllowed = true;
}
function dragDiv(e){
    if (dragAllowed){
        x = e.clientX;
        y = e.clientY;
        showColor(x,y);
    }
}
//============================================
function prohibitDrag(e){
        dragAllowed=false;
}
//============================================
function maybeProhibitDrag(e){// makes it hard to drop the ball
    //if dropped prematurely, see if we are 15 pixels away from the ball's coordinates
    var leftBehind = Math.abs(x - e.clientX)> 15 && Math.abs(y - e.clientY) > 15;
    //see if we're beyond the colored circle
    var newRadius = Math.sqrt(  (e.clientX - centerX)*(e.clientX - centerX) + (centerY - e.clientY)*(centerY - e.clientY) );
    // if mouse's cursor far enough away from the ball, go ahead and drop it
    if(leftBehind || (newRadius > maximumRadius)){
        dragAllowed=false;
    }
}
//=============NEW DRAG AND NO DROP ABOVE====================
//============keyboard input numbers event handlers
id('hueNum').onchange = changeHue;
id('hueNum').oninput = changeHue;
function changeHue(){
    hueNumFlag = true;
    if(!hueSliderFlag){
        var newValue = parseFloat(id('hueNum').value);
        if ( newValue > 360 && newValue < 364 ){//361,2,3
            id('hue').value = newValue - 360;
            id('hueNum').value = newValue;
        }
        if ( newValue < 0  && newValue > -4 ){//-1,-2,-3
            id('hue').value = newValue + 360;
            id('hueNum').value = newValue;
        }
        fixNumberError('hueNum', 'hue',0 ,360);
        id('hue').value = id('hueNum').value;
        mostRecentAngle = id('hueNum').value;
        newHue();
    }
    hueNumFlag = false;
}
id('saturationNum').onchange = changeSaturation;
id('saturationNum').oninput = changeSaturation;
function changeSaturation(){
    saturationNumFlag = true;
    if(!saturationSliderFlag){
        fixNumberError('saturationNum','saturation', 0, 100);
        id('saturation').value = id('saturationNum').value;
        hueSatCore();
    }
    saturationNumFlag = false;
};
id('lightNum').onchange = changeLight;
id('lightNum').oninput = changeLight;
function changeLight(){
    lightnessNumFlag = true;
    if(!lightnessSliderFlag){
        fixNumberError('lightNum', 'light',0 ,100);
        id('light').value = id('lightNum').value;
        coreColorSetter();
    }
    lightnessNumFlag = false;
};
id('opacityNum').onchange = changeOpacity;
id('opacityNum').oninput = changeOpacity;
function changeOpacity(){
    opacityNumFlag = true;
    if(!opacitySliderFlag){
        fixNumberError('opacityNum', 'opacity', 0, 1.00);
        id('opacity').value = id('opacityNum').value;
        coreColorSetter();
        id('opacityNum').value = parseFloat(opacity).toFixed(2);
    }
    opacityNumFlag = false;
};
//==========mouse scroll wheel===============
//window.addEventListener("DOMMouseScroll",...;//Firefox
/*global attachEventHandler*/
attachEventHandler(window, "mousewheel", mouseWheelHandler);
function mouseWheelHandler(e){
    if(!wheelInUse){
        id('hueNum').value = parseInt(id('hueNum').value, 10) + wheelDelta(e);
        changeHue();
        return false;
    }
}
function wheelDelta(e){
    e = window.event || e; //old IE possible
    var delta = Math.max(-1, Math.min(1,(e.wheelDelta || -e.detail)));
    return delta;
}
//helper
/*global isNumber*/
function fixNumberError(elemID1, elemID2 ,min, max){
    if(id(elemID1).value < min || id(elemID1).value > max  || !isNumber(id(elemID1).value)){
        id(elemID1).value = id(elemID2).value;
    }
}
//========Slider event handlers============================
id('saturation').oninput = function(){
    slideSaturation();
};
id('saturation').onchange = function(){
    slideSaturation();
};
id('hue').oninput = function(){
    newHue();
};
id('hue').onchange = function(){
    newHue();
};
// helper===
function newHue(){
    hueSliderFlag = true;
    var currentAngle = id('hue').value ;
    var rad = degreesToRadians(mostRecentAngle);
    var x = (parseFloat(id('saturation').value) * maximumRadius * Math.cos(rad) / 100  + centerX);
    var y = (centerY - parseFloat(id('saturation').value) * maximumRadius * Math.sin(rad) / 100);

    var dx = x - centerX;
    var dy = centerY - y;
    var radius = Math.round(Math.sqrt(dy*dy + dx*dx));
    if (radius <= maximumRadius){
        moveBall(x,y);
    }
    showColor(x,y);
    mostRecentAngle = currentAngle;
    if(!hueNumFlag){
        id('hueNum').value = currentAngle;
    }
    hueSliderFlag = false;
}
//====helper
function slideSaturation(){
    saturationSliderFlag = true;
    if(!saturationNumFlag){
        id('saturationNum').value = id('saturation').value;
    }
    hueSatCore();
    saturationSliderFlag = false;
}

// helper
function hueSatCore(){
    var currentAngle = mostRecentAngle;
    var rad = degreesToRadians(mostRecentAngle);
    var x = (parseFloat(id('saturation').value) * maximumRadius * Math.cos(rad) / 100  + centerX);
    var y = (centerY - parseFloat(id('saturation').value) * maximumRadius * Math.sin(rad) / 100);

    var dx = x - centerX;
    var dy = centerY - y;
    var radius = Math.round(Math.sqrt(dy*dy + dx*dx));
    if (radius <= maximumRadius){
        moveBall(x,y);
    }
    showColor(x,y);
    mostRecentAngle = currentAngle;
}
//===============
id('light').oninput = function(){
    lightnessSliderFlag = true;
    coreColorSetter();
    if(!lightnessNumFlag){
        id('lightNum').value = luminosity;
    }
    lightnessSliderFlag = false;
};
id('light').onchange = function(){
    lightnessSliderFlag = true;
    coreColorSetter();
    if(!lightnessNumFlag){
        id('lightNum').value = luminosity;
    }
    lightnessSliderFlag = false;
};
id('opacity').oninput = function(){
    opacitySliderFlag = true;
    coreColorSetter();
    if(!opacityNumFlag){
        id('opacityNum').value = opacity;
    }
    opacitySliderFlag = false;
};
id('opacity').onchange = function(){
    opacitySliderFlag = true;
    coreColorSetter();
    if(!opacityNumFlag){
        id('opacityNum').value = opacity;
    }
    opacitySliderFlag = false;
};
id('hsla').ondblclick = function(){
    //copyToClipboard(id('hsla').innerHTML);
    var compDegrees;
    if( degrees > 180){
        compDegrees = degrees - 180;
    }else{
        compDegrees = degrees + 180;
    }
    copyToClipboard(" "+colorString + ", complementary hue: "+ compDegrees +" ");
};
function copyToClipboard(text) {
  prompt("Copy to Clipboard\nFor PC: Ctrl+C, Enter\nFor Mac: Cmd-C, Enter", text);
}
//========mouse wheel event handlers for labels, sliders and numbers (controls)======
var aryControls = [id('satSpan'), id('lightSpan'), id('opacitySpan'), id("saturation"),id("light"), id("opacity"),
    id("saturationNum"),id("lightNum"), id("opacityNum")];

var aryWheelHandlers = [ satWheelHandler, lightWheelHandler, opacityWheelHandler,satWheelHandler, lightWheelHandler, opacityWheelHandler,
     satWheelHandler, lightWheelHandler, opacityWheelHandler];
/*global forTwinArrays*/
forTwinArrays(aryControls, aryWheelHandlers, function(aSlider, aHandler){
    on("mousewheel", aSlider, aHandler);
});
/*global forAll*/
forAll(aryControls, function(aSlider){
    on("mouseout", aSlider, function(){
        wheelInUse = false;
    });
});
function satWheelHandler(e){
    wheelInUse = true;
    var delta = wheelDelta(e);
    var newSaturation =  parseFloat(id('saturationNum').value) +  delta;
    id('saturationNum').value = newSaturation;
    id('saturation').value = newSaturation;
    fixNumberError('saturationNum', 'saturation', 0, 100);
    slideSaturation();
}
function lightWheelHandler(e){
    wheelInUse = true;
    var delta = wheelDelta(e);
    var newLightness =  parseFloat(id('lightNum').value) +  delta;
    id('lightNum').value = newLightness;
    id('light').value = newLightness;
    fixNumberError('lightNum', 'light', 0, 100);
    coreColorSetter();
}
function opacityWheelHandler(e){
    wheelInUse = true;
    var delta = wheelDelta(e);
    delta *= 0.01;
    var newOpacity = (parseFloat(id('opacityNum').value) +  delta).toFixed(2);
    id('opacityNum').value = newOpacity;
    id('opacity').value = newOpacity;
    fixNumberError('opacityNum', 'opacity', 0, 1.00);
    coreColorSetter();
}
//=============helper functions=======
function radiansToDegrees(rad){
    return 180*rad/Math.PI;
}
function degreesToRadians(degrees){
    return Math.PI*degrees/180;
}
//====================================================
function showColor(x,y){

    dx = x - centerX;
    dy = centerY - y;
    var rad = Math.atan(dy/dx);
    degrees = Math.round(radiansToDegrees(rad));
    radius = Math.round(Math.sqrt(dy*dy + dx*dx));
    if (radius <= maximumRadius){
        id('radius').value = radius;
        id('x').value = parseFloat(dx).toFixed(2);
        id('y').value = parseFloat(dy).toFixed(2);
        if ( (dx < 0) && (dy <= 0) ){// - -
            degrees += 180;
        }else if ( (dx >= 0)  && (dy < 0) ){// + -
            degrees += 360;
        }else if ( (dx < 0) && (dy > 0) ){// - +
            degrees += 180;
        }
        if (!isNumber(degrees)){
            degrees = 0;
        }
        id('angle').value = degrees;
        moveBall(x,y);
        setColors();
    }
}
//============================
function moveBall(x,y){
    id('ball').style.marginTop = "" + (y - centerY + 3 ) +"px"; //3 or 4 px minor adjustment added for centering pointer
    id('ball').style.marginLeft = "" + (x - centerX) +"px";
}
//===============================
function setColors(){
    mostRecentAngle = degrees;
    if(saturationSliderFlag){
        saturation = id('saturation').value;
    }
    else{
        saturation = "" + Math.round((radius*100/maximumRadius));
    }
    luminosity = Math.round(parseFloat(id('light').value));
    coreColorSetter();
}
function coreColorSetter(){
    luminosity = id('light').value;
    opacity = parseFloat(id('opacity').value);
    opacity = opacity.toFixed(2);
    var compAngle;
    //===================
    if(mostRecentAngle > 180){
        compAngle = parseInt(mostRecentAngle - 180, 10);
    }
    else{
        compAngle = parseInt(mostRecentAngle + 180, 10);
    }
    //=================
    colorString = "hsla(" + mostRecentAngle  + ", " + saturation + "%, " +luminosity + "%, "+  opacity  + ")";
    complementString = "hsla(" + compAngle + ", " + saturation + "%," +luminosity + "%, "+  opacity  + ")";
    id('bod').style.background =  colorString;
    id('hsla').innerHTML = colorString;
    id('hsla').style.backgroundColor = complementString;

    if(!hueSliderFlag){
        id('hue').value = mostRecentAngle;
    }
    if(!saturationSliderFlag){
        id('saturation').value = saturation;
    }
     if(!hueNumFlag){
        id('hueNum').value = mostRecentAngle;
    }
    if(!saturationNumFlag){
        id('saturationNum').value = saturation;
    }
}

//================= mnemonic   ======================

var mword = document.getElementById("mnemonicWord");
var mpic = document.getElementById("mnemonicPicture");

(function(){
    
    var pictureVisible = false;
    
    mword.onclick = togglePicture;
    mword.onmouseout = hide;
    mpic.onclick = hide;
    
    //----| Internal Helpers |----
    function togglePicture(e){
        if(pictureVisible){
            hide(e);
        }
        else{
            showPicture(e);
            pictureVisible = true;          
        }        
    }
    function hide(e){
        hidePicture(e);
        pictureVisible = false;        
    }
})();

//----| Helpers |----
function hidePicture(e){
    mpic.style.opacity = 0;
    mpic.style.zIndex = -5;    
}
function showPicture(e){
    mpic.style.opacity = 1;
    mpic.style.zIndex = 5;    
}



