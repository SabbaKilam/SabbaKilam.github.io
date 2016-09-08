//====| function to adjust root em |====//
function adjustRem(min, max){
    document.documentElement.style.fontSize = ( min + (max - min) * window.innerWidth / 1920 )  + "px";
}
var minRem = 12;
var maxRem = 30;

window.onload = function (){
    adjustRem(minRem, maxRem);
};
window.onresize = function(){
    adjustRem(minRem, maxRem);    
};