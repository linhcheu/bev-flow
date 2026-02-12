// Seed Daily Stock Reports for February 2026
import { execute, queryAll, queryOne, isProduction, getSupabase } from '~/server/utils/db';

// Shared seed data
const feb1Opening: Record<number, number> = {
  1: 0, 2: 5, 3: 5, 4: 9, 5: 10, 6: 2, 7: 3, 8: 0, 9: 6, 10: 8,
};

const purchases: Record<string, number> = {
  '1-1': 10, '1-8': 10,
  '2-2': 5, '2-3': 5, '2-6': 5, '2-7': 5,
  '4-1': 35, '4-4': 35,
  '5-5': 35, '5-10': 35,
  '7-2': 35, '7-3': 35,
  '8-6': 35, '8-8': 35,
  '9-7': 34, '9-9': 35,
  '11-1': 35, '11-10': 35,
  '13-2': 35, '13-4': 35,
  '14-5': 35, '14-6': 35,
  '15-3': 36, '15-8': 35,
  '16-7': 34, '16-9': 35,
  '18-1': 35, '18-10': 35,
  '19-2': 35, '19-4': 35,
  '20-5': 35, '20-6': 35,
  '21-3': 36, '21-8': 35,
  '22-7': 34, '22-9': 35,
  '24-1': 35, '24-10': 35,
  '25-2': 35, '25-4': 35,
  '26-5': 35, '26-6': 35,
  '27-3': 36, '27-8': 35,
  '28-7': 34, '28-9': 35,
};

const dailySales: number[][] = [
  [1, 0, 2, 0, 0, 0, 0, 3, 0, 0],
  [4, 0, 2, 3, 1, 1, 0, 0, 1, 4],
  [8, 3, 5, 6, 7, 4, 5, 2, 3, 6],
  [12, 7, 3, 4, 9, 6, 8, 5, 7, 5],
  [6, 8, 6, 7, 5, 3, 4, 8, 9, 7],
  [10, 5, 7, 3, 8, 9, 6, 7, 5, 8],
  [8, 6, 9, 8, 11, 7, 5, 10, 6, 9],
  [11, 9, 8, 7, 6, 5, 12, 4, 8, 7],
  [7, 5, 4, 9, 8, 10, 6, 11, 7, 5],
  [9, 8, 6, 5, 7, 8, 10, 7, 9, 11],
  [6, 7, 8, 10, 9, 6, 8, 5, 7, 6],
  [13, 9, 7, 8, 5, 11, 6, 7, 9, 8],
  [8, 6, 11, 5, 10, 7, 9, 6, 8, 7],
  [10, 8, 7, 9, 6, 8, 5, 10, 7, 9],
  [7, 5, 9, 6, 8, 7, 11, 4, 6, 8],
  [9, 7, 6, 8, 5, 9, 7, 8, 5, 7],
  [11, 8, 10, 7, 9, 6, 5, 7, 8, 10],
  [6, 9, 5, 8, 7, 10, 8, 6, 7, 5],
  [8, 5, 7, 6, 9, 8, 6, 9, 5, 8],
  [10, 7, 8, 5, 6, 7, 9, 8, 6, 7],
  [7, 8, 6, 9, 8, 5, 7, 6, 9, 8],
  [9, 6, 7, 8, 5, 9, 6, 7, 8, 6],
  [8, 7, 9, 6, 7, 8, 5, 8, 7, 9],
  [6, 9, 5, 7, 8, 6, 8, 5, 9, 7],
  [10, 5, 8, 6, 7, 9, 7, 6, 5, 8],
  [7, 8, 6, 9, 5, 7, 6, 8, 7, 6],
  [9, 6, 7, 5, 8, 8, 9, 5, 6, 9],
  [8, 7, 5, 8, 6, 7, 5, 7, 8, 7],
];

