<?php

class Response {

    public static function success($data = null, $message = "Sikeres művelet") {
        echo json_encode([
            "success" => true,
            "message" => $message,
            "data" => $data
        ]);
        exit;
    }

    public static function error($message = "Hiba történt", $code = 400) {
        http_response_code($code);

        echo json_encode([
            "success" => false,
            "message" => $message
        ]);
        exit;
    }
}
