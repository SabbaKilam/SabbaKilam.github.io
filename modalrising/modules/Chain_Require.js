//=========================================
/*
    Author: Abbas Abdulmalik
    Creation Date: September 19, 2015
    Revised: September 20, 2015
    Purpose: Make an object (chain) provides a way for functions to be chained
    after calling an asynchronous function on which they depend.
    Example: func1 and func2 depend on the result of asychFunc, so ...
    chain.start(asynchFunc).then(func1).then(func2);
    Clued in by Dustin Diaz: http://www.dustindiaz.com/async-method-queues/
*/
//==========================================
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
                start: this.start
        };
        
        //using the queue: slowFunc should flush q at the end
        if(arguments[0])slowFunc(queue);
        
        //returning the queue
        return queue;
    }
};
//====================================================
/*
    Author: Abbas Abdulmalik
    Creation Date: October 3, 2015
    Revised: N/A
    Purpose: test a "Require-like" asynch dependency
    
    Notes: 
*/
//================================
function require(apiFilename){
    //consider requiring an 'ok: true' flag as a property of all modules
    //to check their validity
    /*
    Check to see if apiFilename is already
    in the global namespace. If so, return it to itself
    without downloading it again from the server.
    */
    if(!!window[apiFilename] && window[apiFilename].ok){
        return window[apiFilename];
    }
    //=======================================
    var exports = {};
    chain /*global chain*/ //The chain is not really needed for synch operations
        .start(getApiString)
        .then(wrapApiInExports)
    ;
    return exports;
    //------helpers------
    function getApiString(q){
        var path = "";
        if(apiFilename.toLowerCase().search('http') === 0){
            //filename is a web address
            path = apiFilename;
        }else{
            //file from our site in modules folder
            path = `modules/${apiFilename}.js`;
        }
        var ajax = new XMLHttpRequest();
        
        /* Quoting Eric Elliot:
        "The CommonJS module system has a much simpler syntax than either
        the module pattern or AMD. In CommonJS, the file is the module. There
        is no need for a function wrapper to contain the scope, because each
        file is given its own scope. Modules declare dependencies with
        a synchronous require() function. That means that execution is blocked
        while the required module is being resolved, so it's safe to start using
        the module immediately after you require it."
        */
        //!important: CommonJS requires synch not asynch: must use "false"
        ajax.open("GET", path, false); 
        ajax.send(null);
        if(ajax.status === 200){
            q.flush(ajax.response);            
        }else{
            q.flush(undefined);
        }

    }
    //-------------------
    function wrapApiInExports(r){
        var f = new Function("exports", r);
        f(exports);
    }
    //------------------
 }
//===========================