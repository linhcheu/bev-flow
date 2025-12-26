// API endpoint for getting a single purchase order with items
import { queryOne, queryAll } from '~/server/utils/db';
import type { PurchaseOrder, PurchaseOrderItem } from '~/types';

interface POItemRow {
  item_id: number;
  po_id: number;
  product_id: number;
  quantity: number;
  unit_cost: number;
  amount: number;
  product_name: string;
  sku: string;
  description: string | null;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Purchase order ID is required'
    });
  }
  
  const order = queryOne<PurchaseOrder & { supplier_name: string }>(`
    SELECT 
      po.*,
      s.company_name as supplier_name,
      s.contact_person,
      s.phone as supplier_phone,
      s.email as supplier_email,
      s.address as supplier_address
    FROM PurchaseOrders po
    LEFT JOIN Suppliers s ON po.supplier_id = s.supplier_id
    WHERE po.po_id = ?
  `, [id]);
  
  if (!order) {
    throw createError({
      statusCode: 404,
      message: 'Purchase order not found'
    });
  }
  
  const items = queryAll<POItemRow>(`
    SELECT poi.*, p.product_name, p.sku, p.description
    FROM PurchaseOrderItems poi
    LEFT JOIN Products p ON poi.product_id = p.product_id
    WHERE poi.po_id = ?
  `, [id]);
  
  return {
    ...order,
    supplier: {
      supplier_id: order.supplier_id,
      company_name: order.supplier_name,
    },
    items: items.map((item): PurchaseOrderItem => ({
      item_id: item.item_id,
      po_id: item.po_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_cost: Number(item.unit_cost),
      amount: Number(item.amount),
      product: {
        product_id: item.product_id,
        product_name: item.product_name,
        sku: item.sku,
        description: item.description || undefined,
      },
    })),
  };
});
