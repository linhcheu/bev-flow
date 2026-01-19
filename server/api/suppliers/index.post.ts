// API endpoint for creating a supplier
import { execute, getLastInsertId, queryOne, isProduction, getSupabase } from '~/server/utils/db';
import type { Supplier } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Supplier>>(event);
  
  if (!body.company_name) {
    throw createError({
      statusCode: 400,
      message: 'Company name is required'
    });
  }
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('suppliers')
      .insert({
        company_name: body.company_name,
        contact_person: body.contact_person || null,
        sale_agent: body.sale_agent || null,
        phone: body.phone || null,
        email: body.email || null,
        address: body.address || null,
        lead_time_days: body.lead_time_days || 7,
        payment_method: body.payment_method || 'Collect',
        is_active: body.is_active === undefined ? true : Boolean(body.is_active)
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating supplier:', error);
      throw createError({ statusCode: 500, message: 'Failed to create supplier' });
    }
    
    return data;
  }
  
  // Development: Use SQLite
  execute(`
    INSERT INTO Suppliers (company_name, contact_person, sale_agent, phone, email, address, lead_time_days, payment_method, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    body.company_name,
    body.contact_person || null,
    body.sale_agent || null,
    body.phone || null,
    body.email || null,
    body.address || null,
    body.lead_time_days || 7,
    body.payment_method || 'Collect',
    body.is_active === undefined ? 1 : (body.is_active ? 1 : 0)
  ]);
  
  const id = getLastInsertId();
  const supplier = queryOne<Supplier>('SELECT * FROM Suppliers WHERE supplier_id = ?', [id]);
  
  return supplier;
});
