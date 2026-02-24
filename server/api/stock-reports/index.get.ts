// Get Daily Stock Reports - with date filter
import { queryAll, queryOne, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const date = query.date as string || new Date().toISOString().split('T')[0];
  const month = query.month as string; // e.g., '2026-02'
  const productId = query.product_id as string;

  const mapReport = (r: any) => ({
    report_id: r.report_id,
    product_id: r.product_id,
    product_name: r.products?.product_name ?? r.product_name,
    sku: r.products?.sku ?? r.sku,
    description: r.products?.description ?? r.description,
    report_date: r.report_date,
    // Big Stock
    big_opening: r.big_opening ?? 0,
    big_purchase_in: r.big_purchase_in ?? 0,
    big_move_out: r.big_move_out ?? 0,
    big_remaining: r.big_remaining ?? 0,
    // Small Stock
    small_opening: r.small_opening ?? 0,
    small_move_in: r.small_move_in ?? 0,
    small_sell_out: r.small_sell_out ?? 0,
    small_closing: r.small_closing ?? 0,
    // Legacy
    opening_stock: r.opening_stock ?? 0,
    purchased_qty: r.purchased_qty ?? 0,
    sold_qty: r.sold_qty ?? 0,
    closing_stock: r.closing_stock ?? 0,
  });

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

      const reports = (data || []).map(mapReport);
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

    const reports = (data || []).map(mapReport);

    const summary = {
      totalBigOpening: reports.reduce((s, r) => s + r.big_opening, 0),
      totalBigPurchaseIn: reports.reduce((s, r) => s + r.big_purchase_in, 0),
      totalBigMoveOut: reports.reduce((s, r) => s + r.big_move_out, 0),
      totalBigRemaining: reports.reduce((s, r) => s + r.big_remaining, 0),
      totalSmallOpening: reports.reduce((s, r) => s + r.small_opening, 0),
      totalSmallMoveIn: reports.reduce((s, r) => s + r.small_move_in, 0),
      totalSmallSellOut: reports.reduce((s, r) => s + r.small_sell_out, 0),
      totalSmallClosing: reports.reduce((s, r) => s + r.small_closing, 0),
      // Legacy
      totalOpening: reports.reduce((s, r) => s + r.opening_stock, 0),
      totalPurchased: reports.reduce((s, r) => s + r.purchased_qty, 0),
      totalSold: reports.reduce((s, r) => s + r.sold_qty, 0),
      totalClosing: reports.reduce((s, r) => s + r.closing_stock, 0),
    };

    return { data: reports, date, month: null, summary };
  }

  // === DEVELOPMENT: SQLite ===
  if (month) {
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;

    let sql = `
      SELECT d.*, p.product_name, p.sku, p.description
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

    const reports = queryAll(sql, params).map(mapReport);
    return { data: reports, date: null, month };
  }

  let sql = `
    SELECT d.*, p.product_name, p.sku, p.description
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

  const reports = queryAll(sql, params).map(mapReport);

  const summary = {
    totalBigOpening: reports.reduce((s: number, r: any) => s + r.big_opening, 0),
    totalBigPurchaseIn: reports.reduce((s: number, r: any) => s + r.big_purchase_in, 0),
    totalBigMoveOut: reports.reduce((s: number, r: any) => s + r.big_move_out, 0),
    totalBigRemaining: reports.reduce((s: number, r: any) => s + r.big_remaining, 0),
    totalSmallOpening: reports.reduce((s: number, r: any) => s + r.small_opening, 0),
    totalSmallMoveIn: reports.reduce((s: number, r: any) => s + r.small_move_in, 0),
    totalSmallSellOut: reports.reduce((s: number, r: any) => s + r.small_sell_out, 0),
    totalSmallClosing: reports.reduce((s: number, r: any) => s + r.small_closing, 0),
    totalOpening: reports.reduce((s: number, r: any) => s + r.opening_stock, 0),
    totalPurchased: reports.reduce((s: number, r: any) => s + r.purchased_qty, 0),
    totalSold: reports.reduce((s: number, r: any) => s + r.sold_qty, 0),
    totalClosing: reports.reduce((s: number, r: any) => s + r.closing_stock, 0),
  };

  return { data: reports, date, month: null, summary };
});
