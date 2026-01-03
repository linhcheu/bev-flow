// API endpoint for deleting a supplier
// Uses soft delete (is_active = false) if supplier is referenced by other tables
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
      .select('supplier_id, is_active')
      .eq('supplier_id', id)
      .single();
    
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Supplier not found' });
    }
    
    // Try hard delete first
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('supplier_id', id);
    
    // If foreign key constraint error, use soft delete instead
    if (error) {
      if (error.code === '23503') {
        // Foreign key constraint - soft delete instead
        const { error: updateError } = await supabase
          .from('suppliers')
          .update({ is_active: false })
          .eq('supplier_id', id);
        
        if (updateError) {
          console.error('Error soft deleting supplier:', updateError);
          throw createError({ statusCode: 500, message: 'Failed to delete supplier' });
        }
        
        return { success: true, message: 'Supplier deactivated (has related records)' };
      }
      
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
  
  // Try hard delete, soft delete if foreign key error
  try {
    execute('DELETE FROM Suppliers WHERE supplier_id = ?', [id]);
    return { success: true, message: 'Supplier deleted successfully' };
  } catch (err: any) {
    if (err.message?.includes('FOREIGN KEY constraint')) {
      execute('UPDATE Suppliers SET is_active = 0 WHERE supplier_id = ?', [id]);
      return { success: true, message: 'Supplier deactivated (has related records)' };
    }
    throw err;
  }
});
