-- Supabase RPC Functions for Stock Management
-- Run this in Supabase SQL Editor

-- Function to increment product stock
CREATE OR REPLACE FUNCTION increment_stock(p_product_id INTEGER, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET current_stock = current_stock + p_quantity,
      updated_at = NOW()
  WHERE product_id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement product stock
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id INTEGER, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET current_stock = current_stock - p_quantity,
      updated_at = NOW()
  WHERE product_id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION increment_stock TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_stock TO authenticated;

-- Also grant to anon role for public API access
GRANT EXECUTE ON FUNCTION increment_stock TO anon;
GRANT EXECUTE ON FUNCTION decrement_stock TO anon;
