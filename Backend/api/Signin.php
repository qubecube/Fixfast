<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type:application/json");
    include('../db.php');

    $Fullname = $_POST['Fullname'];
    $Email = $_POST['Email'];
    $Password = $_POST['Password'];
    $Social = $_POST['Social'];
    $Image = $_POST['Image'];
    $Type = $_POST['Type'];
    $CreateDate = date('Y-m-d H:i:s');
    $ModifyDate = date('Y-m-d H:i:s');

    $OrderList = "INSERT INTO Users (Fullname, Email, Password, Social, Image, Type, CreateDate, ModifyDate) VALUES ('".$Fullname."','".$Email."','".$Password."','".$Social."','".$Image."','".$Type."','".$CreateDate."','".$ModifyDate."')";
    if (mysqli_query($con, $OrderList)) {
        $UserId = mysqli_insert_id($con);
        $Data = array(
            "UserId" => $UserId,
            "Fullname" => $Fullname,
            "Email" => $Email,
            "Type" => $Type
        );
        response(true , "Success", $CreateDate, $Data);
    } else {
        response(fasle , "Error INSERT Users : $UserId", null, "");
    }
    mysqli_close($con);

    function response($Status, $ErrMessage, $CreateDate, $Data){
        $response['IsSuccess'] = $Status;
        $response['ErrMessage'] = $ErrMessage;
        $response['CreateDate'] = $CreateDate;
        $response['Data'] = $Data;
        $json_response = json_encode($response);
        echo $json_response;
    }
?>
