// API endpoint for dashboard statistics
import { queryOne, queryAll } from '~/server/utils/db';

export default defineEventHandler(async () => {
  // Get total products count
  const productCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM Products WHERE is_active = 1');
  
  // Get total suppliers count
  const supplierCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM Suppliers WHERE is_active = 1');
  
  // Get active POs count
  const activePoCount = queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM PurchaseOrders WHERE status NOT IN ('received', 'cancelled')"
  );
  
  // Get monthly sales (current month)
  const monthlySales = queryOne<{ total: number }>(`
    SELECT COALESCE(SUM(total_amount), 0) as total 
    FROM Sales 
    WHERE strftime('%Y-%m', sale_date) = strftime('%Y-%m', 'now')
  `);
  
  // Get monthly profit (current month)
  const monthlyProfit = queryOne<{ profit: number }>(`
    SELECT COALESCE(SUM((p.selling_price - p.cost_price) * s.quantity), 0) as profit
    FROM Sales s
    JOIN Products p ON s.product_id = p.product_id
    WHERE strftime('%Y-%m', s.sale_date) = strftime('%Y-%m', 'now')
  `);
  
  // Get low stock products
  const lowStockProducts = queryAll<{ product_id: number; product_name: string; current_stock: number; min_stock_level: number }>(`
    SELECT product_id, product_name, current_stock, min_stock_level
    FROM Products
    WHERE current_stock <= min_stock_level AND is_active = 1
    ORDER BY (current_stock - min_stock_level) ASC
    LIMIT 5
  `);
  
  // Get recent sales
  const recentSales = queryAll<{ sale_id: number; product_name: string; quantity: number; total_amount: number; sale_date: string }>(`
    SELECT s.sale_id, p.product_name, s.quantity, s.total_amount, s.sale_date
    FROM Sales s
    JOIN Products p ON s.product_id = p.product_id
    ORDER BY s.sale_date DESC
    LIMIT 5
  `);
  
  return {
    totalProducts: productCount?.count || 0,
    totalSuppliers: supplierCount?.count || 0,
    activePOs: activePoCount?.count || 0,
    monthlySales: monthlySales?.total || 0,
    monthlyProfit: monthlyProfit?.profit || 0,
    lowStockProducts,
    recentSales
  };
});
