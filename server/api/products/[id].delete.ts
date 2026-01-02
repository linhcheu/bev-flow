// API endpoint for deleting a product
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
      .select('product_id')
      .eq('product_id', id)
      .single();
    
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Product not found' });
    }
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('product_id', id);
    
    if (error) {
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
  
  execute('DELETE FROM Products WHERE product_id = ?', [id]);
  
  return { success: true, message: 'Product deleted successfully' };
});
