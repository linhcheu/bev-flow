// API endpoint for updating a supplier
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';
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
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data: existing } = await supabase
      .from('suppliers')
      .select('supplier_id')
      .eq('supplier_id', id)
      .single();
    
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Supplier not found' });
    }
    
    const { data, error } = await supabase
      .from('suppliers')
      .update({
        company_name: body.company_name,
        contact_person: body.contact_person || null,
        sale_agent: body.sale_agent || null,
        phone: body.phone || null,
        email: body.email || null,
        address: body.address || null,
        lead_time_days: body.lead_time_days || 0,
        payment_method: body.payment_method || 'Collect',
        is_active: body.is_active == null ? true : !!body.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('supplier_id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating supplier:', error);
      throw createError({ statusCode: 500, message: 'Failed to update supplier' });
    }
    
    return data;
  }
  
  // Development: Use SQLite
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
        sale_agent = ?,
        phone = ?, 
        email = ?, 
        address = ?, 
        lead_time_days = ?,
        payment_method = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE supplier_id = ?
  `, [
    body.company_name,
    body.contact_person || null,
    body.sale_agent || null,
    body.phone || null,
    body.email || null,
    body.address || null,
    body.lead_time_days || 0,
    body.payment_method || 'Collect',
    body.is_active == null ? 1 : (body.is_active ? 1 : 0),
    id
  ]);
  
  const supplier = queryOne<Supplier>('SELECT * FROM Suppliers WHERE supplier_id = ?', [id]);
  return supplier;
});
