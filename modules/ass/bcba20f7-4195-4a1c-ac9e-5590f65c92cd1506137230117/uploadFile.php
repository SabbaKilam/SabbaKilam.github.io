<?php
    $contents = file_get_contents($_POST['contents']);
    file_put_contents('uploads/' . $_POST['filename'], $contents );    
?>