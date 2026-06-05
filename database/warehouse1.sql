-- sửa file warehouse_data_standard.sql nếu db oder chưa đúng 
BEGIN;

-- =====================================
-- IMPORTS
-- =====================================

-- APPROVED + DONE = 100%
UPDATE import_items
SET scanned_quantity = quantity
WHERE import_id BETWEEN 1 AND 10;

-- PROCESSING = 40% - 80%
UPDATE import_items
SET scanned_quantity =
CASE
    WHEN MOD(id,5) = 0 THEN ROUND(quantity * 0.4)
    WHEN MOD(id,5) = 1 THEN ROUND(quantity * 0.5)
    WHEN MOD(id,5) = 2 THEN ROUND(quantity * 0.6)
    WHEN MOD(id,5) = 3 THEN ROUND(quantity * 0.7)
    ELSE ROUND(quantity * 0.8)
END
WHERE import_id BETWEEN 11 AND 15;

-- PENDING = 0%
UPDATE import_items
SET scanned_quantity = 0
WHERE import_id BETWEEN 16 AND 20;

-- CANCELLED
UPDATE import_items
SET scanned_quantity = 0
WHERE import_id IN (21,22);

UPDATE import_items
SET scanned_quantity = ROUND(quantity * 0.3)
WHERE import_id = 23;

UPDATE import_items
SET scanned_quantity = ROUND(quantity * 0.5)
WHERE import_id = 24;

UPDATE import_items
SET scanned_quantity = ROUND(quantity * 0.7)
WHERE import_id = 25;


-- =====================================
-- EXPORTS
-- =====================================

-- APPROVED + DONE = 100%
UPDATE export_items
SET scanned_quantity = quantity
WHERE export_id BETWEEN 1 AND 10;

-- PROCESSING = 40% - 80%
UPDATE export_items
SET scanned_quantity =
CASE
    WHEN MOD(id,5) = 0 THEN ROUND(quantity * 0.4)
    WHEN MOD(id,5) = 1 THEN ROUND(quantity * 0.5)
    WHEN MOD(id,5) = 2 THEN ROUND(quantity * 0.6)
    WHEN MOD(id,5) = 3 THEN ROUND(quantity * 0.7)
    ELSE ROUND(quantity * 0.8)
END
WHERE export_id BETWEEN 11 AND 15;

-- PENDING = 0%
UPDATE export_items
SET scanned_quantity = 0
WHERE export_id BETWEEN 16 AND 20;

-- CANCELLED
UPDATE export_items
SET scanned_quantity = 0
WHERE export_id IN (21,22);

UPDATE export_items
SET scanned_quantity = ROUND(quantity * 0.3)
WHERE export_id = 23;

UPDATE export_items
SET scanned_quantity = ROUND(quantity * 0.5)
WHERE export_id = 24;

UPDATE export_items
SET scanned_quantity = ROUND(quantity * 0.7)
WHERE export_id = 25;

COMMIT;