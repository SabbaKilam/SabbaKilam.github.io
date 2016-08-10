Author: Abbas Abdulmalik
Created: August 6, 2016
Revised: N/A
Notes:
    An attempt at an asynchronous version of the synchronous sister template.
    Methods available on "_" global object
        getElement = elem
        getArray --  of current class of elements
        html(string) = addHtml(string) -- of current element or class
        addHtml(string) = same as above (html)
        click(handler) -- of current elemenent or class 
        on(event, handler) -- of current element or class 
        toggle(onHandler, offHandler) -- of current element or class
        hover(overHandler, outHandler) -- of current element or class
        overAndOut(overHandler, outHandler) -- same as above (hover)
        touchHover(downHandler, upHandler) -- mousedown and mouseup of current element or class
        css(property, value)-- apply one css declaration on current element or class
        style(property, value)-- same as css (above) of current element or class
        styles(property, value)-- chainable series of css declarations of current element or class
        get(url, handler)-- ajax GET returns response
        keyPressed(e)-- returns keycode
        showProps(object, target)-- displays property type of object in target area
        log(items) -- same as console.log
        createList() returns linked-list object with the following methods:
            addData(newData)
            addToTop(newData)
            showData() -- logs data in console
            getHeadData()
            getTailData()
            length()
        makeList() -- same as above ( createList() )
        start(asynchFunction, optionalArgument) -- returns an object with then() method
            used to invoke callback functions dependent on result of the asynchFunction
        attach(idString[, idString2, ...] | [array of idStrings]) -- creates references for 
            specified DOM elements on the global "_" element.
        makeDraggable(obj) -- makes specified DOM object draggable on screen
        sizeFactory(minWidth, maxWidth) -- returns function of any name you wish, such as setRange(min, max),
            that returns a pixel amount linearly scaled between min and max for an expected screen range
            of minWidth and maxWidth
        symDiff(array1, array2, ...) -- returns an array of the symmetric difference of the given arrays
        type(aValue) -- returns a lower-case string of the data type provided
        trueType(aValue) -- returns a case-preserved string of the data provided.
        -- of current element or class
        -- of current element or class
        
       