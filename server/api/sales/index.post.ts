// API endpoint for creating a sale with multiple items
import { execute, getLastInsertId, queryOne, queryAll } from '~/server/utils/db';
import type { Sale, SaleFormData, SaleItem } from '~/types';

interface ProductRow {
  product_id: number;
  product_name: string;
  sku: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SaleFormData>(event);
  
  if (!body.invoice_number || !body.items || body.items.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Invoice number and at least one item are required'
    });
  }
  
  // Calculate totals
  const subtotal = body.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const totalAmount = subtotal - (body.discount_amount || 0);
  
  // Insert sale record (keeping product_id for backward compatibility, using first item)
  execute(`
    INSERT INTO Sales (invoice_number, customer_id, customer_name, sale_date, product_id, unit_price, quantity, total_amount, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    body.invoice_number,
    body.customer_id || null,
    body.customer_name || null,
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
