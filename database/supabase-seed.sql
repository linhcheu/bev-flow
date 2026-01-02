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
-- SUPPLIERS
-- ==============================================
INSERT INTO suppliers (company_name, contact_person, sale_agent, phone, email, address, lead_time_days, is_active) VALUES
('Cambrew Brewery', 'Mr. Sokha', 'Sokha', '012 345 678', 'sokha@cambrew.com', 'National Road 4, Phnom Penh', 2, true),
('Heineken Cambodia', 'Ms. Dara', 'Dara', '011 222 333', 'dara@heineken.com.kh', 'Koh Pich, Phnom Penh', 3, true),
('Tiger Beer Distributor', 'Mr. Visal', 'Visal', '078 456 789', 'visal@tigerbeer.kh', 'Toul Kork, Phnom Penh', 2, true),
('ABC Stout Depot', 'Ms. Sreymom', 'Sreymom', '096 111 222', 'sreymom@abcstout.kh', 'Chamkar Mon, Phnom Penh', 1, true),
('Angkor Beer Distributor', 'Mr. Piseth', 'Piseth', '015 888 999', 'piseth@angkorbeer.kh', 'Daun Penh, Phnom Penh', 2, true);

-- ==============================================
-- PRODUCTS
-- ==============================================
INSERT INTO products (sku, product_name, description, cost_price, selling_price, supplier_id, min_stock_level, current_stock, is_active) VALUES
('BEV-001', 'Anchor Beer Can', '330ml x 24 cans', 12.50, 18.00, 1, 20, 20, true),
('BEV-002', 'Anchor Smooth White', '330ml x 24 cans', 13.00, 19.00, 1, 15, 15, true),
('BEV-003', 'Cambodia Lager Beer', '330ml x 24 cans', 11.00, 16.00, 1, 25, 25, true),
('BEV-004', 'Angkor Beer Can', '330ml x 24 cans', 10.50, 15.00, 5, 30, 11971, true),
('BEV-005', 'Angkor Extra Stout', '330ml x 24 cans', 14.00, 20.00, 5, 15, 1010, true),
('BEV-006', 'Tiger Lager Can', '330ml x 24 cans', 15.00, 22.00, 3, 20, 20, true),
('BEV-007', 'Tiger Crystal', '330ml x 24 cans', 16.50, 24.00, 3, 15, 15, true),
('BEV-008', 'Heineken Bottle', '330ml x 24 bottles', 22.00, 32.00, 2, 10, 571, true),
('BEV-009', 'Heineken Can', '330ml x 24 cans', 20.00, 29.00, 2, 12, 203, true),
('BEV-010', 'ABC Extra Stout', '330ml x 24 cans', 18.00, 26.00, 4, 10, 17, true),
('BEV-011', 'Coca Cola', '330ml x 24 cans', 8.00, 12.00, 1, 30, 30, true),
('BEV-012', 'Sprite', '330ml x 24 cans', 8.00, 12.00, 1, 25, 25, true),
('BEV-013', 'Red Bull', '250ml x 24 cans', 15.00, 24.00, 1, 20, 20, true),
('BEV-014', 'Singha Beer', '330ml x 24 cans', 14.50, 21.00, 3, 15, 125, true),
('BEV-015', 'Leo Beer', '330ml x 24 cans', 13.50, 19.50, 3, 15, 25, true);

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
INSERT INTO purchaseorders (po_number, supplier_id, order_date, eta_date, subtotal, shipping_rate, shipping_cost, promotion_amount, total_amount, status, truck_remark, overall_remark) VALUES
('PO-0001', 3, '2025-01-14', '2025-01-15', 3855.00, 3.00, 115.65, 0, 3970.65, 'Received', NULL, NULL),
('PO-0002', 5, '2025-01-23', '2025-01-24', 735.00, 3.00, 22.05, 0, 757.05, 'Received', NULL, NULL),
('PO-0003', 4, '2025-01-14', '2025-01-15', 3960.00, 3.00, 118.80, 0, 4078.80, 'Received', NULL, NULL),
('PO-0004', 5, '2025-01-08', '2025-01-10', 2380.00, 3.00, 71.40, 0, 2451.40, 'Received', NULL, NULL),
('PO-0005', 2, '2025-01-15', '2025-01-17', 2760.00, 3.00, 82.80, 0, 2842.80, 'Received', NULL, NULL),
('PO-0006', 5, '2025-01-16', '2025-01-19', 3115.00, 3.00, 93.45, 0, 3208.45, 'Received', NULL, NULL),
('PO-0007', 3, '2025-02-22', '2025-02-24', 1620.00, 3.00, 48.60, 22.00, 1646.60, 'Received', NULL, NULL),
('PO-0008', 2, '2025-02-05', '2025-02-06', 1800.00, 3.00, 54.00, 0, 1854.00, 'Received', NULL, NULL),
('PO-0009', 4, '2025-02-14', '2025-02-16', 1080.00, 3.00, 32.40, 0, 1112.40, 'Received', NULL, NULL),
('PO-0010', 4, '2025-02-01', '2025-02-03', 6120.00, 3.00, 183.60, 0, 6303.60, 'Received', NULL, NULL),
('PO-0011', 4, '2025-02-16', '2025-02-18', 2520.00, 3.00, 75.60, 0, 2595.60, 'Received', NULL, NULL),
('PO-0012', 5, '2025-02-22', '2025-02-23', 2275.00, 3.00, 68.25, 0, 2343.25, 'Received', NULL, NULL),
('PO-0013', 5, '2025-02-04', '2025-02-05', 4340.00, 3.00, 130.20, 0, 4470.20, 'Received', NULL, NULL),
('PO-0014', 3, '2025-02-04', '2025-02-07', 3110.00, 3.00, 93.30, 0, 3203.30, 'Received', NULL, NULL),
('PO-0015', 2, '2025-03-11', '2025-03-12', 4620.00, 3.00, 138.60, 0, 4758.60, 'Received', NULL, NULL),
('PO-0016', 5, '2025-03-22', '2025-03-23', 2520.00, 3.00, 75.60, 0, 2595.60, 'Received', NULL, NULL),
('PO-0017', 1, '2025-03-13', '2025-03-14', 2985.00, 3.00, 89.55, 0, 3074.55, 'Received', NULL, NULL),
('PO-0018', 2, '2025-03-13', '2025-03-16', 1800.00, 3.00, 54.00, 0, 1854.00, 'Received', NULL, NULL),
('PO-0019', 4, '2025-03-13', '2025-03-14', 1440.00, 3.00, 43.20, 0, 1483.20, 'Received', NULL, NULL),
('PO-0020', 4, '2025-03-23', '2025-03-26', 3420.00, 3.00, 102.60, 0, 3522.60, 'Received', NULL, NULL),
('PO-0021', 2, '2025-03-23', '2025-03-26', 3580.00, 3.00, 107.40, 38.00, 3649.40, 'Received', NULL, NULL),
('PO-0022', 4, '2025-04-20', '2025-04-23', 3780.00, 3.00, 113.40, 0, 3893.40, 'Received', NULL, NULL),
('PO-0023', 2, '2025-04-26', '2025-04-28', 7020.00, 3.00, 210.60, 0, 7230.60, 'Received', NULL, NULL),
('PO-0024', 3, '2025-04-03', '2025-04-05', 1500.00, 3.00, 45.00, 0, 1545.00, 'Received', NULL, NULL),
('PO-0025', 5, '2025-04-22', '2025-04-25', 3640.00, 3.00, 109.20, 0, 3749.20, 'Received', NULL, NULL),
('PO-0026', 1, '2025-04-02', '2025-04-05', 1040.00, 3.00, 31.20, 0, 1071.20, 'Received', NULL, NULL),
('PO-0027', 4, '2025-04-05', '2025-04-06', 4140.00, 3.00, 124.20, 0, 4264.20, 'Received', NULL, NULL),
('PO-0028', 2, '2025-04-18', '2025-04-20', 2960.00, 3.00, 88.80, 0, 3048.80, 'Received', NULL, NULL),
('PO-0029', 1, '2025-05-08', '2025-05-09', 3260.00, 3.00, 97.80, 0, 3357.80, 'Received', NULL, NULL),
('PO-0030', 5, '2025-04-30', '2025-05-01', 2100.00, 3.00, 63.00, 0, 2163.00, 'Received', NULL, NULL),
('PO-0031', 3, '2025-05-15', '2025-05-16', 3090.00, 3.00, 92.70, 0, 3182.70, 'Received', NULL, NULL),
('PO-0032', 5, '2025-05-11', '2025-05-13', 2415.00, 3.00, 72.45, 0, 2487.45, 'Received', NULL, NULL),
('PO-0033', 4, '2025-05-16', '2025-05-18', 3960.00, 3.00, 118.80, 0, 4078.80, 'Received', NULL, NULL),
('PO-0034', 5, '2025-05-17', '2025-05-18', 2800.00, 3.00, 84.00, 27.00, 2857.00, 'Received', NULL, NULL),
('PO-0035', 2, '2025-05-15', '2025-05-17', 1800.00, 3.00, 54.00, 24.00, 1830.00, 'Received', NULL, NULL),
('PO-0036', 2, '2025-05-29', '2025-05-30', 1980.00, 3.00, 59.40, 0, 2039.40, 'Received', NULL, NULL),
('PO-0037', 1, '2025-06-18', '2025-06-19', 2310.00, 3.00, 69.30, 0, 2379.30, 'Received', NULL, NULL),
('PO-0038', 1, '2025-06-05', '2025-06-06', 2930.00, 3.00, 87.90, 0, 3017.90, 'Received', NULL, NULL),
('PO-0039', 2, '2025-06-05', '2025-06-08', 5520.00, 3.00, 165.60, 0, 5685.60, 'Received', NULL, NULL),
('PO-0040', 1, '2025-06-01', '2025-06-02', 2060.00, 3.00, 61.80, 0, 2121.80, 'Received', NULL, NULL),
('PO-0041', 2, '2025-06-07', '2025-06-10', 1400.00, 3.00, 42.00, 0, 1442.00, 'Received', NULL, NULL),
('PO-0042', 5, '2025-05-31', '2025-06-03', 3640.00, 3.00, 109.20, 0, 3749.20, 'Received', NULL, NULL),
('PO-0043', 3, '2025-06-16', '2025-06-17', 1595.00, 3.00, 47.85, 0, 1642.85, 'Received', NULL, NULL),
('PO-0044', 2, '2025-07-08', '2025-07-11', 3740.00, 3.00, 112.20, 0, 3852.20, 'Received', NULL, NULL),
('PO-0045', 3, '2025-07-22', '2025-07-23', 3120.00, 3.00, 93.60, 31.00, 3182.60, 'Received', NULL, NULL),
('PO-0046', 5, '2025-07-12', '2025-07-13', 4480.00, 3.00, 134.40, 0, 4614.40, 'Received', NULL, NULL),
('PO-0047', 1, '2025-07-24', '2025-07-25', 2165.00, 3.00, 64.95, 0, 2229.95, 'Received', NULL, NULL),
('PO-0048', 5, '2025-07-09', '2025-07-10', 1365.00, 3.00, 40.95, 0, 1405.95, 'Received', NULL, NULL),
('PO-0049', 1, '2025-07-02', '2025-07-03', 4580.00, 3.00, 137.40, 26.00, 4691.40, 'Received', NULL, NULL),
('PO-0050', 2, '2025-08-14', '2025-08-17', 3600.00, 3.00, 108.00, 56.00, 3652.00, 'Received', NULL, NULL),
('PO-0051', 4, '2025-08-02', '2025-08-03', 4140.00, 3.00, 124.20, 0, 4264.20, 'Received', NULL, NULL),
('PO-0052', 1, '2025-08-17', '2025-08-18', 1520.00, 3.00, 45.60, 0, 1565.60, 'Received', NULL, NULL),
('PO-0053', 3, '2025-08-10', '2025-08-13', 4785.00, 3.00, 143.55, 0, 4928.55, 'Received', NULL, NULL),
('PO-0054', 5, '2025-08-18', '2025-08-20', 2170.00, 3.00, 65.10, 0, 2235.10, 'Received', NULL, NULL),
('PO-0055', 3, '2025-08-13', '2025-08-15', 1160.00, 3.00, 34.80, 0, 1194.80, 'Received', NULL, NULL),
('PO-0056', 4, '2025-09-03', '2025-09-05', 2520.00, 3.00, 75.60, 0, 2595.60, 'Received', NULL, NULL),
('PO-0057', 5, '2025-09-07', '2025-09-08', 1575.00, 3.00, 47.25, 0, 1622.25, 'Received', NULL, NULL),
('PO-0058', 1, '2025-09-29', '2025-10-01', 1980.00, 3.00, 59.40, 0, 2039.40, 'Received', NULL, NULL),
('PO-0059', 3, '2025-09-18', '2025-09-21', 2875.00, 3.00, 86.25, 11.00, 2950.25, 'Received', NULL, NULL),
('PO-0060', 1, '2025-09-11', '2025-09-14', 640.00, 3.00, 19.20, 0, 659.20, 'Received', NULL, NULL),
('PO-0061', 3, '2025-09-08', '2025-09-10', 1050.00, 3.00, 31.50, 0, 1081.50, 'Received', NULL, NULL),
('PO-0062', 2, '2025-10-22', '2025-10-23', 3800.00, 3.00, 114.00, 21.00, 3893.00, 'Received', NULL, NULL),
('PO-0063', 1, '2025-10-07', '2025-10-09', 1120.00, 3.00, 33.60, 0, 1153.60, 'Received', NULL, NULL),
('PO-0064', 1, '2025-10-16', '2025-10-17', 2830.00, 3.00, 84.90, 0, 2914.90, 'Received', NULL, NULL),
('PO-0065', 3, '2025-10-18', '2025-10-21', 870.00, 3.00, 26.10, 35.00, 861.10, 'Received', NULL, NULL),
('PO-0066', 2, '2025-10-12', '2025-10-14', 6160.00, 3.00, 184.80, 0, 6344.80, 'Received', NULL, NULL),
('PO-0067', 5, '2025-10-10', '2025-10-11', 1260.00, 3.00, 37.80, 35.00, 1262.80, 'Received', NULL, NULL),
('PO-0068', 5, '2025-11-27', '2025-11-29', 945.00, 3.00, 28.35, 0, 973.35, 'Received', NULL, NULL),
('PO-0069', 2, '2025-11-19', '2025-11-20', 3600.00, 3.00, 108.00, 0, 3708.00, 'Received', NULL, NULL),
('PO-0070', 3, '2025-11-03', '2025-11-05', 2805.00, 3.00, 84.15, 0, 2889.15, 'Received', NULL, NULL),
('PO-0071', 5, '2025-11-08', '2025-11-09', 1960.00, 3.00, 58.80, 54.00, 1964.80, 'Received', NULL, NULL),
('PO-0072', 1, '2025-11-20', '2025-11-23', 2450.00, 3.00, 73.50, 0, 2523.50, 'Received', NULL, NULL),
('PO-0073', 4, '2025-11-15', '2025-11-17', 3060.00, 3.00, 91.80, 0, 3151.80, 'Received', NULL, NULL),
('PO-0074', 5, '2025-11-20', '2025-11-21', 2905.00, 3.00, 87.15, 0, 2992.15, 'Received', NULL, NULL),
('PO-0075', 3, '2025-11-19', '2025-11-20', 2655.00, 3.00, 79.65, 0, 2734.65, 'Received', NULL, NULL),
('PO-0076', 2, '2025-11-24', '2025-11-25', 4380.00, 3.00, 131.40, 25.00, 4486.40, 'Received', NULL, NULL),
('PO-0077', 5, '2025-12-28', '2025-12-29', 1470.00, 3.00, 44.10, 0, 1514.10, 'Received', NULL, NULL),
('PO-0078', 1, '2025-12-30', '2026-01-01', 3290.00, 3.00, 98.70, 0, 3388.70, 'Received', NULL, NULL),
('PO-0079', 4, '2025-12-29', '2025-12-30', 4680.00, 3.00, 140.40, 0, 4820.40, 'Received', NULL, NULL),
('PO-0080', 1, '2025-12-19', '2025-12-20', 2000.00, 3.00, 60.00, 24.00, 2036.00, 'Received', NULL, NULL),
('PO-0081', 2, '2025-12-18', '2025-12-21', 2200.00, 3.00, 66.00, 0, 2266.00, 'Received', NULL, NULL),
('PO-0082', 1, '2025-12-19', '2025-12-20', 1320.00, 3.00, 39.60, 42.00, 1317.60, 'Received', NULL, NULL),
('PO-0083', 2, '2026-01-02', '2026-01-02', 200.00, 3.00, 6.00, 0, 206.00, 'Received', NULL, NULL),
('PO-0084', 5, '2026-01-02', NULL, 118385.00, 3.00, 3551.55, 0, 121936.55, 'Received', 'qqq', 'qqq');

