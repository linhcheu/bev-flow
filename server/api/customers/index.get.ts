// API endpoint for getting all customers
import { queryAll } from '~/server/utils/db';
import type { Customer } from '~/types';

export default defineEventHandler(async () => {
  const customers = queryAll<Customer>(`
    SELECT * FROM Customers 
    WHERE is_active = 1
    ORDER BY customer_name ASC
  `);
  
  return customers;
});
