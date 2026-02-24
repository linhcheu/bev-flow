// Seed Daily Stock Reports — Feb 19-20, 2026 (Big Stock / Small Stock model)
import { execute, queryAll, isProduction, getSupabase } from '~/server/utils/db';

// Each product's seed data for a given day
// Keyed by SKU instead of hardcoded product_id
interface SeedRow {
  sku: string;
  big_opening: number;
  big_purchase_in: number;
  big_move_out: number;
  small_opening: number;
  small_sell_out: number;
}

// Data matching the report image dated 20/02/2026
const feb20Data: SeedRow[] = [
  { sku: 'A001', big_opening: 10, big_purchase_in: 5,  big_move_out: 8,  small_opening: 3, small_sell_out: 6  }, // ABC Extra Stout
  { sku: 'A002', big_opening: 15, big_purchase_in: 0,  big_move_out: 10, small_opening: 5, small_sell_out: 12 }, // Anchor Beer
  { sku: 'A003', big_opening: 8,  big_purchase_in: 10, big_move_out: 6,  small_opening: 4, small_sell_out: 7  }, // Anchor Smooth White Beer
  { sku: 'A005', big_opening: 20, big_purchase_in: 0,  big_move_out: 8,  small_opening: 6, small_sell_out: 10 }, // Cambodia Lite Beer
  { sku: 'A006', big_opening: 14, big_purchase_in: 10, big_move_out: 12, small_opening: 3, small_sell_out: 8  }, // Tiger Lager Beer
  { sku: 'A007', big_opening: 18, big_purchase_in: 0,  big_move_out: 10, small_opening: 5, small_sell_out: 9  }, // Tiger Crystal
  { sku: 'A008', big_opening: 16, big_purchase_in: 5,  big_move_out: 8,  small_opening: 4, small_sell_out: 7  }, // Tiger Lager Beer (Bottle)
  { sku: 'A009', big_opening: 10, big_purchase_in: 0,  big_move_out: 6,  small_opening: 3, small_sell_out: 5  }, // Tiger Crystal (Bottle)
  { sku: 'A010', big_opening: 8,  big_purchase_in: 10, big_move_out: 5,  small_opening: 2, small_sell_out: 4  }, // Heineken (Bottle)
  { sku: 'A011', big_opening: 6,  big_purchase_in: 0,  big_move_out: 4,  small_opening: 3, small_sell_out: 5  }, // ABC Singapore
  { sku: 'A012', big_opening: 12, big_purchase_in: 5,  big_move_out: 8,  small_opening: 4, small_sell_out: 6  }, // Hanuman White
  { sku: 'A013', big_opening: 9,  big_purchase_in: 0,  big_move_out: 5,  small_opening: 2, small_sell_out: 3  }, // Hanuman Black
  { sku: 'A014', big_opening: 15, big_purchase_in: 10, big_move_out: 10, small_opening: 5, small_sell_out: 8  }, // Vattanac Premier Light
  { sku: 'A015', big_opening: 7,  big_purchase_in: 0,  big_move_out: 4,  small_opening: 3, small_sell_out: 5  }, // ABC (Bottle)
  { sku: 'A016', big_opening: 11, big_purchase_in: 5,  big_move_out: 7,  small_opening: 3, small_sell_out: 6  }, // Ganzberg Snow White
  { sku: 'A004', big_opening: 12, big_purchase_in: 0,  big_move_out: 5,  small_opening: 2, small_sell_out: 4  }, // Anchor Beer (325ml)
];

// Feb 19 data (previous day — establishes opening stocks for Feb 20)
const feb19Data: SeedRow[] = [
  { sku: 'A001', big_opening: 12, big_purchase_in: 0,  big_move_out: 5,  small_opening: 4, small_sell_out: 4  },
  { sku: 'A002', big_opening: 18, big_purchase_in: 0,  big_move_out: 8,  small_opening: 5, small_sell_out: 8  },
  { sku: 'A003', big_opening: 10, big_purchase_in: 5,  big_move_out: 7,  small_opening: 3, small_sell_out: 6  },
  { sku: 'A005', big_opening: 22, big_purchase_in: 5,  big_move_out: 7,  small_opening: 4, small_sell_out: 6  },
  { sku: 'A006', big_opening: 16, big_purchase_in: 5,  big_move_out: 7,  small_opening: 4, small_sell_out: 4  },
  { sku: 'A007', big_opening: 20, big_purchase_in: 5,  big_move_out: 7,  small_opening: 5, small_sell_out: 7  },
  { sku: 'A008', big_opening: 18, big_purchase_in: 5,  big_move_out: 7,  small_opening: 3, small_sell_out: 6  },
  { sku: 'A009', big_opening: 14, big_purchase_in: 0,  big_move_out: 7,  small_opening: 4, small_sell_out: 7  },
  { sku: 'A010', big_opening: 10, big_purchase_in: 5,  big_move_out: 7,  small_opening: 3, small_sell_out: 6  },
  { sku: 'A011', big_opening: 8,  big_purchase_in: 0,  big_move_out: 5,  small_opening: 4, small_sell_out: 4  },
  { sku: 'A012', big_opening: 14, big_purchase_in: 5,  big_move_out: 7,  small_opening: 3, small_sell_out: 6  },
  { sku: 'A013', big_opening: 11, big_purchase_in: 0,  big_move_out: 5,  small_opening: 3, small_sell_out: 6  },
  { sku: 'A014', big_opening: 17, big_purchase_in: 5,  big_move_out: 7,  small_opening: 4, small_sell_out: 6  },
  { sku: 'A015', big_opening: 9,  big_purchase_in: 0,  big_move_out: 5,  small_opening: 4, small_sell_out: 4  },
  { sku: 'A016', big_opening: 13, big_purchase_in: 5,  big_move_out: 7,  small_opening: 4, small_sell_out: 5  },
  { sku: 'A004', big_opening: 14, big_purchase_in: 0,  big_move_out: 5,  small_opening: 3, small_sell_out: 6  },
];

