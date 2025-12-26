// API endpoint for creating a purchase order with items
import { execute, getLastInsertId, queryOne, queryAll } from '~/server/utils/db';
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
  const body = await readBody<PurchaseOrderFormData>(event);
  
  if (!body.po_number || !body.supplier_id || !body.items || body.items.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'PO number, supplier ID, and at least one item are required'
    });
  }
  
  // Calculate subtotal from items
  const subtotal = body.items.reduce((sum, item) => {
    return sum + (item.quantity * item.unit_cost);
  }, 0);
  
  // Calculate shipping (3% default)
  const shippingRate = 3.00;
  const shippingCost = subtotal * (shippingRate / 100);
  
  // Calculate total
  const promotionAmount = body.promotion_amount || 0;
  const totalAmount = subtotal + shippingCost - promotionAmount;
  
  // Insert purchase order
  execute(`
    INSERT INTO PurchaseOrders (
      po_number, supplier_id, order_date, eta_date, 
      subtotal, shipping_rate, shipping_cost, promotion_amount, total_amount,
      status, truck_remark, overall_remark,
      third_party_agent, agent_phone, agent_email, agent_address
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    body.po_number,
    body.supplier_id,
    body.order_date || new Date().toISOString().split('T')[0],
    body.eta_date || null,
    subtotal,
    shippingRate,
    shippingCost,
    promotionAmount,
    totalAmount,
    'Pending',
    body.truck_remark || null,
    body.overall_remark || null,
    body.third_party_agent || null,
    body.agent_phone || null,
    body.agent_email || null,
    body.agent_address || null
  ]);
  
  const poId = getLastInsertId();
  
  // Insert items
  for (const item of body.items) {
    const itemAmount = item.quantity * item.unit_cost;
    execute(`
      INSERT INTO PurchaseOrderItems (po_id, product_id, quantity, unit_cost, amount)
      VALUES (?, ?, ?, ?, ?)
    `, [poId, item.product_id, item.quantity, item.unit_cost, itemAmount]);
  }
  
  // Fetch the created order with items
  const order = queryOne<PurchaseOrder>(`
    SELECT po.*, s.company_name as supplier_name
    FROM PurchaseOrders po
    LEFT JOIN Suppliers s ON po.supplier_id = s.supplier_id
    WHERE po.po_id = ?
  `, [poId]);
  
  const items = queryAll<POItemRow>(`
    SELECT poi.*, p.product_name, p.sku
    FROM PurchaseOrderItems poi
    LEFT JOIN Products p ON poi.product_id = p.product_id
    WHERE poi.po_id = ?
  `, [poId]);
  
  return {
    ...order,
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
