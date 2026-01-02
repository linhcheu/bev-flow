// API endpoint for deleting a forecast
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Forecast ID is required'
    });
  }
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data: existing } = await supabase
      .from('forecasts')
      .select('forecast_id')
      .eq('forecast_id', id)
      .single();
    
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Forecast not found' });
    }
    
    const { error } = await supabase
      .from('forecasts')
      .delete()
      .eq('forecast_id', id);
    
    if (error) {
      console.error('Error deleting forecast:', error);
      throw createError({ statusCode: 500, message: 'Failed to delete forecast' });
    }
    
    return { success: true, message: 'Forecast deleted successfully' };
  }
  
  // Development: Use SQLite
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
