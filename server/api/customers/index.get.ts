// API endpoint for getting all customers
import { queryAll, isProduction, getSupabase } from '~/server/utils/db';
import type { Customer } from '~/types';

export default defineEventHandler(async () => {
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .eq('is_active', true)
      .order('customer_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching customers:', error);
      throw createError({ statusCode: 500, message: 'Failed to fetch customers' });
    }
    
    return customers || [];
  }
  
  // Development: Use SQLite
  const customers = queryAll<Customer>(`
    SELECT * FROM Customers 
    WHERE is_active = 1
    ORDER BY customer_name ASC
  `);
  
  return customers;
});
