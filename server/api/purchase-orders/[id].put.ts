// API endpoint for updating a purchase order
import { execute, queryOne, queryAll, isProduction, getSupabase } from '~/server/utils/db';
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
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    // Check if PO exists
    const { data: existing, error: fetchError } = await supabase
      .from('purchaseorders')
      .select('*')
      .eq('po_id', id)
      .single();
    
    if (fetchError || !existing) {
      throw createError({ statusCode: 404, message: 'Purchase order not found' });
    }
    
    let subtotal = existing.subtotal || 0;
    let shippingCost = existing.shipping_cost || 0;
    let totalAmount = existing.total_amount || 0;
    
    if (body.items && body.items.length > 0) {
      subtotal = body.items.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);
      const shippingRate = 3.00;
      shippingCost = subtotal * (shippingRate / 100);
      
      // Handle promotion
      const promotionPercent = body.promotion_percent ?? existing.promotion_percent ?? 0;
      let promotionAmount = body.promotion_amount ?? existing.promotion_amount ?? 0;
      
      // If promotion_percent is provided and amount is not, calculate amount
      if (promotionPercent > 0 && body.promotion_amount === undefined) {
        promotionAmount = (subtotal + shippingCost) * (promotionPercent / 100);
      }
      
      totalAmount = subtotal + shippingCost - promotionAmount;
      
      // Delete existing items
      await supabase.from('purchaseorderitems').delete().eq('po_id', id);
      
      // Insert new items
      const itemsData = body.items.map(item => ({
        po_id: Number(id),
        product_id: item.product_id,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
        amount: item.quantity * item.unit_cost
      }));
      await supabase.from('purchaseorderitems').insert(itemsData);
    }
    
    // If status is changing to 'Received', update product stock
    if (body.status === 'Received' && existing.status !== 'Received') {
      const { data: items } = await supabase
        .from('purchaseorderitems')
        .select('product_id, quantity')
        .eq('po_id', id);
      
      for (const item of (items || [])) {
        const { data: product } = await supabase
          .from('products')
          .select('current_stock')
          .eq('product_id', item.product_id)
          .single();
        
        if (product) {
          await supabase
            .from('products')
            .update({ current_stock: (product.current_stock || 0) + item.quantity })
            .eq('product_id', item.product_id);
        }
      }
    }
    
    // Update the purchase order
    await supabase
      .from('purchaseorders')
      .update({
        po_number: body.po_number || existing.po_number,
        supplier_id: body.supplier_id || existing.supplier_id,
        order_date: body.order_date || existing.order_date,
        eta_date: body.eta_date || existing.eta_date,
        subtotal,
        shipping_cost: shippingCost,
        promotion_percent: body.promotion_percent ?? existing.promotion_percent,
        promotion_amount: body.promotion_amount ?? existing.promotion_amount,
        promotion_text: body.promotion_text ?? existing.promotion_text,
        total_amount: totalAmount,
        status: body.status || existing.status,
        truck_remark: body.truck_remark ?? existing.truck_remark,
        overall_remark: body.overall_remark ?? existing.overall_remark,
        third_party_agent: body.third_party_agent ?? existing.third_party_agent,
        agent_phone: body.agent_phone ?? existing.agent_phone,
        agent_email: body.agent_email ?? existing.agent_email,
        agent_address: body.agent_address ?? existing.agent_address,
        updated_at: new Date().toISOString()
      })
      .eq('po_id', id);
    
    // Fetch updated order with items
    const { data: order } = await supabase
      .from('purchaseorders')
      .select(`
        *,
        suppliers (supplier_id, company_name)
      `)
      .eq('po_id', id)
      .single();
    
    const { data: items } = await supabase
      .from('purchaseorderitems')
      .select(`
        *,
        products (product_id, product_name, sku)
      `)
      .eq('po_id', id);
    
    return {
      ...order,
      supplier: order?.suppliers ? {
        supplier_id: order.suppliers.supplier_id,
        company_name: order.suppliers.company_name,
      } : null,
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
    
    // Handle promotion
    const promotionPercent = body.promotion_percent ?? existing.promotion_percent ?? 0;
    let promotionAmount = body.promotion_amount ?? existing.promotion_amount ?? 0;
    
    // If promotion_percent is provided and amount is not, calculate amount
    if (promotionPercent > 0 && body.promotion_amount === undefined) {
      promotionAmount = (subtotal + shippingCost) * (promotionPercent / 100);
    }
    
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
      promotion_percent = COALESCE(?, promotion_percent),
      promotion_amount = COALESCE(?, promotion_amount),
      promotion_text = COALESCE(?, promotion_text),
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
    body.promotion_percent,
    body.promotion_amount,
    body.promotion_text,
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
