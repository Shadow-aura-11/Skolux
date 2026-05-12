<?php
// Hostinger Database Configuration
// Replace these with your actual database details from Hostinger hPanel
define('DB_HOST', 'localhost');
define('DB_USER', 'u123456789_nms_user');
define('DB_PASS', 'YourStrongPassword123!');
define('DB_NAME', 'u123456789_nms_db');

// CORS Headers - Allow React to talk to PHP
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

function get_db_connection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }
    return $conn;
}
?>
