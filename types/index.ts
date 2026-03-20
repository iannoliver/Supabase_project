export type AppRole = "admin" | "editor";

export type OrderStatus =
  | "pending"
  | "approved"
  | "authorized"
  | "in_process"
  | "in_mediation"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  role: AppRole;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  active: boolean;
  featured: boolean;
  category: string | null;
  stock: number;
  created_at: string;
  updated_at: string;
};

export type ProductFilters = {
  search?: string;
  category?: string;
  status?: "all" | "active" | "inactive";
};

export type DashboardMetrics = {
  totalUsers: number;
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CheckoutFormData = {
  customer_name: string;
  customer_email: string;
  customer_document?: string;
  items: CartItem[];
};

export type Order = {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_document: string | null;
  status: OrderStatus;
  currency: string;
  subtotal: number;
  total: number;
  external_reference: string;
  mercado_pago_preference_id: string | null;
  mercado_pago_payment_id: string | null;
  mercado_pago_merchant_order_id: string | null;
  mercado_pago_status: string | null;
  mercado_pago_status_detail: string | null;
  notes: string | null;
  stock_deducted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_slug: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  created_at: string;
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  error: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
