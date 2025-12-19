// API endpoint for getting all forecasts
import { queryAll } from '~/server/utils/db';
import type { Forecast } from '~/types';

interface ForecastRow extends Forecast {
  product_name: string;
  sku: string;
}

export default defineEventHandler(async () => {
  const forecasts = queryAll<ForecastRow>(`
    SELECT 
      f.*,
      p.product_name,
      p.sku
    FROM Forecasts f
    LEFT JOIN Products p ON f.product_id = p.product_id
    ORDER BY f.forecast_date DESC
  `);
  
  return forecasts.map(f => ({
    ...f,
    product: f.product_id ? {
      product_id: f.product_id,
      product_name: f.product_name,
      sku: f.sku
    } : null
  }));
});
