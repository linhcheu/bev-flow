-- ==============================================
-- BEV Flow - Supabase Seed Data
-- Run this AFTER running supabase-schema.sql
-- Contains 1 year of data from your local SQLite
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
('Ms. Sreyleak', NULL, '096 555 666', 'sreyleak@gmail.com', 'Birthday party regular', true),
('Mr. Bunna', NULL, '011 777 888', 'bunna@gmail.com', 'Corporate events', true),
('Ms. Phally', NULL, '015 999 000', 'phally@gmail.com', 'Weekend regular', true);

-- ==============================================
-- PURCHASE ORDERS (84 orders from Jan-Dec 2025)
-- ==============================================
INSERT INTO purchaseorders (po_number, supplier_id, order_date, eta_date, subtotal, shipping_rate, shipping_cost, promotion_amount, promotion_text, total_amount, status, truck_remark, overall_remark) VALUES
('PO-0001', 3, '2025-01-14', '2025-01-15', 3855.00, 3.00, 115.65, 0, NULL, 3970.65, 'Received', NULL, NULL),
('PO-0002', 5, '2025-01-23', '2025-01-24', 735.00, 3.00, 22.05, 0, NULL, 757.05, 'Received', NULL, NULL),
('PO-0003', 4, '2025-01-14', '2025-01-15', 3960.00, 3.00, 118.80, 0, NULL, 4078.80, 'Received', NULL, NULL),
('PO-0004', 5, '2025-01-08', '2025-01-10', 2380.00, 3.00, 71.40, 0, NULL, 2451.40, 'Received', NULL, NULL),
('PO-0005', 2, '2025-01-15', '2025-01-17', 2760.00, 3.00, 82.80, 0, NULL, 2842.80, 'Received', NULL, NULL),
('PO-0006', 5, '2025-01-16', '2025-01-19', 3115.00, 3.00, 93.45, 0, NULL, 3208.45, 'Received', NULL, NULL),
('PO-0007', 3, '2025-02-22', '2025-02-24', 1620.00, 3.00, 48.60, 22.00, NULL, 1646.60, 'Received', NULL, NULL),
('PO-0008', 2, '2025-02-05', '2025-02-06', 1800.00, 3.00, 54.00, 0, NULL, 1854.00, 'Received', NULL, NULL),
('PO-0009', 4, '2025-02-14', '2025-02-16', 1080.00, 3.00, 32.40, 0, NULL, 1112.40, 'Received', NULL, NULL),
('PO-0010', 4, '2025-02-01', '2025-02-03', 6120.00, 3.00, 183.60, 0, NULL, 6303.60, 'Received', NULL, NULL),
('PO-0011', 4, '2025-02-16', '2025-02-18', 2520.00, 3.00, 75.60, 0, NULL, 2595.60, 'Received', NULL, NULL),
('PO-0012', 5, '2025-02-22', '2025-02-23', 2275.00, 3.00, 68.25, 0, NULL, 2343.25, 'Received', NULL, NULL),
('PO-0013', 5, '2025-02-04', '2025-02-05', 4340.00, 3.00, 130.20, 0, NULL, 4470.20, 'Received', NULL, NULL),
('PO-0014', 3, '2025-02-04', '2025-02-07', 3110.00, 3.00, 93.30, 0, NULL, 3203.30, 'Received', NULL, NULL),
('PO-0015', 2, '2025-03-11', '2025-03-12', 4620.00, 3.00, 138.60, 0, NULL, 4758.60, 'Received', NULL, NULL),
('PO-0016', 5, '2025-03-22', '2025-03-23', 2520.00, 3.00, 75.60, 0, NULL, 2595.60, 'Received', NULL, NULL),
('PO-0017', 1, '2025-03-13', '2025-03-14', 2985.00, 3.00, 89.55, 0, NULL, 3074.55, 'Received', NULL, NULL),
('PO-0018', 2, '2025-03-13', '2025-03-16', 1800.00, 3.00, 54.00, 0, NULL, 1854.00, 'Received', NULL, NULL),
('PO-0019', 4, '2025-03-13', '2025-03-14', 1440.00, 3.00, 43.20, 0, NULL, 1483.20, 'Received', NULL, NULL),
('PO-0020', 4, '2025-03-23', '2025-03-26', 3420.00, 3.00, 102.60, 0, NULL, 3522.60, 'Received', NULL, NULL),
('PO-0021', 2, '2025-03-23', '2025-03-26', 3580.00, 3.00, 107.40, 38.00, NULL, 3649.40, 'Received', NULL, NULL),
('PO-0022', 4, '2025-04-20', '2025-04-23', 3780.00, 3.00, 113.40, 0, NULL, 3893.40, 'Received', NULL, NULL),
('PO-0023', 2, '2025-04-26', '2025-04-28', 7020.00, 3.00, 210.60, 0, NULL, 7230.60, 'Received', NULL, NULL),
('PO-0024', 3, '2025-04-03', '2025-04-05', 1500.00, 3.00, 45.00, 0, NULL, 1545.00, 'Received', NULL, NULL),
('PO-0025', 5, '2025-04-22', '2025-04-25', 3640.00, 3.00, 109.20, 0, NULL, 3749.20, 'Received', NULL, NULL),
('PO-0026', 1, '2025-04-02', '2025-04-05', 1040.00, 3.00, 31.20, 0, NULL, 1071.20, 'Received', NULL, NULL),
('PO-0027', 4, '2025-04-05', '2025-04-06', 4140.00, 3.00, 124.20, 0, NULL, 4264.20, 'Received', NULL, NULL),
('PO-0028', 2, '2025-04-18', '2025-04-20', 2960.00, 3.00, 88.80, 0, NULL, 3048.80, 'Received', NULL, NULL),
('PO-0029', 1, '2025-05-08', '2025-05-09', 3260.00, 3.00, 97.80, 0, NULL, 3357.80, 'Received', NULL, NULL),
('PO-0030', 5, '2025-04-30', '2025-05-01', 2100.00, 3.00, 63.00, 0, NULL, 2163.00, 'Received', NULL, NULL),
('PO-0031', 3, '2025-05-15', '2025-05-16', 3090.00, 3.00, 92.70, 0, NULL, 3182.70, 'Received', NULL, NULL),
('PO-0032', 5, '2025-05-11', '2025-05-13', 2415.00, 3.00, 72.45, 0, NULL, 2487.45, 'Received', NULL, NULL),
('PO-0033', 4, '2025-05-16', '2025-05-18', 3960.00, 3.00, 118.80, 0, NULL, 4078.80, 'Received', NULL, NULL),
('PO-0034', 5, '2025-05-17', '2025-05-18', 2800.00, 3.00, 84.00, 27.00, NULL, 2857.00, 'Received', NULL, NULL),
('PO-0035', 2, '2025-05-15', '2025-05-17', 1800.00, 3.00, 54.00, 24.00, NULL, 1830.00, 'Received', NULL, NULL),
('PO-0036', 2, '2025-05-29', '2025-05-30', 1980.00, 3.00, 59.40, 0, NULL, 2039.40, 'Received', NULL, NULL),
('PO-0037', 1, '2025-06-18', '2025-06-19', 2310.00, 3.00, 69.30, 0, NULL, 2379.30, 'Received', NULL, NULL),
('PO-0038', 1, '2025-06-05', '2025-06-06', 2930.00, 3.00, 87.90, 0, NULL, 3017.90, 'Received', NULL, NULL),
('PO-0039', 2, '2025-06-05', '2025-06-08', 5520.00, 3.00, 165.60, 0, NULL, 5685.60, 'Received', NULL, NULL),
('PO-0040', 1, '2025-06-01', '2025-06-02', 2060.00, 3.00, 61.80, 0, NULL, 2121.80, 'Received', NULL, NULL),
('PO-0041', 2, '2025-06-07', '2025-06-10', 1400.00, 3.00, 42.00, 0, NULL, 1442.00, 'Received', NULL, NULL),
('PO-0042', 5, '2025-05-31', '2025-06-03', 3640.00, 3.00, 109.20, 0, NULL, 3749.20, 'Received', NULL, NULL),
('PO-0043', 3, '2025-06-16', '2025-06-17', 1595.00, 3.00, 47.85, 0, NULL, 1642.85, 'Received', NULL, NULL),
('PO-0044', 2, '2025-07-08', '2025-07-11', 3740.00, 3.00, 112.20, 0, NULL, 3852.20, 'Received', NULL, NULL),
('PO-0045', 3, '2025-07-22', '2025-07-23', 3120.00, 3.00, 93.60, 31.00, NULL, 3182.60, 'Received', NULL, NULL),
('PO-0046', 5, '2025-07-12', '2025-07-13', 4480.00, 3.00, 134.40, 0, NULL, 4614.40, 'Received', NULL, NULL),
('PO-0047', 1, '2025-07-24', '2025-07-25', 2165.00, 3.00, 64.95, 0, NULL, 2229.95, 'Received', NULL, NULL),
('PO-0048', 5, '2025-07-09', '2025-07-10', 1365.00, 3.00, 40.95, 0, NULL, 1405.95, 'Received', NULL, NULL),
('PO-0049', 1, '2025-07-02', '2025-07-03', 4580.00, 3.00, 137.40, 26.00, NULL, 4691.40, 'Received', NULL, NULL),
('PO-0050', 2, '2025-08-14', '2025-08-17', 3600.00, 3.00, 108.00, 56.00, NULL, 3652.00, 'Received', NULL, NULL),
('PO-0051', 4, '2025-08-02', '2025-08-03', 4140.00, 3.00, 124.20, 0, NULL, 4264.20, 'Received', NULL, NULL),
('PO-0052', 1, '2025-08-17', '2025-08-18', 1520.00, 3.00, 45.60, 0, NULL, 1565.60, 'Received', NULL, NULL),
('PO-0053', 3, '2025-08-10', '2025-08-13', 4785.00, 3.00, 143.55, 0, NULL, 4928.55, 'Received', NULL, NULL),
('PO-0054', 5, '2025-08-18', '2025-08-20', 2170.00, 3.00, 65.10, 0, NULL, 2235.10, 'Received', NULL, NULL),
('PO-0055', 3, '2025-08-13', '2025-08-15', 1160.00, 3.00, 34.80, 0, NULL, 1194.80, 'Received', NULL, NULL),
('PO-0056', 4, '2025-09-03', '2025-09-05', 2520.00, 3.00, 75.60, 0, NULL, 2595.60, 'Received', NULL, NULL),
('PO-0057', 5, '2025-09-07', '2025-09-08', 1575.00, 3.00, 47.25, 0, NULL, 1622.25, 'Received', NULL, NULL),
('PO-0058', 1, '2025-09-29', '2025-10-01', 1980.00, 3.00, 59.40, 0, NULL, 2039.40, 'Received', NULL, NULL),
('PO-0059', 3, '2025-09-18', '2025-09-21', 2875.00, 3.00, 86.25, 11.00, NULL, 2950.25, 'Received', NULL, NULL),
('PO-0060', 1, '2025-09-11', '2025-09-14', 640.00, 3.00, 19.20, 0, NULL, 659.20, 'Received', NULL, NULL),
('PO-0061', 3, '2025-09-08', '2025-09-10', 1050.00, 3.00, 31.50, 0, NULL, 1081.50, 'Received', NULL, NULL),
('PO-0062', 2, '2025-10-22', '2025-10-23', 3800.00, 3.00, 114.00, 21.00, NULL, 3893.00, 'Received', NULL, NULL),
('PO-0063', 1, '2025-10-07', '2025-10-09', 1120.00, 3.00, 33.60, 0, NULL, 1153.60, 'Received', NULL, NULL),
('PO-0064', 1, '2025-10-16', '2025-10-17', 2830.00, 3.00, 84.90, 0, NULL, 2914.90, 'Received', NULL, NULL),
('PO-0065', 3, '2025-10-18', '2025-10-21', 870.00, 3.00, 26.10, 35.00, NULL, 861.10, 'Received', NULL, NULL),
('PO-0066', 2, '2025-10-12', '2025-10-14', 6160.00, 3.00, 184.80, 0, NULL, 6344.80, 'Received', NULL, NULL),
('PO-0067', 5, '2025-10-10', '2025-10-11', 1260.00, 3.00, 37.80, 35.00, NULL, 1262.80, 'Received', NULL, NULL),
('PO-0068', 5, '2025-11-27', '2025-11-29', 945.00, 3.00, 28.35, 0, NULL, 973.35, 'Received', NULL, NULL),
('PO-0069', 2, '2025-11-19', '2025-11-20', 3600.00, 3.00, 108.00, 0, NULL, 3708.00, 'Received', NULL, NULL),
('PO-0070', 3, '2025-11-03', '2025-11-05', 2805.00, 3.00, 84.15, 0, NULL, 2889.15, 'Received', NULL, NULL),
('PO-0071', 5, '2025-11-08', '2025-11-09', 1960.00, 3.00, 58.80, 54.00, NULL, 1964.80, 'Received', NULL, NULL),
('PO-0072', 1, '2025-11-20', '2025-11-23', 2450.00, 3.00, 73.50, 0, NULL, 2523.50, 'Received', NULL, NULL),
('PO-0073', 4, '2025-11-15', '2025-11-17', 3060.00, 3.00, 91.80, 0, NULL, 3151.80, 'Received', NULL, NULL),
('PO-0074', 5, '2025-11-20', '2025-11-21', 2905.00, 3.00, 87.15, 0, NULL, 2992.15, 'Received', NULL, NULL),
('PO-0075', 3, '2025-11-19', '2025-11-20', 2655.00, 3.00, 79.65, 0, NULL, 2734.65, 'Received', NULL, NULL),
('PO-0076', 2, '2025-11-24', '2025-11-25', 4380.00, 3.00, 131.40, 25.00, NULL, 4486.40, 'Received', NULL, NULL),
('PO-0077', 5, '2025-12-28', '2025-12-29', 1470.00, 3.00, 44.10, 0, NULL, 1514.10, 'Received', NULL, NULL),
('PO-0078', 1, '2025-12-30', '2026-01-01', 3290.00, 3.00, 98.70, 0, NULL, 3388.70, 'Received', NULL, NULL),
('PO-0079', 4, '2025-12-29', '2025-12-30', 4680.00, 3.00, 140.40, 0, NULL, 4820.40, 'Received', NULL, NULL),
('PO-0080', 1, '2025-12-19', '2025-12-20', 2000.00, 3.00, 60.00, 24.00, NULL, 2036.00, 'Received', NULL, NULL),
('PO-0081', 2, '2025-12-18', '2025-12-21', 2200.00, 3.00, 66.00, 0, NULL, 2266.00, 'Received', NULL, NULL),
('PO-0082', 1, '2025-12-19', '2025-12-20', 1320.00, 3.00, 39.60, 42.00, NULL, 1317.60, 'Received', NULL, NULL),
('PO-0083', 2, '2026-01-02', '2026-01-02', 200.00, 3.00, 6.00, 0, NULL, 206.00, 'Received', NULL, NULL),
('PO-0084', 5, '2026-01-02', NULL, 118385.00, 3.00, 3551.55, 0, NULL, 121936.55, 'Received', 'qqq', 'qqq');

