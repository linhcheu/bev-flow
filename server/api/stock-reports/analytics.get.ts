// Get ROP (Reorder Point) and EOQ (Economic Order Quantity) Analytics
import { queryAll, isProduction, getSupabase } from '~/server/utils/db';

// Constants from the spreadsheet
const SERVICE_LEVEL = 0.95;
const Z_SCORE = 1.64; // For 95% service level
const ORDERING_COST = 100.83; // (3600 + 30) / 36
const HOLDING_COST = 600.00; // 50 per month * 12

// Shared calculation logic
function calculateAnalytics(
  products: { product_id: number; sku: string; product_name: string; description: string; current_stock: number; safety_stock: number; supplier_id: number }[],
  leadTimeMap: Map<number, number>,
  demandByProduct: Map<number, number[]>
) {
  return products.map(product => {
    const demands = demandByProduct.get(product.product_id) || [];
    const leadTime = leadTimeMap.get(product.supplier_id) || 2;

    const totalDemand = demands.reduce((sum, d) => sum + d, 0);
    const avgDailyDemand = demands.length > 0 ? totalDemand / demands.length : 10;

    const mean = avgDailyDemand;
    const squaredDiffs = demands.map(d => Math.pow(d - mean, 2));
    const variance = squaredDiffs.length > 0 ? squaredDiffs.reduce((sum, d) => sum + d, 0) / squaredDiffs.length : 0;
    const stdDev = Math.sqrt(variance);

    const safetyStock = Math.round(Z_SCORE * stdDev * Math.sqrt(leadTime));
    const demandDuringLeadTime = Math.round(avgDailyDemand * leadTime);
    const reorderPoint = demandDuringLeadTime + safetyStock;
    const annualDemand = Math.round(avgDailyDemand * 365);
    const eoq = Math.round(Math.sqrt((2 * annualDemand * ORDERING_COST) / HOLDING_COST));
    const needsReorder = product.current_stock <= reorderPoint;

    return {
      product_id: product.product_id,
      sku: product.sku,
      product_name: product.product_name,
      description: product.description,
      lead_time_days: leadTime,
      std_dev_daily_demand: parseFloat(stdDev.toFixed(2)),
      safety_stock: safetyStock,
      avg_daily_demand: parseFloat(avgDailyDemand.toFixed(2)),
      demand_during_lead_time: demandDuringLeadTime,
      reorder_point: reorderPoint,
      annual_demand: annualDemand,
      eoq,
      current_stock: product.current_stock,
      needs_reorder: needsReorder,
    };
  });
}

function buildResponse(analytics: ReturnType<typeof calculateAnalytics>) {
  return {
    data: analytics,
    constants: {
      serviceLevel: SERVICE_LEVEL,
      zScore: Z_SCORE,
      orderingCost: ORDERING_COST,
      holdingCost: HOLDING_COST,
    },
    summary: {
      totalProducts: analytics.length,
      needsReorderCount: analytics.filter(a => a.needs_reorder).length,
      healthyCount: analytics.filter(a => !a.needs_reorder).length,
      avgEOQ: Math.round(analytics.reduce((sum, a) => sum + a.eoq, 0) / (analytics.length || 1)),
      avgSafetyStock: Math.round(analytics.reduce((sum, a) => sum + a.safety_stock, 0) / (analytics.length || 1)),
      avgReorderPoint: analytics.reduce((sum, a) => sum + a.reorder_point, 0) / (analytics.length || 1),
    }
  };
}

