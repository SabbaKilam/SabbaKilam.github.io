//===| wrapper for getting HTML elements |===//
function id(idString){
    return document.getElementById(idString);
}

//====| gather the players |====//
var fileObject = id("fileObject")
, ajax = new XMLHttpRequest()
, message = id("message")
, bar = id("bar")
, barWidth = window.innerWidth
, fraction = 0
;

//===| full app below |===//
window.onload = function(){
    adjustSize();
    //====| handle the file browsing and uploading |====/
    fileObject.addEventListener("change", sendFile);    
    ajax.upload.addEventListener("progress", monitorUpload);
    ajax.addEventListener("load", showResponse);
    window.addEventListener("resize", adjustSize);
    
    //====| under the hood |====//
    function sendFile(e){
        var file = e.target.files[0];
        var filename = file.name;
        //----| make the upload request |----/
        ajax.open("POST","getfile.php", true);
        ajax.setRequestHeader("filename", filename);
        ajax.send(file);        
    }    
    function monitorUpload(e){
        if(e.lengthComputable){
            fraction = e.loaded / e.total;            
            adjustSize();
            message.innerHTML = Math.ceil(100 * fraction) + " %";
        }
    }
    function showResponse(e){
        message.innerHTML = ajax.response;
    }
    function adjustSize(){
        barWidth = window.innerWidth;
        bar.style.borderLeft = parseInt(fraction * barWidth, 10) + "px solid red";
        bar.style.width = (1 - fraction) * barWidth + "px"; 
        //----| adjust room em size |---//
        document.documentElement.style.fontSize = 5 + window.innerWidth/100 + "px";
    }
};