-- ==============================================
-- PURCHASE ORDER ITEMS (Sample - first 50)
-- Each PO's items must match the supplier's products
-- ==============================================
INSERT INTO purchaseorderitems (po_id, product_id, quantity, unit_cost, amount) VALUES
-- PO-1: Supplier 3 (AMK) - Product 5 only
(1, 5, 257, 15.00, 3855.00),
-- PO-2: Supplier 5 (Mesa Saang) - Product 10
(2, 10, 26, 28.00, 735.00),
-- PO-3: Supplier 4 (Jae Ka) - Products 6,7,8,9
(3, 6, 100, 18.00, 1800.00),
(3, 7, 60, 22.00, 1320.00),
(3, 8, 35, 24.00, 840.00),
-- PO-4: Supplier 5 (Mesa Saang) - Product 10
(4, 10, 85, 28.00, 2380.00),
-- PO-5: Supplier 2 (Mean Mean) - Products 2,3,4
(5, 2, 100, 12.00, 1200.00),
(5, 3, 70, 14.00, 980.00),
(5, 4, 29, 20.00, 580.00),
-- PO-6: Supplier 5 (Mesa Saang) - Product 10
(6, 10, 111, 28.00, 3115.00),
-- PO-7: Supplier 3 (AMK) - Product 5
(7, 5, 108, 15.00, 1620.00),
-- PO-8: Supplier 2 (Mean Mean) - Products 2,3,4
(8, 2, 80, 12.00, 960.00),
(8, 3, 60, 14.00, 840.00),
-- PO-9: Supplier 4 (Jae Ka) - Products 6,7,8,9
(9, 6, 60, 18.00, 1080.00),
-- PO-10: Supplier 4 (Jae Ka) - Products 6,7,8,9
(10, 6, 150, 18.00, 2700.00),
(10, 7, 100, 22.00, 2200.00),
(10, 8, 50, 24.00, 1200.00),
-- PO-11: Supplier 4 (Jae Ka) - Products 6,7,8,9
(11, 7, 80, 22.00, 1760.00),
(11, 9, 30, 26.00, 780.00),
-- PO-12: Supplier 5 (Mesa Saang) - Product 10
(12, 10, 81, 28.00, 2275.00),
-- PO-13: Supplier 5 (Mesa Saang) - Product 10
(13, 10, 155, 28.00, 4340.00),
-- PO-14: Supplier 3 (AMK) - Product 5
(14, 5, 207, 15.00, 3110.00);

