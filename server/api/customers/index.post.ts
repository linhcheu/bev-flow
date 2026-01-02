// API endpoint for creating a customer
import { execute, getLastInsertId, queryOne, isProduction, getSupabase } from '~/server/utils/db';
import type { Customer } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Customer>>(event);
  
  if (!body.customer_name) {
    throw createError({
      statusCode: 400,
      message: 'Customer name is required'
    });
  }
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('customers')
      .insert({
        customer_name: body.customer_name,
        contact_person: body.contact_person || null,
        phone: body.phone || null,
        email: body.email || null,
        address: body.address || null,
        is_active: body.is_active === undefined ? true : Boolean(body.is_active)
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating customer:', error);
      throw createError({ statusCode: 500, message: 'Failed to create customer' });
    }
    
    return data;
  }
  
  // Development: Use SQLite
  execute(`
    INSERT INTO Customers (customer_name, contact_person, phone, email, address, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    body.customer_name,
    body.contact_person || null,
    body.phone || null,
    body.email || null,
    body.address || null,
    body.is_active === undefined ? 1 : (body.is_active ? 1 : 0)
  ]);
  
  const id = getLastInsertId();
  const customer = queryOne<Customer>('SELECT * FROM Customers WHERE customer_id = ?', [id]);
  
  return customer;
});
