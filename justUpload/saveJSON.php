<?php

$root = $_SERVER['DOCUMENT_ROOT'] . "/";
$appFolder = "justUpload/";
$filename = $_POST['filename'];

$destination = $root . $appFolder . $filename;
$source = $_POST['data'];

file_put_contents($destination, $source);

exit($destination);


?>