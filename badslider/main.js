var $ = {};
$.id = function id(idString){
    return document.getElementById(idString);
};
$.realSlider = $.id("realSlider");
$.realSlider.onclick = function(e){
    alert(e.clientX);
};
