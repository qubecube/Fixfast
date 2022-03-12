<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type:application/json");
    include('../db.php');

    $result = mysqli_query( $con, "SELECT * FROM `EngineerType`" );
    if(mysqli_num_rows($result)>0){
        $resp = array();
        while($row = mysqli_fetch_assoc($result)) {
            $resp[] = $row;
        }
        response(true , "Success", $resp);
    }else{
        response(fasle , "Error EngineerType : $result", "");
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
