// API endpoint for getting a single sale by ID
import { queryOne } from '~/server/utils/db';
import type { Sale } from '~/types';

interface SaleRow extends Sale {
  product_name: string;
  sku: string;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Sale ID is required'
    });
  }
  
  const sale = queryOne<SaleRow>(`
    SELECT 
      s.*,
      p.product_name,
      p.sku
    FROM Sales s
    LEFT JOIN Products p ON s.product_id = p.product_id
    WHERE s.sale_id = ?
  `, [id]);
  
  if (!sale) {
    throw createError({
      statusCode: 404,
      message: 'Sale not found'
    });
  }
  
  return {
    ...sale,
    total_amount: Number(sale.quantity) * Number(sale.unit_price),
    product: sale.product_id ? {
      product_id: sale.product_id,
      product_name: sale.product_name,
      sku: sale.sku
    } : null
  };
});