-- ==============================================
-- FORECASTS (Updated for 10 products)
-- Schema v2: predicted_demand, confidence_score, recommended_order
-- ==============================================
INSERT INTO forecasts (product_id, forecast_date, predicted_demand, confidence_score, recommended_order, notes) VALUES
(1, '2026-01-15', 85, 0.78, 20, 'ABC Extra Stout - Based on 12-month trend analysis'),
(2, '2026-01-15', 150, 0.92, 50, 'Anchor Beer - High volume, consistent demand'),
(3, '2026-01-15', 95, 0.81, 30, 'Anchor Smooth - Growing preference'),
(4, '2026-01-15', 70, 0.75, 20, 'Anchor Bottle - Moderate demand'),
(5, '2026-01-15', 180, 0.85, 80, 'Cambodia Lite - Strong demand'),
(6, '2026-01-15', 200, 0.88, 100, 'Tiger Lager Can - Top seller'),
(7, '2026-01-15', 180, 0.86, 80, 'Tiger Crystal - Premium segment'),
(8, '2026-01-15', 90, 0.79, 30, 'Tiger Lager Bottle - Steady'),
(9, '2026-01-15', 85, 0.77, 25, 'Tiger Crystal Bottle - Premium'),
(10, '2026-01-15', 60, 0.73, 15, 'Heineken Bottle - Niche premium');

