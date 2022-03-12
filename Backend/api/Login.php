<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type:application/json");
    include('../db.php');

    $Email = $_POST['Email'];
    $Password = $_POST['Password'];
    $result = mysqli_query( $con, "SELECT * FROM `Users` WHERE Email='$Email' AND Password='$Password'" );
    if(mysqli_num_rows($result)>0){
        $row = mysqli_fetch_assoc($result);
        $UserId = $row['UserId'];
        $Fullname = $row['Fullname'];
        $Email = $row['Email'];
        $PhoneNo = $row['PhoneNo'];
        $Address = $row['Address'];
        $Type = $row['Type'];
        $resp['UserId'] = $UserId;
        $resp['Fullname'] = $Fullname;
        $resp['Email'] = $Email;
        $resp['PhoneNo'] = $PhoneNo;
        $resp['Address'] = $Address;
        $resp['Type'] = $Type;
        response(true , "Success", $resp);
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
