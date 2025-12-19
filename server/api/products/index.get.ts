// API endpoint for getting all products
import { queryAll } from '~/server/utils/db';
import type { Product, Supplier } from '~/types';

interface ProductRow extends Product {
  supplier_name: string;
}

export default defineEventHandler(async () => {
  const products = queryAll<ProductRow>(`
    SELECT 
      p.*,
      s.company_name as supplier_name
    FROM Products p
    LEFT JOIN Suppliers s ON p.supplier_id = s.supplier_id
    ORDER BY p.created_at DESC
  `);
  
  // Transform to include supplier object
  return products.map(p => ({
    ...p,
    profit: Number(p.selling_price) - Number(p.cost_price),
    supplier: p.supplier_id ? {
      supplier_id: p.supplier_id,
      company_name: p.supplier_name
    } : null
  }));
});
