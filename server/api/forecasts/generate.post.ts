// API endpoint for generating forecasts based on sales history
import { execute, queryAll, getLastInsertId } from '~/server/utils/db';
import type { Forecast } from '~/types';

interface SalesStats {
  product_id: number;
  product_name: string;
  avg_daily_sales: number;
  total_sold: number;
  sales_days: number;
  last_30_days: number;
  prev_30_days: number;
}

interface ProductInfo {
  product_id: number;
  product_name: string;
  current_stock: number;
  min_stock_level: number;
}

export default defineEventHandler(async () => {
  // Clear existing forecasts
  execute('DELETE FROM Forecasts');
  
  // Get all products
  const products = queryAll<ProductInfo>(`
    SELECT product_id, product_name, current_stock, min_stock_level 
    FROM Products 
    WHERE is_active = 1
  `);
  
  // Get sales statistics for each product
  const salesStats = queryAll<SalesStats>(`
    SELECT 
      p.product_id,
      p.product_name,
      COALESCE(AVG(daily_sales.quantity), 0) as avg_daily_sales,
      COALESCE(SUM(s.quantity), 0) as total_sold,
      COUNT(DISTINCT s.sale_date) as sales_days,
      COALESCE(SUM(CASE WHEN s.sale_date >= date('now', '-30 days') THEN s.quantity ELSE 0 END), 0) as last_30_days,
      COALESCE(SUM(CASE WHEN s.sale_date >= date('now', '-60 days') AND s.sale_date < date('now', '-30 days') THEN s.quantity ELSE 0 END), 0) as prev_30_days
    FROM Products p
    LEFT JOIN Sales s ON p.product_id = s.product_id
    LEFT JOIN (
      SELECT product_id, sale_date, SUM(quantity) as quantity
      FROM Sales
      GROUP BY product_id, sale_date
    ) daily_sales ON p.product_id = daily_sales.product_id
    WHERE p.is_active = 1
    GROUP BY p.product_id
  `);
  
  const forecasts: Forecast[] = [];
  
  // Generate 30-day forecasts for each product
  for (const stats of salesStats) {
    const product = products.find(p => p.product_id === stats.product_id);
    if (!product) continue;
    
    // Calculate base forecast
    let baseForecast = stats.avg_daily_sales * 30;
    
    // Apply trend adjustment
    if (stats.prev_30_days > 0) {
      const trend = (stats.last_30_days - stats.prev_30_days) / stats.prev_30_days;
      // Apply trend but limit to +/- 50% adjustment
      baseForecast *= (1 + Math.max(-0.5, Math.min(0.5, trend)));
    }
    
    // Round to nearest integer
    const predictedQuantity = Math.max(Math.round(baseForecast), product.min_stock_level || 0);
    
    // Calculate confidence level based on data quality
    let confidence = 0.75; // Base confidence
    
    // More sales days = higher confidence
    if (stats.sales_days > 300) confidence += 0.15;
    else if (stats.sales_days > 200) confidence += 0.10;
    else if (stats.sales_days > 100) confidence += 0.05;
    
    // Recent sales activity boosts confidence
    if (stats.last_30_days > 0) confidence += 0.05;
    
    // Cap at 95%
    confidence = Math.min(confidence, 0.95);
    
    // Set forecast date as 30 days from now
    const forecastDate = new Date();
    forecastDate.setDate(forecastDate.getDate() + 30);
    
    // Generate note
    let notes = `Based on ${stats.sales_days} days of sales history. `;
    if (stats.prev_30_days > 0 && stats.last_30_days !== stats.prev_30_days) {
      const change = ((stats.last_30_days - stats.prev_30_days) / stats.prev_30_days * 100).toFixed(1);
      notes += `${parseFloat(change) >= 0 ? '+' : ''}${change}% sales trend.`;
    }
    
    // Insert forecast
    execute(`
      INSERT INTO Forecasts (product_id, forecast_date, predicted_quantity, confidence_level, notes)
      VALUES (?, ?, ?, ?, ?)
    `, [
      stats.product_id,
      forecastDate.toISOString().split('T')[0],
      predictedQuantity,
      confidence,
      notes.trim()
    ]);
    
    const forecastId = getLastInsertId();
    
    forecasts.push({
      forecast_id: forecastId as number,
      product_id: stats.product_id,
      forecast_date: forecastDate.toISOString().split('T')[0],
      predicted_quantity: predictedQuantity,
      confidence_level: confidence,
      notes: notes.trim(),
      product: {
        product_id: stats.product_id,
        product_name: stats.product_name
      }
    });
  }
  
  return {
    message: `Generated ${forecasts.length} forecasts based on sales history`,
    forecasts
  };
});
