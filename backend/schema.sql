-- You need to run this SQL in Hostinger's phpMyAdmin

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class_name VARCHAR(50),
    section VARCHAR(10),
    transport_route VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50),
    total DECIMAL(10,2),
    paid DECIMAL(10,2),
    remaining DECIMAL(10,2),
    collector_name VARCHAR(255),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);
