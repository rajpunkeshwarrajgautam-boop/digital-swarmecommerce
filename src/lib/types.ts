export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
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
  sales: number;
}

export interface CartItem extends Product {
  quantity: number;
  originalPrice?: number;
}
