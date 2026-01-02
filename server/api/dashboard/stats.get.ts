// API endpoint for dashboard statistics - TODAY's data only
import { queryOne, queryAll, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async () => {
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    const today = new Date().toISOString().split('T')[0];
    
    // Get total products count
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    // Get total suppliers count
    const { count: supplierCount } = await supabase
      .from('suppliers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    // Get active POs count
    const { count: activePoCount } = await supabase
      .from('purchaseorders')
      .select('*', { count: 'exact', head: true })
      .not('status', 'in', '("Received","Cancelled")');
    
    // Get TODAY's sales
    const { data: todaySalesData } = await supabase
      .from('sales')
      .select('total_amount')
      .gte('sale_date', today)
      .lt('sale_date', new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    
    const todaySalesTotal = todaySalesData?.reduce((sum, s) => sum + Number(s.total_amount), 0) || 0;
    
    // Get TODAY's sales with product info for profit calculation
    const { data: salesWithProducts } = await supabase
      .from('sales')
      .select(`
        quantity,
        products (
          selling_price,
          cost_price
        )
      `)
      .gte('sale_date', today)
      .lt('sale_date', new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    
    const todayProfitTotal = salesWithProducts?.reduce((sum, s) => {
      const product = s.products as any;
      if (product) {
        return sum + ((Number(product.selling_price) - Number(product.cost_price)) * s.quantity);
      }
      return sum;
    }, 0) || 0;
    
    // Get TODAY's orders count
    const { count: todayOrdersCount } = await supabase
      .from('sales')
      .select('*', { count: 'exact', head: true })
      .gte('sale_date', today);
    
    // Get low stock products
    const { data: lowStockProducts } = await supabase
      .from('products')
      .select('product_id, product_name, current_stock, min_stock_level')
      .eq('is_active', true)
      .lt('current_stock', 50)
      .order('current_stock', { ascending: true })
      .limit(10);
    
    // Get recent sales
    const { data: recentSales } = await supabase
      .from('sales')
      .select(`
        sale_id,
        quantity,
        total_amount,
        sale_date,
        products (
          product_name
        )
      `)
      .gte('sale_date', today)
      .order('sale_date', { ascending: false })
      .limit(5);
    
    const formattedRecentSales = recentSales?.map(s => ({
      sale_id: s.sale_id,
      product_name: (s.products as any)?.product_name || 'Unknown',
      quantity: s.quantity,
      total_amount: s.total_amount,
      sale_date: s.sale_date
    })) || [];
    
    return {
      totalProducts: productCount || 0,
      totalSuppliers: supplierCount || 0,
      activePOs: activePoCount || 0,
      todaySales: todaySalesTotal,
      todayProfit: todayProfitTotal,
      todayOrders: todayOrdersCount || 0,
      lowStockProducts: lowStockProducts || [],
      recentSales: formattedRecentSales,
      analytics: {
        totalRevenue: todaySalesTotal,
        topProducts: [],
        categories: [],
        hourlySalesData: []
      }
    };
  }
  
  // Development: Use SQLite
  // Get total products count
  const productCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM Products WHERE is_active = 1');
  
  // Get total suppliers count
  const supplierCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM Suppliers WHERE is_active = 1');
  
  // Get active POs count
  const activePoCount = queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM PurchaseOrders WHERE status NOT IN ('received', 'cancelled')"
  );
  
  // Get TODAY's sales only
  const todaySales = queryOne<{ total: number }>(`
    SELECT COALESCE(SUM(total_amount), 0) as total 
    FROM Sales 
    WHERE date(sale_date) = date('now')
  `);
  
  // Get TODAY's profit only
  const todayProfit = queryOne<{ profit: number }>(`
    SELECT COALESCE(SUM((p.selling_price - p.cost_price) * s.quantity), 0) as profit
    FROM Sales s
    JOIN Products p ON s.product_id = p.product_id
    WHERE date(s.sale_date) = date('now')
  `);
  
  // Get TODAY's orders count
  const todayOrders = queryOne<{ count: number }>(`
    SELECT COUNT(*) as count FROM Sales WHERE date(sale_date) = date('now')
  `);
  
  // Get low stock products (stock below 50)
  const lowStockProducts = queryAll<{ product_id: number; product_name: string; current_stock: number; min_stock_level: number }>(`
    SELECT product_id, product_name, current_stock, min_stock_level
    FROM Products
    WHERE current_stock < 50 AND is_active = 1
    ORDER BY current_stock ASC
    LIMIT 10
  `);
  
  // Get recent sales (TODAY only)
  const recentSales = queryAll<{ sale_id: number; product_name: string; quantity: number; total_amount: number; sale_date: string }>(`
    SELECT s.sale_id, p.product_name, s.quantity, s.total_amount, s.sale_date
    FROM Sales s
    JOIN Products p ON s.product_id = p.product_id
    WHERE date(s.sale_date) = date('now')
    ORDER BY s.sale_date DESC
    LIMIT 5
  `);
  
  // Get top selling products (TODAY only)
  const topProducts = queryAll<{ product_name: string; description: string; total_sold: number }>(`
    SELECT p.product_name, COALESCE(p.description, 'Beer') as description, 
           COALESCE(SUM(s.quantity), 0) as total_sold
    FROM Products p
    LEFT JOIN Sales s ON p.product_id = s.product_id AND date(s.sale_date) = date('now')
    WHERE p.is_active = 1
    GROUP BY p.product_id, p.product_name, p.description
    HAVING total_sold > 0
    ORDER BY total_sold DESC
    LIMIT 5
  `);
  
  // Get sales by product (TODAY only)
  const salesByProduct = queryAll<{ product_name: string; total_revenue: number }>(`
    SELECT p.product_name, COALESCE(SUM(s.total_amount), 0) as total_revenue
    FROM Products p
    LEFT JOIN Sales s ON p.product_id = s.product_id AND date(s.sale_date) = date('now')
    WHERE p.is_active = 1
    GROUP BY p.product_id, p.product_name
    HAVING total_revenue > 0
    ORDER BY total_revenue DESC
    LIMIT 8
  `);
  
  // Get TODAY's total revenue
  const totalRevenue = queryOne<{ total: number }>(`
    SELECT COALESCE(SUM(total_amount), 0) as total FROM Sales WHERE date(sale_date) = date('now')
  `);
  
  // Get hourly sales data for TODAY (for trend chart)
  const hourlySalesData = queryAll<{ hour: string; total: number }>(`
    SELECT strftime('%H', sale_date) as hour, SUM(total_amount) as total
    FROM Sales
    WHERE date(sale_date) = date('now')
    GROUP BY strftime('%H', sale_date)
    ORDER BY hour ASC
  `);
  
  // Calculate percentages for category chart
  const totalCategoryRevenue = salesByProduct.reduce((sum, p) => sum + (p.total_revenue || 0), 0);
  const categoryColors = ['#8b5cf6', '#3b82f6', '#22c55e', '#06b6d4', '#ec4899', '#f59e0b', '#eab308', '#f97316'];
  
  const categories = salesByProduct.map((product, index) => ({
    name: product.product_name || 'Other',
    percentage: totalCategoryRevenue > 0 ? Math.round((product.total_revenue / totalCategoryRevenue) * 100) : 0,
    color: categoryColors[index % categoryColors.length],
    revenue: product.total_revenue || 0
  }));
  
  // Ensure percentages add up to 100
  if (categories.length > 0) {
    const sum = categories.reduce((s, c) => s + c.percentage, 0);
    if (sum !== 100 && sum > 0) {
      categories[0].percentage += (100 - sum);
    }
  }
  
  // Format hourly data for chart
  const hourlyDataForChart = hourlySalesData.map(h => ({
    hour: `${h.hour}:00`,
    total: h.total
  }));
  
  return {
    totalProducts: productCount?.count || 0,
    totalSuppliers: supplierCount?.count || 0,
    activePOs: activePoCount?.count || 0,
    todaySales: todaySales?.total || 0,
    todayProfit: todayProfit?.profit || 0,
    todayOrders: todayOrders?.count || 0,
    lowStockProducts,
    recentSales,
    // Today's analytics data
    analytics: {
      totalRevenue: totalRevenue?.total || 0,
      topProducts: topProducts.map(p => ({
        name: p.product_name,
        type: p.description || 'Beer',
        sold: p.total_sold
      })),
      categories,
      hourlySalesData: hourlyDataForChart
    }
  };
});
