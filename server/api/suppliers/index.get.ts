// API endpoint for getting all suppliers
import { queryAll } from '~/server/utils/db';
import type { Supplier } from '~/types';

export default defineEventHandler(async () => {
  const suppliers = queryAll<Supplier>(`
    SELECT * FROM Suppliers 
    WHERE is_active = 1
    ORDER BY company_name ASC
  `);
  
  return suppliers;
});
