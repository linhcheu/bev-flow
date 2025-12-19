// API endpoint for deleting a sale
import { execute, queryOne } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Sale ID is required'
    });
  }
  
  // Get the sale to restore stock
  const sale = queryOne<{ product_id: number; quantity: number }>('SELECT product_id, quantity FROM Sales WHERE sale_id = ?', [id]);
  
  if (!sale) {
    throw createError({
      statusCode: 404,
      message: 'Sale not found'
    });
  }
  
  // Restore product stock
  execute('UPDATE Products SET current_stock = current_stock + ? WHERE product_id = ?', [sale.quantity, sale.product_id]);
  
  // Delete the sale
  execute('DELETE FROM Sales WHERE sale_id = ?', [id]);
  
  return { success: true, message: 'Sale deleted successfully' };
});
