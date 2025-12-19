// API endpoint for deleting a product
import { execute, queryOne } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
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
  
  execute('DELETE FROM Products WHERE product_id = ?', [id]);
  
  return { success: true, message: 'Product deleted successfully' };
});
