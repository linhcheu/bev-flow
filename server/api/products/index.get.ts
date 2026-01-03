// API endpoint for getting all products
import { queryAll, isProduction, getSupabase } from '~/server/utils/db';
import type { Product, Supplier } from '~/types';

interface ProductRow extends Product {
  supplier_name: string;
}

export default defineEventHandler(async () => {
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        suppliers (
          supplier_id,
          company_name
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      throw createError({ statusCode: 500, message: 'Failed to fetch products' });
    }
    
    return (products || []).map((p: any) => ({
      ...p,
      profit: Number(p.selling_price) - Number(p.cost_price),
      supplier_name: p.suppliers?.company_name || null,
      supplier: p.supplier_id ? {
        supplier_id: p.supplier_id,
        company_name: p.suppliers?.company_name
      } : null
    }));
  }
  
  // Development: Use SQLite
  const products = queryAll<ProductRow>(`
    SELECT 
      p.*,
      s.company_name as supplier_name
    FROM Products p
    LEFT JOIN Suppliers s ON p.supplier_id = s.supplier_id
    WHERE p.is_active = 1
    ORDER BY p.created_at DESC
  `);
  
  // Transform to include supplier object
  return products.map(p => ({
    ...p,
    profit: Number(p.selling_price) - Number(p.cost_price),
    supplier: p.supplier_id ? {
      supplier_id: p.supplier_id,
      company_name: p.supplier_name
    } : null
  }));
});
