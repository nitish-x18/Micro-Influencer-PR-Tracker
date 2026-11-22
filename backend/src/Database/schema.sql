
-- =========================================================
-- MICRO-INFLUENCER PR PACKAGE TRACKER
-- UPDATED DATABASE SCHEMA
-- =========================================================

CREATE DATABASE IF NOT EXISTS microinfluencer_db;
USE microinfluencer_db;


-- =========================================================
-- 1. USERS
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    google_id VARCHAR(255) NULL UNIQUE,
    reset_token_hash VARCHAR(255) NULL,
    reset_token_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 2. BRANDS
-- =========================================================

CREATE TABLE IF NOT EXISTS brands (
    brand_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    brand_name VARCHAR(100) NOT NULL,
    website VARCHAR(255) NULL,
    description VARCHAR(500) NULL,
    logo_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_brands_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE KEY uk_brands_user_name (user_id, brand_name)
);


-- =========================================================
-- 3. PRODUCTS
-- =========================================================

CREATE TABLE IF NOT EXISTS products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    brand_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    value DECIMAL(10,2) NULL,
    currency VARCHAR(3) NOT NULL,
    description VARCHAR(1000) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_products_brand
        FOREIGN KEY (brand_id)
        REFERENCES brands(brand_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- 4. SHIPMENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS shipments (
    shipment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    shipment_code VARCHAR(50) NOT NULL,
    product_id INT NOT NULL UNIQUE,
    shipped_at DATE NOT NULL,
    status ENUM('SHIPPED', 'RECEIVED')
        NOT NULL DEFAULT 'SHIPPED',
    tracking_number VARCHAR(255) NULL,
    received_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_shipments_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_shipments_product
        FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE KEY uk_shipments_user_code (user_id, shipment_code)
);


-- =========================================================
-- 5. CONTENT DEADLINES
-- =========================================================

CREATE TABLE IF NOT EXISTS content_deadlines (
    deadline_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    shipment_id INT NOT NULL,
    content_title VARCHAR(255) NULL,

    platform ENUM(
        'Instagram',
        'YouTube',
        'Pinterest',
        'Blog',
        'Other'
    ) NOT NULL,

    due_date DATE NOT NULL,

    status ENUM(
        'UPCOMING',
        'OVERDUE',
        'COMPLETED'
    ) NULL,

    notes VARCHAR(500) NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_deadlines_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_deadlines_shipment
        FOREIGN KEY (shipment_id)
        REFERENCES shipments(shipment_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- 6. AUDIT LOGS
-- =========================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    audit_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    shipment_id INT NOT NULL,
    old_status ENUM('SHIPPED', 'RECEIVED') NULL,
    new_status ENUM('SHIPPED', 'RECEIVED') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_logs_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_audit_logs_shipment
        FOREIGN KEY (shipment_id)
        REFERENCES shipments(shipment_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- 7. ADDITIONAL INDEXES
-- =========================================================

-- Products
CREATE INDEX idx_products_user_brand
    ON products(user_id, brand_id);


-- Shipments
CREATE INDEX idx_shipments_user_status
    ON shipments(user_id, status);


-- Content deadlines
CREATE INDEX idx_deadlines_user_done_due
    ON content_deadlines(user_id, completed_at, due_date);


-- Audit logs
CREATE INDEX idx_audit_shipment_created
    ON audit_logs(shipment_id, created_at);


-- =========================================================
-- END OF SCHEMA
-- =========================================================
