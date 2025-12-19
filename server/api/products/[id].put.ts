// API endpoint for updating a product
import { execute, queryOne } from '~/server/utils/db';
import type { Product } from '~/types';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody<Partial<Product>>(event);
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required'
    });
  }
  
  // Check if product exists
  const existing = queryOne('SELECT product_id FROM Products WHERE product_id = ?', [id]);
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Product not found'
    });
  }
  
  execute(`
    UPDATE Products 
    SET sku = ?, 
        product_name = ?, 
        description = ?, 
        cost_price = ?, 
        selling_price = ?, 
        supplier_id = ?, 
        current_stock = ?,
        min_stock_level = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE product_id = ?
  `, [
    body.sku,
    body.product_name,
    body.description || null,
    body.cost_price || 0,
    body.selling_price || 0,
    body.supplier_id || null,
    body.current_stock || 0,
    body.min_stock_level || 0,
    body.is_active !== false ? 1 : 0,
    id
  ]);
  
  const product = queryOne<Product>('SELECT * FROM Products WHERE product_id = ?', [id]);
  return product;
});
