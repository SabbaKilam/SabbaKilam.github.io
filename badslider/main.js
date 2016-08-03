var $ = {
    realSliderMouseIsDown: false,
    url: "https://SabbaKilam.github.io/music/"
};
$.id = function id(idString){
    return document.getElementById(idString);
};
$.attach = function attach(idString){
    //depends on $.id method
    $[idString] = $.id(idString);
};
$.attach("realSlider");
$.attach("customSlider");
$.attach("player");
$.player.src = $.url + "eyesface.mp3";
$.customSlider.innerHTML = $.player.src;
$.realSlider.onmousedown = function(e){
    $.realSliderMouseIsDown = true;
    var sizeInfo = e.target.getBoundingClientRect();
    var left = sizeInfo.left;
    var width = sizeInfo.width;
    var distance = e.clientX - left;
    var pct = distance /width;
    pct = parseInt(100 * pct, 10);
    $.realSlider.value = pct;
    $.customSlider.innerHTML = pct + "%";    
};
$.realSlider.onmouseup = function(e){
    $.realSliderMouseIsDown = false;
};
/*
$.realSlider.onmousemove = function(e){
    var sizeInfo = e.target.getBoundingClientRect();
    var left = sizeInfo.left;
    var right = sizeInfo.right;   
    var leftIsGood = left <= e.clientX;
    var rightIsGood = right >= e.clientX;
    if($.realSliderMouseIsDown && leftIsGood && rightIsGood){
        var width = sizeInfo.width;
        var distance = e.clientX - left;
        var pct = distance /width;
        pct = parseInt(100 * pct, 10);
        $.realSlider.value = pct;
        $.customSlider.innerHTML = pct + "%";
    }
};
*/
$.realSlider.oninput  = function(e){
    $.customSlider.innerHTML = e.target.value + "%";
};
