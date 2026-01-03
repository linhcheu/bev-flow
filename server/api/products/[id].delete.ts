// API endpoint for deleting a product
// Uses soft delete (is_active = false) if product is referenced by other tables
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required'
    });
  }
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data: existing } = await supabase
      .from('products')
      .select('product_id, is_active')
      .eq('product_id', id)
      .single();
    
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Product not found' });
    }
    
    // Try hard delete first
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('product_id', id);
    
    // If foreign key constraint error, use soft delete instead
    if (error) {
      if (error.code === '23503') {
        // Foreign key constraint - soft delete instead
        const { error: updateError } = await supabase
          .from('products')
          .update({ is_active: false })
          .eq('product_id', id);
        
        if (updateError) {
          console.error('Error soft deleting product:', updateError);
          throw createError({ statusCode: 500, message: 'Failed to delete product' });
        }
        
        return { success: true, message: 'Product deactivated (has related records)' };
      }
      
      console.error('Error deleting product:', error);
      throw createError({ statusCode: 500, message: 'Failed to delete product' });
    }
    
    return { success: true, message: 'Product deleted successfully' };
  }
  
  // Development: Use SQLite
  // Check if product exists
  const existing = queryOne('SELECT product_id FROM Products WHERE product_id = ?', [id]);
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Product not found'
    });
  }
  
  // Try hard delete, soft delete if foreign key error
  try {
    execute('DELETE FROM Products WHERE product_id = ?', [id]);
    return { success: true, message: 'Product deleted successfully' };
  } catch (err: any) {
    if (err.message?.includes('FOREIGN KEY constraint')) {
      execute('UPDATE Products SET is_active = 0 WHERE product_id = ?', [id]);
      return { success: true, message: 'Product deactivated (has related records)' };
    }
    throw err;
  }
});
