//My main global object. The app's data model will be another global object 
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
        var propertyValue = declaration.split(":");
        domElement.style[propertyValue[0]] = propertyValue[1];
        return styles;
    };
    api.style = function style(property, value){
        domElement.style[property] = value;
        return api;        
    };
    api.styleClass = function styleClass(className, declaration){
        var classMembers = document.getElementsByClassName(className);
        Array.prototype.forEach.call(classMembers, member=>{
            main(member).styles(declaration);
        });
     return styleClass;
    };
    main.styleClass = api.styleClass; //make it available using $.styleClass. $().styelClass also works
    api.attribs = function attribs(attributeString){
        var attributeValue = attributeString.split("=");
        var attribute = attributeValue[0];
        var value = attributeValue[1];
        domElement.setAttribute(attribute, value);
        return attribs;
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
    //====| secToMinSec() returns text like 10:34 when given seconds as number |====//
    main.secToMinSec = function secToMinSec(seconds){
        var min = Math.floor(seconds / 60);
        var sec = Math.floor(seconds % 60);
        if(isNaN(min)){min = 0}
        if(isNaN(sec)){sec = 0}
        var minSec = min + ":" +  ((sec < 10) ? ("0" + sec) : ("" + sec));
        return minSec;
    };
    //====| END of secToMinSec |====//    
})();