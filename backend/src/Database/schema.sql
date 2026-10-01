-- =========================================
-- MICRO-INFLUENCER PR PACKAGE TRACKER
-- DATABASE SCHEMA
-- =========================================

-- 1. Create database
CREATE DATABASE IF NOT EXISTS microinfluencer_db;

-- 2. Select database
USE microinfluencer_db;


-- =========================================
-- TABLE 1: USERS
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- TABLE 2: BRANDS
-- =========================================

CREATE TABLE IF NOT EXISTS brands (
    brand_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    brand_name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    website_url VARCHAR(255),
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================
-- TABLE 3: PRODUCTS
-- =========================================

CREATE TABLE IF NOT EXISTS products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    brand_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    value DECIMAL(10,2),
    currency VARCHAR(3) NOT NULL,
    description VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (brand_id)
        REFERENCES brands(brand_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================
-- TABLE 4: SHIPMENTS
-- =========================================

CREATE TABLE IF NOT EXISTS shipments (
    shipment_id INT PRIMARY KEY AUTO_INCREMENT,
    shipment_code VARCHAR(50) NOT NULL UNIQUE,
    brand_id INT NOT NULL,
    product_id INT NOT NULL,
    shipment_date DATE NOT NULL,
    status ENUM('SHIPPED', 'RECEIVED') NOT NULL,
    tracking_reference VARCHAR(255) NULL,
    received_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (brand_id)
        REFERENCES brands(brand_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================
-- TABLE 5: CONTENT_DEADLINES
-- =========================================

CREATE TABLE IF NOT EXISTS content_deadlines (
    deadline_id INT PRIMARY KEY AUTO_INCREMENT,
    shipment_id INT NOT NULL,
    platform ENUM(
        'Instagram',
        'YouTube',
        'TikTok',
        'Blog',
        'Other'
    ) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM(
        'UPCOMING',
        'OVERDUE',
        'COMPLETED'
    ) NOT NULL,
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (shipment_id)
        REFERENCES shipments(shipment_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================
-- CHECK ALL TABLES
-- =========================================

SHOW TABLES;
DESCRIBE users;
DESCRIBE brands;
DESCRIBE products;
DESCRIBE shipments;
DESCRIBE content_deadlines;
