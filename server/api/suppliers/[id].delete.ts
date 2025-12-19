// API endpoint for deleting a supplier
import { execute, queryOne } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Supplier ID is required'
    });
  }
  
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
