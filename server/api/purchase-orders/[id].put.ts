// API endpoint for updating a purchase order
import { execute, queryOne, queryAll } from '~/server/utils/db';
import type { PurchaseOrder, PurchaseOrderFormData, PurchaseOrderItem } from '~/types';

interface POItemRow {
  item_id: number;
  po_id: number;
  product_id: number;
  quantity: number;
  unit_cost: number;
  amount: number;
  product_name: string;
  sku: string;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody<Partial<PurchaseOrderFormData> & { status?: string }>(event);
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Purchase order ID is required'
    });
  }
  
  // Check if PO exists
  const existing = queryOne<PurchaseOrder>('SELECT * FROM PurchaseOrders WHERE po_id = ?', [id]);
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Purchase order not found'
    });
  }
  
  // If items are provided, recalculate totals
  let subtotal = existing.subtotal || 0;
  let shippingCost = existing.shipping_cost || 0;
  let totalAmount = existing.total_amount || 0;
  
  if (body.items && body.items.length > 0) {
    // Calculate new subtotal
    subtotal = body.items.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);
    
    // Calculate shipping (3% default)
    const shippingRate = 3.00;
    shippingCost = subtotal * (shippingRate / 100);
    
    // Calculate total
    const promotionAmount = body.promotion_amount ?? existing.promotion_amount ?? 0;
    totalAmount = subtotal + shippingCost - promotionAmount;
    
    // Delete existing items and insert new ones
    execute('DELETE FROM PurchaseOrderItems WHERE po_id = ?', [id]);
    
    for (const item of body.items) {
      const itemAmount = item.quantity * item.unit_cost;
      execute(`
        INSERT INTO PurchaseOrderItems (po_id, product_id, quantity, unit_cost, amount)
        VALUES (?, ?, ?, ?, ?)
      `, [id, item.product_id, item.quantity, item.unit_cost, itemAmount]);
    }
  }
  
  // If status is changing to 'Received', update product stock
  if (body.status === 'Received' && existing.status !== 'Received') {
    const items = queryAll<{ product_id: number; quantity: number }>('SELECT product_id, quantity FROM PurchaseOrderItems WHERE po_id = ?', [id]);
    for (const item of items) {
      execute('UPDATE Products SET current_stock = current_stock + ? WHERE product_id = ?', [item.quantity, item.product_id]);
    }
  }
  
  // Update the purchase order
  execute(`
    UPDATE PurchaseOrders SET
      po_number = COALESCE(?, po_number),
      supplier_id = COALESCE(?, supplier_id),
      order_date = COALESCE(?, order_date),
      eta_date = COALESCE(?, eta_date),
      subtotal = ?,
      shipping_cost = ?,
      promotion_amount = COALESCE(?, promotion_amount),
      total_amount = ?,
      status = COALESCE(?, status),
      truck_remark = COALESCE(?, truck_remark),
      overall_remark = COALESCE(?, overall_remark),
      third_party_agent = COALESCE(?, third_party_agent),
      agent_phone = COALESCE(?, agent_phone),
      agent_email = COALESCE(?, agent_email),
      agent_address = COALESCE(?, agent_address),
      updated_at = CURRENT_TIMESTAMP
    WHERE po_id = ?
  `, [
    body.po_number,
    body.supplier_id,
    body.order_date,
    body.eta_date,
    subtotal,
    shippingCost,
    body.promotion_amount,
    totalAmount,
    body.status,
    body.truck_remark,
    body.overall_remark,
    body.third_party_agent,
    body.agent_phone,
    body.agent_email,
    body.agent_address,
    id
  ]);
  
  // Fetch updated order with items
  const order = queryOne<PurchaseOrder & { supplier_name: string }>(`
    SELECT po.*, s.company_name as supplier_name
    FROM PurchaseOrders po
    LEFT JOIN Suppliers s ON po.supplier_id = s.supplier_id
    WHERE po.po_id = ?
  `, [id]);
  
  const items = queryAll<POItemRow>(`
    SELECT poi.*, p.product_name, p.sku
    FROM PurchaseOrderItems poi
    LEFT JOIN Products p ON poi.product_id = p.product_id
    WHERE poi.po_id = ?
  `, [id]);
  
  return {
    ...order,
    supplier: {
      supplier_id: order?.supplier_id,
      company_name: order?.supplier_name,
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
      },
    })),
  };
});
