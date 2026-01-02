// API endpoint for deleting a supplier
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';

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
    
    const { data: existing } = await supabase
      .from('suppliers')
      .select('supplier_id')
      .eq('supplier_id', id)
      .single();
    
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Supplier not found' });
    }
    
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('supplier_id', id);
    
    if (error) {
      console.error('Error deleting supplier:', error);
      throw createError({ statusCode: 500, message: 'Failed to delete supplier' });
    }
    
    return { success: true, message: 'Supplier deleted successfully' };
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
  
  execute('DELETE FROM Suppliers WHERE supplier_id = ?', [id]);
  
  return { success: true, message: 'Supplier deleted successfully' };
});
