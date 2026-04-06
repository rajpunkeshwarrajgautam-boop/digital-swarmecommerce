export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  inStock: boolean;
  rating: number;
  slug?: string;           // Optional: DB-backed products may expose a human-readable slug
  features?: string[];
  specs?: Record<string, string>;
  demoUrl?: string;
  installGuide?: string;
  downloadUrl?: string; 
  scarcityStock?: number;
  isFeatured?: boolean;
  sales?: number;
  merchantId?: string;
  isVerified?: boolean;
  swarmScore?: number;
  aura?: 'RADIATING_ALPHA' | 'VOID_STATIC' | 'NEURAL_LINK_ACTIVE' | 'INDUSTRIAL_GLOW' | 'STABILITY_CORE';
  matchDensity?: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  in_stock: boolean;
  is_visible: boolean;
  is_verified: boolean;
  merchant_id: string;
  rating: number;
  version?: string;
}

export interface AdminOrder {
  id: string;
  created_at: string;
  customer_name: string | null;
  customer_email: string;
  total: number;
  status: string;
  cashfree_order_id?: string;
  order_items: AdminOrderItem[];
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  merchantId: string;
  products?: {
    name: string;
  };
}
