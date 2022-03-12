<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type:application/json");
    include('../db.php');

    $UserId = $_POST['UserId'];
    $WorkName = $_POST['WorkName'];
    $WorkDes = $_POST['WorkDes'];
    $WorkPrice = $_POST['WorkPrice'];
    $WorkTime = $_POST['WorkTime'];
    $WorkImage = $_POST['WorkImage'];
    $WorkLat = $_POST['WorkLat'];
    $WorkLong = $_POST['WorkLong'];
    $CreateDate = date('Y-m-d H:i:s');
    $ModifyDate = date('Y-m-d H:i:s');

    $result = "INSERT INTO Engineer (UserId, WorkName, WorkDes, WorkPrice, WorkTime, WorkImage, WorkLat, WorkLong, CreateDate, ModifyDate) VALUES ('".$UserId."','".$WorkName."','".$WorkDes."','".$WorkPrice."','".$WorkTime."','".$WorkImage."','".$WorkLat."','".$WorkLong."','".$CreateDate."','".$ModifyDate."')";
    if (mysqli_query($con, $result)) {
        $EngineerId = mysqli_insert_id($con);
        $Data = array(
            "EngineerId" => $EngineerId,
            "UserId" => $UserId,
            "WorkName" => $WorkName,
            "WorkDes" => $WorkDes,
            "WorkPrice" => $WorkPrice,
            "WorkTime" => $WorkTime,
            "WorkImage" => $WorkImage,
            "WorkLat" => $WorkLat,
            "WorkLong" => $WorkLong,
            "CreateDate" => $CreateDate,
            "ModifyDate" => $ModifyDate
        );
        $UPDATE = "UPDATE Users SET Type='Engineer', ModifyDate='$ModifyDate' WHERE UserId='$UserId' ";
        if (mysqli_query($con, $UPDATE)) {
            response(true , "Success", $CreateDate, $Data);
        } else {
            response(fasle , "Error UPDATE Users : $UserId", null, "");
        }
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
