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
        // Check INV-H20-XXXX format (new)
        const match = sale.sale_number?.match(/INV-H20-(\d+)/);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
        // Also check old SALE-YEAR-XXXX format for migration
        const oldMatch = sale.sale_number?.match(/SALE-(\d{4})-(\d+)/);
        if (oldMatch && oldMatch[2]) {
          const num = parseInt(oldMatch[2], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    }
    
    return { next_number: `INV-H20-${String(maxNum + 1).padStart(4, '0')}` };
  }
  
  // Development: Use SQLite
  const result = queryOne<{ max_inv: string | null }>(`
    SELECT invoice_number as max_inv FROM Sales 
    ORDER BY sale_id DESC 
    LIMIT 1
  `);
  
  let maxNum = 0;
  if (result?.max_inv) {
    // Check INV-H20-XXXX format (new)
    const match = result.max_inv.match(/INV-H20-(\d+)/);
    if (match && match[1]) {
      maxNum = parseInt(match[1], 10);
    } else {
      // Handle old SALE-YEAR-XXXX format
      const oldMatch = result.max_inv.match(/SALE-(\d{4})-(\d+)/);
      if (oldMatch && oldMatch[2]) {
        maxNum = parseInt(oldMatch[2], 10);
      }
    }
  }
  
  return { next_number: `INV-H20-${String(maxNum + 1).padStart(4, '0')}` };
});