function computeRow(row: SeedRow, dateStr: string, productId: number) {
  const big_remaining = row.big_opening + row.big_purchase_in - row.big_move_out;
  const small_move_in = row.big_move_out; // transfer from big to small
  const small_closing = row.small_opening + small_move_in - row.small_sell_out;
  // Legacy fields
  const opening_stock = row.big_opening + row.small_opening;
  const purchased_qty = row.big_purchase_in;
  const sold_qty = row.small_sell_out;
  const closing_stock = big_remaining + small_closing;

  return {
    product_id: productId,
    report_date: dateStr,
    big_opening: row.big_opening,
    big_purchase_in: row.big_purchase_in,
    big_move_out: row.big_move_out,
    big_remaining: Math.max(0, big_remaining),
    small_opening: row.small_opening,
    small_move_in: small_move_in,
    small_sell_out: row.small_sell_out,
    small_closing: Math.max(0, small_closing),
    opening_stock,
    purchased_qty,
    sold_qty,
    closing_stock: Math.max(0, closing_stock),
  };
}

export default defineEventHandler(async () => {
  // === PRODUCTION: Supabase ===
  if (isProduction()) {
    const supabase = getSupabase();

    // Look up actual product_ids by SKU
    const { data: products, error: pErr } = await supabase
      .from('products')
      .select('product_id, sku')
      .eq('is_active', true);

    if (pErr || !products || products.length === 0) {
      return { success: false, message: 'No products found. Ensure the 16 products exist.' };
    }

    // Build SKU → product_id map
    const skuMap = new Map<string, number>();
    for (const p of products) {
      skuMap.set(p.sku, p.product_id);
    }

    // Build rows resolving SKU → actual product_id
    const rows: any[] = [];
    for (const r of feb19Data) {
      const pid = skuMap.get(r.sku);
      if (pid) rows.push(computeRow(r, '2026-02-19', pid));
    }
    for (const r of feb20Data) {
      const pid = skuMap.get(r.sku);
      if (pid) rows.push(computeRow(r, '2026-02-20', pid));
    }

    if (rows.length === 0) {
      return { success: false, message: `No matching SKUs found. Expected A001-A016, got: ${products.map(p => p.sku).join(', ')}` };
    }

    // Delete existing Feb 2026 data
    await supabase
      .from('dailystockreports')
      .delete()
      .gte('report_date', '2026-02-01')
      .lte('report_date', '2026-02-28');

    // Insert in batches
    for (let i = 0; i < rows.length; i += 50) {
      const batch = rows.slice(i, i + 50);
      const { error } = await supabase
        .from('dailystockreports')
        .upsert(batch, { onConflict: 'product_id,report_date' });
      if (error) throw createError({ statusCode: 500, message: `Seed error: ${error.message}` });
    }

    return {
      success: true,
      message: `Seeded ${rows.length} daily stock report records for Feb 19-20, 2026 (Supabase)`,
      daysGenerated: 2,
      productsCount: feb20Data.length,
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

  // Look up actual product_ids by SKU
  const localProducts = queryAll(`SELECT product_id, sku FROM Products WHERE is_active = 1`);
  const skuMap = new Map<string, number>();
  for (const p of localProducts) {
    skuMap.set((p as any).sku, (p as any).product_id);
  }

  const rows: any[] = [];
  for (const r of feb19Data) {
    const pid = skuMap.get(r.sku);
    if (pid) rows.push(computeRow(r, '2026-02-19', pid));
  }
  for (const r of feb20Data) {
    const pid = skuMap.get(r.sku);
    if (pid) rows.push(computeRow(r, '2026-02-20', pid));
  }

  execute(`DELETE FROM DailyStockReports WHERE report_date BETWEEN '2026-02-01' AND '2026-02-28'`);

  for (const row of rows) {
    execute(
      `INSERT OR REPLACE INTO DailyStockReports
       (product_id, report_date, big_opening, big_purchase_in, big_move_out, big_remaining,
        small_opening, small_move_in, small_sell_out, small_closing,
        opening_stock, purchased_qty, sold_qty, closing_stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [row.product_id, row.report_date,
       row.big_opening, row.big_purchase_in, row.big_move_out, row.big_remaining,
       row.small_opening, row.small_move_in, row.small_sell_out, row.small_closing,
       row.opening_stock, row.purchased_qty, row.sold_qty, row.closing_stock]
    );
  }

  return {
    success: true,
    message: `Seeded ${rows.length} daily stock report records for Feb 19-20, 2026`,
    daysGenerated: 2,
    productsCount: feb20Data.length,
  };
});
