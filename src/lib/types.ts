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
  features?: string[];
  specs?: Record<string, string>;
  demoUrl?: string;
  installGuide?: string;
  downloadUrl?: string; // Link to the asset
  scarcityStock?: number;
  isFeatured?: boolean;
  sales?: number;
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
