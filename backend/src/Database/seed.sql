
USE microinfluencer_db;


-- =====================================================
-- 1. USERS
-- =====================================================
INSERT INTO users
(full_name, email, password_hash)
VALUES
('Rohan Sharma', 'rohan@test.com', 'test_hash_placeholder_123'),
('Rahul Kumar', 'rahul@test.com', 'test_hash_placeholder_456');


-- =====================================================
-- 2. BRANDS
-- =====================================================
INSERT INTO brands
(user_id, brand_name, description, website, logo_url)
SELECT u.user_id, v.brand_name, v.description, v.website, v.logo_url
FROM (
    SELECT 'rohan@test.com' AS owner_email, 'GlowCare' AS brand_name,
           'Skincare and beauty products' AS description,
           'https://glowcare.example.com' AS website,
           'https://glowcare.example.com/logo.png' AS logo_url
    UNION ALL
    SELECT 'rahul@test.com', 'FitLife',
           'Fitness and wellness products',
           'https://fitlife.example.com',
           'https://fitlife.example.com/logo.png'
) v
JOIN users u ON u.email = v.owner_email;


-- =====================================================
-- 3. PRODUCTS
-- =====================================================
INSERT INTO products
(brand_id, user_id, product_name, value, currency, description)
SELECT b.brand_id, b.user_id, v.product_name, v.product_value, 'INR', v.description
FROM (
    SELECT 'GlowCare' AS brand_name, 'Vitamin C Serum' AS product_name,
           799.00 AS product_value, 'Vitamin C face serum' AS description
    UNION ALL
    SELECT 'GlowCare', 'Hydrating Moisturizer', 599.00, 'Daily moisturizing cream'
    UNION ALL
    SELECT 'FitLife', 'Protein Powder', 1499.00, 'Whey protein supplement'
) v
JOIN brands b ON b.brand_name = v.brand_name;


-- =====================================================
-- 4. SHIPMENTS
-- =====================================================
-- brand_id and user_id are copied from the product,
-- so a shipment always has the same brand and owner as its product.

INSERT INTO shipments
(shipment_code, brand_id, product_id, user_id,
 shipment_date, status, tracking_reference, received_at)
SELECT v.shipment_code, p.brand_id, p.product_id, p.user_id,
       v.shipment_date, v.status, v.tracking_reference, v.received_at
FROM (
    SELECT 'SHIP-001' AS shipment_code, 'Vitamin C Serum' AS product_name,
           '2026-09-20' AS shipment_date, 'RECEIVED' AS status,
           'TRK123456' AS tracking_reference, '2026-09-23 14:30:00' AS received_at
    UNION ALL
    SELECT 'SHIP-002', 'Hydrating Moisturizer',
           '2026-09-25', 'SHIPPED', 'TRK789012', NULL
    UNION ALL
    SELECT 'SHIP-003', 'Protein Powder',
           '2026-09-27', 'SHIPPED', 'TRK345678', NULL
) v
JOIN products p ON p.product_name = v.product_name;


-- =====================================================
-- 5. CONTENT DEADLINES
-- =====================================================
-- Due dates are relative to the day you run this file, so they stay UPCOMING.
-- (The backend should calculate OVERDUE / UPCOMING / COMPLETED when reading.)

INSERT INTO content_deadlines
(shipment_id, user_id, content_title, platform,
 due_date, status, notes, completed_at)
SELECT s.shipment_id, s.user_id, v.content_title, v.platform,
       DATE_ADD(CURRENT_DATE(), INTERVAL v.due_in_days DAY),
       'UPCOMING', v.notes, NULL
FROM (
    SELECT 'SHIP-001' AS shipment_code, 'Instagram serum post' AS content_title,
           'INSTAGRAM' AS platform, 12 AS due_in_days,
           'Create Instagram post for the serum' AS notes
    UNION ALL
    SELECT 'SHIP-002', 'Product review video', 'YOUTUBE', 17,
           'Create product review video'
    UNION ALL
    SELECT 'SHIP-003', 'Short product video', 'PINTEREST', 15,
           'Create short product video'
) v
JOIN shipments s ON s.shipment_code = v.shipment_code;


-- =====================================================
-- 6. AUDIT LOGS
-- =====================================================
INSERT INTO audit_logs
(user_id, shipment_id, old_status, new_status)
SELECT s.user_id, s.shipment_id, v.old_status, v.new_status
FROM (
    SELECT 'SHIP-001' AS shipment_code, NULL AS old_status, 'SHIPPED' AS new_status
    UNION ALL
    SELECT 'SHIP-001', 'SHIPPED', 'RECEIVED'
    UNION ALL
    SELECT 'SHIP-002', NULL, 'SHIPPED'
    UNION ALL
    SELECT 'SHIP-003', NULL, 'SHIPPED'
) v
JOIN shipments s ON s.shipment_code = v.shipment_code;


-- =====================================================
-- 7. VERIFY
-- =====================================================
-- [EXPECT users 2, brands 2, products 3, shipments 3, content_deadlines 3, audit_logs 4]
SELECT 'users' AS tbl, COUNT(*) AS n FROM users
UNION ALL SELECT 'brands', COUNT(*) FROM brands
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'shipments', COUNT(*) FROM shipments
UNION ALL SELECT 'content_deadlines', COUNT(*) FROM content_deadlines
UNION ALL SELECT 'audit_logs', COUNT(*) FROM audit_logs;

-- [EXPECT 0] shipment brand and owner must match its product
SELECT COUNT(*) AS mismatches
FROM shipments s
JOIN products p ON p.product_id = s.product_id
WHERE s.brand_id <> p.brand_id OR s.user_id <> p.user_id;

-- ids the backend can use for API testing
SELECT b.brand_id, p.product_id, s.shipment_id, s.shipment_code
FROM shipments s
JOIN products p ON p.product_id = s.product_id
JOIN brands b ON b.brand_id = s.brand_id
ORDER BY s.shipment_code;

-- =====================================================
-- END OF SEED DATA
-- =====================================================