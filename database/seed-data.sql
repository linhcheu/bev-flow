-- ==============================================
-- BEV Flow - SQLite Seed Data with Test Accounts
-- Run this after schema.sql to populate test data
-- ==============================================

-- ==============================================
-- TEST USER ACCOUNTS
-- Password hash is bcrypt of the plain password
-- ==============================================
-- Admin: admin@bevflow.com / admin123
-- Manager: manager@bevflow.com / manager123  
-- Staff: staff@bevflow.com / staff123
-- ==============================================

DELETE FROM Users;

INSERT INTO Users (username, email, password_hash, full_name, role, phone, location, is_active) VALUES
-- System Administrator - Full access
('admin', 'admin@bevflow.com', '$2a$10$rqN5/LH0z3NdQIGX5BgKyuYqXW.nz.nKvFz1Y5Fq3Y9VqZOIzQd1W', 'System Admin', 'admin', '+855 12 345 678', 'Phnom Penh, Cambodia', 1),
-- Manager - Most features but no backup/users
('manager', 'manager@bevflow.com', '$2a$10$XqN5/LH0z3NdQIGX5BgKyuYqXW.nz.nKvFz1Y5Fq3Y9VqZOIzQd1W', 'Store Manager', 'manager', '+855 12 456 789', 'Phnom Penh, Cambodia', 1),
-- Staff - Basic access, no forecasts/export
('staff', 'staff@bevflow.com', '$2a$10$YqN5/LH0z3NdQIGX5BgKyuYqXW.nz.nKvFz1Y5Fq3Y9VqZOIzQd1W', 'Staff User', 'user', '+855 12 567 890', 'Phnom Penh, Cambodia', 1),
-- Additional test staff accounts
('staff2', 'staff2@bevflow.com', '$2a$10$YqN5/LH0z3NdQIGX5BgKyuYqXW.nz.nKvFz1Y5Fq3Y9VqZOIzQd1W', 'Sophea Chan', 'user', '+855 12 678 901', 'Siem Reap, Cambodia', 1),
('staff3', 'staff3@bevflow.com', '$2a$10$YqN5/LH0z3NdQIGX5BgKyuYqXW.nz.nKvFz1Y5Fq3Y9VqZOIzQd1W', 'Dara Sok', 'user', '+855 12 789 012', 'Battambang, Cambodia', 1);

-- ==============================================
-- SUPPLIERS - Beer & Beverage Distributors
-- ==============================================
DELETE FROM Suppliers;

INSERT INTO Suppliers (company_name, contact_person, sale_agent, phone, email, address, lead_time_days, is_active) VALUES
('Cambrew Brewery', 'Mr. Sokha Heng', 'Sokha', '+855 12 345 678', 'sokha@cambrew.com', 'National Road 4, Phnom Penh', 2, 1),
('Heineken Cambodia', 'Ms. Dara Keo', 'Dara', '+855 11 222 333', 'dara@heineken.com.kh', 'Koh Pich, Phnom Penh', 3, 1),
('Tiger Beer Distributor', 'Mr. Visal Phan', 'Visal', '+855 78 456 789', 'visal@tigerbeer.kh', 'Toul Kork, Phnom Penh', 2, 1),
('ABC Stout Depot', 'Ms. Sreymom Tan', 'Sreymom', '+855 96 111 222', 'sreymom@abcstout.kh', 'Chamkar Mon, Phnom Penh', 1, 1),
('Angkor Beer Distributor', 'Mr. Piseth Chea', 'Piseth', '+855 15 888 999', 'piseth@angkorbeer.kh', 'Daun Penh, Phnom Penh', 2, 1),
('Coca-Cola Cambodia', 'Ms. Kunthea Lim', 'Kunthea', '+855 17 333 444', 'kunthea@coca-cola.kh', 'Russian Boulevard, Phnom Penh', 1, 1);

-- ==============================================
-- PRODUCTS - Beers & Beverages
-- ==============================================
DELETE FROM Products;

