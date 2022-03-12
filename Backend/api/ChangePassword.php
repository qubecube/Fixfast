<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type:application/json");
    include('../db.php');

    $UserId = $_POST['UserId'];
    $Password = $_POST['Password'];
    $NewPassword = $_POST['NewPassword'];
    $ModifyDate = date('Y-m-d H:i:s');

    $result = mysqli_query( $con, "SELECT * FROM `Users` WHERE UserId='$UserId'" );
    if(mysqli_num_rows($result)>0){
        $row = mysqli_fetch_assoc($result);
        $PasswordOld = $row['Password'];
        if($PasswordOld === $Password){
            $Update = "UPDATE Users SET Password='$NewPassword' WHERE UserId='$UserId' ";
            if (mysqli_query($con, $Update)) {
                $rows = mysqli_fetch_assoc($result);
                response(true , "Success", "");
            } else {
                response(fasle , "Error Update Password", "");
            }
        } else {
            response(fasle , "Error Password not macth : $PasswordOld != $Password", "");
        }
    }else{
        response(fasle , "Error SELECT Users : $result", "");
    }
    
    mysqli_close($con);

    function response($Status, $ErrMessage, $Data){
        $response['IsSuccess'] = $Status;
        $response['ErrMessage'] = $ErrMessage;
        $response['Data'] = $Data;
        $json_response = json_encode($response);
        echo $json_response;
    }
?>
