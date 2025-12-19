// Database entity types based on schema

export interface User {
  user_id?: number;
  username: string;
  email: string;
  password_hash?: string;
  full_name?: string;
  role?: 'admin' | 'manager' | 'user';
  is_active?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Supplier {
  supplier_id?: number;
  company_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  lead_time_days?: number;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  product_id?: number;
  sku?: string;
  product_name: string;
  description?: string;
  cost_price: number;
  selling_price: number;
  supplier_id?: number;
  supplier?: Partial<Supplier> | null;
  min_stock_level?: number;
  current_stock?: number;
  is_active?: number;
  profit?: number; // Calculated field
  created_at?: string;
  updated_at?: string;
}

export type POStatus = 'pending' | 'ordered' | 'shipped' | 'received' | 'cancelled';

export interface PurchaseOrder {
  po_id?: number;
  product_id?: number;
  product?: Partial<Product> | null;
  supplier_id?: number;
  supplier?: Partial<Supplier> | null;
  order_date: string;
  expected_delivery?: string;
  quantity: number;
  unit_cost: number;
  total_amount?: number;
  status: POStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Sale {
  sale_id?: number;
  product_id?: number;
  product?: Partial<Product> | null;
  sale_date: string;
  quantity: number;
  unit_price: number;
  total_amount?: number;
  notes?: string;
  created_at?: string;
}

export interface Forecast {
  forecast_id?: number;
  product_id?: number;
  product?: Partial<Product> | null;
  forecast_date: string;
  predicted_quantity: number;
  confidence_level?: number;
  notes?: string;
  created_at?: string;
}

// Additional utility types
export interface DashboardStats {
  totalProducts: number;
  totalSuppliers: number;
  activePOs: number;
  monthlySales: number;
  monthlyProfit: number;
}
