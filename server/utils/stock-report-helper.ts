// Helper to keep DailyStockReports in sync with sales & purchase transactions
// Called from sales (create/update/delete) and purchase-orders (received)
//
// Stock flow model:
//   Purchases → Big Stock (warehouse)
//   Big Stock → Move out → Small Stock (shop floor)
//   Small Stock → Sell out → Customer
//
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';

interface StockDeltas {
  /** Goods received into big stock (purchase orders) */
  bigPurchaseInDelta?: number;
  /** Goods moved from big to small stock */
  moveDelta?: number;
  /** Goods sold from small stock */
  smallSellOutDelta?: number;
  // Legacy deltas (kept for backward compatibility)
  soldDelta?: number;
  purchasedDelta?: number;
}

/**
 * Update DailyStockReports for a given product on a given date.
 * Creates the row if it doesn't exist (opening = previous day's remaining/closing).
 */
export async function updateDailyStockReport(
  productId: number,
  date: string,
  soldDelta: number,
  purchasedDelta: number,
  moveDelta: number = 0
) {
  const deltas: StockDeltas = {
    bigPurchaseInDelta: purchasedDelta,
    moveDelta,
    smallSellOutDelta: soldDelta,
    soldDelta,
    purchasedDelta,
  };

  if (isProduction()) {
    await updateSupabase(productId, date, deltas);
  } else {
    updateSQLite(productId, date, deltas);
  }
}

/**
 * Batch update — call for multiple products at once (e.g. a sale with many items)
 */
export async function batchUpdateDailyStockReport(
  items: { productId: number; soldDelta: number; purchasedDelta: number; moveDelta?: number }[],
  date: string
) {
  for (const item of items) {
    await updateDailyStockReport(item.productId, date, item.soldDelta, item.purchasedDelta, item.moveDelta ?? 0);
  }
}

// ─── Supabase (production) ───────────────────────────────────────
async function updateSupabase(productId: number, date: string, d: StockDeltas) {
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from('dailystockreports')
    .select('report_id, opening_stock, purchased_qty, sold_qty, big_opening, big_purchase_in, big_move_out, big_remaining, small_opening, small_move_in, small_sell_out, small_closing')
    .eq('product_id', productId)
    .eq('report_date', date)
    .single();

  if (existing) {
    // Update big stock
    const newBigPurchaseIn = Math.max(0, (existing.big_purchase_in || 0) + (d.bigPurchaseInDelta || 0));
    const newBigMoveOut = Math.max(0, (existing.big_move_out || 0) + (d.moveDelta || 0));
    const newBigRemaining = (existing.big_opening || 0) + newBigPurchaseIn - newBigMoveOut;

    // Update small stock
    const newSmallMoveIn = Math.max(0, (existing.small_move_in || 0) + (d.moveDelta || 0));
    const newSmallSellOut = Math.max(0, (existing.small_sell_out || 0) + (d.smallSellOutDelta || 0));
    const newSmallClosing = (existing.small_opening || 0) + newSmallMoveIn - newSmallSellOut;

    // Legacy
    const newPurchased = Math.max(0, (existing.purchased_qty || 0) + (d.purchasedDelta || 0));
    const newSold = Math.max(0, (existing.sold_qty || 0) + (d.soldDelta || 0));
    const newClosing = (existing.opening_stock || 0) + newPurchased - newSold;

    await supabase
      .from('dailystockreports')
      .update({
        big_purchase_in: newBigPurchaseIn,
        big_move_out: newBigMoveOut,
        big_remaining: Math.max(0, newBigRemaining),
        small_move_in: newSmallMoveIn,
        small_sell_out: newSmallSellOut,
        small_closing: Math.max(0, newSmallClosing),
        purchased_qty: newPurchased,
        sold_qty: newSold,
        closing_stock: Math.max(0, newClosing),
      })
      .eq('report_id', existing.report_id);
  } else {
    const { bigOpening, smallOpening, legacyOpening } = await getOpeningStocksSupabase(supabase, productId, date);

    const bigPurchaseIn = Math.max(0, d.bigPurchaseInDelta || 0);
    const bigMoveOut = Math.max(0, d.moveDelta || 0);
    const bigRemaining = Math.max(0, bigOpening + bigPurchaseIn - bigMoveOut);

    const smallMoveIn = Math.max(0, d.moveDelta || 0);
    const smallSellOut = Math.max(0, d.smallSellOutDelta || 0);
    const smallClosing = Math.max(0, smallOpening + smallMoveIn - smallSellOut);

    const purchased = Math.max(0, d.purchasedDelta || 0);
    const sold = Math.max(0, d.soldDelta || 0);
    const closing = Math.max(0, legacyOpening + purchased - sold);

    await supabase.from('dailystockreports').upsert(
      {
        product_id: productId,
        report_date: date,
        big_opening: bigOpening,
        big_purchase_in: bigPurchaseIn,
        big_move_out: bigMoveOut,
        big_remaining: bigRemaining,
        small_opening: smallOpening,
        small_move_in: smallMoveIn,
        small_sell_out: smallSellOut,
        small_closing: smallClosing,
        opening_stock: legacyOpening,
        purchased_qty: purchased,
        sold_qty: sold,
        closing_stock: closing,
      },
      { onConflict: 'product_id,report_date' }
    );
  }
}

