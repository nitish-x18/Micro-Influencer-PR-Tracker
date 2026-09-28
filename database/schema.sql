-- 1.Create the database if it does not already exist --
CREATE DATABASE IF NOT EXISTS pr_tracker;

-- Select the pr_tracker database so all following commands
-- are executed inside this databse
USE pr_tracker;

-- Check which tables currently exist
SHOW TABLES;

-- Check the structure(columns,data types,keys,etc) of each table.
DESCRIBE users;
DESCRIBE influencers;
DESCRIBE packages;
DESCRIBE content_deadlines;

-- 2. CHECK TABLE STRUCTURE --
-- Show the complete CREATE TABLE statement for packages and content_deadlines.
-- This helps verify columns,keys,defaults and constraints.
USE pr_tracker;
SHOW CREATE TABLE packages;
SHOW CREATE TABLE content_deadlines;

-- 3.CHECK FOREIGN KEY RELATIONSHIP --
-- Find all foreign keys inside the pr_tracker database.
-- This tells us which table/column references another table.
USE pr_tracker;
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'pr_tracker'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
  
-- 4.CHECK UNIQUE CONTRAINTS --
--Check UNIQUE constraints in users and influencers.
  USE pr_tracker;
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    CONSTRAINT_TYPE
FROM information_schema.KEY_COLUMN_USAGE
JOIN information_schema.TABLE_CONSTRAINTS
USING (CONSTRAINT_NAME, TABLE_SCHEMA, TABLE_NAME)
WHERE TABLE_SCHEMA = 'pr_tracker'
  AND TABLE_NAME IN ('users', 'influencers')
  AND CONSTRAINT_TYPE = 'UNIQUE';

-- Specifically check whether instagram_handle
-- Has a UNIQUE constraint.
USE pr_tracker;
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    CONSTRAINT_TYPE
FROM information_schema.KEY_COLUMN_USAGE
JOIN information_schema.TABLE_CONSTRAINTS
USING (CONSTRAINT_NAME, TABLE_SCHEMA, TABLE_NAME)
WHERE TABLE_SCHEMA = 'pr_tracker'
  AND TABLE_NAME = 'influencers'
  AND COLUMN_NAME = 'instagram_handle'
  AND CONSTRAINT_TYPE = 'UNIQUE';

 -- Add a UNIQUE constraint to instagram_handle.
 -- this prevents ywo influencers from having.
 -- the same Instagram handle.
USE pr_tracker;
ALTER TABLE influencers
ADD CONSTRAINT unique_instagram_handle
UNIQUE (instagram_handle);

-- 5.CHECK INDEXES --
--Check indexes on the influencers table.
USE pr_tracker;
SHOW INDEX FROM influencers;

-- Check indexes on the packages table.
USE pr_tracker;
SHOW INDEX FROM packages;

-- check indexes on the content_deadlines table.
USE pr_tracker;
SHOW INDEX FROM content_deadlines;

-- 6. CHECK USERS TABLE AND INSERT TEST USER --
-- Display all existing users.
USE pr_tracker;
SELECT* FROM users;

-- Check the structure of the users table.
USE pr_tracker;
DESCRIBE users;

-- Insert temporary test data to verify that the users table accepts valid data.
USE pr_tracker;
INSERT INTO users (name, email, password_hash, role)
VALUES ('Test User', 'test@example.com', 'test123', 'brand');
-- Verify that the test user was inserted.
SELECT* FROM users;

-- 7.CHECK INFLUENCERS TABLE AND INSERT TEST DATA --
-- Check the structure of the influencers table.
USE pr_tracker;
DESCRIBE influencers;

-- Insert a test influencer.
-- This is only test data to verify that the table works.
USE pr_tracker;
INSERT INTO influencers
(name, instagram_handle, email, follower_count, niche)
VALUES
('Test Influencer', '@test_influencer', 'influencer@example.com', 10000, 'Fashion');
-- Verify the inserted influencer.
SELECT* FROM influencers;

