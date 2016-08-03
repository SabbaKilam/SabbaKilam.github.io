var $ = {
    realSliderMouseIsDown: false
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
$.realSlider.onmousedown = function(e){
    $.realSliderMouseIsDown = true;
};
$.realSlider.onmouseup = function(e){
    $.realSliderMouseIsDown = false;
};
$.realSlider.onmousemove = function(e){
    if($.realSliderMouseIsDown){
        var sizeInfo = e.target.getBoundingClientRect();
        var left = sizeInfo.left;
        var width = sizeInfo.width;
        var distance = e.clientX - left;
        var pct = distance /width;
        pct = parseInt(100 * pct, 10);
        $.realSlider.value = pct;
        $.customSlider.innerHTML = pct + "%";
    }
};
