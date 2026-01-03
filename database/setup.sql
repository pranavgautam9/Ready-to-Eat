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
    points INT DEFAULT 0,
    reset_token VARCHAR(100) NULL,
    reset_token_expires DATETIME NULL,
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
INSERT INTO users (id, first_name, last_name, email, password_hash, mobile, points) 
VALUES (
    1,
    'Test', 
    'User', 
    'testuser@gmail.com', 
    'scrypt:32768:8:1$C1NUokd68WRmbpG8$2292233a3555dea87f2e5e9d9e2a9beb2351561edce321181e76adf54df0ae8133d91294e73e45a78556918e1a312efe9fa9814de4231961cf57c128ec0c7ecb', 
    '7894561230',
    13
) ON DUPLICATE KEY UPDATE 
    first_name = VALUES(first_name),
    last_name = VALUES(last_name),
    email = VALUES(email),
    password_hash = VALUES(password_hash),
    mobile = VALUES(mobile),
    points = VALUES(points);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    grand_total DECIMAL(10,2) NOT NULL,
    points_earned INT NOT NULL,
    estimated_time INT NOT NULL,
    status ENUM('current', 'ready', 'completed') DEFAULT 'current',
    payment_method VARCHAR(50),
    payment_details JSON,
    order_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    ready_time DATETIME NULL,
    completed_time DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    food_id INT NOT NULL,
    food_name VARCHAR(100) NOT NULL,
    food_price DECIMAL(8,2) NOT NULL,
    quantity INT NOT NULL,
    has_extra BOOLEAN DEFAULT FALSE,
    item_total DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Create food_items table for reference
CREATE TABLE IF NOT EXISTS food_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    image_path VARCHAR(255),
    has_extra_option BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert food items
INSERT INTO food_items (id, name, price, image_path, has_extra_option) VALUES
(1, 'Samosa', 15.00, 'Samosa.jpg', FALSE),
(2, 'Kachori', 15.00, 'Kachori.jpg', FALSE),
(3, 'Aloo Parantha', 30.00, 'Aloo Parantha.jpg', FALSE),
(4, 'Pav Bhaji', 60.00, 'Pav Bhaji.jpg', FALSE),
(5, 'Chole Bhature', 60.00, 'Chole Bhature.jpg', FALSE),
(6, 'Veg Burger', 50.00, 'Veg Burger.jpg', FALSE),
(7, 'Hakka Noodles', 40.00, 'Hakka Noodles.jpg', FALSE),
(8, 'Manchurian', 60.00, 'Manchurian.jpg', FALSE),
(9, 'Cup of Tea', 10.00, 'Tea.JPG', FALSE),
(10, 'Cold Coffee', 20.00, 'Cold Coffee.jpg', FALSE),
(11, 'Lays Chips', 20.00, 'Lays.jpg', FALSE),
(12, 'Kurkure', 20.00, 'Kurkure.jpg', FALSE),
(13, 'Coca Cola', 20.00, 'Coca Cola.jpg', FALSE),
(14, 'Frooti', 15.00, 'Frooti.jpg', FALSE),
-- Reward items (IDs 101-106)
(101, 'Samosa (Reward)', 0.00, 'samosa-reward.jpg', FALSE),
(102, 'Kachori (Reward)', 0.00, 'kachori-reward.jpg', FALSE),
(103, 'Veg Burger (Reward)', 0.00, 'veg-burger-reward.jpg', FALSE),
(104, 'Hakka Noodles (Reward)', 0.00, 'hakka-noodles-reward.jpg', FALSE),
(105, 'Pav Bhaji + Lays + Coca Cola (Reward)', 0.00, 'combo1-reward.jpg', FALSE),
(106, 'Chole Bhature + Kurkure + Frooti (Reward)', 0.00, 'combo2-reward.jpg', FALSE)
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    price = VALUES(price),
    image_path = VALUES(image_path),
    has_extra_option = VALUES(has_extra_option);

-- Create indexes for better performance
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_created_at ON users(created_at);
CREATE INDEX idx_admin_username ON admins(username);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_time ON orders(order_time);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_food_items_available ON food_items(is_available);
CREATE INDEX idx_users_points ON users(points);

-- Insert 2 orders for test user (user_id = 1)
-- Order 1: Samosa (2x) + Tea (1x) = 15*2 + 10 = 40, tax (5%) = 2, total = 42, points = 4
INSERT INTO orders (id, order_number, user_id, total_amount, tax_amount, grand_total, points_earned, estimated_time, status, payment_method, order_time) 
VALUES (
    1,
    'ORD-20240101-ABC123',
    1,
    40.00,
    2.00,
    42.00,
    4,
    15,
    'completed',
    'cash',
    DATE_SUB(NOW(), INTERVAL 2 DAY)
) ON DUPLICATE KEY UPDATE id=id;

-- Order 2: Veg Burger (1x) + Cold Coffee (2x) = 50 + 20*2 = 90, tax (5%) = 4.50, total = 94.50, points = 9
INSERT INTO orders (id, order_number, user_id, total_amount, tax_amount, grand_total, points_earned, estimated_time, status, payment_method, order_time) 
VALUES (
    2,
    'ORD-20240102-XYZ789',
    1,
    90.00,
    4.50,
    94.50,
    9,
    20,
    'ready',
    'card',
    DATE_SUB(NOW(), INTERVAL 1 DAY)
) ON DUPLICATE KEY UPDATE id=id;

-- Insert order items for Order 1
INSERT INTO order_items (id, order_id, food_id, food_name, food_price, quantity, has_extra, item_total) 
VALUES 
(1, 1, 1, 'Samosa', 15.00, 2, FALSE, 30.00),
(2, 1, 9, 'Cup of Tea', 10.00, 1, FALSE, 10.00)
ON DUPLICATE KEY UPDATE id=id;

-- Insert order items for Order 2
INSERT INTO order_items (id, order_id, food_id, food_name, food_price, quantity, has_extra, item_total) 
VALUES 
(3, 2, 6, 'Veg Burger', 50.00, 1, FALSE, 50.00),
(4, 2, 10, 'Cold Coffee', 20.00, 2, FALSE, 40.00)
ON DUPLICATE KEY UPDATE id=id;
