import { defineEventHandler, getQuery } from 'h3';
import { useSupabase } from '~/server/utils/supabase';

// GET: Fetch product availability by supplier
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const supplierId = query.supplier_id;
  const productId = query.product_id;

  try {
    const supabase = useSupabase();
    let queryBuilder = supabase
      .from('product_supplier_availability')
      .select(`
        *,
        product:products(product_id, product_name, sku, description, cost_price),
        supplier:suppliers(supplier_id, company_name, payment_method, lead_time_days)
      `);

    if (supplierId) {
      queryBuilder = queryBuilder.eq('supplier_id', supplierId);
    }
    
    if (productId) {
      queryBuilder = queryBuilder.eq('product_id', productId);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }

    return data;
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Failed to fetch product availability',
    });
  }
});
