// API endpoint for getting a single supplier by ID
import { queryOne, isProduction, getSupabase } from '~/server/utils/db';
import type { Supplier } from '~/types';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Supplier ID is required'
    });
  }
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data: supplier, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('supplier_id', id)
      .eq('is_active', true)
      .single();
    
    if (error || !supplier) {
      throw createError({ statusCode: 404, message: 'Supplier not found' });
    }
    
    return supplier;
  }
  
  // Development: Use SQLite
  const supplier = queryOne<Supplier>('SELECT * FROM Suppliers WHERE supplier_id = ? AND is_active = 1', [id]);
  
  if (!supplier) {
    throw createError({
      statusCode: 404,
      message: 'Supplier not found'
    });
  }
  
  return supplier;
});
