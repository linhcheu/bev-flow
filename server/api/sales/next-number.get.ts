// API endpoint for getting the next sale number
import { queryOne, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async () => {
  const currentYear = new Date().getFullYear();
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    // Get all sale numbers and find the max for current year
    const { data } = await supabase
      .from('sales')
      .select('sale_number');
    
    let maxNum = 0;
    if (data) {
      for (const sale of data) {
        // Check SALE-YEAR-XXXX format
        const match = sale.sale_number?.match(/SALE-(\d{4})-(\d+)/);
        if (match && match[1] && match[2]) {
          const year = parseInt(match[1], 10);
          const num = parseInt(match[2], 10);
          // Only count numbers from current year or find overall max
          if (year === currentYear && num > maxNum) {
            maxNum = num;
          }
        }
        // Also check old formats for migration
        const oldMatch = sale.sale_number?.match(/(?:SALE|INV)-(\d+)/);
        if (oldMatch && oldMatch[1]) {
          const num = parseInt(oldMatch[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    }
    
    return { next_number: `SALE-${currentYear}-${String(maxNum + 1).padStart(4, '0')}` };
  }
  
  // Development: Use SQLite
  const result = queryOne<{ max_inv: string | null }>(`
    SELECT invoice_number as max_inv FROM Sales 
    ORDER BY sale_id DESC 
    LIMIT 1
  `);
  
  let maxNum = 0;
  if (result?.max_inv) {
    // Check SALE-YEAR-XXXX format
    const match = result.max_inv.match(/SALE-(\d{4})-(\d+)/);
    if (match && match[1] && match[2]) {
      const year = parseInt(match[1], 10);
      const num = parseInt(match[2], 10);
      if (year === currentYear) {
        maxNum = num;
      }
    } else {
      // Handle old formats
      const oldMatch = result.max_inv.match(/(?:SALE|INV)-(\d+)/);
      if (oldMatch && oldMatch[1]) {
        maxNum = parseInt(oldMatch[1], 10);
      }
    }
  }
  
  return { next_number: `SALE-${currentYear}-${String(maxNum + 1).padStart(4, '0')}` };
});
