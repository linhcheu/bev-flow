// API endpoint for deleting a forecast
import { execute, queryOne } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Forecast ID is required'
    });
  }
  
  const existing = queryOne('SELECT forecast_id FROM Forecasts WHERE forecast_id = ?', [id]);
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Forecast not found'
    });
  }
  
  execute('DELETE FROM Forecasts WHERE forecast_id = ?', [id]);
  
  return { success: true, message: 'Forecast deleted successfully' };
});
