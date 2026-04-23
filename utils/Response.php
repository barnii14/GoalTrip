<?php
namespace Utils;

class Response
{
    public static function json($data, $status = 200)
    {
        http_response_code($status);
        header('Content-Type: application/json');
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);

        if ($json === false) {
            $fallback = [
                'error' => 'JSON encoding failed',
                'json_error' => json_last_error_msg()
            ];
            $json = json_encode($fallback, JSON_UNESCAPED_UNICODE);
            if ($json === false) {
                $json = '{"error":"Unexpected server response"}';
            }
        }

        echo $json;
        exit;
    }

    public static function error($message, $status = 400)
    {
        self::json(['error' => $message], $status);
    }

    public static function success($message, $data = null, $status = 200)
    {
        $response = ['message' => $message];
        if ($data !== null) {
            $response['data'] = $data;
        }
        self::json($response, $status);
    }

    public static function html($location)
    {
        header("location:".$location);
    }
}