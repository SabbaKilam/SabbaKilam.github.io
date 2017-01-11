/*
    An attempt to mail a contact that is selected
*/
document.getElementById("chooser").onchange = sendEmail;
//  Here is the sendEmail function
function sendEmail(eventObject){
    var source = eventObject.target;
    var index = source.selectedIndex;
    var options = source.options;
    var email = options[index].value;
    window.location.href = "mailto: "+email;
}
