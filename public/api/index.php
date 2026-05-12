<?php
require_once 'config.php';

/**
 * Skolux Multi-Tenant API
 * Segregates data based on school_id (subdomain)
 */

$action = $_GET['action'] ?? '';
$type = $_GET['type'] ?? '';
$session = $_GET['session'] ?? 'global';
$school_id = $_GET['school_id'] ?? 'default';

$conn = get_db_connection();

// Create table if not exists with school_id support
$conn->query("CREATE TABLE IF NOT EXISTS school_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id VARCHAR(50) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    session_id VARCHAR(20) NOT NULL,
    content LONGTEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (school_id, data_type, session_id)
)");

if ($action === 'get') {
    $stmt = $conn->prepare("SELECT content FROM school_data WHERE school_id = ? AND data_type = ? AND session_id = ?");
    $stmt->bind_param("sss", $school_id, $type, $session);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        echo $row['content'];
    } else {
        echo json_encode([]); // Default empty array
    }
} 
elseif ($action === 'save') {
    $json_data = file_get_contents('php://input');
    
    // Validate JSON
    if (json_decode($json_data) === null) {
        echo json_encode(["error" => "Invalid JSON data"]);
        exit;
    }

    // Physical Folder Mirroring (for easy extraction/migration)
    $school_folder = "data/" . $school_id;
    if (!file_exists($school_folder)) {
        mkdir($school_folder, 0777, true);
    }
    file_put_contents($school_folder . "/" . $type . "_" . $session . ".json", $json_data);

    $stmt = $conn->prepare("INSERT INTO school_data (school_id, data_type, session_id, content) 
                           VALUES (?, ?, ?, ?) 
                           ON DUPLICATE KEY UPDATE content = VALUES(content)");
    $stmt->bind_param("ssss", $school_id, $type, $session, $json_data);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "mirror" => $school_folder]);
    } else {
        echo json_encode(["error" => $stmt->error]);
    }
}
else {
    echo json_encode(["message" => "Skolux Multi-Tenant API v2.0", "status" => "Online"]);
}

$conn->close();
?>
