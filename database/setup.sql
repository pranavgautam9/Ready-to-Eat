-- Create the database
CREATE DATABASE IF NOT EXISTS ready_to_eat;
USE ready_to_eat;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create admin table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert test admin (username: admin, password: Admin123!)
INSERT INTO admins (username, password_hash, full_name, role) 
VALUES (
    'admin', 
    'scrypt:32768:8:1$sxom3w7g8btcuslM$b574f77077627053413ee6240a82b0e3a6fa18a1fd8734d9fc555306afb1ca3194bca6b47fe8bed3be3ddb166b930574a90cf6bb6ded5a249517d6c518f497b7', 
    'System Administrator', 
    'super_admin'
) ON DUPLICATE KEY UPDATE id=id;

-- Insert test user (password: Password123!)
INSERT INTO users (first_name, last_name, email, password_hash, mobile) 
VALUES (
    'Test', 
    'User', 
    'testuser@gmail.com', 
    'scrypt:32768:8:1$sxom3w7g8btcuslM$b574f77077627053413ee6240a82b0e3a6fa18a1fd8734d9fc555306afb1ca3194bca6b47fe8bed3be3ddb166b930574a90cf6bb6ded5a249517d6c518f497b7', 
    '9999999999'
) ON DUPLICATE KEY UPDATE id=id;

-- Create indexes for better performance
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_created_at ON users(created_at);
CREATE INDEX idx_admin_username ON admins(username);
