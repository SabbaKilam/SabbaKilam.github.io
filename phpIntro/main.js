window.onload = function(e){
//======| data and variables |========/
    // We create an agent to do server requests
    var ajax = new XMLHttpRequest();
    var uploadAgent = new XMLHttpRequest();
    var btn = document.getElementById("btn");
    var fileObject = document.getElementById("fileObject");
    var progressBar = document.getElementById("progressBar");
    var message = document.getElementById("message");
    
    //---| handle the file upload |---//
    uploadAgent.upload.onprogress = function(e){
        progressBar.style.borderLeft = "0 solid red";
        var barWidth = window.innerWidth;
        if(e.lengthComputable){
            var fraction = e.loaded/e.total;
            message.innerHTML = Math.ceil(100*fraction).toFixed(0) + "%";
            progressBar.style.borderLeft =  parseInt(barWidth*fraction,10) + "px solid red"; 
            progressBar.style.width = parseInt( (1-fraction)*barWidth, 10 ) + "px";            
        }
    }; 
    
    uploadAgent.onload = function(e){
        document.getElementById("duh").innerHTML = e.target.response;
    };      
  

    //======| main code goes here |=======/
    btn.onclick = getMessage;
    fileObject.onchange = uploadFile;
    
    
    //=====| helpers "under the hood" |======//
    function getMessage(e){
        // Now, let the agent make a request
        ajax.open("GET", "phpfiles/giveMessage.php");
        ajax.send();
        // Let the event of the server sending the response
        // invoke  the result function

        ajax.onload = result;
        //---| internal helper function(s) |---//
        function result(){
            e.target.value = "You made a PHP Request";
            alert(e.target.value);
            alert(ajax.response);
        }    
    }
    function uploadFile(e){
        var files = e.target.files;
        var file = files[0];
        var filename = file.name;
        //let's try to upload this file
        uploadAgent.open("POST", "phpfiles/getFile.php");
        uploadAgent.setRequestHeader("filename", filename);
        uploadAgent.send(file);
    }    
};
    




