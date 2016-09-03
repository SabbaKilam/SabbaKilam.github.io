<?php

//====| "Links" in the "destination chain" |===//
$root = $_SERVER["DOCUMENT_ROOT"] . "/";
$app = "fileupload/";
$uploadFolder = "uploadFolder/";
$filename = $_SERVER['HTTP_FILENAME'];

//====| The destination chain (filepath) |====//
$destination = $root . $app . $uploadFolder . $filename;

$source = file_get_contents("php://input");
//exit("" . file_put_contents($destination, $source) . " bytes at \n" . $destination);
file_put_contents($destination, $source);
exit($app . $uploadFolder . $filename);

?>