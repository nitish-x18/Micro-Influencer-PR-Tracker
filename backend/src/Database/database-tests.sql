-- =========================================================
-- MICRO-INFLUENCER PR PACKAGE TRACKER
-- DATABASE TESTING
-- =========================================================

USE microinfluencer_db;


-- =========================================================
-- 1. CHECK TABLES
-- =========================================================

SHOW TABLES;


-- =========================================================
-- 2. CHECK TABLE STRUCTURE
-- =========================================================

DESCRIBE users;
DESCRIBE brands;
DESCRIBE products;
DESCRIBE shipments;
DESCRIBE content_deadlines;


-- =========================================================
-- 3. INSERT TEST DATA
-- =========================================================

-- Insert sample users
INSERT INTO users
(full_name, email, password_hash)
VALUES
('Rohan Sharma', 'rohan@test.com', 'test_hash_123'),
('Rahul Kumar', 'rahul@test.com', 'test_hash_456');

-- Then your brands, products, shipments,
-- and content_deadlines INSERT statements go here.


-- =========================================================
-- 4. CHECK INSERTED DATA
-- =========================================================

SELECT * FROM users;
SELECT * FROM brands;
SELECT * FROM products;
SELECT * FROM shipments;
SELECT * FROM content_deadlines;


-- =========================================================
-- 5. ROW COUNT TEST
-- =========================================================

SELECT 'users' AS table_name, COUNT(*) AS total_rows
FROM users

UNION ALL

SELECT 'brands', COUNT(*)
FROM brands

UNION ALL

SELECT 'products', COUNT(*)
FROM products

UNION ALL

SELECT 'shipments', COUNT(*)
FROM shipments

UNION ALL

SELECT 'content_deadlines', COUNT(*)
FROM content_deadlines;


-- =========================================================
-- 6. RELATIONSHIP / JOIN TESTS
-- =========================================================

-- Test relationships between all major tables.
SELECT
    u.full_name AS user_name,
    b.brand_name,
    p.product_name,
    s.shipment_code,
    cd.platform,
    cd.due_date
FROM users u
JOIN brands b
    ON u.user_id = b.user_id
JOIN products p
    ON b.brand_id = p.brand_id
JOIN shipments s
    ON p.product_id = s.product_id
JOIN content_deadlines cd
    ON s.shipment_id = cd.shipment_id;


-- =========================================================
-- 7. ORPHAN RECORD TESTS
-- =========================================================

-- Products without a valid brand.
SELECT p.*
FROM products p
LEFT JOIN brands b
    ON p.brand_id = b.brand_id
WHERE b.brand_id IS NULL;


-- Shipments without a valid product.
SELECT s.*
FROM shipments s
LEFT JOIN products p
    ON s.product_id = p.product_id
WHERE p.product_id IS NULL;


-- Deadlines without a valid shipment.
SELECT cd.*
FROM content_deadlines cd
LEFT JOIN shipments s
    ON cd.shipment_id = s.shipment_id
WHERE s.shipment_id IS NULL;


-- =========================================================
-- 8. EXPLAIN / PERFORMANCE TESTS
-- =========================================================

EXPLAIN
SELECT *
FROM products
WHERE brand_id = 1;

EXPLAIN
SELECT *
FROM shipments
WHERE brand_id = 1;

EXPLAIN
SELECT *
FROM content_deadlines
WHERE shipment_id = 1;


-- =========================================================
-- 9. INDEX CHECK
-- =========================================================

SHOW INDEX FROM brands;
SHOW INDEX FROM products;
SHOW INDEX FROM shipments;
SHOW INDEX FROM content_deadlines;