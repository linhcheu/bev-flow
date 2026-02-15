// Get BoH (Balance on Hand) summary  
import { queryAll, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  // Accept ?month=YYYY-MM or default to current month
  const query = getQuery(event);
  const now = new Date();
  const monthParam = (query.month as string) || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthStart = `${monthParam}-01`;
  const monthEnd = `${monthParam}-31`;

  // === PRODUCTION: Supabase ===
  if (isProduction()) {
    const supabase = getSupabase();

    // Get products
    const { data: products, error: pErr } = await supabase
      .from('products')
      .select('product_id, product_name, sku, description, current_stock, safety_stock, reorder_quantity, min_stock_level, cost_price, selling_price')
      .eq('is_active', true)
      .order('product_id', { ascending: true });

    if (pErr) throw createError({ statusCode: 500, message: pErr.message });

    // Get monthly totals from dailystockreports
    const { data: totals, error: tErr } = await supabase
      .from('dailystockreports')
      .select('product_id, purchased_qty, sold_qty')
      .gte('report_date', monthStart)
      .lte('report_date', monthEnd);

    if (tErr) throw createError({ statusCode: 500, message: tErr.message });

    // Aggregate totals per product
    const totalsMap = new Map<number, { total_purchased: number; total_sold: number }>();
    (totals || []).forEach((r: any) => {
      const existing = totalsMap.get(r.product_id) || { total_purchased: 0, total_sold: 0 };
      existing.total_purchased += r.purchased_qty || 0;
      existing.total_sold += r.sold_qty || 0;
      totalsMap.set(r.product_id, existing);
    });

    const result = (products || []).map((p: any) => {
      const t = totalsMap.get(p.product_id);
      const needsReorder = p.current_stock <= p.safety_stock;
      return {
        product_id: p.product_id,
        product_name: p.product_name,
        description: p.description,
        sku: p.sku,
        current_stock: p.current_stock,
        safety_stock: p.safety_stock,
        reorder_point: p.min_stock_level,
        eoq: p.reorder_quantity,
        needs_reorder: needsReorder,
        total_purchased: t?.total_purchased || 0,
        total_sold: t?.total_sold || 0,
        cost_price: p.cost_price,
        selling_price: p.selling_price,
        inventory_value: p.current_stock * p.cost_price,
      };
    });

    const totalStock = result.reduce((sum: number, p: any) => sum + p.current_stock, 0);
    const totalValue = result.reduce((sum: number, p: any) => sum + p.inventory_value, 0);
    const needsReorderCount = result.filter((p: any) => p.needs_reorder).length;

    return {
      data: result,
      summary: {
        totalProducts: result.length,
        totalStock,
        totalValue,
        needsReorderCount,
        healthyCount: result.length - needsReorderCount,
      }
    };
  }

  // === DEVELOPMENT: SQLite ===
  // Get latest closing stock from daily stock reports for each product
  const bohData = queryAll<{
    product_id: number;
    product_name: string;
    sku: string;
    description: string;
    current_stock: number;
    safety_stock: number;
    reorder_quantity: number;
    min_stock_level: number;
    cost_price: number;
    selling_price: number;
  }>(`
    SELECT p.product_id, p.product_name, p.sku, p.description,
           p.current_stock, p.safety_stock, p.reorder_quantity, p.min_stock_level,
           p.cost_price, p.selling_price
    FROM Products p
    WHERE p.is_active = 1
    ORDER BY p.product_id ASC
  `);

  // Get monthly totals from DailyStockReports
  const monthlyTotals = queryAll<{
    product_id: number;
    total_purchased: number;
    total_sold: number;
  }>(`
    SELECT product_id,
           COALESCE(SUM(purchased_qty), 0) as total_purchased,
           COALESCE(SUM(sold_qty), 0) as total_sold
    FROM DailyStockReports
    WHERE report_date BETWEEN ? AND ?
    GROUP BY product_id
  `, [monthStart, monthEnd]);

  const totalsMap = new Map(monthlyTotals.map(t => [t.product_id, t]));

  const result = bohData.map(p => {
    const totals = totalsMap.get(p.product_id);
    const needsReorder = p.current_stock <= p.safety_stock;
    return {
      product_id: p.product_id,
      product_name: p.product_name,
      description: p.description,
      sku: p.sku,
      current_stock: p.current_stock,
      safety_stock: p.safety_stock,
      reorder_point: p.min_stock_level,
      eoq: p.reorder_quantity,
      needs_reorder: needsReorder,
      total_purchased: totals?.total_purchased || 0,
      total_sold: totals?.total_sold || 0,
      cost_price: p.cost_price,
      selling_price: p.selling_price,
      inventory_value: p.current_stock * p.cost_price,
    };
  });

  const totalStock = result.reduce((sum, p) => sum + p.current_stock, 0);
  const totalValue = result.reduce((sum, p) => sum + p.inventory_value, 0);
  const needsReorderCount = result.filter(p => p.needs_reorder).length;

  return {
    data: result,
    summary: {
      totalProducts: result.length,
      totalStock,
      totalValue,
      needsReorderCount,
      healthyCount: result.length - needsReorderCount,
    }
  };
});
