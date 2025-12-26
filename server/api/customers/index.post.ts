// API endpoint for creating a customer
import { execute, getLastInsertId, queryOne } from '~/server/utils/db';
import type { Customer } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Customer>>(event);
  
  if (!body.customer_name) {
    throw createError({
      statusCode: 400,
      message: 'Customer name is required'
    });
  }
  
  execute(`
    INSERT INTO Customers (customer_name, contact_person, phone, email, address, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    body.customer_name,
    body.contact_person || null,
    body.phone || null,
    body.email || null,
    body.address || null,
    body.is_active !== false ? 1 : 0
  ]);
  
  const id = getLastInsertId();
  const customer = queryOne<Customer>('SELECT * FROM Customers WHERE customer_id = ?', [id]);
  
  return customer;
});
