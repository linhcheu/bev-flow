// API endpoint for creating a purchase order
import { execute, getLastInsertId, queryOne } from '~/server/utils/db';
import type { PurchaseOrder } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<PurchaseOrder>>(event);
  
  if (!body.product_id || !body.supplier_id || !body.quantity || !body.unit_cost) {
    throw createError({
      statusCode: 400,
      message: 'Product ID, supplier ID, quantity, and unit cost are required'
    });
  }
  
  const totalAmount = Number(body.quantity) * Number(body.unit_cost);
  
  execute(`
    INSERT INTO PurchaseOrders (product_id, supplier_id, order_date, expected_delivery, quantity, unit_cost, total_amount, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    body.product_id,
    body.supplier_id,
    body.order_date || new Date().toISOString().split('T')[0],
    body.expected_delivery || null,
    body.quantity,
    body.unit_cost,
    totalAmount,
    body.status || 'pending',
    body.notes || null
  ]);
  
  const id = getLastInsertId();
  const order = queryOne<PurchaseOrder>('SELECT * FROM PurchaseOrders WHERE po_id = ?', [id]);
  
  return order;
});
