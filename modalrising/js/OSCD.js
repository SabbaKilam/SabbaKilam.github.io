//==================================================
/*
    A Suite of three common DOM utilities from Robin Nixon.
    1.  A wrapper for document.getElementById(obj)
        Clever: you can use the object reference or its id string.
    2.  Wrapper for style property; again obj or id can be used.
    3.  C(className) returns a collection (array) of all elements in the DOM with class name className.
        Objects with multiple classes have only the first assigned class returned.
*/
function O(obj){
    if (typeof obj == 'object') return obj;
    else return document.getElementById(obj);
}

function S(obj){
    return O(obj).style;
}

function C(className){
    var elements = document.getElementsByTagName('*');
    var objects = [];
    for (var i = 0 ; i < elements.length ; ++i){
        if (elements[i].className == className){
            objects.push(elements[i]);
        }
    }
    return objects;
}
//=================================================================
/*
    A seemingly "saner" alternative to DnD in AbbasLib.js
*/
function makeDraggable(obj){
    var mousePressed = false
    ,   xyOffsets = {x:0, y:0};
    ;
    
    //save its original position
    var originalPosition = [obj.offsetLeft, obj.offsetTop];
    
    obj.style.position = "absolute";
    
    //after position absolute, attempt to restore original
    obj.style.left = originalPosition[0]+"px";
    obj.style.top = originalPosition[1]+"px";
    
    //======event handlers===========
    obj.addEventListener("mousedown",function(e){
        mousePressed = true;
        saveOffsets(e);            
        //e.preventDefault();        
    });
    //--------------------------------     
    obj.addEventListener("mouseup", function(){
        mousePressed = false;
    });   
    //-----------------------------------
    obj.addEventListener("click",function(e){
        //e.preventDefault();
        positionCursor(e);
    });
    //--------------------------------
    obj.addEventListener("mousemove",function(e){          
        if(mousePressed){
            positionCursor(e);
        }
    });
    //---------------------------------
    obj.addEventListener("mouseout", function(){
        mousePressed = false;
    });
    //----------helpers for handlers--------------
    function positionCursor(e){
        obj.style.left = (e.clientX - xyOffsets.x) + 0 + "px";//scrollLeft()         
        obj.style.top = (e.clientY - xyOffsets.y) + 0 + "px"; // scrollTop()
    }
    //---------------------------------------------
    function saveOffsets(e){
        xyOffsets.x = e.clientX - obj.offsetLeft;
        xyOffsets.y = e.clientY - obj.offsetTop;
    }
    //------------------------------------------
 
}//-----------end of makeDraggable()---------------------- 
    //-----------------------offsets left and top from scroll bars---------------
    function scrollTop(){
        var scrolltop = (document.documentElement && document.documentElement.scrollTop) || 
            document.body.scrollTop;
        return scrolltop;
    };
    //---------------------------------------------
    function scrollLeft(){
        var scrollleft = (document.documentElement && document.documentElement.scrollLeft) || 
            document.body.scrollLeft;
        return scrollleft;
    }
    //---------------------------------------------   
