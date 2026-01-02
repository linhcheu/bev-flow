// API endpoint for deleting a purchase order
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Purchase order ID is required'
    });
  }
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data: existing } = await supabase
      .from('purchaseorders')
      .select('po_id')
      .eq('po_id', id)
      .single();
    
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Purchase order not found' });
    }
    
    // Delete items first
    await supabase.from('purchaseorderitems').delete().eq('po_id', id);
    
    const { error } = await supabase
      .from('purchaseorders')
      .delete()
      .eq('po_id', id);
    
    if (error) {
      console.error('Error deleting purchase order:', error);
      throw createError({ statusCode: 500, message: 'Failed to delete purchase order' });
    }
    
    return { success: true, message: 'Purchase order deleted successfully' };
  }
  
  // Development: Use SQLite
  // Check if order exists
  const existing = queryOne('SELECT po_id FROM PurchaseOrders WHERE po_id = ?', [id]);
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Purchase order not found'
    });
  }
  
  // Delete items first (cascade should handle this, but explicit is better)
  execute('DELETE FROM PurchaseOrderItems WHERE po_id = ?', [id]);
  execute('DELETE FROM PurchaseOrders WHERE po_id = ?', [id]);
  
  return { success: true, message: 'Purchase order deleted successfully' };
});
