
<<<<<<< Updated upstream
-- =========================================================
-- MICRO-INFLUENCER PR PACKAGE TRACKER
-- UPDATED DATABASE SCHEMA
-- =========================================================
=======
>>>>>>> Stashed changes

CREATE DATABASE IF NOT EXISTS microinfluencer_db;
USE microinfluencer_db;

-- DROP TABLE IF EXISTS audit_logs, content_deadlines, shipments, products, brands, users;


-- =========================================================
-- 1. USERS
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,            -- null for google login users
    google_id VARCHAR(255) NULL,
    reset_token_hash VARCHAR(255) NULL,
    reset_token_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_users_google_id (google_id)
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

    -- same user cant have two brands with the same name
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
-- one shipment per product, shipment code only has to be
-- unique per user (not globally)
-- =========================================================

CREATE TABLE IF NOT EXISTS shipments (
    shipment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
<<<<<<< Updated upstream
    shipment_code VARCHAR(50) NOT NULL,
    product_id INT NOT NULL UNIQUE,
    shipped_at DATE NOT NULL,
    status ENUM('SHIPPED', 'RECEIVED')
        NOT NULL DEFAULT 'SHIPPED',
    tracking_number VARCHAR(255) NULL,
=======
    brand_id INT NOT NULL,
    product_id INT NOT NULL,
    shipment_code VARCHAR(50) NOT NULL,
    shipment_date DATE NOT NULL,
    status ENUM('SHIPPED', 'RECEIVED') NOT NULL DEFAULT 'SHIPPED',
    tracking_reference VARCHAR(255) NULL,
>>>>>>> Stashed changes
    received_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_shipments_product (product_id),
    UNIQUE KEY uk_shipments_user_code (user_id, shipment_code),

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
-- status is derived from completed_at / due_date, so its
-- nullable and the backend can skip it
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
-- history of shipment status changes
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
-- 7. INDEXES
-- every app query filters by user_id so its the first column.
-- (the single column fk indexes are not created by hand,
-- tidb makes them for the foreign keys on its own)
-- =========================================================

<<<<<<< Updated upstream
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
=======
CREATE INDEX idx_deadlines_user_done_due
    ON content_deadlines (user_id, completed_at, due_date);

CREATE INDEX idx_shipments_user_status
    ON shipments (user_id, status);

CREATE INDEX idx_audit_shipment_created
    ON audit_logs (shipment_id, created_at);

CREATE INDEX idx_products_user_brand
    ON products (user_id, brand_id);


-- =========================================================
-- NOTE: CHECK constraints
-- tidb_enable_check_constraint is OFF on TiDB Cloud Serverless and
-- cant be changed, so these rules are NOT enforced by the database.
-- the backend must validate them:
--   products.value >= 0, currency is 3 letters, valid email format,
--   RECEIVED needs received_at / SHIPPED needs it empty,
--   received date not before shipment_date, audit old_status <> new_status,
--   shipment.user_id / brand_id must match its product
-- database-test.sql section D shows each of these as a [GAP]
-- =========================================================
>>>>>>> Stashed changes
