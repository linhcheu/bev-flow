// API endpoint for creating a supplier
import { execute, getLastInsertId, queryOne } from '~/server/utils/db';
import type { Supplier } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Supplier>>(event);
  
  if (!body.company_name) {
    throw createError({
      statusCode: 400,
      message: 'Company name is required'
    });
  }
  
  execute(`
    INSERT INTO Suppliers (company_name, contact_person, sale_agent, phone, email, address, lead_time_days, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    body.company_name,
    body.contact_person || null,
    body.sale_agent || null,
    body.phone || null,
    body.email || null,
    body.address || null,
    body.lead_time_days || 7,
    body.is_active !== false ? 1 : 0
  ]);
  
  const id = getLastInsertId();
  const supplier = queryOne<Supplier>('SELECT * FROM Suppliers WHERE supplier_id = ?', [id]);
  
  return supplier;
});
