// API endpoint for getting all purchase orders with items
import { queryAll, isProduction, getSupabase } from '~/server/utils/db';
import type { PurchaseOrder, PurchaseOrderItem } from '~/types';

interface PurchaseOrderRow {
  po_id: number;
  po_number: string;
  supplier_id: number;
  order_date: string;
  eta_date: string | null;
  subtotal: number;
  shipping_rate: number;
  shipping_cost: number;
  promotion_percent: number;
  promotion_amount: number;
  promotion_text: string | null;
  total_amount: number;
  status: string;
  payment_method: string | null;
  payment_status: string | null;
  payment_date: string | null;
  payment_attachment: string | null;
  authorized_by: string | null;
  authorized_signature: string | null;
  authorization_date: string | null;
  truck_remark: string | null;
  overall_remark: string | null;
  third_party_agent: string | null;
  agent_phone: string | null;
  agent_email: string | null;
  agent_address: string | null;
  created_at: string;
  updated_at: string;
  supplier_name: string;
  contact_person: string | null;
  supplier_phone: string | null;
  supplier_email: string | null;
  supplier_address: string | null;
  supplier_lead_time_days: number | null;
  supplier_payment_method: string | null;
}

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

export default defineEventHandler(async () => {
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data: orders, error } = await supabase
      .from('purchaseorders')
      .select(`
        *,
        suppliers (
          supplier_id,
          company_name,
          contact_person,
          phone,
          email,
          address,
          lead_time_days,
          payment_method
        )
      `)
      .order('order_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching purchase orders:', error);
      throw createError({ statusCode: 500, message: 'Failed to fetch purchase orders' });
    }
    
    // Get all PO items
    const { data: items } = await supabase
      .from('purchaseorderitems')
      .select(`
        *,
        products (
          product_id,
          product_name,
          sku,
          description
        )
      `);
    
    // Group items by po_id
    const itemsByPO: Record<number, PurchaseOrderItem[]> = {};
    for (const item of items || []) {
      if (!itemsByPO[item.po_id]) {
        itemsByPO[item.po_id] = [];
      }
      itemsByPO[item.po_id].push({
        item_id: item.item_id,
        po_id: item.po_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_cost: Number(item.unit_cost),
        amount: Number(item.amount),
        product: {
          product_id: item.product_id,
          product_name: (item.products as any)?.product_name || '',
          sku: (item.products as any)?.sku || '',
          description: (item.products as any)?.description || undefined,
        },
      });
    }
    
    return (orders || []).map((o: any): PurchaseOrder => ({
      po_id: o.po_id,
      po_number: o.po_number,
      supplier_id: o.supplier_id,
      order_date: o.order_date,
      eta_date: o.eta_date || undefined,
      subtotal: Number(o.subtotal),
      shipping_rate: Number(o.shipping_rate),
      shipping_cost: Number(o.shipping_cost),
      promotion_percent: Number(o.promotion_percent || 0),
      promotion_amount: Number(o.promotion_amount),
      promotion_text: o.promotion_text || undefined,
      total_amount: Number(o.total_amount),
      status: o.status as PurchaseOrder['status'],
      payment_method: o.payment_method || 'Collect',
      payment_status: o.payment_status || 'Unpaid',
      payment_date: o.payment_date || undefined,
      payment_attachment: o.payment_attachment || undefined,
      authorized_by: o.authorized_by || undefined,
      authorized_signature: o.authorized_signature || undefined,
      authorization_date: o.authorization_date || undefined,
      truck_remark: o.truck_remark || undefined,
      overall_remark: o.overall_remark || undefined,
      third_party_agent: o.third_party_agent || undefined,
      agent_phone: o.agent_phone || undefined,
      agent_email: o.agent_email || undefined,
      agent_address: o.agent_address || undefined,
      created_at: o.created_at,
      updated_at: o.updated_at,
      supplier: {
        supplier_id: o.supplier_id,
        company_name: o.suppliers?.company_name || '',
        contact_person: o.suppliers?.contact_person || undefined,
        phone: o.suppliers?.phone || undefined,
        email: o.suppliers?.email || undefined,
        address: o.suppliers?.address || undefined,
        lead_time_days: o.suppliers?.lead_time_days || 7,
        payment_method: o.suppliers?.payment_method || undefined,
      },
      items: itemsByPO[o.po_id] || [],
    }));
  }
  
  // Development: Use SQLite
  // Get all purchase orders with supplier info
  const orders = queryAll<PurchaseOrderRow>(`
    SELECT 
      po.*,
      s.company_name as supplier_name,
      s.contact_person,
      s.phone as supplier_phone,
      s.email as supplier_email,
      s.address as supplier_address,
      s.lead_time_days as supplier_lead_time_days,
      s.payment_method as supplier_payment_method
    FROM PurchaseOrders po
    LEFT JOIN Suppliers s ON po.supplier_id = s.supplier_id
    ORDER BY po.order_date DESC
  `);

  // Get all items for these orders
  const items = queryAll<POItemRow>(`
    SELECT 
      poi.*,
      p.product_name,
      p.sku,
      p.description
    FROM PurchaseOrderItems poi
    LEFT JOIN Products p ON poi.product_id = p.product_id
  `);

  // Group items by po_id
  const itemsByPO = items.reduce((acc, item) => {
    if (!acc[item.po_id]) {
      acc[item.po_id] = [];
    }
    acc[item.po_id].push({
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
    });
    return acc;
  }, {} as Record<number, PurchaseOrderItem[]>);

  // Transform to include related objects
  return orders.map((o): PurchaseOrder => ({
    po_id: o.po_id,
    po_number: o.po_number,
    supplier_id: o.supplier_id,
    order_date: o.order_date,
    eta_date: o.eta_date || undefined,
    subtotal: Number(o.subtotal),
    shipping_rate: Number(o.shipping_rate),
    shipping_cost: Number(o.shipping_cost),
    promotion_percent: Number(o.promotion_percent || 0),
    promotion_amount: Number(o.promotion_amount),
    promotion_text: o.promotion_text || undefined,
    total_amount: Number(o.total_amount),
    status: o.status as PurchaseOrder['status'],
    payment_method: (o.payment_method || 'Collect') as PurchaseOrder['payment_method'],
    payment_status: (o.payment_status || 'Unpaid') as PurchaseOrder['payment_status'],
    payment_date: o.payment_date || undefined,
    payment_attachment: o.payment_attachment || undefined,
    authorized_by: o.authorized_by || undefined,
    authorized_signature: o.authorized_signature || undefined,
    authorization_date: o.authorization_date || undefined,
    truck_remark: o.truck_remark || undefined,
    overall_remark: o.overall_remark || undefined,
    third_party_agent: o.third_party_agent || undefined,
    agent_phone: o.agent_phone || undefined,
    agent_email: o.agent_email || undefined,
    agent_address: o.agent_address || undefined,
    created_at: o.created_at,
    updated_at: o.updated_at,
    supplier: {
      supplier_id: o.supplier_id,
      company_name: o.supplier_name,
      contact_person: o.contact_person || undefined,
      phone: o.supplier_phone || undefined,
      email: o.supplier_email || undefined,
      address: o.supplier_address || undefined,
      lead_time_days: o.supplier_lead_time_days || 7,
      payment_method: o.supplier_payment_method as 'Prepaid' | 'Collect' | 'Credit' | 'COD' | undefined,
    },
    items: itemsByPO[o.po_id] || [],
  }));
});
