// API endpoint for getting all purchase orders
import { queryAll } from '~/server/utils/db';
import type { PurchaseOrder } from '~/types';

interface PurchaseOrderRow extends PurchaseOrder {
  supplier_name: string;
  product_name: string;
  sku: string;
}

export default defineEventHandler(async () => {
  const orders = queryAll<PurchaseOrderRow>(`
    SELECT 
      po.*,
      s.company_name as supplier_name,
      p.product_name,
      p.sku
    FROM PurchaseOrders po
    LEFT JOIN Suppliers s ON po.supplier_id = s.supplier_id
    LEFT JOIN Products p ON po.product_id = p.product_id
    ORDER BY po.order_date DESC
  `);
  
  // Transform to include related objects
  return orders.map(o => ({
    ...o,
    total_amount: Number(o.quantity) * Number(o.unit_cost),
    supplier: o.supplier_id ? {
      supplier_id: o.supplier_id,
      company_name: o.supplier_name
    } : null,
    product: o.product_id ? {
      product_id: o.product_id,
      product_name: o.product_name,
      sku: o.sku
    } : null
  }));
});
