import { defineEventHandler, readBody } from 'h3';
import { useSupabase } from '~/server/utils/supabase';

// POST: Create or update product availability for a supplier
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const { product_id, supplier_id, is_available, supplier_sku, supplier_price, lead_time_days, notes } = body;

  if (!product_id || !supplier_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'product_id and supplier_id are required',
    });
  }

  try {
    const supabase = useSupabase();
    // Upsert the availability record
    const { data, error } = await supabase
      .from('product_supplier_availability')
      .upsert(
        {
          product_id,
          supplier_id,
          is_available: is_available ?? true,
          supplier_sku,
          supplier_price,
          lead_time_days,
          notes,
        },
        {
          onConflict: 'product_id,supplier_id',
        }
      )
      .select()
      .single();

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
      statusMessage: err.message || 'Failed to save product availability',
    });
  }
});
