// API endpoint for creating a product
import { execute, getLastInsertId, queryOne } from '~/server/utils/db';
import type { Product } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Product>>(event);
  
  if (!body.sku || !body.product_name) {
    throw createError({
      statusCode: 400,
      message: 'SKU and product name are required'
    });
  }
  
  execute(`
    INSERT INTO Products (sku, product_name, description, cost_price, selling_price, supplier_id, current_stock, min_stock_level, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    body.sku,
    body.product_name,
    body.description || null,
    body.cost_price || 0,
    body.selling_price || 0,
    body.supplier_id || null,
    body.current_stock || 0,
    body.min_stock_level || 0,
    body.is_active !== false ? 1 : 0
  ]);
  
  const id = getLastInsertId();
  const product = queryOne<Product>('SELECT * FROM Products WHERE product_id = ?', [id]);
  
  return product;
});
