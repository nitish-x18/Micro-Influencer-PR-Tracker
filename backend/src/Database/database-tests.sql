
-- SECTIONS
--   A Structure     B Integrity   C Must FAIL   D NOT enforced (backend job)
--   E Cascade       F Functional  G Performance H Load test
--
-- READING THE RESULTS
--   [EXPECT 0]       result must be 0 / no rows
--   [EXPECT ERROR]   an error means the test PASSED
--                    (read the error: it must name the column the test is about)
--   [GAP]            statement SUCCEEDS because TiDB Serverless does not enforce
--                    CHECK constraints. The backend must validate this rule.
--   Every test that changes data is wrapped in a transaction and rolled back.
--   If an error stops a transaction halfway, run  ROLLBACK;  manually.
--   Watch "rows affected": 0 rows on an UPDATE/DELETE means the test proved nothing.
--
-- DATA ASSUMED (standard seed data)
--   users rohan@test.com and rahul@test.com, brands GlowCare and FitLife,
--   product 'Vitamin C Serum', shipments SHP-001 (RECEIVED), SHP-002 (SHIPPED),
--   SHP-003, and 200 seed shipments SHIP-S0001 ... SHIP-S0200.
--   Counts: users 2, brands 2, products 203, shipments 203,
--           content_deadlines 203, audit_logs 300
--
-- UPDATED 23 Nov 2026: no variables; platform values are uppercase
--   (INSTAGRAM, YOUTUBE, PINTEREST, BLOG, OTHER); shipments has brand_id.
-- =====================================================================

USE microinfluencer_db;

-- =====================================================================
-- A. STRUCTURE
-- =====================================================================

-- A1 [EXPECT 6]
SELECT COUNT(*) AS total_tables FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'microinfluencer_db' AND TABLE_TYPE = 'BASE TABLE';

-- A2 [EXPECT 10 rows, all DELETE_RULE = CASCADE and UPDATE_RULE = CASCADE]
SELECT k.TABLE_NAME, k.COLUMN_NAME, k.REFERENCED_TABLE_NAME, r.DELETE_RULE, r.UPDATE_RULE
FROM information_schema.KEY_COLUMN_USAGE k
JOIN information_schema.REFERENTIAL_CONSTRAINTS r
  ON k.CONSTRAINT_NAME = r.CONSTRAINT_NAME AND k.CONSTRAINT_SCHEMA = r.CONSTRAINT_SCHEMA
 AND k.TABLE_NAME = r.TABLE_NAME
WHERE k.TABLE_SCHEMA = 'microinfluencer_db' AND k.REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY k.TABLE_NAME, k.COLUMN_NAME;

-- A3 [EXPECT 8 rows. uk_* NON_UNIQUE = 0, idx_* NON_UNIQUE = 1]
SELECT TABLE_NAME, INDEX_NAME, NON_UNIQUE, GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS cols
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'microinfluencer_db'
  AND INDEX_NAME IN ('uk_users_google_id','uk_brands_user_name','uk_shipments_product',
                     'uk_shipments_user_code','idx_deadlines_user_done_due',
                     'idx_shipments_user_status','idx_audit_shipment_created','idx_products_user_brand')
GROUP BY TABLE_NAME, INDEX_NAME, NON_UNIQUE ORDER BY TABLE_NAME, INDEX_NAME;

-- A4 [EXPECT 0 rows] old column names must not exist
SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'microinfluencer_db'
  AND COLUMN_NAME IN ('tracking_number','shipped_at','website_url');

-- A5 [EXPECT 9 rows] new columns exist
SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'microinfluencer_db'
  AND ((TABLE_NAME='users' AND COLUMN_NAME IN ('google_id','reset_token_hash','reset_token_expires_at'))
    OR (TABLE_NAME='shipments' AND COLUMN_NAME IN ('brand_id','tracking_reference','shipment_date'))
    OR (TABLE_NAME='brands' AND COLUMN_NAME='website')
    OR (TABLE_NAME='content_deadlines' AND COLUMN_NAME IN ('content_title','completed_at')));

-- A6 [EXPECT enum('INSTAGRAM','YOUTUBE','PINTEREST','BLOG','OTHER') NOT NULL]
SHOW COLUMNS FROM content_deadlines LIKE 'platform';

