<?php
    $con = mysqli_connect("localhost","nuttayap_fixfast","KBddEFRL","nuttayap_fixfast");
    if (mysqli_connect_errno()){
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
        die();
    }    
?>