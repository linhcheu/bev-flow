// API endpoint for creating a sale with multiple items
import { execute, getLastInsertId, queryOne, queryAll, isProduction, getSupabase } from '~/server/utils/db';
import { batchUpdateDailyStockReport } from '~/server/utils/stock-report-helper';
import type { Sale, SaleFormData, SaleItem } from '~/types';

interface ProductRow {
  product_id: number;
  product_name: string;
  sku: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SaleFormData>(event);
  
  if (!body.sale_number || !body.items || body.items.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Sale number and at least one item are required'
    });
  }
  
  // Calculate totals
  const subtotal = body.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const totalAmount = subtotal - (body.discount_amount || 0);
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    // Insert sale record
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        sale_number: body.sale_number,
        customer_id: body.customer_id || null,
        sale_date: body.sale_date || new Date().toISOString().split('T')[0],
        subtotal: subtotal,
        discount_percent: body.discount_percent || 0,
        discount_amount: body.discount_amount || 0,
        total_amount: totalAmount,
        payment_method: body.payment_method || 'Cash',
        status: 'Completed',
        notes: body.notes || null
      })
      .select()
      .single();
    
    if (saleError) {
      console.error('Error creating sale:', saleError);
      throw createError({ statusCode: 500, message: 'Failed to create sale' });
    }
    
    // Insert sale items
    const saleItemsData = body.items.map(item => ({
      sale_id: sale.sale_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      amount: item.quantity * item.unit_price
    }));
    
    await supabase.from('saleitems').insert(saleItemsData);
    
    // Update product stock - deduct quantities
    for (const item of body.items) {
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
    
    // Update DailyStockReports — record sold quantities
    const saleDate = body.sale_date || new Date().toISOString().split('T')[0];
    await batchUpdateDailyStockReport(
      body.items.map(item => ({ productId: item.product_id, soldDelta: item.quantity, purchasedDelta: 0 })),
      saleDate
    );

    // Get sale items with product info
    const { data: saleItems } = await supabase
      .from('saleitems')
      .select(`
        *,
        products (product_id, product_name, sku)
      `)
      .eq('sale_id', sale.sale_id);
    
    return {
      ...sale,
      subtotal,
      total_amount: totalAmount,
      items: (saleItems || []).map((item: any) => ({
        ...item,
        product: {
          product_id: item.product_id,
          product_name: item.products?.product_name || '',
          sku: item.products?.sku || ''
        }
      }))
    };
  }
  
  // Development: Use SQLite
  // Insert sale record - map new field names to old SQLite schema
  execute(`
    INSERT INTO Sales (invoice_number, customer_id, customer_name, sale_date, product_id, unit_price, quantity, total_amount, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    body.sale_number, // Map sale_number to invoice_number for SQLite
    body.customer_id || null,
    null, // customer_name is no longer in the form
    body.sale_date || new Date().toISOString().split('T')[0],
    body.items[0].product_id, // For backward compatibility
    body.items[0].unit_price,
    body.items.reduce((sum, item) => sum + item.quantity, 0), // Total quantity
    totalAmount,
    body.notes || null
  ]);
  
  const saleId = getLastInsertId();
  
  // Insert sale items
  for (const item of body.items) {
    const amount = item.quantity * item.unit_price;
    execute(`
      INSERT INTO SaleItems (sale_id, product_id, quantity, unit_price, amount)
      VALUES (?, ?, ?, ?, ?)
    `, [saleId, item.product_id, item.quantity, item.unit_price, amount]);
    
    // Update product stock
    execute(`
      UPDATE Products 
      SET current_stock = current_stock - ?
      WHERE product_id = ?
    `, [item.quantity, item.product_id]);
  }
  
  // Update DailyStockReports — record sold quantities
  const saleDate = body.sale_date || new Date().toISOString().split('T')[0];
  await batchUpdateDailyStockReport(
    body.items.map(item => ({ productId: item.product_id, soldDelta: item.quantity, purchasedDelta: 0 })),
    saleDate
  );

  // Fetch the created sale with items
  const sale = queryOne<Sale>('SELECT * FROM Sales WHERE sale_id = ?', [saleId]);
  const saleItems = queryAll<SaleItem & ProductRow>(`
    SELECT si.*, p.product_name, p.sku
    FROM SaleItems si
    LEFT JOIN Products p ON si.product_id = p.product_id
    WHERE si.sale_id = ?
  `, [saleId]);
  
  return {
    ...sale,
    subtotal,
    total_amount: totalAmount,
    items: saleItems.map((item: SaleItem & ProductRow) => ({
      ...item,
      product: {
        product_id: item.product_id,
        product_name: item.product_name,
        sku: item.sku
      }
    }))
  };
});