INSERT INTO Products (sku, product_name, description, cost_price, selling_price, supplier_id, min_stock_level, current_stock, is_active) VALUES
-- Cambrew products
('BEV-001', 'Anchor Beer Can', '330ml x 24 cans', 12.50, 18.00, 1, 20, 150, 1),
('BEV-002', 'Anchor Smooth White', '330ml x 24 cans', 13.00, 19.00, 1, 15, 80, 1),
('BEV-003', 'Cambodia Lager Beer', '330ml x 24 cans', 11.00, 16.00, 1, 25, 200, 1),
-- Angkor products
('BEV-004', 'Angkor Beer Can', '330ml x 24 cans', 10.50, 15.00, 5, 30, 300, 1),
('BEV-005', 'Angkor Extra Stout', '330ml x 24 cans', 14.00, 20.00, 5, 15, 100, 1),
('BEV-006', 'Angkor Draft Beer', '500ml x 12 bottles', 16.00, 24.00, 5, 10, 50, 1),
-- Tiger products
('BEV-007', 'Tiger Lager Can', '330ml x 24 cans', 15.00, 22.00, 3, 20, 120, 1),
('BEV-008', 'Tiger Crystal', '330ml x 24 cans', 16.50, 24.00, 3, 15, 90, 1),
('BEV-009', 'Singha Beer', '330ml x 24 cans', 14.50, 21.00, 3, 15, 70, 1),
('BEV-010', 'Leo Beer', '330ml x 24 cans', 13.50, 19.50, 3, 15, 85, 1),
-- Heineken products
('BEV-011', 'Heineken Bottle', '330ml x 24 bottles', 22.00, 32.00, 2, 10, 60, 1),
('BEV-012', 'Heineken Can', '330ml x 24 cans', 20.00, 29.00, 2, 12, 75, 1),
('BEV-013', 'Tiger Zero', '330ml x 24 cans', 14.00, 20.00, 2, 10, 40, 1),
-- ABC products
('BEV-014', 'ABC Extra Stout', '330ml x 24 cans', 18.00, 26.00, 4, 10, 45, 1),
('BEV-015', 'Guinness Foreign Extra', '330ml x 24 cans', 25.00, 36.00, 4, 8, 30, 1),
-- Soft drinks
('BEV-016', 'Coca Cola', '330ml x 24 cans', 8.00, 12.00, 6, 30, 180, 1),
('BEV-017', 'Sprite', '330ml x 24 cans', 8.00, 12.00, 6, 25, 150, 1),
('BEV-018', 'Fanta Orange', '330ml x 24 cans', 8.00, 12.00, 6, 20, 120, 1),
('BEV-019', 'Red Bull', '250ml x 24 cans', 15.00, 24.00, 6, 20, 200, 1),
('BEV-020', 'Mineral Water', '500ml x 24 bottles', 5.00, 8.00, 6, 40, 300, 1);

-- ==============================================
-- CUSTOMERS - Karaoke VIP Rooms & Regulars
-- ==============================================
DELETE FROM Customers;

INSERT INTO Customers (customer_name, contact_person, phone, email, address, is_active) VALUES
('Walk-in Customer', 'General', NULL, NULL, 'Counter sales', 1),
('VIP Room A', 'Room A', '+855 12 111 111', NULL, 'Premium VIP Room', 1),
('VIP Room B', 'Room B', '+855 12 222 222', NULL, 'Premium VIP Room', 1),
('VIP Room C', 'Room C', '+855 12 333 333', NULL, 'Standard VIP Room', 1),
('VIP Room D', 'Room D', '+855 12 444 444', NULL, 'Standard VIP Room', 1),
('Mr. Vichet Heng', 'Vichet', '+855 78 333 444', 'vichet@gmail.com', 'Regular customer - weekends', 1),
('Ms. Sreyleak Pich', 'Sreyleak', '+855 96 555 666', 'sreyleak@gmail.com', 'Birthday party regular', 1),
('Mr. Bunna Khim', 'Bunna', '+855 11 777 888', 'bunna@gmail.com', 'Corporate events', 1),
('Ms. Phally Chhun', 'Phally', '+855 15 999 000', 'phally@gmail.com', 'Weekend regular', 1),
('Mr. Ratha Mao', 'Ratha', '+855 17 888 777', 'ratha@gmail.com', 'VIP member', 1);

