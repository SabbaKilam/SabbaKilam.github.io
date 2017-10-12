<?php
  //if ( isset($_POST['contents']) and isset($_POST['filename']) ){
    $contents = $_POST['contents'] ;
    file_put_contents('uploads/' . $_POST['filename'], $contents);    
 // };

?>