-- 8.INSERT TEST PACKAGE --
-- Insert a test package connected to influencer_id=1
-- NULL means the product has not yet been shipped or delivered
USE pr_tracker;
INSERT INTO packages
(influencer_id, product_name, product_value, status, shipped_date, delivery_date)
VALUES
(1, 'Test Product', 5000, 'Preparing', NULL, NULL);
-- Verify the packages.
SELECT* FROM packages;

-- 9.INSERT TEST CONTENT DEADLINES --
-- Insert a deadline connected to pacakge_id=1.
-- Completed = 0 means the content is not completed.
USE pr_tracker;
INSERT INTO content_deadlines
(package_id, platform, due_date, completed)
VALUES
(1, 'Instagram', '2026-10-05', 0);
-- Verify the inserted deadline.
SELECT* FROM content_deadlines;

-- 10.TEST TABLE RELATIONSHIPS USING JOIN --
-- Join influencers,packages and content_deadlines.
-- This verifies that:
-- influencers->packages->content_deadlines are correctly connected through forign keys.
USE pr_tracker;
SELECT
    i.name AS influencer_name,
    p.product_name,
    p.status,
    c.platform,
    c.due_date,
    c.completed
FROM influencers i
JOIN packages p
    ON i.influencer_id = p.influencer_id
JOIN content_deadlines c
    ON p.package_id = c.package_id;

-- 11.CHECK DATA FIELD --
-- Check the structure of content_deadlines.
USE pr_tracker;
DESCRIBE content_deadlines;    

-- Display the original date and formatted version.
-- DATE_FORMAT makes the date easier to read in SQLTools.
SELECT due_date, DATE_FORMAT(due_date, '%Y-%m-%d') AS formatted_date
FROM content_deadlines;

-- 12.CHECK FOR DUPLICATED INSTAGRAM HANDLES --
-- Find duplicate Instagram handles.
-- Ideally this query should return no rows.
USE pr_tracker;
SELECT instagram_handle, COUNT(*) AS count 
FROM influencers 
WHERE instagram_handle IS NOT NULL 
GROUP BY instagram_handle 
HAVING count > 1;

-- Check whether any influencer has a NULL name or NULL instagram handle.
SELECT * FROM influencers 
WHERE name IS NULL OR instagram_handle IS NULL;

-- 13.MAKE  IMPORTANT INFLUENCER FIELDS NOT NULL--
ALTER TABLE influencers
MODIFY name VARCHAR(100) NOT NULL;
-- Check all constraints cuurently present.
SELECT TABLE_NAME, CONSTRAINT_NAME, CONSTRAINT_TYPE
FROM information_schema.TABLE_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = 'pr_tracker'
ORDER BY TABLE_NAME;

-- Check CHECK constraints in the database.
SELECT CONSTRAINT_NAME, CHECK_CLAUSE
FROM information_schema.CHECK_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = 'pr_tracker';

-- Make influencer has NULL email.
SELECT *
FROM influencers
WHERE email IS NULL;

-- Make influencer email mandatory.
ALTER TABLE influencers
MODIFY COLUMN email VARCHAR(150)
NOT NULL;

-- Check the influencers table after modifications.
DESCRIBE influencers;

-- make follower count mandatory.
ALTER TABLE influencers
MODIFY COLUMN follower_count INT
NOT NULL;

-- Make nuche mandatory.
ALTER TABLE influencers
MODIFY COLUMN niche VARCHAR(100)
NOT NULL;

-- 14.ADD FOLLOWER COUNT VALIDATION --
-- Followers cannot be negative.
ALTER TABLE influencers
ADD CONSTRAINT chk_follower_count
CHECK (follower_count >= 0);

-- Try inserting an invalid follower count.
-- This should FAIL because FAIL because -10 is not allowed.
INSERT INTO influencers
(name, instagram_handle, email, follower_count, niche)
VALUES
('Validation Test', '@validation_test', 'validation@test.com', -10, 'Test');

-- Check influencer data.
USE pr_tracker;
SELECT * FROM influencers;

-- 15. PACKAGE TABLE VALIDATION
-- Check the package table structure.
USE pr_tracker;
DESCRIBE packages;

