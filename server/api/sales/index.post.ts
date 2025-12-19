// API endpoint for creating a sale
import { execute, getLastInsertId, queryOne } from '~/server/utils/db';
import type { Sale } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Sale>>(event);
  
  if (!body.product_id || !body.quantity || !body.unit_price) {
    throw createError({
      statusCode: 400,
      message: 'Product ID, quantity, and unit price are required'
    });
  }
  
  const totalAmount = Number(body.quantity) * Number(body.unit_price);
  
  execute(`
    INSERT INTO Sales (product_id, sale_date, quantity, unit_price, total_amount, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    body.product_id,
    body.sale_date || new Date().toISOString().split('T')[0],
    body.quantity,
    body.unit_price,
    totalAmount,
    body.notes || null
  ]);
  
  // Update product stock
  execute(`
    UPDATE Products 
    SET current_stock = current_stock - ?
    WHERE product_id = ?
  `, [body.quantity, body.product_id]);
  
  const id = getLastInsertId();
  const sale = queryOne<Sale>('SELECT * FROM Sales WHERE sale_id = ?', [id]);
  
  return sale;
});
