//======| data and variables |========/
// We create an agent to do server requests
var ajax = new XMLHttpRequest();
var btn = document.getElementById("btn");


//======| main code goes here |=======/
btn.onclick = getMessage;



//=====| helpers "under the hood" |======//
function getMessage(){
    // Now, let the agent make a request
    ajax.open("GET", "phpfiles/giveMessage.php");
    ajax.send();
    // Let the event of the server sending the response
    // invoke  the result function
    ajax.onload = result;
    //---| internal helper function(s) |---//
    function result(){
        alert(ajax.response);
    }    
}



