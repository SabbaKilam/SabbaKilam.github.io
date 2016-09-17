//My main global object. The app's data model will be another one
(function(){
    this.$ = main;
    function id(idString){
        return document.getElementById(idString);
    }
    var domElement = null;
    var api = {};
    main.attachDomObjects = function attachDomObjects(){
        Object.keys(main).forEach(function(key){
            if(typeof main[key] !== 'object' && typeof main[key] !== 'function'){
                main[key] = id(key);
            }
        });
    };
    //===========| The main function to be attached to global $ |=========//
    function main(stringOrObject){
        //if typeof id is object and not [Object Array], assume it's a DOM element
        //else, it's an id string that points to a domElement
        if(typeof stringOrObject === 'string'){
            domElement = id(stringOrObject);
        }
        else if(typeof stringOrObject === 'object' && Object.prototype.toString.call(stringOrObject) !== "[Object Array]"){
            domElement = stringOrObject;
        }
        else{
            domElement = null;
        }
        return api;
    }
    //==================================================================//
    main.browserPrefix = ["","-webkit-","-moz-","-ms-","-o-"];
    
    api.browserPrefix = ["","-webkit-","-moz-","-ms-","-o-"];
    api.styles = function styles(declaration){
        var attributeValue = declaration.split(":");
        domElement.style[attributeValue[0]] = attributeValue[1];
        return styles;
    };
    api.style = function style(attribute, value){
        domElement.style[attribute] = value;
        return api;        
    };
    api.html = function html(content){
        domElement.innerHTML = content;
        return api;
    };
    api.addhtml = function addhtml(content){
        domElement.innerHTML += content;
        return api;
    };
    api.element = function element(){
        return domElement;
    };
    api.on = function on(eventString, handler){
        domElement.addEventListener(eventString, handler);
        return api;
    };
})();