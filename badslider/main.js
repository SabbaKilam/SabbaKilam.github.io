var $ = {
    realSliderMouseIsDown: false,
    url: "https://SabbaKilam.github.io/music/",
    adjustRem: function adjustRem(){
        var newRem = 5 + window.innerWidth/50;
        document.documentElement.style.fontSize = newRem + "px";
        return newRem;
    }
};
$.id = function id(idString){
    return document.getElementById(idString);
};
$.attach = function attach(idString){
    //depends on $.id method
    $[idString] = $.id(idString);
};
window.onload = function(){
    $.adjustRem();
    window.onresize = $.adjustRem;
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
        
        var buttonWidth = $.customButton.getBoundingClientRect().width;
        var halfWidth = buttonWidth/2;
        $.customButton.style.left = ($.leftFromPct($.customSlider, e.target.value/100) - halfWidth)/$.adjustRem() + "rem";
        $.player.volume = e.target.value /100;    
    };
    $.realSlider.onmouseup = function(e){
        $.realSliderMouseIsDown = false;
    };
    $.realSlider.oninput  = function(e){
        var buttonWidth = $.customButton.getBoundingClientRect().width;
        var halfWidth = buttonWidth/2;
        $.customButton.style.left = ($.leftFromPct($.customSlider, e.target.value/100) - halfWidth)/$.adjustRem() + "rem";
        $.player.volume = e.target.value /100;    
    };
    $.leftFromPct = function(parent, pct){
        var sizeInfo = parent.getBoundingClientRect();
        var width = sizeInfo.width;
        var left = width * pct;
        return left;
    };    
    
};
