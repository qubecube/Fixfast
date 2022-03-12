<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type:application/json");
    include('../db.php');

    $OrderId = $_POST['OrderId'];
    $OrderStatus = $_POST['OrderStatus'];
    $ModifyDate = date('Y-m-d H:i:s');

    $OrderList = "UPDATE OrderEngineer SET OrderStatus='$OrderStatus', ModifyDate='$ModifyDate' WHERE OrderId='$OrderId' ";
    if (mysqli_query($con, $OrderList)) {
        response(true , "Success", $OrderId);
    } else {
        response(fasle , "Error UPDATE OrderEngineer : $OrderId", "");
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
