// API endpoint for creating a sale
import { execute, getLastInsertId, queryOne } from '~/server/utils/db';
import type { Sale, SaleFormData } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody<SaleFormData>(event);
  
  if (!body.invoice_number || !body.product_id || !body.quantity || !body.unit_price) {
    throw createError({
      statusCode: 400,
      message: 'Invoice number, product ID, quantity, and unit price are required'
    });
  }
  
  const totalAmount = Number(body.quantity) * Number(body.unit_price);
  
  execute(`
    INSERT INTO Sales (invoice_number, customer_id, customer_name, sale_date, product_id, unit_price, quantity, total_amount, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    body.invoice_number,
    body.customer_id || null,
    body.customer_name || null,
    body.sale_date || new Date().toISOString().split('T')[0],
    body.product_id,
    body.unit_price,
    body.quantity,
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
