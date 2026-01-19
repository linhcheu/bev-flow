// API endpoint for getting the next PO number
import { queryOne, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async () => {
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    // Get all PO numbers and find the max numerically
    const { data } = await supabase
      .from('purchaseorders')
      .select('po_number');
    
    let maxNum = 0;
    if (data) {
      for (const po of data) {
        // Handle new format PO-XXX-XXX
        let match = po.po_number?.match(/PO-(\d+)-(\d+)/);
        if (match && match[1] && match[2]) {
          const num = parseInt(match[1], 10) * 1000 + parseInt(match[2], 10);
          if (num > maxNum) maxNum = num;
        } else {
          // Handle old format PO-XXXX
          match = po.po_number?.match(/PO-(\d+)/);
          if (match && match[1]) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      }
    }
    
    const nextNum = maxNum + 1;
    const prefix = String(Math.floor(nextNum / 1000) || 1).padStart(3, '0');
    const suffix = String(nextNum % 1000 || nextNum).padStart(3, '0');
    return { next_number: `PO-${prefix}-${suffix}` };
  }
  
  // Development: Use SQLite
  const result = queryOne<{ max_po: string | null }>(`
    SELECT po_number as max_po FROM PurchaseOrders 
    ORDER BY po_id DESC 
    LIMIT 1
  `);
  
  let maxNum = 0;
  if (result?.max_po) {
    // Handle new format PO-XXX-XXX
    let match = result.max_po.match(/PO-(\d+)-(\d+)/);
    if (match && match[1] && match[2]) {
      maxNum = parseInt(match[1], 10) * 1000 + parseInt(match[2], 10);
    } else {
      // Handle old format PO-XXXX
      match = result.max_po.match(/PO-(\d+)/);
      if (match) {
        maxNum = parseInt(match[1], 10);
      }
    }
  }
  
  const nextNum = maxNum + 1;
  const prefix = String(Math.floor(nextNum / 1000) || 1).padStart(3, '0');
  const suffix = String(nextNum % 1000 || nextNum).padStart(3, '0');
  return { next_number: `PO-${prefix}-${suffix}` };
});
