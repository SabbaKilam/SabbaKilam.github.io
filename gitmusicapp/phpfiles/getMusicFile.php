<?php

/*
To reduce server errors, 
edit the php.ini file as follows:

    memory_limit = 256M
    upload_max_filesize = 50M
    post_max_size = 50M
    max_execution_time = 60
    
Then, reboot the server.
*/

$musicFilename = $_SERVER['HTTP_FILENAME'];
$artist = $_SERVER['HTTP_ARTIST'];
$title = $_SERVER['HTTP_TITLE'];

$noMp3 = substr($musicFilename, 0, $musicFilename.length - 4);
$listAddition = ",
{ 
    '$noMp3' :{
        'title' : '$title',
        'artist' : '$artist' 
    }
 }";

//====| Save mp3 file to music follder |====

$webroot  = $_SERVER['DOCUMENT_ROOT'] . '/';
$musicFolder = $webroot . "music/";
$destination = $musicFolder . $musicFilename;
$source = "php://input";
file_put_contents($destination, $source);

//====| Append the music list file |====

exit($listAddition);

?>