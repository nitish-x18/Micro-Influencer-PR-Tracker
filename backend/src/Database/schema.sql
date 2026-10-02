-- =========================================================
-- MICRO-INFLUENCER PR PACKAGE TRACKER
-- DATABASE SCHEMA
-- =========================================================


-- ---------------------------------------------------------
-- 1. CREATE DATABASE
-- ---------------------------------------------------------

-- Create the database if it does not already exist.
CREATE DATABASE IF NOT EXISTS microinfluencer_db;

-- Select the database so all tables are created inside it.
USE microinfluencer_db;


-- =========================================================
-- 2. USERS TABLE
-- =========================================================

-- Stores login and basic information of users.
CREATE TABLE IF NOT EXISTS users (

    -- Unique ID for each user.
    -- AUTO_INCREMENT automatically generates the ID.
    user_id INT PRIMARY KEY AUTO_INCREMENT,

    -- Full name of the user.
    full_name VARCHAR(100) NOT NULL,

    -- Email must be provided and must be unique.
    email VARCHAR(150) NOT NULL UNIQUE,

    -- Stores the hashed password, not the plain-text password.
    password_hash VARCHAR(255) NOT NULL,

    -- Automatically stores the date and time
    -- when the user account is created.
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. BRANDS TABLE
-- =========================================================

-- Stores information about brands.
CREATE TABLE IF NOT EXISTS brands (

    -- Unique ID for each brand.
    brand_id INT PRIMARY KEY AUTO_INCREMENT,

    -- Connects the brand to the user who owns it.
    -- This is a foreign key referencing users.user_id.
    user_id INT NOT NULL,

    -- Name of the brand.
    brand_name VARCHAR(100) NOT NULL,

    -- Short description of the brand.
    description VARCHAR(500),

    -- Website URL of the brand.
    website_url VARCHAR(255),

    -- URL/path of the brand logo.
    logo_url VARCHAR(255),

    -- Automatically stores the brand creation date and time.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Automatically updates whenever the brand record is modified.
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key establishes the relationship
    -- between brands and users.
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)

        -- If a user is deleted, their brands are also deleted.
        ON DELETE CASCADE

        -- If the user_id changes, the related brand records update.
        ON UPDATE CASCADE
);


-- =========================================================
-- 4. PRODUCTS TABLE
-- =========================================================

-- Stores products belonging to brands.
CREATE TABLE IF NOT EXISTS products (

    -- Unique ID for each product.
    product_id INT PRIMARY KEY AUTO_INCREMENT,

    -- Connects the product to its brand.
    brand_id INT NOT NULL,

    -- Name of the product.
    product_name VARCHAR(255) NOT NULL,

    -- Monetary value of the product.
    value DECIMAL(10,2),

    -- Currency used for the product value.
    -- Example: INR, USD, EUR.
    currency VARCHAR(3) NOT NULL,

    -- Description of the product.
    description VARCHAR(1000),

    -- Automatically stores the product creation date and time.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key establishes the relationship
    -- between products and brands.
    FOREIGN KEY (brand_id)
        REFERENCES brands(brand_id)

        -- Delete products automatically when their brand is deleted.
        ON DELETE CASCADE

        -- Update the brand_id if the referenced brand ID changes.
        ON UPDATE CASCADE
);


-- =========================================================
-- 5. SHIPMENTS TABLE
-- =========================================================

-- Stores shipment information for products.
CREATE TABLE IF NOT EXISTS shipments (

    -- Unique ID for each shipment.
    shipment_id INT PRIMARY KEY AUTO_INCREMENT,

    -- Unique code used to identify a shipment.
    shipment_code VARCHAR(50) NOT NULL UNIQUE,

    -- Identifies the brand sending the shipment.
    brand_id INT NOT NULL,

    -- Identifies the product being shipped.
    product_id INT NOT NULL,

    -- Date on which the shipment was sent.
    shipment_date DATE NOT NULL,

    -- Current status of the shipment.
    -- Only SHIPPED or RECEIVED values are allowed.
    status ENUM('SHIPPED', 'RECEIVED') NOT NULL,

    -- Tracking number/reference provided by the courier.
    tracking_reference VARCHAR(255) NULL,

    -- Date and time when the shipment was received.
    -- NULL means the shipment has not been received yet.
    received_at TIMESTAMP NULL,

    -- Automatically stores the shipment creation date and time.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    -- Foreign key connecting shipment to a brand.
    FOREIGN KEY (brand_id)
        REFERENCES brands(brand_id)

        -- Delete shipments when the related brand is deleted.
        ON DELETE CASCADE

        -- Update the brand reference if the brand ID changes.
        ON UPDATE CASCADE,


    -- Foreign key connecting shipment to a product.
    FOREIGN KEY (product_id)
        REFERENCES products(product_id)

        -- Delete shipments when the related product is deleted.
        ON DELETE CASCADE

        -- Update the product reference if the product ID changes.
        ON UPDATE CASCADE
);


-- =========================================================
-- 6. CONTENT DEADLINES TABLE
-- =========================================================

-- Stores deadlines for creating promotional content
-- related to a shipment.
CREATE TABLE IF NOT EXISTS content_deadlines (

    -- Unique ID for each content deadline.
    deadline_id INT PRIMARY KEY AUTO_INCREMENT,

    -- Connects the deadline to a shipment.
    shipment_id INT NOT NULL,

    -- Platform where the content will be published.
    platform ENUM(
        'Instagram',
        'YouTube',
        'TikTok',
        'Blog',
        'Other'
    ) NOT NULL,

    -- Date by which the content should be completed.
    due_date DATE NOT NULL,

    -- Current status of the content deadline.
    status ENUM(
        'UPCOMING',
        'OVERDUE',
        'COMPLETED'
    ) NOT NULL,

    -- Additional information about the content requirement.
    notes VARCHAR(500),

    -- Automatically stores the deadline creation date and time.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    -- Foreign key connecting the deadline to a shipment.
    FOREIGN KEY (shipment_id)
        REFERENCES shipments(shipment_id)

        -- Delete deadlines when the related shipment is deleted.
        ON DELETE CASCADE

        -- Update the shipment reference if the shipment ID changes.
        ON UPDATE CASCADE
);


-- =========================================================
-- 7. INDEXES
-- =========================================================

-- Index on user_id improves queries that search brands
-- belonging to a particular user.
CREATE INDEX idx_brands_user_id
ON brands(user_id);


-- Index on brand_id improves queries that search products
-- belonging to a particular brand.
CREATE INDEX idx_products_brand_id
ON products(brand_id);


-- Index on brand_id improves queries that search shipments
-- belonging to a particular brand.
CREATE INDEX idx_shipments_brand_id
ON shipments(brand_id);


-- Index on product_id improves queries that search shipments
-- belonging to a particular product.
CREATE INDEX idx_shipments_product_id
ON shipments(product_id);


-- Index on shipment_id improves queries that search
-- content deadlines belonging to a particular shipment.
CREATE INDEX idx_content_deadlines_shipment_id
ON content_deadlines(shipment_id);