-- ==============================================
-- PURCHASE ORDERS - Sample orders
-- ==============================================
DELETE FROM PurchaseOrderItems;
DELETE FROM PurchaseOrders;

INSERT INTO PurchaseOrders (po_number, supplier_id, order_date, eta_date, subtotal, shipping_rate, shipping_cost, promotion_amount, total_amount, status, truck_remark, overall_remark) VALUES
('PO-2025-001', 1, '2025-01-02', '2025-01-04', 1250.00, 3.00, 37.50, 0, 1287.50, 'Received', 'Truck A', 'January stock'),
('PO-2025-002', 5, '2025-01-03', '2025-01-05', 1050.00, 3.00, 31.50, 50.00, 1031.50, 'Received', 'Truck B', 'Promo discount'),
('PO-2025-003', 3, '2025-01-05', '2025-01-07', 1500.00, 3.00, 45.00, 0, 1545.00, 'Received', NULL, NULL),
('PO-2025-004', 2, '2025-01-08', '2025-01-11', 2200.00, 3.00, 66.00, 0, 2266.00, 'Received', NULL, 'Heineken restock'),
('PO-2025-005', 6, '2025-01-10', '2025-01-11', 800.00, 3.00, 24.00, 0, 824.00, 'Received', NULL, 'Soft drinks'),
('PO-2025-006', 4, '2025-01-12', '2025-01-13', 1800.00, 3.00, 54.00, 100.00, 1754.00, 'Received', NULL, 'Stout special'),
('PO-2025-007', 1, '2025-01-15', '2025-01-17', 1300.00, 3.00, 39.00, 0, 1339.00, 'Shipped', NULL, NULL),
('PO-2025-008', 5, '2025-01-18', '2025-01-20', 2100.00, 3.00, 63.00, 0, 2163.00, 'Ordered', NULL, 'Weekend stock'),
('PO-2025-009', 3, '2025-01-20', '2025-01-22', 1650.00, 3.00, 49.50, 0, 1699.50, 'Pending', NULL, NULL);

-- ==============================================
-- PURCHASE ORDER ITEMS
-- ==============================================
INSERT INTO PurchaseOrderItems (po_id, product_id, quantity, unit_cost, amount) VALUES
-- PO-2025-001
(1, 1, 50, 12.50, 625.00),
(1, 2, 30, 13.00, 390.00),
(1, 3, 20, 11.00, 220.00),
-- PO-2025-002
(2, 4, 60, 10.50, 630.00),
(2, 5, 30, 14.00, 420.00),
-- PO-2025-003
(3, 7, 40, 15.00, 600.00),
(3, 8, 35, 16.50, 577.50),
(3, 9, 20, 14.50, 290.00),
-- PO-2025-004
(4, 11, 50, 22.00, 1100.00),
(4, 12, 55, 20.00, 1100.00),
-- PO-2025-005
(5, 16, 40, 8.00, 320.00),
(5, 17, 35, 8.00, 280.00),
(5, 19, 10, 15.00, 150.00),
-- PO-2025-006
(6, 14, 50, 18.00, 900.00),
(6, 15, 36, 25.00, 900.00),
-- PO-2025-007
(7, 1, 60, 12.50, 750.00),
(7, 3, 50, 11.00, 550.00),
-- PO-2025-008
(8, 4, 100, 10.50, 1050.00),
(8, 5, 50, 14.00, 700.00),
(8, 6, 25, 16.00, 400.00),
-- PO-2025-009
(9, 7, 50, 15.00, 750.00),
(9, 10, 50, 13.50, 675.00);

-- ==============================================
-- SALES - Sample sales transactions
-- ==============================================
DELETE FROM SaleItems;
DELETE FROM Sales;

