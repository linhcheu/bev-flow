// API endpoint for getting all suppliers
import { queryAll, isProduction, getSupabase } from '~/server/utils/db';
import type { Supplier } from '~/types';

export default defineEventHandler(async () => {
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data: suppliers, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('is_active', true)
      .order('company_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching suppliers:', error);
      throw createError({ statusCode: 500, message: 'Failed to fetch suppliers' });
    }
    
    return suppliers || [];
  }
  
  // Development: Use SQLite
  const suppliers = queryAll<Supplier>(`
    SELECT 
      supplier_id,
      company_name,
      contact_person,
      sale_agent,
      phone,
      email,
      address,
      lead_time_days,
      payment_method,
      is_active,
      created_at,
      updated_at
    FROM Suppliers 
    WHERE is_active = 1
    ORDER BY company_name ASC
  `);
  
  return suppliers;
});
