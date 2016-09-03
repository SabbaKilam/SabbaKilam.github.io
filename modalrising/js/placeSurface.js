var alignX = 0;
var alignY = 0;
function placeSurface(surface, modifier, arg){
    var ok = false;
    //---------------------------------------------
    var width = innerWidth;
    var height = innerHeight;
    var args = arguments.length;
    var locations = ['ULC','URC','LLC','LRC','CTR','CTRT','CTRB','CTRL','CTRR',];
    //----------------------------------------------
    if(args !== 3){
        ok = false;
        return ok;
    }
    if(typeof arg !== "string" && (arg.length < 1 || arg.length > 3) ){
        alert("typeof argument number 3: " +
        typeof arg +
        "\n" +
        "arg length: " + arg.length
        ); 
        ok = false;
        return ok;
    }    
    try{
        if(typeof arg !== 'string'){
            makeCustomPlacement();
            return ok;    
        }
        else if(arg.toLowerCase() == 'urc'){
            alignX = (innerWidth - 0.5*surface.getSize()[0])/innerWidth;
            alignY = (0.5*surface.getSize()[1])/innerHeight;
            modifier.setAlign([alignX, alignY]);
            modifier.setOrigin([0.5,0.5]);
            ok = true;
        }
        else if(arg.toLowerCase() == 'llc'){
            alignX = (0.5*surface.getSize()[0])/innerWidth;
            alignY = (innerHeight - 0.5*surface.getSize()[1])/innerHeight;
            modifier.setAlign([alignX, alignY]);            
            modifier.setOrigin([0.5,0.5]);
            ok = true;
        }
        else if(arg.toLowerCase() == 'lrc'){
            alignX = (innerWidth - 0.5*surface.getSize()[0])/innerWidth;
            alignY = (innerHeight - 0.5*surface.getSize()[1])/innerHeight;
            modifier.setAlign([alignX, alignY]);            
            modifier.setOrigin([0.5,0.5]);
            ok = true;
        }
        else if(arg.toLowerCase() == 'ctrt'){
            alignX = 0.5;
            alignY = (0.5*surface.getSize()[1])/innerHeight;
            modifier.setAlign([alignX, alignY]);            
            modifier.setOrigin([0.5,0.5]);
            ok = true;       
        }
        else if(arg.toLowerCase() == 'ctrb'){
            alignX = 0.5
            alignY = (innerHeight - 0.5*surface.getSize()[1])/innerHeight;
            modifier.setAlign([alignX, alignY]);            
            modifier.setOrigin([0.5,0.5]);
            ok = true;
        }
        else if(arg.toLowerCase() == 'ctrl'){
            alignX = (0.5*surface.getSize()[0])/innerWidth;
            alignY = 0.5
            modifier.setAlign([alignX, alignY]);            
            modifier.setOrigin([0.5,0.5]);
            ok = true;
        }
        else if(arg.toLowerCase() == 'ctrr'){
            alignX = (innerWidth - 0.5*surface.getSize()[0])/innerWidth;
            alignY = 0.5
            modifier.setAlign([alignX, alignY]);            
            modifier.setOrigin([0.5,0.5]);
            ok = true;
        }
        else if(arg.toLowerCase() == 'ctr'){
            modifier.setAlign([0.5, 0.5]);
            modifier.setOrigin([0.5,0.5]); 
            ok = true;    
        } 
        else if(arg.toLowerCase() == 'ulc'){
            alignX = 0.5*image.getSize()[0]/innerWidth;
            alignY = 0.5*image.getSize()[1]/innerHeight;
            modifier.setAlign([alignX, alignY]);
            modifier.setOrigin([0.5,0.5]);
            ok = true;       
        }            
        else{
            alert("nothin'")
            ok = false;
        }
    }
    catch(e){
        alert(e.toString());
        ok = false;            
    }
    
    return ok;
    //----------------internal helper function(s)--------------------
    function makeCustomPlacement(){
        if (!!arg[0] && typeof arg[0] == 'number'){
            alignX += arg[0]/innerWidth;
        }
        if (!!arg[1] && typeof arg[1] == 'number'){
            alignY += arg[1]/innerHeight;
        }
        if (!!arg[2] && typeof arg[2] == 'number'){
            surface.properties.zIndex = parseInt(arg[2]);
        }
        modifier.setAlign([alignX, alignY]);
        modifier.setOrigin([0.5,0.5]);
        
        /*
        alert("custom" +
            "\n" +
            "Current alignX = " +
            alignX.toFixed(2) +
            "\n" +
            "Current alignY = " +
            alignY.toFixed(2) +
            "\n" +            
            "Current z Index = " +
            surface.properties.zIndex
        );
        */
        ok = true;
    }
    
}//end of placeSurface