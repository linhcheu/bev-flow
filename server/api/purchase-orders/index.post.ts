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

// Generate next sequential PO number
const generateNextPONumber = (): string => {
  const result = queryOne<{ max_po: string | null }>(`
    SELECT po_number as max_po FROM PurchaseOrders 
    WHERE po_number LIKE 'PO-%' 
    ORDER BY CAST(SUBSTR(po_number, 4) AS INTEGER) DESC 
    LIMIT 1
  `);
  
  let nextNum = 1;
  if (result?.max_po) {
    const match = result.max_po.match(/PO-(\d+)/);
    if (match) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }
  return `PO-${String(nextNum).padStart(4, '0')}`;
};

// Generate next PO number for Supabase
const generateNextPONumberSupabase = async (): Promise<string> => {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('purchaseorders')
    .select('po_number')
    .like('po_number', 'PO-%')
    .order('po_number', { ascending: false })
    .limit(1);
  
  let nextNum = 1;
  if (data && data[0]?.po_number) {
    const match = data[0].po_number.match(/PO-(\d+)/);
    if (match) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }
  return `PO-${String(nextNum).padStart(4, '0')}`;
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
  
  // Calculate total
  const promotionAmount = body.promotion_amount || 0;
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
        promotion_amount: promotionAmount,
        total_amount: totalAmount,
        status: 'Pending',
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
      subtotal, shipping_rate, shipping_cost, promotion_amount, promotion_text, total_amount,
      status, truck_remark, overall_remark,
      third_party_agent, agent_phone, agent_email, agent_address
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    poNumber,
    body.supplier_id,
    body.order_date || new Date().toISOString().split('T')[0],
    body.eta_date || null,
    subtotal,
    shippingRate,
    shippingCost,
    promotionAmount,
    body.promotion_text || null,
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
