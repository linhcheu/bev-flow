// API endpoint for updating a supplier
import { execute, queryOne } from '~/server/utils/db';
import type { Supplier } from '~/types';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody<Partial<Supplier>>(event);
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Supplier ID is required'
    });
  }
  
  // Check if supplier exists
  const existing = queryOne('SELECT supplier_id FROM Suppliers WHERE supplier_id = ?', [id]);
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Supplier not found'
    });
  }
  
  execute(`
    UPDATE Suppliers 
    SET company_name = ?, 
        contact_person = ?, 
        phone = ?, 
        email = ?, 
        address = ?, 
        lead_time_days = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE supplier_id = ?
  `, [
    body.company_name,
    body.contact_person || null,
    body.phone || null,
    body.email || null,
    body.address || null,
    body.lead_time_days || 0,
    body.is_active !== false ? 1 : 0,
    id
  ]);
  
  const supplier = queryOne<Supplier>('SELECT * FROM Suppliers WHERE supplier_id = ?', [id]);
  return supplier;
});
