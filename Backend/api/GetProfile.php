<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type:application/json");
    include('../db.php');

    $UserId = $_POST['UserId'];
    $result = mysqli_query( $con, "SELECT * FROM `Users` WHERE UserId='$UserId'" );
    if(mysqli_num_rows($result)>0){
        $row = mysqli_fetch_assoc($result);
        $UserId = $row['UserId'];
        $Fullname = $row['Fullname'];
        $Email = $row['Email'];
        $PhoneNo = $row['PhoneNo'];
        $Address = $row['Address'];
        $Image = $row['Image'];
        $Social = $row['Social'];
        $Type = $row['Type'];
        $resp['UserId'] = $UserId;
        $resp['Fullname'] = $Fullname;
        $resp['Email'] = $Email;
        $resp['PhoneNo'] = $PhoneNo;
        $resp['Address'] = $Address;
        $resp['Image'] = $Image;
        $resp['Social'] = $Social;
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
