<?php
/*
Manually reconfigure the php.ini file:

    memory_limit = 256M
    upload_max_filesize = 50MB
    post_max_size = 50M
    max_execution_time = 60
    
Then, reboot the server
*/
$root = $_SERVER["DOCUMENT_ROOT"] . "/";
//$root = "/";
$uploadFolder = "phpIntro/uploads/";
$filename = $_SERVER["HTTP_FILENAME"];
$destination = $root . $uploadFolder . $filename;
$source = file_get_contents('php://input');
file_put_contents($destination, $source);
exit("The destination: " . $destination);
?>