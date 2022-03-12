<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type:application/json");
    include('../db.php');

    $EngineerId = $_POST['EngineerId'];
    $ModifyDate = date('Y-m-d H:i:s');

    $result = mysqli_query( $con, "SELECT * FROM `Engineer` WHERE EngineerId='$EngineerId'" );
    if(mysqli_num_rows($result)>0){
        $row = mysqli_fetch_assoc($result);
        $WorkAmount = $row['WorkAmount'];
        if($WorkAmount === 0){
            $WorkRating = $_POST['WorkRating'];
        } else {
            $WorkRatingOld = $row['WorkRating'];
            $WorkRatingNew = $_POST['WorkRating'];
            $WorkRating = $WorkRatingOld + $WorkRatingNew / 2;
        }
        $OrderList = "UPDATE Engineer SET WorkRating='$WorkRating', ModifyDate='$ModifyDate' WHERE EngineerId='$EngineerId' ";
        if (mysqli_query($con, $OrderList)) {
            response(true , "Success", $EngineerId);
        } else {
            response(fasle , "Error UPDATE Engineer : $EngineerId", "");
        }
    } else {
        response(fasle , "Error SELECT Engineer : $EngineerId", "");
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
