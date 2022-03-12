<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type:application/json");
    include('../db.php');

    $EngineerId = $_POST['EngineerId'];
    $result = mysqli_query( $con, "SELECT * FROM `Engineer` WHERE EngineerId='$EngineerId'" );
    if(mysqli_num_rows($result)>0){
        $row = mysqli_fetch_assoc($result);
        $EngineerId = $row['EngineerId'];
        $UserId = $row['UserId'];
        $WorkName = $row['WorkName'];
        $WorkDes = $row['WorkDes'];
        $WorkPrice = $row['WorkPrice'];
        $WorkTime = $row['WorkTime'];
        $WorkImage = $row['WorkImage'];
        $WorkLat = $row['WorkLat'];
        $WorkLong = $row['WorkLong'];
        $WorkRating = $row['WorkRating'];
        $CreateDate = $row['CreateDate'];
        $ModifyDate = $row['ModifyDate'];
        $resp['EngineerId'] = $EngineerId;
        $resp['UserId'] = $UserId;
        $resp['WorkName'] = $WorkName;
        $resp['WorkDes'] = $WorkDes;
        $resp['WorkPrice'] = $WorkPrice;
        $resp['WorkTime'] = $WorkTime;
        $resp['WorkImage'] = $WorkImage;
        $resp['WorkLat'] = $WorkLat;
        $resp['WorkLong'] = $WorkLong;
        $resp['WorkRating'] = $WorkRating;
        $resp['CreateDate'] = $CreateDate;
        $resp['ModifyDate'] = $ModifyDate;
        response(true , "Success", $resp);
    }else{
        response(fasle , "Error Engineer Users : $result", "");
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
