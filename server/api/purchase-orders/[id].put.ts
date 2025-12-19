// API endpoint for updating purchase order status
import { execute, queryOne } from '~/server/utils/db';
import type { PurchaseOrder } from '~/types';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody<Partial<PurchaseOrder>>(event);
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Purchase order ID is required'
    });
  }
  
  // Check if order exists
  const existing = queryOne<PurchaseOrder>('SELECT * FROM PurchaseOrders WHERE po_id = ?', [id]);
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Purchase order not found'
    });
  }
  
  // If status is changing to 'received', update product stock
  if (body.status === 'received' && existing.status !== 'received') {
    execute('UPDATE Products SET current_stock = current_stock + ? WHERE product_id = ?', [existing.quantity, existing.product_id]);
  }
  
  execute(`
    UPDATE PurchaseOrders 
    SET status = ?,
        expected_delivery = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE po_id = ?
  `, [
    body.status || existing.status,
    body.expected_delivery || existing.expected_delivery,
    body.notes ?? existing.notes,
    id
  ]);
  
  const order = queryOne<PurchaseOrder>('SELECT * FROM PurchaseOrders WHERE po_id = ?', [id]);
  return order;
});