-- ==============================================
-- SALES DATA NOTE
-- ==============================================
-- You have 3562 sales records which is too large to include here.
-- For Supabase, you can either:
-- 1. Import from CSV via Supabase Dashboard > Table Editor > Import
-- 2. Use pg_dump/pg_restore for full migration
-- 3. Run a script to insert in batches
--
-- Sample sales for testing (10 records) - Schema v2 format
-- sale_number (not invoice_number), no product_id/quantity/unit_price in sales table
INSERT INTO sales (sale_number, customer_id, sale_date, subtotal, discount_percent, discount_amount, total_amount, payment_method, status, notes) VALUES
('SALE-0001', 1, '2025-01-05', 275.00, 0, 0, 275.00, 'Cash', 'Completed', NULL),
('SALE-0002', 2, '2025-01-05', 195.00, 0, 0, 195.00, 'Cash', 'Completed', NULL),
('SALE-0003', 1, '2025-01-06', 550.00, 0, 0, 550.00, 'Cash', 'Completed', NULL),
('SALE-0004', 3, '2025-01-06', 276.00, 0, 0, 276.00, 'Cash', 'Completed', NULL),
('SALE-0005', 4, '2025-01-07', 472.00, 0, 0, 472.00, 'Cash', 'Completed', NULL),
('SALE-0006', 1, '2025-01-07', 660.00, 0, 0, 660.00, 'Cash', 'Completed', NULL),
('SALE-0007', 5, '2025-01-08', 325.00, 0, 0, 325.00, 'Cash', 'Completed', 'Birthday party'),
('SALE-0008', 1, '2025-01-08', 510.00, 0, 0, 510.00, 'Cash', 'Completed', NULL),
('SALE-0009', 6, '2025-01-09', 1100.00, 0, 0, 1100.00, 'Cash', 'Completed', 'Corporate event'),
('SALE-0010', 1, '2025-01-09', 236.00, 0, 0, 236.00, 'Cash', 'Completed', NULL);

