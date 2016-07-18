//Let's make our own library of functions
var lib = {};
lib.id = function id(idString){
    return document.getElementById(idString);
};
lib.greet = function(){
    alert("My name is lib");
};
lib.styles = function styles(object){
    var f = function f(prop, value){
        object.style[prop] = value;
        return f;
    };
    return f;
} 