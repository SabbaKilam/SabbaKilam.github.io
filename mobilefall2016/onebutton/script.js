/*
event handler for the button's fou events:
	mousedown
	mouseup
	mouseover
	mouseout
*/
var btn = document.getElementById("btn");
var msg;//finish this line

//the event callback function
function eventCallback(e){
	msg.innerHTML = e.type;
}

//attach event handlers to the button
//for each of the four events mentioned above