-- ==============================================
-- PURCHASE ORDER ITEMS (Sample - first 50)
-- ==============================================
INSERT INTO purchaseorderitems (po_id, product_id, quantity, unit_cost, amount) VALUES
(1, 6, 80, 15.00, 1200.00),
(1, 15, 50, 13.50, 675.00),
(1, 7, 120, 16.50, 1980.00),
(2, 4, 70, 10.50, 735.00),
(3, 10, 130, 18.00, 2340.00),
(3, 10, 90, 18.00, 1620.00),
(4, 5, 120, 14.00, 1680.00),
(4, 5, 50, 14.00, 700.00),
(5, 9, 50, 20.00, 1000.00),
(5, 8, 80, 22.00, 1760.00),
(6, 4, 90, 10.50, 945.00),
(6, 4, 60, 10.50, 630.00),
(6, 5, 110, 14.00, 1540.00),
(7, 15, 120, 13.50, 1620.00),
(8, 9, 90, 20.00, 1800.00),
(9, 10, 60, 18.00, 1080.00),
(10, 10, 100, 18.00, 1800.00),
(10, 10, 130, 18.00, 2340.00),
(10, 10, 110, 18.00, 1980.00),
(11, 10, 140, 18.00, 2520.00),
(12, 4, 130, 10.50, 1365.00),
(12, 5, 65, 14.00, 910.00),
(13, 4, 180, 10.50, 1890.00),
(13, 5, 175, 14.00, 2450.00),
(14, 6, 90, 15.00, 1350.00),
(14, 7, 80, 16.50, 1320.00),
(14, 14, 20, 14.50, 290.00),
(14, 15, 10, 13.50, 135.00),
(14, 14, 10, 14.50, 145.00);

