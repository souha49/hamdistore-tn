export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string | null;
  images: string[];
  sizes: { size: string; stock: number }[];
  stock_quantity: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  size: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface SiteSettings {
  id: string;
  store_name: string;
  logo_url: string | null;
  hero_image_url: string | null;
  section_femme_image_url: string | null;
  section_homme_image_url: string | null;
  section_collection_image_url: string | null;
  primary_color: string;
  secondary_color: string;
  header_style: string;
  products_per_row_desktop: number;
  products_per_row_tablet: number;
  products_per_row_mobile: number;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}