-- Sample sale items - Updated product IDs and prices
INSERT INTO saleitems (sale_id, product_id, quantity, unit_price, amount) VALUES
(1, 2, 5, 55.00, 275.00),
(2, 6, 3, 65.00, 195.00),
(3, 2, 10, 55.00, 550.00),
(4, 7, 4, 69.00, 276.00),
(5, 5, 8, 59.00, 472.00),
(6, 2, 12, 55.00, 660.00),
(7, 6, 5, 65.00, 325.00),
(8, 1, 6, 85.00, 510.00),
(9, 2, 20, 55.00, 1100.00),
(10, 5, 4, 59.00, 236.00);

-- ==============================================
-- DONE! (Compatible with supabase-schema-v2.sql)
-- ==============================================
-- After running this, your Supabase database will have:
-- ✅ 3 users (admin, manager, staff)
-- ✅ 5 suppliers (Depo Bou Yong, Depo Mean Mean, Depo AMK, Jae Ka Beer Depo, Mesa Saang Beer Depo)
-- ✅ 10 products (A001-A010, each linked to their supplier)
-- ✅ 7 customers
-- ✅ 84 purchase orders (with promotion_text column)
-- ✅ Sample PO items (linked to correct products per supplier)
-- ✅ 10 forecasts (using predicted_demand, confidence_score, recommended_order)
-- ✅ 10 sample sales (using sale_number, with items in saleitems table)
--
-- Schema v2 changes applied:
-- - Sales: sale_number (not invoice_number), items in saleitems table
-- - Forecasts: predicted_demand, confidence_score, recommended_order
--
-- Supplier-Product mapping:
-- Supplier 1 (Depo Bou Yong): A001 (ABC Extra Stout)
-- Supplier 2 (Depo Mean Mean): A002, A003, A004 (Anchor beers)
-- Supplier 3 (Depo AMK): A005 (Cambodia Lite)
-- Supplier 4 (Jae Ka Beer Depo): A006, A007, A008, A009 (Tiger beers)
-- Supplier 5 (Mesa Saang Beer Depo): A010 (Heineken)
--
-- For full sales data migration, export from SQLite and import via CSV
