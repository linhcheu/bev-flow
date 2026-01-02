// API endpoint for creating a forecast
import { execute, getLastInsertId, queryOne, isProduction, getSupabase } from '~/server/utils/db';
import type { Forecast } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Forecast>>(event);
  
  if (!body.product_id || body.predicted_quantity === undefined || !body.forecast_date) {
    throw createError({
      statusCode: 400,
      message: 'Product ID, predicted quantity, and forecast date are required'
    });
  }
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data: forecast, error } = await supabase
      .from('forecasts')
      .insert({
        product_id: body.product_id,
        forecast_date: body.forecast_date,
        predicted_quantity: body.predicted_quantity,
        confidence_level: body.confidence_level || 0.8,
        notes: body.notes || null
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating forecast:', error);
      throw createError({ statusCode: 500, message: 'Failed to create forecast' });
    }
    
    return forecast;
  }
  
  // Development: Use SQLite
  execute(`
    INSERT INTO Forecasts (product_id, forecast_date, predicted_quantity, confidence_level, notes)
    VALUES (?, ?, ?, ?, ?)
  `, [
    body.product_id,
    body.forecast_date,
    body.predicted_quantity,
    body.confidence_level || 0.8,
    body.notes || null
  ]);
  
  const id = getLastInsertId();
  const forecast = queryOne<Forecast>('SELECT * FROM Forecasts WHERE forecast_id = ?', [id]);
  
  return forecast;
});
