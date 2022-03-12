<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type:application/json");
    include('../db.php');

    $UserId = $_POST['UserId'];
    $Fullname = $_POST['Fullname'];
    $Email = $_POST['Email'];
    $PhoneNo = $_POST['PhoneNo'];
    $Address = $_POST['Address'];
    $ModifyDate = date('Y-m-d H:i:s');

    $OrderList = "UPDATE Users SET Fullname='$Fullname', Email='$Email', PhoneNo='$PhoneNo', Address='$Address', ModifyDate='$ModifyDate' WHERE UserId='$UserId' ";
    if (mysqli_query($con, $OrderList)) {
        $result = mysqli_query( $con, "SELECT * FROM `Users` WHERE UserId='$UserId'" );
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
    } else {
        response(fasle , "Error UPDATE Users : $UserId", "");
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
