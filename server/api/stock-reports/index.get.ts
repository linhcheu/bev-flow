// Get Daily Stock Reports - with date filter
import { queryAll, queryOne, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const date = query.date as string || new Date().toISOString().split('T')[0];
  const month = query.month as string; // e.g., '2026-02'
  const productId = query.product_id as string;

  // === PRODUCTION: Supabase ===
  if (isProduction()) {
    const supabase = getSupabase();

    if (month) {
      const startDate = `${month}-01`;
      const endDate = `${month}-31`;

      let q = supabase
        .from('dailystockreports')
        .select('*, products(product_name, sku, description)')
        .gte('report_date', startDate)
        .lte('report_date', endDate)
        .order('report_date', { ascending: true })
        .order('product_id', { ascending: true });

      if (productId) q = q.eq('product_id', parseInt(productId));

      const { data, error } = await q;
      if (error) throw createError({ statusCode: 500, message: error.message });

      const reports = (data || []).map((r: any) => ({
        report_id: r.report_id,
        product_id: r.product_id,
        product_name: r.products?.product_name,
        sku: r.products?.sku,
        description: r.products?.description,
        report_date: r.report_date,
        opening_stock: r.opening_stock,
        purchased_qty: r.purchased_qty,
        sold_qty: r.sold_qty,
        closing_stock: r.closing_stock,
      }));

      return { data: reports, date: null, month };
    }

    // Single date
    let q = supabase
      .from('dailystockreports')
      .select('*, products(product_name, sku, description)')
      .eq('report_date', date)
      .order('product_id', { ascending: true });

    if (productId) q = q.eq('product_id', parseInt(productId));

    const { data, error } = await q;
    if (error) throw createError({ statusCode: 500, message: error.message });

    const reports = (data || []).map((r: any) => ({
      report_id: r.report_id,
      product_id: r.product_id,
      product_name: r.products?.product_name,
      sku: r.products?.sku,
      description: r.products?.description,
      report_date: r.report_date,
      opening_stock: r.opening_stock,
      purchased_qty: r.purchased_qty,
      sold_qty: r.sold_qty,
      closing_stock: r.closing_stock,
    }));

    const totalOpening = reports.reduce((s: number, r: any) => s + (r.opening_stock || 0), 0);
    const totalPurchased = reports.reduce((s: number, r: any) => s + (r.purchased_qty || 0), 0);
    const totalSold = reports.reduce((s: number, r: any) => s + (r.sold_qty || 0), 0);
    const totalClosing = reports.reduce((s: number, r: any) => s + (r.closing_stock || 0), 0);

    return {
      data: reports,
      date,
      month: null,
      summary: { totalOpening, totalPurchased, totalSold, totalClosing },
    };
  }

  // === DEVELOPMENT: SQLite ===
  if (month) {
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;

    let sql = `
      SELECT d.report_id, d.product_id, p.product_name, p.sku, p.description,
             d.report_date, d.opening_stock, d.purchased_qty, d.sold_qty, d.closing_stock
      FROM DailyStockReports d
      JOIN Products p ON d.product_id = p.product_id
      WHERE d.report_date BETWEEN ? AND ?
    `;
    const params: any[] = [startDate, endDate];

    if (productId) {
      sql += ` AND d.product_id = ?`;
      params.push(parseInt(productId));
    }

    sql += ` ORDER BY d.report_date ASC, d.product_id ASC`;

    const reports = queryAll(sql, params);
    return { data: reports, date: null, month };
  }

  let sql = `
    SELECT d.report_id, d.product_id, p.product_name, p.sku, p.description,
           d.report_date, d.opening_stock, d.purchased_qty, d.sold_qty, d.closing_stock
    FROM DailyStockReports d
    JOIN Products p ON d.product_id = p.product_id
    WHERE d.report_date = ?
  `;
  const params: any[] = [date];

  if (productId) {
    sql += ` AND d.product_id = ?`;
    params.push(parseInt(productId));
  }

  sql += ` ORDER BY d.product_id ASC`;

  const reports = queryAll(sql, params);

  const summary = queryOne<{ total_opening: number; total_purchased: number; total_sold: number; total_closing: number }>(`
    SELECT 
      COALESCE(SUM(opening_stock), 0) as total_opening,
      COALESCE(SUM(purchased_qty), 0) as total_purchased,
      COALESCE(SUM(sold_qty), 0) as total_sold,
      COALESCE(SUM(closing_stock), 0) as total_closing
    FROM DailyStockReports
    WHERE report_date = ?
  `, [date]);

  return {
    data: reports,
    date,
    month: null,
    summary: {
      totalOpening: summary?.total_opening || 0,
      totalPurchased: summary?.total_purchased || 0,
      totalSold: summary?.total_sold || 0,
      totalClosing: summary?.total_closing || 0,
    }
  };
});
