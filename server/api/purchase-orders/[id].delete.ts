// API endpoint for deleting a purchase order
import { execute, queryOne } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Purchase order ID is required'
    });
  }
  
  // Check if order exists
  const existing = queryOne('SELECT po_id FROM PurchaseOrders WHERE po_id = ?', [id]);
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Purchase order not found'
    });
  }
  
  // Delete items first (cascade should handle this, but explicit is better)
  execute('DELETE FROM PurchaseOrderItems WHERE po_id = ?', [id]);
  execute('DELETE FROM PurchaseOrders WHERE po_id = ?', [id]);
  
  return { success: true, message: 'Purchase order deleted successfully' };
});
