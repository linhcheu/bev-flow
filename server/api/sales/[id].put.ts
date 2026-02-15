// API endpoint for updating a sale with multi-item support
import { execute, queryOne, queryAll, useDatabase, isProduction, getSupabase } from '~/server/utils/db';
import { batchUpdateDailyStockReport } from '~/server/utils/stock-report-helper';
import type { Sale, SaleItem, SaleItemFormData } from '~/types';

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

// Local interface for SQLite raw sale row (includes legacy single-product fields)
interface SaleRow {
  sale_id: number;
  invoice_number: string;
  customer_id: number | null;
  customer_name: string | null;
  sale_date: string;
  product_id: number | null;
  unit_price: number | null;
  quantity: number | null;
  total_amount: number;
  notes: string | null;
  created_at: string;
}

interface SaleRowWithJoins extends SaleRow {
  product_name: string;
  sku: string;
  db_customer_name: string | null;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Sale ID is required'
    });
  }
  
  const { invoice_number, customer_name, sale_date, items, notes } = body;
  const itemsArray: SaleItemFormData[] = items || [];
  const subtotal = itemsArray.reduce((sum: number, item: SaleItemFormData) => {
    return sum + (item.quantity * item.unit_price);
  }, 0);
  const total_amount = subtotal;
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    // Check if sale exists
    const { data: existing, error: fetchError } = await supabase
      .from('sales')
      .select('*')
      .eq('sale_id', id)
      .single();
    
    if (fetchError || !existing) {
      throw createError({ statusCode: 404, message: 'Sale not found' });
    }
    
    // Get old items to restore stock
    const { data: oldItems } = await supabase
      .from('saleitems')
      .select('product_id, quantity')
      .eq('sale_id', id);
    
    // Restore stock from old items
    for (const oldItem of (oldItems || [])) {
      const { data: product } = await supabase
        .from('products')
        .select('current_stock')
        .eq('product_id', oldItem.product_id)
        .single();
      
      if (product) {
        await supabase
          .from('products')
          .update({ current_stock: (product.current_stock || 0) + oldItem.quantity })
          .eq('product_id', oldItem.product_id);
      }
    }
    
    // Reverse old sold quantities in DailyStockReports
    const oldSaleDate = existing.sale_date || new Date().toISOString().split('T')[0];
    await batchUpdateDailyStockReport(
      (oldItems || []).map((oi: any) => ({ productId: oi.product_id, soldDelta: -oi.quantity, purchasedDelta: 0 })),
      oldSaleDate
    );

    // Delete old sale items
    await supabase.from('saleitems').delete().eq('sale_id', id);
    
    // Update main sale record - Supabase uses sale_number not invoice_number
    const { error: updateError } = await supabase
      .from('sales')
      .update({
        sale_number: invoice_number,
        customer_id: body.customer_id || null,
        sale_date,
        subtotal,
        discount_percent: body.discount_percent || 0,
        discount_amount: body.discount_amount || 0,
        total_amount,
        payment_method: body.payment_method || 'Cash',
        notes: notes || null
      })
      .eq('sale_id', id);
    
    if (updateError) {
      console.error('Error updating sale:', updateError);
      throw createError({ statusCode: 500, message: 'Failed to update sale' });
    }
    
    // Insert new items and update stock
    for (const item of itemsArray) {
      const amount = item.quantity * item.unit_price;
      await supabase.from('saleitems').insert({
        sale_id: Number(id),
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount
      });
      
      // Deduct stock for new items
      const { data: product } = await supabase
        .from('products')
        .select('current_stock')
        .eq('product_id', item.product_id)
        .single();
      
      if (product) {
        await supabase
          .from('products')
          .update({ current_stock: Math.max(0, (product.current_stock || 0) - item.quantity) })
          .eq('product_id', item.product_id);
      }
    }
    
    // Record new sold quantities in DailyStockReports
    const newSaleDate = sale_date || existing.sale_date || new Date().toISOString().split('T')[0];
    await batchUpdateDailyStockReport(
      itemsArray.map((item: SaleItemFormData) => ({ productId: item.product_id, soldDelta: item.quantity, purchasedDelta: 0 })),
      newSaleDate
    );

    // Get updated items
    const { data: updatedItems } = await supabase
      .from('saleitems')
      .select(`
        *,
        products (product_id, product_name, sku)
      `)
      .eq('sale_id', id);
    
    // Get updated sale
    const { data: updated } = await supabase
      .from('sales')
      .select(`
        *,
        customers (customer_id, customer_name)
      `)
      .eq('sale_id', id)
      .single();
    
    const resultItems: SaleItem[] = (updatedItems || []).map((item: any) => ({
      item_id: item.item_id,
      sale_id: item.sale_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
      amount: Number(item.amount),
      product: {
        product_id: item.product_id,
        product_name: item.products?.product_name || '',
        sku: item.products?.sku || ''
      }
    }));
    
    return {
      sale_id: updated?.sale_id,
      sale_number: updated?.sale_number,
      customer_id: updated?.customer_id || undefined,
      sale_date: updated?.sale_date,
      subtotal,
      discount_percent: Number(updated?.discount_percent || 0),
      discount_amount: Number(updated?.discount_amount || 0),
      total_amount: Number(updated?.total_amount),
      payment_method: updated?.payment_method,
      status: updated?.status,
      notes: updated?.notes || undefined,
      created_at: updated?.created_at,
      items: resultItems,
      customer: updated?.customer_id ? {
        customer_id: updated.customer_id,
        customer_name: updated.customers?.customer_name || ''
      } : undefined
    } as Sale;
  }
  
  // Development: Use SQLite
  // Check if sale exists
  const existing = queryOne<SaleRow>('SELECT * FROM Sales WHERE sale_id = ?', [id]);
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Sale not found'
    });
  }
  
  // Get first item for backwards compatibility with old single-product schema
  const firstItem = itemsArray[0] || { product_id: existing.product_id, quantity: existing.quantity, unit_price: existing.unit_price };
  
  const db = useDatabase();
  
  // Get old items to restore stock
  const oldItems = queryAll<{ product_id: number; quantity: number }>(`
    SELECT product_id, quantity FROM SaleItems WHERE sale_id = ?
  `, [id]);
  
  // Reverse old sold quantities in DailyStockReports
  const oldSaleDate = existing.sale_date || new Date().toISOString().split('T')[0];
  await batchUpdateDailyStockReport(
    oldItems.map(oi => ({ productId: oi.product_id, soldDelta: -oi.quantity, purchasedDelta: 0 })),
    oldSaleDate
  );

  // Restore old stock and apply new stock in a transaction
  db.transaction(() => {
    // Restore stock from old items
    for (const oldItem of oldItems) {
      execute(`
        UPDATE Products 
        SET current_stock = current_stock + ? 
        WHERE product_id = ?
      `, [oldItem.quantity, oldItem.product_id]);
    }
    
    // Also restore from old main record if no items existed
    if (oldItems.length === 0 && existing.product_id) {
      execute(`
        UPDATE Products 
        SET current_stock = current_stock + ? 
        WHERE product_id = ?
      `, [existing.quantity, existing.product_id]);
    }
    
    // Delete old sale items
    execute(`DELETE FROM SaleItems WHERE sale_id = ?`, [id]);
    
    // Update main sale record
    execute(`
      UPDATE Sales 
      SET invoice_number = ?,
          customer_name = ?,
          sale_date = ?,
          product_id = ?,
          unit_price = ?,
          quantity = ?,
          total_amount = ?,
          notes = ?
      WHERE sale_id = ?
    `, [
      invoice_number, 
      customer_name || null, 
      sale_date, 
      firstItem.product_id, 
      firstItem.unit_price, 
      firstItem.quantity, 
      total_amount, 
      notes || null, 
      id
    ]);
    
    // Insert new items and update stock
    for (const item of itemsArray) {
      const amount = item.quantity * item.unit_price;
      execute(`
        INSERT INTO SaleItems (sale_id, product_id, quantity, unit_price, amount)
        VALUES (?, ?, ?, ?, ?)
      `, [id, item.product_id, item.quantity, item.unit_price, amount]);
      
      // Deduct stock for new items
      execute(`
        UPDATE Products 
        SET current_stock = current_stock - ? 
        WHERE product_id = ?
      `, [item.quantity, item.product_id]);
    }
  })();
  
  // Record new sold quantities in DailyStockReports
  const newSaleDate = sale_date || existing.sale_date || new Date().toISOString().split('T')[0];
  await batchUpdateDailyStockReport(
    itemsArray.map((item: SaleItemFormData) => ({ productId: item.product_id, soldDelta: item.quantity, purchasedDelta: 0 })),
    newSaleDate
  );

  // Get updated items
  const updatedItems = queryAll<SaleItemRow>(`
    SELECT si.*, p.product_name, p.sku
    FROM SaleItems si
    LEFT JOIN Products p ON si.product_id = p.product_id
    WHERE si.sale_id = ?
  `, [id]);
  
  // Return updated sale with items
  const updated = queryOne<SaleRowWithJoins>(`
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
  
  const resultItems: SaleItem[] = updatedItems.map(item => ({
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
  }));
  
  return {
    sale_id: updated?.sale_id,
    sale_number: updated?.invoice_number || '',
    customer_id: updated?.customer_id || undefined,
    sale_date: updated?.sale_date,
    subtotal,
    total_amount: Number(updated?.total_amount),
    notes: updated?.notes || undefined,
    created_at: updated?.created_at,
    items: resultItems,
    customer: updated?.customer_id ? {
      customer_id: updated.customer_id,
      customer_name: updated.db_customer_name || ''
    } : undefined
  } as Sale;
});
