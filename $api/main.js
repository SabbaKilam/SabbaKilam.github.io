/*global $*/
$(window).on("click", e=>{
    alert(e.target.id);
});
$(window).on("mouseover", e=>{
    $("div3").html(e.target.id);
});
//=================================
$.div1 = //first div
$.div2 = //2nd div
$.div3 = //third div
"";
$.attachDomObjects();
//==================================

$($.div1).styles
    ("background: white")
    ("color: black")
;
$("div2").styles
    ("background: teal")
    ("color: white")
    ("border: 1px solid red")
;
$($.div3).styles
    ("position: fixed")
    ("bottom: 0 ")("left: 0")("right: 0")
    ("margin: auto")
    ("color: white")("background: blue")
    ("border-radius: 0.5rem")("width: 60%");

$.browserPrefix.forEach(prefix=>{
    $($.div2).style("background", prefix+"linear-gradient(teal, white)");
});
$($.div1).on("mouseover", e=>{
    $(e.target).addhtml(" MOUSEOVER");    
});
$($.div1).on("mouseout", e=>{
    $(e.target).html("(div 1)");
});

$($.div2).on("mouseover", e=>{
    $("div2").styles("background: transparent");
});
$($.div2).on("mouseout", e=>{
    $.browserPrefix.forEach(prefix=>{
        $($.div2).style("background", prefix+"linear-gradient(teal, white)");
    });
});
