var $ = {
    realSliderMouseIsDown: false,
    url: "https://SabbaKilam.github.io/music/",
    adjustRem: function adjustRem(){
        var newRem = 6 + window.innerWidth/45;
        document.documentElement.style.fontSize = newRem + "px";
        return newRem;
    }
};
$.id = function id(idString){
    return document.getElementById(idString);
};
$.attach = function attach(idString){
    //depends on $.id method
    if(typeof idString === "string" && arguments[1]=== undefined){
        $[idString] = $.id(idString);        
    }
    //account for multiple strings
    else if(typeof idString === "string" && arguments.length > 1){
        Array.prototype.forEach.call(arguments, arg=>{
            $.attach(arg);
        });
    }
    else if(Object.prototype.toString.call(idString) == "[object Array]"){
        idString.forEach(m=>{
            $.attach(m);
        });
    }
};
window.onload = function(){
    $.adjustRem();
    $.attach("realSlider","customSlider","player","songTitle","customButton");
    $.player.src = $.url + "eyesface.mp3";
    $.songTitle.innerHTML = $.player.src;
    $.player.volume = 0.5;
    $.customButton.style.left = $.customSlider.getBoundingClientRect().width/2+ "px";
    //---------------------------------------
    window.onresize = $.adjustRem;    
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
        $.songTitle.innerHTML = $.player.volume;        
    };
    $.realSlider.onmouseup = function(e){
        $.realSliderMouseIsDown = false;
    };
    $.realSlider.oninput  = function(e){
        var buttonWidth = $.customButton.getBoundingClientRect().width;
        var halfWidth = buttonWidth/2;
        $.customButton.style.left = ($.leftFromPct($.customSlider, e.target.value/100) - halfWidth)/$.adjustRem() + "rem";
        $.player.volume = e.target.value /100; 
        $.songTitle.innerHTML = $.player.volume;
    };
    $.leftFromPct = function(parent, pct){
        var sizeInfo = parent.getBoundingClientRect();
        var width = sizeInfo.width;
        var left = width * pct;
        return left;
    };    
    
};
