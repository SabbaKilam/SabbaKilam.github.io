<?php
    // make the "links" to the file save path
    $root = $_SERVER['DOCUMENT_ROOT'] . "/";
    $appFolder = 'justUpload/';
    $uploads = 'uploads/';
    $filename = $_SERVER['HTTP_FILENAME'];
    
    // make the destination file path
    $destination = $root . $appFolder . $uploads . $filename;
    
    // get the content of the file that was sent
    $source = file_get_contents('php://input');
    
    //save the file to the specified destination
    file_put_contents($destination, $source);    

    exit($destination);

?>