-- Fix NULL product_values first (required before NOT NULL)
-- Repace NULL product values with 0 before, making the column NOT NULL.
UPDATE packages SET product_value = 0.00 WHERE product_value IS NULL;

-- 1. product_value: NOT NULL + can't be negative
-- Product value is required and cannot be negative ,default value for a new package is 0.00
ALTER TABLE packages
MODIFY product_value DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Add validation so product value cannot be negative.
ALTER TABLE packages
ADD CONSTRAINT chk_product_value CHECK (product_value >= 0);

-- 2. status: NOT NULL (default 'preparing' already handles new rows)
-- Satus is required only these three statuses are allowed.
ALTER TABLE packages
MODIFY status ENUM('preparing','shipped','delivered') NOT NULL DEFAULT 'preparing';

-- 3. Optional but impressive: delivery can't happen before shipping
-- Delivery date cannot be earlier than shipping date.COMMENT-- NULL is allowed because a package may not yet have been shipped or delivered.
ALTER TABLE packages
ADD CONSTRAINT chk_delivery_dates CHECK (delivery_date IS NULL OR shipped_date IS NULL OR delivery_date >= shipped_date);
-- Check the final package structure
DESCRIBE packages;

--Note
-- The following command may give a duplicate constraints
-- error if chek_product_value already exists.
-- It was already added above ,so it is not necessary to run this again.
SELECT *
FROM packages
WHERE product_value < 0;
ALTER TABLE packages
ADD CONSTRAINT chk_product_value
CHECK (product_value >= 0);

-- Display the complete packages table definition.
USE pr_tracker;
SHOW CREATE TABLE packages;

-- display all CHECK constraints.
SELECT
    CONSTRAINT_NAME,
    CHECK_CLAUSE
FROM information_schema.CHECK_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = 'pr_tracker';

-- Check the structure of the content_deadlines.
USE pr_tracker;
DESCRIBE content_deadlines;

-- completed is stored as BOOLEAN.
-- FALSE/0 means incomplete
-- TRUR/1 means completed
-- Default is FALSE
ALTER TABLE content_deadlines
MODIFY COLUMN completed BOOLEAN NOT NULL DEFAULT FALSE;

--Automatically record when a deadline row is created.
ALTER TABLE content_deadlines
MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 17.FINAL INDEX CHECK --
-- Check indexes on every important table.
SHOW INDEX FROM users;
SHOW INDEX FROM influencers;
SHOW INDEX FROM packages;
SHOW INDEX FROM content_deadlines;

-- 18.QUERY: FIND INCOMPLETE CONTENT DEADLINES. --
-- Find all incomplete deadlines
-- Results are sorted by the nearest due date first.
SELECT d.platform, d.due_date, d.completed, p.product_name, i.name AS influencer
FROM content_deadlines d
JOIN packages p ON d.package_id = p.package_id
JOIN influencers i ON p.influencer_id = i.influencer_id
WHERE d.completed = 0
ORDER BY d.due_date ASC;

-- 19.QUERY: INFLUENCER -> PACKAGE --
-- Show which package belongs to which influencer.
USE pr_tracker;
SELECT
    i.influencer_id,
    i.name AS influencer_name,
    i.instagram_handle,
    p.package_id,
    p.product_name,
    p.product_value,
    p.status
FROM influencers i
JOIN packages p
    ON i.influencer_id = p.influencer_id;

-- 20.QUERY: PACKAGE -> DEADLINE --
-- Show which deadline belongs to which package.
SELECT
    p.package_id,
    p.product_name,
    p.status,
    d.deadline_id,
    d.platform,
    DATE_FORMAT(d.due_date, '%Y-%m-%d') AS due_date,
    d.completed
FROM packages p
JOIN content_deadlines d
    ON p.package_id = d.package_id;    

-- 21.QUERY: FIND PENDING/PREPARING PACKAGES --
-- FIND packages that are still being prepared/pending.
SELECT *
FROM packages
WHERE status IN ('Pending', 'preparing');   

