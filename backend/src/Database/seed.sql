-- InfluenceFlow sample data
-- CLEAN TEST DATABASE ONLY
USE microinfluencer_db;

INSERT INTO users
(full_name, email, password_hash)
VALUES
('Rohan Sharma', 'rohan@test.com', 'test_hash_placeholder_123'),
('Rahul Kumar', 'rahul@test.com', 'test_hash_placeholder_456');

INSERT INTO brands
(user_id, brand_name, description, website, logo_url)
VALUES
(1, 'GlowCare', 'Skincare and beauty products',
 'https://glowcare.example.com',
 'https://glowcare.example.com/logo.png'),
(2, 'FitLife', 'Fitness and wellness products',
 'https://fitlife.example.com',
 'https://fitlife.example.com/logo.png');

INSERT INTO products
(brand_id, user_id, product_name, value, currency, description)
VALUES
(1, 1, 'Vitamin C Serum', 799.00, 'INR',
 'Vitamin C face serum'),
(1, 1, 'Hydrating Moisturizer', 599.00, 'INR',
 'Daily moisturizing cream'),
(2, 2, 'Protein Powder', 1499.00, 'INR',
 'Whey protein supplement');

INSERT INTO shipments
(shipment_code, brand_id, product_id, user_id,
 shipped_at, status, tracking_number, received_at)
VALUES
('SHIP-001', 1, 1, 1, '2026-09-20',
 'RECEIVED', 'TRK123456', '2026-09-23 14:30:00'),
('SHIP-002', 1, 2, 1, '2026-09-25',
 'SHIPPED', 'TRK789012', NULL),
('SHIP-003', 2, 3, 2, '2026-09-27',
 'SHIPPED', 'TRK345678', NULL);

INSERT INTO content_deadlines
(shipment_id, user_id, content_title, platform,
 due_date, status, notes, completed_at)
VALUES
(1, 1, 'Instagram serum post', 'Instagram',
 '2026-11-05', 'UPCOMING',
 'Create Instagram post for the serum', NULL),
(2, 1, 'Product review video', 'YouTube',
 '2026-11-10', 'UPCOMING',
 'Create product review video', NULL),
(3, 2, 'Short product video', 'Pinterest',
 '2026-11-08', 'UPCOMING',
 'Create short product video', NULL);

INSERT INTO audit_logs
(user_id, shipment_id, old_status, new_status)
VALUES
(1, 1, NULL, 'SHIPPED'),
(1, 1, 'SHIPPED', 'RECEIVED'),
(1, 2, NULL, 'SHIPPED'),
(2, 3, NULL, 'SHIPPED');