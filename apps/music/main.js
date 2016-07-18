document.body.onload = function(){
    /*global lib*/
    window.onresize = resizeApp;
    var titles = document.getElementsByClassName("title");
    resizeApp();
    //----------------------------

    setTimeout(function(){
        document.getElementById("splashScreen").style.opacity = "0";
    }, 2000);
    //=================
    setInterval(function(){
        resizeApp();
    }, 10);

    function resizeApp(){
        document.documentElement.style.fontSize = (2 + window.innerWidth/85) + "px";
        setTimeout(function(){
            lib.styles(lib.id("splashScreen"))
                ("width","40rem")
                ("padding-bottom","10rem")
                ("","")
                ("","")
                ("","")
                ("","")
                ("","")
                ("","")
                ("","")
            ;            
        },1);
    }
    Array.prototype.forEach.call(titles, function(m){
        var top = 0.5*(window.innerHeight) - 0.5*(m.getBoundingClientRect().height) + "px";
        lib.styles(m)
            ("background","gray")
            ("text-align","center")
            ("border-radius","5px")
            ("margin-top",top)
            ("color","white")
            ("","")
            ("","")
        ;
    });    
};

