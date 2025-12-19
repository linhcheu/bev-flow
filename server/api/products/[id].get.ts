// API endpoint for getting a single product by ID
import { queryOne } from '~/server/utils/db';
import type { Product } from '~/types';

interface ProductRow extends Product {
  supplier_name: string;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required'
    });
  }
  
  const product = queryOne<ProductRow>(`
    SELECT 
      p.*,
      s.company_name as supplier_name
    FROM Products p
    LEFT JOIN Suppliers s ON p.supplier_id = s.supplier_id
    WHERE p.product_id = ?
  `, [id]);
  
  if (!product) {
    throw createError({
      statusCode: 404,
      message: 'Product not found'
    });
  }
  
  return {
    ...product,
    profit: Number(product.selling_price) - Number(product.cost_price),
    supplier: product.supplier_id ? {
      supplier_id: product.supplier_id,
      company_name: product.supplier_name
    } : null
  };
});