-- A7 [EXPECT IS_NULLABLE = YES] (Google users have no password)
SELECT COLUMN_NAME, IS_NULLABLE FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'microinfluencer_db' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'password_hash';

-- =====================================================================
-- B. DATA INTEGRITY
-- =====================================================================

-- B1 [EXPECT all n = 0] orphan rows
SELECT 'brands->users' AS chk, COUNT(*) AS n FROM brands b LEFT JOIN users u ON b.user_id=u.user_id WHERE u.user_id IS NULL
UNION ALL SELECT 'products->brands', COUNT(*) FROM products p LEFT JOIN brands b ON p.brand_id=b.brand_id WHERE b.brand_id IS NULL
UNION ALL SELECT 'products->users', COUNT(*) FROM products p LEFT JOIN users u ON p.user_id=u.user_id WHERE u.user_id IS NULL
UNION ALL SELECT 'shipments->products', COUNT(*) FROM shipments s LEFT JOIN products p ON s.product_id=p.product_id WHERE p.product_id IS NULL
UNION ALL SELECT 'shipments->users', COUNT(*) FROM shipments s LEFT JOIN users u ON s.user_id=u.user_id WHERE u.user_id IS NULL
UNION ALL SELECT 'shipments->brands', COUNT(*) FROM shipments s LEFT JOIN brands b ON s.brand_id=b.brand_id WHERE b.brand_id IS NULL
UNION ALL SELECT 'deadlines->shipments', COUNT(*) FROM content_deadlines d LEFT JOIN shipments s ON d.shipment_id=s.shipment_id WHERE s.shipment_id IS NULL
UNION ALL SELECT 'deadlines->users', COUNT(*) FROM content_deadlines d LEFT JOIN users u ON d.user_id=u.user_id WHERE u.user_id IS NULL
UNION ALL SELECT 'audit->users', COUNT(*) FROM audit_logs a LEFT JOIN users u ON a.user_id=u.user_id WHERE u.user_id IS NULL
UNION ALL SELECT 'audit->shipments', COUNT(*) FROM audit_logs a LEFT JOIN shipments s ON a.shipment_id=s.shipment_id WHERE s.shipment_id IS NULL;

-- B2 [EXPECT all n = 0] owner (user_id) and brand must match across linked tables
SELECT 'product vs brand owner' AS chk, COUNT(*) AS n FROM products p JOIN brands b ON p.brand_id=b.brand_id WHERE p.user_id<>b.user_id
UNION ALL SELECT 'shipment vs product owner', COUNT(*) FROM shipments s JOIN products p ON s.product_id=p.product_id WHERE s.user_id<>p.user_id
UNION ALL SELECT 'shipment vs product brand', COUNT(*) FROM shipments s JOIN products p ON s.product_id=p.product_id WHERE s.brand_id<>p.brand_id
UNION ALL SELECT 'shipment vs brand owner', COUNT(*) FROM shipments s JOIN brands b ON s.brand_id=b.brand_id WHERE s.user_id<>b.user_id
UNION ALL SELECT 'deadline vs shipment owner', COUNT(*) FROM content_deadlines d JOIN shipments s ON d.shipment_id=s.shipment_id WHERE d.user_id<>s.user_id
UNION ALL SELECT 'audit vs shipment owner', COUNT(*) FROM audit_logs a JOIN shipments s ON a.shipment_id=s.shipment_id WHERE a.user_id<>s.user_id;

-- B3 [EXPECT all n = 0] business rules the DB cannot enforce, so check the data
SELECT 'negative product value' AS chk, COUNT(*) AS n FROM products WHERE value < 0
UNION ALL SELECT 'bad currency length', COUNT(*) FROM products WHERE CHAR_LENGTH(currency) <> 3
UNION ALL SELECT 'RECEIVED without received_at', COUNT(*) FROM shipments WHERE status='RECEIVED' AND received_at IS NULL
UNION ALL SELECT 'SHIPPED with received_at', COUNT(*) FROM shipments WHERE status='SHIPPED' AND received_at IS NOT NULL
UNION ALL SELECT 'received before shipped', COUNT(*) FROM shipments WHERE received_at IS NOT NULL AND DATE(received_at) < shipment_date
UNION ALL SELECT 'audit old = new', COUNT(*) FROM audit_logs WHERE old_status = new_status
UNION ALL SELECT 'invalid email format', COUNT(*) FROM users WHERE email NOT LIKE '%_@_%.__%'
UNION ALL SELECT 'COMPLETED without completed_at', COUNT(*) FROM content_deadlines WHERE status='COMPLETED' AND completed_at IS NULL
UNION ALL SELECT 'completed_at but not COMPLETED', COUNT(*) FROM content_deadlines WHERE status<>'COMPLETED' AND completed_at IS NOT NULL;