export default defineEventHandler(async () => {
  // === PRODUCTION: Supabase ===
  if (isProduction()) {
    const supabase = getSupabase();

    // Products
    const { data: prods } = await supabase
      .from('products')
      .select('product_id, sku, product_name, description, current_stock, safety_stock, min_stock_level, reorder_quantity, supplier_id')
      .eq('is_active', true)
      .order('product_id', { ascending: true });

    // Supplier lead times
    const { data: suppliers } = await supabase
      .from('suppliers')
      .select('supplier_id, lead_time_days')
      .eq('is_active', true);

    const leadTimeMap = new Map((suppliers || []).map((s: any) => [s.supplier_id, s.lead_time_days]));

    // Sales data from saleitems + sales
    const { data: salesRows } = await supabase
      .from('saleitems')
      .select('product_id, quantity, sales!inner(sale_date, status)')
      .eq('sales.status', 'Completed');

    // Stock report sales
    const { data: dsrRows } = await supabase
      .from('dailystockreports')
      .select('product_id, sold_qty')
      .gt('sold_qty', 0);

    // Build demand data
    const demandByProduct = new Map<number, number[]>();

    // Aggregate saleitems by product+date
    const dailyAgg = new Map<string, number>();
    (salesRows || []).forEach((r: any) => {
      const key = `${r.product_id}-${r.sales?.sale_date}`;
      dailyAgg.set(key, (dailyAgg.get(key) || 0) + (r.quantity || 0));
    });
    dailyAgg.forEach((qty, key) => {
      const pid = parseInt(key.split('-')[0]);
      if (!demandByProduct.has(pid)) demandByProduct.set(pid, []);
      demandByProduct.get(pid)!.push(qty);
    });

    (dsrRows || []).forEach((r: any) => {
      if (!demandByProduct.has(r.product_id)) demandByProduct.set(r.product_id, []);
      demandByProduct.get(r.product_id)!.push(r.sold_qty);
    });

    const analytics = calculateAnalytics(prods || [], leadTimeMap, demandByProduct);
    return buildResponse(analytics);
  }

  // === DEVELOPMENT: SQLite ===

  // Get product data with supplier lead times
  const products = queryAll<{
    product_id: number;
    sku: string;
    product_name: string;
    description: string;
    current_stock: number;
    safety_stock: number;
    min_stock_level: number;
    reorder_quantity: number;
    supplier_id: number;
  }>(`
    SELECT p.product_id, p.sku, p.product_name, p.description,
           p.current_stock, p.safety_stock, p.min_stock_level, p.reorder_quantity, p.supplier_id
    FROM Products p
    WHERE p.is_active = 1
    ORDER BY p.product_id ASC
  `);

  // Get lead times from suppliers
  const supplierLeadTimes = queryAll<{ supplier_id: number; lead_time_days: number }>(`
    SELECT supplier_id, lead_time_days FROM Suppliers WHERE is_active = 1
  `);
  const leadTimeMap = new Map(supplierLeadTimes.map(s => [s.supplier_id, s.lead_time_days]));

  // Get all daily sales data for computing demand statistics
  // Use SaleItems data (which has more historical data)
  const salesData = queryAll<{ product_id: number; sale_date: string; daily_qty: number }>(`
    SELECT si.product_id, s.sale_date, SUM(si.quantity) as daily_qty
    FROM SaleItems si
    JOIN Sales s ON si.sale_id = s.sale_id
    WHERE s.status = 'Completed'
    GROUP BY si.product_id, s.sale_date
    ORDER BY si.product_id, s.sale_date
  `);

  // Also use DailyStockReports if available
  const stockReportSales = queryAll<{ product_id: number; report_date: string; sold_qty: number }>(`
    SELECT product_id, report_date, sold_qty FROM DailyStockReports ORDER BY product_id, report_date
  `);

  // Build demand data per product
  const demandByProduct = new Map<number, number[]>();

  salesData.forEach(row => {
    if (!demandByProduct.has(row.product_id)) demandByProduct.set(row.product_id, []);
    demandByProduct.get(row.product_id)!.push(row.daily_qty);
  });

  stockReportSales.forEach(row => {
    if (row.sold_qty > 0) {
      if (!demandByProduct.has(row.product_id)) demandByProduct.set(row.product_id, []);
      demandByProduct.get(row.product_id)!.push(row.sold_qty);
    }
  });

  const analytics = calculateAnalytics(products, leadTimeMap, demandByProduct);
  return buildResponse(analytics);
});