-- 22.QUERY: FIND INCOMPLETE DEADLINES --
-- Show deadlines that have not been completed.
SELECT
    deadline_id,
    package_id,
    platform,
    DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date
FROM content_deadlines
WHERE completed = 0;

-- 23.COMPLETE PR TRACKER REPORT --
--Combine all three main tables:
--Influencers
--    |
--Package
--    |
--Content Deadline
-- This is an end-to-end test of the database relationship.
SELECT
    i.name AS influencer_name,
    i.instagram_handle,
    p.product_name,
    p.product_value,
    p.status AS package_status,
    d.platform,
    DATE_FORMAT(d.due_date, '%Y-%m-%d') AS due_date,
    d.completed
FROM influencers i
JOIN packages p
    ON i.influencer_id = p.influencer_id
JOIN content_deadlines d
    ON p.package_id = d.package_id;

--24.TEST FOREIGN KEY: INVALID INFLUENCER --
--Try inserting a package for influencer_id=9999.
--Since influencer 9999 doesnot exist, this should fail.
--This confirms that the foreign key is working.

INSERT INTO packages
(influencer_id, product_name, product_value, status)
VALUES
(9999, 'Invalid Test Product', 1000, 'preparing'); 

--25.TEST FOREIGN KEY: INVALID PACKAGE --
--Try inserting a deadline for package_id=999
--since package 9999 does not exist,this shouls fail.
USE pr_tracker;
INSERT INTO content_deadlines
(package_id, platform, due_date, completed)
VALUES
(9999, 'Instagram', '2026-10-10', 0);

--26.TEST UPDATE OPERATION --
--Change package 1 status to shipped.
USE pr_tracker;
UPDATE packages
SET status = 'shipped'
WHERE package_id = 1;

--Verify the UPDATE
SELECT
    package_id,
    product_name,
    status
FROM packages
WHERE package_id = 1;

-- 27.CHECK PACKAGE-DEADLINE RELATIONSHIP --
--Check whether package 1 has a deadline attached.
SELECT *
FROM content_deadlines
WHERE package_id= 1;

-- Display the deadline using a readable date format.
SELECT
    deadline_id,
    package_id,
    platform,
    DATE_FORMAT(due_date, '%Y-%m-%d') AS readable_due_date,
    completed
FROM content_deadlines
WHERE package_id = 1;

-- 28.TEST DELETE OPERATION --
--Create a temporary package specifically for DELETE testing.
--This package has no deadline attached to it.
INSERT INTO packages
(influencer_id, product_name, product_value, status)
VALUES
(1, 'Delete Test Product', 1000, 'preparing');

--Find the temporary package and its automatically generated ID.
SELECT *
FROM packages
WHERE product_name = 'Delete Test Product';

--Delte the temporary test package.
--In our test this was package_id = 3
USE pr_tracker;
DELETE FROM packages
WHERE package_id = 3;

-- 29.VERIFY DELETE --
--Verify that package 3 no longer exists.
--IMPORTANT
--The original query had a typo:
--package_id
--package_id
USE pr_tracker;
SELECT *
FROM packages
WHERE pacakge_id =3;

--30.CHECK FINAL PACKAGE TABLE --
--Display the final package table structure.
USE pr_tracker;
DESCRIBE packages;
USE pr_tracker;
SELECT * FROM packages;

--31.FINAL TABLE CHECK --
--Confirm that all four required tables exist.
USE pr_tracker;
SHOW TABLES;

--32.FINAL FOREIGN KEY CHECK
--Display all foreign key relationship in the database.
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'pr_tracker'
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Expected relationships:
--
-- packages.influencer_id
--       ↓
-- influencers.influencer_id
--
-- content_deadlines.package_id
--       ↓
-- packages.package_id

-- 33.FINAL CONSTRAINT CHECK
--Display all table-level constraints.
--This is the final verification that primary keys,unique constraints,foreign keys and other constraints are presnet.
SELECT
    TABLE_NAME,
    CONSTRAINT_NAME,
    CONSTRAINT_TYPE
FROM information_schema.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = 'pr_tracker'
ORDER BY TABLE_NAME, CONSTRAINT_TYPE;  