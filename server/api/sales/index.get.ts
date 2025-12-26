// API endpoint for getting all sales
import { queryAll } from '~/server/utils/db';
import type { Sale } from '~/types';

interface SaleRow {
  sale_id: number;
  invoice_number: string;
  customer_id: number | null;
  customer_name: string | null;
  sale_date: string;
  product_id: number;
  unit_price: number;
  quantity: number;
  total_amount: number;
  notes: string | null;
  created_at: string;
  product_name: string;
  sku: string;
  db_customer_name: string | null;
}

export default defineEventHandler(async () => {
  const sales = queryAll<SaleRow>(`
    SELECT 
      s.*,
      p.product_name,
      p.sku,
      c.customer_name as db_customer_name
    FROM Sales s
    LEFT JOIN Products p ON s.product_id = p.product_id
    LEFT JOIN Customers c ON s.customer_id = c.customer_id
    ORDER BY s.sale_date DESC
  `);
  
  // Transform to include product and customer objects
  return sales.map((s): Sale => ({
    sale_id: s.sale_id,
    invoice_number: s.invoice_number,
    customer_id: s.customer_id || undefined,
    customer_name: s.customer_name || s.db_customer_name || undefined,
    sale_date: s.sale_date,
    product_id: s.product_id,
    unit_price: Number(s.unit_price),
    quantity: s.quantity,
    total_amount: Number(s.total_amount),
    notes: s.notes || undefined,
    created_at: s.created_at,
    product: {
      product_id: s.product_id,
      product_name: s.product_name,
      sku: s.sku
    },
    customer: s.customer_id ? {
      customer_id: s.customer_id,
      customer_name: s.db_customer_name || ''
    } : undefined
  }));
});
