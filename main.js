/*
    Author: Abbas Abdulmalik
    Creation Date: April 2, 2016
    Title:   Main resume (cv)
    Revised:
    Purpose: a gitHub "about me" website
    Notes:
*/
//========| Global Variables, Data, etc. |====

/*global rekwire*/
/*  rekwire is contained in
    rekwire.js, loaded by index.html
*/
//var base = 'https://dl.dropboxusercontent.com/u/21142484/modules/';
var _ = rekwire("module");
var flag = {
    menuVisible: false
}; //holds state variable
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
}
function adjustAllSizes(){
    resizeRootEm();
    resizePage();
}
function resizeRootEm(){
    document.documentElement.style.fontSize =(8 + window.innerWidth/100) +"px";
}
function dissovleSplashPage(){
    _("#splashPage").styles
        ("opacity","0")
        ("visibility","hidden");
};
function toggleMenu(){
    if(flag.menuVisible){
        _("#menu").styles
            ("opacity","0")
            ("visibility","hidden");
    flag.menuVisible = false;
    }
    else{
        _("#menu").styles
            ("opacity","1")
            ("visibility","visible");
    flag.menuVisible = true;
    }
}
function resizePage(){
    if(window.innerWidth <= 480){
        _(".page").array().forEach(function(m){
            m.style.width = "98.5%";
        });
        _("#menu").css("width","98.5%");
    }
    else{
        _(".page").array().forEach(function(m){
            m.style.width = "60%";
        });
        _("#menu").css("width","60%");        
    }
}

function setFlipClickHandler(){
    /*
        flip handler established in an IIFE
        to private-ize the flipping flag,
        and other data, and to avoid name collisions
        on the global object
    */
    (function(){

        var flipping = false;
        var t = 0.75; //transition time of flip
        var originalBackground;

        _(".page").on("click", function(e){

            if(flipping)return;

            //prohibit new flip while still flipping
            flipping = true;

            //start the flip
            originalBackground = _(e.target).elem().style.background;
            _(e.target).styles
                 ("background","black")
                 ("transform","rotateX(270deg)")
                 ("transition","all " + t + "s ease");

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
            },1000*t*0.5);

            /*
                When flipper is out of sight (270deg):
                1.) immediately restore original background
                2.) push flipper behind the next page (z-index = 1)
                3.) rotate it back into starting position
            */
            setTimeout(function(){
                _(e.target).styles
                     ("background", originalBackground)
                     ("zIndex","1")
                     ("transform","rotateX(0deg)")
                     ("transition","all " + 0 + "s ease");
            },1000*t);


            /*
                Just over halfway through the flip (65%)
                allow the next flip.
            */
            setTimeout(function(){
                flipping = false;
            },1000*t*0.65);
        });
    })();

}//===| END ofsetFlipClickHandler |===

