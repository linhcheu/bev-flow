// API endpoint for getting all sales with items
import { queryAll } from '~/server/utils/db';
import type { Sale, SaleItem } from '~/types';

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

interface SaleItemRow {
  item_id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  amount: number;
  product_name: string;
  sku: string;
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
  
  // Get all items for efficiency
  const allItems = queryAll<SaleItemRow>(`
    SELECT si.*, p.product_name, p.sku
    FROM SaleItems si
    LEFT JOIN Products p ON si.product_id = p.product_id
  `);
  
  // Group items by sale_id
  const itemsBySale = new Map<number, SaleItem[]>();
  for (const item of allItems) {
    const saleItems = itemsBySale.get(item.sale_id) || [];
    saleItems.push({
      item_id: item.item_id,
      sale_id: item.sale_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
      amount: Number(item.amount),
      product: {
        product_id: item.product_id,
        product_name: item.product_name,
        sku: item.sku
      }
    });
    itemsBySale.set(item.sale_id, saleItems);
  }
  
  // Transform to include items
  return sales.map((s): Sale => {
    const items = itemsBySale.get(s.sale_id) || [];
    const subtotal = items.length > 0 
      ? items.reduce((sum, item) => sum + item.amount, 0)
      : Number(s.total_amount);
    
    return {
      sale_id: s.sale_id,
      invoice_number: s.invoice_number,
      customer_id: s.customer_id || undefined,
      customer_name: s.customer_name || s.db_customer_name || undefined,
      sale_date: s.sale_date,
      product_id: s.product_id,
      unit_price: Number(s.unit_price),
      quantity: s.quantity,
      subtotal,
      total_amount: Number(s.total_amount),
      notes: s.notes || undefined,
      created_at: s.created_at,
      items: items.length > 0 ? items : [{
        product_id: s.product_id,
        quantity: s.quantity,
        unit_price: Number(s.unit_price),
        amount: Number(s.total_amount),
        product: {
          product_id: s.product_id,
          product_name: s.product_name,
          sku: s.sku
        }
      }],
      product: {
        product_id: s.product_id,
        product_name: s.product_name,
        sku: s.sku
      },
      customer: s.customer_id ? {
        customer_id: s.customer_id,
        customer_name: s.db_customer_name || ''
      } : undefined
    };
  });
});
