// API endpoint for deleting a sale
import { execute, queryOne, queryAll, useDatabase, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Sale ID is required'
    });
  }
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    // Check if sale exists
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select('sale_id')
      .eq('sale_id', id)
      .single();
    
    if (saleError || !sale) {
      throw createError({ statusCode: 404, message: 'Sale not found' });
    }
    
    // Get sale items to restore stock
    const { data: saleItems } = await supabase
      .from('saleitems')
      .select('product_id, quantity')
      .eq('sale_id', id);
    
    // Restore stock for each item
    if (saleItems && saleItems.length > 0) {
      for (const item of saleItems) {
        const { data: product } = await supabase
          .from('products')
          .select('current_stock')
          .eq('product_id', item.product_id)
          .single();
        
        if (product) {
          await supabase
            .from('products')
            .update({ current_stock: (product.current_stock || 0) + item.quantity })
            .eq('product_id', item.product_id);
        }
      }
    }
    
    // Delete items first (cascade should handle, but explicit is safer)
    await supabase.from('saleitems').delete().eq('sale_id', id);
    
    // Delete the sale
    const { error: deleteError } = await supabase
      .from('sales')
      .delete()
      .eq('sale_id', id);
    
    if (deleteError) {
      console.error('Error deleting sale:', deleteError);
      throw createError({ statusCode: 500, message: 'Failed to delete sale' });
    }
    
    return { success: true, message: 'Sale deleted successfully' };
  }
  
  // Development: Use SQLite
  // Get the sale to verify it exists
  const sale = queryOne<{ product_id: number; quantity: number }>('SELECT product_id, quantity FROM Sales WHERE sale_id = ?', [id]);
  
  if (!sale) {
    throw createError({
      statusCode: 404,
      message: 'Sale not found'
    });
  }
  
  // Get all sale items to restore their stock
  const saleItems = queryAll<{ product_id: number; quantity: number }>('SELECT product_id, quantity FROM SaleItems WHERE sale_id = ?', [id]);
  
  const db = useDatabase();
  
  db.transaction(() => {
    // Restore stock from sale items (multi-item sales)
    if (saleItems.length > 0) {
      for (const item of saleItems) {
        execute('UPDATE Products SET current_stock = current_stock + ? WHERE product_id = ?', [item.quantity, item.product_id]);
      }
    } else {
      // Fallback: restore from main sale record (legacy single-item sales)
      execute('UPDATE Products SET current_stock = current_stock + ? WHERE product_id = ?', [sale.quantity, sale.product_id]);
    }
    
    // Delete sale items first (cascade should handle this, but be explicit)
    execute('DELETE FROM SaleItems WHERE sale_id = ?', [id]);
    
    // Delete the sale
    execute('DELETE FROM Sales WHERE sale_id = ?', [id]);
  })();
  
  return { success: true, message: 'Sale deleted successfully' };
});
