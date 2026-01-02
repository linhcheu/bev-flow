// API endpoint for deleting a sale
import { execute, queryOne, queryAll, useDatabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Sale ID is required'
    });
  }
  
  // Get the sale to verify it exists
  const sale = queryOne<{ product_id: number; quantity: number }>('SELECT product_id, quantity FROM Sales WHERE sale_id = ?', [id]);
  
  if (!sale) {
    throw createError({
      statusCode: 404,
      message: 'Sale not found'
    });
  }
  
  // Get all sale items to restore their stock
  const saleItems = queryAll<{ product_id: number; quantity: number }>('SELECT product_id, quantity FROM SaleItems WHERE sale_id = ?', [id]);
  
  const db = useDatabase();
  
  db.transaction(() => {
    // Restore stock from sale items (multi-item sales)
    if (saleItems.length > 0) {
      for (const item of saleItems) {
        execute('UPDATE Products SET current_stock = current_stock + ? WHERE product_id = ?', [item.quantity, item.product_id]);
      }
    } else {
      // Fallback: restore from main sale record (legacy single-item sales)
      execute('UPDATE Products SET current_stock = current_stock + ? WHERE product_id = ?', [sale.quantity, sale.product_id]);
    }
    
    // Delete sale items first (cascade should handle this, but be explicit)
    execute('DELETE FROM SaleItems WHERE sale_id = ?', [id]);
    
    // Delete the sale
    execute('DELETE FROM Sales WHERE sale_id = ?', [id]);
  })();
  
  return { success: true, message: 'Sale deleted successfully' };
});
