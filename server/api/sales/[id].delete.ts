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
    
    // Get the sale
    const { data: sale } = await supabase
      .from('sales')
      .select('product_id, quantity')
      .eq('sale_id', id)
      .single();
    
    if (!sale) {
      throw createError({ statusCode: 404, message: 'Sale not found' });
    }
    
    // Get sale items to restore stock
    const { data: saleItems } = await supabase
      .from('saleitems')
      .select('product_id, quantity')
      .eq('sale_id', id);
    
    // Restore stock
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
            .update({ current_stock: product.current_stock + item.quantity })
            .eq('product_id', item.product_id);
        }
      }
    } else if (sale.product_id) {
      const { data: product } = await supabase
        .from('products')
        .select('current_stock')
        .eq('product_id', sale.product_id)
        .single();
      
      if (product) {
        await supabase
          .from('products')
          .update({ current_stock: product.current_stock + sale.quantity })
          .eq('product_id', sale.product_id);
      }
    }
    
    // Delete items and sale
    await supabase.from('saleitems').delete().eq('sale_id', id);
    await supabase.from('sales').delete().eq('sale_id', id);
    
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