-- B4 [EXPECT 0 rows on the day status was recalculated; later days show stale rows]
-- Stored status goes out of date as time passes. Backend must calculate it on read.
SELECT deadline_id, due_date, completed_at, status AS stored_status,
       CASE WHEN completed_at IS NOT NULL THEN 'COMPLETED'
            WHEN due_date < CURRENT_DATE() THEN 'OVERDUE'
            ELSE 'UPCOMING' END AS calculated_status
FROM content_deadlines
HAVING stored_status <> calculated_status OR stored_status IS NULL;

-- B5 [EXPECT users 2, brands 2, products 203, shipments 203, content_deadlines 203, audit_logs 300]
SELECT 'users' AS tbl, COUNT(*) AS n FROM users
UNION ALL SELECT 'brands', COUNT(*) FROM brands
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'shipments', COUNT(*) FROM shipments
UNION ALL SELECT 'content_deadlines', COUNT(*) FROM content_deadlines
UNION ALL SELECT 'audit_logs', COUNT(*) FROM audit_logs;

-- B6 [EXPECT 0 rows] products without a shipment
SELECT p.product_id, p.product_name FROM products p
LEFT JOIN shipments s ON s.product_id = p.product_id WHERE s.shipment_id IS NULL;

-- =====================================================================
-- C. RULES THAT MUST FAIL   ([EXPECT ERROR] = test passed)
-- =====================================================================

-- C1 [EXPECT ERROR 1062] duplicate email
INSERT INTO users (full_name, email, password_hash) VALUES ('Dup User', 'rohan@test.com', 'x');

-- C2 [EXPECT ERROR 1062 on the 2nd insert] duplicate google_id
START TRANSACTION;
INSERT INTO users (full_name, email, google_id) VALUES ('G1', 'g1@test.com', 'gid-1');
INSERT INTO users (full_name, email, google_id) VALUES ('G2', 'g2@test.com', 'gid-1');
ROLLBACK;

