// API endpoint for updating a product
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';
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
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data: existing } = await supabase
      .from('products')
      .select('product_id')
      .eq('product_id', id)
      .single();
    
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Product not found' });
    }
    
    const { data, error } = await supabase
      .from('products')
      .update({
        sku: body.sku,
        product_name: body.product_name,
        description: body.description || null,
        image_url: body.image_url || null,
        cost_price: body.cost_price || 0,
        selling_price: body.selling_price || 0,
        supplier_id: body.supplier_id || null,
        current_stock: body.current_stock || 0,
        min_stock_level: body.min_stock_level || 0,
        safety_stock: body.safety_stock || 0,
        reorder_quantity: body.reorder_quantity || 0,
        is_active: body.is_active === undefined ? true : Boolean(body.is_active),
        updated_at: new Date().toISOString()
      })
      .eq('product_id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      throw createError({ statusCode: 500, message: 'Failed to update product' });
    }
    
    return data;
  }
  
  // Development: Use SQLite
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
        image_url = ?,
        cost_price = ?, 
        selling_price = ?, 
        supplier_id = ?, 
        current_stock = ?,
        min_stock_level = ?,
        safety_stock = ?,
        reorder_quantity = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE product_id = ?
  `, [
    body.sku,
    body.product_name,
    body.description || null,
    body.image_url || null,
    body.cost_price || 0,
    body.selling_price || 0,
    body.supplier_id || null,
    body.current_stock || 0,
    body.min_stock_level || 0,
    body.safety_stock || 0,
    body.reorder_quantity || 0,
    body.is_active === undefined ? 1 : (body.is_active ? 1 : 0),
    id
  ]);
  
  const product = queryOne<Product>('SELECT * FROM Products WHERE product_id = ?', [id]);
  return product;
});
