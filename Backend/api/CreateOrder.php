<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type:application/json");
    include('../db.php');

    $UserId = $_POST['UserId'];
    $UserFullname = $_POST['UserFullname'];
    $UserEmail = $_POST['UserEmail'];
    $UserPhoneNo = $_POST['UserPhoneNo'];
    $UserAddress = $_POST['UserAddress'];
    $EngineerId = $_POST['EngineerId'];
    $EngineerFullname = $_POST['EngineerFullname'];
    $EngineerEmail = $_POST['EngineerEmail'];
    $EngineerPhoneNo = $_POST['EngineerPhoneNo'];
    $EngineerAddress = $_POST['EngineerAddress'];
    $EngineerWorkName = $_POST['EngineerWorkName'];
    $OrderStatus = $_POST['OrderStatus'];
    $CreateDate = date('Y-m-d H:i:s');
    $ModifyDate = date('Y-m-d H:i:s');

    $OrderList = "INSERT INTO OrderEngineer (UserId, UserFullname, UserEmail, UserPhoneNo, UserAddress, EngineerId,  EngineerFullname, EngineerEmail, EngineerAddress, EngineerWorkName, OrderStatus, CreateDate, ModifyDate) VALUES ('".$UserId."','".$UserFullname."','".$UserEmail."','".$UserPhoneNo."','".$UserAddress."','".$EngineerId."','".$EngineerFullname."','".$EngineerEmail."','".$EngineerAddress."','".$EngineerWorkName."','".$OrderStatus."','".$CreateDate."','".$ModifyDate."')";
    if (mysqli_query($con, $OrderList)) {
        $OrderId = mysqli_insert_id($con);
        $Data = array(
            "OrderId" => $OrderId,
            "UserId" => $UserId,
            "UserFullname" => $UserFullname,
            "UserEmail" => $UserEmail,
            "UserPhoneNo" => $UserPhoneNo,
            "UserAddress" => $UserAddress,
            "EngineerId" => $EngineerId,
            "EngineerFullname" => $EngineerFullname,
            "EngineerEmail" => $EngineerEmail,
            "EngineerPhoneNo" => $EngineerPhoneNo,
            "EngineerAddress" => $EngineerAddress,
            "EngineerWorkName" => $EngineerWorkName,
            "OrderStatus" => $OrderStatus,
            "CreateDate" => $CreateDate,
            "ModifyDate" => $ModifyDate
        );
        response(true , "Success", $CreateDate, $Data);
    } else {
        response(fasle , "Error INSERT Order : $OrderId", null, "");
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
