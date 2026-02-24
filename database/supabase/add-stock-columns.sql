-- ============================================================
-- Migration: Add Big Stock / Small Stock columns to dailystockreports
-- Run this on your LIVE Supabase database (SQL Editor)
-- ============================================================

-- Add new columns (safe: IF NOT EXISTS-style via DO block)
DO $$
BEGIN
  -- Big Stock columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dailystockreports' AND column_name = 'big_opening') THEN
    ALTER TABLE dailystockreports ADD COLUMN big_opening INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dailystockreports' AND column_name = 'big_purchase_in') THEN
    ALTER TABLE dailystockreports ADD COLUMN big_purchase_in INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dailystockreports' AND column_name = 'big_move_out') THEN
    ALTER TABLE dailystockreports ADD COLUMN big_move_out INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dailystockreports' AND column_name = 'big_remaining') THEN
    ALTER TABLE dailystockreports ADD COLUMN big_remaining INTEGER DEFAULT 0;
  END IF;

  -- Small Stock columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dailystockreports' AND column_name = 'small_opening') THEN
    ALTER TABLE dailystockreports ADD COLUMN small_opening INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dailystockreports' AND column_name = 'small_move_in') THEN
    ALTER TABLE dailystockreports ADD COLUMN small_move_in INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dailystockreports' AND column_name = 'small_sell_out') THEN
    ALTER TABLE dailystockreports ADD COLUMN small_sell_out INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dailystockreports' AND column_name = 'small_closing') THEN
    ALTER TABLE dailystockreports ADD COLUMN small_closing INTEGER DEFAULT 0;
  END IF;
END
$$;

-- Add the 6 new products (skip if SKU already exists)
INSERT INTO products (sku, product_name, description, cost_price, selling_price, supplier_id, safety_stock, reorder_quantity, min_stock_level, current_stock, is_active)
VALUES
  ('A011', 'ABC Singapore',          '330ml * 24c', 16.00, 60.00, 1, 10, 30, 20, 5, true),
  ('A012', 'Hanuman White',          '330ml * 24c', 13.00, 55.00, 3, 10, 30, 20, 8, true),
  ('A013', 'Hanuman Black',          '330ml * 24c', 14.00, 58.00, 3, 10, 30, 20, 6, true),
  ('A014', 'Vattanac Premier Light', '330ml * 24c', 17.00, 62.00, 5, 12, 30, 25, 10, true),
  ('A015', 'ABC (Bottle)',           '325ml * 24B', 22.00, 65.00, 1, 10, 30, 20, 5, true),
  ('A016', 'Ganzberg Snow White',    '330ml * 24c', 15.00, 58.00, 2, 10, 30, 20, 7, true)
ON CONFLICT (sku) DO NOTHING;

-- Rename product with SKU A004 if it still has the old name
UPDATE products SET product_name = 'Anchor Beer (325ml)' WHERE sku = 'A004' AND product_name = 'Anchor Beer (Bottle)';

-- Backfill existing rows: copy legacy values into new columns where they are still 0
UPDATE dailystockreports
SET
  big_opening    = COALESCE(opening_stock, 0),
  big_remaining  = COALESCE(closing_stock, 0),
  small_closing  = COALESCE(closing_stock, 0)
WHERE big_opening = 0 AND big_remaining = 0 AND small_closing = 0;

SELECT 'Migration complete – 8 new columns added, 6 new products inserted.' AS result;
