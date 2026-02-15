// Helper to keep DailyStockReports in sync with sales & purchase transactions
// Called from sales (create/update/delete) and purchase-orders (received)
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';

/**
 * Update DailyStockReports for a given product on a given date.
 * Creates the row if it doesn't exist (opening = previous day's closing).
 *
 * @param productId  - product_id
 * @param date       - YYYY-MM-DD string
 * @param soldDelta  - positive = more sold, negative = reversed/reduced
 * @param purchasedDelta - positive = goods received, negative = reversed
 */
export async function updateDailyStockReport(
  productId: number,
  date: string,
  soldDelta: number,
  purchasedDelta: number
) {
  if (isProduction()) {
    await updateSupabase(productId, date, soldDelta, purchasedDelta);
  } else {
    updateSQLite(productId, date, soldDelta, purchasedDelta);
  }
}

/**
 * Batch update — call for multiple products at once (e.g. a sale with many items)
 */
export async function batchUpdateDailyStockReport(
  items: { productId: number; soldDelta: number; purchasedDelta: number }[],
  date: string
) {
  for (const item of items) {
    await updateDailyStockReport(item.productId, date, item.soldDelta, item.purchasedDelta);
  }
}

// ─── Supabase (production) ───────────────────────────────────────
async function updateSupabase(
  productId: number,
  date: string,
  soldDelta: number,
  purchasedDelta: number
) {
  const supabase = getSupabase();

  // Check if row exists
  const { data: existing } = await supabase
    .from('dailystockreports')
    .select('report_id, opening_stock, purchased_qty, sold_qty')
    .eq('product_id', productId)
    .eq('report_date', date)
    .single();

  if (existing) {
    // Row exists → update deltas
    const newPurchased = Math.max(0, (existing.purchased_qty || 0) + purchasedDelta);
    const newSold = Math.max(0, (existing.sold_qty || 0) + soldDelta);
    const newClosing = (existing.opening_stock || 0) + newPurchased - newSold;

    await supabase
      .from('dailystockreports')
      .update({
        purchased_qty: newPurchased,
        sold_qty: newSold,
        closing_stock: Math.max(0, newClosing),
      })
      .eq('report_id', existing.report_id);
  } else {
    // No row → create one; opening = previous day's closing or current_stock
    const opening = await getOpeningStockSupabase(supabase, productId, date);
    const purchased = Math.max(0, purchasedDelta);
    const sold = Math.max(0, soldDelta);
    const closing = Math.max(0, opening + purchased - sold);

    await supabase.from('dailystockreports').upsert(
      {
        product_id: productId,
        report_date: date,
        opening_stock: opening,
        purchased_qty: purchased,
        sold_qty: sold,
        closing_stock: closing,
      },
      { onConflict: 'product_id,report_date' }
    );
  }
}

async function getOpeningStockSupabase(
  supabase: ReturnType<typeof getSupabase>,
  productId: number,
  date: string
): Promise<number> {
  // Try previous day's closing stock
  const prevDate = getPreviousDate(date);
  const { data: prev } = await supabase
    .from('dailystockreports')
    .select('closing_stock')
    .eq('product_id', productId)
    .eq('report_date', prevDate)
    .single();

  if (prev) return prev.closing_stock || 0;

  // Fallback: use current_stock from Products table
  const { data: product } = await supabase
    .from('products')
    .select('current_stock')
    .eq('product_id', productId)
    .single();

  return product?.current_stock || 0;
}

// ─── SQLite (development) ────────────────────────────────────────
function updateSQLite(
  productId: number,
  date: string,
  soldDelta: number,
  purchasedDelta: number
) {
  // Ensure table exists
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

  const existing = queryOne<{
    report_id: number;
    opening_stock: number;
    purchased_qty: number;
    sold_qty: number;
  }>(
    `SELECT report_id, opening_stock, purchased_qty, sold_qty
     FROM DailyStockReports WHERE product_id = ? AND report_date = ?`,
    [productId, date]
  );

  if (existing) {
    const newPurchased = Math.max(0, (existing.purchased_qty || 0) + purchasedDelta);
    const newSold = Math.max(0, (existing.sold_qty || 0) + soldDelta);
    const newClosing = Math.max(0, (existing.opening_stock || 0) + newPurchased - newSold);

    execute(
      `UPDATE DailyStockReports
       SET purchased_qty = ?, sold_qty = ?, closing_stock = ?
       WHERE report_id = ?`,
      [newPurchased, newSold, newClosing, existing.report_id]
    );
  } else {
    const opening = getOpeningStockSQLite(productId, date);
    const purchased = Math.max(0, purchasedDelta);
    const sold = Math.max(0, soldDelta);
    const closing = Math.max(0, opening + purchased - sold);

    execute(
      `INSERT OR REPLACE INTO DailyStockReports
       (product_id, report_date, opening_stock, purchased_qty, sold_qty, closing_stock)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [productId, date, opening, purchased, sold, closing]
    );
  }
}

function getOpeningStockSQLite(productId: number, date: string): number {
  // Try previous day's closing
  const prevDate = getPreviousDate(date);
  const prev = queryOne<{ closing_stock: number }>(
    `SELECT closing_stock FROM DailyStockReports
     WHERE product_id = ? AND report_date = ?`,
    [productId, prevDate]
  );

  if (prev) return prev.closing_stock || 0;

  // Fallback to products current_stock
  const product = queryOne<{ current_stock: number }>(
    `SELECT current_stock FROM Products WHERE product_id = ?`,
    [productId]
  );

  return product?.current_stock || 0;
}

// ─── Date helper ─────────────────────────────────────────────────
function getPreviousDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z'); // noon to avoid timezone issues
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0];
}