INSERT INTO Sales (sale_number, sale_date, customer_id, subtotal, discount_percent, discount_amount, total_amount, payment_method, status, notes) VALUES
('SAL-2025-001', '2025-01-02', 1, 180.00, 0, 0, 180.00, 'Cash', 'Completed', 'Walk-in customer'),
('SAL-2025-002', '2025-01-02', 2, 450.00, 10, 45.00, 405.00, 'Card', 'Completed', 'VIP Room A - Birthday'),
('SAL-2025-003', '2025-01-03', 3, 320.00, 0, 0, 320.00, 'Cash', 'Completed', 'VIP Room B'),
('SAL-2025-004', '2025-01-03', 6, 250.00, 5, 12.50, 237.50, 'Cash', 'Completed', 'Regular customer'),
('SAL-2025-005', '2025-01-04', 1, 96.00, 0, 0, 96.00, 'Cash', 'Completed', NULL),
('SAL-2025-006', '2025-01-04', 4, 380.00, 0, 0, 380.00, 'Card', 'Completed', 'VIP Room C'),
('SAL-2025-007', '2025-01-05', 5, 420.00, 15, 63.00, 357.00, 'Cash', 'Completed', 'VIP Room D - Corporate'),
('SAL-2025-008', '2025-01-05', 7, 280.00, 0, 0, 280.00, 'Cash', 'Completed', 'Ms. Sreyleak'),
('SAL-2025-009', '2025-01-06', 1, 150.00, 0, 0, 150.00, 'Cash', 'Completed', NULL),
('SAL-2025-010', '2025-01-06', 8, 550.00, 10, 55.00, 495.00, 'Card', 'Completed', 'Mr. Bunna - Corporate');

-- ==============================================
-- SALE ITEMS
-- ==============================================
INSERT INTO SaleItems (sale_id, product_id, quantity, unit_price, amount) VALUES
-- SAL-2025-001
(1, 4, 10, 15.00, 150.00),
(1, 16, 5, 12.00, 60.00),
-- SAL-2025-002
(2, 11, 10, 32.00, 320.00),
(2, 12, 5, 29.00, 145.00),
-- SAL-2025-003
(3, 7, 10, 22.00, 220.00),
(3, 19, 5, 24.00, 120.00),
-- SAL-2025-004
(4, 4, 12, 15.00, 180.00),
(4, 16, 4, 12.00, 48.00),
(4, 17, 2, 12.00, 24.00),
-- SAL-2025-005
(5, 16, 8, 12.00, 96.00),
-- SAL-2025-006
(6, 8, 10, 24.00, 240.00),
(6, 9, 8, 21.00, 168.00),
-- SAL-2025-007
(7, 11, 8, 32.00, 256.00),
(7, 14, 6, 26.00, 156.00),
-- SAL-2025-008
(8, 4, 15, 15.00, 225.00),
(8, 17, 5, 12.00, 60.00),
-- SAL-2025-009
(9, 4, 8, 15.00, 120.00),
(9, 20, 4, 8.00, 32.00),
-- SAL-2025-010
(10, 11, 12, 32.00, 384.00),
(10, 8, 8, 24.00, 192.00);

-- ==============================================
-- FORECASTS - AI predictions
-- ==============================================
DELETE FROM Forecasts;

INSERT INTO Forecasts (product_id, forecast_date, predicted_demand, confidence_score, recommended_order, notes) VALUES
(4, '2025-02-01', 250, 0.85, 100, 'High demand expected - weekend events'),
(7, '2025-02-01', 150, 0.78, 60, 'Steady demand - Tiger beer popular'),
(11, '2025-02-01', 80, 0.72, 40, 'Premium segment - special events'),
(16, '2025-02-01', 200, 0.90, 80, 'Soft drinks always in demand'),
(19, '2025-02-01', 180, 0.88, 70, 'Red Bull high velocity item');

-- Verify data
SELECT 'Users: ' || COUNT(*) FROM Users;
SELECT 'Suppliers: ' || COUNT(*) FROM Suppliers;
SELECT 'Products: ' || COUNT(*) FROM Products;
SELECT 'Customers: ' || COUNT(*) FROM Customers;
SELECT 'Purchase Orders: ' || COUNT(*) FROM PurchaseOrders;
SELECT 'Sales: ' || COUNT(*) FROM Sales;
