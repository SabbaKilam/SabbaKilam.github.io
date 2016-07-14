document.body.onload = function(){
    var titles = document.getElementsByClassName("title");
    [].forEach.call(titles, function(m){
        var top = 0.5*(window.innerHeight) - 0.5*(m.getBoundingClientRect().height) + "px";
        styles(m)
            ("background","gray")
            ("text-align","center")
            ("border-radius","5px")
            ("margin-top",top)
            ("color","white")
            ("","")
            ("","")
        ;
    });
    document.getElementById("splashScreen").style.opacity = "0";
    //------
    function styles(object){
        var f = function f(prop, value){
            object.style[prop] = value;
            return f;
        };
        return f;
    } 
};