export default defineEventHandler(async () => {
  // === PRODUCTION: Supabase ===
  if (isProduction()) {
    const supabase = getSupabase();

    // Get all products
    const { data: products } = await supabase
      .from('products')
      .select('product_id, product_name, safety_stock, current_stock')
      .eq('is_active', true)
      .order('product_id', { ascending: true });

    if (!products || products.length === 0) {
      return { success: false, message: 'No products found' };
    }

    // Delete existing Feb 2026 data
    await supabase
      .from('dailystockreports')
      .delete()
      .gte('report_date', '2026-02-01')
      .lte('report_date', '2026-02-28');

    // Track current stock
    const currentStock: Record<number, number> = {};
    products.forEach(p => {
      currentStock[p.product_id] = feb1Opening[p.product_id] ?? 0;
    });

    let insertedCount = 0;
    const batchRows: any[] = [];

    for (let day = 1; day <= 28; day++) {
      const dateStr = `2026-02-${String(day).padStart(2, '0')}`;
      const dayIndex = day - 1;

      products.forEach((product, idx) => {
        const pid = product.product_id;
        const opening = currentStock[pid] || 0;
        const purchased = purchases[`${day}-${pid}`] || 0;
        const maxSellable = opening + purchased;
        const sold = Math.min(dailySales[dayIndex]?.[idx] || 0, maxSellable);
        const closing = opening + purchased - sold;

        batchRows.push({
          product_id: pid,
          report_date: dateStr,
          opening_stock: opening,
          purchased_qty: purchased,
          sold_qty: sold,
          closing_stock: closing,
        });

        currentStock[pid] = closing;
        insertedCount++;
      });
    }

    // Insert in batches of 100
    for (let i = 0; i < batchRows.length; i += 100) {
      const batch = batchRows.slice(i, i + 100);
      const { error } = await supabase.from('dailystockreports').upsert(batch, { onConflict: 'product_id,report_date' });
      if (error) throw createError({ statusCode: 500, message: `Seed error: ${error.message}` });
    }

    // Update products with final closing stock
    for (const product of products) {
      const finalStock = currentStock[product.product_id] || 0;
      await supabase.from('products').update({ current_stock: finalStock }).eq('product_id', product.product_id);
    }

    return {
      success: true,
      message: `Seeded ${insertedCount} daily stock report records for Feb 2026 (Supabase)`,
      daysGenerated: 28,
      productsCount: products.length,
    };
  }

  // === DEVELOPMENT: SQLite ===
  // Create table if not exists
  execute(`
    CREATE TABLE IF NOT EXISTS DailyStockReports (
      report_id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      report_date DATE NOT NULL,
      opening_stock INTEGER DEFAULT 0,
      purchased_qty INTEGER DEFAULT 0,
      sold_qty INTEGER DEFAULT 0,
      closing_stock INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
      UNIQUE(product_id, report_date)
    )
  `);

  // Clear existing Feb 2026 data
  execute(`DELETE FROM DailyStockReports WHERE report_date BETWEEN '2026-02-01' AND '2026-02-28'`);

  // Get all products
  const products = queryAll<{ product_id: number; product_name: string; safety_stock: number; current_stock: number }>(
    `SELECT product_id, product_name, safety_stock, current_stock FROM Products WHERE is_active = 1 ORDER BY product_id`
  );

  if (products.length === 0) {
    return { success: false, message: 'No products found' };
  }

  // Track current stock for each product (opening for Feb 1)
  const currentStock: Record<number, number> = {};
  products.forEach((p, idx) => {
    currentStock[p.product_id] = feb1Opening[p.product_id] ?? 0;
  });

  let insertedCount = 0;

  // Generate 28 days of data
  for (let day = 1; day <= 28; day++) {
    const dateStr = `2026-02-${String(day).padStart(2, '0')}`;
    const dayIndex = day - 1;

    products.forEach((product, idx) => {
      const pid = product.product_id;
      const opening = currentStock[pid] || 0;
      const purchased = purchases[`${day}-${pid}`] || 0;
      const maxSellable = opening + purchased;
      const sold = Math.min(dailySales[dayIndex]?.[idx] || 0, maxSellable);
      const closing = opening + purchased - sold;

      execute(
        `INSERT OR REPLACE INTO DailyStockReports (product_id, report_date, opening_stock, purchased_qty, sold_qty, closing_stock)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [pid, dateStr, opening, purchased, sold, closing]
      );

      // Update current stock for next day
      currentStock[pid] = closing;
      insertedCount++;
    });
  }

  // Update the Products table with the final closing stock as current_stock
  products.forEach(product => {
    const finalStock = currentStock[product.product_id] || 0;
    execute(`UPDATE Products SET current_stock = ? WHERE product_id = ?`, [finalStock, product.product_id]);
  });

  return {
    success: true,
    message: `Seeded ${insertedCount} daily stock report records for Feb 2026`,
    daysGenerated: 28,
    productsCount: products.length,
  };
});
