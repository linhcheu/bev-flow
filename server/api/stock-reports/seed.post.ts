// Seed Daily Stock Reports — Feb 1-2, 2026
import { execute, queryAll, isProduction, getSupabase } from '~/server/utils/db';

// Opening stock for each product on Feb 1 (product_id → qty)
const feb1Opening: Record<number, number> = {
  1: 0, 2: 5, 3: 5, 4: 9, 5: 10, 6: 2, 7: 3, 8: 0, 9: 6, 10: 8,
};

// Purchases: 'day-productId' → quantity purchased
const purchases: Record<string, number> = {
  // Feb 1 — Restock products that are out of stock
  '1-1': 10,   // ABC Extra Stout (was 0)
  '1-8': 10,   // Tiger Lager Beer Bottle (was 0)
  // Feb 2 — Scheduled delivery
  '2-2': 5,    // Anchor Beer
  '2-3': 5,    // Anchor Smooth White Beer
  '2-6': 5,    // Tiger Lager Beer
  '2-7': 5,    // Tiger Crystal
};

// Daily sales per product index (rows = days, cols = products in DB order)
const dailySales: number[][] = [
  //  P1  P2  P3  P4  P5  P6  P7  P8  P9  P10
  [   1,  0,  2,  0,  0,  0,  0,  3,  0,   0 ],  // Feb 1 (Sunday — quiet day)
  [   4,  0,  2,  3,  1,  1,  0,  0,  1,   4 ],  // Feb 2 (Monday — busier day)
];

const DAYS_TO_SEED = 2;

export default defineEventHandler(async () => {
  // === PRODUCTION: Supabase ===
  if (isProduction()) {
    const supabase = getSupabase();

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

    const currentStock: Record<number, number> = {};
    products.forEach(p => {
      currentStock[p.product_id] = feb1Opening[p.product_id] ?? p.current_stock ?? 0;
    });

    let insertedCount = 0;
    const batchRows: any[] = [];

    for (let day = 1; day <= DAYS_TO_SEED; day++) {
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

    // Insert
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
      message: `Seeded ${insertedCount} daily stock report records for Feb 1-${DAYS_TO_SEED}, 2026 (Supabase)`,
      daysGenerated: DAYS_TO_SEED,
      productsCount: products.length,
    };
  }

  // === DEVELOPMENT: SQLite ===
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

  const products = queryAll<{ product_id: number; product_name: string; safety_stock: number; current_stock: number }>(
    `SELECT product_id, product_name, safety_stock, current_stock FROM Products WHERE is_active = 1 ORDER BY product_id`
  );

  if (products.length === 0) {
    return { success: false, message: 'No products found' };
  }

  const currentStock: Record<number, number> = {};
  products.forEach(p => {
    currentStock[p.product_id] = feb1Opening[p.product_id] ?? p.current_stock ?? 0;
  });

  let insertedCount = 0;

  for (let day = 1; day <= DAYS_TO_SEED; day++) {
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

      currentStock[pid] = closing;
      insertedCount++;
    });
  }

  // Update Products table with final closing stock
  products.forEach(product => {
    const finalStock = currentStock[product.product_id] || 0;
    execute(`UPDATE Products SET current_stock = ? WHERE product_id = ?`, [finalStock, product.product_id]);
  });

  return {
    success: true,
    message: `Seeded ${insertedCount} daily stock report records for Feb 1-${DAYS_TO_SEED}, 2026`,
    daysGenerated: DAYS_TO_SEED,
    productsCount: products.length,
  };
});
