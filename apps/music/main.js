document.body.onload = function(){
    /*global lib*/
    window.onresize = resizeApp;
    var titles = document.getElementsByClassName("title");
    resizeApp();
    //----------------------------
    setTimeout(function(){
        document.getElementById("splashScreen1").style.opacity = "0";
        document.getElementById("splashScreen2").style.opacity = "1";        
    }, 2000);
    setTimeout(function(){
        document.getElementById("splashScreen2").style.opacity = "0";
        document.getElementById("appHolder").style.opacity = "1";
    }, 4000);    
    //=================
    setInterval(function(){
        resizeApp();
    }, 10);

    function resizeApp(){
        document.documentElement.style.fontSize = (2 + window.innerWidth/85) + "px";
        setTimeout(function(){
            lib.styles(lib.id("splashScreen1"))
                ("width","60rem")
                ("padding-bottom","15rem")
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
            ("background","teal")
            ("text-align","center")
            ("border-radius","8px")
            ("margin-top",top)
            ("color","white")
            ("padding","1%")
            ("box-shadow","3px 3px 8px #FFF")
        ;
    });    
};