//==========================================================
/**
 * linkedList() returns an  
 * object that owns a "growable" collection of
 * data objects, each of which contains two 
 * properties: "data", and "next". The "data" property
 * holds any data the user may wish, and "next" property holds 
 * a reference to the next object in the collection.
 * 
 * The returned object has the closure (private) properties,
 * firstListObject and lastListObject, that can be used 
 * to access the members of the linked link collection. 
 * As their names indicate, they hold references to the first and
 * last members of the collection of linked list objects.
 * Another private closure property, listLength holds the 
 * count of the linked list items. It can be read by the
 * length() method.
 * 
 * The returned object has these methods so far:
 * addToList(newData), addToTop(newData),
 * getHead(), getTail(), showAllData(), length()
 */
 //=============================
 function linkedList(){
    //-----head and tail pointers---------
    var firstListObject = null
    ,   lastListObject = null
    ,   listLength = 0
    ;    
    //-----helper------------
    function createListObject(newData){
        return {data: newData, next: null};
    }
    //---------------------
    var listObject = {
        //---methods---
        addToList: function addToList(newData){
           var newListObject = createListObject(newData);
           if(firstListObject === null){
            firstListObject = newListObject;
           }
           if(lastListObject !== null){
            lastListObject.next = newListObject;
           }
           lastListObject = newListObject;
           listLength++;
        },
        //------------------------------------------
        addToTop: function addToTop(newData){
           var newListObject = createListObject(newData);
           if(lastListObject === null){
            lastListObject = newListObject;
           }
           newListObject.next = firstListObject;
           firstListObject = newListObject;
           listLength++;
        },
        //-------------------------------------------
        showAllData: function showAllData(){
            var obj = firstListObject;
            while(obj){
                console.log(obj.data);
                obj = obj.next;
            }
            console.log("");
        },
        //-------------------------------------------
        getHead: function getHeadData(){
            return firstListObject;
        },
        //-------------------------------------------
        getTail: function getTailData(){
            return lastListObject;
        },
        //-------------------------------------------
        length: function length(){
            return listLength;
        },
    };
    //---------------------
    return listObject;
}
//===============================
//----------------------------------------------------------
/**
 * curry(function):
 * Attempt to build a JS curry function.
 * Pass it any function, and it returns the "curried" version.
 * The curried version of the function can now receive an incorrect
 * number of arguments and accumulate them on successive calls until
 * the correct number are collected. Only then will the arguments be used
 * to calculate the originally intended answer as a return value.
 * 1.) If the required number of arguments is LESS THAN the expected number,
 * the curried function collects those and returns the curried function.
 * 2.) If the required number of arguments is EQUAL TO the expected number,
 * whether initially, or after subsequent calls that collect them,
 * the curried function returns the originally intended calculated answer.
 * 3.) If the required number of arguments is GREATER THAN the expected number,
 * the excess arguments are ignored and the curried function
 * returns the originally intended calculated answer. 
 * 
*/
//----------------------------------------------------------
function curry(f){
    var i = 0                   // count used to collect curried function's args
    ,   rightSize = f.length    // the number of originally expected args
    ,   argsArray = []          // holder of growing args collection
    ;
    return function curriedF(){ // collect args provided by curried function
        for ( i = 0; i < arguments.length ; i++ ){
            argsArray.push(arguments[i]);
        }
        if ( argsArray.length >= rightSize ){
            var fullArray = argsArray;      // Save 'em before you...
            argsArray = [];                 // kill 'em (to start over again)
            return f.apply(null,fullArray); // return the originally intended result
        }
        else{
            return curriedF;                // Not enough arguments, so return to get 'em
        }
    };
}//==END of curry()==
//=========show() shorthand for console.log=========================
/**
 * show() function, hopefully same as console.log()
 */
