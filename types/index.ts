// Database entity types based on enhanced schema

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
  products?: string;
  contact_person?: string;
  sale_agent?: string;
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
  profit?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  customer_id?: number;
  customer_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
}

export type POStatus = 'Pending' | 'Ordered' | 'Shipped' | 'Received' | 'Cancelled';

export interface PurchaseOrderItem {
  item_id?: number;
  po_id?: number;
  product_id: number;
  product?: Partial<Product> | null;
  quantity: number;
  unit_cost: number;
  amount: number;
  created_at?: string;
}

export interface PurchaseOrder {
  po_id?: number;
  po_number: string;
  supplier_id: number;
  supplier?: Partial<Supplier> | null;
  order_date: string;
  eta_date?: string;
  items?: PurchaseOrderItem[];
  subtotal?: number;
  shipping_rate?: number;
  shipping_cost?: number;
  promotion_percent?: number;
  promotion_amount?: number;
  promotion_text?: string;
  total_amount?: number;
  status: POStatus;
  received_date?: string;
  received_by?: string;
  received_notes?: string;
  truck_remark?: string;
  overall_remark?: string;
  third_party_agent?: string;
  agent_phone?: string;
  agent_email?: string;
  agent_address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Sale {
  sale_id?: number;
  sale_number: string;
  customer_id?: number;
  customer?: Partial<Customer> | null;
  sale_date: string;
  items?: SaleItem[];
  subtotal?: number;
  discount_percent?: number;
  discount_amount?: number;
  total_amount?: number;
  payment_method?: string;
  status?: 'Pending' | 'Completed' | 'Cancelled' | 'Refunded';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SaleItem {
  item_id?: number;
  sale_id?: number;
  product_id: number;
  product?: Partial<Product> | null;
  quantity: number;
  unit_price: number;
  amount: number;
  created_at?: string;
}

export interface PurchaseData {
  id?: number;
  invoice_number?: string;
  supplier_id?: number;
  supplier?: Partial<Supplier> | null;
  purchase_date: string;
  product_id: number;
  product?: Partial<Product> | null;
  rate: number;
  quantity: number;
  cost_amount: number;
  created_at?: string;
}

export interface AnnualOrder {
  id?: number;
  product_id: number;
  product?: Partial<Product> | null;
  year: number;
  jan_qty?: number;
  feb_qty?: number;
  mar_qty?: number;
  apr_qty?: number;
  may_qty?: number;
  jun_qty?: number;
  jul_qty?: number;
  aug_qty?: number;
  sep_qty?: number;
  oct_qty?: number;
  nov_qty?: number;
  dec_qty?: number;
  total?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SaleForecast {
  forecast_id?: number;
  forecast_date: string;
  product_1_qty?: number;
  product_2_qty?: number;
  product_3_qty?: number;
  product_4_qty?: number;
  product_5_qty?: number;
  product_6_qty?: number;
  product_7_qty?: number;
  product_8_qty?: number;
  product_9_qty?: number;
  product_10_qty?: number;
  created_at?: string;
}

export interface Forecast {
  forecast_id?: number;
  product_id: number;
  product?: Partial<Product> | null;
  forecast_date: string;
  predicted_demand: number;
  confidence_score?: number;
  recommended_order?: number;
  notes?: string;
  created_at?: string;
}

export interface Stock {
  stock_id?: number;
  product_id: number;
  product?: Partial<Product> | null;
  opening_stock?: number;
  purchased_qty?: number;
  sold_qty?: number;
  closing_stock?: number;
  stock_date: string;
  created_at?: string;
}

// Dashboard and analytics types
export interface DashboardStats {
  totalProducts: number;
  totalSuppliers: number;
  activePOs: number;
  monthlySales: number;
  monthlyProfit: number;
  totalCustomers?: number;
  lowStockProducts?: number;
}

export interface MonthlyData {
  month: string;
  value: number;
}

export interface ProductSalesData {
  product_name: string;
  total_qty: number;
  total_amount: number;
}

// Form types for creating/editing
export interface PurchaseOrderFormData {
  po_number: string;
  supplier_id: number;
  order_date: string;
  eta_date?: string;
  items: PurchaseOrderItemFormData[];
  promotion_percent?: number;
  promotion_amount?: number;
  promotion_text?: string;
  truck_remark?: string;
  overall_remark?: string;
  third_party_agent?: string;
  agent_phone?: string;
  agent_email?: string;
  agent_address?: string;
}

export interface PurchaseOrderItemFormData {
  product_id: number;
  quantity: number;
  unit_cost: number;
}

export interface SaleFormData {
  sale_number: string;
  customer_id?: number;
  sale_date: string;
  items: SaleItemFormData[];
  discount_percent?: number;
  discount_amount?: number;
  payment_method?: string;
  notes?: string;
}

export interface SaleItemFormData {
  product_id: number;
  quantity: number;
  unit_price: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
