var $ = {};
$.id = function id(idString){
    return document.getElementById(idString);
};
$.realSlider = $.id("realSlider");
$.realSlider.onclick = function(e){
    var sizeInfo = e.target.getBoundingClientRect();
    var left = sizeInfo.left;
    var width = sizeInfo.width;
    var distance = e.clientX - left;
    var pct = distance /width;
    pct = parseInt(100 * pct, 10);
    $.realSlider.value = pct;
    //alert(pct);
};