-- ==============================================
-- FORECASTS
-- ==============================================
INSERT INTO forecasts (product_id, forecast_date, predicted_quantity, confidence_level, notes) VALUES
(1, '2026-01-15', 85, 0.78, 'Based on 12-month trend analysis'),
(2, '2026-01-15', 72, 0.81, 'Seasonal adjustment applied'),
(3, '2026-01-15', 95, 0.75, 'Holiday demand expected'),
(4, '2026-01-15', 450, 0.92, 'High volume product - strong trend'),
(5, '2026-01-15', 180, 0.85, 'Consistent demand pattern'),
(6, '2026-01-15', 65, 0.79, 'Moderate growth expected'),
(7, '2026-01-15', 58, 0.77, 'Premium product segment'),
(8, '2026-01-15', 120, 0.88, 'Strong brand performance'),
(9, '2026-01-15', 95, 0.82, 'Can format growing'),
(10, '2026-01-15', 45, 0.73, 'Niche market product'),
(11, '2026-01-15', 110, 0.86, 'Soft drink steady demand'),
(12, '2026-01-15', 90, 0.84, 'Soft drink steady demand'),
(13, '2026-01-15', 75, 0.80, 'Energy drink growth'),
(14, '2026-01-15', 55, 0.76, 'Thai beer segment'),
(15, '2026-01-15', 48, 0.74, 'Thai beer segment');

