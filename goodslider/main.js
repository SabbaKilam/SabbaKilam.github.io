function id(idString){
    return document.getElementById(idString);
}

//---------------------
var faceSlider = id("faceSlider");
var realSlider = id("realSlider");
var bead = id("bead");
//----------------------
realSlider.oninput = moveBead;
realSlider.onmousedown = moveBead;
realSlider.onchange = moveBead;

window.onload = moveBead;
window.onresize = moveBead;

//----------------------
function moveBead(){
    //var buttonWidth = btn.getBoundingClientRect().width;
    var buttonWidth = bead.getBoundingClientRect().width;
    
    /*
        Use the value of the realSlider
        to calculate the left margin of the button
        which is a percentage of the faceSlider's width
        minus half the button's width
    */
    //get the faceSlider info
    var faceInfo = faceSlider.getBoundingClientRect();
    var sliderWidth = faceInfo.width;
    var btnMarginLeft = realSlider.value/100 * sliderWidth  - buttonWidth/2 ;
    
    //btn.style.marginLeft = btnMarginLeft + "px";
    bead.style.marginLeft = btnMarginLeft + "px";
    
}