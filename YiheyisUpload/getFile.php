<?php

$root = $_SERVER['DOCUMENT_ROOT'] . "/";
$appFolder = 'YiheyisUpload/';
$uploadsFolder = 'uploads/';
$filename = $_SERVER['HTTP_FILENAME'];

$destination = $root . $appFolder . $uploadsFolder . $filename;

// This is how we grab the file
$source = file_get_contents("php://input");

//This is how we save a file
file_put_contents($destination, $source);

exit("File uploaded: " . $filename);

?>