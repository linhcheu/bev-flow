// Database entity types based on schema

export interface Supplier {
  supplier_id?: number;
  company_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  lead_time_days?: number;
}

export interface Product {
  product_id?: number;
  sku?: string;
  product_name: string;
  description?: string;
  cost_price: number;
  selling_price: number;
  supplier_id?: number;
  supplier?: Supplier;
  profit?: number; // Calculated field
}

export type POStatus = 'Pending' | 'Shipped' | 'Received' | 'Cancelled';

export interface PurchaseOrder {
  po_id?: number;
  po_number: string;
  supplier_id?: number;
  supplier?: Supplier;
  order_date: string;
  eta_date?: string;
  status: POStatus;
  truck_remark?: string;
  overall_remark?: string;
  promotion_amount?: number;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  po_item_id?: number;
  po_id?: number;
  product_id?: number;
  product?: Product;
  quantity: number;
  unit_cost: number;
}

export interface Sale {
  sale_id?: number;
  sale_date: string;
  product_id?: number;
  product?: Product;
  quantity_sold: number;
  total_amount: number;
}

export interface SalesForecast {
  forecast_id?: number;
  product_id?: number;
  product?: Product;
  forecast_month: string;
  predicted_quantity: number;
  based_on_months?: string;
}

// Additional utility types
export interface DashboardStats {
  totalProducts: number;
  totalSuppliers: number;
  activePOs: number;
  monthlySales: number;
  monthlyProfit: number;
}
