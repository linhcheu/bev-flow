// API endpoint for getting a single supplier by ID
import { queryOne } from '~/server/utils/db';
import type { Supplier } from '~/types';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Supplier ID is required'
    });
  }
  
  const supplier = queryOne<Supplier>('SELECT * FROM Suppliers WHERE supplier_id = ?', [id]);
  
  if (!supplier) {
    throw createError({
      statusCode: 404,
      message: 'Supplier not found'
    });
  }
  
  return supplier;
});