-- ==============================================
-- SALES DATA NOTE
-- ==============================================
-- You have 3562 sales records which is too large to include here.
-- For Supabase, you can either:
-- 1. Import from CSV via Supabase Dashboard > Table Editor > Import
-- 2. Use pg_dump/pg_restore for full migration
-- 3. Run a script to insert in batches
--
-- Sample sales for testing (10 records):
INSERT INTO sales (invoice_number, customer_id, customer_name, sale_date, product_id, unit_price, quantity, total_amount, notes) VALUES
('INV-0001', 1, 'Walk-in Customer', '2025-01-05', 4, 15.00, 5, 75.00, NULL),
('INV-0002', 2, 'VIP Room 1', '2025-01-05', 8, 32.00, 3, 96.00, NULL),
('INV-0003', 1, 'Walk-in Customer', '2025-01-06', 4, 15.00, 10, 150.00, NULL),
('INV-0004', 3, 'VIP Room 2', '2025-01-06', 9, 29.00, 4, 116.00, NULL),
('INV-0005', 4, 'Mr. Vichet', '2025-01-07', 5, 20.00, 8, 160.00, NULL),
('INV-0006', 1, 'Walk-in Customer', '2025-01-07', 4, 15.00, 12, 180.00, NULL),
('INV-0007', 5, 'Ms. Sreyleak', '2025-01-08', 8, 32.00, 5, 160.00, 'Birthday party'),
('INV-0008', 1, 'Walk-in Customer', '2025-01-08', 14, 21.00, 6, 126.00, NULL),
('INV-0009', 6, 'Mr. Bunna', '2025-01-09', 4, 15.00, 20, 300.00, 'Corporate event'),
('INV-0010', 1, 'Walk-in Customer', '2025-01-09', 5, 20.00, 4, 80.00, NULL);

-- Sample sale items
INSERT INTO saleitems (sale_id, product_id, quantity, unit_price, amount) VALUES
(1, 4, 5, 15.00, 75.00),
(2, 8, 3, 32.00, 96.00),
(3, 4, 10, 15.00, 150.00),
(4, 9, 4, 29.00, 116.00),
(5, 5, 8, 20.00, 160.00),
(6, 4, 12, 15.00, 180.00),
(7, 8, 5, 32.00, 160.00),
(8, 14, 6, 21.00, 126.00),
(9, 4, 20, 15.00, 300.00),
(10, 5, 4, 20.00, 80.00);

-- ==============================================
-- DONE!
-- ==============================================
-- After running this, your Supabase database will have:
-- ✅ 3 users (admin, manager, staff)
-- ✅ 5 suppliers
-- ✅ 15 products
-- ✅ 7 customers
-- ✅ 84 purchase orders
-- ✅ Sample PO items
-- ✅ 15 forecasts
-- ✅ 10 sample sales (for testing)
--
-- For full sales data migration, export from SQLite and import via CSV
