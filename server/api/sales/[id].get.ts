// API endpoint for getting a single sale by ID with items
import { queryOne, queryAll } from '~/server/utils/db';
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

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Sale ID is required'
    });
  }
  
  const sale = queryOne<SaleRow>(`
    SELECT 
      s.*,
      p.product_name,
      p.sku,
      c.customer_name as db_customer_name
    FROM Sales s
    LEFT JOIN Products p ON s.product_id = p.product_id
    LEFT JOIN Customers c ON s.customer_id = c.customer_id
    WHERE s.sale_id = ?
  `, [id]);
  
  if (!sale) {
    throw createError({
      statusCode: 404,
      message: 'Sale not found'
    });
  }
  
  // Get sale items
  const itemRows = queryAll<SaleItemRow>(`
    SELECT si.*, p.product_name, p.sku
    FROM SaleItems si
    LEFT JOIN Products p ON si.product_id = p.product_id
    WHERE si.sale_id = ?
  `, [id]);
  
  const items: SaleItem[] = itemRows.length > 0 
    ? itemRows.map(item => ({
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
      }))
    : [{
        product_id: sale.product_id,
        quantity: sale.quantity,
        unit_price: Number(sale.unit_price),
        amount: Number(sale.total_amount),
        product: {
          product_id: sale.product_id,
          product_name: sale.product_name,
          sku: sale.sku
        }
      }];
  
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  
  return {
    sale_id: sale.sale_id,
    invoice_number: sale.invoice_number,
    customer_id: sale.customer_id || undefined,
    customer_name: sale.customer_name || sale.db_customer_name || undefined,
    sale_date: sale.sale_date,
    product_id: sale.product_id,
    unit_price: Number(sale.unit_price),
    quantity: sale.quantity,
    subtotal,
    total_amount: Number(sale.total_amount),
    notes: sale.notes || undefined,
    created_at: sale.created_at,
    items,
    product: {
      product_id: sale.product_id,
      product_name: sale.product_name,
      sku: sale.sku
    },
    customer: sale.customer_id ? {
      customer_id: sale.customer_id,
      customer_name: sale.db_customer_name || ''
    } : undefined
  } as Sale;
});
