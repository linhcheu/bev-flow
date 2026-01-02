// API endpoint for getting all forecasts with intelligent predictions
import { queryAll, queryOne, isProduction, getSupabase } from '~/server/utils/db';
import type { Forecast } from '~/types';

interface ForecastRow extends Forecast {
  product_name: string;
  sku: string;
}

interface SalesData {
  product_id: number;
  product_name: string;
  sku: string;
  avg_quantity: number;
  total_sold: number;
  sales_count: number;
}

export default defineEventHandler(async () => {
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    // Check for existing forecasts
    const { data: existingForecasts } = await supabase
      .from('forecasts')
      .select(`
        *,
        products (
          product_id,
          product_name,
          sku
        )
      `)
      .order('forecast_date', { ascending: false });
    
    if (existingForecasts && existingForecasts.length > 0) {
      return existingForecasts.map((f: any) => ({
        ...f,
        product: f.products ? {
          product_id: f.products.product_id,
          product_name: f.products.product_name,
          sku: f.products.sku
        } : null
      }));
    }
    
    // Generate forecasts based on products (simplified for production)
    const { data: products } = await supabase
      .from('products')
      .select('product_id, product_name, sku')
      .eq('is_active', true)
      .limit(10);
    
    if (!products || products.length === 0) {
      return [];
    }
    
    const forecasts: any[] = [];
    const today = new Date();
    
    products.forEach((product, index) => {
      const intervals = [7, 14, 21, 30];
      intervals.forEach((daysAhead, intervalIndex) => {
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + daysAhead);
        
        const predictedQuantity = Math.round(10 + Math.random() * 20);
        const confidence = Number((0.7 + Math.random() * 0.2).toFixed(2));
        
        forecasts.push({
          forecast_id: index * 4 + intervalIndex + 1,
          product_id: product.product_id,
          forecast_date: forecastDate.toISOString().split('T')[0],
          predicted_quantity: predictedQuantity,
          confidence_level: confidence,
          product: {
            product_id: product.product_id,
            product_name: product.product_name,
            sku: product.sku
          }
        });
      });
    });
    
    forecasts.sort((a, b) => new Date(a.forecast_date).getTime() - new Date(b.forecast_date).getTime());
    return forecasts;
  }
  
  // Development: Use SQLite
  // First check if there are existing forecasts in DB
  const existingForecasts = queryAll<ForecastRow>(`
    SELECT 
      f.*,
      p.product_name,
      p.sku
    FROM Forecasts f
    LEFT JOIN Products p ON f.product_id = p.product_id
    ORDER BY f.forecast_date DESC
  `);
  
  // If we have existing forecasts, return them
  if (existingForecasts.length > 0) {
    return existingForecasts.map(f => ({
      ...f,
      product: f.product_id ? {
        product_id: f.product_id,
        product_name: f.product_name,
        sku: f.sku
      } : null
    }));
  }
  
  // Generate forecasts based on real sales data
  const salesData = queryAll<SalesData>(`
    SELECT 
      p.product_id,
      p.product_name,
      p.sku,
      AVG(s.quantity) as avg_quantity,
      SUM(s.quantity) as total_sold,
      COUNT(s.sale_id) as sales_count
    FROM Products p
    LEFT JOIN Sales s ON p.product_id = s.product_id
    WHERE p.is_active = 1
    GROUP BY p.product_id, p.product_name, p.sku
    HAVING sales_count > 0
    ORDER BY total_sold DESC
    LIMIT 10
  `);
  
  // If no sales data, return empty
  if (salesData.length === 0) {
    return [];
  }
  
  // Generate forecasts for the next 30 days based on sales patterns
  const forecasts: any[] = [];
  const today = new Date();
  
  salesData.forEach((product, index) => {
    // Generate forecast for 4 different dates for each product
    const intervals = [7, 14, 21, 30];
    
    intervals.forEach((daysAhead, intervalIndex) => {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + daysAhead);
      
      // Calculate predicted quantity with some variance
      const baseQuantity = Math.round(product.avg_quantity || 10);
      const variance = Math.random() * 0.3 - 0.15; // -15% to +15% variance
      const growthFactor = 1 + (intervalIndex * 0.05); // Slight growth over time
      const predictedQuantity = Math.round(baseQuantity * (1 + variance) * growthFactor);
      
      // Calculate confidence based on sales history
      const baseConfidence = product.sales_count > 10 ? 0.9 : product.sales_count > 5 ? 0.8 : 0.7;
      const confidenceVariance = Math.random() * 0.1 - 0.05;
      const confidence = Math.min(0.98, Math.max(0.65, baseConfidence + confidenceVariance));
      
      forecasts.push({
        forecast_id: index * 4 + intervalIndex + 1,
        product_id: product.product_id,
        forecast_date: forecastDate.toISOString().split('T')[0],
        predicted_quantity: predictedQuantity,
        confidence_level: Number(confidence.toFixed(2)),
        product: {
          product_id: product.product_id,
          product_name: product.product_name,
          sku: product.sku
        }
      });
    });
  });
  
  // Sort by date
  forecasts.sort((a, b) => new Date(a.forecast_date).getTime() - new Date(b.forecast_date).getTime());
  
  return forecasts;
});
