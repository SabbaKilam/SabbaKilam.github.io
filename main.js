/*
    Author: Abbas Abdulmalik
    Creation Date: April 2, 2016
    Title:   Main resume (cv)
    Revised:
    Purpose: a gitHub "about me" website
    Notes:
*/
//========| Global Variables, Data, etc. |====
/*
    global rekwire
    rekwire is contained in
    rekwire.js, loaded by index.html
*/
//var base = 'https://dl.dropboxusercontent.com/u/21142484/modules/';
var _ = rekwire("module");

//state variables kept from global space in vars object
_.vars = {
    menuVisible: false,
    currentPageIndex: 0,
    pageCount: 0,
    flipping: false,
    transitTime: 0.75,//transition time of flip
    originalBackground: null,
    flashing: false
};

//========| Driver's Seat |===================

_(window).on("load", initialize);
_(window).on("resize", adjustAllSizes);
_("#menuButton").click(toggleMenu);
_("#cross").click(toggleMenu);
setFlipClickHandler();

//========| Under the Hood |==================

function initialize(){
    dissovleSplashPage();
    adjustAllSizes();
    setInitialPage();
}
function adjustAllSizes(){
    resizeRootEm();
    resizePage();
}
function resizeRootEm(){
    document.documentElement.style.fontSize =(8 + window.innerWidth/100) +"px";
}

function setInitialPage(){
    var pgSpanWidth = _("#pg1Span").elem().getBoundingClientRect().width;
    var pg1Width = _("#pg1").elem().getBoundingClientRect().width;
    //var newLeft = (1/2)*(pg1Width - pgSpanWidth) +"px";
    var newLeft = 0.5*(window.innerWidth - pgSpanWidth)+"px";
    var msg = '<br/>"Developers want to learn on the job,<br/>' +
    'work-life balance, and money.<br/>'+
    'But mostly, developers just want to code."<br/>'+
    '--StackOverflow Survey, 2016';
    _("#pg1Span").styles
        ("paddingLeft", newLeft)
        ("lineHeight","200%")
    ;
    _("#pg1Span").html(msg);
}
function dissovleSplashPage(){
    _("#splashPage").styles
        ("opacity","0")
        ("visibility","hidden");
};
function toggleMenu(){
    if(_.vars.menuVisible){
        _("#menu").styles
            ("opacity","0")
            ("visibility","hidden");
    _.vars.menuVisible = false;
    }
    else{
        _("#menu").styles
            ("opacity","1")
            ("visibility","visible");
    _.vars.menuVisible = true;
    }
    //------
    objectColorFlash( _("#menuButton").elem(),"white", 0.25 );
}
function resizePage(){
    if(window.innerWidth <= 600){
        _(".page").styles
            ("width", "98.5%")
            ("borderTop","5px solid lightgray")            
        ;
        _("#menu").css("width","98.5%");
    }
    else{
        _(".page").styles
            ("width", "75%")
            ("borderTop","5px dashed lightgray");
        _("#menu").css("width","75%");
    }
}

function setFlipClickHandler(){
    _(".page").on("click", function(e){
        if(_.vars.flipping)return;
        //prohibit new flip while still flipping
        _.vars.flipping = true;

        //start the flip
        _.vars.originalBackground = _(e.target).elem().style.background;
        _(e.target).styles
             ("background","black")
             ("transform","rotateX(270deg)")
             ("transition","all " + _.vars.transitTime + "s ease");

        /*
            Halfway through the flip, quickly bring
            the next page forward (z-index = 2)
            (the array has only two pages, the active one and the next one)
        */
        setTimeout(function(){
            _(".page").array().forEach(function(m){
                if(m != e.target){
                    _(m).styles
                         ("zIndex","2")
                         ("transition","all " + 0 + "s ease");
                }
            });
        },1000*_.vars.transitTime*0.5);

        /*
            When flipper is out of sight (270deg):
            1.) immediately restore original background
            2.) push flipper behind the next page (z-index = 1)
            3.) rotate it back into starting position
        */
        setTimeout(function(){
            _(e.target).styles
                 ("background", _.vars.originalBackground)
                 ("zIndex","1")
                 ("transform","rotateX(0deg)")
                 ("transition","all " + 0 + "s ease");
        },1000*_.vars.transitTime);

        /*
            allow the next flip only after flip completes
        */
        setTimeout(function(){
            _.vars.flipping = false;
        },1000*_.vars.transitTime);
    });//===| END flip click event handler |===
}//===| END of setFlipClickHandler |===

function objectColorFlash(object, color, duration){
    //if busy flashing - do not disturb
    if(_.vars.flashing)return;
    _.vars.flashing = true;
    var oldColor = object.style.color;
    
    object.style.color = color;
    //return old color after flashing color
    setTimeout(function(){
        object.style.color = oldColor;
        _.vars.flashing = false;
    }, 1000*duration);
    
}
//------------------