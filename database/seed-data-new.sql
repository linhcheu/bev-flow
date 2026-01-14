-- ==============================================
-- BEV Flow - Seed Data Based on Excel Data
-- Matches the supplier-product relationships from Excel
-- ==============================================

-- Clear existing data (in reverse order of dependencies)
TRUNCATE TABLE saleitems CASCADE;
TRUNCATE TABLE sales CASCADE;
TRUNCATE TABLE purchaseorderitems CASCADE;
TRUNCATE TABLE purchaseorders CASCADE;
TRUNCATE TABLE forecasts CASCADE;
TRUNCATE TABLE customers CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE suppliers CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reset sequences
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
ALTER SEQUENCE suppliers_supplier_id_seq RESTART WITH 1;
ALTER SEQUENCE products_product_id_seq RESTART WITH 1;
ALTER SEQUENCE customers_customer_id_seq RESTART WITH 1;
ALTER SEQUENCE purchaseorders_po_id_seq RESTART WITH 1;
ALTER SEQUENCE purchaseorderitems_item_id_seq RESTART WITH 1;
ALTER SEQUENCE sales_sale_id_seq RESTART WITH 1;
ALTER SEQUENCE saleitems_item_id_seq RESTART WITH 1;
ALTER SEQUENCE forecasts_forecast_id_seq RESTART WITH 1;

-- ==============================================
-- USERS
-- ==============================================
INSERT INTO users (username, email, password_hash, full_name, role, is_active, phone, location) VALUES
('admin', 'admin@bevflow.com', 'admin123', 'DEMOCRATICS', 'admin', true, '+855 23 456 789011', 'Phnom Penh, Cambodia'),
('manager', 'manager@bevflow.com', 'manager123', 'Store Manager', 'manager', true, NULL, NULL),
('staff', 'staff@bevflow.com', 'staff123', 'Staff User', 'user', true, NULL, NULL);

-- ==============================================
-- SUPPLIERS (Based on Excel data)
-- ==============================================
INSERT INTO suppliers (company_name, contact_person, sale_agent, phone, email, address, lead_time_days, is_active) VALUES
('Depo Bou Yong', 'Sopheak', 'Sopheak', '011 946 889', 'bouyongdepo@gmail.com', 'Mao Tse Toung, Phnom Penh', 2, true),
('Depo Mean Mean', 'Rotha', 'Rotha', '078 467 369', 'meanmeandepo9@gmail.com', 'Takhmao, Kandal', 1, true),
('Depo AMK', 'Socheat', 'Socheat', '012 967 039', 'depo-amk@gmail.com', 'Takdol, Kandal', 1, true),
('Jae Ka Beer Depo', 'Nimol', 'Nimol', '096 057 417', 'kakabeer88@gmail.com', 'Daun Penh, Phnom Penh', 2, true),
('Mesa Saang Beer Depo', 'Bopha', 'Bopha', '090 245 966', 'saang-mesabeer@gmail.com', 'Saang, Kandal', 3, true);

-- ==============================================
-- PRODUCTS (Based on Excel data - each product linked to correct supplier)
-- Supplier IDs: 1=Depo Bou Yong, 2=Depo Mean Mean, 3=Depo AMK, 4=Jae Ka Beer Depo, 5=Mesa Saang Beer Depo
-- ==============================================
INSERT INTO products (sku, product_name, description, cost_price, selling_price, supplier_id, min_stock_level, current_stock, is_active) VALUES
-- Supplier 1: Depo Bou Yong
('A001', 'ABC Extra Stout', '330ml * 24c', 25.00, 85.00, 1, 10, 100, true),

-- Supplier 2: Depo Mean Mean
('A002', 'Anchor Beer', '330ml * 24c', 12.00, 55.00, 2, 20, 150, true),
('A003', 'Anchor Smooth White Beer', '330ml * 24c', 14.00, 59.00, 2, 15, 120, true),
('A004', 'Anchor Beer (Bottle)', '325ml * 24B', 20.00, 59.00, 2, 10, 80, true),

-- Supplier 3: Depo AMK
('A005', 'Cambodia Lite Beer', '330ml * 24c', 15.00, 59.00, 3, 20, 100, true),

-- Supplier 4: Jae Ka Beer Depo
('A006', 'Tiger Lager Beer', '330ml * 24c', 18.00, 65.00, 4, 15, 200, true),
('A007', 'Tiger Crystal', '330ml * 24c', 22.00, 69.00, 4, 15, 180, true),
('A008', 'Tiger Lager Beer (Bottle)', '325ml * 24B', 24.00, 69.00, 4, 10, 90, true),
('A009', 'Tiger Crystal (Bottle)', '325ml * 24B', 26.00, 75.00, 4, 10, 85, true),

-- Supplier 5: Mesa Saang Beer Depo
('A010', 'Heineken (Bottle)', '325ml * 24B', 28.00, 70.00, 5, 10, 60, true);

-- ==============================================
-- CUSTOMERS
-- ==============================================
INSERT INTO customers (customer_name, contact_person, phone, email, address, is_active) VALUES
('Walk-in Customer', NULL, NULL, NULL, NULL, true),
('VIP Room 1', NULL, '012 111 111', NULL, 'Regular VIP', true),
('VIP Room 2', NULL, '012 222 222', NULL, 'Regular VIP', true),
('Mr. Vichet', NULL, '078 333 444', 'vichet@gmail.com', 'Regular customer', true),
('Ms. Sreyleak', NULL, '096 555 666', 'sreyleak@gmail.com', 'Birthday party regular', true);

-- ==============================================
-- SAMPLE PURCHASE ORDERS
-- ==============================================
INSERT INTO purchaseorders (po_number, supplier_id, order_date, eta_date, subtotal, shipping_rate, shipping_cost, promotion_amount, promotion_text, total_amount, status, truck_remark, overall_remark) VALUES
('PO-001-015', 1, '2026-01-14', '2026-01-30', 250000.00, 3.00, 7500.00, 0, NULL, 257500.00, 'Pending', 'give DO', 'give latest expiry');

-- ==============================================
-- SAMPLE PURCHASE ORDER ITEMS
-- ==============================================
INSERT INTO purchaseorderitems (po_id, product_id, quantity, unit_cost, amount) VALUES
(1, 1, 10000, 25.00, 250000.00);