-- C3 [EXPECT ERROR 1062 uk_shipments_product] second shipment for the same product
INSERT INTO shipments (shipment_code, brand_id, product_id, user_id, shipment_date, status)
VALUES ('SHP-DUP1', (SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rohan@test.com' AND b.brand_name = 'GlowCare'), (SELECT product_id FROM products WHERE product_name = 'Vitamin C Serum'), (SELECT user_id FROM users WHERE email = 'rohan@test.com'), CURRENT_DATE(), 'SHIPPED');

-- C4 [EXPECT ERROR 1062 uk_brands_user_name] duplicate brand name for the same user
INSERT INTO brands (user_id, brand_name) VALUES ((SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'GlowCare');

-- C5 [EXPECT ERROR 1062 uk_shipments_user_code on the shipment insert]
START TRANSACTION;
INSERT INTO products (brand_id, user_id, product_name, value, currency)
VALUES ((SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rohan@test.com' AND b.brand_name = 'GlowCare'), (SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'TMP-C5', 10, 'INR');
INSERT INTO shipments (shipment_code, brand_id, product_id, user_id, shipment_date, status)
SELECT 'SHP-001', brand_id, product_id, user_id, CURRENT_DATE(), 'SHIPPED'
FROM products WHERE product_name = 'TMP-C5';
ROLLBACK;

-- C6 [EXPECT ERROR 1265 Data truncated for column 'status']
UPDATE shipments SET status = 'LOST' WHERE shipment_code = 'SHP-001';

-- C7 [EXPECT ERROR 1452] foreign key to a missing user
INSERT INTO brands (user_id, brand_name) VALUES (999999, 'Ghost Brand');

-- C8 [EXPECT ERROR 1452] foreign key to a missing brand
INSERT INTO products (brand_id, user_id, product_name, value, currency)
VALUES (999999, (SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'Ghost Product', 10, 'INR');

-- C9 [EXPECT ERROR 1452] foreign key to a missing shipment
INSERT INTO content_deadlines (shipment_id, user_id, content_title, platform, due_date)
VALUES (999999, (SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'Ghost', 'BLOG', CURRENT_DATE());

-- C10a [EXPECT ERROR 1048 Column 'brand_name' cannot be null]
INSERT INTO brands (user_id, brand_name) VALUES ((SELECT user_id FROM users WHERE email = 'rohan@test.com'), NULL);

-- C10b [EXPECT ERROR 1048 Column 'full_name' cannot be null]
INSERT INTO users (full_name, email) VALUES (NULL, 'nn@test.com');

-- C10c [EXPECT ERROR 1364 Field 'shipment_date' doesn't have a default value]
INSERT INTO shipments (shipment_code, brand_id, product_id, user_id, status)
VALUES ('SHP-NN', (SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rohan@test.com' AND b.brand_name = 'GlowCare'), (SELECT product_id FROM products WHERE product_name = 'Vitamin C Serum'), (SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'SHIPPED');

-- C10d [EXPECT ERROR 1364 Field 'brand_id' doesn't have a default value]
INSERT INTO shipments (shipment_code, product_id, user_id, shipment_date, status)
VALUES ('SHP-NN2', (SELECT product_id FROM products WHERE product_name = 'Vitamin C Serum'), (SELECT user_id FROM users WHERE email = 'rohan@test.com'), CURRENT_DATE(), 'SHIPPED');

-- C11 [EXPECT ERROR 1265 Data truncated for column 'platform'] removed value TikTok
INSERT INTO content_deadlines (shipment_id, user_id, content_title, platform, due_date)
VALUES ((SELECT shipment_id FROM shipments WHERE shipment_code = 'SHP-001'), (SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'TikTok test', 'TikTok', CURRENT_DATE());

-- C12 [EXPECT ERROR 1406 Data too long for column 'currency']
INSERT INTO products (brand_id, user_id, product_name, value, currency)
VALUES ((SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rohan@test.com' AND b.brand_name = 'GlowCare'), (SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'Bad currency', 10, 'INRR');

-- C13 [EXPECT ERROR 1264 Out of range value for column 'value']
INSERT INTO products (brand_id, user_id, product_name, value, currency)
VALUES ((SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rohan@test.com' AND b.brand_name = 'GlowCare'), (SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'Too expensive', 999999999999, 'INR');

-- C14 [EXPECT ERROR 1406 Data too long for column 'full_name']
INSERT INTO users (full_name, email, password_hash)
VALUES (REPEAT('a', 101), 'long@test.com', 'x');

-- C15 [EXPECT ERROR 1452 on the shipment insert] shipment with a brand_id that does not exist
START TRANSACTION;
INSERT INTO products (brand_id, user_id, product_name, value, currency)
VALUES ((SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rohan@test.com' AND b.brand_name = 'GlowCare'), (SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'TMP-C15', 10, 'INR');
INSERT INTO shipments (shipment_code, brand_id, product_id, user_id, shipment_date, status)
SELECT 'SHP-C15', 999999, product_id, user_id, CURRENT_DATE(), 'SHIPPED'
FROM products WHERE product_name = 'TMP-C15';
ROLLBACK;

-- C16 [EXPECT ERROR 1406 on the shipment insert] shipment_code longer than VARCHAR(50)
START TRANSACTION;
INSERT INTO products (brand_id, user_id, product_name, value, currency)
VALUES ((SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rohan@test.com' AND b.brand_name = 'GlowCare'), (SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'TMP-C16', 10, 'INR');
INSERT INTO shipments (shipment_code, brand_id, product_id, user_id, shipment_date, status)
SELECT REPEAT('X', 51), brand_id, product_id, user_id, CURRENT_DATE(), 'SHIPPED'
FROM products WHERE product_name = 'TMP-C16';
ROLLBACK;

-- =====================================================================
-- D. NOT ENFORCED BY THE DATABASE   ([GAP] = succeeds, backend must validate)
-- =====================================================================

-- D1 [GAP] negative product value is accepted. [EXPECT 1 row, value -50.00]
START TRANSACTION;
INSERT INTO products (brand_id, user_id, product_name, value, currency)
VALUES ((SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rohan@test.com' AND b.brand_name = 'GlowCare'), (SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'TMP-D1', -50, 'INR');
SELECT product_name, value FROM products WHERE product_name = 'TMP-D1';
ROLLBACK;

-- D2 [GAP] RECEIVED without received_at. [EXPECT status RECEIVED, received_at NULL]
START TRANSACTION;
UPDATE shipments SET status = 'RECEIVED', received_at = NULL WHERE shipment_code = 'SHP-002';
SELECT shipment_code, status, received_at FROM shipments WHERE shipment_code = 'SHP-002';
ROLLBACK;

-- D3 [GAP] shipment owned by another user than its product. [EXPECT shipment_owner <> product_owner]
START TRANSACTION;
INSERT INTO products (brand_id, user_id, product_name, value, currency)
VALUES ((SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rohan@test.com' AND b.brand_name = 'GlowCare'), (SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'TMP-D3', 10, 'INR');
INSERT INTO shipments (shipment_code, brand_id, product_id, user_id, shipment_date, status)
SELECT 'SHP-D3', brand_id, product_id, (SELECT user_id FROM users WHERE email = 'rahul@test.com'), CURRENT_DATE(), 'SHIPPED'
FROM products WHERE product_name = 'TMP-D3';
SELECT s.shipment_code, s.user_id AS shipment_owner, p.user_id AS product_owner
FROM shipments s JOIN products p ON p.product_id = s.product_id WHERE s.shipment_code = 'SHP-D3';
ROLLBACK;

-- D4 [GAP] audit row with old_status = new_status. [EXPECT 1 row]
START TRANSACTION;
INSERT INTO audit_logs (user_id, shipment_id, old_status, new_status)
VALUES ((SELECT user_id FROM users WHERE email = 'rohan@test.com'), (SELECT shipment_id FROM shipments WHERE shipment_code = 'SHP-001'), 'SHIPPED', 'SHIPPED');
SELECT audit_log_id, old_status, new_status FROM audit_logs WHERE old_status = new_status;
ROLLBACK;

-- D5 [GAP] invalid email format. [EXPECT 1 row]
START TRANSACTION;
INSERT INTO users (full_name, email, password_hash) VALUES ('Bad Email', 'not-an-email', 'x');
SELECT email FROM users WHERE email = 'not-an-email';
ROLLBACK;

-- D6 [GAP] received date before shipped date. [EXPECT received_at 2000-01-01 earlier than shipment_date]
START TRANSACTION;
UPDATE shipments SET status = 'RECEIVED', received_at = '2000-01-01 00:00:00' WHERE shipment_code = 'SHP-002';
SELECT shipment_code, shipment_date, received_at FROM shipments WHERE shipment_code = 'SHP-002';
ROLLBACK;

-- D7 [GAP] no automatic audit row on status change (TiDB has no triggers).
-- [EXPECT audit_before = audit_after]
START TRANSACTION;
SELECT COUNT(*) AS audit_before FROM audit_logs WHERE shipment_id = (SELECT shipment_id FROM shipments WHERE shipment_code = 'SHP-002');
UPDATE shipments SET status = 'RECEIVED', received_at = NOW() WHERE shipment_code = 'SHP-002';
SELECT COUNT(*) AS audit_after FROM audit_logs WHERE shipment_id = (SELECT shipment_id FROM shipments WHERE shipment_code = 'SHP-002');
ROLLBACK;

-- D8 (normal behavior) several users with NULL google_id and NULL password are allowed.
-- [EXPECT should_be_2 = 2]
START TRANSACTION;
INSERT INTO users (full_name, email, google_id, password_hash) VALUES ('N1', 'n1@test.com', NULL, NULL);
INSERT INTO users (full_name, email, google_id, password_hash) VALUES ('N2', 'n2@test.com', NULL, NULL);
SELECT COUNT(*) AS should_be_2 FROM users WHERE email IN ('n1@test.com', 'n2@test.com');
ROLLBACK;

-- D9 [GAP] shipment brand_id different from its product's brand. [EXPECT shipment_brand <> product_brand]
START TRANSACTION;
INSERT INTO products (brand_id, user_id, product_name, value, currency)
VALUES ((SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rohan@test.com' AND b.brand_name = 'GlowCare'), (SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'TMP-D9', 10, 'INR');
INSERT INTO shipments (shipment_code, brand_id, product_id, user_id, shipment_date, status)
SELECT 'SHP-D9', (SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rahul@test.com' AND b.brand_name = 'FitLife'), product_id, user_id, CURRENT_DATE(), 'SHIPPED'
FROM products WHERE product_name = 'TMP-D9';
SELECT s.shipment_code, s.brand_id AS shipment_brand, p.brand_id AS product_brand
FROM shipments s JOIN products p ON p.product_id = s.product_id WHERE s.shipment_code = 'SHP-D9';
ROLLBACK;

-- =====================================================================
-- E. CASCADE TESTS (rolled back). Totals are compared because the deleted
--    row's id can no longer be looked up after the delete.
-- =====================================================================

-- E1 deleting user rohan removes everything he owns
-- [EXPECT before: users 2, brands 2, products 203, shipments 203, deadlines 203, audit 300]
-- [EXPECT after:  users 1, brands 1, products 101, shipments 101, deadlines 101, audit 100]
-- [EXPECT after rollback: products 203]
START TRANSACTION;
SELECT (SELECT COUNT(*) FROM users) AS users_before, (SELECT COUNT(*) FROM brands) AS brands_before,
       (SELECT COUNT(*) FROM products) AS products_before, (SELECT COUNT(*) FROM shipments) AS shipments_before,
       (SELECT COUNT(*) FROM content_deadlines) AS deadlines_before, (SELECT COUNT(*) FROM audit_logs) AS audit_before;
DELETE FROM users WHERE email = 'rohan@test.com';
SELECT (SELECT COUNT(*) FROM users) AS users_after, (SELECT COUNT(*) FROM brands) AS brands_after,
       (SELECT COUNT(*) FROM products) AS products_after, (SELECT COUNT(*) FROM shipments) AS shipments_after,
       (SELECT COUNT(*) FROM content_deadlines) AS deadlines_after, (SELECT COUNT(*) FROM audit_logs) AS audit_after;
ROLLBACK;
SELECT COUNT(*) AS products_restored FROM products;

-- E2 deleting brand GlowCare removes its products and shipments
-- [EXPECT before: products 203, shipments 203]
-- [EXPECT after:  products 101, shipments 101, glowcare_left 0]
START TRANSACTION;
SELECT (SELECT COUNT(*) FROM products) AS products_before, (SELECT COUNT(*) FROM shipments) AS shipments_before;
DELETE FROM brands WHERE brand_name = 'GlowCare' AND user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com');
SELECT (SELECT COUNT(*) FROM products) AS products_after, (SELECT COUNT(*) FROM shipments) AS shipments_after,
       (SELECT COUNT(*) FROM brands WHERE brand_name = 'GlowCare') AS glowcare_left;
ROLLBACK;

-- E3 deleting shipment SHIP-S0002 removes its deadline and audit rows; the product stays
-- [EXPECT before: shipments 203, deadlines 203, audit 300, products 203]
-- [EXPECT after:  shipments 202, deadlines 202, audit 298, products 203]
START TRANSACTION;
SELECT (SELECT COUNT(*) FROM shipments) AS shipments_before, (SELECT COUNT(*) FROM content_deadlines) AS deadlines_before,
       (SELECT COUNT(*) FROM audit_logs) AS audit_before, (SELECT COUNT(*) FROM products) AS products_before;
DELETE FROM shipments WHERE shipment_code = 'SHIP-S0002';
SELECT (SELECT COUNT(*) FROM shipments) AS shipments_after, (SELECT COUNT(*) FROM content_deadlines) AS deadlines_after,
       (SELECT COUNT(*) FROM audit_logs) AS audit_after, (SELECT COUNT(*) FROM products) AS products_after;
ROLLBACK;

-- E4 ON UPDATE CASCADE: changing a user id updates the children
-- [EXPECT brands_moved 1, shipments_moved 101, orphan_shipments 0]
START TRANSACTION;
UPDATE users SET user_id = 5000000 WHERE email = 'rahul@test.com';
SELECT (SELECT COUNT(*) FROM brands WHERE user_id = 5000000) AS brands_moved,
       (SELECT COUNT(*) FROM shipments WHERE user_id = 5000000) AS shipments_moved,
       (SELECT COUNT(*) FROM shipments s LEFT JOIN users u ON u.user_id = s.user_id
         WHERE u.user_id IS NULL) AS orphan_shipments;
ROLLBACK;

-- =====================================================================
-- F. FUNCTIONAL TESTS (queries the app uses)
-- =====================================================================

-- F1 [EXPECT 10 rows] full relationship chain
SELECT u.full_name, b.brand_name, p.product_name, s.shipment_code, s.status, cd.platform, cd.due_date
FROM users u
JOIN brands b ON b.user_id = u.user_id
JOIN products p ON p.brand_id = b.brand_id
JOIN shipments s ON s.product_id = p.product_id
JOIN content_deadlines cd ON cd.shipment_id = s.shipment_id
LIMIT 10;

-- F2 [EXPECT 0 rows] rohan must never see another user's product
SELECT s.shipment_id FROM shipments s
JOIN products p ON p.product_id = s.product_id
WHERE s.user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com') AND p.user_id <> (SELECT user_id FROM users WHERE email = 'rohan@test.com');

-- F3 [EXPECT rohan: RECEIVED 101, SHIPPED 1; rahul: SHIPPED 101] shipment counts per user
SELECT u.email, s.status, COUNT(*) AS total
FROM shipments s JOIN users u ON u.user_id = s.user_id
GROUP BY u.email, s.status ORDER BY u.email, s.status;

-- F4 [varies by date] overdue content for rohan
SELECT deadline_id, content_title, platform, due_date FROM content_deadlines
WHERE user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com') AND completed_at IS NULL AND due_date < CURRENT_DATE() ORDER BY due_date;

-- F5 [varies by date] due in the next 7 days
SELECT deadline_id, content_title, platform, due_date FROM content_deadlines
WHERE user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com') AND completed_at IS NULL
  AND due_date BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY)
ORDER BY due_date;

-- F6 received shipments whose content is still not done
SELECT s.shipment_code, s.received_at, cd.platform, cd.due_date
FROM shipments s JOIN content_deadlines cd ON cd.shipment_id = s.shipment_id
WHERE s.user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com') AND s.status = 'RECEIVED' AND cd.completed_at IS NULL;

-- F7 [EXPECT GlowCare, 102 products, total_value 21498.00]
SELECT b.brand_name, COUNT(*) AS products, SUM(p.value) AS total_value
FROM products p JOIN brands b ON b.brand_id = p.brand_id
WHERE p.user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com') GROUP BY b.brand_id, b.brand_name;

-- F8 [EXPECT 2 rows: NULL->SHIPPED, SHIPPED->RECEIVED]
SELECT a.old_status, a.new_status, a.created_at, u.full_name AS changed_by
FROM audit_logs a JOIN users u ON u.user_id = a.user_id
WHERE a.shipment_id = (SELECT shipment_id FROM shipments WHERE shipment_code = 'SHIP-S0002') ORDER BY a.created_at;

-- F9 [EXPECT 0 rows] every seed RECEIVED shipment has a RECEIVED audit row
SELECT s.shipment_id, s.shipment_code FROM shipments s
LEFT JOIN audit_logs a ON a.shipment_id = s.shipment_id AND a.new_status = 'RECEIVED'
WHERE s.status = 'RECEIVED' AND s.shipment_code LIKE 'SHIP-S%' AND a.audit_log_id IS NULL;

-- F10 [EXPECT the second updated_at is later than the first]
START TRANSACTION;
SELECT brand_id, updated_at FROM brands WHERE brand_name = 'GlowCare' AND user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com');
SELECT SLEEP(2);
UPDATE brands SET description = 'Skincare (edited)' WHERE brand_name = 'GlowCare' AND user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com');
SELECT brand_id, updated_at FROM brands WHERE brand_name = 'GlowCare' AND user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com');
ROLLBACK;

-- F11 [EXPECT should_be_0 = 0] rolled back insert leaves nothing behind
START TRANSACTION;
INSERT INTO products (brand_id, user_id, product_name, value, currency)
VALUES ((SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rohan@test.com' AND b.brand_name = 'GlowCare'), (SELECT user_id FROM users WHERE email = 'rohan@test.com'), 'TMP-F11', 10, 'INR');
ROLLBACK;
SELECT COUNT(*) AS should_be_0 FROM products WHERE product_name = 'TMP-F11';

-- =====================================================================
-- G. PERFORMANCE   (look for IndexRangeScan / Point_Get, not TableFullScan.
--                   On tiny tables TiDB may still choose a full scan, that is OK.)
-- =====================================================================

-- G0 refresh statistics (run once before G1-G7)
ANALYZE TABLE users, brands, products, shipments, content_deadlines, audit_logs;

-- G1 [EXPECT idx_deadlines_user_done_due, no Sort]
EXPLAIN ANALYZE SELECT * FROM content_deadlines
WHERE user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com') AND completed_at IS NULL AND due_date < CURRENT_DATE() ORDER BY due_date;

-- G2 [EXPECT idx_shipments_user_status]
EXPLAIN ANALYZE SELECT COUNT(*) FROM shipments WHERE user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com') AND status = 'SHIPPED';

-- G3 [EXPECT idx_products_user_brand]
EXPLAIN ANALYZE SELECT * FROM products WHERE user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com') AND brand_id = (SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rohan@test.com' AND b.brand_name = 'GlowCare');

-- G4 [EXPECT idx_audit_shipment_created, no Sort]
EXPLAIN ANALYZE SELECT * FROM audit_logs WHERE shipment_id = (SELECT shipment_id FROM shipments WHERE shipment_code = 'SHIP-S0002') ORDER BY created_at;

-- G5 [EXPECT Point_Get on uk_shipments_user_code]
EXPLAIN ANALYZE SELECT * FROM shipments WHERE user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com') AND shipment_code = 'SHP-001';

-- G6 [EXPECT Point_Get on the email unique key]
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'rohan@test.com';

-- G7 [EXPECT Point_Get on uk_users_google_id, 0 rows]
EXPLAIN ANALYZE SELECT * FROM users WHERE google_id = 'abc';

-- =====================================================================
-- H. LOAD TEST (1000 temporary products, cleaned up at the end)
-- =====================================================================

-- H1 [EXPECT 1000 rows affected]
INSERT INTO products (brand_id, user_id, product_name, value, currency, description)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n < 1000)
SELECT IF(n % 2 = 0, (SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rohan@test.com' AND b.brand_name = 'GlowCare'), (SELECT b.brand_id FROM brands b JOIN users u ON u.user_id = b.user_id WHERE u.email = 'rahul@test.com' AND b.brand_name = 'FitLife')), IF(n % 2 = 0, (SELECT user_id FROM users WHERE email = 'rohan@test.com'), (SELECT user_id FROM users WHERE email = 'rahul@test.com')),
       CONCAT('LOAD-', n), 10 + n % 500, 'INR', 'load test'
FROM seq;

-- H2 [EXPECT GlowCare, 602 products, total 150998.00] compare timing with before
EXPLAIN ANALYZE SELECT b.brand_name, COUNT(*), SUM(p.value)
FROM products p JOIN brands b ON b.brand_id = p.brand_id
WHERE p.user_id = (SELECT user_id FROM users WHERE email = 'rohan@test.com') GROUP BY b.brand_id, b.brand_name;

-- H3 cleanup. [EXPECT products_after_cleanup 203, leftover_temp 0]
DELETE FROM products WHERE product_name LIKE 'LOAD-%';
SELECT COUNT(*) AS products_after_cleanup FROM products;
SELECT COUNT(*) AS leftover_temp FROM products
WHERE product_name LIKE 'TMP-%' OR product_name LIKE 'LOAD-%' OR product_name LIKE 'T-_';

-- =====================================================================
-- END OF TESTS
-- =====================================================================