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
    //account for an array (of strings, hopefully DOM element id strings)
    else if(Object.prototype.toString.call(idString) == "[object Array]"){
        idString.forEach(m=>{
            $.attach(m);
        });
    }
};
// A chainable styles method:
$.styles = function styles(object){
	return function style(property, value){
		object.style[property] = value;
		return style;
	};
};
$.leftFromPct = function(parent, pct){
    var sizeInfo = parent.getBoundingClientRect();
    var width = sizeInfo.width;
    var left = width * pct;
    return left;
};
$.slideLeftBorder = function slideLeftBorder(element, pct, color){
    /*
        1. Get element's current width
        2. Use the given percentage from its left (pct) to get the left border's size
        3. Subtract that amount from the current with to get the new width of the element
        4. apply them both
    */
    // 1. Get element's current width
    var currentWidth = parseInt(element.getBoundingClientRect().width, 10); //in pixels
    var borderLeft = parseInt(pct * currentWidth, 10);
    var newWidth = currentWidth - borderLeft;
    //apply new left border and width
    $.styles(element)
        ("border-left", borderLeft+"px solid " + color)
        ("width", newWidth+"px")
    ;
    return borderLeft;
};
//====================| Here's the App |=========================
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
        var sizeInfo = $.realSlider.getBoundingClientRect();
        var left = sizeInfo.left;
        var width = sizeInfo.width;
        var distance = e.clientX - left;
        var pct = distance /width;
        $.player.volume = pct;
        //adjust customSliderSize
        $.realSlider.value = parseInt(100 * pct, 10);
        var buttonWidth = $.customButton.getBoundingClientRect().width;
        var halfWidth = buttonWidth/2;
        var newButtonLeft = ($.leftFromPct($.customSlider, e.target.value/100) - halfWidth)/$.adjustRem();
        $.customButton.style.left = newButtonLeft + "rem";
        $.player.volume = e.target.value /100;
        $.songTitle.innerHTML = $.player.volume.toFixed(2);

    };
    $.realSlider.onmouseup = function(e){
        $.realSliderMouseIsDown = false;
    };
    $.realSlider.oninput  = function(e){
        var buttonWidth = $.customButton.getBoundingClientRect().width;
        var halfWidth = buttonWidth/2;
        $.customButton.style.left = ($.leftFromPct($.customSlider, e.target.value/100) - halfWidth)/$.adjustRem() + "rem";
        $.player.volume = e.target.value /100; 
        $.songTitle.innerHTML = $.player.volume.toFixed(2);
    };
};
