// API endpoint for getting all sales
import { queryAll } from '~/server/utils/db';
import type { Sale } from '~/types';

interface SaleRow extends Sale {
  product_name: string;
  sku: string;
}

export default defineEventHandler(async () => {
  const sales = queryAll<SaleRow>(`
    SELECT 
      s.*,
      p.product_name,
      p.sku
    FROM Sales s
    LEFT JOIN Products p ON s.product_id = p.product_id
    ORDER BY s.sale_date DESC
  `);
  
  // Transform to include product object
  return sales.map(s => ({
    ...s,
    total_amount: Number(s.quantity) * Number(s.unit_price),
    product: s.product_id ? {
      product_id: s.product_id,
      product_name: s.product_name,
      sku: s.sku
    } : null
  }));
});
