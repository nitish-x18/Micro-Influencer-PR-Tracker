-- InfluenceFlow database verification
USE microinfluencer_db;

-- Check all tables
SHOW TABLES;

-- Check table structures
DESCRIBE users;
DESCRIBE brands;
DESCRIBE products;
DESCRIBE shipments;
DESCRIBE content_deadlines;
DESCRIBE audit_logs;

-- Count records
SELECT 'users' AS table_name, COUNT(*) AS total_rows FROM users
UNION ALL SELECT 'brands', COUNT(*) FROM brands
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'shipments', COUNT(*) FROM shipments
UNION ALL SELECT 'content_deadlines', COUNT(*) FROM content_deadlines
UNION ALL SELECT 'audit_logs', COUNT(*) FROM audit_logs;

-- Check foreign keys
SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME,
       REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'microinfluencer_db'
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, COLUMN_NAME;

-- Check indexes
SHOW INDEX FROM users;
SHOW INDEX FROM brands;
SHOW INDEX FROM products;
SHOW INDEX FROM shipments;
SHOW INDEX FROM content_deadlines;
SHOW INDEX FROM audit_logs;

-- Brands and their owners
SELECT b.brand_id, b.brand_name, u.full_name, u.email
FROM brands b
JOIN users u ON u.user_id = b.user_id;

-- Products and their brands
SELECT p.product_id, p.product_name, p.value,
       p.currency, b.brand_name
FROM products p
JOIN brands b ON b.brand_id = p.brand_id;

-- Shipments, products, and brands
SELECT s.shipment_code, s.status, s.shipped_at,
       s.tracking_number, s.received_at,
       p.product_name, b.brand_name
FROM shipments s
JOIN products p ON p.product_id = s.product_id
LEFT JOIN brands b ON b.brand_id = s.brand_id;

-- Content deadlines
SELECT cd.deadline_id, cd.content_title, cd.platform,
       cd.due_date, cd.status, s.shipment_code
FROM content_deadlines cd
JOIN shipments s ON s.shipment_id = cd.shipment_id
ORDER BY cd.due_date;

-- Orphan brands: should return zero
SELECT COUNT(*) AS orphan_brands
FROM brands b
LEFT JOIN users u ON u.user_id = b.user_id
WHERE u.user_id IS NULL;

-- Orphan products: should return zero
SELECT COUNT(*) AS orphan_products
FROM products p
LEFT JOIN brands b ON b.brand_id = p.brand_id
WHERE b.brand_id IS NULL;

-- Orphan shipments: should return zero
SELECT COUNT(*) AS orphan_shipments
FROM shipments s
LEFT JOIN products p ON p.product_id = s.product_id
WHERE p.product_id IS NULL;

-- Orphan deadlines: should return zero
SELECT COUNT(*) AS orphan_deadlines
FROM content_deadlines cd
LEFT JOIN shipments s ON s.shipment_id = cd.shipment_id
WHERE s.shipment_id IS NULL;

-- Check product and brand owner consistency: should return zero
SELECT COUNT(*) AS owner_mismatches
FROM products p
JOIN brands b ON b.brand_id = p.brand_id
WHERE p.user_id <> b.user_id;

-- Check shipment and product owner consistency: should return zero
SELECT COUNT(*) AS shipment_owner_mismatches
FROM shipments s
JOIN products p ON p.product_id = s.product_id
WHERE s.user_id <> p.user_id;

-- Compare stored deadline status with calculated status
SELECT deadline_id, content_title, due_date, completed_at,
       status AS stored_status,
       CASE
         WHEN completed_at IS NOT NULL THEN 'COMPLETED'
         WHEN due_date < CURRENT_DATE() THEN 'OVERDUE'
         ELSE 'UPCOMING'
       END AS calculated_status
FROM content_deadlines;

-- Query performance plans
EXPLAIN
SELECT deadline_id, content_title, platform, due_date
FROM content_deadlines
WHERE user_id = 1
  AND completed_at IS NULL
  AND due_date < CURRENT_DATE()
ORDER BY due_date;

EXPLAIN
SELECT COUNT(*)
FROM shipments
WHERE user_id = 1 AND status = 'SHIPPED';

EXPLAIN
SELECT old_status, new_status, created_at
FROM audit_logs
WHERE shipment_id = 1
ORDER BY created_at;