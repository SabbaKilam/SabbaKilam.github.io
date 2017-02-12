let flipperContent = document.querySelector("#flipperContent");
let flipper = document.querySelector("#flipper");
let secondHalf= document.querySelector("#secondHalf");

let flipping = false;

flipper.onclick = simpleFlip;
flipper.ontouchstart = simpleFlip;
secondHalf.onclick = resetFlipper;

function resetFlipper(){
    flipperContent.style.transform = "rotateX(0deg)";
    flipper.style.transform = "rotateX(0deg)";
    flipper.style.transition = "all 0.0s linear";
    flipperContent.style.background = "url(img/NightMountain-2.jpg) no-repeat top";
    flipperContent.style.backgroundSize = "contain";      
}

function simpleFlip(e){
    e.preventDefault();
    if(flipping){return;}
    flipping = true;
 
    resetFlipper();
                
    let angle = 0;
    setTimeout(function(){
        let timerId = setInterval(function(){
            angle += 3; //3 degrees every 16.666ms => 1 second for 180 degrees
            flipper.style.transform = "rotateX(" + angle + "deg)";
            if( angle >= 90){
                clearInterval(timerId);
                //angle = 90;
                flipping = false;
                flipper.style.visibility = "hidden";
                setTimeout(function(){
                    flipper.style.transition = "all 0.5s linear";               
                    flipperContent.style.transform = "rotateX(180deg)";
                    flipper.style.transform = "rotateX(180deg)";                
                    flipperContent.style.background = "url(img/BoatsAerialView-1.jpg) no-repeat bottom";
                    flipperContent.style.backgroundSize = "contain";
                    flipper.style.visibility = "visible";                
                },40);
            }
        },16.6666667);        
    },500);
}