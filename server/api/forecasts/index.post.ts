// API endpoint for creating a forecast
import { execute, getLastInsertId, queryOne } from '~/server/utils/db';
import type { Forecast } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Forecast>>(event);
  
  if (!body.product_id || body.predicted_quantity === undefined || !body.forecast_date) {
    throw createError({
      statusCode: 400,
      message: 'Product ID, predicted quantity, and forecast date are required'
    });
  }
  
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