//------------------------------------------
function show(){
    var args = [].map.call(arguments, function(e){
		return e;
	});
	try{
		console.log.apply(console,args);		
	}
	catch(error){
		console.log(error.toString());
        return false;
	}
    return true;
}
//=====================================
/**====================================================
liquidPixelFactory is a "responsive design"" function, that might be used to replace CSS media queries.

liquidPixelFactory requires two numeric arguments representing the minimum and maximum viewport size an application's device window is expected to have.

So far, it is a raw function with no error-checking, so make sure the arguments are positive numbers, the first being smaller than the second.

It has no side effect, but returns a function (internally named setPixelValue) to be assigned
to a variable of any name of the programmer's choosing.

    Example 1:
    var setPixelValueSmallScreen = liquidPixelFactory(300, 500);
    // the 200 and 500 values represent the expected minimum and maximum pixel range of a small viewport
    var setPixelValueLargeScreen = liquidPixelFactory(800, 2000)
    // the 800 and 2000 values represent the expected pixel range of a large viewport device

These newly assigned functions (setPixelValueSmallScreen and setPixelValueLargeScreen) can be called, triggered by a window resizing (or any event of your choosing), to set the pixel size of an HTML attribute or CSS property between a specified minimum and maximum.
    
    Example 2:
    window.addEventListener("resize", function(){
        document.getElementById('div1').style.fontSize = setPixelValueSmallScreen(15,20) + "px";
        document.getElementById('div2').style.fontSize = setPixelValueLargeScreen(30,50) + "px";        
    }, false);
    
Neither function has side effects, but both return a numeric value (between 15 to 20 pixels in the first case, and between 30 and 50 pixels in the second case). For screen sizes above or below the ranges specified earlier, the pixel values never exceed those limits.  

liquidPixelFactory is a "lambda function" in the sense that it returns an actual function (setPixelValue) that is defined internally, which uses liquidPixelFactory's screen size variables. As such, setPixelValue is a "closure," since it can safely use the variables of its parent function, even after the parent's invocation has terminated.

In Example 2 above, the fontSize responds smoothly and linearly to the window's inner width. For instance, if the window's inner width happens to be 400 pixels when the handler is triggered, div1's fontSize will be 17.5 pixels, which is right in the middle of the range. div 2's fontSize will be fixed at 30 pixels because a 400 pixel viewport in below its 800 pixel minimum.
=====================================================*/
function liquidPixelFactory(minWidth, maxWidth){

    var minWidth = minWidth;
    var maxWidth = maxWidth;

    return  function setPixelValue(minPx, maxPx){
    
                var pixelValue = 0;

                if ( innerWidth < minWidth ){
                    pixelValue = minPx;
                }
                else if ( innerWidth > maxWidth ){
                    pixelValue = maxPx;
                }
                else{
                    // y = mx + b, where m = delta y / delta dx ... 
                    // and b = Yo - mXo (for any valid pair of x & y):
                    pixelValue = (maxPx - minPx)*innerWidth/(maxWidth - minWidth) +
                    minPx - (maxPx - minPx)*minWidth/(maxWidth - minWidth);
                }	

                return pixelValue;
            }
}
/**========================================================================
    Make an object (chain) that provides a way for functions to be chained
    after calling an asynchronous function on which they depend.
    Example: func1 and func2 depend on the result of asychFunc, so ...
    
        chain.start(asynchFunc).then(func1).then(func2);
    
    The requirements of the functions to use this api:
        1. The slow asynchronous function is passed as a callback to chain's start method
           The asych function must be defined using one formal parameter passed to it. This parameter,
           call it 'q', is used to "open the floodgates" of queue-ed up functions to be flushed
           from the queue, passing its result data to them like this:
           
                function slowAsynchFunction(q){
                    var result = null;
                    
                    //do all the slow asynch suff here.
                    //when done, put the resulting data in to the result varaible
                    //and call q;s flush function with the result as the arguments
                    
                    result = realResultData;
                    q.flush(result);
                }
                
        2.  The dependent functions that follow the asynch functions are defined 
            with no formal parameters, but the asynch's result data is made available
            as the initial member if the 'arguments' object:
            
                function dependentFunction(){
                    var neededResult = arguments[0];
                    //use neededResult as needed
                }
        3. Now, chain them like this:
        
            chain.start(slowAsyncFunc1)
                .then(depFunc1a)
                .then(depFunc1b)
                .start(slowAsyncFunc12)
                .then(depFunc2a)
                .then(depFunc2b)
            ;//done           
            
    Clued in by Dustin Diaz: http://www.dustindiaz.com/async-method-queues/
*/
//-------------------------------------------------------------
var chain = {
    start: function start(slowFunc){
        
        //making the queue
        var queue = {                
                stack: [],
                response: null,
                flushing: false,
                then: function then(f){
                    if(this.flushing){
                        f(this.response);
                    }
                    else{
                        this.stack.push(f);
                    }
                    return this;
                },
                flush: function flush(r){
                    if(this.flushing){return;}
                    this.response = r;
                    this.flushing = true;
                    while(this.stack[0]){
                        this.stack.shift()(this.response);                       
                    }
                },
                start: this.start,
        };
        
        //using the queue: slowFunc should flush q at the end
        if(arguments[0])slowFunc(queue);
        
        //returning the queue
        return queue;
    }
};
//====================================================
//====================================================
/*
    For two Arrays, matched or not in length.
*/
//=====================================================
function forBothDo(things1, things2, action){
    for(var i = 0; i < things1.length; i++ ){
        for(var j = 0; j < things2.length; j++){
            //action on the ordered pair Cartesian product things[i] X things[j] = (things1[i],things2[j]
            action(things1[i],things2[j]);
        }
    }
}
//=====================================================
function forBoth(things1, things2, action){
    for(var i = 0; i < things1.length; i++ ){
        for(var j = 0; j < things2.length; j++){
            action(things1[i],things2[j]);
        }
    }
}
//=====================================================
function keyPressed(e){
    var theKey=0;
    e=(window.event)?event:e;
    theKey=(e.keyCode)?e.keyCode:e.charCode;
    return theKey;
}    
//==================================================