-- =========================================================
-- MICRO-INFLUENCER PR PACKAGE TRACKER
-- DATABASE VALIDATION TESTS
-- =========================================================

USE microinfluencer_db;


-- =========================================================
-- 1. CHECK ALL TABLES
-- =========================================================

SHOW TABLES;


-- =========================================================
-- 2. CHECK ALL TABLE STRUCTURES
-- =========================================================

DESCRIBE users;
DESCRIBE brands;
DESCRIBE products;
DESCRIBE shipments;
DESCRIBE content_deadlines;
DESCRIBE audit_logs;


-- =========================================================
-- 3. CHECK TABLE RECORD COUNTS
-- =========================================================

SELECT 'users' AS table_name, COUNT(*) AS total_rows FROM users
UNION ALL
SELECT 'brands', COUNT(*) FROM brands
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'shipments', COUNT(*) FROM shipments
UNION ALL
SELECT 'content_deadlines', COUNT(*) FROM content_deadlines
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs;


-- =========================================================
-- 4. CHECK RELATIONSHIPS
-- =========================================================

-- Users and their brands
SELECT
    u.user_id,
    u.full_name,
    b.brand_id,
    b.brand_name
FROM users u
LEFT JOIN brands b
    ON u.user_id = b.user_id;


-- Users, brands, and products
SELECT
    u.user_id,
    u.full_name,
    b.brand_name,
    p.product_id,
    p.product_name
FROM users u
JOIN brands b
    ON u.user_id = b.user_id
JOIN products p
    ON b.brand_id = p.brand_id;


-- Users, products, and shipments
SELECT
    u.user_id,
    u.full_name,
    s.shipment_id,
    s.shipment_code,
    s.status
FROM users u
JOIN shipments s
    ON u.user_id = s.user_id;


-- Users, shipments, and content deadlines
SELECT
    u.user_id,
    u.full_name,
    s.shipment_code,
    cd.deadline_id,
    cd.content_title,
    cd.platform,
    cd.due_date,
    cd.completed_at
FROM users u
JOIN content_deadlines cd
    ON u.user_id = cd.user_id
JOIN shipments s
    ON cd.shipment_id = s.shipment_id;


-- =========================================================
-- 5. ORPHAN RECORD TESTS
-- Each query should return zero rows.
-- =========================================================

-- Brands without a valid user
SELECT b.brand_id, b.user_id
FROM brands b
LEFT JOIN users u
    ON b.user_id = u.user_id
WHERE u.user_id IS NULL;


-- Products without a valid user
SELECT p.product_id, p.user_id
FROM products p
LEFT JOIN users u
    ON p.user_id = u.user_id
WHERE u.user_id IS NULL;


-- Products without a valid brand
SELECT p.product_id, p.brand_id
FROM products p
LEFT JOIN brands b
    ON p.brand_id = b.brand_id
WHERE b.brand_id IS NULL;


-- Shipments without a valid user
SELECT s.shipment_id, s.user_id
FROM shipments s
LEFT JOIN users u
    ON s.user_id = u.user_id
WHERE u.user_id IS NULL;


-- Shipments without a valid product
SELECT s.shipment_id, s.product_id
FROM shipments s
LEFT JOIN products p
    ON s.product_id = p.product_id
WHERE p.product_id IS NULL;


-- Content deadlines without a valid user
SELECT cd.deadline_id, cd.user_id
FROM content_deadlines cd
LEFT JOIN users u
    ON cd.user_id = u.user_id
WHERE u.user_id IS NULL;


-- Content deadlines without a valid shipment
SELECT cd.deadline_id, cd.shipment_id
FROM content_deadlines cd
LEFT JOIN shipments s
    ON cd.shipment_id = s.shipment_id
WHERE s.shipment_id IS NULL;


-- Audit logs without a valid user
SELECT al.audit_log_id, al.user_id
FROM audit_logs al
LEFT JOIN users u
    ON al.user_id = u.user_id
WHERE u.user_id IS NULL;


-- Audit logs without a valid shipment
SELECT al.audit_log_id, al.shipment_id
FROM audit_logs al
LEFT JOIN shipments s
    ON al.shipment_id = s.shipment_id
WHERE s.shipment_id IS NULL;


-- =========================================================
-- 6. CHECK PLATFORM OPTIONS
-- =========================================================

SHOW COLUMNS FROM content_deadlines LIKE 'platform';


-- =========================================================
-- 7. CHECK INDEXES
-- =========================================================

SHOW INDEX FROM users;
SHOW INDEX FROM brands;
SHOW INDEX FROM products;
SHOW INDEX FROM shipments;
SHOW INDEX FROM content_deadlines;
SHOW INDEX FROM audit_logs;


-- =========================================================
-- 8. QUERY PERFORMANCE TESTS
-- =========================================================

EXPLAIN
SELECT *
FROM products
WHERE user_id = 1
  AND brand_id = 1;


EXPLAIN
SELECT *
FROM shipments
WHERE user_id = 1
  AND product_id = 1;


EXPLAIN
SELECT *
FROM content_deadlines
WHERE user_id = 1
  AND shipment_id = 1;


EXPLAIN
SELECT *
FROM audit_logs
WHERE user_id = 1
  AND shipment_id = 1;


-- =========================================================
-- END OF DATABASE VALIDATION TESTS
-- =========================================================