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
$.attach("songTitle");
$.attach("customButton");
$.player.src = $.url + "eyesface.mp3";
$.songTitle.innerHTML = $.player.src;
$.realSlider.onmousedown = function(e){
    $.realSliderMouseIsDown = true;
    var sizeInfo = e.target.getBoundingClientRect();
    var left = sizeInfo.left;
    var width = sizeInfo.width;
    var distance = e.clientX - left;
    var pct = distance /width;
    $.player.volume = pct;
    pct = parseInt(100 * pct, 10);
    $.realSlider.value = pct;
    //$.customSlider.innerHTML = pct + "%";  
    //$.customButton.style.left = e.target.value + "px";  
    $.customButton.style.left = $.leftFromPct($.customSlider, e.target.value/100) + "px";
    $.player.volume = e.target.value /100;    
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
    //$.customSlider.innerHTML = e.target.value + "%";
    $.customButton.style.left = $.leftFromPct($.customSlider, e.target.value/100) + "px";
    $.player.volume = e.target.value /100;  
};
$.leftFromPct = function(parent, pct){
    var sizeInfo = parent.getBoundingClientRect();
    var width = sizeInfo.width;
    var left = width * pct;
    return left;
};