async function getOpeningStocksSupabase(
  supabase: ReturnType<typeof getSupabase>,
  productId: number,
  date: string
) {
  const prevDate = getPreviousDate(date);
  const { data: prev } = await supabase
    .from('dailystockreports')
    .select('big_remaining, small_closing, closing_stock')
    .eq('product_id', productId)
    .eq('report_date', prevDate)
    .single();

  if (prev) {
    return {
      bigOpening: prev.big_remaining || 0,
      smallOpening: prev.small_closing || 0,
      legacyOpening: prev.closing_stock || 0,
    };
  }

  // Fallback: use current_stock from Products table
  const { data: product } = await supabase
    .from('products')
    .select('current_stock')
    .eq('product_id', productId)
    .single();

  const stock = product?.current_stock || 0;
  return { bigOpening: stock, smallOpening: 0, legacyOpening: stock };
}

// ─── SQLite (development) ────────────────────────────────────────
function updateSQLite(productId: number, date: string, d: StockDeltas) {
  execute(`
    CREATE TABLE IF NOT EXISTS DailyStockReports (
      report_id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      report_date DATE NOT NULL,
      opening_stock INTEGER DEFAULT 0,
      purchased_qty INTEGER DEFAULT 0,
      sold_qty INTEGER DEFAULT 0,
      closing_stock INTEGER DEFAULT 0,
      big_opening INTEGER DEFAULT 0,
      big_purchase_in INTEGER DEFAULT 0,
      big_move_out INTEGER DEFAULT 0,
      big_remaining INTEGER DEFAULT 0,
      small_opening INTEGER DEFAULT 0,
      small_move_in INTEGER DEFAULT 0,
      small_sell_out INTEGER DEFAULT 0,
      small_closing INTEGER DEFAULT 0,
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
    big_opening: number;
    big_purchase_in: number;
    big_move_out: number;
    small_opening: number;
    small_move_in: number;
    small_sell_out: number;
  }>(
    `SELECT report_id, opening_stock, purchased_qty, sold_qty,
            big_opening, big_purchase_in, big_move_out,
            small_opening, small_move_in, small_sell_out
     FROM DailyStockReports WHERE product_id = ? AND report_date = ?`,
    [productId, date]
  );

  if (existing) {
    const newBigPurchaseIn = Math.max(0, (existing.big_purchase_in || 0) + (d.bigPurchaseInDelta || 0));
    const newBigMoveOut = Math.max(0, (existing.big_move_out || 0) + (d.moveDelta || 0));
    const newBigRemaining = Math.max(0, (existing.big_opening || 0) + newBigPurchaseIn - newBigMoveOut);

    const newSmallMoveIn = Math.max(0, (existing.small_move_in || 0) + (d.moveDelta || 0));
    const newSmallSellOut = Math.max(0, (existing.small_sell_out || 0) + (d.smallSellOutDelta || 0));
    const newSmallClosing = Math.max(0, (existing.small_opening || 0) + newSmallMoveIn - newSmallSellOut);

    const newPurchased = Math.max(0, (existing.purchased_qty || 0) + (d.purchasedDelta || 0));
    const newSold = Math.max(0, (existing.sold_qty || 0) + (d.soldDelta || 0));
    const newClosing = Math.max(0, (existing.opening_stock || 0) + newPurchased - newSold);

    execute(
      `UPDATE DailyStockReports
       SET big_purchase_in = ?, big_move_out = ?, big_remaining = ?,
           small_move_in = ?, small_sell_out = ?, small_closing = ?,
           purchased_qty = ?, sold_qty = ?, closing_stock = ?
       WHERE report_id = ?`,
      [newBigPurchaseIn, newBigMoveOut, newBigRemaining,
       newSmallMoveIn, newSmallSellOut, newSmallClosing,
       newPurchased, newSold, newClosing, existing.report_id]
    );
  } else {
    const { bigOpening, smallOpening, legacyOpening } = getOpeningStocksSQLite(productId, date);

    const bigPurchaseIn = Math.max(0, d.bigPurchaseInDelta || 0);
    const bigMoveOut = Math.max(0, d.moveDelta || 0);
    const bigRemaining = Math.max(0, bigOpening + bigPurchaseIn - bigMoveOut);

    const smallMoveIn = Math.max(0, d.moveDelta || 0);
    const smallSellOut = Math.max(0, d.smallSellOutDelta || 0);
    const smallClosing = Math.max(0, smallOpening + smallMoveIn - smallSellOut);

    const purchased = Math.max(0, d.purchasedDelta || 0);
    const sold = Math.max(0, d.soldDelta || 0);
    const closing = Math.max(0, legacyOpening + purchased - sold);

    execute(
      `INSERT OR REPLACE INTO DailyStockReports
       (product_id, report_date, big_opening, big_purchase_in, big_move_out, big_remaining,
        small_opening, small_move_in, small_sell_out, small_closing,
        opening_stock, purchased_qty, sold_qty, closing_stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [productId, date, bigOpening, bigPurchaseIn, bigMoveOut, bigRemaining,
       smallOpening, smallMoveIn, smallSellOut, smallClosing,
       legacyOpening, purchased, sold, closing]
    );
  }
}

function getOpeningStocksSQLite(productId: number, date: string) {
  const prevDate = getPreviousDate(date);
  const prev = queryOne<{ big_remaining: number; small_closing: number; closing_stock: number }>(
    `SELECT big_remaining, small_closing, closing_stock FROM DailyStockReports
     WHERE product_id = ? AND report_date = ?`,
    [productId, prevDate]
  );

  if (prev) {
    return {
      bigOpening: prev.big_remaining || 0,
      smallOpening: prev.small_closing || 0,
      legacyOpening: prev.closing_stock || 0,
    };
  }

  const product = queryOne<{ current_stock: number }>(
    `SELECT current_stock FROM Products WHERE product_id = ?`,
    [productId]
  );
  const stock = product?.current_stock || 0;
  return { bigOpening: stock, smallOpening: 0, legacyOpening: stock };
}

// ─── Date helper ─────────────────────────────────────────────────
function getPreviousDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0];
}
