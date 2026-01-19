// API endpoint for creating a purchase order with items
import { execute, getLastInsertId, queryOne, queryAll, isProduction, getSupabase } from '~/server/utils/db';
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

// Generate next sequential PO number (SQLite)
const generateNextPONumber = (): string => {
  const result = queryOne<{ max_po: string | null }>(`
    SELECT po_number as max_po FROM PurchaseOrders 
    ORDER BY po_id DESC 
    LIMIT 1
  `);
  
  let maxNum = 0;
  if (result?.max_po) {
    // Handle new format PO-XXX-XXX
    let match = result.max_po.match(/PO-(\d+)-(\d+)/);
    if (match && match[1] && match[2]) {
      maxNum = parseInt(match[1], 10) * 1000 + parseInt(match[2], 10);
    } else {
      // Handle old format PO-XXXX
      match = result.max_po.match(/PO-(\d+)/);
      if (match) {
        maxNum = parseInt(match[1], 10);
      }
    }
  }
  
  const nextNum = maxNum + 1;
  const prefix = String(Math.floor(nextNum / 1000) || 1).padStart(3, '0');
  const suffix = String(nextNum % 1000 || nextNum).padStart(3, '0');
  return `PO-${prefix}-${suffix}`;
};

// Generate next PO number for Supabase
const generateNextPONumberSupabase = async (): Promise<string> => {
  const supabase = getSupabase();
  
  // Get all PO numbers and find the max numerically
  const { data } = await supabase
    .from('purchaseorders')
    .select('po_number');
  
  let maxNum = 0;
  if (data) {
    for (const po of data) {
      // Handle new format PO-XXX-XXX
      let match = po.po_number?.match(/PO-(\d+)-(\d+)/);
      if (match && match[1] && match[2]) {
        const num = parseInt(match[1], 10) * 1000 + parseInt(match[2], 10);
        if (num > maxNum) maxNum = num;
      } else {
        // Handle old format PO-XXXX
        match = po.po_number?.match(/PO-(\d+)/);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    }
  }
  
  const nextNum = maxNum + 1;
  const prefix = String(Math.floor(nextNum / 1000) || 1).padStart(3, '0');
  const suffix = String(nextNum % 1000 || nextNum).padStart(3, '0');
  return `PO-${prefix}-${suffix}`;
};

export default defineEventHandler(async (event) => {
  const body = await readBody<PurchaseOrderFormData>(event);
  
  if (!body.supplier_id || !body.items || body.items.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Supplier ID and at least one item are required'
    });
  }
  
  // Calculate subtotal from items
  const subtotal = body.items.reduce((sum, item) => {
    return sum + (item.quantity * item.unit_cost);
  }, 0);
  
  // Calculate shipping (3% default)
  const shippingRate = 3.00;
  const shippingCost = subtotal * (shippingRate / 100);
  
  // Calculate total with promotion
  const promotionPercent = body.promotion_percent || 0;
  let promotionAmount = body.promotion_amount || 0;
  
  // If promotion_percent is provided, calculate the amount
  if (promotionPercent > 0 && promotionAmount === 0) {
    promotionAmount = (subtotal + shippingCost) * (promotionPercent / 100);
  }
  
  const totalAmount = subtotal + shippingCost - promotionAmount;
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    const poNumber = await generateNextPONumberSupabase();
    
    const { data: order, error } = await supabase
      .from('purchaseorders')
      .insert({
        po_number: poNumber,
        supplier_id: body.supplier_id,
        order_date: body.order_date || new Date().toISOString().split('T')[0],
        eta_date: body.eta_date || null,
        subtotal,
        shipping_rate: shippingRate,
        shipping_cost: shippingCost,
        promotion_percent: promotionPercent,
        promotion_amount: promotionAmount,
        total_amount: totalAmount,
        status: 'Pending',
        payment_method: body.payment_method || 'Collect',
        payment_status: 'Unpaid',
        payment_attachment: body.payment_attachment || null,
        authorized_by: body.authorized_by || null,
        authorized_signature: body.authorized_signature || null,
        authorization_date: body.authorized_by ? new Date().toISOString().split('T')[0] : null,
        truck_remark: body.truck_remark || null,
        overall_remark: body.overall_remark || null,
        promotion_text: body.promotion_text || null,
        third_party_agent: body.third_party_agent || null,
        agent_phone: body.agent_phone || null,
        agent_email: body.agent_email || null,
        agent_address: body.agent_address || null
      })
      .select()
      .single();
    
    if (error || !order) {
      console.error('Error creating PO:', error);
      throw createError({ statusCode: 500, message: 'Failed to create purchase order' });
    }
    
    // Insert items
    const itemsData = body.items.map(item => ({
      po_id: order.po_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_cost: item.unit_cost,
      amount: item.quantity * item.unit_cost
    }));
    
    await supabase.from('purchaseorderitems').insert(itemsData);
    
    // Get items with product info
    const { data: items } = await supabase
      .from('purchaseorderitems')
      .select(`
        *,
        products (product_id, product_name, sku)
      `)
      .eq('po_id', order.po_id);
    
    return {
      ...order,
      items: (items || []).map((item: any): PurchaseOrderItem => ({
        item_id: item.item_id,
        po_id: item.po_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_cost: Number(item.unit_cost),
        amount: Number(item.amount),
        product: {
          product_id: item.product_id,
          product_name: item.products?.product_name || '',
          sku: item.products?.sku || '',
        },
      })),
    };
  }
  
  // Development: Use SQLite
  // Auto-generate PO number (ignore any user input)
  const poNumber = generateNextPONumber();
  
  // Insert purchase order
  execute(`
    INSERT INTO PurchaseOrders (
      po_number, supplier_id, order_date, eta_date,
      subtotal, shipping_rate, shipping_cost, promotion_percent, promotion_amount, promotion_text, total_amount,
      status, payment_method, payment_status, payment_attachment, authorized_by, authorized_signature, authorization_date,
      truck_remark, overall_remark,
      third_party_agent, agent_phone, agent_email, agent_address
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    poNumber,
    body.supplier_id,
    body.order_date || new Date().toISOString().split('T')[0],
    body.eta_date || null,
    subtotal,
    shippingRate,
    shippingCost,
    promotionPercent,
    promotionAmount,
    body.promotion_text || null,
    totalAmount,
    'Pending',
    body.payment_method || 'Collect',
    'Unpaid',
    body.payment_attachment || null,
    body.authorized_by || null,
    body.authorized_signature || null,
    body.authorized_by ? new Date().toISOString().split('T')[0] : null,
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
